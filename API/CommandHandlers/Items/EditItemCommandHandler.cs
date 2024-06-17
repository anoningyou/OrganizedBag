using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API;

/// <summary>
/// Initializes a new instance of the <see cref="EditItemCommandHandler"/> class.
/// </summary>
/// <param name="unitOfWork">The unit of work.</param>
/// <param name="mapper">The mapper.</param>
public class EditItemCommandHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper)
    : ICommandHandler<EditItemCommand, ItemDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IUnitOfWork<DataContext> _uow = unitOfWork;
    private readonly IRepository<PropertyValue, Guid> _repositoryPropertyValues = unitOfWork.GetRepository<PropertyValue, Guid>();

    ///<inheritdoc/>
    public async Task<ItemDto> HandleAsync(EditItemCommand command)
    {
        List<PropertyValue> props = await _repositoryPropertyValues
            .GetListAsync<PropertyValue>(predicate: p => p.ItemId == command.ItemDto.Id);
        
        foreach (PropertyValueDto val in command.ItemDto.Values)
        {
            val.ItemId = command.ItemDto.Id;
        }

        List<PropertyValue> propsForUpdate = [];
        List<PropertyValue> propsForDelete = [];

        foreach (PropertyValue prop in props)
        {
            PropertyValueDto propForUpdate = command
                .ItemDto
                .Values
                .FirstOrDefault(v => v.PropertyId == prop.PropertyId);

            if (propForUpdate != null)
            {
                propsForUpdate.Add(_mapper.Map<PropertyValue>(propForUpdate));
            }
            else 
            {
                propsForDelete.Add(prop);
            }
        }

        IEnumerable<PropertyValue> propsForAdd = command.ItemDto.Values
            .Where(v => !propsForUpdate.Any(p => p.PropertyId == v.PropertyId))
            .Select(v => _mapper.Map<PropertyValue>(v));
            
        await _repositoryPropertyValues.RemoveRangeAsync(propsForDelete);
        await _repositoryPropertyValues.AddRangeAsync(propsForAdd);

        await _uow.Complete();

        return command.ItemDto;
    }
}