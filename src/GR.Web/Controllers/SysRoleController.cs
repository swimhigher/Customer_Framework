using DataBase;
using GR.Entity;
using GR.Entity.Dto_SysRole;
using GR.IServices;
using GR.Web.Filter;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GR.Web.Controllers
{
    public class SysRoleController : BaseController
    {
        private readonly ISysMenuServices _ISysMenuServices;
        private readonly ISysRoleServices _ISysRoleServices;

        public SysRoleController(ISysMenuServices iSysMenuServices, ISysRoleServices iSysRoleServices)
        {
            _ISysMenuServices = iSysMenuServices;
            _ISysRoleServices = iSysRoleServices;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Edit(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                var model = _ISysRoleServices.Get(id);
                return View(model);
            }
            else
            {
                return View();
            }
        }

        public IActionResult MenuTree(string roleId)
        {
            ViewBag.roleId = roleId;
            return View();
        }

        #region ajax_SysRoles

        [HttpPost]
        [ConvertToLayuiPage]
        public Page<SysRole> GetPage(SysRolesSearchModel model)
        {
            Page<SysRole> pages = _ISysRoleServices.GetPage(model);
            return pages;
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        public bool Delete(string[] ids)
        {
            return _ISysRoleServices.Deletes(ids);
        }

        /// <summary>
        /// 新建、编辑角色
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public bool Save(SysRole model)
        {
            _ISysRoleServices.Save(model);
            return true;
        }

        [HttpPost]
        public SysRole Get(string id)
        {
            return _ISysRoleServices.Get(id);
        }

        [HttpPost]
        public List<SysRole> GetUsersList()
        {
            return _ISysRoleServices.GetList();
        }

        #endregion ajax_SysRoles

        /// <summary>
        /// 获取所有按钮权限列表
        /// </summary>
        /// <param name="menuId"></param>
        /// <returns></returns>
        [HttpPost]
        public List<SysButton> GetAuthList()
        {
            return _ISysRoleServices.GetSysButtonList();
        }

        /// <summary>
        /// 获取所有菜单
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public List<SysMenu> GetMenuList()
        {
            return _ISysMenuServices.Nesting(_ISysMenuServices.GetList(true));
        }

        /// <summary>
        /// 获取角色菜单
        /// </summary>
        /// <param name="roleId">角色id</param>
        /// <returns></returns>
        [HttpPost]
        public object GetRoleMenus(string roleId)
        {
            var roleMenuList = _ISysRoleServices.GetRoleMenuByRoleId(roleId);
            var roleMenuAuthList = _ISysRoleServices.GetRoleButtonByroleId(roleId);
            return new
            {
                menus = roleMenuList,
                auths = roleMenuAuthList
            };
        }

        /// <summary>
        /// 保存角色菜单设置
        /// </summary>
        /// <param name="roleId">角色id</param>
        /// <param name="menuIds">菜单id，英文逗号分隔</param>
        /// <returns></returns>
        [HttpPost]
        public void SaveRoleMenu(string roleId, List<string> menuIds, List<string> authIds)
        {
            _ISysRoleServices.SaveRoleMenuButton(roleId, menuIds, authIds);
        }
    }
}