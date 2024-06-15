
using EmployeeBackend.Extensions;
using System.Text.Json.Serialization;

namespace EmployeeBackend.Models
{
    public class ApplicationUser
    {
        public int Id { get; set; } 

        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public bool isConfirmedEmail { get; set; } = false;

        public string? VerificationToken { get; set; }

        public string? ResetPasswordToken { get; set; }

        public List<string> PasswordHistory { get; set; }

        public DateTime? DateOfBirth {  get; set; }

        public string? KnownAs { get; set; }

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime LastActive { get; set; }=DateTime.Now;

        public string? Gender { get; set; }

        public string? Introduction { get; set;}

        public string?LookingFor { get; set; }

        public string? Interests { get; set; }

        public string? City { get; set;}

        public string? Country { get; set; }

        [JsonIgnore]
        public ICollection<Photo> Photos { get; set; }

        [JsonIgnore]
        public ICollection<UserLike> LikedByUsers { get; set; }
        [JsonIgnore]
        public ICollection<UserLike> LikedUsers { get; set; }

        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }


        public int GetAge()
        {
          return     DatetimeExtension.CalculateAge((DateTime)DateOfBirth);
        }



    }
}
