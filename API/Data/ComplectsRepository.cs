using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ComplectsRepository : IComplectsRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public ComplectsRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            
        }

        public async Task<ComplectDto> AddAsync(ComplectDto dto,Guid userId)
        {
            if (dto.Id == Guid.Empty)
                dto.Id = Guid.NewGuid();
            var complect = _mapper.Map<Complect>(dto);
            complect.UserId = userId;
            
            await _context.Complects.AddAsync(complect);
            return dto;
        }

        public Task<List<ComplectDto>> GetAllAsync(Guid userId)
        {
            return _context.Complects
            .Where(i => i.User.Id == userId)
            .Include(i => i.Items)
            .ProjectTo<ComplectDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }

        public async Task<ComplectItemDto> AddItemAsync(ComplectItemDto dto)
        {
            var item = _mapper.Map<ComplectItem>(dto);           
            await _context.ComplectItems.AddAsync(item);
            return dto;
        }

        public void RemoveItem(ComplectItemDto dto)
        {
            var item = _mapper.Map<ComplectItem>(dto);           
            _context.ComplectItems.Remove(item);
        }

        public ComplectItemDto UpdateItem(ComplectItemDto dto)
        {
            var item = _mapper.Map<ComplectItem>(dto);           
            _context.ComplectItems.Update(item);
            return dto;
        }
    }
}