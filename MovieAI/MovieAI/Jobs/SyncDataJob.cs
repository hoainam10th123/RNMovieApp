using MovieAI.Helper;
using MovieAI.Services;
using Quartz;

namespace MovieAI.Jobs
{
    public class SyncDataJob : IJob
    {
        private readonly ILogger<SyncDataJob> _logger;
        private readonly ISyncDataService _syncDataService;
        private readonly IRecommendationEngine _recommendationEngine;

        public SyncDataJob(ILogger<SyncDataJob> logger, ISyncDataService syncDataService, IRecommendationEngine recommendationEngine)
        {
            _logger = logger;
            _syncDataService = syncDataService;
            _recommendationEngine = recommendationEngine;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var type = context.MergedJobDataMap.GetString("type");
            switch (type)
            {
                case Utilities.BUILD_TRAINING_MODEL:
                    _recommendationEngine.BuildAndTrainModel();
                    _logger.LogInformation("BuildAndTrainModel job run thanh cong");
                    break;
                default:
                    await _syncDataService.SeedDataMovies();
                    _logger.LogInformation("SeedDataMovies job run thanh cong");
                    break;
            }            
        }
    }
}
