using DataBase;
using GR.Core.Log4net;
using GR.Entity;
using GR.Entity.Dto_SysButton;
using GR.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static DataBase.ConfigDb;


namespace GR.Services
{
    public class SysButtonServices : ISysButtonServices
    {
        private LogFactory logger = LogFactory.GetLogger(typeof(SysButtonServices));

        #region CRUD

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="entity"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public void Save(SysButton entity)
        {
            Ser_SysButton.InsertOrUpdateExt(entity);
        }

        /// <summary>
        /// 获取对象
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public SysButton Get(string id)
        {
            if (string.IsNullOrEmpty(id)) return null;
            return Ser_SysButton.Where(o => o.Id == id).First();
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool Delete(string id)
        {
            var Affrows = fsql.Update<SysButton>()
                  .Set(b => b.State, (int)DbDataStstus.已删除)
                  .Where(b => b.Id == id)
                  .ExecuteAffrows();
            return Affrows > 0;
            //Guid guid = new Guid(id);
            //var Current = Ser_SysButton.Get(guid);
            //Current.ISDELETE = 1;
            //Ser_SysButton.Update(Current);
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
        public bool Update(SysButton model)
        {
            var rows = fsql.Update<SysButton>().SetSource(model).IgnoreColumns(p => new { p.CreateBy, p.CreateOn }).ExecuteAffrows();
            return rows > 0;
        }

        #endregion CRUD
        /// <summary>
        /// 分页查询
        /// </summary>
        /// <param name="keyword">关键字</param>
        /// <param name="pageIndex">页数</param>
        /// <param name="pageSize">页码</param>
        /// <param name="sortColumn">排序字段</param>
        /// <param name="sortBy">ASC,DESC</param>
        /// <returns></returns>
        public Page<SysButtonView> GetPage(SysButtonSearchModel model)
        {

            var where = new StringBuilder(@" select a.*,menu.name  MenuName from sys_button a 
                                    left join sys_menu menu on menu.id = a.menu_id
                                    where a.state = 0");
            if (!string.IsNullOrWhiteSpace(model.Name))
            {
                where = where.Append(string.Format("and (a.name like '{0}')", "%" + model.Name.Trim() + "%"));
            }
            if (!string.IsNullOrWhiteSpace(model.MenuName))
            {
                where = where.Append(string.Format("and (menu.name like @0)", "%" + model.MenuName.Trim() + "%"));
            }
            where.Append(" order by a.create_on desc ");

            return fsql.Select<SysButtonView>().WithSql(where.ToString()).ToPage(model.page, model.limit);


        }
        /// <summary>
        /// 获取所有列表
        /// </summary>
        /// <returns></returns>
        public List<SysButton> GetList()
        {
            return Ser_SysButton.Where(x => x.State == 0).ToList();
        }
    }
}
