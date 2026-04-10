using ConsultaSisProduccion;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using WebAppMaternidad.Services;

namespace WebAppMaternidad.Areas.Comun
{
    public class MicroServiciosController: Controller
    {

        //[HttpPost]
        //public ActionResult listarReniec(string dniAuto, string dniCon)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    Consulta client = new ServiceDNISoapClient(ServiceDNISoapClient.EndpointConfiguration.ServiceDNISoap);
        //    //BuscarAseguradosRequestBody requestBody = new BuscarAseguradosRequestBody { Disa = "250", TipoFormato = "2", Contrato = "77344460" };
        //    //BuscarAseguradosRequest request = new BuscarAseguradosRequest();
        //    //request.Body = requestBody;
        //    //BuscarAseguradosResponse response = client.BuscarAsegurados("250", "2", "77344460", "", "");


        //    string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
        //    string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
        //    try
        //    {
        //        return Json(new { session = true, estado = true, msg = "", data = client.GetReniec(dniAuto, dniCon) });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
        //    }

        //}

        private readonly IafasService _iafasService;
        private readonly IConfiguration _config;

        public MicroServiciosController(IafasService iafasService, IConfiguration config)
        {
            _iafasService = iafasService;
            _config = config;
        }

        [HttpPost]
        public async Task<ActionResult> ConsultarAfiliadoIAFAS(string nroDocumento)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
                return Json(new { session = false });

            try
            {
                var usuario = _config["CredentialStrings:Iafas:usuario"];
                var clave = _config["CredentialStrings:Iafas:clave"];

                string token = await _iafasService.ObtenerToken(usuario, clave);

                var resultado = await _iafasService.ConsultaAfiliados(
                    token,
                    1,        // PRODUCTO (ejemplo)
                    "1",
                    nroDocumento
                );

                return Json(new { session = true, estado = true, data = resultado });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    estado = false,
                    msg = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ConsultarAfiliadoFuaE(int intOpcion, string strTipoDocumento, string strNroDocumento, string strDisa, string strTipoFormato, string strNroContrato, string strCorrelativo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            Service1SoapClient client = new Service1SoapClient(Service1SoapClient.EndpointConfiguration.Service1Soap12);
            //BuscarAseguradosRequestBody requestBody = new BuscarAseguradosRequestBody { Disa = "250", TipoFormato = "2", Contrato = "77344460" };
            //BuscarAseguradosRequest request = new BuscarAseguradosRequest();
            //request.Body = requestBody;
            //BuscarAseguradosResponse response = client.BuscarAsegurados("250", "2", "77344460", "", "");

            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:ConsultaSIS:usuario");
            var clave = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:ConsultaSIS:clave");
            var dniResponsable = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:ConsultaSIS:dniResponsable");

            //GetSessionResponse strAutorizacion = await client.GetSessionAsync("MGP", "gVuN0y8G");
            GetSessionResponse strAutorizacion = await client.GetSessionAsync(usuario, clave);

            
            ConsultarAfiliadoFuaEResponse datosAfiliado = await client.ConsultarAfiliadoFuaEAsync(intOpcion, strAutorizacion.Body.GetSessionResult, dniResponsable, strTipoDocumento, strNroDocumento, strDisa, strTipoFormato, strNroContrato, strCorrelativo);


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                return Json(new { session = true, estado = true, msg = "", data = datosAfiliado.Body.ConsultarAfiliadoFuaEResult });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }


    }
}
