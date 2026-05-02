using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using CapaDatos;
using CapaEntidades;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using QRCoder;
using System.Drawing;
using System.IO;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Laboratorio
{
    public class MedicinaReproductivaController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarOrdenesMedicinaReproductiva(int NroOrden, int NroCuenta, int NroHistoria, string NroDocumento, string ApPaterno, string FechaIngresoIni, string FechaIngresoFin)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalMedicinaReproductiva dal = new DalMedicinaReproductiva();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarOrdenesMedicinaReproductiva(NroOrden, NroCuenta, NroHistoria, NroDocumento, ApPaterno, FechaIngresoIni, FechaIngresoFin);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        
        [HttpPost]
        public async Task<ActionResult> SeleccionarOrdenMedicinaReproductiva(MedicinaReproductiva medrepro, string tipoExamen)
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}

            DalMedicinaReproductiva dal = new DalMedicinaReproductiva();
            DataSet dsRegistro = null;
            DataSet dsBiologos = null;
            dsBiologos = await dal.ListarBiologosMedicinaReproductiva();
            dsRegistro = await dal.SeleccionarOrdenMedicinaReproductiva(medrepro);
            var jsonData = JsonConvert.SerializeObject(dsRegistro.Tables[0]);

            ViewBag.Biologos = dsBiologos.Tables[0];
            ViewBag.MedicinaRep = jsonData;
            

            if (tipoExamen == "Espermatograma")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Laboratorio/MedicinaReproductiva/RegistroEspermatograma.cshtml");
            } 
            else if(tipoExamen == "CapacitacionEspermatica")
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/Laboratorio/MedicinaReproductiva/RegistroCapacitacionEspermatica.cshtml");
            }
            else
            {
                return PartialView("");
            }

            
        }

        [HttpPost]
        public async Task<ActionResult> ModificarResultadoMedicinaReproductiva(MedicinaReproductiva medrepro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            bool rsp = false;
            DalMedicinaReproductiva dal = new DalMedicinaReproductiva();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ModificarResultadoMedicinaReproductiva(medrepro, idUsuario);
                if (rsp)
                {
                    rsp = await GenerarFormatoResultado(medrepro.IdCuentaAtencion, medrepro.IdAtencion, medrepro.IdOrden, medrepro.IdProducto);
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarResultadoMedicinaReproductiva(MedicinaReproductiva medrepro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            bool rsp = false;
            DalMedicinaReproductiva dal = new DalMedicinaReproductiva();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.EliminarResultadoMedicinaReproductiva(medrepro, idUsuario);
                
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }


        ////////////////////////////////GENERAR FORMATO PDF////////////////////////////////////////////////////////////////
        public async Task<bool> GenerarFormatoResultado(int idCuentaAtencion, int idAtencion, int idOrden, int idProducto)
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

                pageHtml = Url.Action("FormatoResultado", "MedicinaReproductiva", new { area = "Laboratorio", idAtencion, idOrden, idProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idOrden, idProducto, "MED-REPRO", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<ActionResult> FormatoResultado(MedicinaReproductiva medRepro)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DalMedicinaReproductiva dalMedicinaReproductiva = new DalMedicinaReproductiva();
            DalParametros dalParametro = new DalParametros();
            DataSet lsParametros = new DataSet();
            String telefono, nombre, direccion;
            Conexion conexion = new Conexion();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await dalParametro.SeleccionaFilaParametro2(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            ViewBag.NombreInstitucion = nombre;
            ViewBag.DireccionInstitucion = direccion;
            ViewBag.TelefonoInstitucion = telefono;

            DataSet dsMedicinaReproductiva = await dalMedicinaReproductiva.SeleccionarOrdenMedicinaReproductiva(medRepro);
                                  
            ViewBag.ResultadoMedRepro = dsMedicinaReproductiva.Tables[0].Rows[0];

            ViewBag.CodeFirma = dsMedicinaReproductiva.Tables[0].Rows[0]["code"];
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

            if (ViewBag.ResultadoMedRepro["TipoExamen"] == "CapacitacionEspermatica")
            {
                return PartialView("~/Views/Laboratorio/Plantillas/ResultadosMedReproCapacitacionEspermatica.cshtml");
            }
            else if(ViewBag.ResultadoMedRepro["TipoExamen"] == "Espermatograma")
            {
                return PartialView("~/Views/Laboratorio/Plantillas/ResultadosMedReproEspermatograma.cshtml");
            }
            else
            {
                return PartialView("");
            }


            

        }




    }
}
