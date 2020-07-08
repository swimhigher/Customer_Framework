using DataBase;
using GR.Core.Identity;
using GR.Core.Log4net;
using GR.Entity;
using GR.Entity.Dto_SysUsers;
using GR.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static DataBase.ConfigDb;

namespace GR.Services
{
    public class SysUserServices : ISysUserServices
    {
        private LogFactory logger = LogFactory.GetLogger(typeof(SysUserServices));

        public List<SysUser> GetList()
        {
            return Ser_SysUsers.Where(p => p.State == 0).ToList();
        }

        public SysUser GetUserByName(string name)
        {
            return Ser_SysUsers.Where(p => p.LoginName == name).First();
        }

        #region CRUD

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public void Save(SysUser entity)
        {
            Ser_SysUsers.InsertOrUpdateExt(entity);
        }

        /// <summary>
        /// 获取对象
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysUser Get(string id)
        {
            return Ser_SysUsers.Where(p => p.Id == id).First();
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete(string id)
        {
            var Affrows = fsql.Update<SysUser>()
                  .Set(b => b.State, (int)DbDataStstus.已删除)
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
        public bool Update(SysUser model)
        {
            var rows = fsql.Update<SysUser>().SetSource(model).IgnoreColumns(p => new { p.CreateBy, p.CreateOn }).ExecuteAffrows();
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
        public Page<SysUser> GetPage(SysUsersSearchModel model)
        {
            var sql = new StringBuilder(@" select a.* from sys_user a

                                        where a.state!=-1");
            if (!string.IsNullOrWhiteSpace(model.keyword))
            {
                sql.Append(string.Format(" and (a.name like '{0}')", "%" + model.keyword.Trim() + "%"));
            }

            if (model.state != -1)
            {
                sql.Append($" and (a.state = '{model.state}')");
            }
            sql.Append(" order by a.create_on desc ");
            var result = fsql.Select<SysUser>().WithSql(sql.ToString()).ToPage(model.page, model.limit);
            return result;
        }

        #endregion CRUD

        /// <summary>
        /// 切换用户状态
        /// </summary>
        /// <param name="id"></param>
        /// <param name="disabled"></param>
        /// <returns></returns>
        public bool ToggleState(string id, bool disabled)
        {
            var Affrows = fsql.Update<SysUser>()
                  .Set(b => b.State, disabled ? (int)DbDataStstus.禁用 : (int)DbDataStstus.已启用)
                  .Where(b => b.Id == id)
                  .ExecuteAffrows();
            return Affrows > 0;
        }

        public List<SysRoleUser> GetUserRoleList(string userId)
        {
            return Ser_SysRoleUser.Where(x => x.UserId == userId).ToList();
        }

        public bool ChangePassword(string id, string newpassword)
        {
            var Affrows = fsql.Update<SysUser>()
                  .Set(b => b.Password, newpassword)
                  .Where(b => b.Id == id)
                  .ExecuteAffrows();
            return Affrows > 0;
        }

        /// <summary>
        /// 保存实体更改
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="roleIds"></param>
        /// <returns></returns>
        public bool SaveUserRoll(string userId, string[] roleIds)
        {
            var opera = UserHelper.GetOperator();
            var userid = opera.Id;
            var list = fsql.Select<SysRoleUser>().Where(p => p.UserId == userid).ToList();// GetList(userId);
            var existRoleIds = list.Select(x => x.RoleId).ToList();

            roleIds = roleIds ?? new string[0];

            var toDeleteList = existRoleIds.Except(roleIds).ToList();
            var toCreateList = roleIds.Except(existRoleIds).ToList();

            if (toDeleteList.Count > 0)
            {
                var count = fsql.Select<SysRoleUser>().Where(p => p.UserId == userId && toDeleteList.Contains(p.RoleId)).ToDelete().ExecuteAffrows();

                //var sql = new StringBuilder("delete from sys_user_role where user_id='" + userId + "' and role_id in ('" + string.Join("','", toDeleteList) + "')");
                //fsql.Select<OneValue>().WithSql(sql.ToString()).First();
            }

            foreach (var item in toCreateList)
            {
                var entity = new SysRoleUser()
                {
                    RoleId = item,
                    UserId = userId,
                    CreateBy = userid
                };
                Ser_SysRoleUser.InsertOrUpdateExt(entity);
            }

            //清除用户对应的权限缓冲
            var userName = fsql.Select<SysUser>().Where(p => p.Id == userId).First().LoginName;
            UserHelper.DeleteUserAuthRedis(userName);

            return true;
        }
    }
}