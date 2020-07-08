using GR.Entity;
using GR.IServices;
using GR.Web.Filter;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace GR.Web.Controllers
{
    public class SysMenuController : BaseController
    {
        private readonly ISysMenuServices _ISysMenuServices;

        public SysMenuController(ISysMenuServices iSysMenuServices)
        {
            _ISysMenuServices = iSysMenuServices;
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 获取菜单（嵌套）
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public List<SysMenu> GetMenuList()
        {
            return _ISysMenuServices.Nesting(_ISysMenuServices.GetList(false));
        }

        /// <summary>
        /// 创建或更新
        /// </summary>
        /// <param name="id"></param>
        /// <param name="pid"></param>
        /// <returns></returns>

        public ActionResult Create(string id, string pid = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                var entity = _ISysMenuServices.Get(id);
                if (entity != null)
                {
                    return View(entity);
                }
            }
            ViewBag.ParentId = pid;
            return View();
        }

        /// <summary>
        /// 删除菜单
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        [HttpPost]
        public bool Delete(string[] ids)
        {
            if (ids.Length == 1)
            {
                return _ISysMenuServices.Delete(ids[0]);
            }
            else
            {
                return _ISysMenuServices.Deletes(ids);
            }
        }

        /// <summary>
        /// 新建、编辑菜单
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public void Save(SysMenu model)
        {
            _ISysMenuServices.Save(model);
        }

        /// <summary>
        /// 切换状态
        /// </summary>
        /// <param name="id"></param>
        /// <param name="disable"></param>
        /// <returns></returns>
        [HttpPost]
        public bool ToggleState(string id, bool disable)
        {
            return _ISysMenuServices.ToggleState(id, disable);
        }

        /// <summary>
        /// 获取菜单（嵌套）
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [NoNeedConvert]
        public JsonResult GetMenuListNew()
        {
            var result = _ISysMenuServices.GetList(false);
            return Json(new { code = 0, data = result, count = result.Count, msg = "" });
        }
    }
}