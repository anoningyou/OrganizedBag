namespace API.DTOs;

/// <summary>
/// Represents the base data transfer object (DTO) class.
/// </summary>
public abstract class BaseDto
{
    /// <summary>
    /// Gets or sets the unique identifier for the DTO.
    /// </summary>
    public Guid Id { get; set; } = Guid.NewGuid();
}