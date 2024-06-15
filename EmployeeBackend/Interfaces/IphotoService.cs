using EmployeeBackend.Services;

namespace EmployeeBackend.Interfaces
{
    public interface IphotoService
    {
        Task<UploadResult> UploadImageAsync(Stream imageStream, string fileName);
        Task<bool> DeleteImageAsync(string fileId);

    }
}
