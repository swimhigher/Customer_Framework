using DataBase;
using GR.Entity;
using GR.Entity.Dto_SysButton;
using GR.Entity.Dto_SysUsers;
using System.Collections.Generic;

namespace GR.IServices
{
    public interface ISysButtonServices : IService
    {
        void Save(SysButton entity);
        SysButton Get(string id);
        bool Delete(string id);
        bool Deletes(string[] ids);
        bool Update(SysButton model);
        Page<SysButtonView> GetPage(SysButtonSearchModel model);
        List<SysButton> GetList();
    }
}