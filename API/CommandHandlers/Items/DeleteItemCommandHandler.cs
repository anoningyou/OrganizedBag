
using API.Data;
using API.Data.Interfaces;
using API.Entities;

namespace API;

/// <summary>
/// Initializes a new instance of the <see cref="DeleteItemCommandHandler"/> class.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
public class DeleteItemCommandHandler(IUnitOfWork<DataContext> unitOfWork) 
    : ICommandHandler<DeleteItemCommand, bool>
{
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Item, Guid> _repositoryItems = unitOfWork.GetRepository<Item, Guid>();

    ///<inheritdoc/>
    public async Task<bool> HandleAsync(DeleteItemCommand command)
    {
        await _repositoryItems.RemoveAsync(command.ItemId);

        return await _uow.Complete();
    }
}