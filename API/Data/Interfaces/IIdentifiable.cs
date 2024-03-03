namespace API;

public interface IIdentifiable<TPrimaryKey>
{
    public TPrimaryKey Id { get; set; }
}
