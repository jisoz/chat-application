using AutoMapper;
using EmployeeBackend.Dto.Req;
using EmployeeBackend.Dto.Res;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace EmployeeBackend.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : BaseController
    {

        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        public MessageController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;

        }


        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createmessagedto)
        {
            var username=GetUsername();
            if(username == createmessagedto.RecipientUsername.ToLower())
            {
                return BadRequest("You cannot send messages to yourself");
            }

            var sender=await uow.UserRepository.GetUserByFullname(username);
            var recepient = await uow.UserRepository.GetUserByFullname(createmessagedto.RecipientUsername);

            if (recepient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recepient,
                SenderUsername=sender.Name,
                RecipientUsername=recepient.Name,
                Content=createmessagedto.Content
                

            };

             uow.MessageRepository.AddMessage(message);

            if (await uow.SaveAsync()) return Ok(mapper.Map<MessageDto>(message));


            return BadRequest("Failed To Send Message");


        }
            
            

    }
}
