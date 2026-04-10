using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SiHospCrypKey;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using WebAppMaternidad.Models;

namespace WebAppMaternidad.Controllers
{
    public class HomeController : Controller
    {
  
        public IActionResult Index()
        {
            DalUtilitario dalUtil = new DalUtilitario();
            Encriptar objCripto = new Encriptar();

            try
            {
                string mac = dalUtil.GetMACAddress();
                var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Licencia:KEY");
                string licencia = objCripto.DesencriptarCadena(conex1.ToString());

                
                //if (string.IsNullOrEmpty(ip))
                //{
                //    ip = HttpContext.Current?.Request?.UserHostAddress;
                //}

                if (mac != licencia && licencia != "%Admin@SIHCE#2025%")
                {
                    ViewBag.Mensaje = "Hemos detectado que la licencia con la que cuenta no es válida. Por favor ponerse en contacto con soporte.";
                    return View("~/Views/Shared/AccesoRestringido.cshtml");
                }

                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                else
                {
                    return View("~/Views/Home/Inicio.cshtml");
                }
            }
            catch (Exception ex)
            {                
                if(ex.Message.ToString() == "The input data is not a complete block.")
                {
                    ViewBag.Mensaje = "Hemos detectado que la licencia con la que cuenta no es válida. Por favor ponerse en contacto con soporte.";
                } 
                else
                {
                    ViewBag.Mensaje = ex.Message;
                }
                return View("~/Views/Shared/AccesoRestringido.cshtml");
            }
            

        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Index(User user)
        {
            var userToken=new  Tuple<String,Empleado>(null,null);
            DalUtilitario dalUtil = new DalUtilitario();
            Encriptar objCripto = new Encriptar();

            try
            {
                string mac = dalUtil.GetMACAddress();
                var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Licencia:KEY");
                string licencia = objCripto.DesencriptarCadena(conex1.ToString());

                if (mac != licencia && licencia != "%Admin@SIHCE#2025%")
                {
                    ViewBag.Mensaje = "Hemos detectado que la licencia con la que cuenta no es válida. Por favor ponerse en contacto con soporte.";
                    return View("~/Views/Shared/AccesoRestringido.cshtml");
                }

                if (user.USERID.Trim() == "" || user.USERID.Trim() == null)
                {
                    ViewBag.Error = "Debe ingresar el Usuario";
                    return View("Login");
                } else if (user.PASSWORD.Trim() == "" || user.PASSWORD.Trim() == null)
                {
                    ViewBag.Error = "Debe ingresar la contraseña";
                    return View("Login");
                }
                                
                TokenProvider _tokenProvider = new TokenProvider();
                 userToken = await _tokenProvider.LoginUser(user.USERID.Trim(), user.PASSWORD.Trim());
                if (userToken.Item1 != null)
                {
                    HttpContext.Session.SetString("JWToken", userToken.Item1);
                    HttpContext.Session.SetString("usuario", userToken.Item2.NombreCompleto2());
                    HttpContext.Session.SetString("idusu", userToken.Item2.IdEmpleado.ToString());
                    HttpContext.Session.SetString("clave", userToken.Item2.ClaveVWeb.ToString());
                    HttpContext.Session.SetString("idmed", userToken.Item2.IdMedico.ToString());        //KHOYOSI
                    HttpContext.Session.SetString("user", userToken.Item2.Usuario.ToString());        //KHOYOSI

                    HttpContext.Session.SetString("IdIPress", user.IdIPress?.ToString() ?? "");
                    HttpContext.Session.SetString("NombreIPress", Request.Form["NombreIPress"].ToString() ?? "");

                    CargarRolesyAccesos(userToken.Item2.IdEmpleado);
                    var DatUserClaims = new List<Claim>() {
                        new Claim(ClaimTypes.Name,userToken.Item2.NombreCompleto2()),
                        new Claim(ClaimTypes.Sid,userToken.Item2.IdEmpleado.ToString()),
                        new Claim("IdUsuario", userToken.Item2.IdEmpleado.ToString()),
                    };
                    var UserIdentity = new ClaimsIdentity(DatUserClaims, "Usuario");
                    var UserPrincipal = new ClaimsPrincipal(new[] { UserIdentity });
                    await HttpContext.SignInAsync(UserPrincipal);
                    ViewBag.Usuario = userToken.Item2.NombreCompleto2();

                    //ViewBag.BloqueSistema = 0;
                    //string passw = user.PASSWORD.Trim();
                    //if(passw == "123456")
                    //{
                    //    //ViewBag.CodigoNotificacion = "UPT-PWD";
                    //    ViewBag.BloqueSistema = 1;
                    //    ViewBag.TipoNotificacion = "ALERT";
                    //    ViewBag.Notificacion = "Por motivos de seguridad, se ha detectado que algunas cuentas aún utilizan la contraseña por defecto (123456).<br>" +
                    //                           "Para proteger el acceso a la información del sistema, es obligatorio que actualices tu contraseña ahora mismo.";
                    //}

                }
            }
            catch (Exception ex)
            {
                if (ex.Message.ToString() == "The input data is not a complete block.")
                {
                    ViewBag.Mensaje = "Hemos detectado que la licencia con la que cuenta no es válida. Por favor ponerse en contacto con soporte.";
                    return View("~/Views/Shared/AccesoRestringido.cshtml");
                }

                ViewBag.Error = ex.Message ;
                return View("Login");
            }
            return View("~/Views/Shared/Inicio.cshtml");


        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> IniciarSesion(User user)
        {
            var userToken = new Tuple<String, Empleado>(null, null);
            string mensaje = "";
            try
            {
                if (user.USERID.Trim() == "" || user.USERID.Trim() == null)
                {
                    ViewBag.Error = "Debe ingresar el Usuario";
                    mensaje = "Debe ingresar el Usuario";
                    //return View("Login");
                    return Json(new { respuesta = mensaje, estado = 2, session = true });
                }
                else if (user.PASSWORD.Trim() == "" || user.PASSWORD.Trim() == null)
                {
                    ViewBag.Error = "Debe ingresar la contraseña";
                    mensaje = "Debe ingresar la contraseña";
                    //return View("Login");
                    return Json(new { respuesta = mensaje, estado = 2, session = true });
                }

                TokenProvider _tokenProvider = new TokenProvider();
                userToken = await _tokenProvider.LoginUser(user.USERID.Trim(), user.PASSWORD.Trim());
                if (userToken.Item1 != null)
                {
                    HttpContext.Session.SetString("JWToken", userToken.Item1);
                    HttpContext.Session.SetString("usuario", userToken.Item2.NombreCompleto2());
                    HttpContext.Session.SetString("idusu", userToken.Item2.IdEmpleado.ToString());
                    HttpContext.Session.SetString("clave", userToken.Item2.ClaveVWeb.ToString());
                    HttpContext.Session.SetString("idmed", userToken.Item2.IdMedico.ToString());        //KHOYOSI
                    HttpContext.Session.SetString("user", userToken.Item2.Usuario.ToString());        //KHOYOSI
                    CargarRolesyAccesos(userToken.Item2.IdEmpleado);
                    var DatUserClaims = new List<Claim>() {
                        new Claim(ClaimTypes.Name,userToken.Item2.NombreCompleto2()),
                        new Claim(ClaimTypes.Sid,userToken.Item2.IdEmpleado.ToString()),
                        new Claim("IdUsuario", userToken.Item2.IdEmpleado.ToString()),
                    };
                    var UserIdentity = new ClaimsIdentity(DatUserClaims, "Usuario");
                    var UserPrincipal = new ClaimsPrincipal(new[] { UserIdentity });
                    await HttpContext.SignInAsync(UserPrincipal);
                    ViewBag.Usuario = userToken.Item2.NombreCompleto2();
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
                //return View("Login");
                return Json(new { respuesta = ex.Message, estado = 3, session = true });
            }
            //return View("~/Views/Shared/Inicio.cshtml");

            return Json(new { respuesta = "Ha iniciado sesión exitosamente.", estado = 1, session = true });

        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult> ReIniciarSesion(User user)
        {
            var userToken = new Tuple<String, Empleado>(null, null);
            var objEncripta = new Encriptar();
            string mensaje = "";
            try
            {
                if (user.USERID.Trim() == "" || user.USERID.Trim() == null)
                {
                    ViewBag.Error = "Debe ingresar el Usuario";
                    mensaje = "Debe ingresar el Usuario";
                    //return View("Login");
                    return Json(new { respuesta = mensaje, estado = 2, session = true });
                }
                else if (user.PASSWORD.Trim() == "" || user.PASSWORD.Trim() == null)
                {
                    ViewBag.Error = "Debe ingresar la contraseña";
                    mensaje = "Debe ingresar la contraseña";
                    //return View("Login");
                    return Json(new { respuesta = mensaje, estado = 2, session = true });
                }

                user.USERID = objEncripta.DesencriptarCadena(user.USERID);

                TokenProvider _tokenProvider = new TokenProvider();
                userToken = await _tokenProvider.LoginUser(user.USERID.Trim(), user.PASSWORD.Trim());
                if (userToken.Item1 != null)
                {
                    HttpContext.Session.SetString("JWToken", userToken.Item1);
                    HttpContext.Session.SetString("usuario", userToken.Item2.NombreCompleto2());
                    HttpContext.Session.SetString("idusu", userToken.Item2.IdEmpleado.ToString());
                    HttpContext.Session.SetString("clave", userToken.Item2.ClaveVWeb.ToString());
                    HttpContext.Session.SetString("idmed", userToken.Item2.IdMedico.ToString());        //KHOYOSI
                    HttpContext.Session.SetString("user", userToken.Item2.Usuario.ToString());        //KHOYOSI
                    CargarRolesyAccesos(userToken.Item2.IdEmpleado);
                    var DatUserClaims = new List<Claim>() {
                        new Claim(ClaimTypes.Name,userToken.Item2.NombreCompleto2()),
                        new Claim(ClaimTypes.Sid,userToken.Item2.IdEmpleado.ToString()),
                        new Claim("IdUsuario", userToken.Item2.IdEmpleado.ToString()),
                    };
                    var UserIdentity = new ClaimsIdentity(DatUserClaims, "Usuario");
                    var UserPrincipal = new ClaimsPrincipal(new[] { UserIdentity });
                    await HttpContext.SignInAsync(UserPrincipal);
                    ViewBag.Usuario = userToken.Item2.NombreCompleto2();
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
                //return View("Login");
                return Json(new { respuesta = ex.Message, estado = 3, session = true });
            }
            //return View("~/Views/Shared/Inicio.cshtml");

            return Json(new { respuesta = "Ha iniciado sesión exitosamente.", estado = 1, session = true });

        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult ValidarSesion()
        {
            bool sesion = false;
            try 
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    sesion = false;
                }
                else
                {
                    sesion = true;
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
                //return View("Login");
                return Json(new { respuesta = ex.Message, estado = 3, session = sesion });
            }

            return Json(new { respuesta = "", estado = 1, session = sesion });
        }

        [HttpPost]
        public ActionResult ObtenerUsuarioLogeadoCripto()
        {
            var objEncripta = new Encriptar();
            string usuario = "", usuarioCrypto = "";
            usuario = HttpContext.Session.GetString("user");
            usuarioCrypto = objEncripta.EncriptarCadena(usuario);

            return Json(new { usuario = usuarioCrypto, user = usuario });
        }


        public IActionResult CerrarSession()
        {
            HttpContext.User = null;
            HttpContext.Session.Clear();
            HttpContext.Session.Remove(HttpContext.Session.Id);
            return Redirect("~/Home/Index");
        }

        public IActionResult Contact()
        {
            if (HttpContext.User.Identity.IsAuthenticated==false)
            {
               string m = User.Identity.Name;
                return View("Login");
            }
            return View("Contact");
        }


        public IActionResult Login()
        {
            return View("Login");
        }

        public IActionResult Inicio()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            else
            {

                return View("~/Views/Home/Inicio.cshtml");
            }
            
        }
        public IActionResult SinVista() {
            return View("ErrorMenu");
        }

        private void CargarRolesyAccesos(int idUsuario)
        {
            try
            {
                List<RolesItems> dsRoles = new List<RolesItems>();
                DalEmpleado dlEmpleado = new DalEmpleado();
                dsRoles = dlEmpleado.CargarRolesUsuario(idUsuario);
                Empleado.PermisoRolUsuario=dsRoles;
            }
            catch (Exception ex )
            {
                new Exception(ex.Message);                
            }
            
        }


        public bool  SesionActiva() {
            return HttpContext.User.Identity.IsAuthenticated;
        }

        [HttpPost]
        public async Task<ActionResult> CambiarClaveActual(String ClaveActual,String NuevaClave)
        {
            string respuesta = "Error al cambiar la clave.";
            int rsp = 0;
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                if(NuevaClave != "123456")
                {
                    var objEncripta = new Encriptar();
                    String clave = HttpContext.Session.GetString("clave");
                    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    if (objEncripta.DesencriptarCadena(clave) == ClaveActual)
                    {
                        DalEmpleado _dalEmpleado = new DalEmpleado();
                        rsp = await _dalEmpleado.CambiarContraseña(objEncripta.EncriptarCadena(NuevaClave), idUsuario);
                        respuesta = "Se cambio la clave correctamente.";
                    }
                    else
                    {
                        respuesta = "No coincide su contraseña Actual.";
                    }
                }
                else
                {
                    respuesta = "La nueva contraseña que esta intentando ingresar no es válida.";
                }
                             
            }
            catch (Exception ex)
            {
                respuesta = "Error al cambiar la clave," + ex.Message + ".";
            }            
            return Json(new { rsp = rsp, mensaje = respuesta });
        }



        [HttpGet]
        public async Task<IActionResult> ListarIPress()
        {
            try
            {
                DalUtilitario daoCitas = new DalUtilitario();
                var ds = await daoCitas.DevuelveDSCombo("usp_Select_ListarIpress");

                var table = (ds.Tables.Count > 0)
                    ? ds.Tables[0].AsEnumerable()
                        .Select(r => (object)new
                        {
                            valor = r["IdIpress"]?.ToString(),
                            descripcion = r["Descripcion"]?.ToString()
                        })
                        .ToList()
                    : new List<object>();

                return Json(new { ok = true, table });
            }
            catch (Exception ex)
            {
                return Json(new { ok = false, mensaje = ex.Message, table = new List<object>() });
            }
        }

        [HttpPost]
        public IActionResult AceptarAcuerdo()
        {
            HttpContext.Session.SetString("AcuerdoAceptado", "1");
            return Json(new { ok = true });
        }

        [HttpPost]
        public IActionResult CancelarAcuerdo()
        {
            HttpContext.Session.Clear();
            return Json(new { ok = true });
        }


    }
}
