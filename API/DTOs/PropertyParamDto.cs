namespace API.DTOs
{
    public class PropertyParamDto
    {
        public Guid PropertyId { get; set; }
        public int ListOrder { get; set; } = int.MaxValue;
        public bool ListDisplay { get; set; } = true;
        public int ListWidth { get; set; } = 50;
        public int ComplectOrder { get; set; } = int.MaxValue;
        public bool ComplectDisplay { get; set; } = true;
        public int ComplectWidth { get; set; } = 100;
    }
}