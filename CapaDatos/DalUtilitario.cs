using CapaEntidades;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Aspose.Zip.SevenZip;
using System.Net.NetworkInformation;
using DocumentFormat.OpenXml.Office.Word;
using NPOI.POIFS.Crypt.Dsig;
using Microsoft.AspNetCore.Mvc;
using static NPOI.HSSF.Util.HSSFColor;

namespace CapaDatos
{
    public class DalUtilitario
    {
        public Task<DataSet> DevuelveDSCombo(String Procedure)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "" + Procedure + "";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public DataSet DevuelveDSServicio(int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_listarServicio");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
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


        public DataSet DevuelveDSComboxServicio(String Procedure, int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("" + Procedure + "");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> DevuelveDSComboxServicioByFecha(String fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaProgramacionByFecha";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@fecha", SqlDbType.VarChar).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        public DataSet DevuelveDSServicioSinTodos(int idTipoServicio)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_listarServiciosinTodo");
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }



        //public List<SubclasificacionDiagnosticos> DevuelveTiposDiagnostico(int idTipoDiagnostico)
        //{
        //    List<SubclasificacionDiagnosticos> lstTiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
        //    SubclasificacionDiagnosticos objTiposDiag = null;
        //    SqlCommand cmd = null;
        //    SqlDataReader dr = null;
        //    try
        //    {
        //        switch (idTipoDiagnostico)
        //        {
        //            case (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxConsultaExterna");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.EmergenciaIngreso:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxEmergencia");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.HospitalizacionComplicaciones:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxHospComplicaciones");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxHospEgreso");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxHospIngreso");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxHospMortalidad");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxHospMuerteFetal");
        //                break;
        //            case (int)Enumerados.TiposDiagnostico.Interconsultas:
        //                cmd = MetodoDatos.CrearComando("SubclasificacionDiagnosticosSeleccionarDxInterconsultas");
        //                break;
        //        }
        //        dr = cmd.ExecuteReader();
        //        while (dr.Read())
        //        {
        //            objTiposDiag = new SubclasificacionDiagnosticos();
        //            objTiposDiag.IdSubclasificacionDx = Convert.ToInt16(dr["IdSubclasificacionDx"]);
        //            objTiposDiag.Descripcion = Convert.ToString(dr["DescripcionLarga"]);                   
        //            lstTiposDiagnosticos.Add(objTiposDiag);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        lstTiposDiagnosticos = null; throw ex;
        //    }
        //    finally
        //    {
        //        cmd.Connection.Close();
        //    }
        //    return lstTiposDiagnosticos;
        //}

        public Task<List<SubclasificacionDiagnosticos>> DevuelveTiposDiagnostico(int idTipoDiagnostico)
        {
            List<SubclasificacionDiagnosticos> lstTiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
            SubclasificacionDiagnosticos objTiposDiag = null;
            //SqlDataReader dr = null;
            DataSet ds = new DataSet();
            string sql = "";

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        switch (idTipoDiagnostico)
                        {
                            case (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxConsultaExterna";
                                break;
                            case (int)Enumerados.TiposDiagnostico.EmergenciaIngreso:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxEmergencia";
                                break;
                            case (int)Enumerados.TiposDiagnostico.HospitalizacionComplicaciones:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxHospComplicaciones";
                                break;
                            case (int)Enumerados.TiposDiagnostico.HospitalizacionEgreso:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxHospEgreso";
                                break;
                            case (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxHospIngreso";
                                break;
                            case (int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxHospMortalidad";
                                break;
                            case (int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxHospMuerteFetal";
                                break;
                            case (int)Enumerados.TiposDiagnostico.Interconsultas:
                                sql = "SubclasificacionDiagnosticosSeleccionarDxInterconsultas";
                                break;
                        }

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            objTiposDiag = new SubclasificacionDiagnosticos();
                            objTiposDiag.IdSubclasificacionDx = Convert.ToInt16(dr["IdSubclasificacionDx"]);
                            objTiposDiag.Descripcion = Convert.ToString(dr["DescripcionLarga"]);
                            lstTiposDiagnosticos.Add(objTiposDiag);
                        }

                        return lstTiposDiagnosticos;
                    }
                }
            });

        }



        public DataSet DevuelveDSProcedimientoxMetodo(int idMetodo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListarProcedimientosxMetodo");
                cmd.Parameters.AddWithValue("@idMetodo", idMetodo);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch
            {
                ds = null;
                //throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        public List<Comorbilidad> DevuelveComorbilidades()
        {
            List<Comorbilidad> lstcomorbilidad = new List<Comorbilidad>();
            Comorbilidad objComorbilidad = null;
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {
                cmd = MetodoDatos.CrearComando("ListarComorbilidadesPlani");
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    objComorbilidad = new Comorbilidad();
                    objComorbilidad.IdComorbilidad = Convert.ToInt16(dr["Codigo"]);
                    objComorbilidad.Descripcion = Convert.ToString(dr["Descripcion"]);
                    lstcomorbilidad.Add(objComorbilidad);
                }
            }
            catch (Exception ex)
            {
                lstcomorbilidad = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return lstcomorbilidad;
        }

        public Task<DataSet> ListaTiposDocumentos() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposDocIdentidadSeleccionarTodosIncSinTipoDoc";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaTiposSexo()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposSexoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public DataSet SeleccionarDeConsultaExterna()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("TiposNumeracionHistoriaSeleccionarDeConsultaExterna");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        public DataSet SeleccionarDeEmergencia()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("TiposNumeracionHistoriaSeleccionarDeEmergencia");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        public DataSet SeleccionarDeHospitalizacion()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("TiposNumeracionHistoriaSeleccionarDeHospitalizacion");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        public Task<DataSet> TiposEstadoCivilTodos() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposEstadoCivilTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> TiposGradoInstruccionTodos() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposGradoInstruccionTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> TiposEdadSeleccionarTodos()  // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposEdadSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> TiposProcedenciaTodos() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposProcedenciaTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> TiposOcupacionTodos() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposOcupacionTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> TiposIdiomasSeleccionarTodos() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposIdiomasSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposEtnia()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EtniaHISseleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> TiposReligion() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarReligion";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> ListaDepartamentos() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DepartamentosSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaEstablecimientosByCodigo(string codigo) // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaEstablecimientosByCodigo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@codigo", SqlDbType.VarChar).Value = codigo;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaDepartamentosSeleccionarPorIdPais(int IdPais) // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DepartamentosSeleccionarPorIdPais";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPais", SqlDbType.Int).Value = IdPais;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> ListaProvinciasByDepartamentos(int idDepartamento) // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ProvinciasSeleccionarPorDepartamento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> ListaDistritosByProvincia(int idProvincia) // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DistritosSeleccionarPorProvincia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProvincia", SqlDbType.Int).Value = idProvincia;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> ListaCentroPobladoByDistrito(int idDistrito) // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CentrosPobladosSeleccionarPorDistrito";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdDistrito", SqlDbType.Int).Value = idDistrito;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public async Task<DataSet> ListaPaises()
        {

            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "PaisesSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });

        }
        public async Task<Boolean> InsertaFirma(string ruta, string code, string idDoc, int idCuenta, int idRegistro, string tipo, string accion, int status, string rutaArchivo)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_InsertFirma", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ruta", ruta);
                    cmd.Parameters.AddWithValue("@code", code);
                    cmd.Parameters.AddWithValue("@idDoc", idDoc);
                    cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuenta);
                    cmd.Parameters.AddWithValue("@idRegistro", idRegistro);
                    cmd.Parameters.AddWithValue("@tipo", tipo);
                    cmd.Parameters.AddWithValue("@accion", accion);
                    cmd.Parameters.AddWithValue("@status", status);
                    cmd.Parameters.AddWithValue("@rutaArchivo", rutaArchivo);
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = true;
                }

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            return nRpta;
        }

        public async Task<Boolean> InsertaFirmaDigital(string code)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_InsertFirmaDigital", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@code", code);
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = true;
                }

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }

            return nRpta;

        }

        public async Task<Boolean> EstadoFirmaDigitalAutoriza(string code, int idEmpleado)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_EstadoFirmaDigitalAutoriza", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@code", code);
                    cmd.Parameters.AddWithValue("@idEmpleado", idEmpleado);
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = true;
                }

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }

            return nRpta;

        }

        public DataSet ListaFirmaByIdCuentaByTipo(int idCuentaAtencion, string tipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaFirmaByIdCuentaByTipo");
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@tipo", tipo);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet ListaFirmaByIdRegistroByTipo(int idRegistro, string tipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaFirmaByIdRegistroByTipo");
                cmd.Parameters.AddWithValue("@idRegistro", idRegistro);
                cmd.Parameters.AddWithValue("@tipo", tipo);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<Boolean> insertaDiagnosticosPorEvaluacion(int idAtencion, int clasificacionDiagnostico, int idUsuario, List<Diagnosticos> dsDiagnosticos, int idServicio, int nroEvaluacion) // KHOYOSI
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

        public Task<Boolean> insertaDiagnosticosPorEvaluacionNotaIngreso(int idAtencion, int clasificacionDiagnostico, int idUsuario, List<Diagnosticos> dsDiagnosticos, int? nroEvaluacion, int idServicio) // JDELGADO004
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
                        string sql = "web_insertaDiagnosticosPorEvaluacionNotaIngreso";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                        cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                        cmd.Parameters.AddWithValue("@diagnosticos", xmlDiagnosticos);
                        cmd.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);
                        cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                        cmd.Parameters.AddWithValue("@idServicio", idServicio);
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

        public Task<Boolean> insertaDiagnosticosInterconsultaHO(int idAtencion, int clasificacionDiagnostico, int idUsuario, List<Diagnosticos> dsDiagnosticos, int? idAtencionInterconsulta, int idServicio) // JDELGADO004
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
                        string sql = "web_insertaDiagnosticosInterconsultaHospitalizacion";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                        cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                        cmd.Parameters.AddWithValue("@diagnosticos", xmlDiagnosticos);
                        cmd.Parameters.AddWithValue("@idAtencionInterconsulta", idAtencionInterconsulta);
                        cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                        cmd.Parameters.AddWithValue("@idServicio", idServicio);
                        da.InsertCommand = cmd;

                        da.InsertCommand.ExecuteNonQuery();

                        //if (da.InsertCommand.ExecuteNonQuery() > 0)
                        //{
                        //    conn.Close();
                        //    return true;
                        //}
                        //else
                        //{
                        //    conn.Close();
                        //    return false;
                        //}

                        return true;
                    }
                }
            });
        }

        public Task<Boolean> insertaDiagnosticos(int idAtencion, int clasificacionDiagnostico, int idUsuario, List<Diagnosticos> dsDiagnosticos) // JDELGADO001.2
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
                        string sql = "web_insertaDiagnosticos";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                        cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                        cmd.Parameters.AddWithValue("@diagnosticos", xmlDiagnosticos);
                        cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                        da.InsertCommand = cmd;
                        da.InsertCommand.ExecuteNonQuery();

                        //if (da.InsertCommand.ExecuteNonQuery() > 0)
                        //{
                        //    conn.Close();
                        //    return true;
                        //}
                        //else
                        //{
                        //    conn.Close();
                        //    return false;
                        //}
                        return true;
                    }
                }
            });
        }

        public async Task<DataSet> ListarAtencionesCEJsonaMigradas(DateTime fechaIni, DateTime fechaFin, int Tipo)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarAtencionesCEJsonaMigradas", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                cmd.Parameters.AddWithValue("@Tipo", Tipo);

                cmd.CommandTimeout = 0;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> DevuelveListaAtencionesaCEMigrar(DateTime fechaIni, DateTime fechaFin)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarAtencionesCEJsonaMigrarNuevo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> DevuelveListaAtencionesPlanificacionMigrar(DateTime fechaIni, DateTime fechaFin)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarTramaJsonaPlanificacionHisminsa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ListarAtencionesTelesaludJsonaMigrar(DateTime fechaIni, DateTime fechaFin)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarAtencionesTelesaludJsonaMigrar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> ListarErroresTramaHisMinsa()
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarErroresTramaHisMinsa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        // JDELGADO J0 AGREGAR MODULO PARA REPORTE DE TRAMAS HIS MINSA
        public DataSet ReporteAtencionesaCEMigrar(DateTime fechaIni, DateTime fechaFin, int TipoBusqueda)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            string procedure = "";

            try
            {
                Console.WriteLine("donde");
                Console.WriteLine(TipoBusqueda);
                if (TipoBusqueda == 1)
                {
                    Console.WriteLine("insertarTramaReporteHisMinsa");
                    procedure = "insertarTramaReporteHisMinsa";
                }
                if (TipoBusqueda == 2)
                {
                    Console.WriteLine("insertarTramaReporteHisMinsaFechaRegistro");
                    procedure = "insertarTramaReporteHisMinsaFechaRegistro";
                }

                cmd = MetodoDatos.CrearComando(procedure);
                cmd.Parameters.AddWithValue("@FechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet ReporteAtencionesPlanificacionMigrar(DateTime fechaIni, DateTime fechaFin, int TipoBusqueda)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            string procedure = "";
            try
            {

                if (TipoBusqueda == 1)
                {
                    procedure = "insertarTramaReportePlanificacionHisminsa";
                }
                if (TipoBusqueda == 2)
                {
                    procedure = "insertarTramaReportePlanificacionHisminsaFechaRegistro";
                }

                cmd = MetodoDatos.CrearComando(procedure);
                cmd.Parameters.AddWithValue("@FechaInicio", fechaIni);
                cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        // END JDELGADO J0 AGREGAR MODULO PARA REPORTE DE TRAMAS HIS MINSA

        public async Task<Boolean> MigrarDataCE(DateTime FecIni, DateTime FecFin, Int32 IdEmpleado)
        {

            Boolean nRpta = false;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("insertarTramaJsonaCEHisminsa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", FecIni);
                cmd.Parameters.AddWithValue("@FechaFin", FecFin);
                cmd.Parameters.AddWithValue("@idUsuario", IdEmpleado);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                cmd.CommandTimeout = 0;

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

                return nRpta;
            }
        }

        public async Task<Boolean> MigrarDataTelesalud(DateTime FecIni, DateTime FecFin, Int32 IdEmpleado)
        {

            Boolean nRpta = false;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("insertarTramaJsonaTelesaludHisminsa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", FecIni);
                cmd.Parameters.AddWithValue("@FechaFin", FecFin);
                cmd.Parameters.AddWithValue("@idUsuario", IdEmpleado);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                cmd.CommandTimeout = 0;

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

                return nRpta;
            }
        }


        public async Task<Boolean> MigrarDataPlanificacionFamiliar(DateTime FecIni, DateTime FecFin, Int32 IdEmpleado)
        {


            Boolean nRpta = false;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("insertarTramaJsonaPlanificacionHisminsa", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@fechaInicio", FecIni);
                cmd.Parameters.AddWithValue("@FechaFin", FecFin);
                cmd.Parameters.AddWithValue("@idUsuario", IdEmpleado);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                cmd.CommandTimeout = 0;

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

                return nRpta;
            }

        }

        public async Task<Boolean> DepurarDataMigrada()
        {

            Boolean nRpta = false;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("USP_INTEGRACION_UPD_DEPURA", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

                return nRpta;
            }



        }

        public DataSet ListaTramaConErrorDepuracion()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ListaTramaConErrorDepuracion");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet ListaJsonSinEnvio()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("ListaJsonSinEnvio");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public async Task<Boolean> GeneradorJson()
        {
            Boolean nRpta = false;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("USP_INTEGRACION_generarJsonIntegracion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                cmd.CommandTimeout = 0;

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

                return nRpta;
            }


        }

        /// <summary>
        /// /KHOYOSI
        /// </summary>
        /// <returns></returns>
        public Task<DataSet> ListarTiposGravedadAtencion()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposGravedadAtencionSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarServiciosMGP()
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarServiciosMGP";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarOrigenAtencionEmergencia()
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarOrigenAtencionHospitalizacion(int idTipoServicio)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposOrigenAtencionSeleccionarViasDeHospitalizacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@TipoServicioHosp", SqlDbType.Int).Value = idTipoServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> EstanciaHospitalariaSeleccionarPorAtencion(int idAtencion, int secuenciaMayorA)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EstanciaHospitalariaSeleccionarPorAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@SecuenciaMayorA", SqlDbType.Int).Value = secuenciaMayorA;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        //////////////KHOYOSI//////////////////////////////
        public DataSet ListaEstablecimientosSaludTodos()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("EstablecimientosSeleccionarTodos");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> ListaEstablecimientosSaludTodosV2()
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EstablecimientosSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });

        }
        public DataSet EstablecimientosFiltrar(string filtro)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("EstablecimientosFiltrar");
                cmd.Parameters.AddWithValue("@lcFiltro", filtro);
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
        public DataSet EstablecimientosNoMinsaFiltrar(string filtro)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("EstablecimientosNoMinsaFiltrar");
                cmd.Parameters.AddWithValue("@lcFiltro", filtro);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet UPServiciosSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("UPServiciosSeleccionarTodos");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet CondicionUsuarioReferenciaSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("CondicionUsuarioReferenciaSeleccionarTodos");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }
        //////////////KHOYOSI//////////////////////////////
        ///

        public Task<DataSet> listarTipoServicio() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH..web_listarTipoServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH..TiposOrigenAtencionSeleccionarViasDeConsultoriosExternos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH..TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposOrigenAtencionSeleccionarViasDeHospitalizacion(int TipoServicioHosp) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH..TiposOrigenAtencionSeleccionarViasDeHospitalizacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@TipoServicioHosp", SqlDbType.Int).Value = TipoServicioHosp;
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH..TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> web_selectIdDepartamentoIdProvinciaByIdDistrito(int idDistrito) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        Console.WriteLine("idDistrito");
                        Console.WriteLine(idDistrito);
                        string sql = "SIGH..web_selectIdDepartamentoIdProvinciaByIdDistrito";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdDistrito", SqlDbType.Int).Value = idDistrito;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FactCatalogoServiciosXidTipoFinanciamiento(int idProducto, int idTipoFinanciamiento) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH..FactCatalogoServiciosXidTipoFinanciamiento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
                        da.SelectCommand.Parameters.Add("@IdTipoFinanciamiento", SqlDbType.Int).Value = idTipoFinanciamiento;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarMedicos() // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarMedicos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarMedicosResponsableReferencias() // KHOYOSI
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarMedicosResponsableReferencias";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarProfesionalesDeLaSalud() // KHOYOSI
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarProfesionalesDeLaSalud";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TipoPacienteEnEspecialidad(int idPaciente, int idEspecialidad) // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TipoPacienteEnEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> TipoPacienteEnEspecialidadEmergencia(int idPaciente, int idEspecialidad) // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TipoPacienteEnEspecialidadEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        ////////////////////KHOYOSI////////////////////////////////
        public DataSet ListarMedicoPorIdEmpleado(int idEmpleado)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("MedicosXidEmpleado");
                cmd.Parameters.AddWithValue("@IdEmpleado", idEmpleado);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> ListaDestinosConsultorioEmergencia() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposDestinoAtencionSeleccionarDestinosDeConsultorioEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaDestinosHospitalizacion(int tipoServicio) // KOHYOSI
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposDestinoAtencionSeleccionarDestinosDeHospitalizacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@TipoServicioHosp", SqlDbType.Int).Value = tipoServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaTiposAlta() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposAltaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaCondicionAlta() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposCondicionAltaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaTiposReferencia() // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposReferenciaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarMedicosPorFiltro(string filtro)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "MedicosFiltrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        //////////////////////////////////////////////////////////
        ///
        public Task<DataSet> ListarEspecialidades() // JDELGADO011
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarEspecialidades";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {
                            ds = null; throw ex;
                        }
                        finally
                        {
                            conn.Close();
                        }
                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarTiposConsulta() // JDELGADO011
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarTiposConsulta";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {
                            ds = null; throw ex;
                        }
                        finally
                        {
                            conn.Close();
                        }
                        return ds;
                    }
                }
            });
        }


        ////////////////////KHOYOSI////////////////////////////////
        public async Task<DataSet> ListaFirmaByIdCuentaByIdegistroByTipo(int idCuentaAtencion, int idRegistro, string tipo)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaFirmaByIdCuentaByIdRegistroByTipo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@IdRegistro", SqlDbType.Int).Value = idRegistro;
                        da.SelectCommand.Parameters.Add("@Tipo", SqlDbType.VarChar).Value = tipo;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorCode(string code)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorCode";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@code", SqlDbType.VarChar).Value =code;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorCodePorIdEmpleado(string code, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorCodePorIdEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@code", SqlDbType.VarChar).Value = code;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorId(int id)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = id;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorCodePorUsuario(string code, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorCodePorUsuario";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@code", SqlDbType.VarChar).Value = code;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalPaqueteSeleccionarPorNombrePorIdEmpleado(string paquete, string tipo, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalPaqueteSeleccionarPorNombrePorIdEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@paquete", SqlDbType.VarChar).Value = paquete;
                        //da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorGrupo(int idRegistro, string tipo)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorGrupo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRegistro", SqlDbType.VarChar).Value = idRegistro;
                        da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ListarServicioPorTipoServicio(int idTipoServicio)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ServicioSeleccionarPorTipoServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ServiciosSeleccionarPorId(int idServicio)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ServiciosSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdServicio ", SqlDbType.Int).Value = idServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ServiciosSeleccionarCEPorEspecialidad(int idEspecialidad)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ServiciosSeleccionarCEPorEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Especialidad ", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public async Task<DataSet> ValidarPermisoEmpleado(int idEmpleado, int idPermiso)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PermisosSeleccionarPorIdEmpleadoPorIdPermiso";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado ", SqlDbType.Int).Value = idEmpleado;
                        da.SelectCommand.Parameters.Add("@IdPermiso ", SqlDbType.Int).Value = idPermiso;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<int> ValidarPermisoUsuario(int idEmpleado, string clave)
        {
            Conexion cx = new Conexion();
            int validar = 0;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ValidarPermisoUsuario";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado ", SqlDbType.Int).Value = idEmpleado;
                        da.SelectCommand.Parameters.Add("@Clave ", SqlDbType.VarChar).Value = clave;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        validar = ds.Tables[0].Rows.Count;

                        return validar;
                    }
                }
            });
        }


        ////////////////////////////KHOYOSI///////////////////////////
        public async Task<DataSet> SeleccionarAtencionAtencionDatosAdicionalesPaciente(int idAtencion)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesSeleccionarPorIdAtencionEnAtencionesAtencionesdatosadicionalesPacientes";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAtencion ", SqlDbType.Int).Value = idAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> CierreControlPrenatalSeleccionar(int idAtencion)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CierreControlPrenatalSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAtencion ", SqlDbType.Int).Value = idAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<Boolean> CierreControlPrenatalModificar(Atenciones atencion, ProCabecera proCabecera, int EstadoCierreControlPrenatal)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "CierreControlPrenatalModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = atencion.idAtencion;
                            da.SelectCommand.Parameters.Add("@IdProCabecera", SqlDbType.Int).Value = proCabecera.IdProcabecera;
                            da.SelectCommand.Parameters.Add("@EstadoCierre", SqlDbType.Int).Value = EstadoCierreControlPrenatal;
                            da.SelectCommand.Parameters.Add("@FechaCierre", SqlDbType.DateTime).Value = atencion.fechaEgreso;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = atencion.idUsuario;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        ////////////////////////////KHOYOSI (ALTA MEDICA)////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        public async Task<Boolean> AltaMedicaModificar(Atenciones atencion, AtencionesDatosAdicionales atencionesDatosAdicionales, int CargarProcedimiento)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_AltaMedicaModificarV1";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = atencion.idPaciente;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = atencion.idAtencion;
                            da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = atencion.idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@IdCamaEgreso", SqlDbType.Int).Value = atencion.idCamaEgreso;
                            da.SelectCommand.Parameters.Add("@IdServicioEgreso", SqlDbType.Int).Value = atencion.idServicioEgreso;
                            da.SelectCommand.Parameters.Add("@IdTipoAlta", SqlDbType.Int).Value = atencion.idTipoAlta;
                            da.SelectCommand.Parameters.Add("@IdCondicionAlta", SqlDbType.Int).Value = atencion.idCondicionAlta;
                            da.SelectCommand.Parameters.Add("@IdDestinoAtencion", SqlDbType.Int).Value = atencion.idDestinoAtencion;
                            da.SelectCommand.Parameters.Add("@HoraEgreso", SqlDbType.Char).Value = atencion.horaEgreso;
                            da.SelectCommand.Parameters.Add("@FechaEgreso", SqlDbType.DateTime).Value = atencion.fechaEgreso;
                            da.SelectCommand.Parameters.Add("@IdMedicoEgreso", SqlDbType.Int).Value = atencion.idMedicoEgreso;

                            da.SelectCommand.Parameters.Add("@HuboInfeccionIntraHospitalaria", SqlDbType.Int).Value = atencionesDatosAdicionales.HuboInfeccionIntraHospitalaria;

                            da.SelectCommand.Parameters.Add("@IdTipoReferenciaDestino", SqlDbType.Int).Value = atencionesDatosAdicionales.IdTipoReferenciaDestino;
                            da.SelectCommand.Parameters.Add("@IdEstablecimientoDestino", SqlDbType.Int).Value = atencionesDatosAdicionales.IdEstablecimientoDestino;
                            da.SelectCommand.Parameters.Add("@NroReferenciaDestino", SqlDbType.VarChar).Value = atencionesDatosAdicionales.NroReferenciaDestino;

                            da.SelectCommand.Parameters.Add("@TieneNecropsia", SqlDbType.Bit).Value = atencionesDatosAdicionales.TieneNecropsia;

                            da.SelectCommand.Parameters.Add("@CargarProcedimiento", SqlDbType.Int).Value = CargarProcedimiento;
                            
                            da.SelectCommand.Parameters.Add("@OpcionIntervenciónQuirurgica", SqlDbType.Int).Value = atencionesDatosAdicionales.OpcionIntervenciónQuirurgica;
                            da.SelectCommand.Parameters.Add("@IntervencionQuirurgica", SqlDbType.VarChar).Value = atencionesDatosAdicionales.IntervencionQuirurgica;
                            da.SelectCommand.Parameters.Add("@FechaIntervencionQuirurgica", SqlDbType.DateTime).Value = atencionesDatosAdicionales.FechaIntervencionQuirurgica ?? Convert.DBNull;
                            da.SelectCommand.Parameters.Add("@HoraIntervencionQuirurgica", SqlDbType.VarChar).Value = atencionesDatosAdicionales.HoraIntervencionQuirurgica;
                            da.SelectCommand.Parameters.Add("@IdMedicoIntervencionQuirurgica", SqlDbType.Int).Value = atencionesDatosAdicionales.IdMedicoIntervencionQuirurgica;
                            da.SelectCommand.Parameters.Add("@ObservacionAltaMedica", SqlDbType.VarChar).Value = atencionesDatosAdicionales.ObservacionAltaMedica;//RMOREANO OBSERVACION ALTAMEDICA

                            da.SelectCommand.Parameters.Add("@IdGrupoGo", SqlDbType.Int).Value = atencionesDatosAdicionales.IdGrupoGo;
                            //da.SelectCommand.Parameters.Add("@IdEstadoFacturacion", SqlDbType.Int).Value = idEstadoFacturacion;
                            da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = atencion.idUsuario;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> AltaMedicaEliminar(int idAtencion, string motivo, int idUsuario)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_AltaMedicaEliminar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@Motivo", SqlDbType.VarChar).Value = motivo;
                            da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        public async Task<Boolean> ProcesoFirmaModificar(int idFirma, string codeFirma, int estado)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ProcesoFirmaDigitalModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdFirma", SqlDbType.Int).Value = idFirma;
                            da.SelectCommand.Parameters.Add("@CodeFirma", SqlDbType.VarChar).Value = codeFirma;
                            da.SelectCommand.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> EstadoFirmaModificar(int idFirma, string codeFirma, int estado)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EstadoFirmaDigitalModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdFirma", SqlDbType.Int).Value = idFirma;
                            da.SelectCommand.Parameters.Add("@CodeFirma", SqlDbType.VarChar).Value = codeFirma;
                            da.SelectCommand.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> EstadoFirmaEmpleadoModificar(int idFirma, string codeFirma, int idEmpleado, int estado)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EstadoFirmaDigitalAutorizadoModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdFirma", SqlDbType.Int).Value = idFirma;
                            da.SelectCommand.Parameters.Add("@CodeFirma", SqlDbType.VarChar).Value = codeFirma;
                            da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;
                            da.SelectCommand.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> ModificarEstadoFirmaPaquete(string nombrePaquete, int estado)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ModificarEstadoFirmaPaquete";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@NombrePaquete", SqlDbType.VarChar).Value = nombrePaquete;
                            da.SelectCommand.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }
        public Task<DataSet> TipoSoporteOxigenatorioVentilatorio() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_TipoSoporteOxigenatorioVentilatorio";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> SeleccionarDocumentosFirmaByIdCuentaAndIdEmpleado(int idCuentaAtencion, int statusFirma)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            //bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_SeleccionarDocumentosFirmaByIdCuentaAndIdEmpleado";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@statusFirma", SqlDbType.Int).Value = statusFirma;

                            da.Fill(ds);

                            return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        //return null;
                    }
                }
            });
        }

        public async Task<DataSet> SeleccionarDocumentosFirmaDigitalByIdCuentaAndIdEmpleado(int idCuentaAtencion, int idEmpleado, int statusFirma)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            //bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_SeleccionarDocumentosFirmaDigitalByIdCuentaAndIdEmpleado";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;
                            da.SelectCommand.Parameters.Add("@statusFirma", SqlDbType.Int).Value = statusFirma;

                            da.Fill(ds);

                            return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        //return null;
                    }
                }
            });
        }

        public async Task<DataSet> SeleccionarFirmaDigitalPorNombreArchivo(string nombre)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            //bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_SeleccionarFirmaDigitalPorNombreArchivo";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@nombre", SqlDbType.VarChar).Value = nombre;

                            da.Fill(ds);

                            return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        //return null;
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

        public String ComrpimirDocumentosParaFirma(string[] filesPath, string OutputFilePath, string Password = null, int CompressionLevel = 9)
        {

            try
            {


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

                    foreach (string file in filesPath)
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

        public async Task<Boolean> CrearEstadoFirmaPaquete(int idCuenta, string nombrePaquete, int estado)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_CrearEstadoFirmaPaquete";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCuenta", SqlDbType.Int).Value = idCuenta;
                            da.SelectCommand.Parameters.Add("@NombrePaquete", SqlDbType.VarChar).Value = nombrePaquete;
                            da.SelectCommand.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        ///////////////////////////////KHOYOSI (Bit4ID)////////////////////////////////
        public async Task<Boolean> FirmaDigitalModificar(FirmaDigital firma, string accion)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@accion", SqlDbType.Char).Value = accion;
                            da.SelectCommand.Parameters.Add("@code", SqlDbType.VarChar).Value = firma.code;
                            da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = firma.idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@idRegistro", SqlDbType.Int).Value = firma.idRegistro;
                            da.SelectCommand.Parameters.Add("@idTipoServicio", SqlDbType.Int).Value = firma.idTipoServicio;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = firma.idServicio;
                            da.SelectCommand.Parameters.Add("@idEvaluacion", SqlDbType.Int).Value = firma.idEvaluacion;
                            da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = firma.idEmpleado;
                            da.SelectCommand.Parameters.Add("@fecha", SqlDbType.VarChar).Value = firma.fecha;
                            da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = firma.tipo;
                            da.SelectCommand.Parameters.Add("@nombre", SqlDbType.Text).Value = firma.nombreArchivo;
                            da.SelectCommand.Parameters.Add("@ruta", SqlDbType.Text).Value = firma.rutaArchivo;
                            da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = firma.idUsuarioRegistra;
                            da.SelectCommand.Parameters.Add("@idItem", SqlDbType.Int).Value = firma.idItem;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> ValidarCodeFirmaDigital(string code)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalValidarCode";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@code", SqlDbType.VarChar).Value = code;

                            da.Fill(ds);

                            if (ds.Tables[0].Rows[0]["existe"].ToString() == "0")
                            {
                                nRpta = false;
                            }
                            else
                            {
                                nRpta = true;
                            }
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> ValidarNombreFirmaDigital(string nombre)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalValidarNombre";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@nombre", SqlDbType.VarChar).Value = nombre;

                            da.Fill(ds);

                            if (ds.Tables[0].Rows[0]["existe"].ToString() == "0")
                            {
                                nRpta = false;
                            }
                            else
                            {
                                nRpta = true;
                            }
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarDatos(int idCuenta, int idRegistro, int idItem, string tipo, int idNumero)
        {
            //Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalSeleccionarDatosParaFirmaDigital";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idCuenta", SqlDbType.Int).Value = idCuenta;
                            da.SelectCommand.Parameters.Add("@idRegistro", SqlDbType.Int).Value = idRegistro;
                            da.SelectCommand.Parameters.Add("@idItem", SqlDbType.Int).Value = idItem;
                            da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;
                            da.SelectCommand.Parameters.Add("@idNumero", SqlDbType.VarChar).Value = idNumero;

                            da.Fill(ds);

                            //return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarDatosPorCuentas(string cuentas, int idEvaluacion, int idServicio, int idEmpleado)
        {
            //Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalSeleccionarDatosPorCuentas";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@cuentas", SqlDbType.VarChar).Value = cuentas;
                            da.SelectCommand.Parameters.Add("@idEvaluacion", SqlDbType.Int).Value = idEvaluacion;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                            da.Fill(ds);

                            //return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });
        }


        public async Task<DataSet> FirmaDigitalSeleccionarDatosPorRegistros(string registros, int idEvaluacion, int idServicio, int idEmpleado, string tipo)
        {
            //Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalSeleccionarDatosPorRegistros";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@registros", SqlDbType.VarChar).Value = registros;
                            da.SelectCommand.Parameters.Add("@idEvaluacion", SqlDbType.Int).Value = idEvaluacion;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;
                            da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;

                            da.Fill(ds);

                            //return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarDatosPorRegistrosPorItems(string registros, int idEvaluacion, int idServicio, int idEmpleado, int idItem, string tipo)
        {
            //Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalSeleccionarDatosPorRegistrosPorItems";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@registros", SqlDbType.VarChar).Value = registros;
                            da.SelectCommand.Parameters.Add("@idEvaluacion", SqlDbType.Int).Value = idEvaluacion;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;
                            da.SelectCommand.Parameters.Add("@idItem", SqlDbType.Int).Value = idItem;
                            da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;

                            da.Fill(ds);

                            //return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FirmaDigitalSeleccionarDatosPorIdRecetas(string idCuenta)
        {
            //Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalSeleccionarDatosPorRecetas";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCuenta", SqlDbType.VarChar).Value = idCuenta;

                            da.Fill(ds);

                            //return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });

        }

        public async Task<string> FirmaDigitalGenerarPaquete(string cuentas, string registros, string tipos, int idUsuario)
        {
            string nRpta = "";
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_FirmaDigitalGenerarPaquete", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.AddWithValue("@IdPaquete", idPaquete);
                    cmd.Parameters.Add("@cuentas", SqlDbType.VarChar, 256).Value = (cuentas == null ? "" : cuentas);
                    cmd.Parameters.Add("@registros", SqlDbType.VarChar, 256).Value = (registros == null ? "" : registros);
                    cmd.Parameters.Add("@tipos", SqlDbType.VarChar, 256).Value = (tipos == null ? "" : tipos);
                    cmd.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idUsuario;
                    cmd.Parameters.Add("@paquete", SqlDbType.VarChar, 50).Direction = ParameterDirection.Output;
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = cmd.Parameters["@paquete"].Value.ToString(); ;
                }

            }
            catch (Exception ex)
            {
                nRpta = "ERROR: " + ex.Message.ToString();
                throw new Exception(ex.Message);
            }
            return nRpta;
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorPaquetePorIdEmpleado(string paquete, int idUsuario)
        {
            //Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_FirmaDigitalSeleccionarPorPaquetePorIdEmpleado";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@paquete", SqlDbType.VarChar).Value = paquete;
                            da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            //return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });

        }

        public async Task<string> PaqueteArchivoModificar(string nombre, string tipo, int idUsuario, int estado)
        {
            string nRpta = "";
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_PaqueteArchivoModificar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.AddWithValue("@IdPaquete", idPaquete);
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar, 256).Value = nombre;
                    cmd.Parameters.Add("@Tipo", SqlDbType.VarChar, 20).Value = tipo;
                    cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                    cmd.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;
                    cmd.Parameters.Add("@NombrePackage", SqlDbType.VarChar, 256).Direction = ParameterDirection.Output;
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = cmd.Parameters["@NombrePackage"].Value.ToString(); ;
                }

            }
            catch (Exception ex)
            {
                nRpta = "ERROR: " + ex.Message.ToString();
                throw new Exception(ex.Message);
            }
            return nRpta;
        }

        public string ComprimirArchivoEnZip(string directorio, string zip)
        {

            try
            {
                System.IO.Compression.ZipFile.CreateFromDirectory(directorio, zip, CompressionLevel.Fastest, false);
            }
            catch (Exception e)
            {
                return e.ToString();
            }

            return "Ok";
        }

        public string ComprimirArchivoEn7Zip(string directorio, string zip)
        {

            try
            {
                using (SevenZipArchive archive = new SevenZipArchive())
                {
                    archive.CreateEntries(directorio, false);
                    archive.Save(zip);
                }
            }
            catch (Exception e)
            {
                return e.ToString();
            }

            return "Ok";
        }

        public string GetMACAddress()
        {
            NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();
            String sMacAddress = string.Empty;
            foreach (NetworkInterface adapter in nics)
            {
                //if (sMacAddress == String.Empty)// only return MAC Address from first card
                //{
                //    IPInterfaceProperties properties = adapter.GetIPProperties();
                //    sMacAddress = adapter.GetPhysicalAddress().ToString();
                //}

                IPInterfaceProperties properties = adapter.GetIPProperties();
                sMacAddress = sMacAddress + adapter.GetPhysicalAddress().ToString();
            }
            return sMacAddress;
        }

        public Task<DataSet> FiltrarMedicos(string CodigoPlanilla, string ApellidoPaterno, string ApellidoMaterno, string Nombres, int IdEspecialidad)
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
                            string sql = "Web_FiltrarMedicos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@CodigoPlanilla", CodigoPlanilla ?? "");
                            cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno ?? "");
                            cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno ?? "");
                            cmd.Parameters.AddWithValue("@Nombres", Nombres ?? "");
                            cmd.Parameters.AddWithValue("@IdEspecialidad", IdEspecialidad);

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

        public Task<DataSet> FiltrarMedicosTamizaje()
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
                            string sql = "Web_FiltrarMedicos_Tamizaje";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

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

        public Task<DataSet> ListarDocumentoFirmaDigital(int idCuentaAtencion)
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
                            string sql = "Web_ListarDocumentoFirmaDigital";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

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

        public Task<DataSet> ListarResultadosLaboratorioByIdCuentaAtencion(int idCuentaAtencion)
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
                            string sql = "web_ListarResultadosLaboratorioByIdCuentaAtencion";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

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

        public Task<DataSet> ListarResultadosLabImg(int idOrden, int idProducto, string tipo)
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
                            string sql = "web_ResultadosLabImg";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idProducto", idProducto);
                            cmd.Parameters.AddWithValue("@tipo", tipo);

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

        ///////////////////////////TRANSFERENCIAS ///////////////////////////////// (KHOYOSI)
        public async Task<Boolean> GuardarTransferencias(int idAtencion, int idPaciente, int idMedicoOrden, int idMedicoRecibe, string fecha, string hora, int idCama, int idServicio, int llegoAlServicio, int idUsuario)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_TransferenciasModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;
                            da.SelectCommand.Parameters.Add("@IdMedicoOrdenaOrigen", SqlDbType.Int).Value = idMedicoOrden;
                            da.SelectCommand.Parameters.Add("@IdMedicoRecibe", SqlDbType.Int).Value = idMedicoRecibe;
                            da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.Date).Value = fecha;
                            da.SelectCommand.Parameters.Add("@Hora", SqlDbType.Char).Value = hora;
                            da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;
                            da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> ModificarEstanciaHospitalariaLlegada(int idEstanciaHosp, int idCama, int idUsuario)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_TransferenciasLLegadaModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAEstanciaHospitalaria", SqlDbType.Int).Value = idEstanciaHosp;
                            da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }


        public Task<DataSet> TiposDestinoAtencionHospitalizacion() // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_TiposDestinoAtencionHospitalizacion";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> SeleccionarCamaByIdServicio(int IdServicio) // JDELGADO002
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarCamaByIdServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        /////////////////////////////KHOYOSI////////////////////////////////
        public Task<DataSet> ListarTiposTurnosLaborales()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarTiposTurnosLaborales";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarEstadosHojaOcurrenciaMedica()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarEstadosHojaOcurrenciaMedica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ///////////////////////////////////////////////////////////////////


        ///////////////////////CONTROL ASISTENCIA////////////////////////////////
        public Task<DataSet> ListarMedicosControlAsistencia()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionControlAsistencia())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "WEB_SIHCE_ListarMedicos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarMedicosPorMarcacionPorTurnoControlAsistencia(string fecha, int idTurno)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                //using (SqlConnection conn = cx.obtenerConexionControlAsistencia())
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CONTROL_ASIST_ListarMedicosPorMarcacionPorTurno";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Fecha", fecha);
                        da.SelectCommand.Parameters.AddWithValue("@IdTurno", idTurno);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ///////////////////////////////////////////////////////////////////
        ///
        public Task<DataSet> ConsultarStockProductoPorFarmacia(int idAlmacen, int idProducto) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ConsultarStockProductoPorFarmacia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAlmacen", idAlmacen);
                        da.SelectCommand.Parameters.AddWithValue("@idProducto", idProducto);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        ////////////////////////////KHOYOSI/////////////////////////////////////////
        public async Task<Boolean> GenerarAccionFlujoAtencionCE(int idAtencion, int idFlujo, int idMedico)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_GenerarAccionFlujoAtencionCE";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@IdFlujo", SqlDbType.Int).Value = idFlujo;
                            da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> GenerarAccionFlujoAtencionTerapias(int idCita, int idFlujo, int idMedico)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_GenerarAccionFlujoAtencionTerapias";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCita", SqlDbType.Int).Value = idCita;
                            da.SelectCommand.Parameters.Add("@IdFlujo", SqlDbType.Int).Value = idFlujo;
                            da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<Boolean> GenerarAccionFlujoAtencionProcedimientos(int idCita, int idFlujo, int idMedico)
        {
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_GenerarAccionFlujoAtencionProcedimientos";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCita", SqlDbType.Int).Value = idCita;
                            da.SelectCommand.Parameters.Add("@IdFlujo", SqlDbType.Int).Value = idFlujo;
                            da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarDatosRefcon(int IdCuentaAtencion) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarDatosRefcon";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        /////////////////////////////////KHOYOSI/////////////////////////////////////////////////////////////
        public Task<DataSet> ListarVentanillas()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarVentanillas";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaTurnosPorVentanilla(int idVentanilla)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListaTurnosPorVentanilla";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdVentanilla", idVentanilla);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> GenerarAccionFlujoAdmision(int idTurno, int idEstado, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexionGestionColas())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ActualizarEstadoTurno";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdTurno", idTurno);
                        da.SelectCommand.Parameters.AddWithValue("@IdEstado", idEstado);
                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleado", idEmpleado);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return true;
                    }
                }
            });
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////KHOYOSI/////////////////////////////////////////////////////////////////
        public Task<DataSet> ListarEstadosRecetas()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarEstadosReceta";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////KHOYOSI/////////////////////////////////////////////////////////////////
        public Task<DataSet> ExamenLaboratorioResultadoItemSeleccionar(int idPaciente, string codigoCpt, int idItemGrupo, int idItem)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenLaboratorioResultadoItemSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", idPaciente);
                        da.SelectCommand.Parameters.AddWithValue("@CodigoCPT", codigoCpt);
                        da.SelectCommand.Parameters.AddWithValue("@IdItemGrupo", idItemGrupo);
                        da.SelectCommand.Parameters.AddWithValue("@IdItem", idItem);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////////////KHOYOSI/////////////////////////////////////////////////////////////////
        public Task<DataSet> RecetaCabeceraDetalleSeleccionaPorNroReceta(string idReceta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraDetalleSeleccionaPorNroReceta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdReceta", idReceta);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });

        }

        public Task<DataSet> RecetaCabeceraDetalleSeleccionaPorComprobantePago(string NroSerie, string NroDocumento, int idPuntoCarga)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RecetaCabeceraDetalleSeleccionaPorComprobantePago";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@NroSerie", NroSerie);
                        da.SelectCommand.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                        da.SelectCommand.Parameters.AddWithValue("@IdPuntoCarga", idPuntoCarga);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });

        }


        public Task<DataSet> ListarTiposFinanciamientos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposFinanciamientoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ServiciosFiltrar(string lcFiltro) // JDELGADOPM
        {
            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ServiciosFiltrar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = (lcFiltro == null) ? "" : lcFiltro;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> MedicosFiltrar(string lcFiltro) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("MedicosFiltrar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = (lcFiltro == null) ? "" : lcFiltro;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> TiposGravedadAtencionSeleccionarTodos() // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposGravedadAtencionSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        [HttpPost]
        public async Task<DataSet> FuentesFinanciamientoSegunFiltro(string lcFiltro) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FuentesFinanciamientoSegunFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        [HttpPost]
        public async Task<DataSet> TiposFinanciamientosTarifaSeleccionarPorPlan(int idFuenteFinanciamiento) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposFinanciamientosTarifaSeleccionarPorPlan", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@IdFuenteFinanciamiento", SqlDbType.Int).Value = idFuenteFinanciamiento;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public Task<DataSet> ListarTiposServiciosHosp()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposServicioSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);

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
        public async Task<DataSet> TipoFormatoSIS()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("SIGH_SIS..TipoFormatoSIS", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> TiposReferenciaSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposReferenciaSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaCausaExternaMorbilidadSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaCausaExternaMorbilidadSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaLugarEventoSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaLugarEventoSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaTipoEventoSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaTipoEventoSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaRelacionAgresorVictimaSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaRelacionAgresorVictimaSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaSeguridadSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaSeguridadSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaClaseAccidenteSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaClaseAccidenteSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaTipoVehiculoSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaTipoVehiculoSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaTipoTransporteSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaTipoTransporteSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaUbicacionLesionadoSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaUbicacionLesionadoSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaGrupoOcupacionalALABSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaGrupoOcupacionalALABSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaPosicionLesionadoALABSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaPosicionLesionadoALABSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> EmergenciaTipoAgenteAGANSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmergenciaTipoAgenteAGANSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> ListarFormasLLegada()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListarFormasLLegada", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> ListarTipoAtencion_Derivacion()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListarTipoAtencion_Derivacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        public async Task<DataSet> DevuelveListaDeUsuariosDelSistema()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("DevuelveListaDeUsuariosDelSistema", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }


        public async Task<DataSet> ListarTiposParentesco()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("usp_TipoCondicionLaboral_20220107", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        // JDELGADO010
        public Task<DataSet> ListarDepartamentosHospital()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DepartamentosHospitalSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo(string codigo, string nombre, int EsCpt)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@codigo", codigo ?? "");
                cmd.Parameters.AddWithValue("@nombre", nombre ?? "");
                cmd.Parameters.AddWithValue("@EsCpt", EsCpt);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> SuSaludUpsSeleccionarTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("SuSalud_upsSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> ListarTiposModuloAtencion()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarTiposModuloAtencion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> SisFuaUPServiciosSeleccionarTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexionExterna())
            using (SqlCommand cmd = new SqlCommand("SisFuaUPServiciosSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> UPServiciosSeleccionarTodosV2()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("UPServiciosSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> RenaesUPServiciosSeleccionarTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("RenaesUPServiciosSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public Task<DataSet> ObtenerUsuarioLogeado(int idUsuario)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerUsuarioLogeado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public async Task<DataSet> FactCatalogoServiciosSubGrupo()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FactCatalogoServiciosSubGrupo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }
        
        public Task<DataSet> ListarExamenesImagenologiaByPtoCarga(int IdCuentaAtencion, int IdPuntoCarga)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarExamenesImagenologiaByPtoCarga";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@IdPuntoCarga", IdPuntoCarga);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });

        }
    }
}
