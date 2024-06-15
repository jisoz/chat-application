using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EmployeeBackend.Models
{
    [Table("photos")]
    public class Photo
    {

        public int Id { get; set; }
        public string? Url { get; set; }

        public bool IsMain { get; set; }

        public string? PublicId { get; set; }

        [JsonIgnore]
        public ApplicationUser  ApplicationUser { get; set; }

       

    }
}
