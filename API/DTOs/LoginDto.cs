using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/// <summary>
/// Represents the data transfer object for login information.
/// </summary>
public class LoginDto
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
    public string Password { get; set; }
}