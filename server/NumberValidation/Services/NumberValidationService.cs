namespace NumberValidation.Services
{
    public class NumberValidationService : INumberValidationService
    {
        public bool IsDivisibleByFive(int number)
        {
            return number % 5 == 0;
        }
    }
}
