using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using CapaDatos;
using QRCoder;
using System.Drawing;
using System.IO;
using System.Text;
using WebAppMaternidad.Areas.Comun;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class NotaEnfermeriaNeoController : Controller
    {
        [HttpPost]
        public async Task<ActionResult> ListarAtencionesNotaEnfermeria(
                int? IdCuentaAtencion, string NroHistoria, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno,
                string Nombres, DateTime? FechaInicio, DateTime? FechaFin, int? IdServicio, int? NroEvaluacion)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.ListarAtencionesNotaEnfermeria(IdCuentaAtencion, NroHistoria, NroDocumento, ApellidoPaterno, ApellidoMaterno,
                Nombres, FechaInicio, FechaFin, IdServicio, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GuardarNotaEnfermeriaNeo(NotaEnfermeriaNeo notaEnfermeriaNeo, String evolucionSv, String evolucionAt, String lstDiagnosticos)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            var settings = new JsonSerializerSettings
            {
                DateFormatString = "dd/MM/yyyy HH:mm"
            };

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<DiagnosticosNanda>>(lstDiagnosticos);
                var lstObjEvolucionSv = JsonConvert.DeserializeObject<List<NotaEnfermeriaNeoEvolucionSv>>(evolucionSv, settings);
                var lstObjEvolucionAt = JsonConvert.DeserializeObject<List<NotaEnfermeriaNeoEvolucionAt>>(evolucionAt, settings);

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalNotaEnfermeriaNeo.GuardarNotaEnfermeriaNeo(notaEnfermeriaNeo, lstObjEvolucionSv, lstObjEvolucionAt, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, lstobjDiagnosticos, idUsuario);

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarNotaEnfermeriaNeoEvolucionSvById(int? IdAtencion)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.ListarNotaEnfermeriaNeoEvolucionSvById(IdAtencion);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarNotaEnfermeriaNeoEvolucionAtById(int? IdAtencion)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.ListarNotaEnfermeriaNeoEvolucionAtById(IdAtencion);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarNotaEnfermeriaNeoEvaluacion(int? IdAtencion, int? IdNotaEnfermeria, int? NroEvaluacion, DateTime? FechaRegistro, string HoraRegistro, string EvaluacionCuidadoRn, string EvaluacionCuidadoRnFactorRiesgo, int? IdEnfermeraAtiende)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.CrearModificarNotaEnfermeriaNeoEvaluacion(IdAtencion, IdNotaEnfermeria, NroEvaluacion, FechaRegistro, HoraRegistro, EvaluacionCuidadoRn, EvaluacionCuidadoRnFactorRiesgo, IdEnfermeraAtiende);

                await GenerarHojaAtencion(Int32.Parse(ds.Tables[0].Rows[0]["IdCuentaAtencion"].ToString()), Int32.Parse(ds.Tables[0].Rows[0]["IdAtencion"].ToString()),
                    Int32.Parse(ds.Tables[0].Rows[0]["IdNotaEnfermeria"].ToString()), Int32.Parse(ds.Tables[0].Rows[0]["NroEvaluacion"].ToString()), 1);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarNotaEnfermeriaNeoEvaluacion(int? IdAtencion, int? IdNotaEnfermeria, int NroEvaluacion)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.SeleccionarNotaEnfermeriaNeoEvaluacion(IdAtencion, IdNotaEnfermeria, NroEvaluacion);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarIntervencionesEnfermeriaByCpt(string cpt)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByCpt(cpt);
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        public async Task<ActionResult> ListarEmpleadosNotaEnfermeria()
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.ListarEmpleadosNotaEnfermeria();
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        public async Task<ActionResult> ListarOpcionesNotaEnfermeria()
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.ListarOpcionesNotaEnfermeria();
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        public async Task<ActionResult> ListarDiagnosticosNANDA()
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                DataSet ds = await dalNotaEnfermeriaNeo.ListarDiagnosticosNANDA();
                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GuardarIntervencionesNotaEnfermeriaNeo(int IdAtencion, String lstIntervenciones)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstobjIntervenciones = JsonConvert.DeserializeObject<List<IntervencionesEnfermeria>>(lstIntervenciones);

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalNotaEnfermeriaNeo.GuardarIntervencionesNotaEnfermeriaNeo(IdAtencion, lstobjIntervenciones);

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarAtencionesNotaEnfermeriaByIdNotaEnfermeriaNeo(int IdNotaEnfermeria)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalNotaEnfermeriaNeo.SeleccionarAtencionesNotaEnfermeriaByIdNotaEnfermeriaNeo(IdNotaEnfermeria);

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(int IdAtencion, string cpt)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, cpt);

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarDiagnosticosNandaByIdAtencion(int IdAtencion)
        {
            int nRpta = 0;
            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DataSet ds = await dalNotaEnfermeriaNeo.SeleccionarDiagnosticosNandaByIdAtencion(IdAtencion);

                return Json(new { session = true, estado = true, msg = "", data = ds });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        public async Task<ActionResult> InformeNotaEnfermeriaNeo(int IdNotaEnfermeria, int NroEvaluacion, int IdAtencion, string usuario) // JDELGADO003-M
        {

            DalNotaEnfermeriaNeo dalNotaEnfermeriaNeo = new DalNotaEnfermeriaNeo();
            DalDiagnostico dalDiagnostico = new DalDiagnostico();

            DataSet notaEnfermeriaEvaluacion = await dalNotaEnfermeriaNeo.SeleccionarNotaEnfermeriaNeoEvaluacion(IdAtencion,  IdNotaEnfermeria, NroEvaluacion);
            DataSet notaEnfermeria = await dalNotaEnfermeriaNeo.SeleccionarAtencionesNotaEnfermeriaByIdNotaEnfermeriaNeo(IdNotaEnfermeria);
            DataSet evolucionSv = await dalNotaEnfermeriaNeo.ListarNotaEnfermeriaNeoEvolucionSvById(IdAtencion);
            DataSet evolucionAt = await dalNotaEnfermeriaNeo.ListarNotaEnfermeriaNeoEvolucionAtById(IdAtencion);

            DataSet diagnosticos = await dalNotaEnfermeriaNeo.SeleccionarDiagnosticosNandaByIdAtencion(IdAtencion);

            DataSet intervenciones99436 = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, "99436");
            DataSet intervenciones99460 = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, "99460");
            DataSet intervenciones99468 = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, "99468");

            ViewBag.FechaRegistro = notaEnfermeriaEvaluacion.Tables[0].Rows[0]["FechaRegistro"].ToString().Substring(0, 10);
            ViewBag.HoraRegistro = notaEnfermeriaEvaluacion.Tables[0].Rows[0]["HoraRegistro"];
            ViewBag.EvaluacionCuidadoRn = notaEnfermeriaEvaluacion.Tables[0].Rows[0]["EvaluacionCuidadoRn"];
            ViewBag.EvaluacionCuidadoRnFactorRiesgo = notaEnfermeriaEvaluacion.Tables[0].Rows[0]["EvaluacionCuidadoRnFactorRiesgo"];
            ViewBag.Medico = notaEnfermeriaEvaluacion.Tables[0].Rows[0]["enfermera"];

            ViewBag.FechaNacimiento = notaEnfermeria.Tables[0].Rows[0]["FechaNacimiento"];
            ViewBag.HoraNacimiento = notaEnfermeria.Tables[0].Rows[0]["HoraNacimiento"];
            ViewBag.Sexo = notaEnfermeria.Tables[0].Rows[0]["Sexo"];
            ViewBag.Apgar5 = notaEnfermeria.Tables[0].Rows[0]["Apgar5"];
            ViewBag.EdadGestacional = notaEnfermeria.Tables[0].Rows[0]["EdadGestacional"];
            ViewBag.EdadDiaGestacional = notaEnfermeria.Tables[0].Rows[0]["EdadDiaGestacional"];
            ViewBag.ManiobraDuranteParto = notaEnfermeria.Tables[0].Rows[0]["ManiobraDuranteParto"];
            ViewBag.ReflejosOpcSeleccionadas = notaEnfermeria.Tables[0].Rows[0]["ReflejosOpcSeleccionadas"];

            ViewBag.Peso = notaEnfermeria.Tables[0].Rows[0]["Peso"];
            ViewBag.Talla = notaEnfermeria.Tables[0].Rows[0]["Talla"];
            ViewBag.PerimetroCefalico = notaEnfermeria.Tables[0].Rows[0]["PerimetroCefalico"];
            ViewBag.PerimetroToraxico = notaEnfermeria.Tables[0].Rows[0]["PerimetroToraxico"];

            ViewBag.PielColor = notaEnfermeria.Tables[0].Rows[0]["PielColor"].ToString();
            ViewBag.PielColorEspecificar = notaEnfermeria.Tables[0].Rows[0]["PielColorEspecificar"].ToString();

            ViewBag.Fontanela = notaEnfermeria.Tables[0].Rows[0]["Fontanela"].ToString();
            ViewBag.FontanelaEspecificar = notaEnfermeria.Tables[0].Rows[0]["FontanelaEspecificar"].ToString();

            ViewBag.Suturas = notaEnfermeria.Tables[0].Rows[0]["Suturas"].ToString();
            ViewBag.SuturasEspecificar = notaEnfermeria.Tables[0].Rows[0]["SuturasEspecificar"].ToString();

            ViewBag.Orejas = notaEnfermeria.Tables[0].Rows[0]["Orejas"].ToString();
            ViewBag.OrejasEspecificar = notaEnfermeria.Tables[0].Rows[0]["OrejasEspecificar"].ToString();
            ViewBag.ImplantacionUbicacion = notaEnfermeria.Tables[0].Rows[0]["ImplantacionUbicacion"].ToString();

            ViewBag.Nariz = notaEnfermeria.Tables[0].Rows[0]["Nariz"].ToString();
            ViewBag.NarizEspecificar = notaEnfermeria.Tables[0].Rows[0]["NarizEspecificar"].ToString();

            ViewBag.Boca = notaEnfermeria.Tables[0].Rows[0]["Boca"].ToString();
            ViewBag.BocaEspecificar = notaEnfermeria.Tables[0].Rows[0]["BocaEspecificar"].ToString();

            ViewBag.Cuello = notaEnfermeria.Tables[0].Rows[0]["Cuello"].ToString();
            ViewBag.CuelloEspecificar = notaEnfermeria.Tables[0].Rows[0]["CuelloEspecificar"].ToString();

            ViewBag.Torax = notaEnfermeria.Tables[0].Rows[0]["Torax"].ToString();

            ViewBag.CordonUmbilical = notaEnfermeria.Tables[0].Rows[0]["CordonUmbilical"].ToString();
            ViewBag.CaracteristicasAbdomen = notaEnfermeria.Tables[0].Rows[0]["CaracteristicasAbdomen"].ToString();
            ViewBag.CaracteristicasAbdomenEspecificar = notaEnfermeria.Tables[0].Rows[0]["CaracteristicasAbdomenEspecificar"].ToString();

            ViewBag.GenitoUrinario = notaEnfermeria.Tables[0].Rows[0]["GenitoUrinario"].ToString();
            ViewBag.GenitoUrinarioObservacion = notaEnfermeria.Tables[0].Rows[0]["GenitoUrinarioObservacion"].ToString();

            ViewBag.Eliminacion = notaEnfermeria.Tables[0].Rows[0]["Eliminacion"].ToString();
            ViewBag.EliminacionEspecificar = notaEnfermeria.Tables[0].Rows[0]["EliminacionEspecificar"].ToString();

            ViewBag.ColumnaVertebral = notaEnfermeria.Tables[0].Rows[0]["ColumnaVertebral"].ToString();
            ViewBag.ColumnaVertebralEspecificar = notaEnfermeria.Tables[0].Rows[0]["ColumnaVertebralEspecificar"].ToString();

            ViewBag.Extremidades = notaEnfermeria.Tables[0].Rows[0]["Extremidades"].ToString();

            ViewBag.TonoMuscular = notaEnfermeria.Tables[0].Rows[0]["TonoMuscular"].ToString();
            ViewBag.TonoMuscularEspecificar = notaEnfermeria.Tables[0].Rows[0]["TonoMuscularEspecificar"].ToString();

            ViewBag.Cadera = notaEnfermeria.Tables[0].Rows[0]["Cadera"].ToString();

            ViewBag.ValoracionNeur = notaEnfermeria.Tables[0].Rows[0]["ValoracionNeur"].ToString();

            ViewBag.Reflejo = notaEnfermeria.Tables[0].Rows[0]["Reflejo"].ToString();

            ViewBag.ObservacionExamenFisico = notaEnfermeria.Tables[0].Rows[0]["ObservacionExamenFisico"].ToString();

            ViewBag.Dx = diagnosticos.Tables[0];
            ViewBag.EvolucionSv = evolucionSv.Tables[0];
            ViewBag.EvolucionAt = evolucionAt.Tables[0];

            ViewBag.Intervenciones99436 = intervenciones99436.Tables[0];
            ViewBag.Intervenciones99460 = intervenciones99460.Tables[0];
            ViewBag.Intervenciones99468 = intervenciones99468.Tables[0];
            ViewBag.NroEvaluacion = NroEvaluacion;

            if (evolucionSv.Tables.Count > 0 && evolucionSv.Tables[0].Rows.Count > 0)
            {
                ViewBag.Temperatura = evolucionSv.Tables[0].Rows[evolucionSv.Tables[0].Rows.Count - 1]["temperatura"];
                ViewBag.FrecuenciaCardiaca = evolucionSv.Tables[0].Rows[evolucionSv.Tables[0].Rows.Count - 1]["frecuenciaCardiaca"];
                ViewBag.FrecuenciaRespiratoria = evolucionSv.Tables[0].Rows[evolucionSv.Tables[0].Rows.Count - 1]["frecuenciaRespiratoria"];
                ViewBag.PresionSiastolica = evolucionSv.Tables[0].Rows[evolucionSv.Tables[0].Rows.Count - 1]["presionSiastolica"];
                ViewBag.PresionDiastolica = evolucionSv.Tables[0].Rows[evolucionSv.Tables[0].Rows.Count - 1]["presionDiastolica"];
                ViewBag.Saturacion = evolucionSv.Tables[0].Rows[evolucionSv.Tables[0].Rows.Count - 1]["saturacion"];
            }




            return PartialView("~/Views/Hospitalizacion/Plantillas/InformeNotaEnfermeriaNeo.cshtml");
        }

        public async Task<bool> GenerarHojaAtencion(int idCuentaAtencion, int idAtencion, int idNotaEnfermeria, int nroEvaluacion, int tipoFormato)
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

                pageHtml = Url.Action("InformeNotaEnfermeriaNeo", "NotaEnfermeriaNeo", new { area = "Hospitalizacion", IdNotaEnfermeria = idNotaEnfermeria, NroEvaluacion = nroEvaluacion, IdAtencion = idAtencion, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, nroEvaluacion, 0, "NE-NEO", nroEvaluacion, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
