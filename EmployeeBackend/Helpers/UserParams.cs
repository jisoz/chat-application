namespace EmployeeBackend.Helpers
{
    public class UserParams
    {
        public const int MaxPagedSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _PageSize=10;

        public int PageSize
        {
            get => _PageSize;
            set=> _PageSize = (value>MaxPagedSize) ? MaxPagedSize : value;

        }

        public string? CurentUsername { get; set; }

        public string Gender { get; set; }

        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 100;

        public string? OrderBy { get; set; } = "LastActive";

    }
}
