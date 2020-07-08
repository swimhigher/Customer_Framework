using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace GR.Core.Redis
{
    public class RedisHelper
    {
        private static object redisLock = new object();
        private static volatile IConnectionMultiplexer _connection;
        private static volatile ConnectionMultiplexer _connectionMultiplexer;

        /// <summary>
        /// 单例获取redis连接数据库
        /// </summary>
        /// <returns></returns>
        private static IDatabase GetDatabase()
        {
            lock (redisLock)
            {
                if (_connection != null && _connection.IsConnected)
                {
                    return _connection.GetDatabase();
                }
                if (_connection != null)
                {
                    _connection.Dispose();
                }
                _connection = ConnectionMultiplexer.Connect(RedisConfigHelper.GetRedisConnectionString());
                return _connection.GetDatabase();
            }
        }

        /// <summary>
        /// 单例获取redis服务
        /// </summary>
        /// <returns></returns>
        private static IServer GetServer()
        {
            lock (redisLock)
            {
                if (_connection != null && _connection.IsConnected)
                {
                    return _connection.GetServer(_connection.GetEndPoints()[0]);
                }
                if (_connection != null)
                {
                    _connection.Dispose();
                }
                _connection = ConnectionMultiplexer.Connect(RedisConfigHelper.GetRedisConnectionString());
                return _connection.GetServer(_connection.GetEndPoints()[0]);
            }
        }

        /// <summary>
        /// 判断key是否存在
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool IsExist(string key)
        {
            return GetDatabase().KeyExists(key);
        }

        /// <summary>
        /// 设置缓存值
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="cacheTime">过期时间，单位秒</param>
        public static bool Set(string key, object value, int? expiresencends = null)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentNullException("key不能为空或者空字符串");
            }
            if (value == null)
            {
                throw new ArgumentNullException("value不能为null");
            }
            string servializedValue = JsonSerializer.Serialize(value);
            if (expiresencends.HasValue)
            {
                TimeSpan expire = TimeSpan.FromSeconds(Convert.ToDouble(expiresencends.Value));
                return GetDatabase().StringSet(key, servializedValue, expire);
            }
            else
            {
                return GetDatabase().StringSet(key, servializedValue);
            }
        }

        /// <summary>
        /// 设置缓存值
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="cacheTime">过期时间，单位秒</param>
        public static bool Set(string key, object value, DateTime expireTime)
        {
            if (!Set(key, value))
            {
                return false;
            }
            return GetDatabase().KeyExpire(key, expireTime);
        }

        public static string Get(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentNullException("key不能为空或者空字符串");
            }
            var value = GetDatabase().StringGet(key);
            return (!value.HasValue || value.IsNullOrEmpty) ? "" : value.ToString();
        }

        /// <summary>
        /// 获取缓存key
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>
        public static T Get<T>(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentNullException("key不能为空或者空字符串");
            }
            var value = Get(key);
            if (string.IsNullOrEmpty(value))
            {
                return default(T);
            }
            return JsonSerializer.Deserialize<T>(value);
        }

        /// <summary>
        /// 删除key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool Delete(string key)
        {
            return GetDatabase().KeyDelete(key);
        }

        /// <summary>
        /// 设置过期时间
        /// </summary>
        /// <param name="key"></param>
        /// <param name="cacheTime"></param>
        /// <returns></returns>
        public static bool SetExpire(string key, int cacheTime)
        {
            return GetDatabase().KeyExpire(key, TimeSpan.FromSeconds(cacheTime));
        }

        /// <summary>
        /// 设置特定时间过期
        /// </summary>
        /// <param name="key"></param>
        /// <param name="cacheTime"></param>
        /// <returns></returns>
        public static bool SetExpire(string key, DateTime cacheTime)
        {
            return GetDatabase().KeyExpire(key, cacheTime);
        }

        /// <summary>
        /// 获取所有的key
        /// </summary>
        /// <returns></returns>
        public static List<string> GetAllKeys()
        {
            return GetServer().Keys(GetDatabase().Database, "*").Select(s => s.ToString()).ToList();
        }

        /// <summary>
        /// 获取符合keys模式的所有key
        /// </summary>
        /// <param name="keys"></param>
        /// <returns></returns>
        public static List<string> GetKeys(string keys)
        {
            return GetServer().Keys(GetDatabase().Database, keys).Select(s => s.ToString()).ToList();
        }

        /// <summary>
        /// 删除所有的keys
        /// </summary>
        /// <returns></returns>
        public static bool DeleteAllKeys()
        {
            //如果redis不存在key，则直接返回true
            IEnumerable<RedisKey> keys = GetServer().Keys(GetDatabase().Database, "*");
            if (keys == null || !keys.Any())
            {
                return true;
            }
            //删除的key的数目必须与存在的key相同，才算删除所有
            return GetDatabase().KeyDelete(keys.ToArray()) >= keys.Count();
        }

        public static T Get<T>(string Key, Func<T> factory)
        {
            var value = Get(Key);
            if (!string.IsNullOrEmpty(value))
            {
                return JsonSerializer.Deserialize<T>(value);
            }
            else
            {
                var ob = factory();
                Set(Key, ob);
                return ob;
            }
        }

        /// <summary>
        /// 获取key
        /// </summary>
        /// <param name="pattern"></param>
        /// <returns></returns>
        public static IEnumerable<RedisKey> LikeKeys(string pattern)
        {
            var list = GetServer().Keys(GetDatabase().Database, pattern);
            return list;
        }

        public static void DeleteLikeKey(string patten)
        {
            foreach (var item in LikeKeys(patten))
            {
                Delete(item.ToString());
            }
        }
    }
}