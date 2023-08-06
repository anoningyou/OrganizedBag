using System.Security.AccessControl;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace API.Data
{
    public class DataContext: IdentityDbContext<AppUser, AppRole, Guid,
        IdentityUserClaim<Guid>, AppUserRole, IdentityUserLogin<Guid>,
        IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Item> Items {get; set;}

        public DbSet<Property> Properties { get; set; }

        public DbSet<PropertyValue> PropertyValues { get; set; }

        public DbSet<PropertyAttribute> PropertyAttributes { get; set; }

        public DbSet<Complect> Complects { get; set; }

        public DbSet<ComplectItem> ComplectItems { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(u => u.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(u => u.RoleId)
                .IsRequired();

            builder.Entity<ComplectItem>()
                .HasKey(e => new{e.ComplectId, e.ItemId});

            builder.Entity<ComplectItem>()
                .HasOne(e => e.Item)
                .WithMany(e => e.Complects)
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ComplectItem>()
                .HasOne(e => e.Complect)
                .WithMany(e => e.Items)
                .HasForeignKey(e => e.ComplectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PropertyValue>()
                .HasKey(e => new{e.ItemId, e.PropertyId});

            builder.Entity<PropertyValue>()
                .HasOne(e => e.Item)
                .WithMany(e => e.Values)
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PropertyValue>()
                .HasOne(e => e.Property)
                .WithMany(e => e.Values)
                .HasForeignKey(e => e.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        
    }
}