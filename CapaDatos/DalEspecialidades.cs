using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalEspecialidades
    {
        public Task<DataSet> DepartamentosHospitalSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DepartamentosHospitalSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EspecialidadesSeleccionarPorDepartamento(int idDepartamento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EspecialidadesSeleccionarPorDepartamento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<DataSet> DevuelveEspecialidadesDelHospitalfiltro(string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DevuelveEspecialidadesDelHospitalfiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = (Filtro == null) ? "" : Filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EspecialidadesSeleccionarPorMedico(int idMedico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EspecialidadesSeleccionarPorMedico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EspecialidadesSeleccionarPorMedicoYDepartamento(int idMedico,int idDepartamento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_especialidadesSeleccionarPorMedicoYDepartamento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public async Task<DataSet> EspecialidadesFiltrar(string lcFiltro)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_EspecialidadesFiltrar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@lcFiltro", lcFiltro ?? "");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<int> CrearModificarEspecialidad(int? IdEspecialidad, string Nombre, int IdDepartamento, int? TiempoPromedioAtencion, int? IdEspecialidadCE, int? IdProductoConsulta, int? IdProductoInterconsulta)
        {
            int idResultado = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("Web_CrearModificarEspecialidad", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros
                    cmd.Parameters.AddWithValue("@IdEspecialidad", (object)IdEspecialidad ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Nombre", Nombre);
                    cmd.Parameters.AddWithValue("@IdDepartamento", IdDepartamento);
                    cmd.Parameters.AddWithValue("@TiempoPromedioAtencion", (object)TiempoPromedioAtencion ?? DBNull.Value);

                    cmd.Parameters.AddWithValue("@IdEspecialidadCE", (object)IdEspecialidadCE ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@IdProductoConsulta", (object)IdProductoConsulta ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@IdProductoInterconsulta", (object)IdProductoInterconsulta ?? DBNull.Value);

                    // Ejecuta y obtiene el ID resultante
                    object result = await cmd.ExecuteNonQueryAsync();
                    idResultado = result != null ? Convert.ToInt32(result) : 0;
                }

                await conn.CloseAsync();
            }

            return idResultado;
        }

    }
}
