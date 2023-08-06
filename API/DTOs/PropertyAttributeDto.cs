using API.Enums;

namespace API.DTOs
{
    public class PropertyAttributeDto
    {
        public PropertyAttributeTypeEnum Type { get; set; }
        public string Value { get; set; }
    }
}