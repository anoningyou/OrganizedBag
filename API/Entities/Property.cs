using API.Enums;

namespace API.Entities;

/// <summary>
/// Represents a property entity.
/// </summary>
public class Property : BaseEntity
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
    /// Gets or sets the collection of attributes associated with the property.
    /// </summary>
    public virtual ICollection<PropertyAttribute> Attributes { get; set; }

    /// <summary>
    /// Gets or sets the collection of values associated with the property.
    /// </summary>
    public virtual ICollection<PropertyValue> Values { get; set; }

    /// <summary>
    /// Gets or sets the collection of parameters associated with the property.
    /// </summary>
    public virtual ICollection<PropertyParam> Params { get; set; }

    /// <summary>
    /// Gets or sets the common parameter associated with the property.
    /// </summary>
    public virtual PropertyParamCommon ParamCommon { get; set; }
}