using EmployeeBackend.Dto;
using EmployeeBackend.Dto.Req;
using EmployeeBackend.Dto.Res;
using EmployeeBackend.Helpers;
using EmployeeBackend.Interfaces;

using EmployeeBackend.Models;
using EmployeeBackend.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;

namespace EmployeeBackend.Data.Repo
{
    public class UserRepository : IUserRepository
    {

        private readonly AppDbContext dc;
      
        public UserRepository(AppDbContext dc ) {

            this.dc = dc;
          
        }



        //public async Task<ApplicationUser> CreateUser(RegisterDto user)
        //{
        //    save user to Database
        //    ApplicationUser User = new ApplicationUser();
        //    User.Name = user.FullName;
        //    User.Photos = new List<Photo>();
        //    User.Email = user.Email;
        //    User.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        //    if (User.PasswordHistory == null)
        //    {
        //        User.PasswordHistory = new List<string>();
        //    }
        //    User.PasswordHistory.Add(BCrypt.Net.BCrypt.HashPassword(user.Password));
        //    User.City = user.City; User.Country = user.Country; User.Gender = user.Gender; User.DateOfBirth = user.DateOfBirth; User.KnownAs = user.KnownAs;
        //    using (var stream = user.File.OpenReadStream())
        //    {
        //        var result = await _photoService.UploadImageAsync(stream, user.File.FileName);
        //        var photo = new Photo
        //        {
        //            Url = result.Url,
        //            IsMain = true,
        //            PublicId = result.FileId
        //        };


        //        User.Photos.Add(photo);
        //    }
        //    dc.ApplicationUsers.Add(User);

        //    return User;

        //}
        public async Task<ApplicationUser> CreateUser(RegisterDto user)
        {
            // Save user to Database
            ApplicationUser newUser = new ApplicationUser
            {
                Name = user.FullName,
                Photos = new List<Photo>(),
                Email = user.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(user.Password),
                City = user.City,
                Country = user.Country,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,
                KnownAs = user.KnownAs
            };

            if (newUser.PasswordHistory == null)
            {
                newUser.PasswordHistory = new List<string>();
            }
            newUser.PasswordHistory.Add(newUser.Password);

           

            dc.ApplicationUsers.Add(newUser);

            //File upload handling
            //if (user.File != null)
            //{
            //    using (var stream = user.File.OpenReadStream())
            //    {
            //        var result = await _photoService.UploadImageAsync(stream, user.File.FileName);
            //        var photo = new Photo
            //        {
            //            Url = result.Url,
            //            IsMain = true,
            //            PublicId = result.FileId
            //        };
            //        newUser.Photos.Add(photo);
            //    }
            //}

            return newUser;
        }


        public async Task<ApplicationUser> FindUserByID(int id)
        {
           var user = await dc.ApplicationUsers.FindAsync(id);
            return user;
        }
        public async Task<ApplicationUser> FindUserByEmail(string email)
        {
            var user = await dc.ApplicationUsers.FirstOrDefaultAsync(u => u.Email == email);
            return user;
        }

        //public async Task<bool> isEmailConfirmed(AccountBaseDto user)
        //{
        //    var userf = FindUserByEmail(user.Email);
        //   return userf.isEm
        //}

        public async Task<ApplicationUser> Signin(AccountBaseDto user)
        {
            var userfirst=await dc.ApplicationUsers.Include(u => u.Photos).FirstOrDefaultAsync(x=>x.Email==user.Email);
            if (userfirst == null || !BCrypt.Net.BCrypt.Verify(user.Password, userfirst.Password))
            {
                return null;
            }


            return userfirst;

              
        }

        public async Task<bool> UserAlreadyExist(string email)
        {
            return await dc.ApplicationUsers.AnyAsync(x => x.Email == email);
        }

        public async Task<bool> isEmailConfirmed(ApplicationUser user)
        {
            var userf = await FindUserByID(user.Id);
            return userf.isConfirmedEmail;
        }

        public bool isEmailVerified(int userid, string token)
        {
            var user=FindUserByID(userid);
            if (user.Result.VerificationToken == token)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> isEmailVerifiedForPasswordReset(int userid, string token)
        {
            var user = await FindUserByID(userid);
            if (user.ResetPasswordToken == token)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<PagedList<ApplicationUser>> GetUsersAsync(UserParams userparams)
        {
           var query=  dc.ApplicationUsers.Include(u => u.Photos).AsQueryable();
            query = query.Where(u => u.Name != userparams.CurentUsername);
            query = query.Where(u => u.Gender == userparams.Gender);

            var mindb = DateTime.Today.AddYears(-userparams.MaxAge - 1);
            var maxdb = DateTime.Today.AddYears(-userparams.MinAge);

            query = query.Where(u => u.DateOfBirth >= mindb && u.DateOfBirth <= maxdb);

            query = userparams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };


            return await PagedList<ApplicationUser>.CreateAsync(query, userparams.PageNumber, userparams.PageSize);

        }

        public async Task<ApplicationUser> GetUser(string name)
        {
            return await dc.ApplicationUsers
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.KnownAs == name);
        }
        public async Task<ApplicationUser> GetUserByFullname(string name)
        {
            return await dc.ApplicationUsers
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.Name == name);
        }

        public void Update(ApplicationUser user)
        {
             dc.ApplicationUsers.Update(user);
        }

        public string testwhoistheuser(string username)
        {
            return username;
        }
    }
}
