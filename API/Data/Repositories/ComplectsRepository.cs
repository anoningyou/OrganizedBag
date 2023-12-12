using System.Runtime.CompilerServices;
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

#region Complects

        public async Task<ComplectDto> AddAsync(ComplectDto dto, Guid userId)
        {
            if (dto.Id == Guid.Empty)
                dto.Id = Guid.NewGuid();
            foreach (var group in dto.Groups)
            {
                group.ComplectId = dto.Id;
            }
            
            var complect = _mapper.Map<Complect>(dto);
            complect.UserId = userId;
            
            await _context.Complects.AddAsync(complect);
            return dto;
        }

        public  ComplectDto Edit(ComplectDto dto, Guid userId)
        {
            var complect = _mapper.Map<Complect>(dto);
            complect.Groups = null;
            complect.UserId = userId;
            _context.Complects.Update(complect);

            return dto;           
        }

        public void Remove(Guid id)
        {          
            _context.Complects.Remove(new Complect(){Id = id});
        }

        public Task<List<ComplectDto>> GetAllAsync(Guid userId)
        {
            return _context.Complects
            .Where(c => c.User.Id == userId)
            .Include(c => c.Groups)
            .ThenInclude(g => g.Items)
            .ProjectTo<ComplectDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }

        public async Task<ComplectDto> GetByIdAsync(Guid userId)
        {
            return await _context.Complects
            .AsNoTracking()
            .Where(c => c.Id == userId)
            .Include(c => c.Groups)
            .ThenInclude(g => g.Items)
            .ProjectTo<ComplectDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
        }

#endregion

#region Groups

        public async Task<GroupDto> AddGroupAsync(GroupDto dto)
        {
            var entity = _mapper.Map<Group>(dto);           
            await _context.Groups.AddAsync(entity);
            return dto;
        }

        public void RemoveGroup(GroupDto dto)
        {
            var entity = _mapper.Map<Group>(dto);           
            _context.Groups.Remove(entity);
        }

        public GroupDto UpdateGroup(GroupDto dto)
        {
            var item = _mapper.Map<Group>(dto);           
            _context.Groups.Update(item);
            return dto;
        }

#endregion

#region GroupItems
        public async Task<GroupItemDto> AddItemAsync(GroupItemDto dto)
        {
            var item = _mapper.Map<GroupItem>(dto);           
            await _context.GroupItems.AddAsync(item);
            return dto;
        }

        public void RemoveItem(GroupItemDto dto)
        {
            var item = _mapper.Map<GroupItem>(dto);           
            _context.GroupItems.Remove(item);
        }

        public GroupItemDto UpdateItem(GroupItemDto dto)
        {
            var item = _mapper.Map<GroupItem>(dto);           
            _context.GroupItems.Update(item);
            return dto;
        }

#endregion
    }
}