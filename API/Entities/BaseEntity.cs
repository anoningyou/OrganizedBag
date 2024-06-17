using System.ComponentModel.DataAnnotations;

namespace API.Entities;

/// <summary>
/// Represents the base entity class that provides a common identifier property.
/// </summary>
public abstract class BaseEntity : IIdentifiable<Guid>
{
    /// <summary>
    /// Gets or sets the unique identifier for the entity.
    /// </summary>
    [Key]
    public Guid Id { get; set; }
}