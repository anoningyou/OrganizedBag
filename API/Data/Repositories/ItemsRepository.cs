using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ItemsRepository : IItemsRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public ItemsRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            
        }

        public async Task<ItemDto> AddAsync(ItemDto dto,Guid userId)
        {
            if (dto.Id == Guid.Empty)
                dto.Id = Guid.NewGuid();
            var item = _mapper.Map<Item>(dto);
            item.UserId = userId;
            foreach (var val in item.Values)
            {
                val.ItemId = item.Id;
            }
           
            await _context.Items.AddAsync(item);
            return dto;
        }

        public async Task<ItemDto> EditAsync(ItemDto dto)
        {
            var props = await _context.PropertyValues.AsNoTracking().Where(p => p.ItemId == dto.Id).ToListAsync();
            foreach (var val in dto.Values)
            {
                val.ItemId = dto.Id;
            }
            
            var propsForUpdate = new List<PropertyValue>();
            var propsForDelete = new List<PropertyValue>();
            foreach (var prop in props)
            {
                var propForUpdate = dto.Values.FirstOrDefault(v => v.PropertyId == prop.PropertyId);
                if (propForUpdate != null)
                {
                    propsForUpdate.Add(_mapper.Map<PropertyValue>(propForUpdate));
                }
                else 
                {
                    propsForDelete.Add(prop);
                }
            }
            var propsForAdd = dto.Values
                .Where(v => !propsForUpdate.Any(p => p.PropertyId == v.PropertyId))
                .Select(v => _mapper.Map<PropertyValue>(v));
            _context.PropertyValues.RemoveRange(propsForDelete);
            _context.PropertyValues.UpdateRange(propsForUpdate);
            await _context.PropertyValues.AddRangeAsync(propsForAdd);
            return _mapper.Map<ItemDto>(dto);
             
        }

        public void Remove(Guid id)
        {          
            _context.Items.Remove(new Item(){Id = id});
        }

        public async Task<List<ItemDto>> GetAllAsync(Guid userId)
        {
            return await _context.Items
            .AsNoTracking()
            .Where(i => i.User.Id == userId)
            .Include(i => i.Values)
            .ThenInclude(p => p.Property)
            .ProjectTo<ItemDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }
    }
}