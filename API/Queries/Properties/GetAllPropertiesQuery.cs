using API.DTOs;

namespace API;

public class GetAllPropertiesQuery : IQuery<IEnumerable<PropertyDto>>
{
    public Guid UserId { get; set; }
}
