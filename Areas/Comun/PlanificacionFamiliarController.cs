using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Models;

namespace WebAppMaternidad.Areas.Comun
{
    public class PlanificacionFamiliarController : Controller
    {
        public ActionResult ListaAtencionesDelDia(DateTime FechaAtencion, int NroCuenta, int NroHistoria, int NroDocumento, String ApPaterno, int idGrupo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet ListaAtenciones;
            DalCitasWeb daoCitas = new DalCitasWeb();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaAtenciones = daoCitas.ListarPlanificacionFamiliar(FechaAtencion,NroCuenta,NroHistoria,NroDocumento,ApPaterno,idGrupo, idUsuario);
            return Json(ListaAtenciones);
        }
        [HttpGet]
        public ActionResult ListarServicio()
        {
            DataSet lstServicio;
            DalUtilitario daoCitas = new DalUtilitario();
            lstServicio = daoCitas.DevuelveDSServicioSinTodos((int)Enumerados.TiposServicio.Hospitalización);

            return Json(lstServicio);
        }
        [HttpPost]
        public ActionResult ObtenerDiagnostico(String Codigo,String Descripcion)
        {
            DataSet ListaDiagnostico;
            DalCitasWeb daoCitas = new DalCitasWeb();
            ListaDiagnostico = daoCitas.BuscarDiagnosticos(Codigo,Descripcion);
            return Json(ListaDiagnostico);
        }
        [HttpPost]
        public async Task<ActionResult> ObtenerDiagnosticoV2(String Codigo, String Descripcion)
        {
            DataSet ListaDiagnostico;
            DalCitasWeb daoCitas = new DalCitasWeb();
            ListaDiagnostico = await daoCitas.BuscarDiagnosticosV2(Codigo, Descripcion);
            return Json(ListaDiagnostico);
        }
        [HttpGet]
        public async Task<ActionResult> ListarMetodo()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarPlanificacionMetodo");
            return Json(lstMetodo);
        }
        [HttpPost]
        public ActionResult ListarProcedimientosxMetodo(int idMetodo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = daoCitas.DevuelveDSProcedimientoxMetodo(idMetodo);
            return Json(lstMetodo);
        }

        [HttpPost]
        public ActionResult DevuelveCondicionPaciente(int idNroCuenta,int idGrupo)
        {
            DataSet lstCondicion;
            DalPaciente daoPaciente = new DalPaciente();
            lstCondicion = daoPaciente.DevuelveCondicionPacientexNroCuenta(idNroCuenta,idGrupo);
            return Json(lstCondicion);
        }


        [HttpPost]
        public ActionResult GuardarPlanificacionFamiliar(PlanificacionFamiliar objPlanificacionFam, int idAccion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al registrar Atencion de Planificación Familiar ";
            int rsp = 0;
            try
            {
                objPlanificacionFam.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalPlanificacionFamiliar daoPlanificacionFam = new DalPlanificacionFamiliar();
                rsp = daoPlanificacionFam.registrarPlanificacionFamiliar(objPlanificacionFam,idAccion);
                if (rsp > 0)
                {
                    respuesta = "Se registro la atención correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public ActionResult DevuelvePlanificacionFamiliar(int idNroCuenta, int idGrupo)
        {
            DataSet lstPlanificacion;
            DalPlanificacionFamiliar daoPlanificacion = new DalPlanificacionFamiliar();
            lstPlanificacion = daoPlanificacion.DevuelvePlanificacionFamiliar(idNroCuenta, idGrupo);
            return Json(lstPlanificacion);
        }


        [HttpPost]
        public ActionResult EliminarPlanificacionFamiliar(PlanificacionFamiliar objPlanificacionFam)
        {
            

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al eliminar la atencion de Planificación Familiar ";
            int rsp = 0;
            try
            {
                objPlanificacionFam.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalPlanificacionFamiliar daoPlanificacionFam = new DalPlanificacionFamiliar();
                rsp = daoPlanificacionFam.EliminarPlanificacionFamiliar(objPlanificacionFam);
                if (rsp > 0)
                {
                    respuesta = "Se elimino correctamente la atención.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }


        [HttpPost]
        public ActionResult ObtenerDiagnosticoPlanificacion(String Codigo, String Descripcion)
        {
            DataSet ListaDiagnostico;
            DalCitasWeb daoCitas = new DalCitasWeb();
            ListaDiagnostico = daoCitas.BuscarDiagnosticosPlanificacion(Codigo, Descripcion);
            return Json(ListaDiagnostico);
        }


        [HttpGet]
        public async Task<ActionResult> ListarMedicosObstetrasEnfermeras()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarMedicosObstetrasEnfermeras");
            return Json(lstMetodo);
        }
        /**COMBOS**/

        [HttpPost]
        public ActionResult ListarTipoAtencion(int idTipoServicio)
        {
            DataSet lstTipoAtencion;
            DalUtilitario daoCitas = new DalUtilitario();
            lstTipoAtencion = daoCitas.DevuelveDSComboxServicio("web_ListarComboTipoAtencion",idTipoServicio);
            return Json(lstTipoAtencion);
        }

        [HttpPost]
        public ActionResult ListarComboRiesgoReproductivo(int idTipoServicio)
        {
            DataSet lstTipoAtencion;
            DalUtilitario daoCitas = new DalUtilitario();
            lstTipoAtencion = daoCitas.DevuelveDSComboxServicio("web_ListarComboRiesgoReproductivo", idTipoServicio);
            return Json(lstTipoAtencion);
        }


        [HttpPost]
        public ActionResult ListarRetiroMetodo(int idTipoServicio)
        {
            DataSet lstRetiroMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstRetiroMetodo = daoCitas.DevuelveDSComboxServicio("web_ListarComboRetiroMetodo", idTipoServicio);
            return Json(lstRetiroMetodo);
        }

        [HttpPost]
        public ActionResult ListarFallaMetodo(int idTipoServicio)
        {
            DataSet lstFallaMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstFallaMetodo = daoCitas.DevuelveDSComboxServicio("web_ListarComboFallaMetodo", idTipoServicio);
            return Json(lstFallaMetodo);
        }
        [HttpPost]
        public ActionResult ListarEstadoUsuaria(int idTipoServicio)
        {
            DataSet lstEstadoUsuaria;
            DalUtilitario daoCitas = new DalUtilitario();
            lstEstadoUsuaria = daoCitas.DevuelveDSComboxServicio("web_ListarComboEstadoUsuaria", idTipoServicio);
            return Json(lstEstadoUsuaria);
        }
        [HttpPost]
        public ActionResult ListarTipoConsejeria(int idTipoServicio)
        {
            DataSet lstTipoConsejeria;
            DalUtilitario daoCitas = new DalUtilitario();
            lstTipoConsejeria = daoCitas.DevuelveDSComboxServicio("web_ListarComboTipoConsejeria", idTipoServicio);
            return Json(lstTipoConsejeria);
        }       

        [HttpPost]
        public ActionResult ListarSubClasificacionDiagnostico(int idTipoServicio)
        {
            DataSet lstTipoConsejeria;
            DalUtilitario daoCitas = new DalUtilitario();
            lstTipoConsejeria = daoCitas.DevuelveDSComboxServicio("web_ListarSubClasificacionDiagnostico", idTipoServicio);
            return Json(lstTipoConsejeria);
        }
        [HttpPost]
        public ActionResult ListarMetodoxIdEstadoUsuaria(int idEstadoUsuaria)
        {
            DataSet lstMetodo;
            DalPlanificacionFamiliar daoPlanificacionFam = new DalPlanificacionFamiliar();
            lstMetodo = daoPlanificacionFam.DevuelveDSMetodoxEstadoUsuaria(idEstadoUsuaria);
            return Json(lstMetodo);
        }

        [HttpPost]
        public ActionResult ListarMetodosEfectoSecundario(int idTipoServicio)
        {
            DataSet lstTipoConsejeria;
            DalUtilitario daoCitas = new DalUtilitario();
            lstTipoConsejeria = daoCitas.DevuelveDSComboxServicio("web_listarMetodoEfecto", idTipoServicio);
            return Json(lstTipoConsejeria);
        }

        [HttpPost] //Inserta
        public ActionResult ListarEfectoSecxMetodo(int idMetodoEfecto)
        {
            DataSet lstMetodo;
            DalPlanificacionFamiliar daoPlanificacionFam = new DalPlanificacionFamiliar();
            lstMetodo = daoPlanificacionFam.DevuelveDSEfectoSecxMetodo(idMetodoEfecto);
            return Json(lstMetodo);
        }



        /*********/
    }
}