using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using CapaEntidades;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using System;

namespace WebAppMaternidad.CapaDatos
{
    public class DalTurnos
    {
        public Task<DataSet> ListarTurnos(string nombre)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarTurnos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (object)nombre ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarTiposServiciosAsistenciales()
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposServicioSeleccionarAsistenciales";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.Int).Value = (object)nombre ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarRefConTurnosUPS()
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "RefConTurnosUPSSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.Int).Value = (object)nombre ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TurnosSeleccionarPorId(int idTurno)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TurnosSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = (object)idTurno ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TurnosSeleccionarPorTipoServicio(int idTipoServicio)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TurnosSeleccionarPorIdTipoServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = (object)idTipoServicio ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TurnosModificar(Turno turno, int idUsuario)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TurnosModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = (object)turno.IdTurno ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Codigo", SqlDbType.VarChar).Value = (object)turno.Codigo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = (object)turno.Descripcion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = (object)turno.HoraInicio ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HoraFin", SqlDbType.VarChar).Value = (object)turno.HoraFin ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = (object)turno.IdTipoServicio ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoTurnoRef", SqlDbType.Int).Value = (object)turno.IdTipoTurno ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = (object)idUsuario ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TurnosEliminar(int idTurno, int idUsuario)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TurnosEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = (object)idTurno ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = (object)idUsuario ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }



    }
}
