using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppRole : IdentityRole<Guid>, IIdentifiable<Guid>
    {
       public ICollection<AppUserRole> UserRoles { get; set; } 
    }
}