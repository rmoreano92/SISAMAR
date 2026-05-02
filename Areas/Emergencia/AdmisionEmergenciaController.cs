using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Emergencia
{
    public class AdmisionEmergenciaController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public AdmisionEmergenciaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        
        [HttpPost]
        public async Task<ActionResult> DevuelveServiciosDelHospitalFiltro(string filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsServicios;
            DalAdmisionEmergencia daoServicios = new DalAdmisionEmergencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsServicios = await daoServicios.DevuelveServiciosDelHospitalFiltro(filtro);
            return Json(new { lsServicios = lsServicios, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> BuscarAtencionesEmergenciaPorFiltro(int idCuenta, string dni, string historia, string apPaterno, string fecha, int idServicio)
        {
            string filtro = "";
            filtro = " WHERE ";
                        
            //filtro = filtro + " dbo.Atenciones.FechaIngreso=CONVERT(DATETIME,'" + fecha + "',103) ";
            filtro = filtro + " dbo.Atenciones.IdServicioEgreso = " + idServicio;

            if (!String.IsNullOrEmpty(fecha))
            {
                filtro = filtro + " and dbo.Atenciones.FechaIngreso=CONVERT(DATETIME,'" + fecha + "',103) ";
            }

            if (idCuenta > 0)
            {
                filtro = filtro + " and dbo.Atenciones.IdCuentaAtencion = " + idCuenta;
            }
            if (!String.IsNullOrEmpty(dni))
            {
                filtro = filtro + " and dbo.Pacientes.NroDocumento = " + dni;
            }
            if (!String.IsNullOrEmpty(historia))
            {
                filtro = filtro + " and dbo.Pacientes.NroHistoriaClinica = " + historia;
            }
            if (!String.IsNullOrEmpty(apPaterno))
            {
                filtro = filtro + " and dbo.Pacientes.ApellidoPaterno = " + apPaterno;
            }
            /*if (idServicio > 0)
            {
                filtro = filtro + " and dbo.Atenciones.IdServicioEgreso = " + idServicio;
            }*/

            filtro = filtro + " and dbo.Atenciones.idTipoServicio in (2,4) ";
            filtro = filtro + " and dbo.atenciones.EsPacienteExterno <> 1 ";
            filtro = filtro + " order by Atenciones.FechaIngreso desc, Atenciones.HoraIngreso desc, Pacientes.ApellidoPaterno, Pacientes.ApellidoMaterno, Pacientes.PrimerNombre";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsAtenciones;
            DalAdmisionEmergencia daoServicios = new DalAdmisionEmergencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsAtenciones = await daoServicios.BuscarAtencionesEmergenciaPorFiltro(filtro);
            return Json(new { lsAtenciones = lsAtenciones, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesEmergencia(int idCuenta, string dni, int historia, string apPaterno, string fecha, int idServicio, string fechaFin, int tipoBusqueda) // JDELGADOPM     //KHOYOSI
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsAtenciones;
            DalAdmisionEmergencia daoAdmEmer = new DalAdmisionEmergencia();
            //int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));            
            lsAtenciones = await daoAdmEmer.ListarAtencionesEmergencia(idCuenta, dni, historia, apPaterno, fecha, idServicio, fechaFin, tipoBusqueda); // JDELGADOPM        //KHOYOSI
            return Json(new { lsAtenciones = lsAtenciones, session = true });
        }

        /////////////////////KHOYOSI//////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(int idAtencion, int idServicio, int nroEvaluacion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            lsAtencionsCE = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.EmergenciaIngreso, idServicio, nroEvaluacion); // JDELGADO J0 ASYNC
            return Json(lsAtencionsCE);
        }

        [HttpPost]
        public async Task<ActionResult> ListarDerivacionById(int IdDerivacion) // JDELGADO001.2
        {
            DataSet dataSet;
            DalAdmisionEmergencia dalAdmisionEmergencia = new DalAdmisionEmergencia();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAdmisionEmergencia.ListarDerivacionById(IdDerivacion);
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
            TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

            ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            if (modulo == "neonatal")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Emergencia/EvaluacionNeonatal.cshtml");
            }
            else if(modulo == "ginecobstetra")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Emergencia/EvaluacionEmergencia.cshtml");
            }            
            else if (modulo == "especialidades")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Emergencia/EvaluacionEspecialidades.cshtml");
            }
            else if (modulo == "trabajador")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Emergencia/EvaluacionEspecialidades.cshtml");
            }


            return PartialView("");
        }
        ////////////////////////////////////////////////////////////////////////////

        public async Task<ActionResult> ImprimeTicketCita(int idAtencion, int nroCupo)
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
                pageHtml = Url.Action("TicketCita", "AdmisionEmergencia", new { idAtencion, nroCupo, usuario }, "http");
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

        public async Task<ActionResult> ImprimeHojaFiliacionConsultorio(int idPaciente, int idAtencion)
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

            string Ruta = Url.Action("FormatoHojaFiliacionConsultorio", "AdmisionEmergencia", new { idPaciente, idAtencion, usuario }, "http");
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

        public async Task<ActionResult> ImprimeFormatoFiliacionArchivoClinico(int idPaciente, int idAtencion)
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

            string Ruta = Url.Action("FormatoFiliacionArchivoClinico", "AdmisionEmergencia", new { idPaciente, idAtencion, usuario }, "http");
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

        public async Task<ActionResult> TicketCita(int idAtencion, int nroCupo, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalAtenciones dalAtenciones = new DalAtenciones();

            DataSet lsParametros = new DataSet();
            DataSet lsCitas = await dalAtenciones.AtencionesSeleccionarPorId(idAtencion);

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

            @ViewBag.FechaImpresion = now;
            @ViewBag.Usuario = usuario;





            return PartialView("~/Views/ConsultaExterna/Plantillas/TicketCita.cshtml");
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
            DataSet lsDiagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso);

            DataTable dtDx = lsDiagnosticos.Tables[0];

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

            @ViewBag.NombreAcompaniante = lsCitas.Tables[0].Rows[0]["NombreAcompaniante"];
            @ViewBag.TelefonoAcompaniante = lsCitas.Tables[0].Rows[0]["TelefonoAcompaniante"];

            @ViewBag.Diagnosticos = dtDx;

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



            return PartialView("~/Views/Emergencia/Plantillas/HojaFiliacionEmergencia.cshtml");
        }

        public async Task<ActionResult> FormatoFiliacionArchivoClinico(int idPaciente, int idAtencion, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalAtenciones dalAtenciones = new DalAtenciones();
            DalPaciente dalPaciente = new DalPaciente();

            DataSet lsParametros = new DataSet();


            DataSet lsPacientes = await dalPaciente.PacientesSeleccionarPorId(idPaciente);
            DataSet lsCitas = await dalAtenciones.AtencionesSeleccionarPorId(idAtencion);

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
            @ViewBag.Religion = lsPacientes.Tables[0].Rows[0]["Religion"]; //MGAMERO
            @ViewBag.Edad = lsCitas.Tables[0].Rows[0]["Edad"];
            @ViewBag.TipoEdad = lsCitas.Tables[0].Rows[0]["TipoEdad"];

            @ViewBag.FichaFamiliar = lsPacientes.Tables[0].Rows[0]["FichaFamiliar"];
            @ViewBag.CipPaciente = lsPacientes.Tables[0].Rows[0]["CipPaciente"];
            @ViewBag.Procedencia = lsPacientes.Tables[0].Rows[0]["Procedencia"];
            @ViewBag.Parentesco = lsPacientes.Tables[0].Rows[0]["Parentesco"];
            @ViewBag.Titular = lsPacientes.Tables[0].Rows[0]["Titular"];

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

            @ViewBag.Acompaniante = lsCitas.Tables[0].Rows[0]["NombreAcompaniante"];
            @ViewBag.TelefonoAcompaniante = lsCitas.Tables[0].Rows[0]["TelefonoAcompaniante"];

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


        public async Task<ActionResult> ImprimeFormatoFO030(int idPaciente, int idAtencion)
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

            string Ruta = Url.Action("FormatoImpresionF30", "AdmisionEmergencia", new { idPaciente, idAtencion, usuario }, "http");
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

        public async Task<ActionResult> FormatoImpresionF30(int idPaciente, int idAtencion, string usuario)
        {
            //QRCodeGenerator qrGenerator = new QRCodeGenerator();

            //DalParametros daoParametros = new DalParametros();
            DalAtenciones dalAtenciones = new DalAtenciones();
            DalPaciente dalPaciente = new DalPaciente();

            //DataSet lsParametros = new DataSet();


            DataSet lsPacientes = await dalPaciente.PacientesSeleccionarPorId(idPaciente);
            DataSet lsCitas = await dalAtenciones.AtencionesSeleccionarPorId(idAtencion);


            @ViewBag.NroHistoria = lsPacientes.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.ApellidoPaterno = lsPacientes.Tables[0].Rows[0]["ApellidoPaterno"].ToString().ToUpper();
            @ViewBag.ApellidoMaterno = lsPacientes.Tables[0].Rows[0]["ApellidoMaterno"].ToString().ToUpper();
            @ViewBag.Nombres = lsPacientes.Tables[0].Rows[0]["nombresPaciente"].ToString().ToUpper();

            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["desServicio"];

            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["idCuentaAtencion"];
           

            return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoF30.cshtml");
        }

        //MGAMERO
        [HttpPost]
        public async Task<JsonResult> ConfirmarPagoCuentaAtencion(int idCuentaAtencion)
        {
            try
            {
                DalAdmisionEmergencia dalAdmisionEmergencia = new DalAdmisionEmergencia();
                DataSet ds = await dalAdmisionEmergencia.ConfirmarPagoCuentaAtencion(idCuentaAtencion);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return Json(new
                    {
                        session = true,
                        ok = false,
                        mensaje = "No se obtuvo respuesta al confirmar el pago."
                    });
                }

                return Json(new
                {
                    session = true,
                    ok = Convert.ToBoolean(ds.Tables[0].Rows[0]["ok"]),
                    mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString()
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    session = true,
                    ok = false,
                    mensaje = ex.Message
                });
            }
        }
    }
}