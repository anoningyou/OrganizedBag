namespace API;

/// <summary>
/// Represents a query to get a shared complect.
/// </summary>
public class GetSharedComplectQuery : IQuery<SharedComplectDto>
{
    /// <summary>
    /// Gets or sets the ID of the shared complect.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the ID of the user.
    /// </summary>
    public Guid? UserId { get; set; }
}