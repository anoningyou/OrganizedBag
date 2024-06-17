namespace API.Entities;

/// <summary>
/// Represents a group item.
/// </summary>
public class GroupItem : BaseEntity
{
    /// <summary>
    /// Gets or sets the item.
    /// </summary>
    public virtual Item Item { get; set; }

    /// <summary>
    /// Gets or sets the ID of the item.
    /// </summary>
    public Guid ItemId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the group.
    /// </summary>
    public Guid GroupId { get; set; }

    /// <summary>
    /// Gets or sets the group.
    /// </summary>
    public virtual Group Group { get; set; }

    /// <summary>
    /// Gets or sets the count of the group item.
    /// </summary>
    public int Count { get; set; } = 1;
}