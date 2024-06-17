using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;


/// <summary>
/// Represents a command handler for adding a complect.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class AddComplectCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
    : ICommandHandler<AddComplectCommand, ComplectDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Complect, Guid> _repositoryComplects = 
        unitOfWork.GetRepository<Complect, Guid>();

    ///<inheritdoc/>
    public async Task<ComplectDto> HandleAsync(AddComplectCommand command)
    {
        if (command.Complect.Id == Guid.Empty)
            command.Complect.Id = Guid.NewGuid();

        foreach (GroupDto group in command.Complect.Groups)
        {
            group.ComplectId = command.Complect.Id;

            foreach (GroupItemDto item in group.Items)
            {
                item.GroupId = group.Id;
            }
        }

        Complect complect = _mapper.Map<Complect>(command.Complect);
        complect.UserId = command.UserId;

        await _repositoryComplects.AddAsync(complect);

        await _uow.Complete();

        return command.Complect;
    }
}