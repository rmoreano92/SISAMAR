using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class IntervencionSanitariaController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListaPrescriptores()
        {
            DataSet ds;
            DalIntervencionSanitaria dal = new DalIntervencionSanitaria();
            ds = null;

            ds = await dal.ListaPrescriptores();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListaCoordinadores()
        {
            DataSet ds;
            DalIntervencionSanitaria dal = new DalIntervencionSanitaria();
            ds = null;

            ds = await dal.ListaCoordinadores();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListaComponentes()
        {
            DataSet ds;
            DalIntervencionSanitaria dal = new DalIntervencionSanitaria();
            ds = null;

            ds = await dal.ListaComponentes();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListaSubComponentes(int idComponente)
        {
            DataSet ds;
            DalIntervencionSanitaria dal = new DalIntervencionSanitaria();
            ds = null;

            ds = await dal.ListaSubComponentes(idComponente);

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListaDiagnosticosIntervencionSanitaria(string filtro)
        {
            DataSet ds;
            DalIntervencionSanitaria dal = new DalIntervencionSanitaria();
            ds = null;

            ds = await dal.ListaDiagnosticosIntervencionSanitaria(filtro);

            return Json(ds);
        }

        [HttpPost]
        public async Task<IActionResult> CrearModificarIntervencionSanitariaFarmacia(
            string MovNumero, string MovTipo, int? IdCuentaAtencion, DateTime? FechaHoraPrescribe, int? IdPaquete,
            string NroFormato, int? IdReceta, string DocumentoNumero, string Observaciones, int? idEstadoMovimiento, int? idAlmacenOrigen, int? idAlmacenDestino, int? IdFuenteFinanciamiento,
            int? IdPrescriptor, int? IdCoordinador, int? IdComponente, int? IdSubComponente, int? IdDiagnostico, int? idEstadoFacturacion, string movimientoDetalle,
            int IdListBarItem)
        {
            
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {

                var lstObjDetalleNotaSalida = JsonConvert.DeserializeObject<List<FarmMovimientoDetalle>>(movimientoDetalle);

                var dal = new DalIntervencionSanitaria();
                var idUsuario = IdUsuarioSesion();


                var dataSet = await dal.CrearModificarIntervencionSanitariaFarmacia(MovNumero, MovTipo, IdCuentaAtencion, FechaHoraPrescribe, IdPaquete,
                    NroFormato, IdReceta, DocumentoNumero, Observaciones, idEstadoMovimiento, idAlmacenOrigen, idAlmacenDestino, IdFuenteFinanciamiento,
                    IdPrescriptor, IdCoordinador, IdComponente, IdSubComponente, IdDiagnostico, idEstadoFacturacion, lstObjDetalleNotaSalida, idUsuario, IdListBarItem);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }


    }
}
