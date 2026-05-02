using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using System.Data;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using CapaEntidades;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class DiagnosticosController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        /////////////////////KHOYOSI//////////////////////////////////////////////
        ///[HttpPost]
        public async Task<ActionResult> ListarDiagnosticosPorAtencionPorNumeroEvaluacion(int idAtencion, int evaluacion)
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(idAtencion, evaluacion);
            return Json(lsRespuesta);
        }


        ///[HttpPost]
        public async Task<ActionResult> ListarDiagnosticosRecetasPorAtencion(int idAtencion, int evaluacion)
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.ListarDiagnosticosRecetasPorAtencion(idAtencion, evaluacion);
            return Json(lsRespuesta);
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarPorAtencion(int idAtencion, int clasificacionDiagnostico)
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.DiagnosticosSeleccionarPorAtencion(idAtencion, clasificacionDiagnostico); 
            return Json(lsRespuesta);
        }

        [HttpPost]
        public async Task<ActionResult> DiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(int idAtencion, int idServicio, int clasificacionDiagnostico, int nroEvaluacion)
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico= new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.DiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, clasificacionDiagnostico, idServicio, nroEvaluacion);

            return Json(lsRespuesta);
        }

        [HttpPost]
        public async Task<Boolean> GuardarDiagnosticosPorEvaluacion(int idAtencion, String lstDiagnosticos, int idServicio, int clasificacionDiagnostico, int nroEvaluacion)
        {
            Boolean resp;
            int idUsuario;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);
            resp = await daoDiagnostico.GuardarDiagnosticosPorEvaluacion(idAtencion, clasificacionDiagnostico, idUsuario, lstobjDiagnosticos, idServicio, nroEvaluacion);

            return resp;
        }

        [HttpPost]
        public async Task<ActionResult> ListarClasificacionDiagnosticos()
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.SeleccionarClasificacionDiagnosticos();
            return Json(lsRespuesta);
        }

        [HttpPost]
        public async Task<ActionResult> ListarDiagnosticoPorConjunto(int idConjuntoDx)
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.SeleccionarDiagnosticoPorConjunto(idConjuntoDx);
            return Json(lsRespuesta);
        }
        ////////////////////////////////////////////////////////////////////////////
        ///
        [HttpPost]
        public async Task<ActionResult> SeleccionarDiagnosticosByIdAtencion(int IdAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoDiagnostico.SeleccionarDiagnosticosByIdAtencion(IdAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        ////////////////////////////////////////////////////////////////////////////
        ///
        [HttpPost]
        public async Task<ActionResult> ListarDxUltimaAtencion(int IdCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoDiagnostico.ListarDxUltimaAtencion(IdCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }



        [HttpPost]
        public async Task<ActionResult> ListaDiagnosticosPorFiltro(string filtro)
        {
            DataSet ds;
            DalDiagnostico dal = new DalDiagnostico();
            ds = null;

            ds = await dal.ListaDiagnosticosPorFiltro(filtro);

            return Json(ds);
        }

        public async Task<ActionResult> ListaDiagnosticosCIE0PorFiltro(string filtro,int tipo)
        {
            DataSet ds;
            DalDiagnostico dal = new DalDiagnostico();
            ds = null;

            ds = await dal.ListaDiagnosticosCIE0PorFiltro(filtro,tipo);

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarEventosAdversos(int idEventoAdverso, int clasificacionDiagnostico)
        {
            DataSet lsRespuesta;
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            lsRespuesta = await daoDiagnostico.AtencionesDiagnosticosSeleccionarEventosAdversos(idEventoAdverso, clasificacionDiagnostico);
            return Json(lsRespuesta);
        }


    }
}
