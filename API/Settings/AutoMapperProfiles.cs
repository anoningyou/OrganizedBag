using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Settings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<DateTime, DateTime>()
                .ConvertUsing(d=> DateTime.SpecifyKind(d, DateTimeKind.Utc));
                
            CreateMap<DateTime?, DateTime?>()
                .ConvertUsing(d=> d.HasValue? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc):null);
            
            CreateMap<RegisterDto, AppUser>();

            CreateMap<PropertyAttributeDto, PropertyAttribute>().ReverseMap();
            CreateMap<PropertyParam, PropertyParamDto>().ReverseMap();

            CreateMap<PropertyDto, Property>()
                        .ForMember(x => x.Params, o => o.Ignore());
                        
            CreateMap<Property, PropertyDto>()
                        .ForMember(x => x.Params, o => o.MapFrom(src => src.Params.FirstOrDefault()));

            CreateMap<PropertyValueDto, PropertyValue>().ReverseMap();

            CreateMap<PropertyParamCommon, PropertyParamDto>().ReverseMap();

            CreateMap<PropertyParam, PropertyParamDto>().ReverseMap();

            CreateMap<ItemDto, Item>().ReverseMap();

            CreateMap<ComplectItemDto, ComplectItem>().ReverseMap();

            CreateMap<ComplectDto, Complect>().ReverseMap();
            
            
        }
    }
}