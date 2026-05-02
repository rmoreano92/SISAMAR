using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class RegistroTriajeController: BaseController
    {
        [HttpPost]
        public async Task<ActionResult> ListarAtencionesCEFiltrarPorPaciente(string nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string dni, int idCuentaAtencion, string lcFechaTriaje)
        {
            if(HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            DalTriaje dalTriaje = new DalTriaje();
            DataSet dataSet = await dalTriaje.ListarAtencionesCEFiltrarPorPaciente(nroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre,
            dni, idCuentaAtencion, lcFechaTriaje, idIpressInt);

            return Json(new { session = true, dataSet, estado = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesCeXnrohistoriaTriaje(int nroHistoriaClinica)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalTriaje dalTriaje = new DalTriaje();
            DataSet dataSet = await dalTriaje.ListarAtencionesCeXnrohistoriaTriaje(nroHistoriaClinica);

            return Json(new { session = true, dataSet });
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesCeListaTriajeByIdAtencion(int IdAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalTriaje dalTriaje = new DalTriaje();
            DataSet dataSet = await dalTriaje.AtencionesCeListaTriajeByIdAtencion(IdAtencion);

            return Json(new { session = true, dataSet, estado = true });
        }
    }
}
