using FreeSql;
using GR.Entity;
using System.Diagnostics;

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
                     .UseConnectionString(FreeSql.DataType.MySql, Conn)
                         //.UseLazyLoading(true)
                         .UseAutoSyncStructure(true) //自动同步实体结构到数据库
                       .UseMonitorCommand(
                       //监听SQL命令对象，在执行前
                       cmd => Trace.WriteLine(cmd.CommandText),
                      //监听SQL命令对象，在执行后
                      (cmd, traceLog) => Trace.WriteLine(traceLog))
                     .Build();
        }

        public static BaseRepository<Auditlog> Ser_Auditlog => fsql.GetRepository<Auditlog>();
        public static BaseRepository<SysUser> Ser_SysUsers => fsql.GetRepository<SysUser>();
        public static BaseRepository<SysButton> Ser_SysButton => fsql.GetRepository<SysButton>();
        //public static GuidRepository<TbSysDeptment> Ser_SysDeptment => fsql.GetGuidRepository<TbSysDeptment>();
        public static BaseRepository<SysMenu> Ser_SysMenu => fsql.GetRepository<SysMenu>();

        public static BaseRepository<SysRoleButton> Ser_SysRoleButton => fsql.GetRepository<SysRoleButton>();
        public static BaseRepository<SysRoleMenu> Ser_SysRoleMenu => fsql.GetRepository<SysRoleMenu>();
        public static BaseRepository<SysRole> Ser_SysRole => fsql.GetRepository<SysRole>();
        public static BaseRepository<SysRoleUser> Ser_SysRoleUser => fsql.GetRepository<SysRoleUser>();
    }
}