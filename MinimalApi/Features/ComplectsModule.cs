using Carter;
using MongoDB.Driver;

namespace MinimalApi.Features;

public class ComplectsModule : CarterModule
{
    public ComplectsModule() : base("/complects") { }

    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/getall", async (IMongoCollection<ComplectDocument> complects) =>
            await complects.Find(_ => true).ToListAsync());

        app.MapPost("/add", async (IMongoCollection<ComplectDocument> complects, ComplectDto dto) =>
        {
            await complects.InsertOneAsync(new ComplectDocument(dto));
            return Results.Ok(dto);
        });

        app.MapPut("/edit", async (IMongoCollection<ComplectDocument> complects, ComplectDto dto) =>
        {
            await complects.ReplaceOneAsync(c => c.Id == dto.Id.Value, new ComplectDocument(dto));
            return Results.Ok(dto);
        });

        app.MapDelete("/delete", async (IMongoCollection<ComplectDocument> complects, ComplectId id) =>
        {
            await complects.DeleteOneAsync(c => c.Id == id.Value);
            return Results.Ok(true);
        });

        app.MapPost("/addgroup", (GroupDto dto) => Results.Ok(dto));
        app.MapDelete("/deletegroup", (GroupDto dto) => Results.Ok(true));
        app.MapPut("/updategroup", (GroupDto dto) => Results.Ok(dto));

        app.MapPost("/additem", (GroupItemDto dto) => Results.Ok(dto));
        app.MapDelete("/deleteitem", (GroupItemDto dto) => Results.Ok(true));
        app.MapPut("/updateitem", (GroupItemDto dto) => Results.Ok(dto));
    }
}
