using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace API;

/// <summary>
/// Represents a generic readonly repository implementation.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
/// <typeparam name="TPrimaryKey">The type of the primary key.</typeparam>
/// <remarks>
/// Initializes a new instance of the <see cref="RepositoryReadonly{TEntity, TPrimaryKey}"/> class.
/// </remarks>
/// <param name="context">The database context.</param>
public class RepositoryReadonly<TEntity, TPrimaryKey>(DbContext context) : IBaseRepository<TEntity, TPrimaryKey>, IRepositoryReadonly<TEntity, TPrimaryKey>
    where TEntity : class, IIdentifiable<TPrimaryKey>
{
    private readonly IRepository<TEntity, TPrimaryKey> _repository = new Repository<TEntity, TPrimaryKey>(context);

    #region base

    /// <inheritdoc/>
    public EntityState CurrentEntityState(TEntity entity)
    {
        return _repository.CurrentEntityState(entity);
    }

    /// <inheritdoc/>
    public void Dispose()
    {
        _repository.Dispose();
    }

    #endregion base

    #region get

    /// <inheritdoc/>
    public Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return _repository.ExistsAsync(predicate, cancellationToken);
    }

    /// <inheritdoc/>
    public Task<TEntity> GetAsync(
        TPrimaryKey id,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default)
    {
        return _repository.GetAsync(id, include, enableTracking: false, cancellationToken);
    }

    /// <inheritdoc/>
    public Task<TEntity> GetAsync(
        Expression<Func<TEntity, bool>> predicate,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default)
    {
        return _repository.GetAsync(
            predicate,
            include,
            false,
            cancellationToken);
    }

    /// <inheritdoc/>
    public Task<TResult> GetAsync<TResult>(
        TPrimaryKey id,
        AutoMapper.IConfigurationProvider mapConfig,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default)
    where TResult : class
    {
        return _repository.GetAsync<TResult>(
            id,
            mapConfig,
            include,
            false,
            cancellationToken);
    }

    /// <inheritdoc/>
    public Task<TResult> GetAsync<TResult>(
        Expression<Func<TEntity, bool>> predicate,
        AutoMapper.IConfigurationProvider mapConfig,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default)
    where TResult : class
    {
        return _repository.GetAsync<TResult>(
            predicate,
            mapConfig,
            include,
            false,
            cancellationToken);
    }

    /// <inheritdoc/>
    public Task<TEntity> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    {
        return _repository.FirstOrDefaultAsync(
            predicate,
            orderBy,
            include,
            false,
            cancellationToken,
            ignoreQueryFilters);
    }

    /// <inheritdoc/>
    public Task<List<TResult>> GetListAsync<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider mapConfig = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        return _repository.GetListAsync(
            selector,
            predicate,
            orderBy,
            include,
            mapConfig,
            false,
            cancellationToken,
            ignoreQueryFilters);
    }

    /// <inheritdoc/>
    public Task<List<TResult>> GetListAsync<TResult>(
        List<TPrimaryKey> primaryKeys,
        Expression<Func<TEntity, TResult>> selector = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider mapConfig = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        return _repository.GetListAsync(
            primaryKeys,
            selector,
            orderBy,
            include,
            mapConfig,
            false,
            cancellationToken,
            ignoreQueryFilters);
    }

    /// <inheritdoc/>
    public IQueryable<TResult> GetAll<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        return _repository.GetAll(
            selector,
            predicate,
            orderBy,
            include,
            false,
            ignoreQueryFilters);
    }

    /// <inheritdoc/>
    public Task<IQueryable<TResult>> GetAllAsync<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        return _repository.GetAllAsync(
            selector,
            predicate,
            orderBy,
            include,
            false,
            cancellationToken,
            ignoreQueryFilters);
    }

    #endregion get
}