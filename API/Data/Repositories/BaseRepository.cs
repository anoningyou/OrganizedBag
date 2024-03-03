using Microsoft.EntityFrameworkCore;

namespace API;

public abstract class BaseRepository<TEntity, TPrimaryKey> : IBaseRepository<TEntity, TPrimaryKey>, IDisposable
 where TEntity : class, IIdentifiable<TPrimaryKey>
{

    #region fields

    protected DbContext _context;
    protected DbSet<TEntity> _dbSet;

    #endregion fields

    #region constructor

    public BaseRepository(DbContext context)
    {
        _context = context ?? throw new ArgumentException(nameof(context));
        _dbSet = _context.Set<TEntity>();
    }

    #endregion constructor

    #region public

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

    public virtual void Dispose()
    {
        _context?.Dispose();
    }

    #endregion dispose

    #region protected

    protected bool IsDetached(TEntity entity)
    {
        var localEntity = _context.Set<TEntity>().Local?.Where(w => Equals(w.Id, entity.Id)).FirstOrDefault();
        if (localEntity != null)
            return false;
        return _context.Entry(entity)?.State == EntityState.Detached;
    }

    #endregion protected
    
}
