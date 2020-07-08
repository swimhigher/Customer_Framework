using DataBase;
using GR.Entity;
using GR.Entity.Dto;
using System.Collections.Generic;

namespace GR.IServices
{
    public interface ISysRoleServices : IService
    {
        void Save(SysRole entity);

        SysRole Get(string id);

        bool Delete(string id);

        bool Deletes(string[] ids);

        bool Update(SysRole model);

        Page<SysRole> GetPage(BaseSearchObject model);

        List<SysRole> GetList();

        List<SysMenu> GetUserAuthMenu();

        List<SysButton> GetUserAuthButton();

        void RemoveUserAuthByRole(string roleid);

        List<SysRoleMenu> GetRoleMenuByRoleId(string roleid);

        void SaveRoleMenuButton(string roleId, List<string> menuIds, List<string> authIds);

        List<SysRoleButton> GetRoleButtonByroleId(string roleid);

        List<SysButton> GetSysButtonList();
    }
}