namespace API;

public interface IDispatcher
{
    Task SendAsync<TCommand>(TCommand command) where TCommand : ICommand;
    
    Task<TResult> QueryAsync<TResult>(IQuery<TResult> query);
}
