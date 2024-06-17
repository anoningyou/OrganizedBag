
using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

/// <summary>
/// Handles the query to retrieve a shared complect.
/// </summary>
public class GetSharedComplectQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper, IDispatcher dispatcher) 
    : IQueryHandler<GetSharedComplectQuery, SharedComplectDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IRepositoryReadonly<Complect, Guid> _repositoryComplects = unitOfWork
        .GetRepositoryReadonly<Complect, Guid>();
    private readonly IRepositoryReadonly<Item, Guid> _repositoryItems = unitOfWork
        .GetRepositoryReadonly<Item, Guid>();
    private readonly IRepositoryReadonly<Property, Guid> _repositoryProperties = unitOfWork
        .GetRepositoryReadonly<Property, Guid>();
    private readonly IDispatcher _dispatcher = dispatcher;

    ///<inheritdoc/>
    public async Task<SharedComplectDto> HandleAsync(GetSharedComplectQuery query)
    {
        SharedComplectDto complect = new()
        {
            Complect = await _repositoryComplects.GetAsync<ComplectDto>(query.Id, _mapper.ConfigurationProvider)
        };

        if (complect.Complect == null)
            return null;

        List<Guid> itemIds = complect.Complect.Groups
                            .SelectMany(g => g.Items.Select(x => x.ItemId))
                            .Distinct().ToList();
        complect.Items = await _repositoryItems.GetListAsync<ItemDto>(itemIds, mapConfig: _mapper.ConfigurationProvider);

        if ((complect.Items?.Count ?? 0) > 0)
        {
            List<Guid> propertiyIds = complect.Items.SelectMany(i => i.Values.Select(v => v.PropertyId)).ToList();

            List<Property> props = await _repositoryProperties.GetListAsync<Property>(propertiyIds,
                include: x => x.Include(p => p.Params.Where(x => x.UserId == query.UserId) ));
            complect.Properties = props.Select(p => {
                PropertyDto propertyDto = _mapper.Map<PropertyDto>(p);
                PropertyParam param = p.Params.FirstOrDefault();
                propertyDto.Params = param != null ? _mapper.Map<PropertyParamDto>(param) : null;
                return propertyDto;
            }).ToList();

            foreach (PropertyDto prop in complect.Properties)
            {
                prop.Params ??= await _dispatcher.QueryAsync(new GetCommonPropertyParamQuery{ PropId = prop.Id});
            }
        }
            
        return complect;
    }
}