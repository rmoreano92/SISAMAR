using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalRecienNacido
    {
        public Task<DataSet> ListarPacientesRegistroRecienNacido(string FechaFiltro, int TipoFecha, int NroCuenta, int NroHistoria, int AnioNac, string NroDocumento, string ApPaterno, string ApMaterno, string NroDocumentoMadre, int idGrupo, int idUsuario)
        {            
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "Web_ListarHospitalizadosRN_V2";
                        //string sql = "web_ListarPacientesRegistroRecienNacido";
                        string sql = "web_ListarRegistrosRecienNacido";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FechaFiltro", SqlDbType.VarChar).Value = FechaFiltro;
                        da.SelectCommand.Parameters.Add("@TipoFecha", SqlDbType.Int).Value = TipoFecha;
                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = NroCuenta;
                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = (NroHistoria > 0) ? NroHistoria : 0;
                        da.SelectCommand.Parameters.Add("@AnioNac", SqlDbType.Int).Value = (AnioNac > 0) ? AnioNac : 0;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (NroDocumento == null) ? "" : NroDocumento;
                        da.SelectCommand.Parameters.Add("@ApPaterno", SqlDbType.VarChar).Value = (ApPaterno == null) ? "" : ApPaterno;
                        da.SelectCommand.Parameters.Add("@ApMaterno", SqlDbType.VarChar).Value = (ApMaterno == null) ? "" : ApMaterno;
                        da.SelectCommand.Parameters.Add("@NroDocumentoMadre", SqlDbType.VarChar).Value = (NroDocumentoMadre == null) ? "" : NroDocumentoMadre;
                        da.SelectCommand.Parameters.Add("@idGrupo", SqlDbType.Int).Value = idGrupo;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public async Task<int> GuardarRegistroRN(RecienNacido objRecienNacido, List<Diagnosticos> dsDiagnosticosRn, string tabla, int nacidoEn, int idListBar)
        {
            int nRpta = 0;
            SqlCommand cmd = null;

            try
            {
                string xmlDiagnosticosRn = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticosRn);

                cmd = MetodoDatos.CrearComando("web_RegistroRecienNacidoModificar"); // Asegúrate que la conexión esté abierta
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idRegistroRN", objRecienNacido.idRegistroRN);
                cmd.Parameters.AddWithValue("@tabla", tabla);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", objRecienNacido.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idPaciente", objRecienNacido.idPaciente);
                cmd.Parameters.AddWithValue("@idTriajeRn", objRecienNacido.idTriajeRn);

                // Parámetros madre
                cmd.Parameters.AddWithValue("@Embarazo", objRecienNacido.Embarazo);
                cmd.Parameters.AddWithValue("@PatologiaGestacion", string.IsNullOrEmpty(objRecienNacido.PatologiaGestacion) ? (object)DBNull.Value : objRecienNacido.PatologiaGestacion);
                cmd.Parameters.AddWithValue("@NroEmbarazo", objRecienNacido.NroEmbarazo);
                cmd.Parameters.AddWithValue("@AtencionPrenatal", objRecienNacido.AtencionPrenatal);
                cmd.Parameters.AddWithValue("@NroApn", objRecienNacido.NroApn);
                cmd.Parameters.AddWithValue("@LugarApn", objRecienNacido.LugarApn);
                cmd.Parameters.AddWithValue("@Gesta", objRecienNacido.Gesta);
                cmd.Parameters.AddWithValue("@Paridad", objRecienNacido.Paridad);
                cmd.Parameters.AddWithValue("@Paridad1", objRecienNacido.Paridad1);
                cmd.Parameters.AddWithValue("@Paridad2", objRecienNacido.Paridad2);
                cmd.Parameters.AddWithValue("@Paridad3", objRecienNacido.Paridad3);
                cmd.Parameters.AddWithValue("@Paridad4", objRecienNacido.Paridad4);

                cmd.Parameters.AddWithValue("@AtendidoPor", objRecienNacido.AtendidoPor);
                cmd.Parameters.AddWithValue("@idMedico", objRecienNacido.idMedico);
                cmd.Parameters.AddWithValue("@ResponsableAtencion", objRecienNacido.medicoResponsable);
                cmd.Parameters.AddWithValue("@idTipoParto", objRecienNacido.idTipoParto);
                cmd.Parameters.AddWithValue("@Parto", objRecienNacido.Parto);
                cmd.Parameters.AddWithValue("@DiagnosticosRn", xmlDiagnosticosRn);
                cmd.Parameters.AddWithValue("@ComplicacionParto", objRecienNacido.ComplicacionParto);
                cmd.Parameters.AddWithValue("@PosicionParto", objRecienNacido.PosicionParto);
                cmd.Parameters.AddWithValue("@ConAcompaniante", objRecienNacido.ConAcompaniante);
                cmd.Parameters.AddWithValue("@ConAnalgesia", objRecienNacido.ConAnaglgesia);
                cmd.Parameters.AddWithValue("@TrasladoConjunto", objRecienNacido.TrasladoConjunto);
                cmd.Parameters.AddWithValue("@EdadMadre", objRecienNacido.EdadMadre);

                // Parámetros neonato
                cmd.Parameters.AddWithValue("@IdTipoDocumentoRn", objRecienNacido.IdTipoDocumentoRn);
                cmd.Parameters.AddWithValue("@NroDocumentoRn", objRecienNacido.NroDocumentoRn);
                cmd.Parameters.AddWithValue("@FechaNacimiento", string.IsNullOrEmpty(objRecienNacido.FechaNacimiento) ? (object)DBNull.Value : objRecienNacido.FechaNacimiento);
                cmd.Parameters.AddWithValue("@HoraNacimiento", string.IsNullOrEmpty(objRecienNacido.HoraNacimiento) ? (object)DBNull.Value : objRecienNacido.HoraNacimiento);
                cmd.Parameters.AddWithValue("@IdTipoSexo", objRecienNacido.IdTipoSexo);
                cmd.Parameters.AddWithValue("@NroHijo", objRecienNacido.NroHijo);
                cmd.Parameters.AddWithValue("@IdTipoGestacion", objRecienNacido.IdTipoGestacion);
                cmd.Parameters.AddWithValue("@Fetos", objRecienNacido.Fetos);
                cmd.Parameters.AddWithValue("@NroGemelar", objRecienNacido.NroGemelar);
                cmd.Parameters.AddWithValue("@idCondicion", objRecienNacido.idCondicion);
                cmd.Parameters.AddWithValue("@Obito", objRecienNacido.Obito);

                cmd.Parameters.AddWithValue("@Peso", objRecienNacido.Peso);
                cmd.Parameters.AddWithValue("@Talla", objRecienNacido.Talla);
                cmd.Parameters.AddWithValue("@PerimetroCefalico", objRecienNacido.PerimetroCefalico);
                cmd.Parameters.AddWithValue("@PerimetroToracico", objRecienNacido.PerimetroToracico);
                cmd.Parameters.AddWithValue("@EdadGes", objRecienNacido.EdadGes);
                cmd.Parameters.AddWithValue("@Fur", objRecienNacido.Fur);
                cmd.Parameters.AddWithValue("@IdTiempoClampaje", objRecienNacido.IdTiempoClampaje);
                cmd.Parameters.AddWithValue("@ClampadoTardio", objRecienNacido.ClampadoTardio);
                cmd.Parameters.AddWithValue("@PielaPiel", objRecienNacido.PielaPiel);                
                cmd.Parameters.AddWithValue("@ContactoPielaPiel", objRecienNacido.ContactoPielaPiel);
                cmd.Parameters.AddWithValue("@IdTiempoContactoPielaPiel", objRecienNacido.IdTiempoContactoPielaPiel);
                cmd.Parameters.AddWithValue("@EfectividadContactoPielaPiel", objRecienNacido.EfectividadContactoPielaPiel);
                cmd.Parameters.AddWithValue("@Lactancia1raHora", objRecienNacido.Lactancia1raHora);
                cmd.Parameters.AddWithValue("@TiempoLactancia", objRecienNacido.TiempoLactancia);
                cmd.Parameters.AddWithValue("@IdServicioNacimiento", objRecienNacido.IdServicioNacimiento);
                cmd.Parameters.AddWithValue("@IdOtraProcedencia", objRecienNacido.IdOtraProcedencia);
                cmd.Parameters.AddWithValue("@TiempoHospitalizacion", objRecienNacido.TiempoHospitalizacion);

                cmd.Parameters.AddWithValue("@Inmediato", objRecienNacido.Inmediato);
                cmd.Parameters.AddWithValue("@Reanimacion", objRecienNacido.Reanimacion);
                cmd.Parameters.AddWithValue("@IdTipoReanimacion", objRecienNacido.IdTipoReanimacion);
                cmd.Parameters.AddWithValue("@AlMinuto", objRecienNacido.AlMinuto);
                cmd.Parameters.AddWithValue("@Alos5Minutos", objRecienNacido.Alos5Minutos);
                cmd.Parameters.AddWithValue("@Alos10Minutos", objRecienNacido.Alos10Minutos);
                cmd.Parameters.AddWithValue("@Alos15Minutos", objRecienNacido.Alos15Minutos);
                cmd.Parameters.AddWithValue("@Alos20Minutos", objRecienNacido.Alos20Minutos);
                cmd.Parameters.AddWithValue("@PatologiaNeonatal", objRecienNacido.PatologiaNeonatal);
                cmd.Parameters.AddWithValue("@Especificar", string.IsNullOrEmpty(objRecienNacido.Especificar) ? (object)DBNull.Value : objRecienNacido.Especificar);
                cmd.Parameters.AddWithValue("@Transporte", objRecienNacido.Transporte);
                cmd.Parameters.AddWithValue("@IdTipoTransporte", objRecienNacido.IdTipoTransporte);

                cmd.Parameters.AddWithValue("@idRiesgo", objRecienNacido.idRiesgo);
                cmd.Parameters.AddWithValue("@NacidoEn", nacidoEn);
                cmd.Parameters.AddWithValue("@idUsuario", objRecienNacido.idUsuario);
                cmd.Parameters.AddWithValue("@IdListItem", idListBar);

                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@rsp"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (cmd?.Connection != null && cmd.Connection.State == ConnectionState.Open)
                    await cmd.Connection.CloseAsync();
            }

            return nRpta;
        }

        public Task<DataSet> GuardarRegistroRecienNacidoFiliacion(RecienNacido objRecienNacido, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroRecienNacidoFiliacionModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaMadre", SqlDbType.Int).Value = objRecienNacido.idCuentaAtencionMadre;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = objRecienNacido.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = objRecienNacido.idPaciente;

                        da.SelectCommand.Parameters.Add("@FechaNacimiento", SqlDbType.VarChar).Value = objRecienNacido.FechaNacimiento;
                        da.SelectCommand.Parameters.Add("@HoraNacimiento", SqlDbType.VarChar).Value = objRecienNacido.HoraNacimiento;
                        da.SelectCommand.Parameters.Add("@IdTipoSexo", SqlDbType.Int).Value = objRecienNacido.IdTipoSexo;
                        da.SelectCommand.Parameters.Add("@IdTipoGestacion", SqlDbType.Int).Value = objRecienNacido.IdTipoGestacion;
                        da.SelectCommand.Parameters.Add("@Fetos", SqlDbType.Int).Value = objRecienNacido.Fetos;
                        da.SelectCommand.Parameters.Add("@NroGemelar", SqlDbType.Int).Value = objRecienNacido.NroGemelar;
                        
                        da.SelectCommand.Parameters.Add("@IdServicioIngreso", SqlDbType.Int).Value = objRecienNacido.IdServicioIngreso;
                        da.SelectCommand.Parameters.Add("@IdDiagnosticoIngreso", SqlDbType.Int).Value = objRecienNacido.IdDiagnosticoIngreso;
                        da.SelectCommand.Parameters.Add("@IdMedicoIngreso", SqlDbType.Int).Value = objRecienNacido.IdMedicoIngreso;
                                                
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarRegistroNacimiento()
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroNacimientoListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@IdRegistroNacimiento", SqlDbType.VarChar).Value = idRegistroNacimiento;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        //da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarRegistroNacimiento(int idRegistroNacimiento)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroNacimientoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRegistroNacimiento", SqlDbType.VarChar).Value = idRegistroNacimiento;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        //da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GuardarRegistroNacimiento(RecienNacido objRecienNacido, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroNacimientoModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@IdCuentaMadre", SqlDbType.VarChar).Value = objRecienNacido.idCuentaAtencionMadre;
                        da.SelectCommand.Parameters.Add("@FechaNacimiento", SqlDbType.VarChar).Value = objRecienNacido.FechaNacimiento;
                        da.SelectCommand.Parameters.Add("@HoraNacimiento", SqlDbType.VarChar).Value = objRecienNacido.HoraNacimiento;
                        da.SelectCommand.Parameters.Add("@IdTipoSexo", SqlDbType.Int).Value = objRecienNacido.IdTipoSexo;
                        da.SelectCommand.Parameters.Add("@IdTipoGestacion", SqlDbType.Int).Value = objRecienNacido.IdTipoGestacion;
                        da.SelectCommand.Parameters.Add("@Fetos", SqlDbType.Int).Value = objRecienNacido.Fetos;
                        da.SelectCommand.Parameters.Add("@NroGemelar", SqlDbType.Int).Value = objRecienNacido.NroGemelar;
                        da.SelectCommand.Parameters.Add("@IdCondicion", SqlDbType.Int).Value = objRecienNacido.idCondicion;
                        da.SelectCommand.Parameters.Add("@Obito", SqlDbType.VarChar).Value = objRecienNacido.Obito;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> EliminarRegistroNacimiento(int idRegistroNacimiento, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroNacimientoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRegistroNacimiento", SqlDbType.VarChar).Value = idRegistroNacimiento;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public DataSet SeleccionarRegistroRN(int idCuentaAtencion, int idRegistroRn, string tabla)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_RegistroRecienNacidoSeleccionar");
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idRegistroRn", idRegistroRn);
                cmd.Parameters.AddWithValue("@tabla", tabla);
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

        public DataSet SeleccionarRegistroRNporHistoria(int nroHistoria)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_RegistroRecienNacidoSeleccionarPoHistoria");
                cmd.Parameters.AddWithValue("@NroHistoria", nroHistoria);
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

        public DataSet VerificarNacimientoRegistroRN(int idPaciente)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_RegistroRecienNacidoVerificarNacimientoEnHospital");
                cmd.Parameters.AddWithValue("@IdPaciente", idPaciente);
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

        public int EliminarRegistroRn(int idRegistroRN, string tabla, int idUsuario)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_RegistroRecienNacidoEliminar");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idRegistroRN", idRegistroRN);
                cmd.Parameters.AddWithValue("@tabla", tabla);
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


        public DataSet BuscarPacienteRn(int Anio, String Apellidos, DateTime FecNac, int NroHistoria)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_BuscarConstanciaRn");
                //cmd = MetodoDatos.CrearComando("Web_BuscarPacienteRn");
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



        public DataSet DatosPacientebyIdPacienteIdBd(int Anio, String NroHistoria, int bd)
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
        public int RegistrarConstanciaRn(ConstanciasRn objConstanciasRn)
        {

            SqlCommand cmd = null;
            int idConstancia = 0;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_RegistrarConstancia");
                cmd.Parameters.Add("@idConstancia", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@Anio", objConstanciasRn.Anio);
                cmd.Parameters.AddWithValue("@NroHistoria", objConstanciasRn.NroHistoria);
                cmd.Parameters.AddWithValue("@Base", objConstanciasRn.Base);
                cmd.Parameters.AddWithValue("@idUsuario", objConstanciasRn.idUsuario);
                cmd.Parameters.AddWithValue("@nroSerie", objConstanciasRn.NroSerie);
                cmd.Parameters.AddWithValue("@NroComprobante", objConstanciasRn.NroCorrelativo);
                cmd.Parameters.AddWithValue("@idSolicitud", objConstanciasRn.idSolicitudConstancia);

                cmd.Parameters.AddWithValue("@idSolicitante", objConstanciasRn.idSolicitante);
                cmd.Parameters.AddWithValue("@idTipoDocSolicitante", objConstanciasRn.idTipoDocSolicitante);
                cmd.Parameters.AddWithValue("@NroDocSolicitante", objConstanciasRn.NroDocSolicitante);
                cmd.ExecuteNonQuery();
                idConstancia = int.Parse(cmd.Parameters["@idConstancia"].Value.ToString());
                return idConstancia;
            }
            catch (Exception)
            {
                throw;
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
                cmd = MetodoDatos.CrearComando("Web_DatosPacientebyIdconstancia");
                cmd.Parameters.AddWithValue("@idConstancia", idconstancia);
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

        public DataSet ListarConstanciaRn(int NroHistoria, String Serie, String Correlativo, int idConstancia, DateTime FechaAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarConstancias");
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
                cmd.Parameters.AddWithValue("@Base", objsolicitudRn.Base);
                cmd.Parameters.AddWithValue("@idUsuario", objsolicitudRn.idUsuario);
                cmd.Parameters.AddWithValue("@documento", objsolicitudRn.NroDocumento);
                cmd.Parameters.AddWithValue("@comentario", objsolicitudRn.Comentario);
                cmd.Parameters.AddWithValue("@idSolicitante", objsolicitudRn.idSolicitante);
                cmd.Parameters.AddWithValue("@idTipoDocSolicitante", objsolicitudRn.idTipoDocSolicitante);
                cmd.Parameters.AddWithValue("@NroDocSolicitante", objsolicitudRn.NroDocSolicitante);
                cmd.ExecuteNonQuery();
                idConstancia = int.Parse(cmd.Parameters["@idSolicitud"].Value.ToString());
                return idConstancia;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }


        public int RegistrarRespuestaSolicitudRn(SolicitudConstanciasRN objsolicitudRn)
        {
            SqlCommand cmd = null;
            int rsp = 0;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_RegistrarRespuestaSolicitudConsRn");
                cmd.Parameters.AddWithValue("@idSolicitud", objsolicitudRn.idSolicitud);
                cmd.Parameters.AddWithValue("@bAprobado", objsolicitudRn.bAprobado);
                cmd.Parameters.AddWithValue("@idUsuario", objsolicitudRn.idUsuario);
                cmd.Parameters.AddWithValue("@comentario", (objsolicitudRn.Comentario == null) ? "" : objsolicitudRn.Comentario);
                rsp = cmd.ExecuteNonQuery();
                return rsp;
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



        public int RegistrarImpresionSolicitudRn(ConstanciasRn objConstanciaRn)
        {
            SqlCommand cmd = null;
            int rsp = 0;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ActualizarImpresionConstancia");
                cmd.Parameters.AddWithValue("@idConstancia", objConstanciaRn.idConstancia);
                cmd.Parameters.AddWithValue("@idUsuario", objConstanciaRn.idUsuario);
                rsp = cmd.ExecuteNonQuery();
                return rsp;
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

        public Task<DataSet> ListarMigracionPacientesRecienNacido(string TipoFiltro, string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "Web_ListarHospitalizadosRN_V2";
                        string sql = "MigracionHistoriasRN";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@tipo", SqlDbType.Char).Value = TipoFiltro;
                        da.SelectCommand.Parameters.Add("@buscar", SqlDbType.VarChar).Value = Filtro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        public Task<DataSet> ReporteRegistroRn(int idUsuario, DateTime FechaInicio, DateTime FechaFin)
        {            
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ReporteRegistroRn";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 500;

                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@FechaIni", SqlDbType.Date).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.Date).Value = FechaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ReporteEstadisticoRegistroRn(int idUsuario, DateTime FechaInicio, DateTime FechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ReporteEstadisticoRegistroRn";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 500;

                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@FechaIni", SqlDbType.Date).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.Date).Value = FechaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarRecienNacidosDiagnosticos(int idRecienNacido)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecienNacidosDiagnosticosSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRecienNacido", SqlDbType.Int).Value = idRecienNacido;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
