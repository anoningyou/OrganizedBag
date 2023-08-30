using API.DTOs;

namespace API.Data.Interfaces
{
    public interface IComplectsRepository
    {
        public Task<ComplectDto> AddAsync(ComplectDto dto, Guid userId);
        public ComplectDto Edit(ComplectDto complect, Guid userId);
        public void Remove(Guid id);
        public Task<List<ComplectDto>> GetAllAsync(Guid userId);

        public Task<GroupDto> AddGroupAsync(GroupDto dto);
        public void RemoveGroup(GroupDto dto);
        public GroupDto UpdateGroup(GroupDto dto);

        public Task<GroupItemDto> AddItemAsync(GroupItemDto dto);
        public void RemoveItem(GroupItemDto dto);
        public GroupItemDto UpdateItem(GroupItemDto dto);
    }
}