using API.Data;
using API.Data.Interfaces;
using API.DTOs;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PropertiesController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        public PropertiesController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet(nameof(GetAll))]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAll()
        {
            return Ok(await _uow.PropertyRepository.GetAllAsync(User.GetUserId()));
        }


        [HttpPut(nameof(UpdateParams))]
        public async Task<ActionResult<IEnumerable<PropertyParamDto>>> UpdateParams(List<PropertyParamDto> propertyParams)
        {
            var result = await _uow.PropertyRepository.AddOrUpdateParamsAsync(propertyParams, User.GetUserId());
            await _uow.Complete();
            return Ok(result);
        }

        [HttpPut(nameof(UpdateParam))]
        public async Task<ActionResult<PropertyParamDto>> UpdateParam(PropertyParamDto propertyParam)
        {
            var result = await _uow.PropertyRepository.AddOrUpdateParamAsync(propertyParam, User.GetUserId());
            await _uow.Complete();
            return Ok(result);
        }
    }
}