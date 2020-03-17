using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using GR.Core.Log4net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;



namespace GR.Web.Filter
{

    public class AjaxLogAttribute : ActionFilterAttribute
    {

        private Stopwatch timer;
        LogFactory logger = LogFactory.GetLogger(typeof(AjaxLogAttribute));
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
                else if (context.Result is JsonResult)
                {
                    data = (context.Result as JsonResult).Value;
                }

                //if (context.HttpContext.Request.Path.ToString().Contains("Heart")
                //    || context.HttpContext.Request.Path.ToString().Contains("Hearbeat"))
                //{
                //    logger.Warn("返回数据：" + JsonConvert.SerializeObject(data));

                //}
                //else
                //{

                //}

                logger.InterfaceInfo("返回数据：" + JsonSerializer.Serialize(data));

            }
            else
            {
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

            //if (context.HttpContext.Request.Path.ToString().Contains("Heart") || context.HttpContext.Request.Path.ToString().Contains("Hearbeat"))
            //{
            //    logger.Warn("请求结束: 路径：" + context.HttpContext.Request.Path.ToString() + "耗时：" + timer.ElapsedMilliseconds + "ms"); //
            //}
            //else
            //{
            //}
            logger.InterfaceInfo("请求结束: 路径：" + context.HttpContext.Request.Path.ToString() + "耗时：" + timer.ElapsedMilliseconds + "ms"); //

        }

    }
}
