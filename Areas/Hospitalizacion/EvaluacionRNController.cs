using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class EvaluacionRNController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }


        public ActionResult ListaAtencionesDelDia(DateTime FechaAtencion, int NroCuenta, int NroHistoria, int NroDocumento, String ApPaterno, int idGrupo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet ListaAtenciones;
            DalEvaluacionRN daoCitas = new DalEvaluacionRN();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaAtenciones = daoCitas.ListarHospitalizadosRN(FechaAtencion, NroCuenta, NroHistoria, NroDocumento, ApPaterno, idGrupo, idUsuario);
            return Json(ListaAtenciones);
        }



        public async Task<IActionResult> EvaluarRN(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol =await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;



                }
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalización";
                return View("~/Views/Hospitalizacion/EvaluarRN.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }


        }


        [HttpGet]
        public async Task<ActionResult> ListarRiesgosObstetricos()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarRiesgosObstetricos");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarCondicionRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarCondicionRn");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarContactoPielaPiel()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarContactoPielaPiel");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> istarObstetras()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarObstetras");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTipoPartoRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await  daoCitas.DevuelveDSCombo("Web_ListarTipoPartoRn");
            return Json(lstMetodo);
        }



        [HttpPost]
        public ActionResult GuardarEvaluacionRn(EvaluacionRN objEvaluacionRN, int idAccion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al registrar evaluación del recien nacido.";
            int rsp = 0;
            try
            {
                objEvaluacionRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = daoEvaluacionRn.registrarEvaluacionRn(objEvaluacionRN, idAccion);
                if (rsp > 0)
                {
                    respuesta = "Se registro la evaluación correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }


        public ActionResult ObtenerEvaluacionRN(int idCuentaAtencion )
        {
            DataSet lstEvaluacionRn;
            DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
            lstEvaluacionRn = daoEvaluacionRn.ObtenerEvaluacionRN(idCuentaAtencion);
            return Json(lstEvaluacionRn);
        }



        [HttpPost]
        public ActionResult EliminarEvaluacionRn(EvaluacionRN objEvaluacionRN, int idAccion)
        {
            string respuesta = "Error al registrar evaluación del recien nacido.";
            int rsp = 0;
            bool bSesion = true;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                respuesta = "Su Sesion a Finalizado.";
                bSesion = false;
                return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            }
            
            try
            {
                objEvaluacionRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                rsp = daoEvaluacionRn.EliminarEvaluacionRn(objEvaluacionRN, idAccion);
                if (rsp > 0)
                {
                    respuesta = "Se registro la evaluación correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }

    }
}