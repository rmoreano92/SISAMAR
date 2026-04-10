using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaDatos;
using System;
using CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalHistoriaClinica
    {
        public async Task<DataSet> HistoriasClinicasSegunFiltro(int? NroHistoriaClinica, string ApellidoPaterno, string ApellidoMaterno, string Nombres)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_HistoriasClinicasSegunFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@NroHistoriaClinica", NroHistoriaClinica ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Nombres", Nombres ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> TiposHistoriaClinicaSeleccionarTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposHistoriaClinicaSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> EstadosHistoriaClinicaSeleccionarTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EstadosHistoriaClinicaSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<int> CrearNroHistoriaV2(int IdTipoNumeracion, int IdUsuarioAuditoria)
        {
            DataSet ds = new DataSet();
            int nRpta;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_crearNroHistoriaV2", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Direction = ParameterDirection.Output;
                da.SelectCommand.Parameters.AddWithValue("@IdTipoNumeracion", IdTipoNumeracion);
                da.SelectCommand.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                nRpta = int.Parse(cmd.Parameters["@NroHistoria"].Value.ToString());

                return nRpta;
            }
        }
        public async Task<int> HistoriasClinicasModificar(
            int? IdTipoNumeracionAnterior, int? NroHistoriaClinicaAnterior, int IdTipoNumeracion, int NroHistoriaClinica,
            DateTime FechaCreacion, DateTime? FechaPasoAPasivo, int IdTipoHistoria, int IdEstadoHistoria, int IdPaciente, int IdUsuarioAuditoria)
        {
            DataSet ds = new DataSet();
            int nRpta;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_HistoriasClinicasModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdTipoNumeracionAnterior", IdTipoNumeracionAnterior ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@NroHistoriaClinicaAnterior", NroHistoriaClinicaAnterior ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdTipoNumeracion", IdTipoNumeracion);
                da.SelectCommand.Parameters.AddWithValue("@NroHistoriaClinica", NroHistoriaClinica);
                da.SelectCommand.Parameters.AddWithValue("@FechaCreacion", FechaCreacion);
                da.SelectCommand.Parameters.AddWithValue("@FechaPasoAPasivo", FechaPasoAPasivo ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdTipoHistoria", IdTipoHistoria);
                da.SelectCommand.Parameters.AddWithValue("@IdEstadoHistoria", IdEstadoHistoria);
                da.SelectCommand.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                da.SelectCommand.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                await conn.OpenAsync();
                

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

    }
}
