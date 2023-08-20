using API.DTOs;
using API.Entities;

namespace API.Data.Interfaces
{
    public interface IPropertyRepository
    {
        public Task AddAsync(PropertyDto dto);

        public Task AddRangeAsync(IEnumerable<Property> props);

        public Task<List<PropertyDto>> GetAllAsync(Guid userId);

        public Task<bool> AnyAsync();

        public Task<List<PropertyParamDto>> AddOrUpdateParamsAsync(List<PropertyParamDto> propertyParamDtos, Guid userId);

        public Task<PropertyParamDto> AddOrUpdateParamAsync(PropertyParamDto propertyParamDto, Guid userId);
    }
}