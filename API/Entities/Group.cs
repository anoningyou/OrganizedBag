namespace API.Entities
{
    public class Group : BaseEntity
    {
        public string Name { get; set; }
        public Guid ComplectId { get; set; } 
        public virtual Complect Complect { get; set; }
        public virtual ICollection<GroupItem> Items { get; set; }
    }
}