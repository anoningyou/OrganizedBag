
namespace API.Entities;

/// <summary>
/// Represents a common property parameter.
/// </summary>
public class PropertyParamCommon : BaseEntity
{
    /// <summary>
    /// Gets or sets the ID of the property.
    /// </summary>
    public Guid PropertyId { get; set; }

    /// <summary>
    /// Gets or sets the property associated with this parameter.
    /// </summary>
    public virtual Property Property { get; set; }

    /// <summary>
    /// Gets or sets the order in which the parameter is displayed in a list.
    /// </summary>
    public int ListOrder { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the parameter is displayed in a list.
    /// </summary>
    public bool ListDisplay { get; set; }

    /// <summary>
    /// Gets or sets the width of the parameter in a list.
    /// </summary>
    public int ListWidth { get; set; }

    /// <summary>
    /// Gets or sets the order in which the parameter is displayed in a complect.
    /// </summary>
    public int ComplectOrder { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the parameter is displayed in a complect.
    /// </summary>
    public bool ComplectDisplay { get; set; }

    /// <summary>
    /// Gets or sets the width of the parameter in a complect.
    /// </summary>
    public int ComplectWidth { get; set; }
}