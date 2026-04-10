using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.Estadistica
{
    public class ServicioSocialController: Controller
    {


        [HttpPost]
        public async Task<ActionResult> CrearModificarRegistroServicioSocial(
            int IdRegistro, DateTime FechaIngreso, int IdServicio, int IdUsuarioAsistente, int NroIngresos, int TurnosLaborados, int Entrevistas, int ARS, int MRS, int BRS, 
            int TotalRiesgoSocial, int Gestiones_Coordinaciones, int ReunionPareja_Familia, int ConsejeriaSocial, int InformeSocial_TramiteJudicial, int ActaEntrega, int Interconsulta, 
            int Referencia, int TotalAtencionesSociales, int InscripSegIntegSalud, int RegularizacionSIS, int ValidacionSIS, int OrientacionInformacion, int Charla, int EducacionSanitaria, 
            int DistMatInforEduc, int DisenioMaterialInfor_Educ, int VisitaDomiciliariaRealizada, int NroPacientesExonerados, int NroCasosViolencia, string Observaciones
            )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalServicioSocial dalServicioSocial = new DalServicioSocial();

            try
            {
                int resp = await dalServicioSocial.CrearModificarRegistroServicioSocial(
                                IdRegistro, FechaIngreso, IdServicio, IdUsuarioAsistente, NroIngresos, TurnosLaborados, Entrevistas, ARS, MRS, BRS,
                                TotalRiesgoSocial, Gestiones_Coordinaciones, ReunionPareja_Familia, ConsejeriaSocial, InformeSocial_TramiteJudicial, ActaEntrega, Interconsulta,
                                Referencia, TotalAtencionesSociales, InscripSegIntegSalud, RegularizacionSIS, ValidacionSIS, OrientacionInformacion, Charla, EducacionSanitaria,
                                DistMatInforEduc, DisenioMaterialInfor_Educ, VisitaDomiciliariaRealizada, NroPacientesExonerados, NroCasosViolencia, Observaciones
                            );

                return Json(new { session = true, estado = true, msj = "Se proceso con exito", resp });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesParaEstadisticasServicioSocial(string NroDocumento, string ApellidoPaterno, string FechaIngreso, int IdServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            
            DalServicioSocial dalServicioSocial = new DalServicioSocial();

            try
            {
                DataSet dataSet = await dalServicioSocial.ListarAtencionesParaEstadisticasServicioSocial(NroDocumento, ApellidoPaterno, FechaIngreso, IdServicio);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro(int IdRegistro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalServicioSocial dalServicioSocial = new DalServicioSocial();

            try
            {
                DataSet dataSet = await dalServicioSocial.SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro(IdRegistro);

                return Json(new { session = true, estado = true, msj = "Proceso exitoso", dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ServicioSeleccionarPorTipoServicio(int IdTipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalServicioSocial dalServicioSocial = new DalServicioSocial();
            DalServicios dalServicios = new DalServicios();

            try
            {
                DataSet dataSet = await dalServicios.ServicioSeleccionarPorTipoServicio(IdTipoServicio);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarEmpleados()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalServicioSocial dalServicioSocial = new DalServicioSocial();

            try
            {
                DataSet dataSet = await dalServicioSocial.ListarEmpleados();

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarTurnos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalServicioSocial dalServicioSocial = new DalServicioSocial();

            try
            {
                DataSet dataSet = await dalServicioSocial.ListarTurnos();

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error al listar, " + ex.Message + "." });
            }

        }


    }
}
