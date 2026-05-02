using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System;
using System.Data;
using System.IO;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Imagenes
{
    public class CitasProcedimientosController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarCitasProcedimientos(int idMovimiento, string nombres)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { sesion = false });
            }

            DataSet ds;
            DalCitasProcedimientos dal = new DalCitasProcedimientos();

            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.ListarCitasProcedimientos(idMovimiento, nombres);
            return Json(new { respuesta = ds, sesion = true });
        }


        [HttpPost]
        public async Task<ActionResult> ListarCuposCitasProcedimientos(int idProgramacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { sesion = false });
            }

            DataSet ds;
            DalCitasProcedimientos dal = new DalCitasProcedimientos();

            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.ListarCuposCitasProcedimientos(idProgramacion);
            return Json(new { respuesta = ds, sesion = true });
        }


        [HttpPost]
        public async Task<ActionResult> GuardarCitaProcedimientoBloqueado(int idProgramacion, string horaInicio, string horaFin, int accion, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasProcedimientos dal = new DalCitasProcedimientos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.GuardarCitaProcedimientoBoqueada(idProgramacion, horaInicio, horaFin, idUsuario, accion, idListBar);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> LimpiarCitaProcedimientoBloqueado(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasProcedimientos dal = new DalCitasProcedimientos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.LimpiarCitaProcedimientoBoqueada(idUsuario, idListBar);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarCitaProcedimiento(int idCita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { sesion = false });
            }

            DataSet ds;
            DalCitasProcedimientos dal = new DalCitasProcedimientos();

            //int idMedico;
            //idMedico = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await dal.SeleccionarCitaProcedimiento(idCita);
            return Json(new { respuesta = ds, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarCitaProcedimiento(int idProgramacion, int idMovimiento, string horaInicio, string horaFin, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasProcedimientos dal = new DalCitasProcedimientos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.GuardarCitaProcedimiento(idProgramacion, idMovimiento, horaInicio, horaFin, idUsuario, idListBar);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> EliminarCitaProcedimiento(int idCita, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;

            DalCitasProcedimientos dal = new DalCitasProcedimientos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            ds = await dal.EliminarCitaProcedimiento(idCita, idUsuario, idListBar);

            return Json(new { lsResultado = ds, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> GenerarTicketCitaProcedimiento(int idCita, int nroCupo)
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
                pageHtml = Url.Action("TicketCitaProcedimiento", "CitasProcedimientos", new { idCita, nroCupo, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tipoDocumento = "Ticket";
                pdf.pageHtml = pageHtml;

                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();

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

        public async Task<ActionResult> TicketCitaProcedimiento(int idCita, int nroCupo, string usuario)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalCitasProcedimientos dalCitasAdmision = new DalCitasProcedimientos();

            DataSet lsParametros = new DataSet();
            DataSet lsCitas = await dalCitasAdmision.SeleccionarCitaProcedimiento(idCita);

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);

            DateTime now = DateTime.Now;

            @ViewBag.NroCupo = nroCupo;
            @ViewBag.NombreInstitucion = nombre.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.DireccionInstitucion = direccion.Tables[0].Rows[0]["valorTexto"].ToString().ToUpper();
            @ViewBag.TelefonoInstitucion = telefono.Tables[0].Rows[0]["valorTexto"].ToString();
            @ViewBag.FuenteFinanciamiento = lsCitas.Tables[0].Rows[0]["FuenteFinanciamiento"];

            @ViewBag.FechaCita = lsCitas.Tables[0].Rows[0]["FechaCita"];
            @ViewBag.HoraCita = lsCitas.Tables[0].Rows[0]["HoraInicio"];
            @ViewBag.TurnoCita = lsCitas.Tables[0].Rows[0]["Turno"];
            @ViewBag.ServicioCita = lsCitas.Tables[0].Rows[0]["Servicio"];
            @ViewBag.TipoProfesionalSalud = lsCitas.Tables[0].Rows[0]["TipoProfesional"];
            @ViewBag.ProfesionalSalud = lsCitas.Tables[0].Rows[0]["Medico"];
            @ViewBag.IdMovimiento = lsCitas.Tables[0].Rows[0]["IdMovimiento"];
            @ViewBag.NroHistoria = lsCitas.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.PacienteNombres = lsCitas.Tables[0].Rows[0]["Paciente"];
            @ViewBag.NroCuenta = lsCitas.Tables[0].Rows[0]["IdCuentaAtencion"];
            @ViewBag.FechaSolicitud = lsCitas.Tables[0].Rows[0]["FechaSolicitudCita"].ToString();
            @ViewBag.HoraSolicitud = lsCitas.Tables[0].Rows[0]["HoraSolicitud"].ToString();

            @ViewBag.Procedimiento = lsCitas.Tables[0].Rows[0]["Procedimiento"].ToString();

            @ViewBag.FechaImpresion = now;
            @ViewBag.Usuario = usuario;


            return PartialView("~/Views/Imagenologia/Plantillas/CitasProcedimientos/TicketCitaProcedimiento.cshtml");
        }


    }
}
