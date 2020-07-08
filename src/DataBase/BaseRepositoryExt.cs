using FreeSql;
using System;
using System.Linq.Expressions;

namespace DataBase
{
    //扩展失败
    public class GuidRepositoryExt<TEntity> : GuidRepository<TEntity> where TEntity : class
    {
        protected GuidRepositoryExt(IFreeSql fsql, Expression<Func<TEntity, bool>> filter, Func<string, string> asTable = null) : base(fsql, filter, asTable)
        {
        }

        public override TEntity Insert(TEntity entity)
        {
            var plist = entity.GetType().GetProperties();
            foreach (var item in plist)
            {
                var pname = item.Name.ToLower();
                if (pname.Equals("id") && item.GetType() == typeof(string))
                {
                    item.SetValue(entity, Guid.NewGuid().ToString());
                }
                if (pname.Equals("createon") || pname.Equals("create_on"))
                {
                    item.SetValue(entity, DateTime.Now);
                }
            }
            return base.Insert(entity);
        }
    }
}