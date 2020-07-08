using System.Security.Claims;
using System.Security.Principal;
using System.Text.Json;

namespace GR.Core.Identity
{
    public static class IdentityExtention

    {
        /// <summary>
        /// 获取登陆用户名
        /// </summary>
        /// <param name="identity"></param>
        /// <returns></returns>
        public static string GetLoginUserName(this IIdentity identity)
        {
            try
            {
                if (identity != null)
                {
                    var claim = (identity as ClaimsIdentity).FindFirst(Consts.Claim_Login_Name);
                    if (claim != null) return claim.Value.ToString();
                }
            }
            catch { }
            return "";
        }

        /// <summary>
        /// 获取登陆用户id
        /// </summary>
        /// <param name="identity"></param>
        /// <returns></returns>
        public static string GetLoginUserId(this IIdentity identity)
        {
            try
            {
                if (identity != null)
                {
                    var claim = (identity as ClaimsIdentity).FindFirst(Consts.Claim_Login_Id);
                    if (claim != null) return claim.Value.ToString();
                }
            }
            catch { }
            return "";
        }

        /// <summary>
        /// 获取登录用户(弃用)
        /// </summary>
        /// <param name="identity"></param>
        /// <returns></returns>
        public static Operator Current(this IIdentity identity)
        {
            try
            {
                if (identity != null)
                {
                    var claim = (identity as ClaimsIdentity).FindFirst(Consts.Claim_Login_Name);
                    if (claim != null)
                        return JsonSerializer.Deserialize<Operator>(claim.Value.ToString());
                }
            }
            catch { }
            return null;
        }
    }
}