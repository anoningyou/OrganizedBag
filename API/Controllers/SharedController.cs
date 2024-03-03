using API.Controllers;
using API.Extensions;
using Autofac;
using Microsoft.AspNetCore.Mvc;

namespace API;

/// <summary>
/// Represents a controller for handling shared resources.
/// </summary>
public class SharedController : BaseApiController
{
    private readonly IComponentContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="SharedController"/> class.
    /// </summary>
    /// <param name="dispatcher">The dispatcher for handling commands and queries.</param>
    /// <param name="context">The component context for dependency injection.</param>
    public SharedController(IDispatcher dispatcher, IComponentContext context) : base(dispatcher)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves a shared complect by its ID.
    /// </summary>
    /// <param name="id">The ID of the shared complect.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing the shared complect.</returns>
    [HttpGet(nameof(GetComplect))]
    public async Task<ActionResult<SharedComplectDto>> GetComplect(Guid id)
    {
        var query = new GetSharedComplectQuery
        {
            Id = id,
            UserId = User?.GetUserId()
        };
        return Single(await QueryAsync(query));
    }
}
