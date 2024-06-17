using API.Enums;

namespace API.DTOs;

/// <summary>
/// Represents a data transfer object for a property attribute.
/// </summary>
public class PropertyAttributeDto
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