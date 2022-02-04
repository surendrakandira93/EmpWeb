using Microsoft.AspNetCore.Mvc.Razor;

namespace EMP.Web.Models
{
    public abstract class BaseViewPage<TModel> : RazorPage<TModel>
    {
        public CustomPrincipal CurrentUser => new CustomPrincipal(ContextProvider.Current.User);
    }
    public abstract class BaseViewPage : RazorPage
    {
        public CustomPrincipal CurrentUser => new CustomPrincipal(ContextProvider.Current.User);
    }
}
