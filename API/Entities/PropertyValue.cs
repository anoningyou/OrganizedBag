namespace API.Entities;

/// <summary>
/// Represents a property value associated with an item.
/// </summary>
public class PropertyValue : BaseEntity
{
    /// <summary>
    /// Gets or sets the item associated with the property value.
    /// </summary>
    public virtual Item Item { get; set; }

    /// <summary>
    /// Gets or sets the ID of the item associated with the property value.
    /// </summary>
    public Guid ItemId { get; set; }

    /// <summary>
    /// Gets or sets the property associated with the property value.
    /// </summary>
    public virtual Property Property { get; set; }

    /// <summary>
    /// Gets or sets the ID of the property associated with the property value.
    /// </summary>
    public Guid PropertyId { get; set; }

    /// <summary>
    /// Gets or sets the value of the property.
    /// </summary>
    public string Value { get; set; }
}