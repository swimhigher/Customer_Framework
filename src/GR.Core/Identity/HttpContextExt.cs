﻿using Microsoft.AspNetCore.Http;

namespace GR.Core.Identity
{
    public static class HttpContextExt
    {
        private static IHttpContextAccessor _accessor;

        public static Microsoft.AspNetCore.Http.HttpContext Current => _accessor.HttpContext;

        internal static void Configure(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }
    }
}