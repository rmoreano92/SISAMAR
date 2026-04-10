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
    public class DalReprogramacionMedica
    {

        public Task<DataSet> ListarServiciosPorFechaEspecialidad(int idTipoServicio, int idEspecialidad, int activaProcedimiento, string fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ServiciosSeleccionarPorFechaProgramacionPorEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@FechaProgramacion", SqlDbType.VarChar).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarProgramacionMedicaCuposDisponibles(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSeleccionarCuposDisponibles";
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

        public Task<DataSet> SeleccionarProgramacionMedica(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSeleccionarPorIdProgramacion";
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

        public Task<DataSet> SeleccionarCitasProgramadass(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_CitasSeleccionarPorIdProgramacion_V2";
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

        public Task<DataSet> GuardarReprogramacionMedicaPorPaciente(int idCuenta, int idProgramacion, string horaInicio, string horaFin, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ReprogramacionMedicaPorPacienteModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = idCuenta;
                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;
                        //da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.Int).Value = fecha;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = horaInicio;
                        da.SelectCommand.Parameters.Add("@HoraFin", SqlDbType.VarChar).Value = horaFin;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        //da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }


        public Task<DataSet> ListarProgramacionMedicaPorFecha(string fecha, int idMedico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSeleccionarPorFecha";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.VarChar).Value = fecha;
                        da.SelectCommand.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarMedicosPorEspecialidad(int idEspecialidad)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarMedicosPorEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> GuardarReprogramacionMedicaPorServicio(int idProgramacion, string horaInicio, string horaFin, int tipoReprogramacion, string fechaNueva, int idMedicoNuevo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ReprogramacionMedicaPorServicioModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;                        
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = horaInicio;
                        da.SelectCommand.Parameters.Add("@HoraFin", SqlDbType.VarChar).Value = horaFin;
                        da.SelectCommand.Parameters.Add("@TipoReprogramacion", SqlDbType.Int).Value = tipoReprogramacion;
                        da.SelectCommand.Parameters.Add("@FechaNueva", SqlDbType.VarChar).Value = fechaNueva;
                        da.SelectCommand.Parameters.Add("@IdMedicoNuevo", SqlDbType.Int).Value = idMedicoNuevo;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;                        

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> GuardarReprogramacionCitaProcedimientoPorPaciente(int idCita, int idProgramacion, string horaInicio, string horaFin, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ReprogramacionCitaProcedimientoPorPacienteModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCita", SqlDbType.Int).Value = idCita;
                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;
                        //da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.Int).Value = fecha;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = horaInicio;
                        da.SelectCommand.Parameters.Add("@HoraFin", SqlDbType.VarChar).Value = horaFin;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        //da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }


    }
}
