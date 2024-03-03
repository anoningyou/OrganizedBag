namespace API;

public interface ICommandDispatcher
{
    Task SendAsync<T>(T command) where T : ICommand;
}
