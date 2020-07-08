using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataBase;
using GR.Entity;
using GR.Entity.Dto_SysButton;
using GR.IServices;
using GR.Web.Filter;
using Microsoft.AspNetCore.Mvc;

namespace GR.Web.Controllers
{
    public class SysButtonController : Controller
    {
        private readonly ISysMenuServices _ISysMenuServices;
        private readonly ISysButtonServices _ISysButtonServices;

        public SysButtonController(ISysMenuServices iSysMenuServices, ISysButtonServices iSysButtonServices)
        {
            _ISysMenuServices = iSysMenuServices;
            _ISysButtonServices = iSysButtonServices;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Edit(string id)
        {
            ViewBag.Menulist = _ISysMenuServices.GetList();
            if (!string.IsNullOrEmpty(id))
            {
                var model = _ISysButtonServices.Get(id);
                return View(model);
            }
            else
            {
                return View();

            }
        }

        #region ajax_SysButton
        [HttpPost]
        [ConvertToLayuiPage]

        public Page<SysButtonView> GetPage(SysButtonSearchModel model)
        {
            return _ISysButtonServices.GetPage(model);

        }

        /// <summary>
        /// 删除按钮权限
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        public bool Delete(string[] ids)
        {
            return _ISysButtonServices.Deletes(ids);
        }

        /// <summary>
        /// 新建、编辑按钮权限
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public void Save(SysButton model)
        {
             _ISysButtonServices.Save(model);
           
        }
        [HttpPost]
        public SysButton Get(string id)
        {
            return _ISysButtonServices.Get(id);
        }
        [HttpPost]
        public List<SysButton> GetUsersList()
        {
            return _ISysButtonServices.GetList();
        }
        #endregion
    }
}