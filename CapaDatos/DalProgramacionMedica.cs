using CapaDatos;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalProgramacionMedica
    {
        public Task<DataSet> ListarProgramacionMedica(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, string fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarProgramacionMedica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@FechaProgramacion", SqlDbType.VarChar).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarProgramacionMedicaPorRango(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, string fechaInicio, string fechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarProgramacionMedicaPorRango";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@FechaInicioProgramacion", SqlDbType.VarChar).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFinProgramacion", SqlDbType.VarChar).Value = fechaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarProgramacionMedicaMensual(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, int anio, int mes)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarProgramacionMedicaMensual";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@Anio", SqlDbType.VarChar).Value = anio;
                        da.SelectCommand.Parameters.Add("@Mes", SqlDbType.VarChar).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarTiposProgramacion()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "TiposProgramacionSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ProgramacionMedicaSeleccionar(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ProgramacionMedicaModificar(ProgramacionMedica prog, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        //string sql = "web_ProgramacionMedicaModificar";
                        string sql = "web_ProgramacionMedicaModificarV2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = prog.IdProgramacion;
                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = prog.IdTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = prog.IdEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = prog.IdServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = prog.IdMedico;
                        da.SelectCommand.Parameters.Add("@Fechas", SqlDbType.VarChar).Value = prog.FechaInicio;
                        //da.SelectCommand.Parameters.Add("@FechaFinal", SqlDbType.VarChar).Value = prog.FechaFinal;
                        da.SelectCommand.Parameters.Add("@IdTipoProgramacion", SqlDbType.Int).Value = prog.IdTipoProgramacion;
                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = prog.IdTurno;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = prog.HoraInicio;
                        da.SelectCommand.Parameters.Add("@HoraFinal", SqlDbType.VarChar).Value = prog.HoraFinal;
                        da.SelectCommand.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = (object)prog.Descripcion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Color", SqlDbType.Int).Value = (object)prog.Color ?? DBNull.Value;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ProgramacionMedicaEliminar(int idProgramacion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }


    }
}
