using API.DTOs;

namespace API;

/// <summary>
/// Represents a query to get all properties.
/// </summary>
public class GetAllPropertiesQuery : IQuery<IEnumerable<PropertyDto>>
{
    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }
}