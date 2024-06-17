using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

/// <summary>
/// Handles the GetAllPropertiesQuery and returns a collection of PropertyDto objects.
/// </summary>
public class GetAllPropertiesQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper, IDispatcher dispatcher)
    : IQueryHandler<GetAllPropertiesQuery, IEnumerable<PropertyDto>>
{

    private readonly IMapper _mapper = mapper;
    private readonly IRepositoryReadonly<Property, Guid> _repositoryProperties = unitOfWork.GetRepositoryReadonly<Property, Guid>();
    private readonly IDispatcher _dispatcher = dispatcher;

    ///<inheritdoc/>
    public async Task<IEnumerable<PropertyDto>> HandleAsync(GetAllPropertiesQuery query)
    {
        List<Property> props = await _repositoryProperties.GetListAsync<Property>(
            include: x => x.Include(p => p.Params.Where(x => x.UserId == query.UserId)));

        List<PropertyDto> result =  props.Select(p => 
        {
            PropertyDto propertyDto = _mapper.Map<PropertyDto>(p);
            PropertyParam param = p.Params.FirstOrDefault();
            propertyDto.Params = param != null ? _mapper.Map<PropertyParamDto>(param) : null;
            return propertyDto;
        }).ToList();

        foreach (PropertyDto prop in result)
        {
            prop.Params ??= await _dispatcher.QueryAsync(new GetCommonPropertyParamQuery{ PropId = prop.Id});
        }

        return result;  
    }
}