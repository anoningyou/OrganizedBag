using Microsoft.EntityFrameworkCore;

namespace API;

/// <summary>
/// Represents a base repository interface for CRUD operations on entities.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
/// <typeparam name="TPrimaryKey">The type of the primary key.</typeparam>
public interface IBaseRepository<TEntity, TPrimaryKey> : IDisposable
    where TEntity : class, IIdentifiable<TPrimaryKey>
{
    /// <summary>
    /// Gets the current state of the entity.
    /// </summary>
    /// <param name="entity">The entity.</param>
    /// <returns>The current state of the entity.</returns>
    EntityState CurrentEntityState(TEntity entity); 
}