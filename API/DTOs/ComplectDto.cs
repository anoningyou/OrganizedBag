namespace API.DTOs
{
    public class ComplectDto : BaseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public List<GroupDto> Groups { get; set; } = new List<GroupDto>();
    }
}