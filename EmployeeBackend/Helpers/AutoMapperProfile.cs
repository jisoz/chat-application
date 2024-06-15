using AutoMapper;
using EmployeeBackend.Dto.Req;
using EmployeeBackend.Dto.Res;
using EmployeeBackend.Models;

namespace EmployeeBackend.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, MemberDto>().ForMember(dest=>dest.PhotoUrl, opt=>opt.MapFrom(src=>src.Photos.FirstOrDefault(x=>x.IsMain).Url));
          

            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, ApplicationUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(des => des.SenderPhotoUrl, opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(des => des.RecipientPhotoUrl, opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}
