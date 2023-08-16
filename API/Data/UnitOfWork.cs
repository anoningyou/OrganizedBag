using API.Data.Interfaces;
using AutoMapper;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;     
        }

        public IUserRepository UserRepository => new UserRepository(_context,_mapper);

        public IPropertyRepository PropertyRepository => new PropertyRepository(_context,_mapper);

        public IItemsRepository ItemsRepository => new ItemsRepository(_context,_mapper);

        public IComplectsRepository ComplectsRepository => new ComplectsRepository(_context,_mapper);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync()>0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}