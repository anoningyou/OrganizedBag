using API.DTOs;

namespace API.Data.Interfaces
{
    public interface IComplectsRepository
    {
        public Task<ComplectDto> AddAsync(ComplectDto dto, Guid userId);

        public Task<List<ComplectDto>> GetAllAsync(Guid userId);
        public Task<ComplectItemDto> AddItemAsync(ComplectItemDto dto);
        public void RemoveItem(ComplectItemDto dto);
        public ComplectItemDto UpdateItem(ComplectItemDto dto);
    }
}