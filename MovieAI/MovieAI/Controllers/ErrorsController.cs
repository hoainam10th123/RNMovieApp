using Microsoft.AspNetCore.Mvc;
using MovieAI.Dtos;
using MovieAI.Errors;

namespace MovieAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorsController : ControllerBase
    {

        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound(new ApiResponse(404, "not-found"));
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400, "Bad request"));
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            throw new Exception("This is a server error");
        }

        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorised()
        {
            return Unauthorized(new ApiResponse(401, "Unauthorised"));
        }

        [HttpPost("validation-error")]
        public ActionResult GetValidationError(ValidationErr err)
        {
            return Ok();
        }
    }
}
