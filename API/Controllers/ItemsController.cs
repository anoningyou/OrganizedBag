using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for managing items.
/// </summary>
[Authorize]
public class ItemsController(IDispatcher dispatcher) : BaseApiController(dispatcher)
{
    /// <summary>
    /// Retrieves all items.
    /// </summary>
    /// <returns>A list of item DTOs.</returns>
    [HttpGet(nameof(GetAll))]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetAll()
    {
        return Collection(await QueryAsync(new GetAllItemsQuery 
        { 
            UserId = User.GetUserId() 
        }));
    }

    /// <summary>
    /// Adds a new item.
    /// </summary>
    /// <param name="item">The item DTO to add.</param>
    /// <returns>The added item DTO.</returns>
    [HttpPost(nameof(Add))]
    public async Task<ActionResult<ItemDto>> Add(ItemDto item)
    {
        return Single(await SendAsync(new AddItemCommand
        {
            ItemDto = item,
            UserId = User.GetUserId()
        }));
    }

    /// <summary>
    /// Adds a range of items.
    /// </summary>
    /// <param name="items">The list of item DTOs to add.</param>
    /// <returns>A list of added item DTOs.</returns>
    [HttpPost(nameof(AddRange))]
    public async Task<ActionResult<IEnumerable<ItemDto>>> AddRange(List<ItemDto> items)
    {
        return Collection(await SendAsync(new AddItemsCommand
        {
            ItemDtos = items,
            UserId = User.GetUserId()
        }));
    }

    /// <summary>
    /// Edits an existing item.
    /// </summary>
    /// <param name="item">The item DTO to edit.</param>
    /// <returns>The edited item DTO.</returns>
    [HttpPut(nameof(Edit))]
    public async Task<ActionResult<ItemDto>> Edit(ItemDto item)
    {
        return Single(await SendAsync(new EditItemCommand
        {
            ItemDto = item
        }));
    }

    /// <summary>
    /// Deletes an item.
    /// </summary>
    /// <param name="id">The ID of the item to delete.</param>
    /// <returns>A boolean indicating whether the item was successfully deleted.</returns>
    [HttpDelete(nameof(Delete))]
    public async Task<ActionResult<bool>> Delete(Guid id)
    {
        return Single(await SendAsync(new DeleteItemCommand
        {
            ItemId = id
        }));
    }
}