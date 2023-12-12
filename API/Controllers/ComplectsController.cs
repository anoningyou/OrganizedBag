using API.Data.Interfaces;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class ComplectsController: BaseApiController
    {
        private readonly IUnitOfWork _uow;

        public ComplectsController(IUnitOfWork uow)
        {
            _uow = uow;
        }

#region Complects

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

        [HttpPut(nameof(Edit))]
        public async Task<ActionResult<ComplectDto>> Edit(ComplectDto complect)
        {
            var result = _uow.ComplectsRepository.Edit(complect, User.GetUserId());
            await _uow.Complete();
            return Ok(result);
        }

        [HttpDelete(nameof(Delete))]
        public async Task<ActionResult<bool>> Delete(Guid id)
        {
            _uow.ComplectsRepository.Remove(id);
            return Ok(await _uow.Complete());
        }

#endregion

#region Groups

        [HttpPost(nameof(AddGroup))]
        public async Task<ActionResult<GroupDto>> AddGroup(GroupDto dto)
        {
            var result = await _uow.ComplectsRepository.AddGroupAsync(dto);
            await _uow.Complete();
            return Ok(result);
        }

        [HttpDelete(nameof(DeleteGroup))]
        public async Task<ActionResult<bool>> DeleteGroup([FromQuery]GroupDto dto)
        {
            _uow.ComplectsRepository.RemoveGroup(dto);
            return Ok(await _uow.Complete());
        }

        [HttpPut(nameof(UpdateGroup))]
        public async Task<ActionResult<GroupItemDto>> UpdateGroup(GroupDto dto)
        {
            var result = _uow.ComplectsRepository.UpdateGroup(dto);
            await _uow.Complete();
            return Ok(result);
        }

#endregion

#region GroupItems

        [HttpPost(nameof(AddItem))]
        public async Task<ActionResult<GroupItemDto>> AddItem(GroupItemDto item)
        {
            var result = await _uow.ComplectsRepository.AddItemAsync(item);
            await _uow.Complete();
            return Ok(result);
        }

        [HttpDelete(nameof(DeleteItem))]
        public async Task<ActionResult<bool>> DeleteItem([FromQuery]GroupItemDto item)
        {
            _uow.ComplectsRepository.RemoveItem(item);
            return Ok(await _uow.Complete());
        }

        [HttpPut(nameof(UpdateItem))]
        public async Task<ActionResult<GroupItemDto>> UpdateItem(GroupItemDto item)
        {
            var result = _uow.ComplectsRepository.UpdateItem(item);
            await _uow.Complete();
            return Ok(result);
        }

#endregion

    }
}