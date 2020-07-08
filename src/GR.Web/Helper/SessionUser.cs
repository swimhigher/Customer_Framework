using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace GR.Helper
{
    public class SessionUser
    {
        public SessionUser()
        {
            this.LoginTime = DateTime.Now;
            this.LastActiveTime = DateTime.Now;
            this.Ip = GetIp(HttpContextEx.Current.Request);
            IsAdministrator = false;
        }

        /// <summary>
        /// ID
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// 用户（显示）名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 用户（登录）名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 用户密码
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// 微信OpenId
        /// </summary>
        public string WxOpenId { get; set; }

        /// <summary>
        /// 会见区Id
        /// </summary>
        public string MAreaId { get; set; }
        /// <summary>
        /// 最后登录时间
        /// </summary>
        public DateTime LastActiveTime { get; set; }

        /// <summary>
        /// IP
        /// </summary>
        public string Ip { get; set; }

        /// <summary>
        /// 登录时间
        /// </summary>
        public DateTime LoginTime { get; set; }

        /// <summary>
        /// 登录失败的次数
        /// </summary>
        public int FailCount { get; set; }

        /// <summary>
        /// 连接状态
        /// </summary>
        public ConnectState State { get; set; }

        /// <summary>
        /// 连接媒介
        /// </summary>
        public ConnectAgent Agent { get; set; }

        /// <summary>
        /// 是否管理员
        /// </summary>
        public bool IsAdministrator { get; set; }


        public int UserType { get; set; }


        public string UserTypeName
        {
            get
            {
                string result = "";
                switch (UserType)
                {
                    case 0:
                        result = "普通用户";
                        break;
                    case 1:
                        result = "普通用户";
                        break;
                    case 2:
                        result = "超级管理员";
                        break;
                }
                return result;
            }
        }
        /// <summary>
        /// 额外数据
        /// </summary>
        public dynamic Data { get; set; }


        private string GetIp(HttpRequest request)
        {
            var ipaddress = HttpContextEx.Current.Connection.RemoteIpAddress.ToString();
            if (request == null) return string.Empty;
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

    /// <summary>
    /// 连接状态
    /// </summary>
    public enum ConnectState
    {
        /// <summary>
        /// 没有连接
        /// </summary>
        NoConnection = 1,
        /// <summary>
        /// 连接中
        /// </summary>
        Connection = 2,
        /// <summary>
        /// 别处登录
        /// </summary>
        AnotherConnected = 3
    }

    /// <summary>
    /// 连接媒介
    /// </summary>
    public enum ConnectAgent
    {
        /// <summary>
        /// 电脑
        /// </summary>
        PC = 1,
        /// <summary>
        /// 移动设备
        /// </summary>
        Mobile = 2
    }
}
