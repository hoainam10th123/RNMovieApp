using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.ML;
using MovieAI.Data;
using MovieAI.DataStructures;
using MovieAI.Extensions;
using MovieAI.Jobs;
using MovieAI.Middleware;
using MovieAI.Services;
using MovieAI.SignalR;
using Quartz;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddSignalR();
builder.Services.AddHttpClient();
// Register the PredictionEnginePool as a service in the IoC container for DI
builder.Services.AddPredictionEnginePool<MovieRating, MovieRatingPrediction>()
        .FromFile(builder.Configuration["MLModel:MLModelFilePath"]);

builder.Services.AddScoped<IBackgroundService, MovieAI.Services.BackgroundService>();
//configure quartz
builder.Services.Configure<QuartzOptions>(builder.Configuration.GetSection("Quartz"));
builder.Services.AddTransient<SyncDataJob>();
builder.Services.AddTransient<PredictAiJob>();
builder.Services.AddQuartz(q =>
{
    // handy when part of cluster or you want to otherwise identify multiple schedulers
    q.SchedulerId = "Scheduler-Core";
    // as of 3.3.2 this also injects scoped services (like EF DbContext) without problems
    q.UseMicrosoftDependencyInjectionJobFactory();
    // these are the defaults
    q.UseSimpleTypeLoader();
    q.UseInMemoryStore();
    q.UseDefaultThreadPool(tp =>
    {
        tp.MaxConcurrency = 10;
    });
});

// Quartz.Extensions.Hosting hosting
builder.Services.AddQuartzHostedService(options =>
{
    // when shutting down we want jobs to complete gracefully
    options.WaitForJobsToComplete = true;
});

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        await context.Database.MigrateAsync();
        await Seed.SeedUsers(context);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred during migration");
    }
}

app.MapHub<PresenceHub>("hubs/presence");
app.Run();
