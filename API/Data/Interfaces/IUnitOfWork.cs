namespace API.Data.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}  
        IPropertyRepository PropertyRepository {get;}  

        Task<bool> Complete();
        bool HasChanges();      
    }
}