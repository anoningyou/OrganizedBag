
using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

public class GetSharedComplectQueryHandler : IQueryHandler<GetSharedComplectQuery, SharedComplectDto>
{
    private readonly IMapper _mapper;
    private readonly IRepository<Complect, Guid> _repositoryComplects;
    private readonly IRepository<Item, Guid> _repositoryItems;
    private readonly IRepository<Property, Guid> _repositoryProperties;
    private readonly IDispatcher _dispatcher;
    
    public GetSharedComplectQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper, IDispatcher dispatcher)
    {
        _mapper = mapper;
        _repositoryComplects = unitOfWork.GetRepository<Complect, Guid>();
        _repositoryItems = unitOfWork.GetRepository<Item, Guid>();
        _repositoryProperties = unitOfWork.GetRepository<Property, Guid>();
        _dispatcher = dispatcher;
    }
    
    public async Task<SharedComplectDto> HandleAsync(GetSharedComplectQuery query)
    {
        var complect = new SharedComplectDto();

        complect.Complect = await _repositoryComplects.GetAsync<ComplectDto>(query.Id, _mapper.ConfigurationProvider);

        if (complect.Complect == null)
            return null;

        var itemIds = complect.Complect.Groups
                            .SelectMany(g => g.Items.Select(x => x.ItemId))
                            .Distinct().ToList();
        complect.Items = await _repositoryItems.GetListAsync<ItemDto>(itemIds, mapConfig: _mapper.ConfigurationProvider);

        if ((complect.Items?.Count ?? 0) > 0)
        {
            var propertiyIds = complect.Items.SelectMany(i => i.Values.Select(v => v.PropertyId)).ToList();

            var props = await _repositoryProperties.GetListAsync<Property>(propertiyIds,
                include: x => x.Include(p => p.Params.Where(x => x.UserId == query.UserId) ));
            complect.Properties = props.Select(p => {
                var propertyDto = _mapper.Map<PropertyDto>(p);
                var param = p.Params.FirstOrDefault();
                propertyDto.Params = param != null ? _mapper.Map<PropertyParamDto>(param) : null;
                return propertyDto;
            }).ToList();

            foreach (var prop in complect.Properties)
            {
                prop.Params ??= await _dispatcher.QueryAsync(new GetCommonPropertyParamQuery{ PropId = prop.Id});
            }
        }
            
        return complect;
    }
}
