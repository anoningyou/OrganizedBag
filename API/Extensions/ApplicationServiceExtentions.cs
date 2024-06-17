namespace API.Extensions;

/// <summary>
/// Provides extension methods for configuring application services.
/// </summary>
public static class ApplicationServiceExtentions
{
    /// <summary>
    /// Adds application services to the specified <see cref="IServiceCollection"/>.
    /// </summary>
    /// <param name="services">The <see cref="IServiceCollection"/> to add the services to.</param>
    /// <returns>The modified <see cref="IServiceCollection"/>.</returns>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddCors();

        return services;
    }
}