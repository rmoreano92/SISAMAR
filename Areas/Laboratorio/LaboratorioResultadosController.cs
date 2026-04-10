using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Drawing;
using QRCoder;
using WebAppMaternidad.Areas.Comun;
using NPOI.SS.Formula.Functions;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using Newtonsoft.Json;
using WebAppMaternidad.Views.Hospitalizacion.Plantillas;
using System.Diagnostics;
using System.Net.Mime;

namespace WebAppMaternidad.Areas.Laboratorio
{
    public class LaboratorioResultadosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarMovimientosPorCuenta(int idCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaMovimientos;
            DalLaboratorio daoMovimientos = new DalLaboratorio();

            listaMovimientos = await daoMovimientos.LabMovimientoLaboratorioSeleccionarByIdCuenta(idCuentaAtencion);

            return Json(listaMovimientos);
            //return Json(new { listaMovimientos = listaMovimientos, session = true });
        }

        public async Task<ActionResult> ListarMovimientosPorIdPaciente(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaMovimientos;
            DalLaboratorio daoMovimientos = new DalLaboratorio();

            listaMovimientos = await daoMovimientos.LabMovimientoLaboratorioSeleccionarPorIdPaciente(idPaciente);

            return Json(listaMovimientos);
            //return Json(new { listaMovimientos = listaMovimientos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarMovimientosLaboratorio(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idTipoServicio, int idGrupoExamen, int idRealizaExamen, int idPuntoCarga)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.ListarMovimientosLaboratorio(idMovimiento, idCuenta, historia, nombres, fechaInicio, fechaFin, idTipoServicio, idGrupoExamen, idRealizaExamen, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarMovimientosLaboratorioTamizaje(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idTipoServicio, int idGrupoExamen, int idRealizaExamen, int idPuntoCarga)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.ListarMovimientosLaboratorioTamizaje(idMovimiento, idCuenta, historia, nombres, fechaInicio, fechaFin, idTipoServicio, idGrupoExamen, idRealizaExamen, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalLaboratorio.LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(idOrden, idPuntoCarga, idMovimiento, idUsuario);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FactOrdenServicioPorIdMovimiento(int idMovimiento, int idPuntoCarga)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.FactOrdenServicioPorIdMovimiento(idMovimiento, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarExamenesConResultadoPorFecha(DateTime fechaInicio, DateTime fechaFin)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.ListarExamenesConResultadoPorFecha(fechaInicio, fechaFin);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosLaboratorioTodos()
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.EmpleadosLaboratorioTodos();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosLaboratorioPorCargo(int idCargo)
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.EmpleadosLaboratorioPorCargo(idCargo);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosLaboratorioPorGrupo(int idGrupo)
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.EmpleadosLaboratorioPorGrupo(idGrupo);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposMuestraLab()
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListarTiposMuestraLab();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarEstadoEstudio()
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListarEstadoEstudio();

            return Json(new { dataSet, estado = true, session = true });
        }


        public async Task<ActionResult> ListarGradoDiferenciacion()
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListarGradoDiferenciacion();

            return Json(new { dataSet, estado = true, session = true });
        }


        public async Task<ActionResult> ListarLateralidad()
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListarLateralidad();

            return Json(new { dataSet, estado = true, session = true });
        }

        public async Task<ActionResult> ListarMetodoDiagnostico()
        {
            DataSet dataSet;
            DalLaboratorio dal = new DalLaboratorio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListarMetodoDiagnostico();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosSeleccionarServiciosLike(string lcFiltro)
        {
            DataSet ListaProductos;
            DalLaboratorio dal = new DalLaboratorio();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaProductos = null;

            ListaProductos = await dal.FactCatalogoServiciosSeleccionarServiciosLike(lcFiltro);

            return Json(new { lstData = ListaProductos, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ListarCabeceraResultados(int idOrden, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultados;
            DalLaboratorio dal = new DalLaboratorio();
            lsResultados = await dal.ListarCabeceraResultados(idOrden, idProducto);

            return Json(new { lsResultados = lsResultados, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ListarResultados(int idOrden, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultados;
            DalLaboratorio dal = new DalLaboratorio();
            lsResultados = await dal.ListarResultadosLabImg(idOrden, idProducto, "LAB");

            return Json(new { lsResultados = lsResultados, session = true });
        }

        ///////////////////////IMAGEN ADJUNTA////////////////////////////////////////
        [HttpPost]
        public async Task<Boolean> GuardarImagenAdjunta(int idCuenta, int idOrden, int idMovimiento, int idProducto, string tipo, IFormFile imageArchivo)
        {
            try
            {
                UtilitarioController utilitario = new UtilitarioController();
                DalLaboratorio dal = new DalLaboratorio();
                bool resp;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("user");

                string extension = Path.GetExtension(imageArchivo.FileName);

                // Valida la extensión si es necesario
                if (extension.ToLower() != ".jpg" && extension.ToLower() != ".jpeg" && extension.ToLower() != ".png")
                {
                    return false;
                }

                string nombreRuta = await utilitario.GenerarRutaArchivoImage(idCuenta, tipo);
                string nombreArchivo = await utilitario.GenerarNombreArchivoImage(idCuenta, idMovimiento, tipo);
                string rutaImage = nombreRuta + nombreArchivo + extension;

                var filePath = rutaImage;

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageArchivo.CopyToAsync(stream);
                    resp = true;
                }

                if (resp)
                {
                    resp = await dal.GuardarResultadoImagen(idOrden, idMovimiento, idProducto, rutaImage, idUsuario);
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
        public async Task<Boolean> EliminarImagenAdjunta(int idLabResultadoImagen)
        {
            bool resp = false;
            DalLaboratorio dal = new DalLaboratorio();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                resp = await dal.EliminarResultadoImagen(idLabResultadoImagen, idUsuario);

                return resp;
            }
            catch (Exception ex)
            {
                Debug.Print(ex.Message.ToString());
                return false;
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarImagenesAdjuntas(int idOrden, int idMovimiento, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultados;
            DalLaboratorio dal = new DalLaboratorio();
            lsResultados = await dal.ListarResultadosImagenes(idOrden, idMovimiento, idProducto);

            return Json(new { lsResultados = lsResultados, session = true });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////

        [HttpPost]
        public async Task<ActionResult> GuardarResultados(LabResultadosCabecera cabecera, String detalleResultado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            bool resp = false, res = false, informeItem = false, informeGrupo = false;
            DalLaboratorio dal = new DalLaboratorio();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstDetalleResultado = JsonConvert.DeserializeObject<List<LabResultadosPorItems>>(detalleResultado);
            res = await dal.GuardarResultados(cabecera, lstDetalleResultado, idUsuario);
            if (cabecera.code != "" && cabecera.resultado != "SI")
            {
                informeItem = await GenerarFormatoResultadosPorItem(cabecera.IdCuentaAtencion, cabecera.IdOrden, cabecera.IdMovimiento, cabecera.IdProducto, "LAB-RES");
                informeGrupo = await GenerarFormatoResultadosPorGrupos(cabecera.IdCuentaAtencion, cabecera.IdOrden, cabecera.IdMovimiento, cabecera.IdProducto, "LAB-RES-GRUPO");
            }

            if (res)
            {
                resp = true;
            }

            return Json(new { respuesta = resp, session = true });
        }
        
        [HttpPost]
        public async Task<ActionResult> ListarDiagnosticosLaboratorio(int IdCuentaAtencion, int idOrden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            string respuesta = "";
            DataSet rsp = null;
            DalLaboratorio dal = new DalLaboratorio();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarDiagnosticosLaboratorio(IdCuentaAtencion,idOrden);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });

        }

        [HttpPost]
        public async Task<ActionResult> ListarDiagnosticosLaboratorioCIE0(int IdCuentaAtencion, int idOrden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            string respuesta = "";
            DataSet rsp = null;
            DalLaboratorio dal = new DalLaboratorio();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarDiagnosticosLaboratorioCIE0(IdCuentaAtencion, idOrden);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });

        }

        [HttpPost]
        public async Task<ActionResult> ListarDiagnosticosLaboratorioCIE0Morfologico(int IdCuentaAtencion, int idOrden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            string respuesta = "";
            DataSet rsp = null;
            DalLaboratorio dal = new DalLaboratorio();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarDiagnosticosLaboratorioCIE0Morfologico(IdCuentaAtencion, idOrden);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });

        }

        [HttpPost]
        public async Task<ActionResult> EliminarResultado(int idMovimiento, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalLaboratorio daoLaboratorio = new DalLaboratorio();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await daoLaboratorio.EliminarResultado(idMovimiento, idProducto, idUsuario);

                //return Json(new { respuesta = ds.Tables[1], session = true, estado = true });
                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (EliminarResultado): " + ex });
            }

        }


        public async Task<bool> GenerarFormatoResultadosPorItem(int idCuentaAtencion, int idOrden, int idMovimiento, int idProducto, string tipoFormato)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                var formatoHoja = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoResultadoLab");
                string tipoFormatoHoja = formatoHoja.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;

                pageHtml = Url.Action("rptResultadoLaboratorioPorItem", "LaboratorioResultados", new { area = "Laboratorio", idOrden, idMovimiento, idProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = tipoFormatoHoja;
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idMovimiento, idProducto, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ActionResult> GenerarFormatoResultadosPorItemMemoria(int idCuentaAtencion, int idOrden, int idMovimiento, int idProducto, string tipoFormato)
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
                var formatoHoja = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoResultadoLab");
                string tipoFormatoHoja = formatoHoja.ToString();

                pageHtml = Url.Action("rptResultadoLaboratorioPorItem", "LaboratorioResultados", new { area = "Laboratorio", idOrden, idMovimiento, idProducto }, "http");
                pdf.orientacion = "Portrait";
                pdf.tamanio = tipoFormatoHoja;
                pdf.pageHtml = pageHtml;

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

        public async Task<ActionResult> rptResultadoLaboratorioPorItem(int idOrden, int idMovimiento, int idProducto)
        {
            Conexion con = new Conexion();
            DalParametros dalParametro = new DalParametros();
            DalLaboratorio dalLaboratorio = new DalLaboratorio();
            DalPaciente dalPaciente = new DalPaciente();
            DalAtenciones dalAtenciones = new DalAtenciones();
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet lsParametros = new DataSet();
            String telefono, nombre, direccion;

            var tamizaje = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IdProductoTamizaje");
            var formatoHoja = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoResultadoLab");
            int idCptTamizaje = Int32.Parse(tamizaje.ToString());            
            string tipoFormatoHoja = formatoHoja.ToString();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            DataSet labMovimientoLaboratorio = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarXidOrden(idOrden);

            ViewBag.NombreInstitucion = nombre;
            ViewBag.DireccionInstitucion = direccion;
            ViewBag.TelefonoInstitucion = telefono;
            ViewBag.idMovimiento = idMovimiento;
            ViewBag.CodigoAP = labMovimientoLaboratorio.Tables[0].Rows[0]["CodigoAP"];
            ViewBag.OrdenaPrueba = labMovimientoLaboratorio.Tables[0].Rows[0]["OrdenaPrueba"];
            ViewBag.Paciente = labMovimientoLaboratorio.Tables[0].Rows[0]["Paciente"];
            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");
            ViewBag.Diagnostico = labMovimientoLaboratorio.Tables[0].Rows[0]["diagnostico"]?? "";
            ViewBag.DiagnosticosCIE0 = labMovimientoLaboratorio.Tables[0].Rows[0]["diagnosticosCIE0"]?? "";
            ViewBag.DiagnosticosCIE0Morfologico = labMovimientoLaboratorio.Tables[0].Rows[0]["diagnosticosCIE0Morfologico"]?? "";
            ViewBag.TipoMuestra = labMovimientoLaboratorio.Tables[0].Rows[0]["tipoMuestra"]?? "";
            ViewBag.EstadoEstudio = labMovimientoLaboratorio.Tables[0].Rows[0]["estadoEstudio"] ?? "";
            ViewBag.MetodoDiagnostico = labMovimientoLaboratorio.Tables[0].Rows[0]["metodoDescripcion"]?? "";
            ViewBag.Lateralidad = labMovimientoLaboratorio.Tables[0].Rows[0]["lateralidadDescripcion"]?? "";
            ViewBag.GradoDiferenciacion = labMovimientoLaboratorio.Tables[0].Rows[0]["gradoDiferenciacionDescripcion"]?? "";
            DataSet labResultadoLaboratorio;
            if (idCptTamizaje == idProducto)
            {
                labResultadoLaboratorio = await dalLaboratorio.ListarResultadosLabTamizaje(idOrden, idProducto, "LAB");
            }
            else
            {
                labResultadoLaboratorio = await dalLaboratorio.ListarResultadosLaboratorio(idOrden, idProducto, "LAB");
            }
            
            List<string> grupos = new List<string>();
            DataTable LabCabecera = labResultadoLaboratorio.Tables[0];
            DataTable LabResultados = labResultadoLaboratorio.Tables[1];
            DataTable LabObservaciones = labResultadoLaboratorio.Tables[2];
            
            if (idCptTamizaje == idProducto)
            {
                ViewBag.Examen = LabCabecera.Rows[0]["Producto"];
                ViewBag.Recepcionista = LabCabecera.Rows[0]["usuarioRecepciona"];
                ViewBag.FechaRec = LabCabecera.Rows[0]["FechaRecepciona"];
                ViewBag.FechaRes = LabCabecera.Rows[0]["FechaResultado"];
                ViewBag.TipoEmpleado = LabCabecera.Rows[0]["tipoEmpleado"];
                ViewBag.Empleado = LabCabecera.Rows[0]["realizaAnalisis"];
                ViewBag.TipoEmpleadoValida = LabCabecera.Rows[0]["tipoEmpleadoValida"];
                ViewBag.EmpleadoValida = LabCabecera.Rows[0]["validaAnalisis"];

                ViewBag.Madre = LabCabecera.Rows[0]["Madre"];
                ViewBag.DocumentoMadre = LabCabecera.Rows[0]["DocumentoMadre"];
                ViewBag.TelefonoMadre = LabCabecera.Rows[0]["TelefonoMadre"];
                ViewBag.FechaHoraNacimientoRn = LabCabecera.Rows[0]["FechaHoraNacimientoRn"];
                ViewBag.HistoriaRn = LabCabecera.Rows[0]["HistoriaRn"];
                ViewBag.NroSecuencia = LabCabecera.Rows[0]["NroSecuencia"];
                ViewBag.FechaTomaMuestra = LabCabecera.Rows[0]["FechaTomaMuestra"];
                ViewBag.NroMuestra = LabCabecera.Rows[0]["NroMuestra"];
                ViewBag.TarjetaMuestra = LabCabecera.Rows[0]["TarjetaMuestra"];

                ViewBag.EstablecimientoOrigen = LabCabecera.Rows[0]["EstablecimientoOrigen"];
                ViewBag.ProcesadoPor = LabCabecera.Rows[0]["ProcesadoPor"];
                ViewBag.AprobadoPor = LabCabecera.Rows[0]["AprobadoPor"];
                ViewBag.TiempoGestacion = LabCabecera.Rows[0]["TiempoGestacion"];
                ViewBag.Peso = LabCabecera.Rows[0]["Peso"];
                ViewBag.Talla = LabCabecera.Rows[0]["Talla"];
                ViewBag.Sexo = LabCabecera.Rows[0]["Sexo"];

                ViewBag.CodeFirma = LabCabecera.Rows[0]["code"];

                @ViewBag.MedicoRealizaAnalisisFirmaDigital = LabCabecera.Rows[0]["MedicoRealizaAnalisisRutaFirma"];
                @ViewBag.MedicoValidaAnalisisFirmaDigital = LabCabecera.Rows[0]["MedicoValidaAnalisisRutaFirma"];

            }
            else
            {
                ViewBag.Examen = LabCabecera.Rows[0]["Producto"];
                ViewBag.CodigoIngreso = LabCabecera.Rows[0]["CodigoIngreso"];
                ViewBag.Recepcionista = LabCabecera.Rows[0]["usuarioRecepciona"];
                ViewBag.FechaRec = LabCabecera.Rows[0]["fechaRecepciona"];
                ViewBag.FechaRes = LabCabecera.Rows[0]["fechaResultado"];
                ViewBag.TipoEmpleado = LabCabecera.Rows[0]["tipoEmpleado"];
                ViewBag.Empleado = LabCabecera.Rows[0]["realizaAnalisis"];
                ViewBag.TipoEmpleadoValida = LabCabecera.Rows[0]["tipoEmpleadoValida"];
                ViewBag.EmpleadoValida = LabCabecera.Rows[0]["validaAnalisis"];

                ViewBag.CodeFirma = LabCabecera.Rows[0]["code"];

                @ViewBag.MedicoRealizaAnalisisFirmaDigital = LabCabecera.Rows[0]["MedicoRealizaAnalisisRutaFirma"];
                @ViewBag.MedicoValidaAnalisisFirmaDigital = LabCabecera.Rows[0]["MedicoValidaAnalisisRutaFirma"];

            }

            foreach (DataRow row in LabResultados.Rows)
            {
                if (row["Valor"].ToString() != "")
                {
                    if (!grupos.Contains(row["Grupo"].ToString()))
                    {
                        grupos.Add(row["Grupo"].ToString());
                    }
                }

            }

            ViewBag.Grupos = grupos;
            ViewBag.ResultadosLaboratorio = LabResultados;


            ViewBag.Observaciones = "";
            ViewBag.Conclusiones = "";

            if (LabObservaciones.Rows.Count > 0)
            {
                ViewBag.Observaciones = LabObservaciones.Rows[0]["Obseraciones"].ToString();
                ViewBag.Conclusiones = LabObservaciones.Rows[0]["Conclusiones"].ToString();
            } 
            
            @ViewBag.ServerArchivosIp = con.ObtenerServidorArchivosIp();
                        
            if (@ViewBag.CodeFirma != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
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

            //Console.WriteLine(grupos);

            if(tipoFormatoHoja == "A5")
            {
                if (idCptTamizaje == idProducto)
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosTamizaje.cshtml");
                }
                else
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosPorItemA5.cshtml");
                }
            } 
            else            //POR DEFECTO FORMATO DE HOJA A4
            {
                if (idCptTamizaje == idProducto)
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosTamizaje.cshtml");
                }
                else
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosPorItem.cshtml");
                }
            }

           
        }
        ////////////////////////////////////RESULTADOS LABORATORIO POR GRUPO//////////////////////////////////////////////////////////////////
        public async Task<bool> GenerarFormatoResultadosPorGrupos(int idCuentaAtencion, int idOrden, int idMovimiento, int idProducto, string tipoFormato)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                DalLaboratorio dal = new DalLaboratorio();
                DataSet dsGrupos = new DataSet();
                int idGrupo = 0;
                bool resp = false;

                var formatoHoja = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoResultadoLab");
                string tipoFormatoHoja = formatoHoja.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;

                pdf.orientacion = "Portrait";
                pdf.tamanio = tipoFormatoHoja;
                pdf.marginX = 20;
                pdf.marginY = 20;

                //dsGrupos = await dal.ListarGruposLaboratorio(idMovimiento, idOrden);
                dsGrupos = await dal.ListarGrupoLaboratorioPorProducto(idMovimiento, idOrden, idProducto);
                if (dsGrupos.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in dsGrupos.Tables[0].Rows)
                    {
                        idGrupo = Int32.Parse(row["IdGrupo"].ToString());
                        pageHtml = Url.Action("rptResultadoLaboratorioPorGrupo", "LaboratorioResultados", new { area = "Laboratorio", idOrden, idMovimiento, idGrupo }, "http");

                        resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idMovimiento, idGrupo, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);
                    }

                }

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ActionResult> rptResultadoLaboratorioPorGrupo(int idOrden, int idMovimiento, int idGrupo)
        {
            Conexion con = new Conexion();
            DalParametros dalParametro = new DalParametros();
            DalLaboratorio dalLaboratorio = new DalLaboratorio();
            DalPaciente dalPaciente = new DalPaciente();
            DalAtenciones dalAtenciones = new DalAtenciones();
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet lsParametros = new DataSet();
            String telefono, nombre, direccion;
            //int idProducto = 0; //prueba

            var tamizaje = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IdGrupoTamizaje");
            var formatoHoja = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoResultadoLab");
            int idGrupoTamizaje = Int32.Parse(tamizaje.ToString());
            string tipoFormatoHoja = formatoHoja.ToString();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            //DataSet ordenServicio = await dalLaboratorio.FactOrdenServicioSeleccionarPorIdOrden(idOrden);
            DataSet labMovimientoLaboratorio = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarXidOrden(idOrden);
            //DataSet labResultadoLaboratorio = await dalLaboratorio.RptResulLaboratoriobyMGP(idOrden, idProducto);

            DataSet labResultadoLaboratorio;
            if (idGrupoTamizaje == idGrupo)
            {
                labResultadoLaboratorio = await dalLaboratorio.ListarResultadosLabTamizaje(idOrden, idGrupo, "LAB");
            }
            else
            {
                labResultadoLaboratorio = await dalLaboratorio.ListarResultadosPorGrupoLabImg(idOrden, idGrupo, "LAB");
            }

            //DataSet labImgLabObservaciones = await dalLaboratorio.ListarImgLabObservaciones(idOrden, idProducto, idMovimiento);
            // paciente = await dalPaciente.PacientesSeleccionarPorId(Int32.Parse(ordenServicio.Tables[0].Rows[0]["IdPaciente"].ToString()));

            List<string> grupos = new List<string>();
            List<string> gruposExamen = new List<string>();
            List<string> productos = new List<string>();
            List<List<string>> examenes = new List<List<string>>();
            //var idCuentaAtencion = ordenServicio.Tables[0].Rows[0]["IdCuentaAtencion"];

            //DataSet atenciones = await dalAtenciones.ListaAtencionByIdCuentaAtencion(Int32.Parse(idCuentaAtencion.ToString()));

            //var Observaciones = "";
            //var Conclusiones = "";

            //if (labImgLabObservaciones.Tables[0].Rows.Count > 0)
            //{
            //    Observaciones = labImgLabObservaciones.Tables[0].Rows[0]["Obseraciones"].ToString();
            //    Conclusiones = labImgLabObservaciones.Tables[0].Rows[0]["conclusiones"].ToString();
            //}

            ViewBag.NombreInstitucion = nombre;
            ViewBag.DireccionInstitucion = direccion;
            ViewBag.TelefonoInstitucion = telefono;
            ViewBag.idMovimiento = idMovimiento;
            ViewBag.OrdenaPrueba = labMovimientoLaboratorio.Tables[0].Rows[0]["OrdenaPrueba"];
            ViewBag.Paciente = labMovimientoLaboratorio.Tables[0].Rows[0]["Paciente"];
            //ViewBag.NroHistoriaClinica = paciente.Tables[0].Rows[0]["NroHistoriaClinica"];
            //ViewBag.Edad = paciente.Tables[0].Rows[0]["Paciente"];
            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");
            ViewBag.TipoMuestra = labMovimientoLaboratorio.Tables[0].Rows[0]["tipoMuestra"] ?? "";
            ViewBag.EstadoEstudio = labMovimientoLaboratorio.Tables[0].Rows[0]["estadoEstudio"] ?? "";
            //ViewBag.Observaciones = Observaciones;
            //ViewBag.Conclusiones = Conclusiones;
            //ViewBag.Servicio = ordenServicio.Tables[0].Rows[0]["dservicio"];
            //ViewBag.Edad = atenciones.Tables[0].Rows[0]["edadPaciente"];

            if (idGrupoTamizaje == idGrupo)
            {
                foreach (DataRow row in labResultadoLaboratorio.Tables[0].Rows)
                {
                    ViewBag.Examen = row["producto"];
                    ViewBag.Recepcionista = row["usuarioRecepciona"];
                    ViewBag.FechaRec = row["fechaRecepciona"];
                    ViewBag.FechaRes = row["fechaResultado"];
                    ViewBag.TipoEmpleado = row["tipoEmpleado"];
                    ViewBag.Empleado = row["realizaAnalisis"];
                    ViewBag.TipoEmpleadoValida = row["tipoEmpleadoValida"];
                    ViewBag.EmpleadoValida = row["validaAnalisis"];

                    ViewBag.Madre = row["Madre"];
                    ViewBag.DocumentoMadre = row["DocumentoMadre"];
                    ViewBag.TelefonoMadre = row["TelefonoMadre"];
                    ViewBag.FechaHoraNacimientoRn = row["FechaHoraNacimientoRn"];
                    ViewBag.HistoriaRn = row["HistoriaRn"];
                    ViewBag.NroSecuencia = row["NroSecuencia"];
                    ViewBag.FechaTomaMuestra = row["FechaTomaMuestra"];
                    ViewBag.NroMuestra = row["NroMuestra"];
                    ViewBag.TarjetaMuestra = row["TarjetaMuestra"];

                    if (row["Valor"].ToString() != "")
                    {
                        if (!grupos.Contains(row["Grupo"].ToString()))
                        {
                            grupos.Add(row["Grupo"].ToString());
                        }
                    }
                        
                }
            }
            else
            {
                foreach (DataRow row in labResultadoLaboratorio.Tables[0].Rows)
                {
                    ViewBag.Examen = row["producto"];
                    ViewBag.Recepcionista = row["usuarioRecepciona"];
                    ViewBag.FechaRec = row["fechaRecepciona"];
                    ViewBag.FechaRes = row["fechaResultado"];
                    ViewBag.TipoEmpleado = row["tipoEmpleado"];
                    ViewBag.Empleado = row["realizaAnalisis"];
                    ViewBag.TipoEmpleadoValida = row["tipoEmpleadoValida"];
                    ViewBag.EmpleadoValida = row["validaAnalisis"];

                    if (row["Valor"].ToString() != "" || row["Observaciones"].ToString() != "" || row["Conclusiones"].ToString() != "")
                    {
                        if (!gruposExamen.Contains(row["IdGrupoExamen"].ToString()))
                        {
                            gruposExamen.Add(row["IdGrupoExamen"].ToString());
                        }

                        if (!productos.Contains(row["Producto"].ToString()))
                        {
                            productos.Add(row["Producto"].ToString());
                            examenes.Add(new List<string> { row["Producto"].ToString(), row["realizaAnalisis"].ToString(), row["FechaResultado"].ToString(), row["CodigoIngreso"].ToString() });
                        }

                        if (!grupos.Contains(row["Grupo"].ToString()))
                        {
                            grupos.Add(row["Grupo"].ToString());
                        }
                    }
                    
                }
            }

            ViewBag.GruposExamen = gruposExamen;
            ViewBag.Examenes = examenes;
            ViewBag.Grupos = grupos;
            
            ViewBag.ResultadosLaboratorio = labResultadoLaboratorio.Tables[0];

            @ViewBag.ServerArchivosIp = con.ObtenerServidorArchivosIp();
            //@ViewBag.MedicoRealizaAnalisisFirmaDigital = labResultadoLaboratorio.Tables[0].Rows[0]["MedicoRealizaAnalisisRutaFirma"];
            //@ViewBag.MedicoValidaAnalisisFirmaDigital = labResultadoLaboratorio.Tables[0].Rows[0]["MedicoValidaAnalisisRutaFirma"];

            ViewBag.CodeFirma = labResultadoLaboratorio.Tables[0].Rows[0]["code"];
            if (@ViewBag.CodeFirma != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
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

            //Console.WriteLine(grupos);

            if(tipoFormatoHoja == "A5")     //TIPO DE HOJA A4
            {
                if (idGrupoTamizaje == idGrupo)
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosTamizaje.cshtml");
                }
                else
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosPorGrupoA5.cshtml");
                }
            }
            else            //POR DEFECTO A4
            {
                if (idGrupoTamizaje == idGrupo)
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosTamizaje.cshtml");
                }
                else
                {
                    return PartialView("~/Views/Laboratorio/Plantillas/ResultadosPorGrupo.cshtml");
                }
            }
            

        }

        

    }
}
