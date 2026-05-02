using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class InterconsultasHOController: BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta(int idReceta, int historiaClinica, string apellidoPaterno, string fechaIngreso, string dni, int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalHospitalizacion daoHosp = new DalHospitalizacion();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await daoHosp.ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta(idReceta, historiaClinica, apellidoPaterno, fechaIngreso, dni, idServicio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }



        [HttpPost]
        public async Task<ActionResult> CreateUpdateAtencionDetalleInterconsulta(AtencionDetalleInterconsulta atencionDetalleInterconsulta, int idAtencion, string lstDiagnosticos) //JDELGADO010
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalInterconsultasHO dalInterconsultasHO = new DalInterconsultasHO();
            DalUtilitario dalUtilitario = new DalUtilitario();
            int resp;
            int idUsuario;
            var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            try
            {
                resp = await dalInterconsultasHO.CreateUpdateAtencionDetalleInterconsulta(atencionDetalleInterconsulta);
                await dalUtilitario.insertaDiagnosticosInterconsultaHO(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idUsuario, lstobjDiagnosticos, resp, 0); // JDELGADO003-M
                
            }
            catch (Exception e)
            {
                return Json(new { session = true, mensaje = e.Message + "- Bloque de registro 1" });
            }
            

            var fua = await GenerarInterconsultaPdfV2(atencionDetalleInterconsulta.idCuentaAtencion, resp, atencionDetalleInterconsulta.idProducto, atencionDetalleInterconsulta.idReceta);

            return Json(new { dataSet = "", session = true, resp, estado = true });
        }
        //public async Task<ActionResult> RegitraModificaNotaIngreso( // version nueva // JDELGADO003-M
        //    EvaluacionEmergencia objEvalEmg, ExamenGinecoObstetra objGiencoObst, Triaje obTriaje, int idServicio, int idNumero,
        //    int idNumeroSiguiente, int estadoBtn, String lstDiagnosticos, string lstRecetaRx, int idRecetaRx, string lstRecetaEcoObs, int idRecetaEcoObs,
        //    string lstRecetaEcoGeneral, int idRecetaEcoGene, string lstRecetaAnatoPatologica, int idRecetaAnaPatologica, string lstRecetaPatalogiaClinica,
        //    int idRecetaPatoClinica, string lstRecetaBancoSangre, int idRecetaBancoSangre, string lstRecetaFarmacia, int idRecetaFarmacia, string fechaVigencia,
        //    int idCuentaAtencion, AtencionesDatosAdicionales objDatosAdic, EvaluacionEmergenciaDetalle objEvalEmergDeta, int idMedico)
        //{
        //[HttpPost]
        //public void Task<ActionResult> CreateUpdateAtencionDetalleInterconsulta(AtencionDetalleInterconsulta atencionDetalleInterconsulta)
        //{
        //    return null;
        //}

        /////////////////////////// JDELGADO
        [HttpPost]
        public async Task<ActionResult> ListaAtencionDetalleInterconsultaByIdCuentaAtencion(int idCuenta, int idReceta, int idProducto)
        {
            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }
                DataSet lsAtencionByCuenta;
                DalInterconsultasHO dalInterconsultasHO = new DalInterconsultasHO();
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                lsAtencionByCuenta = await dalInterconsultasHO.ListaAtencionDetalleInterconsultaByIdCuentaAtencion(idCuenta, idReceta, idProducto);
                return Json(new { lstAtenciones = lsAtencionByCuenta, session = true, estado = true });
            });

        }
        ////////////////////////// END
        [HttpPost]
        public async Task<ActionResult> GenerarFormatoInterconsulta(int idCuentaAtencion, int idAtencionInterconsulta, int? idProducto, int idReceta)
        {
            string rsp = "";
            bool bSesion = true;
            string respuesta = "Error al generar formato";
            DalParametros daoParametros = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
            }
            try
            {
                var resp = await GenerarInterconsultaPdf(idCuentaAtencion, idAtencionInterconsulta, idProducto, idReceta);

                rsp = "Ok";
                respuesta = "Se creo el formato FUA correctamente.";
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            //return true;
        }

        [HttpPost]
        public async Task<Boolean> GenerarInterconsultaPdfV2(int idCuentaAtencion, int idAtencionInterconsulta, int idProducto, int idReceta)
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
                pageHtml = Url.Action("SolicitudDeInterconsulta", "InterconsultasHO", new { area = "Hospitalizacion", idCuentaAtencion, idReceta, idProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idReceta, idProducto, "INTER-HO", idAtencionInterconsulta, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


        public async Task<ActionResult> GenerarInterconsultaPdf(int idCuentaAtencion, int idAtencionInterconsulta, int? idProducto, int idReceta)//int Anio, String NroHistoria, int bd)
        {
            string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            //bool resp = false;
            string usuario;
            int idUsuario;
            string tipo;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            MemoryStream ms = new MemoryStream();
            DalParametros daoParametros = new DalParametros();
            //byte[] pdf;

            try
            {
                usuario = HttpContext.Session.GetString("usuario");
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                tipo = "INTER";

                path = Path.Combine(sWebRootFolder, "Interconsultas", (idCuentaAtencion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                
                Comun.ClUtilirario cl = new Comun.ClUtilirario();

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

                string Ruta = Url.Action("SolicitudDeInterconsulta", "InterconsultasHO", new { area = "Hospitalizacion", idCuentaAtencion, idReceta, idProducto }, "http");
                PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                obPdfDoc.Save(path);
                generacion_pdf = "Ok";

                if (generacion_pdf == "Ok")
                {
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idAtencionInterconsulta.ToString()));
                    //quita creacion 
                    //Espera resultado de la tarea, no termina hasta termine
                    resulfirma = await Tbol;
                    //resp = true;
                }
            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });

        }
        /// <summary
        /// </summary>
        /// <param name="idCuentaAtencion"></param>
        /// <returns></returns>
        public async Task<ActionResult> SolicitudDeInterconsulta(int idCuentaAtencion, int idReceta, int idProducto)
        {
            DalParametros dalParam = new DalParametros();
            DalInterconsultasHO dalInterconsultasHO = new DalInterconsultasHO();
            DalAtenciones dalAtenciones = new DalAtenciones();
            DalConsumoServicio dalconsumo = new DalConsumoServicio();

            DataSet dsInterconsultas;
            DataSet DatosParametros;
            DataSet Diagnosticos;

            DatosParametros = dalParam.SeleccionaFilaParametro(205);
            @ViewBag.RenaesIpress = DatosParametros.Tables[0].Rows[0]["ValorTexto"].ToString();

            DatosParametros = dalParam.SeleccionaFilaParametro(280);
            @ViewBag.NombreIpress = DatosParametros.Tables[0].Rows[0]["ValorTexto"].ToString();

            DatosParametros = dalParam.SeleccionaFilaParametro(1007);
            @ViewBag.SiglasIpress = DatosParametros.Tables[0].Rows[0]["ValorTexto"].ToString(); 

            dsInterconsultas = await dalInterconsultasHO.ListaAtencionDetalleInterconsultaByIdCuentaAtencion(idCuentaAtencion, idReceta, idProducto);
            Diagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarPorInterconsulta(Int32.Parse(dsInterconsultas.Tables[0].Rows[0]["IdAtencion"].ToString()), (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, 0, Int32.Parse(dsInterconsultas.Tables[0].Rows[0]["idAtencionInterconsulta"].ToString()));

            DataSet Procedimientos = await dalconsumo.BuscaAtencionesCptCEparaFormatoHISInterconsulta(idCuentaAtencion);

            DataTable dtDx = Diagnosticos.Tables[0];
            DataTable dtProc = Procedimientos.Tables[0];


            @ViewBag.servicioProcedencia = dsInterconsultas.Tables[0].Rows[0]["servicioProcedencia"].ToString();
            @ViewBag.especialidad = dsInterconsultas.Tables[0].Rows[0]["especialidad"].ToString();
            @ViewBag.edad = dsInterconsultas.Tables[0].Rows[0]["Edad"].ToString();
            @ViewBag.sexo = dsInterconsultas.Tables[0].Rows[0]["Sexo"].ToString();
            @ViewBag.cama = dsInterconsultas.Tables[0].Rows[0]["Cama"].ToString();



            @ViewBag.resumenHistoriaClinica = dsInterconsultas.Tables[0].Rows[0]["resumenHistoriaClinica"].ToString();
            @ViewBag.motivoInterconsulta = dsInterconsultas.Tables[0].Rows[0]["motivoInterconsulta"].ToString();

            @ViewBag.examenClinico = dsInterconsultas.Tables[0].Rows[0]["examenClinico"].ToString();

            @ViewBag.Tratamiento = dsInterconsultas.Tables[0].Rows[0]["Tratamiento"].ToString();
            @ViewBag.planTrabajo = dsInterconsultas.Tables[0].Rows[0]["planTrabajo"].ToString();

            @ViewBag.Nombres = dsInterconsultas.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + dsInterconsultas.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + dsInterconsultas.Tables[0].Rows[0]["nombres"].ToString();
            @ViewBag.NroHistoriaClinica = dsInterconsultas.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

            @ViewBag.horaInicioAtencion = dsInterconsultas.Tables[0].Rows[0]["horaInicioAtencion"].ToString();
            @ViewBag.fechaIngreso = dsInterconsultas.Tables[0].Rows[0]["FechaIngreso"].ToString();

            @ViewBag.resumenHistoriaClinicaOrden = dsInterconsultas.Tables[0].Rows[0]["resumenHistoriaClinicaOrden"].ToString();
            @ViewBag.motivoInterconsultaOrden = dsInterconsultas.Tables[0].Rows[0]["motivoInterconsultaOrden"].ToString();


            @ViewBag.DxInterconsulta = dtDx;
            @ViewBag.ProcInterconsulta = dtProc;
            //@ViewBag.servicioProcedencia = dsInterconsultas.Tables[0].Rows[0]["servicioProcedencia"].ToString();

            return PartialView("~/Views/Hospitalizacion/Plantillas/SolicitudDeInterconsulta.cshtml");
        }
    }
}
