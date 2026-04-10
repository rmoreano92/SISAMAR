using CapaDatos;
using CapaEntidades;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;

namespace WebAppMaternidad.Areas.Laboratorio
{
    public class PatologiaClinicaController : Controller
    {
        //[HttpPost]
        //public async Task<ActionResult> FactOrdenServicioPorFechasLabPaciente(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idPuntoCarga)
        //{

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }
        //    DataSet dataSet = null;
        //    DalLaboratorio dalLaboratorio = new DalLaboratorio();

        //    string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
        //    string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
        //    try
        //    {
        //        dataSet = await dalLaboratorio.FactOrdenServicioPorFechasLabPaciente(idMovimiento, idCuenta, historia, nombres, fechaInicio, fechaFin, idPuntoCarga);
        //        return Json(new { session = true, estado = true, msg = "", data = dataSet });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
        //    }

        //}

        [HttpPost]
        public async Task<ActionResult> FactOrdenServicioPorIdMovimiento(int idMovimiento, int idPuntoCarga)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.FactOrdenServicioPorIdMovimiento(idMovimiento, idPuntoCarga);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                dataSet = await dalLaboratorio.LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(idOrden, idPuntoCarga, idMovimiento, idUsuario);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarExamenesConResultadoPorFecha(DateTime fechaInicio, DateTime fechaFin)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.ListarExamenesConResultadoPorFecha(fechaInicio, fechaFin);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpPost]
        public async Task<ActionResult> LabMovimientoLaboratorioSeleccionarXidOrden(int idOrden)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalLaboratorio dalLaboratorio = new DalLaboratorio();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarXidOrden(idOrden);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }



        public async Task<ActionResult> rptResultadoPorItem(int idOrden, int idMovimiento, int idProducto)
        {
            DalLaboratorio dalLaboratorio = new DalLaboratorio();
            DalPaciente dalPaciente = new DalPaciente();
            DalAtenciones dalAtenciones = new DalAtenciones();

            DataSet ordenServicio = await dalLaboratorio.FactOrdenServicioSeleccionarPorIdOrden(idOrden);
            DataSet labMovimientoLaboratorio = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarXidOrden(idOrden);
            DataSet labResultadoLaboratorio = await dalLaboratorio.RptResulLaboratoriobyMGP(idOrden, idProducto);
            DataSet labImgLabObservaciones = await dalLaboratorio.ListarImgLabObservaciones(idOrden, idProducto, idMovimiento);
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

            ViewBag.idMovimiento = idMovimiento;
            ViewBag.OrdenaPrueba = labMovimientoLaboratorio.Tables[0].Rows[0]["OrdenaPrueba"];
            ViewBag.Paciente = labMovimientoLaboratorio.Tables[0].Rows[0]["Paciente"];
            ViewBag.NroHistoriaClinica = paciente.Tables[0].Rows[0]["NroHistoriaClinica"];
            //ViewBag.Edad = paciente.Tables[0].Rows[0]["Paciente"];
            ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");
            ViewBag.Observaciones = Observaciones;
            ViewBag.Conclusiones = Conclusiones;
            ViewBag.Servicio = ordenServicio.Tables[0].Rows[0]["dservicio"];
            ViewBag.Edad = atenciones.Tables[0].Rows[0]["edadPaciente"];

            foreach (DataRow row in labResultadoLaboratorio.Tables[0].Rows)
            {
                ViewBag.Examen = row["NombreCorto"];
                ViewBag.Recepcionista = row["usuarioRec"];
                ViewBag.FechaRec = row["fechaRec"];
                ViewBag.FechaRes = row["Fecha"];
                ViewBag.TipoEmpleado = row["TipoEmpleado"];
                ViewBag.Empleado = row["realiza_prueba"];

                if (!grupos.Contains(row["Grupo"].ToString()))
                {
                    grupos.Add(row["Grupo"].ToString());
                }
            }

            ViewBag.Grupos = grupos;
            ViewBag.ResultadosLaboratorio = labResultadoLaboratorio.Tables[0];

            Console.WriteLine(grupos);


            return PartialView("~/Views/Laboratorio/Plantillas/ResultadosPorItem.cshtml");

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

                pageHtml = Url.Action("rptResultadoPorItem", "PatologiaClinica", new { area = "Laboratorio", idOrden, idMovimiento, idProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idMovimiento, idProducto, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        ///////////////////////////////////ESTA VERSION ES PARA GENERAR LOS FORMATOS DESDE AFUERA (TEMPORALMENTE)////////////////////////////////////////////////////////////
        public async Task<bool> GenerarFormatoResultadosPorItemV2(int idCuentaAtencion, int idOrden, int idMovimiento, int idProducto, string tipoFormato)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = 0;

                stringHtml = null;
                pageHtml = null;

                pageHtml = Url.Action("rptResultadoPorItem", "PatologiaClinica", new { area = "Laboratorio", idOrden, idMovimiento, idProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idMovimiento, idProducto, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> GenerarFormatoResultadosV2(int idOrden, int idPuntoCarga, int idMovimiento, string tipoFormato)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = 0;

                stringHtml = null;
                pageHtml = null;

                pageHtml = Url.Action("rptResultado", "PatologiaClinica", new { area = "Laboratorio", idOrden, idPuntoCarga, idMovimiento }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(0, idMovimiento, 0, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);
                //resp = true;
                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        public async Task<ActionResult> rptResultado(int idOrden, int idPuntoCarga, int idMovimiento)
        {
            DalLaboratorio dalLaboratorio = new DalLaboratorio();
            DalPaciente dalPaciente = new DalPaciente();
            DalAtenciones dalAtenciones = new DalAtenciones();
            DataSet labResultadoLaboratorio;
            DataSet factOrdenServicios = await dalLaboratorio.LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(idOrden, idPuntoCarga, idMovimiento, 0);

            List<DataTable> resultadosLaboratorio = new List<DataTable>();

            foreach(DataRow factOrden in factOrdenServicios.Tables[0].Rows)
            {
                if (factOrden["resultado"].ToString() == "SI") {
                    labResultadoLaboratorio = await dalLaboratorio.RptResulLaboratoriobyMGP(idOrden, Int32.Parse(factOrden["idProducto"].ToString()));

                    resultadosLaboratorio.Add(labResultadoLaboratorio.Tables[0]);
                }
                
            }


            

            ViewBag.Resultados = resultadosLaboratorio;

            //DataSet labMovimientoLaboratorio = await dalLaboratorio.LabMovimientoLaboratorioSeleccionarXidOrden(idOrden);
            //
            //DataSet labImgLabObservaciones = await dalLaboratorio.ListarImgLabObservaciones(idOrden, idProducto, idMovimiento);
            //DataSet paciente = await dalPaciente.PacientesSeleccionarPorId(Int32.Parse(ordenServicio.Tables[0].Rows[0]["IdPaciente"].ToString()));

            //List<string> grupos = new List<string>();
            //var idCuentaAtencion = ordenServicio.Tables[0].Rows[0]["IdCuentaAtencion"];

            //DataSet atenciones = await dalAtenciones.ListaAtencionByIdCuentaAtencion(Int32.Parse(idCuentaAtencion.ToString()));

            //var Observaciones = "";
            //var Conclusiones = "";

            //if (labImgLabObservaciones.Tables[0].Rows.Count > 0)
            //{
            //    Observaciones = labImgLabObservaciones.Tables[0].Rows[0]["Obseraciones"].ToString();
            //    Conclusiones = labImgLabObservaciones.Tables[0].Rows[0]["conclusiones"].ToString();
            //}

            //ViewBag.idMovimiento = idMovimiento;
            //ViewBag.OrdenaPrueba = labMovimientoLaboratorio.Tables[0].Rows[0]["OrdenaPrueba"];
            //ViewBag.Paciente = labMovimientoLaboratorio.Tables[0].Rows[0]["Paciente"];
            //ViewBag.NroHistoriaClinica = paciente.Tables[0].Rows[0]["NroHistoriaClinica"];
            ////ViewBag.Edad = paciente.Tables[0].Rows[0]["Paciente"];
            //ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy");
            //ViewBag.HoraImpresion = DateTime.Now.ToString("hh:mm:ss");
            //ViewBag.Observaciones = Observaciones;
            //ViewBag.Conclusiones = Conclusiones;
            //ViewBag.Servicio = ordenServicio.Tables[0].Rows[0]["dservicio"];
            //ViewBag.Edad = atenciones.Tables[0].Rows[0]["edadPaciente"];

            //foreach (DataRow row in labResultadoLaboratorio.Tables[0].Rows)
            //{
            //    ViewBag.Examen = row["NombreCorto"];
            //    ViewBag.Recepcionista = row["usuarioRec"];
            //    ViewBag.FechaRec = row["fechaRec"];
            //    ViewBag.FechaRes = row["Fecha"];
            //    ViewBag.TipoEmpleado = row["TipoEmpleado"];
            //    ViewBag.Empleado = row["realiza_prueba"];

            //    if (!grupos.Contains(row["Grupo"].ToString()))
            //    {
            //        grupos.Add(row["Grupo"].ToString());
            //    }
            //}

            //ViewBag.Grupos = grupos;
            //ViewBag.ResultadosLaboratorio = labResultadoLaboratorio.Tables[0];

            //Console.WriteLine(grupos);

            //foreach (DataTable resultados in resultadosLaboratorio)
            //{
            //    foreach (DataRow resultadoPorItem in resultados.Rows)
            //    {
            //        Console.WriteLine(resultadosLaboratorio);
            //    }
            //}
            return PartialView("~/Views/Laboratorio/Plantillas/Resultados.cshtml");

        }
        public async Task<bool> GenerarFormatoResultados(int idOrden, int idPuntoCarga, int idMovimiento, string tipoFormato)
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

                pageHtml = Url.Action("rptResultado", "PatologiaClinica", new { area = "Laboratorio", idOrden, idPuntoCarga, idMovimiento }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(0, idMovimiento, 0, tipoFormato, 0, pageHtml, stringHtml, idUsuario, pdf);
                //resp = true;
                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


    }
}
