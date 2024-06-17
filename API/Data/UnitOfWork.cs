using API.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Data;

/// <summary>
/// Represents a unit of work implementation that manages the repositories and transactions for a specific database context.
/// </summary>
/// <typeparam name="TContext">The type of the database context.</typeparam>
public class UnitOfWork<TContext>(TContext context) : IUnitOfWork<TContext>, IDisposable
    where TContext : DbContext, IDisposable
{

    #region Private fields

    private bool _disposed;
    private Dictionary<(Type type, string name), object> _repositories = [];
    private DbContext _context = context ?? throw new ArgumentNullException(nameof(context));

    #endregion Private fields

    #region Repository

    ///<inheritdoc/>
    public IRepository<TEntity, TPrimaryKey> GetRepository<TEntity, TPrimaryKey>()
        where TEntity : class, IIdentifiable<TPrimaryKey>
    {
        Repository<TEntity, TPrimaryKey> repo = null;
        
        if (_repositories.TryGetValue((typeof(TEntity), typeof(Repository<TEntity, TPrimaryKey>).FullName), out var repository))
            repo = (Repository<TEntity, TPrimaryKey>)repository;
        else
        {
            repo = new Repository<TEntity, TPrimaryKey>(GetContext());
            _repositories.Add((typeof(TEntity), repo.GetType().FullName), repo);
        }

        return repo;
    }

    ///<inheritdoc/>
    public IRepositoryReadonly<TEntity, TPrimaryKey> GetRepositoryReadonly<TEntity, TPrimaryKey>()
        where TEntity : class, IIdentifiable<TPrimaryKey>
    {
        RepositoryReadonly<TEntity, TPrimaryKey> repo = null;

        if (_repositories.TryGetValue((typeof(TEntity), typeof(RepositoryReadonly<TEntity, TPrimaryKey>).FullName), out var repository))
            repo = (RepositoryReadonly<TEntity, TPrimaryKey>)repository;
        else
        {
            repo = new RepositoryReadonly<TEntity, TPrimaryKey>(GetContext());
            _repositories.Add((typeof(TEntity), repo.GetType().FullName), repo);
        }

        return repo;
    }

    #endregion Repository

    #region Public

    ///<inheritdoc/>
    public void Clear()
    {
        if (!_disposed)
            _context.ChangeTracker.Clear();
    }

    ///<inheritdoc/>
    public async Task<bool> Complete()
    {
        return await _context.SaveChangesAsync()>0;
    }

    ///<inheritdoc/>
    public bool HasChanges()
    {
        return _context.ChangeTracker.HasChanges();
    }

    #endregion Public

    #region Private Methods

    private DbContext GetContext()
    {
        return _context;
    }

    #endregion Private Methods

    #region Dispose

    /// <summary>
    /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
    /// </summary>
    /// <param name="disposing">True if called from the <see cref="Dispose"/> method, false if called from the finalizer.</param>
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                Clear();

                if (_repositories != null && _repositories.Count != 0)
                {
                    foreach (var repoItem in _repositories.Values)
                    {
                        if (repoItem is IDisposable disposable) disposable.Dispose();
                    }
                    _repositories?.Clear();
                }
                _repositories = null;
                
                _context?.Dispose();
                _context = null;
            }
        }
        _disposed = true;
    }

    ///<inheritdoc/>
    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    #endregion Dispose

    #region Transaction

    ///<inheritdoc/>
    public IDbContextTransaction BeginTransaction()
    {
        return _context.Database.BeginTransaction();
    }

    ///<inheritdoc/>
    public void CommitTransaction()
    {
        _context.Database.CommitTransaction();
    }

    ///<inheritdoc/>
    public void RollbackTransaction()
    {
        _context.Database.RollbackTransaction();
    }

    #endregion Transaction

}