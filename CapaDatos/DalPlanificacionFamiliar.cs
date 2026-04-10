using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace CapaDatos
{
   public class DalPlanificacionFamiliar
    {

        public int registrarPlanificacionFamiliar(PlanificacionFamiliar objPlanificacion, int idAccion)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_CrudPlanificacionFamiliarV4");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idNroCuenta", objPlanificacion.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@idCondicionMGP", objPlanificacion.IdTipoCondicionALEstab);
                cmd.Parameters.AddWithValue("@idCondicionServicioMGP", objPlanificacion.IdTipoCondicionAlServicio);
                cmd.Parameters.AddWithValue("@idTipoAtencion", objPlanificacion.idTipoAtencion);
                cmd.Parameters.AddWithValue("@idTipoConsejeria", objPlanificacion.idTipoConsejeria);
                cmd.Parameters.AddWithValue("@NroConsejeria", objPlanificacion.NroConsejeria);
                cmd.Parameters.AddWithValue("@idProfesionalConsejeria", objPlanificacion.idProfesionalConsejeria);
                cmd.Parameters.AddWithValue("@idEstadoUsuaria", objPlanificacion.idEstadoUsuaria);
                cmd.Parameters.AddWithValue("@idMetodoAdmin", objPlanificacion.idMetodoAdmin);
                cmd.Parameters.AddWithValue("@idTipoMetodoAdmin", objPlanificacion.idTipoMetodoAdmin);
                cmd.Parameters.AddWithValue("@NroInsumosAdm", objPlanificacion.NroInsumosAdm);
                cmd.Parameters.AddWithValue("@idProfesionalAdm", objPlanificacion.idProfesionalAdm);
                cmd.Parameters.AddWithValue("@idMetodoRetirado", objPlanificacion.idMetodoRetirado);
                cmd.Parameters.AddWithValue("@idProfesionalRetiro", objPlanificacion.idProfesionalRetiro);
                cmd.Parameters.AddWithValue("@idMetodoEfect", objPlanificacion.idMetodoEfect);
                cmd.Parameters.AddWithValue("@idTipoEfectSec", objPlanificacion.idTipoEfectSec);
                cmd.Parameters.AddWithValue("@idEfecto", objPlanificacion.idEfecto);
                cmd.Parameters.AddWithValue("@idTipoEfecto", objPlanificacion.idTipoEfecto);
                cmd.Parameters.AddWithValue("@idFalla", objPlanificacion.idFalla);
                cmd.Parameters.AddWithValue("@EsCaptada", objPlanificacion.EsCaptada);
                cmd.Parameters.AddWithValue("@EsControl", objPlanificacion.EsControl);
                cmd.Parameters.AddWithValue("@NroControl", objPlanificacion.NroControl);
                cmd.Parameters.AddWithValue("@ConDiscapacidad", objPlanificacion.ConDiscapacidad);
                cmd.Parameters.AddWithValue("@idRiesgoReproductivo", objPlanificacion.idRiesgoReproductivo);

                cmd.Parameters.AddWithValue("@noAceptaMetodo", objPlanificacion.noAceptaMetodo);
                cmd.Parameters.AddWithValue("@esControlDiu", objPlanificacion.esControlDiu);
                cmd.Parameters.AddWithValue("@esControlImplante", objPlanificacion.esControlImplante);

                cmd.Parameters.AddWithValue("@esPacienteProtegida", objPlanificacion.esPacienteProtegida);
                cmd.Parameters.AddWithValue("@esGestante", objPlanificacion.esGestante);

                cmd.Parameters.AddWithValue("@idUsuario", objPlanificacion.idUsuario);
                cmd.Parameters.AddWithValue("@idAccion", idAccion);
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
        public DataSet DevuelvePlanificacionFamiliar(int idNroCuenta, int idGrupo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_DevuelvePlanificacionFamiliarxNroCuenta");
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idNroCuenta);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null;
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        public int EliminarPlanificacionFamiliar(PlanificacionFamiliar objPlanificacion)
        {

            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("Web_EliminarPlanificacionFamiliar");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idNroCuenta", objPlanificacion.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@idUsuario", objPlanificacion.idUsuario);
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
        public DataSet DevuelveDSMetodoxEstadoUsuaria(int idEstadoUsuaria)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarComboEstadoUsuaria_Metodo");
                cmd.Parameters.AddWithValue("@idEstadoUsuaria", idEstadoUsuaria);
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
        public DataSet DevuelveDSEfectoSecxMetodo(int idMetodoEfecto)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarEfectoxMetodoEfecto");
                cmd.Parameters.AddWithValue("@idMetodoEfecto", idMetodoEfecto);
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
        public DataSet DevuelveCantidadesInsumosxIdMetodo(int idMetodo, int idServicio, int idAnio, int idMes, int TipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ObtenerCantidadesAtendidosInsumosxMetodo");
                cmd.Parameters.AddWithValue("@idMetodo", idMetodo);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idAnio", idAnio);
                cmd.Parameters.AddWithValue("@idMes", idMes);
                cmd.Parameters.AddWithValue("@TipoServicio", TipoServicio);
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
        public DataSet DevuelveCantidadesInsumosxIdMetodoYuzpe( int idServicio, int idAnio, int idMes)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ObtenerCantidadesAtendidosInsumosxMetodoYuzpe");
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idAnio", idAnio);
                cmd.Parameters.AddWithValue("@idMes", idMes);

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
        public DataSet DevuelveCantidadesUsuCaptadasAtendidosInsumosxMetodo(int idMetodo, int idServicio, int idAnio, int idMes, int TipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ObtenerCantidadesUsuCaptadasAtendidosInsumosxMetodo");
                cmd.Parameters.AddWithValue("@idMetodo", idMetodo);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idAnio", idAnio);
                cmd.Parameters.AddWithValue("@idMes", idMes);
                cmd.Parameters.AddWithValue("@TipoServicio", TipoServicio);
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
        public DataSet DevuelveCantidadesConsejerias(int idServicio, int idAnio, int idMes, int TipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ObtenerConsejeriaInsumosxMetodo");
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idAnio", idAnio);
                cmd.Parameters.AddWithValue("@idMes", idMes);
                cmd.Parameters.AddWithValue("@TipoServicio", TipoServicio);
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
    }
}
