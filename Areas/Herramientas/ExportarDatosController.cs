using CapaDatos;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2013.Drawing.Chart;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
//using WebAppMaternidad.Connected_Services;

namespace WebAppMaternidad.Areas.Herramientas
{
    public class ExportarDatosController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ExportarDatosController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

       
        public async Task<IActionResult> rptExportarDatosAdultasSEM(string fechaInicio, string fechaFin, int tipoReporte, string reporte)
        {
            string respuesta = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            sWebRootFolder = sWebRootFolder + "/Plantilla/Estadistica/ReporteAdultasSEM.xlsx";

            try
            {

                using (var workbook = new XLWorkbook(sWebRootFolder))
                {
                    //var FilaIni = 4;

                    Conexion conexion = new Conexion();
                    DalHerramientas dalHerramientas = new DalHerramientas();
                    DataSet dsEgre = new DataSet();
                    DataSet dsPac = new DataSet();
                    DataSet dsUbig = new DataSet();
                    DataSet dsPartos = new DataSet();
                    DataSet dsNac = new DataSet();

                    string anio = fechaFin.Split('/')[2];
                    String rutaDB = conexion.ObtenerServidorEIDDSIP() + "EIDDSIP_" + anio + "/EIDDSIP_" + anio.Substring(2, 2) + ".mdb";
                    String cadenaConexionEIDDSIP = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaDB;

                    dsEgre = await dalHerramientas.EIDDSIP_ObtenerEgresosAdultas(cadenaConexionEIDDSIP, fechaInicio, fechaFin);

                    if (dsEgre.Tables[0].Rows.Count > 0)
                    {
                        int filas = dsEgre.Tables[0].Rows.Count;

                        var wsHoja1 = workbook.Worksheets.First();
                        wsHoja1.Cell(4, 1).Value = reporte;

                        //wsHoja1.Cell(6, 1).InsertTable(ds.Tables[0]);
                        int fIni = 6;
                        int fFin = fIni + dsEgre.Tables[0].Rows.Count;

                        int i = 7;
                        foreach (DataRow row in dsEgre.Tables[0].Rows)
                        {
                            //cantidad = Int32.Parse(row["tot"].ToString());
                            wsHoja1.Cell(i, 1).Value = "000006208";
                            wsHoja1.Cell(i, 2).Value = "150101";
                            wsHoja1.Cell(i, 3).Value = "15";
                            wsHoja1.Cell(i, 4).Value = "01";
                            wsHoja1.Cell(i, 5).Value = "01";
                            wsHoja1.Cell(i, 6).Value = "20";
                            wsHoja1.Cell(i, 7).Value = "00";
                            wsHoja1.Cell(i, 8).Value = "00";
                            wsHoja1.Cell(i, 9).Value = row["cknrohis"].ToString();
                            wsHoja1.Cell(i, 10).Value = row["pacnam"].ToString();
                            wsHoja1.Cell(i, 11).Value = row["APELLIDO"].ToString();

                            dsPac = await dalHerramientas.ValoresVarios("PA", row["cknrohis"].ToString());
                            if (dsPac.Tables[0].Rows.Count > 0)
                            {
                                wsHoja1.Cell(i, 12).Value = dsPac.Tables[0].Rows[0]["NroDocumento"].ToString();

                                if (dsPac.Tables[0].Rows[0]["IdTipoSexo"].ToString() == "2")
                                {
                                    wsHoja1.Cell(i, 14).Value = "2";
                                }
                                else
                                {
                                    wsHoja1.Cell(i, 14).Value = "1";
                                }

                                dsUbig = await dalHerramientas.EIDDSIP_ObtenerUbigeo(cadenaConexionEIDDSIP, dsPac.Tables[0].Rows[0]["IdDistritoDomicilio"].ToString());
                                if (dsUbig.Tables[0].Rows.Count > 0)
                                {
                                    wsHoja1.Cell(i, 17).Value = dsUbig.Tables[0].Rows[0]["ubicod_C"].ToString();
                                    wsHoja1.Cell(i, 18).Value = dsUbig.Tables[0].Rows[0]["ubicod_C"].ToString().Substring(0, 2);
                                    wsHoja1.Cell(i, 19).Value = dsUbig.Tables[0].Rows[0]["ubicod_C"].ToString().Substring(2, 2);
                                    wsHoja1.Cell(i, 20).Value = dsUbig.Tables[0].Rows[0]["ubicod_C"].ToString().Substring(dsUbig.Tables[0].Rows[0]["ubicod_C"].ToString().Length - 2);
                                }
                            }

                            wsHoja1.Cell(i, 13).Value = "80";
                            wsHoja1.Cell(i, 15).Value = row["madre_edad"].ToString();
                            wsHoja1.Cell(i, 16).Value = "1";

                            wsHoja1.Cell(i, 21).Value = FormatearFecha(row["fecha_ing"].ToString(), "yyyyMMdd");
                            wsHoja1.Cell(i, 22).Value = FormatearFecha(row["FECHA_EGRE"].ToString(), "yyyyMMdd");
                            wsHoja1.Cell(i, 23).Value = row["ESTANCIA"].ToString();

                            if (row["GRUPO_GO"].ToString() == "6")
                            {
                                wsHoja1.Cell(i, 24).Value = "241500";
                            }
                            else
                            {
                                wsHoja1.Cell(i, 24).Value = "241600";
                            }

                            wsHoja1.Cell(i, 25).Value = row["fal_igss"].ToString();

                            if (row["AFILIACION"].ToString() == "1" || row["AFILIACION"].ToString() == "2" || row["AFILIACION"].ToString() == "0")
                            {
                                wsHoja1.Cell(i, 26).Value = "01";
                            }
                            else
                            {
                                if (row["AFILIACION"].ToString() == "3")
                                {
                                    wsHoja1.Cell(i, 26).Value = "02";
                                }
                            }

                            wsHoja1.Cell(i, 27).Value = row["CODCIE01"].ToString();
                            wsHoja1.Cell(i, 28).Value = row["CODCIE03"].ToString();
                            wsHoja1.Cell(i, 29).Value = row["CODCIE05"].ToString();
                            wsHoja1.Cell(i, 30).Value = row["CODCIE06"].ToString();

                            dsPartos = await dalHerramientas.SIAN_PartosAtenciones(FormatearFecha(row["RN_NACFECH"].ToString(), "yyyyMMdd"), row["cknrohis"].ToString());
                            if (dsPartos.Tables[0].Rows.Count > 0)
                            {
                                if (dsPartos.Tables[0].Rows[0]["TProf_cod"].ToString() == "1")
                                {
                                    wsHoja1.Cell(i, 42).Value = "6";
                                }
                                else if (dsPartos.Tables[0].Rows[0]["TProf_cod"].ToString() == "2")
                                {
                                    wsHoja1.Cell(i, 42).Value = "2";
                                }
                                else if (dsPartos.Tables[0].Rows[0]["TProf_cod"].ToString() == "3")
                                {
                                    wsHoja1.Cell(i, 42).Value = "5";
                                }
                            }

                            wsHoja1.Cell(i, 43).Value = FormatearFecha(row["RN_NACFECH"].ToString(), "yyyyMMdd");
                            wsHoja1.Cell(i, 44).Value = row["T_NACVIVOS"].ToString();
                            wsHoja1.Cell(i, 45).Value = row["T_NACMUERT"].ToString();
                            wsHoja1.Cell(i, 46).Value = row["COLEGIOEGRESO"].ToString();
                            wsHoja1.Cell(i, 47).Value = row["FECHAREGIS"].ToString() + " " + row["FECHAREGIS"].ToString();
                            wsHoja1.Cell(i, 48).Value = "1";

                            //dsNac = await dalHerramientas.EIDDSIP_ObtenerNacimiento(cadenaConexionEIDDSIP, row["cknrohis"].ToString());
                            //if (dsNac.Tables[0].Rows.Count > 0)
                            //{
                            //    wsHoja1.Cell(i, 49).Value = dsNac.Tables[0].Rows[0]["des_nacionalidad"].ToString();
                            //}

                            i++;
                        }

                        // Definir el rango como tabla 
                        var range = wsHoja1.Range("A" + fIni + ":AZ" + fFin);
                        var table = range.CreateTable();
                        table.Theme = XLTableTheme.TableStyleMedium9; // Aplicar estilo

                        // Listado Admision 
                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteSEM.xlsx");
                        }

                    }
                    else
                    {
                        return NoContent();
                    }

                }

            }
            catch (Exception ex)
            {
                respuesta = "Error: " + ex.Message + ".";
            }
            return Json(new { respuesta = false, mensaje = respuesta });
        }

        public async Task<IActionResult> rptExportarDatosNeonatosSEM(string fechaInicio, string fechaFin, int tipoReporte, int tipoPaciente, string reporte)
        {
            string respuesta = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            sWebRootFolder = sWebRootFolder + "/Plantilla/Estadistica/ReporteNeonatosSEM.xlsx";

            try
            {

                using (var workbook = new XLWorkbook(sWebRootFolder))
                {
                    //var FilaIni = 4;

                    Conexion conexion = new Conexion();
                    DalHerramientas dalHerramientas = new DalHerramientas();
                    DataSet dsEgre = new DataSet();
                    DataSet dsEstServ = new DataSet();
                    DataSet dsEstHosp = new DataSet();
                    DataSet dsDX = new DataSet();
                    
                    string anio = fechaFin.Split('/')[2];
                    String rutaDB = conexion.ObtenerServidorEIDDSIP() + "EIDDSIP_" + anio + "/EIDDSIP_" + anio.Substring(2, 2) + ".mdb";
                    String cadenaConexionEIDDSIP = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + rutaDB;

                    dsEgre = await dalHerramientas.EIDDSIP_ObtenerEgresosNeonatos(cadenaConexionEIDDSIP, fechaInicio, fechaFin);

                    if (dsEgre.Tables[0].Rows.Count > 0)
                    {
                        int filas = dsEgre.Tables[0].Rows.Count;

                        var wsHoja1 = workbook.Worksheets.First();
                        wsHoja1.Cell(4, 1).Value = reporte;

                        //wsHoja1.Cell(6, 1).InsertTable(ds.Tables[0]);
                        int fIni = 6;
                        int fFin = fIni + dsEgre.Tables[0].Rows.Count;

                        int i = 7;                        
                        foreach (DataRow row in dsEgre.Tables[0].Rows)
                        {
                            //cantidad = Int32.Parse(row["tot"].ToString());
                            wsHoja1.Cell(i, 1).Value = row["PACHIS_RN"].ToString();
                            wsHoja1.Cell(i, 2).Value = row["PACHIS_MADRE"].ToString();
                            wsHoja1.Cell(i, 3).Value = row["FECH_HOSP"].ToString();
                            wsHoja1.Cell(i, 4).Value = row["EDAD_MADRE"].ToString();
                            wsHoja1.Cell(i, 5).Value = row["Descrip"].ToString();
                            wsHoja1.Cell(i, 6).Value = row["pacpat"].ToString();
                            wsHoja1.Cell(i, 7).Value = row["pacmat"].ToString();
                            wsHoja1.Cell(i, 8).Value = row["PACNOM"].ToString();
                            wsHoja1.Cell(i, 9).Value = row["EDAD_NEO"].ToString();
                            wsHoja1.Cell(i, 10).Value = row["Descripc_sex"].ToString();
                            wsHoja1.Cell(i, 11).Value = row["FECH_NAC_RN"].ToString();
                            wsHoja1.Cell(i, 12).Value = row["HORA_NEC"].ToString();
                            wsHoja1.Cell(i, 13).Value = row["PESO_NAC"].ToString();
                            wsHoja1.Cell(i, 14).Value = row["EG_CONFI_SEM"].ToString();
                            wsHoja1.Cell(i, 15).Value = row["PESO_ADECUAD"].ToString();
                            wsHoja1.Cell(i, 16).Value = row["APGAR_1"].ToString();
                            wsHoja1.Cell(i, 17).Value = row["APGAR_5"].ToString();
                            wsHoja1.Cell(i, 18).Value = row["PER_CEFA"].ToString();
                            wsHoja1.Cell(i, 19).Value = row["LONGITUD"].ToString();
                            wsHoja1.Cell(i, 20).Value = row["GEN_NRO"].ToString();
                            wsHoja1.Cell(i, 21).Value = row["FECH_EGR"].ToString();
                            wsHoja1.Cell(i, 22).Value = row["desc_egreso"].ToString();


                            wsHoja1.Cell(i, 27).Value = row["RESHAB"].ToString();
                            wsHoja1.Cell(i, 52).Value = row["SERV_EGRES"].ToString();

                            dsEstServ = await dalHerramientas.EIDDSIP_ObtenerEstanciaServ(cadenaConexionEIDDSIP, FormatearFecha(row["FECH_EGR"].ToString(), "dd/MM/yyyy"), row["PACHIS_RN"].ToString());
                            if (dsEstServ.Tables[0].Rows.Count > 0)
                            {
                                wsHoja1.Cell(i, 53).Value = dsEstServ.Tables[0].Rows[0]["Descrip"].ToString();                                
                            }

                            dsEstHosp = await dalHerramientas.EIDDSIP_ObtenerEstanciaHosp(cadenaConexionEIDDSIP, FormatearFecha(row["FECH_HOSP"].ToString(), "dd/MM/yyyy"), row["PACHIS_RN"].ToString());
                            if (dsEstHosp.Tables[0].Rows.Count > 0)
                            {
                                foreach (DataRow row2 in dsEstHosp.Tables[0].Rows)
                                {
                                    if(row2["SERVICIO"].ToString() == "UCI-NEO")
                                    {
                                        wsHoja1.Cell(i, 23).Value = row2["TOTAL_EST"].ToString();
                                    } else if (row2["SERVICIO"].ToString() == "INTERMEDIOS")
                                    {
                                        wsHoja1.Cell(i, 24).Value = row2["TOTAL_EST"].ToString();
                                    } else if (row2["SERVICIO"].ToString() == "ALOJAMIENTO")
                                    {
                                        wsHoja1.Cell(i, 25).Value = row2["TOTAL_EST"].ToString();
                                    }
                                }                                    
                            }

                            wsHoja1.Cell(i, 26).Value = Convert.ToInt32(isNull(wsHoja1.Cell(i, 23).Value.ToString(), "0")) + Convert.ToInt32(isNull(wsHoja1.Cell(i, 24).Value.ToString(), "0")) + Convert.ToInt32(isNull(wsHoja1.Cell(i, 25).Value.ToString(), "0"));


                            int VAR_REG_D = 0;
                            int VAR_REG_E = 0;
                            int VAR_REG_X = 0;
                            int VAR_REG_Q = 0;                           
                            dsDX = await dalHerramientas.EIDDSIP_ObtenerDxNeonatos(cadenaConexionEIDDSIP, FormatearFecha(row["FECH_EGR"].ToString(), "dd/MM/yyyy"), row["PACHIS_RN"].ToString());
                            if (dsDX.Tables[0].Rows.Count > 0)
                            {
                                foreach (DataRow row3 in dsDX.Tables[0].Rows)
                                {
                                    if (row3["NDX"].ToString() == "1")
                                    {
                                        VAR_REG_D = VAR_REG_D + 1;
                                        if(VAR_REG_D == 1)
                                        {
                                            wsHoja1.Cell(i, 28).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_D == 2)
                                        {
                                            wsHoja1.Cell(i, 29).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_D == 3)
                                        {
                                            wsHoja1.Cell(i, 30).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_D == 4)
                                        {
                                            wsHoja1.Cell(i, 31).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_D == 5)
                                        {
                                            wsHoja1.Cell(i, 32).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_D == 6)
                                        {
                                            wsHoja1.Cell(i, 33).Value = row3["Diagnosticos"].ToString();
                                        }
                                    }
                                    else if (row3["NDX"].ToString() == "2")
                                    {
                                        VAR_REG_E = VAR_REG_E + 1;
                                        if (VAR_REG_E == 1)
                                        {
                                            wsHoja1.Cell(i, 34).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_E == 2)
                                        {
                                            wsHoja1.Cell(i, 35).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_E == 3)
                                        {
                                            wsHoja1.Cell(i, 36).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_E == 4)
                                        {
                                            wsHoja1.Cell(i, 37).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_E == 5)
                                        {
                                            wsHoja1.Cell(i, 38).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_E == 6)
                                        {
                                            wsHoja1.Cell(i, 39).Value = row3["Diagnosticos"].ToString();
                                        }
                                    }
                                    else if (row3["NDX"].ToString() == "3")
                                    {
                                        VAR_REG_X = VAR_REG_X + 1;
                                        if (VAR_REG_X == 1)
                                        {
                                            wsHoja1.Cell(i, 40).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_X == 2)
                                        {
                                            wsHoja1.Cell(i, 41).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_X == 3)
                                        {
                                            wsHoja1.Cell(i, 42).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_X == 4)
                                        {
                                            wsHoja1.Cell(i, 43).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_X == 5)
                                        {
                                            wsHoja1.Cell(i, 44).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_X == 6)
                                        {
                                            wsHoja1.Cell(i, 45).Value = row3["Diagnosticos"].ToString();
                                        }
                                    }
                                    else if (row3["NDX"].ToString() == "4")
                                    {
                                        VAR_REG_Q = VAR_REG_Q + 1;
                                        if (VAR_REG_Q == 1)
                                        {
                                            wsHoja1.Cell(i, 46).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_Q == 2)
                                        {
                                            wsHoja1.Cell(i, 47).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_Q == 3)
                                        {
                                            wsHoja1.Cell(i, 48).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_Q == 4)
                                        {
                                            wsHoja1.Cell(i, 49).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_Q == 5)
                                        {
                                            wsHoja1.Cell(i, 50).Value = row3["Diagnosticos"].ToString();
                                        }
                                        if (VAR_REG_Q == 6)
                                        {
                                            wsHoja1.Cell(i, 51).Value = row3["Diagnosticos"].ToString();
                                        }
                                    }
                                }
                            }
                            
                            i++;
                        }
                                                
                        // Definir el rango como tabla 
                        var range = wsHoja1.Range("A"+ fIni + ":AZ" + fFin);
                        var table = range.CreateTable();
                        table.Theme = XLTableTheme.TableStyleMedium9; // Aplicar estilo

                        // Listado Admision 
                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ReporteSEM.xlsx");
                        }

                    }
                    else
                    {
                        return NoContent();
                    }

                }

            }
            catch (Exception ex)
            {
                respuesta = "Error: " + ex.Message + ".";
            }
            return Json(new { respuesta = false, mensaje = respuesta });
        }

        public string FormatearFecha(string dateString, string formato)
        {
            DateTime result;
            string fechaResult = "";
            if(DateTime.TryParse(dateString, out result))
            {
                fechaResult = Convert.ToDateTime(dateString).ToString(formato);
            }

            return fechaResult;
        }

        public string isNull(string valor, string reemplaza)
        {               
            if (string.IsNullOrEmpty(valor))
            {
                valor = reemplaza;
            }
            
            return valor;
        }



    }
}
