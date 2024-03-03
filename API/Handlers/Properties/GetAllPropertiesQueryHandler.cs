using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

public class GetAllPropertiesQueryHandler : IQueryHandler<GetAllPropertiesQuery, IEnumerable<PropertyDto>>
{

    private readonly IMapper _mapper;
    private readonly IRepository<Property, Guid> _repositoryProperties;
    private readonly IDispatcher _dispatcher;

    public GetAllPropertiesQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper, IDispatcher dispatcher)
    {
        _mapper = mapper;
        _repositoryProperties = unitOfWork.GetRepository<Property, Guid>();
        _dispatcher = dispatcher;
    }
    public async Task<IEnumerable<PropertyDto>> HandleAsync(GetAllPropertiesQuery query)
    {
        var props = await _repositoryProperties.GetListAsync<Property>(
            include: x => x.Include(p => p.Params.Where(x => x.UserId == query.UserId)));
        
            var result =  props.Select(p => {
                var propertyDto = _mapper.Map<PropertyDto>(p);
                var param = p.Params.FirstOrDefault();
                propertyDto.Params = param != null ? _mapper.Map<PropertyParamDto>(param) : null;
                return propertyDto;
            }).ToList();

            foreach (var prop in result)
            {
                prop.Params ??= await _dispatcher.QueryAsync(new GetCommonPropertyParamQuery{ PropId = prop.Id});
            }

            return result;  
    }
}