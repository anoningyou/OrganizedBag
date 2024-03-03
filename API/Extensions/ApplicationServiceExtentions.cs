namespace API.Extensions
{
    public static class ApplicationServiceExtentions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddCors();
            return services;
        }
    }
}