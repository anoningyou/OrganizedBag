using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/// <summary>
/// Represents the data transfer object for user registration.
/// </summary>
public class RegisterDto
{
    /// <summary>
    /// Gets or sets the username.
    /// </summary>
    [Required]
    public string Username { get; set; }

    /// <summary>
    /// Gets or sets the password.
    /// </summary>
    [Required]
    [StringLength(12, MinimumLength = 4)]
    public string Password { get; set; }
}