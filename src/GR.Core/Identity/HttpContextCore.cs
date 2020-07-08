using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace GR.Core.Identity
{
    public static class HttpContextCore
    {
        public static IServiceProvider ServiceProvider;
        public static HttpContext Current
        {
            get
            {
                object factory = ServiceProvider.GetService(typeof(IHttpContextAccessor));
                HttpContext context = ((HttpContextAccessor)factory).HttpContext;
                return context;
            }
        }
    }
}
