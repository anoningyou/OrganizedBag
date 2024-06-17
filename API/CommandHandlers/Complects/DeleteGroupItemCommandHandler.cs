using API;
using API.Data;
using API.Data.Interfaces;
using API.Entities;
using API.Exceptions;
using AutoMapper;

/// <summary>
/// Represents a command handler for deleting a group item.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class DeleteGroupItemCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
    : ICommandHandler<DeleteGroupItemCommand, bool>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<GroupItem, Guid> _repository = unitOfWork.GetRepository<GroupItem, Guid>();

    ///<inheritdoc/>
    public async Task<bool> HandleAsync(DeleteGroupItemCommand command)
    {
        GroupItem entity = await _repository
            .FirstOrDefaultAsync(i => i.GroupId == command.Item.GroupId
                                   && i.ItemId == command.Item.ItemId)
            ?? throw new RecordNotFoundException(nameof(GroupItem),
                                                 new{command.Item.GroupId, command.Item.ItemId});
                
        _repository.Remove(entity);

        return await _uow.Complete();
    }
}