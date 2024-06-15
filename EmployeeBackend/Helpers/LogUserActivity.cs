using EmployeeBackend.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace EmployeeBackend.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly ILogger<LogUserActivity> _logger;

        public LogUserActivity(ILogger<LogUserActivity> logger)
        {
            _logger = logger;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var iduser= int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
          
            var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
            var User =  await unitOfWork.UserRepository.FindUserByID(iduser);
           User.LastActive= DateTime.Now;
            UserActivityTracker.UpdateUserActivity(iduser);
             await unitOfWork.SaveAsync();
            _logger.LogInformation($"Updated last active time for User ID: {iduser}.");

        }
    }
}
