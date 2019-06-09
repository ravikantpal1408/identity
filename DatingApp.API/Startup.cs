using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;

namespace DatingApp.API {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {

            Mapper.Reset ();

            IdentityBuilder builder = services.AddIdentityCore<User> (opt => {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });

            builder = new IdentityBuilder (builder.UserType, typeof (Role), builder.Services);

            builder.AddEntityFrameworkStores<DataContext> ();
            builder.AddRoleValidator<RoleValidator<Role>> ();
            builder.AddRoleManager<RoleManager<Role>> ();
            builder.AddSignInManager<SignInManager<User>> ();

            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer (options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey (Encoding.ASCII.GetBytes (Configuration.GetSection ("Appsettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false

                    };
                });

            services.AddScoped<LogUserActivity> ();

            services.Configure<CloudinarySettings> (Configuration.GetSection ("CloudinarySettings"));

            services.AddAutoMapper ();

            services.AddTransient<Seed> (); // Seeding Users in Database

            services.AddCors (options => {
                options.AddPolicy ("MyCorsPolicy", policy_builder => policy_builder
                    .WithOrigins ("http://localhost:4200", "http://localhost:5000", "*")
                    .AllowAnyMethod ()
                    .AllowCredentials ()
                    .AllowAnyHeader ());
            });

            services.AddDbContext<DataContext> (x => x.UseSqlite (Configuration.GetConnectionString ("DefaultConnection")));

            services.AddMvc (options => {
                    var policy = new AuthorizationPolicyBuilder ()
                        .RequireAuthenticatedUser ()
                        .Build ();

                    options.Filters.Add (new AuthorizeFilter (policy));

                }).SetCompatibilityVersion (CompatibilityVersion.Version_2_2)
                .AddJsonOptions (opt => {
                    opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            services.AddScoped<IAuthRepository, AuthRepository> ();

            services.AddScoped<IDatingRepository, DatingRepository> ();

            services.AddAuthorization (options => {
                options.AddPolicy ("RequireAdminRole", policy => policy.RequireRole ("Admin"));
                options.AddPolicy ("ModeratePhotoRole", policy => policy.RequireRole ("Admin", "Moderator"));
                options.AddPolicy ("VipOnly", policy => policy.RequireRole ("VIP"));
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IHostingEnvironment env, Seed seeder) {

            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            } else {
                app.UseExceptionHandler (builder => {

                    builder.Run (async context => {
                        context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                        var error = context.Features.Get<IExceptionHandlerFeature> ();
                        if (error != null) {
                            context.Response.AddApplicationError (error.Error.Message);

                            await context.Response.WriteAsync (error.Error.Message);

                        }
                    });

                });
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            seeder.SeedUsers ();
            app.UseCors ("MyCorsPolicy");
            app.UseDefaultFiles ();
            app.UseStaticFiles ();
            app.UseAuthentication ();
            app.UseMvc (route => {
                route.MapSpaFallbackRoute (
                    name: "spa-fallback",
                    defaults : new { controller = "Fallback", action = "Index" }
                );
            });
        }
    }
}