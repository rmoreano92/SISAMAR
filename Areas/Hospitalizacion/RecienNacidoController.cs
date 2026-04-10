using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SelectPdf;
using System.Text;
using System.Net.Mime;
using System.Diagnostics;
using System.Data.OleDb;
using System.Data.Odbc;
using Newtonsoft.Json;
using WebAppMaternidad.CapaEntidades;
using DocumentFormat.OpenXml.Office2013.Word;
using WebAppMaternidad.CapaDatos;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class RecienNacidoController : Controller
    {

        private IWebHostEnvironment _hostingEnvironment;

        public RecienNacidoController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> ListarPacientesRegistroRecienNacido(string FechaFiltro, int TipoFecha, int NroCuenta, int NroHistoria, int AnioNac, string NroDocumento, string ApPaterno, string ApMaterno, string NroDocumentoMadre, int idGrupo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet ListaPacientes;
            DalRecienNacido daoCitas = new DalRecienNacido();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaPacientes = await daoCitas.ListarPacientesRegistroRecienNacido(FechaFiltro, TipoFecha, NroCuenta, NroHistoria, AnioNac, NroDocumento, ApPaterno, ApMaterno, NroDocumentoMadre, idGrupo, idUsuario);
            return Json(ListaPacientes);
        }

        public async Task<IActionResult> RegistrarRN(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                int PermisoFiliacionRn = await dlUtilitario.ValidarPermisoUsuario(idUsuario, "FILIACION-REGISTRO-RN");
                int PermisoRegistroNacimiento = await dlUtilitario.ValidarPermisoUsuario(idUsuario, "REGISTRO-NACIMIENTO");


                // FIN 
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                    ViewBag.PermisoFiliacionRn = PermisoFiliacionRn;
                    ViewBag.PermisoRegistroNacimiento = PermisoRegistroNacimiento;

                }

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalización";
                return View("~/Views/Hospitalizacion/RecienNacido.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }


        [HttpGet]
        public async Task<ActionResult> ListarRiesgosObstetricos()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarRiesgosObstetricos");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarCondicionRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarCondicionRn");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTiemposClampaje()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarTiemposClampaje");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarContactoPielaPiel()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarContactoPielaPiel");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTiemposContactoPielaPiel()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarTiemposContactoPielaPiel");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarMedicosObstetrasEnfermeras()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarMedicosObstetrasEnfermeras_V2");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTipoPartoRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarTipoPartoRn");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTiposGestacion()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_ListarTiposGestacion");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarNumeroGemelar()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarNumeroGemelar");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTiposProcedenciaRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarTiposProcedenciaRn");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTiposReanimacionRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarTiposReanimacion");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarTiposTransporteRn()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarTiposTransporteHosp");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarServiciosNacimiento()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarServiciosNacimiento");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarServiciosIngresoRecienNacido()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarServiciosIngresoRecienNacido");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarDiagnosticosIngresoRecienNacido()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarDiagnosticosIngresoRecienNacido");
            return Json(lstMetodo);
        }

        [HttpPost]
        public async Task<ActionResult> ListarRecienNacidosDiagnosticos(int idRecienNacido)
        {
            DataSet lsRespuesta;
            DalRecienNacido daoRecienNacido = new DalRecienNacido();

            lsRespuesta = await daoRecienNacido.SeleccionarRecienNacidosDiagnosticos(idRecienNacido);
            return Json(lsRespuesta);
        }


        [HttpPost]
        public async Task<ActionResult> GuardarRegistroRn(RecienNacido objRecienNacido, string lstDiagnosticosRn, string tabla, int nacidoEn, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al eliminar el registro de nacimiento.";
            int rsp = 0;
            try
            {
                objRecienNacido.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido daoRecienNacido = new DalRecienNacido();
                var lstobjDiagnosticosRn = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosRn);
                rsp = await daoRecienNacido.GuardarRegistroRN(objRecienNacido, lstobjDiagnosticosRn, tabla, nacidoEn, idListBar);
                if (rsp > 0)
                {
                    respuesta = "Se guardo el registro de nacimiento correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarRegistroRecienNacidoFiliacion(RecienNacido objRecienNacido, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //int rsp = 0;
            DataSet rsp = null;
            string respuesta = "";
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido dal = new DalRecienNacido();
                
                rsp = await dal.GuardarRegistroRecienNacidoFiliacion(objRecienNacido, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, sesion = true });
        }

        
        [HttpPost]
        public async Task<ActionResult> ListarRegistroNacimiento()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //int rsp = 0;
            DataSet rsp = null;
            string respuesta = "";
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido dal = new DalRecienNacido();
                rsp = await dal.ListarRegistroNacimiento();
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarRegistroNacimiento(int idRegistroNacimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //int rsp = 0;
            DataSet rsp = null;
            string respuesta = "";
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido dal = new DalRecienNacido();
                rsp = await dal.SeleccionarRegistroNacimiento(idRegistroNacimiento);
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, sesion = true });
        }


        [HttpPost]
        public async Task<ActionResult> GuardarRegistroNacimiento(RecienNacido recienNacido, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //int rsp = 0;
            DataSet rsp = null;
            string respuesta = "";
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido dal = new DalRecienNacido();                
                rsp = await dal.GuardarRegistroNacimiento(recienNacido, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarRegistroNacimiento(int idRegistroNacimiento, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //int rsp = 0;
            DataSet rsp = null;
            string respuesta = "";
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido dal = new DalRecienNacido();
                rsp = await dal.EliminarRegistroNacimiento(idRegistroNacimiento, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, sesion = true });
        }

        [HttpPost]
        public ActionResult MigrarHistoriaPacientes(String pacientes, string anio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            Conexion conexion = new Conexion();
            string respuesta = "";
            int idUsuario = 0;
            int rsp = 0;
            int cantidad = 0;
            //OleDbConnection con;
            String rutaDB = conexion.ObtenerServidorEIDDSIP() + "EIDDSIP_" + anio + "/EIDDSIP_" + anio.Substring(2, 2) + ".mdb";
            String cadenaConexionEIDDSIP = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaDB;

            try
            {
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                // = conexion.ObtenerServidorEIDDSIP();
                var objPacientes = JsonConvert.DeserializeObject<List<PacientesMigracion>>(pacientes);

                //con = new OleDbConnection(cadenaConexionEIDDSIP);
                //con.Open();//se abre una conexion
                
                List<PacientesMigracion> lstPacientes = new List<PacientesMigracion>();
                lstPacientes = objPacientes.ToList();

                ////////////////////////////////////////////////////////////////////////
                using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
                {
                    connection.Open();
                    for (var i = 0; i < lstPacientes.Count; i++)
                    {
                        string selectHistoria = "select count(*) as tot from RHOSP_NEONATOLOGIA_C  where PACHIS_RN='" + lstPacientes[i].hcNeo.ToString() + "'";

                        using (OleDbDataAdapter adapter = new OleDbDataAdapter(selectHistoria, connection))
                        {
                            DataSet d = new DataSet();
                            adapter.Fill(d);

                            foreach (DataRow row in d.Tables[0].Rows)
                            {
                                cantidad = Int32.Parse(row["tot"].ToString());
                                if (cantidad == 0)
                                {
                                    string insertHistoria = "insert into RHOSP_NEONATOLOGIA_C (PACHIS_RN, PAC_RES, PACHIS_MADRE, EDAD_MADRE, TIP_PARTO, PACPAT, PACMAT, PACNOM, FECH_NAC_RN, SEXO, HORA_NEC, PESO_NAC, PER_CEFA,LONGITUD, GEN_NRO, APGAR_1, APGAR_5, ATENDIO, MEDICO_ATEND, RESHAB) values (" +
                                        "'" + lstPacientes[i].hcNeo.ToString() + "'," +
                                        "'" + lstPacientes[i].cnv.ToString() + "'," +
                                        "'" + lstPacientes[i].hcMadre.ToString() + "'," +
                                        "'" + lstPacientes[i].edadMadre.ToString() + "'," +
                                        "'" + lstPacientes[i].tipoParto.ToString() + "'," +
                                        "'" + lstPacientes[i].apPaterno.ToString() + "'," +
                                        "'" + lstPacientes[i].apMaterno.ToString() + "'," +
                                        "'" + lstPacientes[i].nombres.ToString() + "'," +
                                        "'" + lstPacientes[i].fechaNacimiento.ToString() + "'," +
                                        "'" + lstPacientes[i].sexo.ToString() + "'," +
                                        "'" + lstPacientes[i].horaNacimiento.ToString() + "'," +
                                        "'" + lstPacientes[i].peso.ToString() + "'," +
                                        "'" + lstPacientes[i].perCefalico.ToString() + "'," +
                                        "'" + lstPacientes[i].talla.ToString() + "'," +
                                        "'" + lstPacientes[i].nroHijo.ToString() + "'," +
                                        "'" + lstPacientes[i].apgarUno.ToString() + "'," +
                                        "'" + lstPacientes[i].apgarCinco.ToString() + "'," +
                                        "'" + lstPacientes[i].atendidoPor.ToString() + "'," +
                                        "'" + lstPacientes[i].profesionalCodigo.ToString() + "'," +
                                        "'" + lstPacientes[i].idDistrito.ToString() + "')";

                                    using (OleDbCommand cmd = new OleDbCommand(insertHistoria, connection))
                                    {
                                        //cmd.ExecuteNonQuery();
                                        cmd.ExecuteReader();
                                    }

                                    respuesta = respuesta + "<span style='color: #a5dc86;'>Historia Migrada: " + lstPacientes[i].hcNeo.ToString() + "</span><br>";
                                } 
                                else
                                {
                                    respuesta = respuesta + "<span style='color: #ffc107;'>Historia Ya Migrada: " + lstPacientes[i].hcNeo.ToString() + "</span><br>";
                                }
                                
                                //Console.WriteLine("Cantidad: " + row["tot"]);
                            }
                        }
                        rsp = 1;
                    }
                    connection.Close();//se cierra la conexion
                }

                if (rsp > 0)
                {
                    respuesta = respuesta + "Se migró los pacientes correctamente.";
                } else
                {
                    respuesta = respuesta + "No existen pacientes para migrar.";
                }
            }
            catch (Exception ex)
            {
                respuesta = respuesta + "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }


        public ActionResult SeleccionarRegistroRN(int idCuentaAtencion, int idRegistroRn, string tabla)
        {
            DataSet lstRegistroRn;
            DalRecienNacido daoRegistronRn = new DalRecienNacido();
            lstRegistroRn = daoRegistronRn.SeleccionarRegistroRN(idCuentaAtencion, idRegistroRn, tabla);
            return Json(lstRegistroRn);
        }

        public ActionResult SeleccionarRegistroRNporHistoria(int nroHistoria)
        {
            DataSet lstRegistroRn;
            DalRecienNacido daoRegistronRn = new DalRecienNacido();
            lstRegistroRn = daoRegistronRn.SeleccionarRegistroRNporHistoria(nroHistoria);
            return Json(lstRegistroRn);
        }

        public ActionResult VerificarNacimientoRegistroRN(int idPaciente)
        {
            DataSet lstRegistroRn;
            DalRecienNacido daoRegistronRn = new DalRecienNacido();
            lstRegistroRn = daoRegistronRn.VerificarNacimientoRegistroRN(idPaciente);
            return Json(lstRegistroRn);
        }


        [HttpPost]
        public ActionResult EliminarRegistroRn(int idRegistroRN, string tabla)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al eliminar el registro de nacimiento.";
            int rsp = 0;
            int idUsuario;
            int bSesion = 0;
            try
            {
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalRecienNacido daoRegistroRn = new DalRecienNacido();
                rsp = daoRegistroRn.EliminarRegistroRn(idRegistroRN, tabla, idUsuario);
                if (rsp > 0)
                {
                    respuesta = "Se elimino el registro de nacimiento correctamente.";
                    bSesion = 1;
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                bSesion = 0;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        }

        public async Task<ActionResult> ListarMigracionPacientesRecienNacido(string TipoFiltro, string Filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet ListaPacientes;
            DalRecienNacido daoCitas = new DalRecienNacido();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaPacientes = await daoCitas.ListarMigracionPacientesRecienNacido(TipoFiltro, Filtro);
            return Json(ListaPacientes);
        }


        ////////////////////////////////REPORTES////////////////////////////////////////
        [HttpPost]
        //public async Task<ActionResult> GenerarParteDiario(int idCuenta, DateTime fechaInicio)
        public ActionResult GenerarParteDiario(int idCuenta, DateTime fechaInicio)
        {
            string rsp = "";
            bool bSesion = true;
            string respuesta = "Error al registrar la generación de constancia.";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
                //return false;
            }
            try
            {
                //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
                
                //var resp = await GenerarReportePdf(fechaInicio);
                var resp = GenerarReportePdf(fechaInicio);

                rsp = "Ok";
                //if (resp.estadoCreacion.ToString() == "Ok")
                //{
                respuesta = "Se creo el reporte correctamente.";
                //}
                return resp;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            //return true;
        }

        //public async Task<FileStreamResult> GenerarReportePdf(DateTime FechaInicio)//int Anio, String NroHistoria, int bd)
        public FileStreamResult GenerarReportePdf(DateTime FechaInicio)//int Anio, String NroHistoria, int bd)
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
            int idUsuario;
            string tipo;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            MemoryStream ms = new MemoryStream();
            byte[] pdf;

            try
            {
                usuario = HttpContext.Session.GetString("usuario");
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                tipo = "RPT-RN";
                //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

                // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

                path = Path.Combine(sWebRootFolder, "Reportes", ((DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                Console.WriteLine("path: " + path);
                Comun.ClUtilirario cl = new Comun.ClUtilirario();

                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationLandscape = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Landscape", true);
                ohtml.Options.PdfPageOrientation = pdfOrientationLandscape;
                ohtml.Options.PdfPageSize = pageSize;
                ohtml.Options.MarginLeft = 20;
                ohtml.Options.MarginRight = 20;
                ohtml.Options.MarginTop = 20;
                ohtml.Options.MarginBottom = 20;
                ohtml.Options.WebPageWidth = 1122;
                ohtml.Options.WebPageHeight = 793;
                //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

                //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
                string Ruta = Url.Action("ParteDiarioRegistroRn", "RecienNacido", new { area = "Hospitalizacion", FechaInicio, idUsuario, usuario }, "http");
                PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
                
                //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
                //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
                pdf =  obPdfDoc.Save();
                //generacion_pdf = "Ok";
                
                ms = new MemoryStream();
                ms.Write(pdf, 0, pdf.Length);
                ms.Position = 0;

                obPdfDoc.Close();

                return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
                /*if (generacion_pdf == "Ok")
                {
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuenta.ToString()), tipo, Int32.Parse(idCuenta.ToString()));
                    //quita creacion 
                    //Espera resultado de la tarea, no termina hasta termine
                    resulfirma = await Tbol;
                    resp = true;
                }*/
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                //return Json(new { exep = e.ToString() });
                return new FileStreamResult(ms, "Error al generar el parte diario.");
                //return e.ToString();
                //return false;
                //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
            }

            //return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
            
        }


        public async Task<ActionResult> ParteDiarioRegistroRn(DateTime FechaInicio, int idUsuario, string usuario)
        {

            DalRecienNacido dalRpt = new DalRecienNacido();
            
            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;

            DataSet DatosRn = await dalRpt.ReporteRegistroRn(idUsuario, FechaInicio, FechaInicio);

            DataTable rn = DatosRn.Tables[0];

            @ViewBag.Fecha = FechaInicio.ToString("dd/MM/yyyy");
            @ViewBag.RegistrosRn = rn;
            /*
            @ViewBag.FechaEvaluacion = DatosRn.Tables[0].Rows[0]["FechaEvaluacion"];
            @ViewBag.HoraEvaluacion = DatosRn.Tables[0].Rows[0]["HoraEvaluacion"];

            //@ViewBag.NroEvaluacion = eval;

            @ViewBag.Paciente = DatosRn.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroHistoriaClinica = DatosRn.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.FechaNacimiento = DatosRn.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.HoraNacimiento = DatosRn.Tables[0].Rows[0]["HoraNacimiento"];
            @ViewBag.Servicio = DatosRn.Tables[0].Rows[0]["Servicio"];

            @ViewBag.TiempoEnfermedad = DatosRn.Tables[0].Rows[0]["TiempoEnfermedad"];
            @ViewBag.Inicio = DatosRn.Tables[0].Rows[0]["Inicio"];
            @ViewBag.Curso = DatosRn.Tables[0].Rows[0]["Curso"];

            @ViewBag.DificultadRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["DificultadRespiratoria"];
            @ViewBag.Diarrea = DatosEvaluacion.Tables[0].Rows[0]["Diarrea"];
            @ViewBag.DistensionAbdominal = DatosEvaluacion.Tables[0].Rows[0]["DistensionAbdominal"];
            @ViewBag.Cianosis = DatosEvaluacion.Tables[0].Rows[0]["Cianosis"];
            @ViewBag.MalOlorOmbligo = DatosEvaluacion.Tables[0].Rows[0]["MalOlorOmbligo"];
            @ViewBag.Ictericia = DatosEvaluacion.Tables[0].Rows[0]["Ictericia"];
            @ViewBag.Dolor = DatosEvaluacion.Tables[0].Rows[0]["Dolor"];
            @ViewBag.Convulsiones = DatosEvaluacion.Tables[0].Rows[0]["Convulsiones"];
            @ViewBag.Fiebre = DatosEvaluacion.Tables[0].Rows[0]["Fiebre"];
            @ViewBag.Vomitos = DatosEvaluacion.Tables[0].Rows[0]["Vomitos"];
            @ViewBag.Hemorragia = DatosEvaluacion.Tables[0].Rows[0]["Hemorragia"];
            @ViewBag.Otros = DatosEvaluacion.Tables[0].Rows[0]["Otros"];
            @ViewBag.OtrosSintomas = DatosEvaluacion.Tables[0].Rows[0]["OtrosSintomas"];

            @ViewBag.Relato = DatosEvaluacion.Tables[0].Rows[0]["Relato"];

            @ViewBag.Antecedentes = DatosEvaluacion.Tables[0].Rows[0]["Antecedentes"];
            @ViewBag.PesoNacer = DatosEvaluacion.Tables[0].Rows[0]["PesoNacer"];
            @ViewBag.TallaNacer = DatosEvaluacion.Tables[0].Rows[0]["TallaNacer"];
            @ViewBag.PerimetroCefalicoNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroCefalicoNacer"];
            @ViewBag.PerimetroToracioNacer = DatosEvaluacion.Tables[0].Rows[0]["PerimetroToracioNacer"];
            @ViewBag.ApgarNacer = DatosEvaluacion.Tables[0].Rows[0]["ApgarNacer"];
            @ViewBag.AntecedentesPatlogicosNacer = DatosEvaluacion.Tables[0].Rows[0]["AntecedentesPatlogicosNacer"];

            @ViewBag.FrecuenciaCardiaca = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaCardiaca"];
            @ViewBag.FrecuenciaRespiratoria = DatosEvaluacion.Tables[0].Rows[0]["FrecuenciaRespiratoria"];
            @ViewBag.Temperatura = DatosEvaluacion.Tables[0].Rows[0]["Temperatura"];
            @ViewBag.Peso = DatosEvaluacion.Tables[0].Rows[0]["Peso"];

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

            @ViewBag.DxEvaluacion = dtDx;

            @ViewBag.ImpresionDiagnostica = DatosEvaluacion.Tables[0].Rows[0]["ImpresionDiagnostica"];
            @ViewBag.PlanTrabajo = DatosEvaluacion.Tables[0].Rows[0]["PlanTrabajo"];
            @ViewBag.Tratamiento = DatosEvaluacion.Tables[0].Rows[0]["Tratamiento"];

            @ViewBag.TipoDestino = DatosEvaluacion.Tables[0].Rows[0]["TipoDestino"];
            @ViewBag.TipoAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoAlta"];
            @ViewBag.TipoCondicionAlta = DatosEvaluacion.Tables[0].Rows[0]["TipoCondicionAlta"];

            @ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];

            */
            return PartialView("~/Views/Hospitalizacion/Plantillas/ParteDiarioRegistroRecienNacidos.cshtml");

        }

        public async Task<IActionResult> ReporteEstadisticoRn(DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/Hospitalizacion/RegistroRN/PlantillaReporteEstadisticoRN.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 11;
                DalRecienNacido dalRpt = new DalRecienNacido();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras(idUsuario, FechaInicio, FechaFin, TipoServicio);
                DataSet dsTabla = await dalRpt.ReporteEstadisticoRegistroRn(idUsuario, FechaInicio, FechaFin);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    wsHoja1.Cell(FilaIni + j, 1).Value = j + 1 ;
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["NroDocumentoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["TipoDocumentoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["NroHistoriaMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["DireccionMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["TelefonoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["ApPaternoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["ApMaternoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["NombresMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["NacionalidadMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["DistritoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["EstadoCivilMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["FuenteFinanciamientoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["GradoInstruccionMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["EdadMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 16).Value = dsTabla.Tables[0].Rows[j]["EdadGestacionalMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 17).Value = dsTabla.Tables[0].Rows[j]["Gesta"].ToString();  ////////
                    wsHoja1.Cell(FilaIni + j, 18).Value = dsTabla.Tables[0].Rows[j]["Paridad"].ToString();
                    wsHoja1.Cell(FilaIni + j, 19).Value = dsTabla.Tables[0].Rows[j]["TipoPartoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 20).Value = dsTabla.Tables[0].Rows[j]["PartoConAcompaniante"].ToString(); ////////
                    wsHoja1.Cell(FilaIni + j, 21).Value = dsTabla.Tables[0].Rows[j]["PartoConAnalgesia"].ToString(); //////////
                    wsHoja1.Cell(FilaIni + j, 22).Value = dsTabla.Tables[0].Rows[j]["PartoTrasladoConjunto"].ToString(); /////////////
                    wsHoja1.Cell(FilaIni + j, 23).Value = dsTabla.Tables[0].Rows[j]["DxCodigoParto"].ToString();
                    wsHoja1.Cell(FilaIni + j, 24).Value = dsTabla.Tables[0].Rows[j]["DxNombreParto"].ToString();

                    wsHoja1.Cell(FilaIni + j, 25).Value = dsTabla.Tables[0].Rows[j]["NroHistoria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 26).Value = dsTabla.Tables[0].Rows[j]["Cnv"].ToString();
                    wsHoja1.Cell(FilaIni + j, 27).Value = dsTabla.Tables[0].Rows[j]["ApPaternoRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 28).Value = dsTabla.Tables[0].Rows[j]["ApMaternoRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 29).Value = dsTabla.Tables[0].Rows[j]["NombresRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 30).Value = dsTabla.Tables[0].Rows[j]["TiposGestacion"].ToString();
                    wsHoja1.Cell(FilaIni + j, 31).Value = dsTabla.Tables[0].Rows[j]["Fetos"].ToString();
                    wsHoja1.Cell(FilaIni + j, 32).Value = dsTabla.Tables[0].Rows[j]["Gemelar"].ToString();
                    wsHoja1.Cell(FilaIni + j, 33).Value = dsTabla.Tables[0].Rows[j]["FechaNacimiento"].ToString();
                    wsHoja1.Cell(FilaIni + j, 34).Value = dsTabla.Tables[0].Rows[j]["HoraNacimiento"].ToString();
                    wsHoja1.Cell(FilaIni + j, 35).Value = dsTabla.Tables[0].Rows[j]["Sexo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 36).Value = dsTabla.Tables[0].Rows[j]["CondicionRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 37).Value = dsTabla.Tables[0].Rows[j]["PosicionParto"].ToString();
                    wsHoja1.Cell(FilaIni + j, 38).Value = dsTabla.Tables[0].Rows[j]["ServicioNacimiento"].ToString();
                    wsHoja1.Cell(FilaIni + j, 39).Value = dsTabla.Tables[0].Rows[j]["TallaRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 40).Value = dsTabla.Tables[0].Rows[j]["PerimetroCefalico"].ToString();
                    wsHoja1.Cell(FilaIni + j, 41).Value = dsTabla.Tables[0].Rows[j]["PerimetroToracico"].ToString(); /////////////
                    wsHoja1.Cell(FilaIni + j, 42).Value = dsTabla.Tables[0].Rows[j]["PesoRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 43).Value = dsTabla.Tables[0].Rows[j]["ApgarUno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 44).Value = dsTabla.Tables[0].Rows[j]["ApgarCinco"].ToString();
                    wsHoja1.Cell(FilaIni + j, 45).Value = dsTabla.Tables[0].Rows[j]["ClampajeTardio"].ToString(); /////////////
                    wsHoja1.Cell(FilaIni + j, 46).Value = dsTabla.Tables[0].Rows[j]["ContactoPiel"].ToString(); ////////////
                    wsHoja1.Cell(FilaIni + j, 47).Value = dsTabla.Tables[0].Rows[j]["LactanciaPrimeraHora"].ToString(); ///////
                    wsHoja1.Cell(FilaIni + j, 48).Value = dsTabla.Tables[0].Rows[j]["AtendidoPor"].ToString(); /////////
                    wsHoja1.Cell(FilaIni + j, 49).Value = dsTabla.Tables[0].Rows[j]["Responsable"].ToString(); ////////
                }


                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 3, 2).Value = "Fecha : " + DateTime.Now.ToLongDateString().ToUpper();

                //for (int l = 0; l < dsTabla.Tables[1].Rows.Count; l++)
                //{
                //    wsHoja1.Cell(3, 1).Value = dsTabla.Tables[1].Rows[l]["Empleado"].ToString();
                //}

                wsHoja1.Cell(7, 1).Value = "DEL " + FechaInicio.ToShortDateString() + " HASTA EL " + FechaFin.ToShortDateString();
                //wsHoja1.Cell(3, 2).Value = FechaFin.ToShortDateString();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Estadistico_Nacimientos.xlsx");
                }
            }
        }


        public async Task<IActionResult> ReporteRegistroRn(DateTime FechaInicio, DateTime FechaFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/Hospitalizacion/RegistroRN/PlantillaReporteRegistroRN.xlsx";
            using (var workbook = new XLWorkbook(sWebRootFolder))
            {
                var FilaIni = 11;
                DalRecienNacido dalRpt = new DalRecienNacido();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DataSet dsTabla = dalRpt.DevuelveProduccionEstadisticaObstetras(idUsuario, FechaInicio, FechaFin, TipoServicio);
                DataSet dsTabla = await dalRpt.ReporteRegistroRn(idUsuario, FechaInicio, FechaFin);
                var wsHoja1 = workbook.Worksheets.First();
                for (int j = 0; j < dsTabla.Tables[0].Rows.Count; j++)
                {
                    wsHoja1.Cell(FilaIni + j, 1).Value = j + 1;
                    wsHoja1.Cell(FilaIni + j, 2).Value = dsTabla.Tables[0].Rows[j]["NroHistoriaMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 3).Value = dsTabla.Tables[0].Rows[j]["ApPaternoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 4).Value = dsTabla.Tables[0].Rows[j]["ApMaternoMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 5).Value = dsTabla.Tables[0].Rows[j]["NombresMadre"].ToString();                    
                    wsHoja1.Cell(FilaIni + j, 6).Value = dsTabla.Tables[0].Rows[j]["EdadGestacionalMadre"].ToString();
                    wsHoja1.Cell(FilaIni + j, 7).Value = dsTabla.Tables[0].Rows[j]["Gesta"].ToString();  ////////
                    wsHoja1.Cell(FilaIni + j, 8).Value = dsTabla.Tables[0].Rows[j]["Paridad"].ToString();
                    wsHoja1.Cell(FilaIni + j, 9).Value = dsTabla.Tables[0].Rows[j]["TipoPartoMadre"].ToString();

                    wsHoja1.Cell(FilaIni + j, 10).Value = dsTabla.Tables[0].Rows[j]["NroCuenta"].ToString();
                    wsHoja1.Cell(FilaIni + j, 11).Value = dsTabla.Tables[0].Rows[j]["NroHistoria"].ToString();
                    wsHoja1.Cell(FilaIni + j, 12).Value = dsTabla.Tables[0].Rows[j]["Cnv"].ToString();
                    wsHoja1.Cell(FilaIni + j, 13).Value = dsTabla.Tables[0].Rows[j]["FechaNacimiento"].ToString();
                    wsHoja1.Cell(FilaIni + j, 14).Value = dsTabla.Tables[0].Rows[j]["HoraNacimiento"].ToString();
                    wsHoja1.Cell(FilaIni + j, 15).Value = dsTabla.Tables[0].Rows[j]["Sexo"].ToString();
                    wsHoja1.Cell(FilaIni + j, 16).Value = dsTabla.Tables[0].Rows[j]["PesoRn"].ToString();
                    wsHoja1.Cell(FilaIni + j, 17).Value = dsTabla.Tables[0].Rows[j]["ApgarUno"].ToString();
                    wsHoja1.Cell(FilaIni + j, 18).Value = dsTabla.Tables[0].Rows[j]["ApgarCinco"].ToString();
                    wsHoja1.Cell(FilaIni + j, 19).Value = dsTabla.Tables[0].Rows[j]["AtendidoPor"].ToString(); /////////
                    wsHoja1.Cell(FilaIni + j, 20).Value = dsTabla.Tables[0].Rows[j]["Responsable"].ToString(); ////////
                }


                wsHoja1.Cell(FilaIni + dsTabla.Tables[0].Rows.Count + 3, 2).Value = "Fecha : " + DateTime.Now.ToLongDateString().ToUpper();

                //for (int l = 0; l < dsTabla.Tables[1].Rows.Count; l++)
                //{
                //    wsHoja1.Cell(3, 1).Value = dsTabla.Tables[1].Rows[l]["Empleado"].ToString();
                //}

                wsHoja1.Cell(7, 1).Value = "DEL " + FechaInicio.ToShortDateString() + " HASTA EL " + FechaFin.ToShortDateString();
                //wsHoja1.Cell(3, 2).Value = FechaFin.ToShortDateString();

                // Listado Admision 
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte_Registro_Nacimientos.xlsx");
                }
            }
        }

    }
}