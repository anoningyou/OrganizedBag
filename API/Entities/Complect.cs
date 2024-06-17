namespace API.Entities;

/// <summary>
/// Represents a Complect entity.
/// </summary>
public class Complect : BaseEntity
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
    /// Gets or sets the ID of the user associated with the Complect.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the Complect is shared.
    /// </summary>
    public bool IsShared { get; set; }

    /// <summary>
    /// Gets or sets the user associated with the Complect.
    /// </summary>
    public virtual AppUser User { get; set; }

    /// <summary>
    /// Gets or sets the collection of groups associated with the Complect.
    /// </summary>
    public virtual ICollection<Group> Groups { get; set; }
}