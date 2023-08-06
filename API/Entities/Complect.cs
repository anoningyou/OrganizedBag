namespace API.Entities
{
    public class Complect : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual AppUser User { get; set; }
        public virtual ICollection<ComplectItem> Items { get; set; }
    }
}