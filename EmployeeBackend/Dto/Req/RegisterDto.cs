using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EmployeeBackend.Dto.Req
{
    public class RegisterDto : AccountBaseDto
    {
        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        public string? FullName { get; set; }

        [DataType(DataType.Password)]
        [Compare(nameof(Password))]
        [Required]
        public string? ConfirmPassword { get; set; }


        public string? Gender { get; set; }

        public string? KnownAs { get; set; }


        public string? City { get; set; }

        public string? Country { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [JsonIgnore]
        public IFormFile? File { get; set; } 
    }
}
