using API.Data.Interfaces;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ComplectsController: BaseApiController
    {
        private readonly IUnitOfWork _uow;

        public ComplectsController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet(nameof(GetAll))]
        public async Task<ActionResult<List<ComplectDto>>> GetAll()
        {
            return Ok(await _uow.ComplectsRepository.GetAllAsync(User.GetUserId()));
        }

        [HttpPost(nameof(Add))]
        public async Task<ActionResult<ComplectDto>> Add(ComplectDto complect)
        {
            var result = await _uow.ComplectsRepository.AddAsync(complect, User.GetUserId());
            await _uow.Complete();
            return Ok(result);
        }

        [HttpPost(nameof(AddItem))]
        public async Task<ActionResult<ComplectItemDto>> AddItem(ComplectItemDto item)
        {
            var result = await _uow.ComplectsRepository.AddItemAsync(item);
            await _uow.Complete();
            return Ok(result);
        }

        [HttpPost(nameof(DeleteItem))]
        public async Task<ActionResult<bool>> DeleteItem(ComplectItemDto item)
        {
            _uow.ComplectsRepository.RemoveItem(item);
            return Ok(await _uow.Complete());
        }

        [HttpPut(nameof(UpdateItem))]
        public async Task<ActionResult<ComplectItemDto>> UpdateItem(ComplectItemDto item)
        {
            var result = _uow.ComplectsRepository.UpdateItem(item);
            await _uow.Complete();
            return Ok(result);
        }
        
    }
}