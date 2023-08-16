namespace API.DTOs
{
    public abstract class BaseDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
    }
}