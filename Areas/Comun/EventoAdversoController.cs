using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using Microsoft.AspNetCore.Http;
using CapaDatos;
using CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;

namespace WebAppMaternidad.Areas.Comun
{
    public class EventoAdversoController: Controller
    {


        [HttpPost]
        public async Task<ActionResult> ListarEventosAdversos(int IdEventoAdverso, int NroHistoriaClinica, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaRegistro)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalEventoAdverso dalEventoAdverso = new DalEventoAdverso();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalEventoAdverso.ListarEventosAdversos(IdEventoAdverso, NroHistoriaClinica, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaRegistro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEventoAdversoById(int IdEventoAdverso)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalEventoAdverso dalEventoAdverso = new DalEventoAdverso();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalEventoAdverso.SeleccionarEventoAdversoById(IdEventoAdverso);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> GuardarEventoAdverso(EventoAdverso eventoAdverso, String lstDiagnosticos)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalEventoAdverso dalEventoAdverso = new DalEventoAdverso();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                dataSet = await dalEventoAdverso.GuardarEventoAdverso(eventoAdverso, lstobjDiagnosticos, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, idUsuario);

                await GenerarHojaAtencion(Int32.Parse(dataSet.Tables[0].Rows[0]["IdEventoAdverso"].ToString()));

                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> InformeEventosAdversos(int IdEventoAdverso) // JDELGADO003-M
        {

            DalEventoAdverso dalEventoAdverso = new DalEventoAdverso();
            DalDiagnostico dalDiagnostico = new DalDiagnostico();

            DataSet eventoAdverso = await dalEventoAdverso.SeleccionarEventoAdversoById(IdEventoAdverso);
            //DataSet notaEnfermeria = await dalNotaEnfermeriaNeo.SeleccionarAtencionesNotaEnfermeriaByIdNotaEnfermeriaNeo(IdNotaEnfermeria);
            //DataSet evolucionSv = await dalNotaEnfermeriaNeo.ListarNotaEnfermeriaNeoEvolucionSvById(IdNotaEnfermeria);
            //DataSet evolucionAt = await dalNotaEnfermeriaNeo.ListarNotaEnfermeriaNeoEvolucionAtById(IdNotaEnfermeria);

            DataSet diagnosticos = await dalDiagnostico.AtencionesDiagnosticosSeleccionarEventosAdversos(IdEventoAdverso, 1);

            //DataSet intervenciones99436 = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, "99436");
            //DataSet intervenciones99460 = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, "99460");
            //DataSet intervenciones99468 = await dalNotaEnfermeriaNeo.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(IdAtencion, "99468");

            ViewBag.NroHistoriaClinica = eventoAdverso.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            ViewBag.idCuentaAtencion = eventoAdverso.Tables[0].Rows[0]["idCuentaAtencion"];
            ViewBag.Paciente = eventoAdverso.Tables[0].Rows[0]["Paciente"];
            ViewBag.Edad = eventoAdverso.Tables[0].Rows[0]["Edad"];
            ViewBag.FechaIngreso = eventoAdverso.Tables[0].Rows[0]["FechaIngresoFormat"];
            ViewBag.FechaNotificacion = eventoAdverso.Tables[0].Rows[0]["FechaNotificacionFormat"];
            ViewBag.HoraEvento = eventoAdverso.Tables[0].Rows[0]["HoraEvento"];
            ViewBag.LugarOcurrencia = eventoAdverso.Tables[0].Rows[0]["LugarOcurrencia"];
            ViewBag.ServicioNotifica = eventoAdverso.Tables[0].Rows[0]["ServicioNotificaDesc"];

            ViewBag.MuerteMaterna = eventoAdverso.Tables[0].Rows[0]["MuerteMaterna"].ToString();
            ViewBag.ObitoFetalIntrahospitalaria = eventoAdverso.Tables[0].Rows[0]["ObitoFetalIntrahospitalaria"].ToString();
            ViewBag.MuerteNeonatal = eventoAdverso.Tables[0].Rows[0]["MuerteNeonatal"].ToString();
            ViewBag.EventoEquipoBiomedico = eventoAdverso.Tables[0].Rows[0]["EventoEquipoBiomedico"].ToString();
            ViewBag.SepsisPostOperatoria = eventoAdverso.Tables[0].Rows[0]["SepsisPostOperatoria"].ToString();
            ViewBag.InfeccionHeridaOperatoria = eventoAdverso.Tables[0].Rows[0]["InfeccionHeridaOperatoria"].ToString();
            ViewBag.Endometria = eventoAdverso.Tables[0].Rows[0]["Endometria"].ToString();
            ViewBag.SepsisNeonatal = eventoAdverso.Tables[0].Rows[0]["SepsisNeonatal"].ToString();
            ViewBag.Flebitis = eventoAdverso.Tables[0].Rows[0]["Flebitis"].ToString();

            ViewBag.CefaloHematoma = eventoAdverso.Tables[0].Rows[0]["CefaloHematoma"].ToString();
            ViewBag.LesionPlexoBraquial = eventoAdverso.Tables[0].Rows[0]["LesionPlexoBraquial"].ToString();
            ViewBag.FracturaClavicula = eventoAdverso.Tables[0].Rows[0]["FracturaClavicula"].ToString();
            ViewBag.AsfixiaNeonatal = eventoAdverso.Tables[0].Rows[0]["AsfixiaNeonatal"].ToString();
            ViewBag.SindromeAspiracionLiquido = eventoAdverso.Tables[0].Rows[0]["SindromeAspiracionLiquido"].ToString();

            ViewBag.ComplicacionesAnestesicas = eventoAdverso.Tables[0].Rows[0]["ComplicacionesAnestesicas"].ToString();
            ViewBag.CuerpoExtranioPostCirugia = eventoAdverso.Tables[0].Rows[0]["CuerpoExtranioPostCirugia"].ToString();
            ViewBag.LesionIntraoperatoriaRecienNacido = eventoAdverso.Tables[0].Rows[0]["LesionIntraoperatoriaRecienNacido"].ToString();
            ViewBag.ComplicacionesIntraPostOperatorio = eventoAdverso.Tables[0].Rows[0]["ComplicacionesIntraPostOperatorio"].ToString();
            ViewBag.PerforacionUterinaPostLegrado = eventoAdverso.Tables[0].Rows[0]["PerforacionUterinaPostLegrado"].ToString();
            ViewBag.EventoAdversoRelacionadoIntubacion = eventoAdverso.Tables[0].Rows[0]["EventoAdversoRelacionadoIntubacion"].ToString();
            ViewBag.CaidaPaciente = eventoAdverso.Tables[0].Rows[0]["CaidaPaciente"].ToString();
            ViewBag.RelacionTransfusional = eventoAdverso.Tables[0].Rows[0]["RelacionTransfusional"].ToString();
            ViewBag.ErrorIdentificacionSexoRecienNacido = eventoAdverso.Tables[0].Rows[0]["ErrorIdentificacionSexoRecienNacido"].ToString();

            ViewBag.ErrorMedicacion = eventoAdverso.Tables[0].Rows[0]["ErrorMedicacion"].ToString();
            ViewBag.ReaccionAdversa = eventoAdverso.Tables[0].Rows[0]["ReaccionAdversa"].ToString();

            ViewBag.DesgarroVaginal = eventoAdverso.Tables[0].Rows[0]["DesgarroVaginal"].ToString();
            ViewBag.Hematomas = eventoAdverso.Tables[0].Rows[0]["Hematomas"].ToString();
            ViewBag.RupturaUterina = eventoAdverso.Tables[0].Rows[0]["RupturaUterina"].ToString();
            ViewBag.DesgarroCervical = eventoAdverso.Tables[0].Rows[0]["DesgarroCervical"].ToString();
            ViewBag.AnemiaAgudaPostProcedimiento = eventoAdverso.Tables[0].Rows[0]["AnemiaAgudaPostProcedimiento"].ToString();
            ViewBag.RetencionGasaVaginalPostParto = eventoAdverso.Tables[0].Rows[0]["RetencionGasaVaginalPostParto"].ToString();
            ViewBag.TraumaObstetricoMaternoOtros = eventoAdverso.Tables[0].Rows[0]["TraumaObstetricoMaternoOtros"].ToString();
            ViewBag.DescripcionTraumaObstetricoMaternoOtros = eventoAdverso.Tables[0].Rows[0]["DescripcionTraumaObstetricoMaternoOtros"].ToString();

            ViewBag.LaceracionEsparadrapo = eventoAdverso.Tables[0].Rows[0]["LaceracionEsparadrapo"].ToString();
            ViewBag.QuemaduraTermicaElectrica = eventoAdverso.Tables[0].Rows[0]["QuemaduraTermicaElectrica"].ToString();
            ViewBag.NeumoniaVentiladorMecanico = eventoAdverso.Tables[0].Rows[0]["NeumoniaVentiladorMecanico"].ToString();
            ViewBag.DehiscenciaEspisorrafia = eventoAdverso.Tables[0].Rows[0]["DehiscenciaEspisorrafia"].ToString();
            ViewBag.ObitoFetalExtrahospitalario = eventoAdverso.Tables[0].Rows[0]["ObitoFetalExtrahospitalario"].ToString();
            ViewBag.InfeccionTractoUrinarioPostCateter = eventoAdverso.Tables[0].Rows[0]["InfeccionTractoUrinarioPostCateter"].ToString();
            ViewBag.ConjuntivitisRecienNacido = eventoAdverso.Tables[0].Rows[0]["ConjuntivitisRecienNacido"].ToString();
            ViewBag.Onfalitis = eventoAdverso.Tables[0].Rows[0]["Onfalitis"].ToString();
            ViewBag.PiodermitisNeonatal = eventoAdverso.Tables[0].Rows[0]["PiodermitisNeonatal"].ToString();
            ViewBag.OtrasFracturasRecienNacido = eventoAdverso.Tables[0].Rows[0]["OtrasFracturasRecienNacido"].ToString();
            ViewBag.OtrosEventosAdversos = eventoAdverso.Tables[0].Rows[0]["OtrosEventosAdversos"].ToString();
            ViewBag.DescripcionOtrosEventosAdversos = eventoAdverso.Tables[0].Rows[0]["DescripcionOtrosEventosAdversos"].ToString();

            ViewBag.DescripcionEventoAdverso = eventoAdverso.Tables[0].Rows[0]["DescripcionEventoAdverso"].ToString();
            ViewBag.EventoAdversoPrevenible = eventoAdverso.Tables[0].Rows[0]["EventoAdversoPrevenible"].ToString();
            ViewBag.ComoPrevenirEventoAdverso = eventoAdverso.Tables[0].Rows[0]["ComoPrevenirEventoAdverso"].ToString();

            ViewBag.Dx = diagnosticos.Tables[0];
            
            return PartialView("~/Views/Comun/Plantillas/InformeEventosAdversos.cshtml");
        }

        public async Task<bool> GenerarHojaAtencion(int IdEventoAdverso)
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

                pageHtml = Url.Action("InformeEventosAdversos", "EventoAdverso", new { area = "Comun", IdEventoAdverso = IdEventoAdverso, usuario }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(0, IdEventoAdverso, 0, "REG-EA", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return false;
            }
        }

    }
}
