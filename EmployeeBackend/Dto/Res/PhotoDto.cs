using System.Text.Json.Serialization;

namespace EmployeeBackend.Dto.Res
{
    
    public class PhotoDto
    {
      
        public int id {  get; set; }
       
        public string? Url { get; set; }
       
        public bool IsMain { get; set; }
     
        public string? PublicId { get; set; }


    }
}
