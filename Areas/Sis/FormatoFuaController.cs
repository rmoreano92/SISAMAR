using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using SelectPdf;
using System.Text;
using CapaDatos;
using CapaEntidades;
using WebAppMaternidad.Areas.Comun;
using QRCoder;
using System.Drawing;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using WebAppMaternidad.Controllers;
using Newtonsoft.Json;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Sis
{
    public class FormatoFuaController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;
        private readonly DalSis _dalSis;

        public FormatoFuaController(IWebHostEnvironment env, DalSis dalSis)
        {
            _hostingEnvironment = env;
            _dalSis = dalSis;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtenciones(string lcFiltro)
        {
            string filtro = "";
            filtro = lcFiltro + " order by ate.FechaIngreso desc, ate.HoraIngreso desc, pac.ApellidoPaterno, pac.ApellidoMaterno, pac.PrimerNombre";
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsAtenciones;
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsAtenciones = await _dalSis.BuscarAtencionesPorFiltro(filtro);
            return Json(new { lsAtenciones = lsAtenciones, session = true, estado = true, data = lsAtenciones });
        }

        [HttpPost]
        public async Task<IActionResult> Listar_m_serviciosSIS()
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var idUsuario = IdUsuarioSesion();
                var dataSet = await _dalSis.Listar_m_serviciosSIS();
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Listar_m_IIEE_Grado(int IdNivel)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var idUsuario = IdUsuarioSesion();
                var dataSet = await _dalSis.Listar_m_IIEE_Grado(IdNivel);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ListarInstitucionEducativa(string Codigo, string Nombre)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var idUsuario = IdUsuarioSesion();
                var dataSet = await _dalSis.ListarInstitucionEducativa(Codigo, Nombre);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> SeleccionarSisFuaAtencion(int IdCuentaAtencion)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();
            try
            {
                var idUsuario = IdUsuarioSesion();
                var dataSet = await _dalSis.SeleccionarSisFuaAtencion(IdCuentaAtencion);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
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
                        int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion);
                        if (agregaFua == 1)
                        {
                            pdf.orientacion = "Portrait";
                            pdf.tamanio = "A4";
                            pdf.marginX = 20;
                            pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
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
        public async Task<bool> GenerarHojaFuaTamizajeSnPdf(int idCuentaAtencion, int idAtencion)
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
                if (atencion.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3")
                {
                    int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion);
                    //if (agregaFua == 1)
                    //{
                    //    pdf.orientacion = "Portrait";
                    //    pdf.tamanio = "A4";
                    //    pdf.marginX = 20;
                    //    pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                    //    resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "FUA", 0, pageHtml, stringHtml, idUsuario, pdf);
                    //}
                }
                resp = true;
                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        [HttpPost]
        public async Task<bool> GenerarHojaFuaTamizaje(int idCuentaAtencion, int idAtencion)
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
                if (atencion.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3")
                {
                    int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion);
                    if (agregaFua == 1)
                    {
                        pdf.orientacion = "Portrait";
                        pdf.tamanio = "A4";
                        pdf.marginX = 20;
                        pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                        resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "FUA", 0, pageHtml, stringHtml, idUsuario, pdf);
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

        public async Task<ActionResult> FormatoHojaFua(int idCuentaAtencion)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DalParametros dalParam = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet DatosSisFua;
            DataSet Diagnosticos;
            DataSet Medicamentos;
            DataSet Insumos;
            DataSet Procedimientos;
            DataTable dtDx;
            DataTable dtMed;
            DataTable dtIns;
            DataTable dtProc;
            DataSet DatosParametros;
            DatosParametros = dalParam.SeleccionaFilaParametro(205);
            @ViewBag.RenaesIpress = DatosParametros.Tables[0].Rows[0]["ValorTexto"].ToString();
            DatosParametros = dalParam.SeleccionaFilaParametro(280);
            @ViewBag.NombreIpress = DatosParametros.Tables[0].Rows[0]["ValorTexto"].ToString();
            DatosSisFua = await dalSis.SisFuaAtencionSeleccionarPorId(idCuentaAtencion);
            Diagnosticos = await dalSis.SisFuaAtencionDIAxIdCuentaAtencion(idCuentaAtencion);
            dtDx = Diagnosticos.Tables[0];
            Medicamentos = await dalSis.SisFuaAtencionMEDxIdCuentaAtencion(idCuentaAtencion);
            dtMed = Medicamentos.Tables[0];
            Insumos = await dalSis.SisFuaAtencionINSxIdCuentaAtencion(idCuentaAtencion);
            dtIns = Insumos.Tables[0];
            Procedimientos = await dalSis.SisFuaAtencionPROxIdCuentaAtencion(idCuentaAtencion);
            dtProc = Procedimientos.Tables[0];
            @ViewBag.FechaEmision = DatosSisFua.Tables[0].Rows[0]["FuaAtencionFecha"].ToString() + " " + DateTime.Now.ToString("hh:mm:ss");
            @ViewBag.NroCuenta = idCuentaAtencion.ToString() + DatosSisFua.Tables[0].Rows[0]["FuaServicio"].ToString();
            @ViewBag.FuaDisa = DatosSisFua.Tables[0].Rows[0]["FuaDisa"].ToString();
            @ViewBag.FuaLote = DatosSisFua.Tables[0].Rows[0]["FuaLote"].ToString();
            @ViewBag.FuaNumero = DatosSisFua.Tables[0].Rows[0]["FuaNumero"].ToString();
            @ViewBag.CodigoIpressOrigen = DatosSisFua.Tables[0].Rows[0]["CodigoIpressOrigen"].ToString();
            @ViewBag.NombreIpressOrigen = DatosSisFua.Tables[0].Rows[0]["NombreIpressOrigen"].ToString();
            @ViewBag.FuaPersonalQatiende = DatosSisFua.Tables[0].Rows[0]["FuaPersonalQatiende"].ToString();
            @ViewBag.FuaCodOferFlexible = DatosSisFua.Tables[0].Rows[0]["FuaCodOferFlexible"].ToString();
            @ViewBag.FuaAtencionLugar = DatosSisFua.Tables[0].Rows[0]["FuaAtencionLugar"].ToString();
            @ViewBag.FuaAtencion = DatosSisFua.Tables[0].Rows[0]["FuaAtencion"].ToString();
            @ViewBag.CodigoIpressRefOrigen = DatosSisFua.Tables[0].Rows[0]["CodigoIpressRefOrigen"].ToString();
            @ViewBag.NombreIpressRefOrigen = DatosSisFua.Tables[0].Rows[0]["NombreIpressRefOrigen"].ToString();
            @ViewBag.NroRefOrigen = DatosSisFua.Tables[0].Rows[0]["NroRefOrigen"].ToString();
            @ViewBag.TipoDocumento = DatosSisFua.Tables[0].Rows[0]["TipoDocumento"].ToString();
            @ViewBag.DocumentoNumero = DatosSisFua.Tables[0].Rows[0]["DocumentoNumero"].ToString();
            @ViewBag.AfiliacionDisa = DatosSisFua.Tables[0].Rows[0]["AfiliacionDisa"].ToString();
            @ViewBag.AfiliacionTipoFormato = DatosSisFua.Tables[0].Rows[0]["AfiliacionTipoFormato"].ToString();
            @ViewBag.AfiliacionNroFormato = DatosSisFua.Tables[0].Rows[0]["AfiliacionNroFormato"].ToString();
            @ViewBag.OrigenAseguradoInstitucion = DatosSisFua.Tables[0].Rows[0]["OrigenAseguradoInstitucion"].ToString();
            @ViewBag.OrigenAseguradoCodigo = DatosSisFua.Tables[0].Rows[0]["OrigenAseguradoCodigo"].ToString();
            @ViewBag.Apaterno = DatosSisFua.Tables[0].Rows[0]["Apaterno"].ToString();
            @ViewBag.Amaterno = DatosSisFua.Tables[0].Rows[0]["Amaterno"].ToString();
            @ViewBag.Pnombre = DatosSisFua.Tables[0].Rows[0]["Pnombre"].ToString();
            @ViewBag.Onombre = DatosSisFua.Tables[0].Rows[0]["Onombre"].ToString();
            @ViewBag.Sexo = DatosSisFua.Tables[0].Rows[0]["Sexo"].ToString();
            @ViewBag.FuaCondicionMaterna = DatosSisFua.Tables[0].Rows[0]["FuaCondicionMaterna"].ToString();
            @ViewBag.CPN = DatosSisFua.Tables[0].Rows[0]["CPN"].ToString();
            @ViewBag.EdadGestacional = DatosSisFua.Tables[0].Rows[0]["EdadGestacional"].ToString();
            @ViewBag.AlturaUterina = DatosSisFua.Tables[0].Rows[0]["AlturaUterina"].ToString();
            @ViewBag.PartoVertical = DatosSisFua.Tables[0].Rows[0]["PartoVertical"].ToString();
            @ViewBag.ControlPuerperio = DatosSisFua.Tables[0].Rows[0]["ControlPuerperio"].ToString();
            @ViewBag.EdadGestacionalRn = DatosSisFua.Tables[0].Rows[0]["EdadGestacionalRn"].ToString();
            @ViewBag.ApgarUno = DatosSisFua.Tables[0].Rows[0]["ApgarUno"].ToString();
            @ViewBag.ApgarCinco = DatosSisFua.Tables[0].Rows[0]["ApgarCinco"].ToString();
            @ViewBag.FuaFechaPartoDia = DatosSisFua.Tables[0].Rows[0]["FuaFechaPartoDia"].ToString();
            @ViewBag.FuaFechaPartoMes = DatosSisFua.Tables[0].Rows[0]["FuaFechaPartoMes"].ToString();
            @ViewBag.FuaFechaPartoAnio = DatosSisFua.Tables[0].Rows[0]["FuaFechaPartoAnio"].ToString();
            @ViewBag.fnacimientoDia = DatosSisFua.Tables[0].Rows[0]["fnacimientoDia"].ToString();
            @ViewBag.fnacimientoMes = DatosSisFua.Tables[0].Rows[0]["fnacimientoMes"].ToString();
            @ViewBag.fnacimientoAnio = DatosSisFua.Tables[0].Rows[0]["fnacimientoAnio"].ToString();
            @ViewBag.Nacimiento1 = DatosSisFua.Tables[0].Rows[0]["Nacimiento1"].ToString();
            @ViewBag.Nacimiento2 = DatosSisFua.Tables[0].Rows[0]["Nacimiento2"].ToString();
            @ViewBag.Nacimiento3 = DatosSisFua.Tables[0].Rows[0]["Nacimiento3"].ToString();
            @ViewBag.FuafechaFallecimientoDia = DatosSisFua.Tables[0].Rows[0]["FuafechaFallecimientoDia"].ToString();
            @ViewBag.FuafechaFallecimientoMes = DatosSisFua.Tables[0].Rows[0]["FuafechaFallecimientoMes"].ToString();
            @ViewBag.FuafechaFallecimientoAnio = DatosSisFua.Tables[0].Rows[0]["FuafechaFallecimientoAnio"].ToString();
            @ViewBag.FuaAtencionFechaDia = DatosSisFua.Tables[0].Rows[0]["FuaAtencionFechaDia"].ToString();
            @ViewBag.FuaAtencionFechaMes = DatosSisFua.Tables[0].Rows[0]["FuaAtencionFechaMes"].ToString();
            @ViewBag.FuaAtencionFechaAnio = DatosSisFua.Tables[0].Rows[0]["FuaAtencionFechaAnio"].ToString();
            @ViewBag.FuaAtencionHora = DatosSisFua.Tables[0].Rows[0]["FuaAtencionHora"].ToString();
            @ViewBag.FuaNrohistoria = DatosSisFua.Tables[0].Rows[0]["FuaNrohistoria"].ToString();
            @ViewBag.FuaEtnia = DatosSisFua.Tables[0].Rows[0]["FuaEtnia"].ToString();
            @ViewBag.FuaUPS = DatosSisFua.Tables[0].Rows[0]["FuaUPS"].ToString();
            @ViewBag.FuaCodigoPrestacion = DatosSisFua.Tables[0].Rows[0]["FuaCodigoPrestacion"].ToString();
            @ViewBag.FuaServicio = DatosSisFua.Tables[0].Rows[0]["FuaServicio"].ToString();
            @ViewBag.FuaCodAutorizacion = DatosSisFua.Tables[0].Rows[0]["FuaCodAutorizacion"].ToString();
            @ViewBag.FuaHospitalizadoFingresoDia = DatosSisFua.Tables[0].Rows[0]["FuaHospitalizadoFingresoDia"].ToString();
            @ViewBag.FuaHospitalizadoFingresoMes = DatosSisFua.Tables[0].Rows[0]["FuaHospitalizadoFingresoMes"].ToString();
            @ViewBag.FuaHospitalizadoFingresoAnio = DatosSisFua.Tables[0].Rows[0]["FuaHospitalizadoFingresoAnio"].ToString();
            @ViewBag.FuaHospitalizadoFaltaDia = DatosSisFua.Tables[0].Rows[0]["FuaHospitalizadoFaltaDia"].ToString();
            @ViewBag.FuaHospitalizadoFaltaMes = DatosSisFua.Tables[0].Rows[0]["FuaHospitalizadoFaltaMes"].ToString();
            @ViewBag.FuaHospitalizadoFaltaAnio = DatosSisFua.Tables[0].Rows[0]["FuaHospitalizadoFaltaAnio"].ToString();
            @ViewBag.FuaFechaCorteAdmDia = DatosSisFua.Tables[0].Rows[0]["FuaFechaCorteAdmDia"].ToString();
            @ViewBag.FuaFechaCorteAdmMes = DatosSisFua.Tables[0].Rows[0]["FuaFechaCorteAdmMes"].ToString();
            @ViewBag.FuaFechaCorteAdmAnio = DatosSisFua.Tables[0].Rows[0]["FuaFechaCorteAdmAnio"].ToString();
            @ViewBag.FuaConceptoPr = DatosSisFua.Tables[0].Rows[0]["FuaConceptoPr"].ToString();
            @ViewBag.FuaConceptoPrAutoriz = DatosSisFua.Tables[0].Rows[0]["FuaConceptoPrAutoriz"].ToString();
            @ViewBag.FuaConceptoPrMonto = DatosSisFua.Tables[0].Rows[0]["FuaConceptoPrMonto"].ToString();
            @ViewBag.FuaDestino = DatosSisFua.Tables[0].Rows[0]["FuaDestino"].ToString();
            @ViewBag.FuaRefDestinoCodigoIpress = DatosSisFua.Tables[0].Rows[0]["FuaRefDestinoCodigoIpress"].ToString();
            @ViewBag.FuaRefDestinoNroHoja = DatosSisFua.Tables[0].Rows[0]["FuaRefDestinoNroHoja"].ToString();
            @ViewBag.FuaRefDestinoNombreIpress = DatosSisFua.Tables[0].Rows[0]["FuaRefDestinoNombreIpress"].ToString();
            @ViewBag.TriajePeso = DatosSisFua.Tables[0].Rows[0]["TriajePeso"].ToString();
            @ViewBag.TriajeTalla = DatosSisFua.Tables[0].Rows[0]["TriajeTalla"].ToString();
            @ViewBag.TriajePresion = DatosSisFua.Tables[0].Rows[0]["TriajePresion"].ToString();
            @ViewBag.TriajePeso = DatosSisFua.Tables[0].Rows[0]["TriajePeso"].ToString();
            @ViewBag.TriajeTalla = DatosSisFua.Tables[0].Rows[0]["TriajeTalla"].ToString();
            @ViewBag.TriajePresion = DatosSisFua.Tables[0].Rows[0]["TriajePresion"].ToString();
            @ViewBag.FuaMedicoDNI = DatosSisFua.Tables[0].Rows[0]["FuaMedicoDNI"].ToString();
            @ViewBag.FuaMedicoDocTipo = DatosSisFua.Tables[0].Rows[0]["FuaMedicoDocTipo"].ToString();
            @ViewBag.FuaMedico = DatosSisFua.Tables[0].Rows[0]["FuaMedico"].ToString();
            @ViewBag.FuaMedicoEspecialidad = DatosSisFua.Tables[0].Rows[0]["FuaMedicoEspecialidad"].ToString();
            @ViewBag.FuaMedicoColegiatura = DatosSisFua.Tables[0].Rows[0]["FuaMedicoColegiatura"].ToString();
            @ViewBag.FuaMedicoRne = DatosSisFua.Tables[0].Rows[0]["FuaMedicoRne"].ToString();
            @ViewBag.FuaMedicoEgresado = DatosSisFua.Tables[0].Rows[0]["FuaMedicoEgresado"].ToString();
            @ViewBag.FuaObservaciones = DatosSisFua.Tables[0].Rows[0]["FuaObservaciones"].ToString();
            ViewBag.Diagnosticos = dtDx;
            ViewBag.Medicamentos = dtMed;
            ViewBag.Insumos = dtIns;
            ViewBag.Procedimientos = dtProc;
            @ViewBag.CodeFirma = DatosSisFua.Tables[0].Rows[0]["code"];
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
            return PartialView("~/Views/Comun/Plantillas/FormatoFua.cshtml");
        }
    }
}
