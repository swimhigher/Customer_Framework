
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using log4net;
using log4net.Config;
using log4net.Repository;

namespace GR.Core.Log4net
{
    public class LogFactory
    {
        //.net core2.0使用log4net操作
        //https://blog.csdn.net/qq254331474/article/details/79214102

        private readonly log4net.ILog logInstance = null;

        public static ILoggerRepository Repository
        {
            get; private set;
        }

        static LogFactory()
        {
            FileInfo configFile = new FileInfo($"{AppDomain.CurrentDomain.BaseDirectory}/config/log4net.config");
            if (!configFile.Exists)
            {
                //throw new FileNotFoundException($"未找到配置文件：/config/log4net.config");
                return;
            }
            if (LogManager.GetAllRepositories().Where(p => p.Name == "Log4net_Repository").Count() == 0)
            {
                Repository = LogManager.CreateRepository("Log4net_Repository");
              
            }
            else
            {
                Repository = LogManager.GetRepository("Log4net_Repository");

            }
            XmlConfigurator.Configure(Repository, configFile);
        }

        private LogFactory(ILog log)
        {
            logInstance = log;
        }

        /// <summary>
        /// [推荐使用]
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static LogFactory GetLogger(Type type)
        {
            return new LogFactory(LogManager.GetLogger(Repository.Name, type));

        }
        public static LogFactory GetLogger(string name)
        {
            return new LogFactory(log4net.LogManager.GetLogger(Repository.Name, name));
        }
        public LogFactory Fatal(Exception exception, object message = null)
        {
            if (logInstance.IsFatalEnabled)
                logInstance.Fatal(message, exception);

            return this;
        }
        /// <summary>
        /// 一般错误
        /// </summary>
        public LogFactory Error(Exception exception, object message = null)
        {
            if (logInstance.IsErrorEnabled)
                logInstance.Error(message, exception);

            return this;
        }
        /// <summary>
        /// 一般错误
        /// </summary>
        public LogFactory StrError(string exception)
        {
            if (logInstance.IsErrorEnabled)
                logInstance.Error(exception);

            return this;
        }
        /// <summary>
        /// 警告
        /// </summary>
        public LogFactory Warn(object message, Exception exception = null)
        {
            if (logInstance.IsWarnEnabled)
            {
                if (exception == null)
                {
                    logInstance.Warn(message);
                }
                else
                {

                    logInstance.Warn(message, exception);
                }
            }

            return this;
        }
        /// <summary>
        /// 一般信息
        /// </summary>
        public LogFactory Info(object message, Exception exception = null)
        {
            if (logInstance.IsInfoEnabled)
                logInstance.Info(message, exception);

            return this;
        }
        /// <summary>
        /// 调试信息
        /// </summary>
        public LogFactory Debug(object message, Exception exception = null)
        {
            if (logInstance.IsDebugEnabled)
                logInstance.Debug(message, exception);

            return this;
        }
        public LogFactory InterfaceInfo(string message, Exception exception = null)
        {

            logInstance.InterfaceInfo(message);

            return this;
        }
        //public LogFactory SangTang(string message, Exception exception = null)
        //{

        //    logInstance.SangTang(message, exception);

        //    return this;
        //}
    }
}
