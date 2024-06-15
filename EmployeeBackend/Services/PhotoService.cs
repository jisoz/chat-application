using Imagekit;
using Imagekit.Sdk;
using Imagekit.Models;
using System.IO;
using System.Threading.Tasks;
using EmployeeBackend.Interfaces;


namespace EmployeeBackend.Services
{
    public class UploadResult
    {
        public string Url { get; set; }
        public string FileId { get; set; }
    }

    public class PhotoService:IphotoService
    {
        private readonly ImagekitClient _imagekitClient;

        public PhotoService(string publicKey, string privateKey, string urlEndpoint)
        {
            _imagekitClient = new ImagekitClient(publicKey, privateKey, urlEndpoint);
        }

        public async Task<UploadResult> UploadImageAsync(Stream imageStream, string fileName)
        {
            using var memoryStream = new MemoryStream();
            await imageStream.CopyToAsync(memoryStream);
            byte[] fileBytes = memoryStream.ToArray();
          
            var uploadRequest = new FileCreateRequest
            {
                file = fileBytes,
                fileName = fileName,
                folder = $"/Members-gallery/"
            };

            var response = await _imagekitClient.UploadAsync(uploadRequest);
            return new UploadResult { Url = response.url, FileId = response.fileId };
        }


        public async Task<bool> DeleteImageAsync(string fileId)
        {
            var response = await _imagekitClient.DeleteFileAsync(fileId);
            return response != null && response.HttpStatusCode == 204; 
        }


    }
}
