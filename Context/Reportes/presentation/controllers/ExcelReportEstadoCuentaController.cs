using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Context.Reportes.Domain;

namespace WebAppMaternidad.Context.Reportes.presentation.controllers
{
    public class ExcelReportEstadoCuentaController : ControllerBase
    {
        private readonly IEstadoCuentaReportExcelService _estadoCuentaReportExcelService;
        private readonly DalFacturacion _dalFacturacion;

        public ExcelReportEstadoCuentaController(IEstadoCuentaReportExcelService estadoCuentaReportExcelService, DalFacturacion dalFacturacion)
        {
            _estadoCuentaReportExcelService = estadoCuentaReportExcelService;
            _dalFacturacion = dalFacturacion;
        }

        public async Task<IActionResult> GenerarReporte(int idCuentaAtencion, int modeloReporte)
        {
            try
            {
                // ⚡ Simulación de DataSet

                DalParametros daoParametros = new DalParametros();
                DalUtilitario dalUtili = new DalUtilitario();

                DataSet dsParametros;


                string usuario = HttpContext.Session.GetString("user");
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));


                dsParametros = await daoParametros.SeleccionaFilaParametro2(205);
                string NombreInstitucion = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

                dsParametros.Clear();

                dsParametros = await daoParametros.SeleccionaFilaParametro2(206);
                string DireccionInstitucion = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

                dsParametros.Clear();

                dsParametros = await daoParametros.SeleccionaFilaParametro2(207);
                string TelefonoInstitucion = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();


                DataSet DatosCabecera = await _dalFacturacion.AtencionesFiltraDatosCabecera(idCuentaAtencion);

                string IdCuentaAtencion = DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
                string NombrePaciente = DatosCabecera.Tables[0].Rows[0]["Paciente"].ToString();
                string NumeroHistoriaClinica = DatosCabecera.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
                string EstadoCuenta = DatosCabecera.Tables[0].Rows[0]["estadoCta"].ToString();
                string FuenteFinanciamiento = DatosCabecera.Tables[0].Rows[0]["dFuenteFinanciamiento"].ToString();
                string ProductoPlan = DatosCabecera.Tables[0].Rows[0]["dTipoFinanciamiento"].ToString();
                string ServicioEgreso = DatosCabecera.Tables[0].Rows[0]["ServEgreso"].ToString();

                string FechaIngreso = DatosCabecera.Tables[0].Rows[0]["FechaIngreso"].ToString();
                string FechaEgreso = DatosCabecera.Tables[0].Rows[0]["FechaEgreso"].ToString();
                string IdAtencion = DatosCabecera.Tables[0].Rows[0]["IdAtencion"].ToString();
                string Diagnostico = DatosCabecera.Tables[0].Rows[0]["Diagnostico"].ToString();
                string Cama = DatosCabecera.Tables[0].Rows[0]["CamaActual"].ToString();
                string Direccion = DatosCabecera.Tables[0].Rows[0]["DireccionDomicilio"].ToString();
                string Ocupacion = DatosCabecera.Tables[0].Rows[0]["Ocupacion"].ToString();
                string TipoServicio = DatosCabecera.Tables[0].Rows[0]["dTipoServicio"].ToString();
                
                string NivelRiesgos = DatosCabecera.Tables[0].Rows[0]["nivelRiesgos"].ToString();
                string Usuario = usuario;

                Institucion institucion = new Institucion(NombreInstitucion, DireccionInstitucion, TelefonoInstitucion);
                CabeceraPrincipal cabeceraPrincipal = new CabeceraPrincipal(
                    IdCuentaAtencion, NombrePaciente, NumeroHistoriaClinica, EstadoCuenta, FuenteFinanciamiento, ProductoPlan, ServicioEgreso,
                    FechaIngreso, FechaEgreso, IdAtencion, Diagnostico, Cama, Direccion, Ocupacion, TipoServicio, Usuario, NivelRiesgos
                    );

                DatosCabeceraReporte cabeceraReporte = new DatosCabeceraReporte(institucion, cabeceraPrincipal);



                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                Task contenido = null;

                if (modeloReporte == 1)
                {
                    DataSet DatosRptFarmacia = await _dalFacturacion.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 1);
                    DataSet DatosRptServicios = await _dalFacturacion.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 1);
                    DataSet EstanciaHosp = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(Int32.Parse(DatosCabecera.Tables[0].Rows[0]["IdAtencion"].ToString()), 0);

                    DataSet ds = new DataSet();
                    var tablaFarmacia = DatosRptFarmacia.Tables[0].Copy();
                    tablaFarmacia.TableName = "Farmacia";

                    var tablaServicios = DatosRptServicios.Tables[0].Copy();
                    tablaServicios.TableName = "Servicios";

                    var tablaEstancia = EstanciaHosp.Tables[0].Copy();
                    tablaEstancia.TableName = "Estancia";

                    ds.Tables.Add(tablaFarmacia);
                    ds.Tables.Add(tablaServicios);
                    ds.Tables.Add(tablaEstancia);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaPtoCargaDetallado.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaPtoCargaDetallado);
                }
                else if (modeloReporte == 2)
                {
                    DataSet ds = await _dalFacturacion.ReporteEstadoCuentaPorPuntoCarga(idCuentaAtencion);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaPtoCargaConsolidado.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaPtoCargaConsolidado);
                }
                else if (modeloReporte == 3)
                {
                    DataSet ds = new DataSet();
                    DataSet DatosRptServicios = await _dalFacturacion.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 1);
                    DataSet EstanciaHosp = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(Int32.Parse(DatosCabecera.Tables[0].Rows[0]["IdAtencion"].ToString()), 0);

                    var tablaServicios = DatosRptServicios.Tables[0].Copy();
                    tablaServicios.TableName = "Servicios";

                    var tablaEstancia = EstanciaHosp.Tables[0].Copy();
                    tablaEstancia.TableName = "Estancia";

                    ds.Tables.Add(tablaServicios);
                    ds.Tables.Add(tablaEstancia);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaPtoCargaDetallado.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaPtoCargaDetallado);
                }
                else if (modeloReporte == 4)
                {
                    DataSet DatosRptFarmacia = await _dalFacturacion.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 1);
                    DataSet DatosRptServicios = await _dalFacturacion.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 1);
                    DataSet EstanciaHosp = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(Int32.Parse(DatosCabecera.Tables[0].Rows[0]["IdAtencion"].ToString()), 0);

                    DataSet ds = new DataSet();
                    var tablaFarmacia = DatosRptFarmacia.Tables[0].Copy();
                    tablaFarmacia.TableName = "Farmacia";

                    var tablaServicios = DatosRptServicios.Tables[0].Copy();
                    tablaServicios.TableName = "Servicios";

                    var tablaEstancia = EstanciaHosp.Tables[0].Copy();
                    tablaEstancia.TableName = "Estancia";

                    ds.Tables.Add(tablaFarmacia);
                    ds.Tables.Add(tablaServicios);
                    ds.Tables.Add(tablaEstancia);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaLiquidacion.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaLiquidacion);
                }
                else if (modeloReporte == 5)
                {
                    DataSet DatosRptFarmacia = await _dalFacturacion.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 1);
                    DataSet DatosRptServicios = await _dalFacturacion.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 1);

                    DataSet ds = new DataSet();
                    var tablaFarmacia = DatosRptFarmacia.Tables[0].Copy();
                    tablaFarmacia.TableName = "Farmacia";

                    var tablaServicios = DatosRptServicios.Tables[0].Copy();
                    tablaServicios.TableName = "Servicios";

                    ds.Tables.Add(tablaFarmacia);
                    ds.Tables.Add(tablaServicios);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaExoneracion.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaExoneracion);
                }
                else if (modeloReporte == 6)
                {
                    DataSet DatosRptFarmacia = await _dalFacturacion.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion, 1);
                    DataSet DatosRptServicios = await _dalFacturacion.FacturacionServicioDespachoXcuenta(idCuentaAtencion, 1);

                    DataSet ds = new DataSet();
                    var tablaFarmacia = DatosRptFarmacia.Tables[0].Copy();
                    tablaFarmacia.TableName = "Farmacia";

                    var tablaServicios = DatosRptServicios.Tables[0].Copy();
                    tablaServicios.TableName = "Servicios";

                    ds.Tables.Add(tablaFarmacia);
                    ds.Tables.Add(tablaServicios);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaResumenLiquidacion.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaResumenLiquidacion);
                }
                else if (modeloReporte == 7)
                {
                    DataSet ds = new DataSet();

                    var IdCuentaAtencion_Origen = DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion_Origen"].ToString();

                    DataSet DatosRptPtoCargaConsolidado = await _dalFacturacion.ReporteEstadoCuentaPorPuntoCarga(idCuentaAtencion);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    var tablaConsolidado = DatosRptPtoCargaConsolidado.Tables[0].Copy();
                    tablaConsolidado.TableName = "Consolidado1";
                    ds.Tables.Add(tablaConsolidado);

                    if (IdCuentaAtencion_Origen != "")
                    {
                        DataSet DatosCabecera2 = await _dalFacturacion.AtencionesFiltraDatosCabecera(Int32.Parse(IdCuentaAtencion_Origen));

                        IdCuentaAtencion = DatosCabecera2.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
                        NombrePaciente = DatosCabecera2.Tables[0].Rows[0]["Paciente"].ToString();
                        NumeroHistoriaClinica = DatosCabecera2.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
                        EstadoCuenta = DatosCabecera2.Tables[0].Rows[0]["estadoCta"].ToString();
                        FuenteFinanciamiento = DatosCabecera2.Tables[0].Rows[0]["dFuenteFinanciamiento"].ToString();
                        ProductoPlan = DatosCabecera2.Tables[0].Rows[0]["dTipoFinanciamiento"].ToString();
                        ServicioEgreso = DatosCabecera2.Tables[0].Rows[0]["ServEgreso"].ToString();

                        FechaIngreso = DatosCabecera2.Tables[0].Rows[0]["FechaIngreso"].ToString();
                        FechaEgreso = DatosCabecera2.Tables[0].Rows[0]["FechaEgreso"].ToString();
                        IdAtencion = DatosCabecera2.Tables[0].Rows[0]["IdAtencion"].ToString();
                        Diagnostico = DatosCabecera2.Tables[0].Rows[0]["Diagnostico"].ToString();
                        Cama = DatosCabecera2.Tables[0].Rows[0]["CamaActual"].ToString();
                        Direccion = DatosCabecera2.Tables[0].Rows[0]["DireccionDomicilio"].ToString();
                        Ocupacion = DatosCabecera2.Tables[0].Rows[0]["Ocupacion"].ToString();
                        TipoServicio = DatosCabecera2.Tables[0].Rows[0]["dTipoServicio"].ToString();
                        Usuario = usuario;

                        CabeceraPrincipal cabecera2 = new CabeceraPrincipal(
                        IdCuentaAtencion, NombrePaciente, NumeroHistoriaClinica, EstadoCuenta, FuenteFinanciamiento, ProductoPlan, ServicioEgreso,
                        FechaIngreso, FechaEgreso, IdAtencion, Diagnostico, Cama, Direccion, Ocupacion, TipoServicio, Usuario
                        );

                        DatosCabeceraReporte cabeceraReporte2 = new DatosCabeceraReporte(institucion, cabecera2);
                        cabeceras.Add(cabeceraReporte2);

                        DataSet DatosRptPtoCargaConsolidado2 = await _dalFacturacion.ReporteEstadoCuentaPorPuntoCarga(Int32.Parse(IdCuentaAtencion_Origen));

                        var tablaConsolidado2 = DatosRptPtoCargaConsolidado2.Tables[0].Copy();
                        tablaConsolidado2.TableName = "Consolidado2";

                        ds.Tables.Add(tablaConsolidado2);
                    }




                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaPtoCargaConsolidado.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaPtoCargaConsolidado);
                    // return null;
                }
                else if (modeloReporte == 8)
                {
                    DataSet ds = new DataSet();

                    var IdCuentaAtencion_Origen = DatosCabecera.Tables[0].Rows[0]["IdCuentaAtencion_Origen"].ToString();

                    DataSet DatosRptPtoCargaConsolidado = await _dalFacturacion.ReporteEstadoCuentaPorPuntoCarga(idCuentaAtencion);

                    List<DatosCabeceraReporte> cabeceras = new List<DatosCabeceraReporte>();
                    cabeceras.Add(cabeceraReporte);

                    var tablaConsolidado = DatosRptPtoCargaConsolidado.Tables[0].Copy();
                    tablaConsolidado.TableName = "Consolidado1";
                    ds.Tables.Add(tablaConsolidado);

                    if (IdCuentaAtencion_Origen != "")
                    {
                        DataSet DatosCabecera2 = await _dalFacturacion.AtencionesFiltraDatosCabecera(Int32.Parse(IdCuentaAtencion_Origen));

                        IdCuentaAtencion = DatosCabecera2.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
                        NombrePaciente = DatosCabecera2.Tables[0].Rows[0]["Paciente"].ToString();
                        NumeroHistoriaClinica = DatosCabecera2.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
                        EstadoCuenta = DatosCabecera2.Tables[0].Rows[0]["estadoCta"].ToString();
                        FuenteFinanciamiento = DatosCabecera2.Tables[0].Rows[0]["dFuenteFinanciamiento"].ToString();
                        ProductoPlan = DatosCabecera2.Tables[0].Rows[0]["dTipoFinanciamiento"].ToString();
                        ServicioEgreso = DatosCabecera2.Tables[0].Rows[0]["ServEgreso"].ToString();

                        FechaIngreso = DatosCabecera2.Tables[0].Rows[0]["FechaIngreso"].ToString();
                        FechaEgreso = DatosCabecera2.Tables[0].Rows[0]["FechaEgreso"].ToString();
                        IdAtencion = DatosCabecera2.Tables[0].Rows[0]["IdAtencion"].ToString();
                        Diagnostico = DatosCabecera2.Tables[0].Rows[0]["Diagnostico"].ToString();
                        Cama = DatosCabecera2.Tables[0].Rows[0]["CamaActual"].ToString();
                        Direccion = DatosCabecera2.Tables[0].Rows[0]["DireccionDomicilio"].ToString();
                        Ocupacion = DatosCabecera2.Tables[0].Rows[0]["Ocupacion"].ToString();
                        TipoServicio = DatosCabecera2.Tables[0].Rows[0]["dTipoServicio"].ToString();
                        Usuario = usuario;

                        CabeceraPrincipal cabecera2 = new CabeceraPrincipal(
                        IdCuentaAtencion, NombrePaciente, NumeroHistoriaClinica, EstadoCuenta, FuenteFinanciamiento, ProductoPlan, ServicioEgreso,
                        FechaIngreso, FechaEgreso, IdAtencion, Diagnostico, Cama, Direccion, Ocupacion, TipoServicio, Usuario
                        );

                        DatosCabeceraReporte cabeceraReporte2 = new DatosCabeceraReporte(institucion, cabecera2);
                        cabeceras.Add(cabeceraReporte2);

                        DataSet DatosRptPtoCargaConsolidado2 = await _dalFacturacion.ReporteEstadoCuentaPorPuntoCarga(Int32.Parse(IdCuentaAtencion_Origen));

                        var tablaConsolidado2 = DatosRptPtoCargaConsolidado2.Tables[0].Copy();
                        tablaConsolidado2.TableName = "Consolidado2";

                        ds.Tables.Add(tablaConsolidado2);
                    }




                    string plantilla = "Plantilla/Facturacion/ReporteEstadoCuentaPtoCargaConsolidado.xlsx";
                    contenido = _estadoCuentaReportExcelService
                                    .GenerarEstadoCuentaExcelAsync(ip, plantilla, ds, cabeceras, ModeloReporte.EstadoCuentaPtoCargaConsolidado);
                }

                return Ok(new { session = true, estado = true, ruta = contenido });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Ok(new { session = true, estado = true, ruta = e.Message });
                throw;
            }
        }
    }
}