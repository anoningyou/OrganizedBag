namespace API.DTOs
{
    public class ComplectItemDto
    {
        public Guid ItemId { get; set; }
        public Guid ComplectId { get; set; }
        public int Count { get; set; } = 1;
    }
}