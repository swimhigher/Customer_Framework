using GR.Entity;
using System.Collections.Generic;

namespace GR.IServices
{
    public interface ISysMenuServices : IService
    {
        // List<SysMenu> GetList();
        //SysUsers GetUserByName(string name);
        void Save(SysMenu entity);

        SysMenu Get(string id);

        bool Delete(string id);

        bool Deletes(string[] ids);

        bool Update(SysMenu model);

        bool ToggleState(string id, bool disabled);

        List<SysMenu> Nesting(List<SysMenu> list, SysMenu item = null);

        List<SysMenu> GetList(bool ismenu = false);

        List<SysMenu> GetListByUserId(string userId, string userName, int userType);

        List<SysMenu> GetShotCutMenu(string userId);
    }
}