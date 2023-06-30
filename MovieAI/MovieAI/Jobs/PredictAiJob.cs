using Microsoft.AspNetCore.SignalR;
using MovieAI.Data;
using MovieAI.Entities;
using MovieAI.Services;
using MovieAI.SignalR;
using Quartz;

namespace MovieAI.Jobs
{
    public class PredictAiJob : IJob
    {
        private readonly ILogger<PredictAiJob> _logger;
        private readonly IRecommendationEngine _recommendationEngine;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;
        private readonly IUnitOfWork _unitOfWork;

        public PredictAiJob(ILogger<PredictAiJob> logger, 
            IRecommendationEngine recommendationEngine, 
            PresenceTracker presenceTracker, 
            IHubContext<PresenceHub> presenceHub, IUnitOfWork unitOfWork)
        {
            _logger = logger;
            _recommendationEngine = recommendationEngine;
            _presenceTracker = presenceTracker;
            _presenceHub = presenceHub;
            _unitOfWork = unitOfWork;
        }


        public async Task Execute(IJobExecutionContext context)
        {
            int pageNumber = 1; var isFinish = false;
            var userName = context.MergedJobDataMap.GetString("username");
            var userId = context.MergedJobDataMap.GetInt("userid");
            var listMovie = new List<Movie>();            

            while (!isFinish)
            {
                var data = await _unitOfWork.MoviesRepository.GetPagiantedMovies(pageNumber);
                foreach (var movie in data.Data)
                {
                    var movieTemp = _recommendationEngine.Prediction(movie, userId);
                    if (movieTemp != null)
                    {
                        listMovie.Add(movieTemp);
                        if (listMovie.Count == 20)
                        {
                            isFinish = true;
                            break;                            
                        }
                    }
                }
                if(pageNumber == data.TotalPages) break; else pageNumber += 1;
            }
            
            var connections = await _presenceTracker.GetConnectionsForUser(userName!);
            if(connections != null)
            {
                await _presenceHub.Clients.Clients(connections).SendAsync("OnReceiveMovies", listMovie);
                _logger.LogInformation("Job recommendation service chay thanh cong");
            }            
        }
    }
}
