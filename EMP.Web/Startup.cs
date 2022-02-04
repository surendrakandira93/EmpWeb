using EMP.Common;
using EMP.Dto;
using EMP.Service;
using EMP.Web.Models;
using EMP.Web.Validations;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EMP.Web
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
            services.AddSingleton(_ => Configuration);
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddControllersWithViews();
            services.AddFluentValidation();

            services.AddHttpClient<IEmployeeService, EmployeeService>();
            services.AddHttpClient<IEmployeeGroupService, EmployeeGroupService>();
            
            SiteKeys.APIBase = Configuration["ServiceUrls:APIBase"];
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IEmployeeService, EmployeeService>();
            services.AddTransient<IEmployeeGroupService, EmployeeGroupService>();
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(opt =>
            {
                opt.LoginPath = "/account/index";
                opt.LogoutPath = "/account/logout";
            });
            services.AddHttpContextAccessor();
            services.AddSession();
            services.AddRouting(options => options.LowercaseUrls = true);

           // services.AddTransient<IValidator<SignupDto>, SignupDtoValidator>();
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
            }
            app.UseAuthentication();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();
            app.UseSession();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
            ContextProvider.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>());
        }
    }
}