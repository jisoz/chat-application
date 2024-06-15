namespace EmployeeBackend.Models
{
    public class UserLike
    {

        public ApplicationUser SourceUser { get; set; }
        public int SourceUserId { get; set; }

        public ApplicationUser LikedUser { get; set; }
        public int LikedUserId { get; set; }


    }
}
