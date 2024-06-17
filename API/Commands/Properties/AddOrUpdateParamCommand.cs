using API.DTOs;

namespace API;

/// <summary>
/// Represents a command for updating property parameter.
/// </summary>
public class AddOrUpdateParamCommand : ICommand<PropertyParamDto>
{
    /// <summary>
    /// Gets or sets the property parameter.
    /// </summary>
    public PropertyParamDto PropertyParam { get; set; }

    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="AddOrUpdateParamsCommand"/> class.
    /// </summary>
    public AddOrUpdateParamCommand()
    {
        
    }
    
    /// <summary>
    /// Initializes a new instance of the <see cref="AddOrUpdateParamsCommand"/> class with the specified property parameter and user ID.
    /// </summary>
    /// <param name="propertyParam">The property parameter.</param>
    /// <param name="userId">The user ID.</param>
    public AddOrUpdateParamCommand(PropertyParamDto propertyParam, Guid userId)
    {
        PropertyParam = propertyParam;
        UserId = userId;
    }
}