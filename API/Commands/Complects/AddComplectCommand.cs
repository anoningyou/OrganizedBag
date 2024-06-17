using API.DTOs;

namespace API;

/// <summary>
/// Represents a command for adding a complect.
/// </summary>
public class AddComplectCommand : ICommand<ComplectDto>
{
    /// <summary>
    /// Gets or sets the complect to be added.
    /// </summary>
    public ComplectDto Complect { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user performing the action.
    /// </summary>
    public Guid UserId { get; set; }
}