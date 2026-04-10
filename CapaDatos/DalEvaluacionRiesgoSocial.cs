using System.Data.SqlClient;
using System.Data;
using System;
using System.Threading.Tasks;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using System.Collections.Generic;
using CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalEvaluacionRiesgoSocial
    {

        public Task<DataSet> ListarEvaluacionRiesgoSocial(int NroEvaluacion, int NroCuenta, int NroHistoria, string NroDocumento, string ApPaterno, string ApMaterno, string fecha)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_EvaluacionRiesgoSocialListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = (NroEvaluacion > 0) ? NroEvaluacion : 0;
                            da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = (NroCuenta > 0) ? NroCuenta : 0;
                            da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = (NroHistoria > 0) ? NroHistoria : 0;
                            da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (NroDocumento == null) ? "" : NroDocumento;
                            da.SelectCommand.Parameters.Add("@ApPaterno", SqlDbType.VarChar).Value = (ApPaterno == null) ? "" : ApPaterno;
                            da.SelectCommand.Parameters.Add("@ApMaterno", SqlDbType.VarChar).Value = (ApMaterno == null) ? "" : ApMaterno;
                            da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.VarChar).Value = (fecha == null) ? "" : fecha;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> ListarEvaluacionRiesgoSocialPorPaciente(int IdPaciente)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_EvaluacionesRiesgoSocialPorPacienteListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = (IdPaciente > 0) ? IdPaciente : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }



        public Task<DataSet> ListarTiposPacienteEvaluacion()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "Web_ListarTiposPacienteEvaluacion";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            //da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = (NroEvaluacion > 0) ? NroEvaluacion : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> ListarTrabajadoresSocial()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_ListaTrabajadoresSocial";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            //da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = (NroEvaluacion > 0) ? NroEvaluacion : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> CargarFormatoEvaluacionRiesgoSocial()
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_EvaluacionRiesgoSocialCargarFormato";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            //da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = (NroEvaluacion > 0) ? NroEvaluacion : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> CalcularNivelEvaluacionRiesgoSocial(int total)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_EvaluacionRiesgoSocialCalcularNivel";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@Total", SqlDbType.Int).Value = (total > 0) ? total : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> SeleccionarEvaluacionRiesgoSocial(int NroEvaluacion)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_EvaluacionRiesgoSocialSeleccionar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = (NroEvaluacion > 0) ? NroEvaluacion : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public async Task<DataSet> GuardarEvaluacionRiesgoSocial(RiesgoSocial evaluacion, List<RiesgoSocialDetalle> lstDetalle, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<RiesgoSocialDetalle>), lstDetalle);

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionRiesgoSocialGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = evaluacion.invnum;
                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = evaluacion.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@FechaEvaluacion", SqlDbType.VarChar).Value = evaluacion.evafec ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTurnoLabora", SqlDbType.Int).Value = evaluacion.idTurnoLabora ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTrabajadoraSocial", SqlDbType.Int).Value = evaluacion.usecod;
                        da.SelectCommand.Parameters.Add("@CieDiagnostico", SqlDbType.VarChar).Value = evaluacion.diacod;
                        da.SelectCommand.Parameters.Add("@Comentarios", SqlDbType.VarChar).Value = evaluacion.evacom;
                        da.SelectCommand.Parameters.Add("@telefono1", SqlDbType.VarChar).Value = evaluacion.telefono1;
                        da.SelectCommand.Parameters.Add("@telefono2", SqlDbType.VarChar).Value = evaluacion.telefono2;
                        da.SelectCommand.Parameters.Add("@telefono3", SqlDbType.VarChar).Value = evaluacion.telefono3;
                        da.SelectCommand.Parameters.Add("@telefono4", SqlDbType.VarChar).Value = evaluacion.telefono4;
                        da.SelectCommand.Parameters.Add("@familiar1", SqlDbType.VarChar).Value = evaluacion.familiar1;
                        da.SelectCommand.Parameters.Add("@familiar2", SqlDbType.VarChar).Value = evaluacion.familiar2;
                        da.SelectCommand.Parameters.Add("@familiar3", SqlDbType.VarChar).Value = evaluacion.familiar3;
                        da.SelectCommand.Parameters.Add("@familiar4", SqlDbType.VarChar).Value = evaluacion.familiar4;
                        
                        da.SelectCommand.Parameters.Add("@evaPadre", SqlDbType.VarChar).Value = evaluacion.evaPadre;
                        da.SelectCommand.Parameters.Add("@evaMadre", SqlDbType.VarChar).Value = evaluacion.evaMadre;
                        da.SelectCommand.Parameters.Add("@evaTutor", SqlDbType.VarChar).Value = evaluacion.evaTutor;
                        da.SelectCommand.Parameters.Add("@evaTratamiento", SqlDbType.VarChar).Value = evaluacion.evaTratamiento;

                        da.SelectCommand.Parameters.Add("@direccionActual", SqlDbType.VarChar).Value = evaluacion.direccionActual;
                        da.SelectCommand.Parameters.Add("@referenciaDireccion", SqlDbType.VarChar).Value = evaluacion.referenciaDireccion;
                        da.SelectCommand.Parameters.Add("@tipoPaciente", SqlDbType.VarChar).Value = evaluacion.tipoPaciente;
                        da.SelectCommand.Parameters.Add("@especificarTipoPaciente", SqlDbType.VarChar).Value = evaluacion.especificarTipoPaciente;
                        da.SelectCommand.Parameters.Add("@diagnosticos", SqlDbType.VarChar).Value = evaluacion.diagnosticos;

                        da.SelectCommand.Parameters.Add("@DetalleEvaluacion", SqlDbType.Xml).Value = xmlDetalle ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;


                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos guardar riesgo social", ex);
            }

        }


        public async Task<DataSet> EliminarEvaluacionRiesgoSocial(int NroEvaluacion, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionRiesgoSocialEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = NroEvaluacion;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;


                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos eliminar riesgo social", ex);
            }

        }

        public async Task<DataSet> EvaluacionRiesgoSocialInforme(int NroEvaluacion)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionRiesgoSocialInforme";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = NroEvaluacion;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos informe riesgo social", ex);
            }

        }

        public Task<DataSet> ListarDiagnosticosEvaluacion(int IdCuentaAtencion)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "Web_ListarDiagnosticosEvaluacion";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (IdCuentaAtencion > 0) ? IdCuentaAtencion : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

    }
}
