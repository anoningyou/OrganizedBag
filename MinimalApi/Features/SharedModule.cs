using Carter;

namespace MinimalApi.Features;

public class SharedModule : CarterModule
{
    public SharedModule() : base("/shared") { }

    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/getcomplect", (ComplectId id) => Results.Ok(new SharedComplectDto(id)));
    }
}
