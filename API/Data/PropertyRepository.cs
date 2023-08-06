using API.Data.Interfaces;
using API.DTOs;
using API.Entities;
using API.Enums;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
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

        public async Task<List<PropertyDto>> GetAllAsync()
        {
            return await _context.Properties
                .ProjectTo<PropertyDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<bool> AnyAsync()
        {
            return await _context.Properties.AnyAsync();
        }
    }
}