using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class DashBoardHospController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ListarServicio()
        {
            DataSet lstMeses;
            DalUtilitario daoDashBoard = new DalUtilitario();
            lstMeses = daoDashBoard.DevuelveDSServicio((int)Enumerados.TiposServicio.Hospitalización);
            return Json(lstMeses);
        }

        #region Hospitalizados

        [HttpPost]
        public ActionResult ListaAtendidosAnio(int idTipoServicio)
        {
            DataSet lstCitas;
            DalDashBoard daoDashBoard = new DalDashBoard();
            lstCitas = daoDashBoard.ListaAtendidosHospAnio(idTipoServicio);
            return Json(lstCitas);
        }

        [HttpPost]
        public ActionResult ListadoAtendidosxAnio(int idTipoServicio, int Anio)
        {
            DataSet lstCitas;
            DalDashBoard daoDashBoard = new DalDashBoard();
            lstCitas = daoDashBoard.ListadoAtendidosHospxAnio(Anio, idTipoServicio);
            return Json(lstCitas);
        }

        [HttpPost]
        public ActionResult ListadoAtendidosxMes(int idTipoServicio, int Anio, int Mes)
        {
            DataSet lstCitas;
            DalDashBoard daoDashBoard = new DalDashBoard();
            lstCitas = daoDashBoard.ListadoAtendidosHospxMes(Anio, Mes, idTipoServicio);
            return Json(lstCitas);
        }

        [HttpPost]
        public ActionResult ListadoAtendidosHospxMesyTipo(int idTipoServicio, int Anio, int Mes)
        {
            DataSet lstCitas;
            DalDashBoard daoDashBoard = new DalDashBoard();
            lstCitas = daoDashBoard.ListadoAtendidosHospxMesyTipo(Anio, Mes, idTipoServicio);
            return Json(lstCitas);
        }
        #endregion



    }
}