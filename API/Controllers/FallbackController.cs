using Microsoft.AspNetCore.Mvc;

namespace API;

/// <summary>
/// Represents a controller that handles fallback requests.
/// </summary>
public class FallbackController : Controller
{
    /// <summary>
    /// Handles the fallback request and returns the index.html file from the wwwroot folder.
    /// </summary>
    /// <returns>The index.html file as a physical file result.</returns>
    public ActionResult Index()
    {
        return PhysicalFile(
            Path.Combine(Directory.GetCurrentDirectory(),"wwwroot", "index.html"),
            "text/HTML");
    }
}