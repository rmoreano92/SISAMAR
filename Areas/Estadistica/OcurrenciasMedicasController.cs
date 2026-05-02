using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Estadistica
{
    public class OcurrenciasMedicasController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> ListarOcurrenciasMedicas(int nroFolio, string fechaOcurrencia, int estadoOcurrencia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalOcurrenciaMedica daoOcurrencia = new DalOcurrenciaMedica();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoOcurrencia.ListarOcurrenciasMedicas(nroFolio, fechaOcurrencia, estadoOcurrencia, idUsuario);

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarOcurrenciaMedica(int idOcurrenciaMedica)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalOcurrenciaMedica daoOcurrencia = new DalOcurrenciaMedica();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoOcurrencia.SeleccionarOcurrenciaMedica(idOcurrenciaMedica, idUsuario);            

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMedicoGuardiaOcurrencia(int idOcurrenciaMedica)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalOcurrenciaMedica daoOcurrencia = new DalOcurrenciaMedica();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoOcurrencia.SeleccionarMedicosGuardiaOcurrencia(idOcurrenciaMedica, idUsuario);

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarCantidadAtencionesGuardiaOcurrencia(string fecha, int idTurno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalOcurrenciaMedica daoOcurrencia = new DalOcurrenciaMedica();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoOcurrencia.SeleccionarCantidadAtencionesGuardiaOcurrencia(fecha, idTurno);

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarOcurrenciaMedica(OcurrenciaMedica obj, String lstMedicos)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalOcurrenciaMedica daoOcurrencia = new DalOcurrenciaMedica();
            DalTriaje daoTriaje = new DalTriaje();
            Boolean informe;

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjMedicos = JsonConvert.DeserializeObject<List<MedicosOcurrencia>>(lstMedicos);
                ds = await daoOcurrencia.GuardarOcurrenciaMedica(obj, lstobjMedicos, idUsuario);
                informe = await GenerarHojaOcurrenciaMedica(Convert.ToInt32(ds.Tables[0].Rows[0]["IdOcurrenciaMedica"].ToString()));

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarOcurrenciaMedica): " + ex });
            }

        }

        [HttpPost]
        public async Task<Boolean> GenerarHojaOcurrenciaMedica(int idRegistro)
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
                pageHtml = Url.Action("InformeOcurrenciaMedica", "OcurrenciasMedicas", new { area = "Estadistica", idRegistro, usuario, idUsuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(0, idRegistro, 0, "GUARDIA", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeOcurrenciaMedica(int idRegistro, string usuario, int idUsuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DataSet DatosRegistro;
            DataSet DatosMedicos;
            
            DalOcurrenciaMedica daoOcurrencia = new DalOcurrenciaMedica();
            

            @ViewBag.FechaDia = DateTime.Now.ToString("dd/MM/yyyy");
            @ViewBag.FechaHora = DateTime.Now.ToString("hh:mm");
            @ViewBag.Usuario = usuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


            DatosRegistro = await daoOcurrencia.SeleccionarOcurrenciaMedica(idRegistro, idUsuario);
            DatosMedicos = await daoOcurrencia.SeleccionarMedicosGuardiaOcurrencia(idRegistro, idUsuario);
            DataTable dtMedicos = DatosMedicos.Tables[0];

            @ViewBag.NroFolio = DatosRegistro.Tables[0].Rows[0]["NroFolio"].ToString();
            @ViewBag.FechaOcurrencia = DatosRegistro.Tables[0].Rows[0]["FechaOcurrencia"].ToString();
            @ViewBag.Turno = DatosRegistro.Tables[0].Rows[0]["Turno"].ToString();
            @ViewBag.JefeGuardiaSaliente = DatosRegistro.Tables[0].Rows[0]["JefeGuardia"].ToString();
            @ViewBag.JefeGuardiaEntrante = DatosRegistro.Tables[0].Rows[0]["JefeGuardiaEntrante"].ToString();
            @ViewBag.EstadoOcurrencia = DatosRegistro.Tables[0].Rows[0]["dEstadoOcurrencia"].ToString();
            
            @ViewBag.Medicos = dtMedicos;

            @ViewBag.MuertesMaternas = DatosRegistro.Tables[0].Rows[0]["MuertesMaternas"].ToString();
            @ViewBag.DMuertesMaternas = DatosRegistro.Tables[0].Rows[0]["DMuertesMaternas"].ToString();
            @ViewBag.EventosAdversos = DatosRegistro.Tables[0].Rows[0]["EventosAdversos"].ToString();
            @ViewBag.DEventosAdversos = DatosRegistro.Tables[0].Rows[0]["DEventosAdversos"].ToString();
            @ViewBag.PacientesCriticos = DatosRegistro.Tables[0].Rows[0]["PacientesCriticos"].ToString();
            @ViewBag.DPacientesCriticos = DatosRegistro.Tables[0].Rows[0]["DPacientesCriticos"].ToString();
            @ViewBag.ReintervencionesQx = DatosRegistro.Tables[0].Rows[0]["ReintervencionesQx"].ToString();
            @ViewBag.DReintervencionesQx = DatosRegistro.Tables[0].Rows[0]["DReintervencionesQx"].ToString();
            @ViewBag.CasosMedicoLegal = DatosRegistro.Tables[0].Rows[0]["CasosMedicoLegal"].ToString();
            @ViewBag.DCasosMedicoLegal = DatosRegistro.Tables[0].Rows[0]["DCasosMedicoLegal"].ToString();
            
            @ViewBag.AtEmerObstetricas = DatosRegistro.Tables[0].Rows[0]["AtEmerObstetricas"].ToString();
            @ViewBag.AtEmerGiencologicas = DatosRegistro.Tables[0].Rows[0]["AtEmerGinecologicas"].ToString();
            @ViewBag.AtEmerPediatricas = DatosRegistro.Tables[0].Rows[0]["AtEmerPediatricas"].ToString();
            @ViewBag.AtEmerObservacion = DatosRegistro.Tables[0].Rows[0]["AtEmerObservacion"].ToString();
            @ViewBag.AtEmerTraumaShock = DatosRegistro.Tables[0].Rows[0]["AtEmerTraumaShock"].ToString();
            @ViewBag.AtEmerEcografias = DatosRegistro.Tables[0].Rows[0]["AtEmerEcografias"].ToString();
            @ViewBag.AtEmerCesareas = DatosRegistro.Tables[0].Rows[0]["AtEmerCesareas"].ToString();
            @ViewBag.AtEmerLaparatomias = DatosRegistro.Tables[0].Rows[0]["AtEmerLaparatomias"].ToString();
            @ViewBag.AtEmerLaparascopias = DatosRegistro.Tables[0].Rows[0]["AtEmerLaparascopias"].ToString();
            @ViewBag.AtEmerLegrados = DatosRegistro.Tables[0].Rows[0]["AtEmerLegrados"].ToString();
            @ViewBag.AtEmerPartos = DatosRegistro.Tables[0].Rows[0]["AtEmerPartos"].ToString();
            @ViewBag.AtEmerTocolisis = DatosRegistro.Tables[0].Rows[0]["AtEmerTocolisis"].ToString();
            
            @ViewBag.AtCoCesareas = DatosRegistro.Tables[0].Rows[0]["AtCoCesareas"].ToString();
            @ViewBag.AtCoLaparatomias = DatosRegistro.Tables[0].Rows[0]["AtCoLapratomias"].ToString();
            @ViewBag.AtCoLaparascopias = DatosRegistro.Tables[0].Rows[0]["AtCoLaparascopias"].ToString();
            @ViewBag.AtCoLegrados = DatosRegistro.Tables[0].Rows[0]["AtCoLegrados"].ToString();
            @ViewBag.AtCoPartos = DatosRegistro.Tables[0].Rows[0]["AtCoPartos"].ToString();
            @ViewBag.AtCoTocolisis = DatosRegistro.Tables[0].Rows[0]["AtCoTocolisis"].ToString();

            @ViewBag.AtPerCesareas = DatosRegistro.Tables[0].Rows[0]["AtPerCesareas"].ToString();
            @ViewBag.AtPerLaparatomias = DatosRegistro.Tables[0].Rows[0]["AtPerLaparatomias"].ToString();
            @ViewBag.AtPerLaparascopias = DatosRegistro.Tables[0].Rows[0]["AtPerLaparascopias"].ToString();
            @ViewBag.AtPerLegrados = DatosRegistro.Tables[0].Rows[0]["AtPerLegrados"].ToString();
            @ViewBag.AtPerPartos = DatosRegistro.Tables[0].Rows[0]["AtPerPartos"].ToString();
            @ViewBag.AtPerTocolisis = DatosRegistro.Tables[0].Rows[0]["AtPerTocolisis"].ToString();

            @ViewBag.AtEmerCesareasPend = DatosRegistro.Tables[0].Rows[0]["AtEmerCesareasPend"].ToString();
            @ViewBag.AtEmerAmeuPend = DatosRegistro.Tables[0].Rows[0]["AtEmerAmeuPend"].ToString();
            @ViewBag.AtEmerEcografiasPend = DatosRegistro.Tables[0].Rows[0]["AtEmerEcografiasPend"].ToString();
            @ViewBag.AtEmerLaparascopiasPend = DatosRegistro.Tables[0].Rows[0]["AtEmerLaparascopiasPend"].ToString();
            @ViewBag.AtEmerLaparatomiasPend  = DatosRegistro.Tables[0].Rows[0]["AtEmerLaparatomiasPend"].ToString();
            @ViewBag.AtEmerReferidosPorLlegarPend = DatosRegistro.Tables[0].Rows[0]["AtEmerReferidosPorLlegarPend"].ToString();
            @ViewBag.AtCoCesareasPend = DatosRegistro.Tables[0].Rows[0]["AtCoCesareasPend"].ToString();
            @ViewBag.AtCoAmeuPend = DatosRegistro.Tables[0].Rows[0]["AtCoAmeuPend"].ToString();
            @ViewBag.AtCoEcografiasPend = DatosRegistro.Tables[0].Rows[0]["AtCoEcografiasPend"].ToString();
            @ViewBag.AtCoLaparascopiasPend = DatosRegistro.Tables[0].Rows[0]["AtCoLaparascopiasPend"].ToString();
            @ViewBag.AtCoLaparatomiasPend = DatosRegistro.Tables[0].Rows[0]["AtCoLaparatomiasPend"].ToString();
            @ViewBag.AtCoReferidosPorLlegarPend = DatosRegistro.Tables[0].Rows[0]["AtCoReferidosPorLlegarPend"].ToString();
            @ViewBag.AtPerCesareasPend = DatosRegistro.Tables[0].Rows[0]["AtPerCesareasPend"].ToString();
            @ViewBag.AtPerAmeuPend = DatosRegistro.Tables[0].Rows[0]["AtPerAmeuPend"].ToString();
            @ViewBag.AtPerEcografiasPend = DatosRegistro.Tables[0].Rows[0]["AtPerEcografiasPend"].ToString();
            @ViewBag.AtPerLaparascopiasPend = DatosRegistro.Tables[0].Rows[0]["AtPerLaparascopiasPend"].ToString();
            @ViewBag.AtPerLaparatomiasPend = DatosRegistro.Tables[0].Rows[0]["AtPerLaparatomiasPend"].ToString();
            @ViewBag.AtPerReferidosPorLlegarPend = DatosRegistro.Tables[0].Rows[0]["AtPerReferidosPorLlegarPend"].ToString();

            @ViewBag.PacientesUCI = DatosRegistro.Tables[0].Rows[0]["PacientesUCI"].ToString();
            @ViewBag.DPacientesUCI = DatosRegistro.Tables[0].Rows[0]["DPacientesUCI"].ToString();

            @ViewBag.Ocurrencias = DatosRegistro.Tables[0].Rows[0]["Ocurrencias"].ToString();
            
            @ViewBag.CodeFirma = DatosRegistro.Tables[0].Rows[0]["code"].ToString();

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

            return PartialView("~/Views/Estadistica/Plantillas/InformeOcurrenciaMedica.cshtml");
        }

    }
}
