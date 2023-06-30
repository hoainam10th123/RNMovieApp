using MovieAI.Data;
using MovieAI.Dtos;
using MovieAI.Entities;
using MovieAI.Helper;

namespace MovieAI.Services
{
    public interface ISyncDataService
    {
        Task SeedDataMovies();
        Task<bool> SeedDataTraining();
    }
    public class SyncDataService : ISyncDataService
    {
        private readonly ILogger<SyncDataService> _logger;
        private readonly HttpClient _httpClient;
        private readonly IUnitOfWork _unitOfWork;
        public SyncDataService(HttpClient httpClient, ILogger<SyncDataService> logger, IUnitOfWork unitOfWork)
        {
            _httpClient = httpClient;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Only run one, chay qua job, vi cai nay call api mat thoi gian xu ly
        /// </summary>
        /// <returns></returns>
        public async Task SeedDataMovies()
        {
            const int maxPage = 300;       
            var listMovie = new List<Movie>();        

            for (var iPage = 1; iPage <= maxPage; iPage++)
            {
                var res = await _httpClient.GetAsync($"https://api.themoviedb.org/3/movie/popular?api_key=7fdafc43e8f6925ad7c272bae92aebc9&language=en-US&page={iPage}");
                if(res.IsSuccessStatusCode)
                {
                    var resData = await res.Content.ReadFromJsonAsync<PopularMovies>();
                    listMovie.AddRange(resData!.Results);
                }
            }

            //starting seed data into database
            _unitOfWork.MoviesRepository.BulkInsert(listMovie);
            if(await _unitOfWork.Complete())
            {
                _logger.LogInformation("SyncDataService : BulkInsert movies success!");
            }
            else
            {
                _logger.LogError("SyncDataService : BulkInsert movies error!");
            }
        }

        /// <summary>
        /// Only run one, de call api truc tiep
        /// </summary>
        /// <returns></returns>
        public async Task<bool> SeedDataTraining()
        {
            var dataList = new List<MovieRating>();
            var data = await _unitOfWork.MoviesRepository.GetAllMovies();
            foreach (var movie in data)
            {
                // user id = 1
                var dataTrainUser1 = new MovieRating
                {
                    UserId = 1,
                    MovieId = movie.Id,
                    Rating = Utilities.NextFloat()
                };

                //user id = 2
                var dataTrainUser2 = new MovieRating
                {
                    UserId = 2,
                    MovieId = movie.Id,
                    Rating = Utilities.NextFloat()
                };

                //user id = 3
                var dataTrainUser3 = new MovieRating
                {
                    UserId = 3,
                    MovieId = movie.Id,
                    Rating = Utilities.NextFloat()
                };

                dataList.Add(dataTrainUser1);
                dataList.Add(dataTrainUser2);
                dataList.Add(dataTrainUser3);
            }

            _unitOfWork.MoviesRepository.BulkInsertMovieRating(dataList);
            if(await _unitOfWork.Complete())
            {
                _logger.LogInformation("SyncDataService : BulkInsert movies rating success!");
                return true;
            }
            return false;
        }
    }
}
