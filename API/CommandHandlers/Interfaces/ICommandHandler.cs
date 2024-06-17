namespace API;

/// <summary>
/// Represents a command handler that handles commands of type <typeparamref name="TCommand"/>.
/// </summary>
/// <typeparam name="TCommand">The type of command to handle.</typeparam>
public interface ICommandHandler<in TCommand> where TCommand : ICommand
{        
    /// <summary>
    /// Handles the specified command asynchronously.
    /// </summary>
    /// <param name="command">The command to handle.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task HandleAsync(TCommand command);
}

/// <summary>
/// Represents a command handler that handles commands of type <typeparamref name="TCommand"/> and returns a result of type <typeparamref name="TResult"/>.
/// </summary>
/// <typeparam name="TCommand">The type of command to handle.</typeparam>
/// <typeparam name="TResult">The type of result returned by the command handler.</typeparam>
public interface ICommandHandler<in TCommand, TResult> where TCommand : ICommand<TResult>
{        
    /// <summary>
    /// Handles the specified command asynchronously and returns the result.
    /// </summary>
    /// <param name="command">The command to handle.</param>
    /// <returns>A task representing the asynchronous operation. The task result contains the result of the command handling.</returns>
    Task<TResult> HandleAsync(TCommand command);
}