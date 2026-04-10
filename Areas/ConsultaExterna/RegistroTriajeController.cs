using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class RegistroTriajeController: Controller
    {
        [HttpPost]
        public async Task<ActionResult> ListarAtencionesCEFiltrarPorPaciente(string nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string dni, int idCuentaAtencion, string lcFechaTriaje)
        {
            if(HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalTriaje dalTriaje = new DalTriaje();
            DataSet dataSet = await dalTriaje.ListarAtencionesCEFiltrarPorPaciente(nroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre,
            dni, idCuentaAtencion, lcFechaTriaje);

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
