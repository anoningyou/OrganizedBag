using Microsoft.EntityFrameworkCore;

namespace API;

/// <summary>
/// Base repository class that provides common functionality for all repositories.
/// </summary>
/// <typeparam name="TEntity">The type of the entity.</typeparam>
/// <typeparam name="TPrimaryKey">The type of the primary key.</typeparam>
public abstract class BaseRepository<TEntity, TPrimaryKey> : IBaseRepository<TEntity, TPrimaryKey>, IDisposable
 where TEntity : class, IIdentifiable<TPrimaryKey>
{

    #region fields

    protected DbContext _context;
    protected DbSet<TEntity> _dbSet;

    #endregion fields

    #region constructor

    /// <summary>
    /// Initializes a new instance of the <see cref="BaseRepository{TEntity}"/> class.
    /// </summary>
    /// <param name="context">The database context.</param>
    /// <exception cref="ArgumentException">Thrown when the context is null.</exception>
    public BaseRepository(DbContext context)
    {
        _context = context ?? throw new ArgumentException(nameof(context));
        _dbSet = _context.Set<TEntity>();
    }

    #endregion constructor

    #region public

    ///<inheritdoc/>
    public virtual EntityState CurrentEntityState(TEntity entity)
    {
        EntityState result = EntityState.Unchanged;
        var entityEntry = _context.ChangeTracker.Entries().Where(w => w.Entity == entity).FirstOrDefault();
        if (entityEntry != null)
            result = entityEntry.State;
        return result;
    }

    #endregion public

    #region dispose

    ///<inheritdoc/>
    public virtual void Dispose()
    {
        _context?.Dispose();
    }

    #endregion dispose

    #region protected

    /// <summary>
    /// Determines whether the specified entity is detached from the context.
    /// </summary>
    /// <param name="entity">The entity to check.</param>
    /// <returns><c>true</c> if the entity is detached; otherwise, <c>false</c>.</returns>
    protected bool IsDetached(TEntity entity)
    {
        TEntity localEntity = _context.Set<TEntity>().Local?.Where(w => Equals(w.Id, entity.Id)).FirstOrDefault();
        if (localEntity != null)
            return false;
        return _context.Entry(entity)?.State == EntityState.Detached;
    }

    #endregion protected
    
}