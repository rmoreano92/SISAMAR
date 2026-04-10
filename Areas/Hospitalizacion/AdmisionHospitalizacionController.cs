using CapaDatos;
using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using NPOI.POIFS.Crypt.Dsig;
using System.IO;
using System.Net.Mime;
using Microsoft.Extensions.Configuration;
using SelectPdf;
using QRCoder;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class AdmisionHospitalizacionController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public AdmisionHospitalizacionController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesHospitalizacion(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string fechaFin, string dni, int idServicio, string fechaTransferencia, int tipoBusqueda) //JDELGADO010
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstPacientesHops;
            DalHospitalizacion daoHosp = new DalHospitalizacion();
            lstPacientesHops = await daoHosp.ListarAtencionesHospitalizacion(idCuentaAtencion, historiaClinica, apellidoPaterno, fechaIngreso, fechaFin, dni, idServicio, fechaTransferencia, tipoBusqueda);
            return Json(new { lstPacientesHops = lstPacientesHops, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesSinAdmHospitalizacion(int ProvieneDeEmergencia) // JDELGADO001.2
        {
            DataSet dataSet;
            DalHospitalizacion dalHospitalizacion = new DalHospitalizacion();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalHospitalizacion.AtencionesSinAdmHospitalizacion(ProvieneDeEmergencia);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CargarModulo(string modulo)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}

            DalUtilitario dlUtilitario = new DalUtilitario();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos3 = new List<SubclasificacionDiagnosticos>();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();



            TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
            TiposDiagnosticos3 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
            TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionEgreso);

            ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            ViewBag.TiposDiagnosticos3 = TiposDiagnosticos3;
            ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;

            if (modulo == "neonatal")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Hospitalizacion/EvaluacionNeonatal/EvaluacionNeonatalHosp.cshtml");
            }
            else if (modulo == "ginecobstetra")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Hospitalizacion/EvaluacionGinecoObstetra/EvaluacionGinecoObstetraHosp.cshtml");
            }
            else if (modulo == "uci")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Hospitalizacion/EvaluacionesUCI/EvaluacionUCIHosp.cshtml");
            }
            else if (modulo == "clapGineco")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Hospitalizacion/Clap/ClapGineco.cshtml");
            }



            return PartialView("");
        }
        ////////////////////////////////////////////////////////////////////////////

        public async Task<ActionResult> FormatoPiePagina() // JDELGADO003-M
        {






            return PartialView("~/Views/Hospitalizacion/Plantillas/InformePiePagina.cshtml");
        }

        public async Task<ActionResult> GenerarFormatoPiePagina(int idCuentaAtencion)
        {
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("user");

            DalAtenciones dalAtenciones = new DalAtenciones();

            try
            {
                pageHtml = Url.Action("FormatoPiePagina", "AdmisionHospitalizacion", new { usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "Portrait";
                pdf.pageHtml = pageHtml;

                DataSet datos = await dalAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);


                pdf.Paciente = datos.Tables[0].Rows[0]["paciente"].ToString();
                pdf.Servicio = datos.Tables[0].Rows[0]["servicio"].ToString();
                pdf.Cuenta = datos.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
                pdf.Historia = datos.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
                pdf.tipo = "HO-PIE";

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



            //resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "HO-PIE", 0, pageHtml, stringHtml, idUsuario, pdf);

        }

        public async Task<ActionResult> ImprimeHojaFiliacionConsultorio(int idPaciente, int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }



            DataSet lsParametros = new DataSet();
            DataSet lsCitas;
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
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            DalUtilitario dalUtilitario = new DalUtilitario();

            DataSet dsUsuario = await dalUtilitario.ObtenerUsuarioLogeado(idUsuario);

            usuario = dsUsuario.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + dsUsuario.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + dsUsuario.Tables[0].Rows[0]["Nombres"].ToString();

            string Ruta = Url.Action("FormatoHojaFiliacionConsultorio", "AdmisionHospitalizacion", new { idPaciente, idAtencion, usuario }, "http");
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

        public async Task<ActionResult> FormatoHojaFiliacionConsultorio(int idPaciente, int idAtencion, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalAtenciones dalAtenciones = new DalAtenciones();
            DalPaciente dalPaciente = new DalPaciente();

            DataSet lsParametros = new DataSet();


            DataSet lsPacientes = await dalPaciente.PacientesSeleccionarPorId(idPaciente);
            DataSet lsCitas = await dalAtenciones.AtencionesSeleccionarPorId(idAtencion);

            var nombre = await daoParametros.SeleccionaFilaParametro2(205);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207);

            DateTime now = DateTime.Now;

            @ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            @ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();


            @ViewBag.NroHistoria = lsPacientes.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.TiposNumeracionHistoria = lsPacientes.Tables[0].Rows[0]["TiposNumeracionHistoria"];
            @ViewBag.PacienteNombres = lsPacientes.Tables[0].Rows[0]["nombres"].ToString().ToUpper();

            @ViewBag.FuenteFinanciamiento = lsCitas.Tables[0].Rows[0]["desFuenteFinanciamiento"];
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
            @ViewBag.TipoDocumento = lsPacientes.Tables[0].Rows[0]["TipoDocumento"];
            @ViewBag.NroDocumento = lsPacientes.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.Telefono = lsPacientes.Tables[0].Rows[0]["Telefono"];
            @ViewBag.NombreProvinciaDomicilio = lsPacientes.Tables[0].Rows[0]["nombreProvinciaDomicilio"];
            @ViewBag.NombreCentroPobladoDomicilio = lsPacientes.Tables[0].Rows[0]["nombreCentroPobladoDomicilio"];
            @ViewBag.GradoInstruccion = lsPacientes.Tables[0].Rows[0]["GradoInstruccion"];

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

            @ViewBag.NombreAcompaniante = lsCitas.Tables[0].Rows[0]["NombreAcompaniante"];
            @ViewBag.TelefonoAcompaniante = lsCitas.Tables[0].Rows[0]["TelefonoAcompaniante"];

            @ViewBag.Ocupacion = lsPacientes.Tables[0].Rows[0]["Ocupacion"];
            @ViewBag.Religion = lsPacientes.Tables[0].Rows[0]["Religion"];

            @ViewBag.Cama = lsCitas.Tables[0].Rows[0]["Cama"];


            @ViewBag.ServicioActual = lsCitas.Tables[0].Rows[0]["ServicioActual"];
            @ViewBag.FechaEgreso = lsCitas.Tables[0].Rows[0]["FechaEgreso"];
            @ViewBag.HoraEgreso = lsCitas.Tables[0].Rows[0]["HoraEgreso"];
            @ViewBag.Afiliacion = lsCitas.Tables[0].Rows[0]["Afiliacion"];
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



            return PartialView("~/Views/Hospitalizacion/Plantillas/HojaFiliacionHospitalizacion.cshtml");
        }
    }
}
