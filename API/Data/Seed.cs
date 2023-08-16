using System.Text.Json;
using API.Data.Interfaces;
using API.DTOs;
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

            var userData = await File.ReadAllBytesAsync("Data/UserSeedData.json");

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

            var data = await File.ReadAllBytesAsync("Data/PropertiesSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var properties = JsonSerializer.Deserialize<List<PropertyDto>>(data,options);

            foreach (var prop in properties)
            {

                await uow.PropertyRepository.AddAsync(prop);
            }
            await uow.Complete();
        }

        private static List<PropertyParamDto> _propertyParams = null;
        public static List<PropertyParamDto> PropertyParams {
            get
            {
                if (_propertyParams == null)
                    _propertyParams = GetPropertyParams().Result;
                return _propertyParams;
            }  
        }
        public static async Task<List<PropertyParamDto>> GetPropertyParams()
        {
            var data = await File.ReadAllBytesAsync("Data/PropertyParamsSeedData.json");

            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

            var properties = JsonSerializer.Deserialize<List<PropertyParamDto>>(data,options);

            return properties;
        }
    }
}