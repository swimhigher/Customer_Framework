using DataBase;
using GR.Entity;
using GR.Entity.Dto_SysUsers;
using System.Collections.Generic;

namespace GR.IServices
{
    public interface ISysUserServices : IService
    {
        List<SysUser> GetList();

        SysUser GetUserByName(string name);

        void Save(SysUser entity);

        SysUser Get(string id);

        bool Delete(string id);

        bool Deletes(string[] ids);

        bool Update(SysUser model);

        Page<SysUser> GetPage(SysUsersSearchModel model);

        bool ToggleState(string id, bool disabled);

        List<SysRoleUser> GetUserRoleList(string userId);

        bool ChangePassword(string id, string newpassword);

        bool SaveUserRoll(string userId, string[] roleIds);
    }
}