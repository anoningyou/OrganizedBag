namespace API.Entities;

/// <summary>
/// Represents a group entity.
/// </summary>
public class Group : BaseEntity
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
    /// Gets or sets the complect associated with the group.
    /// </summary>
    public virtual Complect Complect { get; set; }

    /// <summary>
    /// Gets or sets the collection of group items.
    /// </summary>
    public virtual ICollection<GroupItem> Items { get; set; }
}