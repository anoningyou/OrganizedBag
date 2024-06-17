using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Represents a controller for managing properties.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="PropertiesController"/> class.
/// </remarks>
/// <param name="dispatcher">The dispatcher used for handling commands and queries.</param>
[Authorize]
public class PropertiesController(IDispatcher dispatcher) : BaseApiController(dispatcher)
{

    /// <summary>
    /// Retrieves all properties.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains the action result with the collection of property DTOs.</returns>
    [AllowAnonymous]
    [HttpGet(nameof(GetAll))]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAll()
    {
        return Collection(await QueryAsync(new GetAllPropertiesQuery
        {
            UserId = User.GetUserId()
        }));
    }

    /// <summary>
    /// Updates the parameters of multiple properties.
    /// </summary>
    /// <param name="propertyParams">The list of property parameter DTOs.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the action result with the collection of updated property parameter DTOs.</returns>
    [HttpPut(nameof(UpdateParams))]
    public async Task<ActionResult<IEnumerable<PropertyParamDto>>> UpdateParams(List<PropertyParamDto> propertyParams)
    {
        return Ok(await SendAsync(new AddOrUpdateParamsCommand
        {
            PropertyParams = propertyParams,
            UserId = User.GetUserId()
        }));
    }

    /// <summary>
    /// Updates a single property parameter.
    /// </summary>
    /// <param name="propertyParam">The property parameter DTO.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the action result with the updated property parameter DTO.</returns>
    [HttpPut(nameof(UpdateParam))]
    public async Task<ActionResult<PropertyParamDto>> UpdateParam(PropertyParamDto propertyParam)
    {
        return Ok(await SendAsync(new AddOrUpdateParamCommand
        {
            PropertyParam = propertyParam,
            UserId = User.GetUserId()
        }));
    }
}