using DataBase;
using GR.Core;
using GR.Core.Identity;
using GR.Core.Ioc;
using GR.IServices;
using GR.Web.Filter;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Reflection;

//using static GR.IServices.ServicesExtent;
namespace GR.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            AssemblyName name = new AssemblyName("GR.Services");
            services.RegisterAssemblyTypes(null, ServiceLifetime.Singleton, Assembly.Load(name));

            //初始化数据库
            ConfigDb.Init(ConfigHelper.GetString("Connstring"));
            //用静态类存储上下文，得到身份
            services.AddHttpContextAccessorEx();

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
          .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, o =>
          {
              o.LoginPath = new PathString("/Login/Index");
              o.AccessDeniedPath = new PathString("/Home/Denied");
          });
            //HttpContextCore.ServiceProvider = services.BuildServiceProvider();
            services.AddControllersWithViews(config =>
            {
                config.Filters.Add(typeof(AjaxLogAttribute));
                config.Filters.Add(typeof(SampleAsyncActionFilter));
            }).AddJsonOptions(option =>
            {
                option.JsonSerializerOptions.PropertyNamingPolicy = null;
            });
            EngineContext.initialize(new GeneralEngine(services.BuildServiceProvider()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseStaticHttpContext();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}