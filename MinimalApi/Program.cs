using Carter;
using MongoDB.Driver;
using MinimalApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient("mongodb://localhost:27017"));
builder.Services.AddSingleton<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase("OrganizedBag"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IMongoDatabase>().GetCollection<ItemDocument>("Items"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IMongoDatabase>().GetCollection<PropertyDocument>("Properties"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IMongoDatabase>().GetCollection<ComplectDocument>("Complects"));

builder.Services.AddCarter();

var app = builder.Build();

app.MapCarter();

app.Run();
