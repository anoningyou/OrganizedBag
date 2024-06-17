using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to add an item.
/// </summary>
public class AddItemCommand : ICommand<ItemDto>
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