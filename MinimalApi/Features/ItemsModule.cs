using Carter;
using MongoDB.Driver;

namespace MinimalApi.Features;

public class ItemsModule : CarterModule
{
    public ItemsModule() : base("/items") { }

    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/getall", async (IMongoCollection<ItemDocument> items) =>
            await items.Find(_ => true).ToListAsync());

        app.MapPost("/add", async (IMongoCollection<ItemDocument> items, ItemDto item) =>
        {
            await items.InsertOneAsync(new ItemDocument(item.Id.Value, item.Values));
            return Results.Ok(item);
        });

        app.MapPost("/addrange", async (IMongoCollection<ItemDocument> items, IEnumerable<ItemDto> list) =>
        {
            var docs = list.Select(i => new ItemDocument(i.Id.Value, i.Values));
            await items.InsertManyAsync(docs);
            return Results.Ok(list);
        });

        app.MapPut("/edit", async (IMongoCollection<ItemDocument> items, ItemDto item) =>
        {
            await items.ReplaceOneAsync(i => i.Id == item.Id.Value, new ItemDocument(item.Id.Value, item.Values));
            return Results.Ok(item);
        });

        app.MapDelete("/delete", async (IMongoCollection<ItemDocument> items, ItemId id) =>
        {
            await items.DeleteOneAsync(i => i.Id == id.Value);
            return Results.Ok(true);
        });
    }
}
