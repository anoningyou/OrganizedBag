using API.Enums;

namespace API.DTOs
{
    public class PropertyDto : BaseDto
    {
        public string Name { get; set; }
        public ValueTypeEnum ValueType { get; set; }
        public  List<PropertyAttributeDto> Attributes { get; set; } = new List<PropertyAttributeDto>();
        public PropertyParamDto Params { get; set; }
    }
}