using API.Enums;

namespace API.DTOs;

/// <summary>
/// Represents a property data transfer object.
/// </summary>
public class PropertyDto : BaseDto
{
    /// <summary>
    /// Gets or sets the name of the property.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the value type of the property.
    /// </summary>
    public ValueTypeEnum ValueType { get; set; }

    /// <summary>
    /// Gets or sets the list of attributes associated with the property.
    /// </summary>
    public List<PropertyAttributeDto> Attributes { get; set; } = [];

    /// <summary>
    /// Gets or sets the parameter details of the property.
    /// </summary>
    public PropertyParamDto Params { get; set; }
}