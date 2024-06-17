using API.DTOs;

namespace API;

/// <summary>
/// Represents a command for updating property parameters.
/// </summary>
public class AddOrUpdateParamsCommand : ICommand<IEnumerable<PropertyParamDto>>
{
    /// <summary>
    /// Gets or sets the property parameters.
    /// </summary>
    public IEnumerable<PropertyParamDto> PropertyParams { get; set; }

    /// <summary>
    /// Gets or sets the user ID.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="AddOrUpdateParamsCommand"/> class.
    /// </summary>
    public AddOrUpdateParamsCommand()
    {
        
    }
    
    /// <summary>
    /// Initializes a new instance of the <see cref="AddOrUpdateParamsCommand"/> class with the specified property parameters and user ID.
    /// </summary>
    /// <param name="propertyParams">The property parameters.</param>
    /// <param name="userId">The user ID.</param>
    public AddOrUpdateParamsCommand(IEnumerable<PropertyParamDto> propertyParams, Guid userId)
    {
        PropertyParams = propertyParams;
        UserId = userId;
    }
}