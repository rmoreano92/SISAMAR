using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Facturacion
{
    public class PacientesExternosSeguroController: BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public PacientesExternosSeguroController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        [HttpPost]
        public async Task<JsonResult> GuardarDiagnosticosTamizaje(int idAtencion, String lstDiagnosticos)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalPacientesExternos dalPacientesExternos = new DalPacientesExternos();

            var res = false;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                res = await dalPacientesExternos.GuardarDiagnosticosTamizaje(idAtencion, lstobjDiagnosticos, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, idUsuario);       //SE CAMBIO A METODO ASYNC
                
                return Json(new { session = true, estado = true, msg = "", data = res });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = res });
            }
        }
    }
}
