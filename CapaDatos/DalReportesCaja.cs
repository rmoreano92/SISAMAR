using CapaDatos;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using static CapaEntidades.ListBarItemEnum;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalReportesCaja
    {
        public Task<DataSet> ListarReporteConsolidadoVentas(int idTipoReporte, int idTipoConsumo, string fechaInicio, string fechaFin, int idTipoComprobante, int idCaja, int idTurno, int idCajero, int idFarmacia, int idVendedor)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ReporteConsolidadoVentas";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@TipoReporte", idTipoReporte);
                            cmd.Parameters.AddWithValue("@TipoConsumo", idTipoConsumo);
                            cmd.Parameters.AddWithValue("@FechaHoraInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaHoraFin", fechaFin);
                            cmd.Parameters.AddWithValue("@IdTipoComprobante", idTipoComprobante);
                            cmd.Parameters.AddWithValue("@IdCaja", idCaja);
                            cmd.Parameters.AddWithValue("@IdTurno", idTurno);
                            cmd.Parameters.AddWithValue("@IdCajero", idCajero);
                            cmd.Parameters.AddWithValue("@IdFarmacia", idFarmacia);
                            cmd.Parameters.AddWithValue("@IdVendedor", idVendedor);
                                                       
                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarReporteResumenPorPartida(string fechaInicio, string fechaFin, int idCaja, int idCajero, int soloMayorCero, int incluyeNotasCredito)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ReporteResumenPorPartida";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;
                                                        
                            cmd.Parameters.AddWithValue("@FechaHoraInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaHoraFin", fechaFin);
                            cmd.Parameters.AddWithValue("@IdCaja", idCaja);
                            cmd.Parameters.AddWithValue("@IdCajero", idCajero);
                            cmd.Parameters.AddWithValue("@SoloMayorCero", soloMayorCero);
                            cmd.Parameters.AddWithValue("@IncluyeNotasCredito", incluyeNotasCredito);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarReporteConsolidadoRecaudacion(string fechaInicio, string fechaFin, int idCajero, int tipoReporte)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ReporteConsolidadoRecaudacion";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);                            
                            cmd.Parameters.AddWithValue("@IdCajero", idCajero);
                            cmd.Parameters.AddWithValue("@TipoReporte", tipoReporte);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }



    }
}
