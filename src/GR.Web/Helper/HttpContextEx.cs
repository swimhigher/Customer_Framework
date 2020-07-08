using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.AspNetCore.Builder
{
    public static class HttpContextEx
    {
        private static IHttpContextAccessor _accessor;

        public static Microsoft.AspNetCore.Http.HttpContext Current => _accessor.HttpContext;

        internal static void Configure(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }
    }
}
