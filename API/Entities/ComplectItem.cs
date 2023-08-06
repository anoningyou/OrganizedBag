namespace API.Entities
{
    public class ComplectItem
    {
        public Item Item { get; set; }
        public Guid ItemId { get; set; }
        public Guid ComplectId { get; set; } 
        public Complect Complect { get; set; }       
    }
}