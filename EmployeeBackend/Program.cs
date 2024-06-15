using EmployeeBackend.Data;
using EmployeeBackend.Extensions;
using EmployeeBackend.Helpers;
using EmployeeBackend.Interfaces;
using Microsoft.AspNetCore.SignalR;
using EmployeeBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;

using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using static EmployeeBackend.Helpers.CustomUserId;
using Microsoft.AspNet.SignalR;
using Microsoft.Extensions.DependencyInjection.Extensions;

var builder = WebApplication.CreateBuilder(args);





// Add services to the container.
builder.Services.AddControllersWithViews();

// email confirmation
builder.Services.Configure<IdentityOptions>(options => { options.SignIn.RequireConfirmedEmail = true; });

//automapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);

//add loguseractivity
builder.Services.AddScoped<LogUserActivity>();

builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<LogUserActivity>();
});

builder.Services.AddHostedService<UserActivityCleanup>();

//builder.Services.AddControllers().AddNewtonsoftJson();

//imagekit service 
//builder.Services.AddSingleton(x => new PhotoService(
//  "public_UoITDx2RnJfUkTLv1KDBooh7x1Q=",
//      "private_JXjwVKx+91PVfP2C8RF/M+HPN8U=",
//      "https://ik.imagekit.io/kzrdgwznu"
//   ));

// IuniofWork PATTERN design 
//email transient 
builder.Services.AddTransient<Email>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// signalR







builder.Services.AddControllers()
      .AddJsonOptions(options =>
      {
         
          options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
          options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
      });

//Swagger service
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

//Database  Connection

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("MyConnection")
    ));

// Jwt Options 
var secretkey = builder.Configuration.GetSection("AppSettings:Key").Value;

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretkey));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false, 
        ValidateAudience = false,
        IssuerSigningKey = key
    };
    opt.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/notificationHub")))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };

});

//signalr
builder.Services.AddSingleton<Microsoft.AspNetCore.SignalR.IUserIdProvider, CustomUserIdProvider>();
builder.Services.AddSignalR();


var app = builder.Build();




app.UseHttpsRedirection();
app.UseStaticFiles();

// swagger 
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// cors
app.UseCors(
   options => options.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader().WithExposedHeaders("Pagination").AllowCredentials()
  );

//signalR
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotifcationHub>("/notificationHub");

});
//app.MapHub<NotifcationHub>("/notificationHub");




// exception midelware handeling 
app.ConfigureExceptionHandler(app.Environment);
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
