using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API;

/// <summary>
/// Represents a query to get common property parameters.
/// </summary>
public class GetCommonPropertyParamQuery : IQuery<PropertyParamDto>
{
    /// <summary>
    /// Gets or sets the ID of the property.
    /// </summary>
    [Required]
    public Guid PropId { get; set; }
}
