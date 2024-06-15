using EmployeeBackend.Dto.Req;
using EmployeeBackend.Models;

namespace EmployeeBackend.Interfaces
{
    public interface ILikeRepository
    {
        Task<UserLike> GetUserLike (int sourceuserid , int likeduserid );

        Task<ApplicationUser> GetUserWithLikes(int userid);

        Task<IEnumerable<LikeDto>> GetUserLikes(string predicted, int userid);
    }
}
