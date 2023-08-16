namespace API.Data.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}  
        IPropertyRepository PropertyRepository {get;}  
        IItemsRepository ItemsRepository {get;} 
        IComplectsRepository ComplectsRepository {get;}

        Task<bool> Complete();
        bool HasChanges();      
    }
}