using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using SelectPdf;
using System.Text;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.Areas.Comun;
using System.Diagnostics;
using QRCoder;
using System.Drawing;
using WebAppMaternidad.CapaEntidades;

using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class EvaluacionNeonatalHospController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public EvaluacionNeonatalHospController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }
                       

        #region SINTOMAS NEONATALES
        //////////////////////////SINTOMAS NEONATALES///////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> SeleccionarSintomasNeonatal(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarSintomasNeonatal(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarSintomasNeonatal(AtencionesSintomas objSintoNeo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarSintomasNeonatal(objSintoNeo, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarSintomasNeonatal): " + ex });
            }
        }
        #endregion

        #region INFECCIONES MATERNAS
        //////////////////////////INFECCIONES MATERNAS///////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> InfeccionesMaternasSeleccionar(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.InfeccionesMaternasSeleccionar(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarInfeccionesMaternas(InfeccionMaterna objInf)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarInfeccionesMaternas(objInf, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarExamenNeonatal): " + ex });
            }
        }
        #endregion

        #region ENFERMEDADES MATERNAS
        //////////////////////////ENFERMEDADES MATERNAS///////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> EnfermedadesMaternasSeleccionar(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.EnfermedadesMaternasSeleccionar(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEnfermedadesMaternas(EnfermedadMaterna objEnf)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarEnfermedadesMaternas(objEnf, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarExamenNeonatal): " + ex });
            }
        }
        #endregion

        #region REGISTRO DE NACIMIENTOS
        //////////////////////////REGISTRO DE NACIMIENTOS///////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> RegistroNacimientoEnHospitalEnExternoSeleccionar(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.RegistroNacimientoEnHospitalEnExternoSeleccionar(idPaciente, idUsuario);

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarRegistroNacimientoExterno(RecienNacido objRn)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarRegistroNacimientoExterno(objRn, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarRegistroRecienNacidoExterno): " + ex });
            }
        }
        #endregion

        #region RIESGOS PERINATALES
        //////////////////////////RIESGOS PERINATALES///////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> RiesgosPerinatalesSeleccionar(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.RiesgosPerinatalesSeleccionar(idAtencion, idUsuario);

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarRiesgosPerinatales(RiesgosPerinatales objRiesgo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarRiesgosPerinatales(objRiesgo, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarExamenNeonatal): " + ex });
            }
        }
        #endregion

        #region DATOS LABOR DE PARTO
        //////////////////////////////////DATOS LABOR DE PARTO/////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposInicioLaborParto()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposInicioLaborPartoSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposPresentacionFetal()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposPresentacionFetalSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposDetalleParto()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposDetallePartoSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposDetalleCesarea()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposDetalleCesareaSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposSufrimientoFetal()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposSufrimientoFetalSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposTrabajoParto()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposTrabajoPartoSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposAnestesiaAplicada()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposAnestesiaAplicadaSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposLiquidoAmniotico()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposLiquidoAmnioticoSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposCordonUmbilical()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposCordonUmbilicalSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposPlacenta()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposPlacentaSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposMedicamentos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposMedicamentosSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTiposLugarParto()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.TiposLugarPartoSeleccionar();

            return Json(new { respuesta = ds, session = true });
        }
        #endregion
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////




        //[HttpPost]
        //public async Task<ActionResult> SeleccionarRnAntecedentesPerinatales(int idAtencion)
        //{
        //    DataSet lsAntecedentesPerinatales;
        //    DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    lsAntecedentesPerinatales = await daoEvaluacion.SeleccionarRnAntecedentesPerinatales(idAtencion);
        //    return Json(new { session = true, lsAntecedentesPerinatales = lsAntecedentesPerinatales });
        //}

        //[HttpPost]
        //public async Task<ActionResult> SeleccionarRnAntecedentesNacimiento(int idAtencion)
        //{
        //    DataSet lsAntecedentesNacimiento;
        //    DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    lsAntecedentesNacimiento = await daoEvaluacion.SeleccionarRnAntecedentesNacimiento(idAtencion);
        //    return Json(new { session = true, lsAntecedentesNacimiento = lsAntecedentesNacimiento });
        //}

        //[HttpPost]
        //public async Task<ActionResult> SeleccionarRnAntecedentes(int idPaciente)
        //{
        //    DataSet lsAntecedentesPerinatales, lsAntecedentesNacimiento;
        //    DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    lsAntecedentesPerinatales = await daoEvaluacion.SeleccionarRnAntecedentesPerinatales(idPaciente);
        //    lsAntecedentesNacimiento = await daoEvaluacion.SeleccionarRnAntecedentesNacimiento(idPaciente);
        //    return Json(new { session = true, lsAntecedentesPerinatales = lsAntecedentesPerinatales, lsAntecedentesNacimiento = lsAntecedentesNacimiento });
        //}

        #region EVALUACION NEONATAL
        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionNeonatal(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarEvaluacionNeonatal(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacion(EvaluacionNeonatalHosp objEva, Triaje obTriaje, int Prioridad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            DalTriaje daoTriaje = new DalTriaje();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarEvaluacion(objEva, idUsuario);
                //triaje = await daoTriaje.InsertaTriajeHospEmeg(obTriaje); // JDELGADO001.2
                //hoja = await GenerarHojaEvaluacion(objEva.IdAtencion);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
            }

        }
        #endregion

        #region EVALUACION DETALLE NEONATAL
        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionDetalleNeonatal(int idAtencion, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionHospitalizacion daoEvaluacionHosp = new DalEvaluacionHospitalizacion();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //ds = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatal(idAtencion, idUsuario);
            ds = await daoEvaluacionHosp.SeleccionarEvaluacionDetalle(idAtencion, idServicio, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(int idAtencion, int idServicio, int nroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionHospitalizacion daoEvaluacionHosp = new DalEvaluacionHospitalizacion();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //ds = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(idAtencion, nroEvaluacion, idUsuario);
            ds = await daoEvaluacionHosp.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacionDetalle(EvaluacionNeonatalHospDetalle objEva,
                                                                 String lstDiagnosticos,
                                                                 int idCuentaAtencion, int idServicio, int idMedico
                                                                 /*string lstRecetaPatalogiaClinica, int idRecetaPatoClinica,
                                                                 string lstRecetaAnatoPatologica, int idRecetaAnaPatologica,
                                                                 string lstRecetaBancoSangre, int idRecetaBancoSangre,
                                                                 string lstRecetaEcoObs, int idRecetaEcoObs,
                                                                 string lstRecetaEcoGeneral, int idRecetaEcoGene,
                                                                 string lstRecetaRx, int idRecetaRx,
                                                                 string lstRecetaFarmacia, int idRecetaFarmacia, string fechaVigencia*/
                                                                 )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            if (objEva.IdUsuario != 0)
            {
                if (objEva.IdUsuario != int.Parse(HttpContext.Session.GetString("idusu")))
                {
                    return Json(new { respuesta = false, session = true, mensaje = "Usted no puede modificar la evaluación de otro médico.", estado = false });
                }
            }


            //string mensajeRectas, fechaReceta;
            //Boolean resp, respPatoClinica, respAnaPatolo, respBancoSangre, rspEcoObs, rspEcoGeneral, rspRx, respFarmacia;
            DataSet ds, evadet;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            DalUtilitario daoUtil = new DalUtilitario();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();
            Boolean resp, informe/*, evaluacion*/;

            var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            try
            {
                ds = await daoEvaluacion.GuardarEvaluacionDetalle(objEva, idUsuario);
                resp = await daoUtil.insertaDiagnosticosPorEvaluacion(objEva.IdAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idUsuario, lstobjDiagnosticos, idServicio, objEva.NroEvaluacion);

                evadet = await daoEvaluacion.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(objEva.IdAtencion, objEva.NroEvaluacion, idUsuario);
                informe = await GenerarHojaEvaluacion(idCuentaAtencion, objEva.IdAtencion, Convert.ToInt32(evadet.Tables[0].Rows[0]["IdEvaluacionDetalle"].ToString()), idServicio, objEva.NroEvaluacion);
                //informe = await GenerarHojaEvaluacion(idCuentaAtencion, objEva.IdAtencion, idServicio, objEva.NroEvaluacion);   //GENERAR PDF HOJA EVALUACION

                return Json(new { session = true, estado = true, respuesta = ds });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacionDetalle): " + ex });
            }

        }
        #endregion


        #region EXAMEN FISICO NEONATAL
        [HttpPost]
        public async Task<ActionResult> SeleccionarExamenFisicoNeonatal(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoEvaluacion.SeleccionarExamenFisicoNeonatal(idAtencion, idUsuario);
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarExamenNeonatal(ExamenFisicoNeonatal objExaNeo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            //Boolean hoja;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.GuardarExamenNeonatal(objExaNeo, idUsuario);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarExamenNeonatal): " + ex });
            }
        }
        #endregion

        //[HttpPost]
        //public async Task<ActionResult> GuardarRnAntecedentesPerinatales(NinioAltoRiesgoAntecPerinatales objNinioAltoRiesAntecPerinatales)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    //DataSet ds;
        //    DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
        //    Boolean resp;

        //    try
        //    {
        //        int idUsuario;
        //        idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        resp = await daoEvaluacion.GuardarRnAntecedentesPerinatales(objNinioAltoRiesAntecPerinatales);

        //        return Json(new { respuesta = resp, session = true, estado = true });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { session = true, estado = false, msj = "Errr en (GuardarRnAntecedentesPerinatales): " + ex });
        //    }
        //}

        //[HttpPost]
        //public async Task<ActionResult> GuardarRnAntecedentesNacimiento(NinioAltoRiesgoNacimiento objninioAltoRiesgoNacimiento)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    //DataSet ds;
        //    DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
        //    Boolean resp;

        //    int idUsuario;
        //    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    resp = await daoEvaluacion.GuardarRnAntecedentesNacimiento(objninioAltoRiesgoNacimiento);
        //    //hoja = await GenerarHojaEvaluacion(objEva.IdAtencion);

        //    return Json(new { respuesta = resp, session = true });
        //}

        //[HttpPost]
        //public async Task<ActionResult> GuardarRnAntecedentes(NinioAltoRiesgoAntecPerinatales objNinioAltoRiesAntecPerinatales, NinioAltoRiesgoNacimiento objNinioAltoRiesNacimiento)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }

        //    //DataSet ds;
        //    DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
        //    Boolean resp;

        //    try
        //    {
        //        int idUsuario;
        //        idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

        //        resp = await daoEvaluacion.GuardarRnAntecedentesPerinatales(objNinioAltoRiesAntecPerinatales);
        //        resp = await daoEvaluacion.GuardarRnAntecedentesNacimiento(objNinioAltoRiesNacimiento);

        //        return Json(new { respuesta = resp, session = true, estado = true });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { session = true, estado = false, msj = "Errr en (GuardarEvaluacion): " + ex });
        //    }
        //}

        #region HOJA EVALUACION
        [HttpPost]
        public async Task<Boolean> GenerarHojaEvaluacion(int idCuenta, int idAtencion, int idEvaluacionDetalle, int idServicio, int eval)
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
                string usuario = HttpContext.Session.GetString("user");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("InformeEvaluacion", "EvaluacionNeonatalHosp", new { area = "Hospitalizacion", idAtencion, idServicio, eval, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idEvaluacionDetalle, 0, "H-EVA", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }
        
        
        public async Task<ActionResult> InformeEvaluacion(int idAtencion, int idServicio, int eval, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosEvaluacion;
            DataSet Diagnosticos;
            //DateTime today = DateTime.Today;
            int idUsuario = 0;

            DalEvaluacionNeonatalHosp daoEvaluacion = new DalEvaluacionNeonatalHosp();
            DalAtenciones daoAtenciones = new DalAtenciones();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionNeonatal(idAtencion, idServicio, eval, idUsuario);
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idServicio, eval);
            DataTable dtDx = Diagnosticos.Tables[0];

            @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["HoraEvaluacion"];

            @ViewBag.NroEvaluacion = eval;

            @ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroHistoriaClinica = DatosEvaluacion.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.FechaNacimiento = DatosEvaluacion.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = DatosEvaluacion.Tables[0].Rows[0]["HoraNacimiento"];
            @ViewBag.Servicio = DatosEvaluacion.Tables[0].Rows[0]["Servicio"];

            //============================TRIAJE RN======================================================
            @ViewBag.TriajePresionArterial = DatosEvaluacion.Tables[0].Rows[0]["TriajePresionArterial"];
            @ViewBag.TriajeFrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["TriajeFrecuenciaCardiaca"];
            @ViewBag.TriajeFrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["TriajeFrecuenciaRespiratoria"];
            @ViewBag.TriajeTemperatura = DatosEvaluacion.Tables[0].Rows[0]["TriajeTemperatura"];
            @ViewBag.TriajePeso = DatosEvaluacion.Tables[0].Rows[0]["TriajePeso"];
            @ViewBag.TriajeTalla = DatosEvaluacion.Tables[0].Rows[0]["TriajeTalla"];
            @ViewBag.TriajeSO = DatosEvaluacion.Tables[0].Rows[0]["TriajeSO"];

            //--========================== ANTECEDENTES PERIANTALES, EMBARAZO ACTUAL====================================
            @ViewBag.PesoMadre = DatosEvaluacion.Tables[0].Rows[0]["PesoMadre"];
            @ViewBag.TallaMadre = DatosEvaluacion.Tables[0].Rows[0]["TallaMadre"];
            

            //------------------------ANTECEDENTES DE RIESGO PERINATAL--------------------------------------------
            @ViewBag.Peso4000 = DatosEvaluacion.Tables[0].Rows[0]["Peso4000"];
            @ViewBag.Peso2500 = DatosEvaluacion.Tables[0].Rows[0]["Peso2500"];
            @ViewBag.PreTermino = DatosEvaluacion.Tables[0].Rows[0]["PreTermino"];
            @ViewBag.PostTermino = DatosEvaluacion.Tables[0].Rows[0]["PostTermino"];
            @ViewBag.Natimuerto = DatosEvaluacion.Tables[0].Rows[0]["Natimuerto"];
            @ViewBag.MuerteNeonatal = DatosEvaluacion.Tables[0].Rows[0]["MuerteNeonatal"];
            @ViewBag.Distocidos = DatosEvaluacion.Tables[0].Rows[0]["Distocidos"];
            @ViewBag.OtrosRiesgosPerinatales = DatosEvaluacion.Tables[0].Rows[0]["OtrosRiesgosPerinatales"];

            @ViewBag.DPeso4000 = DatosEvaluacion.Tables[0].Rows[0]["DPeso4000"];
            @ViewBag.DPeso2500 = DatosEvaluacion.Tables[0].Rows[0]["DPeso2500"];
            @ViewBag.DPreTermino = DatosEvaluacion.Tables[0].Rows[0]["DPreTermino"];
            @ViewBag.DPostTermino = DatosEvaluacion.Tables[0].Rows[0]["DPostTermino"];
            @ViewBag.DNatimuerto = DatosEvaluacion.Tables[0].Rows[0]["DNatimuerto"];
            @ViewBag.DMuerteNeonatal = DatosEvaluacion.Tables[0].Rows[0]["DMuerteNeonatal"];
            @ViewBag.DDistocidos = DatosEvaluacion.Tables[0].Rows[0]["DDistocidos"];
            @ViewBag.DOtrosRiesgosPerinatales = DatosEvaluacion.Tables[0].Rows[0]["DOtrosRiesgosPerinatales"];
            //------------------------ANTECEDENTES INFECCIONES MATERNAS-----------------------------
            @ViewBag.TbcActiva = DatosEvaluacion.Tables[0].Rows[0]["TbcActiva"];
            @ViewBag.Lues = DatosEvaluacion.Tables[0].Rows[0]["Lues"];
            @ViewBag.Torch = DatosEvaluacion.Tables[0].Rows[0]["Torch"];
            @ViewBag.ItuIIITrim = DatosEvaluacion.Tables[0].Rows[0]["ItuIIITrim"];
            @ViewBag.Urocultivo = DatosEvaluacion.Tables[0].Rows[0]["Urocultivo"];
            @ViewBag.Germen = DatosEvaluacion.Tables[0].Rows[0]["Germen"];
            @ViewBag.Covid = DatosEvaluacion.Tables[0].Rows[0]["Covid"];
            @ViewBag.Dengue = DatosEvaluacion.Tables[0].Rows[0]["Dengue"];
            @ViewBag.OtrosInfeccionesMaternas = DatosEvaluacion.Tables[0].Rows[0]["OtrosInfeccionesMaternas"];

            @ViewBag.DTbcActiva = DatosEvaluacion.Tables[0].Rows[0]["DTbcActiva"];
            @ViewBag.DLues = DatosEvaluacion.Tables[0].Rows[0]["DLues"];
            @ViewBag.DTorch = DatosEvaluacion.Tables[0].Rows[0]["DTorch"];
            @ViewBag.DItuIIITrim = DatosEvaluacion.Tables[0].Rows[0]["DItuIIITrim"];
            @ViewBag.DUrocultivo = DatosEvaluacion.Tables[0].Rows[0]["DUrocultivo"];
            @ViewBag.DGermen = DatosEvaluacion.Tables[0].Rows[0]["DGermen"];
            @ViewBag.DCovid = DatosEvaluacion.Tables[0].Rows[0]["DCovid"];
            @ViewBag.DDengue = DatosEvaluacion.Tables[0].Rows[0]["DDengue"];
            @ViewBag.DOtrosInfeccionesMaternas = DatosEvaluacion.Tables[0].Rows[0]["DOtrosInfeccionesMaternas"];
            //------------------------ANTECEDENTES ENFERMEDADES MATERNAS-----------------------------
            @ViewBag.PreEclampsia = DatosEvaluacion.Tables[0].Rows[0]["PreEclampsia"];
            @ViewBag.Eclampsia = DatosEvaluacion.Tables[0].Rows[0]["Eclampsia"];
            @ViewBag.Htt = DatosEvaluacion.Tables[0].Rows[0]["Htt"];
            @ViewBag.Desnutricion = DatosEvaluacion.Tables[0].Rows[0]["Desnutricion"];
            @ViewBag.DiabetesMellitus = DatosEvaluacion.Tables[0].Rows[0]["DiabetesMellitus"];
            @ViewBag.HepatitisB = DatosEvaluacion.Tables[0].Rows[0]["HepatitisB"];
            @ViewBag.Anemia = DatosEvaluacion.Tables[0].Rows[0]["Anemia"];
            @ViewBag.HipoHipertiroides = DatosEvaluacion.Tables[0].Rows[0]["HipoHipertiroides"];
            @ViewBag.OtrosEnfermedadesMaternas = DatosEvaluacion.Tables[0].Rows[0]["OtrosEnfermedadesMaternas"];

            @ViewBag.DPreEclampsia = DatosEvaluacion.Tables[0].Rows[0]["DPreEclampsia"];
            @ViewBag.DEclampsia = DatosEvaluacion.Tables[0].Rows[0]["DEclampsia"];
            @ViewBag.DHtt = DatosEvaluacion.Tables[0].Rows[0]["DHtt"];
            @ViewBag.DDesnutricion = DatosEvaluacion.Tables[0].Rows[0]["DDesnutricion"];
            @ViewBag.DDiabetesMellitus = DatosEvaluacion.Tables[0].Rows[0]["DDiabetesMellitus"];
            @ViewBag.DHepatitisB = DatosEvaluacion.Tables[0].Rows[0]["DHepatitisB"];
            @ViewBag.DAnemia = DatosEvaluacion.Tables[0].Rows[0]["DAnemia"];
            @ViewBag.DHipoHipertiroides = DatosEvaluacion.Tables[0].Rows[0]["DHipoHipertiroides"];
            @ViewBag.DOtrosEnfermedadesMaternas = DatosEvaluacion.Tables[0].Rows[0]["DOtrosEnfermedadesMaternas"];
            //-----------------------EXAMEN AUXILAIRES DE LA MADRE--------------------------------------
            @ViewBag.GrupoSanguineo = DatosEvaluacion.Tables[0].Rows[0]["GrupoSanguineo"];
            @ViewBag.FechaResultadoGrupoSanguineo = DatosEvaluacion.Tables[0].Rows[0]["FechaResultadoGrupoSanguineo"];
            @ViewBag.Hemoglobina = DatosEvaluacion.Tables[0].Rows[0]["Hemoglobina"];
            @ViewBag.FechaResultadoHemoglobina = DatosEvaluacion.Tables[0].Rows[0]["FechaResultadoHemoglobina"];
            @ViewBag.FactorRH = DatosEvaluacion.Tables[0].Rows[0]["FactorRH"];
            @ViewBag.FechaResultadoFactorRH = DatosEvaluacion.Tables[0].Rows[0]["FechaResultadoFactorRH"];
            @ViewBag.Hematocrito = DatosEvaluacion.Tables[0].Rows[0]["Hematocrito"];
            @ViewBag.FechaResultadoHematocrito = DatosEvaluacion.Tables[0].Rows[0]["FechaResultadoHematocrito"];
            @ViewBag.Vdrl = DatosEvaluacion.Tables[0].Rows[0]["Vdrl"];
            @ViewBag.Coombs = DatosEvaluacion.Tables[0].Rows[0]["Coombs"];
            @ViewBag.HIV = DatosEvaluacion.Tables[0].Rows[0]["HIV"];
            @ViewBag.HepatitisB = DatosEvaluacion.Tables[0].Rows[0]["HepatitisB"];
            @ViewBag.Covid19 = DatosEvaluacion.Tables[0].Rows[0]["Covid19"];
            @ViewBag.ComentariosExamenesAuxiliares = DatosEvaluacion.Tables[0].Rows[0]["ComentariosExamenesAuxiliares"];
            @ViewBag.EcografiaExamenesAuxiliares = DatosEvaluacion.Tables[0].Rows[0]["EcografiaExamenesAuxiliares"];
            //-----------------------ANTECEDENTES FAMILIARES---------------------------------------- -
            @ViewBag.Diabetes = DatosEvaluacion.Tables[0].Rows[0]["Diabetes"];
            @ViewBag.DiabetesDescripcion = DatosEvaluacion.Tables[0].Rows[0]["DiabetesDescripcion"];
            @ViewBag.Tbc = DatosEvaluacion.Tables[0].Rows[0]["Tbc"];            
            @ViewBag.TbcDescripcion = DatosEvaluacion.Tables[0].Rows[0]["TbcDescripcion"];
            @ViewBag.Hta = DatosEvaluacion.Tables[0].Rows[0]["Hta"];
            @ViewBag.HtaDescripcion = DatosEvaluacion.Tables[0].Rows[0]["HtaDescripcion"];
            @ViewBag.Gemelares = DatosEvaluacion.Tables[0].Rows[0]["Gemelares"];
            @ViewBag.GemelaresDescripcion = DatosEvaluacion.Tables[0].Rows[0]["GemelaresDescripcion"];
            @ViewBag.Malformaciones = DatosEvaluacion.Tables[0].Rows[0]["Malformaciones"];
            @ViewBag.MalformacionesDescripcion = DatosEvaluacion.Tables[0].Rows[0]["MalformacionesDescripcion"];            
            @ViewBag.OtrosAntecedentesFamiliares = DatosEvaluacion.Tables[0].Rows[0]["OtrosAntecedentesFamiliares"];
            @ViewBag.OtrosAntecedentesFamiliaresDescripcion = DatosEvaluacion.Tables[0].Rows[0]["OtrosAntecedentesFamiliaresDescripcion"];
            @ViewBag.ComentariosAntecedentesFamiliares = DatosEvaluacion.Tables[0].Rows[0]["ComentariosAntecedentesFamiliares"];
            //--====================== ANTECEDENTES NATALES, ALBOR, Y PARTO=================================================
            @ViewBag.FechaInicioLaborParto = DatosEvaluacion.Tables[0].Rows[0]["FechaInicioLaborParto"];
            @ViewBag.PrimerPeriodo = DatosEvaluacion.Tables[0].Rows[0]["PrimerPeriodo"];
            @ViewBag.SegundoPeriodo = DatosEvaluacion.Tables[0].Rows[0]["SegundoPeriodo"];

            @ViewBag.TipoInicioLaborParto = DatosEvaluacion.Tables[0].Rows[0]["TipoInicioLaborParto"];
            @ViewBag.TipoDetalleCesarea = DatosEvaluacion.Tables[0].Rows[0]["TipoDetalleCesarea"];
            @ViewBag.TipoAnestesiaAplicada = DatosEvaluacion.Tables[0].Rows[0]["TipoAnestesiaAplicada"];
            @ViewBag.TipoPlacenta = DatosEvaluacion.Tables[0].Rows[0]["TipoPlacenta"];
            @ViewBag.TipoPresentacionFetal = DatosEvaluacion.Tables[0].Rows[0]["TipoPresentacionFetal"];
            @ViewBag.TipoSufrimientoFetal = DatosEvaluacion.Tables[0].Rows[0]["TipoSufrimientoFetal"];
            @ViewBag.TipoLiquidoAmniotico = DatosEvaluacion.Tables[0].Rows[0]["TipoLiquidoAmniotico"];
            @ViewBag.TipoMedicamentos = DatosEvaluacion.Tables[0].Rows[0]["TipoMedicamentos"];
            @ViewBag.TipoDetalleParto = DatosEvaluacion.Tables[0].Rows[0]["TipoDetalleParto"];
            @ViewBag.TipoTrabajoParto = DatosEvaluacion.Tables[0].Rows[0]["TipoTrabajoParto"];
            @ViewBag.TipoCordonUmbilical = DatosEvaluacion.Tables[0].Rows[0]["TipoCordonUmbilical"];
            @ViewBag.TipoLugarParto = DatosEvaluacion.Tables[0].Rows[0]["TipoLugarParto"];
            @ViewBag.OtrosMedicamentos = DatosEvaluacion.Tables[0].Rows[0]["OtrosMedicamentos"];

            @ViewBag.RupturaMembranaMinutos = DatosEvaluacion.Tables[0].Rows[0]["RupturaMembranaMinutos"];
            @ViewBag.RupturaMembranaHoras = DatosEvaluacion.Tables[0].Rows[0]["RupturaMembranaHoras"];
            @ViewBag.RupturaMembranaDias = DatosEvaluacion.Tables[0].Rows[0]["RupturaMembranaDias"];

            //@ViewBag.Parto = DatosEvaluacion.Tables[0].Rows[0]["Parto"];
            //@ViewBag.ComplicacionParto = DatosEvaluacion.Tables[0].Rows[0]["ComplicacionParto"];
            //@ViewBag.PosicionParto = DatosEvaluacion.Tables[0].Rows[0]["PosicionParto"];
            //@ViewBag.ConAcompaniante = DatosEvaluacion.Tables[0].Rows[0]["ConAcompaniante"];
            //@ViewBag.ConAnaglgesia = DatosEvaluacion.Tables[0].Rows[0]["ConAnaglgesia"];
            //@ViewBag.TrasladoConjunto = DatosEvaluacion.Tables[0].Rows[0]["TrasladoConjunto"];
            @ViewBag.ObservacionesLaborParto = DatosEvaluacion.Tables[0].Rows[0]["ObservacionesLaborParto"];

            //--================================ MOTIVO INGRESO ================================================
            @ViewBag.NinoSano = DatosEvaluacion.Tables[0].Rows[0]["NinoSano"];
            @ViewBag.Prematuridad = DatosEvaluacion.Tables[0].Rows[0]["Prematuridad"];
            @ViewBag.Sdr = DatosEvaluacion.Tables[0].Rows[0]["Sdr"];
            @ViewBag.Apnea = DatosEvaluacion.Tables[0].Rows[0]["Apnea"];
            @ViewBag.Bpn = DatosEvaluacion.Tables[0].Rows[0]["Bpn"];
            @ViewBag.AsfixiaSevera = DatosEvaluacion.Tables[0].Rows[0]["AsfixiaSevera"];
            @ViewBag.Shock = DatosEvaluacion.Tables[0].Rows[0]["Shock"];
            @ViewBag.Mbpn = DatosEvaluacion.Tables[0].Rows[0]["Mbpn"];
            @ViewBag.Embpn = DatosEvaluacion.Tables[0].Rows[0]["Embpn"];
            @ViewBag.Sepsis = DatosEvaluacion.Tables[0].Rows[0]["Sepsis"];
            @ViewBag.Rciu = DatosEvaluacion.Tables[0].Rows[0]["Rciu"];
            @ViewBag.Convulsion = DatosEvaluacion.Tables[0].Rows[0]["Convulsion"];
            @ViewBag.TraumaObstetrico = DatosEvaluacion.Tables[0].Rows[0]["TraumaObstetrico"];
            @ViewBag.MalfomacionCongenita = DatosEvaluacion.Tables[0].Rows[0]["MalfomacionCongenita"];
            @ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];
            @ViewBag.OtrosSintomasDescripcion = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomasDescripcion"];

            @ViewBag.RelatoCronologico = DatosEvaluacion.Tables[0].Rows[0]["RelatoCronologico"];




            //==========================ANTECEDENTES PERIANTALES Y NACIMIENTO=============================================
            @ViewBag.Embarazo = DatosEvaluacion.Tables[1].Rows[0]["Embarazo"];
            @ViewBag.NroEmbarazo = DatosEvaluacion.Tables[1].Rows[0]["NroEmbarazo"];
            @ViewBag.AttPrenatal = DatosEvaluacion.Tables[1].Rows[0]["AttPrenatal"];
            @ViewBag.NroApn = DatosEvaluacion.Tables[1].Rows[0]["NroApn"];
            @ViewBag.LugarApn = DatosEvaluacion.Tables[1].Rows[0]["LugarApn"];
            @ViewBag.Gesta = DatosEvaluacion.Tables[1].Rows[0]["Gesta"];
            @ViewBag.Paridad = DatosEvaluacion.Tables[1].Rows[0]["Paridad"];
            @ViewBag.AtendidoPor = DatosEvaluacion.Tables[1].Rows[0]["AtendidoPor"];
            @ViewBag.ResponsableAtencion = DatosEvaluacion.Tables[1].Rows[0]["ResponsableAtencion"];
            @ViewBag.ComplicacionParto = DatosEvaluacion.Tables[1].Rows[0]["ComplicacionParto"];
            @ViewBag.ComplicacionPartoDetalle = DatosEvaluacion.Tables[1].Rows[0]["ComplicacionPartoDetalle"];
            @ViewBag.PosicionParto = DatosEvaluacion.Tables[1].Rows[0]["PosicionParto"];
            @ViewBag.ConAcompaniante = DatosEvaluacion.Tables[1].Rows[0]["ConAcompaniante"];
            @ViewBag.ConAnalgesia = DatosEvaluacion.Tables[1].Rows[0]["ConAnalgesia"];
            @ViewBag.ConTrasladoConjunto = DatosEvaluacion.Tables[1].Rows[0]["ConTrasladoConjunto"];
            @ViewBag.FechaNacimiento = DatosEvaluacion.Tables[1].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = DatosEvaluacion.Tables[1].Rows[0]["HoraNacimiento"];
            @ViewBag.Sexo = DatosEvaluacion.Tables[1].Rows[0]["Sexo"];
            @ViewBag.TipoGestacion = DatosEvaluacion.Tables[1].Rows[0]["TipoGestacion"];
            @ViewBag.Fetos = DatosEvaluacion.Tables[1].Rows[0]["Fetos"];
            @ViewBag.NroGemelar = DatosEvaluacion.Tables[1].Rows[0]["NroGemelar"];
            @ViewBag.Condicion = DatosEvaluacion.Tables[1].Rows[0]["Condicion"];
            @ViewBag.Obito = DatosEvaluacion.Tables[1].Rows[0]["Obito"];
            @ViewBag.Peso = DatosEvaluacion.Tables[1].Rows[0]["Peso"];
            @ViewBag.Talla = DatosEvaluacion.Tables[1].Rows[0]["Talla"];
            @ViewBag.PerimetroCefalico = DatosEvaluacion.Tables[1].Rows[0]["PerimetroCefalico"];
            @ViewBag.PerimetroToracico = DatosEvaluacion.Tables[1].Rows[0]["PerimetroToracico"];
            @ViewBag.EdadGes = DatosEvaluacion.Tables[1].Rows[0]["EdadGes"];
            @ViewBag.TiempoClampaje = DatosEvaluacion.Tables[1].Rows[0]["TiempoClampaje"];
            @ViewBag.ClampadoTardio = DatosEvaluacion.Tables[1].Rows[0]["ClampadoTardio"];
            @ViewBag.PielaPiel = DatosEvaluacion.Tables[1].Rows[0]["PielaPiel"];
            @ViewBag.Lactancia1raHora = DatosEvaluacion.Tables[1].Rows[0]["Lactancia1raHora"];
            @ViewBag.ServicioNacimiento = DatosEvaluacion.Tables[1].Rows[0]["ServicioNacimiento"];
            @ViewBag.OtraProcedencia = DatosEvaluacion.Tables[1].Rows[0]["OtraProcedencia"];
            @ViewBag.Inmediato = DatosEvaluacion.Tables[1].Rows[0]["Inmediato"];
            @ViewBag.Reanimacion = DatosEvaluacion.Tables[1].Rows[0]["Reanimacion"];
            @ViewBag.AlMinuto = DatosEvaluacion.Tables[1].Rows[0]["AlMinuto"];
            @ViewBag.Alos5Minutos = DatosEvaluacion.Tables[1].Rows[0]["Alos5Minutos"];
            @ViewBag.Alos10Minutos = DatosEvaluacion.Tables[1].Rows[0]["Alos10Minutos"];
            @ViewBag.Alos15Minutos = DatosEvaluacion.Tables[1].Rows[0]["Alos15Minutos"];
            @ViewBag.Alos20Minutos = DatosEvaluacion.Tables[1].Rows[0]["Alos20Minutos"];
            @ViewBag.PatologiaNeonatal = DatosEvaluacion.Tables[1].Rows[0]["PatologiaNeonatal"];
            @ViewBag.PatologiaNeonatalDetalle = DatosEvaluacion.Tables[1].Rows[0]["PatologiaNeonatalDetalle"];







            //@ViewBag.TiempoEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["TiempoEnfermedad"];
            //@ViewBag.Inicio = DatosEvaluacion.Tables[0].Rows[0]["Inicio"];
            //@ViewBag.Curso = DatosEvaluacion.Tables[0].Rows[0]["Curso"];

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
            //@ViewBag.Otros = DatosEvaluacion.Tables[0].Rows[0]["Otros"];
            //@ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];

            //@ViewBag.Relato = DatosEvaluacion.Tables[0].Rows[0]["Relato"];

            //@ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
            //@ViewBag.PesoNacer = DatosEvaluacion.Tables[0].Rows[0]["PesoNacer"];
            //@ViewBag.TallaNacer = DatosEvaluacion.Tables[0].Rows[0]["TallaNacer"];
            //@ViewBag.PerimetroCefalicoNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroCefalicoNacer"];
            //@ViewBag.PerimetroToracioNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroToracioNacer"];
            //@ViewBag.ApgarNacer = DatosEvaluacion.Tables[0].Rows[0]["ApgarNacer"];
            //@ViewBag.AntecedentesPatlogicosNacer = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesPatlogicosNacer"];
            //@ViewBag.EdadGestacionalNacer = DatosEvaluacion.Tables[0].Rows[0]["EdadGestacionalNacer"];

            @ViewBag.TriajePresionArterial = DatosEvaluacion.Tables[0].Rows[0]["TriajePresionArterial"];            
            @ViewBag.TriajeFrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["TriajeFrecuenciaCardiaca"];
            @ViewBag.TriajeFrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["TriajeFrecuenciaRespiratoria"];
            @ViewBag.TriajeTemperatura = DatosEvaluacion.Tables[0].Rows[0]["TriajeTemperatura"];
            @ViewBag.TriajePeso = DatosEvaluacion.Tables[0].Rows[0]["TriajePeso"];
            @ViewBag.TriajeTalla = DatosEvaluacion.Tables[0].Rows[0]["TriajeTalla"];
            @ViewBag.TriajeSO = DatosEvaluacion.Tables[0].Rows[0]["TriajeSO"];

            @ViewBag.EstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EstadoGeneralSensorio"];
            @ViewBag.DEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["DEstadoGeneralSensorio"];
            @ViewBag.EEstadoGeneralSensorio = DatosEvaluacion.Tables[0].Rows[0]["EEstadoGeneralSensorio"];
            @ViewBag.Piel = DatosEvaluacion.Tables[0].Rows[0]["Piel"];
            @ViewBag.DPiel = DatosEvaluacion.Tables[0].Rows[0]["DPiel"];
            @ViewBag.Craneo = DatosEvaluacion.Tables[0].Rows[0]["Craneo"];
            @ViewBag.DCraneo = DatosEvaluacion.Tables[0].Rows[0]["DCraneo"];
            @ViewBag.PabellonAuricular = DatosEvaluacion.Tables[0].Rows[0]["PabellonAuricular"];
            @ViewBag.DPabellonAuricular = DatosEvaluacion.Tables[0].Rows[0]["DPabellonAuricular"];
            @ViewBag.Cara = DatosEvaluacion.Tables[0].Rows[0]["Cara"];
            @ViewBag.DCara = DatosEvaluacion.Tables[0].Rows[0]["DCara"];
            @ViewBag.BocaORL = DatosEvaluacion.Tables[0].Rows[0]["BocaORL"];
            @ViewBag.DBocaORL = DatosEvaluacion.Tables[0].Rows[0]["DBocaORL"];
            @ViewBag.Cuello = DatosEvaluacion.Tables[0].Rows[0]["Cuello"];
            @ViewBag.DCuello = DatosEvaluacion.Tables[0].Rows[0]["DCuello"];
            @ViewBag.Clavicula = DatosEvaluacion.Tables[0].Rows[0]["Clavicula"];
            @ViewBag.DClavicula = DatosEvaluacion.Tables[0].Rows[0]["DClavicula"];
            @ViewBag.ToraxSilv = DatosEvaluacion.Tables[0].Rows[0]["ToraxSilv"];
            @ViewBag.DToraxSilv = DatosEvaluacion.Tables[0].Rows[0]["DToraxSilv"];
            //@ViewBag.Ojos = DatosEvaluacion.Tables[0].Rows[0]["Ojos"];            //230625
            //@ViewBag.DOjos = DatosEvaluacion.Tables[0].Rows[0]["DOjos"];            //230625
            @ViewBag.ReflejoRojo = DatosEvaluacion.Tables[0].Rows[0]["ReflejoRojo"];            //240625
            @ViewBag.DReflejoRojo = DatosEvaluacion.Tables[0].Rows[0]["DReflejoRojo"];            //240625
            @ViewBag.AparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["AparatoCardioVascular"];
            @ViewBag.DAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["DAparatoCardioVascular"];
            @ViewBag.RAparatoCardioVascular = DatosEvaluacion.Tables[0].Rows[0]["RAparatoCardioVascular"];
            @ViewBag.Abdomen = DatosEvaluacion.Tables[0].Rows[0]["Abdomen"];
            @ViewBag.DAbdomen = DatosEvaluacion.Tables[0].Rows[0]["DAbdomen"];
            @ViewBag.Ombligo = DatosEvaluacion.Tables[0].Rows[0]["Ombligo"];
            @ViewBag.DOmbligo = DatosEvaluacion.Tables[0].Rows[0]["DOmbligo"];
            @ViewBag.Ano = DatosEvaluacion.Tables[0].Rows[0]["Ano"];
            @ViewBag.DAno = DatosEvaluacion.Tables[0].Rows[0]["DAno"];
            @ViewBag.Genitales = DatosEvaluacion.Tables[0].Rows[0]["Genitales"];
            @ViewBag.DGenitales = DatosEvaluacion.Tables[0].Rows[0]["DGenitales"];
            @ViewBag.ExtSuperiores = DatosEvaluacion.Tables[0].Rows[0]["ExtSuperiores"];
            @ViewBag.DExtSuperiores = DatosEvaluacion.Tables[0].Rows[0]["DExtSuperiores"];
            @ViewBag.ExtInferiores = DatosEvaluacion.Tables[0].Rows[0]["ExtInferiores"];
            @ViewBag.DExtInferiores = DatosEvaluacion.Tables[0].Rows[0]["DExtInferiores"];
            @ViewBag.Columna = DatosEvaluacion.Tables[0].Rows[0]["Columna"];
            @ViewBag.DColumna = DatosEvaluacion.Tables[0].Rows[0]["DColumna"];
            @ViewBag.SistemaNervioso = DatosEvaluacion.Tables[0].Rows[0]["SistemaNervioso"];
            @ViewBag.DSistemaNervioso = DatosEvaluacion.Tables[0].Rows[0]["DSistemaNervioso"];

            @ViewBag.RelatoExamenFisico = DatosEvaluacion.Tables[0].Rows[0]["RelatoExamenFisico"];

            @ViewBag.DxEvaluacion = dtDx;

            @ViewBag.Evaluacion = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            @ViewBag.PlanTrabajo = DatosEvaluacion.Tables[0].Rows[0]["PlanTrabajo"];
            @ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];

            @ViewBag.TipoDestino = DatosEvaluacion.Tables[0].Rows[0]["TipoDestino"];
            @ViewBag.TipoAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoAlta"];
            @ViewBag.TipoCondicionAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoCondicionAlta"];

            @ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];

            @ViewBag.CodeFirma = DatosEvaluacion.Tables[0].Rows[0]["code"];

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



            if (eval == 1)
            {
                return PartialView("~/Views/Hospitalizacion/Plantillas/InformeEvaluacionNeonatal.cshtml");
            }
            else
            {
                return PartialView("~/Views/Hospitalizacion/Plantillas/InformeReEvaluacionNeonatal.cshtml");
            }

        }
        #endregion

        [HttpPost]
        public async Task<ActionResult> GenerarRecetaPdf(int idCuentaAtencion, int idReceta, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String htmlTablaDetalle, htmlTablaItem, telefono, nombre, direccion, html/*, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia, strInterconsulta*/;
            html = "";
            htmlTablaItem = "";
            string generacion_pdf = "";
            string sWebRootFolder = "";
            var path = "";
            //string tipo;
            bool resulfirma = false;
            //bool resp = false;

            bool farmaciaHospi = false;
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();
            Comun.ClUtilirario cl = new Comun.ClUtilirario();
            Conexion con = new Conexion();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            sWebRootFolder = con.ObtenerServidorArchivos();
            tipo = "REC-" + tipo;
            path = Path.Combine(sWebRootFolder, "Recetas", (idCuentaAtencion + idReceta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            string idAtencion = "0";
            //String diagnosticos = "";

            //strRx = "";
            //strEcoGene = "";
            //strEcoObs = "";
            //strAnaPatolo = "";
            //strPatoloClinica = "";
            //strBs = "";
            //strFarmacia = "";
            //strInterconsulta = "";

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = await daoRecetas.ListaRecetaCabeceraById2(idReceta); // JDELGADO J0 AWAIT SENTENCE



            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>" + nombre + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>" + direccion + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Orden Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            String hmtlCabeceraFarmacia = "";
            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
               "           <table font size=8pt  width='100%' >" +
               "               <tr>" +
               "                   <td align='center'> <b>" + nombre + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>" + direccion + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "           </table>";

            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
                "           <table font size=8pt  width='100%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Receta Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();




            string fechaRecetaAux = "";
            //Substring(0, 10);

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                fechaRecetaAux = dr["fechaReceta"].ToString();
                fechaRecetaAux = fechaRecetaAux.Substring(0, 10);
                if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "3" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "4"))
                {
                    html = "";
                    html = html + "<table width='100%' ><tr><td width='50%'>" + hmtlCabeceraFarmacia + "</td><td width='50%'>" + hmtlCabeceraFarmacia + "</td></tr></table>";
                    html = html + "<table  width='100%'>" +
                                    "<tr>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Tipo Plan: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() + " -  <b>Edad:</b> " + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " - <b>Cuenta: </b>" + idCuentaAtencion + " </td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "</tr>" +
                                  "</table>";
                }
                else
                {
                    html = html + "<br>" +
                 "           <table font size=8pt  width='40%' style='font - size:8px' >" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Fecha Aten.:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + fechaRecetaAux +
                 "                   </td>" +
                 "               </tr>" +
                 //RQ0006 RMOREANOC
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro.Historia:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 //FIN RQ0006
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Cuenta:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + idCuentaAtencion +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Orden:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["idReceta"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Consultorio:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Prof. Salud:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["Medico"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Paciente:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Tipo Plan:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "           </table><br>";
                }


                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Rayos X)" + "Nro.Receta:" + dr["idReceta"].ToString() + " <hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco obste
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia Obstetrica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco geenral
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
                {

                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia General)<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //patoclini
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Patologica Clinica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //anatalomiaPa
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Anatomia Patologica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td  align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //sangre
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Banco de Sangre)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //interconsulta añadido por jdelgado011
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Interconsulta)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta); // JDELGADO011
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //farmacia
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    //if (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3")
                    if ((lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "2" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "4"))
                    {
                        farmaciaHospi = false;
                        html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Farmacia)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cant.</td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                    }
                    else
                    {
                        farmaciaHospi = true;

                        html = html + "<table>";
                        //html = html + "&nbsp;<b> Nro.Receta: </b>" + dr["idReceta"].ToString() + "<br>";
                        //html = html + "&nbsp;<b> Receta del Servicio: </b>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "";
                        html = html + "<tr><td width='100px'><b> Nro.Receta: </b></td><td>" + dr["idReceta"].ToString() + "<br></td></tr>";
                        html = html + "<tr><td width='100px'><b> Rec. del Serv.: </b></td><td>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "</td></tr>";
                        html = html + "</table>";

                        htmlTablaItem = "<table FRAME='hsides' RULES='rows'>";
                        htmlTablaItem = htmlTablaItem + "<tr><td></td><td><b>Concepto</b></td><td><b>Cant.</b></td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                        htmlTablaItem = htmlTablaItem + "</table><br><br><br><br>";
                        htmlTablaItem = htmlTablaItem + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                    }
                }
            };

            string htmlDosisFamr;
            htmlDosisFamr = "";
            //RQ0003 RMOREANOC
            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' ><tr><td align='center'> <b>INDICACIONES</b></td></tr></table>";
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' >";
                    htmlDosisFamr = htmlDosisFamr + "<tr><td width='5%'></td><td><b>Concepto</b></td><td align='center'><b>Dosis</b></td><td align='center'><b>Vias</b></td><td align='center'><b>Frecuencia</b></td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlDosisFamr = htmlDosisFamr + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["Dosis"].ToString() + "</td>" + "<td align = 'center'>" + drD["Vias"].ToString() + "</td>" + "<td align = 'center'>" + drD["Observaciones"].ToString() + "</td></tr>";
                    }
                    htmlDosisFamr = htmlDosisFamr + "</table><br><br><br>";
                    htmlDosisFamr = htmlDosisFamr + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                }
            };
            //RQ0003 RMOREANO 
            if (farmaciaHospi)
            {
                htmlTablaDetalle = "<table font size=8pt width='100%' style='font - size:8px'>" +
                                    " <tr><td width='50%' valign='top' >" + htmlTablaItem + "</td> <td width='50%' valign='top'>" + htmlDosisFamr + "</td></tr>" +
                                    " </table>";
            }
            else
            {
                htmlTablaDetalle = "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td >" + htmlTablaItem + "</td></tr></table>";
                htmlTablaDetalle = htmlTablaDetalle + "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td>" + htmlDosisFamr + "</td></tr></table>";
            }
            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico); // JDELGADO J0 AWAIT SENTENCE

            string htmldiagnosticosDetalle = "";
            string htmldiagnosticostable = "";

            foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
            {
                htmldiagnosticosDetalle = htmldiagnosticosDetalle + "<tr><td>" + dr["codigoCIE10"].ToString() + "</td><td>" + dr["descripcion"].ToString() + "</td></tr>";

            };
            if (farmaciaHospi)
            {
                htmldiagnosticostable = htmldiagnosticostable + "<hr><b>Diagnositicos</b>";
                htmldiagnosticostable = htmldiagnosticostable + "<table width='50%'><tr><td><b>CIE 10</b></td><td><b>Descripcion</b></td></tr>" + htmldiagnosticosDetalle + "</table><br>";
            }
            else
            {
                htmldiagnosticostable = htmldiagnosticostable + "";
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            html = html + htmldiagnosticostable + htmlTablaDetalle + " <br><b>Usuario WEB:" + idUsuario + "</b>";

            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;
            HtmlToPdf ohtml = new HtmlToPdf();
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

            obPdfDoc.Save(path);
            generacion_pdf = "Ok";

            if (generacion_pdf == "Ok")
            {
                //verificar creacion 
                Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idReceta.ToString()));
                //quita creacion 
                //Espera resultado de la tarea, no termina hasta termine
                resulfirma = await Tbol;
                //resp = true;
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
            //byte[] pdf = obPdfDoc.Save();

            //MemoryStream ms = new MemoryStream();
            //ms = new MemoryStream();
            //ms.Write(pdf, 0, pdf.Length);
            //ms.Position = 0;

            //obPdfDoc.Close();

            //return new FileStreamResult(
            //        ms,
            //        MediaTypeNames.Application.Pdf
            //    );
        }

    }
}
