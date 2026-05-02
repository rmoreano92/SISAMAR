using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using WebAppMaternidad.CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using QRCoder;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using NPOI.SS.Formula.Eval;
using Aspose.Cells;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class EvaluacionesUCIController : BaseController
    {

        [HttpPost]
        public async Task<ActionResult> CrearModificarAtencionesEvaluacionUCI(
            int IdAtencionUCI, int IdAtencion, int TipoProcedencia, int EstablecimientoProcedenciaReferido, int EstablecimientoProcedenciaInstitucional,
            int TipoIngresoUCI, DateTime FechaIngresoMGP, string HoraIngresoMGP, int IdCamaUCI, DateTime FechaIngresoUCI, string HoraIngresoUCI, AntecedentesFamiliaresUCI antecedentesFamiliaresUCI,
            AntecedentesPersonalesUCI antecedentesPersonalesUCI, AntecedentesObstetricosUCI antecedentesObstetricosUCI, MotivoAtencionUCI motivoAtencionUCI, ExamenFisicoEvaluacionUCI examenFisicoEvaluacionUCI, 
            IntervencionesEvaluacionUCI intervencionesEvaluacionUCI, MonitoreoSoporteVentilatorioUCI monitoreoSoporteVentilatorioUCI, ExamenesAuxiliaresUCI examenesAuxiliaresUCI, string lstOtrasPatologias,
            string lstSedantes, string lstAnalgesicos, string lstBloqueanteNeuromuscular, string lstVasodilatador, string lstVasoconstrictor, string lstHemoderivados, string lstCorticoides, string lstFluidoterapia,
            string lstAccesosVasculares, string lstDiagnosticos, int IdServicio, int IdAtencionDetalleUCI, int NroEvaluacion, DateTime FechaEvaluacion, string HoraEvaluacion, string ComentarioApreciacionEvaluacion,
            string PlanEvaluacion, int MedicoComentarioEvaluacion, int DestinoComentarioEvaluacion, string ImpresionDiagnostica, string Tratamiento, int idCuenta, string FechaAltaPlanApreciacion, string MotivoEvaluacionUCI, string Sofa,
            string ExamenImagenologico, string ExamenLaboratorial, string DescripcionExamenImagenologico, string DescripcionExamenLaboratorial) // JDELGADO003-C
        {
            int nRpta = 0;
            var nRptaIdAtencionDetalleUCI = 0;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();
            DalUtilitario daoUtil = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjOtrasPatologias = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstOtrasPatologias);

                var lstobjSedantes = JsonConvert.DeserializeObject<List<MedicamentosExamenFisicoUCI>>(lstSedantes);
                var lstobjAnalgesicos = JsonConvert.DeserializeObject<List<MedicamentosExamenFisicoUCI>>(lstAnalgesicos);
                var lstobjBloqueanteNeuromuscular = JsonConvert.DeserializeObject<List<MedicamentosExamenFisicoUCI>>(lstBloqueanteNeuromuscular);
                var lstobjVasodilatador = JsonConvert.DeserializeObject<List<MedicamentosExamenFisicoUCI>>(lstVasodilatador);
                var lstobjVasoconstrictor = JsonConvert.DeserializeObject<List<MedicamentosExamenFisicoUCI>>(lstVasoconstrictor);

                var lstobjHemoderivados = JsonConvert.DeserializeObject<List<IntervencionesItemsUCI>>(lstHemoderivados);
                var lstobjCorticoides = JsonConvert.DeserializeObject<List<IntervencionesItemsUCI>>(lstCorticoides);
                var lstobjFluidoterapia = JsonConvert.DeserializeObject<List<IntervencionesItemsUCI>>(lstFluidoterapia);

                var lstobjAccesosVasculares = JsonConvert.DeserializeObject<List<MedicamentosExamenFisicoUCI>>(lstAccesosVasculares);

                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                if (NroEvaluacion == 1 || NroEvaluacion == 0)
                {
                    nRpta = await dalEvaluacionesUCI.CrearModificarAtencionesEvaluacionUCI(
                                       IdAtencionUCI, IdAtencion, TipoProcedencia, EstablecimientoProcedenciaReferido, EstablecimientoProcedenciaInstitucional,
                                       TipoIngresoUCI, FechaIngresoMGP, HoraIngresoMGP, FechaIngresoUCI, HoraIngresoUCI, IdCamaUCI, lstobjOtrasPatologias
                                   );

                    if (nRpta != 0)
                    {
                        await dalEvaluacionesUCI.CrearModificarAntecedentesFamiliaresUCI(nRpta, antecedentesFamiliaresUCI);
                        await dalEvaluacionesUCI.CrearModificarAntecedentesPersonalesUCI(nRpta, antecedentesPersonalesUCI);
                        await dalEvaluacionesUCI.CrearModificarAntecedentesObstetricosUCI(nRpta, antecedentesObstetricosUCI);
                        await dalEvaluacionesUCI.CrearModificarMotivoAtencionUCI(nRpta, motivoAtencionUCI);
                    }
                }

                
                if (NroEvaluacion > 0)
                {
                    if (IdAtencionUCI == 0)
                    {
                        nRptaIdAtencionDetalleUCI = await dalEvaluacionesUCI.CrearModificarAtencionesEvaluacionDetalleUCI(nRpta, IdAtencionDetalleUCI, IdAtencion, NroEvaluacion, idUsuario, FechaEvaluacion, HoraEvaluacion,
                            ComentarioApreciacionEvaluacion, PlanEvaluacion, MedicoComentarioEvaluacion, DestinoComentarioEvaluacion, ImpresionDiagnostica, Tratamiento, motivoAtencionUCI, FechaAltaPlanApreciacion, MotivoEvaluacionUCI,
                            Sofa, ExamenImagenologico, ExamenLaboratorial, DescripcionExamenImagenologico, DescripcionExamenLaboratorial);
                    }
                    else
                    {
                        nRptaIdAtencionDetalleUCI = await dalEvaluacionesUCI.CrearModificarAtencionesEvaluacionDetalleUCI(IdAtencionUCI, IdAtencionDetalleUCI, IdAtencion, NroEvaluacion, idUsuario, FechaEvaluacion, HoraEvaluacion,
                            ComentarioApreciacionEvaluacion, PlanEvaluacion, MedicoComentarioEvaluacion, DestinoComentarioEvaluacion, ImpresionDiagnostica, Tratamiento, motivoAtencionUCI, FechaAltaPlanApreciacion, MotivoEvaluacionUCI,
                            Sofa, ExamenImagenologico, ExamenLaboratorial, DescripcionExamenImagenologico, DescripcionExamenLaboratorial);
                    }

                    if(IdAtencionUCI > 0)
                    {
                        nRpta = IdAtencionUCI;
                    }



                    await dalEvaluacionesUCI.CrearModificarExamenFisicoEvaluacionUCI(nRptaIdAtencionDetalleUCI, examenFisicoEvaluacionUCI);
                    await dalEvaluacionesUCI.CrearModificarIntervencionesEvaluacionUCI(nRptaIdAtencionDetalleUCI, intervencionesEvaluacionUCI, lstobjHemoderivados, lstobjCorticoides, lstobjFluidoterapia);
                    await dalEvaluacionesUCI.CrearModificarExamenesAuxiliaresUCI(nRptaIdAtencionDetalleUCI, examenesAuxiliaresUCI);
                    await dalEvaluacionesUCI.CrearModificarMonitoreoSoporteVentilatorioUCIManiobras(nRptaIdAtencionDetalleUCI, NroEvaluacion, monitoreoSoporteVentilatorioUCI);

                    await dalEvaluacionesUCI.CrearModificarMedicamentosExamenFisicoUCI(nRptaIdAtencionDetalleUCI, NroEvaluacion, lstobjSedantes, lstobjAnalgesicos, lstobjBloqueanteNeuromuscular, 
                        lstobjVasodilatador, lstobjVasoconstrictor, lstobjAccesosVasculares);
                    await daoUtil.insertaDiagnosticosPorEvaluacion((int)IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, idUsuario, lstobjDiagnosticos, (int)IdServicio, (int)NroEvaluacion);

                    await GenerarInformeAltaUCI(idCuenta, IdAtencion);
                }
                // Agregar detalle de evaluacion con Nro de Evaluacion
                

                return Json(new { session = true, estado = true, msg = "", data = Json(new { IdAtencionUCI = nRpta, IdAtencionDetalleUCI = nRptaIdAtencionDetalleUCI }) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = Json(new { IdAtencionUCI = nRpta, IdAtencionDetalleUCI = nRptaIdAtencionDetalleUCI }) });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarMonitoreoHemodinamicoUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdEquipo, string NombreEquipo, int IdTipoMonitoreo, string TipoMonitoreo, int Cantidad, double Precio, double Total
            )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.CrearModificarMonitoreoHemodinamicoUCI(IdAtencionDetalleUCI, NroEvaluacion, IdEquipo, NombreEquipo, IdTipoMonitoreo, TipoMonitoreo, Cantidad, Precio, Total);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarParametrosMonitoreoHemodinamicoUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, String LstParametros)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstObjParametros = JsonConvert.DeserializeObject<List<ParametrosMonitoreo>>(LstParametros);
                dataSet = await dalEvaluacionesUCI.CrearModificarParametrosMonitoreoHemodinamicoUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, lstObjParametros);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarMonitoreoNeurologicoUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, string NombreEquipo, int IdTipoMonitoreo, string TipoMonitoreo, int Cantidad, double Precio, double Total
            )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.CrearModificarMonitoreoNeurologicoUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, NombreEquipo, IdTipoMonitoreo, TipoMonitoreo, Cantidad, Precio, Total);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarParametrosMonitoreoNeurologicoUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, String LstParametros)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstObjParametros = JsonConvert.DeserializeObject<List<ParametrosMonitoreo>>(LstParametros);
                dataSet = await dalEvaluacionesUCI.CrearModificarParametrosMonitoreoNeurologicoUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, lstObjParametros);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarMonitoreoUltrasonografiaUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, string Descripcion, int Cantidad, double Precio, double Total, string DescripcionHallazgos
            )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.CrearModificarMonitoreoUltrasonografiaUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, Descripcion, Cantidad, Precio, Total, DescripcionHallazgos);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarParametrosMonitoreoUltrasonografiaUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, String LstParametros)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstObjParametros = JsonConvert.DeserializeObject<List<ParametrosMonitoreo>>(LstParametros);
                dataSet = await dalEvaluacionesUCI.CrearModificarParametrosMonitoreoUltrasonografiaUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, lstObjParametros);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarMonitoreoSoporteVentilatorioUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, string Descripcion, int Cantidad, double Precio, double Total, MonitoreoSoporteVentilatorioUCI monitoreoSoporteVentilatorioUCI
            )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.CrearModificarMonitoreoSoporteVentilatorioUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, Descripcion, Cantidad, Precio, Total, monitoreoSoporteVentilatorioUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarParametrosSoporteVentilatorioUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, String LstParametros)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstObjParametros = JsonConvert.DeserializeObject<List<ParametrosMonitoreo>>(LstParametros);
                dataSet = await dalEvaluacionesUCI.CrearModificarParametrosSoporteVentilatorioUCI(idMonitoreo, idAtencionDetalleUCI, nroEvaluacion, IdItem, lstObjParametros);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpPost]
        public async Task<ActionResult> EliminarParametrosMonitoreo(int IdAtencionDetalleUCI, int IdMonitoreo, int NroEvaluacion, int TipoMonitoreo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.EliminarParametrosMonitoreo(IdAtencionDetalleUCI, IdMonitoreo, NroEvaluacion, TipoMonitoreo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }


        [HttpPost]
        public async Task<ActionResult> ListaAtencionesUCI(string IdCuentaAtencion, string NroHistoria, string ApellidoPaterno, string ApellidoMaterno, string Nombres, string FechaIngreso, string IdServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.ListaAtencionesUCI(IdCuentaAtencion, NroHistoria, ApellidoPaterno, ApellidoMaterno, Nombres, FechaIngreso, IdServicio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(int IdAtencionUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(IdAtencionUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarExamenFisicoEvaluacionUCI(int IdAtencionDetalleUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarExamenFisicoEvaluacionUCI(IdAtencionDetalleUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarIntervencionesEvaluacionUCI(int IdAtencionDetalleUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarIntervencionesEvaluacionUCI(IdAtencionDetalleUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarExamenesAuxiliaresUCI(int IdAtencionDetalleUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarExamenesAuxiliaresUCI(IdAtencionDetalleUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMonitoreoHemodinamicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMonitoreoHemodinamicoUCI(IdAtencionDetalleUCI, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarParametrosMonitoreoHemodinamicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarParametrosMonitoreoHemodinamicoUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle(IdAtencionDetalleUCI, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarParametrosMonitoreoUltrasonografiaUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarParametrosMonitoreoUltrasonografiaUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMonitoreoNeurologicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMonitoreoNeurologicoUCI(IdAtencionDetalleUCI, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarParametrosMonitoreoNeurologicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarParametrosMonitoreoNeurologicoUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMonitoreoSoporteVentilatorioUCIManiobras(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMonitoreoSoporteVentilatorioUCIManiobras(IdAtencionDetalleUCI, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMonitoreoSoporteVentilatorioUCI(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMonitoreoSoporteVentilatorioUCI(IdAtencionDetalleUCI, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarParametroSoporteVentilatorioUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarParametroSoporteVentilatorioUCI(IdAtencionDetalleUCI, NroEvaluacion, IdItem, IdMonitoreo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarComentarioApreciacionUCI(int idCuenta, int IdComentarioApreciacion, int IdAtencionUCI, int OrganoAfectado, int Medico, int Destino, string ComentarioApreciacion, string Plan, DateTime? Fecha, string Hora)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.CrearModificarComentarioApreciacionUCI(IdComentarioApreciacion, IdAtencionUCI, OrganoAfectado, Medico, Destino, ComentarioApreciacion, Plan, Fecha, Hora);

                await GenerarHojaNotaAdicionalUCI(idCuenta, IdAtencionUCI, Int32.Parse( dataSet.Tables[0].Rows[0]["IdComentarioApreciacion"].ToString()));
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarComentarioApreciacionUCIByIdAtencionUCI(int IdAtencionUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarComentarioApreciacionUCIByIdAtencionUCI(IdAtencionUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMedicamentosSedanesUCI(int idAtencionDetalleUCI, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMedicamentosSedanesUCI(idAtencionDetalleUCI, nroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMedicamentosAnalgesicosUCI(int idAtencionDetalleUCI, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMedicamentosAnalgesicosUCI(idAtencionDetalleUCI, nroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMedicamentosBloqueanteNeuromuscularUCI(int idAtencionDetalleUCI, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMedicamentosBloqueanteNeuromuscularUCI(idAtencionDetalleUCI, nroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMedicamentosVasodilatadorUCI(int idAtencionDetalleUCI, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMedicamentosVasodilatadorUCI(idAtencionDetalleUCI, nroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMedicamentosVasoconstrictorUCI(int idAtencionDetalleUCI, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarMedicamentosVasoconstrictorUCI(idAtencionDetalleUCI, nroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarAccesosVascularesUCI(int idAtencionDetalleUCI, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarAccesosVascularesUCI(idAtencionDetalleUCI, nroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> SeleccionarIntervencionesHemoderivadosUCI(int idAtencionDetalleUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarIntervencionesHemoderivadosUCI(idAtencionDetalleUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        public async Task<ActionResult> SeleccionarIntervencionesCorticoidesUCI(int idAtencionDetalleUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarIntervencionesCorticoidesUCI(idAtencionDetalleUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> SeleccionarIntervencionesFluidoterapiaUCI(int idAtencionDetalleUCI)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarIntervencionesFluidoterapiaUCI(idAtencionDetalleUCI);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> SeleccionarOtraPatologiasObstetricasUCI(int IdAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalEvaluacionesUCI.SeleccionarOtraPatologiasObstetricasUCI(IdAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpGet]
        public async Task<ActionResult> ListarExamenesImagenologicosYPruebasEspeciales()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalEvaluacionesUCI dal = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ListarExamenesImagenologicosYPruebasEspeciales();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> ListarExamenesLaboratorialesEspeciales()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalEvaluacionesUCI dal = new DalEvaluacionesUCI();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dal.ListarExamenesLaboratorialesEspeciales();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<Boolean> GenerarHojaInformeUCI(int idCuenta, int idAtencion, int idEvaluacionDetalle, int idServicio, int eval)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("InformeEvaluacion", "EvaluacionesUCI", new { area = "Emergencia", idAtencion, idCuenta, idServicio, eval, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idEvaluacionDetalle, 0, "UCI-EVA", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeEvaluacion(int idAtencion, int idCuenta, int idServicio, int eval, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosEvaluacion;
            DataSet OtrasPatologias, Sedantes, Analgesicos, BloqueanteNeuromuscular, Vasodilatador, Vasoconstrictor, Hemoderivados, Corticoides, Fluidoterapia, AccesosVasculares;
            DataSet Diagnosticos, RecetasDestalle = null;

            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();

            string antecedentesFamiliares = "", vacunas = "", habitosNocivos = "", alergias = "", patologicos = "", patNeurologica = "", parReumatica = "";

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosEvaluacion = await dalEvaluacionesUCI.SeleccionarAtencionesUCIByIdAtencionServicioNroEvaluacion(idAtencion, idServicio, eval);
            OtrasPatologias = await dalEvaluacionesUCI.SeleccionarOtraPatologiasObstetricasUCI(idAtencion);

            Sedantes = await dalEvaluacionesUCI.SeleccionarMedicamentosSedanesUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()), eval);
            Analgesicos = await dalEvaluacionesUCI.SeleccionarMedicamentosAnalgesicosUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()), eval);
            BloqueanteNeuromuscular = await dalEvaluacionesUCI.SeleccionarMedicamentosBloqueanteNeuromuscularUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()), eval);

            Vasodilatador = await dalEvaluacionesUCI.SeleccionarMedicamentosVasodilatadorUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()), eval);
            Vasoconstrictor = await dalEvaluacionesUCI.SeleccionarMedicamentosVasoconstrictorUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()), eval);

            Hemoderivados = await dalEvaluacionesUCI.SeleccionarIntervencionesHemoderivadosUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()));
            Corticoides = await dalEvaluacionesUCI.SeleccionarIntervencionesCorticoidesUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()));
            Fluidoterapia = await dalEvaluacionesUCI.SeleccionarIntervencionesFluidoterapiaUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()));

            AccesosVasculares = await dalEvaluacionesUCI.SeleccionarAccesosVascularesUCI(Int32.Parse(DatosEvaluacion.Tables[0].Rows[0]["IdAtencionDetalleUCI"].ToString()), eval);

            RecetasDestalle = await daoRecetas.ReceDetalleByNroEvaluacion(idCuenta, (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia, eval);
            


            DataTable dtOtrasPatologias = OtrasPatologias.Tables[0];
            DataTable dtSedantes = Sedantes.Tables[0];
            DataTable dtAnalgesicos = Analgesicos.Tables[0];
            DataTable dtBloqueanteNeuromuscular = BloqueanteNeuromuscular.Tables[0];
           
            DataTable dtVasodilatador = Vasodilatador.Tables[0];
            DataTable dtVasoconstrictor = Vasoconstrictor.Tables[0];

            DataTable dtHemoderivados = Hemoderivados.Tables[0];
            DataTable dtCorticoides = Corticoides.Tables[0];
            DataTable dtFluidoterapia = Fluidoterapia.Tables[0];

            DataTable dtAccesosVasculares = AccesosVasculares.Tables[0];
            //await dalEvaluacionesUCI.Selec(idAtencion, idServicio, eval);
            
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, idServicio, eval);
            DataTable dtDx = Diagnosticos.Tables[0];

            @ViewBag.NroEvaluacion = eval;

            @ViewBag.FechaIngresoMGP = DatosEvaluacion.Tables[0].Rows[0]["FechaIngresoMGP"];
            @ViewBag.EstablecimientoReferencia = DatosEvaluacion.Tables[0].Rows[0]["EstablecimientoReferencia"];
            @ViewBag.ServicioOrigen = DatosEvaluacion.Tables[0].Rows[0]["ServicioOrigen"];
            @ViewBag.FechaIngresoUCI = DatosEvaluacion.Tables[0].Rows[0]["FechaIngresoUCI"];
            @ViewBag.HoraIngresoUCI = DatosEvaluacion.Tables[0].Rows[0]["HoraIngresoUCI"];
            @ViewBag.TipoIngresoUCI = DatosEvaluacion.Tables[0].Rows[0]["TipoIngresoUCI"];
            @ViewBag.CamaIngreso = DatosEvaluacion.Tables[0].Rows[0]["CamaIngreso"];

            if(DatosEvaluacion.Tables[0].Rows[0]["DiabetesAntFam"].ToString() == "1")    
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Diabetes ({DatosEvaluacion.Tables[0].Rows[0]["DiabetesPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["DiabetesDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["TBCAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>TBC ({DatosEvaluacion.Tables[0].Rows[0]["TBCPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["TBCDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["HipertensionAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Hipertensión (HTA) ({DatosEvaluacion.Tables[0].Rows[0]["HipertensionPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["HipertensionDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["NeoCancerAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Neoplásico/Cáncer ({DatosEvaluacion.Tables[0].Rows[0]["NeoCancerPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["NeoCancerDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["EnfTiroideaAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Enf. Tiroidea ({DatosEvaluacion.Tables[0].Rows[0]["EnfTiroideaPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["EnfTiroideaDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["EnfReumaticaAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Enf. Reumática ({DatosEvaluacion.Tables[0].Rows[0]["EnfReumaticaPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["EnfReumaticaDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["AsmaAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Asma ({DatosEvaluacion.Tables[0].Rows[0]["AsmaPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["AsmaDescripcionAntFam"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["OtrosAntFam"].ToString() == "1")
            {
                antecedentesFamiliares = antecedentesFamiliares + $"<b>Otros ({DatosEvaluacion.Tables[0].Rows[0]["OtrosPatMatAntFam"]}): </b> {DatosEvaluacion.Tables[0].Rows[0]["OtrosDescripcionAntFam"]} ";
            }

            @ViewBag.AntecedentesFamiliares = antecedentesFamiliares;

            @ViewBag.GrupoSanguineo = DatosEvaluacion.Tables[0].Rows[0]["GrupoSanguineo"];
            @ViewBag.Factor = DatosEvaluacion.Tables[0].Rows[0]["Factor"];
            @ViewBag.ActividadFisica = DatosEvaluacion.Tables[0].Rows[0]["ActividadFisica"];
            @ViewBag.NroComidasPorDia = DatosEvaluacion.Tables[0].Rows[0]["NroComidasPorDia"];
            @ViewBag.TipoAlimentacion = DatosEvaluacion.Tables[0].Rows[0]["TipoAlimentacion"];
            @ViewBag.IncrementoPeso = DatosEvaluacion.Tables[0].Rows[0]["IncrementoPeso"];

            @ViewBag.EstudioPorImagenes = DatosEvaluacion.Tables[0].Rows[0]["EstudioPorImagenes"];
            @ViewBag.Hallazgos = DatosEvaluacion.Tables[0].Rows[0]["Hallazgos"];

            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaInfluenza"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (Influenza) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaInfluenzaDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaDTAdulta"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (DT Adulto) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaDTAdultaDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaTexoideTetanico"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (Toxoide Tetánico) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaTexoideTetanicoDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaFiebreAmarilla"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (Fiebre amarilla) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaFiebreAmarillaDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaHepatitisB"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (Hepatitis B) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaHepatitisBDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaBCG"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (BCG) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaBCGDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaPapilomavirus"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (Papilomavirus) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaPapilomavirusDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["VacunaOtra"].ToString() == "1")
            {
                vacunas = vacunas + $"<b>&#187; (Otra) </b> {DatosEvaluacion.Tables[0].Rows[0]["VacunaOtraDescripcion"]}, ";
            }

            if(vacunas == "")
            {
                vacunas = vacunas + "Niega";
            }

            @ViewBag.Vacunas = vacunas;

            @ViewBag.VacunaCovidNroDosis = DatosEvaluacion.Tables[0].Rows[0]["VacunaCovidNroDosis"];
            @ViewBag.FechaUltimaVacunaCovid = DatosEvaluacion.Tables[0].Rows[0]["FechaUltimaVacunaCovid"];

            if (DatosEvaluacion.Tables[0].Rows[0]["HbBebidasAlcoholicas"].ToString() == "1")
            {
                habitosNocivos = habitosNocivos + $"<b>&#187; (Bebidas alcohólicas) </b> {DatosEvaluacion.Tables[0].Rows[0]["HbBebidasAlcoholicasDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["HbDrogas"].ToString() == "1")
            {
                habitosNocivos = habitosNocivos + $"<b>&#187; (Drogas) </b> {DatosEvaluacion.Tables[0].Rows[0]["HbDrogasDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["HbTabacoCigarros"].ToString() == "1")
            {
                habitosNocivos = habitosNocivos + $"<b>&#187; (Tabaco / cigarros) </b> {DatosEvaluacion.Tables[0].Rows[0]["HbTabacoCigarrosDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["HbOtros"].ToString() == "1")
            {
                habitosNocivos = habitosNocivos + $"<b>&#187; (Otros) </b> {DatosEvaluacion.Tables[0].Rows[0]["HbOtrosDescripcion"]}, ";
            }

            if (habitosNocivos == "")
            {
                habitosNocivos = habitosNocivos + "Niega";
            }

            @ViewBag.HabitosNocivos = habitosNocivos;

            if (DatosEvaluacion.Tables[0].Rows[0]["AlergFarmacologicas"].ToString() == "1")
            {
                alergias = alergias + $"<b>&#187; (Farmacologicas) </b> {DatosEvaluacion.Tables[0].Rows[0]["AlergFarmacologicasDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["AlergAlimentacion"].ToString() == "1")
            {
                alergias = alergias + $"<b>&#187; (Alimentación) </b> {DatosEvaluacion.Tables[0].Rows[0]["AlergAlimentacionDescripcion"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["AlergOtros"].ToString() == "1")
            {
                alergias = alergias + $"<b>&#187; (Otros) </b> {DatosEvaluacion.Tables[0].Rows[0]["AlergOtrosDescripcion"]} ";
            }

            if (alergias == "")
            {
                alergias = alergias + "Niega";
            }

            @ViewBag.Alergias = alergias;
            @ViewBag.AlergSignosSintomas = DatosEvaluacion.Tables[0].Rows[0]["AlergSignosSintomas"];

            if (DatosEvaluacion.Tables[0].Rows[0]["PatInfecciosa"].ToString() != "")
            {
                patologicos = patologicos + $"<b>&#187; (Enf. Infecciosa) </b> {DatosEvaluacion.Tables[0].Rows[0]["PatInfecciosa"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["PatMetabolica"].ToString() != "")
            {
                patologicos = patologicos + $"<b>&#187; (Enf. metabolica / endocrina / digestiva) </b> {DatosEvaluacion.Tables[0].Rows[0]["PatMetabolica"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["PatCardiorespiratoria"].ToString() != "")
            {
                patologicos = patologicos + $"<b>&#187; (Enfermedad Cardiorespiratoria) </b> {DatosEvaluacion.Tables[0].Rows[0]["PatCardiorespiratoria"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["PatNeurologica"].ToString() != "")
            {
                patologicos = patologicos + $"<b>&#187; (Enf. Neurológica / Musculoesquelética) </b> {DatosEvaluacion.Tables[0].Rows[0]["PatNeurologica"]}, ";
            }
            if (DatosEvaluacion.Tables[0].Rows[0]["PatReumatica"].ToString() != "")
            {
                patologicos = patologicos + $"<b>&#187; (Enf. Reumática/inmunocompromiso) </b> {DatosEvaluacion.Tables[0].Rows[0]["PatReumatica"]}";
            }

            @ViewBag.Patologicos = patologicos;

            @ViewBag.CirugiasPreviasDescripcion = DatosEvaluacion.Tables[0].Rows[0]["CirugiasPreviasDescripcion"].ToString();
            @ViewBag.FechaUltimaCirugia = DatosEvaluacion.Tables[0].Rows[0]["FechaUltimaCirugia"];
            @ViewBag.MedicacionHabitual = DatosEvaluacion.Tables[0].Rows[0]["MedicacionHabitual"];

            @ViewBag.Primipaternidad = DatosEvaluacion.Tables[0].Rows[0]["Primipaternidad"];
            @ViewBag.NroGestaciones = DatosEvaluacion.Tables[0].Rows[0]["NroGestaciones"];
            @ViewBag.NroPartosTermino = DatosEvaluacion.Tables[0].Rows[0]["NroPartosTermino"];
            @ViewBag.NroPartosPreTermino = DatosEvaluacion.Tables[0].Rows[0]["NroPartosPreTermino"];
            @ViewBag.NGestacionesFrustras = DatosEvaluacion.Tables[0].Rows[0]["NGestacionesFrustras"];
            @ViewBag.NroHijosVivos = DatosEvaluacion.Tables[0].Rows[0]["NroHijosVivos"];
            @ViewBag.PeriodoIntergenesico = DatosEvaluacion.Tables[0].Rows[0]["PeriodoIntergenesico"];
            @ViewBag.AntObstFUltimaRegla = DatosEvaluacion.Tables[0].Rows[0]["AntObstFUltimaRegla"];
            @ViewBag.AntObstCesarea = DatosEvaluacion.Tables[0].Rows[0]["AntObstCesarea"];
            @ViewBag.AntObstFechaUltimaCesarea = DatosEvaluacion.Tables[0].Rows[0]["AntObstFechaUltimaCesarea"];

            @ViewBag.Menos2500g = DatosEvaluacion.Tables[0].Rows[0]["Menos2500g"];
            @ViewBag.Multiple = DatosEvaluacion.Tables[0].Rows[0]["Multiple"];
            @ViewBag.Menos37S = DatosEvaluacion.Tables[0].Rows[0]["Menos37S"];
            @ViewBag.Mayor4000g = DatosEvaluacion.Tables[0].Rows[0]["Mayor4000g"];
            @ViewBag.Obito = DatosEvaluacion.Tables[0].Rows[0]["Obito"];
            @ViewBag.AntecedenteEnfermedadHipertensivaEmbarazo = DatosEvaluacion.Tables[0].Rows[0]["AntecedenteEnfermedadHipertensivaEmbarazo"];

            @ViewBag.DtOtrasPatologias = dtOtrasPatologias;

            @ViewBag.TipoPaciente = DatosEvaluacion.Tables[0].Rows[0]["TipoPaciente"];
            @ViewBag.EdadGestacionalFinalSemanas = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalFinalSemanas"];
            @ViewBag.EdadGestacionalFinalDias = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalFinalDias"];
            @ViewBag.TipoParto = DatosEvaluacion.Tables[0].Rows[0]["TipoParto"];
            @ViewBag.CondicionProducto = DatosEvaluacion.Tables[0].Rows[0]["CondicionProducto"];
            @ViewBag.TiempoEnfermedadDias = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedadDias"];
            @ViewBag.TiempoEnfermedadHoras = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedadHoras"];
            @ViewBag.SOFAPreUCI = DatosEvaluacion.Tables[0].Rows[0]["SOFAPreUCI"];
            @ViewBag.PrioridadIngresoUCI = DatosEvaluacion.Tables[0].Rows[0]["PrioridadIngresoUCI"];

            @ViewBag.CausaMotivoIngreso = DatosEvaluacion.Tables[0].Rows[0]["CausaMotivoIngreso"];
            @ViewBag.EnfermedadActualSignosSintomas = DatosEvaluacion.Tables[0].Rows[0]["EnfermedadActualSignosSintomas"];
            @ViewBag.RelatoCronologico = DatosEvaluacion.Tables[0].Rows[0]["RelatoCronologico"];

            @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["HoraEvaluacion"];

            @ViewBag.TriajePresion = DatosEvaluacion.Tables[0].Rows[0]["TriajePresion"];

            @ViewBag.TriajePresionArterialMedia = "";

            if (@ViewBag.TriajePresion.ToString() != "") {
                if(@ViewBag.TriajePresion.ToString().Split("/")[1] != "" && @ViewBag.TriajePresion.ToString().Split("/")[0] != "")
                {
                    @ViewBag.TriajePresionArterialMedia = ((2 * Double.Parse(@ViewBag.TriajePresion.ToString().Split("/")[1]) + Double.Parse(@ViewBag.TriajePresion.ToString().Split("/")[0])) / 3).ToString("N2");
                }
            }
           


            @ViewBag.TriajeFrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["TriajeFrecuenciaCardiaca"];
            @ViewBag.TriajeFrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["TriajeFrecuenciaRespiratoria"];
            @ViewBag.TriajeSaturacionOxigeno = DatosEvaluacion.Tables[0].Rows[0]["TriajeSaturacionOxigeno"];
            @ViewBag.TriajeTemperatura = DatosEvaluacion.Tables[0].Rows[0]["TriajeTemperatura"];
            @ViewBag.TriajePeso = DatosEvaluacion.Tables[0].Rows[0]["TriajePeso"];
            @ViewBag.TriajeTalla = (float.Parse(DatosEvaluacion.Tables[0].Rows[0]["TriajeTalla"].ToString()) / 100).ToString("N2");

            @ViewBag.TriajeIMC = "";

            if (@ViewBag.TriajePeso != "" && @ViewBag.TriajeTalla != "")
            {
                @ViewBag.TriajeIMC = (float.Parse(DatosEvaluacion.Tables[0].Rows[0]["TriajePeso"].ToString()) / (float.Parse(@ViewBag.TriajeTalla) * float.Parse(@ViewBag.TriajeTalla))).ToString("N2");
            }

            

            @ViewBag.Ectoscopia = DatosEvaluacion.Tables[0].Rows[0]["Ectoscopia"];
            @ViewBag.ExamenNeurologico = DatosEvaluacion.Tables[0].Rows[0]["ExamenNeurologico"];
            @ViewBag.EscalaGlasgow = DatosEvaluacion.Tables[0].Rows[0]["EscalaGlasgow"];
            @ViewBag.NivelConciencia = DatosEvaluacion.Tables[0].Rows[0]["NivelConciencia"];
            @ViewBag.Delirio = DatosEvaluacion.Tables[0].Rows[0]["Delirio"];
            @ViewBag.EscalaSedacion = DatosEvaluacion.Tables[0].Rows[0]["EscalaSedacion"];
            @ViewBag.MonitoreoSedacionBISS = DatosEvaluacion.Tables[0].Rows[0]["MonitoreoSedacionBISS"];

            @ViewBag.DtSedantes = dtSedantes;
            @ViewBag.DtAnalgesicos = dtAnalgesicos;
            @ViewBag.DtBloqueanteNeuromuscular = dtBloqueanteNeuromuscular;

            @ViewBag.FuerzaMuscular = DatosEvaluacion.Tables[0].Rows[0]["FuerzaMuscular"];
            @ViewBag.NeurologicoReflejo4 = DatosEvaluacion.Tables[0].Rows[0]["NeurologicoReflejo4"];
            @ViewBag.EscalaDolor = DatosEvaluacion.Tables[0].Rows[0]["EscalaDolor"];

            @ViewBag.EvaluacionCardiovascular = DatosEvaluacion.Tables[0].Rows[0]["EvaluacionCardiovascular"];
            @ViewBag.TipoRitmoCardiaco = DatosEvaluacion.Tables[0].Rows[0]["TipoRitmoCardiaco"];
            @ViewBag.IndiceShock = DatosEvaluacion.Tables[0].Rows[0]["IndiceShock"];
            @ViewBag.RitmoCardiaco = DatosEvaluacion.Tables[0].Rows[0]["RitmoCardiaco"];

            @ViewBag.DtVasodilatador = dtVasodilatador;
            @ViewBag.DtVasoconstrictor = dtVasoconstrictor;

            @ViewBag.GastoCardiacoNoinvasivo = DatosEvaluacion.Tables[0].Rows[0]["GastoCardiacoNoinvasivo"];
            @ViewBag.IndiceCardiaco = DatosEvaluacion.Tables[0].Rows[0]["IndiceCardiaco"];

            @ViewBag.ExamenRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["ExamenRespiratorio"];
            @ViewBag.ManejoViaAerea = DatosEvaluacion.Tables[0].Rows[0]["ManejoViaAerea"];
            @ViewBag.TipoSoporteOxigenatorioVentilatorio = DatosEvaluacion.Tables[0].Rows[0]["TipoSoporteOxigenatorioVentilatorio"];
            @ViewBag.FraccionInspiratoriaO2 = DatosEvaluacion.Tables[0].Rows[0]["FraccionInspiratoriaO2"];
            @ViewBag.SaturacionOxigenoFio2 = DatosEvaluacion.Tables[0].Rows[0]["SaturacionOxigenoFio2"];
            @ViewBag.IndiceKirbyPaO2FiO2 = DatosEvaluacion.Tables[0].Rows[0]["IndiceKirbyPaO2FiO2"];
            @ViewBag.IndiceRox = DatosEvaluacion.Tables[0].Rows[0]["IndiceRox"];
            @ViewBag.IndiceOxigenatorio = DatosEvaluacion.Tables[0].Rows[0]["IndiceOxigenatorio"];
            @ViewBag.PresionMediaViaAerea = DatosEvaluacion.Tables[0].Rows[0]["PresionMediaViaAerea"];

            @ViewBag.RadiografiaToraxPatologica = DatosEvaluacion.Tables[0].Rows[0]["RadiografiaToraxPatologica"];
            @ViewBag.RadioToraxDescripcion = DatosEvaluacion.Tables[0].Rows[0]["RadioToraxDescripcion"];
            @ViewBag.CuadrantesAfectados = DatosEvaluacion.Tables[0].Rows[0]["CuadrantesAfectados"];
            @ViewBag.EcografiaPulmonarHallazgoSliding = DatosEvaluacion.Tables[0].Rows[0]["EcografiaPulmonarHallazgoSliding"];
            @ViewBag.PerfilEcografico = DatosEvaluacion.Tables[0].Rows[0]["PerfilEcografico"];
            @ViewBag.TomografiaToracicaPatologica = DatosEvaluacion.Tables[0].Rows[0]["TomografiaToracicaPatologica"];
            @ViewBag.TomografiaTorax = DatosEvaluacion.Tables[0].Rows[0]["TomografiaTorax"];
            @ViewBag.OtroEstudioRespiratorioDescripcion = DatosEvaluacion.Tables[0].Rows[0]["OtroEstudioRespiratorioDescripcion"];
            @ViewBag.Neumotorax = DatosEvaluacion.Tables[0].Rows[0]["Neumotorax"];
            @ViewBag.SindromeDistresRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["SindromeDistresRespiratorio"];
            @ViewBag.GradoDistresRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["GradoDistresRespiratorio"];
            @ViewBag.HallazgosDispositivos = DatosEvaluacion.Tables[0].Rows[0]["HallazgosDispositivos"];

            @ViewBag.ExamenAbdominal = DatosEvaluacion.Tables[0].Rows[0]["ExamenAbdominal"];
            @ViewBag.Incisiones = DatosEvaluacion.Tables[0].Rows[0]["Incisiones"];
            @ViewBag.AfectacionesActuales = DatosEvaluacion.Tables[0].Rows[0]["AfectacionesActuales"];
            @ViewBag.InvasivosDispositivos = DatosEvaluacion.Tables[0].Rows[0]["InvasivosDispositivos"];
            @ViewBag.PIA6h = DatosEvaluacion.Tables[0].Rows[0]["PIA6h"];
            @ViewBag.PIA12h = DatosEvaluacion.Tables[0].Rows[0]["PIA12h"];
            @ViewBag.PIA18h = DatosEvaluacion.Tables[0].Rows[0]["PIA18h"];
            @ViewBag.PIA24h = DatosEvaluacion.Tables[0].Rows[0]["PIA24h"];
            @ViewBag.PerimetroAbd6h = DatosEvaluacion.Tables[0].Rows[0]["PerimetroAbd6h"];
            @ViewBag.PerimetroAbd12h = DatosEvaluacion.Tables[0].Rows[0]["PerimetroAbd12h"];
            @ViewBag.PerimetroAbd18h = DatosEvaluacion.Tables[0].Rows[0]["PerimetroAbd18h"];
            @ViewBag.PerimetroAbd24h = DatosEvaluacion.Tables[0].Rows[0]["PerimetroAbd24h"];

            @ViewBag.ExamenUrinarioRenal = DatosEvaluacion.Tables[0].Rows[0]["ExamenUrinarioRenal"];
            @ViewBag.Diuresis6H = DatosEvaluacion.Tables[0].Rows[0]["Diuresis6H"];
            @ViewBag.Diuresis12H = DatosEvaluacion.Tables[0].Rows[0]["Diuresis12H"];
            @ViewBag.Diuresis24H = DatosEvaluacion.Tables[0].Rows[0]["Diuresis24H"];
            @ViewBag.NombreDiuretico = DatosEvaluacion.Tables[0].Rows[0]["NombreDiuretico"];
            @ViewBag.DosisDiuretico = DatosEvaluacion.Tables[0].Rows[0]["DosisDiuretico"];
            @ViewBag.TerapiaReemplazoRenal = DatosEvaluacion.Tables[0].Rows[0]["TerapiaReemplazoRenal"];
            @ViewBag.NroSesion = DatosEvaluacion.Tables[0].Rows[0]["NroSesion"];
            @ViewBag.Ultrafiltrado = DatosEvaluacion.Tables[0].Rows[0]["Ultrafiltrado"];

            @ViewBag.ExamenPielFaneras = DatosEvaluacion.Tables[0].Rows[0]["ExamenPielFaneras"];
            @ViewBag.EdemaPielFaneras = DatosEvaluacion.Tables[0].Rows[0]["EdemaPielFaneras"];
            @ViewBag.LesionPorPresion = DatosEvaluacion.Tables[0].Rows[0]["LesionPorPresion"];
            @ViewBag.GradoPielFaneras = DatosEvaluacion.Tables[0].Rows[0]["GradoPielFaneras"];
            @ViewBag.UbicacionPielFaneras = DatosEvaluacion.Tables[0].Rows[0]["UbicacionPielFaneras"];
            @ViewBag.SignosHipoperfusion = DatosEvaluacion.Tables[0].Rows[0]["SignosHipoperfusion"];

            @ViewBag.ExamenExtremidades = DatosEvaluacion.Tables[0].Rows[0]["ExamenExtremidades"];
            @ViewBag.ExamenColumna = DatosEvaluacion.Tables[0].Rows[0]["ExamenColumna"];

            @ViewBag.ExamenGinecologico = DatosEvaluacion.Tables[0].Rows[0]["ExamenGinecologico"];
            @ViewBag.GlandulaMamaria = DatosEvaluacion.Tables[0].Rows[0]["GlandulaMamaria"];
            @ViewBag.LCF = DatosEvaluacion.Tables[0].Rows[0]["LCF"];
            @ViewBag.MOVFETALES = DatosEvaluacion.Tables[0].Rows[0]["MOVFETALES"];
            @ViewBag.GinecologicoUtero = DatosEvaluacion.Tables[0].Rows[0]["GinecologicoUtero"];

            @ViewBag.ParamGinecologicos = DatosEvaluacion.Tables[0].Rows[0]["ParamGinecologicos"];

            @ViewBag.InfecciosoInfeccion = DatosEvaluacion.Tables[0].Rows[0]["InfecciosoInfeccion"];
            @ViewBag.InfeccionComunitariaDescripcion = DatosEvaluacion.Tables[0].Rows[0]["InfeccionComunitariaDescripcion"];
            @ViewBag.InfeccionIntrahospitalariaDescripcion = DatosEvaluacion.Tables[0].Rows[0]["InfeccionIntrahospitalariaDescripcion"];

            @ViewBag.InfecciosoCultivos = DatosEvaluacion.Tables[0].Rows[0]["InfecciosoCultivos"];


            @ViewBag.DtHemoderivados = dtHemoderivados;
            @ViewBag.DtCorticoides = dtCorticoides;
            @ViewBag.DtFluidoterapia = dtFluidoterapia;

            @ViewBag.DtAccesosVasculares = dtAccesosVasculares;

            @ViewBag.Bh6h = DatosEvaluacion.Tables[0].Rows[0]["Bh6h"];
            @ViewBag.Bh12h = DatosEvaluacion.Tables[0].Rows[0]["Bh12h"];
            @ViewBag.Bh24h = DatosEvaluacion.Tables[0].Rows[0]["Bh24h"];
            @ViewBag.IngresosFluidossvo6h = DatosEvaluacion.Tables[0].Rows[0]["IngresosFluidossvo6h"];
            @ViewBag.IngresosFluidossvo12h = DatosEvaluacion.Tables[0].Rows[0]["IngresosFluidossvo12h"];
            @ViewBag.IngresosFluidossvo24h = DatosEvaluacion.Tables[0].Rows[0]["IngresosFluidossvo24h"];

            @ViewBag.ExamenesAuxiliaresUCI = DatosEvaluacion.Tables[0].Rows[0]["ExamenesAuxiliaresUCI"];

            @ViewBag.DxEvaluacion = dtDx;

            @ViewBag.ComentarioApreciacionEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["ComentarioApreciacionEvaluacion"];
            @ViewBag.PlanEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["PlanEvaluacion"];
            @ViewBag.ImpresionDiagnostica = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            @ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];


            @ViewBag.DetalleReceta = RecetasDestalle.Tables[0];

            //@ViewBag.P = DatosEvaluacion.Tables[0].Rows[0]["P"];
            //@ViewBag.Prioridad = DatosEvaluacion.Tables[0].Rows[0]["Prioridad"];
            //@ViewBag.TipoPacienteDesc = DatosEvaluacion.Tables[0].Rows[0]["TipoPacienteDesc"];

            //@ViewBag.NroEvaluacion = eval;

            //@ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            //@ViewBag.NroCuenta = DatosEvaluacion.Tables[0].Rows[0]["NroCuenta"];
            //@ViewBag.NroHistoriaClinica = DatosEvaluacion.Tables[0].Rows[0]["NroHistoriaClinica"];
            //@ViewBag.FechaNacimiento = DatosEvaluacion.Tables[0].Rows[0]["FechaNacimiento"];
            //@ViewBag.HoraNacimiento = DatosEvaluacion.Tables[0].Rows[0]["HoraNacimiento"];
            //@ViewBag.Servicio = DatosEvaluacion.Tables[0].Rows[0]["Servicio"];
            //@ViewBag.Cama = DatosEvaluacion.Tables[0].Rows[0]["Cama"];

            //@ViewBag.TipoPaciente = DatosEvaluacion.Tables[0].Rows[0]["TipoPaciente"];

            //@ViewBag.TiempoEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedad"];
            //@ViewBag.Inicio = DatosEvaluacion.Tables[0].Rows[0]["Inicio"];
            //@ViewBag.Curso = DatosEvaluacion.Tables[0].Rows[0]["Curso"];

            //@ViewBag.Fur = DatosEvaluacion.Tables[0].Rows[0]["Fur"];
            //@ViewBag.Fpp = DatosEvaluacion.Tables[0].Rows[0]["Fpp"];
            //@ViewBag.Fpe = DatosEvaluacion.Tables[0].Rows[0]["Fpe"];
            //@ViewBag.EdadGestacional = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacional"];
            //@ViewBag.Cpn = DatosEvaluacion.Tables[0].Rows[0]["Cpn"];

            //@ViewBag.DificultadRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["DificultadRespiratoria"];
            //@ViewBag.Diarrea = DatosEvaluacion.Tables[0].Rows[0]["Diarrea"];
            //@ViewBag.DistensionAbdominal = DatosEvaluacion.Tables[0].Rows[0]["DistensionAbdominal"];
            //@ViewBag.Cianosis = DatosEvaluacion.Tables[0].Rows[0]["Cianosis"];
            //@ViewBag.MalOlorOmbligo = DatosEvaluacion.Tables[0].Rows[0]["MalOlorOmbligo"];
            //@ViewBag.Ictericia = DatosEvaluacion.Tables[0].Rows[0]["Ictericia"];
            //@ViewBag.Dolor = DatosEvaluacion.Tables[0].Rows[0]["Dolor"];
            //@ViewBag.Convulsiones = DatosEvaluacion.Tables[0].Rows[0]["Convulsiones"];
            //@ViewBag.Fiebre = DatosEvaluacion.Tables[0].Rows[0]["Fiebre"];
            //@ViewBag.Vomitos = DatosEvaluacion.Tables[0].Rows[0]["Vomitos"];
            //@ViewBag.Hemorragia = DatosEvaluacion.Tables[0].Rows[0]["Hemorragia"];

            //@ViewBag.ContraccionUterina = DatosEvaluacion.Tables[0].Rows[0]["ContraccionUterina"];
            //@ViewBag.SangradoVaginal = DatosEvaluacion.Tables[0].Rows[0]["SangradoVaginal"];
            //@ViewBag.PerdidaLiquido = DatosEvaluacion.Tables[0].Rows[0]["PerdidaLiquido"];
            //@ViewBag.MovimientoFetal = DatosEvaluacion.Tables[0].Rows[0]["MovimientoFetal"];
            //@ViewBag.SintomaUrinario = DatosEvaluacion.Tables[0].Rows[0]["SintomaUrinario"];
            //@ViewBag.FlujoVaginal = DatosEvaluacion.Tables[0].Rows[0]["FlujoVaginal"];
            //@ViewBag.Tumoracion = DatosEvaluacion.Tables[0].Rows[0]["Tumoracion"];
            //@ViewBag.AlteracionMenstrual = DatosEvaluacion.Tables[0].Rows[0]["AlteracionMenstrual"];
            //@ViewBag.DismMovimientoFetal = DatosEvaluacion.Tables[0].Rows[0]["DismMovimientoFetal"];
            //@ViewBag.Otros = DatosEvaluacion.Tables[0].Rows[0]["Otros"];
            //@ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];

            //@ViewBag.Relato = DatosEvaluacion.Tables[0].Rows[0]["Relato"];
            //@ViewBag.EnfermedadActual = DatosEvaluacion.Tables[0].Rows[0]["EnfermedadActual"];
            //@ViewBag.PesoFetalAnt = DatosEvaluacion.Tables[0].Rows[0]["PesoFetalAnt"];

            //@ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
            ////@ViewBag.PesoNacer = DatosEvaluacion.Tables[0].Rows[0]["PesoNacer"];
            ////@ViewBag.TallaNacer = DatosEvaluacion.Tables[0].Rows[0]["TallaNacer"];
            ////@ViewBag.PerimetroCefalicoNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroCefalicoNacer"];
            ////@ViewBag.PerimetroToracioNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroToracioNacer"];
            ////@ViewBag.ApgarNacer = DatosEvaluacion.Tables[0].Rows[0]["ApgarNacer"];
            ////@ViewBag.AntecedentesPatlogicosNacer = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesPatlogicosNacer"];
            ////@ViewBag.EdadGestacionalNacer = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalNacer"];

            //@ViewBag.FrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaCardiaca"];
            //@ViewBag.FrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaRespiratoria"];
            //@ViewBag.Temperatura = DatosEvaluacion.Tables[0].Rows[0]["Temperatura"];
            //@ViewBag.PresionArterial = DatosEvaluacion.Tables[0].Rows[0]["PresionArterial"];
            //@ViewBag.Talla = DatosEvaluacion.Tables[0].Rows[0]["Talla"];
            //@ViewBag.Peso = DatosEvaluacion.Tables[0].Rows[0]["Peso"];
            //@ViewBag.Saturacion = DatosEvaluacion.Tables[0].Rows[0]["Saturacion"];
            //@ViewBag.ObservacionTriaje = DatosEvaluacion.Tables[0].Rows[0]["ObservacionTriaje"];

            //@ViewBag.EstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EstadoGeneralSensorio"];
            //@ViewBag.DEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["DEstadoGeneralSensorio"];
            //@ViewBag.EEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EEstadoGeneralSensorio"];
            //@ViewBag.AparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["AparatoCardioVascular"];
            //@ViewBag.DAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["DAparatoCardioVascular"];
            //@ViewBag.RAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["RAparatoCardioVascular"];
            //@ViewBag.AparatoRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["AparatoRespiratorio"];
            //@ViewBag.DAparatoRespiratorio = DatosEvaluacion.Tables[0].Rows[0]["DAparatoRespiratorio"];
            //@ViewBag.AparatoUrinario = DatosEvaluacion.Tables[0].Rows[0]["AparatoUrinario"];
            //@ViewBag.DAparatoUrinario = DatosEvaluacion.Tables[0].Rows[0]["DAparatoUrinario"];
            //@ViewBag.Abdomen = DatosEvaluacion.Tables[0].Rows[0]["Abdomen"];
            //@ViewBag.DAbdomen = DatosEvaluacion.Tables[0].Rows[0]["DAbdomen"];
            //@ViewBag.Extremidades = DatosEvaluacion.Tables[0].Rows[0]["Extremidades"];
            //@ViewBag.DExtremidades = DatosEvaluacion.Tables[0].Rows[0]["DExtremidades"];
            //@ViewBag.Neurologico = DatosEvaluacion.Tables[0].Rows[0]["Neurologico"];
            //@ViewBag.DNeurologico = DatosEvaluacion.Tables[0].Rows[0]["DNeurologico"];
            //@ViewBag.Piel = DatosEvaluacion.Tables[0].Rows[0]["Piel"];
            //@ViewBag.DPiel = DatosEvaluacion.Tables[0].Rows[0]["DPiel"];

            //@ViewBag.GeBus = DatosEvaluacion.Tables[0].Rows[0]["GeBus"];
            //@ViewBag.DGeBus = DatosEvaluacion.Tables[0].Rows[0]["DGeBus"];
            //@ViewBag.Vagina = DatosEvaluacion.Tables[0].Rows[0]["Vagina"];
            //@ViewBag.DVagina = DatosEvaluacion.Tables[0].Rows[0]["DVagina"];
            //@ViewBag.Cervix = DatosEvaluacion.Tables[0].Rows[0]["Cervix"];
            //@ViewBag.DCervix = DatosEvaluacion.Tables[0].Rows[0]["DCervix"];
            //@ViewBag.Utero = DatosEvaluacion.Tables[0].Rows[0]["Utero"];
            //@ViewBag.DUtero = DatosEvaluacion.Tables[0].Rows[0]["DUtero"];
            //@ViewBag.Anexos = DatosEvaluacion.Tables[0].Rows[0]["Anexos"];
            //@ViewBag.DAnexos = DatosEvaluacion.Tables[0].Rows[0]["DAnexos"];
            //@ViewBag.FsDouglas = DatosEvaluacion.Tables[0].Rows[0]["FsDouglas"];
            //@ViewBag.DFsDouglas = DatosEvaluacion.Tables[0].Rows[0]["DFsDouglas"];
            //@ViewBag.Parametros = DatosEvaluacion.Tables[0].Rows[0]["Parametros"];
            //@ViewBag.DParametros = DatosEvaluacion.Tables[0].Rows[0]["DParametros"];
            //@ViewBag.Mamas = DatosEvaluacion.Tables[0].Rows[0]["Mamas"];
            //@ViewBag.DMamas = DatosEvaluacion.Tables[0].Rows[0]["DMamas"];

            //@ViewBag.ObservacionGinecologica = DatosEvaluacion.Tables[0].Rows[0]["ObservacionGinecologica"];

            //@ViewBag.Au = DatosEvaluacion.Tables[0].Rows[0]["Au"];
            //@ViewBag.Lcf = DatosEvaluacion.Tables[0].Rows[0]["Lcf"];
            //@ViewBag.Du = DatosEvaluacion.Tables[0].Rows[0]["Du"];
            //@ViewBag.TipoEmbarazo = DatosEvaluacion.Tables[0].Rows[0]["TipoEmbarazo"];
            //@ViewBag.FUSituacion = DatosEvaluacion.Tables[0].Rows[0]["FUSituacion"];
            //@ViewBag.FUPosicion = DatosEvaluacion.Tables[0].Rows[0]["FUPosicion"];
            //@ViewBag.FUPresentacion = DatosEvaluacion.Tables[0].Rows[0]["FUPresentacion"];
            //@ViewBag.Dips1 = DatosEvaluacion.Tables[0].Rows[0]["Dips1"];
            //@ViewBag.Dips2 = DatosEvaluacion.Tables[0].Rows[0]["Dips2"];
            //@ViewBag.Dips3 = DatosEvaluacion.Tables[0].Rows[0]["Dips3"];
            //@ViewBag.SppF1 = DatosEvaluacion.Tables[0].Rows[0]["SppF1"];
            //@ViewBag.SppF2 = DatosEvaluacion.Tables[0].Rows[0]["SppF2"];
            //@ViewBag.SppF3 = DatosEvaluacion.Tables[0].Rows[0]["SppF3"];
            //@ViewBag.LcfF1 = DatosEvaluacion.Tables[0].Rows[0]["LcfF1"];
            //@ViewBag.LcfF2 = DatosEvaluacion.Tables[0].Rows[0]["LcfF2"];
            //@ViewBag.LcfF3 = DatosEvaluacion.Tables[0].Rows[0]["LcfF3"];
            //@ViewBag.Soplos = DatosEvaluacion.Tables[0].Rows[0]["Soplos"];
            //@ViewBag.Hidramnios = DatosEvaluacion.Tables[0].Rows[0]["Hidramnios"];
            //@ViewBag.PonderadoFetal = DatosEvaluacion.Tables[0].Rows[0]["PonderadoFetal"];
            //@ViewBag.PonderadoClinico = DatosEvaluacion.Tables[0].Rows[0]["PonderadoClinico"];
            //@ViewBag.PonderadoEcografo = DatosEvaluacion.Tables[0].Rows[0]["PonderadoEcografo"];

            //@ViewBag.Dilatacion = DatosEvaluacion.Tables[0].Rows[0]["Dilatacion"];
            //@ViewBag.Incorporacion = DatosEvaluacion.Tables[0].Rows[0]["Incorporacion"];
            //@ViewBag.AlturaPresente = DatosEvaluacion.Tables[0].Rows[0]["AlturaPresente"];
            //@ViewBag.VariedadPresente = DatosEvaluacion.Tables[0].Rows[0]["VariedadPresente"];
            //@ViewBag.MembranaRota = DatosEvaluacion.Tables[0].Rows[0]["MembranaRota"];
            //@ViewBag.Procubito = DatosEvaluacion.Tables[0].Rows[0]["Procubito"];
            //@ViewBag.Prolapso = DatosEvaluacion.Tables[0].Rows[0]["Prolapso"];
            //@ViewBag.SangradoVaginal = DatosEvaluacion.Tables[0].Rows[0]["SangradoVaginal"];
            //@ViewBag.LAClaro = DatosEvaluacion.Tables[0].Rows[0]["Claro"];
            //@ViewBag.LAMeconial = DatosEvaluacion.Tables[0].Rows[0]["Meconial"];
            //@ViewBag.LASanguinolento = DatosEvaluacion.Tables[0].Rows[0]["Sanguinolento"];
            //@ViewBag.LAMalOlor = DatosEvaluacion.Tables[0].Rows[0]["MalOlor"];
            //@ViewBag.PelvimetriaSuperior = DatosEvaluacion.Tables[0].Rows[0]["PelvimetriaSuperior"];
            //@ViewBag.PelvimetriaMedio = DatosEvaluacion.Tables[0].Rows[0]["PelvimetriaMedio"];
            //@ViewBag.PelvimetriaInferior = DatosEvaluacion.Tables[0].Rows[0]["PelvimetriaInferior"];
            //@ViewBag.PelvisGinecoide = DatosEvaluacion.Tables[0].Rows[0]["PelvisGinecoide"];
            //@ViewBag.DPelvisGinecoide = DatosEvaluacion.Tables[0].Rows[0]["DPelvisGinecoide"];
            //@ViewBag.FetoPelvDudosa = DatosEvaluacion.Tables[0].Rows[0]["FetoPelvDudosa"];
            //@ViewBag.FetoPelvSi = DatosEvaluacion.Tables[0].Rows[0]["FetoPelvSi"];
            //@ViewBag.FetoPelvNo = DatosEvaluacion.Tables[0].Rows[0]["FetoPelvNo"];
            //@ViewBag.ObservacionDilatacion = DatosEvaluacion.Tables[0].Rows[0]["ObservacionDilatacion"];
            //@ViewBag.ObservacionObstetrica = DatosEvaluacion.Tables[0].Rows[0]["ObservacionObstetrica"];



            //@ViewBag.Evaluacion = DatosEvaluacion.Tables[0].Rows[0]["Evaluacion"];
            //@ViewBag.ImpresionDiagnostica = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            //@ViewBag.PlanTrabajo = DatosEvaluacion.Tables[0].Rows[0]["PlanTrabajo"];
            //@ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];

            //@ViewBag.TipoDestino = DatosEvaluacion.Tables[0].Rows[0]["TipoDestino"];
            //@ViewBag.TipoAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoAlta"];
            //@ViewBag.TipoCondicionAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoCondicionAlta"];

            //@ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];

            //@ViewBag.CodeFirma = DatosEvaluacion.Tables[0].Rows[0]["code"];

            @ViewBag.CodeFirma = "asdasdasdasdadasd";

            if (@ViewBag.CodeFirma != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);

                using (Bitmap bitMap = qrCode.GetGraphic(20))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        @ViewBag.CodigoQR = ms.ToArray();
                    }
                }
            }


            return PartialView("~/Views/Hospitalizacion/Plantillas/InformeEvaluacionUCI.cshtml");

        }


        [HttpPost]
        public async Task<Boolean> GenerarHojaNotaAdicionalUCI(int idCuenta, int IdAtencion, int IdComentarioApreciacion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("InformeNotaAdicional", "EvaluacionesUCI", new { area = "Hospitalizacion", IdAtencion, IdComentarioApreciacion }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, IdComentarioApreciacion, 0, "NA-UCI", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }
        public async Task<ActionResult> InformeNotaAdicional(int IdAtencion, int IdComentarioApreciacion)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosNotaAdicional;
            //DateTime today = DateTime.Today;
            int idUsuario = 0;

            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();
            DalAtenciones daoAtenciones = new DalAtenciones();


            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");


            DatosNotaAdicional = await daoAtenciones.SeleccionarComentarioApreciacionUCIByIdAtencionAndIdComentario(IdAtencion, IdComentarioApreciacion);

            @ViewBag.ComentarioApreciacion = DatosNotaAdicional.Tables[0].Rows[0]["ComentarioApreciacion"];
            @ViewBag.Plan = DatosNotaAdicional.Tables[0].Rows[0]["Plan"];
            @ViewBag.FechaRegistro = DatosNotaAdicional.Tables[0].Rows[0]["FechaRegistro"];
            @ViewBag.Hora = DatosNotaAdicional.Tables[0].Rows[0]["Hora"];
            @ViewBag.Medico = DatosNotaAdicional.Tables[0].Rows[0]["Medico"];
            @ViewBag.Destino = DatosNotaAdicional.Tables[0].Rows[0]["Destino"];


           


            //if (@ViewBag.CodeFirma != "")
            //{
            //    QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
            //    QRCode qrCode = new QRCode(qrCodeData);

            //    using (Bitmap bitMap = qrCode.GetGraphic(20))
            //    {
            //        using (MemoryStream ms = new MemoryStream())
            //        {
            //            bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            //            @ViewBag.CodigoQR = ms.ToArray();
            //        }
            //    }
            //}


            return PartialView("~/Views/Hospitalizacion/Plantillas/InformeNotaAdicional.cshtml");

        }

        [HttpPost]
        public async Task<Boolean> GenerarInformeAltaUCI(int idCuenta, int IdAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("InformeAltaUCI", "EvaluacionesUCI", new { area = "Hospitalizacion", IdAtencion }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, IdAtencion, 0, "IA-UCI", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }
        public async Task<ActionResult> InformeAltaUCI(int IdAtencion)
        {
            //QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosInforme, DiagnosticosPrim, DiagnosticosUlt;
            ////DateTime today = DateTime.Today;
            //int idUsuario = 0;

            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();
            DalAtenciones daoAtenciones = new DalAtenciones();


            //@ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");


            //DatosNotaAdicional = await daoAtenciones.SeleccionarComentarioApreciacionUCIByIdAtencionAndIdComentario(IdAtencion, IdComentarioApreciacion);


            DatosInforme = await dalEvaluacionesUCI.SeleccionarDatosInformeMedicoUCI(IdAtencion);

            DiagnosticosPrim = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, 0, Int32.Parse(DatosInforme.Tables[0].Rows[0]["NroEvaluacionPrim"].ToString()));
            DataTable dtDxPrim = DiagnosticosPrim.Tables[0];

            DiagnosticosUlt = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(IdAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, 0, Int32.Parse(DatosInforme.Tables[0].Rows[0]["NroEvaluacionUlt"].ToString()));
            DataTable dtDxUlt = DiagnosticosUlt.Tables[0];

            @ViewBag.Paciente = DatosInforme.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroHistoriaClinica = DatosInforme.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.Edad = DatosInforme.Tables[0].Rows[0]["Edad"];
            @ViewBag.TipoEdad = DatosInforme.Tables[0].Rows[0]["TipoEdad"];
            @ViewBag.FechaIngresoMGP = DatosInforme.Tables[0].Rows[0]["FechaIngresoMGP"];
            @ViewBag.FechaIngresoUCI = DatosInforme.Tables[0].Rows[0]["FechaIngresoUCI"];
            @ViewBag.RelatoCronologico = DatosInforme.Tables[0].Rows[0]["RelatoCronologico"];
            @ViewBag.ExamenesAuxiliaresUCI = DatosInforme.Tables[0].Rows[0]["ExamenesAuxiliaresUCI"];
            @ViewBag.PlanEvaluacionPrim = DatosInforme.Tables[0].Rows[0]["PlanEvaluacionPrim"];
            @ViewBag.PlanEvaluacionUlt = DatosInforme.Tables[0].Rows[0]["PlanEvaluacionUlt"];
            @ViewBag.MedicoComentarioEvaluacion = DatosInforme.Tables[0].Rows[0]["DestinoAtencion"];
            @ViewBag.DestinoComentarioEvaluacion = DatosInforme.Tables[0].Rows[0]["MedicoBrindaInforme"];
            @ViewBag.ComentarioApreciacionEvaluacionUlt = DatosInforme.Tables[0].Rows[0]["ComentarioApreciacionEvaluacionUlt"];
            @ViewBag.FechaAltaPlanApreciacion = DatosInforme.Tables[0].Rows[0]["FechaAltaPlanApreciacion"];

            @ViewBag.Afiliacion = DatosInforme.Tables[0].Rows[0]["Afiliacion"];
            @ViewBag.NroDocumento = DatosInforme.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.MotivoEvaluacionUCI = DatosInforme.Tables[0].Rows[0]["MotivoEvaluacionUCI"];


            @ViewBag.DxEvaluacionPrim = dtDxPrim;
            @ViewBag.DxEvaluacionUlt = dtDxUlt;

            @ViewBag.EstablecimientoReferencia = DatosInforme.Tables[0].Rows[0]["EstablecimientoReferencia"];
            @ViewBag.ServicioOrigen = DatosInforme.Tables[0].Rows[0]["ServicioOrigen"];
            @ViewBag.DiasEstancia = DatosInforme.Tables[0].Rows[0]["DiasEstancia"];


            //@ViewBag.ComentarioApreciacion = DatosNotaAdicional.Tables[0].Rows[0]["ComentarioApreciacion"];
            //@ViewBag.Plan = DatosNotaAdicional.Tables[0].Rows[0]["Plan"];
            //@ViewBag.FechaRegistro = DatosNotaAdicional.Tables[0].Rows[0]["FechaRegistro"];
            //@ViewBag.Hora = DatosNotaAdicional.Tables[0].Rows[0]["Hora"];
            //@ViewBag.Medico = DatosNotaAdicional.Tables[0].Rows[0]["Medico"];
            //@ViewBag.Destino = DatosNotaAdicional.Tables[0].Rows[0]["Destino"];





            //if (@ViewBag.CodeFirma != "")
            //{
            //    QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
            //    QRCode qrCode = new QRCode(qrCodeData);

            //    using (Bitmap bitMap = qrCode.GetGraphic(20))
            //    {
            //        using (MemoryStream ms = new MemoryStream())
            //        {
            //            bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            //            @ViewBag.CodigoQR = ms.ToArray();
            //        }
            //    }
            //}


            return PartialView("~/Views/Hospitalizacion/Plantillas/InformeAltaUCI.cshtml");

        }

        public async Task<ActionResult> GenerarReporteUCI(DateTime FechaInicio, DateTime FechaFin)
        {
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            DataSet DatosReporte = await dalEvaluacionesUCI.GenerarReporteUCI(FechaInicio, FechaFin);


            // Crear una instancia de la clase Workbook.
            Workbook wkb = new Workbook();

            // Acceder a la primera hoja de cálculo del libro de trabajo.
            Worksheet sht = wkb.Worksheets[0];

            DataTable dt = new DataTable();

            dt = DatosReporte.Tables[0];

            // Agregar los nombres de las columnas como la primera fila del archivo CSV
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                sht.Cells[0, i].PutValue(dt.Columns[i].ColumnName);
            }

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    Cell cell = sht.Cells[i + 1, j];
                    cell.PutValue(dt.Rows[i][j].ToString());
                }
            }


            //// Obtener la celda deseada(s) de la hoja de cálculo.
            //Cell c00 = sht.Cells["A1"];
            //Cell c01 = sht.Cells["B1"];
            //Cell c10 = sht.Cells["A2"];
            //Cell c11 = sht.Cells["B2"];

            // Ingresar el valor en la(s) celda(s).
            //c00.PutValue("ColumnA");
            //c01.PutValue("ColumnB");
            //c10.PutValue("ValueA");
            //c11.PutValue("ValueB");

            // Guardar el libro de trabajo como un archivo .csv en una secuencia de memoria.
            MemoryStream stream = new MemoryStream();
            wkb.Save(stream, SaveFormat.CSV);

            // Preparar la descarga del archivo CSV.
            byte[] content = stream.ToArray();
            stream.Close();

            // Devolver el archivo CSV como una descarga.
            return File(content, "text/csv", "created_one.csv");
        }
    }


}
