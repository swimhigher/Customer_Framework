using GR.Core.Identity;
using GR.Entity.Dto;
using GR.IServices;
using GR.Web.Filter;
using GR.Web.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GR.Web.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        private readonly ISysUserServices _sysUserServices;

        public LoginController(IHttpContextAccessor httpContextAccessor, ISysUserServices sysUserServices)
        {
            this.httpContextAccessor = httpContextAccessor;
            _sysUserServices = sysUserServices;
        }

        public IActionResult Index()
        {
#if DEBUG
            ViewBag.UserName = "admin";
            ViewBag.Password = "147258369";
#endif
            return View();
        }

        [HttpPost]
        [NoNeedConvert]
        public Result Check(LoginModel input)
        {
            Result result = Result.Create();
            if (!ModelState.IsValid)
            {
                throw new Exception(ModelState.Values.Where(x => x.Errors.Count > 0).Select(x => x.Errors).FirstOrDefault().Select(x => x.ErrorMessage).FirstOrDefault());
            }

            var validate = WebSecurityHelper.ValidateUser(input.username, input.password, input.remember, () =>
            {
                var user = _sysUserServices.GetUserByName(input.username);
                if (user == null)
                {
                    throw new Exception("账户不存在");
                }
                var systemUser = new Operator()
                {
                    Id = user.Id,
                    UserName = user.Name,
                    Password = user.Password,
                    Name = user.LoginName,
                    IsAdministrator = user.Isadmin == 1
                };
                switch (user.State)
                {
                    case 1:
                        throw new Exception("账户被禁用");
                    case -1:
                        throw new Exception("账户不存在");
                }
                return systemUser;
            });

            return validate;
        }
    }
}