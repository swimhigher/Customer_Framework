using FreeSql;
using GR.entity;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;

namespace DataBase
{
    /// <summary>
    /// ORM初始化
    /// </summary>
    public static class ConfigDb
    {
        public static IFreeSql fsql { get; private set; }
        public static void Init(string Conn)
        {

            fsql = new FreeSql.FreeSqlBuilder()
                     .UseConnectionString(FreeSql.DataType.MySql,
                         Conn)
                       //.UseLazyLoading(true)
                       // .UseAutoSyncStructure(true) //自动同步实体结构到数据库
                       .UseMonitorCommand(
                       //监听SQL命令对象，在执行前
                       cmd => Trace.WriteLine(cmd.CommandText),
                      //监听SQL命令对象，在执行后
                      (cmd, traceLog) => Trace.WriteLine(traceLog))
                     .Build();


        }
        public static BaseRepository<Auditlog> Ser_Auditlog => fsql.GetRepository<Auditlog>();
        public static GuidRepository<TbSysUsers> Ser_SysUsers => fsql.GetGuidRepository<TbSysUsers>();
    }
}
