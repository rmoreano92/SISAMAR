using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalReportes
    {
        public DataSet ListarReportesbyUsuarioItem(int idListBarItem, int idUsuario)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_ListarReportes");
                cmd.Parameters.AddWithValue("@idListBarItem", idListBarItem);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
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

        public DataSet ListarEspecialidadesxIdDepartamento(int idDepartamento)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_EspecialidadesSeleccionarPorDepartamento");
                cmd.Parameters.AddWithValue("@IdDepartamento", idDepartamento);
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

        public DataSet ListarServiciosxTipoServicioyIdTipoEspecialidad(int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ServiciosSeleccionarPorTipoV2");
                cmd.Parameters.AddWithValue("@IdTipoServicio", idTipoServicio);
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



        public DataSet ParteDiarioAtenciones(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idDestino, DateTime Fecha)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptParteDiarioAtenciones");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@idDepartamento", idDepartamento);
                cmd.Parameters.AddWithValue("@idEspecialidad", idEspecialidad);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idDestino", idDestino);
                cmd.Parameters.AddWithValue("@Fecha", Fecha);
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

        public DataSet DevuelveProduccionEstadisticaObstetras(int idUsuario, DateTime FechaInicio, DateTime FechaFin, int TipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptProduccionEstadisticaObstetras");
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                cmd.Parameters.AddWithValue("@TipoServicio", TipoServicio);
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

        public DataSet ProduccionEstadisticaGeneral(int idTipoServicio, int idServicio, int idUsuario, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptProduccionEstadisticaGeneral");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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



        public DataSet DevuelvePacientesxRecepcionar(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_rptReportePAcientesxRecepcionar");
                cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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


        /* RMOREANO RQ0010 */

        public DataSet ParteDiarioCitas(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idDestino, int idMedico, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptParteDiarioCitas");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@idDepartamento", idDepartamento);
                cmd.Parameters.AddWithValue("@idEspecialidad", idEspecialidad);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idDestino", idDestino);
                cmd.Parameters.AddWithValue("@idMedico", idMedico);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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

        public DataSet ParteDiarioCitasResumido(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idDestino, int idMedico, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptParteDiarioCitasResumido");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@idDepartamento", idDepartamento);
                cmd.Parameters.AddWithValue("@idEspecialidad", idEspecialidad);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idDestino", idDestino);
                cmd.Parameters.AddWithValue("@idMedico", idMedico);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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

        /*FIN RMOREANO RQ0010 */

        //JAYZANOA_080721: Reporte de atenciones data bruta
        public DataSet ProduccionEstadisticaGeneral2(int idTipoServicio, int idServicio, int idUsuario, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptProduccionEstadisticaGeneral3");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                cmd.Parameters.AddWithValue("@idServicio", idServicio);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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
        //JAYZANOA_080721: Reporte agregado para puerperas
        public DataSet DevuelveProduccionEstadisticaObstetras2(int idUsuario, DateTime FechaInicio, DateTime FechaFin, int TipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptReporteAltaPuerperias");
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                cmd.Parameters.AddWithValue("@TipoServicio", TipoServicio);
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


        //////////////////////////KHOYOSI///////////////////////////////////////////////////
        public DataSet DevuelveCondicionEstablecimientoCE(int idUsuario, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_rptCondicionEstablecimientoCE");
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@FechaIni", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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
        //////////////////////////KHOYOSI///////////////////////////////////////////////////
        ///

        public Task<DataSet> rptTelesaludAtenciones(DateTime fechaInicio, DateTime fechaFin)
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
                            string sql = "Web_RptTelesaludAtenciones";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FECHA1", fechaInicio);
                            cmd.Parameters.AddWithValue("@FECHA2", fechaFin);

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
        public Task<DataSet> rptTeleconsultaAtenciones(DateTime fechaInicio, DateTime fechaFin)
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
                            string sql = "Web_RptTeleconsultaAtenciones";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FECHA1", fechaInicio);
                            cmd.Parameters.AddWithValue("@FECHA2", fechaFin);

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


        public async Task<DataSet> ReporteAtencionesSinAltaMedicaAdministrativa(int TipoReporte) // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteAtencionesSinAltaMedicaAdministrativa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@TipoReporte", TipoReporte);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public Task<DataSet> ReporteTableroUnidadSeguros(int idUsuario, string FechaInicio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ReporteTableroUnidadSeguros";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 500;

                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@FechaIni", SqlDbType.VarChar).Value = FechaInicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        ////////////////////////REPORTE TAMIZAJE//////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> ListarReporteTamizajeOftalmologico(string fechaInicio, string fechaFin)
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
                            string sql = "web_ReporteTamizajeOftalmologico";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);

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
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        public DataSet ReporteAnatomiaPatologia(DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarReporteAnatomiaPatologica");
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
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
    }


}
