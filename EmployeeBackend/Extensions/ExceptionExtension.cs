using Microsoft.AspNetCore.Diagnostics;
using System.Net;

using EmployeeBackend.Midellwares;

namespace EmployeeBackend.Extensions
{
    public static class ExceptionExtension
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app,
        IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddelware>();
        }
        public static void ConfigureBuiltinExceptionHandler(this IApplicationBuilder app,
        IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(
                    options =>
                    {
                        options.Run(
                            async context =>
                            {
                                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                                var ex = context.Features.Get<IExceptionHandlerFeature>();
                                if (ex != null)
                                {
                                    await context.Response.WriteAsync(ex.Error.Message);
                                }
                            }
                        );
                    }
                );
            }
        }


    }


}
