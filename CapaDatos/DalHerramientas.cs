using System;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CapaDatos;
using Microsoft.AspNetCore.Http;

namespace WebAppMaternidad.CapaDatos
{
    public class DalHerramientas
    {

        public Task<DataSet> ListarReporteEstadistica(string fechaInicio, string fechaFin, int idMedico, int tipoReporte)
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
                            string sql = "web_ReportesEstadistica";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@IdMedico", idMedico);
                            cmd.Parameters.AddWithValue("@TipoReporte", tipoReporte);

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

        /*=============================REPORTE SEM====================================================================*/
        public Task<DataSet> ListarReporteSEM(string fechaInicio, string fechaFin, int tipoReporte)
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
                            string sql = "web_ReportesSEM";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@TipoReporte", tipoReporte);

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

        public Task<DataSet> ValoresVarios(string tipo, string busqueda)
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
                            string sql = "ADMI_Valores_Varios";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@tipo", tipo);
                            cmd.Parameters.AddWithValue("@buscar", busqueda);

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

        public async Task<DataSet> EIDDSIP_ObtenerEgresosAdultas(string cadenaConexionEIDDSIP, string fechaInicio, string fechaFin)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "select * from RPT_EXPORTAR_HOSP_IGSS where FECHA_EGRE >= #" + fechaInicio + "# and FECHA_EGRE <= #" + fechaFin + "#";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> EIDDSIP_ObtenerEgresosNeonatos(string cadenaConexionEIDDSIP, string fechaInicio, string fechaFin)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "select * from RPT_Neo_Pacientes_Eg where FECH_EGR >= #" + fechaInicio + "# and FECH_EGR <= #" + fechaFin + "#";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> EIDDSIP_ObtenerEstanciaServ(string cadenaConexionEIDDSIP, string fechaEgre, string historia)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "select tot,Descrip from RPT_Estancia_serv where PACHIS_RN='" + historia + "' and FECH_EGR=#" + fechaEgre + "#";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> EIDDSIP_ObtenerEstanciaHosp(string cadenaConexionEIDDSIP, string fechaHosp, string historia)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "select * from RPT_Hosp_Estancias where FECH_HOSP=#" + fechaHosp + "# and PACHIS_RN='" + historia + "'";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> EIDDSIP_ObtenerDxNeonatos(string cadenaConexionEIDDSIP, string fechEgre, string historia)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "select * from RPT_Hosp_Neo_Diagn where FECH_EGR=#" + fechEgre + "# and PACHIS_RN='" + historia + "' ORDER BY NDX";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> EIDDSIP_ObtenerUbigeo(string cadenaConexionEIDDSIP, string ubicod)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "select ubicod As ubicod_C from UBIGEO where ubicod='" + ubicod + "'";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> EIDDSIP_ObtenerNacimiento(string cadenaConexionEIDDSIP, string historia)
        {
            Conexion conexion = new Conexion();
            DataSet ds = new DataSet();

            string sqlRpt = "{call lista_nac_by_pachis ('" + historia + "')}";

            using (OleDbConnection connection = new OleDbConnection(cadenaConexionEIDDSIP))
            {
                connection.Open();
                using (OleDbDataAdapter adapter = new(sqlRpt, connection))
                {
                    adapter.Fill(ds);
                }
            }

            return ds;

        }

        public async Task<DataSet> SIAN_PartosAtenciones(string fechaNacimiento, string historia)
        {
            string sStringConnection = "Data Source=MGP-819;Initial Catalog=SIAN; Persist Security Info=true;Password=12345678;User ID=khoyosi";
            SqlConnection cn_sian = new SqlConnection(sStringConnection);
            DataSet ds = new DataSet();

            try
            {
                await cn_sian.OpenAsync();  // Abrimos la conexión de forma asincrónica

                // Consulta SQL con parámetros
                string wsql_t = "SELECT TProf_cod FROM Sel_Datos_Porf_Atend WHERE RN_FECNAC = '" + fechaNacimiento + "' AND RN_NROHCMAT = '" + historia + "'";

                using (SqlCommand cmd = new SqlCommand(wsql_t, cn_sian))
                {
                    // Añadir parámetros
                    //cmd.Parameters.AddWithValue("@RN_FECNAC", fechaNacimiento);
                    //cmd.Parameters.AddWithValue("@RN_NROHCMAT", historia);

                    // Utilizamos SqlDataAdapter para llenar el DataSet
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        await Task.Run(() => da.Fill(ds, "Sel_Datos_Porf_Atend")); // Llenamos el DataSet de forma asincrónica
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            finally
            {
                cn_sian.Close();
            }

            return ds; // Retornamos el DataSet con los resultados
        }
        /*================================================================================================================*/

        public async Task<DataSet> RptEstadisticaEmergencia(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_RptEstadisticaEmergencia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaIni", fechaIni);
                cmd.Parameters.AddWithValue("@fechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteEstadisticaCE(string fechaIni, string fechaFin, int IdTipoServicio)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteEstadisticaCE", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaIni", fechaIni);
                cmd.Parameters.AddWithValue("@fechaFin", fechaFin);
                cmd.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> RptEstadisticaPPREmergencia(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_rptEstadisticaPPREmergencia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaIni", fechaIni);
                cmd.Parameters.AddWithValue("@fechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteEgresosHospitalarios(int IdDepartamentoEgreso, int IdServicioEgreso, int IdEspecialidadEgreso, int TipoEspecialidad, string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                using (SqlCommand cmd = new SqlCommand("Web_ReporteEgresosHospitalarios", conn))
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@IdDepartamentoEgreso", IdDepartamentoEgreso);
                    cmd.Parameters.AddWithValue("@IdServicioEgreso", IdServicioEgreso);
                    cmd.Parameters.AddWithValue("@IdEspecialidadEgreso", IdEspecialidadEgreso);
                    cmd.Parameters.AddWithValue("@TipoEspecialidad", TipoEspecialidad);
                    cmd.Parameters.AddWithValue("@FechaEgrIni", fechaIni);
                    cmd.Parameters.AddWithValue("@FechaEgrFin", fechaFin);
                    await conn.OpenAsync();

                    da.Fill(ds);

                    return ds;
                }

            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public async Task<DataSet> RptRayosXyLaboratoriobyMGP(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_rpt_RayosXyLaboratoriobyMGP", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaIni", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ListaProduccionMedico(int idMedico, string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListaProduccionMedico", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idMedico", idMedico);
                cmd.Parameters.AddWithValue("@fechaIncio", fechaIni);
                cmd.Parameters.AddWithValue("@fechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteParaEstaditica_Hospitalizacion(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteParaEstaditica_Hospitalizacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fInicio", fechaIni);
                cmd.Parameters.AddWithValue("@fFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteEgresosHospitalizacion(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteEgresosHospitalizacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteProcedimientosRealizados(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteProcedimientosRealizados", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteConstanciaNacimientos(string fechaIni, string fechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteConstanciaNacimientos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ReporteProcedimientosCE(int IdDepartamento, int IdEspecialidad, int IdServicio, string FechaInicio, string FechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteProcedimientosCE", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdDepartamento", IdDepartamento);
                cmd.Parameters.AddWithValue("@IdEspecialidad", IdEspecialidad);
                cmd.Parameters.AddWithValue("@IdServicio", IdServicio);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }
        
        public async Task<DataSet> ReporteTerapiasCE(int IdDepartamento, int IdEspecialidad, int IdServicio, string FechaInicio, string FechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ReporteTerapiasCE", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdDepartamento", IdDepartamento);
                cmd.Parameters.AddWithValue("@IdEspecialidad", IdEspecialidad);
                cmd.Parameters.AddWithValue("@IdServicio", IdServicio);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }
    }
}
