using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.AspNetCore.Builder
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
            HttpContextEx.Configure(httpContextAccessor);
            return app;
        }
    }
}
