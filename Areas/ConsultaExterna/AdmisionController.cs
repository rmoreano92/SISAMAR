using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;

using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class AdmisionController: BaseController
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

            DalAdmision dalAdmision = new DalAdmision();
            DataSet dataSet = await dalAdmision.ListarAtencionesCEFiltrarPorPaciente(nroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre,
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

        [HttpPost]
        public async Task<ActionResult> ConfirmarLlegadaCE(Admision obAdmision)
        {
            DataSet dataSet = null;

            DalAdmision dalAdmision = new DalAdmision();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            obAdmision.IdUsuarioAuditoria = idUsuario;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            bool nRpta = await dalAdmision.ConfirmarLlegada(obAdmision);

            return Json(new { dataSet, estado = true, idAtencion = nRpta, session = true });
        }
		
		[HttpPost]
        public async Task<ActionResult> CambiarEstadoCitaPagado(int idCita)
        {
			DalAdmision dalAdmision = new DalAdmision();
			if (!HttpContext.User.Identity.IsAuthenticated)
			{
				return Json(new{resultado = false,mensaje = "Recargue la pagina"});
			}
			var rpta = await dalAdmision.CambiarEstadoCitaPagado(idCita);
			return Json(new{resultado = rpta.resultado,mensaje = rpta.mensaje});
        }
    }
}
