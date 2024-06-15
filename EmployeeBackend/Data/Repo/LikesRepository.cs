using EmployeeBackend.Dto.Req;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeBackend.Data.Repo
{
    public class LikesRepository : ILikeRepository
    {
        private readonly AppDbContext dc;

        public LikesRepository(AppDbContext dc)
        {
            this.dc = dc;
        }

        public async Task<UserLike> GetUserLike(int sourceuserid, int likeduserid)
        {
            return await dc.Likes.FindAsync(sourceuserid, likeduserid);
        }

        public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicted, int userid)
        {
            var users = dc.ApplicationUsers.OrderBy(u => u.Name).AsQueryable();
            var likes = dc.Likes.AsQueryable();
            if (predicted == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == userid);
                users = likes.Select(like => like.LikedUser);

            }

            if (predicted == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == userid);
                users = likes.Select(like => like.SourceUser);

            }
            return await users.Select(user => new LikeDto
            {
                Name = user.Name,
                KnownAs=user.KnownAs,
                Age=user.GetAge(),
                PhotoUrl=user.Photos.FirstOrDefault(P=>P.IsMain).Url,
                City=user.City,
                Id=user.Id

            }).ToListAsync();
        }

        public async Task<ApplicationUser> GetUserWithLikes(int userid)
        {
            return await dc.ApplicationUsers.Include(x => x.LikedUsers).FirstOrDefaultAsync(x => x.Id == userid);   
        }
    }
}
