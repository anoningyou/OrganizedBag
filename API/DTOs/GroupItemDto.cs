namespace API.DTOs
{
    public class GroupItemDto
    {
        public Guid ItemId { get; set; }
        public Guid GroupId { get; set; }
        public int Count { get; set; } = 1;
    }
}