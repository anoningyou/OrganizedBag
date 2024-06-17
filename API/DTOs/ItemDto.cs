namespace API.DTOs;

/// <summary>
/// Represents an item data transfer object.
/// </summary>
public class ItemDto : BaseDto
{
    /// <summary>
    /// Gets or sets the list of property values.
    /// </summary>
    public List<PropertyValueDto> Values { get; set; }
}