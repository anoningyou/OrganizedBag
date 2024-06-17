using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for managing complects, groups, and group items.
/// </summary>
[Authorize]
public class ComplectsController(IDispatcher dispatcher) 
    : BaseApiController(dispatcher)
{

    #region Complects

    /// <summary>
    /// Retrieves all complects.
    /// </summary>
    /// <returns>A list of complects.</returns>
    [HttpGet(nameof(GetAll))]
    public async Task<ActionResult<IEnumerable<ComplectDto>>> GetAll()
    {
        return Collection(await QueryAsync(new GetAllComplectsQuery 
        { 
            UserId = User.GetUserId() 
        }));
    }

    /// <summary>
    /// Adds a new complect.
    /// </summary>
    /// <param name="complect">The complect to add.</param>
    /// <returns>The added complect.</returns>
    [HttpPost(nameof(Add))]
    public async Task<ActionResult<ComplectDto>> Add(ComplectDto complect)
    {
        return Single(await SendAsync(new AddComplectCommand
        {
            Complect = complect,
            UserId = User.GetUserId()
        }));
    }

    /// <summary>
    /// Updates an existing complect.
    /// </summary>
    /// <param name="complect">The complect to update.</param>
    /// <returns>The updated complect.</returns>
    [HttpPut(nameof(Edit))]
    public async Task<ActionResult<ComplectDto>> Edit(ComplectDto complect)
    {
        return Single(await SendAsync(new UpdateComplectCommand
        {
            Complect = complect,
            UserId = User.GetUserId()
        }));
    }

    /// <summary>
    /// Deletes a complect.
    /// </summary>
    /// <param name="id">The ID of the complect to delete.</param>
    /// <returns>A boolean indicating whether the complect was successfully deleted.</returns>
    [HttpDelete(nameof(Delete))]
    public async Task<ActionResult<bool>> Delete(Guid id)
    {
        return Single(await SendAsync(new DeleteComplectCommand
        {
            Id = id
        }));
    }

    #endregion

    #region Groups

    /// <summary>
    /// Adds a new group.
    /// </summary>
    /// <param name="dto">The group to add.</param>
    /// <returns>The added group.</returns>
    [HttpPost(nameof(AddGroup))]
    public async Task<ActionResult<GroupDto>> AddGroup(GroupDto dto)
    {
        return Single(await SendAsync(new AddGroupCommand
        {
            Group = dto
        }));
    }

    /// <summary>
    /// Deletes a group.
    /// </summary>
    /// <param name="dto">The group to delete.</param>
    /// <returns>A boolean indicating whether the group was successfully deleted.</returns>
    [HttpDelete(nameof(DeleteGroup))]
    public async Task<ActionResult<bool>> DeleteGroup([FromQuery]GroupDto dto)
    {
        return Single(await SendAsync(new DeleteGroupCommand
        {
            Id = dto.Id
        }));
    }

    /// <summary>
    /// Updates an existing group.
    /// </summary>
    /// <param name="dto">The group to update.</param>
    /// <returns>The updated group.</returns>
    [HttpPut(nameof(UpdateGroup))]
    public async Task<ActionResult<GroupDto>> UpdateGroup(GroupDto dto)
    {
        return Single(await SendAsync(new UpdateGroupCommand
        {
            Group = dto
        }));
    }

    #endregion

    #region GroupItems

    /// <summary>
    /// Adds a new group item.
    /// </summary>
    /// <param name="item">The group item to add.</param>
    /// <returns>The added group item.</returns>
    [HttpPost(nameof(AddItem))]
    public async Task<ActionResult<GroupItemDto>> AddItem(GroupItemDto item)
    {
        return Single(await SendAsync(new AddGroupItemCommand
        {
            Item = item
        }));
    }

    /// <summary>
    /// Deletes a group item.
    /// </summary>
    /// <param name="item">The group item to delete.</param>
    /// <returns>A boolean indicating whether the group item was successfully deleted.</returns>
    [HttpDelete(nameof(DeleteItem))]
    public async Task<ActionResult<bool>> DeleteItem([FromQuery]GroupItemDto item)
    {
        return Single(await SendAsync(new DeleteGroupItemCommand
        {
            Item = item
        }));
    }

    /// <summary>
    /// Updates an existing group item.
    /// </summary>
    /// <param name="item">The group item to update.</param>
    /// <returns>The updated group item.</returns>
    [HttpPut(nameof(UpdateItem))]
    public async Task<ActionResult<GroupItemDto>> UpdateItem(GroupItemDto item)
    {
        return Single(await SendAsync(new UpdateGroupItemCommand
        {
            Item = item
        }));
    }

    #endregion

}