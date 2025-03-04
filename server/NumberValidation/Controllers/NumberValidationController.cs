using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NumberValidation.Models;
using NumberValidation.Services;
using System;

namespace NumberValidation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NumberValidationController : ControllerBase
    {
        private readonly INumberValidationService _numberService;

        public NumberValidationController(INumberValidationService numberService)
        {
            _numberService = numberService;
        }

        [HttpPost("check")]
        [EnableRateLimiting("ApiLimit")]
        public IActionResult CheckNumber([FromBody] NumberRequest request)
        {
            try
            {
                var validationResult = ValidateRequest(request);
                if (validationResult != null)
                    return validationResult;

                int number = int.Parse(request.Value);
                bool isDivisibleByFive = _numberService.IsDivisibleByFive(number);

                return Ok(new NumberResponse
                {
                    IsDivisibleByFive = isDivisibleByFive,
                    IsRateLimited = false,
                    Message = isDivisibleByFive ? "Number is divisible by 5." : "Number is not divisible by 5."
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new NumberResponse
                {
                    Message = "An error occurred while processing your request."
                });
            }
        }

        private IActionResult ValidateRequest(NumberRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Value))
            {
                return BadRequest(new NumberResponse
                {
                    Message = "Number value cannot be empty."
                });
            }

            if (!int.TryParse(request.Value, out int number))
            {
                return BadRequest(new NumberResponse
                {
                    Message = "Invalid number format."
                });
            }

            if (number < 0 || number > 10000)
            {
                return BadRequest(new NumberResponse
                {
                    Message = "Number must be between 0 and 10000."
                });
            }

            return null;
        }
    }
}