namespace API.DTOs
{
    public class ComplectDto : BaseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public List<ComplectItemDto> Items { get; set; }
    }
}