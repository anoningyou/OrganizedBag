using API.DTOs;

namespace API;

/// <summary>
/// Represents a command for editing an item.
/// </summary>
public class EditItemCommand : ICommand<ItemDto>
{
    /// <summary>
    /// Gets or sets the data transfer object for an item.
    /// </summary>
    public ItemDto ItemDto { get; set; }
}