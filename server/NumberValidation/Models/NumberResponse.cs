namespace NumberValidation.Models
{
    public class NumberResponse
    {
        public bool? IsDivisibleByFive { get; set; }
        public bool IsRateLimited { get; set; }
        public DateTime? NextAvailableTime { get; set; }
        public string Message { get; set; }
    }
}
