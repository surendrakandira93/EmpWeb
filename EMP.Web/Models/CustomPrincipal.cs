using System;
using System.Linq;
using System.Security.Claims;

namespace EMP.Web.Models
{
    public class CustomPrincipal
    {
        private readonly ClaimsPrincipal _principal;

        public CustomPrincipal(ClaimsPrincipal principal)
        {
            _principal = principal;
        }
        public bool IsAuthenticated => (_principal.Identity?.IsAuthenticated) ?? false;
        public Guid UserId => Guid.Parse(_principal.Claims.FirstOrDefault(u => u.Type == ClaimTypes.PrimarySid)?.Value);      
        public string Name => _principal.Claims.FirstOrDefault(u => u.Type == ClaimTypes.Name)?.Value;
        public string Email => _principal.Claims.FirstOrDefault(u => u.Type == ClaimTypes.Email)?.Value;

    }
}
