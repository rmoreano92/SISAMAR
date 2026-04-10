using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
   public  class DalCitasWeb
    {
        public DataSet ListarSolicitudCitas()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("ListaSolicitudes");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        public DataSet ValidarCuenta(int idSolicitud, int NroCuenta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_ValidarCuenta");
                cmd.Parameters.AddWithValue("@idSolicitud", idSolicitud);
                cmd.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                //dr = cmd.ExecuteReader ();

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        public int ActualizarEstado(int idEstado, int NroCuenta, int idSolicitud, String Comentario,int idUsuario)
        {
           
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ActualizarEstadoSolicitudCitas");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idEstado", idEstado);
                cmd.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                cmd.Parameters.AddWithValue("@idSolicitud", idSolicitud);
                cmd.Parameters.AddWithValue("@Comentario", Comentario);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);

                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@rsp"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;
        }

        public DataSet ListarPlanificacionFamiliar(DateTime FechaAtencion, int NroCuenta, int NroHistoria, int NroDocumento, String ApPaterno, int idGrupo, int idUsuario)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ListarPlanificacionFamiliar");
                cmd.Parameters.AddWithValue("@FechaAtencion",(String)FechaAtencion.ToShortDateString());
                cmd.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@NroDocumento",NroDocumento.ToString());
                cmd.Parameters.AddWithValue("@ApPaterno", (ApPaterno == null) ? "" :ApPaterno);
                cmd.Parameters.AddWithValue("@idGrupo", idGrupo);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
               
        public DataSet BuscarDiagnosticos(String Codigo, String Descripcion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_DiagnosticosFiltrar");
                cmd.Parameters.AddWithValue("@Codigo", (Codigo == null) ? "" : Codigo);
                cmd.Parameters.AddWithValue("@Descripcion", (Descripcion == null) ? "" : Descripcion);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public async Task<DataSet> BuscarDiagnosticosV2(String Codigo, String Descripcion)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_DiagnosticosFiltrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Codigo ", SqlDbType.VarChar).Value = (Codigo == null) ? "" : Codigo;
                        da.SelectCommand.Parameters.Add("@Descripcion ", SqlDbType.VarChar).Value = (Descripcion == null) ? "" : Descripcion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public DataSet BuscarDiagnosticosPlanificacion(String Codigo, String Descripcion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_DiagnosticosFiltrarFamiliar");
                cmd.Parameters.AddWithValue("@Codigo", (Codigo == null) ? "" : Codigo);
                cmd.Parameters.AddWithValue("@Descripcion", (Descripcion == null) ? "" : Descripcion);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        #region Citas
        public DataSet ListarMedicosActivos(DateTime FechaAtencion, int NroCuenta, int NroHistoria, int NroDocumento, String ApPaterno, int idGrupo, int idUsuario)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarMedicosActivos");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet ListarProgramacionbyMedico(int idMedico)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarProgramacionbyIdMedico");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                cmd.Parameters.AddWithValue("@idmedico", idMedico);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        public DataSet ListarCitasbyFecha(int idMedico,DateTime fecha   )
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarCitasbyFecha");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                cmd.Parameters.AddWithValue("@idmedico", idMedico);
                cmd.Parameters.AddWithValue("@Fecha", fecha);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        public DataSet ListaCuposByIdProgramacion(int idMedico, DateTime fecha)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("listaCupos");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                cmd.Parameters.AddWithValue("@idmedico", idMedico);
                cmd.Parameters.AddWithValue("@Fecha", fecha);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        #endregion


    }
}
