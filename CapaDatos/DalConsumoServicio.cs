using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalConsumoServicio
    {
        public int InsertaFactOrdenServicio(FactOrdenServicio objFactOrdenServicio, int? SeCargaEnInterconsulta = null)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_FactOrdenServicioAgregar");

                //cmd.Parameters.AddWithValue("@IdOrden", objFactOrdenServicio.IdOrden);
                cmd.Parameters.Add("@IdOrden", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@IdPuntoCarga", objFactOrdenServicio.IdPuntoCarga);
                cmd.Parameters.AddWithValue("@IdPaciente", objFactOrdenServicio.IdPaciente);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", objFactOrdenServicio.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdServicioPaciente", objFactOrdenServicio.IdServicioPaciente);
                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", objFactOrdenServicio.idTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", objFactOrdenServicio.idFuenteFinanciamiento);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFactOrdenServicio.FechaCreacion);
                cmd.Parameters.AddWithValue("@IdUsuario", objFactOrdenServicio.IdUsuario);
                cmd.Parameters.AddWithValue("@FechaDespacho", objFactOrdenServicio.FechaDespacho);
                cmd.Parameters.AddWithValue("@IdUsuarioDespacho", objFactOrdenServicio.IdUsuarioDespacho);
                cmd.Parameters.AddWithValue("@IdEstadoFacturacion", objFactOrdenServicio.IdEstadoFacturacion);
                cmd.Parameters.AddWithValue("@FechaHoraRealizaCpt", objFactOrdenServicio.FechaHoraRealizaCpt);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objFactOrdenServicio.IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@SeCargaEnInterconsulta", SeCargaEnInterconsulta ?? Convert.DBNull);


                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@IdOrden"].Value.ToString());


            }
            catch (Exception ex)
            {
                nRpta = 0;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }
        public async Task<int> InsertaFactOrdenServicioAsync(FactOrdenServicio objFactOrdenServicio)
        {
            int nRpta = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FactOrdenServicioAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@IdOrden", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@IdPuntoCarga", objFactOrdenServicio.IdPuntoCarga);
                cmd.Parameters.AddWithValue("@IdPaciente", objFactOrdenServicio.IdPaciente);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", objFactOrdenServicio.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdServicioPaciente", objFactOrdenServicio.IdServicioPaciente);
                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", objFactOrdenServicio.idTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", objFactOrdenServicio.idFuenteFinanciamiento);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFactOrdenServicio.FechaCreacion);
                cmd.Parameters.AddWithValue("@IdUsuario", objFactOrdenServicio.IdUsuario);
                cmd.Parameters.AddWithValue("@FechaDespacho", objFactOrdenServicio.FechaDespacho);
                cmd.Parameters.AddWithValue("@IdUsuarioDespacho", objFactOrdenServicio.IdUsuarioDespacho);
                cmd.Parameters.AddWithValue("@IdEstadoFacturacion", objFactOrdenServicio.IdEstadoFacturacion);
                cmd.Parameters.AddWithValue("@FechaHoraRealizaCpt", objFactOrdenServicio.FechaHoraRealizaCpt);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objFactOrdenServicio.IdUsuarioAuditoria);

                await conn.OpenAsync();

                // Execute the stored procedure and get the result as a string
                var result = await cmd.ExecuteNonQueryAsync();

                nRpta = int.Parse(cmd.Parameters["@IdOrden"].Value.ToString());

                await conn.CloseAsync();

                return nRpta;
            }

        }
        public int InsertaFactOrdenServicioPagos(FactOrdenServicioPagos objFactOrdenServicioPagos)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_FactOrdenServicioPagosAgregar");

                //cmd.Parameters.AddWithValue("@idOrdenPago", objFactOrdenServicioPagos.idOrdenPago);
                cmd.Parameters.Add("@idOrdenPago", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idComprobantePago", (objFactOrdenServicioPagos.idComprobantePago == null) ? 0 : objFactOrdenServicioPagos.idComprobantePago);
                cmd.Parameters.AddWithValue("@idOrden", objFactOrdenServicioPagos.idOrden);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFactOrdenServicioPagos.FechaCreacion);
                cmd.Parameters.AddWithValue("@IdUsuario", objFactOrdenServicioPagos.IdUsuario);
                cmd.Parameters.AddWithValue("@IdEstadoFacturacion", objFactOrdenServicioPagos.IdEstadoFacturacion);
                cmd.Parameters.AddWithValue("@ImporteExonerado", objFactOrdenServicioPagos.ImporteExonerado);
                cmd.Parameters.AddWithValue("@idUsuarioExonera", objFactOrdenServicioPagos.idUsuarioExonera);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objFactOrdenServicioPagos.idUsuarioAuditoria);

                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@idOrdenPago"].Value.ToString());


            }
            catch (Exception ex)
            {
                nRpta = 0;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }
        public async Task<int> InsertaFactOrdenServicioPagosV2(FactOrdenServicioPagos objFactOrdenServicioPagos)
        {
            int nRpta = 0;


            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FactOrdenServicioPagosAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@idOrdenPago", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idComprobantePago", (objFactOrdenServicioPagos.idComprobantePago == null) ? 0 : objFactOrdenServicioPagos.idComprobantePago);
                cmd.Parameters.AddWithValue("@idOrden", objFactOrdenServicioPagos.idOrden);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFactOrdenServicioPagos.FechaCreacion);
                cmd.Parameters.AddWithValue("@IdUsuario", objFactOrdenServicioPagos.IdUsuario);
                cmd.Parameters.AddWithValue("@IdEstadoFacturacion", objFactOrdenServicioPagos.IdEstadoFacturacion);
                cmd.Parameters.AddWithValue("@ImporteExonerado", objFactOrdenServicioPagos.ImporteExonerado);
                cmd.Parameters.AddWithValue("@idUsuarioExonera", objFactOrdenServicioPagos.idUsuarioExonera);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objFactOrdenServicioPagos.idUsuarioAuditoria);

                await conn.OpenAsync();

                // Execute the stored procedure and get the result as a string
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@idOrdenPago"].Value.ToString());


                return nRpta;
            }

        }
        public DataSet ListaTriaje(int idAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaTraije");
                cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

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

        public Boolean InsertaServicioDespacho(List<FacturacionServicioDespacho> dsConsumoDetalle, int idorden)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {

                string xmlConsumoDetalle;
                xmlConsumoDetalle = XmlUtil.Serializer(typeof(List<FacturacionServicioDespacho>), dsConsumoDetalle);

                cmd = MetodoDatos.CrearComando("web_FacturacionServicioDespachoAgregarV2");

                cmd.Parameters.AddWithValue("@idOrden", idorden);
                cmd.Parameters.AddWithValue("@detalle", xmlConsumoDetalle);

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

        public async Task<Boolean> InsertaServicioDespachoV2(List<FacturacionServicioDespacho> dsConsumoDetalle, int idorden)
        {

            Boolean nRpta = true;

            string xmlConsumoDetalle;
            xmlConsumoDetalle = XmlUtil.Serializer(typeof(List<FacturacionServicioDespacho>), dsConsumoDetalle);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FacturacionServicioDespachoAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idOrden", idorden);
                cmd.Parameters.AddWithValue("@detalle", xmlConsumoDetalle);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }
        
        public Boolean InsertaServicioDespachoConDescripcion(List<FacturacionServicioDespacho> dsConsumoDetalle, int idorden) // jdelgado
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {

                string xmlConsumoDetalle;
                xmlConsumoDetalle = XmlUtil.Serializer(typeof(List<FacturacionServicioDespacho>), dsConsumoDetalle);

                cmd = MetodoDatos.CrearComando("web_FacturacionServicioDespachoConDescripcionAgregar");

                cmd.Parameters.AddWithValue("@idOrden", idorden);
                cmd.Parameters.AddWithValue("@detalle", xmlConsumoDetalle);

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

        public DataSet TiposFinanciamientoSeleccionarPorId(int idTipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("TiposFinanciamientoSeleccionarPorId");
                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", idTipo);

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

        public async Task<DataSet> TiposFinanciamientoSeleccionarPorIdV2(int idTipo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposFinanciamientoSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", idTipo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

            
        }

        public Boolean InsertaFacturacionServicioFinanciamientos(List<FacturacionServicioDespacho> dsConsumoDetalle, int idorden, int IdTipoFinanciamiento, int IdUsuarioAutoriza, int IdFuenteFinanciamiento)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {

                string xmlConsumoDetalle;
                xmlConsumoDetalle = XmlUtil.Serializer(typeof(List<FacturacionServicioDespacho>), dsConsumoDetalle);

                cmd = MetodoDatos.CrearComando("[web_FacturacionServicioFinanciamientosDetalleAgregar]");

                cmd.Parameters.AddWithValue("@idOrden", idorden);
                cmd.Parameters.AddWithValue("@detalle", xmlConsumoDetalle);
                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", IdTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@IdUsuarioAutoriza", IdUsuarioAutoriza);
                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento);

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

        public Boolean InsertaFacturacionServicioPagosDetalle(List<FacturacionServicioDespacho> dsConsumoDetalle, int idorden, int IdUsuarioAutoriza)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {

                string xmlConsumoDetalle;
                xmlConsumoDetalle = XmlUtil.Serializer(typeof(List<FacturacionServicioDespacho>), dsConsumoDetalle);

                cmd = MetodoDatos.CrearComando("[web_FacturacionServicioPagosDetalleAgregar]");

                cmd.Parameters.AddWithValue("@idOrden", idorden);
                cmd.Parameters.AddWithValue("@detalle", xmlConsumoDetalle);
                cmd.Parameters.AddWithValue("@IdUsuarioAutoriza", IdUsuarioAutoriza);


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

        public DataSet ListaConsumoServicioByfechas(string FechaInicio, string FechaFin, int idPuntoCarga, int idCuenta, int historia, int idOrden)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaConsumoServicioByfechas");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                cmd.Parameters.AddWithValue("@idCuenta", idCuenta);
                cmd.Parameters.AddWithValue("@historia", historia);
                cmd.Parameters.AddWithValue("@idOrden", idOrden);

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

        public DataSet FactOrdenServicioSeleccionarPorId(int idOrden)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("[web_FactOrdenServicioSeleccionarPorId]");

                cmd.Parameters.AddWithValue("@idOrden", idOrden);

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

        public async Task<DataSet> FactOrdenServicioSeleccionarPorIdV2(int idOrden)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FactOrdenServicioSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idOrden", idOrden);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        //public DataSet FacturacionServicioDespachoDetalleFiltraPorIdOrden(int idOrden)
        //{
        //    DataSet ds = new DataSet();
        //    SqlCommand cmd = null;
        //    try
        //    {

        //        cmd = MetodoDatos.CrearComando("[web_FacturacionServicioDespachoFiltraPorIdOrden]");

        //        cmd.Parameters.AddWithValue("@idOrden", idOrden);

        //        SqlDataAdapter da = new SqlDataAdapter(cmd);

        //        da.Fill(ds);

        //    }
        //    catch (Exception ex)
        //    {

        //        ds = null; throw new Exception(ex.Message);
        //    }
        //    finally
        //    {
        //        cmd.Connection.Close();
        //    }
        //    return ds;
        //}

        public async Task<DataSet> FacturacionServicioDespachoDetalleFiltraPorIdOrden(int idOrden)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FacturacionServicioDespachoFiltraPorIdOrden", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@idOrden", idOrden);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public DataSet FactOrdenServicioPagosSeleccionarPorIdOrden(int idOrden)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("[FactOrdenServicioPagosSeleccionarPorIdOrden]");

                cmd.Parameters.AddWithValue("@idOrden", idOrden);

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

        public async Task<DataSet> FactOrdenServicioPagosSeleccionarPorIdOrdenV2(int idOrden)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FactOrdenServicioPagosSeleccionarPorIdOrden", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idOrden", idOrden);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public Boolean EliminaConsumoServicio(int idOrden, int idUsuario)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {


                cmd = MetodoDatos.CrearComando("[web_eliminarConsumoServicio]");

                cmd.Parameters.AddWithValue("@idOrden", idOrden);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
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

        public Task<DataSet> BuscaAtencionesCptCEparaFormatoHIS(int idCuentaAtencion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BuscaAtencionesCptCEparaFormatoHIS";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        //da.SelectCommand.Parameters.Add("@lnIdPuntoCarga", SqlDbType.Int).Value = 0; // solo para puerto maldonado

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }


            });
        }

        public Task<DataSet> BuscaAtencionesCptCEparaFormatoHISInterconsulta(int idCuentaAtencion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BuscaAtencionesCptCEparaFormatoHISInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        //da.SelectCommand.Parameters.Add("@lnIdPuntoCarga", SqlDbType.Int).Value = 0; // solo para puerto maldonado

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }


            });
        }

        public Task<DataSet> BuscaAtencionesCptCEparaFormatoHISConDescripcion(int idCuentaAtencion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BuscaAtencionesCptCEparaFormatoHISConDescripcion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        //da.SelectCommand.Parameters.Add("@lnIdPuntoCarga", SqlDbType.Int).Value = 0; // solo para puerto maldonado

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }


            });
        }

        public Task<DataSet> ListaCptPorTipoItemMinsaIdCuentaAtencion(int idCuentaAtencion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BuscaAtencionesCptCEparaFormatoHIS";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        //da.SelectCommand.Parameters.Add("@lnIdPuntoCarga", SqlDbType.Int).Value = 0; // solo para puerto maldonado

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }


            });
        }

        public Task<DataSet> FactOrdenServicioFiltraPorIdCuenta(int idCuentaAtencion) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactOrdenServicioFiltraPorIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ConsumoServicioPorCodigoGuardar(int idCuentaAtencion, string codigoCPT, int cantidad, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ConsumoServicioPorCodigoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", idCuentaAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@CodigoCPT", codigoCPT);
                        da.SelectCommand.Parameters.AddWithValue("@Cantidad", cantidad);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public DataSet ListaServiciobyTipoServicio(int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_ListaServiciobyTipoServicio");

                cmd.Parameters.AddWithValue("@IdTipoServicio", idTipoServicio);

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

        public async Task<int> RegistraModificaInformeProcedimientos(
            int IdAtencion, int? IdPaciente, int IdOrden, int IdProducto, int? IdMedico, int? TipoIntervencion, DateTime? FechaCirugia, string HoraCirugia, string HoraFinalCirugia, int? Gasas, string CantGasas,
            int? Apositos, string CantApositos, int? PrimeraAnestesia, int? TipoPrimeraAnestesia, int? SegundaAnestesia, int? TipoSegundaAnestesia, string PlanTrabajo, string HoraInicioAtencion, string Tecnicas,
            string Hallazgos, string IncidentesAccidentes, int? AnatomiaPatologica, string TejidoOrganoExaminar, int? Destino, int? IdUsuario, List<Diagnosticos> dsDiagnosticos, int clasificacionDiagnostico) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            string xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_RegistraModificaInformeProcedimientos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                cmd.Parameters.AddWithValue("@IdMedico", IdMedico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TipoIntervencion", TipoIntervencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaCirugia", FechaCirugia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraCirugia", HoraCirugia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraFinalCirugia", HoraFinalCirugia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Gasas", Gasas ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@CantGasas", CantGasas ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@Apositos", Apositos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@CantApositos", CantApositos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PrimeraAnestesia", PrimeraAnestesia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TipoPrimeraAnestesia", TipoPrimeraAnestesia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SegundaAnestesia", SegundaAnestesia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TipoSegundaAnestesia", TipoSegundaAnestesia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PlanTrabajo", PlanTrabajo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraInicioAtencion", HoraInicioAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Tecnicas", Tecnicas ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@Hallazgos", Hallazgos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IncidentesAccidentes", IncidentesAccidentes ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AnatomiaPatologica", AnatomiaPatologica ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TejidoOrganoExaminar", TejidoOrganoExaminar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Destino", Destino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario ?? Convert.DBNull);

                cmd.Parameters.Add("@Diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = 1;

                return nRpta;
            }

        }

        public async Task<DataSet> SeleccionarInformeProcedimiento(int IdAtencion, int IdOrden, int IdProducto)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarInformeProcedimiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                cmd.Parameters.AddWithValue("@IdProducto", IdProducto);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<DataSet> ConsumoServicioSeleccionar(int idOrden) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ConsumoServicioSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = idOrden;
                        //da.SelectCommand.Parameters.Add("@lnIdPuntoCarga", SqlDbType.Int).Value = 0; // solo para puerto maldonado

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }


            });
        }

        public DataSet ListarProcedimientosRealizadosPorHistoriaTamizaje(int IdPaciente)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("Web_ListarProcedimientosRealizadosPorHistoriaTamizaje");

                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);

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
