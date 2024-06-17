namespace API.DTOs;

/// <summary>
/// Represents a data transfer object for property parameters.
/// </summary>
public class PropertyParamDto
{
    /// <summary>
    /// Gets or sets the ID of the property.
    /// </summary>
    public Guid PropertyId { get; set; }

    /// <summary>
    /// Gets or sets the list order of the property. Default value is int.MaxValue.
    /// </summary>
    public int ListOrder { get; set; } = int.MaxValue;

    /// <summary>
    /// Gets or sets a value indicating whether the property should be displayed in the list. Default value is true.
    /// </summary>
    public bool ListDisplay { get; set; } = true;

    /// <summary>
    /// Gets or sets the width of the property in the list. Default value is 50.
    /// </summary>
    public int ListWidth { get; set; } = 50;

    /// <summary>
    /// Gets or sets the complect order of the property. Default value is int.MaxValue.
    /// </summary>
    public int ComplectOrder { get; set; } = int.MaxValue;

    /// <summary>
    /// Gets or sets a value indicating whether the property should be displayed in the complect. Default value is true.
    /// </summary>
    public bool ComplectDisplay { get; set; } = true;

    /// <summary>
    /// Gets or sets the width of the property in the complect. Default value is 100.
    /// </summary>
    public int ComplectWidth { get; set; } = 100;
}