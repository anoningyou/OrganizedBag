using API.Entities;

namespace API.Interfaces;

/// <summary>
/// Represents a service for creating tokens.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Creates a token for the specified user.
    /// </summary>
    /// <param name="user">The user for whom the token is created.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the created token.</returns>
    Task<string> CreateToken(AppUser user); 
}