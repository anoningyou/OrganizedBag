using API;
using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using API.Exceptions;
using AutoMapper;

/// <summary>
/// Represents a command handler for updating a Complect.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class UpdateComplectCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
    : ICommandHandler<UpdateComplectCommand, ComplectDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<Complect, Guid> _repository = unitOfWork.GetRepository<Complect, Guid>();

    ///<inheritdoc/>
    public async Task<ComplectDto> HandleAsync(UpdateComplectCommand command)
    {
        Complect complect = _mapper.Map<Complect>(command.Complect);
        
        complect.Groups = null;
        complect.UserId = command.UserId;

        _repository.Update(complect);

        await _uow.Complete();

        return command.Complect;  
    }
}