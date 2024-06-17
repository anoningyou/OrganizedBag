using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to delete a group item.
/// </summary>
public class DeleteGroupItemCommand : ICommand<bool>
{
    /// <summary>
    /// Gets or sets the group item to be deleted.
    /// </summary>
    public GroupItemDto Item { get; set; }
}