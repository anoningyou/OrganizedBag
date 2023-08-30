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

        public DbSet<PropertyParamCommon> PropertyParamsCommon { get; set; }

        public DbSet<PropertyParam> PropertyParams { get; set; }

        public DbSet<Complect> Complects { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<GroupItem> GroupItems { get; set; }


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

            builder.Entity<AppUser>()
                .HasMany(ur => ur.Items)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.Complects)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
                
            builder.Entity<GroupItem>()
                .HasKey(e => new{e.GroupId, e.ItemId});

            builder.Entity<GroupItem>()
                .Property(p => p.Count)
                .HasDefaultValue(1);

            builder.Entity<GroupItem>()
                .HasOne(e => e.Item)
                .WithMany(e => e.Groups)
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<GroupItem>()
                .HasOne(e => e.Group)
                .WithMany(e => e.Items)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<Complect>()
                .HasMany(c=> c.Groups)
                .WithOne(g => g.Complect)
                .HasForeignKey(g => g.ComplectId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<PropertyValue>()
                .HasKey(e => new{e.ItemId, e.PropertyId});

            builder.Entity<PropertyValue>()
                .HasOne(e => e.Item)
                .WithMany(e => e.Values)
                .HasForeignKey(e => e.ItemId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<PropertyValue>()
                .HasOne(e => e.Property)
                .WithMany(e => e.Values)
                .HasForeignKey(e => e.PropertyId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<PropertyParamCommon>()
                .HasKey(p => p.PropertyId);  
                
            builder.Entity<PropertyParamCommon>()
                .HasOne(e => e.Property)
                .WithOne(e => e.ParamCommon)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<PropertyParam>()
                .HasKey(p => new{ p.PropertyId, p.UserId});   

            builder.Entity<PropertyParam>()
                .HasOne(e => e.Property)
                .WithMany(e => e.Params)
                .HasForeignKey(e => e.PropertyId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            builder.Entity<PropertyParam>()
                .HasOne(e => e.User)
                .WithMany(e => e.PropertyParams)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
        
    }
}