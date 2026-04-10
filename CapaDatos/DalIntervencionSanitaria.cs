using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using CapaEntidades;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using System;

namespace WebAppMaternidad.CapaDatos
{
    public class DalIntervencionSanitaria
    {

        public Task<DataSet> ListaPrescriptores()
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

        public Task<DataSet> ListaCoordinadores()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "EmpleadosDevuelveCoordinadores";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListaComponentes()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "FarmComponenteDevuelveTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListaSubComponentes(int idComponente)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "FarmComponenteSubDevuelveTodosSegunComponente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@idComponente", SqlDbType.Int).Value = idComponente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListaDiagnosticosIntervencionSanitaria(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListaDiagnosticosIntervencionSanitaria";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@filtro", SqlDbType.VarChar).Value = filtro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public async Task<DataSet> CrearModificarIntervencionSanitariaFarmacia(
            string MovNumero, string MovTipo, int? IdCuentaAtencion, DateTime? FechaHoraPrescribe, int? IdPaquete, 
            string NroFormato, int? IdReceta, string DocumentoNumero, string Observaciones, int? idEstadoMovimiento, int? idAlmacenOrigen, int? idAlmacenDestino, int? IdFuenteFinanciamiento,
            int? IdPrescriptor,int? IdCoordinador, int? IdComponente, int? IdSubComponente, int? IdDiagnostico, int? idEstadoFacturacion, List<FarmMovimientoDetalle> lstObjDetalleNotaSalida,
            int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            string xmlMovimientoDetalle;
            xmlMovimientoDetalle = XmlUtil.Serializer(typeof(List<FarmMovimientoDetalle>), lstObjDetalleNotaSalida);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarIntervencionSanitariaFarmacia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", string.IsNullOrEmpty(MovNumero) ? DBNull.Value : MovNumero);
                cmd.Parameters.AddWithValue("@MovTipo", string.IsNullOrEmpty(MovTipo) ? DBNull.Value : MovTipo);


                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaHoraPrescribe", FechaHoraPrescribe ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdPaquete", IdPaquete ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NroFormato", string.IsNullOrEmpty(NroFormato) ? DBNull.Value : NroFormato);
                cmd.Parameters.AddWithValue("@IdReceta", IdReceta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DocumentoNumero", string.IsNullOrEmpty(DocumentoNumero) ? DBNull.Value : DocumentoNumero);
                cmd.Parameters.AddWithValue("@Observaciones", string.IsNullOrEmpty(Observaciones) ? DBNull.Value : Observaciones);
                cmd.Parameters.AddWithValue("@idEstadoMovimiento", idEstadoMovimiento ?? (object)DBNull.Value);


                cmd.Parameters.AddWithValue("@idAlmacenOrigen", idAlmacenOrigen ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idAlmacenDestino", idAlmacenDestino ?? (object)DBNull.Value);


                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdPrescriptor", IdPrescriptor ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdCoordinador", IdCoordinador ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdComponente", IdComponente ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdSubComponente", IdSubComponente ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDiagnostico", IdDiagnostico ?? (object)DBNull.Value);
                
                cmd.Parameters.AddWithValue("@idEstadoFacturacion", idEstadoFacturacion ?? (object)DBNull.Value);
                
                cmd.Parameters.Add("@movimientoDetalle", SqlDbType.Xml).Value = xmlMovimientoDetalle;
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

    }
}
