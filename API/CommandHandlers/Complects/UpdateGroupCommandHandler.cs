using API;
using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using API.Exceptions;
using AutoMapper;

/// <summary>
/// Handles the command to update a group.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class UpdateGroupCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
    : ICommandHandler<UpdateGroupCommand, GroupDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Group, Guid> _repository = unitOfWork.GetRepository<Group, Guid>();

    ///<inheritdoc/>
    public async Task<GroupDto> HandleAsync(UpdateGroupCommand command)
    {
        command.Group.Items = null;

        _repository.Update(_mapper.Map<Group>(command.Group));

        await _uow.Complete();

        return command.Group;  
    }
}