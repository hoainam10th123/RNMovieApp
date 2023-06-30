using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using MovieAI.Data;
using MovieAI.Entities;
using MovieAI.Helper;

namespace MovieAI.Repositories
{
    public interface IMoviesRepository
    {
        void BulkInsert(List<Movie> movies);
        Task<List<Movie>> GetAllMovies();
        void BulkInsertMovieRating(List<MovieRating> movies);
        Task<Pagination<Movie>> GetPagiantedMovies(int pageNumber);
    }
    public class MoviesRepository : IMoviesRepository
    {
        private readonly DataContext _context;
        public MoviesRepository(DataContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Bulk Insert Movies
        /// </summary>
        /// <param name="movies"></param>
        public void BulkInsert(List<Movie> movies)
        {
            _context.BulkInsert(movies);
        }

        public void BulkInsertMovieRating(List<MovieRating> movies)
        {
            _context.BulkInsert(movies);
        }

        public async Task<List<Movie>> GetAllMovies()
        {
            return await _context.Movies.ToListAsync();
        }

        /// <summary>
        /// mac dinh lay 100 phan tu
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <returns></returns>
        public async Task<Pagination<Movie>> GetPagiantedMovies(int pageNumber)
        {
            const int pageSize = 100;
            var datTemp = await _context.Movies.ToListAsync();
            var list = await _context.Movies
                .Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            return new Pagination<Movie>(pageNumber, pageSize, datTemp.Count, list);
        }
    }
}
