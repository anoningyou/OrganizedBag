using API.DTOs;
using API.Entities;

namespace API;

/// <summary>
/// Represents a query to retrieve an item.
/// </summary>
public class GetItemQuery : IQuery<Item>
{
    /// <summary>
    /// Gets or sets the item DTO.
    /// </summary>
    public ItemDto ItemDto { get; set; }

    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }
}