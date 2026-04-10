using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalEvaluacionRN
    {


        public DataSet ListarHospitalizadosRN(DateTime FechaAtencion, int NroCuenta, int NroHistoria, int NroDocumento, String ApPaterno, int idGrupo, int idUsuario)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ListarHospitalizadosRN");
                cmd.Parameters.AddWithValue("@FechaAtencion", (String)FechaAtencion.ToShortDateString());
                cmd.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento.ToString());
                cmd.Parameters.AddWithValue("@ApPaterno", (ApPaterno == null) ? "" : ApPaterno);
                cmd.Parameters.AddWithValue("@idGrupo", idGrupo);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
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


        public int registrarEvaluacionRn(EvaluacionRN objEvaluacionRN, int idAccion)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_insertUpdateEvaluacionRN");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idEvaluacionRN", objEvaluacionRN.idEvaluacionRN);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", objEvaluacionRN.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@Peso", objEvaluacionRN.Peso);
                cmd.Parameters.AddWithValue("@Talla", objEvaluacionRN.Talla);
                cmd.Parameters.AddWithValue("@PerimetroCefalico", objEvaluacionRN.PerimetroCefalico);
                cmd.Parameters.AddWithValue("@PerimetroToracico", objEvaluacionRN.PerimetroToracico);
                cmd.Parameters.AddWithValue("@Observaciones", objEvaluacionRN.Observaciones);
                cmd.Parameters.AddWithValue("@idMedico", objEvaluacionRN.idMedico);
                cmd.Parameters.AddWithValue("@idTipoParto", objEvaluacionRN.idTipoParto);
                cmd.Parameters.AddWithValue("@idCondicion", objEvaluacionRN.idCondicion);
                cmd.Parameters.AddWithValue("@idRiesgo", objEvaluacionRN.idRiesgo);
                cmd.Parameters.AddWithValue("@NroGemelar", objEvaluacionRN.NroGemelar);
                cmd.Parameters.AddWithValue("@PielaPïel", objEvaluacionRN.PielaPïel);
                cmd.Parameters.AddWithValue("@EdadGes", objEvaluacionRN.EdadGes);
                cmd.Parameters.AddWithValue("@ClampadoTardio", objEvaluacionRN.ClampadoTardio);
                cmd.Parameters.AddWithValue("@Lactancia1raHora", objEvaluacionRN.Lactancia1raHora);
                cmd.Parameters.AddWithValue("@Gesta", objEvaluacionRN.Gesta);
                cmd.Parameters.AddWithValue("@Paridad", objEvaluacionRN.Paridad);
                cmd.Parameters.AddWithValue("@AlMinuto", objEvaluacionRN.AlMinuto);
                cmd.Parameters.AddWithValue("@Alos5Minutos", objEvaluacionRN.Alos5Minutos);
                cmd.Parameters.AddWithValue("@PosicionParto", objEvaluacionRN.PosicionParto);
                cmd.Parameters.AddWithValue("@ConAcompaniante", objEvaluacionRN.ConAcompaniante);
                cmd.Parameters.AddWithValue("@ConAnaglgesia", objEvaluacionRN.ConAnaglgesia);
                cmd.Parameters.AddWithValue("@idUsuario", objEvaluacionRN.idUsuario);
                cmd.Parameters.AddWithValue("@EdadMadre", objEvaluacionRN.EdadMadre);
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


        public DataSet ObtenerEvaluacionRN( int idCuentaAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_obtenerEvaluacionRn");
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
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


        public DataSet BuscarPacienteRn(int Anio, String Apellidos, DateTime FecNac, int NroHistoria)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_BuscarConstanciaRn");
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@Apellidos", (Apellidos == null) ? "" : Apellidos);              
                cmd.Parameters.AddWithValue("@FecNac", (String)FecNac.ToShortDateString());
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
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

        public DataSet BuscarPacienteRnSistemaAnterior(int Anio, String Apellidos, DateTime FecNac, int NroHistoria)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_BuscarConstanciaRnSIAN");
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@Apellidos", (Apellidos == null) ? "" : Apellidos);
                cmd.Parameters.AddWithValue("@FecNac", (String)FecNac.ToShortDateString());
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
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



        public DataSet DatosPacientebyIdPacienteIdBd( int Anio,String NroHistoria,int bd)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_DatosPacientebyIdPacienteIdBd");
             
                cmd.Parameters.AddWithValue("@anio", Anio);
                cmd.Parameters.AddWithValue("@nroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@bd", bd);
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
        public DataSet DatosValidarComprobante(String nroSerie, String nroComprobante)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ValidarComprobante");               
                cmd.Parameters.AddWithValue("@nroCorrelativo", nroSerie);
                cmd.Parameters.AddWithValue("@nroDocumento", nroComprobante);
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
        public int RegistrarConstanciaRn(ConstanciasRn objConstanciasRn) {

            SqlCommand cmd = null;
            int idConstancia = 0;
            try
            {
                //cmd = MetodoDatos.CrearComando("Web_RegistrarConstancia");
                cmd = MetodoDatos.CrearComando("Web_RegistrarConstanciaNacimiento");
                cmd.Parameters.AddWithValue("@idConstanciaNacimiento", objConstanciasRn.idConstancia);                
                cmd.Parameters.AddWithValue("@Anio", objConstanciasRn.Anio);
                cmd.Parameters.AddWithValue("@NroHistoria", objConstanciasRn.NroHistoria);
                cmd.Parameters.AddWithValue("@IdRegistroRn", objConstanciasRn.idRegistroRn);
                cmd.Parameters.AddWithValue("@Base", objConstanciasRn.Base);
                cmd.Parameters.AddWithValue("@idUsuario", objConstanciasRn.idUsuario);
                cmd.Parameters.AddWithValue("@nroSerie", objConstanciasRn.NroSerie);
                cmd.Parameters.AddWithValue("@NroComprobante", objConstanciasRn.NroCorrelativo);
                cmd.Parameters.AddWithValue("@idSolicitud", objConstanciasRn.idSolicitudConstancia);

                cmd.Parameters.AddWithValue("@idSolicitante", objConstanciasRn.idSolicitante);
                cmd.Parameters.AddWithValue("@idTipoDocSolicitante", objConstanciasRn.idTipoDocSolicitante);
                cmd.Parameters.AddWithValue("@NroDocSolicitante", objConstanciasRn.NroDocSolicitante);
                cmd.Parameters.Add("@idConstancia", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                idConstancia = int.Parse(cmd.Parameters["@idConstancia"].Value.ToString());
                return idConstancia;
            }
            catch (Exception ex)
            {
                 throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public DataSet DatosPacientebyIdConstancia(int idconstancia)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                //cmd = MetodoDatos.CrearComando("Web_DatosPacientebyIdconstancia_V3");
                cmd = MetodoDatos.CrearComando("Web_SeleccionarDatosConstanciaRnPorId");
                cmd.Parameters.AddWithValue("@idConstancia", idconstancia);
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

        public DataSet ListarConstanciaRn( int NroHistoria,String Serie, String Correlativo,int idConstancia, DateTime FechaAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarConstanciasRn");
                cmd.Parameters.AddWithValue("@idConstancia", idConstancia);
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@NroCorrelativo", (Correlativo == null) ? "" : Correlativo); 
                cmd.Parameters.AddWithValue("@NroSerie", (Serie == null) ? "" : Serie);
                cmd.Parameters.AddWithValue("@Fecha", FechaAtencion);
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

        public DataSet ListarSolicitudesRn(int NroHistoria, String nroDocumento, int idEstadoSolicitud, int idSolicitud, DateTime FechaAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarSolicitudConstanciasRn");
                cmd.Parameters.AddWithValue("@idsolicitud", idSolicitud);
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@idEstadoSolicitud", idEstadoSolicitud);
                cmd.Parameters.AddWithValue("@nroDocumento", (nroDocumento == null) ? "" : nroDocumento);
                cmd.Parameters.AddWithValue("@Fecha", FechaAtencion);
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

        public DataSet DatosPacientebyIdSolicitud(int idSolicitud)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                //cmd = MetodoDatos.CrearComando("Web_DatosPacientebyIdconstancia_V3");
                cmd = MetodoDatos.CrearComando("Web_SeleccionarDatosSolicitudRnPorId");
                cmd.Parameters.AddWithValue("@idSolicitud", idSolicitud);
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
        /*
        public DataSet SeleccionarSolicitudConstanciaRn(int IdSolicitud)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarSolicitudConstanciasRn_V2");
                cmd.Parameters.AddWithValue("@idsolicitud", idSolicitud);
                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@idEstadoSolicitud", idEstadoSolicitud);
                cmd.Parameters.AddWithValue("@nroDocumento", (nroDocumento == null) ? "" : nroDocumento);
                cmd.Parameters.AddWithValue("@Fecha", FechaAtencion);
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
        */

        public int RegistrarSolicitudConstanciaRn(SolicitudConstanciasRN objsolicitudRn)
        {
            SqlCommand cmd = null;
            int idConstancia = 0;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_RegistrarSolicitudConsRn");
                cmd.Parameters.Add("@idSolicitud", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@Anio", objsolicitudRn.Anio);
                cmd.Parameters.AddWithValue("@NroHistoria", objsolicitudRn.NroHistoria);
                cmd.Parameters.AddWithValue("@IdRegistroRn", objsolicitudRn.idRegistroRn);
                cmd.Parameters.AddWithValue("@Base", objsolicitudRn.Base);
                cmd.Parameters.AddWithValue("@idUsuario", objsolicitudRn.idUsuario);
                cmd.Parameters.AddWithValue("@documento", objsolicitudRn.NroDocumento);
                cmd.Parameters.AddWithValue("@comentario", objsolicitudRn.Comentario == null ? "" : objsolicitudRn.Comentario);
                cmd.Parameters.AddWithValue("@idSolicitante", objsolicitudRn.idSolicitante);
                cmd.Parameters.AddWithValue("@idTipoDocSolicitante", objsolicitudRn.idTipoDocSolicitante);
                cmd.Parameters.AddWithValue("@NroDocSolicitante", objsolicitudRn.NroDocSolicitante);
                cmd.ExecuteNonQuery();
                idConstancia = int.Parse(cmd.Parameters["@idSolicitud"].Value.ToString());
                return idConstancia;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }


        public Task<int> RegistrarRespuestaSolicitudRn(SolicitudConstanciasRN objsolicitudRn)
        {

            Conexion cx = new Conexion();
            int rsp = 0;
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_RegistrarRespuestaSolicitudConsRn";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idSolicitud", SqlDbType.Int).Value = objsolicitudRn.idSolicitud;
                        da.SelectCommand.Parameters.Add("@bAprobado", SqlDbType.Int).Value = objsolicitudRn.bAprobado;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = objsolicitudRn.idUsuario;
                        da.SelectCommand.Parameters.Add("@comentario", SqlDbType.Text).Value = (objsolicitudRn.Comentario == null) ? "" : objsolicitudRn.Comentario;

                        da.SelectCommand.Parameters.Add("@idConstancia", SqlDbType.Int).Direction = ParameterDirection.Output;
                                                
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rsp = int.Parse(da.SelectCommand.Parameters["@idConstancia"].Value.ToString());

                        return rsp;
                    }
                }

            });

            //SqlCommand cmd = null;
            //int rsp = 0;            
            //try
            //{
            //    cmd = MetodoDatos.CrearComando("Web_RegistrarRespuestaSolicitudConsRn");
            //    cmd.Parameters.AddWithValue("@idSolicitud", objsolicitudRn.idSolicitud);
            //    cmd.Parameters.AddWithValue("@bAprobado", objsolicitudRn.bAprobado);
            //    cmd.Parameters.AddWithValue("@idUsuario", objsolicitudRn.idUsuario);
            //    cmd.Parameters.AddWithValue("@comentario", (objsolicitudRn.Comentario == null) ? "" : objsolicitudRn.Comentario);
            //    cmd.Parameters.Add("@idConstancia", SqlDbType.Int).Direction = ParameterDirection.Output;
            //    cmd.ExecuteNonQuery();
            //    rsp = int.Parse(cmd.Parameters["@idConstancia"].Value.ToString());
            //    return rsp;
            //}
            //catch (Exception ex)
            //{
            //    throw new Exception(ex.Message);
            //}
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            
        }



        public string RegistrarImpresionSolicitudRn(ConstanciasRn objConstanciaRn)
        {
            SqlCommand cmd = null;
            int rsp = 0;
            string nRpta = "";
            try
            {
                cmd = MetodoDatos.CrearComando("web_ActualizarImpresionConstancia");
                cmd.Parameters.Add("@ruta", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idConstancia", objConstanciaRn.idConstancia);
                cmd.Parameters.AddWithValue("@idUsuario", objConstanciaRn.idUsuario);
                rsp = cmd.ExecuteNonQuery();
                nRpta = cmd.Parameters["@ruta"].Value.ToString();
                return nRpta;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }




        public int EliminarEvaluacionRn(EvaluacionRN objEvaluacionRN, int idAccion)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_EliminarEvaluacionRN");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idCuentaAtencion", objEvaluacionRN.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idUsuario", objEvaluacionRN.idUsuario);
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



    }
}
