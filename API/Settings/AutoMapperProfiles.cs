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

            CreateMap<PropertyDto, Property>();

            CreateMap<Property, PropertyDto>();

            CreateMap<PropertyAttributeDto, PropertyAttribute>();

            CreateMap<PropertyAttribute, PropertyAttributeDto>();
            CreateMap<RegisterDto, AppUser>();
            
        }
    }
}