using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Sis;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.Comun
{
    public class AltaMedicaController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;
        private IHttpContextAccessor _httpContextAccessor;

        public AltaMedicaController(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _hostingEnvironment = env;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListaDestinosConsultorioEmergencia() // JDELGADO001.2
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.ListaDestinosConsultorioEmergencia();
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaDestinosHospitalizacion(int tipoServicio) // JDELGADO001.2
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.ListaDestinosHospitalizacion(tipoServicio);
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposAlta() // JDELGADO001.2
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.ListaTiposAlta();
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaCondicionAlta() // JDELGADO001.2
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.ListaCondicionAlta();
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposReferencia() // JDELGADO001.2
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.ListaTiposReferencia();
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarAtencionAtencionDatosAdicionalesPaciente(int idAtencion)   //KHOYOSI
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.SeleccionarAtencionAtencionDatosAdicionalesPaciente(idAtencion);
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarCierreControlPrenatal(int idAtencion)   //KHOYOSI
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultado = await dalUtili.CierreControlPrenatalSeleccionar(idAtencion);
            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> AltaMedicaModificar(Atenciones atencion, AtencionesDatosAdicionales atencionesDatosAdicionales, AtencionEpisodio atencionEpisodio, ProCabecera proCabecera, int estadoCierreControlPrenatal, 
                                                            String lstDiagnosticosEgreso, String lstDiagnosticosComplicaciones, String lstDiagnosticosNacimientos, String lstDiagnosticosMortalidad, int conExoneracion=0, int conDescansoMedico=0)   //KHOYOSI
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            bool lsResultado = false; 
            bool lsResultadoCierrePrental = false;
            bool resp = false;
            bool resp2 = false;
            bool resp3 = false;
            DalUtilitario dalUtili = new DalUtilitario();
            DalAtenciones daoAtenciones = new DalAtenciones();
            //FormatoFuaController fua = new FormatoFuaController(_hostingEnvironment, _httpContextAccessor);
            DalParametros daoParametros = new DalParametros();
            //DataSet ds = new DataSet();
            int idUsuario = 0;
            //int idEstadoFacturacion = 1;
            //string valorTexto = "";

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            atencion.idUsuario = idUsuario;

            //ds = await daoParametros.SeleccionaFilaParametro2(382);
            //valorTexto = ds.Tables[0].Rows[0]["ValorTexto"].ToString();

            //if(valorTexto != "1")
            //{
            //    idEstadoFacturacion = 10;       //10: AltaMedica (EstadosCuenta)
            //}
            var agregaProcedimiento = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:AgregaProcedimientosPorDefecto");
            int CargaProcedimiento = Int32.Parse(agregaProcedimiento.ToString());

            lsResultado = await dalUtili.AltaMedicaModificar(atencion, atencionesDatosAdicionales, CargaProcedimiento);

            if (atencion.idDestinoAtencion == 21 && !(atencion.idServicioEgreso == 1850 || atencion.idServicioEgreso == 3102 || atencion.idServicioEgreso == 3103))
            {
                await GenerarPapeletaHospitalizacion(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            if (atencion.idDestinoAtencion == 21 && (atencion.idServicioEgreso == 1850 || atencion.idServicioEgreso == 3102 || atencion.idServicioEgreso == 3103))
            {
                await GenerarPapeletaHospitalizacionFam(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            if (conExoneracion == 1) {

                await GenerarPapeletaExoneracionMed(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            if (conDescansoMedico == 1)
            {
                await GenerarPapeletaDescansoMedico(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            lsResultadoCierrePrental = await dalUtili.CierreControlPrenatalModificar(atencion, proCabecera, estadoCierreControlPrenatal);
            resp = await daoAtenciones.RegitraModifcaEpisodio(atencionEpisodio.numeroEpisodio, atencion.idPaciente, atencionEpisodio.epiNuevo, atencionEpisodio.epiCierre, atencion.idAtencion, idUsuario);

            var lstobjDiagnosticosEgreso = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosEgreso);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, idUsuario, lstobjDiagnosticosEgreso);

            var lstobjDiagnosticosComplicaciones = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosComplicaciones);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionComplicaciones, idUsuario, lstobjDiagnosticosComplicaciones);

            var lstobjDiagnosticosNacimientos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosNacimientos);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento, idUsuario, lstobjDiagnosticosNacimientos);

            var lstobjDiagnosticosMortalidad = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosMortalidad);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad, idUsuario, lstobjDiagnosticosMortalidad);

            DataSet datosRefcon = null;

            if (await daoParametros.SeleccionaPermisoGeneral("REFCON") == "1")
            {
                var refcon = await ActualizaEmisionRefCon(atencion.idCuentaAtencion, (int)(atencion.idDestinoAtencion));       //KHOYOSI (ACTUALIZAR LA HOJA DE REFERENCIA EMITIDA DE ACUERDO AL TIPO DE DESTINO)
                
                datosRefcon = await dalUtili.SeleccionarDatosRefcon(atencion.idCuentaAtencion);
            }

            resp = await GenerarHojaFua(atencion.idCuentaAtencion, atencion.idCuentaAtencion); //(COMENTADO HASTA QUE SE GENEREN LOS FUAS)

            var usaEpicrisi = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:UsaEpicrisis");
            if(usaEpicrisi.ToString() == "1")
            {
                resp2 = await GenerarHojaEpicrisis(atencion.idCuentaAtencion, atencion.idAtencion);
            }


            if (atencion.idDestinoAtencion == 20)//rmoreano 
            {
                resp3 = await GenerarPapeletaEgreso(atencion.idCuentaAtencion);
            }

            int IdReferencia = Int32.Parse(datosRefcon.Tables[0].Rows[0]["IdReferencia"].ToString());
            int IdContraReferencia = Int32.Parse(datosRefcon.Tables[0].Rows[0]["IdContraReferencia"].ToString());

            if (IdReferencia != 0 || IdContraReferencia != 0)
            {
                if (atencion.idDestinoAtencion == 23 || atencion.idDestinoAtencion == 31) // Referencia
                {
                    var hoja = await GenerarHojaRefCon(atencion.idCuentaAtencion, IdReferencia, "RF");
                }
                if (atencion.idDestinoAtencion == 24 || atencion.idDestinoAtencion == 32) // Contrareferencia
                {
                    var hoja = await GenerarHojaRefCon(atencion.idCuentaAtencion, IdContraReferencia, "CRF");
                }
            }
            

            return Json(new { lsResultado = lsResultado, session = true });
        }

        [HttpPost]
        public async Task<Boolean> GenerarPapeletaHospitalizacionPrueba(Atenciones atencion, AtencionesDatosAdicionales atencionesDatosAdicionales, AtencionEpisodio atencionEpisodio, ProCabecera proCabecera, int estadoCierreControlPrenatal,
                                                            String lstDiagnosticosEgreso, String lstDiagnosticosComplicaciones, String lstDiagnosticosNacimientos, String lstDiagnosticosMortalidad, int conExoneracion = 0, int conDescansoMedico = 0)
        {
            try
            {

                // 👇 CLAVE: tipo = E-PH
                bool resp1 = await GenerarPapeletaHospitalizacion(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );

                bool resp2 = await GenerarPapeletaHospitalizacionFam(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );

                bool resp3 = await GenerarPapeletaExoneracionMed(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );

                bool resp4 = await GenerarPapeletaDescansoMedico(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );

                return resp1;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<Boolean> GenerarPapeletaHospitalizacion(int idCuentaAtencion, int idAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml = null;

                UtilitarioController utilitario = new UtilitarioController();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("PapeletaHospitalizacion", "AltaMedica", new { area = "Emergencia", idCuentaAtencion, idAtencion }, "http");


                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;

                
                bool resp = await utilitario.GenerarDocumentoDigital(
                    idCuentaAtencion,
                    idAtencion,
                    0,
                    "E-PH",
                    0,
                    pageHtml,
                    stringHtml,
                    idUsuario,
                    pdf
                );

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> PapeletaHospitalizacion(int idCuentaAtencion, int idAtencion)
        {

            DalAtenciones daoAtenciones = new DalAtenciones();
            DataSet datosPapeleta = await daoAtenciones.getDatosAtencion(idCuentaAtencion, idAtencion);
            var paciente = datosPapeleta.Tables[0].Rows[0]["Paciente"].ToString();


            var fecha = DateTime.Now;
            string fechaTexto = fecha.ToString("d 'de' MMMM 'del' yyyy", new CultureInfo("es-PE"));

            //@ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");            
            @ViewBag.Paciente = datosPapeleta.Tables[0].Rows[0]["Paciente"].ToString();
            @ViewBag.FichaFamiliar = datosPapeleta.Tables[0].Rows[0]["FichaFamiliar"].ToString();
            @ViewBag.Parentesco = datosPapeleta.Tables[0].Rows[0]["Parentesco"].ToString();
            @ViewBag.Titular = datosPapeleta.Tables[0].Rows[0]["Titular"].ToString();
            @ViewBag.diagnostico = datosPapeleta.Tables[0].Rows[0]["diagnostico"].ToString();
            @ViewBag.dependencia = datosPapeleta.Tables[0].Rows[0]["dependencia"].ToString();
            @ViewBag.ObservacionAltaMedica = datosPapeleta.Tables[0].Rows[0]["ObservacionAltaMedica"].ToString();
            @ViewBag.FechaTexto = fechaTexto;
            

            return PartialView("~/Views/Emergencia/Plantillas/PapeletaHospitalizacion.cshtml");

        }


        public async Task<Boolean> GenerarPapeletaHospitalizacionFam(int idCuentaAtencion, int idAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml = null;

                UtilitarioController utilitario = new UtilitarioController();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("PapeletaHospitalizacionFam", "AltaMedica", new { area = "Emergencia", idCuentaAtencion, idAtencion }, "http");


                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;

                
                bool resp = await utilitario.GenerarDocumentoDigital(
                    idCuentaAtencion,
                    idAtencion,
                    0,
                    "E-PHF",
                    0,
                    pageHtml,
                    stringHtml,
                    idUsuario,
                    pdf
                );

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> PapeletaHospitalizacionFam(int idCuentaAtencion, int idAtencion)
        {

            DalAtenciones daoAtenciones = new DalAtenciones();
            DataSet datosPapeleta = await daoAtenciones.getDatosAtencion(idCuentaAtencion, idAtencion);
            var paciente = datosPapeleta.Tables[0].Rows[0]["Paciente"].ToString();


            var fecha = DateTime.Now;
            string fechaTexto = fecha.ToString("d 'de' MMMM 'del' yyyy", new CultureInfo("es-PE"));

            //@ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");            
            @ViewBag.Paciente = datosPapeleta.Tables[0].Rows[0]["Paciente"].ToString();
            @ViewBag.FichaFamiliar = datosPapeleta.Tables[0].Rows[0]["FichaFamiliar"].ToString();
            @ViewBag.Parentesco = datosPapeleta.Tables[0].Rows[0]["Parentesco"].ToString();
            @ViewBag.Titular = datosPapeleta.Tables[0].Rows[0]["Titular"].ToString();
            @ViewBag.GradoTitular = datosPapeleta.Tables[0].Rows[0]["GradoTitular"].ToString();
            @ViewBag.diagnostico = datosPapeleta.Tables[0].Rows[0]["diagnostico"].ToString();
            @ViewBag.dependencia = datosPapeleta.Tables[0].Rows[0]["dependencia"].ToString();
            @ViewBag.ObservacionAltaMedica = datosPapeleta.Tables[0].Rows[0]["ObservacionAltaMedica"].ToString();
            @ViewBag.FechaTexto = fechaTexto;

            return PartialView("~/Views/Emergencia/Plantillas/PapeletaHospitalizacionFam.cshtml");

        }

        public async Task<Boolean> GenerarPapeletaExoneracionMed(int idCuentaAtencion, int idAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml = null;

                UtilitarioController utilitario = new UtilitarioController();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("PapeletaExoneracionMed", "AltaMedica", new { area = "Emergencia", idCuentaAtencion, idAtencion }, "http");


                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;

                
                bool resp = await utilitario.GenerarDocumentoDigital(
                    idCuentaAtencion,
                    idAtencion,
                    0,
                    "E-PEM",
                    0,
                    pageHtml,
                    stringHtml,
                    idUsuario,
                    pdf
                );

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> PapeletaExoneracionMed(int idCuentaAtencion, int idAtencion)
        {

            DalAtenciones daoAtenciones = new DalAtenciones();
            DataSet datosPapeleta = await daoAtenciones.getDatosAtencion(idCuentaAtencion, idAtencion);
            var paciente = datosPapeleta.Tables[0].Rows[0]["Paciente"].ToString();


            var fecha = DateTime.Now;
            string fechaTexto = fecha.ToString("d 'de' MMMM 'del' yyyy", new CultureInfo("es-PE"));

            //@ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");            
            @ViewBag.Paciente = datosPapeleta.Tables[0].Rows[0]["Paciente"].ToString();
            @ViewBag.FichaFamiliar = datosPapeleta.Tables[0].Rows[0]["FichaFamiliar"].ToString();
            @ViewBag.Parentesco = datosPapeleta.Tables[0].Rows[0]["Parentesco"].ToString();
            @ViewBag.Titular = datosPapeleta.Tables[0].Rows[0]["Titular"].ToString();
            @ViewBag.GradoTitular = datosPapeleta.Tables[0].Rows[0]["GradoTitular"].ToString();
            @ViewBag.NroDocumento = datosPapeleta.Tables[0].Rows[0]["NroDocumento"].ToString();
            @ViewBag.Grado = datosPapeleta.Tables[0].Rows[0]["Grado"].ToString();
            @ViewBag.diagnostico = datosPapeleta.Tables[0].Rows[0]["diagnostico"].ToString();
            @ViewBag.dependencia = datosPapeleta.Tables[0].Rows[0]["dependencia"].ToString();
            @ViewBag.ObservacionAltaMedica = datosPapeleta.Tables[0].Rows[0]["ObservacionAltaMedica"].ToString();
            @ViewBag.FechaTexto = fechaTexto;

            return PartialView("~/Views/Emergencia/Plantillas/PapeletaExoneracionMedica.cshtml");

        }

        public async Task<Boolean> GenerarPapeletaDescansoMedico(int idCuentaAtencion, int idAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml = null;

                UtilitarioController utilitario = new UtilitarioController();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("PapeletaDescansoMedico", "AltaMedica", new { area = "Emergencia", idCuentaAtencion, idAtencion }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;

                bool resp = await utilitario.GenerarDocumentoDigital(
                    idCuentaAtencion,
                    idAtencion,
                    0,
                    "E-PDM",
                    0,
                    pageHtml,
                    stringHtml,
                    idUsuario,
                    pdf
                );

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> PapeletaDescansoMedico(int idCuentaAtencion, int idAtencion)
        {
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalUtilitario dalUtilitario = new DalUtilitario();

            DataSet datosPapeleta = await daoAtenciones.getDatosAtencion(idCuentaAtencion, idAtencion);
            DataSet datosAtencion = await dalUtilitario.SeleccionarAtencionAtencionDatosAdicionalesPaciente(idAtencion);

            var fecha = DateTime.Now;
            string fechaTexto = fecha.ToString("dd/MM/yyyy");

            var filaPapeleta = datosPapeleta.Tables[0].Rows[0];
            var filaAtencion = datosAtencion.Tables[0].Rows[0];

            DateTime? fechaInicioDescanso = filaAtencion["FechaInicioDescansoMedico"] == DBNull.Value ? null : (DateTime?)filaAtencion["FechaInicioDescansoMedico"];
            DateTime? fechaFinDescanso = filaAtencion["FechaFinDescansoMedico"] == DBNull.Value ? null : (DateTime?)filaAtencion["FechaFinDescansoMedico"];

            int totalHoras = 0;
            if (fechaInicioDescanso.HasValue && fechaFinDescanso.HasValue)
            {
                totalHoras = (int)Math.Round((fechaFinDescanso.Value.Date.AddDays(1) - fechaInicioDescanso.Value.Date).TotalHours);
            }

            ViewBag.Paciente = filaPapeleta["Paciente"].ToString();
            ViewBag.Grado = filaPapeleta["Grado"].ToString();
            ViewBag.Cip = filaPapeleta["FichaFamiliar"].ToString();
            ViewBag.Dependencia = filaPapeleta["dependencia"].ToString();
            ViewBag.FechaInicioDescanso = fechaInicioDescanso.HasValue ? fechaInicioDescanso.Value.ToString("dd/MM/yyyy") : "";
            ViewBag.FechaFinDescanso = fechaFinDescanso.HasValue ? fechaFinDescanso.Value.ToString("dd/MM/yyyy") : "";
            ViewBag.TotalHorasDescanso = totalHoras;
            ViewBag.FechaTexto = fechaTexto;

            return PartialView("~/Views/Emergencia/Plantillas/PapeletaDescansoMedico.cshtml");
        }


        [HttpPost]
        public async Task<ActionResult> AltaMedicaUCIModificar(Atenciones atencion, AtencionesDatosAdicionales atencionesDatosAdicionales, AtencionEpisodio atencionEpisodio, ProCabecera proCabecera, int estadoCierreControlPrenatal,
                                                            String lstDiagnosticosEgreso, String lstDiagnosticosComplicaciones, String lstDiagnosticosNacimientos, String lstDiagnosticosMortalidad, int conExoneracion = 0, int conDescansoMedico = 0)   //KHOYOSI
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            bool lsResultado = false;
            bool lsResultadoCierrePrental = false;
            bool resp = false;
            bool resp2 = false;
            bool resp3 = false;
            DalUtilitario dalUtili = new DalUtilitario();
            DalAtenciones daoAtenciones = new DalAtenciones();
            //FormatoFuaController fua = new FormatoFuaController(_hostingEnvironment, _httpContextAccessor);
            DalParametros daoParametros = new DalParametros();
            //DataSet ds = new DataSet();
            int idUsuario = 0;
            //int idEstadoFacturacion = 1;
            //string valorTexto = "";

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            atencion.idUsuario = idUsuario;

            //ds = await daoParametros.SeleccionaFilaParametro2(382);
            //valorTexto = ds.Tables[0].Rows[0]["ValorTexto"].ToString();

            //if(valorTexto != "1")
            //{
            //    idEstadoFacturacion = 10;       //10: AltaMedica (EstadosCuenta)
            //}
            var agregaProcedimiento = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:AgregaProcedimientosPorDefecto");
            int CargaProcedimiento = Int32.Parse(agregaProcedimiento.ToString());

            lsResultado = await dalUtili.AltaMedicaModificar(atencion, atencionesDatosAdicionales, CargaProcedimiento);

            if (atencion.idDestinoAtencion == 21)
            {
                await GenerarPapeletaHospitalizacion(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            if (atencion.idDestinoAtencion == 21 && (atencion.idServicioEgreso == 1850 || atencion.idServicioEgreso == 3102 || atencion.idServicioEgreso == 3103))
            {
                await GenerarPapeletaHospitalizacionFam(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }


            if (conExoneracion == 1)
            {

                await GenerarPapeletaExoneracionMed(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            if (conDescansoMedico == 1)
            {
                await GenerarPapeletaDescansoMedico(
                    atencion.idCuentaAtencion,
                    atencion.idAtencion
                );
            }

            lsResultadoCierrePrental = await dalUtili.CierreControlPrenatalModificar(atencion, proCabecera, estadoCierreControlPrenatal);
            resp = await daoAtenciones.RegitraModifcaEpisodio(atencionEpisodio.numeroEpisodio, atencion.idPaciente, atencionEpisodio.epiNuevo, atencionEpisodio.epiCierre, atencion.idAtencion, idUsuario);

            var lstobjDiagnosticosEgreso = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosEgreso);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso, idUsuario, lstobjDiagnosticosEgreso);

            var lstobjDiagnosticosComplicaciones = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosComplicaciones);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionComplicaciones, idUsuario, lstobjDiagnosticosComplicaciones);

            var lstobjDiagnosticosNacimientos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosNacimientos);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento, idUsuario, lstobjDiagnosticosNacimientos);

            var lstobjDiagnosticosMortalidad = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosMortalidad);
            resp = await dalUtili.insertaDiagnosticos(atencion.idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad, idUsuario, lstobjDiagnosticosMortalidad);

            DataSet datosRefcon = null;

            if (await daoParametros.SeleccionaPermisoGeneral("REFCON") == "1")
            {
                var refcon = await ActualizaEmisionRefCon(atencion.idCuentaAtencion, (int)(atencion.idDestinoAtencion));       //KHOYOSI (ACTUALIZAR LA HOJA DE REFERENCIA EMITIDA DE ACUERDO AL TIPO DE DESTINO)

                datosRefcon = await dalUtili.SeleccionarDatosRefcon(atencion.idCuentaAtencion);
            }

            resp = await GenerarHojaFua(atencion.idCuentaAtencion, atencion.idCuentaAtencion); //(COMENTADO HASTA QUE SE GENEREN LOS FUAS)

            var usaEpicrisi = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:UsaEpicrisis");
            if (usaEpicrisi.ToString() == "1")
            {
                resp2 = await GenerarHojaEpicrisisUCI(atencion.idCuentaAtencion, atencion.idAtencion);
            }

            if (atencion.idDestinoAtencion == 20)//rmoreano 
            {
                resp3 = await GenerarPapeletaEgreso(atencion.idCuentaAtencion);
            }

            int IdReferencia = Int32.Parse(datosRefcon.Tables[0].Rows[0]["IdReferencia"].ToString());
            int IdContraReferencia = Int32.Parse(datosRefcon.Tables[0].Rows[0]["IdContraReferencia"].ToString());

            if (IdReferencia != 0 || IdContraReferencia != 0)
            {
                if (atencion.idDestinoAtencion == 23 || atencion.idDestinoAtencion == 31) // Referencia
                {
                    var hoja = await GenerarHojaRefCon(atencion.idCuentaAtencion, IdReferencia, "RF");
                }
                if (atencion.idDestinoAtencion == 24 || atencion.idDestinoAtencion == 32) // Contrareferencia
                {
                    var hoja = await GenerarHojaRefCon(atencion.idCuentaAtencion, IdContraReferencia, "CRF");
                }
            }


            return Json(new { lsResultado = lsResultado, session = true });
        }


        







        [HttpPost]
        public async Task<ActionResult> AltaMedicaEliminar(int idAtencion, string motivo)   //KHOYOSI
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            bool lsResultado = false;            
            DalUtilitario dalUtili = new DalUtilitario();            
            int idUsuario = 0;

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            
            lsResultado = await dalUtili.AltaMedicaEliminar(idAtencion, motivo, idUsuario);
            
            return Json(new { lsResultado = lsResultado, session = true });
        }

        //KHOYOSI (START)
        [HttpPost]
        public async Task<ActionResult> ActualizaEmisionRefCon(int idCuentaAtencion, int tipoDestino)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            Boolean ds;
            DalReferencia daoReferencia = new DalReferencia();
            DalParametros daoParametros = new DalParametros();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = false;
            if (await daoParametros.SeleccionaPermisoGeneral("REFCON") == "1")
            {
                ds = await daoReferencia.ActualizarEmisionRefCon(idCuentaAtencion, tipoDestino);
            }

            return Json(new { respuesta = ds, session = true });
        }
        //KHOYOSI (END)


        public async Task<bool> GenerarHojaFua(int idCuentaAtencion, int idAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                DalAtenciones daoAtenciones = new DalAtenciones();
                DalParametros daoParametros = new DalParametros();
                bool resp = false;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                
                stringHtml = null;
                pageHtml = null;

                pageHtml = Url.Action("FormatoHojaFua", "FormatoFua", new { area = "Sis", idCuentaAtencion }, "http");

                DataSet atencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    if (atencion.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3")
                    {
                        //Console.WriteLine("Es sis");
                        int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione  (KHOYOSI: sí funciono xD)                         

                        if (agregaFua == 1)
                        {
                            pdf.orientacion = "Portrait";
                            pdf.tamanio = "A4";
                            pdf.marginX = 20;
                            pdf.marginY = 20;
                            resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "FUA", 0, pageHtml, stringHtml, idUsuario, pdf);
                        }
                    }
                }

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        [HttpPost]
        public async Task<Boolean> GenerarHojaEpicrisis(int idCuentaAtencion, int idAtencion)
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
                pageHtml = Url.Action("InformeEpicrisis", "AltaMedica", new { area = "Hospitalizacion", idAtencion, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "H-EPIC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeEpicrisis(int idAtencion, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            //DataSet DatosEvaluacion;
            DataSet DatosHosp;
            DataSet DxIngresos, DxEgresos, DxMortalidad, DxMuerteFetal, EstanciaHosp;
            DataSet lsDatosAdicionales;
            DataSet lsRecetasDespachadas;
            DataSet lsLaboratorio;
            DataSet lsImagenes;
            DataSet lsConsumoServicio;
            //DateTime today = DateTime.Today;

            //DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            DalHospitalizacion daoHosp = new DalHospitalizacion();
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalDiagnostico dxAtenciones = new DalDiagnostico();            
            DalUtilitario dalUtili = new DalUtilitario();
            DalRecetas dalReceta = new DalRecetas();
            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();
            DalLaboratorio dalLaboratorio = new DalLaboratorio();
            DalImagenes dalImagenes = new DalImagenes();

            var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_IP");
            @ViewBag.ServerFiles = conex1.ToString();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            ViewBag.Usuario =  usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                        
            lsDatosAdicionales = await dalUtili.SeleccionarAtencionAtencionDatosAdicionalesPaciente(idAtencion);

            @ViewBag.NroHistoriaClinica = lsDatosAdicionales.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.NroCuenta = lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"];
            @ViewBag.FuenteFinanciamiento = lsDatosAdicionales.Tables[0].Rows[0]["FuenteFinanciamiento"];
            @ViewBag.Paciente = lsDatosAdicionales.Tables[0].Rows[0]["Paciente"];
            @ViewBag.FechaEvaluacion = lsDatosAdicionales.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = lsDatosAdicionales.Tables[0].Rows[0]["HoraEvaluacion"];
            @ViewBag.Edad = lsDatosAdicionales.Tables[0].Rows[0]["Edad"];
            @ViewBag.FechaNacimiento = lsDatosAdicionales.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = lsDatosAdicionales.Tables[0].Rows[0]["HoraNacimiento"];            
            @ViewBag.Servicio = lsDatosAdicionales.Tables[0].Rows[0]["Servicio"];
            @ViewBag.Sexo = lsDatosAdicionales.Tables[0].Rows[0]["Sexo"];
            @ViewBag.Medico = lsDatosAdicionales.Tables[0].Rows[0]["Medico"];
            @ViewBag.Telefono = lsDatosAdicionales.Tables[0].Rows[0]["Telefono"];
            @ViewBag.Direccion = lsDatosAdicionales.Tables[0].Rows[0]["Direccion"];
            @ViewBag.Departamento = lsDatosAdicionales.Tables[0].Rows[0]["Departamento"];
            @ViewBag.Provincia = lsDatosAdicionales.Tables[0].Rows[0]["Provincia"];
            @ViewBag.Distrito = lsDatosAdicionales.Tables[0].Rows[0]["Distrito"];
            @ViewBag.CentroPoblado = lsDatosAdicionales.Tables[0].Rows[0]["CentroPoblado"];
            @ViewBag.Acompaniante = lsDatosAdicionales.Tables[0].Rows[0]["Acompaniante"];
            @ViewBag.TelefonoAcomp = lsDatosAdicionales.Tables[0].Rows[0]["TelefonoAcomp"];

            @ViewBag.FechaHoraIngreso = lsDatosAdicionales.Tables[0].Rows[0]["FechaHoraIngreso"].ToString();
            @ViewBag.ViaAdmision = lsDatosAdicionales.Tables[0].Rows[0]["OrigenAtencion"].ToString();
            @ViewBag.ServicioIngreso = lsDatosAdicionales.Tables[0].Rows[0]["ServicioIngreso"].ToString();
            @ViewBag.EspecialidadIngreso = lsDatosAdicionales.Tables[0].Rows[0]["EspecialidadIngreso"].ToString();
            @ViewBag.CamaIngreso = lsDatosAdicionales.Tables[0].Rows[0]["CamaIngreso"].ToString();
            @ViewBag.CodigoEstablecimiento = lsDatosAdicionales.Tables[0].Rows[0]["CodigoEstablecimiento"].ToString();
            @ViewBag.CodigoOrigenReferencia = lsDatosAdicionales.Tables[0].Rows[0]["CodigoOrigenReferencia"].ToString();
            @ViewBag.NombreOrigenReferencia = lsDatosAdicionales.Tables[0].Rows[0]["NombreOrigenReferencia"].ToString();
            @ViewBag.HistoriaClinica = lsDatosAdicionales.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.MasDe24Horas = lsDatosAdicionales.Tables[0].Rows[0]["MasDe24Horas"].ToString();

            
            //DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionHospitalizacion(idAtencion, idServicio, eval, idUsuario);
            ////////////DX INGRESO//////////////////////////
            DxIngresos = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso);
            DataTable dtDxIngreso = DxIngresos.Tables[0];
            @ViewBag.DxIngreso = dtDxIngreso;

            ////////////DATOS EVALUACION//////////////////////////
            DatosHosp = await daoHosp.EvaluacionHospitalizacionSeleccionar(idAtencion, 0);
            @ViewBag.Anamnesis = (DatosHosp.Tables[0].Rows.Count > 0) ? DatosHosp.Tables[0].Rows[0]["Relato"].ToString() : "";
            @ViewBag.ExamenClinico = (DatosHosp.Tables[0].Rows.Count > 0) ? DatosHosp.Tables[0].Rows[0]["DescripcionExamenFisico"].ToString() : ""; 

            ////////////LABORATORIO//////////////////////////
            lsLaboratorio = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarByIdCuenta(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()));
            DataTable dtLaboratorio = lsLaboratorio.Tables[0];
            @ViewBag.Laboratorio = dtLaboratorio;

            ////////////IAMGENES//////////////////////////
            lsImagenes = await dalImagenes.ImgMovimientoLaboratorioSeleccionarByIdCuenta(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()));
            DataTable dtImagen = lsImagenes.Tables[0];
            @ViewBag.Imagen = dtImagen;

            ////////////RECETAS DESPACHADAS///////////////////////////
            lsRecetasDespachadas = dalReceta.ListaRecetasDetalleDespachadasPorIdCuentaAtencion(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()), 5);
            DataTable dtRecetasDespachadas = lsRecetasDespachadas.Tables[0];
            @ViewBag.RecetasDespachadas = dtRecetasDespachadas;

            ////////////CONSUMO SERVICIO///////////////////////////
            lsConsumoServicio = await dalConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()));
            DataTable dtConsumoServicio = lsConsumoServicio.Tables[0];
            @ViewBag.ConsumoServicio = dtConsumoServicio;

            ////////////ESTANCIA///////////////////////////
            EstanciaHosp = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(idAtencion, 1);
            DataTable dtEstanciaHosp = EstanciaHosp.Tables[0];
            @ViewBag.EstanciaHosp = dtEstanciaHosp;

            ////////////EGRESO//////////////////////////
            @ViewBag.FechaHoraEgreso = lsDatosAdicionales.Tables[0].Rows[0]["FechaHoraEgreso"].ToString();
            @ViewBag.EstadiaTotal = lsDatosAdicionales.Tables[0].Rows[0]["EstadiaTotal"].ToString();
            @ViewBag.TipoAlta = lsDatosAdicionales.Tables[0].Rows[0]["TipoAlta"].ToString();
            @ViewBag.CondicionAlta = lsDatosAdicionales.Tables[0].Rows[0]["CondicionAlta"].ToString();
            @ViewBag.CodigoDestinoReferencia = lsDatosAdicionales.Tables[0].Rows[0]["CodigoDestinoReferencia"].ToString();
            @ViewBag.NombreDestinoReferencia = lsDatosAdicionales.Tables[0].Rows[0]["NombreDestinoReferencia"].ToString();
            @ViewBag.Pronostico = lsDatosAdicionales.Tables[0].Rows[0]["Pronostico"].ToString();

            DxEgresos = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso);
            DataTable dtDxEgreso = DxEgresos.Tables[0];
            @ViewBag.DxEgreso = dtDxEgreso;

            ////////////MORTALIDAD//////////////////////////
            @ViewBag.Necropsia = lsDatosAdicionales.Tables[0].Rows[0]["Necropsia"].ToString();
            DxMortalidad = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad);
            DataTable dtDxMortalidad = DxMortalidad.Tables[0];
            @ViewBag.DxMortalidad = dtDxMortalidad;

            ////////////MUERTE FETAL//////////////////////////
            
            DxMuerteFetal = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento);
            DataTable dtDxMuerteFetal = DxMuerteFetal.Tables[0];
            @ViewBag.DxMuerteFetal = dtDxMuerteFetal;



            @ViewBag.CodeFirma = lsDatosAdicionales.Tables[0].Rows[0]["codeEpicrisis"];

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

            return PartialView("~/Views/Comun/Plantillas/InformeEpicrisisAlta.cshtml");

        }

        [HttpPost]
        public async Task<Boolean> GenerarHojaEpicrisisUCI(int idCuentaAtencion, int idAtencion)
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
                pageHtml = Url.Action("InformeEpicrisisUCI", "AltaMedica", new { area = "Hospitalizacion", idAtencion, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "H-EPIC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeEpicrisisUCI(int idAtencion, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            //DataSet DatosEvaluacion;
            DataSet DatosHosp;
            DataSet DxIngresos, DxEgresos, DxMortalidad, DxMuerteFetal, EstanciaHosp;
            DataSet lsDatosAdicionales;
            DataSet lsRecetasDespachadas;
            DataSet lsLaboratorio;
            DataSet lsImagenes;
            DataSet lsConsumoServicio;
            //DateTime today = DateTime.Today;

            //DalEvaluacionGinecoObstetraHosp daoEvaluacion = new DalEvaluacionGinecoObstetraHosp();
            DalHospitalizacion daoHosp = new DalHospitalizacion();
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalDiagnostico dxAtenciones = new DalDiagnostico();
            DalUtilitario dalUtili = new DalUtilitario();
            DalRecetas dalReceta = new DalRecetas();
            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();
            DalLaboratorio dalLaboratorio = new DalLaboratorio();
            DalImagenes dalImagenes = new DalImagenes();

            var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_IP");
            @ViewBag.ServerFiles = conex1.ToString();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            lsDatosAdicionales = await dalUtili.SeleccionarAtencionAtencionDatosAdicionalesPaciente(idAtencion);
            DalEvaluacionesUCI dalEvaluacionesUCI = new DalEvaluacionesUCI();

            DataSet DatosInforme = await dalEvaluacionesUCI.SeleccionarDatosInformeMedicoUCI(idAtencion);

            @ViewBag.NroHistoriaClinica = lsDatosAdicionales.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.NroCuenta = lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"];
            @ViewBag.FuenteFinanciamiento = lsDatosAdicionales.Tables[0].Rows[0]["FuenteFinanciamiento"];
            @ViewBag.Paciente = lsDatosAdicionales.Tables[0].Rows[0]["Paciente"];
            @ViewBag.FechaEvaluacion = lsDatosAdicionales.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = lsDatosAdicionales.Tables[0].Rows[0]["HoraEvaluacion"];
            @ViewBag.Edad = lsDatosAdicionales.Tables[0].Rows[0]["Edad"];
            @ViewBag.FechaNacimiento = lsDatosAdicionales.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = lsDatosAdicionales.Tables[0].Rows[0]["HoraNacimiento"];
            @ViewBag.Servicio = lsDatosAdicionales.Tables[0].Rows[0]["Servicio"];
            @ViewBag.Sexo = lsDatosAdicionales.Tables[0].Rows[0]["Sexo"];
            @ViewBag.Medico = lsDatosAdicionales.Tables[0].Rows[0]["Medico"];
            @ViewBag.Telefono = lsDatosAdicionales.Tables[0].Rows[0]["Telefono"];
            @ViewBag.Direccion = lsDatosAdicionales.Tables[0].Rows[0]["Direccion"];
            @ViewBag.Departamento = lsDatosAdicionales.Tables[0].Rows[0]["Departamento"];
            @ViewBag.Provincia = lsDatosAdicionales.Tables[0].Rows[0]["Provincia"];
            @ViewBag.Distrito = lsDatosAdicionales.Tables[0].Rows[0]["Distrito"];
            @ViewBag.CentroPoblado = lsDatosAdicionales.Tables[0].Rows[0]["CentroPoblado"];
            @ViewBag.Acompaniante = lsDatosAdicionales.Tables[0].Rows[0]["Acompaniante"];
            @ViewBag.TelefonoAcomp = lsDatosAdicionales.Tables[0].Rows[0]["TelefonoAcomp"];

            @ViewBag.FechaHoraIngreso = lsDatosAdicionales.Tables[0].Rows[0]["FechaHoraIngreso"].ToString();
            @ViewBag.ViaAdmision = lsDatosAdicionales.Tables[0].Rows[0]["OrigenAtencion"].ToString();
            @ViewBag.ServicioIngreso = lsDatosAdicionales.Tables[0].Rows[0]["ServicioIngreso"].ToString();
            @ViewBag.EspecialidadIngreso = lsDatosAdicionales.Tables[0].Rows[0]["EspecialidadIngreso"].ToString();
            @ViewBag.CamaIngreso = lsDatosAdicionales.Tables[0].Rows[0]["CamaIngreso"].ToString();
            @ViewBag.CodigoEstablecimiento = lsDatosAdicionales.Tables[0].Rows[0]["CodigoEstablecimiento"].ToString();
            @ViewBag.CodigoOrigenReferencia = lsDatosAdicionales.Tables[0].Rows[0]["CodigoOrigenReferencia"].ToString();
            @ViewBag.NombreOrigenReferencia = lsDatosAdicionales.Tables[0].Rows[0]["NombreOrigenReferencia"].ToString();
            @ViewBag.HistoriaClinica = lsDatosAdicionales.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.MasDe24Horas = lsDatosAdicionales.Tables[0].Rows[0]["MasDe24Horas"].ToString();

            @ViewBag.ExamenesAuxiliaresUCI = DatosInforme.Tables[0].Rows[0]["ExamenesAuxiliaresUCI"];
            @ViewBag.Anamnesis = DatosInforme.Tables[0].Rows[0]["RelatoCronologico"];
            @ViewBag.ExamenClinico = DatosInforme.Tables[0].Rows[0]["ExamenesFisicos"];
            @ViewBag.Evolucion = DatosInforme.Tables[0].Rows[0]["ComentarioApreciacionEvaluacionUlt"];

            //DatosEvaluacion = await daoEvaluacion.SeleccionarInformeEvaluacionHospitalizacion(idAtencion, idServicio, eval, idUsuario);
            ////////////DX INGRESO//////////////////////////
            DxIngresos = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso);
            DataTable dtDxIngreso = DxIngresos.Tables[0];
            @ViewBag.DxIngreso = dtDxIngreso;

            ////////////DATOS EVALUACION//////////////////////////
            DatosHosp = await daoHosp.EvaluacionHospitalizacionSeleccionar(idAtencion, 0);
            
            //@ViewBag.ExamenClinico = (DatosHosp.Tables[0].Rows.Count > 0) ? DatosHosp.Tables[0].Rows[0]["DescripcionExamenFisico"].ToString() : "";

            ////////////LABORATORIO//////////////////////////
            lsLaboratorio = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarByIdCuenta(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()));
            DataTable dtLaboratorio = lsLaboratorio.Tables[0];
            @ViewBag.Laboratorio = dtLaboratorio;

            ////////////IAMGENES//////////////////////////
            lsImagenes = await dalImagenes.ImgMovimientoLaboratorioSeleccionarByIdCuenta(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()));
            DataTable dtImagen = lsImagenes.Tables[0];
            @ViewBag.Imagen = dtImagen;

            ////////////RECETAS DESPACHADAS///////////////////////////
            lsRecetasDespachadas = dalReceta.RecetaDetalleSeleccionarSoloMedicamentosDespachadasPorCuenta(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()), 5);
            DataTable dtRecetasDespachadas = lsRecetasDespachadas.Tables[0];
            @ViewBag.RecetasDespachadas = dtRecetasDespachadas;

            ////////////CONSUMO SERVICIO///////////////////////////
            lsConsumoServicio = await dalConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(int.Parse(lsDatosAdicionales.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()));
            DataTable dtConsumoServicio = lsConsumoServicio.Tables[0];
            @ViewBag.ConsumoServicio = dtConsumoServicio;

            ////////////ESTANCIA///////////////////////////
            EstanciaHosp = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(idAtencion, 1);
            DataTable dtEstanciaHosp = EstanciaHosp.Tables[0];
            @ViewBag.EstanciaHosp = dtEstanciaHosp;

            ////////////EGRESO//////////////////////////
            @ViewBag.FechaHoraEgreso = lsDatosAdicionales.Tables[0].Rows[0]["FechaHoraEgreso"].ToString();
            @ViewBag.EstadiaTotal = lsDatosAdicionales.Tables[0].Rows[0]["EstadiaTotal"].ToString();
            @ViewBag.TipoAlta = lsDatosAdicionales.Tables[0].Rows[0]["TipoAlta"].ToString();
            @ViewBag.CondicionAlta = lsDatosAdicionales.Tables[0].Rows[0]["CondicionAlta"].ToString();
            @ViewBag.CodigoDestinoReferencia = lsDatosAdicionales.Tables[0].Rows[0]["CodigoDestinoReferencia"].ToString();
            @ViewBag.NombreDestinoReferencia = lsDatosAdicionales.Tables[0].Rows[0]["NombreDestinoReferencia"].ToString();
            @ViewBag.Pronostico = lsDatosAdicionales.Tables[0].Rows[0]["Pronostico"].ToString();

            DxEgresos = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso);
            DataTable dtDxEgreso = DxEgresos.Tables[0];
            @ViewBag.DxEgreso = dtDxEgreso;

            ////////////MORTALIDAD//////////////////////////
            @ViewBag.Necropsia = lsDatosAdicionales.Tables[0].Rows[0]["Necropsia"].ToString();
            DxMortalidad = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad);
            DataTable dtDxMortalidad = DxMortalidad.Tables[0];
            @ViewBag.DxMortalidad = dtDxMortalidad;

            ////////////MUERTE FETAL//////////////////////////

            DxMuerteFetal = await dxAtenciones.DiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento);
            DataTable dtDxMuerteFetal = DxMuerteFetal.Tables[0];
            @ViewBag.DxMuerteFetal = dtDxMuerteFetal;



            @ViewBag.CodeFirma = lsDatosAdicionales.Tables[0].Rows[0]["codeEpicrisis"];

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

            return PartialView("~/Views/Comun/Plantillas/InformeEpicrisisAltaUCI.cshtml");

        }

        public async Task<bool> GenerarHojaRefCon(int idCuentaAtencion, int idRefCon, string tipo)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;
                int idTipo = 0;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                if (tipo == "RF")
                {
                    idTipo = 1;
                }
                else if (tipo == "CRF")
                {
                    idTipo = 2;
                }

                stringHtml = null;
                pageHtml = Url.Action("HojaRefCon", "AltaMedica", new { area = "Comun", idRefCon = idRefCon, tipo = idTipo }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idRefCon, 0, tipo, 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }

        }

        public async Task<ActionResult> HojaRefCon(int idRefCon, int tipo)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            // int Anio, String NroHistoria, int bd) {
            DataSet HojaPaciente = new DataSet();
            DataSet lsDiagnosticos;

            DalReferencia daoRef = new DalReferencia();
            HojaPaciente = daoRef.DatosHojaRefCon(idRefCon, tipo);

            var idAtencion = Int32.Parse(HojaPaciente.Tables[0].Rows[0]["IdAtencion"].ToString());

            DalAtenciones dalAtenciones = new DalAtenciones();
            lsDiagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarXidAtencion(Int32.Parse(HojaPaciente.Tables[0].Rows[0]["IdAtencion"].ToString()));
            DataTable dtDx = lsDiagnosticos.Tables[0];
            //int anio = Int32.Parse(DatosPaciente.Tables[0].Rows[0]["Anio"].ToString());

            @ViewBag.NroHoja = HojaPaciente.Tables[0].Rows[0]["IpressOrigen"] + "-" + HojaPaciente.Tables[0].Rows[0]["NroHoja"];

            @ViewBag.Fecha = HojaPaciente.Tables[0].Rows[0]["Fecha"];
            @ViewBag.Dia = HojaPaciente.Tables[0].Rows[0]["Dia"];
            @ViewBag.Mes = HojaPaciente.Tables[0].Rows[0]["Mes"];
            @ViewBag.Anio = HojaPaciente.Tables[0].Rows[0]["Anio"];
            @ViewBag.Hora = HojaPaciente.Tables[0].Rows[0]["Hora"];

            @ViewBag.IpressOrigen = HojaPaciente.Tables[0].Rows[0]["IpressOrigen"];
            @ViewBag.Origen = HojaPaciente.Tables[0].Rows[0]["Origen"];
            @ViewBag.UpsOrigen = HojaPaciente.Tables[0].Rows[0]["UpsOrigen"];

            @ViewBag.IpressDestino = HojaPaciente.Tables[0].Rows[0]["IpressDestino"];
            @ViewBag.Destino = HojaPaciente.Tables[0].Rows[0]["Destino"];
            @ViewBag.UpsDestino = HojaPaciente.Tables[0].Rows[0]["UpsDestino"];

            @ViewBag.TipoDocumento = HojaPaciente.Tables[0].Rows[0]["TipoDocumento"];
            @ViewBag.NroDocumento = HojaPaciente.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.Rn = HojaPaciente.Tables[0].Rows[0]["Rn"];
            @ViewBag.Financiador = HojaPaciente.Tables[0].Rows[0]["Financiador"];
            @ViewBag.NroAfiliacion = HojaPaciente.Tables[0].Rows[0]["NroAfiliacion"];
            @ViewBag.NroHistoria = HojaPaciente.Tables[0].Rows[0]["NroHistoria"];
            @ViewBag.ApPaterno = HojaPaciente.Tables[0].Rows[0]["ApPaterno"];
            @ViewBag.ApMaterno = HojaPaciente.Tables[0].Rows[0]["ApMaterno"];
            @ViewBag.Nombres = HojaPaciente.Tables[0].Rows[0]["Nombres"];
            @ViewBag.Sexo = HojaPaciente.Tables[0].Rows[0]["Sexo"];
            @ViewBag.FechaNacimiento = HojaPaciente.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.Edad = HojaPaciente.Tables[0].Rows[0]["Edad"];
            @ViewBag.Domicilio = HojaPaciente.Tables[0].Rows[0]["Domicilio"];
            @ViewBag.Departamento = HojaPaciente.Tables[0].Rows[0]["Departamento"];
            @ViewBag.Provincia = HojaPaciente.Tables[0].Rows[0]["Provincia"];
            @ViewBag.Distrito = HojaPaciente.Tables[0].Rows[0]["Distrito"];


            //@ViewBag.DxEgreso = HojaPaciente.Tables[0].Rows[0]["DxEgreso"];
            @ViewBag.DxEgreso = dtDx;
            //@ViewBag.IndiceDx = 0;
            @ViewBag.Tratamiento = HojaPaciente.Tables[0].Rows[0]["Tratamiento"];


            @ViewBag.Especialidad = HojaPaciente.Tables[0].Rows[0]["Especialidad"];

            @ViewBag.Medico = HojaPaciente.Tables[0].Rows[0]["Medico"];
            @ViewBag.ProfesionMedico = HojaPaciente.Tables[0].Rows[0]["ProfesionMedico"];
            @ViewBag.ColegioMedico = HojaPaciente.Tables[0].Rows[0]["ColegioMedico"];

            @ViewBag.MedicoEESS = HojaPaciente.Tables[0].Rows[0]["MedicoEESS"];
            @ViewBag.ProfesionMedicoEESS = HojaPaciente.Tables[0].Rows[0]["ProfesionMedicoEESS"];
            @ViewBag.ColegioMedicoEESS = HojaPaciente.Tables[0].Rows[0]["ColegioMedicoEESS"];

            @ViewBag.Condicion = HojaPaciente.Tables[0].Rows[0]["IdCondicionUsuario"];

            @ViewBag.CodeFirma = HojaPaciente.Tables[0].Rows[0]["code"];
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

            if (tipo == 1)
            {
                @ViewBag.TP = HojaPaciente.Tables[0].Rows[0]["TP"];
                @ViewBag.PA = HojaPaciente.Tables[0].Rows[0]["PA"];
                @ViewBag.FR = HojaPaciente.Tables[0].Rows[0]["FR"];
                @ViewBag.FC = HojaPaciente.Tables[0].Rows[0]["FC"];
                @ViewBag.Anamnesis = HojaPaciente.Tables[0].Rows[0]["Anamnesis"];
                @ViewBag.ExamenFisico = HojaPaciente.Tables[0].Rows[0]["ExamenFisico"];
                @ViewBag.Motivo = HojaPaciente.Tables[0].Rows[0]["Motivo"];
                @ViewBag.DetalleMotivo = HojaPaciente.Tables[0].Rows[0]["DetalleMotivo"];
                @ViewBag.Observaciones = HojaPaciente.Tables[0].Rows[0]["Observaciones"];
                @ViewBag.CondicionPaciente = HojaPaciente.Tables[0].Rows[0]["CondicionPaciente"];
                @ViewBag.TipoTransporte = HojaPaciente.Tables[0].Rows[0]["TipoTransporte"];
                return PartialView("~/Views/Comun/Plantillas/HojaReferencia.cshtml");
            }
            else
            {
                @ViewBag.DxOrigen = HojaPaciente.Tables[0].Rows[0]["DxOrigen"];
                @ViewBag.DxIngreso = HojaPaciente.Tables[0].Rows[0]["DxIngreso"];
                @ViewBag.Calificacion = HojaPaciente.Tables[0].Rows[0]["Calificacion"];
                @ViewBag.Recomendaciones = HojaPaciente.Tables[0].Rows[0]["Recomendaciones"];
                return PartialView("~/Views/Comun/Plantillas/HojaContrareferencia.cshtml");
            }




            /*@ViewBag.FechaNac = DatosPaciente.Tables[0].Rows[0]["FechaNac"];
            @ViewBag.HoraNac = DatosPaciente.Tables[0].Rows[0]["HoraNac"];
            @ViewBag.Sexo = DatosPaciente.Tables[0].Rows[0]["Sexo"].ToString().ToUpper(); ;
            @ViewBag.Condicion = DatosPaciente.Tables[0].Rows[0]["Condicion"].ToString().ToUpper();
            @ViewBag.TipoParto = DatosPaciente.Tables[0].Rows[0]["TipoParto"].ToString().ToUpper();
            @ViewBag.Peso = DatosPaciente.Tables[0].Rows[0]["Peso"];
            if (DatosPaciente.Tables[0].Rows[0]["Peso"] != null)
            {
                @ViewBag.Peso = DatosPaciente.Tables[0].Rows[0]["Peso"] + " gr";
                @ViewBag.PesoNum = DatosPaciente.Tables[0].Rows[0]["Peso"];
            }
            @ViewBag.Talla = DatosPaciente.Tables[0].Rows[0]["Talla"];
            if (DatosPaciente.Tables[0].Rows[0]["Peso"] != null)
            {
                @ViewBag.Talla = DatosPaciente.Tables[0].Rows[0]["Talla"] + " cm";
            }
            @ViewBag.EdadGes = DatosPaciente.Tables[0].Rows[0]["EdadGes"];
            if (@ViewBag.EdadGes != null)
            {
                @ViewBag.EdadGes = DatosPaciente.Tables[0].Rows[0]["EdadGes"] + " Semanas";
                @ViewBag.EdadGesNum = DatosPaciente.Tables[0].Rows[0]["EdadGes"];
            }

            @ViewBag.Asiento = DatosPaciente.Tables[0].Rows[0]["NroFolio"].ToString().ToUpper();
            @ViewBag.NroFolio = DatosPaciente.Tables[0].Rows[0]["Asiento"].ToString().ToUpper();
            @ViewBag.Padre = DatosPaciente.Tables[0].Rows[0]["Padre"].ToString().ToUpper();

            String[] Fecha = DateTime.Now.ToLongDateString().Split(',');
            @ViewBag.Fecha = Fecha[1];
            //@ViewBag.Usuario = HttpContext.Session.GetString("codusuario").ToString().ToUpper(); 

            if (anio >= 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstanciaRn.cshtml");
            }
            else
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia2Rn.cshtml");
            }

            /*
            if (anio >= 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstanciaRn.cshtml");
            } else if(anio >= 2005 && anio < 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia2Rn.cshtml");
            } else
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia3Rn.cshtml");
            }
            */

        }

        /* RMOREANO 31102026*/

        public async Task<bool> GenerarPapeletaEgreso(int idCuentaAtencion)
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
                pageHtml = Url.Action("GenerarPapeletaEgresoPdf", "Emergencia", new { area = "Emergencia", idCuentaAtencion, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idCuentaAtencion, 0, "E-PE", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                return false;
            }
        }


    }
}
