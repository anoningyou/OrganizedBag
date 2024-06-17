using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;

/// <summary>
/// Represents a command handler for adding a group item.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class AddGroupItemCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
: ICommandHandler<AddGroupItemCommand, GroupItemDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<GroupItem, Guid> _repositoryGroupItems = unitOfWork
        .GetRepository<GroupItem, Guid>();
    
    ///<inheritdoc/>
    public async Task<GroupItemDto> HandleAsync(AddGroupItemCommand command)
    {
        await _repositoryGroupItems
            .AddAsync(_mapper.Map<GroupItem>(command.Item));

        await _uow.Complete();

        return command.Item;
    }
}