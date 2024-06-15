
using System;
using System.Net;
using System.Text.Json;
using EmployeeBackend.Errors;
using EmployeeBackend.Extensions;

namespace EmployeeBackend.Midellwares
{
    public class ExceptionMiddelware
    {

        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddelware> logger;
        private readonly IHostEnvironment env;
        public ExceptionMiddelware(RequestDelegate next,
                                    ILogger<ExceptionMiddelware> logger,
                                    IHostEnvironment env)
        {
            this.env = env;
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                ApiError response;
                HttpStatusCode statusCode = HttpStatusCode.InternalServerError;
                String message;
                var exceptionType = ex.GetType();

                if (exceptionType == typeof(UnauthorizedAccessException))
                {
                    statusCode = HttpStatusCode.Forbidden;
                    message = "You are not authorized";
                }
                else
                {
                    statusCode = HttpStatusCode.InternalServerError;
                    message = "Some unknown error occoured";
                }

                if (env.IsDevelopment())
                {
                    response = new ApiError((int)statusCode, ex.Message, ex.StackTrace.ToString());
                }
                else
                {
                    response = new ApiError((int)statusCode, message);
                }
                var errorDetails = env.IsDevelopment() ? ex.StackTrace : "Internal Server Error";
              
                logger.LogError(ex, ex.Message);
                context.Response.StatusCode = (int)statusCode;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(response.ToString());
            }
        }
    }
}
