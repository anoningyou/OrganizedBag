namespace API.DTOs;

/// <summary>
/// Represents a group data transfer object.
/// </summary>
public class GroupDto : BaseDto
{
    /// <summary>
    /// Gets or sets the name of the group.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the ID of the complect associated with the group.
    /// </summary>
    public Guid ComplectId { get; set; }

    /// <summary>
    /// Gets or sets the list of group item data transfer objects.
    /// </summary>
    public List<GroupItemDto> Items { get; set; }
}