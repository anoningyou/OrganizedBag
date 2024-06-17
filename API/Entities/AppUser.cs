using Microsoft.AspNetCore.Identity;

namespace API.Entities;

/// <summary>
/// Represents an application user.
/// </summary>
public class AppUser : IdentityUser<Guid>, IIdentifiable<Guid>
{
    /// <summary>
    /// Gets or sets the date and time when the user was created.
    /// </summary>
    public DateTime Created { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the date and time when the user was last active.
    /// </summary>
    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the collection of user roles associated with the user.
    /// </summary>
    public virtual ICollection<AppUserRole> UserRoles { get; set; }

    /// <summary>
    /// Gets or sets the collection of items associated with the user.
    /// </summary>
    public virtual ICollection<Item> Items { get; set; }

    /// <summary>
    /// Gets or sets the collection of complects associated with the user.
    /// </summary>
    public virtual ICollection<Complect> Complects { get; set; }

    /// <summary>
    /// Gets or sets the collection of property parameters associated with the user.
    /// </summary>
    public virtual ICollection<PropertyParam> PropertyParams { get; set; }
}