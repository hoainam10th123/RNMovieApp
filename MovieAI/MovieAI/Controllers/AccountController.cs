using Microsoft.AspNetCore.Mvc;
using MovieAI.Data;
using MovieAI.Dtos;
using MovieAI.Errors;
using MovieAI.Helper;
using MovieAI.Services;

namespace MovieAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;

        public AccountController(ITokenService tokenService, IUnitOfWork unitOfWork)
        {
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsername(loginDto.Username.ToLower());
            if (user == null)
                return BadRequest(new ApiResponse(400, "Invalid Username"));

            var passwordhash = Utilities.CreateMd5PasswordHash(loginDto.Password);

            if (user.PasswordHash != passwordhash)
                return BadRequest(new ApiResponse(400, "Invalid password"));

            return Ok(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                DisplayName = user.Name,
                Token = await _tokenService.CreateTokenAsync(user)
            });
        }
    }
}
