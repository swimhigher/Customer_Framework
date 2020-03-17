using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using GR.Web.Models;
using GR.IServices;
using System.Text.Json;

namespace GR.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ISysUserServices _ISysUserServices;


        public HomeController(ILogger<HomeController> logger, ISysUserServices iSysUserServices)
        {
            _logger = logger;
            _ISysUserServices = iSysUserServices;
        }

        public IActionResult Index()
        {
            var a = JsonSerializer.Serialize(_ISysUserServices.GetList());
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
    }
}
