using API.Data;
using API.Data.Interfaces;
using API.Interfaces;
using API.Services;

namespace API.Extensions
{
    public static class ApplicationServiceExtentions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            //services.AddScoped<LogUserActivity
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}