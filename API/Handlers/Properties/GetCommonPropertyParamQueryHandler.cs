using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;
public class GetCommonPropertyParamQueryHandler : IQueryHandler<GetCommonPropertyParamQuery, PropertyParamDto>
{
    //TODO: Remake to cache service
    private static Dictionary<Guid,PropertyParamDto> _params = null;
    private readonly IRepository<PropertyParamCommon, Guid> _repositoryPropertyParamsCommon;
    private readonly IMapper _mapper;

    public GetCommonPropertyParamQueryHandler(IUnitOfWork<DataContext> unitOfWork, IMapper mapper)
    {
        _repositoryPropertyParamsCommon = unitOfWork.GetRepository<PropertyParamCommon, Guid>();
        _mapper = mapper;
    }

    ///<inheritdoc/>
    public async Task<PropertyParamDto> HandleAsync(GetCommonPropertyParamQuery query)
    {
        _params ??= await _repositoryPropertyParamsCommon.GetAll<PropertyParam>()
            .ToDictionaryAsync(p => p.PropertyId, p => _mapper.Map<PropertyParamDto>(p));

        if (!_params.TryGetValue(query.PropId, out PropertyParamDto result))
            result = new PropertyParamDto (){ PropertyId = query.PropId };
        return result;
    }
}
