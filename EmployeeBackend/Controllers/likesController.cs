using EmployeeBackend.Dto.Req;
using EmployeeBackend.Helpers;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeBackend.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class likesController:BaseController
    {

        private readonly IUnitOfWork uow;
        private readonly IHubContext<NotifcationHub> _notificationHubContext;
        private readonly ILogger<likesController> _logger;
        public likesController(IUnitOfWork uow, IHubContext<NotifcationHub> _notificationHubContext, ILogger<likesController> _logger) { 
        
        this.uow = uow;
         this._notificationHubContext = _notificationHubContext;
            this._logger = _logger;

        }

        [HttpPost("{username}")]
        public async Task<IActionResult> AddLike(string username)
        {
            var sourceuserid=GetUserId();
            var likedUser = await uow.UserRepository.GetUserByFullname(username);
            var sourceUser = await uow.likeRepository.GetUserWithLikes(sourceuserid);
            if (likedUser == null) return NotFound();
            if(sourceUser.Name ==username) return BadRequest("You Cannot Like yourself");

            var userlike = await uow.likeRepository.GetUserLike(sourceuserid, likedUser.Id);
            if (userlike != null) return BadRequest(("you already liked this user"));

            userlike = new UserLike
            {
                SourceUserId = sourceuserid,
                LikedUserId = likedUser.Id,
            };
            sourceUser.LikedUsers.Add(userlike);
            if (await uow.SaveAsync()) return Ok();






            return BadRequest("Failed to like user");


        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes(string predicate)
        {
            var users = await uow.likeRepository.GetUserLikes(predicate, GetUserId());
            return Ok(users);
        }





    }
}
