using Microsoft.AspNetCore.Builder;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace GR.Helper
{
    public class SessionContext
    {
        private static SessionContext instance;
        private static object _lock = new object();

        /// <summary>
        /// 登录缓存hash表
        /// </summary>
        private Hashtable hashtable = Hashtable.Synchronized(new Hashtable());

        /// <summary>
        /// 超时时间（单位：分钟）
        /// </summary>
        private int timeout = 120 * 60;

        /// <summary>
        /// 构造函数
        /// </summary>
        private SessionContext() { }

        /// <summary>
        /// 获取实例（单例模式）
        /// </summary>
        /// <returns></returns>
        public static SessionContext Current
        {
            get
            {
                if (instance == null)
                {
                    lock (_lock)
                    {
                        if (instance == null)
                        {
                            instance = new SessionContext();
                        }
                    }
                }
                // 刷新列表
                instance.Refresh();
                return instance;
            }
        }

        /// <summary>
        /// 登录信息添加到缓存
        /// </summary>
        /// <param name="key">Session ID</param>
        /// <param name="userInfo">登录信息</param>
        public void Add(string key, SessionUser userInfo)
        {
            // 挤掉先前登录的用户
            //SetStateByUserID(userInfo.UserName, ConnectStatus.AnotherConnected, userInfo.Agent);
            // 添加缓存
            if (hashtable.ContainsKey(key))
            {
                hashtable[key] = userInfo;
            }
            else
            {
                hashtable.Add(key, userInfo);
            }

        }

        /// <summary>
        /// 从登录信息列表中移除该登录信息
        /// </summary>
        /// <param name="key">Session ID</param>
        public void Remove(string key)
        {
            if (!string.IsNullOrWhiteSpace(key))
            {
                hashtable.Remove(key);
            }
        }

        /// <summary>
        /// 根据Session ID，获取登录信息
        /// </summary>
        /// <param name="key">Session ID</param>
        /// <returns>登录信息，如果不存在则返回NULL</returns>
        public SessionUser GetConnect(string key)
        {
            SessionUser result = null;
            if (hashtable.ContainsKey(key))
            {
                result = hashtable[key] as SessionUser;
                result.LastActiveTime = DateTime.Now;
                hashtable[key] = result;
            }
            return result;
        }

        public SessionUser User
        {
            get
            {
                string key = HttpContextEx.Current.User.Identity.Name;
                if (!string.IsNullOrWhiteSpace(key))
                {
                    return GetConnect(key);
                }
                return null;
            }
        }

        /// <summary>
        /// 获取在线用户
        /// </summary>
        /// <returns>登录信息列表</returns>
        public IList<SessionUser> OnlineUsers()
        {
            IList<SessionUser> result = new List<SessionUser>();
            foreach (string key in new ArrayList(hashtable.Keys))
            {
                SessionUser entity = hashtable[key] as SessionUser;
                if (entity != null && entity.State.Equals(ConnectState.Connection))
                {
                    result.Add(entity);
                }
            }
            return result;
        }

        /// <summary>
        /// 根据用户ID设置登录状态
        /// </summary>
        /// <param name="userID">用户ID</param>
        /// <param name="State">登录状态</param>
        /// <param name="Agent">连接媒介</param>
        internal void SetStateByUserID(string userID, ConnectState State, ConnectAgent Agent)
        {
            foreach (string key in new ArrayList(hashtable.Keys))
            {
                SessionUser entity = hashtable[key] as SessionUser;
                if (entity != null && entity.UserName.Equals(userID) && entity.Agent.Equals(Agent))
                {
                    entity.State = State;
                    hashtable[key] = entity;
                }
            }
        }

        internal void Refresh()
        {
            foreach (string key in new ArrayList(hashtable.Keys))
            {
                SessionUser entity = hashtable[key] as SessionUser;
                if (entity == null || (DateTime.Now - entity.LastActiveTime).TotalMinutes > timeout)
                {
                    hashtable.Remove(key);
                }
            }
        }

        public void UpdateUserInfo(string userID, SessionUser userInfo)
        {
            foreach (string key in new ArrayList(hashtable.Keys))
            {
                SessionUser entity = hashtable[key] as SessionUser;
                if (entity != null && entity.UserName.Equals(userID))
                {
                    hashtable[key] = userInfo;
                }
            }
        }

        public bool IsAuthenticated
        {
            get
            {
                return HttpContextEx.Current.User.Identity.IsAuthenticated;
            }
        }

        /// <summary>
        /// 用户是否登入过
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public bool IsExists(string userId) { return hashtable.ContainsKey(userId); }

        public SessionUser GetUserByUserName(string userId)
        {
            try
            {
                foreach (string key in new ArrayList(hashtable.Keys))
                {
                    SessionUser entity = hashtable[key] as SessionUser;
                    if (entity != null && entity.Name == userId)
                    {
                        return entity;
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
            return null;
        }
    }
}
