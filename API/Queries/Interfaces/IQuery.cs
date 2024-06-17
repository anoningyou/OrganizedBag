namespace API;

/// <summary>
/// Represents a query interface.
/// </summary>
public interface IQuery
{
}

/// <summary>
/// Represents a query that retrieves data of type <typeparamref name="T"/>.
/// </summary>
/// <typeparam name="T">The type of data to retrieve.</typeparam>
public interface IQuery<T> : IQuery
{
}