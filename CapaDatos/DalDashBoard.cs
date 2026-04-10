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
  public  class DalDashBoard
    {
        public DataSet ObtenerCitasCE(int Mes,int idTipoServicio,int idEspecialidad)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CitasxMesCE");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@Especialidad", idEspecialidad);
                //dr = cmd.ExecuteReader ();

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

        public DataSet ObtenerCitasAtendidasCE(int Mes, int idTipoServicio, int idEspecialidad)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CitasxMesCEAtendidos");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@Especialidad", idEspecialidad);
                //dr = cmd.ExecuteReader ();

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

        public DataSet ObtenerCitasAtendidasxCE(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CitasAtendidasxConsultorio");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                //dr = cmd.ExecuteReader ();

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

        public DataSet ObtenerCitasAtendidasEmergencia(int Mes, int idTipoServicio, int idEspecialidad)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CitasxMesEmergenciaAtendidos");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@Especialidad", idEspecialidad);
                //dr = cmd.ExecuteReader ();

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

        public DataSet ObtenerCitasAtendidasEmergencia(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CitasAtendidasxConsultorioEmergencia");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                //dr = cmd.ExecuteReader ();

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

        public DataSet ObtenerCitasEmergencia(int Mes, int idTipoServicio, int idEspecialidad)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CitasxMesEmergencia");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@Especialidad", idEspecialidad);
                //dr = cmd.ExecuteReader ();

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

        #region Ingresos_a_Emergenciu
        public DataSet ListaAtendidosAnio( int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_CitasEmergencia_UltimosAnios");
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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

        public DataSet ListadoAtendidosxAnio(int Anio, int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_CitasEmergencia_MesesAnio");
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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

        public DataSet ListadoAtendidosxMes(int Anio, int Mes, int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_CitasEmergencia_DiaMesesAnio");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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
        #endregion

        #region Ingresos_a_Hospitalizacion
        public DataSet ListaAtendidosHospAnio(int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_Hospitalizados_UltimosAnios");
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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

        public DataSet ListadoAtendidosHospxAnio(int Anio, int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_Hospitalizados_MesesAnio");
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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

        public DataSet ListadoAtendidosHospxMes(int Anio, int Mes, int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_Hospitalizados_DiaMesesAnio");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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

        public DataSet ListadoAtendidosHospxMesyTipo(int Anio, int Mes, int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_HospitalizadosxTipo_DiaMesesAnio");
                cmd.Parameters.AddWithValue("@Mes", Mes);
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@TipoServicio", idTipoServicio);
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
        #endregion


        #region DerivacionEmergencia
        public DataSet DevuelveCantidadDerivacionEmergencia(DateTime FechaInicio,DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("ListarCantidadDerivacionEvaluacion");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio );
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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

        public DataSet ListarDerivacionEvaluacion(DateTime FechaInicio, DateTime FechaFin,int Tipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("ListarDerivacionEvaluacion");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                cmd.Parameters.AddWithValue("@Tipo", Tipo);
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

        public DataSet ListarDerivacionEmergenciaTodos(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("ListarDerivacionEmergenciaTodos");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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


        #endregion



    }
}
