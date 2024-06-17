using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;

/// <summary>
/// Contains classes related to the API functionality.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="AddOrUpdateParamsCommandHandler"/> class.
/// </remarks>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class AddOrUpdateParamsCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper)
    : ICommandHandler<AddOrUpdateParamsCommand, IEnumerable<PropertyParamDto>>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<PropertyParam, Guid> _repositoryPropertyParams = unitOfWork.GetRepository<PropertyParam, Guid>();

    /// <inheritdoc/>
    public async Task<IEnumerable<PropertyParamDto>> HandleAsync(AddOrUpdateParamsCommand command)
    {
        var propertyIds = command.PropertyParams.Select(p => p.PropertyId).ToList();
        var propertyParams = await _repositoryPropertyParams.GetListAsync<PropertyParam>(predicate: p => propertyIds.Contains(p.PropertyId) && p.UserId == command.UserId);
        var updateList = new List<PropertyParam>();
        var addList = new List<PropertyParam>();

        foreach (var paramDto in command.PropertyParams)
        {
            var param = propertyParams.FirstOrDefault(p => p.PropertyId == paramDto.PropertyId);
            if (param == null)
            {
                param = _mapper.Map<PropertyParam>(paramDto);
                param.UserId = command.UserId;
                addList.Add(param);
            }
            else
            {
                _mapper.Map(paramDto, param);
                updateList.Add(param);
            }
        }

        await _repositoryPropertyParams.AddRangeAsync(addList);

        await _uow.Complete();

        return command.PropertyParams;
    }
}