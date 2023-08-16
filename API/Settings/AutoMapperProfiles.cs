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

            CreateMap<PropertyDto, Property>().ReverseMap();

            CreateMap<PropertyValueDto, PropertyValue>().ReverseMap();

            CreateMap<PropertyValueDto, PropertyValue>().ReverseMap();

            CreateMap<ItemDto, Item>().ReverseMap();

            CreateMap<ComplectItemDto, ComplectItem>().ReverseMap();

            CreateMap<ComplectDto, Complect>().ReverseMap();
            
            
        }
    }
}