using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace EmployeeBackend.Helpers
{
    public class CustomUserId
    {
        public class CustomUserIdProvider : IUserIdProvider
        {
         

            public string? GetUserId(HubConnectionContext connection)
            {
                var userId = connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                Console.WriteLine($"CustomUserIdProvider: UserId = {userId}");
                return userId;
            }
        }

    }
}
