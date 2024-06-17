using System.Text.Json;
using API.Data.Interfaces;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

/// <summary>
/// Represents a class that contains methods for seeding data into the database.
/// </summary>
public class Seed
{
    /// <summary>
    /// Represents an asynchronous operation that can return a value.
    /// </summary>
    /// <typeparam name="TResult">The type of the result produced by the task.</typeparam>
    public static async Task SeedUsers(UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)
    {
        if (await userManager.Users.AnyAsync())
            return;

        byte[] userData = await File.ReadAllBytesAsync("Data/Seed/UserSeedData.json");

        JsonSerializerOptions options = new() 
        { 
            PropertyNameCaseInsensitive = true
        };

        List<AppUser> users = JsonSerializer.Deserialize<List<AppUser>>(userData,options);

        List<AppRole> roles =
        [
            new AppRole { Name = "Member" },
            new AppRole { Name = "Admin" },
            new AppRole { Name = "Moderator" }
        ];

        foreach (AppRole role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        foreach (AppUser user in users)
        {
            user.UserName = user.UserName.ToLower();
            user.Created = DateTime.SpecifyKind(user.Created, DateTimeKind.Utc);
            user.LastActive = DateTime.SpecifyKind(user.LastActive, DateTimeKind.Utc);
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }

        AppUser admin = new()
        {
            UserName = "admin"
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin","Moderator"]);
    }

    /// <summary>
    /// Seeds properties into the database.
    /// </summary>
    /// <param name="uow">The unit of work.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public static async Task SeedProperties(IUnitOfWork<DataContext> uow)
    {
        IRepository<Property, Guid> repository = uow.GetRepository<Property, Guid>();

        if (await (await repository.GetAllAsync<Property>()).AnyAsync()) 
            return;

        byte[] data = await File.ReadAllBytesAsync("Data/Seed/PropertiesSeedData.json");

        JsonSerializerOptions options = new()
        { 
            PropertyNameCaseInsensitive = true
        };

        List<Property> properties = JsonSerializer.Deserialize<List<Property>>(data,options);

        await repository.AddRangeAsync(properties);

        await uow.Complete();
    }
}