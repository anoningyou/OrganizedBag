using API.DTOs;

namespace API;

/// <summary>
/// Represents a command to update a Complect.
/// </summary>
public class UpdateComplectCommand : ICommand<ComplectDto>
{
    /// <summary>
    /// Gets or sets the Complect to be updated.
    /// </summary>
    public ComplectDto Complect { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user performing the update.
    /// </summary>
    public Guid UserId { get; set; }
}