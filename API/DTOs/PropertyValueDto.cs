namespace API.DTOs
{
    public class PropertyValueDto
    {
        public Guid ItemId {get; set;}
        public Guid PropertyId {get; set;}
        public string Value { get; set; }
    }
}