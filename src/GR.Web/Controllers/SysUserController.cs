using DataBase;
using GR.Entity;
using GR.Entity.Dto_SysUsers;
using GR.IServices;
using GR.Web.Filter;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GR.Web.Controllers
{
    public class SysUserController : BaseController
    {
        private readonly ISysUserServices _ISysUserServices;
        private readonly ISysRoleServices _ISysRoleServices;

        public SysUserController(ISysUserServices iSysUserServices, ISysRoleServices iSysRoleServices)
        {
            _ISysUserServices = iSysUserServices;
            _ISysRoleServices = iSysRoleServices;
        }

        public IActionResult Index()
        {
            //获取部门列表
            // ViewBag.deptment = _SysDeptmentBLL.GetList();
            return View();
        }

        public IActionResult Edit(string id)
        {
            // ViewBag.departmentList = _SysDeptmentBLL.GetList();
            if (!string.IsNullOrEmpty(id))
            {
                var model = _ISysUserServices.Get(id);
                return View(model);
            }
            else
            {
                return View();
            }
        }

        public IActionResult SetUserRole(string id)
        {
            var userRoleList = _ISysUserServices.GetUserRoleList(id);
            var roleList = _ISysRoleServices.GetList();

            ViewBag.RoleList = roleList;
            ViewBag.UserRoleList = userRoleList;
            ViewBag.UserId = id;
            return View();
        }

        public IActionResult SetPassword(string id)
        {
            var model = _ISysUserServices.Get(id);
            ViewBag.id = id;
            return View(model);
        }

        #region ajax_SysUsers

        [HttpPost]
        [ConvertToLayuiPage]
        public Page<SysUser> GetPage(SysUsersSearchModel model)
        {
            Page<SysUser> pages = _ISysUserServices.GetPage(model);
            return pages;
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        public bool Delete(string[] ids)
        {
            return _ISysUserServices.Deletes(ids);
        }

        /// <summary>
        /// 新建、编辑用户
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public void Save(SysUser model)
        {
            _ISysUserServices.Save(model);
        }

        [HttpPost]
        public SysUser GetUsers(string id)
        {
            return _ISysUserServices.Get(id);
        }

        [HttpPost]
        public List<SysUser> GetUsersList()
        {
            return _ISysUserServices.GetList();
        }

        public bool ToggleState(string id, bool disable)
        {
            return _ISysUserServices.ToggleState(id, disable);
        }

        /// <summary>
        /// 保存用户角色
        /// </summary>
        /// <param name="id"></param>
        /// <param name="roleIds"></param>
        /// <returns></returns>
        [HttpPost]
        public bool SaveUserRole(string id, string[] roleIds)
        {
            return _ISysUserServices.SaveUserRoll(id, roleIds);
        }

        [HttpPost]
        public bool ChangePassword(string id, string newpassword)
        {
            return _ISysUserServices.ChangePassword(id, newpassword);
        }

        [HttpPost]
        public bool SaveUserRoll(string userId, string[] roleIds)
        {
            return _ISysUserServices.SaveUserRoll(userId, roleIds);
        }

        #endregion ajax_SysUsers
    }
}