using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Settings;

/// <summary>
/// AutoMapper profile class for mapping between different types.
/// </summary>
public class AutoMapperProfiles : Profile
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AutoMapperProfiles"/> class.
    /// Configures the mappings between different types.
    /// </summary>
    public AutoMapperProfiles()
    {
        CreateMap<DateTime, DateTime>()
            .ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));

        CreateMap<DateTime?, DateTime?>()
            .ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);

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

        CreateMap<GroupItemDto, GroupItem>().ReverseMap();

        CreateMap<GroupDto, Group>().ReverseMap();

        CreateMap<ComplectDto, Complect>().ReverseMap();
    }
}