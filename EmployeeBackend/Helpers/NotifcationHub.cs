using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeBackend.Helpers
{
    public class NotifcationHub :Hub
    {
       
        public async Task SendNotification(string userId, string message)
    {
        var userConnection = Context.UserIdentifier;
        if (userConnection != null)
        {
            Console.WriteLine($"Sending message to user with ID: {userId}");
            await Clients.User(userId).SendAsync("ReceiveNotification", message);
        }
        else
        {
            Console.WriteLine($"User with ID: {userId} not found");
        }
    }


    }
}
