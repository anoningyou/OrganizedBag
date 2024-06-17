using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to update a group item.
/// </summary>
public class UpdateGroupItemCommand : ICommand<GroupItemDto>
{
    /// <summary>
    /// Gets or sets the group item to be updated.
    /// </summary>
    public GroupItemDto Item { get; set; }
}