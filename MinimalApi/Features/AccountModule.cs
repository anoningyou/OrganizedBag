using Carter;

namespace MinimalApi.Features;

public class AccountModule : CarterModule
{
    public AccountModule() : base("/account") { }

    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/register", (RegisterDto dto) => Results.Ok(new UserDto(dto.Username, "token")));
        app.MapPost("/login", (LoginDto dto) => Results.Ok(new UserDto(dto.Username, "token")));
        app.MapGet("/getcurrentuser", () => Results.Ok(new UserDto("demo", "token")));
    }
}
