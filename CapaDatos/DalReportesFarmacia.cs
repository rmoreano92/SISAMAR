using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static CapaEntidades.ListBarItemEnum;

namespace CapaDatos
{
    public class DalReportesFarmacia
    {
        public Task<DataSet> ListarDisponibilidadFarmacia(int IdAlmacen = 0)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarDisponibilidadFarmacia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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
        public Task<DataSet> ListarAnaqueles(int IdAlmacen = 0)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ListarAnaqueles";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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

        public Task<DataSet> ListarSaldosPorAlmacen(int idAlmacen, int idTipoBusqueda)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarSaldosPorAlmacen";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.CommandTimeout = 1000;

                            cmd.Parameters.AddWithValue("@idAlmacen", idAlmacen);
                            cmd.Parameters.AddWithValue("@idTipoBusqueda", idTipoBusqueda);

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

       
        public Task<DataSet> GenerarCabeceraICI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_GenerarCabeceraICI";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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
        public Task<DataSet> GenerarICI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
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
                            string sql = "web_GenerarICI";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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

        public Task<DataSet> GenerarICI_MGP(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
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
                            string sql = "web_FarmaciaRep_ICI_MGP";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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
        public Task<DataSet> GenerarICIDonaciones(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_GenerarICIDonaciones";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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

        
        public Task<DataSet> GenerarCabeceraIDI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
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
                            string sql = "web_GenerarCabeceraIDI";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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
        public Task<DataSet> GenerarIDI(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
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
                            string sql = "web_GenerarIDI";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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
        public Task<DataSet> GenerarIDIDonaciones(DateTime FechaInicio, DateTime FechaFin, int IdAlmacen)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_GenerarIDIDonaciones";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);

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

        public Task<DataSet> ListarSaldosPorAlmacenConFechaCorte(int idTipoAlmacen, DateTime fechaCorte)
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
                            string sql = "Web_ListarSaldosPorAlmacenConFechaCorte";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idTipoAlmacen", idTipoAlmacen);
                            cmd.Parameters.AddWithValue("@fechaCorte", fechaCorte);

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

        ////////////////////////////////////////////////KHOYOSI////////////////////////////////////////////////////
        public Task<DataSet> ListarUsuarioFarmaciaConsumoServicio()
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
                            string sql = "web_ListarUsuariosFarmaciaConsumoServicio";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> EmpleadosSeleccionarTodos()
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
                            string sql = "EmpleadosSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> ListarConsumoServicioFarmacia(string fechaInicio, string fechaFin, int idUsuario)
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
                            string sql = "web_ListarConsumoServicioFarmacia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;
                                                        
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@IdEmpleado", idUsuario);

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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        public Task<DataSet> ListarProductosEnDesabastecimiento()
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
                            string sql = "Web_ListarProductosEnDesabastecimiento";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@idTipoAlmacen", idTipoAlmacen);
                            //cmd.Parameters.AddWithValue("@fechaCorte", fechaCorte);

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

        public Task<DataSet> ListarProductosEnSobrestock()
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
                            string sql = "Web_ListarProductosEnSobrestock";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@idTipoAlmacen", idTipoAlmacen);
                            //cmd.Parameters.AddWithValue("@fechaCorte", fechaCorte);

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

        public Task<DataSet> ListarMedicamentosPorVencer(int rango, int tipo)
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
                            string sql = "Web_ListarMedicamentosPorVencer";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@Rango", rango);
                            cmd.Parameters.AddWithValue("@Tipo", tipo);

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
        ////////////////////////////////////////////////KHOYOSI (RECETAS EMITIDAS)////////////////////////////////////////////////////        
        public Task<DataSet> ListarRecetasEmitidas(string fechaInicio, string fechaFin, int idUsuario, int idEstado)
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
                            string sql = "web_ListarRecetasEmitidas";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@IdMedico", idUsuario);
                            cmd.Parameters.AddWithValue("@IdEstado", idEstado);

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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        public Task<DataSet> SeleccionarMovimientosReporteFajos(DateTime? FechaInicio, DateTime? FechaFin, int? idAlmacen, string movTipo, int idUsuario, int idTipoFinanciamiento, int idTipoServicio, int idServicio)
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
                            string sql = "Web_SeleccionarMovimientosReporteFajos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@idAlmacen", idAlmacen);
                            cmd.Parameters.AddWithValue("@movTipo", movTipo);
                            cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@idTipoFinanciamiento", idTipoFinanciamiento);
                            cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                            cmd.Parameters.AddWithValue("@idServicio", idServicio);

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

        public Task<DataSet> RptRecetasPorServicio(int? IdAlmacen, int? IdTipo, DateTime? FechaInicio, DateTime? FechaFin)
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
                            string sql = "Web_RptRecetasPorServicio";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);
                            cmd.Parameters.AddWithValue("@IdTipo", IdTipo);
                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);

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

        public Task<DataSet> CajaCajaSeleccionarTodos()
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
                            string sql = "CajaCajaSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> CajaTurnoSeleccionarTodos()
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
                            string sql = "CajaTurnoSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> CajerosSeleccionarTodos()
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
                            string sql = "CajerosSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> CajaTiposComprobanteSeleccionarTodos()
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
                            string sql = "CajaTiposComprobanteSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> RegistroDeVentas(DateTime? FechaInicio, DateTime? FechaFin, int? IdCaja, int? IdTurno, int? IdCajero, int? IdTipoComprobante, int? IdTipoReporte, int? IdVendedorFarmacia, int? IdTipo, int? IdFarmacia)
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
                            string sql = "Web_RegistroDeVentas";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdCaja", IdCaja);
                            cmd.Parameters.AddWithValue("@IdTurno", IdTurno);
                            cmd.Parameters.AddWithValue("@IdCajero", IdCajero);
                            cmd.Parameters.AddWithValue("@IdTipoComprobante", IdTipoComprobante);
                            cmd.Parameters.AddWithValue("@IdTipoReporte", IdTipoReporte);
                            cmd.Parameters.AddWithValue("@IdVendedorFarmacia", IdVendedorFarmacia);
                            cmd.Parameters.AddWithValue("@IdTipo", IdTipo);
                            cmd.Parameters.AddWithValue("@IdFarmacia", IdFarmacia);

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

        public Task<DataSet> ReporteConsumoPorServicioFarmacia(DateTime FechaInicio, DateTime FechaFin, int IdAlmacenOrigen, int IdTipoServicio)
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
                            string sql = "Web_ReporteConsumoPorServicioFarmacia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                            cmd.Parameters.AddWithValue("@IdAlmacenOrigen", IdAlmacenOrigen);
                            cmd.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);

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


        public Task<DataSet> ListarReporteTotalVentas(int idFarmacia, string fechaInicio, string fechaFin, int tipoReporte)
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
                            string sql = "web_ReporteTotalVentasFarmacia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdFarmacia", idFarmacia);
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
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



        ////////////////////REPORTE PSICOTROPICOS////////////////////////////////////////////////////////////////////////////        
        public Task<DataSet> ListarReportePsicotropicos(int idFarmacia, string tipo, string fechaInicio, string horaInicio, string fechaFin, string horaFin)
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
                            string sql = "web_ReportePsicotropicosFarmacia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdFarmacia", idFarmacia);
                            cmd.Parameters.AddWithValue("@Tipo", tipo);
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@HoraInicio", horaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@HoraFin", horaFin);


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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////REPORTE ANTIMICROBIANOS////////////////////////////////////////////////////////////////////////////        
        public Task<DataSet> ListarReporteAntimicrobianos(int idFarmacia, int idServicio, string fechaInicio,string fechaFin)
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
                            string sql = "web_ReporteAntimicrobianosFarmacia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdFarmacia", idFarmacia);
                            cmd.Parameters.AddWithValue("@IdServicio", idServicio);
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            //cmd.Parameters.AddWithValue("@HoraInicio", horaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            //cmd.Parameters.AddWithValue("@HoraFin", horaFin);


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

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    }
}
