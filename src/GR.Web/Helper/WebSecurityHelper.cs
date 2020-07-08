using GR.Core.Identity;
using GR.Entity.Dto;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System;
using System.Security.Claims;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GR.Web.Helper
{
    public class WebSecurityHelper
    {
        public static Result ValidateUser(string username, string password, bool isPersistent, Func<Operator> action)
        {
            var result = Result.Create();
            try
            {
                if (string.IsNullOrWhiteSpace(username))
                {
                    throw new ArgumentException("账户不能为空");
                }
                if (string.IsNullOrWhiteSpace(password))
                {
                    throw new ArgumentException("密码不能为空");
                }

                // SessionUser model = SessionContext.Current.GetUserByUserName(username);
                Operator model = UserHelper.GetOperator(username);

                #region 密码错误次数

                int count = 0;
                if (model != null)
                {
                    count = model.FailCount;
                    int totalMinutes = (int)(model.LoginTime - DateTime.Now).TotalMinutes;
                    int totalSeconds = (int)(model.LoginTime - DateTime.Now).TotalSeconds;
                    string message = totalMinutes > 0 ? "密码错误，请" + totalMinutes + "分钟之后再登录" : "密码错误，请" + totalSeconds + "秒之后再登录";
                    if (totalMinutes > 0 || totalSeconds > 0)
                    {
                        // SessionContext.Current.Add(model.UserName, model);
                        UserHelper.AddOperator(model);
                        throw new ArgumentException(message);
                    }
                }

                #endregion 密码错误次数

                var sessionUser = action();
                if (sessionUser == null)
                {
                    throw new Exception("账户不存在");
                }

                if (sessionUser.Password.Equals(password))
                {
                    //  SessionContext.Current.Add(username, sessionUser);
                    sessionUser.FailCount = 0;
                    UserHelper.AddOperator(sessionUser);
                    var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);//一定要声明AuthenticationScheme

                    identity.AddClaim(new Claim(Consts.Claim_Login_Name, username));
                    identity.AddClaim(new Claim(Consts.Claim_Login_Id, sessionUser.Id));
                    //  identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, username));

                    HttpContextExt.Current.SignInAsync(identity.AuthenticationType,
                                                  new ClaimsPrincipal(identity),
                                                  new AuthenticationProperties
                                                  {
                                                      IsPersistent = isPersistent,
                                                      ExpiresUtc = new System.DateTimeOffset(dateTime: DateTime.Now.AddHours(12)),
                                                  });

                    result.Success = true;
                }
                else
                {
                    if (model == null)
                    {
                        model = sessionUser;
                    }

                    int minutes = 0;
                    switch (count)
                    {
                        case 0:
                        case 1:
                        case 2:
                            minutes = 0;
                            break;

                        case 3:
                            minutes = 1;
                            break;

                        case 4:
                            minutes = 5;
                            break;

                        case 5:
                            minutes = 10;
                            break;

                        case 6:
                            minutes = 30;
                            break;

                        default:
                            minutes = 60;
                            break;
                    }

                    if (minutes > 0)
                    {
                        model.FailCount = count + 1;
                        model.LoginTime = DateTime.Now.AddMinutes(minutes);
                        //SessionContext.Current.Add(model.UserName, model);
                        UserHelper.AddOperator(model);
                        throw new ArgumentException("密码错误，请" + minutes + "分钟之后再登录");
                    }
                    else
                    {
                        model.FailCount = count + 1;
                        //  model.State = ConnectState.NoConnection;
                        //SessionContext.Current.Add(model.UserName, model);
                        UserHelper.AddOperator(model);

                        throw new ArgumentException("密码错误" + model.FailCount + "次");
                    }
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
            }
            return result;
        }
    }
}