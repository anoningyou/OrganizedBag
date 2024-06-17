using Autofac;
using System.Text.Json;

namespace API;

/// <summary>
/// Dispatches queries to their respective query handlers.
/// </summary>
/// <remarks>
/// The query dispatcher is responsible for dispatching queries to their respective handlers.
/// </remarks>
public class QueryDispatcher(IComponentContext context) : IQueryDispatcher
{
    private readonly IComponentContext _context = context;

    ///inheritdoc/>
    public async Task<TResult> QueryAsync<TResult>(IQuery<TResult> query)
    {
        TResult result = default;
        try
        {
            var handlerType = typeof(IQueryHandler<,>)
                .MakeGenericType(query.GetType(), typeof(TResult));

            dynamic handler = _context.Resolve(handlerType);
            result = await handler.HandleAsync((dynamic)query);

            if(query is IDisposable queryDisposable)
                queryDisposable.Dispose();

            if (handler is IDisposable disposable)
                disposable.Dispose();
        }
        catch (Exception ex)
        {
            throw new Exception($"{nameof(QueryAsync)}\n query: {JsonSerializer.Serialize(query)}\n result:{ex.Message}", ex);
        }
        return result;
    }
}