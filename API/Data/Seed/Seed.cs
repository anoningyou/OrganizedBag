using System.Text.Json;
using API.Data.Interfaces;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager)
        {
            if(await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllBytesAsync("Data/Seed/UserSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData,options);

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                user.Created = DateTime.SpecifyKind(user.Created, DateTimeKind.Utc);
                user.LastActive = DateTime.SpecifyKind(user.LastActive, DateTimeKind.Utc);
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[]{"Admin","Moderator"});
        }

        public static async Task SeedProperties(IUnitOfWork uow)
        {
            if(await uow.PropertyRepository.AnyAsync()) return;

            var data = await File.ReadAllBytesAsync("Data/Seed/PropertiesSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var properties = JsonSerializer.Deserialize<List<Property>>(data,options);

            await uow.PropertyRepository.AddRangeAsync(properties);

            await uow.Complete();
        }
    }
}