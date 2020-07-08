using System;

namespace GR.Core.Redis
{
    public class RedisConfigHelper
    {
        /// <summary>
        /// 获取redis连接字符串
        /// </summary>
        /// <returns></returns>
        public static string GetRedisConnectionString()
        {
            return ConfigHelper.GetString("rediscache:redisconnectionstring");// ConfigHelper.GetString()["rediscache:redisconnectionstring"];
        }

        //private static IConfigurationRoot ConfigHelper.GetString()
        //{
        //    var builder = new ConfigurationBuilder()
        //        .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
        //        .AddJsonFile("config/base.json");
        //    return builder.Build();
        //}

        /// <summary>
        /// memorycache中扫描频率
        /// </summary>
        /// <returns></returns>
        public static int GetMemoryCacheExpirationScanFrequency()
        {
            return Convert.ToInt32(ConfigHelper.GetString("rediscache:ExpirationScanFrequency"));
        }

        /// <summary>
        /// memorycache中的默认滑动失效时间
        /// </summary>
        /// <returns></returns>
        public static int GetMemoryCachedefaultSlidingExpiration()
        {
            return Convert.ToInt32(ConfigHelper.GetString("rediscache:defaultSlidingExpiration"));
        }

        public static bool GetEnableMemoryCache()
        {
            return Convert.ToBoolean(ConfigHelper.GetString("rediscache:enableMemoryCache"));
        }
    }
}