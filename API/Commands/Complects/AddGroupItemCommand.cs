using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to add a group item.
/// </summary>
public class AddGroupItemCommand : ICommand<GroupItemDto>
{
    /// <summary>
    /// Gets or sets the group item to be added.
    /// </summary>
    public GroupItemDto Item { get; set; }
}