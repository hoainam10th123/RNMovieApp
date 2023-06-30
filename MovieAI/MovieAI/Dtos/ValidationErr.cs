using System.ComponentModel.DataAnnotations;

namespace MovieAI.Dtos
{
    public class ValidationErr
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
