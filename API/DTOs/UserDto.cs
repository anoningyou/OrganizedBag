namespace API.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }       
        public string Token { get; set; }
    }
}