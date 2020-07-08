using DataBase;
using GR.Core.Log4net;
using GR.Entity;
using GR.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static DataBase.ConfigDb;

namespace GR.Services
{
    public class SysMenuServices : ISysMenuServices
    {
        private LogFactory logger = LogFactory.GetLogger(typeof(SysMenuServices));

        #region CRUD

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public void Save(SysMenu entity)
        {
            Ser_SysMenu.InsertOrUpdateExt(entity);
        }

        /// <summary>
        /// 获取对象
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysMenu Get(string id)
        {
            if (string.IsNullOrEmpty(id)) return null;
            return Ser_SysMenu.Where(o => o.Id == id).First();
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete(string id)
        {
            var Affrows = fsql.Update<SysMenu>()
                  .Set(b => b.State, (int)DbDataStstus.已删除)
                  .Where(b => b.Id == id)
                  .ExecuteAffrows();
            return Affrows > 0;
            //Guid guid = new Guid(id);
            //var Current = Ser_SysMenu.Get(guid);
            //Current.ISDELETE = 1;
            //Ser_SysMenu.Update(Current);
        }

        /// <summary>
        /// 批量删除
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public bool Deletes(string[] ids)
        {
            fsql.Transaction(() =>
            {
                ids.ToList().ForEach(x =>
                {
                    if (Delete(x))
                    {
                        throw new Exception("操作失败");
                    }
                });
            });
            return true;
        }

        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Update(SysMenu model)
        {
            var rows = fsql.Update<SysMenu>().SetSource(model).IgnoreColumns(p => new { p.CreateBy, p.CreateOn }).ExecuteAffrows();
            return rows > 0;
        }

        #endregion CRUD

        /// <summary>
        /// 切换菜单状态
        /// </summary>
        /// <param name="id"></param>
        /// <param name="disabled"></param>
        /// <returns></returns>
        public bool ToggleState(string id, bool disabled)
        {
            var Affrows = fsql.Update<SysMenu>()
                  .Set(b => b.State, disabled ? (int)DbDataStstus.禁用 : (int)DbDataStstus.已启用)
                  .Where(b => b.Id == id)
                  .ExecuteAffrows();
            return Affrows > 0;
        }

        /// <summary>
        /// 嵌套处理菜单关系
        /// </summary>
        /// <param name="list">所有菜单集合</param>
        /// <param name="item">当前递归的菜单对象</param>
        /// <returns></returns>
        public List<SysMenu> Nesting(List<SysMenu> list, SysMenu item = null)
        {
            List<SysMenu> values = new List<SysMenu>();
            if (item == null)
            {
                values = list.Where(x => x.ParentId == "0").OrderBy(p => p.OrderBy).ToList();
                values.ForEach(x =>
                {
                    x.Children = Nesting(list, x);
                });
            }
            else
            {
                values = list.Where(x => x.ParentId == item.Id).OrderBy(o => o.OrderBy).ToList();
                values.ForEach(x =>
                {
                    x.Children = Nesting(list, x);
                });
            }
            return values.Count > 0 ? values : null;
        }

        /// <summary>
        /// 获取菜单
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public List<SysMenu> GetList(bool ismenu = false)
        {
            StringBuilder sql = new StringBuilder("select *  from SYS_MENU  where IS_DELETE='0'");

            if (ismenu)
            {
                sql.Append(" And state='1' ");
            }
            sql.Append(" order by CREATE_On asc");

            return fsql.Select<SysMenu>().WithSql(sql.ToString()).ToList();
        }

        public List<SysMenu> GetListByUserId(string userId, string userName, int userType)
        {
            StringBuilder sql = new StringBuilder();

            if (userType == 2 || userName == "admin")
            {
                sql.Append("select a.*  from SYS_MENU a where state='1' And IS_DELETE='0'");
            }
            else
            {
                sql.Append(string.Format(@"select DISTINCT * from (
                                    select d.*
                                      from (select * from sys_user where id = '{0}') a
                                      left join sys_role_user b
                                        on a.id = b.user_id
                                      left join sys_role_menu c
                                        on b.role_id = c.role_id
                                      left join sys_menu d
                                        on c.menu_id = d.id
                                     where d.is_delete = 0
                                       and d.state = 1 and d.isdelete=0 ) a", userId));
                sql.Append(" order by a.ORDER_BY asc");
            }
            return fsql.Select<SysMenu>().WithSql(sql.ToString()).ToList();
        }

        public List<SysMenu> GetShotCutMenu(string userId)
        {
            var querysql = string.Format(@"select b.* from SYS_SHORTCUT_MENU t inner join sys_menu b on t.menu_id=b.id where t.user_id='{0}' order by  t.create_on asc ", userId);
            return fsql.Select<SysMenu>().WithSql(querysql.ToString()).ToList();
        }
    }
}