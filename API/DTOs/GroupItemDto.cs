namespace API.DTOs;

/// <summary>
/// Represents a data transfer object for a group item.
/// </summary>
public class GroupItemDto
{
    /// <summary>
    /// Gets or sets the ID of the item.
    /// </summary>
    public Guid ItemId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the group.
    /// </summary>
    public Guid GroupId { get; set; }

    /// <summary>
    /// Gets or sets the count of the item.
    /// </summary>
    public int Count { get; set; } = 1;
}