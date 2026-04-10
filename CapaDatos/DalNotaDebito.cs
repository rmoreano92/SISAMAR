using CapaDatos;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using NPOI.POIFS.Crypt.Dsig;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalNotaDebito
    {

        public Task<DataSet> NotasDebitoListar(string nroSerie, string nroDocumento, string razonSocial, int idTipoEstado, string fechaInicio, string fechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotasDebitoListar";
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

        public Task<DataSet> NotaDebitoSeleccionar(int idNota)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaDebitoSeleccionar";
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

        public Task<DataSet> NotaDebitoGuardar(NotaDebito notaDebito, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaDebitoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdNota", notaDebito.IdNota);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoComprobantePagoAfecto", notaDebito.IdTipoComprobantePagoAfecto);
                        da.SelectCommand.Parameters.AddWithValue("@SerieComprobanteAfecto", notaDebito.SerieComprobanteAfecto);
                        da.SelectCommand.Parameters.AddWithValue("@NumeroComprobanteAfecto", notaDebito.NumeroComprobanteAfecto);
                        da.SelectCommand.Parameters.AddWithValue("@FechaComprobanteAfecto", notaDebito.FechaComprobanteAfecto);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoDocIdentidad", notaDebito.IdTipoDocIdentidadAfecto);
                        da.SelectCommand.Parameters.AddWithValue("@RUC", notaDebito.RUC);
                        da.SelectCommand.Parameters.AddWithValue("@RazonSocial", notaDebito.RazonSocial);
                        da.SelectCommand.Parameters.AddWithValue("@Direccion", notaDebito.Direccion);
                        da.SelectCommand.Parameters.AddWithValue("@IdMotivo", notaDebito.IdMotivo);
                        da.SelectCommand.Parameters.AddWithValue("@Observaciones", notaDebito.Observaciones);
                        da.SelectCommand.Parameters.AddWithValue("@Gravadas", notaDebito.Gravadas);
                        da.SelectCommand.Parameters.AddWithValue("@Igv", notaDebito.IGV);
                        da.SelectCommand.Parameters.AddWithValue("@Exoneradas", notaDebito.Exoneradas);
                        da.SelectCommand.Parameters.AddWithValue("@Inafecta", notaDebito.Inafecta);
                        da.SelectCommand.Parameters.AddWithValue("@Total", notaDebito.Total);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> NotaDebitoEliminar(int idNota, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaDebitoEliminar";
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

        public Task<DataSet> NotaDebitoFormato(int idNota)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaDebitoFormato";
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
        public Task<DataSet> NotaDebitoListarEstados()
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

        public Task<DataSet> NotaDebitoListarTiposComprobantes()
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

        public Task<DataSet> NotaDebitoListarTiposDocumentos()
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

        public Task<DataSet> NotaDebitoListarMotivos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "listaMotivoNotaDebito";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

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
