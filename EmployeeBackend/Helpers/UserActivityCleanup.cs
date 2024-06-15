namespace EmployeeBackend.Helpers
{
    public class UserActivityCleanup:BackgroundService
    {

        private readonly ILogger<UserActivityCleanup> _logger;

        public UserActivityCleanup(ILogger<UserActivityCleanup> logger)
        {
            _logger = logger;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                foreach (var entry in UserActivityTracker.GetAllEntries())
                {
                    if (entry.Value < DateTime.UtcNow.AddMinutes(-5))
                    {
                        UserActivityTracker.RemoveUser(entry.Key);
                        _logger.LogInformation($"Removed inactive user ID: {entry.Key}.");
                    }
                }
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
