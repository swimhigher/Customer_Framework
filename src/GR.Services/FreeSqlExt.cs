using FreeSql;
using GR.Core.Identity;
using GR.Entity;
using System;

namespace DataBase
{
    public static class FreeSqlExt
    {
        public static void InsertOrUpdateExt<TEntity>(this BaseRepository<TEntity> Repository, TEntity entity) where TEntity : class
        {
            var plist = entity.GetType().GetProperties();
            var isCreate = false;
            foreach (var item in plist)
            {
                var pname = item.Name.ToLower();
                if (pname.Equals("id"))
                {
                    if (item.GetValue(entity) == null)
                    {
                        item.SetValue(entity, Guid.NewGuid().ToString());
                        isCreate = true;
                    }
                    break;
                }
            }
            foreach (var item in plist)
            {
                var userid = UserHelper.GetOperator()?.Id;
                var pname = item.Name.ToLower();
                if (isCreate)
                {
                    if (pname.Equals("createby") || pname.Equals("create_by"))
                    {
                        item.SetValue(entity, userid);
                    }
                    else if (pname.Equals("state"))
                    {
                        item.SetValue(entity, (int)DbDataStstus.已启用);
                    }
                }

                if (pname.Equals("updateby") || pname.Equals("update_by"))
                {
                    item.SetValue(entity, userid);
                }
            }
            if (isCreate)
            {
                Repository.Insert(entity);
            }
            else
            {
                Repository.Update(entity);
            }
        }

        public static void InsertOrUpdateExt<TEntity>(this IFreeSql Repository, TEntity entity) where TEntity : class
        {
            var plist = entity.GetType().GetProperties();
            var isCreate = false;
            foreach (var item in plist)
            {
                var pname = item.Name.ToLower();
                if (pname.Equals("id"))
                {
                    if (item.GetValue(entity) == null)
                    {
                        item.SetValue(entity, Guid.NewGuid().ToString());
                        isCreate = true;
                    }
                    break;
                }
            }
            foreach (var item in plist)
            {
                var userid = UserHelper.GetOperator()?.Id;
                var pname = item.Name.ToLower();
                if (isCreate)
                {
                    if (pname.Equals("createby") || pname.Equals("create_by"))
                    {
                        item.SetValue(entity, userid);
                    }
                    else if (pname.Equals("state"))
                    {
                        item.SetValue(entity, (int)DbDataStstus.已启用);
                    }
                }

                if (pname.Equals("updateby") || pname.Equals("update_by"))
                {
                    item.SetValue(entity, userid);
                }
            }
            if (isCreate)
            {
                Repository.Insert(entity);
            }
            else
            {
                Repository.Update<TEntity>(entity);
            }
        }
    }
}