namespace API.DTOs;

/// <summary>
/// Represents a Complect data transfer object.
/// </summary>
public class ComplectDto : BaseDto
{
    /// <summary>
    /// Gets or sets the name of the Complect.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the description of the Complect.
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the Complect is shared.
    /// </summary>
    public bool IsShared { get; set; }

    /// <summary>
    /// Gets or sets the list of GroupDto objects associated with the Complect.
    /// </summary>
    public List<GroupDto> Groups { get; set; } = new List<GroupDto>();
}