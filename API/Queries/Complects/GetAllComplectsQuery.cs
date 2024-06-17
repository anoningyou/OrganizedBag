using API.DTOs;

namespace API;

/// <summary>
/// Represents a query to retrieve all complects.
/// </summary>
public class GetAllComplectsQuery : IQuery<IEnumerable<ComplectDto>>
{
    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }
}