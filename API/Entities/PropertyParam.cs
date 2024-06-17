namespace API.Entities;

/// <summary>
/// Represents a property parameter associated with a user and a property.
/// </summary>
public class PropertyParam : BaseEntity
{
    /// <summary>
    /// Gets or sets the ID of the user associated with the property parameter.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets the user associated with the property parameter.
    /// </summary>
    public virtual AppUser User { get; set; }

    /// <summary>
    /// Gets or sets the ID of the property associated with the property parameter.
    /// </summary>
    public Guid PropertyId { get; set; }

    /// <summary>
    /// Gets or sets the property associated with the property parameter.
    /// </summary>
    public virtual Property Property { get; set; }

    /// <summary>
    /// Gets or sets the order in which the property parameter is displayed in a list.
    /// </summary>
    public int ListOrder { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the property parameter is displayed in a list.
    /// </summary>
    public bool ListDisplay { get; set; }

    /// <summary>
    /// Gets or sets the width of the property parameter in a list.
    /// </summary>
    public int ListWidth { get; set; }

    /// <summary>
    /// Gets or sets the order in which the property parameter is displayed in a complect.
    /// </summary>
    public int ComplectOrder { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the property parameter is displayed in a complect.
    /// </summary>
    public bool ComplectDisplay { get; set; }

    /// <summary>
    /// Gets or sets the width of the property parameter in a complect.
    /// </summary>
    public int ComplectWidth { get; set; }
}