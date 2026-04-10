using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using System;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalCitasProcedimientos
    {
        public async Task<DataSet> ListarCitasProcedimientos(int idMovimiento, string nombres)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CitasProcedimientosListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = idMovimiento;
                        da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = nombres;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar citas procedimientos", ex);
            }

        }

        public async Task<DataSet> ListarCuposCitasProcedimientos(int idProgramacion)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarCuposCitasProcedimientos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar cupos procedimientos", ex);
            }

        }

        public Task<DataSet> GuardarCitaProcedimientoBoqueada(int idProgramacion, string horaInicio, string horaFin, int idUsuario, int accion, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_CitaProcedimientosBloqueadosModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = horaInicio;
                        da.SelectCommand.Parameters.Add("@HoraFin", SqlDbType.VarChar).Value = horaFin;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@Accion", SqlDbType.Int).Value = accion;
                        da.SelectCommand.Parameters.Add("@IdListBar", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> LimpiarCitaProcedimientoBoqueada(int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_CitaProcedimientosBloqueadosLimpiar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListBar", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public async Task<DataSet> SeleccionarCitaProcedimiento(int idCita)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CitaProcedimientosSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdCita", SqlDbType.Int).Value = idCita;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar cita procedimiento", ex);
            }

        }

        public Task<DataSet> GuardarCitaProcedimiento(int idProgramacion, int idMovimiento, string horaInicio, string horaFin, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_CitaProcedimientosModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;
                        da.SelectCommand.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = idMovimiento;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = horaInicio;
                        da.SelectCommand.Parameters.Add("@HoraFin", SqlDbType.VarChar).Value = horaFin;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListBar", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> EliminarCitaProcedimiento(int idCita, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_CitaProcedimientosEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCita", SqlDbType.Int).Value = idCita;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListBar", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        


    }
}
