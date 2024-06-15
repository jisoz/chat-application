namespace EmployeeBackend.Extensions
{
    public class DatetimeExtension
    {

        public static int CalculateAge( DateTime dob)
        {
            var today= DateTime.Today;
            var age = today.Year - dob.Year;
            if(dob.Date > today.AddYears(-age))
            {
                age--;
            }
            return age;
        }
    }
}
