using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Imagenes
{
    public class ImagenologiaEcografiasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposSexoEcoImagenes()
        {
            DataSet dataSet;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListaTiposSexoEcoImagenes();

            return Json(new { respuesta = dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaCatalogoEcoImagenesPorCatalogo(string catalogo)
        {
            DataSet dataSet;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListaCatalogoEcoImagenesPorCatalogo(catalogo);

            return Json(new { respuesta = dataSet, estado = true, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListaEmpleadosPorTipoEmpleado(string tipoEmpleado)
        {
            DataSet dataSet;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListaEmpleadosPorTipoEmpleado(tipoEmpleado);

            return Json(new { respuesta = dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposEdadGestacional()
        {
            DataSet dataSet;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListaTiposEdadGestacional();

            return Json(new { respuesta = dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaMedicacionPrevia()
        {
            DataSet dataSet;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListaMedicacionPrevia();

            return Json(new { respuesta = dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaCordonNucal()
        {
            DataSet dataSet;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.ListaCordonNucal();

            return Json(new { respuesta = dataSet, estado = true, session = true });
        }

        /*=====================ECO-VAGINAL BASICA=================================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoVaginalBasica(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoVaginalBasica(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoVaginalBasica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoVaginalBasica>>(detalleResultado);
            resp = await dal.GuardarEcoVaginalBasica(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }
        /*==================================================================================================*/

        /*=====================ECO-GENETICA=================================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoGenetica(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoGenetica(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoGenetica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoGenetica>>(detalleResultado);
            resp = await dal.GuardarEcoGenetica(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }
        /*==================================================================================================*/

        /*=====================ECO-ABDOMINAL BASICA=================================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoAbdominalBasica(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoAbdominalBasica(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoAbdominalBasica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoAbdominalBasica>>(detalleResultado);
            resp = await dal.GuardarEcoAbdominalBasica(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }
        /*==================================================================================================*/

        /*===============================ECO-UTERO GRAVIDO================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoUteroGravido(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoUteroGravido(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoUteroGravido(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoUteroGravido>>(detalleResultado);
            resp = await dal.GuardarEcoUteroGravido(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        /*==================================================================================================*/

        /*=====================ECO-DOPPLER CRECIMIENTO=================================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoDopplerCrecimiento(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoDopplerCrecimiento(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoDopplerCrecimiento(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoDopplerCrecimiento>>(detalleResultado);
            resp = await dal.GuardarEcoDopplerCrecimiento(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }
        /*==================================================================================================*/

        /*===============================ECO-NEUROSONOGRAFIA================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoNeurosonografia(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));            
            resp = await dal.SeleccionarEcoNeurosonografia(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoNeurosonografia(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoNeurosonografia>>(detalleResultado);
            resp = await dal.GuardarEcoNeurosonografia(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        /*==================================================================================================*/

        /*===============================ECO-CARDIOGRAFIA================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoCardiografia(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoCardiografia(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoCardiografia(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoCardiografia>>(detalleResultado);
            resp = await dal.GuardarEcoCardiografia(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        /*==================================================================================================*/

        /*===============================ECO-MORFOLOGICA================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoMorfologica(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoMorfologica(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoMorfologica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoMorfologica>>(detalleResultado);
            resp = await dal.GuardarEcoMorfologica(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }
        /*==================================================================================================*/


        /*===============================ECO-CARDIOTOGRAFIA================================================*/
        [HttpPost]
        public async Task<ActionResult> SeleccionarEcoCardiotografia(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.SeleccionarEcoCardiotografia(idOrden, idMovimiento, idProducto, idUsuario);

            return Json(new { respuesta = resp, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEcoCardiotografia(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdRealizaInforme, int IdServicioRealiza, string FechaResultado, String detalleResultado, int IdListBar)
        {
            DataSet resp = new DataSet();
            int idUsuario;
            DalImagenesEcografias dal = new DalImagenesEcografias();

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalleResultado = JsonConvert.DeserializeObject<List<EcoCardiotografia>>(detalleResultado);
            resp = await dal.GuardarEcoCardiotografia(IdCuentaAtencion, IdOrden, IdMovimiento, IdProducto, IdRealizaAnalisis, IdRealizaInforme, IdServicioRealiza, FechaResultado, lstobjDetalleResultado, idUsuario, IdListBar);
            bool respInf = await GenerarFormatoResultadosEcografia(0, IdOrden, IdMovimiento, IdProducto, "IMG-RES");

            return Json(new { respuesta = resp, estado = true, session = true });
        }
        /*==================================================================================================*/


        /*========================================GENERAR FORMATO==========================================================*/
        public async Task<bool> GenerarFormatoResultadosEcografia(int idCuentaAtencion, int idOrden, int idMovimiento, int idProducto, string tipoFormato)
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

                pageHtml = Url.Action("rptResultadoImagenologiaEcografia", "ImagenologiaEcografias", new { area = "Laboratorio", idOrden, idMovimiento, idProducto }, "http");

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

        public async Task<ActionResult> rptResultadoImagenologiaEcografia(int idOrden, int idMovimiento, int idProducto)
        {
            Conexion con = new Conexion();
            DalParametros dalParametro = new DalParametros();
            DalImagenes dalImagenologia = new DalImagenes();
            DalImagenesEcografias dalImagenologiaEco = new DalImagenesEcografias();
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

            DataSet labMovimientoLaboratorio = await dalImagenologia.ImgMovimientoImagenesSeleccionarXidOrden(idOrden);

            ViewBag.NombreInstitucion = nombre;
            ViewBag.DireccionInstitucion = direccion;
            ViewBag.TelefonoInstitucion = telefono;
            ViewBag.idMovimiento = idMovimiento;
            //ViewBag.CodigoAP = labMovimientoLaboratorio.Tables[0].Rows[0]["CodigoAP"];
            ViewBag.OrdenaPrueba = labMovimientoLaboratorio.Tables[0].Rows[0]["OrdenaPrueba"].ToString();
            ViewBag.Paciente = labMovimientoLaboratorio.Tables[0].Rows[0]["Paciente"].ToString();
            ViewBag.FechaNacimiento = labMovimientoLaboratorio.Tables[0].Rows[0]["PacienteFechaNacimiento"].ToString();
            ViewBag.Sexo = labMovimientoLaboratorio.Tables[0].Rows[0]["PacienteSexo"].ToString();
            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");


            DataSet imgResultadoImagenes = await dalImagenologia.ListarResultadosLabImg(idOrden, idProducto, "IMG");
            string tipoFormulario = imgResultadoImagenes.Tables[0].Rows[0]["TipoFormulario"].ToString();

            ViewBag.ServicioRealiza = imgResultadoImagenes.Tables[0].Rows[0]["ServicioRealiza"].ToString();

            ViewBag.ServerArchivosIp = con.ObtenerServidorArchivosIp();
           

            //List<string> grupos = new List<string>();
            //DataTable LabCabecera = labResultadoLaboratorio.Tables[0];

            //DataTable LabObservaciones = labResultadoLaboratorio.Tables[2];

            //ViewBag.Examen = LabCabecera.Rows[0]["Producto"];
            //ViewBag.CodigoIngreso = LabCabecera.Rows[0]["CodigoIngreso"];
            //ViewBag.Recepcionista = LabCabecera.Rows[0]["usuarioRecepciona"];
            //ViewBag.FechaRec = LabCabecera.Rows[0]["fechaRecepciona"];
            //ViewBag.FechaRes = LabCabecera.Rows[0]["fechaResultado"];
            //ViewBag.TipoEmpleado = LabCabecera.Rows[0]["tipoEmpleado"];
            //ViewBag.Empleado = LabCabecera.Rows[0]["realizaAnalisis"];
            //ViewBag.TipoEmpleadoValida = LabCabecera.Rows[0]["tipoEmpleadoValida"];
            //ViewBag.EmpleadoValida = LabCabecera.Rows[0]["validaAnalisis"];

            //@ViewBag.MedicoRealizaAnalisisFirmaDigital = LabCabecera.Rows[0]["MedicoRealizaAnalisisRutaFirma"];
            //@ViewBag.MedicoValidaAnalisisFirmaDigital = LabCabecera.Rows[0]["MedicoValidaAnalisisRutaFirma"];

            //foreach (DataRow row in LabResultados.Rows)
            //{
            //    if (row["Valor"].ToString() != "")
            //    {
            //        if (!grupos.Contains(row["Grupo"].ToString()))
            //        {
            //            grupos.Add(row["Grupo"].ToString());
            //        }
            //    }

            //}

            //ViewBag.Grupos = grupos;
            //ViewBag.ResultadosLaboratorio = LabResultados;

            //ViewBag.Observaciones = "";
            //ViewBag.Conclusiones = "";

            //if (LabObservaciones.Rows.Count > 0)
            //{
            //    ViewBag.Observaciones = LabObservaciones.Rows[0]["Obseraciones"].ToString();
            //    ViewBag.Conclusiones = LabObservaciones.Rows[0]["Conclusiones"].ToString();
            //}



            DataSet imgResultadoEcografiaImagenes;
            DataTable ImgResultados;
            string viewResultado = "";

            if (tipoFormulario == "frmEcoVaginalBasica")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoVaginalBasica(idOrden, idMovimiento, idProducto);
                ImgResultados = imgResultadoEcografiaImagenes.Tables[0];
                ViewBag.ResultadosImagenes = ImgResultados;
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoVaginalBasica.cshtml";
            }
            else if (tipoFormulario == "frmecoGenetica")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoGenetica(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoGenetica.cshtml";
            }
            else if (tipoFormulario == "frmEcoAbdominalBasic")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoAbdominalBasica(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoAbdominalBasica.cshtml";
            }
            else if (tipoFormulario == "frmEcoUteroGrav")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoUteroGravido(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoUteroGravido.cshtml";
            }
            else if (tipoFormulario == "frmEcoDopplerCrec")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoDopplerCrecimiento(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoDopplerCrecimiento.cshtml";
            }
            else if (tipoFormulario == "frmEcoNeurosonografi")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoNeurosonografia(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoNeurosonografia.cshtml";
            }
            else if (tipoFormulario == "frmEcoCardiografia")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoCardiografia(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoCardiografia.cshtml";
            }
            else if (tipoFormulario == "frmecoMorfologico")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoMorfologica(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoMorfologica.cshtml";                
            }
            else if (tipoFormulario == "frmCardiotocografiaCST")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoCardiotografia(idOrden, idMovimiento, idProducto);
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoCardiotografiaCST.cshtml";                
            }
            else if (tipoFormulario == "frmCardiotocografiaNST")
            {
                imgResultadoEcografiaImagenes = await dalImagenologiaEco.InformeEcoCardiotografia(idOrden, idMovimiento, idProducto);               
                viewResultado = "~/Views/Imagenologia/Plantillas/ResultadosEcoCardiotografiaNST.cshtml";                
            }
            else
            {
                viewResultado = "Vista no Disponible";
                return PartialView("Vista no Disponible");
            }

            ImgResultados = imgResultadoEcografiaImagenes.Tables[0];
            ViewBag.ResultadosImagenes = ImgResultados;

            ViewBag.RealizaExamen = imgResultadoEcografiaImagenes.Tables[0].Rows[0]["RealizaExamen"].ToString();
            ViewBag.RealizaInforme = imgResultadoEcografiaImagenes.Tables[0].Rows[0]["RealizaInforme"].ToString();
            ViewBag.FechaResultado = imgResultadoEcografiaImagenes.Tables[0].Rows[0]["FechaResultado"].ToString() + ' ' + imgResultadoEcografiaImagenes.Tables[0].Rows[0]["HoraResultado"].ToString();

            ViewBag.CodeFirma = imgResultadoEcografiaImagenes.Tables[0].Rows[0]["code"].ToString();
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

            return PartialView(viewResultado);
            //return PartialView("~/Views/Imagenologia/Plantillas/ResultadosPorItem.cshtml");


        }

        /*==================================================================================================*/


    }
}
