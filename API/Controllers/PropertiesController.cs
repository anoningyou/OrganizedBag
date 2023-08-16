using System.Text.Json.Serialization;
using API.Data;
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
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAll()
        {
            var props = await _uow.PropertyRepository.GetAllAsync();
            var paramList = Seed.PropertyParams;
            int i = 0;
            foreach (var prop in props)
            {
                prop.Params = paramList.FirstOrDefault(p => p.PropertyId == prop.Id) 
                    ?? new PropertyParamDto
                    {
                        ComplectDisplay = true,
                        ComplectOrder = paramList.Count + i++,
                         ListDisplay = true,
                         ListOrder = paramList.Count + i,
                         PropertyId = prop.Id
                    };
            }
            
        

            return Ok(props.OrderBy(p => p.Params.ListOrder));
        }
    }
}