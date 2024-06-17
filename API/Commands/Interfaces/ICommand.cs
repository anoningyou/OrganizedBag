namespace API;

/// <summary>
/// Represents the root namespace for the API.
/// </summary>
public interface ICommand
{

}

/// <summary>
/// Represents a command interface with a specific type parameter.
/// </summary>
/// <typeparam name="T">The type parameter for the command.</typeparam>
public interface ICommand<T> : ICommand
{

}