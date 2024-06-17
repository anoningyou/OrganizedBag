using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

/// <summary>
/// Represents a query handler for retrieving common property parameters.
/// </summary>
public class GetCommonPropertyParamQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper) 
    : IQueryHandler<GetCommonPropertyParamQuery, PropertyParamDto>
{
    //TODO: Remake to cache service
    private static Dictionary<Guid,PropertyParamDto> _params = null;
    private readonly IRepositoryReadonly<PropertyParamCommon, Guid> _repositoryPropertyParamsCommon 
        = unitOfWork.GetRepositoryReadonly<PropertyParamCommon, Guid>();
    private readonly IMapper _mapper = mapper;

    ///<inheritdoc/>
    public async Task<PropertyParamDto> HandleAsync(GetCommonPropertyParamQuery query)
    {
        _params ??= await _repositoryPropertyParamsCommon.GetAll<PropertyParamCommon>()
            .ToDictionaryAsync(p => p.PropertyId, p => _mapper.Map<PropertyParamDto>(p));

        if (!_params.TryGetValue(query.PropId, out PropertyParamDto result))
            result = new PropertyParamDto (){ PropertyId = query.PropId };
        return result;
    }
}