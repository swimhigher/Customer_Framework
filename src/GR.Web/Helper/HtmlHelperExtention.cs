using GR.Core.Ioc;
using GR.IServices;

using System;
using System.Linq;

namespace Microsoft.AspNetCore.Mvc.Rendering
{
    public static class HtmlHelperExtention
    {
        public static string GetVersion(this IHtmlHelper helper)
        {
#if DEBUG

            Random r = new Random();
            return (r.Next(0, 100).ToString());

#else
            return  ConfigurationManager.AppSettings.Get("version") ?? DateTime.Now.ToString("yyyyMMdd");
#endif
        }

        /// <summary>
        /// 用户菜单权限
        /// </summary>
        /// <returns></returns>
        //public static List<SysMenu> GetUserAuthMenu(this IHtmlHelper helper)
        //{
        //    return new SysRolesBLL().GetUserAuthMenu();
        //}

        /// <summary>
        /// 判断是否有按钮权限
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="code">按钮级权限编码</param>
        /// <returns></returns>
        public static bool HasPermission(this IHtmlHelper helper, string code)
        {
            var _ISysRoleServices = EngineContext.Current.Resolve<ISysRoleServices>();
            if (string.IsNullOrWhiteSpace(code))
            {
                return false;
            }
            var list = _ISysRoleServices.GetUserAuthButton();

            if (list.Where(p => p.Code.Trim() == code).Count() > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}