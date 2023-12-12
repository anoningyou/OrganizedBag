using API.DTOs;

namespace API;

public class SharedComplectDto
{
    public ComplectDto Complect { get; set; }
    public List<ItemDto> Items { get; set; }
    public List<PropertyDto> Properties { get; set; }
}
