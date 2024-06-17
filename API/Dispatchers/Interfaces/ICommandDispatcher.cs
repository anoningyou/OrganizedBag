namespace API;

/// <summary>
/// Represents a dispatcher for executing commands.
/// </summary>
public interface ICommandDispatcher
{
    /// <summary>
    /// Sends a command asynchronously and returns the result.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="command">The command to send.</param>
    /// <returns>A task representing the asynchronous operation, containing the result of the command.</returns>
    Task<TResult> SendAsync<TResult>(ICommand<TResult> command);
}