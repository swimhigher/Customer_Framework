using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace GR.Core.Identity
{
    public static class StaticHttpContextExtensions
    {
        public static void AddHttpContextAccessorEx(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        public static IApplicationBuilder UseStaticHttpContext(this IApplicationBuilder app)
        {
            var httpContextAccessor = app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
            HttpContextExt.Configure(httpContextAccessor);
            return app;
        }
    }
}