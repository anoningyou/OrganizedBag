using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;

/// <summary>
/// Handles the command for adding a group.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class AddGroupCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
: ICommandHandler<AddGroupCommand, GroupDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Group, Guid> _repositoryGroups = unitOfWork.GetRepository<Group, Guid>();

    ///<inheritdoc/>
    public async Task<GroupDto> HandleAsync(AddGroupCommand command)
    {
        await _repositoryGroups
            .AddAsync(_mapper.Map<Group>(command.Group));

        await _uow.Complete();

        return command.Group;
    }
}