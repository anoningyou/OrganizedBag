using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

/// <summary>
/// Represents a query handler for retrieving all complects.
/// </summary>
public class GetAllComplectsQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper)
    : IQueryHandler<GetAllComplectsQuery, IEnumerable<ComplectDto>>
{
    private readonly IMapper _mapper = mapper;
    private readonly IRepositoryReadonly<Complect, Guid> _repositoryComplects = unitOfWork
        .GetRepositoryReadonly<Complect, Guid>();

    ///<inheritdoc/>
    public async Task<IEnumerable<ComplectDto>> HandleAsync(GetAllComplectsQuery query)
    {
        return await _repositoryComplects.GetListAsync<ComplectDto>(
            predicate: i => i.User.Id == query.UserId,
            include: x => x.Include(c => c.Groups)
                            .ThenInclude(g => g.Items),
            mapConfig: _mapper.ConfigurationProvider);
    }
}