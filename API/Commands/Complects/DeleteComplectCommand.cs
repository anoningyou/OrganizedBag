namespace API;

/// <summary>
/// Represents a command to delete a complect.
/// </summary>
public class DeleteComplectCommand : ICommand<bool>
{
    /// <summary>
    /// Gets or sets the ID of the complect to be deleted.
    /// </summary>
    public Guid Id { get; set; }
}