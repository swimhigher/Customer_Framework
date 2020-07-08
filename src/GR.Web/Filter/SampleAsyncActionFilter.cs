using GR.Core.Log4net;
using GR.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using static DataBase.ConfigDb;

namespace GR.Web.Filter
{
    public class SampleAsyncActionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            Stopwatch timer = Stopwatch.StartNew();
            // Do something before the action executes.
            var resultContext = await next();
            // next() calls the action method.
            timer.Stop();
            try
            {
                Auditlog audit = new Auditlog();

                //获取路由信息
                var ActionDescriptor = context.ActionDescriptor as Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor;
                audit.Controller = ActionDescriptor.ControllerName;
                audit.Action = ActionDescriptor.ActionName;
                audit.Route = context.HttpContext.Request.Path.ToString();
                audit.Parameters = JsonSerializer.Serialize(context.ActionArguments);

                audit.ClientIpAddress = context.HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault() ?? "";
                audit.ClientVirtualIpAddress = context.HttpContext.Connection.RemoteIpAddress.ToString();

                //太耗时，暂未解决
                //audit.Clientname = Dns.GetHostEntry(audit.Clientipaddress).HostName;
                audit.BrowserInfo = context.HttpContext.Request.Headers["User-Agent"];
                //audit.BrowserInfo = (context.HttpContext.Request.Headers).;
                audit.MethodType = IsAjax(context.HttpContext.Request) ? context.HttpContext.Request.Method : "Page";

                //获取返回结果
                if (resultContext.Exception == null)
                {
                    object data = new object();
                    if (resultContext.Result is ContentResult)
                    {
                        data = (resultContext.Result as ContentResult).Content;
                    }
                    else if (resultContext.Result is ObjectResult)
                    {
                        data = (resultContext.Result as ObjectResult).Value;
                    }
                    else if (resultContext.Result is JsonResult)
                    {
                        data = (resultContext.Result as JsonResult).Value;
                    }
                    audit.Result = JsonSerializer.Serialize(data);
                }
                else
                {
                    audit.ExceptionMessage = resultContext.Exception.Message;
                    audit.Exception = $"异常类型：{resultContext.Exception.GetType().Name}\r\n异常消息：{resultContext.Exception.Message}\r\n堆栈信息：{resultContext.Exception.StackTrace}\r\n";
                }
                //audit.Userid = context.HttpContext.User.Identity.GetLoginUser();
                //audit.UserName = context.HttpContext.User.Identity.GetLoginUserName();
                audit.ExecutionDuration = timer.ElapsedMilliseconds;
                Ser_Auditlog.Insert(audit);
            }
            catch (Exception ex)
            {
                LogFactory logger = LogFactory.GetLogger(typeof(SampleAsyncActionFilter));
                logger.Error(ex, "审计日志记录出错：");
            }
            // resultContext.Result is set.
            // Do something after the action executes.
        }

        public bool IsAjax(Microsoft.AspNetCore.Http.HttpRequest req)
        {
            bool result = false;

            var xreq = req.Headers.ContainsKey("x-requested-with");
            if (xreq)
            {
                result = req.Headers["x-requested-with"] == "XMLHttpRequest";
            }

            return result;
        }
    }
}