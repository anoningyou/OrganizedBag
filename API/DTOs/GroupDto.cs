namespace API.DTOs
{
    public class GroupDto : BaseDto
    {
        public string Name { get; set; }
        public Guid ComplectId { get; set; }
        public List<GroupItemDto> Items { get; set; }
    }
}