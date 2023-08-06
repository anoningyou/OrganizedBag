using System.ComponentModel.DataAnnotations.Schema;
using API.Enums;


namespace API.Entities
{
    public class Property : BaseEntity
    {
        public string Name { get; set; }
        public ValueTypeEnum ValueType { get; set; }
        public virtual ICollection<PropertyAttribute> Attributes { get; set; }
        public virtual ICollection<PropertyValue> Values { get; set; }

    }
}