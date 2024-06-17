using API.Enums;

namespace API.Entities;

/// <summary>
/// Represents a property attribute.
/// </summary>
public class PropertyAttribute : BaseEntity
{
    /// <summary>
    /// Gets or sets the type of the property attribute.
    /// </summary>
    public PropertyAttributeTypeEnum Type { get; set; }

    /// <summary>
    /// Gets or sets the value of the property attribute.
    /// </summary>
    public string Value { get; set; }
}