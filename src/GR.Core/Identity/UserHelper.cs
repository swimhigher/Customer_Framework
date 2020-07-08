using GR.Core.Redis;
using System;
using System.Text.Json;

namespace GR.Core.Identity
{
    public class UserHelper
    {
        /// <summary>
        /// 新增或修改用户缓存
        /// </summary>
        /// <param name="user"></param>
        public static void AddOperator(Operator user)
        {
            RedisHelper.Set(Consts.Redis_Login_User + user.Name + user.Ip ?? "", user);
        }

        /// <summary>
        /// 清理当前用户的所有东东，，登出的时候调用
        /// </summary>
        public static void DeleteOperatorRedis()
        {
            try
            {
                var name = HttpContextExt.Current.User.Identity.GetLoginUserName();
                //用户缓存
                RedisHelper.Delete(Consts.Redis_Login_User + name + GetIp() ?? "");
                //用户权限缓存
                RedisHelper.Delete(Consts.Redis_User_AuthButton + name);
                RedisHelper.Delete(Consts.Redis_User_AuthMenu + name);
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 清理单个用户的权限缓冲
        /// </summary>
        public static void DeleteUserAuthRedis(string username)
        {
            try
            {
                RedisHelper.Delete(Consts.Redis_User_AuthButton + username);
                RedisHelper.Delete(Consts.Redis_User_AuthMenu + username);
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 清理所有用户权限缓存
        /// </summary>
        public static void DeleteAllUserAuthRedis()
        {
            try
            {
                RedisHelper.DeleteLikeKey($"*{Consts.Redis_User_AuthButton}*");
                RedisHelper.DeleteLikeKey($"*{Consts.Redis_User_AuthMenu}*");
            }
            catch (Exception ex)
            {
            }
        }

        /// <summary>
        /// 获取用户
        /// </summary>

        /// <returns></returns>
        public static Operator GetOperator(string name = "")
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                name = HttpContextExt.Current.User.Identity.GetLoginUserName();
            }
            string userJson = RedisHelper.Get(Consts.Redis_Login_User + name + GetIp() ?? "");
            if (!string.IsNullOrWhiteSpace(userJson))
            {
                return JsonSerializer.Deserialize<Operator>(userJson);
            }
            else
            {
                return null;
            }
        }

        public static string GetIp()
        {
            var ipaddress = HttpContextExt.Current.Connection.RemoteIpAddress.ToString();

            if (IsEffectiveIp(ipaddress))
            {
                if (ipaddress.Equals("127.0.0.1") || ipaddress.Equals("::1"))
                {
                    ipaddress = "127.0.0.1";
                }
            }
            return ipaddress;
        }

        /// <summary>
        /// 是否有效IP地址
        /// </summary>
        /// <param name="ipAddress">IP地址</param>
        /// <returns>bool</returns>
        private static bool IsEffectiveIp(string ipAddress)
        {
            return !(string.IsNullOrEmpty(ipAddress) || "unknown".Equals(ipAddress, StringComparison.OrdinalIgnoreCase));
        }
    }
}