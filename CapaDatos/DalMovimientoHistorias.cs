using CapaDatos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalMovimientoHistorias
    {

        public Task<DataSet> MovimientoHistoriasListar(string historia, string apPaterno, string apMaterno, string nombres, string fechamov)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_MovimientosHistoriaClinicaListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.VarChar).Value = (object)historia ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@ApPaterno", SqlDbType.VarChar).Value = (object)apPaterno ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@ApMaterno", SqlDbType.VarChar).Value = (object)apMaterno ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = (object)nombres ?? DBNull.Value;
                            da.SelectCommand.Parameters.Add("@FechaMovimiento", SqlDbType.VarChar).Value = (object)fechamov ?? DBNull.Value;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception)
                {
                    ds = null; throw;
                }

            });
        }

        public Task<DataSet> ListarMotivos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "MotivosMovimientoHistoriaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FiltrarServicios(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ServiciosFiltrarPorIdArchiveroTipoServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@lcFiltro", filtro);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> MovimientoHistoriaSeleccionar(int idMovimiento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_MovimientoHistoriaClinicaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", idMovimiento);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> MovimientoHistoriaGuardar(MovimientoHistoriaClinica movimientoHistoria, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_MovimientoHistoriaClinicaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", movimientoHistoria.IdMovimiento);
                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", movimientoHistoria.IdPaciente);
                        da.SelectCommand.Parameters.AddWithValue("@IdMotivo", movimientoHistoria.IdMotivo);
                        da.SelectCommand.Parameters.AddWithValue("@IdServicioOrigen", movimientoHistoria.IdServicioOrigen);
                        da.SelectCommand.Parameters.AddWithValue("@IdServicioDestino", movimientoHistoria.IdServicioDestino);
                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleadoArchivo", movimientoHistoria.IdEmpleadoArchivo);
                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleadoTransporte", movimientoHistoria.IdEmpleadoTransporte);
                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleadoRecepcion", movimientoHistoria.IdEmpleadoRecepcion);
                        da.SelectCommand.Parameters.AddWithValue("@Observacion", movimientoHistoria.Observacion);
                        
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> MovimientoHistoriaEliminar(int idMovimiento, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_MovimientoHistoriaClinicaEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", idMovimiento);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }




    }
}
