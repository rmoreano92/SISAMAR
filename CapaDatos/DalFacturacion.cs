using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.CapaEntidades;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace WebAppMaternidad.CapaDatos
{
    public class DalFacturacion
    {
        public Task<DataSet> AreaTramitaSegurosDevuelveTodosSegunFiltro(string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "AreaTramitaSegurosDevuelveTodosSegunFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = (Filtro == null) ? "" : Filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public async Task<DataSet> ServicioFinanciamientosPorNroCuenta(int? idCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ServicioFinanciamientosPorNroCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> FarmaciaFinanciamientosPorNroCuenta(int? idCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmaciaFinanciamientosPorNroCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta(int? idCuentaAtencion, int? idProducto) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CajaComprobantesPagoSeleccionarPagosACuentaPorIdCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdProducto", idProducto);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<int> FacturacionCuentasAtencionPendientePagoSeguro(int? IdCuentaAtencion, int? IdUsuarioAuditoria, string HoraCierre, string DeudaPendiente) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FacturacionCuentasAtencionPendientePagoSeguro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@lcHoraCierre", HoraCierre);
                cmd.Parameters.AddWithValue("@lnDeudaPendiente", DeudaPendiente);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return 1;
            }
        }

        public async Task<int> FacturacionCuentasAtencionCerradoAutomatico(int? IdCuentaAtencion, int? IdUsuarioAuditoria, string HoraCierre) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FacturacionCuentasAtencionCerradoAutomatico", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@lcHoraCierre", HoraCierre);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return 1;
            }
        }
        
        public async Task<DataSet> AtencionesSeleccionarPorTipoServicio(int? idTipoServicio, DateTime? FechaIni, DateTime? FechaFin) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("AtencionesSeleccionarPorTipoServicio", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@FechaIni", FechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> FactOrdenServicioPreventasServicio(DateTime? FechaInicio, DateTime? FechaFin) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FactOrdenServicioPreventasServicio", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> farmMovimientoVentasExoneracionesEnFarmacia(DateTime? FechaInicio, DateTime? FechaFin) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmMovimientoVentasExoneracionesEnFarmacia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> AtencionesSeleccionarPacExtPorFechas(DateTime? ldFechaIni, DateTime? ldFechaFin) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("AtencionesSeleccionarPacExtPorFechas", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ldFechaIni", ldFechaIni);
                cmd.Parameters.AddWithValue("@ldFechaFin", ldFechaFin);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> AtencionesFiltraDatosCabecera(int IdCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_AtencionesFiltraDatosCabecera", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> FacturacionServicioDespachoXcuenta(int idCuentaAtencion, int OrderByPuntoCarga) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionServicioDespachoXcuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@OrderByPuntoCarga", OrderByPuntoCarga);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion, int OrderByDocumentoNumero) 
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FarmMovimientoVentasDetalleXcuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@OrderByDocumentoNumero", OrderByDocumentoNumero);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta(int IdtipoFinanciamiento) 
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdtipoFinanciamiento", IdtipoFinanciamiento);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> ListarConsolidadoPorEstadoCuenta(int idCuentaAtencion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarConsolidadoPorEstadoCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> AtencionesListaCuentasXpaciente(int IdPaciente) 
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_AtencionesListaCuentasXpaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> ValidarPermisoAbrirCuentas(int? IdUsuario)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ValidarPermisoAbrirCuentas", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> FacturacionCuentasAtencionPagada(int IdCuentaAtencion, int IdPaciente, int? IdUsuarioAuditoria, int IdListItem) 
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionCuentasAtencionPagada", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> FacturacionCuentasAtencionPendientePagoSeguroEstadoCuenta(int IdCuentaAtencion, int IdPaciente, int? IdUsuarioAuditoria, int IdListItem) 
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionCuentasAtencionPendientePagoSeguro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        
        public async Task<DataSet> FacturacionCuentasAtencionAbrir(int IdCuentaAtencion, int? IdUsuarioAuditoria, int IdListItem) 
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionCuentasAtencionAbrir", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> FacturacionCuentasAtencionCerrar(int IdCuentaAtencion, int IdPaciente, int? IdUsuarioAuditoria, int IdListItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionCuentasAtencionCerrar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> FacturacionCuentasAtencionAnulada(int IdCuentaAtencion, int IdPaciente, int? IdUsuarioAuditoria, int IdListItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionCuentasAtencionAnulada", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> FacturacionCuentasAtencionAltaConDeudaYGarante(int IdCuentaAtencion, int IdPaciente, int? IdUsuarioAuditoria, int IdListItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FacturacionCuentasAtencionAltaConDeudaYGarante", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> ReporteEstadoCuentaPorPuntoCarga(int idCuentaAtencion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteEstadoCuentaPorPuntoCarga", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> ReporteEstadoCuentaPorServicio(int idCuentaAtencion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteEstadoCuentaPorServicio", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> GenerarExoneracionCuentaPaciente(
              int IdCuentaAtencion, List<ServiciosEstadoCuenta> lstObjServicios, List<FarmaciaEstadoCuenta> lstObjFarmacias, int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            string xmlServiciosDetalle;
            string xmlFarmaciaDetalle;
            xmlServiciosDetalle = XmlUtil.Serializer(typeof(List<ServiciosEstadoCuenta>), lstObjServicios);
            xmlFarmaciaDetalle = XmlUtil.Serializer(typeof(List<FarmaciaEstadoCuenta>), lstObjFarmacias);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_GenerarExoneracionCuentaPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.Add("@serviciosDetalle", SqlDbType.Xml).Value = xmlServiciosDetalle;
                cmd.Parameters.Add("@farmaciaDetalle", SqlDbType.Xml).Value = xmlFarmaciaDetalle;
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> CambiarFuenteFinancimiento(int IdFuenteFinanciamiento, int IdTipoFinanciamiento, int IdCuentaAtencion, int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CambiarFuenteFinancimiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento);
                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", IdTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> PacientesFiltrarTodosSoloHistorias(
            int nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string segundoNombre, int idDocIdentidad, string nroDocumento)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_PacientesFiltrarTodosSoloHistorias", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@NroHistoriaClinica", SqlDbType.Int).Value = nroHistoriaClinica;
                cmd.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno != null ? apellidoPaterno : "";
                cmd.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = apellidoMaterno != null ? apellidoMaterno : "";
                cmd.Parameters.Add("@primerNombre", SqlDbType.VarChar).Value = primerNombre != null ? primerNombre : "";
                cmd.Parameters.Add("@segundoNombre", SqlDbType.VarChar).Value = segundoNombre != null ? segundoNombre : "";
                cmd.Parameters.Add("@idDocIdentidad", SqlDbType.Int).Value = idDocIdentidad;
                cmd.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = nroDocumento != null ? nroDocumento : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }


    }
}
