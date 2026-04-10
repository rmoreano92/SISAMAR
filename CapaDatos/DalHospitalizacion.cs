using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
namespace CapaDatos
{
    public class DalHospitalizacion
    {
        public Task<DataSet> ListarAtencionesHospitalizacion(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string fechaFin, string dni, int idServicio, string fechaTransferencia, int tipoBusqueda) //jdelgado010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    DataSet ds = new DataSet();
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarAtencionesHospitalizacion";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;
                            da.SelectCommand.CommandTimeout = 300;

                            da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@historiaClinica", SqlDbType.Int).Value = historiaClinica;
                            da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = ((apellidoPaterno == null) ? "" : apellidoPaterno);
                            da.SelectCommand.Parameters.Add("@fechaIngreso", SqlDbType.VarChar).Value = ((fechaIngreso == null) ? "" : fechaIngreso);
                            da.SelectCommand.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = ((fechaFin == null) ? "" : fechaFin);
                            da.SelectCommand.Parameters.Add("@dni", SqlDbType.VarChar).Value = ((dni == null) ? "" : dni);
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.VarChar).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@fechaTransferencia", SqlDbType.VarChar).Value = ((fechaTransferencia == null) ? "" : fechaTransferencia);
                            da.SelectCommand.Parameters.Add("@TipoBusqueda", SqlDbType.Int).Value = tipoBusqueda;             //Busqueda Tradiconal: 1       Sin Alta Medica: 2        Sin Recepcion: 3        Sin Alta Admisnitrativa: 4

                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {

                            ds = null; throw new Exception(ex.Message);
                        }
                        finally
                        {
                            conn.Close();
                        }
                        return ds;
                    }
                }
            });
        }

        public DataSet ListaEvaluacionesEmgHospByServico(int idCuentaAtencion, int historiaClinica, string apellidoPaterno, string fechaIngreso, string dni, int idServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaEvaluacionesEmgHospByServico");
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@historiaClinica", historiaClinica);
                cmd.Parameters.AddWithValue("@apellidoPaterno", ((apellidoPaterno == null) ? "" : apellidoPaterno));
                cmd.Parameters.AddWithValue("@fechaRegistro", ((fechaIngreso == null) ? "" : fechaIngreso));
                cmd.Parameters.AddWithValue("@dni", ((dni == null) ? "" : dni));
                cmd.Parameters.AddWithValue("@idServicio", idServicio);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta(int idReceta, int historiaClinica, string apellidoPaterno, string fechaIngreso, string dni, int idServicio) //jdelgado010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    DataSet ds = new DataSet();
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListaPacientesHospitalizadosByCuentaHcApellidoPatDniFechaInterconsulta";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;
                            da.SelectCommand.Parameters.Add("@historiaClinica", SqlDbType.Int).Value = historiaClinica;
                            da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = ((apellidoPaterno == null) ? "" : apellidoPaterno);
                            da.SelectCommand.Parameters.Add("@fechaIngreso", SqlDbType.VarChar).Value = ((fechaIngreso == null) ? "" : fechaIngreso);
                            da.SelectCommand.Parameters.Add("@dni", SqlDbType.VarChar).Value = ((dni == null) ? "" : dni);
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.VarChar).Value = idServicio;

                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {

                            ds = null; throw new Exception(ex.Message);
                        }
                        finally
                        {
                            conn.Close();
                        }
                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> EvaluacionHospitalizacionSeleccionar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    DataSet ds = new DataSet();
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EvaluacionHospitalizacionSeleccionar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {

                            ds = null; throw new Exception(ex.Message);
                        }
                        finally
                        {
                            conn.Close();
                        }
                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> AtencionesSinAdmHospitalizacion(int ProvieneDeEmergencia) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_AtencionesSinAdmHospitalizacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@ProvieneDeEmergencia", SqlDbType.Int).Value = ProvieneDeEmergencia;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

    }

}
