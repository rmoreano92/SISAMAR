using CapaDatos;
using NPOI.POIFS.Crypt.Dsig;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalNotaCredito
    {

        public Task<DataSet> NotasCreditoListar(string nroSerie, string nroDocumento, string razonSocial, int idTipoEstado, string fechaInicio, string fechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotasCreditoListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = (object)nroSerie ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (object)nroDocumento ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RazonSocial", SqlDbType.VarChar).Value = (object)razonSocial ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoEstado", SqlDbType.Int).Value = (object)idTipoEstado ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.VarChar).Value = (object)fechaInicio ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = (object)fechaFin ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoSeleccionar(int idNota)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaCreditoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdNota", SqlDbType.Int).Value = (object)idNota ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoGuardar(NotaCredito notaCredito, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaCreditoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdNota", notaCredito.IdNota);
                        da.SelectCommand.Parameters.AddWithValue("@IdComprobantePago", notaCredito.IdComprobantePago);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoDocIdentidad", notaCredito.IdTipoDocIdentidadAfecto);
                        da.SelectCommand.Parameters.AddWithValue("@RUC", notaCredito.RUC);
                        da.SelectCommand.Parameters.AddWithValue("@RazonSocial", notaCredito.RazonSocial);
                        da.SelectCommand.Parameters.AddWithValue("@Direccion", notaCredito.Direccion);
                        da.SelectCommand.Parameters.AddWithValue("@IdMotivo", notaCredito.IdMotivo);
                        da.SelectCommand.Parameters.AddWithValue("@Observaciones", notaCredito.Observaciones);
                        da.SelectCommand.Parameters.AddWithValue("@TipoAnulacion", notaCredito.TipoAnulacion);
                        da.SelectCommand.Parameters.AddWithValue("@Total", notaCredito.Total);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoEliminar(int idNota, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaCreditoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdNota", idNota);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoFormato(int idNota)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaCreditoFormato";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdNota", SqlDbType.Int).Value = (object)idNota ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        /*=========================TIPOS Y ESTADO===================================================================*/
        public Task<DataSet> NotaCreditoListarEstados()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "NotaCreditoDebitoCargarEstadoNotaCredito";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoListarTiposComprobantes()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CajaTiposComprobanteNC";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoListarTiposDocumentos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "listaTiposDocIdentidadParaPagos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoListarMotivos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "NotaCreditoDebitoCargarMotivo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CajaComprobantePagoSeleccionarPorNroDocumento(int idTipoComprobante, string nroSerie, string nroDocumento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CajaComprobantePagoSeleccionarPorNroDocumento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoComprobante", SqlDbType.Int).Value = (object)idTipoComprobante ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = (object)nroSerie ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (object)nroDocumento ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoConsultarOrdenServicio(int idComprobantePago)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "NotaCreditoConsultarCitaPorNCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdComprobante", SqlDbType.Int).Value = (object)idComprobantePago ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoConsultarCitaPorNCuenta(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "NotaCreditoConsultarCitaPorNCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (object)idCuentaAtencion ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaCreditoFarmNotaIngreso(string documentoNumero)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "NotaCreditoFarmNotaIngreso";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@DocumentoNumero", SqlDbType.VarChar).Value = (object)documentoNumero ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ObtenerSiguienteDocumento(int idTipoNota)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerSiguienteDocumentoComprobanteNota";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoNota", SqlDbType.Int).Value = (object)idTipoNota ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
