using System;
using System.Collections.Generic;

namespace GR.Core.Identity
{
    public class Operator
    {
        public Operator()
        {
            this.LoginTime = DateTime.Now;
            this.LastActiveTime = DateTime.Now;
            this.Ip = UserHelper.GetIp();
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
        //public ConnectState State { get; set; }

        /// <summary>
        /// 是否管理员
        /// </summary>
        public bool IsAdministrator { get; set; }

        public int UserType { get; set; }

        //public string UserTypeName
        //{
        //    get
        //    {
        //        string result = "";
        //        switch (UserType)
        //        {
        //            case 1:
        //                result = "超级管理员";
        //                break;
        //            case 0:
        //                result = "普通用户";
        //                break;
        //            default:
        //                result = "普通用户";
        //                break;
        //        }
        //        return result;
        //    }
        //    set
        //    {
        //        UserTypeName = value;
        //    }
        //}
        /// <summary>
        /// 额外数据
        /// </summary>
        public dynamic Data { get; set; }

        /// <summary>
        /// 拥有的按钮权限
        /// </summary>
        public List<string> UserButtonAuth { get; set; }
    }

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
}