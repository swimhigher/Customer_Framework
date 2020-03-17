using log4net.Layout.Pattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace GR.Core.Log4net
{
    public static class Log4NetExtend
    {
        public static readonly log4net.Core.Level InterfaceLevel = new log4net.Core.Level(160000, "InterfaceInfo");
        //public static readonly log4net.Core.Level SangTangLevel = new log4net.Core.Level(170000, "SangTang");

        private static void AddProcessLevel(log4net.ILog log)
        {
            if (!log.Logger.Repository.LevelMap.AllLevels.Contains(InterfaceLevel))
            {
                log.Logger.Repository.LevelMap.Add(InterfaceLevel);
            }
        }

        public static void InterfaceInfo(this log4net.ILog log, string message)
        {
            AddProcessLevel(log);
            log.Logger.Log(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType,
                InterfaceLevel, message, null);
        }
      

        //public static void PersonFormat(this log4net.ILog log, string message, params object[] args)
        //{
        //    AddProcessLevel(log);
        //    string formattedMessage = string.Format(message, args);
        //    log.Logger.Log(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType,
        //        ProcessLevel, formattedMessage, null);
        //}
    }

    /// <summary>
    /// 输出当前进程名转换器
    /// </summary>
    public class ProcessPatternConvert : PatternLayoutConverter
    {
        private readonly static string processName = System.Diagnostics.Process.GetCurrentProcess().ProcessName;
        protected override void Convert(System.IO.TextWriter writer, log4net.Core.LoggingEvent loggingEvent)
        {
            writer.Write(processName);//输出当前进程名
        }
    }

    public class CustomPatternLayout : log4net.Layout.PatternLayout
    {
        public CustomPatternLayout()
        {
            this.AddConverter("proc", typeof(ProcessPatternConvert));
        }
    }
}
