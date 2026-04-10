using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaDatos;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using CapaEntidades;
using static NPOI.HSSF.Util.HSSFColor;

namespace WebAppMaternidad.CapaDatos
{
    public class DalPaquetes
    {
        public async Task<DataSet> ListarFactCatalogoPaquete(string Codigo, string Descripcion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarFactCatalogoPaquete", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
;
                cmd.Parameters.Add("@Codigo", SqlDbType.VarChar).Value = Codigo != null ? Codigo : "";
                cmd.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = Descripcion != null ? Descripcion : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> CatalogoServiciosSeleccionarSoloConPreciosEnParticularV2(int? IdPuntoCarga, int? IdCuentaAtencion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CatalogoServiciosSeleccionarSoloConPreciosEnParticularV2", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
;
                cmd.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = IdPuntoCarga != null ? IdPuntoCarga : 0;
                cmd.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuentaAtencion != null ? IdCuentaAtencion : 0;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> EspecialidadesSeleccionarPorFiltro(string Filtro)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_EspecialidadesSeleccionarPorFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
;
                cmd.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = Filtro != null ? Filtro : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> CatalogoServiciosSeleccionarSoloAdministrativos()
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CatalogoServiciosSeleccionarSoloAdministrativos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }

        public async Task<DataSet> CatalogoBienesInsumosResumenSeleccionarPorFiltro(string Filtro, string Order)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CatalogoBienesInsumosResumenSeleccionarPorFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                
                cmd.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = Filtro != null ? Filtro : "";
                cmd.Parameters.Add("@Order", SqlDbType.VarChar).Value = Order != null ? Order : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }

        public async Task<DataSet> ListarDetallePaquete(int idFactPaquete)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarDetallePaquete", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                ;
                cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }

        public async Task<DataSet> CrearModificarFacturacionCatalogoPaquetes(
              int idFactPaquete, string Codigo, string Descripcion, int idTipoFinanciamiento, int idEstado, int TipoPaquete,
              List<FacturacionCatalogoPaquetes> lstObjDetallePaquete, int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            string xmlDetallePaquete;
            xmlDetallePaquete = XmlUtil.Serializer(typeof(List<FacturacionCatalogoPaquetes>), lstObjDetallePaquete);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarFacturacionCatalogoPaquetes", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idFactPaquete", idFactPaquete);
                cmd.Parameters.AddWithValue("@Codigo", Codigo);
                cmd.Parameters.AddWithValue("@Descripcion", Descripcion);
                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", idTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@idEstado", idEstado);
                cmd.Parameters.AddWithValue("@TipoPaquete", TipoPaquete);
                cmd.Parameters.Add("@DetallePaquete", SqlDbType.Xml).Value = xmlDetallePaquete;
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
    }
}
