using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //[ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected readonly IDispatcher Dispatcher;

        public BaseApiController(IDispatcher dispatcher)
        {
            Dispatcher = dispatcher;
        }
        
        protected async Task<TResult> QueryAsync<TResult>(IQuery<TResult> query)
            => await Dispatcher.QueryAsync<TResult>(query);

        protected ActionResult<T> Single<T>(T data)
        {
            if (data == null)
            {
                return NotFound();
            }
            return Ok(data);
        }

        protected ActionResult<IEnumerable<T>> Collection<T>(IEnumerable<T> listResult)
        {
            if (listResult == null)
            {
                return NotFound();
            }
            return Ok(listResult);
        }
    }
}