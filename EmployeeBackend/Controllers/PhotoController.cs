using AutoMapper;
using EmployeeBackend.Data;
using EmployeeBackend.Dto.Res;
using EmployeeBackend.Interfaces;
using EmployeeBackend.Models;
using EmployeeBackend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EmployeeBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : BaseController
    {

        private readonly IUnitOfWork uow;
        private readonly AppDbContext dc;
        private readonly IMapper mapper;
        public PhotoController(IUnitOfWork uow, AppDbContext dc, IMapper mapper)
        {
            this.uow = uow;
            this.dc = dc;
            this.mapper = mapper;
           
        }

        [HttpPost("upload-image-user")]
        public async Task<ActionResult<Photo>> UploadImage(IFormFile file)
        {
            var username = GetUsername();
            var user = uow.UserRepository.GetUserByFullname(username);


            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            using (var stream = file.OpenReadStream())
            {

                var result = await uow.PhotoService.UploadImageAsync(stream, file.FileName);
                var photo = new Photo
                {
                    Url = result.Url,
                    PublicId = result.FileId
                };

                if (user.Result.Photos.Count == 0)
                {
                    photo.IsMain = true;
                }

                user.Result.Photos.Add(photo);

                if (await uow.SaveAsync())
                {
                    var photoDto = new PhotoDto
                    {
                        Url = photo.Url,
                        IsMain = photo.IsMain,
                        PublicId=photo.PublicId

                    };

                    return CreatedAtRoute("GetUser", new { fullname = user.Result.Name }, photoDto);



                }
                else
                {
                    return BadRequest("problem with adding the photo");
                }

            }
        }
        
        [HttpDelete("deleteimageuser/{fileId}")]
        public async Task<IActionResult> Delete(string fileId)
        {

            var username = GetUsername();
            var user = uow.UserRepository.GetUserByFullname(username);

            var result = await uow.PhotoService.DeleteImageAsync(fileId);
            var photo = user.Result.Photos.FirstOrDefault(p => p.PublicId == fileId);
            user.Result.Photos.Remove(photo);
            if (await uow.SaveAsync())
            {
                return Ok(new { Message = "Image deleted successfully" });
            }
            else
            {
                return BadRequest("Failed to delete image");
            }
             
               
           
              
        }


        [HttpPut("set-main-photo/{fileid}")]
        public async Task<ActionResult> SetMainPhoto(string fileid)
        {
            var username = GetUsername();
            var user = uow.UserRepository.GetUserByFullname(username);
            var photo = user.Result.Photos.FirstOrDefault(p => p.PublicId == fileid);
            if (photo.IsMain) return BadRequest("This is already your main photo");
            var currmain = user.Result.Photos.FirstOrDefault(x => x.IsMain);
            if (currmain != null)  currmain.IsMain=false;
            photo.IsMain = true;
            if (await uow.SaveAsync())
            {
                return NoContent();
            }
            else
            {
                return BadRequest("Failed to set main photo");
            }
        }



    }
}
