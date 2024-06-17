using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Data.Interfaces;

/// <summary>
/// Represents a unit of work for managing database operations.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Gets the repository for the specified entity type and primary key type.
    /// </summary>
    /// <typeparam name="TEntity">The type of the entity.</typeparam>
    /// <typeparam name="TPrimaryKey">The type of the primary key.</typeparam>
    /// <returns>The repository for the specified entity type and primary key type.</returns>
    IRepository<TEntity, TPrimaryKey> GetRepository<TEntity, TPrimaryKey>()
        where TEntity : class, IIdentifiable<TPrimaryKey>;

    /// <summary>
    /// Gets the read-only repository for the specified entity type and primary key type.
    /// </summary>
    /// <typeparam name="TEntity">The type of the entity.</typeparam>
    /// <typeparam name="TPrimaryKey">The type of the primary key.</typeparam>
    /// <returns>The read-only repository for the specified entity type and primary key type.</returns>
    IRepositoryReadonly<TEntity, TPrimaryKey> GetRepositoryReadonly<TEntity, TPrimaryKey>()
        where TEntity : class, IIdentifiable<TPrimaryKey>;

    /// <summary>
    /// Completes the unit of work and saves the changes to the underlying data store.
    /// </summary>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task<bool> Complete();

    /// <summary>
    /// Determines whether there are any changes in the unit of work.
    /// </summary>
    /// <returns>True if there are changes; otherwise, false.</returns>
    bool HasChanges();

    /// <summary>
    /// Begins a new database transaction.
    /// </summary>
    /// <returns>The transaction object.</returns>
    IDbContextTransaction BeginTransaction();

    /// <summary>
    /// Commits the current database transaction.
    /// </summary>
    void CommitTransaction();

    /// <summary>
    /// Rolls back the current database transaction.
    /// </summary>
    void RollbackTransaction();
}

/// <summary>
/// Represents a unit of work interface for managing database operations.
/// </summary>
/// <typeparam name="TContext">The type of the database context.</typeparam>
public interface IUnitOfWork<TContext> : IUnitOfWork
    where TContext : DbContext
{       
    /// <summary>
    /// Clears any pending changes in the unit of work.
    /// </summary>
    void Clear();       
}