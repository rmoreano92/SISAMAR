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
    public class DalServicios
    {

        public Task<DataSet> ListarServicios(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarServicios";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ServicioSeleccionarPorTipoServicio(int IdTipoServicio)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ServicioSeleccionarPorTipoServicio";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> DevuelveServiciosQueSonPuntosCarga(string filtro)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_DevuelveServiciosQueSonPuntosCarga";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@lcFiltro", filtro);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public async Task<int> ServiciosAgregar(Servicio servicio, int idUsuarioAuditoria)
        {
            int IdServicioOut = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ServiciosAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@IdServicioOut", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@IdServicio", servicio.IdServicio);
                cmd.Parameters.AddWithValue("@IdProducto", servicio.IdProducto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Codigo", servicio.Codigo);
                cmd.Parameters.AddWithValue("@Nombre", servicio.Nombre);
                cmd.Parameters.AddWithValue("@IdEspecialidad", servicio.IdEspecialidad);
                cmd.Parameters.AddWithValue("@IdTipoServicio", servicio.IdTipoServicio);
                cmd.Parameters.AddWithValue("@soloTipoSexo", servicio.SoloTipoSexo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@maximaEdad", servicio.MaximaEdad ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@codigoServicioSEM", servicio.CodigoServicioSEM ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ubicacionSEM", servicio.UbicacionSEM ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@codigoServicioHIS", servicio.CodigoServicioHIS ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CostoCeroCE", servicio.CostoCeroCE ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@minimaEdad", servicio.MinimaEdad ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Triaje", servicio.Triaje ?? false);
                cmd.Parameters.AddWithValue("@EsObservacionEmergencia", servicio.EsObservacionEmergencia ?? false);
                cmd.Parameters.AddWithValue("@UsaGalenHos", servicio.UsaGalenHos ?? false);
                cmd.Parameters.AddWithValue("@TipoEdad", servicio.TipoEdad ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UsaFUA", servicio.UsaFUA ?? false);
                cmd.Parameters.AddWithValue("@codigoServicioSuSalud", servicio.CodigoServicioSuSalud ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@codigoServicioFUA", servicio.CodigoServicioFUA ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@codigoServicioRenaes", servicio.CodigoServicioRenaes ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuarioAuditoria); // Puedes pasar este desde sesión o variable
                cmd.Parameters.AddWithValue("@activaProcedimiento", servicio.ActivaProcedimiento ?? 0);
                cmd.Parameters.AddWithValue("@EsTeleconsulta", servicio.EsTeleconsulta);
                cmd.Parameters.AddWithValue("@TipoModulo", servicio.TipoModulo);
                cmd.Parameters.AddWithValue("@EsPuntoCarga", servicio.EsPuntoCarga);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                IdServicioOut = int.Parse(cmd.Parameters["@IdServicioOut"].Value.ToString());

                return IdServicioOut;
            }
        }

        public async Task<DataSet> ServiciosSeleccionarPorTipo(int IdTipoServicio, string Nombre)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ServiciosSeleccionarPorTipo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);
                da.SelectCommand.Parameters.AddWithValue("@Nombre", Nombre);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }


    }


}
