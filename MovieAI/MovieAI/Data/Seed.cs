using Microsoft.EntityFrameworkCore;
using MovieAI.Entities;
using MovieAI.Helper;

namespace MovieAI.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (!await context.Users.AnyAsync())
            {
                var users = new List<User>
                {
                    new User{
                        Name = "Nguyen Van A",
                        UserName = "nguyenvana",
                        PasswordHash = Utilities.CreateMd5PasswordHash("123456@")
                    },
                    new User{
                        Name = "Nguyen Van B",
                        UserName = "nguyenvanb",
                        PasswordHash = Utilities.CreateMd5PasswordHash("123456@")
                    },
                    new User{
                        Name = "Nguyen Tan An",
                        UserName = "tananlx",
                        PasswordHash = Utilities.CreateMd5PasswordHash("123456@")
                    },
                    new User{
                        Name = "Nguyen Hai Dang",
                        UserName = "haidangagu",
                        PasswordHash = Utilities.CreateMd5PasswordHash("123456@")
                    }
                };

                context.Users.AddRange(users);
                await context.SaveChangesAsync();
            }
        }
    }
}
