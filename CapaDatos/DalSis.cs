using CapaEntidades;
using ICSharpCode.SharpZipLib.Zip;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalSis // JDELGADO003-C
    {
        public Task<int> web_SisFiliacionesAgregar(SisFiliaciones sisFiliaciones, int IdUsuarioAuditoria) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_EXTERNA..web_SisFiliacionesAgregar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@idSiasis", sisFiliaciones.idSiasis ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Codigo", sisFiliaciones.Codigo ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AfiliacionDisa", sisFiliaciones.AfiliacionDisa ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AfiliacionTipoFormato", sisFiliaciones.AfiliacionTipoFormato ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AfiliacionNroFormato", sisFiliaciones.AfiliacionNroFormato ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AfiliacionNroIntegrante", sisFiliaciones.AfiliacionNroIntegrante ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@DocumentoTipo", sisFiliaciones.DocumentoTipo ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@CodigoEstablAdscripcion", sisFiliaciones.CodigoEstablAdscripcion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AfiliacionFecha", sisFiliaciones.AfiliacionFecha ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Paterno", sisFiliaciones.Paterno ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Materno", sisFiliaciones.Materno ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Pnombre", sisFiliaciones.Pnombre ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Onombres", sisFiliaciones.Onombres ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Genero", sisFiliaciones.Genero ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Fnacimiento", sisFiliaciones.Fnacimiento ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdDistritoDomicilio", sisFiliaciones.IdDistritoDomicilio ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Estado", sisFiliaciones.Estado ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Fbaja", sisFiliaciones.Fbaja ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@DocumentoNumero", sisFiliaciones.DocumentoNumero ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@MotivoBaja", sisFiliaciones.MotivoBaja ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }


        ////////////////////////////////KHOYOSI///////////////////////////////////////////////////////////////////////////////////////
        ///CONSTRUCCION DE FUA - 09062022
        public Task<DataSet> SisFuaAtencionSeleccionarPorId(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionExterna())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SisFuaAtencionSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SisFuaAtencionDIAxIdCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionExterna())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SisFuaAtencionDIAxIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SisFuaAtencionMEDxIdCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionExterna())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SisFuaAtencionMEDxIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SisFuaAtencionINSxIdCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionExterna())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SisFuaAtencionINSxIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SisFuaAtencionPROxIdCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionExterna())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SisFuaAtencionPROxIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> AtencionesNacimientosXidAtencion(int idAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "AtencionesNacimientosXidAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdAtencion", SqlDbType.Int).Value = idAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> BuscarAtencionesPorFiltro(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesSeleccionarPorFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> BuscarAtencionesSnAfiliacionPorFiltro(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesSeleccionarSnAfiliacionPorFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///

        public Task<DataSet> Atencion(int mes, int anio, int mesProduccion, int anioProduccion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCION";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;
                        da.SelectCommand.Parameters.Add("@MESPRODUCCION", SqlDbType.Int).Value = mesProduccion;
                        da.SelectCommand.Parameters.Add("@ANIOPRODUCCION", SqlDbType.Int).Value = anioProduccion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionDia(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONDIA";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionPro(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONPRO";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionMed(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONMED";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionIns(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONINS";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionSer(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSER";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionRN(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRN";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionSmi(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSMI";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.Int).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.Int).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionResumen(string anio, string mes, string nroEnvio, string nombreZip, string dni, string anioProduccion, string mesProduccion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRESUMEN";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@ANIO", SqlDbType.VarChar).Value = anio;
                        da.SelectCommand.Parameters.Add("@MES", SqlDbType.VarChar).Value = mes;
                        da.SelectCommand.Parameters.Add("@NENVIO", SqlDbType.VarChar).Value = nroEnvio;
                        da.SelectCommand.Parameters.Add("@NOMBREZIP", SqlDbType.VarChar).Value = nombreZip;
                        da.SelectCommand.Parameters.Add("@DNI", SqlDbType.VarChar).Value = dni;
                        da.SelectCommand.Parameters.Add("@ANIOPRODUCCION", SqlDbType.VarChar).Value = anioProduccion;
                        da.SelectCommand.Parameters.Add("@MESPRODUCCION", SqlDbType.VarChar).Value = mesProduccion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        public Task<DataSet> Atencionv2(DateTime fechaInicio, DateTime fechaFin, int mesProduccion, int anioProduccion, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@MESPRODUCCION", SqlDbType.Int).Value = mesProduccion;
                        da.SelectCommand.Parameters.Add("@ANIOPRODUCCION", SqlDbType.Int).Value = anioProduccion;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionDiav2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONDIAv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionProv2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONPROv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionMedv2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONMEDv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionInsv2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONINSv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionServ2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSERv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionRNv2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRNv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionSmiv2(DateTime fechaInicio, DateTime fechaFin, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSMIv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionResumenv2(DateTime fechaInicio, DateTime fechaFin, string nroEnvio, string nombreZip, string dni, string anioProduccion, string mesProduccion, string fuaUPS)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRESUMENv2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FECHAINICIO", SqlDbType.Date).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FECHAFIN", SqlDbType.Date).Value = fechaFin;
                        da.SelectCommand.Parameters.Add("@NENVIO", SqlDbType.VarChar).Value = nroEnvio;
                        da.SelectCommand.Parameters.Add("@NOMBREZIP", SqlDbType.VarChar).Value = nombreZip;
                        da.SelectCommand.Parameters.Add("@DNI", SqlDbType.VarChar).Value = dni;
                        da.SelectCommand.Parameters.Add("@ANIOPRODUCCION", SqlDbType.VarChar).Value = anioProduccion;
                        da.SelectCommand.Parameters.Add("@MESPRODUCCION", SqlDbType.VarChar).Value = mesProduccion;
                        da.SelectCommand.Parameters.Add("@fuaUPS", SqlDbType.VarChar).Value = fuaUPS;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> Atencionv3(string nombrePaquete, int mesProduccion, int anioProduccion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);
                        da.SelectCommand.Parameters.AddWithValue("@MESPRODUCCION", mesProduccion);
                        da.SelectCommand.Parameters.AddWithValue("@ANIOPRODUCCION", anioProduccion);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionServ3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSERv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionRNv3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRNv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionProv3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONPROv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionMedv3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONMEDv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionInsv3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONINSv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionDiav3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONDIAv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionSmiv3(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSMIv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionResumenv3(string nroEnvio, string nombreZip, string dni, string anioProduccion, string mesProduccion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRESUMENv3";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NENVIO", SqlDbType.VarChar).Value = nroEnvio;
                        da.SelectCommand.Parameters.Add("@NOMBREZIP", SqlDbType.VarChar).Value = nombreZip;
                        da.SelectCommand.Parameters.Add("@DNI", SqlDbType.VarChar).Value = dni;
                        da.SelectCommand.Parameters.Add("@ANIOPRODUCCION", SqlDbType.VarChar).Value = anioProduccion;
                        da.SelectCommand.Parameters.Add("@MESPRODUCCION", SqlDbType.VarChar).Value = mesProduccion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        public Task<DataSet> Atencionv4(string nombrePaquete, int mesProduccion, int anioProduccion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);
                        da.SelectCommand.Parameters.AddWithValue("@MESPRODUCCION", mesProduccion);
                        da.SelectCommand.Parameters.AddWithValue("@ANIOPRODUCCION", anioProduccion);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionServ4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSERv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionRNv4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRNv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionProv4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONPROv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionMedv4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONMEDv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionInsv4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONINSv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionDiav4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONDIAv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionSmiv4(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONSMIv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@nombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AtencionResumenv4(string nroEnvio, string nombreZip, string dni, string anioProduccion, string mesProduccion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ATENCIONRESUMENv4";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NENVIO", SqlDbType.VarChar).Value = nroEnvio;
                        da.SelectCommand.Parameters.Add("@NOMBREZIP", SqlDbType.VarChar).Value = nombreZip;
                        da.SelectCommand.Parameters.Add("@DNI", SqlDbType.VarChar).Value = dni;
                        da.SelectCommand.Parameters.Add("@ANIOPRODUCCION", SqlDbType.VarChar).Value = anioProduccion;
                        da.SelectCommand.Parameters.Add("@MESPRODUCCION", SqlDbType.VarChar).Value = mesProduccion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ObtenerNumeroEnvioSoaSis(int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_EXTERNA..web_obtenerNumeroEnvioSoaSis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@mes", SqlDbType.Int).Value = mes;
                        da.SelectCommand.Parameters.Add("@anio", SqlDbType.Int).Value = anio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public String ComprimirArchivo(string DirectoryPath, string OutputFilePath, string Password = null, int CompressionLevel = 9)
        {
            Console.WriteLine(DirectoryPath);
            try
            {
                // Dependiendo del directorio, esto podría ser muy grande y requeriría más atención.
                // en un paquete comercial.
                string[] filenames = Directory.GetFiles(DirectoryPath);

                // Las declaraciones de 'using' garantizan que la transmisión se cierre correctamente, lo cual es una gran fuente
                // de problemas de otra manera. Su excepción también es segura, lo cual es genial.
                //using (ZipOutputStream OutputStream = new ZipOutputStream(File.Create(OutputFilePath)))
                using (ZipOutputStream OutputStream = new ZipOutputStream(new FileStream(OutputFilePath, FileMode.OpenOrCreate)))
                {
                    // Defina una contraseña para el archivo (si se proporciona)
                    // establezca su valor en nulo o no lo declare para dejar el archivo
                    // sin protección por contraseña
                    OutputStream.Password = Password;

                    // Definir el nivel de compresión
                    // 0 - store only to 9 - means best compression
                    OutputStream.SetLevel(CompressionLevel);

                    byte[] buffer = new byte[4096];

                    foreach (string file in filenames)
                    {

                        // El uso de GetFileName hace que el resultado sea compatible con XP
                        // ya que la ruta resultante no es absoluta.
                        ZipEntry entry = new ZipEntry(Path.GetFileName(file));

                        // Configure los datos de entrada según sea necesario.

                        // Crc y el tamaño son manejados por la biblioteca para flujos sellables
                        // Así que no hay necesidad de hacerlos aquí.

                        // También podría utilizar la hora de la última escritura o similar para el archivo.
                        entry.DateTime = DateTime.Now;
                        OutputStream.PutNextEntry(entry);

                        using (FileStream fs = File.OpenRead(file))
                        {

                            // El uso de un búfer de tamaño fijo aquí no hace una diferencia notable para la salida
                            // pero mantiene a raya el uso de la memoria.
                            int sourceBytes;

                            do
                            {
                                sourceBytes = fs.Read(buffer, 0, buffer.Length);
                                OutputStream.Write(buffer, 0, sourceBytes);
                            } while (sourceBytes > 0);

                            fs.Close();
                            fs.Dispose();
                        }

                    }

                    // Finalizar / Cerrar no son necesarios estrictamente ya que la declaración de uso lo hace automáticamente

                    // Finalizar es importante para garantizar que se agregue la información final de un archivo Zip. Sin esto
                    // el archivo creado no sería válido.
                    OutputStream.Finish();

                    //// Cerrar es importante para terminar y desbloquear el archivo.
                    OutputStream.Close();
                    //OutputStream.Dispose();
                    OutputStream.Dispose();

                    Console.WriteLine("Files successfully compressed");

                    return "Ok";
                }
            }
            catch (Exception ex)
            {
                // No es necesario volver a lanzar la excepción, ya que para nuestros propósitos se maneja.
                Console.WriteLine("Exception during processing {0}", ex);
                return "";
            }
        }

        public Task<DataSet> ListarServiciosParaFUA() // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarServiciosParaFUA";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ListarAtencionesFuaParaMigracion(DateTime FechaInicio, DateTime FechaFin, string FuaUPS) // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarAtencionesFuaParaMigracion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@FECHAINICIO", FechaInicio);
                da.SelectCommand.Parameters.AddWithValue("@FECHAFIN", FechaFin);
                da.SelectCommand.Parameters.AddWithValue("@fuaUPS", FuaUPS);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public Task<DataSet> ActualizarFuasAEstadoMigrado(DateTime FechaInicio, DateTime FechaFin, string FuaUPS) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ActualizarFuasAEstadoMigrado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@FECHAINICIO", FechaInicio);
                        da.SelectCommand.Parameters.AddWithValue("@FECHAFIN", FechaFin);
                        da.SelectCommand.Parameters.AddWithValue("@fuaUPS", FuaUPS);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> AsignarNroEnvio(string ANIO, string MES, string NroEnvio, string NomPaquete) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_AsignarNroEnvio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@ANIO", ANIO);
                        da.SelectCommand.Parameters.AddWithValue("@MES", MES);
                        da.SelectCommand.Parameters.AddWithValue("@NroEnvio", NroEnvio);
                        da.SelectCommand.Parameters.AddWithValue("@NomPaquete", NomPaquete);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> InsertarATESOASISBK(int IdCuentaAtencion, string FuaDisa, string FuaLote, string FuaNumero, string Anio, string Mes, string NroEnvio, int Estado, string Paquete) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_InsertarATESOASISBK";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@FuaDisa", FuaDisa);
                        da.SelectCommand.Parameters.AddWithValue("@FuaLote", FuaLote);
                        da.SelectCommand.Parameters.AddWithValue("@FuaNumero", FuaNumero);
                        da.SelectCommand.Parameters.AddWithValue("@Anio", Anio);
                        da.SelectCommand.Parameters.AddWithValue("@Mes", Mes);
                        da.SelectCommand.Parameters.AddWithValue("@NroEnvio", NroEnvio);
                        da.SelectCommand.Parameters.AddWithValue("@Estado", Estado);
                        da.SelectCommand.Parameters.AddWithValue("@Paquete", Paquete);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ActualizarEstadoATESOASISBK(int IdCuentaAtencion, int Estado) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ActualizarEstadoATESOASISBK";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@Estado", Estado);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFuasParaMigrar(DateTime FECHAINICIO, DateTime FECHAFIN, string fuaUPS, string Anio, string Mes, string NroEnvio, string Paquete) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarFuasParaMigrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@FECHAINICIO", FECHAINICIO);
                        da.SelectCommand.Parameters.AddWithValue("@FECHAFIN", FECHAFIN);
                        da.SelectCommand.Parameters.AddWithValue("@fuaUPS", fuaUPS);
                        da.SelectCommand.Parameters.AddWithValue("@Anio", Anio);
                        da.SelectCommand.Parameters.AddWithValue("@Mes", Mes);
                        da.SelectCommand.Parameters.AddWithValue("@NroEnvio", NroEnvio);
                        da.SelectCommand.Parameters.AddWithValue("@Paquete", Paquete);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ListarRecienNacidoParaSIS() // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarRecienNacidoParaSIS";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GeneraRptRecienNacidoParaSIS() // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_GeneraRptRecienNacidoParaSIS";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> AtencionFua(int IdCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "AtencionFua";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ListarPaquetesMigradosSis() // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexionExterna())
            using (SqlCommand cmd = new SqlCommand("Web_ListarPaquetesMigradosSis", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }


        public async Task<DataSet> GenerarReporteMigracionSETISIS(
              string NombrePaquete, int Tipo, List<PaqueteSetiSIS> lstObjDetallePaquete)
        {

            DataSet dataSet = new DataSet();

            string xmlDetallePaquete;
            xmlDetallePaquete = XmlUtil.Serializer(typeof(List<PaqueteSetiSIS>), lstObjDetallePaquete);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_GenerarReporteMigracionSETISIS", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NombrePaquete", NombrePaquete);
                cmd.Parameters.AddWithValue("@Tipo", Tipo);
                cmd.Parameters.Add("@DetallePaquete", SqlDbType.Xml).Value = xmlDetallePaquete;


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> ActualizarEstadoSisFuaResumen(string NomPaquete)
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionExterna())
            using (SqlCommand cmd = new SqlCommand("Web_ActualizarEstadoSisFuaResumen", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NomPaquete", NomPaquete);


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_m_serviciosSIS()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_m_serviciosSIS", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> Listar_m_IIEE_Nivel()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_m_IIEE_Nivel", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> Listar_m_IIEE_Turno()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_m_IIEE_Turno", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> Listar_m_IIEE_Grado(int IdNivel)
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_m_IIEE_Grado", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("IdNivel", IdNivel);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<DataSet> ListarInstitucionEducativa(string Codigo, string Nombre)
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_ListarInstitucionEducativa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Codigo", Codigo);
                cmd.Parameters.AddWithValue("@Nombre", Nombre);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> SisFuaUPServiciosSeleccionarTodos()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionExterna())
            using (SqlCommand cmd = new SqlCommand("Web_SisFuaUPServiciosSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_a_componentes()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_a_componentes", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_a_tipodocumento()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_a_tipodocumento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_a_sexo()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_a_sexo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_a_condicionmaterna()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_a_condicionmaterna", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_a_tipoatencion()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_a_tipoatencion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> Listar_a_modalidadatencion()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionSis())
            using (SqlCommand cmd = new SqlCommand("Web_Listar_a_modalidadatencion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> EtniaHISseleccionarTodos()
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_EtniaHISseleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> SeleccionarSisFuaAtencion(int IdCuentaAtencion)
        {

            DataSet dataSet = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexionExterna())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarSisFuaAtencion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);


                cmd.CommandTimeout = 300;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
    }
}
