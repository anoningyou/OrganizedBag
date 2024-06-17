using API.Entities;
using AutoMapper;

namespace API;

/// <summary>
/// Represents a query handler for retrieving an item.
/// </summary>
public class GetItemQueryHandler(IMapper mapper) : IQueryHandler<GetItemQuery, Item>
{
    private readonly IMapper _mapper = mapper;

    ///<inheritdoc/>
    public async Task<Item> HandleAsync(GetItemQuery query)
    {
        if (query.ItemDto.Id == Guid.Empty)
            query.ItemDto.Id = Guid.NewGuid();

        Item item = _mapper.Map<Item>(query.ItemDto);
        item.UserId = query.UserId;

        foreach (PropertyValue val in item.Values)
        {
            val.ItemId = item.Id;
        }

        return await Task.FromResult(item);
    }
}