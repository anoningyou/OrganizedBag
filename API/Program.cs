using System.Reflection;
using System.Text.Json.Serialization;
using API;
using API.Data;
using API.Data.Interfaces;
using API.Entities;
using API.Extensions;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Host
    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
    .ConfigureContainer<ContainerBuilder>((container) =>
    {
        container.RegisterAssemblyTypes(Assembly.GetEntryAssembly()).AsImplementedInterfaces();
        container.AddDbContext(builder.Environment.IsDevelopment(), builder.Configuration);
        container.RegisterMaps();
        container.AddApplicationServices();
        container.AddDispatchers();
    });

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
        {
            JsonStringEnumConverter enumConverter = new JsonStringEnumConverter();
            opts.JsonSerializerOptions.Converters.Add(enumConverter);
        });
builder.Services.AddApplicationServices();

builder.Services.AddIdentityServices(builder.Configuration);

WebApplication app = builder.Build();

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins(new [] {"http://localhost:4200", "http://192.168.1.6:4200", "https://192.168.1.6:5001", "http://192.168.1.6:5000"})
);

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

using IServiceScope scope = app.Services.CreateScope();
IServiceProvider services = scope.ServiceProvider;

try
{
    DataContext context = services.GetRequiredService<DataContext>();
    UserManager<AppUser> userManager = services.GetRequiredService<UserManager<AppUser>>();
    RoleManager<AppRole> roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    IUnitOfWork<DataContext> uow = services.GetRequiredService<IUnitOfWork<DataContext>>();
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager, roleManager);
    await Seed.SeedProperties(uow);
}
catch (Exception ex)
{
    ILogger<Program> logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An error occured during migration");
}

app.Run();
