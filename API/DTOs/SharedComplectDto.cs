using API.DTOs;

namespace API;

/// <summary>
/// Represents a shared complect data transfer object.
/// </summary>
public class SharedComplectDto
{
    /// <summary>
    /// Represents a shared complect DTO.
    /// </summary>
    public ComplectDto Complect { get; set; }

    /// <summary>
    /// Gets or sets the list of item DTOs.
    /// </summary>
    public List<ItemDto> Items { get; set; }

    /// <summary>
    /// Gets or sets the list of property DTOs.
    /// </summary>
    public List<PropertyDto> Properties { get; set; }
}