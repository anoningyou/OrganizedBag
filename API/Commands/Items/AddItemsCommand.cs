using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to add items.
/// </summary>
public class AddItemsCommand : ICommand<List<ItemDto>>
{
    /// <summary>
    /// Gets or sets the list of item DTOs.
    /// </summary>
    public List<ItemDto> ItemDtos { get; set; }

    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }
}