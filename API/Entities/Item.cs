namespace API.Entities
{
    public class Item : BaseEntity
    {
        public virtual AppUser User { get; set; }
        public ICollection<PropertyValue> Values { get; set; }
        public virtual ICollection<ComplectItem> Complects { get; set; }
    }
}