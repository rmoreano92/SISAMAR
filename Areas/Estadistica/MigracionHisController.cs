using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SelectPdf;

namespace WebAppMaternidad.Areas.Estadistica
{
    public class MigracionController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public MigracionController(IWebHostEnvironment env) // JDELGADO J0 AGREGAR RUTA PARA DESCARGA DE ARCHIVOS
        {
            _hostingEnvironment = env;
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveListaAtencionesaCEMigrar(int Tipo, DateTime FecIni, DateTime FecFin) // JDELGADO J0 CAMBIO ASYNC METHOD
        {
            Boolean Respuesta = true;
            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    Respuesta = false;
                }
                DataSet lst = new DataSet();
                DalUtilitario daoRn = new DalUtilitario();
                if (Tipo == 1)
                {
                    lst = await daoRn.DevuelveListaAtencionesaCEMigrar(FecIni, FecFin);
                } else if (Tipo == 2)
                {
                    lst = await daoRn.DevuelveListaAtencionesPlanificacionMigrar(FecIni, FecFin);
                }
                else
                {
                    lst = await daoRn.ListarAtencionesTelesaludJsonaMigrar(FecIni, FecFin);
                }

                return Json(new { lstDatos = lst, session = Respuesta });
            });
        }

        [HttpPost]
        public async Task<ActionResult> MigrarDataHisMinsa(int Tipo, DateTime FecIni, DateTime FecFin)
        {
            Boolean resp = false;
            DalUtilitario daoUtilitario = new DalUtilitario();
            

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                if (Tipo == 1)
                {
                    resp = await daoUtilitario.MigrarDataCE(FecIni, FecFin, idUsuario);
                } 
                else if(Tipo == 2)
                {
                    resp = await daoUtilitario.MigrarDataPlanificacionFamiliar(FecIni, FecFin, idUsuario);
                } else
                {
                    resp = await daoUtilitario.MigrarDataTelesalud(FecIni, FecFin, idUsuario);
                }


                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }

        [HttpPost]
        public async Task<ActionResult> RegitraModifcaEpisodio(int Tipo, DateTime FecIni, DateTime FecFin) // JDELGADO J0 CAMBIO ASYNC METHOD
        {
            Boolean Respuestasession = true;
            Boolean Respuesta = true;
            int idUsuario;

            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    Respuestasession = false;
                }
                DalUtilitario daoRn = new DalUtilitario();
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                if (Tipo == 1)
                {
                    Respuesta = await daoRn.MigrarDataCE(FecIni, FecFin, idUsuario);
                }
                else
                {
                    Respuesta = await daoRn.MigrarDataPlanificacionFamiliar(FecIni, FecFin, idUsuario);
                }

                return Json(new { respuesta = Respuesta, session = Respuestasession });
            });
        }

        [HttpPost]
        public async Task<ActionResult> DepurarDataMigrada() // JDELGADO J0 CAMBIO ASYNC METHOD
        {
            Boolean Respuestasession = true;
            Boolean Respuesta = true;
            int idUsuario;

            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    Respuestasession = false;
                }
                DalUtilitario daoRn = new DalUtilitario();
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                Respuesta = await daoRn.DepurarDataMigrada();

                return Json(new { respuesta = Respuesta, session = Respuestasession });
            });

        }


        [HttpPost]
        public ActionResult ListaTramaConErrorDepuracion()
        {
            Boolean Respuesta = true;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                Respuesta = false;
            }
            DataSet lst = new DataSet();
            DalUtilitario daoRn = new DalUtilitario();

           lst = daoRn.ListaTramaConErrorDepuracion();
         

            return Json(new { lstDatos = lst, session = Respuesta });
        }

        [HttpPost]
        public ActionResult ListaJsonSinEnvio()
        {
            Boolean Respuesta = true;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                Respuesta = false;
            }
            DataSet lst = new DataSet();
            DalUtilitario daoRn = new DalUtilitario();

            lst = daoRn.ListaJsonSinEnvio();


            return Json(new { lstDatos = lst, session = Respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> GeneradorJson()
        {
            Boolean Respuestasession = true;
            Boolean Respuesta = true;
            int idUsuario;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                Respuestasession = false;
            }
            DalUtilitario daoRn = new DalUtilitario();
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            Respuesta = await daoRn.GeneradorJson();

            return Json(new { respuesta = Respuesta, session = Respuestasession });
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesCEJsonaMigradas(int Tipo, DateTime FecIni, DateTime FecFin) // JDELGADO J0 CAMBIO ASYNC METHOD
        {

            DataSet dataSet = null;
            DalUtilitario daoUtilitario = new DalUtilitario();


            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await daoUtilitario.ListarAtencionesCEJsonaMigradas(FecIni, FecFin, Tipo);


                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

            
        }
        public async Task<ActionResult> GenerarReporteHis(int Tipo, DateTime FecIni, DateTime FecFin, int TipoBusqueda) // JDELGADO J0 REPORTE HIS
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaMigracionHis.xlsx";

            return await Task.Run(() =>
            {
                using (var workbookOri = new XLWorkbook(sWebRootFolder))
                {
                    var wsHoja1 = workbookOri.Worksheets.First();
                    DataSet lst = new DataSet();
                    DalUtilitario daoRn = new DalUtilitario();

                    if (Tipo == 1)
                    {
                        lst = daoRn.ReporteAtencionesaCEMigrar(FecIni, FecFin, TipoBusqueda);
                    }
                    else
                    {
                        lst = daoRn.ReporteAtencionesPlanificacionMigrar(FecIni, FecFin, TipoBusqueda);
                    }

                    wsHoja1.Cell(2, 4).Value = FecIni;
                    wsHoja1.Cell(3, 4).Value = FecFin;


                    for (int m = 0; m < lst.Tables[0].Rows.Count; m++)
                    {
                        var row = lst.Tables[0].Rows[m];

                        wsHoja1.Cell(5 + m, 1).Value = row["V_CITA_ORIGEN"].ToString();
                        wsHoja1.Cell(5 + m, 2).Value = row["V_CITA_NUMERO_AFILIACION"].ToString();
                        wsHoja1.Cell(5 + m, 3).Value = row["V_CITA_FECHA_ATENCION"].ToString();
                        wsHoja1.Cell(5 + m, 4).Value = row["V_CITA_ITEMS_CODIGO"].ToString();
                        wsHoja1.Cell(5 + m, 5).Value = row["V_CITA_ITEMS_TIPO_DIAGNOSTICO"].ToString();
                        wsHoja1.Cell(5 + m, 6).Value = row["V_CITA_ITEMS_VALOR_LAB_1"].ToString();
                        wsHoja1.Cell(5 + m, 7).Value = row["V_CITA_ITEMS_VALOR_LAB_2"].ToString();
                        wsHoja1.Cell(5 + m, 8).Value = row["V_CITA_ITEMS_VALOR_LAB_3"].ToString();
                        wsHoja1.Cell(5 + m, 9).Value = row["V_CITA_ID_UPS"].ToString();
                        wsHoja1.Cell(5 + m, 10).Value = row["I_CITA_CODIGO_ESTABLECIMIENTO"].ToString();
                        wsHoja1.Cell(5 + m, 11).Value = row["I_CITA_DIA_EDAD"].ToString();
                        wsHoja1.Cell(5 + m, 12).Value = row["I_CITA_MES_EDAD"].ToString();
                        wsHoja1.Cell(5 + m, 13).Value = row["I_CITA_ANNIO_EDAD"].ToString();
                        wsHoja1.Cell(5 + m, 14).Value = row["I_CITA_EDAD_REGISTRO"].ToString();
                        wsHoja1.Cell(5 + m, 15).Value = row["V_CITA_ID_TIPO_EDAD_REGISTRO"].ToString();
                        wsHoja1.Cell(5 + m, 16).Value = row["V_CITA_ID_TURNO"].ToString();
                        wsHoja1.Cell(5 + m, 17).Value = row["I_CITA_FGDIG"].ToString();
                        wsHoja1.Cell(5 + m, 18).Value = row["I_CITA_COMPONENTE"].ToString();
                        wsHoja1.Cell(5 + m, 19).Value = row["V_CITA_ID_FINANCIADOR"].ToString();
                        wsHoja1.Cell(5 + m, 20).Value = row["I_CITA_OTRA_CONDICION"].ToString();
                        wsHoja1.Cell(5 + m, 21).Value = row["V_CITA_FECHA_ULTIMA_REGLA"].ToString();
                        wsHoja1.Cell(5 + m, 22).Value = row["V_CITA_ESTADO_REGISTRO"].ToString();
                        wsHoja1.Cell(5 + m, 23).Value = row["D_CITA_EXAMENFISICO_PESO"].ToString();
                        wsHoja1.Cell(5 + m, 24).Value = row["D_CITA_EXAMENFISICO_TALLA"].ToString();
                        wsHoja1.Cell(5 + m, 25).Value = row["D_CITA_EXAMENFISICO_HEMOGLOBINA"].ToString();
                        wsHoja1.Cell(5 + m, 26).Value = row["D_CITA_EXAMENFISICO_PER_ABDOMINAL"].ToString();
                        wsHoja1.Cell(5 + m, 27).Value = row["D_CITA_EXAMENFISICO_PER_CEFALICO"].ToString();
                        wsHoja1.Cell(5 + m, 28).Value = row["I_PEREGISTRA_ID_TIPODOC"].ToString();
                        wsHoja1.Cell(5 + m, 29).Value = row["V_PEREGISTRA_NRO_DOCUMENTO"].ToString();
                        wsHoja1.Cell(5 + m, 30).Value = row["V_PEREGISTRA_APEPATERNO"].ToString();
                        wsHoja1.Cell(5 + m, 31).Value = row["V_PEREGISTRA_APEMATERNO"].ToString();
                        wsHoja1.Cell(5 + m, 32).Value = row["V_PEREGISTRA_NOMBRES"].ToString();
                        wsHoja1.Cell(5 + m, 33).Value = row["V_PEREGISTRA_SEXO"].ToString();
                        wsHoja1.Cell(5 + m, 34).Value = row["V_PEREGISTRA_FECHA_NACIMIENTO"].ToString();
                        wsHoja1.Cell(5 + m, 35).Value = row["V_PEREGISTRA_ID_PROFESION"].ToString();
                        wsHoja1.Cell(5 + m, 36).Value = row["V_PEREGISTRA_ID_PAIS"].ToString();
                        wsHoja1.Cell(5 + m, 37).Value = row["V_PEREGISTRA_CONDICION"].ToString();
                        wsHoja1.Cell(5 + m, 38).Value = row["V_PEREGISTRA_ID_FLAG"].ToString();
                        wsHoja1.Cell(5 + m, 39).Value = row["I_PEATIENDE_ID_TIPODOC"].ToString();
                        wsHoja1.Cell(5 + m, 40).Value = row["V_PEATIENDE_NRO_DOCUMENTO"].ToString();
                        wsHoja1.Cell(5 + m, 41).Value = row["V_PEATIENDE_APEPATERNO"].ToString();
                        wsHoja1.Cell(5 + m, 42).Value = row["V_PEATIENDE_APEMATERNO"].ToString();
                        wsHoja1.Cell(5 + m, 43).Value = row["V_PEATIENDE_NOMBRES"].ToString();
                        wsHoja1.Cell(5 + m, 44).Value = row["V_PEATIENDE_SEXO"].ToString();
                        wsHoja1.Cell(5 + m, 45).Value = row["V_PEATIENDE_FECHA_NACIMIENTO"].ToString();
                        wsHoja1.Cell(5 + m, 46).Value = row["V_PEATIENDE_ID_PROFESION"].ToString();
                        wsHoja1.Cell(5 + m, 47).Value = row["V_PEATIENDE_ID_PAIS"].ToString();
                        wsHoja1.Cell(5 + m, 48).Value = row["V_PEATIENDE_CONDICION"].ToString();
                        wsHoja1.Cell(5 + m, 49).Value = row["V_PEATIENDE_ID_FLAG"].ToString();
                        wsHoja1.Cell(5 + m, 50).Value = row["I_PACIENTE_ID_TIPODOC"].ToString();
                        wsHoja1.Cell(5 + m, 51).Value = row["V_PACIENTE_NRO_DOCUMENTO"].ToString();
                        wsHoja1.Cell(5 + m, 52).Value = row["V_PACIENTE_NRO_HC"].ToString();
                        wsHoja1.Cell(5 + m, 53).Value = row["V_PACIENTE_APEPATERNO"].ToString();
                        wsHoja1.Cell(5 + m, 54).Value = row["V_PACIENTE_APEMATERNO"].ToString();
                        wsHoja1.Cell(5 + m, 55).Value = row["V_PACIENTE_NOMBRES"].ToString();
                        wsHoja1.Cell(5 + m, 56).Value = row["V_PACIENTE_SEXO"].ToString();
                        wsHoja1.Cell(5 + m, 57).Value = row["V_PACIENTE_FECHA_NACIMIENTO"].ToString();
                        wsHoja1.Cell(5 + m, 58).Value = row["V_PACIENTE_ID_PAIS"].ToString();
                        wsHoja1.Cell(5 + m, 59).Value = row["V_PACIENTE_ID_ETNIA"].ToString();
                        wsHoja1.Cell(5 + m, 60).Value = row["I_PACIENTE_CODIGO_ESTABLECIMIENTO"].ToString();
                        wsHoja1.Cell(5 + m, 61).Value = row["V_PACIENTE_ID_FLAG"].ToString();
                        wsHoja1.Cell(5 + m, 62).Value = row["I_ESTADO"].ToString();
                        wsHoja1.Cell(5 + m, 63).Value = row["V_DESCRIPCION_RESPUESTA"].ToString();
                        wsHoja1.Cell(5 + m, 64).Value = row["D_FECHA_REGISTRO"].ToString();
                        wsHoja1.Cell(5 + m, 65).Value = row["D_FECHA_PROCESAMIENTO"].ToString();
                        wsHoja1.Cell(5 + m, 66).Value = row["ID_CITA"].ToString();

                    }
                    using (var stream = new MemoryStream())
                    {
                        workbookOri.SaveAs(stream);
                        var content = stream.ToArray();
                        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteHisminsa.xlsx");
                    }
                }
            });

        }


        public async Task<ActionResult> GenerarReporteDepuracion() // JDELGADO J0 REPORTE HIS
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            sWebRootFolder = sWebRootFolder + "/Plantilla/PlantillaMigracionHisV2.xlsx";

            using (var workbookOri = new XLWorkbook(sWebRootFolder))
            {
                var wsHoja1 = workbookOri.Worksheets.First();
                DataSet lst = new DataSet();
                DalUtilitario daoRn = new DalUtilitario();

                lst = await daoRn.ListarErroresTramaHisMinsa();



                wsHoja1.Cell(3, 1).InsertTable(lst.Tables[0]);

                using (var stream = new MemoryStream())
                {
                    workbookOri.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteHisminsa.xlsx");
                }
            }

        }
    }
    
        
}