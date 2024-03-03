using API.Data.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Data
{
    public class UnitOfWork<TContext> : IUnitOfWork<TContext>, IDisposable
        where TContext : DbContext, IDisposable
    {
        #region Private

        private bool _disposed;
        private Dictionary<(Type type, string name), object> _repositories;
        private DbContext _context;

        #endregion Private

        #region Constructor

        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        public UnitOfWork(TContext context)
        {
            _repositories = new Dictionary<(Type type, string Name), object>();
            _context = context ?? throw new ArgumentNullException(nameof(context));
            // _mapper = mapper;
            // _dataContext = dataContext;
        }

        #endregion Constructor

        #region Repository

        public IRepository<TEntity, TPrimaryKey> GetRepository<TEntity, TPrimaryKey>()
            where TEntity : class, IIdentifiable<TPrimaryKey>
        {
            var repo = new Repository<TEntity, TPrimaryKey>(GetContext());
            _repositories.Add((typeof(TEntity), repo.GetType().FullName), repo);
            return repo;
        }

        #endregion Repository

        #region Public

        public void Clear()
        {
            if (!_disposed)
                _context.ChangeTracker.Clear();
        }

        #endregion Public

        #region PrivateMethods

        private DbContext GetContext()
        {
            return _context;
        }

        private object GetOrAddRepository(Type type, object repo)
        {
            if (_repositories.TryGetValue((type, repo.GetType().FullName), out var repository)) return repository;
            _repositories.Add((type, repo.GetType().FullName), repo);
            return repo;
        }

        #endregion PrivateMethods

        #region Dispose

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    Clear();

                    if (_repositories != null && _repositories.Any())
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

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        #endregion Dispose

        #region Transaction

        public IDbContextTransaction BeginTransaction()
        {
            return _context.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            _context.Database.CommitTransaction();
        }

        public void RollbackTransaction()
        {
            _context.Database.RollbackTransaction();
        }


        #endregion Transaction

        //private readonly DataContext _context;
        //private readonly IMapper _mapper;
        // public UnitOfWork(DataContext context, IMapper mapper)
        // {
        //     _mapper = mapper;
        //     _context = context;     
        // }

        public IUserRepository UserRepository => new UserRepository(_dataContext,_mapper);

        public IPropertyRepository PropertyRepository => new PropertyRepository(_dataContext,_mapper);

        public IItemsRepository ItemsRepository => new ItemsRepository(_dataContext,_mapper);

        public IComplectsRepository ComplectsRepository => new ComplectsRepository(_dataContext,_mapper);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync()>0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}