using GR.Core.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GR.Web.Controllers
{
    [Authorize]
    public class BaseController : Controller
    {
        protected Operator Current
        {
            get
            {
                return UserHelper.GetOperator(User.Identity.GetLoginUserName());
            }
        }

        /// <summary>
        /// 登录用户名
        /// </summary>
        protected string UserName
        {
            get
            {
                return User.Identity.GetLoginUserName();
            }
        }

        /// <summary>
        /// 登录id
        /// </summary>
        protected string UserId
        {
            get
            {
                return User.Identity.GetLoginUserId();
            }
        }
    }
}