using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimPrincipalExtensions
    {
        public static string GerUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var val = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return val != null ? Guid.Parse(val) : Guid.Empty;
        }
    }
}