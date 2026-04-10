using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QRCoder;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System;
using Ghostscript.NET.Rasterizer;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class AtencionOdontologicaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarAtencion(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.SeleccionarAtencion(idAtencion, idUsuario);

                return Json(new { respuesta = ds, session = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error SeleccionarAtencion - Odontologica: " + ex });
            }
        }


        [HttpPost]
        public async Task<ActionResult> SeleccionarEvaluacion(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.SeleccionarEvaluacion(idAtencion, idUsuario);

                return Json(new { respuesta = ds, session = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error SeleccionarEvaluacion - Odontologica: " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarHallazgos(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.SeleccionarHallazgosOdontologicos(idAtencion, idUsuario);

                return Json(new { respuesta = ds, session = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error SeleccionarHallazgos - Odontologica: " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarHallazgosValores(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoEvaluacion.SeleccionarHallazgosValoresOdontologicos(idAtencion, idUsuario);

                return Json(new { respuesta = ds, session = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Error SeleccionarHallazgos - Odontologica: " + ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarAtencion(AtencionOdontologica objEva, String lstHallazgos, String lstHallazgosValores)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds, ds2;
            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjHallazgos = JsonConvert.DeserializeObject<List<HallazgosOdontologicos>>(lstHallazgos);
                var lstobjHallazgosValores = JsonConvert.DeserializeObject<List<HallazgosValoresOdontologicos>>(lstHallazgosValores);
                ds = await daoEvaluacion.GuardarAtencion(objEva, lstobjHallazgos, lstobjHallazgosValores, idUsuario);
                ds2 = await daoEvaluacion.SeleccionarAtencion(objEva.idAtencion, idUsuario);

                //informe = await GenerarHojaAtencion(Convert.ToInt32(ds2.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()), Convert.ToInt32(ds2.Tables[0].Rows[0]["IdAtencion"].ToString()), Convert.ToInt32(ds2.Tables[0].Rows[0]["IdAtencionOdontologica"].ToString()));
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = true, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { respuesta = false, session = true, estado = false, msj = "Error GuardarAtencion - Odontologica: " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GuardarEvaluacion(AtencionOdontologica objEva, String lstHallazgos, String lstHallazgosValores)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds, ds2;
            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();
            //Boolean triaje, hoja;

            try
            {
                int idUsuario;
                //bool informe;

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjHallazgos = JsonConvert.DeserializeObject<List<HallazgosOdontologicos>>(lstHallazgos);
                var lstobjHallazgosValores = JsonConvert.DeserializeObject<List<HallazgosValoresOdontologicos>>(lstHallazgosValores);
                ds = await daoEvaluacion.GuardarEvaluacion(objEva, lstobjHallazgos, lstobjHallazgosValores, idUsuario);
                ds2 = await daoEvaluacion.SeleccionarEvaluacion(objEva.idAtencion, idUsuario);

                //informe = await GenerarHojaAtencion(Convert.ToInt32(ds2.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()), Convert.ToInt32(ds2.Tables[0].Rows[0]["IdAtencion"].ToString()), Convert.ToInt32(ds2.Tables[0].Rows[0]["IdAtencionOdontologica"].ToString()));
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = true, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { respuesta = false, session = true, estado = false, msj = "Error GuardarAtencion - Odontologica: " + ex });
            }

        }

        //[HttpPost]
        //public async Task<bool> GenerarHojaAtencion(int idCuenta, int idAtencion, int idAtencionOdontologica)
        //{
        //    try
        //    {
        //        FormatoPdf pdf = new FormatoPdf();
        //        FirmaDigital firma = new FirmaDigital();
        //        StringBuilder stringHtml = new StringBuilder();
        //        string pageHtml;
        //        UtilitarioController utilitario = new UtilitarioController();
        //        bool resp;

        //        int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        string usuario = HttpContext.Session.GetString("usuario");

        //        stringHtml = null;
        //        pageHtml = null;
        //        pageHtml = Url.Action("InformeAtencion", "AtencionOdontologica", new { area = "ConsultaExterna", idAtencion, usuario }, "http");

        //        pdf.orientacion = "Portrait";
        //        pdf.tamanio = "A4";
        //        pdf.marginX = 20;
        //        pdf.marginY = 20;
        //        resp = await utilitario.GenerarDocumentoDigital(idCuenta, idAtencionOdontologica, 0, "CE-ODO", 0, pageHtml, stringHtml, idUsuario, pdf);

        //        return resp;
        //    }
        //    catch (Exception e)
        //    {
        //        Debug.Print(e.Message.ToString());
        //        return false;
        //    }
        //}

        //public async Task<ActionResult> InformeAtencion(int idAtencion, string usuario)
        //{
        //    Conexion con = new Conexion();
        //    QRCodeGenerator qrGenerator = new QRCodeGenerator();

        //    DataSet DatosEvaluacion;
        //    DataSet Hallazgos;
        //    DataSet Diagnosticos;
        //    //DateTime today = DateTime.Today;
        //    int idUsuario = 0;

        //    DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();
        //    DalAtenciones daoAtenciones = new DalAtenciones();

        //    @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
        //    @ViewBag.Usuario = usuario;
        //    @ViewBag.RutaArchivos = con.ObtenerServidorArchivosIp();
        //    //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


        //    DatosEvaluacion = await daoEvaluacion.SeleccionarEvaluacion(idAtencion, idUsuario);
        //    //Hallazgos = await daoEvaluacion.SeleccionarHallazgosOdontologicos(idAtencion, idUsuario);
        //    Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, 11, 1);
        //    DataTable dtDx = Diagnosticos.Tables[0];
        //    @ViewBag.DxEvaluacion = dtDx;

        //    @ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
        //    @ViewBag.Edad = DatosEvaluacion.Tables[0].Rows[0]["Edad"];
        //    @ViewBag.Sexo = DatosEvaluacion.Tables[0].Rows[0]["Sexo"];
        //    @ViewBag.Historia = DatosEvaluacion.Tables[0].Rows[0]["Historia"];
        //    @ViewBag.NroDocumento = DatosEvaluacion.Tables[0].Rows[0]["NroDocumento"];
        //    @ViewBag.Puesto = DatosEvaluacion.Tables[0].Rows[0]["Puesto"];
        //    @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
        //    @ViewBag.Empresa = DatosEvaluacion.Tables[0].Rows[0]["Empresa"];
        //    @ViewBag.EmpresaDestino = DatosEvaluacion.Tables[0].Rows[0]["EmpresaDestino"];

        //    @ViewBag.XPreOcupacional = (DatosEvaluacion.Tables[0].Rows[0]["optPreOcupacional"].ToString() == "1" ? "Si" : "No");
        //    @ViewBag.XAnual = (DatosEvaluacion.Tables[0].Rows[0]["optAnual"].ToString() == "1" ? "Si" : "No");
        //    @ViewBag.XRetiro = (DatosEvaluacion.Tables[0].Rows[0]["optRetiro"].ToString() == "1" ? "Si" : "No");
        //    @ViewBag.XPuestoLaboral = (DatosEvaluacion.Tables[0].Rows[0]["optPuestoLaboral"].ToString() == "1" ? "Si" : "No");

        //    @ViewBag.XAlergia = (DatosEvaluacion.Tables[0].Rows[0]["optAlergia"].ToString() == "1" ? "Si" : "No");
        //    @ViewBag.DAlergia = DatosEvaluacion.Tables[0].Rows[0]["dAlergia"];

        //    @ViewBag.XEnfermedad = (DatosEvaluacion.Tables[0].Rows[0]["optEnfermedad"].ToString() == "1" ? "Si" : "No");
        //    @ViewBag.DEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["dEnfermedad"];

        //    @ViewBag.XSarro = (DatosEvaluacion.Tables[0].Rows[0]["optSarro"].ToString() == "1" ? "Si" : "No");
        //    @ViewBag.XPlacaBacteriana = (DatosEvaluacion.Tables[0].Rows[0]["optPlacaBacteriana"].ToString() == "1" ? "Si" : "No");

        //    @ViewBag.DObservaciones = DatosEvaluacion.Tables[0].Rows[0]["dObservaciones"];

        //    @ViewBag.DCaries = DatosEvaluacion.Tables[0].Rows[0]["dCaries"];
        //    @ViewBag.DPiezasAusentes = DatosEvaluacion.Tables[0].Rows[0]["dPiezasAusentes"];
        //    @ViewBag.DRemanenteRadicular = DatosEvaluacion.Tables[0].Rows[0]["dRemanenteRadicular"];
        //    @ViewBag.DNecrosisPulpar = DatosEvaluacion.Tables[0].Rows[0]["dNecrosisPulpar"];
        //    @ViewBag.DAbcesos = DatosEvaluacion.Tables[0].Rows[0]["dAbcesos"];

        //    @ViewBag.DRecomendaciones = DatosEvaluacion.Tables[0].Rows[0]["dRecomendaciones"];

        //    //byte[] imageBytes = Convert.FromBase64String(DatosEvaluacion.Tables[0].Rows[0]["rutaImagen"].ToString());
        //    //// Convert byte[] to Image
        //    //using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
        //    //{
        //    //    Image image = Image.FromStream(ms, true);
        //    //    @ViewBag.OdontogramaImg = ms.ToArray();
        //    //}
        //    @ViewBag.OdontogramaImg = DatosEvaluacion.Tables[0].Rows[0]["rutaImagen"].ToString();
        //    //@ViewBag.RutaArchivoImg = con.ObtenerServidorArchivosIp() + DatosEvaluacion.Tables[0].Rows[0]["RutaArchivoImg"];

        //    /*DataTable dtHallazgos = Hallazgos.Tables[0];            
        //    @ViewBag.Hallazgos = dtHallazgos;*/

        //    @ViewBag.RutaArchivoImg = DatosEvaluacion.Tables[0].Rows[0]["RutaArchivoImg"].ToString() == "" ? "" : con.ObtenerServidorArchivosIp() + DatosEvaluacion.Tables[0].Rows[0]["RutaArchivoImg"];

        //    if (@ViewBag.RutaArchivoImg != "")
        //    {
        //        @ViewBag.RutaArchivoImg = @ViewBag.RutaArchivoImg.Replace(con.ObtenerServidorArchivosIp(), con.ObtenerServidorArchivos());
        //        FileInfo fi = new FileInfo(@ViewBag.RutaArchivoImg);
        //        if (fi.Extension == ".pdf")
        //        {
        //            using (var rasterizer = new GhostscriptRasterizer())
        //            {
        //                rasterizer.Open(@ViewBag.RutaArchivoImg);
        //                string base64Image = "";
        //                string[] imagenesSubidas = new string[rasterizer.PageCount];
        //                for (int pageNumber = 1; pageNumber <= rasterizer.PageCount; pageNumber++)
        //                {
        //                    using (var img = rasterizer.GetPage(300, pageNumber))
        //                    {
        //                        using (MemoryStream memoryStream = new MemoryStream())
        //                        {
        //                            img.Save(memoryStream, ImageFormat.Png);

        //                            byte[] imageBytes = memoryStream.ToArray();
        //                            base64Image = Convert.ToBase64String(imageBytes);

        //                            imagenesSubidas[pageNumber - 1] = base64Image;
        //                        }
        //                    }
        //                }
        //                @ViewBag.RutaArchivoImg = imagenesSubidas;
        //            }
        //        }
        //        else
        //        {
        //            string[] imagenesSubidas = new string[1];
        //            Image image = Image.FromFile(@ViewBag.RutaArchivoImg);
        //            byte[] imageBytes;
        //            using (MemoryStream ms = new MemoryStream())
        //            {
        //                image.Save(ms, ImageFormat.Jpeg); // Ajusta el formato según tu imagen
        //                imageBytes = ms.ToArray();
        //            }
        //            string base64String = Convert.ToBase64String(imageBytes);
        //            imagenesSubidas[0] = base64String;
        //            @ViewBag.RutaArchivoImg = imagenesSubidas;
        //        }
        //    }

        //    @ViewBag.MedicoFirmaDigital = con.ObtenerServidorArchivosIp() + DatosEvaluacion.Tables[0].Rows[0]["MedicoRutaFirma"];
        //    @ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];
        //    @ViewBag.MedicoCip = DatosEvaluacion.Tables[0].Rows[0]["MedicoCip"];
        //    @ViewBag.MedicoEspecialidad = DatosEvaluacion.Tables[0].Rows[0]["MedicoEspecialidad"];
        //    @ViewBag.EstablecimientoSalud = DatosEvaluacion.Tables[0].Rows[0]["EstablecimientoSalud"];

        //    @ViewBag.CodeFirma = DatosEvaluacion.Tables[0].Rows[0]["code"];

        //    if (@ViewBag.CodeFirma != "")
        //    {
        //        QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
        //        QRCode qrCode = new QRCode(qrCodeData);

        //        using (Bitmap bitMap = qrCode.GetGraphic(20))
        //        {
        //            using (MemoryStream ms = new MemoryStream())
        //            {
        //                bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
        //                @ViewBag.CodigoQR = ms.ToArray();
        //            }
        //        }
        //    }

        //    return PartialView("~/Views/SaludOcupacional/Plantillas/InformeOdontologia.cshtml");
        //}

        [HttpPost]
        public async Task<bool> GenerarHojaAtencion(int idCuenta, int idAtencion, int idAtencionOdontologica)
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
                pageHtml = Url.Action("InformeAtencion", "AtencionOdontologica", new { area = "ConsultaExterna", idAtencion, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuenta, idAtencionOdontologica, 0, "CE-A", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeAtencion(int idAtencion, string usuario)
        {
            Conexion con = new Conexion();
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosEvaluacion;
            DataSet Diagnosticos;
            //DateTime today = DateTime.Today;
            int idUsuario = 0;

            DalAtencionOdontologica daoEvaluacion = new DalAtencionOdontologica();
            DalAtenciones daoAtenciones = new DalAtenciones();

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;
            @ViewBag.RutaArchivos = con.ObtenerServidorArchivosIp();
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosEvaluacion = await daoEvaluacion.SeleccionarAtencion(idAtencion, idUsuario);
            //Hallazgos = await daoEvaluacion.SeleccionarHallazgosOdontologicos(idAtencion, idUsuario);
            Diagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, 11, 1);
            DataTable dtDx = Diagnosticos.Tables[0];
            @ViewBag.DxEvaluacion = dtDx;

            @ViewBag.Paciente = DatosEvaluacion.Tables[0].Rows[0]["Paciente"];
            @ViewBag.Edad = DatosEvaluacion.Tables[0].Rows[0]["Edad"];
            @ViewBag.Sexo = DatosEvaluacion.Tables[0].Rows[0]["Sexo"];
            @ViewBag.Historia = DatosEvaluacion.Tables[0].Rows[0]["Historia"];
            @ViewBag.NroDocumento = DatosEvaluacion.Tables[0].Rows[0]["NroDocumento"];
            //@ViewBag.Puesto = DatosEvaluacion.Tables[0].Rows[0]["Puesto"];
            @ViewBag.FechaEvaluacion = DatosEvaluacion.Tables[0].Rows[0]["FechaEvaluacion"];
            //@ViewBag.Empresa = DatosEvaluacion.Tables[0].Rows[0]["Empresa"];
            //@ViewBag.EmpresaDestino = DatosEvaluacion.Tables[0].Rows[0]["EmpresaDestino"];

            @ViewBag.XPreOcupacional = (DatosEvaluacion.Tables[0].Rows[0]["optPreOcupacional"].ToString() == "1" ? "Si" : "No");
            @ViewBag.XAnual = (DatosEvaluacion.Tables[0].Rows[0]["optAnual"].ToString() == "1" ? "Si" : "No");
            @ViewBag.XRetiro = (DatosEvaluacion.Tables[0].Rows[0]["optRetiro"].ToString() == "1" ? "Si" : "No");
            @ViewBag.XPuestoLaboral = (DatosEvaluacion.Tables[0].Rows[0]["optPuestoLaboral"].ToString() == "1" ? "Si" : "No");

            @ViewBag.XAlergia = (DatosEvaluacion.Tables[0].Rows[0]["optAlergia"].ToString() == "1" ? "Si" : "No");
            @ViewBag.DAlergia = DatosEvaluacion.Tables[0].Rows[0]["dAlergia"];

            @ViewBag.XEnfermedad = (DatosEvaluacion.Tables[0].Rows[0]["optEnfermedad"].ToString() == "1" ? "Si" : "No");
            @ViewBag.DEnfermedad = DatosEvaluacion.Tables[0].Rows[0]["dEnfermedad"];

            @ViewBag.XSarro = (DatosEvaluacion.Tables[0].Rows[0]["optSarro"].ToString() == "1" ? "Si" : "No");
            @ViewBag.XPlacaBacteriana = (DatosEvaluacion.Tables[0].Rows[0]["optPlacaBacteriana"].ToString() == "1" ? "Si" : "No");

            @ViewBag.DObservaciones = DatosEvaluacion.Tables[0].Rows[0]["dObservaciones"];

            @ViewBag.DCaries = DatosEvaluacion.Tables[0].Rows[0]["dCaries"];
            @ViewBag.DPiezasAusentes = DatosEvaluacion.Tables[0].Rows[0]["dPiezasAusentes"];
            @ViewBag.DRemanenteRadicular = DatosEvaluacion.Tables[0].Rows[0]["dRemanenteRadicular"];
            @ViewBag.DNecrosisPulpar = DatosEvaluacion.Tables[0].Rows[0]["dNecrosisPulpar"];
            @ViewBag.DAbcesos = DatosEvaluacion.Tables[0].Rows[0]["dAbcesos"];

            @ViewBag.DRecomendaciones = DatosEvaluacion.Tables[0].Rows[0]["dRecomendaciones"];


            @ViewBag.OdontogramaImg = DatosEvaluacion.Tables[0].Rows[0]["rutaImagen"].ToString();

            //@ViewBag.RutaArchivoImg = DatosEvaluacion.Tables[0].Rows[0]["RutaArchivoImg"].ToString() == "" ? "" : con.ObtenerServidorArchivosIp() + DatosEvaluacion.Tables[0].Rows[0]["RutaArchivoImg"];

            //if (@ViewBag.RutaArchivoImg != "")
            //{
            //    @ViewBag.RutaArchivoImg = @ViewBag.RutaArchivoImg.Replace(con.ObtenerServidorArchivosIp(), con.ObtenerServidorArchivos());
            //    FileInfo fi = new FileInfo(@ViewBag.RutaArchivoImg);
            //    if (fi.Extension == ".pdf")
            //    {
            //        using (var rasterizer = new GhostscriptRasterizer())
            //        {
            //            rasterizer.Open(@ViewBag.RutaArchivoImg);
            //            string base64Image = "";
            //            string[] imagenesSubidas = new string[rasterizer.PageCount];
            //            for (int pageNumber = 1; pageNumber <= rasterizer.PageCount; pageNumber++)
            //            {
            //                using (var img = rasterizer.GetPage(300, pageNumber))
            //                {
            //                    using (MemoryStream memoryStream = new MemoryStream())
            //                    {
            //                        img.Save(memoryStream, ImageFormat.Png);

            //                        byte[] imageBytes = memoryStream.ToArray();
            //                        base64Image = Convert.ToBase64String(imageBytes);

            //                        imagenesSubidas[pageNumber - 1] = base64Image;
            //                    }
            //                }
            //            }
            //            @ViewBag.RutaArchivoImg = imagenesSubidas;
            //        }
            //    }
            //    else
            //    {
            //        string[] imagenesSubidas = new string[1];
            //        Image image = Image.FromFile(@ViewBag.RutaArchivoImg);
            //        byte[] imageBytes;
            //        using (MemoryStream ms = new MemoryStream())
            //        {
            //            image.Save(ms, ImageFormat.Jpeg); // Ajusta el formato según tu imagen
            //            imageBytes = ms.ToArray();
            //        }
            //        string base64String = Convert.ToBase64String(imageBytes);
            //        imagenesSubidas[0] = base64String;
            //        @ViewBag.RutaArchivoImg = imagenesSubidas;
            //    }
            //}

            @ViewBag.MedicoFirmaDigital = con.ObtenerServidorArchivosIp() + DatosEvaluacion.Tables[0].Rows[0]["MedicoRutaFirma"];
            @ViewBag.Medico = DatosEvaluacion.Tables[0].Rows[0]["Medico"];
            @ViewBag.MedicoCip = DatosEvaluacion.Tables[0].Rows[0]["MedicoCip"];
            @ViewBag.MedicoEspecialidad = DatosEvaluacion.Tables[0].Rows[0]["MedicoEspecialidad"];
            @ViewBag.EstablecimientoSalud = DatosEvaluacion.Tables[0].Rows[0]["EstablecimientoSalud"];

            @ViewBag.CodeFirma = DatosEvaluacion.Tables[0].Rows[0]["code"];

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

            return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoOdontologico.cshtml");
        }
    }
}
