using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Data.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<TEntity, TPrimaryKey> GetRepository<TEntity, TPrimaryKey>()
            where TEntity : class, IIdentifiable<TPrimaryKey>;

        IUserRepository UserRepository {get;}  
        IPropertyRepository PropertyRepository {get;}  
        IItemsRepository ItemsRepository {get;} 
        IComplectsRepository ComplectsRepository {get;}

        Task<bool> Complete();
        bool HasChanges(); 

        IDbContextTransaction BeginTransaction();
        void CommitTransaction();
        void RollbackTransaction();     
    }

    public interface IUnitOfWork<TContext> : IUnitOfWork
        where TContext : DbContext
    {       
        void Clear();       
    }
}