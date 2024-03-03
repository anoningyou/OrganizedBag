using Autofac;
using System.Text.Json;

namespace API;

public class QueryDispatcher : IQueryDispatcher
{
    private readonly IComponentContext _context;

    public QueryDispatcher(IComponentContext context)
    {
        _context = context;
    }

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
