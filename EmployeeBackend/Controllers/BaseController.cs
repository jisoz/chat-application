using EmployeeBackend.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeBackend.Controllers
{

    [ServiceFilter(typeof(LogUserActivity))]
    public class BaseController:ControllerBase
    {
        protected int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        protected string GetUsername()
        {
            return User.FindFirst(ClaimTypes.Name).Value;
        }
    }
    }

