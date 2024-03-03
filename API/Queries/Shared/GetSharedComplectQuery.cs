namespace API;

public class GetSharedComplectQuery : IQuery<SharedComplectDto>
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
}
