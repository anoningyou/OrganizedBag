using API.DTOs;

namespace API.Data.Interfaces
{
    public interface IItemsRepository
    {
        public Task<ItemDto> AddAsync(ItemDto dto, Guid userId);

        public Task<ItemDto> EditAsync(ItemDto dto);

        public void Remove(Guid id);

        public Task<List<ItemDto>> GetAllAsync(Guid userId);
    }
}