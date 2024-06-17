using API.DTOs;

namespace API;

/// <summary>
/// Represents a query to retrieve all items.
/// </summary>
public class GetAllItemsQuery : IQuery<IEnumerable<ItemDto>>
{
    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }
}