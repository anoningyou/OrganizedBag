namespace API.Entities
{
    public class Complect : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; }
        public virtual ICollection<Group> Groups { get; set; }
    }
}