using API.Data.Interfaces;
using API.DTOs;
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
        public async Task<ActionResult<List<PropertyDto>>> GetAll()
        {
            var props = await _uow.PropertyRepository.GetAllAsync();

            return Ok(props);
        }
    }
}