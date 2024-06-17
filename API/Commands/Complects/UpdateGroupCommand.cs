using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to update a group.
/// </summary>
public class UpdateGroupCommand : ICommand<GroupDto>
{
    /// <summary>
    /// Gets or sets the group to be updated.
    /// </summary>
    public GroupDto Group { get; set; }
}