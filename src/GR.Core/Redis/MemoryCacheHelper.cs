using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;

namespace GR.Core.Redis
{
    public class MemoryCacheHelper
    {
        private static MemoryCache cache = null;
        private static object cacheLock = new object();

        /// <summary>
        /// 默认滑动过期时间
        /// </summary>
        private static TimeSpan slidingExpiration = TimeSpan.FromSeconds(RedisConfigHelper.GetMemoryCachedefaultSlidingExpiration());

        private static MemoryCache GetCache()
        {
            if (cache == null)
            {
                lock (cacheLock)
                {
                    if (cache == null)
                    {
                        cache = new MemoryCache(new MemoryCacheOptions()
                        {
                            //每30秒扫描一次，删除失效的缓存
                            ExpirationScanFrequency = TimeSpan.FromSeconds(RedisConfigHelper.GetMemoryCacheExpirationScanFrequency())
                        });
                    }
                }
            }
            return cache;
        }

        public static int GetCount()
        {
            return GetCache().Count;
        }

        /// <summary>
        /// 清空缓存
        /// </summary>
        /// <returns></returns>
        public static bool Clear()
        {
            return SuccessOrFail(() =>
            {
                List<string> keys = RedisHelper.GetAllKeys();
                if (RedisConfigHelper.GetEnableMemoryCache())
                {
                    foreach (var key in keys)
                    {
                        cache.Remove(key);
                    }
                }
                RedisHelper.DeleteAllKeys();
            });
        }

        /// <summary>
        /// 缓存中是否存在
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool Exist(string key)
        {
            if (RedisConfigHelper.GetEnableMemoryCache())
            {
                object cache;
                if (GetCache().TryGetValue(key, out cache))
                {
                    return true;
                }
            }
            return RedisHelper.IsExist(key);
        }

        /// <summary>
        /// 删除指定的key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool Delete(string key)
        {
            return SuccessOrFail(() =>
            {
                if (RedisConfigHelper.GetEnableMemoryCache())
                {
                    GetCache().Remove(key);
                }
                RedisHelper.Delete(key);
            });
        }

        /// <summary>
        /// 获取缓存
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <returns></returns>
        public static T Get<T>(string key)
        {
            try
            {
                IsNullOrEmptyString(key);
                if (RedisConfigHelper.GetEnableMemoryCache())
                {
                    T cache;
                    if (GetCache().TryGetValue<T>(key, out cache))
                    {
                        return cache;
                    }
                }
                return RedisHelper.Get<T>(key);
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }

        /// <summary>
        /// 获取key,不存在则执行func，返回结果保存到缓存
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="func"></param>
        /// <returns></returns>
        public static T Get<T>(string key, Func<T> func)
        {
            try
            {
                T cache;
                try
                {
                    cache = Get<T>(key);
                    if (cache == null || cache.Equals(default(T)))
                    {
                        cache = func();
                        Set(key, cache);
                    }
                }
                catch (Exception e)
                {
                    cache = func();
                }
                return cache;
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }

        /// <summary>
        /// 获取key,不存在则执行func，返回结果保存到缓存
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="func"></param>
        /// <param name="expiresencends">缓存有效时间，单位秒</param>
        /// <returns></returns>
        public static T Get<T>(string key, Func<T> func, int expiresencends)
        {
            T cache;
            try
            {
                cache = Get<T>(key);
                if (cache == null || cache.Equals(default(T)))
                {
                    cache = func();
                    Set(key, cache, expiresencends);
                }
            }
            catch (Exception e)
            {
                cache = func();
            }
            return cache;
        }

        /// <summary>
        /// 获取key,不存在则执行func，返回结果保存到缓存
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key"></param>
        /// <param name="func"></param>
        /// <param name="expireTime">失效时间</param>
        /// <returns></returns>
        public static T Get<T>(string key, Func<T> func, DateTime expireTime)
        {
            T cache;
            try
            {
                cache = Get<T>(key);
                if (cache == null || cache.Equals(default(T)))
                {
                    cache = func();
                    Set(key, cache, expireTime);
                }
            }
            catch (Exception e)
            {
                cache = func();
            }
            return cache;
        }

        /// <summary>
        /// 保存缓存
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool Set(string key, object value)
        {
            IsNullOrEmptyString(key);
            return SuccessOrFail(() =>
            {
                if (RedisConfigHelper.GetEnableMemoryCache())
                {
                    GetCache().Set(key, value, new MemoryCacheEntryOptions() { SlidingExpiration = slidingExpiration });
                }
                RedisHelper.Set(key, value);
            });
        }

        /// <summary>
        /// 保存缓存
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="expireTime">失效时间</param>
        /// <returns></returns>
        public static bool Set(string key, object value, DateTime expireTime)
        {
            IsNullOrEmptyString(key);
            return SuccessOrFail(() =>
            {
                if (RedisConfigHelper.GetEnableMemoryCache())
                {
                    GetCache().Set(key, value, new MemoryCacheEntryOptions() { AbsoluteExpiration = expireTime });
                }
                RedisHelper.Set(key, value, expireTime);
            });
        }

        /// <summary>
        /// 保存缓存
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="expiresencends">缓存有效时间，单位秒</param>
        /// <returns></returns>
        public static bool Set(string key, object value, int expiresencends)
        {
            IsNullOrEmptyString(key);
            return SuccessOrFail(() =>
            {
                if (RedisConfigHelper.GetEnableMemoryCache())
                {
                    GetCache().Set(key, value, TimeSpan.FromSeconds(expiresencends));
                }
                RedisHelper.Set(key, value, expiresencends);
            });
        }

        public static void IsNullOrEmptyString(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentNullException("key不能为空或者空字符串");
            }
        }

        private static bool SuccessOrFail(Action action)
        {
            bool success = true;
            try
            {
                action();
            }
            catch (Exception e)
            {
                success = false;
            }
            return true;
        }
    }
}