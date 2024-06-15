using System.ComponentModel.DataAnnotations;

namespace EmployeeBackend.Dto.Req
{
    public class ChngPasswordDto
    {
        [DataType(DataType.Password)]
        [Required]
        public string? OldPassword { get; set; }

        [DataType(DataType.Password)]
        [Required]
        public string? NewPassword { get; set; }


        [DataType(DataType.Password)]
        [Compare(nameof(NewPassword))]
        [Required]
        public string? ConfirmNewPassword{ get; set; }
    }
}
