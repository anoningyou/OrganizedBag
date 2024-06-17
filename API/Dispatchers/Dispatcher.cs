namespace API;

/// <summary>
/// Represents a dispatcher that handles the execution of commands and queries.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="Dispatcher"/> class.
/// </remarks>
/// <param name="commandDispatcher">The command dispatcher.</param>
/// <param name="queryDispatcher">The query dispatcher.</param>
public class Dispatcher(ICommandDispatcher commandDispatcher,
    IQueryDispatcher queryDispatcher) : IDispatcher
{
    private readonly ICommandDispatcher _commandDispatcher = commandDispatcher;
    private readonly IQueryDispatcher _queryDispatcher = queryDispatcher;

    ///inheritdoc/>
    public async Task<TResult> SendAsync<TResult>(ICommand<TResult> command)
        => await _commandDispatcher.SendAsync(command);

    ///inheritdoc/>
    public async Task<TResult> QueryAsync<TResult>(IQuery<TResult> query)
        => await _queryDispatcher.QueryAsync(query);
}