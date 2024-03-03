using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<Guid>, IIdentifiable<Guid>
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public virtual ICollection<AppUserRole> UserRoles { get; set; }
        public virtual ICollection<Item> Items { get; set; }
        public virtual ICollection<Complect> Complects { get; set; }
        public virtual ICollection<PropertyParam> PropertyParams { get; set; }
    }
}