using API.Enums;

namespace API.Entities
{
    public class PropertyAttribute : BaseEntity
    {
        public PropertyAttributeTypeEnum Type { get; set; }
        public string Value { get; set; }
    }
}