using Carter;
using MongoDB.Driver;

namespace MinimalApi.Features;

public class PropertiesModule : CarterModule
{
    public PropertiesModule() : base("/properties") { }

    public override void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/getall", async (IMongoCollection<PropertyDocument> properties) =>
            await properties.Find(_ => true).ToListAsync());

        app.MapPut("/updateparams", async (IMongoCollection<PropertyDocument> properties, IEnumerable<PropertyParamDto> p) =>
        {
            foreach (var prm in p)
                await properties.UpdateOneAsync(x => x.Id == prm.PropertyId.Value, Builders<PropertyDocument>.Update.Set(x => x.Params, prm));
            return Results.Ok(p);
        });

        app.MapPut("/updateparam", async (IMongoCollection<PropertyDocument> properties, PropertyParamDto p) =>
        {
            await properties.UpdateOneAsync(x => x.Id == p.PropertyId.Value, Builders<PropertyDocument>.Update.Set(x => x.Params, p));
            return Results.Ok(p);
        });
    }
}
