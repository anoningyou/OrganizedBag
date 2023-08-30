namespace API.Entities
{
    public class GroupItem
    {
        public Item Item { get; set; }
        public Guid ItemId { get; set; }
        public Guid GroupId { get; set; } 
        public Group Group { get; set; }  
        public int Count { get; set; } = 1;     
    }
}