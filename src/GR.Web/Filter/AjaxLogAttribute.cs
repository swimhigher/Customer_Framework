using DataBase;
using GR.Core.Log4net;
using GR.Entity.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;

namespace GR.Web.Filter
{
    public class AjaxLogAttribute : ActionFilterAttribute
    {
        private Stopwatch timer;
        private LogFactory logger = LogFactory.GetLogger(typeof(AjaxLogAttribute));

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            timer = Stopwatch.StartNew();
            string url = filterContext.HttpContext.Request.Path.ToString();
            string paramss = JsonSerializer.Serialize(filterContext.ActionArguments);
            logger.InterfaceInfo("\r\n\r\n请求开始时间" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:sss") + " 路径:" + url);//"\r\n\r\n开始时间" + DateTime.Now.ToString("yyyy-MM-dd:hh:mm:sss") +
            logger.InterfaceInfo("  " + filterContext.HttpContext.Request.Method + ":" + paramss);
            //if (url.Contains("Heart")||url.Contains("Hearbeat"))//心跳检测写入林外一个日志，info记录请求
            //{
            //    logger.Warn("\r\n\r\n请求开始时间" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:sss") + " 路径:" + url);//"\r\n\r\n开始时间" + DateTime.Now.ToString("yyyy-MM-dd:hh:mm:sss") +
            //    logger.Warn("  " + filterContext.HttpContext.Request.Method + ":" + paramss);
            //}
            //else
            //{
            //}
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            bool isajax = false;

            var xreq = context.HttpContext.Request.Headers.ContainsKey("x-requested-with");
            if (xreq)
            {
                isajax = context.HttpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest";
            }

            if (!isajax)//控制器
            {
                if (context.Exception != null)
                {
                    //跳转错误页
                    context.Result = new RedirectResult("/home/error");
                }
                else
                {
                }
            }
            else if (context.Filters.Where(p => p.ToString().Contains("NoNeedConvert")).Count() == 0)//ajax
            {
                if (context.Exception == null)
                {
                    object data = new object();
                    if (context.Result is ContentResult)
                    {
                        data = (context.Result as ContentResult).Content;
                    }
                    else if (context.Result is ObjectResult)
                    {
                        data = (context.Result as ObjectResult).Value;
                    }
                    else if (context.Result is EmptyResult)
                    {
                        data = "";
                    }
                    if (context.Filters.Where(p => p.ToString().Contains("ConvertToLayuiPage")).Count() > 0)
                    {
                        ContentResult content = new ContentResult();
                        if (data == null)
                        {
                            content.Content = JsonSerializer.Serialize(new Page<object>().ToLayuiPageResult());
                        }
                        else
                        {
                            content.Content = JsonSerializer.Serialize((JsonSerializer.Deserialize<Page<object>>(JsonSerializer.Serialize(data))).ToLayuiPageResult());
                        }
                        context.Result = content;

                        logger.Info("返回数据：" + content.Content);
                    }
                    else
                    {
                        Result result = Result.Create();
                        result.Code = context.HttpContext.Response.StatusCode;
                        if (context.HttpContext.Response.StatusCode == 200)
                        {
                            result.Success = true;
                            result.Data = data;
                        }
                        else
                        {
                            result.Success = false;
                            result.Message = "服务器开小差了";
                        }
                        JsonResult content = new JsonResult(result);
                        //{
                        //    Content = JsonSerializer.Serialize(result)
                        //};
                        context.Result = content;
                        logger.Info("返回数据：" + JsonSerializer.Serialize(result));
                    }
                }
                else
                {
                    Result result = Result.Create();
                    result.Success = false;
                    result.Message = context.Exception.Message;
                    result.Data = null;
                    result.Code = context.HttpContext.Response.StatusCode;
                    context.ExceptionHandled = true;
                    context.Result = new ContentResult() { Content = JsonSerializer.Serialize(result) };
                    logger.Info("错误信息：" + context.Exception.Message);

                    //记录错误日志
                    StringBuilder str = new StringBuilder();
                    str.Append("\r\n" + DateTime.Now.ToString("yyyy.MM.dd HH:mm:ss"));
                    str.Append("\r\n.错误信息：");
                    str.Append("\r\n\t路径：" + context.HttpContext.Request.Path.ToString());
                    str.Append("\r\n\t错误信息：" + context.Exception.Message);
                    str.Append("\r\n\t错误源：" + context.Exception.Source);
                    str.Append("\r\n\t异常方法：" + context.Exception.TargetSite);
                    str.Append("\r\n\t堆栈信息：" + context.Exception.StackTrace);
                    str.Append("\r\n--------------------------------------------------------------------------------------------------");
                    logger.StrError(str.ToString());
                }
            }

            //base.OnActionExecuted(context);
            logger.Info("请求结束时间" + DateTime.Now.ToString("yyyy-MM-dd:HH:mm:sss") + " 路径：" + context.HttpContext.Request.Path.ToString() + "耗时：" + timer.ElapsedMilliseconds + "ms"); //
        }
    }
}