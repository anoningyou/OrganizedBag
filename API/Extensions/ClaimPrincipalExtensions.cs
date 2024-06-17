using System.Security.Claims;

namespace API.Extensions;

/// <summary>
/// Provides extension methods for ClaimsPrincipal.
/// </summary>
public static class ClaimPrincipalExtensions
{
    /// <summary>
    /// Gets the username from the ClaimsPrincipal.
    /// </summary>
    /// <param name="user">The ClaimsPrincipal instance.</param>
    /// <returns>The username as a string.</returns>
    public static string GerUserName(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Name)?.Value;
    }

    /// <summary>
    /// Gets the user ID from the ClaimsPrincipal.
    /// </summary>
    /// <param name="user">The ClaimsPrincipal instance.</param>
    /// <returns>The user ID as a Guid.</returns>
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var val = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return val != null ? Guid.Parse(val) : Guid.Empty;
    }
}