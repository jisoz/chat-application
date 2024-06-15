using EmployeeBackend.Dto;
using EmployeeBackend.Dto.Req;
using EmployeeBackend.Dto.Res;
using EmployeeBackend.Helpers;
using EmployeeBackend.Models;

namespace EmployeeBackend.Interfaces
{
    public interface IUserRepository
    {

        Task<ApplicationUser> CreateUser(RegisterDto user);

 
        Task<ApplicationUser> Signin(AccountBaseDto user);

        Task<bool> UserAlreadyExist(string email);

        Task<ApplicationUser> FindUserByID(int id);

        Task<bool> isEmailConfirmed(ApplicationUser user);

        bool isEmailVerified(int userid, string token);
        Task<bool> isEmailVerifiedForPasswordReset(int userid, string token);
        Task<ApplicationUser> FindUserByEmail(string email);

        Task<PagedList<ApplicationUser>> GetUsersAsync(UserParams userparm);

        Task<ApplicationUser> GetUser(string name);
        Task<ApplicationUser> GetUserByFullname(string name);

        void Update(ApplicationUser user);
         string testwhoistheuser(string username);
    }
}
