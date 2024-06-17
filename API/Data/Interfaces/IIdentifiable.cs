namespace API;

/// <summary>
/// Represents an entity that has an identifier.
/// </summary>
/// <typeparam name="TPrimaryKey">The type of the identifier.</typeparam>
public interface IIdentifiable<TPrimaryKey>
{
    /// <summary>
    /// Gets or sets the identifier of the entity.
    /// </summary>
    TPrimaryKey Id { get; set; }
}