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
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.CapaDatos;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Imagenes
{
    public class ImagenesResultadosController : BaseController
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
            DalImagenes daoMovimientos = new DalImagenes();

            listaMovimientos = await daoMovimientos.ImagMovimientoImagenesSeleccionarByIdCuenta(idCuentaAtencion);

            return Json(listaMovimientos);
            //return Json(new { listaMovimientos = listaMovimientos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarMovimientosPorIdPaciente(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaMovimientos;
            DalImagenes daoMovimientos = new DalImagenes();

            listaMovimientos = await daoMovimientos.ImagMovimientoImagenesSeleccionarPorIdPaciente(idPaciente);

            return Json(listaMovimientos);
            //return Json(new { listaMovimientos = listaMovimientos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactOrdenServicioPorFechasImgPaciente(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idPuntoCarga)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalImagenes dalImagenes = new DalImagenes();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalImagenes.FactOrdenServicioPorFechasImgPaciente(idMovimiento, idCuenta, historia, nombres, fechaInicio, fechaFin, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalImagenes dalImagenes = new DalImagenes();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalImagenes.ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(idOrden, idPuntoCarga, idMovimiento);
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
            DalImagenes dalImagenes = new DalImagenes();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalImagenes.FactOrdenServicioPorIdMovimiento(idMovimiento, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
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

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;

                pageHtml = Url.Action("rptResultadoImagenesPorItem", "ImagenesResultados", new { area = "Imagenes", idOrden, idMovimiento, idProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idMovimiento, idProducto, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ActionResult> rptResultadoImagenesPorItem(int idOrden, int idMovimiento, int idProducto)
        {
            DalParametros dalParametro = new DalParametros();
            DalImagenes dalImagenes = new DalImagenes();
            DalPaciente dalPaciente = new DalPaciente();
            DalAtenciones dalAtenciones = new DalAtenciones();
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet lsParametros = new DataSet();
            String telefono, nombre, direccion;

            lsParametros = await dalParametro.SeleccionaFilaParametro2(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            DataSet ordenServicio = await dalImagenes.FactOrdenServicioSeleccionarPorIdOrden(idOrden);
            DataSet imgMovimientoImagenes = await dalImagenes.ImgMovimientoImagenesSeleccionarXidOrden(idOrden);
            //DataSet imgResultadoImagenes = await dalImagenes.RptResulImagenesbyMGP(idOrden, idProducto);
            DataSet imgResultadoImagenes = await dalImagenes.ListarResultadosLabImg(idOrden, idProducto, "IMG");
            DataSet labImgLabObservaciones = await dalImagenes.ListarImgLabObservaciones(idOrden, idProducto, idMovimiento);
            DataSet paciente = await dalPaciente.PacientesSeleccionarPorId(Int32.Parse(ordenServicio.Tables[0].Rows[0]["IdPaciente"].ToString()));

            List<string> grupos = new List<string>();
            var idCuentaAtencion = ordenServicio.Tables[0].Rows[0]["IdCuentaAtencion"];

            DataSet atenciones = await dalAtenciones.ListaAtencionByIdCuentaAtencion(Int32.Parse(idCuentaAtencion.ToString()));

            var Observaciones = "";
            var Conclusiones = "";

            if (labImgLabObservaciones.Tables[0].Rows.Count > 0)
            {
                Observaciones = labImgLabObservaciones.Tables[0].Rows[0]["Obseraciones"].ToString();
                Conclusiones = labImgLabObservaciones.Tables[0].Rows[0]["conclusiones"].ToString();
            }

            ViewBag.NombreInstitucion = nombre;
            ViewBag.DireccionInstitucion = direccion;
            ViewBag.TelefonoInstitucion = telefono;
            ViewBag.idMovimiento = idMovimiento;
            ViewBag.OrdenaPrueba = imgMovimientoImagenes.Tables[0].Rows[0]["OrdenaPrueba"];
            ViewBag.Paciente = imgMovimientoImagenes.Tables[0].Rows[0]["Paciente"];
            ViewBag.NroHistoriaClinica = paciente.Tables[0].Rows[0]["NroHistoriaClinica"];
            //ViewBag.Edad = paciente.Tables[0].Rows[0]["Paciente"];
            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");
            ViewBag.Observaciones = Observaciones;
            ViewBag.Conclusiones = Conclusiones;
            ViewBag.Servicio = ordenServicio.Tables[0].Rows[0]["dservicio"];
            ViewBag.Edad = atenciones.Tables[0].Rows[0]["edadPaciente"];

            foreach (DataRow row in imgResultadoImagenes.Tables[0].Rows)
            {
                ViewBag.Examen = row["producto"];
                ViewBag.Recepcionista = row["usuarioRecepciona"];
                ViewBag.FechaRec = row["fechaRecepciona"];
                ViewBag.FechaRes = row["fechaResultado"];
                ViewBag.TipoEmpleado = row["tipoEmpleado"];
                ViewBag.Empleado = row["realizaAnalisis"];

                if (!grupos.Contains(row["Grupo"].ToString()))
                {
                    grupos.Add(row["Grupo"].ToString());
                }
            }

            ViewBag.Grupos = grupos;
            ViewBag.ResultadosImagenes = imgResultadoImagenes.Tables[0];

            ViewBag.CodeFirma = imgResultadoImagenes.Tables[0].Rows[0]["code"];
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

            Console.WriteLine(grupos);

            return PartialView("~/Views/Imagenes/Plantillas/ResultadosPorItem.cshtml");
        }

        [HttpPost]
        public async Task<ActionResult> InsertaEcoVaginalBasica(EcoVaginalBasica ecoVaginalBasica)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            int resp = 0;
            
            DalImagenes dalImagenes = new DalImagenes();
            ImagenologiaEcografiasController imagenologiaEcografias = new ImagenologiaEcografiasController();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ecoVaginalBasica.Usuario = idUsuario;
                resp = await dalImagenes.InsertaEcoVaginalBasica(ecoVaginalBasica);
                bool respInf = await imagenologiaEcografias.GenerarFormatoResultadosEcografia(0, ecoVaginalBasica.IdOrden, ecoVaginalBasica.IdMovimiento, ecoVaginalBasica.IdProducto, "IMG");
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListaEcoVaginalBasica(int? IdMovimiento, int? IdProducto, int? Numero)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.ListaEcoVaginalBasica(IdMovimiento, IdProducto, Numero);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> InsertaEcoGenetica(EcoGenetica ecoGenetica)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            int resp = 0;
            DalImagenes dalImagenes = new DalImagenes();
            ImagenologiaEcografiasController imagenologiaEcografias = new ImagenologiaEcografiasController();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ecoGenetica.Usuario = idUsuario;
                resp = await dalImagenes.InsertaEcoGenetica(ecoGenetica);
                bool respInf = await imagenologiaEcografias.GenerarFormatoResultadosEcografia(0, ecoGenetica.IdOrden, ecoGenetica.IdMovimiento, ecoGenetica.IdExamen, "IMG");
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListaEcoGenetica(int? IdMovimiento, int? IdProducto, int? Numero)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.ListaEcoGenetica(IdMovimiento, IdProducto, Numero);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> InsertaEcoAbdominalBasica(EcoAbdominalBasica ecoAbdominalBasica)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            int resp = 0;
            DalImagenes dalImagenes = new DalImagenes();
            ImagenologiaEcografiasController imagenologiaEcografias = new ImagenologiaEcografiasController();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ecoAbdominalBasica.Usuario = idUsuario;
                resp = await dalImagenes.InsertaEcoAbdominalBasica(ecoAbdominalBasica);
                bool respInf = await imagenologiaEcografias.GenerarFormatoResultadosEcografia(0, ecoAbdominalBasica.IdOrden, ecoAbdominalBasica.IdMovimiento, ecoAbdominalBasica.IdProducto, "IMG");
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListaEcoAbdominalBasico(int? IdMovimiento, int? IdProducto, int? Numero)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.ListaEcoAbdominalBasico(IdMovimiento, IdProducto, Numero);                
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> InsertaEcoUteroGravido(EcoUteroGravido ecoUteroGravido)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            int resp = 0;
            DalImagenes dalImagenes = new DalImagenes();
            ImagenologiaEcografiasController imagenologiaEcografias = new ImagenologiaEcografiasController();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ecoUteroGravido.Usuario = idUsuario;
                resp = await dalImagenes.InsertaEcoUteroGravido(ecoUteroGravido);
                bool respInf = await imagenologiaEcografias.GenerarFormatoResultadosEcografia(0, ecoUteroGravido.IdOrden, ecoUteroGravido.IdMovimiento, ecoUteroGravido.IdExamen, "IMG");
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListaEcoUteroGravido(int? IdMovimiento, int? IdProducto, int? Numero)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.ListaEcoUteroGravido(IdMovimiento, IdProducto, Numero);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }


        [HttpPost]
        public async Task<ActionResult> InsertaEcoDopplerCrecimiento(EcoDopplerCrecimiento ecoDopplerCrecimiento)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            int resp = 0;
            DalImagenes dalImagenes = new DalImagenes();
            ImagenologiaEcografiasController imagenologiaEcografias = new ImagenologiaEcografiasController();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ecoDopplerCrecimiento.Usuario = idUsuario;
                resp = await dalImagenes.InsertaEcoDopplerCrecimiento(ecoDopplerCrecimiento);
                bool respInf = await imagenologiaEcografias.GenerarFormatoResultadosEcografia(0, ecoDopplerCrecimiento.IdOrden, ecoDopplerCrecimiento.IdMovimiento, ecoDopplerCrecimiento.IdExamen, "IMG");
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }
        [HttpPost]
        public async Task<ActionResult> ListaEcoDopplerCrecimiento(int? IdMovimiento, int? IdProducto, int? Numero)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.ListaEcoDopplerCrecimiento(IdMovimiento, IdProducto, Numero);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }



        [HttpPost]
        public async Task<ActionResult> TiposSexoSeleccionarTodosEcografias()
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.TiposSexoSeleccionarTodosEcografias();
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }
        [HttpPost]
        public async Task<ActionResult> ListaComboDetalle(int? IdCatalogoCombo)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.ListaComboDetalle(IdCatalogoCombo);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> EmpleadoImgMGP(int? idGrupo)
        {
            int nRpta = 0;
            DalImagenes dalImagenes = new DalImagenes();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalImagenes.EmpleadoImgMGP(idGrupo);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CargarModulo(string formularioRegistro)
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
                ViewBag.TipoModulo = "frmEcoVaginalBasica";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcografiaBasicaVaginal.cshtml");
            } else if (formularioRegistro == "frmEcoGenetica")
            {
                ViewBag.TipoModulo = "frmEcoVaginalBasica";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcografiaGenetica.cshtml");
            } else if (formularioRegistro == "frmEcoAbdominalBasic")
            {
                ViewBag.TipoModulo = "Ecografia Basica";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcografiaBasica.cshtml");
            } else if (formularioRegistro == "frmEcoUteroGrav")
            {
                ViewBag.TipoModulo = "Ecografia Ecografía Utero";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcografiaUtero.cshtml");
            } else if (formularioRegistro == "frmEcoDopplerCrec")
            {
                ViewBag.TipoModulo = "Ecografía Doppler-Crecimiento Múltpile";
                return PartialView("~/Views/Shared/Components/VistasParciales/Imagenologia/EcografiaDoppler.cshtml");
            }
            else
            {
                ViewBag.TipoModulo = "ModuloEspecialidadesAdolescencia";
                return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
            }
        }
    }
}
