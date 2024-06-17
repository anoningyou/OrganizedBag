namespace API;

/// <summary>
/// Represents a command to delete a group.
/// </summary>
public class DeleteGroupCommand : ICommand<bool>
{
    /// <summary>
    /// Gets or sets the ID of the group to be deleted.
    /// </summary>
    public Guid Id { get; set; }
}