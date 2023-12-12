using API.Controllers;
using API.Data.Interfaces;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class SharedController : BaseApiController
{
    private readonly IUnitOfWork _uow;

    public SharedController(IUnitOfWork uow)
    {
        _uow = uow;
    }

    [HttpGet(nameof(GetComplect))]
    public async Task<ActionResult<SharedComplectDto>> GetComplect(Guid id)
    {
        var complect = new SharedComplectDto();

        complect.Complect = await _uow.ComplectsRepository
            .GetByIdAsync(id);

        if (complect.Complect == null)
            return NotFound();

        complect.Items = await _uow.ItemsRepository
            .GetByIdsAsync(complect 
                            .Complect
                            .Groups
                            .SelectMany(g => g.Items.Select(x => x.ItemId))
                            .Distinct().ToList());

        if ((complect.Items?.Count ?? 0) > 0)
            complect.Properties = await _uow.PropertyRepository
                .GetByIdsAsync(complect.Items.SelectMany(i => i.Values.Select(v => v.PropertyId)).ToList(), User?.GetUserId());
        
        return Ok(complect);
    }

}
