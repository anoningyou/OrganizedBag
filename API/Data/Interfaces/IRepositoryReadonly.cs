using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

/// <summary>
/// Represents the API namespace.
/// </summary>
namespace API;

public interface IRepositoryReadonly <TEntity, TPrimaryKey> : IBaseRepository <TEntity, TPrimaryKey>
    where TEntity : class, IIdentifiable<TPrimaryKey>
{

    #region get

    /// <summary>
    /// Checks if any entity exists in the repository that satisfies the given predicate.
    /// </summary>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating if any entity exists.</returns>
    Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an entity from the repository by its primary key.
    /// </summary>
    /// <param name="id">The primary key of the entity.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the entity.</returns>
    Task<TEntity> GetAsync(
        TPrimaryKey id,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets an entity from the repository that satisfies the given predicate.
    /// </summary>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the entity.</returns>
    Task<TEntity> GetAsync(
        Expression<Func<TEntity, bool>> predicate,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Gets an entity from the repository by its primary key and maps it to the specified result type using AutoMapper.
    /// </summary>
    /// <typeparam name="TResult">The type to map the entity to.</typeparam>
    /// <param name="id">The primary key of the entity.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the mapped entity.</returns>
    Task<TResult> GetAsync<TResult>(
        TPrimaryKey id,
        AutoMapper.IConfigurationProvider mapConfig,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default)
    where TResult : class;

    /// <summary>
    /// Gets an entity from the repository that satisfies the given predicate and maps it to the specified result type using AutoMapper.
    /// </summary>
    /// <typeparam name="TResult">The type to map the entity to.</typeparam>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the mapped entity.</returns>
    Task<TResult> GetAsync<TResult>(
        Expression<Func<TEntity, bool>> predicate,
        AutoMapper.IConfigurationProvider mapConfig,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default)
    where TResult : class;

    /// <summary>
    /// Gets the first entity from the repository that satisfies the given predicate and applies the specified ordering and includes related entities.
    /// </summary>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="orderBy">A function to order entities.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the entity.</returns>
    Task<TEntity> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false);

    /// <summary>
    /// Gets a list of entities from the repository and maps them to the specified result type using AutoMapper.
    /// </summary>
    /// <typeparam name="TResult">The type to map the entities to.</typeparam>
    /// <param name="selector">A function to select properties of the entities.</param>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="orderBy">A function to order entities.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the list of mapped entities.</returns>
    Task<List<TResult>> GetListAsync<TResult>( 
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider mapConfig = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class;

    /// <summary>
    /// Gets a list of entities from the repository by their primary keys and maps them to the specified result type using AutoMapper.
    /// </summary>
    /// <typeparam name="TResult">The type to map the entities to.</typeparam>
    /// <param name="primaryKeys">The list of primary keys of the entities.</param>
    /// <param name="selector">A function to select properties of the entities.</param>
    /// <param name="orderBy">A function to order entities.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the list of mapped entities.</returns>
    Task<List<TResult>> GetListAsync<TResult>( 
        List<TPrimaryKey> primaryKeys,
        Expression<Func<TEntity, TResult>> selector = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider mapConfig = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class;
    
    /// <summary>
    /// Gets all entities from the repository and maps them to the specified result type using AutoMapper.
    /// </summary>
    /// <typeparam name="TResult">The type to map the entities to.</typeparam>
    /// <param name="selector">A function to select properties of the entities.</param>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="orderBy">A function to order entities.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="enableTracking">A flag indicating whether to enable change tracking.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>The queryable result set of mapped entities.</returns>
    IQueryable<TResult> GetAll<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        bool ignoreQueryFilters = false)
    where TResult : class;

    /// <summary>
    /// Gets all entities from the repository and maps them to the specified result type using AutoMapper.
    /// </summary>
    /// <typeparam name="TResult">The type to map the entities to.</typeparam>
    /// <param name="selector">A function to select properties of the entities.</param>
    /// <param name="predicate">The predicate to filter entities.</param>
    /// <param name="orderBy">A function to order entities.</param>
    /// <param name="include">A function to include related entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the queryable result set of mapped entities.</returns>
    Task<IQueryable<TResult>> GetAllAsync<TResult>( 
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class;
    
    #endregion get
}
