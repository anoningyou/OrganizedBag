namespace API;

/// <summary>
/// Represents an exception that occurs during the registration process.
/// </summary>
public class RegisterException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RegisterException"/> class with a specified error message and a list of errors.
    /// </summary>
    /// <param name="message">The error message that explains the reason for the exception.</param>
    /// <param name="errors">A list of errors that occurred during the registration process.</param>
    public RegisterException(string message, List<string> errors) : base(message)
    {
        Errors = errors;
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="RegisterException"/> class with a default error message and a list of errors.
    /// </summary>
    /// <param name="errors">A list of errors that occurred during the registration process.</param>
    public RegisterException(List<string> errors) : this("Error during registration", errors)
    {
    }

    /// <summary>
    /// Gets or sets the list of errors that occurred during the registration process.
    /// </summary>
    public List<string> Errors { get; set; }
}
