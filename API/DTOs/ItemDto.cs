namespace API.DTOs
{
    public class ItemDto : BaseDto
    {
        public List<PropertyValueDto> Values { get; set; }
    }
}