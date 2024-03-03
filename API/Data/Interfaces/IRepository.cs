using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

namespace API;

/// <summary>
/// Represents a generic repository interface for performing CRUD operations on entities.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
/// <typeparam name="TPrimaryKey">The type of the primary key.</typeparam>
public interface IRepository <TEntity, TPrimaryKey> : IBaseRepository <TEntity, TPrimaryKey>
    where TEntity : class, IIdentifiable<TPrimaryKey>
{

    #region add

    /// <summary>
    /// Adds an entity to the repository.
    /// </summary>
    /// <typeparam name="TEntity">The type of the entity.</typeparam>
    /// <param name="entity">The entity to add.</param>
    /// <returns>The added entity.</returns>
    TEntity Add(TEntity entity);

    /// <summary>
    /// Adds a new entity to the repository asynchronously.
    /// </summary>
    /// <param name="entity">The entity to be added.</param>
    /// <param name="cancellationToken">A cancellation token to cancel the operation.</param>
    /// <returns>A task representing the asynchronous operation. The task result contains the added entity.</returns>
    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a range of entities to the repository.
    /// </summary>
    /// <param name="entityList">The list of entities to add.</param>
    void AddRange(List<TEntity> entityList);

    /// <summary>
    /// Adds a range of entities to the repository asynchronously.
    /// </summary>
    /// <param name="entityList">The list of entities to add.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task AddRangeAsync(List<TEntity> entityList, CancellationToken cancellationToken = default);

    #endregion add

    #region get

    /// <summary>
    /// Checks if any entity matching the specified predicate exists in the repository.
    /// </summary>
    /// <param name="predicate">The predicate used to filter the entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether any entity exists.</returns>
    Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);

    Task<TEntity> GetAsync(
        TPrimaryKey id,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single entity asynchronously based on the specified predicate.
    /// </summary>
    /// <param name="predicate">The predicate used to filter the entities.</param>
    /// <param name="include">A function to include related entities in the query results.</param>
    /// <param name="enableTracking">A flag indicating whether to enable change tracking for the retrieved entity.</param>
    /// <param name="cancellationToken">A cancellation token to cancel the asynchronous operation.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the retrieved entity.</returns>
    Task<TEntity> GetAsync(
        Expression<Func<TEntity, bool>> predicate,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Retrieves an entity asynchronously based on the specified primary key.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="id">The primary key of the entity to retrieve.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="include">A function to specify related entities to include in the query.</param>
    /// <param name="enableTracking">A flag indicating whether to enable change tracking for the retrieved entity.</param>
    /// <param name="cancellationToken">A cancellation token to cancel the asynchronous operation.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the retrieved entity.</returns>
    Task<TResult> GetAsync<TResult>(
        TPrimaryKey id,
        AutoMapper.IConfigurationProvider mapConfig,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default)
    where TResult : class;

    /// <summary>
    /// Retrieves a single entity asynchronously based on the specified predicate.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="predicate">The predicate used to filter the entities.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="include">A function to specify related entities to include in the query.</param>
    /// <param name="enableTracking">A flag indicating whether to enable change tracking for the retrieved entity.</param>
    /// <param name="cancellationToken">A cancellation token to cancel the asynchronous operation.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the retrieved entity.</returns>
    Task<TResult> GetAsync<TResult>(
        Expression<Func<TEntity, bool>> predicate,
        AutoMapper.IConfigurationProvider mapConfig,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default)
    where TResult : class;

    /// <summary>
    /// Retrieves the first entity that matches the specified predicate asynchronously.
    /// </summary>
    /// <param name="predicate">The predicate used to filter the entities.</param>
    /// <param name="orderBy">The function used to order the entities.</param>
    /// <param name="include">The function used to include related entities.</param>
    /// <param name="enableTracking">A flag indicating whether to enable change tracking for the entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the first entity that matches the specified predicate.</returns>
    Task<TEntity> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>,
        IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false);

    /// <summary>
    /// Retrieves a list of entities asynchronously based on the specified criteria.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="selector">The selector expression used to project the entity.</param>
    /// <param name="predicate">The predicate expression used to filter the entities.</param>
    /// <param name="orderBy">The ordering expression used to sort the entities.</param>
    /// <param name="include">The include expression used to eagerly load related entities.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider used for mapping.</param>
    /// <param name="enableTracking">A flag indicating whether to enable entity tracking.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the list of entities.</returns>
    /// <remarks>
    /// This method retrieves a list of entities from the repository based on the specified criteria.
    /// The selector expression is used to project the entity into the desired result type.
    /// The predicate expression is used to filter the entities.
    /// The orderBy expression is used to sort the entities.
    /// The include expression is used to eagerly load related entities.
    /// The mapConfig parameter is used to configure AutoMapper for mapping the entities.
    /// The enableTracking parameter determines whether entity tracking is enabled.
    /// The cancellationToken parameter can be used to cancel the asynchronous operation.
    /// The ignoreQueryFilters parameter determines whether query filters should be ignored.
    /// </remarks>
    Task<List<TResult>> GetListAsync<TResult>( 
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider mapConfig = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class;

    /// <summary>
    /// Retrieves a list of entities asynchronously based on the provided primary keys.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="primaryKeys">The primary keys of the entities to retrieve.</param>
    /// <param name="selector">The selector expression to apply to the retrieved entities.</param>
    /// <param name="orderBy">The ordering function to apply to the retrieved entities.</param>
    /// <param name="include">The include function to apply to the retrieved entities.</param>
    /// <param name="mapConfig">The AutoMapper configuration provider.</param>
    /// <param name="enableTracking">A flag indicating whether to enable entity tracking.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the list of retrieved entities.</returns>
    Task<List<TResult>> GetListAsync<TResult>( 
        List<TPrimaryKey> primaryKeys,
        Expression<Func<TEntity, TResult>> selector = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider mapConfig = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class;
    
    /// <summary>
    /// Retrieves all entities from the repository.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="selector">The selector expression to apply to each entity.</param>
    /// <param name="predicate">The predicate expression to filter the entities.</param>
    /// <param name="orderBy">The ordering function to sort the entities.</param>
    /// <param name="include">The include function to eagerly load related entities.</param>
    /// <param name="enableTracking">Specifies whether to enable change tracking for the entities.</param>
    /// <param name="ignoreQueryFilters">Specifies whether to ignore query filters applied to the entities.</param>
    /// <returns>An <see cref="IQueryable{TResult}"/> representing the result of the query.</returns>
    IQueryable<TResult> GetAll<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        bool ignoreQueryFilters = false)
    where TResult : class;

    /// <summary>
    /// Retrieves all entities from the repository asynchronously.
    /// </summary>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <param name="selector">The selector expression to apply to each entity.</param>
    /// <param name="predicate">The predicate expression to filter the entities.</param>
    /// <param name="orderBy">The ordering expression to sort the entities.</param>
    /// <param name="include">The include expression to eagerly load related entities.</param>
    /// <param name="enableTracking">A flag indicating whether to enable change tracking for the entities.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <param name="ignoreQueryFilters">A flag indicating whether to ignore query filters.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the collection of entities.</returns>
    Task<IQueryable<TResult>> GetAllAsync<TResult>( 
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class;
    
    #endregion get

    #region delete
                                                
    /// <summary>
    /// Removes a range of entities from the repository.
    /// </summary>
    /// <param name="entityList">The list of entities to be removed.</param>
    void RemoveRange(List<TEntity> entityList);

    /// <summary>
    /// Removes a range of entities asynchronously.
    /// </summary>
    /// <param name="entityList">The list of entities to be removed.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task RemoveRangeAsync(IQueryable<TEntity> entityList);

    /// <summary>
    /// Removes the specified entity from the repository.
    /// </summary>
    /// <param name="entity">The entity to remove.</param>
    void Remove(TEntity entity);
    
    /// <summary>
    /// Removes the specified entity asynchronously.
    /// </summary>
    /// <param name="entity">The entity to remove.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    Task RemoveAsync(TEntity entity);
    
    #endregion delete
   
}
