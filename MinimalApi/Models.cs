using System;
using System.Collections.Generic;

namespace MinimalApi;

record struct ItemId(Guid Value);
record struct PropertyId(Guid Value);
record struct ComplectId(Guid Value);
record struct GroupId(Guid Value);
record struct Name(string Value);

record ItemDto(ItemId Id, List<PropertyValueDto> Values);
record PropertyValueDto(PropertyId PropertyId, string Value);
record PropertyDto(PropertyId Id, Name Name, ValueTypeEnum ValueType, List<PropertyAttributeDto> Attributes, PropertyParamDto Params);
record PropertyParamDto(PropertyId PropertyId, string? DisplayName);
record PropertyAttributeDto(PropertyId PropertyId, string Name, string Value);
record ComplectDto(ComplectId Id, Name Name, string Description, bool IsShared, List<GroupDto> Groups);
record GroupDto(GroupId Id, Name Name, ComplectId ComplectId, List<GroupItemDto> Items);
record GroupItemDto(ItemId ItemId, GroupId GroupId, int Count);
record RegisterDto(string Username, string Password);
record LoginDto(string Username, string Password);
record UserDto(string Username, string Token);
record SharedComplectDto(ComplectId Id);

record ItemDocument(Guid Id, List<PropertyValueDto> Values);
record PropertyDocument(Guid Id, Name Name, ValueTypeEnum ValueType, List<PropertyAttributeDto> Attributes, PropertyParamDto Params);
record ComplectDocument(ComplectDto Dto)
{
    public Guid Id { get; init; } = Dto.Id.Value;
    public string Name { get; init; } = Dto.Name.Value;
    public string Description { get; init; } = Dto.Description;
    public bool IsShared { get; init; } = Dto.IsShared;
    public List<GroupDto> Groups { get; init; } = Dto.Groups;
}

enum ValueTypeEnum { Unknown, String, Number, Decimal, PictureLink, Date }
