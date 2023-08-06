namespace API.Entities
{
    public class PropertyValue
    {
        public virtual Item Item { get; set; }
        public Guid ItemId { get; set; }
        public virtual Property Property { get; set; }
        public Guid PropertyId { get; set; }
        public string Value { get; set; }
    }
}