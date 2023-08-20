namespace API.Entities
{
    public class PropertyParam
    {
        public Guid UserId { get; set; }
        public virtual AppUser User { get; set; }
        public Guid PropertyId { get; set; }
        public virtual Property Property { get; set; }
        public int ListOrder { get; set; }
        public bool ListDisplay { get; set; }
        public int ListWidth { get; set; }
        public int ComplectOrder { get; set; }
        public bool ComplectDisplay { get; set; }
        public int ComplectWidth { get; set; }
    }
}