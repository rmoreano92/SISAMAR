using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using CapaEntidades;

namespace CapaDatos
{
    public class DalDiagnostico
    {

        public Task<DataSet> ListarDiagnosticosPorAtencionPorNumeroEvaluacion(int idAtencion, int evaluacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarDiagnosticosPorAtencionPorEvaluacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        //da.SelectCommand.Parameters.Add("@IdClasificacion", SqlDbType.Int).Value = clasificacionDx;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = evaluacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarDiagnosticosRecetasPorAtencion(int idAtencion, int evaluacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarDiagnosticosRecetasPorAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        //da.SelectCommand.Parameters.Add("@IdClasificacion", SqlDbType.Int).Value = clasificacionDx;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = evaluacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> DiagnosticosSeleccionarPorAtencion(int idAtencion, int clasifiacionDiagnostico) 
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDiagnosticosSeleccionarPorAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@Tipodiagnostico", SqlDbType.Int).Value = clasifiacionDiagnostico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> AtencionesDiagnosticosSeleccionarEventosAdversos(int idEventoAdverso, int clasifiacionDiagnostico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDiagnosticosSeleccionarEventosAdversos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idEventoAdverso", SqlDbType.Int).Value = idEventoAdverso;
                        da.SelectCommand.Parameters.Add("@Tipodiagnostico", SqlDbType.Int).Value = clasifiacionDiagnostico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<DataSet> DiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(int idAtencion, int clasifiacionDiagnostico, int idServicio, int idNumero) 
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdNumero", SqlDbType.Int).Value = idNumero;
                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@Tipodiagnostico", SqlDbType.Int).Value = clasifiacionDiagnostico;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> GuardarDiagnosticosPorEvaluacion(int idAtencion, int clasificacionDiagnostico, int idUsuario, List<Diagnosticos> dsDiagnosticos, int idServicio, int nroEvaluacion)
        {
            Conexion cx = new Conexion();
            string xmlDiagnosticos;
            xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_insertaDiagnosticosPorEvaluacion";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                        cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                        cmd.Parameters.AddWithValue("@diagnosticos", xmlDiagnosticos);
                        cmd.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);
                        cmd.Parameters.AddWithValue("@idServicio", idServicio);
                        cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                        da.InsertCommand = cmd;

                        if (da.InsertCommand.ExecuteNonQuery() > 0)
                        {
                            conn.Close();
                            return true;
                        }
                        else
                        {
                            conn.Close();
                            return false;
                        }

                    }
                }
            });
        }

        public Task<DataSet> SeleccionarDiagnosticosByIdAtencion(int IdAtencion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarDiagnosticosByIdAtencion";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> ListarDxUltimaAtencion(int IdCuentaAtencion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_ListarDxUltimaAtencion";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarClasificacionDiagnosticos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_DianosticosConjuntosSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarDiagnosticoPorConjunto(int idConjunto)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_DiagnosticosSeleccionarPorConjunto";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdConjunto", SqlDbType.Int).Value = idConjunto;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ListaDiagnosticosPorFiltro(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListaDiagnosticosPorFiltro";
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

        public Task<DataSet> ListaDiagnosticosCIE0PorFiltro(string filtro,int tipo)
        {
            DataSet ds = new DataSet();
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {

                            string sql = "web_ListaDiagnosticosCIE0PorFiltro";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;
                            da.SelectCommand.Parameters.Add("@filtro", SqlDbType.VarChar).Value = filtro;
                            da.SelectCommand.Parameters.Add("@tipo", SqlDbType.Int).Value = tipo;
                            da.Fill(ds);
                            return ds;

                        }
                    }
                });
            }
            catch (Exception ex) {
                ds = null; throw new Exception(ex.Message);
            }

        }


    }
}
