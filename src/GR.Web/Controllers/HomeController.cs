using GR.Core.Identity;
using GR.Entity;
using GR.IServices;
using GR.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace GR.Web.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ISysUserServices _ISysUserServices;
        private readonly ISysMenuServices _ISysMenuServices;

        public HomeController(ILogger<HomeController> logger, ISysUserServices iSysUserServices, ISysMenuServices iSysMenuServices)
        {
            _logger = logger;
            _ISysUserServices = iSysUserServices;
            _ISysMenuServices = iSysMenuServices;
        }

        public IActionResult Index()
        {
            //var a = JsonSerializer.Serialize(_ISysUserServices.GetList());
            ViewBag.UserName = UserName;
            List<SysMenu> menus = _ISysMenuServices.Nesting(_ISysMenuServices.GetListByUserId(Current.Id, Current.Name, Current.UserType));
            if (menus == null || menus.Count == 0)
            {
                ViewBag.MenuList = new List<SysMenu>();
            }
            else
            {
                ViewBag.MenuList = menus[0].Children;
            }
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public string Hello()
        {
            return "hello world";
        }

        [HttpPost]
        public async Task LogOut()
        {
            //清掉用户的缓冲
            UserHelper.DeleteOperatorRedis();
            await HttpContext.SignOutAsync();
        }
    }
}