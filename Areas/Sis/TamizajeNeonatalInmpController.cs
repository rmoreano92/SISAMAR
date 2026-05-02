using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using Microsoft.AspNetCore.Http;
using CapaEntidades;
using WebAppSaludOcupacional.CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Sis
{
    public class TamizajeNeonatalInmpController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult> ListarEstablecimientosTamizajeIpress()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarEstablecimientosTamizajeIpress();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> ListarCierresByAnioAndIdInstitucion(int Anio, int IdInstitucion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarCierresByAnioAndIdInstitucion(Anio, IdInstitucion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ListarMuestrasTamizajeNeonatalByIpress(
            DateTime FechaRegistro, int Anio, int IdEstablecimiento, int NroCierre, string NroDocumentoBusqueda, string NroApellidoPaternoBusqueda, string NroApellidoMaternoBusqueda, string NombresBusqueda, string NroDocumentoMadreBusqueda, int Tipo, string NroEnvio,
            string CodigoBarras, string NroCorrelativo, string ApellidoMaternoMadre, string ApellidoPaternoMadre, string NombresMadre, int EstablecimientoOrigen, int EstadoLab, int EstadoSis)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarMuestrasTamizajeNeonatalByIpress(FechaRegistro, Anio, IdEstablecimiento, NroCierre, NroDocumentoBusqueda, NroApellidoPaternoBusqueda, NroApellidoMaternoBusqueda, NombresBusqueda, NroDocumentoMadreBusqueda, Tipo, NroEnvio,
                    CodigoBarras, NroCorrelativo, ApellidoMaternoMadre, ApellidoPaternoMadre, NombresMadre, EstablecimientoOrigen, EstadoLab, EstadoSis);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ListarEmpleadosTomaMuestraByEstablecimiento(int IdEstablecimientoExterno)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarEmpleadosTomaMuestraByEstablecimiento(IdEstablecimientoExterno);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ListarEmpleadosDigitanMuestrasTamizaje()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarEmpleadosDigitanMuestrasTamizaje();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo(string idSiasis, string Codigo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo(idSiasis, Codigo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AgregarAfiliadosPorEstablecimientosExternos(SisFiliaciones sisFiliaciones, DatosRnTamizajeNeonatal datosRnTamizaje, int accion) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                if (sisFiliaciones.idSiasis != null && sisFiliaciones.idSiasis != 0)
                {
                    nRpta = await dalTamizajeNeonatalInmp.AgregarAfiliadosPorEstablecimientosExternos(sisFiliaciones, int.Parse(HttpContext.Session.GetString("idusu")));
                }

                var rnTamizajenRpta = await dalTamizajeNeonatalInmp.AgregarDatosRnTamizajeNeonatal(datosRnTamizaje);

                return Json(new { session = true, estado = true, msg = "", data = rnTamizajenRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> AgregarMuestrasTamizajeNeonatalPorEstablecimientosExternos(MuestrasTamizajeNeonatalPorEstablecimientosExternos muestrasTamizaje, int IdRnTamizaje) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                nRpta = await dalTamizajeNeonatalInmp.AgregarMuestrasTamizajeNeonatalPorEstablecimientosExternos(muestrasTamizaje, IdRnTamizaje);
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ActualizarEstadoMuestraParaSIS(int IdRegistroTamizaje, int EstadoSIS, int IdAtencion, int IdPaciente, 
            String nroEnvioSis, String nroReferenciaOrigenSIS, String nroReferenciaDestinoSIS, String ObservacionSegundaMuestraTamizaje, String ObservacionSis,
            DateTime? FechaRecepcionSIS, string HoraRecepcionSIS, int IdResponsableMuestraMGP, int IdResponsableRecepcionaSISMGP, int IdEstablecimientoOrigen) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                nRpta = await dalTamizajeNeonatalInmp.ActualizarEstadoMuestraParaSIS(IdRegistroTamizaje, EstadoSIS, IdAtencion, IdPaciente, nroEnvioSis, nroReferenciaOrigenSIS, nroReferenciaDestinoSIS, ObservacionSegundaMuestraTamizaje, ObservacionSis,
                     FechaRecepcionSIS, HoraRecepcionSIS, IdResponsableMuestraMGP, IdResponsableRecepcionaSISMGP, IdEstablecimientoOrigen);
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }


        [HttpPost]
        public async Task<ActionResult> ActualizarEstadoMuestraParaSISMGP(int IdRegistroTamizaje, int EstadoSIS, int IdAtencion, int IdPaciente, 
            String nroEnvioSis, String nroReferenciaOrigenSIS, String nroReferenciaDestinoSIS, String ObservacionSegundaMuestraTamizaje, String ObservacionSis,
            DateTime? FechaRecepcionSIS, string HoraRecepcionSIS, int IdResponsableMuestraMGP, int IdResponsableRecepcionaSISMGP, int IdEstablecimientoOrigen) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                nRpta = await dalTamizajeNeonatalInmp.ActualizarEstadoMuestraParaSISMGP(IdRegistroTamizaje, EstadoSIS, IdAtencion, IdPaciente, nroEnvioSis, nroReferenciaOrigenSIS, nroReferenciaDestinoSIS, ObservacionSegundaMuestraTamizaje, ObservacionSis,
                    FechaRecepcionSIS, HoraRecepcionSIS, IdResponsableMuestraMGP, IdResponsableRecepcionaSISMGP, IdEstablecimientoOrigen);
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarPacienteConHistoria(string ApellidoPaterno, string ApellidoMaterno, string Nombres, int IdDocIdentidad, string NroDocumento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.SeleccionarPacienteConHistoria(ApellidoPaterno, ApellidoMaterno, Nombres, IdDocIdentidad, NroDocumento);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }


        /////////////////////////////////KHOYOSI///////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ExamenLaboratorioTamizajeSeleccionar(int idCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ExamenLaboratorioTamizajeSeleccionar(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", respuesta = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, respuesta = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CorrelativoLaboratorioTamizajeSeleccionar(int correlativoLab)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalTamizajeNeonatalInmp.CorrelativoLaboratorioTamizajeSeleccionar(correlativoLab);
                return Json(new { session = true, estado = true, msg = "", respuesta = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, respuesta = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> AprobacionTamizajeLaboratorio(int idAtencion, int idMovimiento, int correlativoLab, int estadoAprobacion, int idRegistroTamizaje)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            bool resp = false;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            try
            {
                resp = await dalTamizajeNeonatalInmp.AprobacionTamizajeLaboratorio(idAtencion, idMovimiento, correlativoLab, estadoAprobacion, idUsuario, idRegistroTamizaje);
                return Json(new { session = true, estado = true, msg = "", respuesta = resp });
            }
            catch (Exception e)
            {
                resp = false;
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, respuesta = resp });
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////////////
        /// <summary>
        /// 
        /// [HttpPost]
        public async Task<ActionResult> AprobacionTamizajeLaboratorioMGP(int idAtencion, int idMovimiento, int correlativoLab, int estadoAprobacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            bool resp = false;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            try
            {
                resp = await dalTamizajeNeonatalInmp.AprobacionTamizajeLaboratorioMGP(idAtencion, idMovimiento, correlativoLab, estadoAprobacion, idUsuario);
                return Json(new { session = true, estado = true, msg = "", respuesta = resp });
            }
            catch (Exception e)
            {
                resp = false;
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, respuesta = resp });
            }
        }
        /// </summary>
        /// <param name="sisFiliaciones"></param>
        /// <param name="datosRnTamizaje"></param>
        /// <param name="accion"></param>
        /// <returns></returns>


        [HttpPost]
        public async Task<ActionResult> AgregarDatosRnTamizajeNeonatalMGP(SisFiliaciones sisFiliaciones, DatosRnTamizajeNeonatal datosRnTamizaje, int accion) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                
                var rnTamizajenRpta = await dalTamizajeNeonatalInmp.AgregarDatosRnTamizajeNeonatalMGP(datosRnTamizaje);

                return Json(new { session = true, estado = true, msg = "", data = rnTamizajenRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> AgregarMuestrasTamizajeNeonatalPorEstablecimientosMGP(MuestrasTamizajeNeonatalPorEstablecimientosExternos muestrasTamizaje, int IdPaciente, int IdAtencion, int IdRnTamizaje, int Estado, int RegistroIpress, string ObservacionLaboratorio,DateTime FechaRecepcion, string HoraRecepcion) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int nRpta = 0;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                nRpta = await dalTamizajeNeonatalInmp.AgregarMuestrasTamizajeNeonatalPorEstablecimientosMGP(muestrasTamizaje, IdPaciente, IdAtencion, IdRnTamizaje, Estado, RegistroIpress, ObservacionLaboratorio, FechaRecepcion, HoraRecepcion);
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        //[HttpPost]
        //public async Task<ActionResult> ActualizarEstadoMuestraParaSIS(int IdRegistroTamizaje, int EstadoSIS, int IdAtencion, int IdPaciente) // JDELGADO003-C
        //{
        //    //DataSet dataSet = null;
        //    int nRpta = 0;
        //    DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    string actionName = ControllerContext.RouteData.Values["action"].ToString();
        //    string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

        //    try
        //    {
        //        nRpta = await dalTamizajeNeonatalInmp.ActualizarEstadoMuestraParaSIS(IdRegistroTamizaje, EstadoSIS, IdAtencion, IdPaciente);
        //        return Json(new { session = true, estado = true, msg = "", data = nRpta });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
        //    }
        //}

        public async Task<ActionResult> ListarMuestrasTamizajeByNroDocumentoMadre(string NroDocumentoMadre)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarMuestrasTamizajeByNroDocumentoMadre(NroDocumentoMadre);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> BuscarEstablecimientoByCodigoNombre(string Filtro)
        {
            DataSet dataSet;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await dalTamizajeNeonatalInmp.BuscarEstablecimientoByCodigoNombre(Filtro);

            return Json(new { lstData = dataSet, session = true });
        }

        public async Task<ActionResult> SeleccionarEstadosMuestra()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.SeleccionarEstadosMuestra();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ListarMotivosRechazoTamizaje()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ListarMotivosRechazoTamizaje();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }


        [HttpPost]
        public async Task<ActionResult> AnularFUATamizajeNeonatal(int IdCuentaAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.AnularFUATamizajeNeonatal(IdCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> RolesPermisosXidEmpleadoXidPermiso(int IdUsuario, int IdPermiso)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.RolesPermisosXidEmpleadoXidPermiso(IdUsuario, IdPermiso);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarRegistroTamizajeNeonatal(
            Paciente paciente, Atencion atencion, SisFiliaciones sisFiliaciones, DatosRnTamizajeNeonatal datosRnTamizajeNeonatal,
            MuestrasTamizajeNeonatalPorEstablecimientosExternos muestrasTamizaje, LaboratorioMovimiento laboratorio,
            int registroIpress, int TipoRegistro, int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalTamizajeNeonatalInmp dal = new DalTamizajeNeonatalInmp();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjInsumos = JsonConvert.DeserializeObject<List<InsumoCPT>>(laboratorio.InsumosCPT);
                var lstobjProductos = JsonConvert.DeserializeObject<List<ProductoCPT>>(laboratorio.ProductosCPT);

                dataSet = await dal.CrearModificarRegistroTamizajeNeonatal(
                    paciente, atencion, sisFiliaciones, datosRnTamizajeNeonatal, muestrasTamizaje, laboratorio, lstobjInsumos, lstobjProductos,
                    registroIpress, TipoRegistro, idUsuario, idListBar);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> ResultadosLaboratorioTamizajeNeonatal(int IdCuentaAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalTamizajeNeonatalInmp dalTamizajeNeonatalInmp = new DalTamizajeNeonatalInmp();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalTamizajeNeonatalInmp.ResultadosLaboratorioTamizajeNeonatal(IdCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

    }
}
