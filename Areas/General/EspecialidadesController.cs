using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.General
{
    public class EspecialidadesController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> DepartamentosHospitalSeleccionarTodos()
        {
            DataSet lstData;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            lstData = await dalEspecialidades.DepartamentosHospitalSeleccionarTodos();

            return Json(new { lstData = lstData, sesion = true });
        }


        public async Task<ActionResult> EspecialidadesSeleccionarPorDepartamento(int idDepartamento)
        {
            DataSet lstData;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            lstData = await dalEspecialidades.EspecialidadesSeleccionarPorDepartamento(idDepartamento);

            return Json(new { lstData = lstData, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveEspecialidadesDelHospitalfiltro(string filtro)
        {
            DataSet lstData;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            lstData = await dalEspecialidades.DevuelveEspecialidadesDelHospitalfiltro(filtro);

            return Json(new { lstData = lstData, sesion = true });
        }

        public async Task<ActionResult> EspecialidadesSeleccionarPorMedico(int idMedico)
        {
            DataSet lstData;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            lstData = await dalEspecialidades.EspecialidadesSeleccionarPorMedico(idMedico);

            return Json(new { lstData = lstData, sesion = true });
        }

        public async Task<ActionResult> EspecialidadesSeleccionarPorMedicoYDepartamento(int idMedico,int idDepartamento)
        {
            DataSet lstData;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            lstData = await dalEspecialidades.EspecialidadesSeleccionarPorMedicoYDepartamento(idMedico, idDepartamento);

            return Json(new { lstData = lstData, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EspecialidadesFiltrar(string lcFiltro)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalEspecialidades.EspecialidadesFiltrar(lcFiltro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarEspecialidad(int? IdEspecialidad, string Nombre, int IdDepartamento, int? TiempoPromedioAtencion, int? IdEspecialidadCE, int? IdProductoConsulta, int? IdProductoInterconsulta)
        {
            int resp = 0;
            //int nRpta;
            DalEspecialidades dalEspecialidades = new DalEspecialidades();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                resp = await dalEspecialidades.CrearModificarEspecialidad(IdEspecialidad, Nombre, IdDepartamento, TiempoPromedioAtencion, IdEspecialidadCE, IdProductoConsulta, IdProductoInterconsulta);
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }
        }

    }
}
