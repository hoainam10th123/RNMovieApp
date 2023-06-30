using Quartz.Spi;
using Quartz;
using Quartz.Impl;
using MovieAI.Helper;
using MovieAI.Jobs;
using MovieAI.Entities;

namespace MovieAI.Services
{
    public interface IBackgroundService
    {
        Task StartAsync(string typeJob, string username = "", int userid = 0);
        Task StopAsync();
    }
    public class BackgroundService : IBackgroundService
    {
        private IScheduler? _scheduler;
        private readonly IJobFactory _jobFactory;

        public BackgroundService(IJobFactory jobFactory)
        {
            _jobFactory = jobFactory;
        }

        public async Task StartAsync(string typeJob, string username = "", int userid = 0)
        {
            StdSchedulerFactory factory = new StdSchedulerFactory();
            _scheduler = await factory.GetScheduler();
            _scheduler.JobFactory = _jobFactory;

            switch (typeJob)
            {
                case Utilities.SEED_DATA_MOVIES:
                    await _scheduler.ScheduleJob(CreateJobSeedDataMovies(), CreateTrigger(typeJob));
                    await _scheduler.Start();
                    break;
                case Utilities.BUILD_TRAINING_MODEL:
                    await _scheduler.ScheduleJob(CreateJobBuildAndTraining(), CreateTrigger(typeJob));
                    await _scheduler.Start();
                    break;
                case Utilities.PRIDICTION_MODEL:
                    await _scheduler.ScheduleJob(CreateJobPridictionMovies(username, userid), CreateTrigger(typeJob));
                    await _scheduler.Start();
                    break;
            }            
        }


        private IJobDetail CreateJobSeedDataMovies()
        {
            return JobBuilder
                .Create<SyncDataJob>()
                .WithIdentity("SEED_DATA_MOVIES")
                .WithDescription("SEED_DATA_MOVIES")
                .UsingJobData("type", Utilities.SEED_DATA_MOVIES)
                .Build();
        }

        private IJobDetail CreateJobBuildAndTraining()
        {
            return JobBuilder
                    .Create<SyncDataJob>()
                    .WithIdentity("BUILD_TRAINING_MODEL")
                    .WithDescription("BUILD_TRAINING_MODEL")
                    .UsingJobData("type", Utilities.BUILD_TRAINING_MODEL)
                    .Build();
        }

        private IJobDetail CreateJobPridictionMovies(string username, int userid)
        {
            return JobBuilder
                .Create<PredictAiJob>()
                .WithIdentity("RunAIJob")
                .WithDescription("RunAIJob")
                .UsingJobData("username", username)
                .UsingJobData("userid", userid)
                .Build();
        }

        private ITrigger CreateTrigger(string typeJob)
        {
            ITrigger? trigger = null;
            switch (typeJob)
            {
                case Utilities.SEED_DATA_MOVIES:
                trigger = TriggerBuilder
                .Create()
                .WithIdentity("Trigger1")
                .StartNow()
                .WithDescription("AsyncDataJob")
                .Build();
                    break;

                case Utilities.BUILD_TRAINING_MODEL:
                    trigger = TriggerBuilder
                .Create()
                .WithIdentity("BUILD_TRAINING_MODEL")
                .StartNow()
                .WithDescription("BUILD_TRAINING_MODEL1")
                .Build();
                    break;

                case Utilities.PRIDICTION_MODEL:
                trigger = TriggerBuilder
                .Create()
                .WithIdentity("Trigger2")
                .StartNow()
                .WithDescription("RunAIJob")
                .Build();
                    break;
            }
            return trigger!;
        }

        public async Task StopAsync()
        {
            await _scheduler!.Shutdown();
        }
    }
}
