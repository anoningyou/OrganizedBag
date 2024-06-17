namespace API.Exceptions;

/// <summary>
/// Represents an exception that is thrown when a record is not found.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="RecordNotFoundException"/> class with the specified entity name and key.
/// </remarks>
/// <param name="entityName">The name of the entity.</param>
/// <param name="key">The key of the record.</param>
public class RecordNotFoundException(string entityName, object key) 
    : Exception($"Entity {entityName} with key {key} was not found.")
{}