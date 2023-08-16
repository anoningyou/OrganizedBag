using API.Data.Interfaces;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ItemsController: BaseApiController
    {
        private readonly IUnitOfWork _uow;

        public ItemsController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet(nameof(GetAll))]
        public async Task<ActionResult<List<ItemDto>>> GetAll()
        {
            return Ok(await _uow.ItemsRepository.GetAllAsync(User.GetUserId()));
        }

        [HttpPost(nameof(Add))]
        public async Task<ActionResult<ItemDto>> Add(ItemDto item)
        {
            var result = await _uow.ItemsRepository.AddAsync(item, User.GetUserId());
            await _uow.Complete();
            return Ok(result);
        }

        [HttpPut(nameof(Edit))]
        public async Task<ActionResult<ItemDto>> Edit(ItemDto item)
        {
            var result = await _uow.ItemsRepository.EditAsync(item);
            await _uow.Complete();
            return Ok(result);
        }

        [HttpDelete(nameof(Delete))]
        public async Task<ActionResult<bool>> Delete(Guid id)
        {
            _uow.ItemsRepository.Remove(id);
            return Ok(await _uow.Complete());
        }
        
    }
}