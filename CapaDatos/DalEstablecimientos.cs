using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalEstablecimientos
    {
        public async Task<DataSet> TiposEstablecimientos()
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_TiposEstablecimientos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> TiposSubsector()
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_TiposSubsector", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> CrearModificarEstablecimientos(Establecimientos establecimientos, int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarEstablecimientos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdEstablecimiento", establecimientos.IdEstablecimiento);
                cmd.Parameters.AddWithValue("@Codigo", establecimientos.Codigo);
                cmd.Parameters.AddWithValue("@Nombre", establecimientos.Nombre);
                cmd.Parameters.AddWithValue("@IdDistrito", establecimientos.IdDistrito);
                cmd.Parameters.AddWithValue("@IdTipo", establecimientos.IdTipo);
                cmd.Parameters.AddWithValue("@Activo", establecimientos.Activo);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> SeleccionarEstablecimientoByIdEstablecimiento(int IdEstablecimiento)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarEstablecimientoByIdEstablecimiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdEstablecimiento", IdEstablecimiento);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> CrearModificarEstablecimientosNoMinsa(Establecimientos establecimientos, int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarEstablecimientosNoMinsa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdEstablecimiento", establecimientos.IdEstablecimiento);
                cmd.Parameters.AddWithValue("@Codigo", establecimientos.Codigo);
                cmd.Parameters.AddWithValue("@Nombre", establecimientos.Nombre);
                cmd.Parameters.AddWithValue("@IdDistrito", establecimientos.IdDistrito);
                cmd.Parameters.AddWithValue("@IdTipo", establecimientos.IdTipo);
                cmd.Parameters.AddWithValue("@Activo", establecimientos.Activo);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> SeleccionarEstablecimientosNoMinsaByIdEstablecimiento(int IdEstablecimiento)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarEstablecimientosNoMinsaByIdEstablecimiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdEstablecimiento", IdEstablecimiento);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
    }
}
