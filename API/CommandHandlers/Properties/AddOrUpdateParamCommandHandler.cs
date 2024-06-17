using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;

/// <summary>
/// Represents a command handler for adding or updating a property parameter.
/// </summary>
/// <typeparam name="AddOrUpdateParamCommand">The type of the command.</typeparam>
/// <typeparam name="PropertyParamDto">The type of the property parameter DTO.</typeparam>
/// <remarks>
/// Initializes a new instance of the <see cref="AddOrUpdateParamCommandHandler"/> class.
/// </remarks>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class AddOrUpdateParamCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper)
    : ICommandHandler<AddOrUpdateParamCommand, PropertyParamDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<PropertyParam, Guid> _repositoryPropertyParams = unitOfWork.GetRepository<PropertyParam, Guid>();

    ///<inheritdoc/>
    public async Task<PropertyParamDto> HandleAsync(AddOrUpdateParamCommand command)
    {
        var param = await _repositoryPropertyParams.FirstOrDefaultAsync(predicate: p => p.PropertyId == command.PropertyParam.PropertyId && p.UserId == command.UserId);

        if (param == null)
        {
            param = _mapper.Map<PropertyParam>(command.PropertyParam);
            param.UserId = command.UserId;
            await _repositoryPropertyParams.AddAsync(param);
        }
        else 
        {
            _mapper.Map(command.PropertyParam, param);
        }

        await _uow.Complete();
        
        return command.PropertyParam;
    }
}