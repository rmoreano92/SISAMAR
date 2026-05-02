using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using Newtonsoft.Json;
using WebAppMaternidad.CapaEntidades;
using static CapaEntidades.ListBarItemEnum;
using System.Collections.Generic;
using CapaDatos;
using CapaEntidades;
using QRCoder;
using System.Drawing;
using System.IO;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using System.Security.Cryptography;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Facturacion
{
    public class EvaluacionRiesgoSocialController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarEvaluacionRiesgoSocial(int NroEvaluacion, int NroCuenta, int NroHistoria, string NroDocumento, string ApPaterno, string ApMaterno, string fecha)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarEvaluacionRiesgoSocial(NroEvaluacion, NroCuenta, NroHistoria, NroDocumento, ApPaterno, ApMaterno, fecha);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> ListarEvaluacionRiesgoSocialPorPaciente(int IdPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarEvaluacionRiesgoSocialPorPaciente(IdPaciente);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> CargarFormatoEvaluacionRiesgoSocial()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.CargarFormatoEvaluacionRiesgoSocial();
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> CalcularNivelEvaluacionRiesgoSocial(int total)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.CalcularNivelEvaluacionRiesgoSocial(total);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacionRiesgoSocial(int NroEvaluacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.SeleccionarEvaluacionRiesgoSocial(NroEvaluacion);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });

        }

        [HttpPost]
        public async Task<ActionResult> ListarDiagnosticosEvaluacion(int IdCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            string respuesta = "";
            DataSet rsp = null;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarDiagnosticosEvaluacion(IdCuentaAtencion);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });

        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacionRiesgoSocial(RiesgoSocial evaluacion, string detalle, int IdListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjDetalle = JsonConvert.DeserializeObject<List<RiesgoSocialDetalle>>(detalle);
            ds = await dal.GuardarEvaluacionRiesgoSocial(evaluacion, lstobjDetalle, idUsuario, IdListBar);
            int idCuenta = Int32.Parse(ds.Tables[0].Rows[0]["IdCuentaAtencion"].ToString());
            int idEvaluacion = Int32.Parse(ds.Tables[0].Rows[0]["IdEvaluacion"].ToString());
            bool rsp = await GenerarFormatoInforme(idEvaluacion, idCuenta);

            return Json(new { respuesta = ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarEvaluacionRiesgoSocial(int NroEvaluacion, int IdListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalEvaluacionRiesgoSocial dal = new DalEvaluacionRiesgoSocial();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            
            ds = await dal.EliminarEvaluacionRiesgoSocial(NroEvaluacion, idUsuario, IdListBar);
            return Json(new { respuesta = ds, sesion = true });
        }


        ////////////////////////////////GENERAR FORMATO PDF////////////////////////////////////////////////////////////////
        public async Task<bool> GenerarFormatoInforme(int idEvaluacion, int idCuentaAtencion)
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

                pageHtml = Url.Action("FormatoInforme", "EvaluacionRiesgoSocial", new { area = "Facturacion", idEvaluacion }, "http");

                pdf.orientacion = "Portrait";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idEvaluacion, 0, "INF-RS", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ActionResult> FormatoInforme(int idEvaluacion)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DalEvaluacionRiesgoSocial dalEvaluacionRiesgoSocial = new DalEvaluacionRiesgoSocial();
            DalParametros dalParametro = new DalParametros();
            DataSet lsParametros = new DataSet();
            String telefono, nombre, direccion;
            Conexion conexion = new Conexion();
            List<string> categorias = new List<string>();


            lsParametros = await dalParametro.SeleccionaFilaParametro2(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");

            ViewBag.NombreInstitucion = nombre;
            ViewBag.DireccionInstitucion = direccion;
            ViewBag.TelefonoInstitucion = telefono;

            DataSet dsEvaluacionRiesgoSocial = await dalEvaluacionRiesgoSocial.EvaluacionRiesgoSocialInforme(idEvaluacion);
            

            ViewBag.Evaluacion = dsEvaluacionRiesgoSocial.Tables[0].Rows[0];
            ViewBag.EvaluacionDetalle = dsEvaluacionRiesgoSocial.Tables[1];
            Console.WriteLine(ViewBag.Evaluacion["IdcuentaAtencion"]);
            DataSet Diagnosticos = await dalEvaluacionRiesgoSocial.ListarDiagnosticosEvaluacion(ViewBag.Evaluacion["IdcuentaAtencion"]);

            DataTable dtDiagnosticos = Diagnosticos.Tables[0];

            @ViewBag.DxEvaluacion = dtDiagnosticos;

            foreach (DataRow row in dsEvaluacionRiesgoSocial.Tables[1].Rows)
            {
                if (row["Categoria"].ToString() != "")
                {
                    if (!categorias.Contains(row["Categoria"].ToString()))
                    {
                        categorias.Add(row["Categoria"].ToString());
                    }
                }

            }

            ViewBag.Categorias = categorias;

            ViewBag.CodeFirma = dsEvaluacionRiesgoSocial.Tables[0].Rows[0]["code"];
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

            ViewBag.IpArchivos = conexion.ObtenerServidorArchivosIp();

            return PartialView("~/Views/Facturacion/Plantillas/InformeRiesgoSocial.cshtml");


        }

    }
}
