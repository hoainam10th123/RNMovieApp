using Microsoft.EntityFrameworkCore;
using MovieAI.Data;
using MovieAI.Entities;

namespace MovieAI.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByUsername(string username);
    }
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context) 
        {
            _context = context;
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(x=>x.UserName == username);
        }
    }
}
