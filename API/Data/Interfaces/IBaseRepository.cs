using Microsoft.EntityFrameworkCore;

namespace API;

public interface IBaseRepository <TEntity, TPrimaryKey> : IDisposable
    where TEntity : class, IIdentifiable<TPrimaryKey>
{
    EntityState CurrentEntityState(TEntity entity); 
}
