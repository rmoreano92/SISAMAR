using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using CapaDatos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using WebAppMaternidad.Areas.Sockets;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Application;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Application.Interfaces;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Infrastructure.Persistence;
using WebAppMaternidad.Context.Facturacion.Application;
using WebAppMaternidad.Context.Facturacion.Application.Queries.FacturacionServicioDespachoXCuenta;
using WebAppMaternidad.Context.Facturacion.Application.Services;
using WebAppMaternidad.Context.Facturacion.Domain;
using WebAppMaternidad.Context.Facturacion.Infrastructure.Persistence;
using WebAppMaternidad.Context.Farmacia.Application;
using WebAppMaternidad.Context.Farmacia.Application.Interfaces;
using WebAppMaternidad.Context.Farmacia.Domain;
using WebAppMaternidad.Context.Farmacia.Infrastructure.Persistence;
using WebAppMaternidad.Context.General.DepartamentosHospital.Application;
using WebAppMaternidad.Context.General.DepartamentosHospital.Application.interfaces;
using WebAppMaternidad.Context.General.DepartamentosHospital.Domain;
using WebAppMaternidad.Context.General.DepartamentosHospital.Infrastructure;
using WebAppMaternidad.Context.General.Especialidades.Application;
using WebAppMaternidad.Context.General.Especialidades.Domain;
using WebAppMaternidad.Context.General.Especialidades.Infrastructure.Persistence;
using WebAppMaternidad.Context.General.Servicios.Application;
using WebAppMaternidad.Context.General.Servicios.Application.interfaces;
using WebAppMaternidad.Context.General.Servicios.Domain;
using WebAppMaternidad.Context.General.Servicios.Infrastructure.Persistence;
using WebAppMaternidad.Context.General.TiposServicio;
using WebAppMaternidad.Context.General.TiposServicio.Application;
using WebAppMaternidad.Context.General.TiposServicio.Application.interfaces;
using WebAppMaternidad.Context.General.TiposServicio.Domain;
using WebAppMaternidad.Context.Reportes;
using WebAppMaternidad.Context.Reportes.Application;
using WebAppMaternidad.Context.Reportes.Application.Factories;
using WebAppMaternidad.Context.Reportes.Domain;
using WebAppMaternidad.Context.Reportes.Infrastructure;
using WebAppMaternidad.Context.Reportes.Infrastructure.Header;
using WebAppMaternidad.Infrastructure.Persistence;
using WebAppMaternidad.Middleware;
using WebAppMaternidad.Services;
using WebAppMaternidad.Services.Firma;

using System.Globalization;
using System.IO;
using Microsoft.AspNetCore.Localization;
using ElmahCore;
using ElmahCore.Mvc;



namespace WebAppMaternidad
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
            ////rmoreano
            services.AddAuthentication("CookieAuth")
                .AddCookie("CookieAuth", config =>
                {
                    config.Cookie.Name = "Sisgalen.Cookies";
                    config.LoginPath = "/Home/Index";
                });
            ////rmoreano
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(360);
            });

            services.AddHttpClient<WebAppMaternidad.Services.IafasService>(client =>
            {
                // Opcional: configurar timeouts, headers por defecto, etc.
                client.Timeout = TimeSpan.FromSeconds(30);
            });

            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);              //SE COMENTO HASTA SABER QUE PASA
            //Provide a secret key to Encrypt and Decrypt the Token - JRozario
            var SecretKey = Encoding.ASCII.GetBytes("YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv");
            //Configure JWT Token Authentication - JRozario
            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(token =>
            {
                token.RequireHttpsMetadata = false;
                token.SaveToken = true;
                token.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(SecretKey),
                    ValidateIssuer = true,
                    //Usually this is your application base URL - JRozario
                    ValidIssuer = "http://localhost:45092/",
                    ValidateAudience = true,
                    //Here we are creating and using JWT within the same application. In this case base URL is fine - JRozario
                    //If the JWT is created using a web service then this could be the consumer URL - JRozario
                    ValidAudience = "http://localhost:45092/",
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            services.AddControllers().AddNewtonsoftJson(x =>
                x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            services.AddMvc().AddRazorRuntimeCompilation();

            //KHOYSOI
            services.AddCors(options =>
            {
                options.AddPolicy("AllOrigins",
                    builder =>
                    {
                        builder.AllowAnyHeader()
                                       .AllowAnyOrigin()
                                      .AllowAnyMethod();
                    });
            });

            services.AddHttpContextAccessor();
            services.AddHttpClient<IFirmaService, FirmaService>();
            //KHOYOSI

            services.AddMvc(options => options.EnableEndpointRouting = false);  //KHOYOSI


            services.AddSignalR();

            services.AddElmah<XmlFileErrorLog>(options =>
            {
                options.Path = "elmah";
                options.LogPath = "~/log";
            });

            // Depdendency Injection Configuration
            services.AddScoped<DalSis>();
            services.AddScoped<DalFacturacion>();

            services.AddScoped<DatabaseContext>();
            services.AddScoped<UnitOfWork>();

            services.AddScoped<IVentaRepository, VentaRepository>();
            services.AddScoped<IVentaService, VentaService>();

            services.AddScoped<IConsumoServicioRepository, ConsumoServicioRepository>();
            services.AddScoped<IConsumoServicioService, ConsumoServicioService>();

            services.AddScoped<ITipoServicioRepository, TipoServicioRepository>();
            services.AddScoped<ITipoServicioService, TipoServicioService>();

            services.AddScoped<IDepartamentoHospitalRepository, DepartamentoHospitalRepository>();
            services.AddScoped<IDepartamentoHospitalService, DepartamentoHospitalService>();

            services.AddScoped<IEspecialidadRepository, EspecialidadRepository>();
            services.AddScoped<IEspecialidadService, EspecialidadService>();

            services.AddScoped<IServicioRepository, ServicioRepository>();
            services.AddScoped<IServicioService, ServicioService>();

            services.AddScoped<IFuenteFinanciamientoRepository, FuenteFinanciamientoRepository>();
            services.AddScoped<IFuenteFinanciamientoService, FuenteFinanciamientoService>();
            

            services.AddScoped<FacturacionServicioDespachoXCuentaHandler>();

            services.AddScoped<IGeneradorReporte, TextPdfGenerator>();

            services.AddScoped<EstadoCuentaReporteService>();

            services.AddScoped<IPacienteRepository, PacienteRepository>();
            services.AddScoped<EstadoCuentaService>();


            services.AddScoped<IEstadoCuentaReportExcelService, EstadoCuentaReportExcelService>();
            services.AddScoped<IExcelReporter, ExcelExporter>();
            services.AddScoped<IExcelReportService, ExcelReportService>();
            services.AddScoped<ExcelReportFactory>();
            services.AddHttpClient<IExcelReportService, ExcelReportService>();


            services.AddScoped<IHeaderProvider, EstadoCuentaHeaderProvider>();
            services.AddScoped<IHeaderProvider, ConsumosHeaderProvider>();
            services.AddScoped<IHeaderProvider, DefaultHeaderProvider>();

            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(FacturacionServicioDespachoXCuentaQuery).Assembly));

            //JDELGADO SOCKETS
            //var connectionFactory = new ConnectionFactory();
            //var connectionManager = new ConnectionManager();
            //services.AddScoped(ctx => new WebSocketApiController(connectionFactory, connectionManager));
            ////services.AddControllers().AddControllersAsServices();
            //JDELGADO SOCKETS
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //if (env.IsDevelopment())
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();
            app.UseCookiePolicy();
            //Addd User session - JRozario
            app.UseSession();
            //Add JWToken to all incoming HTTP Request Header - JRozario
            app.Use(async (context, next) =>
            {
                var JWToken = context.Session.GetString("JWToken");
                if (!string.IsNullOrEmpty(JWToken))
                {
                    context.Request.Headers.Add("Authorization", "Bearer " + JWToken);
                }
                await next();
            });

            app.UseWebSockets(); // jdelgado
            app.UseRouting();

            var cultureInfo = new CultureInfo("es-ES");
            //var cultureInfo = new CultureInfo("en-US");

            var localizationOptions = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture(cultureInfo),
                SupportedCultures = new[] { cultureInfo },
                SupportedUICultures = new[] { cultureInfo }
            };

            app.UseRequestLocalization(localizationOptions);


            //Add JWToken Authentication service - JRozario
            app.UseAuthentication();

            app.UseMiddleware<ErrorHandlerMiddleware>();
            app.UseElmah();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<ProgressHub>("/progressHub");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "ConsultaExterna",
                    template: "{area:exists}/{controller=Paciente}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "Emergencia",
                    template: "{area:exists}/{controller=DashBoardEmergencia}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "areas",
                    template: "{area:exists}/{controller=CallCenter}/{action=Index}/{id?}");

                routes.MapRoute(
                    name: "Hospitalizacion",
                    template: "{area:exists}/{controller=DashBoardHosp}/{action=Index}/{id?}");
            });

            app.UseCors("AllOrigins");      //KHOYOSI
        }
    }
}
