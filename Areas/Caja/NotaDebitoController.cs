using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using CapaDatos;
using CapaEntidades;
using Microsoft.Extensions.Configuration;
using QRCoder;
using System.IO;
using System.Net.Mime;
using System.Text;
using WebAppMaternidad.Areas.Comun;

namespace WebAppMaternidad.Areas.Caja
{
    public class NotaDebitoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> NotasDebitoListar(string nroSerie, string nroDocumento, string razonSocial, int idTipoEstado, string fechaInicio, string fechaFin)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalNotaDebito dal = new DalNotaDebito();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.NotasDebitoListar(nroSerie, nroDocumento, razonSocial, idTipoEstado, fechaInicio, fechaFin);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> NotaDebitoSeleccionar(int idNota)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalNotaDebito dal = new DalNotaDebito();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.NotaDebitoSeleccionar(idNota);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> NotaDebitoGuardar(NotaDebito notaDebito, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalNotaDebito dal = new DalNotaDebito();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.NotaDebitoGuardar(notaDebito, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> NotaDebitoEliminar(int idNota, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalNotaDebito dal = new DalNotaDebito();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.NotaDebitoEliminar(idNota, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }


        //-----------------------------------------------------------------------------------------------------------

        [HttpPost]
        public async Task<ActionResult> ObtenerSiguienteDocumento(int idTipoNota)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalNotaDebito dal = new DalNotaDebito();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerSiguienteDocumento(idTipoNota);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        //-------------------------------------------------------------------------------------------------------------------

        [HttpPost]
        public async Task<ActionResult> GenerarFormatoNotaDebito(int idNota)
        {
            //string rsp = "";
            int idUsuario = 0;
            DalPaciente dalPaciente = new DalPaciente();
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            string respuesta = "Error al registrar la generación de la nota.";

            try
            {

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");

                pageHtml = Url.Action("FormatoNotaDebito", "NotaDebito", new { idNota, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
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

        public async Task<ActionResult> FormatoNotaDebito(int idNota, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();            
            DalNotaDebito dalNotaDebito = new DalNotaDebito();

            //DataSet lsParametros = new DataSet();
            DataSet dsNota = await dalNotaDebito.NotaDebitoFormato(idNota);
            DataRow drNota = dsNota.Tables[0].Rows[0];

            var nombre = await daoParametros.SeleccionaFilaParametro2(205);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207);
            var ruc = await daoParametros.SeleccionaFilaParametro2(339);

            DateTime now = DateTime.Now;

            var ConfServerApp = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:UrlAppWeb");
            var ConfServerFiles = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:UrlAppFiles");

            @ViewBag.IpServer = ConfServerApp.ToString();
            @ViewBag.IpServerFiles = ConfServerFiles.ToString();

            @ViewBag.NotaDebito = drNota;

            
            @ViewBag.FechaImpresion = now;
            @ViewBag.Usuario = usuario;



            return PartialView("~/Views/Caja/Plantillas/FormatoTicketNotaDebito.cshtml");
        }


    }
}
