using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SelectPdf;
using System.Data;
using System.IO;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Web;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class CarnetPrenatalController : BaseController
    {
        //private IHostingEnvironment _hostingEnvironment;
        private IWebHostEnvironment _hostingEnvironment;

        //public CarnetPrenatalController(IHostingEnvironment env)
        public CarnetPrenatalController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        //[HttpPost]
        ////public async Task<Boolean> GenerarCarnetPrenatal(int idPaciente)
        //public Boolean GenerarCarnetPrenatal(int idPaciente)
        //{
        //    //string rsp = "";
        //    //bool bSesion = true;
        //    string respuesta = "Error al registrar la generación de constancia.";
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        //bSesion = false;
        //        respuesta = "Su sesión a finalizado.";
        //        //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //        return false;
        //    }
        //    try
        //    {
        //        //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
        //        //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);

        //        //var resp = await GenerarPdf(idPaciente);
        //        var resp = GenerarPdf(idPaciente);

        //        //rsp = "Ok";
        //        //if (resp.estadoCreacion.ToString() == "Ok")
        //        //{
        //        respuesta = "Se registro la modificación correctamente.";
        //        //}
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = "Error al registrar," + ex.Message + ".";
        //    }
        //    //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //    return true;
        //}

        [HttpPost]
        //public async Task<Boolean> GenerarCarnetPrenatal(int idPaciente)
        public async Task<ActionResult> GenerarCarnetPrenatal(int idPaciente)
        {
            //string rsp = "";
            //bool bSesion = true;
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";
            
            try
            {
                pageHtml = Url.Action("CarnetControlPrenatal", "CarnetPrenatal", new { area = "Comun", idPaciente }, "http");
                pdf.orientacion = "Portrait";
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


        //public async Task<ActionResult> GenerarPdf(int idPaciente)//int Anio, String NroHistoria, int bd)
        public ActionResult GenerarPdf(int idPaciente)//int Anio, String NroHistoria, int bd)
        {
            //string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            //bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            //bool resp = false;
            string usuario;
            string tipo;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            MemoryStream ms = new MemoryStream();

            try
            {
                usuario = HttpContext.Session.GetString("usuario");
                tipo = "CARNET-PN";

                path = Path.Combine(sWebRootFolder, "CarnetControlPrenatal", (idPaciente + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                Console.WriteLine("path: " + path);
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
                //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;
                                
                string Ruta = Url.Action("CarnetControlPrenatal", "CarnetPrenatal", new { area = "Comun", idPaciente }, "http");
                PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
                //obPdfDoc.Save(path);

                byte[] pdf = obPdfDoc.Save();               
                ms = new MemoryStream();
                ms.Write(pdf, 0, pdf.Length);
                ms.Position = 0;
                obPdfDoc.Close();
                return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);

                /*SE COMENTO CODIGO INACCESIBLE
                generacion_pdf = "Ok";
                if (generacion_pdf == "Ok")
                {
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idPaciente.ToString()), tipo, Int32.Parse(idPaciente.ToString()));
                    //quita creacion 
                    //Espera resultado de la tarea, no termina hasta termine
                    resulfirma = await Tbol;
                    resp = true;
                }
                */
            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
                //return e.ToString();
                //return false;
                //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
            }

            //return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
            /*SE DETECTO CODIGO INACCESIBLE
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
            */
        }

        [HttpGet]
        public async Task<ActionResult> CarnetControlPrenatal(int idPaciente)
        {
            DataSet DatosCarnet;
            DataSet DatosTriajeCarnet = null;
            DataSet DatosLaboCarnet;
            DataSet DatosCarnetDetalle;
            DataTable CarnetDetalle;
            DataSet lsParametros;

            DalCarnetPrenatal daoCarnet = new DalCarnetPrenatal();
            DalParametros daoParametros = new DalParametros();

            int hemo = 1, gluco = 1, vdrl = 1, pr = 1, uro = 1;
            
            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();

            @ViewBag.FechaNacimiento = "__/__/____".ToString().Split("/");
            @ViewBag.Edad = "  ".ToString().ToCharArray(); ;
            @ViewBag.Codigo = "        ".ToString().ToCharArray(); ;
            @ViewBag.RenaesInferior = "        ".ToString().ToCharArray(); ;
            @ViewBag.NroDocumento = "          ".ToString().ToCharArray(); ;
            @ViewBag.AoGestas = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoAbortos = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoVaginales = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoNacidosVivos = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoViven = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoPartos = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoCesareas = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoNacidosMuertos = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoMuerto1Seman = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoDespues1Seman = "  ".ToString().ToCharArray(); ;
            @ViewBag.AoFechaFinEmbarazoAnt = "__/__/____".ToString().Split("/");
            @ViewBag.AfTbc = false;
            @ViewBag.AfDiabetes = false;
            @ViewBag.AfHipertencion = false;
            @ViewBag.AfPreeclampsiaEclampsia = false;
            @ViewBag.AfOtraCondMedGrave = false;
            @ViewBag.ApTbc = false;
            @ViewBag.ApDiabetes = false;
            @ViewBag.ApHipertencion = false;
            @ViewBag.ApPreeclampsiaEclampsia = false;
            @ViewBag.ApVih = false;
            @ViewBag.ApViolencia = false;
            @ViewBag.ApCirugiaMayor = false;
            @ViewBag.ApAlergia = false;
            @ViewBag.ApOtros = false;
            @ViewBag.ApVacunaPrevia = false;
            @ViewBag.AoMenor2500Gr = false;
            @ViewBag.AoMultiple = false;
            @ViewBag.AoMemor37Sm = false;
            @ViewBag.AoMayor4000G = false;
            @ViewBag.FechaEcoAct = 0;
            @ViewBag.AoEmbarazoEctopico = false;

            DatosCarnet = await daoCarnet.SeleccionarHistoriaCarnetPrenatal(idPaciente);
            if(DatosCarnet.Tables[0].Rows.Count > 0)
            {
                //========================================DATOS PERSONALES===================================================//
                @ViewBag.Nombres = DatosCarnet.Tables[0].Rows[0]["PrimerNombre"].ToString() + " " + DatosCarnet.Tables[0].Rows[0]["SegundoNombre"].ToString();
                @ViewBag.Apellidos = DatosCarnet.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + DatosCarnet.Tables[0].Rows[0]["ApellidoMaterno"].ToString();
                @ViewBag.Direccion = DatosCarnet.Tables[0].Rows[0]["DireccionDomicilio"].ToString();
                @ViewBag.Localidad = DatosCarnet.Tables[0].Rows[0]["Localidad"].ToString();
                @ViewBag.Telefono = DatosCarnet.Tables[0].Rows[0]["Telefono"].ToString();
                @ViewBag.FechaNacimiento = DatosCarnet.Tables[0].Rows[0]["FechaNaci"].ToString().Split("/");
                @ViewBag.Edad = DatosCarnet.Tables[0].Rows[0]["Edad"].ToString().ToCharArray();
                @ViewBag.EdadMenorMayor = Int32.Parse(DatosCarnet.Tables[0].Rows[0]["Edad"].ToString()) <= 15 ? "<" : Int32.Parse(DatosCarnet.Tables[0].Rows[0]["Edad"].ToString()) >= 35 ? ">" : "";
                @ViewBag.Etnia = DatosCarnet.Tables[0].Rows[0]["EtniaGen"].ToString();
                @ViewBag.Estudios = DatosCarnet.Tables[0].Rows[0]["Estudios"].ToString();
                @ViewBag.EstadoCivil = DatosCarnet.Tables[0].Rows[0]["EstadoCivil"].ToString();
                @ViewBag.NroDocumento = DatosCarnet.Tables[0].Rows[0]["NroDocumento"].ToString().ToCharArray();
                @ViewBag.Codigo = DatosCarnet.Tables[0].Rows[0]["Codigo"].ToString().ToCharArray();
                @ViewBag.RenaesInferior = DatosCarnet.Tables[0].Rows[0]["RenaesInferior"].ToString().ToCharArray();

                //====================================ANTECEDENTES FAMILIARES===================================================//
                @ViewBag.AfTbc = DatosCarnet.Tables[0].Rows[0]["Af_tbc"].ToString() == "1" ? true : false;
                @ViewBag.AfDiabetes = DatosCarnet.Tables[0].Rows[0]["Af_Diabetes"].ToString() == "1" ? true : false;
                @ViewBag.AfHipertencion = DatosCarnet.Tables[0].Rows[0]["Af_Hipertencion"].ToString() == "1" ? true : false;
                @ViewBag.AfPreeclampsiaEclampsia = DatosCarnet.Tables[0].Rows[0]["Af_PreeclampsiaEclampsia"].ToString() == "1" ? true : false;
                @ViewBag.AfOtraCondMedGrave = DatosCarnet.Tables[0].Rows[0]["Af_OtraCondMedGrave"].ToString() == "1" ? true : false;


                //====================================ANTECEDENTES PERSONALES===================================================//
                @ViewBag.ApTbc = DatosCarnet.Tables[0].Rows[0]["Ap_Tbc"].ToString() == "1" ? true : false;
                @ViewBag.ApDiabetes = DatosCarnet.Tables[0].Rows[0]["Ap_Diabetes"].ToString() == "1" ? true : false;
                @ViewBag.ApHipertencion = DatosCarnet.Tables[0].Rows[0]["Ap_Hipertencion"].ToString() == "1" ? true : false;
                @ViewBag.ApPreeclampsiaEclampsia = DatosCarnet.Tables[0].Rows[0]["Ap_PreeclampsiaEclampsia"].ToString() == "1" ? true : false;
                @ViewBag.ApVih = DatosCarnet.Tables[0].Rows[0]["Ap_Vih"].ToString() == "1" ? true : false;
                @ViewBag.ApViolencia = DatosCarnet.Tables[0].Rows[0]["Ap_Violencia"].ToString() == "1" ? true : false;
                @ViewBag.ApCirugiaMayor = DatosCarnet.Tables[0].Rows[0]["Ap_CirugiaMayor"].ToString() == "1" ? true : false;
                @ViewBag.ApAlergia = DatosCarnet.Tables[0].Rows[0]["Ap_Alergia"].ToString() == "1" ? true : false;
                @ViewBag.ApOtros = DatosCarnet.Tables[0].Rows[0]["Ap_Otros"].ToString() == "1" ? true : false;

                @ViewBag.ApVacunaPrevia = DatosCarnet.Tables[0].Rows[0]["Ap_VacunaPrevia"].ToString() == "1" ? true : false;

                //======================================ANTECEDENTES OBSTETRICOS================================================//
                @ViewBag.AoGestas = DatosCarnet.Tables[0].Rows[0]["Ao_Gestas"].ToString().ToCharArray();
                @ViewBag.AoAbortos = DatosCarnet.Tables[0].Rows[0]["Ao_Abortos"].ToString().ToCharArray();
                @ViewBag.AoVaginales = DatosCarnet.Tables[0].Rows[0]["Ao_Vaginales"].ToString().ToCharArray();
                @ViewBag.AoNacidosVivos = DatosCarnet.Tables[0].Rows[0]["Ao_NacidosVivos"].ToString().ToCharArray();
                @ViewBag.AoViven = DatosCarnet.Tables[0].Rows[0]["Ao_Viven"].ToString().ToCharArray();
                @ViewBag.AoPartos = DatosCarnet.Tables[0].Rows[0]["Ao_Partos"].ToString().ToCharArray();
                @ViewBag.AoCesareas = DatosCarnet.Tables[0].Rows[0]["Ao_Cesareas"].ToString().ToCharArray();
                @ViewBag.AoNacidosMuertos = DatosCarnet.Tables[0].Rows[0]["Ao_NacidosMuertos"].ToString().ToCharArray();
                @ViewBag.AoMuerto1Seman = DatosCarnet.Tables[0].Rows[0]["Ao_Muerto1Seman"].ToString().ToCharArray();
                @ViewBag.AoDespues1Seman = DatosCarnet.Tables[0].Rows[0]["Ao_Despues1Seman"].ToString().ToCharArray();

                @ViewBag.AoMenor2500Gr = DatosCarnet.Tables[0].Rows[0]["Ao_Menor2500Gr"].ToString() == "1" ? true : false;
                @ViewBag.AoMultiple = DatosCarnet.Tables[0].Rows[0]["Ao_Multiple"].ToString() == "1" ? true : false;
                @ViewBag.AoMemor37Sm = DatosCarnet.Tables[0].Rows[0]["Ao_Memor37Sm"].ToString() == "1" ? true : false;
                @ViewBag.AoMayor4000G = DatosCarnet.Tables[0].Rows[0]["Ao_Mayor4000G"].ToString() == "1" ? true : false;

                @ViewBag.AoPesoPregestacional = DatosCarnet.Tables[0].Rows[0]["Ao_PesoPregestacional"].ToString();


                @ViewBag.AoFechaFinEmbarazoAnt = DatosCarnet.Tables[0].Rows[0]["Ao_FechaFinEmbarazoAnt"].ToString().Split("/");
                @ViewBag.AoIdTerminacion = DatosCarnet.Tables[0].Rows[0]["Ao_IdTerminacion"].ToString();
                @ViewBag.AoIdAborto = DatosCarnet.Tables[0].Rows[0]["Ao_IdAborto"].ToString();
                @ViewBag.AoFracasoMetodo = DatosCarnet.Tables[0].Rows[0]["Ao_FracasoMetodo"].ToString();
                @ViewBag.AoEmbarazoPlaneado = DatosCarnet.Tables[0].Rows[0]["Ao_EmbarazoPlaneado"].ToString();
                @ViewBag.AoEmbarazoEctopico = DatosCarnet.Tables[0].Rows[0]["Ao_EmbarazoEctopico"].ToString() == "1" ? true : false;

                //==============================================================================================================//
                @ViewBag.FechaUR = DatosCarnet.Tables[0].Rows[0]["FechaUR"].ToString();
                @ViewBag.FechaPP = DatosCarnet.Tables[0].Rows[0]["FechaPP"].ToString();
                @ViewBag.FechaEcoAct = DatosCarnet.Tables[0].Rows[0]["FechaEcoAct"];
                @ViewBag.FechaEco = DatosCarnet.Tables[0].Rows[0]["FechaEco"].ToString();
                @ViewBag.SemanaGestacionalEco = DatosCarnet.Tables[0].Rows[0]["SemanaGestacionalEco"].ToString();
                @ViewBag.DiasGestacionalEco = DatosCarnet.Tables[0].Rows[0]["DiasGestacionalEco"].ToString();

                //================================================================================================================//
                @ViewBag.ExFisicoNormal = "";
                @ViewBag.ExFisicoPatologico = "";
                @ViewBag.ExMamasNormal = "";
                @ViewBag.ExMamasPatologico = "";
                if (Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LAbdomen"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LAnexos"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LAparatoCV"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["lAparatoR"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LAparatoU"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LCervix"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LDouglas"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LEstadoGeneral"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LExtremidades"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LGeBus"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LUtero"].ToString()) == 1 &&
                    Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LVagina"].ToString()) == 1)
                {
                    @ViewBag.ExFisicoNormal = "X";
                }
                else
                {
                    @ViewBag.ExFisicoPatologico = "X";
                }

                if (Int32.Parse(DatosCarnet.Tables[0].Rows[0]["LMamas"].ToString()) == 1)
                {
                    @ViewBag.ExMamasNormal = "X";
                }
                else
                {
                    @ViewBag.ExMamasPatologico = "X";
                }

                DatosTriajeCarnet = await daoCarnet.SeleccionarTriajeCarnetPrenatal(Int32.Parse(DatosCarnet.Tables[0].Rows[0]["IdAtencion"].ToString()));
                if (DatosTriajeCarnet.Tables[0].Rows.Count > 0)
                {
                    @ViewBag.AoTalla = DatosTriajeCarnet.Tables[0].Rows[0]["TriajeTalla"].ToString() + " cm.";
                }
            } 
                        
            DatosLaboCarnet = await daoCarnet.SeleccionarLabResultadosCarnetPrenatal(idPaciente);
            if (DatosLaboCarnet.Tables[0].Rows.Count > 0)
            {
                @ViewBag.HemoResultado1 = "_____";
                @ViewBag.HemoFechaResultado1 = "__/__/__";
                @ViewBag.HemoResultado2 = "_____";
                @ViewBag.HemoFechaResultado2 = "__/__/__";
                @ViewBag.GlucoResultado1 = "_____";
                @ViewBag.GlucoFechaResultado1 = "__/__/__";
                @ViewBag.GlucoResultado2 = "_____";
                @ViewBag.GlucoFechaResultado2 = "__/__/__";

                @ViewBag.VdrlFechaResultado1 = "__/__/__";
                @ViewBag.VdrlFechaResultado2 = "__/__/__";
                @ViewBag.PrFechaResultado1 = "__/__/__";
                @ViewBag.PrFechaResultado2 = "__/__/__";

                @ViewBag.TorchFechaResultado = "__/__/__";
                @ViewBag.UroFechaResultado1 = "__/__/__";
                @ViewBag.UroFechaResultado2 = "__/__/__";
                @ViewBag.PapFechaResultado = "__/__/__";

                foreach (System.Data.DataRow row in DatosLaboCarnet.Tables[0].Rows)
                {
                    if (row["TipoExamen"].ToString() == "ABO")
                    {
                        @ViewBag.GrupoSang = row["Resultado"].ToString();
                    }
                    if (row["TipoExamen"].ToString() == "RH" && row["Resultado"].ToString() == "POSITIVO")
                    {
                        @ViewBag.RhPositivo = "X";
                    }
                    if (row["TipoExamen"].ToString() == "RH" && row["Resultado"].ToString() == "NEGATIVO")
                    {
                        @ViewBag.RhNegativo = "X";
                    }

                    if (row["TipoExamen"].ToString() == "HEMOGLOBINA" && hemo == 2)
                    {
                        hemo++;
                        @ViewBag.HemoResultado2 = row["Resultado"].ToString();
                        @ViewBag.HemoFechaResultado2 = row["FechaResultado"].ToString();
                    }
                    if (row["TipoExamen"].ToString() == "HEMOGLOBINA" && hemo == 1)
                    {
                        hemo++;
                        @ViewBag.HemoResultado1 = row["Resultado"].ToString();
                        @ViewBag.HemoFechaResultado1 = row["FechaResultado"].ToString();
                    }

                    if (row["TipoExamen"].ToString() == "GLUCOSA" && gluco == 2)
                    {
                        gluco++;
                        @ViewBag.GlucoResultado2 = row["Resultado"].ToString();
                        @ViewBag.GlucoFechaResultado2 = row["FechaResultado"].ToString();
                    }
                    if (row["TipoExamen"].ToString() == "GLUCOSA" && gluco == 1)
                    {
                        gluco++;
                        @ViewBag.GlucoResultado1 = row["Resultado"].ToString();
                        @ViewBag.GlucoFechaResultado1 = row["FechaResultado"].ToString();
                    }

                    if (row["TipoExamen"].ToString() == "VDLRPRP" && vdrl == 2)
                    {
                        vdrl++;
                        @ViewBag.VdrlNReactivo2 = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.VdrlReactivo2 = row["Resultado"].ToString() == "POSITIVO" ? "X" : "";
                        @ViewBag.VdrlFechaResultado2 = row["FechaResultado"].ToString();
                    }
                    if (row["TipoExamen"].ToString() == "VDLRPRP" && vdrl == 1)
                    {
                        vdrl++;
                        @ViewBag.VdrlNReactivo1 = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.VdrlReactivo1 = row["Resultado"].ToString() == "POSITIVO" ? "X" : "";
                        @ViewBag.VdrlFechaResultado1 = row["FechaResultado"].ToString();
                    }

                    if (row["TipoExamen"].ToString() == "PRVIH" && pr == 2)
                    {
                        pr++;
                        @ViewBag.PrNReactivo2 = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.PrReactivo2 = row["Resultado"].ToString() == "POSITIVO" ? "X" : "";
                        @ViewBag.PrFechaResultado2 = row["FechaResultado"].ToString();
                    }
                    if (row["TipoExamen"].ToString() == "PRVIH" && pr == 1)
                    {
                        pr++;
                        @ViewBag.PrNReactivo1 = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.PrReactivo1 = row["Resultado"].ToString() == "POSITIVO" ? "X" : "";
                        @ViewBag.PrFechaResultado1 = row["FechaResultado"].ToString();
                    }

                    if (row["TipoExamen"].ToString() == "TORCH")
                    {
                        @ViewBag.TorchNegativo = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.TorchAnormal = row["Resultado"].ToString() == "ANORMAL" ? "X" : "";
                        @ViewBag.TorchFechaResultado = row["FechaResultado"].ToString();
                    }

                    if (row["TipoExamen"].ToString() == "UROCULTIVO" && uro == 2)
                    {
                        uro++;
                        @ViewBag.UroNegativo2 = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.UroAnormal2 = row["Resultado"].ToString() == "ANORMAL" ? "X" : "";
                        @ViewBag.UroFechaResultado2 = row["FechaResultado"].ToString();
                    }
                    if (row["TipoExamen"].ToString() == "UROCULTIVO" && uro == 1)
                    {
                        uro++;
                        @ViewBag.UroNegativo1 = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.UroAnormal1 = row["Resultado"].ToString() == "ANORMAL" ? "X" : "";
                        @ViewBag.UroFechaResultado1 = row["FechaResultado"].ToString();
                    }

                    if (row["TipoExamen"].ToString() == "PAP")
                    {
                        @ViewBag.PapNegativo = row["Resultado"].ToString() == "NEGATIVO" ? "X" : "";
                        @ViewBag.PapAnormal = row["Resultado"].ToString() == "ANORMAL" ? "X" : "";
                        @ViewBag.PapFechaResultado = row["FechaResultado"].ToString();
                    }
                }
            }

            @ViewBag.CarnetDetalle = null;
            DatosCarnetDetalle = await daoCarnet.SeleccionarHistoriaCarnetDetallePrenatal(idPaciente);
            if (DatosCarnetDetalle.Tables[0].Rows.Count > 0)
            {
                CarnetDetalle = DatosCarnetDetalle.Tables[0];
                @ViewBag.CarnetDetalle = CarnetDetalle;
            }

            var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_IP");
            @ViewBag.ServerFiles = conex1.ToString();


            return PartialView("~/Views/Comun/Plantillas/CarnetControlPrenatal.cshtml");
        }
    }
}
