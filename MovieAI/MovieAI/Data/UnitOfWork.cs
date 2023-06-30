using AutoMapper;
using MovieAI.Repositories;

namespace MovieAI.Data
{
    public interface IUnitOfWork : IDisposable
    {
        Task<bool> Complete();
        bool HasChanges();
        IUserRepository UserRepository { get; }
        IMoviesRepository MoviesRepository { get; }
    }
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IUserRepository UserRepository => new UserRepository(_context);
        public IMoviesRepository MoviesRepository => new MoviesRepository(_context);

        public void Dispose()
        {
            _context.Dispose();
        }
        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}
