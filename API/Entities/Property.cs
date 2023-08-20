using API.Enums;


namespace API.Entities
{
    public class Property : BaseEntity
    {
        public string Name { get; set; }
        public ValueTypeEnum ValueType { get; set; }
        public virtual ICollection<PropertyAttribute> Attributes { get; set; }
        public virtual ICollection<PropertyValue> Values { get; set; }
        public virtual ICollection<PropertyParam> Params { get; set; }
        public virtual PropertyParamCommon ParamCommon { get; set; }

    }
}