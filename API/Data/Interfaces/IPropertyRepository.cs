using API.DTOs;

namespace API.Data.Interfaces
{
    public interface IPropertyRepository
    {
        public Task AddAsync(PropertyDto dto);

        public Task<List<PropertyDto>> GetAllAsync();

        public Task<bool> AnyAsync();
    }
}