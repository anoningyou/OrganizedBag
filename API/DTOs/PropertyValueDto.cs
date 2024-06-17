namespace API.DTOs;

/// <summary>
/// Represents a data transfer object for a property value.
/// </summary>
public class PropertyValueDto
{
    /// <summary>
    /// Gets or sets the ID of the item.
    /// </summary>
    public Guid ItemId { get; set; }

    /// <summary>
    /// Gets or sets the ID of the property.
    /// </summary>
    public Guid PropertyId { get; set; }

    /// <summary>
    /// Gets or sets the value of the property.
    /// </summary>
    public string Value { get; set; }
}