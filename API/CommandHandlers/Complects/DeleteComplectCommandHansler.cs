using API;
using API.Data;
using API.Data.Interfaces;
using API.Entities;

/// <summary>
/// Represents a command handler for deleting a complect.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class DeleteComplectCommandHansler(IUnitOfWork<DataContext> unitOfWork) 
    : ICommandHandler<DeleteComplectCommand, bool>
{
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Complect, Guid> _repository = unitOfWork.GetRepository<Complect, Guid>();

    ///<inheritdoc/>
    public async Task<bool> HandleAsync(DeleteComplectCommand command)
    {
        _repository.Remove(command.Id);

        return await _uow.Complete();
    }
}