namespace API;

/// <summary>
/// Represents a command to delete an item.
/// </summary>
public class DeleteItemCommand : ICommand<bool>
{
    /// <summary>
    /// Gets or sets the ID of the item to be deleted.
    /// </summary>
    public Guid ItemId { get; set; }
}