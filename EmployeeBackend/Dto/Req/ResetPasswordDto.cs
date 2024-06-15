using System.ComponentModel.DataAnnotations;

namespace EmployeeBackend.Dto.Req
{
    public class ResetPasswordDto
    {
        [DataType(DataType.Password)]
        [Required]
        public string? NewPassword { get; set; }


        [DataType(DataType.Password)]
        [Compare(nameof(NewPassword))]
        [Required]
        public string? ConfirmNewPassword { get; set; }
    }
}
