using System.Linq.Expressions;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;

namespace API;

///<inheritdoc/>
/// <summary>
/// Represents a generic repository implementation that provides CRUD operations for entities.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
/// <typeparam name="TPrimaryKey">The type of the primary key of the entity.</typeparam>
/// <remarks>
/// Initializes a new instance of the <see cref="Repository{TEntity, TPrimaryKey}"/> class.
/// </remarks>
/// <param name="context">The database context.</param>
public class Repository<TEntity, TPrimaryKey>(DbContext context) : BaseRepository<TEntity, TPrimaryKey>(context), IRepository<TEntity, TPrimaryKey>
where TEntity : class, IIdentifiable<TPrimaryKey>
{

    #region add

    ///<inheritdoc/>
    public virtual TEntity Add(TEntity entity)
    {
        return _dbSet.Add(entity).Entity;
    }

    ///<inheritdoc/>
    public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        EntityEntry<TEntity> result = await _dbSet.AddAsync(entity, cancellationToken);

        return result.Entity;
    }

    ///<inheritdoc/>
    public virtual void AddRange(IEnumerable<TEntity> entityList)
    {
        if (entityList?.Any() != true)
            return;

        _dbSet.AddRange(entityList);
    }

    ///<inheritdoc/>
    public virtual async Task AddRangeAsync(IEnumerable<TEntity> entityList, CancellationToken cancellationToken = default)
    {
        if (entityList?.Any() != true)
            return;

        await _context.AddRangeAsync(entityList, cancellationToken);
    }

    #endregion add

    #region update

    ///<inheritdoc/>
    public virtual TEntity Update(TEntity entity)
    {
        return _dbSet.Update(entity).Entity;
    }

    ///<inheritdoc/>
    public virtual async Task<TEntity> UpdateAsync(TEntity entity)
    {
        return await Task.FromResult(_dbSet.Update(entity).Entity);
    }

    ///<inheritdoc/>
    public virtual void UpdateRange(IEnumerable<TEntity> entityList)
    {
        if (!entityList?.Any() != true)
            return;

        _dbSet.UpdateRange(entityList);
    }

    ///<inheritdoc/>
    public virtual async Task UpdateRangeAsync(IEnumerable<TEntity> entityList)
    {
        if (!entityList?.Any() != true)
            return;

        UpdateRange(entityList);

        await Task.CompletedTask;
    }

    #endregion update

    #region get

    ///<inheritdoc/>
    public virtual async Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().AnyAsync(predicate, cancellationToken);
    }

    ///<inheritdoc/>
    public async Task<TEntity> GetAsync(
        TPrimaryKey id,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default)
    {
        return await GetAsync(e => e.Id.Equals(id), include, enableTracking, cancellationToken);
    }

    ///<inheritdoc/>
    public virtual async Task<TEntity> GetAsync(
        Expression<Func<TEntity, bool>> predicate, Func<IQueryable<TEntity>,
        IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        CancellationToken cancellationToken = default)
    {
        IQueryable<TEntity> query = _dbSet;
        
        if (!enableTracking) 
            query = query.AsNoTracking();
        if (include != null) 
            query = include(query);
        if (predicate != null) 
            query = query.Where(predicate);

        return await query.FirstOrDefaultAsync(cancellationToken);
    }

    ///<inheritdoc/>
    public async Task<TResult> GetAsync<TResult>(
        TPrimaryKey id,
        AutoMapper.IConfigurationProvider configurationProvider,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = true,
        CancellationToken cancellationToken = default)
    where TResult : class
    {
        return await GetAsync<TResult>(e => e.Id.Equals(id),
            configurationProvider,
            include,
            enableTracking,
            cancellationToken);
    }

    ///<inheritdoc/>
    public virtual async Task<TResult> GetAsync<TResult>(
        Expression<Func<TEntity, bool>> predicate,
        AutoMapper.IConfigurationProvider configurationProvider,
        Func<IQueryable<TEntity>,IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        CancellationToken cancellationToken = default)
    where TResult : class
    {
        IQueryable<TEntity> query = _dbSet;
        
        if (!enableTracking) 
            query = query.AsNoTracking();
        if (include != null) 
            query = include(query);
        if (predicate != null) 
            query = query.Where(predicate);
        return await query.ProjectTo<TResult>(configurationProvider).FirstOrDefaultAsync(cancellationToken);
    }

    ///<inheritdoc/>
    public virtual async Task<TEntity> FirstOrDefaultAsync(
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    {
        IQueryable<TEntity> query = _dbSet;
        if (!enableTracking) 
            query = query.AsNoTracking();
        if (include != null) 
            query = include(query);
        if (predicate != null) 
            query = query.Where(predicate);

        return await query.FirstOrDefaultAsync(cancellationToken);
    }

    ///<inheritdoc/>
    public virtual async Task<List<TResult>> GetListAsync<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider configurationProvider = null,
        bool enableTracking = false,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        IQueryable<TEntity> query = _dbSet;

        if (!enableTracking)
            query = query.AsNoTracking();
        if (include != null)
            query = include(query);
        if (predicate != null)
            query = query.Where(predicate);
        if (ignoreQueryFilters)
            query = query.IgnoreQueryFilters();

        if (orderBy != null)
            query = orderBy(query);
        
        if (selector != null)
            return await query.Select(selector).ToListAsync(cancellationToken);
        else if (configurationProvider != null && typeof(TEntity) != typeof(TResult))
            return await query.ProjectTo<TResult>(configurationProvider).ToListAsync(cancellationToken);
        else {
            selector = entity => entity is TResult
                ? (TResult)(object)entity
                : default;
            return await query.Select(selector).ToListAsync(cancellationToken);
        }
    }

    ///<inheritdoc/>
    public virtual async Task<List<TResult>> GetListAsync<TResult>(
        List<TPrimaryKey> primaryKeys,
        Expression<Func<TEntity, TResult>> selector,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        AutoMapper.IConfigurationProvider configurationProvider = null,
        bool enableTracking = false,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        Expression<Func<TEntity, bool>> predicate = x => primaryKeys.Contains(x.Id);
        return await GetListAsync(selector, predicate, orderBy, include, configurationProvider, enableTracking, cancellationToken, ignoreQueryFilters);
    }

    ///<inheritdoc/>
    public virtual IQueryable<TResult> GetAll<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        IQueryable<TEntity> query = _dbSet;
        if (!enableTracking)
            query = query.AsNoTracking();
        if (include != null)
            query = include(query);
        if (predicate != null)
            query = query.Where(predicate);
        if (ignoreQueryFilters)
            query = query.IgnoreQueryFilters();
        if (selector == null)
            selector = entity => entity is TResult
                ? (TResult)(object)entity
                : default;
                
        if (orderBy != null)
            return orderBy(query).Select(selector);

        return query.Select(selector);
    }

    ///<inheritdoc/>
    public virtual async Task<IQueryable<TResult>> GetAllAsync<TResult>(
        Expression<Func<TEntity, TResult>> selector = null,
        Expression<Func<TEntity, bool>> predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
        bool enableTracking = false,
        CancellationToken cancellationToken = default,
        bool ignoreQueryFilters = false)
    where TResult : class
    {
        return await Task.Run(() => { return GetAll(selector, predicate, orderBy, include, enableTracking,  ignoreQueryFilters); }, cancellationToken);
    }

    #endregion get

    #region delete

    ///<inheritdoc/>
    public virtual void Remove(TEntity entity)
    {
        _dbSet.Remove(entity);
    }

    ///<inheritdoc/>
    public virtual async Task RemoveAsync(TEntity entity)
    {
        _dbSet.Remove(entity);
        await Task.CompletedTask;
    }

    ///<inheritdoc/>
    public virtual void Remove(TPrimaryKey id)
    {
        TEntity entity = Activator.CreateInstance<TEntity>();
        entity.Id = id;

        Remove(entity);
    }

    ///<inheritdoc/>
    public virtual async Task RemoveAsync(TPrimaryKey id)
    {
        TEntity entity = Activator.CreateInstance<TEntity>();
        entity.Id = id;
        
        await RemoveAsync(entity);
    }

    ///<inheritdoc/>
    public virtual void RemoveRange(IEnumerable<TEntity> entityList)
    {
        _dbSet.RemoveRange(entityList);
    }

    ///<inheritdoc/>
    public virtual async Task RemoveRangeAsync(IEnumerable<TEntity> entityList)
    {
        _dbSet.RemoveRange(entityList);
        await Task.CompletedTask;
    }

    #endregion delete

}