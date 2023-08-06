using API.Enums;

namespace API.DTOs
{
    public class PropertyDto
    {
        public Guid Id { get; set; } = Guid.NewGuid(); 
        public string Name { get; set; }
        public ValueTypeEnum ValueType { get; set; }
        public  List<PropertyAttributeDto> Attributes { get; set; } = new List<PropertyAttributeDto>();
    }
}