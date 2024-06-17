using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to add a group.
/// </summary>
public class AddGroupCommand : ICommand<GroupDto>
{
    /// <summary>
    /// Gets or sets the group to be added.
    /// </summary>
    public GroupDto Group { get; set; }
}