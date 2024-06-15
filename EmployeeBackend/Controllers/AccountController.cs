using EmployeeBackend.Dto;
using EmployeeBackend.Dto.Req;
using EmployeeBackend.Dto.Res;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EmployeeBackend.Helpers;
using Microsoft.OpenApi.Validations;
using AutoMapper;
using System.Text.Json.Serialization;

namespace EmployeeBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController:BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IConfiguration configuration;
        private readonly Email email;
        private readonly IMapper mapper;
        public AccountController(IUnitOfWork uow, IConfiguration configuration,Email email, IMapper mapper)
        {
            this.uow = uow;
            this.configuration = configuration;
            this.email = email;
            this.mapper = mapper;
        }
        


        [HttpPost("Login")]
        public async Task<IActionResult> login(AccountBaseDto loginreq)
        {
            var  user = await uow.UserRepository.Signin(loginreq);
            if (user == null)
            {
                return BadRequest("Invalid Email or Password");
            }

            
            if( await uow.UserRepository.isEmailConfirmed(user) == false)
            {
                return BadRequest("Email not confirmed");
            }
            
            var loginRes = new LoginResDto();
            loginRes.Name = user.Name;
            loginRes.Token = CreateJWT(user);
            loginRes.PhotoUrl = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url;
            loginRes.Gender = user.Gender;
            return Ok(loginRes);

           
        }
        private string CreateJWT(ApplicationUser user)
        {
            var secretkey = configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretkey));

            var claims = new Claim[] {
                new Claim(ClaimTypes.Name,user.Name),
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString())
            };

            var signingCredentials = new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(10),
                SigningCredentials = signingCredentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("Register")]
       
        public async Task<IActionResult> Register(RegisterDto Registerreq)
        {

            if (await uow.UserRepository.UserAlreadyExist(Registerreq.Email))
            {
                return BadRequest("User already Exist , please try Something else");
            }

            var user = uow.UserRepository.CreateUser(Registerreq);
           
            //create emailconfirmationtoken for the user 

            var token = CreateJWT(user.Result);
            user.Result.VerificationToken=token;
            // add user photo 

            if (Registerreq.File != null)
            {
                using (var stream = Registerreq.File.OpenReadStream())
                {
                    var result = await uow.PhotoService.UploadImageAsync(stream, Registerreq.File.FileName);
                    var photo = new Photo
                    {
                        Url = result.Url,
                        IsMain = true,
                        PublicId = result.FileId
                    };
                    user.Result.Photos.Add(photo);
                }
            }
           



            await uow.SaveAsync();

            email.SendEmail(user.Result,token);
          
            return Ok(user);
        }
        
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePass(ChngPasswordDto chng)
        {
            var userid = GetUserId();
            var user = await uow.UserRepository.FindUserByID(userid);
           
            if (!BCrypt.Net.BCrypt.Verify(chng.OldPassword, user.Password))
            {
                return BadRequest("old password Not Correct");
            }

            var newpasswordhash = BCrypt.Net.BCrypt.HashPassword(chng.NewPassword);

            user.Password = newpasswordhash;

            await uow.SaveAsync();

            return Ok("Password changed successfully");
        }

        [HttpGet("confirm-email")]
        [Authorize]
        public IActionResult ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
        {
            var userid = int.Parse(userId);
            if(uow.UserRepository.isEmailVerified(userid, token))
            {
                var user = uow.UserRepository.FindUserByID(userid);
                user.Result.isConfirmedEmail = true;
                uow.SaveAsync();
                return Ok("Email Verified");
            }

            return BadRequest("Email not Verified");
           
        }

        [HttpPost("Resend-email")]
        public async Task<IActionResult> ResendEmail(string email)
        {

            var user=await uow.UserRepository.FindUserByEmail(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.isConfirmedEmail)
            {
                return BadRequest("Email already verified.");
            }
          
                var token = CreateJWT(user);
                user.VerificationToken = token;


                this.email.SendEmail(user, token);
                await uow.SaveAsync();
                return Ok(user);
            
          

        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotpassDto email)
        {
            var user = await uow.UserRepository.FindUserByEmail(email.email);
            if (user == null)
            {
                return BadRequest("Email Not Found");
            }
                
            var token= CreateJWT(user);
            user.ResetPasswordToken = token;
            await uow.SaveAsync();
            this.email.SendEmailReset(user, token);
           
            return Ok(token.ToString());
        }

        [HttpGet("confirm-passwordreset")]
        [Authorize]
        public async Task<IActionResult> ResetPasswordverifytoken([FromQuery] string userId, [FromQuery] string token)
        {
            var userid = int.Parse(userId);
           
            if (await uow.UserRepository.isEmailVerifiedForPasswordReset(userid, token))
            {
                return Ok("Email Verified");
            }
            else
            {
                return BadRequest("Email Not Verified");
            }

            
          

        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromQuery] string userId, ResetPasswordDto reset)
        {
            var id = int.Parse(userId);
            var user = await uow.UserRepository.FindUserByID(id);

            var newpasswordhash = BCrypt.Net.BCrypt.HashPassword(reset.NewPassword);


            if (user.PasswordHistory.Any(p => BCrypt.Net.BCrypt.Verify(reset.NewPassword, p)))
            {
                return BadRequest("Use a new password that has not been used before");
            }

            user.PasswordHistory.Add(newpasswordhash);

       
            user.Password = newpasswordhash;

            await uow.SaveAsync();
            return Ok("Password changed successfully");
        }


        [HttpGet("Members/{name}")]
        [Authorize]
        public async Task<ActionResult<MemberDto>> GetUsers(string name)
        {
            var user= await uow.UserRepository.GetUser(name);
            var usedrstoreturn=mapper.Map<MemberDto>(user);
            return Ok(usedrstoreturn);
            
        }

        [HttpGet("Member/{fullname}",Name ="GetUser")]
        [Authorize] 
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserByname(string fullname)
        {
            var user = await uow.UserRepository.GetUserByFullname(fullname);
            var usedrstoreturn = mapper.Map<MemberDto>(user);
            return Ok(usedrstoreturn);

        }

        [HttpGet("Members")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userparm)
        {

            var user = await uow.UserRepository.GetUserByFullname(GetUsername());
            userparm.CurentUsername = user.Name;
            if (string.IsNullOrEmpty(userparm.Gender))
            {
                userparm.Gender = user.Gender == "male" ? "female" : "male";
            }
            var users = await uow.UserRepository.GetUsersAsync(userparm);
            var usedrstoreturn = mapper.Map<IEnumerable<MemberDto>>(users);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(usedrstoreturn);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memebrupdate)
        {
            var username = GetUsername();
            var user = await uow.UserRepository.GetUserByFullname(username);
            mapper.Map(memebrupdate, user);
            uow.UserRepository.Update(user);
            if (await uow.SaveAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to Update");
            

        }
        //[HttpGet("whoami")]
        //public async Task<ActionResult> getuser()
        //{
        //    var username = GetUsername();

        //    var res = uow.UserRepository.testwhoistheuser(username);

        //    return Ok(res);
        //}
        [HttpPost("update-activity")]
        public IActionResult UpdateActivity(int userId)
        {
            UserActivityTracker.UpdateUserActivity(userId);
            return Ok();
        }

        [HttpGet("is-online/{userId}")]
        public IActionResult IsUserOnline(int userId)
        {
            bool isOnline = UserActivityTracker.IsUserOnline(userId);
            return Ok(new { userId, isOnline });
        }
    }

    

   


}
