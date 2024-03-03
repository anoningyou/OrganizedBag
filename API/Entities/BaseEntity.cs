using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public abstract class BaseEntity : IIdentifiable<Guid>
    {
        [Key]
        public Guid Id { get; set; }
    }
}