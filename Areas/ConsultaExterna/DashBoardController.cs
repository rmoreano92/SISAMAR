using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;

namespace WebAppMaternidad.Areas.ConsultaExterna.Controllers
{
    public class DashBoardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

     



        [HttpPost]
        public ActionResult ListadoPrincipal(int Mes, int idTipoServicio, int idEspecialidad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ObtenerCitasCE(Mes, idTipoServicio, idEspecialidad);
            return Json(lstCitas);            
        }


        [HttpGet]
        public async Task<ActionResult> ListarMeses()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses =await  daoCitas.DevuelveDSCombo("Web_ListarMeses");
            return Json(lstMeses);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTipoServicio()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses = await daoCitas.DevuelveDSCombo("web_listarTipoServicio");
            return Json(lstMeses);
        }

        [HttpGet]
        public ActionResult ListarServicio()
        {
            DataSet lstMeses;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMeses = daoCitas.DevuelveDSServicio((int)Enumerados.TiposServicio.Consultorios_Externos);
            return Json(lstMeses);
        }



        [HttpPost]
        public ActionResult ListadoCitasAtendidos(int Mes, int idTipoServicio, int idEspecialidad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ObtenerCitasAtendidasCE(Mes, idTipoServicio, idEspecialidad);
            return Json(lstCitas);
        }


        [HttpPost]
        public ActionResult ListadoCitasAtendidasxCE(DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lstCitas;
            DalDashBoard daoCitas = new DalDashBoard();
            lstCitas = daoCitas.ObtenerCitasAtendidasxCE(FechaInicio,FechaFin);
            return Json(lstCitas);
        }




    }
}