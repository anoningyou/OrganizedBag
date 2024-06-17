using API;
using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using API.Exceptions;
using AutoMapper;

/// <summary>
/// Represents a command handler for updating a group item.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class UpdateGroupItemCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
    : ICommandHandler<UpdateGroupItemCommand, GroupItemDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<GroupItem, Guid> _repository = unitOfWork.GetRepository<GroupItem, Guid>();

    ///<inheritdoc/>
    public async Task<GroupItemDto> HandleAsync(UpdateGroupItemCommand command)
    {
        GroupItem entity = await _repository
            .FirstOrDefaultAsync(i => i.GroupId == command.Item.GroupId
                                   && i.ItemId == command.Item.ItemId)
            ?? throw new RecordNotFoundException(nameof(GroupItem),
                                                 new{command.Item.GroupId, command.Item.ItemId});
        
        _mapper.Map(command.Item, entity);

        await _uow.Complete();

        return command.Item;  
    }
}