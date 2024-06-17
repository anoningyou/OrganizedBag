using API.Controllers;
using API.Extensions;
using Autofac;
using Microsoft.AspNetCore.Mvc;

namespace API;

/// <summary>
/// Represents a controller for handling shared resources.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="SharedController"/> class.
/// </remarks>
/// <param name="dispatcher">The dispatcher for handling commands and queries.</param>
/// <param name="context">The component context for dependency injection.</param>
public class SharedController(IDispatcher dispatcher, IComponentContext context) : BaseApiController(dispatcher)
{
    private readonly IComponentContext _context = context;

    /// <summary>
    /// Retrieves a shared complect by its ID.
    /// </summary>
    /// <param name="id">The ID of the shared complect.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing the shared complect.</returns>
    [HttpGet(nameof(GetComplect))]
    public async Task<ActionResult<SharedComplectDto>> GetComplect(Guid id)
    {
        return Single(await QueryAsync(new GetSharedComplectQuery()
        {
            Id = id,
            UserId = User?.GetUserId()
        }));
    }
}