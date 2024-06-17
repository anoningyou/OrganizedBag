using Microsoft.AspNetCore.Identity;

namespace API.Entities;

/// <summary>
/// Represents the relationship between an application user and a role.
/// </summary>
public class AppUserRole : IdentityUserRole<Guid>
{
    /// <summary>
    /// Gets or sets the user associated with this role.
    /// </summary>
    public AppUser User { get; set; }   
    
    /// <summary>
    /// Gets or sets the role associated with this user.
    /// </summary>
    public AppRole Role { get; set; }
}