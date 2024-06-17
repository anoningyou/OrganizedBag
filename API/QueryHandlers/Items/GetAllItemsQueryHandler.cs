using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

/// <remarks>
/// Represents a query handler for retrieving all items.
/// </remarks>
public class GetAllItemsQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper)
    : IQueryHandler<GetAllItemsQuery, IEnumerable<ItemDto>>
{
    private readonly IMapper _mapper = mapper;
    private readonly IRepositoryReadonly<Item, Guid> _repositoryItems = unitOfWork.GetRepositoryReadonly<Item, Guid>();

    ///<inheritdoc/>
    public async Task<IEnumerable<ItemDto>> HandleAsync(GetAllItemsQuery query)
    {
        return await _repositoryItems.GetListAsync<ItemDto>(
            predicate: i => i.User.Id == query.UserId,
            include: x => x.Include(i => i.Values)
                        .ThenInclude(p => p.Property),
            mapConfig: _mapper.ConfigurationProvider);
    }
}