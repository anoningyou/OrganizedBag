namespace API.Entities
{
    public class Item : BaseEntity
    {
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; }
        public ICollection<PropertyValue> Values { get; set; }
        public virtual ICollection<ComplectItem> Complects { get; set; }
    }
}