using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using System.Diagnostics;
using System.IO;
using WebAppMaternidad.Areas.Comun;
using CapaEntidades;
using Microsoft.Extensions.Configuration;
using QRCoder;
using System.Drawing;
using System.Text;
using static CapaEntidades.Enumerados;

namespace WebAppMaternidad.Areas.Imagenes
{
    public class ImagenologiaResultadosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<ActionResult> EmpleadosImagenologiaPorGrupo(int idGrupo)
        {
            DataSet dataSet;
            DalImagenes dal = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.EmpleadosImagenologiaPorGrupo(idGrupo);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosImagenologiaTodos()
        {
            DataSet dataSet;
            DalImagenes dal = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.EmpleadosImagenologiaTodos();

            return Json(new { dataSet, estado = true, session = true });
        }
               

        [HttpPost]
        public async Task<ActionResult> ListarResultados(int idOrden, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultados;
            DalImagenes dal = new DalImagenes();
            lsResultados = await dal.ListarResultadosLabImg(idOrden, idProducto, "IMG");

            return Json(new { lsResultados = lsResultados, session = true });
        }

        ///////////////////////IMAGEN ADJUNTA////////////////////////////////////////
        [HttpPost]
        public async Task<Boolean> GuardarImagenAdjunta(int idCuenta, int idOrden, int idMovimiento, int idProducto, string tipo, IFormFile imageArchivo)
        {
            try
            {
                UtilitarioController utilitario = new UtilitarioController();
                DalImagenes dal = new DalImagenes();
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
        public async Task<Boolean> EliminarImagenAdjunta(int idImgResultadoImagen)
        {
            bool resp = false;
            DalImagenes dal = new DalImagenes();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                resp = await dal.EliminarResultadoImagen(idImgResultadoImagen, idUsuario);

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
            DalImagenes dal = new DalImagenes();
            lsResultados = await dal.ListarResultadosImagenes(idOrden, idMovimiento, idProducto);

            return Json(new { lsResultados = lsResultados, session = true });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////


        

        [HttpPost]
        public async Task<ActionResult> CargarModuloResultado(string formularioRegistro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");



            if (formularioRegistro == "frmEcoVaginalBasica")
            {
                ViewBag.TipoModulo = "Ecografía XXXXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoVaginalBasica.cshtml");
            }
            else if (formularioRegistro == "frmecoGenetica")
            {
                ViewBag.TipoModulo = "Ecografía XXXXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoGenetica.cshtml");
            }
            else if (formularioRegistro == "frmEcoAbdominalBasic")
            {
                ViewBag.TipoModulo = "Ecografia XXXXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoAbdominalBasica.cshtml");
            }
            else if (formularioRegistro == "frmEcoUteroGrav")
            {
                ViewBag.TipoModulo = "Ecografia XXXXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoUteroGravido.cshtml");
            }
            else if (formularioRegistro == "frmEcoDopplerCrec")
            {
                ViewBag.TipoModulo = "Ecografía XXXXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoDopplerCrecimiento.cshtml");
            }
            else if (formularioRegistro == "frmEcoNeurosonografi")
            {
                ViewBag.TipoModulo = "Ecografía XXXXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoNeurosonografia.cshtml");
            }
            else if (formularioRegistro == "frmEcoCardiografia")
            {
                ViewBag.TipoModulo = "Ecografía XXXXXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoCardiografia.cshtml");
            }
            else if (formularioRegistro == "frmecoMorfologico")
            {
                ViewBag.TipoModulo = "Ecografía XXXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoMorfologica.cshtml");
            }
            else if (formularioRegistro == "frmCardiotocografiaCST")
            {
                ViewBag.TipoModulo = "Ecografía XXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoCardiotografiaCST.cshtml");
            }
            else if (formularioRegistro == "frmCardiotocografiaNST")
            {
                ViewBag.TipoModulo = "Ecografía XXXXX";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcoCardiotografiaNST.cshtml");
            }
            else
            {
                ViewBag.TipoModulo = "ModuloEspecialidadesAdolescencia";
                return PartialView("Vista no Disponible");
            }
        }


        [HttpPost]
        public async Task<ActionResult> GuardarResultados(ImgResultadosCabecera cabecera, String detalleResultado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            bool resp = false, res = false, informeItem = false;
            DalImagenes dal = new DalImagenes();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstDetalleResultado = JsonConvert.DeserializeObject<List<ImgResultadosPorItems>>(detalleResultado);
            res = await dal.GuardarResultados(cabecera, lstDetalleResultado, idUsuario);
            informeItem = await GenerarFormatoResultadosPorItem(cabecera.IdCuentaAtencion, cabecera.IdOrden, cabecera.IdMovimiento, cabecera.IdProducto, "IMG-RES");
            //informeGrupo = await GenerarFormatoResultadosPorGrupos(cabecera.IdCuentaAtencion, cabecera.IdOrden, cabecera.IdMovimiento, cabecera.IdProducto, "LAB-RES-GRUPO");

            if (res /*&& informeItem && informeGrupo*/)
            {
                resp = true;
            }

            return Json(new { respuesta = resp, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> EliminarResultado(int idMovimiento, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalImagenes dal = new DalImagenes();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await dal.EliminarResultado(idMovimiento, idProducto, idUsuario);

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

                pageHtml = Url.Action("rptResultadoImagenologiaPorItem", "ImagenologiaResultados", new { area = "Laboratorio", idOrden, idMovimiento, idProducto }, "http");

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

        public async Task<ActionResult> rptResultadoImagenologiaPorItem(int idOrden, int idMovimiento, int idProducto)
        {
            Conexion con = new Conexion();
            DalParametros dalParametro = new DalParametros();
            DalImagenes dalImagenologia = new DalImagenes();
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
            ViewBag.OrdenaPrueba = labMovimientoLaboratorio.Tables[0].Rows[0]["OrdenaPrueba"];
            ViewBag.Paciente = labMovimientoLaboratorio.Tables[0].Rows[0]["Paciente"];
            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");

            DataSet imgResultadoImagenes;
            imgResultadoImagenes = await dalImagenologia.ListarResultadosImagenologia(idOrden, idProducto, "IMG");

            List<string> grupos = new List<string>();
            DataTable LabCabecera = imgResultadoImagenes.Tables[0];
            DataTable LabResultados = imgResultadoImagenes.Tables[1];
            DataTable LabObservaciones = imgResultadoImagenes.Tables[2];

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
                ViewBag.Informe = LabObservaciones.Rows[0]["Informe"].ToString();
                ViewBag.Observaciones = LabObservaciones.Rows[0]["Obseraciones"].ToString();
                ViewBag.Conclusiones = LabObservaciones.Rows[0]["Conclusiones"].ToString();
            }

            ViewBag.ServicioRealiza = imgResultadoImagenes.Tables[0].Rows[0]["ServicioRealiza"].ToString();
            ViewBag.ServerArchivosIp = con.ObtenerServidorArchivosIp();

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

            return PartialView("~/Views/Imagenologia/Plantillas/ResultadosPorItem.cshtml");


        }




    }
}
