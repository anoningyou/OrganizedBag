using API;
using API.Data;
using API.Data.Interfaces;
using API.Entities;

/// <summary>
/// Represents a command handler for deleting a group.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class DeleteGroupCommandHandler(IUnitOfWork<DataContext> unitOfWork) 
    : ICommandHandler<DeleteGroupCommand, bool>
{
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Group, Guid> _repository = unitOfWork.GetRepository<Group, Guid>();

    ///<inheritdoc/>
    public async Task<bool> HandleAsync(DeleteGroupCommand command)
    {
        _repository.Remove(command.Id);

        return await _uow.Complete();
    }
}