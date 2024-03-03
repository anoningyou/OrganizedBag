using System.Reflection;
using API.Data;
using API.Data.Interfaces;
using API.Interfaces;
using API.Services;
using API.Settings;
using Autofac;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API;

public static class ContainerBuilderExtensions
{

    /// <summary>
    /// Registers the AutoMapper profile from the external assemblies.
    /// </summary>
    /// <param name="builder">The builder.</param>
    public static void RegisterMaps(this ContainerBuilder builder)
    {
        builder.Register(context => new MapperConfiguration(cfg =>
            {
                //Register Mapper Profile
                cfg.AddProfile<AutoMapperProfiles>();
            }
            )).AsSelf().SingleInstance();

            builder.Register(c =>
            {
                //This resolves a new context that can be used later.
                var context = c.Resolve<IComponentContext>();
                var config = context.Resolve<MapperConfiguration>();
                return config.CreateMapper(context.Resolve);
            })
            .As<IMapper>()
            .InstancePerLifetimeScope();
    }

    public static void AddApplicationServices(this ContainerBuilder builder)
    {
        builder.RegisterType<TokenService>().As<ITokenService>().InstancePerLifetimeScope();
        builder.RegisterType<UnitOfWork<DataContext>>().As<IUnitOfWork<DataContext>>().InstancePerLifetimeScope();
    }

    public static void AddDispatchers(this ContainerBuilder builder)
    {
        builder.RegisterType<CommandDispatcher>().As<ICommandDispatcher>();
        builder.RegisterType<Dispatcher>().As<IDispatcher>();
        builder.RegisterType<QueryDispatcher>().As<IQueryDispatcher>();
    }

    public static void AddDbContext(this ContainerBuilder builder, bool isDevelopment, IConfiguration configuration)
    {
         var connString = "";

        if (isDevelopment)
        {
            connString = configuration.GetConnectionString("DefaultConnection");
        }
        else
        {
            // Use connection string provided at runtime by FlyIO.
            var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

            // Parse connection URL to connection string for Npgsql
            connUrl = connUrl.Replace("postgres://", string.Empty);
            var pgUserPass = connUrl.Split("@")[0];
            var pgHostPortDb = connUrl.Split("@")[1];
            var pgHostPort = pgHostPortDb.Split("/")[0];
            var pgDb = pgHostPortDb.Split("/")[1];
            var pgUser = pgUserPass.Split(":")[0];
            var pgPass = pgUserPass.Split(":")[1];
            var pgHost = pgHostPort.Split(":")[0];
            var pgPort = pgHostPort.Split(":")[1];
            var updatedHost = pgHost.Replace("flycast", "internal");

            connString = $"Server={updatedHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
        }

        builder.Register(x =>
        {
            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
            optionsBuilder.UseNpgsql(connString);
            return new DataContext(optionsBuilder.Options);
        }).InstancePerLifetimeScope();
    }
}
