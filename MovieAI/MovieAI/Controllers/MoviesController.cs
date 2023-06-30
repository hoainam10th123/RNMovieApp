using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieAI.Extensions;
using MovieAI.Helper;
using MovieAI.Services;

namespace MovieAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ISyncDataService _syncDataService;
        private readonly IBackgroundService _backgroundService;

        public MoviesController(ISyncDataService syncDataService, IBackgroundService backgroundService) 
        {
            _syncDataService = syncDataService;
            _backgroundService = backgroundService;
        }

        [HttpGet("seed-data-movies")]// chay cai api nay truoc 1
        public async Task<IActionResult> SeedDataMovies()
        {
            await _backgroundService.StartAsync(Utilities.SEED_DATA_MOVIES);
            return NoContent();
        }

        [HttpGet("seed-data-training")] // chay cai api nay sau 2
        public async Task<IActionResult> SeedDataTraining()
        {
            var result = await _syncDataService.SeedDataTraining();
            return Ok(new { result });
        }
        
        [HttpGet("build-training-model")] // chay cai api nay thu 3
        public async Task<IActionResult> BuildAndTraining()
        {
            await _backgroundService.StartAsync(Utilities.BUILD_TRAINING_MODEL);
            return NoContent();
        }

        [Authorize]
        [HttpGet("pridiction-movies")]
        public async Task<IActionResult> PridictionMovies()
        {            
            await _backgroundService.StartAsync(Utilities.PRIDICTION_MODEL, User.GetUsername(), User.GetUserId());
            return NoContent();
        }
    }
}
