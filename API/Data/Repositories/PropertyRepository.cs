using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private static Dictionary<Guid,PropertyParamDto> _params = null;
        public PropertyRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task AddAsync(PropertyDto dto) 
        {
            var property = _mapper.Map<Property>(dto);

            await _context.Properties.AddAsync(property);
        }

        public async Task AddRangeAsync(IEnumerable<Property> props) 
        {
            await _context.Properties.AddRangeAsync(props);
        }

        // public async Task<List<PropertyDto>> GetAllAsync(Guid userId)
        // {
        //     var props = await _context.Properties.AsNoTracking()
        //     .Include(p=> p.Params.Where(x => x.UserId == userId))
        //     .ToListAsync();
        //     var result =  props.Select(p => {
        //         var propertyDto = _mapper.Map<PropertyDto>(p);
        //         var param = p.Params.FirstOrDefault();
        //         propertyDto.Params = param != null ? _mapper.Map<PropertyParamDto>(param) : null;
        //         return propertyDto;
        //     }).ToList();

        //     foreach (var prop in result)
        //     {
        //         prop.Params ??= await GetCommonPropertyParam(prop.Id);
        //     }

        //     return result;  
        // }

        public async Task<List<PropertyDto>> GetByIdsAsync(List<Guid> ids, Guid? userId)
        {
            var props = await _context.Properties
            .AsNoTracking()
            .Where(p => ids.Contains(p.Id))
            .Include(p=> p.Params.Where(x => x.UserId == userId))
            .ToListAsync();
            var result =  props.Select(p => {
                var propertyDto = _mapper.Map<PropertyDto>(p);
                var param = p.Params.FirstOrDefault();
                propertyDto.Params = param != null ? _mapper.Map<PropertyParamDto>(param) : null;
                return propertyDto;
            }).ToList();

            foreach (var prop in result)
            {
                prop.Params ??= await GetCommonPropertyParam(prop.Id);
            }

            return result;  
        }

        public async Task<bool> AnyAsync()
        {
            return await _context.Properties.AnyAsync();
        }

        private async Task<PropertyParamDto> GetCommonPropertyParam(Guid propId)
        {
            _params ??= await _context.PropertyParamsCommon
                .AsNoTracking()
                .ToDictionaryAsync(p => p.PropertyId, p => _mapper.Map<PropertyParamDto>(p));

            if (!_params.TryGetValue(propId, out PropertyParamDto result))
                result = new PropertyParamDto (){ PropertyId = propId };
            return result;
        }

        public async Task<List<PropertyParamDto>> AddOrUpdateParamsAsync(List<PropertyParamDto> propertyParamDtos, Guid userId)
        {
            var propertyIds = propertyParamDtos.Select(p => p.PropertyId).ToList();
            var propertyParams = await _context.PropertyParams
            .Where(p => propertyIds.Contains( p.PropertyId) && p.UserId == userId)
            .ToListAsync();
            var updateList = new List<PropertyParam>();
            var addList = new List<PropertyParam>();

            foreach (var paramDto in propertyParamDtos)
            {
                var param = propertyParams.FirstOrDefault(p => p.PropertyId == paramDto.PropertyId);
                if (param == null)
                {
                    param = _mapper.Map<PropertyParam>(paramDto);
                    param.UserId = userId;
                    addList.Add(param);
                }
                else 
                {
                    param = _mapper.Map(paramDto, param);
                    updateList.Add(param);
                }
            }
            await _context.PropertyParams.AddRangeAsync(addList);
            _context.PropertyParams.UpdateRange(updateList);
            return propertyParamDtos;
        }

        public async Task<PropertyParamDto> AddOrUpdateParamAsync(PropertyParamDto propertyParamDto, Guid userId)
        {
            var param = await _context.PropertyParams.FirstOrDefaultAsync(p => p.PropertyId == propertyParamDto.PropertyId && p.UserId == userId);
            if (param == null)
            {
                param = _mapper.Map<PropertyParam>(propertyParamDto);
                param.UserId = userId;
                await _context.PropertyParams.AddAsync(param);
            }
            else 
            {
                param = _mapper.Map(propertyParamDto, param);
                _context.PropertyParams.Update(param);
            }
            return propertyParamDto;
        }
    }
}