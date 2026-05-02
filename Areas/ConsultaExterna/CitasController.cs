using Aspose.Cells.Drawing;
using CapaDatos;
using CapaEntidades;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NPOI.POIFS.Crypt.Dsig;
using QRCoder;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    // JDELGADO010
    public class CitasController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult> listarDepartamentosHospital()
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarDepartamentosHospital();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> listarDepartamentoHospitalario(string lcFiltro) //MGAMERO
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            dataSet = await dalCitasAdmision.listarDepartamentoHospitalario(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }

        /*
        [HttpPost]
        public async Task<ActionResult> listarMedicosFiltrarPorProgramacion(string lcFiltro)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalCitasAdmision.listarMedicosFiltrarPorProgramacion(lcFiltro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        */

        [HttpPost]
        public async Task<ActionResult> listarEspecialidadPorDepartamento(string lcFiltro) //MGAMERO
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarEspecialidadPorDepartamento(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> listarMedicosPorFiltroConEspecialidad(string lcFiltro) //MGAMERO
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarMedicosPorFiltroConEspecialidad(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> BuscarProgramacionCitasWeb(string lcFiltro) //MGAMERO
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.BuscarProgramacionCitasWeb(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }
        [HttpPost]
        public async Task<ActionResult> BuscarCitasWebCuposBloqueados(string lcFiltro) //MGAMERO
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.BuscarCitasWebCuposBloqueados(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }
        [HttpPost]
        public async Task<ActionResult> BuscarCitasProgramadasPorServicioYFecha(int idServicio, string fechaYmd) //MGAMERO
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.BuscarCitasProgramadasPorServicioYFecha(idServicio, fechaYmd);

            return Json(new { dataSet, estado = true, session = true });
        }
        [HttpPost]
        public async Task<IActionResult> GuardarDetalleSistemaCitasWeb([FromBody] List<SistemaCitasWebDetalleGuardarRequest> payload)
        {
            
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            if (payload == null || !payload.Any())
            {
                return Json(new
                {
                    estado = false,
                    session = true,
                    mensaje = "No se recibieron datos para guardar."
                });
            }

            bool ok = await dalCitasAdmision.GuardarDetalleSistemaCitasWeb(payload);

            return Json(new
            {
                estado = ok,
                session = true,
                mensaje = ok ? "Datos guardados correctamente." : "No se pudo guardar."
            });
        }
        /*
        [HttpGet]
        public async Task<ActionResult> listarMedicosPorFiltroConEspecialidad()
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarMedicosPorFiltroConEspecialidad();

            return Json(new { dataSet, estado = true, session = true });
        }
        */
        [HttpPost]
        public async Task<ActionResult> listarMedicosFiltrarPorProgramacion(string lcFiltro)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idIpressInt = 0;
                var idIpressStr = HttpContext.Session.GetString("IdIPress");
                if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

                dataSet = await dalCitasAdmision.listarMedicosFiltrarPorProgramacion(lcFiltro, idIpressInt);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> listarProgramacionMedicaPorIdMedicoMesAnio(int idMedico, int mes, int anio)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarProgramacionMedicaPorIdMedicoMesAnio(idMedico, mes, anio);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> obtenerProgramacionMedicaPorIdProgramacionIdMedico(int idProgramacion, int idMedico)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.obtenerProgramacionMedicaPorIdProgramacionIdMedico(idProgramacion, idMedico);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> listarCitasSeleccionarPorMedicoYFecha(int idMedico, DateTime fecha)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarCitasSeleccionarPorMedicoYFecha(idMedico, fecha);

            return Json(new { dataSet, estado = true, session = true  });
        }

        [HttpPost]
        public async Task<ActionResult> listarCitasSeleeccionarPacientePorMedicoFechaHoras(int idMedico, DateTime fecha, string horaInicio, string horaFin)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarCitasSeleeccionarPacientePorMedicoFechaHoras(idMedico, fecha, horaInicio, horaFin);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> obtenerEspecialidadesSeleccionarPorMedico(int idMedico)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.obtenerEspecialidadesSeleccionarPorMedico(idMedico);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> obtenerTurnosSeleccionarPorId(int idTurno)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false});
            }

            dataSet = await dalCitasAdmision.obtenerTurnosSeleccionarPorId(idTurno);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> listarCupos(int idProgramacion)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarCupos(idProgramacion);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaCuposCitasTerapia(int idProgramacion)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ListaCuposCitasTerapia(idProgramacion);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> listarTipoFormatoSIS()
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarTipoFormatoSIS();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ObtenerMedicosSeleccionarPorIdMedicoPlanilla(int idMedico)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalCitasAdmision.ObtenerMedicosSeleccionarPorIdMedicoPlanilla(idMedico);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> obtenerEspecialidadCEseleccionarIdServicio(int idServicio)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.obtenerEspecialidadCEseleccionarIdServicio(idServicio);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> listarServiciosSeleccionarConsultoriosPorEspecialidad(int idEspecialidad)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false});
            }

            dataSet = await dalCitasAdmision.listarServiciosSeleccionarConsultoriosPorEspecialidad(idEspecialidad);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> listarFuentesFinanciamientoSegunFiltro()
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            string lcFiltro = "UtilizadoEn=1 or UtilizadoEn=3";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false});
            }

            dataSet = await dalCitasAdmision.listarFuentesFinanciamientoSegunFiltro(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> listarTiposReferenciaSeleccionarTodos()
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarTiposReferenciaSeleccionarTodos();

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> listarEstablecimientosReferencia(
            string codigoRenaes, string nombreEstablecimiento, int idDepartamento, int idProvincia, int idDistrito, int tipoReferencia)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            string lcFiltro = "";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lcFiltro = lcFiltro + $" WHERE Departamentos.IdDepartamento = {idDepartamento} ";

            if (nombreEstablecimiento != "" && nombreEstablecimiento != null)
            {
                if(tipoReferencia == 2)
                {
                    lcFiltro = lcFiltro + $"and EstablecimientosNoMinsa.Nombre like '%{nombreEstablecimiento}%' ";
                } else
                {
                    lcFiltro = lcFiltro + $"and Establecimientos.Nombre like '%{nombreEstablecimiento}%' ";
                }
                
            }

            if (codigoRenaes != "" && codigoRenaes != null)
            {

                if (tipoReferencia == 2)
                {
                    lcFiltro = lcFiltro + $"and EstablecimientosNoMinsa.Codigo like '%{codigoRenaes}%' ";
                }
                else
                {
                    lcFiltro = lcFiltro + $"and Establecimientos.Codigo like '%{codigoRenaes}%' ";
                }
                
            }

            if (idProvincia != 0)
            {
                lcFiltro = lcFiltro + $" and Provincias.IdProvincia = {idProvincia} ";
            }

            if (idDistrito != 0)
            {
                lcFiltro = lcFiltro + $"and Establecimientos.IdDistrito = {idDistrito} ";
            }

            Console.WriteLine("lcFiltro " + lcFiltro);

            dataSet = await dalCitasAdmision.listarEstablecimientosReferencia(lcFiltro, tipoReferencia);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarEstablecimientosReferenciaV2(
            string codigoRenaes, string nombreEstablecimiento, int idDepartamento, int idProvincia, int idDistrito)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();


            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ListarEstablecimientosReferenciaV2(codigoRenaes, nombreEstablecimiento, idDepartamento, idProvincia, idDistrito);

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> listarFactCatalogoServiciosSeleccionarTipoConsulta(int idEspecialidad)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false});
            }

            dataSet = await dalCitasAdmision.listarFactCatalogoServiciosSeleccionarTipoConsulta(idEspecialidad);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> listarTiposFinanciamientosTarifaSeleccionarPorPlan(int idFuenteFinanciamiento)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarTiposFinanciamientosTarifaSeleccionarPorPlan(idFuenteFinanciamiento);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> listarSisServiciosSeleccionarPorFiltro()
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            string lcFiltro = " ser_Hosp='N'  and (rc01_idSexo='2' or rc01_idSexo='0')";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarSisServiciosSeleccionarPorFiltro(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ReglasDeConsistenciasAntesDeCargarFormulario(int idTipoServicio, string tipoSexo, string edadEnYYYYMMDD)
        {
            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            string lcFiltro;

            if (idTipoServicio != 3) // Si es diferente de hospitalizacion
            {
                lcFiltro = " ser_Hosp='N' ";
            }
            else
            {
                lcFiltro = " ser_Hosp='S' ";
            }
            if(tipoSexo != "")
            {
                if (tipoSexo == "M")
                {
                    lcFiltro = lcFiltro + " and (rc01_idSexo='2' or rc01_idSexo='1')";
                }
                else
                {
                    lcFiltro = lcFiltro + " and (rc01_idSexo='2' or rc01_idSexo='0')";
                }
            }
            if(edadEnYYYYMMDD != "")
            {
                lcFiltro = lcFiltro + " and ('" + edadEnYYYYMMDD + "'>=rc01_edadMin  and '" + edadEnYYYYMMDD + "'<= rc01_edadMax)";
            }
            //lcFiltro = " ser_Hosp='N'  and (rc01_idSexo='2' or rc01_idSexo='0')";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.listarSisServiciosSeleccionarPorFiltro(lcFiltro);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> PacientesFiltrarTodosSoloHistoriasDefinitivas(int nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string segundoNombre, int idDocIdentidad, string nroDocumento)
        {
            DataSet dataSet = null;
            DalPaciente dalPaciente = new DalPaciente();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalPaciente.PacientesFiltrarTodosSoloHistoriasDefinitivas(nroHistoriaClinica, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, idDocIdentidad, nroDocumento);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> PacientesFiltraPorNroDocumentoYtipo(string nroDocumento, int idDocIdentidad)
        {
            DataSet dataSet = null;
            DalPaciente dalPaciente = new DalPaciente();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalPaciente.PacientesFiltraPorNroDocumentoYtipo(nroDocumento, idDocIdentidad);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitaSeleccionarPorId(int idCita)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ListaCitaByIdCita(idCita);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> CitasAgregar(Citas objCitas, int IdPaciente) // JDELGADO001.2
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalCitasAdmision.CitasAgregar(objCitas, int.Parse(HttpContext.Session.GetString("idusu")), IdPaciente);
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CitasModificar(Citas objCitas, int IdPaciente) // JDELGADO001.2
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalCitasAdmision.CitasModificar(objCitas, int.Parse(HttpContext.Session.GetString("idusu")), IdPaciente);
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasBloqueadasAgregar(string horaBloqueo, DateTime fechaBloqueo, int idMedico, string horaInicio, string horaFin, DateTime fecha) // JDELGADO001.2
        {
            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }


            //DataSet dataSet = null;
            int nRpta = 0;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalCitasAdmision.CitasBloqueadasAgregar(horaBloqueo, fechaBloqueo, idMedico, horaInicio, horaFin, fecha, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasBloqueadasEliminar(int idCitaBloqueada) // JDELGADO001.2
        {
            DataSet dataSet = null;
            int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            nRpta = await dalCitasAdmision.CitasBloqueadasEliminar(idCitaBloqueada, int.Parse(HttpContext.Session.GetString("idusu")));

            return Json(new { dataSet, estado = true, idCita = nRpta, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> CitasEliminar(int idCita) // JDELGADO001.2
        {
            DataSet dataSet = null;
            int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                nRpta = await dalCitasAdmision.CitasEliminar(idCita, int.Parse(HttpContext.Session.GetString("idusu")));

                return Json(new { dataSet, estado = true, session = true, mensaje = "", idCita = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { dataSet, estado = false, session = true, mensaje = "Error al eliminar cita: " + e });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListaPacienteTieneCitaByIdPacienteIdServicio(int idPaciente, int idServicio, string fechaCita) // JDELGADO010
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.ListaPacienteTieneCitaByIdPacienteIdServicio(idPaciente, idServicio, fechaCita);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasBloqueadasByFecha(DateTime fecha) // JDELGADO011
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.CitasBloqueadasByFecha(fecha);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaRecetasInterconsulta(int nroOrden, int idEspecialidad) // JDELGADO011
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ListaRecetasInterconsulta(nroOrden, idEspecialidad);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarServicioById(int idServicio) // JDELGADO011
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.SeleccionarServicioById(idServicio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpGet]
        public async Task<ActionResult> ListarFuentesFinanciamientoSegunFiltroV2()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string lcFiltro = "UtilizadoEn=1 or UtilizadoEn=3";

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.listarFuentesFinanciamientoSegunFiltro(lcFiltro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpPost]
        public async Task<ActionResult> ListarTiposFinanciamientosTarifaSeleccionarPorPlanV2(int idFuenteFinanciamiento)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.listarTiposFinanciamientosTarifaSeleccionarPorPlan(idFuenteFinanciamiento);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> ListarTipoFormatoSISV2()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.listarTipoFormatoSIS();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SisFiltraPacientesAfiliados(string paterno, string materno, string pnombre, string onombres, string genero, string fnacimiento)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.SisFiltraPacientesAfiliados(paterno, materno, pnombre, onombres, genero, fnacimiento);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ImprimeTicketCita(int idCita, int nroCupo)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("usuario");

            try
            {
                pageHtml = Url.Action("TicketCita", "Citas", new { idCita, nroCupo, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "Ticket";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                return Json(new { exep = ex.ToString() });
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        public async Task<ActionResult> ImprimeHojaFiliacionConsultorio(int idPaciente, int idCita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }



            DataSet lsParametros = new DataSet();
            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            DateTime now = DateTime.Now;


            HtmlToPdf ohtml = new HtmlToPdf();

            PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

            PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
            ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
            ohtml.Options.PdfPageSize = pageSize;
            ohtml.Options.MarginLeft = 20;
            ohtml.Options.MarginRight = 20;
            ohtml.Options.MarginTop = 20;
            ohtml.Options.MarginBottom = 20;
            ohtml.Options.WebPageWidth = 793;
            ohtml.Options.WebPageHeight = 1122;

            var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
            var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
            string IpPrivada = AppNameIp1.ToString();
            string IpPublica = AppNameIp2.ToString();
            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;

            string usuario = HttpContext.Session.GetString("user");

            string Ruta = Url.Action("FormatoHojaFiliacionConsultorio", "Citas", new { idPaciente, idCita, usuario }, "http");
            Ruta = Ruta.Replace(IpPublica, IpPrivada);
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);


            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );
        }

        public ActionResult ImprimeFormatoFiliacionArchivoClinico(int idPaciente, int idCita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }



            DataSet lsParametros = new DataSet();
            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            DateTime now = DateTime.Now;


            HtmlToPdf ohtml = new HtmlToPdf();

            PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

            PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
            ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
            ohtml.Options.PdfPageSize = pageSize;
            ohtml.Options.MarginLeft = 20;
            ohtml.Options.MarginRight = 20;
            ohtml.Options.MarginTop = 20;
            ohtml.Options.MarginBottom = 20;
            ohtml.Options.WebPageWidth = 793;
            ohtml.Options.WebPageHeight = 1122;

            var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
            var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
            string IpPrivada = AppNameIp1.ToString();
            string IpPublica = AppNameIp2.ToString();
            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;

            string usuario = HttpContext.Session.GetString("usuario");

            string Ruta = Url.Action("FormatoFiliacionArchivoClinico", "Citas", new { idPaciente, idCita, usuario }, "http");
            Ruta = Ruta.Replace(IpPublica, IpPrivada);
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);


            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );
        }

        public ActionResult ImprimeFormatoFO030(int idPaciente, int idCita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }



            DataSet lsParametros = new DataSet();
            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            DateTime now = DateTime.Now;


            HtmlToPdf ohtml = new HtmlToPdf();

            PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

            PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
            ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
            ohtml.Options.PdfPageSize = pageSize;
            ohtml.Options.MarginLeft = 20;
            ohtml.Options.MarginRight = 20;
            ohtml.Options.MarginTop = 20;
            ohtml.Options.MarginBottom = 20;
            ohtml.Options.WebPageWidth = 793;
            ohtml.Options.WebPageHeight = 1122;

            var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
            var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
            string IpPrivada = AppNameIp1.ToString();
            string IpPublica = AppNameIp2.ToString();
            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;

            string usuario = HttpContext.Session.GetString("user");

            string Ruta = Url.Action("FormatoImpresionF30", "Citas", new { idPaciente, idCita, usuario }, "http");
            Ruta = Ruta.Replace(IpPublica, IpPrivada);
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);


            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );
        }
        public async Task<ActionResult> TicketCita(int idCita, int nroCupo, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            DataSet lsParametros = new DataSet();
            DataSet lsCitas = await dalCitasAdmision.ListaCitaByIdCita(idCita);

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;


            var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);


            DateTime now = DateTime.Now;

            @ViewBag.NroCupo = nroCupo;
            @ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            @ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.FuenteFinanciamiento = lsCitas.Tables[0].Rows[0]["desFuenteFinanciamiento"];

            @ViewBag.FechaCita = lsCitas.Tables[0].Rows[0]["fecha"];
            @ViewBag.HoraCita = lsCitas.Tables[0].Rows[0]["horaInicio"];
            @ViewBag.TurnoCita = lsCitas.Tables[0].Rows[0]["desTurno"];
            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["desServicio"];
            @ViewBag.TipoProfesionalSalud = lsCitas.Tables[0].Rows[0]["TipoProfesional"];
            @ViewBag.ProfesionalSalud = lsCitas.Tables[0].Rows[0]["medico"];
            @ViewBag.NroHistoria = lsCitas.Tables[0].Rows[0]["nroHistoria"];
            @ViewBag.PacienteNombres = lsCitas.Tables[0].Rows[0]["pacienteNombre"];
            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["idCuentaAtencion"];
            @ViewBag.TipoCita = lsCitas.Tables[0].Rows[0]["TipoCita"].ToString();
            @ViewBag.FechaSolicitud = lsCitas.Tables[0].Rows[0]["FechaSolicitud"].ToString();
            @ViewBag.HoraSolicitud = lsCitas.Tables[0].Rows[0]["HoraSolicitud"].ToString();
            @ViewBag.EstablecimientoReferencia = lsCitas.Tables[0].Rows[0]["EstablecimientoReferencia"].ToString();
            @ViewBag.NroReferencia = lsCitas.Tables[0].Rows[0]["NroReferencia"].ToString();

            @ViewBag.OrdenPago = lsCitas.Tables[0].Rows[0]["idOrdenPago"].ToString();
            @ViewBag.IdEstadoFacturacion = lsCitas.Tables[0].Rows[0]["IdEstadoFacturacion"].ToString();
            @ViewBag.IdFuenteFinanciamiento = lsCitas.Tables[0].Rows[0]["IdFuenteFinanciamiento"].ToString();

            @ViewBag.GradoInstruccion = lsCitas.Tables[0].Rows[0]["GradoInstruccion"].ToString();
            @ViewBag.CIP = lsCitas.Tables[0].Rows[0]["CIP"].ToString();
            @ViewBag.ParentescoPaciente = lsCitas.Tables[0].Rows[0]["ParentescoPacienteDesc"].ToString();

            @ViewBag.UsuarioRegistro = lsCitas.Tables[0].Rows[0]["UsuarioRegistro"].ToString();

            @ViewBag.FechaImpresion = now;
            @ViewBag.Usuario = usuario;


            


            return PartialView("~/Views/ConsultaExterna/Plantillas/TicketCita.cshtml");
        }

        public async Task<ActionResult> FormatoHojaFiliacionConsultorio(int idPaciente, int idCita, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            DalPaciente dalPaciente = new DalPaciente();

            DataSet lsParametros = new DataSet();


            DataSet lsPacientes = await dalPaciente.PacientesSeleccionarPorId(idPaciente);
            DataSet lsCitas = await dalCitasAdmision.ListaCitaByIdCita(idCita);

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);

            DateTime now = DateTime.Now;

            @ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            @ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();


            @ViewBag.NroHistoria = lsPacientes.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.PacienteNombres = lsPacientes.Tables[0].Rows[0]["nombres"].ToString().ToUpper();

            @ViewBag.FechaCita = lsCitas.Tables[0].Rows[0]["fecha"];
            @ViewBag.HoraCita = lsCitas.Tables[0].Rows[0]["horaInicio"];
            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["desServicio"];
            @ViewBag.EstadoCivilDes = lsPacientes.Tables[0].Rows[0]["EstadoCivilDes"];
            @ViewBag.Medico = lsCitas.Tables[0].Rows[0]["medico"];
            @ViewBag.Especialidad = lsCitas.Tables[0].Rows[0]["Especialidad"];
            @ViewBag.DireccionDomicilio = lsPacientes.Tables[0].Rows[0]["DireccionDomicilio"];
            @ViewBag.NombreDepartamentoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoDomicilio"];
            @ViewBag.NombreDistritoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreDistritoDomicilio"];

            @ViewBag.TipoEdad = lsCitas.Tables[0].Rows[0]["TipoEdad"];
            @ViewBag.Edad = lsCitas.Tables[0].Rows[0]["Edad"];
            @ViewBag.FechaNacimiento = lsPacientes.Tables[0].Rows[0]["fecNacimiento"];
            @ViewBag.Sexo = lsPacientes.Tables[0].Rows[0]["Sexo"];
            @ViewBag.NroDocumento = lsPacientes.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.Telefono = lsPacientes.Tables[0].Rows[0]["Telefono"];
            @ViewBag.NombreProvinciaDomicilio = lsPacientes.Tables[0].Rows[0]["nombreProvinciaDomicilio"];
            @ViewBag.NombreCentroPobladoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoDomicilio"];

            @ViewBag.NombreDepartamentoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoProcedencia"];
            @ViewBag.NombreProvinciaProcedencia = lsPacientes.Tables[0].Rows[0]["nombreProvinciaProcedencia"];
            @ViewBag.NombreDistritoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreDistritoProcedencia"];
            @ViewBag.NombreCentroPobladoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoProcedencia"];
            @ViewBag.NombrePaisProcedencia = lsPacientes.Tables[0].Rows[0]["nombrePaisProcedencia"];

            @ViewBag.NombreDepartamentoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoNacimiento"];
            @ViewBag.NombreProvinciaNacimiento = lsPacientes.Tables[0].Rows[0]["nombreProvinciaNacimiento"];
            @ViewBag.NombreDistritoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreDistritoNacimiento"];
            @ViewBag.NombreCentroPobladoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoNacimiento"];
            @ViewBag.NombrePaisNacimiento = lsPacientes.Tables[0].Rows[0]["nombrePaisNacimiento"];

            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["idCuentaAtencion"];
            @ViewBag.OrdenPago = lsCitas.Tables[0].Rows[0]["idOrdenPago"];

            //
            //@ViewBag.TurnoCita = lsCitas.Tables[0].Rows[0]["desTurno"];
            //
            //@ViewBag.TipoProfesionalSalud = lsCitas.Tables[0].Rows[0]["TipoProfesional"];
            //@ViewBag.ProfesionalSalud = lsCitas.Tables[0].Rows[0]["medico"];
            //
            //
            //
            //@ViewBag.TipoCita = lsCitas.Tables[0].Rows[0]["TipoCita"].ToString();
            //@ViewBag.FechaSolicitud = lsCitas.Tables[0].Rows[0]["FechaSolicitud"].ToString();
            //@ViewBag.HoraSolicitud = lsCitas.Tables[0].Rows[0]["HoraSolicitud"].ToString();
            @ViewBag.FechaImpresion = now;
            //@ViewBag.Usuario = HttpContext.Session.GetString("usuario");
            @ViewBag.Usuario = usuario;



            return PartialView("~/Views/Comun/Plantillas/HojaFiliacionConsultorio.cshtml");
        }

        public async Task<ActionResult> FormatoFiliacionArchivoClinico(int idPaciente, int idCita, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            DalPaciente dalPaciente = new DalPaciente();

            DataSet lsParametros = new DataSet();


            DataSet lsPacientes = await dalPaciente.PacientesSeleccionarPorId(idPaciente);
            DataSet lsCitas = await dalCitasAdmision.ListaCitaByIdCita(idCita);

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);

            DateTime now = DateTime.Now;

            @ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            @ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();


            @ViewBag.NroHistoria = lsPacientes.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.ApellidoPaterno = lsPacientes.Tables[0].Rows[0]["ApellidoPaterno"].ToString().ToUpper();
            @ViewBag.ApellidoMaterno = lsPacientes.Tables[0].Rows[0]["ApellidoMaterno"].ToString().ToUpper();
            @ViewBag.Nombres = lsPacientes.Tables[0].Rows[0]["nombresPaciente"].ToString().ToUpper();

            @ViewBag.FechaNacimiento = lsPacientes.Tables[0].Rows[0]["fecNacimiento"];
            @ViewBag.Sexo = lsPacientes.Tables[0].Rows[0]["Sexo"];
            @ViewBag.TipoDocumento = lsPacientes.Tables[0].Rows[0]["TipoDocumento"];
            @ViewBag.NroDocumento = lsPacientes.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.GradoInstruccion = lsPacientes.Tables[0].Rows[0]["GradoInstruccion"];
            @ViewBag.EstadoCivilDes = lsPacientes.Tables[0].Rows[0]["EstadoCivilDes"];
            @ViewBag.Etnia = lsPacientes.Tables[0].Rows[0]["Etnia"];
            @ViewBag.Idioma = lsPacientes.Tables[0].Rows[0]["Idioma"];
            @ViewBag.Email = lsPacientes.Tables[0].Rows[0]["Email"];
            @ViewBag.Telefono = lsPacientes.Tables[0].Rows[0]["Telefono"];
            @ViewBag.GrupoSanguineo = lsPacientes.Tables[0].Rows[0]["GrupoSanguineo"];
            @ViewBag.Ocupacion = lsPacientes.Tables[0].Rows[0]["Ocupacion"];
            @ViewBag.Religion = lsPacientes.Tables[0].Rows[0]["Religion"];
            @ViewBag.Edad = lsCitas.Tables[0].Rows[0]["Edad"];
            @ViewBag.TipoEdad = lsCitas.Tables[0].Rows[0]["TipoEdad"];


            @ViewBag.PacienteNombres = lsPacientes.Tables[0].Rows[0]["nombres"].ToString().ToUpper();

            @ViewBag.FechaCita = lsCitas.Tables[0].Rows[0]["fecha"];
            @ViewBag.HoraCita = lsCitas.Tables[0].Rows[0]["horaInicio"];
            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["desServicio"];
            @ViewBag.EstadoCivilDes = lsPacientes.Tables[0].Rows[0]["EstadoCivilDes"];
            @ViewBag.Medico = lsCitas.Tables[0].Rows[0]["medico"];
            @ViewBag.Especialidad = lsCitas.Tables[0].Rows[0]["Especialidad"];

            @ViewBag.DireccionDomicilio = lsPacientes.Tables[0].Rows[0]["DireccionDomicilio"];
            @ViewBag.NombreDepartamentoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoDomicilio"];
            @ViewBag.NombreDistritoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreDistritoDomicilio"];
            @ViewBag.NombreProvinciaDomicilio = lsPacientes.Tables[0].Rows[0]["nombreProvinciaDomicilio"];
            @ViewBag.NombreCentroPobladoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoDomicilio"];
            @ViewBag.NombrePaisDomicilio = lsPacientes.Tables[0].Rows[0]["nombrePaisDomicilio"];


            @ViewBag.NombreDepartamentoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoProcedencia"];
            @ViewBag.NombreProvinciaProcedencia = lsPacientes.Tables[0].Rows[0]["nombreProvinciaProcedencia"];
            @ViewBag.NombreDistritoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreDistritoProcedencia"];
            @ViewBag.NombreCentroPobladoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoProcedencia"];
            @ViewBag.NombrePaisProcedencia = lsPacientes.Tables[0].Rows[0]["nombrePaisProcedencia"];

            @ViewBag.NombreDepartamentoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoNacimiento"];
            @ViewBag.NombreProvinciaNacimiento = lsPacientes.Tables[0].Rows[0]["nombreProvinciaNacimiento"];
            @ViewBag.NombreDistritoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreDistritoNacimiento"];
            @ViewBag.NombreCentroPobladoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoNacimiento"];
            @ViewBag.NombrePaisNacimiento = lsPacientes.Tables[0].Rows[0]["nombrePaisNacimiento"];

            @ViewBag.Acompaniante = lsPacientes.Tables[0].Rows[0]["Acompaniante"];
            @ViewBag.NombrePadre = lsPacientes.Tables[0].Rows[0]["NombrePadre"];
            @ViewBag.ApellidosMadre = lsPacientes.Tables[0].Rows[0]["apellidosMadre"];
            @ViewBag.NombresMadre = lsPacientes.Tables[0].Rows[0]["nombresMadre"];
            @ViewBag.MadreDocumento = lsPacientes.Tables[0].Rows[0]["madreDocumento"];

            @ViewBag.Observacion = lsPacientes.Tables[0].Rows[0]["Observacion"];

            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["idCuentaAtencion"];
            @ViewBag.OrdenPago = lsCitas.Tables[0].Rows[0]["idOrdenPago"];


            @ViewBag.UsuarioCrea = lsPacientes.Tables[0].Rows[0]["UsuarioCreaNombres"];
            //
            //@ViewBag.TurnoCita = lsCitas.Tables[0].Rows[0]["desTurno"];
            //
            //@ViewBag.TipoProfesionalSalud = lsCitas.Tables[0].Rows[0]["TipoProfesional"];
            //@ViewBag.ProfesionalSalud = lsCitas.Tables[0].Rows[0]["medico"];
            //
            //
            //
            //@ViewBag.TipoCita = lsCitas.Tables[0].Rows[0]["TipoCita"].ToString();
            //@ViewBag.FechaSolicitud = lsCitas.Tables[0].Rows[0]["FechaSolicitud"].ToString();
            //@ViewBag.HoraSolicitud = lsCitas.Tables[0].Rows[0]["HoraSolicitud"].ToString();
            @ViewBag.FechaImpresion = now;
            //@ViewBag.Usuario = HttpContext.Session.GetString("usuario");
            @ViewBag.Usuario = usuario;



            return PartialView("~/Views/Comun/Plantillas/FiliacionHistoriaClinica.cshtml");
        }

        public async Task<ActionResult> FormatoImpresionF30(int idPaciente, int idCita, string usuario)
        {
            //QRCodeGenerator qrGenerator = new QRCodeGenerator();

            //DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();
            DalPaciente dalPaciente = new DalPaciente();

            //DataSet lsParametros = new DataSet();


            DataSet lsPacientes = await dalPaciente.PacientesSeleccionarPorId(idPaciente);
            DataSet lsCitas = await dalCitasAdmision.ListaCitaByIdCita(idCita);

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            //var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            //var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            //var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);

            //DateTime now = DateTime.Now;

            //@ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            //@ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            //@ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();


            @ViewBag.NroHistoria = lsPacientes.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.ApellidoPaterno = lsPacientes.Tables[0].Rows[0]["ApellidoPaterno"].ToString().ToUpper();
            @ViewBag.ApellidoMaterno = lsPacientes.Tables[0].Rows[0]["ApellidoMaterno"].ToString().ToUpper();
            @ViewBag.Nombres = lsPacientes.Tables[0].Rows[0]["nombresPaciente"].ToString().ToUpper();

            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["desServicio"];

            //@ViewBag.FechaNacimiento = lsPacientes.Tables[0].Rows[0]["fecNacimiento"];
            //@ViewBag.Sexo = lsPacientes.Tables[0].Rows[0]["Sexo"];
            //@ViewBag.TipoDocumento = lsPacientes.Tables[0].Rows[0]["TipoDocumento"];
            //@ViewBag.NroDocumento = lsPacientes.Tables[0].Rows[0]["NroDocumento"];
            //@ViewBag.GradoInstruccion = lsPacientes.Tables[0].Rows[0]["GradoInstruccion"];
            //@ViewBag.EstadoCivilDes = lsPacientes.Tables[0].Rows[0]["EstadoCivilDes"];
            //@ViewBag.Etnia = lsPacientes.Tables[0].Rows[0]["Etnia"];
            //@ViewBag.Idioma = lsPacientes.Tables[0].Rows[0]["Idioma"];
            //@ViewBag.Email = lsPacientes.Tables[0].Rows[0]["Email"];
            //@ViewBag.Telefono = lsPacientes.Tables[0].Rows[0]["Telefono"];
            //@ViewBag.GrupoSanguineo = lsPacientes.Tables[0].Rows[0]["GrupoSanguineo"];
            //@ViewBag.Ocupacion = lsPacientes.Tables[0].Rows[0]["Ocupacion"];
            //@ViewBag.Religion = lsPacientes.Tables[0].Rows[0]["Religion"];
            //@ViewBag.Edad = lsCitas.Tables[0].Rows[0]["Edad"];
            //@ViewBag.TipoEdad = lsCitas.Tables[0].Rows[0]["TipoEdad"];


            //@ViewBag.PacienteNombres = lsPacientes.Tables[0].Rows[0]["nombres"].ToString().ToUpper();

            //@ViewBag.FechaCita = lsCitas.Tables[0].Rows[0]["fecha"];
            //@ViewBag.HoraCita = lsCitas.Tables[0].Rows[0]["horaInicio"];
            //
            //@ViewBag.EstadoCivilDes = lsPacientes.Tables[0].Rows[0]["EstadoCivilDes"];
            //@ViewBag.Medico = lsCitas.Tables[0].Rows[0]["medico"];
            //@ViewBag.Especialidad = lsCitas.Tables[0].Rows[0]["Especialidad"];

            //@ViewBag.DireccionDomicilio = lsPacientes.Tables[0].Rows[0]["DireccionDomicilio"];
            //@ViewBag.NombreDepartamentoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoDomicilio"];
            //@ViewBag.NombreDistritoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreDistritoDomicilio"];
            //@ViewBag.NombreProvinciaDomicilio = lsPacientes.Tables[0].Rows[0]["nombreProvinciaDomicilio"];
            //@ViewBag.NombreCentroPobladoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoDomicilio"];
            //@ViewBag.NombrePaisDomicilio = lsPacientes.Tables[0].Rows[0]["nombrePaisDomicilio"];


            //@ViewBag.NombreDepartamentoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoProcedencia"];
            //@ViewBag.NombreProvinciaProcedencia = lsPacientes.Tables[0].Rows[0]["nombreProvinciaProcedencia"];
            //@ViewBag.NombreDistritoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreDistritoProcedencia"];
            //@ViewBag.NombreCentroPobladoProcedencia = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoProcedencia"];
            //@ViewBag.NombrePaisProcedencia = lsPacientes.Tables[0].Rows[0]["nombrePaisProcedencia"];

            //@ViewBag.NombreDepartamentoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreDepartamentoNacimiento"];
            //@ViewBag.NombreProvinciaNacimiento = lsPacientes.Tables[0].Rows[0]["nombreProvinciaNacimiento"];
            //@ViewBag.NombreDistritoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreDistritoNacimiento"];
            //@ViewBag.NombreCentroPobladoNacimiento = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoNacimiento"];
            //@ViewBag.NombrePaisNacimiento = lsPacientes.Tables[0].Rows[0]["nombrePaisNacimiento"];

            //@ViewBag.Acompaniante = lsPacientes.Tables[0].Rows[0]["Acompaniante"];
            //@ViewBag.NombrePadre = lsPacientes.Tables[0].Rows[0]["NombrePadre"];
            //@ViewBag.ApellidosMadre = lsPacientes.Tables[0].Rows[0]["apellidosMadre"];
            //@ViewBag.NombresMadre = lsPacientes.Tables[0].Rows[0]["nombresMadre"];
            //@ViewBag.MadreDocumento = lsPacientes.Tables[0].Rows[0]["madreDocumento"];

            //@ViewBag.Observacion = lsPacientes.Tables[0].Rows[0]["Observacion"];

            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["idCuentaAtencion"];
            //@ViewBag.OrdenPago = lsCitas.Tables[0].Rows[0]["idOrdenPago"];

            ////
            ////@ViewBag.TurnoCita = lsCitas.Tables[0].Rows[0]["desTurno"];
            ////
            ////@ViewBag.TipoProfesionalSalud = lsCitas.Tables[0].Rows[0]["TipoProfesional"];
            ////@ViewBag.ProfesionalSalud = lsCitas.Tables[0].Rows[0]["medico"];
            ////
            ////
            ////
            ////@ViewBag.TipoCita = lsCitas.Tables[0].Rows[0]["TipoCita"].ToString();
            ////@ViewBag.FechaSolicitud = lsCitas.Tables[0].Rows[0]["FechaSolicitud"].ToString();
            ////@ViewBag.HoraSolicitud = lsCitas.Tables[0].Rows[0]["HoraSolicitud"].ToString();
            //@ViewBag.FechaImpresion = now;
            ////@ViewBag.Usuario = HttpContext.Session.GetString("usuario");
            //@ViewBag.Usuario = usuario;



            return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoF30.cshtml");
        }


        // Nuevos metodos

        
        [HttpPost]
        public async Task<ActionResult> ProgramacionMedicaPorIdMedicoMesAnio(int idMedico, int mes, int anio, int idServicio)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ProgramacionMedicaPorIdMedicoMesAnio(idMedico, mes, anio, idServicio);

            return Json(new { dataSet, estado = true, session = true });
        }

        /////////////////////////////////PROXIMA CITA///////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarFechasFuturasProgramacionMedica(int idEspecialidad, int idMedico, string fechaAtencion)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ListarFechasFuturasProgramacionMedica(idEspecialidad, idMedico, fechaAtencion);

            return Json(new { dataSet, estado = true, session = true });
        }
        [HttpPost]
        public async Task<ActionResult> ListarFechasFuturasProgramacionMedicaRefcon(int idEspecialidad, int idMedico, string fechaAtencion, string codigoServicioSuSalud)
        {

            DataSet dataSet;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalCitasAdmision.ListarFechasFuturasProgramacionMedicaRefcon(idEspecialidad, idMedico, fechaAtencion, codigoServicioSuSalud);

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ListarServiciosPorFechaEspecialidad(int idTipoServicio, int idEspecialidad, int activaProcedimiento, string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasAdmision dal = new DalCitasAdmision();

            ds = await dal.ListarServiciosPorFechaEspecialidad(idTipoServicio, idEspecialidad, activaProcedimiento, fecha);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarServiciosPorFechaEspecialidadMedico(int idTipoServicio, int idEspecialidad, int idMedico, int activaProcedimiento, string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasAdmision dal = new DalCitasAdmision();

            ds = await dal.ListarServiciosPorFechaEspecialidadMedico(idTipoServicio, idEspecialidad, idMedico, activaProcedimiento, fecha);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaCuposDisponibles(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasAdmision dal = new DalCitasAdmision();

            ds = await dal.ListarProgramacionMedicaCuposDisponibles(idProgramacion);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListarProgramacionMedicaCuposTotales(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasAdmision dal = new DalCitasAdmision();

            ds = await dal.ListarProgramacionMedicaCuposTotales(idProgramacion);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> GuardarProximaCita(int IdAtencionOrigen, int IdCita, int IdPaciente, int IdProgramacion, string HoraInicioAtencion, int IdTipoConsulta, int IdSiaSis, string SisCodigo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasAdmision dal = new DalCitasAdmision();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.GuardarProximaCita(IdAtencionOrigen, IdCita, IdPaciente, IdProgramacion, HoraInicioAtencion, IdTipoConsulta, IdSiaSis, SisCodigo, idUsuario);

            return Json(new { respuesta = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> BuscarOrdenParaCitaTerapia(int TipoFiltro, string NroSerie, string NroOrdenBoleta)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.BuscarOrdenParaCitaTerapia(TipoFiltro, NroSerie, NroOrdenBoleta);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarCitasTerapia(Citas objCitas, int IdPaciente, int IdCuenta, int nroOrden, int IdCitaRegistrada)
        {
            int resp = 0;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                resp = await dalCitasAdmision.CrearModificarCitasTerapia(objCitas, idUsuario, IdPaciente, IdCuenta, nroOrden, IdCitaRegistrada);
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasEliminarTerapia(int IdCita)
        {
            int resp = 0;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                resp = await dalCitasAdmision.CitasEliminarTerapia(IdCita);
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasTerapiasBloqueadasAgregar(string horaBloqueo, DateTime fechaBloqueo, int idMedico, string horaInicio, string horaFin, DateTime fecha) // JDELGADO001.2
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }


            //DataSet dataSet = null;
            int nRpta = 0;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalCitasAdmision.CitasTerapiasBloqueadasAgregar(horaBloqueo, fechaBloqueo, idMedico, horaInicio, horaFin, fecha, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasTerapiasBloqueadasEliminar(int IdCitaBloqueada) // JDELGADO001.2
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }


            //DataSet dataSet = null;
            int nRpta = 0;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalCitasAdmision.CitasTerapiasBloqueadasEliminar(IdCitaBloqueada, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha(int IdMedico, DateTime Fecha)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha(IdMedico, Fecha);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CitasSeleeccionarPacientePorIdProgramacion(int IdProgramacion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.CitasSeleeccionarPacientePorIdProgramacion(IdProgramacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpPost]
        public async Task<ActionResult> ListaCitaTerapiaByIdCita(int idCita)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalCitasAdmision.ListaCitaTerapiaByIdCita(idCita);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> ImprimeTicketCitaTerapia(int idCita, int nroCupo)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("user");

            try
            {
                pageHtml = Url.Action("TicketCitaTerapia", "Citas", new { idCita, nroCupo, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "Ticket";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

                    resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdf);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                return Json(new { exep = ex.ToString() });
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        public async Task<ActionResult> TicketCitaTerapia(int idCita, int nroCupo, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalCitasAdmision dalCitasAdmision = new DalCitasAdmision();

            DataSet lsParametros = new DataSet();
            DataSet lsCitas = await dalCitasAdmision.ListaCitaTerapiaByIdCita(idCita);

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);

            DateTime now = DateTime.Now;

            @ViewBag.NroCupo = nroCupo;
            @ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            @ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.FuenteFinanciamiento = lsCitas.Tables[0].Rows[0]["desFuenteFinanciamiento"];

            @ViewBag.FechaCita = lsCitas.Tables[0].Rows[0]["fecha"];
            @ViewBag.HoraCita = lsCitas.Tables[0].Rows[0]["horaInicio"];
            @ViewBag.TurnoCita = lsCitas.Tables[0].Rows[0]["desTurno"];
            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["desServicio"];
            @ViewBag.TipoProfesionalSalud = lsCitas.Tables[0].Rows[0]["TipoProfesional"];
            @ViewBag.ProfesionalSalud = lsCitas.Tables[0].Rows[0]["medico"];
            @ViewBag.NroHistoria = lsCitas.Tables[0].Rows[0]["nroHistoria"];
            @ViewBag.PacienteNombres = lsCitas.Tables[0].Rows[0]["pacienteNombre"];
            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["idCuentaAtencion"];
            @ViewBag.TipoCita = lsCitas.Tables[0].Rows[0]["TipoCita"].ToString();
            @ViewBag.FechaSolicitud = lsCitas.Tables[0].Rows[0]["FechaSolicitud"].ToString();
            @ViewBag.HoraSolicitud = lsCitas.Tables[0].Rows[0]["HoraSolicitud"].ToString();
            @ViewBag.EstablecimientoReferencia = lsCitas.Tables[0].Rows[0]["EstablecimientoReferencia"].ToString();
            @ViewBag.NroReferencia = lsCitas.Tables[0].Rows[0]["NroReferencia"].ToString();

            @ViewBag.OrdenPago = lsCitas.Tables[0].Rows[0]["idOrdenPago"].ToString();
            @ViewBag.IdEstadoFacturacion = lsCitas.Tables[0].Rows[0]["IdEstadoFacturacion"].ToString();
            @ViewBag.IdFuenteFinanciamiento = lsCitas.Tables[0].Rows[0]["IdFuenteFinanciamiento"].ToString();
            @ViewBag.Procedimiento = lsCitas.Tables[0].Rows[0]["Procedimiento"].ToString();

            @ViewBag.FechaImpresion = now;
            @ViewBag.Usuario = usuario;





            return PartialView("~/Views/ConsultaExterna/Plantillas/TicketCitaTerapia.cshtml");
        }
    }
}