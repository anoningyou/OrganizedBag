namespace API.Entities;

/// <summary>
/// Represents an item in the system.
/// </summary>
public class Item : BaseEntity
{
    /// <summary>
    /// Gets or sets the ID of the user who owns the item.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets the user who owns the item.
    /// </summary>
    public virtual AppUser User { get; set; }

    /// <summary>
    /// Gets or sets the collection of property values associated with the item.
    /// </summary>
    public ICollection<PropertyValue> Values { get; set; }

    /// <summary>
    /// Gets or sets the collection of groups that the item belongs to.
    /// </summary>
    public virtual ICollection<GroupItem> Groups { get; set; }
}