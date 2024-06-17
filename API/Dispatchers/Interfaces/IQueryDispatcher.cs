namespace API;

/// <summary>
/// Represents a dispatcher for executing query operations.
/// </summary>
public interface IQueryDispatcher
{
    /// <summary>
    /// Executes the specified query and returns the result asynchronously.
    /// </summary>
    /// <typeparam name="TResult">The type of the query result.</typeparam>
    /// <param name="query">The query to execute.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the query result.</returns>
    Task<TResult> QueryAsync<TResult>(IQuery<TResult> query);
}