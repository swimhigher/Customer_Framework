using DataBase;
using GR.Core.Identity;
using GR.Core.Log4net;
using GR.Core.Redis;
using GR.Entity;
using GR.Entity.Dto;
using GR.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static DataBase.ConfigDb;

namespace GR.Services
{
    public class SysRoleServices : ISysRoleServices
    {
        private LogFactory logger = LogFactory.GetLogger(typeof(SysRoleServices));

        #region CRUD

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public void Save(SysRole entity)
        {
            if (string.IsNullOrEmpty(entity.Id))
            {
                var userid = UserHelper.GetOperator().Id;
                entity.CreateBy = userid;
            }
            Ser_SysRole.InsertOrUpdateExt(entity);
        }

        /// <summary>
        /// 获取对象
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysRole Get(string id)
        {
            return Ser_SysRole.Where(p => p.Id == id).First();
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete(string id)
        {
            var Affrows = fsql.Update<SysRole>()
                  .Set(b => b.State, -1)
                  .Where(b => b.Id == id)
                  .ExecuteAffrows();
            return Affrows > 0;
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
                    string sql = string.Format(@"SELECT count(*) val FROM sys_user  u
                                        join sys_role_user ur on u.id = ur.user_id
                                        join sys_role r on r.id = ur.role_id
                                        where r.id = '{0}' and u.state = 0", x);
                    var count = fsql.Ado.Query<int>(System.Data.CommandType.Text, sql).FirstOrDefault();
                    if (count > 0)
                    {
                        throw new Exception("存在关联用户，不允许删除");
                    }
                    if (!Delete(x))
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
        public bool Update(SysRole model)
        {
            var rows = fsql.Update<SysRole>().SetSource(model).IgnoreColumns(p => new { p.CreateBy, p.CreateOn }).ExecuteAffrows();
            return rows > 0;
        }

        /// <summary>
        /// 分页查询
        /// </summary>
        /// <param name="keyword">关键字</param>
        /// <param name="pageIndex">页数</param>
        /// <param name="pageSize">页码</param>
        /// <param name="sortColumn">排序字段</param>
        /// <param name="sortBy">ASC,DESC</param>
        /// <returns></returns>
        public Page<SysRole> GetPage(BaseSearchObject model)
        {
            var sql = new StringBuilder(" select a.*  from sys_role a where a.state='0'");
            if (!string.IsNullOrWhiteSpace(model.keyword))
            {
                sql.Append(string.Format("and (a.name like {0})", "'%" + model.keyword.Trim() + "%'"));
            }
            sql.Append(" order by a.create_on desc ");
            return fsql.Select<SysRole>().WithSql(sql.ToString()).ToPage(model.page, model.limit);
        }

        /// <summary>
        /// 获取所有列表
        /// </summary>
        /// <returns></returns>
        public List<SysRole> GetList()
        {
            return Ser_SysRole.Where(p => p.State == 0).ToList();
        }

        #endregion CRUD

        public List<SysButton> GetSysButtonList()
        {
            return fsql.Select<SysButton>().Where(x => x.State == 0).ToList();
        }

        public List<SysMenu> GetUserAuthMenu()
        {
            var opera = UserHelper.GetOperator();
            return RedisHelper.Get(Consts.Redis_User_AuthMenu + opera.Name, () =>
            {
                List<SysMenu> result = new List<SysMenu>();
                if (opera.IsAdministrator)//管理员具有所有权限
                {
                    result = fsql.Select<SysMenu>().Where(p => p.State == 0).OrderBy(p => p.OrderBy).ToList();
                }
                else
                {
                    var menusql = string.Format(@"select   m.* from sys_menu m
												LEFT join sys_role_menu  rm on rm.menu_id=m.id
												LEFT join  sys_role r on r.id=rm.role_id
												left join sys_role_user ur on r.id=ur.role_id
												left join sys_user u on u.id=ur.user_id
												where u.id='{0}'	and m.state=0  GROUP BY m.id order by m.sort ", opera.Id);
                    result = fsql.Select<SysMenu>().WithSql(menusql).ToList();
                }
                return result;
            });
        }

        public List<SysButton> GetUserAuthButton()
        {
            var opera = UserHelper.GetOperator();
            return RedisHelper.Get(Consts.Redis_User_AuthButton + opera.Name, () =>
            {
                List<SysButton> result = new List<SysButton>();
                if (opera.IsAdministrator)//管理员具有所有权限
                {
                    result = fsql.Select<SysButton>().Where(p => p.State == 0).ToList();
                }
                else
                {
                    var buttonsql = string.Format(@"	select   b.* from sys_button b
												LEFT join sys_role_button  rb on rb.button_id=b.id
												LEFT join  sys_role r on r.id=rb.role_id
												left join sys_role_user ur on r.id=ur.role_id
												left join sys_user u on u.id=ur.user_id
												where u.id='{0}' ", opera.Id);
                    result = fsql.Select<SysButton>().WithSql(buttonsql).ToList();
                }
                return result;
            });
        }

        /// <summary>
        /// 清理一个角色下所有用户  权限缓冲
        /// </summary>
        /// <param name="username"></param>
        public void RemoveUserAuthByRole(string roleid)
        {
            try
            {
                var sql = string.Format(@"SELECT  u.login_name from sys_user u
                        left join sys_role_user ur on u.id=ur.user_id
                        LEFT join  sys_role r on r.id=ur.role_id
                        where r.id='{0}'", roleid);
                var list = fsql.Select<string>().WithSql(sql).ToList();
                foreach (string username in list)
                {
                    UserHelper.DeleteUserAuthRedis(username);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex, "清除缓存失败");
            }
        }

        /// <summary>
        /// 获取所有列表
        /// </summary>
        /// <returns></returns>
        public List<SysRoleMenu> GetRoleMenuByRoleId(string roleid)
        {
            return fsql.Select<SysRoleMenu>().Where(p => p.RoleId == roleid).ToList();
        }

        public void SaveRoleMenuButton(string roleId, List<string> menuIds, List<string> authIds)
        {
            var userid = UserHelper.GetOperator().Id;

            fsql.Transaction(() =>
            {
                #region menu

                var existingList = GetSysMenuByRoleId(roleId);

                string[] existMenuIds = existingList.Select(x => x.MenuId).ToArray();

                //https://www.cnblogs.com/flywing/p/5912242.html

                var toDeleteList = existMenuIds.Except(menuIds).ToList();
                var toCreateList = menuIds.Except(existMenuIds).ToList();

                if (toDeleteList.Count > 0)
                {
                    var count = fsql.Select<SysRoleMenu>().Where(p => p.RoleId == roleId && toDeleteList.Contains(p.MenuId)).ToDelete().ExecuteAffrows();
                    //var sql = string.Format("delete from sys_role_menu where role_id='{0}' and menu_id in('')", roleId, string.Join("','", toDeleteList));
                    //fsql.Select<OneValue>().WithSql(sql.ToString()).First();
                    if (count != toDeleteList.Count)
                    {
                        throw new Exception("批量删除菜单失败");
                    }
                }
                if (toCreateList.Count > 0)
                {
                    foreach (var id in toCreateList)
                    {
                        Ser_SysRoleMenu.InsertOrUpdateExt(new SysRoleMenu()
                        {
                            RoleId = roleId,
                            MenuId = id
                        });
                    }
                }

                #endregion menu

                #region auth

                if (authIds == null || authIds.Count() == 0)
                {
                    int count = fsql.Select<SysRoleButton>().Where(p => p.RoleId == roleId).ToDelete().ExecuteAffrows();
                }
                else
                {
                    var existingAuthList = fsql.Select<SysRoleButton>().Where(x => x.RoleId == roleId);
                    var existAuthIds = existingAuthList.Select(x => x.ButtonId).ToList();

                    var toDeleteAuthIds = existAuthIds.Except(authIds).ToList();
                    var toCreateAuthIds = authIds.Except(existAuthIds).ToList();

                    if (toDeleteAuthIds.Count > 0)
                    {
                        var count = fsql.Select<SysRoleButton>().Where(p => p.RoleId == roleId && toDeleteList.Contains(p.ButtonId)).ToDelete().ExecuteAffrows();

                        if (count != toDeleteAuthIds.Count)
                        {
                            throw new Exception("批量删除权限失败");
                        }
                    }
                    if (toCreateAuthIds.Count > 0)
                    {
                        foreach (var id in toCreateAuthIds)
                        {
                            var entity = new SysRoleButton()
                            {
                                RoleId = roleId,
                                ButtonId = id
                            };
                            Ser_SysRoleButton.InsertOrUpdateExt(entity);
                        }
                    }
                }
            });

            #endregion auth

            //清理用户缓冲
            RemoveUserAuthByRole(roleId);
        }

        /// <summary>
        /// 获取所有列表
        /// </summary>
        /// <returns></returns>
        public List<SysRoleButton> GetRoleButtonByroleId(string roleid)
        {
            return fsql.Select<SysRoleButton>().Where(p => p.RoleId == roleid).ToList();
        }

        public List<SysRoleMenu> GetSysMenuByRoleId(string roleid)
        {
            return fsql.Select<SysRoleMenu>().Where(p => p.RoleId == roleid).ToList();
        }
    }
}