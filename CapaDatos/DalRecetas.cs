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
    public class DalRecetas
    {
        public Receta RegistrarReceta(Receta objReceta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("RecetaCabeceraAgregar");

                cmd.Parameters.Add("@idReceta", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@IdPuntoCarga", objReceta.idPuntoCarga);
                cmd.Parameters.AddWithValue("@FechaReceta", DateTime.Parse(objReceta.fechaReceta + " 00:01"));
                cmd.Parameters.AddWithValue("@idCuentaAtencion", objReceta.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idServicioReceta", objReceta.idServicioReceta);
                cmd.Parameters.AddWithValue("@idEstado", objReceta.idEstado);
                cmd.Parameters.AddWithValue("@idComprobantePago", objReceta.idComprobantePago);
                cmd.Parameters.AddWithValue("@idMedicoReceta", objReceta.idMedico);
                cmd.Parameters.AddWithValue("@FechaVigencia", objReceta.fechaVigencia);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objReceta.idUsuario);

                cmd.ExecuteNonQuery();


                objReceta.idReceta = int.Parse(cmd.Parameters["@idReceta"].Value.ToString());
            }
            catch (Exception ex)
            {
                objReceta.idReceta = 0;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return objReceta;
        }

        //////////////////////////KHOYOSI////////////////////////////////////////////////
        public Receta RegistrarRecetaPorNroEvaluacion(Receta objReceta, int? nroEvaluacion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_RecetaCabeceraAgregarPorNumeroEvaluacion");

                cmd.Parameters.Add("@idReceta", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@IdPuntoCarga", objReceta.idPuntoCarga);
                cmd.Parameters.AddWithValue("@FechaReceta", DateTime.Parse(objReceta.fechaReceta + " 00:01"));
                cmd.Parameters.AddWithValue("@idCuentaAtencion", objReceta.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idServicioReceta", objReceta.idServicioReceta);
                cmd.Parameters.AddWithValue("@idEstado", objReceta.idEstado);
                cmd.Parameters.AddWithValue("@idComprobantePago", objReceta.idComprobantePago);
                cmd.Parameters.AddWithValue("@idMedicoReceta", objReceta.idMedico);
                cmd.Parameters.AddWithValue("@FechaVigencia", objReceta.fechaVigencia);
                cmd.Parameters.AddWithValue("@NroEvaluacion", nroEvaluacion);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objReceta.idUsuario);

                cmd.ExecuteNonQuery();

                objReceta.idReceta = int.Parse(cmd.Parameters["@idReceta"].Value.ToString());
            }
            catch (Exception ex)
            {
                objReceta.idReceta = 0;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return objReceta;
        }
        //////////////////////////////////////////////////////////////////////////

        //////////////////////KHOYOSI//////////////////////////////////////////
        public Task<DataSet> ListaRecetasCabeceraIdCuentaAtencionPorNroEvaluacion(int idCuenta, int nroEvaluacion, int idServicio, int idMedico)  
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "web_listaCabRecByCAPorNroEvaluacion";
                        string sql = "web_ListarCabeceraRecetaByIdCuentaByNroEvaluacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = idCuenta;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }
        //////////////////////////////////////////////////////////////////////////
        public Boolean ModifcarReceta(Receta objReceta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            Boolean resp = false;
            try
            {

                cmd = MetodoDatos.CrearComando("web_RecetaCabeceraModificar");
                cmd.Parameters.AddWithValue("@idReceta", objReceta.idReceta);
                cmd.Parameters.AddWithValue("@IdPuntoCarga", objReceta.idPuntoCarga);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", objReceta.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idServicioReceta", objReceta.idServicioReceta);
                cmd.Parameters.AddWithValue("@idEstado", objReceta.idEstado);
                cmd.Parameters.AddWithValue("@idComprobantePago", objReceta.idComprobantePago);
                cmd.Parameters.AddWithValue("@idMedicoReceta", objReceta.idMedico);
                cmd.Parameters.AddWithValue("@FechaVigencia", objReceta.fechaVigencia);
                cmd.Parameters.AddWithValue("@otrosMedicamentos", objReceta.otrosMedicamentos);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objReceta.idUsuario);

                cmd.ExecuteNonQuery();
                resp = true;
            }
            catch (Exception ex)
            {
                resp = false;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return resp;
        }

        public DataSet ListaRecetaCabeceraById(int idReceta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("RecetaCabeceraSeleccionarPorId");
                cmd.Parameters.AddWithValue("@idReceta", idReceta);
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> ListaRecetaCabeceraById2(int idReceta) // JDELGADO J0 ASYNC METHOD
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_RecetaCabeceraSeleccionarPorIdV2"; // para puerto maldonado poner web
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;
                    }
                }
            });

        }

        public Task<DataSet> ListaRecetaCabeceraPorMultipleId(string idReceta) // JDELGADO J0 ASYNC METHOD
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_RecetaCabeceraSeleccionarPorMultipleId"; // para puerto maldonado poner web
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.VarChar).Value = idReceta;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;
                    }
                }
            });

        }

        public Task<DataSet> ListaRecetaDetalle(int idReceta, int idPuntoCarga) // JDELGADO J0 ASYNC METHOD
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ReceDetalle";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdReceta", SqlDbType.Int).Value = idReceta;
                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@PtoCargaFarmacia", SqlDbType.Int).Value = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }
        public DataSet ListaRecetaDetalleGeneral(int hc, int idPuntoCarga)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaOrdenesGenerales");
                cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                cmd.Parameters.AddWithValue("@hc", hc);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        public DataSet ListaRecetasIdCuentaAtencion(int idCuenta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaRecetasByidCuentaAtencion");
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", idCuenta);


                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet ListaRecetasDetalleDespachadasPorIdCuentaAtencion(int idCuenta, int idPuntoCarga)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_RecetaDetalleSeleccionarDespachadasPorCuenta");
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", idCuenta);
                cmd.Parameters.AddWithValue("@IdPuntocarga", idPuntoCarga);


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

        public DataSet RecetaDetalleSeleccionarSoloMedicamentosDespachadasPorCuenta(int idCuenta, int idPuntoCarga)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_RecetaDetalleSeleccionarSoloMedicamentosDespachadasPorCuenta");
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", idCuenta);
                cmd.Parameters.AddWithValue("@IdPuntocarga", idPuntoCarga);


                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Boolean InsertaRecetaDetalle(List<RecetaDetalle> dsRecetaDetalle, int idReceta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            Boolean resp = false;
            try
            {
                string xmlRecetaDetalle;
                xmlRecetaDetalle = XmlUtil.Serializer(typeof(List<RecetaDetalle>), dsRecetaDetalle);

                cmd = MetodoDatos.CrearComando("web_InsertaRecetaDetalle");
                cmd.Parameters.AddWithValue("@detalleReceta", xmlRecetaDetalle);
                cmd.Parameters.AddWithValue("@idReceta", idReceta);


                cmd.ExecuteNonQuery();
                resp = true;
            }
            catch (Exception ex)
            {
                resp = false;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return resp;
        }


        public Task<DataSet> ListaRecetasCabeceraIdCuentaAtencion(int idCuenta)  // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaCabRecByCA";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = idCuenta;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaRecetasCabeceraByIdCuentaAtencion(int idCuenta, int idServicio, int idMedico)  // KHOYOSI 
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarCabeceraRecetaByIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = idCuenta;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaRecetasCabeceraByIdReceta(int idReceta, int idServicio, int idMedico)  // KHOYOSI 
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarCabeceraRecetaByIdReceta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdReceta", SqlDbType.Int).Value = idReceta;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public DataSet ListaResultadosDeImagenesByIdOrdenByIdProducto(int idReceta, int idProducto, int idTipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_LabImgR");
                cmd.Parameters.AddWithValue("@idProducto", idProducto);
                cmd.Parameters.AddWithValue("@idReceta", idReceta);
                cmd.Parameters.AddWithValue("@idTipo", idTipo);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;

        }
        public DataSet ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(int idProducto, int idOrden, int idTipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_LabImgRGenerales");
                cmd.Parameters.AddWithValue("@idProducto", idProducto);
                cmd.Parameters.AddWithValue("@idOrden", idOrden);
                cmd.Parameters.AddWithValue("@idTipo", idTipo);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;

        }
        public DataSet ListarImgLabObservaciones(int idMovimiento, int idProducto, int idOrden)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("ListarImgLabObservaciones");
                cmd.Parameters.AddWithValue("@idOrden", idOrden);
                cmd.Parameters.AddWithValue("@idProducto", idProducto);
                cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;

        }

        public Task<DataSet> ListarPrescriptores() // KHOYOSI
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarPrescriptores";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarRecetas(int nroReceta, int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno ,int idServicioGeneral)
        {
            
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaRecetas";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@nroReceta", SqlDbType.Int).Value = nroReceta;
                        da.SelectCommand.Parameters.Add("@nroCuenta", SqlDbType.Int).Value = nroCuenta;
                        da.SelectCommand.Parameters.Add("@nroDni", SqlDbType.VarChar).Value = nroDni;
                        da.SelectCommand.Parameters.Add("@nroHistoria", SqlDbType.Int).Value = nroHistoria;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno;
                        da.SelectCommand.Parameters.Add("@idServicioGeneral", SqlDbType.Int).Value = idServicioGeneral;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Boolean EliminaReceta(int idReceta,int usuario)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_eliminaReceta");

                cmd.Parameters.AddWithValue("@idReceta", idReceta);
                cmd.Parameters.AddWithValue("@idUsuario", usuario);

                cmd.ExecuteNonQuery();

                nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public async Task<DataSet> DevuelveViaxidProducto(int idProducto)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("wEB_RecetaDetalleXultimaViaAdministracion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@idProducto", idProducto);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
                        
        }

        //////////////////////////JDELGADO011////////////////////////////////////////////////
        public int InsertaRecetaDetalleInterconsulta(int idEspecialidadInterconsulta, int idTipoConsultaInterconsulta, string resumenHistoriaClinica, string motivoInterconsulta, int idReceta)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            int idRecetaDetalleInterconsulta;
            try
            {
                cmd = MetodoDatos.CrearComando("web_InsertaRecetaDetalleInterconsulta");

                cmd.Parameters.Add("@idRecetaDetalleInterconsulta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@resumenHistoriaClinica", resumenHistoriaClinica);
                cmd.Parameters.AddWithValue("@motivoInterconsulta", motivoInterconsulta);
                cmd.Parameters.AddWithValue("@idEspecialidad", idEspecialidadInterconsulta);
                cmd.Parameters.AddWithValue("@idTipoConsulta", idTipoConsultaInterconsulta);
                cmd.Parameters.AddWithValue("@idReceta", idReceta);

                cmd.ExecuteNonQuery();

                idRecetaDetalleInterconsulta = int.Parse(cmd.Parameters["@idRecetaDetalleInterconsulta"].Value.ToString());
            }
            catch (Exception ex)
            {
                idRecetaDetalleInterconsulta = 0;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return idRecetaDetalleInterconsulta;
        }

        public Task<DataSet> SeleccionaRecetaDetalleInterconsultaByIdReceta(int idReceta)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_SeleccionaRecetaDetalleInterconsultaByIdReceta";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {
                            ds = null;
                            throw new Exception(ex.Message);
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
        //////////////////////////////////////////////////////////////////////////


        /////////////////////////////////////KHOYOSI//////////////////////////////////////////
        public Task<Receta> RegistrarRecetaV2(Receta objReceta)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            DateTime horaActual = DateTime.Now;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraAgregar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Direction = ParameterDirection.Output;
                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = objReceta.idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@FechaReceta", SqlDbType.DateTime).Value = DateTime.Parse(objReceta.fechaReceta + " " + horaActual.ToString("HH:mm"));
                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = objReceta.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idServicioReceta", SqlDbType.Int).Value = objReceta.idServicioReceta;
                        da.SelectCommand.Parameters.Add("@idEstado", SqlDbType.Int).Value = objReceta.idEstado;
                        da.SelectCommand.Parameters.Add("@idComprobantePago", SqlDbType.Int).Value = objReceta.idComprobantePago;
                        da.SelectCommand.Parameters.Add("@idMedicoReceta", SqlDbType.Int).Value = objReceta.idMedico;
                        da.SelectCommand.Parameters.Add("@FechaVigencia", SqlDbType.DateTime).Value = objReceta.fechaVigencia;
                        da.SelectCommand.Parameters.Add("@PreUnidosis", SqlDbType.VarChar).Value = objReceta.nroPreUnidosis;

                        da.SelectCommand.Parameters.Add("@EsRecetaAntimicrobiano", SqlDbType.VarChar).Value = objReceta.esRecetaAntimicrobiano;

                        da.SelectCommand.Parameters.Add("@IdObstetraReceta", SqlDbType.Int).Value = objReceta.idObstetra;
                        da.SelectCommand.Parameters.Add("@EsRecetaIntervencionSanitaria", SqlDbType.Int).Value = objReceta.esRecetaIntervencionSanitaria;
                        da.SelectCommand.Parameters.Add("@IdCoordinadorIS", SqlDbType.Int).Value = objReceta.idCoordinadorIS;
                        da.SelectCommand.Parameters.Add("@IdComponenteIS", SqlDbType.Int).Value = objReceta.idComponenteIS;
                        da.SelectCommand.Parameters.Add("@IdSubComponenteIS", SqlDbType.Int).Value = objReceta.idSubComponenteIS;
                        da.SelectCommand.Parameters.Add("@IdDiagnosticoIS", SqlDbType.Int).Value = objReceta.idDiagnosticoIS;
                        da.SelectCommand.Parameters.Add("@ObservacionesIS", SqlDbType.VarChar).Value = objReceta.ObservacionesIS;
                        da.SelectCommand.Parameters.Add("@otrosMedicamentos", SqlDbType.VarChar).Value = objReceta.otrosMedicamentos; //MGAMERO

                        da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = objReceta.idUsuario;
                                                
                        da.Fill(ds);

                        objReceta.idReceta = int.Parse(da.SelectCommand.Parameters["@idReceta"].Value.ToString());

                        return objReceta;
                        //return ds;
                    }
                }
            });                        
        }

        //////////////////////////KHOYOSI////////////////////////////////////////////////
        public Task<Receta> RegistrarRecetaPorNroEvaluacionV2(Receta objReceta, int? nroEvaluacion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            DateTime horaActual = DateTime.Now;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraAgregarPorNumeroEvaluacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Direction = ParameterDirection.Output;
                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = objReceta.idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@FechaReceta", SqlDbType.DateTime).Value = DateTime.Parse(objReceta.fechaReceta + " " + horaActual.ToString("HH:mm"));
                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = objReceta.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idServicioReceta", SqlDbType.Int).Value = objReceta.idServicioReceta;
                        da.SelectCommand.Parameters.Add("@idEstado", SqlDbType.Int).Value = objReceta.idEstado;
                        da.SelectCommand.Parameters.Add("@idComprobantePago", SqlDbType.Int).Value = objReceta.idComprobantePago;
                        da.SelectCommand.Parameters.Add("@idMedicoReceta", SqlDbType.Int).Value = objReceta.idMedico;
                        da.SelectCommand.Parameters.Add("@FechaVigencia", SqlDbType.DateTime).Value = objReceta.fechaVigencia;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;

                        da.SelectCommand.Parameters.Add("@EsRecetaAntimicrobiano", SqlDbType.Int).Value = objReceta.esRecetaAntimicrobiano;

                        da.SelectCommand.Parameters.Add("@IdObstetraReceta", SqlDbType.Int).Value = objReceta.idObstetra;
                        da.SelectCommand.Parameters.Add("@EsRecetaIntervencionSanitaria", SqlDbType.Int).Value = objReceta.esRecetaIntervencionSanitaria;                        
                        da.SelectCommand.Parameters.Add("@IdCoordinadorIS", SqlDbType.Int).Value = objReceta.idCoordinadorIS;
                        da.SelectCommand.Parameters.Add("@IdComponenteIS", SqlDbType.Int).Value = objReceta.idComponenteIS;
                        da.SelectCommand.Parameters.Add("@IdSubComponenteIS", SqlDbType.Int).Value = objReceta.idSubComponenteIS;
                        da.SelectCommand.Parameters.Add("@IdDiagnosticoIS", SqlDbType.Int).Value = objReceta.idDiagnosticoIS;
                        da.SelectCommand.Parameters.Add("@ObservacionesIS", SqlDbType.VarChar).Value = objReceta.ObservacionesIS;
                        da.SelectCommand.Parameters.Add("@otrosMedicamentos", SqlDbType.VarChar).Value = objReceta.otrosMedicamentos; //MGAMERO

                        da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = objReceta.idUsuario;


                        da.Fill(ds);

                        objReceta.idReceta = int.Parse(da.SelectCommand.Parameters["@idReceta"].Value.ToString());

                        return objReceta;
                        //return ds;
                    }
                }
            });                        
        }
        /////////////////////////////////////////////////////////////////////////////////////


        /////////////////////////KHOYOSI///////////////////////////////////////////
        public Task<DataSet> ListaRecetaCabeceraByIdV2(int idReceta)
        {
            DataSet ds = new DataSet();            
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "RecetaCabeceraSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

                        da.Fill(ds);
                                                
                        return ds;
                    }
                }
            });            
        }

        public Task<DataSet> ListarOrdenesMedicasPorIdCuenta(int idCuenta)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraSeleccionarPorIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuenta", SqlDbType.Int).Value = idCuenta;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarOrdenesMedicasPorIdPaciente(int idPaciente)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraSeleccionarPorIdPaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> ModifcarRecetaV2(Receta objReceta)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();            
            Boolean resp = false;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = objReceta.idReceta;
                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = objReceta.idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = objReceta.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idServicioReceta", SqlDbType.Int).Value = objReceta.idServicioReceta;
                        da.SelectCommand.Parameters.Add("@idEvaluacion", SqlDbType.Int).Value = objReceta.nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@idEstado", SqlDbType.Int).Value = objReceta.idEstado;
                        da.SelectCommand.Parameters.Add("@idComprobantePago", SqlDbType.Int).Value = objReceta.idComprobantePago;
                        da.SelectCommand.Parameters.Add("@idMedicoReceta", SqlDbType.Int).Value = objReceta.idMedico;
                        da.SelectCommand.Parameters.Add("@FechaVigencia", SqlDbType.DateTime).Value = objReceta.fechaVigencia;
                        da.SelectCommand.Parameters.Add("@PreUnidosis", SqlDbType.VarChar).Value = objReceta.nroPreUnidosis;
                        //da.SelectCommand.Parameters.Add("@EsRecetaAntimicrobiano", SqlDbType.VarChar).Value = objReceta.esRecetaAntimicrobiano;
                        //da.SelectCommand.Parameters.Add("@EsRecetaIntervencionSanitaria", SqlDbType.VarChar).Value = objReceta.esRecetaIntervencionSanitaria;
                        da.SelectCommand.Parameters.Add("@IdObstetraReceta", SqlDbType.Int).Value = objReceta.idObstetra;
                        da.SelectCommand.Parameters.Add("@IdCoordinadorIS", SqlDbType.Int).Value = objReceta.idCoordinadorIS;
                        da.SelectCommand.Parameters.Add("@IdComponenteIS", SqlDbType.Int).Value = objReceta.idComponenteIS;
                        da.SelectCommand.Parameters.Add("@IdSubComponenteIS", SqlDbType.Int).Value = objReceta.idSubComponenteIS;
                        da.SelectCommand.Parameters.Add("@IdDiagnosticoIS", SqlDbType.Int).Value = objReceta.idDiagnosticoIS;
                        da.SelectCommand.Parameters.Add("@ObservacionesIS", SqlDbType.VarChar).Value = objReceta.ObservacionesIS;
                        da.SelectCommand.Parameters.Add("@otrosMedicamentos", SqlDbType.VarChar).Value = objReceta.otrosMedicamentos; //MGAMERO

                        da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = objReceta.idUsuario;

                        da.Fill(ds);

                        resp = true;

                        //return ds;
                        return resp;
                    }
                }
            });            
        }

        public Task<Boolean> InsertaRecetaDetalleV2(List<RecetaDetalle> dsRecetaDetalle, int idReceta)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            Boolean resp = false;
            string xmlRecetaDetalle;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        
                        xmlRecetaDetalle = XmlUtil.Serializer(typeof(List<RecetaDetalle>), dsRecetaDetalle);

                        string sql = "web_InsertaRecetaDetalle";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@detalleReceta", SqlDbType.Xml).Value = xmlRecetaDetalle;
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

                        da.Fill(ds);

                        resp = true;

                        //return ds;
                        return resp;
                    }
                }
            });            
        }

        public Task<int> InsertaRecetaDetalleInterconsultaV2(int idEspecialidadInterconsulta, int idTipoConsultaInterconsulta, string resumenHistoriaClinica, string motivoInterconsulta, int idReceta)
        {
            DataSet ds = new DataSet();            
            Conexion cx = new Conexion();
            int idRecetaDetalleInterconsulta;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertaRecetaDetalleInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRecetaDetalleInterconsulta", SqlDbType.Int).Direction = ParameterDirection.Output;
                        da.SelectCommand.Parameters.Add("@resumenHistoriaClinica", SqlDbType.Text).Value = resumenHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@motivoInterconsulta", SqlDbType.Text).Value = motivoInterconsulta;
                        da.SelectCommand.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidadInterconsulta;
                        da.SelectCommand.Parameters.Add("@idTipoConsulta", SqlDbType.Int).Value = idTipoConsultaInterconsulta;
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

                        da.Fill(ds);

                        idRecetaDetalleInterconsulta = int.Parse(da.SelectCommand.Parameters["@idRecetaDetalleInterconsulta"].Value.ToString());

                        //return ds;
                        return idRecetaDetalleInterconsulta;
                    }
                }
            });            
        }

        public Task<bool> InsertaRecetaDetalleInterconsultaV3(List<RecetaDetalleInterconsulta> dsRecetaDetalle, int idReceta, string resumenHistoriaClinica, string motivoInterconsulta)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            //int idRecetaDetalleInterconsulta;

            Boolean resp = false;
            string xmlRecetaDetalle;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        xmlRecetaDetalle = XmlUtil.Serializer(typeof(List<RecetaDetalleInterconsulta>), dsRecetaDetalle);

                        string sql = "web_InsertaRecetaDetalleInterconsultaV2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@detalleReceta", SqlDbType.Xml).Value = xmlRecetaDetalle;
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;
                        da.SelectCommand.Parameters.Add("@resumenHistoriaClinica", SqlDbType.VarChar).Value = resumenHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@motivoInterconsulta", SqlDbType.VarChar).Value = motivoInterconsulta;

                        da.Fill(ds);

                        resp = true;

                        //return ds;
                        return resp;
                    }
                }
            });





            //return Task.Run(() =>
            //{
            //    using (SqlConnection conn = cx.obtenerConexion())
            //    {
            //        using (SqlDataAdapter da = new SqlDataAdapter())
            //        {
            //            string sql = "web_InsertaRecetaDetalleInterconsulta";
            //            da.SelectCommand = new SqlCommand(sql, conn);
            //            da.SelectCommand.CommandType = CommandType.StoredProcedure;

            //            da.SelectCommand.Parameters.Add("@idRecetaDetalleInterconsulta", SqlDbType.Int).Direction = ParameterDirection.Output;
            //            da.SelectCommand.Parameters.Add("@resumenHistoriaClinica", SqlDbType.Text).Value = resumenHistoriaClinica;
            //            da.SelectCommand.Parameters.Add("@motivoInterconsulta", SqlDbType.Text).Value = motivoInterconsulta;
            //            da.SelectCommand.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidadInterconsulta;
            //            da.SelectCommand.Parameters.Add("@idTipoConsulta", SqlDbType.Int).Value = idTipoConsultaInterconsulta;
            //            da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;

            //            da.Fill(ds);

            //            idRecetaDetalleInterconsulta = int.Parse(da.SelectCommand.Parameters["@idRecetaDetalleInterconsulta"].Value.ToString());

            //            //return ds;
            //            return idRecetaDetalleInterconsulta;
            //        }
            //    }
            //});
        }

        public Task<Boolean> EliminaRecetaV2(int idReceta, int usuario)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            Boolean nRpta = false;            

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_eliminaReceta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = usuario;

                        da.Fill(ds);

                        nRpta = true;

                        //return ds;
                        return nRpta;
                    }
                }               
            });
        }
        //////////////////////////////////////////////////////////////////////////
        ///
        public Task<DataSet> ListarProcedimientosInterconsulta() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarProcedimientosInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CambiarEstadoRecetaDetalleInterconsulta(int idReceta, int idProducto, int idEstado) // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CambiarEstadoRecetaDetalleInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;
                        da.SelectCommand.Parameters.Add("@idItem", SqlDbType.Int).Value = idProducto;
                        da.SelectCommand.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ReceDetalleByNroEvaluacion(int IdCuentaAtencion, int idPuntoCarga, int NroEvaluacion) // JDELGADO J0 ASYNC METHOD
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "Web_ReceDetalleByNroEvaluacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@PtoCargaFarmacia", SqlDbType.Int).Value = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = NroEvaluacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> RecetasFiltrarPorRangoFechas(string NroDocumento, string NroHistoriaClinica, string apellidoPaterno, string FechaInicio, string FechaFinal, int idPuntoCarga, int EsAntimicrobiano)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraPorRangoFechas";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.Int).Value = NroHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = NroDocumento != null ? NroDocumento : "";
                        da.SelectCommand.Parameters.Add("@ApellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno != null ? apellidoPaterno : "";
                        da.SelectCommand.Parameters.Add("@FechaIni", SqlDbType.VarChar).Value = FechaInicio != null ? FechaInicio : "";
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = FechaFinal != null ? FechaFinal : "";
                        da.SelectCommand.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = idPuntoCarga;
                        da.SelectCommand.Parameters.Add("@EsAntimicrobiano", SqlDbType.Int).Value = EsAntimicrobiano;                                              

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public async Task<DataSet> RecetasByCuentaByEstado(int idCuentaAtencion, int idEstado) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_RecetasByCuentaByEstado", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                da.SelectCommand.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }


        //RMOREANO 07032026 PACIENTE CRONICO
        public Task<AtencionPacienteCronico> RegistrarRecetaPacienteCronico(AtencionPacienteCronico PacCronico)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            DateTime horaActual = DateTime.Now;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_InsertaRecetaDetallePacCronico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencionVin", SqlDbType.Int).Value = PacCronico.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = PacCronico.idReceta;

                        // OUTPUTS: NO usar .Value = ParameterDirection.Output
                        var p1 = da.SelectCommand.Parameters.Add("@idReceta_1", SqlDbType.Int);
                        p1.Direction = ParameterDirection.Output;

                        var p2 = da.SelectCommand.Parameters.Add("@idReceta_2", SqlDbType.Int);
                        p2.Direction = ParameterDirection.Output;

                        var p3 = da.SelectCommand.Parameters.Add("@bTieneCuentaAsoc", SqlDbType.Bit);
                        p3.Direction = ParameterDirection.Output;


                        var p4 = da.SelectCommand.Parameters.Add("@idCuentaAtencion1", SqlDbType.Int);
                        p4.Direction = ParameterDirection.Output;

                        var p5 = da.SelectCommand.Parameters.Add("@idCuentaAtencion2", SqlDbType.Int);
                        p5.Direction = ParameterDirection.Output;

                        

                        da.Fill(ds);

                        // Leer outputs (manejar DBNull)
                        PacCronico.idReceta_1 = (p1.Value == DBNull.Value) ? 0 : Convert.ToInt32(p1.Value);
                        PacCronico.idReceta_2 = (p2.Value == DBNull.Value) ? 0 : Convert.ToInt32(p2.Value);
                        PacCronico.bTieneCuentaAsoc = (p3.Value == DBNull.Value) ? false : Convert.ToBoolean(p3.Value);
                        PacCronico.idCuentaAtencion_1 = (p4.Value == DBNull.Value) ? 0 : Convert.ToInt32(p4.Value);
                        PacCronico.idCuentaAtencion_2 = (p5.Value == DBNull.Value) ? 0 : Convert.ToInt32(p5.Value);

                        return PacCronico;
                        //return ds;
                    }
                }
            });
        }


        /// <summary>
        /// Atiende el RF 10 de SISAMAR, 04/Mar/2026, OZUMARAN
        /// </summary>
        /// <param name="idPaciente"></param>
        /// <param name="idProducto"></param>
        /// <param name="diasVentana"></param>
        /// <returns></returns>
        public Task<DataSet> ValidarMedicamentoRecientePaciente(int idPaciente, int idProducto, int diasVentana)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();


            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaValidarMedicamentoRecientePaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = idProducto;
                        da.SelectCommand.Parameters.Add("@DiasVentana", SqlDbType.Int).Value = diasVentana;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        /// <summary>
        /// Devuelve el detalle de los medicamentos que recetaron al paciente segun su nro de atencion.
        /// Autor:RMOREANO
        /// </summary>
        /// <param name="idCuentaAtencion"></param>
        /// <returns></returns>
        public async Task<DataSet> DetalleRecetaByCuentaAtencion(int idCuentaAtencion) // 
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarMedicamentoxIdCuentaactencion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
    }
}
