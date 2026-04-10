using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NPOI.SS.Formula.Functions;
using WebAppMaternidad.CapaEntidades;
using WebAppSaludOcupacional.CapaEntidades;

namespace CapaDatos
{
    public class DalAtenciones
    {

        ////////////////////////////// REFACTOR /////////////////////////////////////
        /// 
        /// 
        /// 
        public async Task<DataSet> AtenInteListarPlanIntegralDesarrolloPaciente(AtenIntePlanIntePaciente obj)
        {
            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("AtenInteListarPlanIntegralDesarrolloPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
;
                cmd.Parameters.Add("@IdAtenInteGrupo", SqlDbType.Int).Value = obj.idAtenInteGrupo;
                cmd.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = obj.idPaciente;
                cmd.Parameters.Add("@IdAtenInteItemPlan", SqlDbType.Int).Value = obj.idAtenInteItemPlan;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }























        public Task<DataSet> ListaParteDiario(int idprogramacion)
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
                            string sql = "web_LitaParteDarioCompleto";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idprogramacion", SqlDbType.Int).Value = idprogramacion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_LitaParteDarioCompleto");
                //cmd.Parameters.AddWithValue("@idprogramacion", idprogramacion);

                ////dr = cmd.ExecuteReader ();

                //SqlDataAdapter da = new SqlDataAdapter(cmd);

                //da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            // finally
            // {
            //     cmd.Connection.Close();
            // }
            //// return ds;
        }
        public Task<DataSet> ListaAtencionByIdCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaAtencionByIdCuentaAtencionV2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> getDatosAtencion(int idCuentaAtencion,int idAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_getDatosAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> BuscarAtencionParaTriajeNuevo(int idCuentaAtencion,string NumeroDocumento,string ApellidoPaterno,string ApellidoMaterno,string Nombres)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BuscarAtencionParaTriajeNuevo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int)
							.Value = idCuentaAtencion > 0 ? (object)idCuentaAtencion : DBNull.Value;
							
						da.SelectCommand.Parameters.Add("@NumeroDocumento", SqlDbType.VarChar, 15)
							.Value = string.IsNullOrEmpty(NumeroDocumento) ? (object)DBNull.Value : NumeroDocumento;

						da.SelectCommand.Parameters.Add("@ApellidoPaterno", SqlDbType.VarChar, 100)
							.Value = string.IsNullOrEmpty(ApellidoPaterno) ? (object)DBNull.Value : ApellidoPaterno;

						da.SelectCommand.Parameters.Add("@ApellidoMaterno", SqlDbType.VarChar, 100)
							.Value = string.IsNullOrEmpty(ApellidoMaterno) ? (object)DBNull.Value : ApellidoMaterno;

						da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar, 200)
							.Value = string.IsNullOrEmpty(Nombres) ? (object)DBNull.Value : Nombres;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaAtencionPorCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "atencionesSelecionarPorCuenta";
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

        public Task<DataSet> ListaCitasCE(string fecha, int idServicio, int idUsuairo, int programacion)
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
                            string sql = "web_ListaAtencionesCEV4";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@fechaAtencion", SqlDbType.VarChar).Value = fecha;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuairo;
                            da.SelectCommand.Parameters.Add("@idProgramacion", SqlDbType.Int).Value = programacion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                ////cmd = MetodoDatos.CrearComando("web_ListaAtencionesCE2");
                //cmd = MetodoDatos.CrearComando("web_ListaAtencionesCEV3");
                //cmd.Parameters.AddWithValue("@fechaAtencion", fecha);
                //cmd.Parameters.AddWithValue("@idServicio", idServicio);
                //cmd.Parameters.AddWithValue("@idUsuario", idUsuairo);
                //cmd.Parameters.AddWithValue("@idProgramacion", programacion);
                ////dr = cmd.ExecuteReader ();

                //SqlDataAdapter da = new SqlDataAdapter(cmd);

                //da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ListaEpisodiosByAtencion(int idpaciente)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesEpisodiosDetalleSeleccionarXpaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idpaciente;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataTable> ListaIdMedicoByUsuario(int idUsuario)
        {
            DataTable ds = new DataTable();
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
                            string sql = "ListaIdMedicoByUsuario";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("ListaIdMedicoByUsuario");
                //cmd.Parameters.AddWithValue("@idUsuario", idUsuario);

                ////dr = cmd.ExecuteReader ();

                //SqlDataAdapter da = new SqlDataAdapter(cmd);

                //da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (var newConnection = cx.obtenerConexion())
                using (var mySQLAdapter = new SqlDataAdapter("TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno", newConnection))
                {
                    mySQLAdapter.SelectCommand.CommandType = CommandType.Text;

                    //if (parameters != null) mySQLAdapter.SelectCommand.Parameters.AddRange(parameters);

                    DataSet myDataSet = new DataSet();
                    mySQLAdapter.Fill(myDataSet);
                    return myDataSet;
                }
            });

        }
        public Task<Boolean> RegitraModifcaEpisodio(int numeroEpisodio, int idPaciente, int epiNuevo, int epiCierre, int idAtencion, int idUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_Episodio";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@numeroEpisodio", SqlDbType.Int).Value = numeroEpisodio;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;
                            da.SelectCommand.Parameters.Add("@epiNuevo", SqlDbType.Int).Value = epiNuevo;
                            da.SelectCommand.Parameters.Add("@epiCierre", SqlDbType.Int).Value = epiCierre;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_Episodio");
                //cmd.Parameters.AddWithValue("@numeroEpisodio", numeroEpisodio);
                //cmd.Parameters.AddWithValue("@idPaciente", idPaciente);
                //cmd.Parameters.AddWithValue("@epiNuevo", epiNuevo);
                //cmd.Parameters.AddWithValue("@epiCierre", epiCierre);
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                //cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        /////////////CONVERTIDO A METODOA ASYNC - KHOYOS/////////////////////
        public Task<Boolean> ModificarAtencionCE(Atencion atenciones, List<Diagnosticos> dsDiagnosticos, int clasificacionDiagnostico, AtencionesDatosAdicionales objDatosAdicionales, Atencion objAtencion)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            try
            {
                string xmlDiagnosticos;
                xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);

                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_ModificaAtencionCE2";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = atenciones.idAtencion;
                            da.SelectCommand.Parameters.Add("@idEstadoAtencion", SqlDbType.Int).Value = atenciones.idEstadoAtencion;
                            da.SelectCommand.Parameters.Add("@fechaEgreso", SqlDbType.VarChar).Value = atenciones.fechaEgreso;
                            da.SelectCommand.Parameters.Add("@idDestinoAtencion", SqlDbType.Int).Value = atenciones.idDestinoAtencion;
                            da.SelectCommand.Parameters.Add("@idTipoServicioAtencion", SqlDbType.Int).Value = atenciones.idTipoServicioAtencion;
                            da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = atenciones.idUsuario;
                            da.SelectCommand.Parameters.Add("@diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                            da.SelectCommand.Parameters.Add("@clasificacionDiagnostico", SqlDbType.Int).Value = clasificacionDiagnostico;
                            da.SelectCommand.Parameters.Add("@condicionEstablecimiento", SqlDbType.Int).Value = atenciones.condicionEstablecimiento;
                            da.SelectCommand.Parameters.Add("@condicionservicio", SqlDbType.Int).Value = atenciones.condicionservicio;

                            da.SelectCommand.Parameters.Add("@ProximaCita", SqlDbType.Date).Value = objDatosAdicionales.ProximaCita;
                            da.SelectCommand.Parameters.Add("@idTipoConsultaProxCita", SqlDbType.Int).Value = objDatosAdicionales.idTipoConsultaProxCita;

                            da.SelectCommand.Parameters.Add("@Tratamiento", SqlDbType.VarChar).Value = objDatosAdicionales.Tratamiento;
                            da.SelectCommand.Parameters.Add("@PlanTrabajo", SqlDbType.VarChar).Value = objDatosAdicionales.PlanTrabajo;

                            da.SelectCommand.Parameters.Add("@apetito", SqlDbType.VarChar).Value = objDatosAdicionales.Apetito;
                            da.SelectCommand.Parameters.Add("@orina", SqlDbType.VarChar).Value = objDatosAdicionales.Orina;
                            da.SelectCommand.Parameters.Add("@sed", SqlDbType.VarChar).Value = objDatosAdicionales.Sed;
                            da.SelectCommand.Parameters.Add("@suenio", SqlDbType.VarChar).Value = objDatosAdicionales.Suenio;
                            da.SelectCommand.Parameters.Add("@deposiciones", SqlDbType.VarChar).Value = objDatosAdicionales.Deposiciones;

                            da.SelectCommand.Parameters.Add("@enfermedadActual", SqlDbType.Text).Value = objDatosAdicionales.enfermedadActual;
                            da.SelectCommand.Parameters.Add("@tiempoEnfermedad", SqlDbType.Text).Value = objDatosAdicionales.tiempoEnfermedad;
                            da.SelectCommand.Parameters.Add("@HoraInicioAtencion", SqlDbType.Char).Value = objAtencion.HoraInicioAtencion;

                            da.SelectCommand.Parameters.Add("@idTipoAtencionAdolescencia", SqlDbType.Int).Value = objAtencion.idTipoAtencionAdolescencia ?? Convert.DBNull;
                            da.SelectCommand.Parameters.Add("@idTipoAtencionAnestesio", SqlDbType.Int).Value = objAtencion.idTipoAtencionAnestesio ?? Convert.DBNull;

                            da.SelectCommand.Parameters.Add("@TipoTeleconsulta", SqlDbType.Int).Value = objDatosAdicionales.TipoTeleconsulta ?? Convert.DBNull;
                            da.SelectCommand.Parameters.Add("@ClasificacionTipoAtencion", SqlDbType.Int).Value = objDatosAdicionales.ClasificacionTipoAtencion ?? Convert.DBNull;
                            da.SelectCommand.Parameters.Add("@Recomendaciones", SqlDbType.VarChar).Value = objDatosAdicionales.Recomendaciones ?? Convert.DBNull;
                            da.SelectCommand.Parameters.Add("@PacienteCronico", SqlDbType.VarChar).Value = atenciones.esPacienteCronico ;


                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_ModificaAtencionCE2");
                //cmd.Parameters.AddWithValue("@idAtencion", atenciones.idAtencion);
                //cmd.Parameters.AddWithValue("@idEstadoAtencion", atenciones.idEstadoAtencion);
                //cmd.Parameters.AddWithValue("@fechaEgreso", atenciones.fechaEgreso);
                //cmd.Parameters.AddWithValue("@idDestinoAtencion", atenciones.idDestinoAtencion);
                //cmd.Parameters.AddWithValue("@idTipoServicioAtencion", atenciones.idTipoServicioAtencion);
                //cmd.Parameters.AddWithValue("@idUsuario", atenciones.idUsuario);
                //cmd.Parameters.AddWithValue("@diagnosticos", xmlDiagnosticos);
                //cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                //cmd.Parameters.AddWithValue("@condicionEstablecimiento", atenciones.condicionEstablecimiento);
                //cmd.Parameters.AddWithValue("@condicionservicio", atenciones.condicionservicio);

                //cmd.Parameters.AddWithValue("@ProximaCita", objDatosAdicionales.ProximaCita);
                //cmd.Parameters.AddWithValue("@idTipoConsultaProxCita", objDatosAdicionales.idTipoConsultaProxCita);

                //cmd.Parameters.AddWithValue("@Tratamiento", objDatosAdicionales.Tratamiento);
                //cmd.Parameters.AddWithValue("@PlanTrabajo", objDatosAdicionales.PlanTrabajo);

                //cmd.Parameters.AddWithValue("@apetito", objDatosAdicionales.Apetito);
                //cmd.Parameters.AddWithValue("@orina", objDatosAdicionales.Orina);
                //cmd.Parameters.AddWithValue("@sed", objDatosAdicionales.Sed);
                //cmd.Parameters.AddWithValue("@suenio", objDatosAdicionales.Suenio);
                //cmd.Parameters.AddWithValue("@deposiciones", objDatosAdicionales.Deposiciones);

                //cmd.Parameters.AddWithValue("@enfermedadActual", objDatosAdicionales.enfermedadActual);
                //cmd.Parameters.AddWithValue("@tiempoEnfermedad", objDatosAdicionales.tiempoEnfermedad);
                //cmd.Parameters.AddWithValue("@HoraInicioAtencion", objAtencion.HoraInicioAtencion);
                //cmd.Parameters.AddWithValue("@idTipoAtencionAdolescencia", objAtencion.idTipoAtencionAdolescencia ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@idTipoAtencionAnestesio", objAtencion.idTipoAtencionAnestesio ?? Convert.DBNull);
                ////cmd.ExecuteNonQuery();        //COMENTADO POR KHOYOSI
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}

            //return nRpta;
        }

        //TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno


        public Task<DataSet> AtencionesDiagnosticosSeleccionarPorAtencion(int idAtencion, int clasifiacionDiagnostico) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
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


        public Task<DataSet> AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(int idAtencion, int clasifiacionDiagnostico, int idServicio, int idNumero) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
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

        public Task<DataSet> SeleccionarComentarioApreciacionUCIByIdAtencionAndIdComentario(int IdAtencion, int IdComentarioApreciacion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SeleccionarComentarioApreciacionUCIByIdAtencionAndIdComentario";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = IdAtencion;
                        da.SelectCommand.Parameters.Add("@IdComentarioApreciacion", SqlDbType.Int).Value = IdComentarioApreciacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposClasificacionPaciente()
        {


            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarClasficadoresPaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        // da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarCptConsejeriaObstetrica()
        {


            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarCptConsejeriaObstetrica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        // da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarCptConsejeriaOncologica()
        {


            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarCptConsejeriaOncologica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        // da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<Boolean> InsertarEntrevistaPacienteCE(int TipoClasificacion, int IdCuentaAtencion, int nroHistoria, int Idpaciente, int NroControles, int EdadGestacional, int NroGestas, int IdUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "InsertarEntrevistaPacienteCE";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@TipoClasificacion", SqlDbType.Int).Value = TipoClasificacion;
                            da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@nroHistoria", SqlDbType.Int).Value = nroHistoria;
                            da.SelectCommand.Parameters.Add("@Idpaciente", SqlDbType.Int).Value = Idpaciente;
                            da.SelectCommand.Parameters.Add("@NroControles", SqlDbType.Int).Value = NroControles;
                            da.SelectCommand.Parameters.Add("@EdadGestacional", SqlDbType.Int).Value = EdadGestacional;
                            da.SelectCommand.Parameters.Add("@NroGestas", SqlDbType.Int).Value = NroGestas;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("InsertarEntrevistaPacienteCE");
                //cmd.Parameters.AddWithValue("@TipoClasificacion", TipoClasificacion);
                //cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                //cmd.Parameters.AddWithValue("@nroHistoria", nroHistoria);
                //cmd.Parameters.AddWithValue("@Idpaciente", Idpaciente);
                //cmd.Parameters.AddWithValue("@NroControles", NroControles);
                //cmd.Parameters.AddWithValue("@EdadGestacional", EdadGestacional);
                //cmd.Parameters.AddWithValue("@NroGestas", NroGestas);
                //cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> CondicionEstablecimiento(int idNroCuenta, int idServicio)
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
                            string sql = "Web_DevuelveCondicionxNroCuentaByServicio";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idNroCuenta", SqlDbType.Int).Value = idNroCuenta;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("Web_DevuelveCondicionxNroCuentaByServicio");
                //cmd.Parameters.AddWithValue("@idNroCuenta", idNroCuenta);
                //cmd.Parameters.AddWithValue("@idServicio", idServicio);
                //SqlDataAdapter da = new SqlDataAdapter(cmd);

                //da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<Boolean> InsertaDatosAUXCE(int idAtencion, int nroHistoria, int Idpaciente, int IdUsuario, string antecedQuirurgico, string antecedPatologico, string antecedObstetrico, string antecedAlergico, string antecedFamiliar, string antecedentes,  Triaje obdtriaje)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertarDatosUXCE";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@nroHistoria", SqlDbType.Int).Value = nroHistoria;
                            da.SelectCommand.Parameters.Add("@Idpaciente", SqlDbType.Int).Value = Idpaciente;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;
                            da.SelectCommand.Parameters.Add("@antecedQuirurgico", SqlDbType.VarChar).Value = (antecedQuirurgico == null) ? "" : antecedQuirurgico;
                            da.SelectCommand.Parameters.Add("@antecedPatologico", SqlDbType.VarChar).Value = (antecedPatologico == null) ? "" : antecedPatologico;
                            da.SelectCommand.Parameters.Add("@antecedObstetrico", SqlDbType.VarChar).Value = (antecedObstetrico == null) ? "" : antecedObstetrico;
                            da.SelectCommand.Parameters.Add("@antecedAlergico", SqlDbType.VarChar).Value = (antecedAlergico == null) ? "" : antecedAlergico;
                            da.SelectCommand.Parameters.Add("@antecedFamiliar", SqlDbType.VarChar).Value = (antecedFamiliar == null) ? "" : antecedFamiliar;
                            da.SelectCommand.Parameters.Add("@antecedentes", SqlDbType.VarChar).Value = (antecedentes == null) ? "" : antecedentes;
                            da.SelectCommand.Parameters.Add("@citaMotivo", SqlDbType.VarChar).Value = (obdtriaje.CitaMotivo == null) ? "" : obdtriaje.CitaMotivo;
                            da.SelectCommand.Parameters.Add("@citaExamenClinico", SqlDbType.VarChar).Value = (obdtriaje.CitaExamenClinico == null) ? "" : obdtriaje.CitaExamenClinico;
                            da.SelectCommand.Parameters.Add("@citaAntecedente", SqlDbType.VarChar).Value = (obdtriaje.CitaAntecedente == null) ? "" : obdtriaje.CitaAntecedente;
                            da.SelectCommand.Parameters.Add("@citaObservaciones", SqlDbType.VarChar).Value = (obdtriaje.CitaObservaciones == null) ? "" : obdtriaje.CitaObservaciones;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_InsertarDatosUXCE");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                //cmd.Parameters.AddWithValue("@nroHistoria", nroHistoria);
                //cmd.Parameters.AddWithValue("@Idpaciente", Idpaciente);
                //cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                //cmd.Parameters.AddWithValue("@antecedQuirurgico", (antecedQuirurgico == null) ? "" : antecedQuirurgico);
                //cmd.Parameters.AddWithValue("@antecedPatologico", (antecedPatologico == null) ? "" : antecedPatologico);
                //cmd.Parameters.AddWithValue("@antecedObstetrico", (antecedObstetrico == null) ? "" : antecedObstetrico);
                //cmd.Parameters.AddWithValue("@antecedAlergico", (antecedAlergico == null) ? "" : antecedAlergico);
                //cmd.Parameters.AddWithValue("@antecedFamiliar", (antecedFamiliar == null) ? "" : antecedFamiliar);
                //cmd.Parameters.AddWithValue("@antecedentes", (antecedentes == null) ? "" : antecedentes);

                //cmd.Parameters.AddWithValue("@citaMotivo", (obdtriaje.CitaMotivo == null) ? "" : obdtriaje.CitaMotivo);
                //cmd.Parameters.AddWithValue("@citaExamenClinico", (obdtriaje.CitaExamenClinico == null) ? "" : obdtriaje.CitaExamenClinico);
                //cmd.Parameters.AddWithValue("@citaAntecedente", (obdtriaje.CitaAntecedente == null) ? "" : obdtriaje.CitaAntecedente);
                //cmd.Parameters.AddWithValue("@citaObservaciones", (obdtriaje.CitaObservaciones == null) ? "" : obdtriaje.CitaObservaciones);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }


        public Task<DataSet> MovimientosFarmaciaPorIdPaciente(int idPaciente, int orden)
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
                            string sql = "web_farmMovimientoVentasDetalleXidPaciente";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;
                            da.SelectCommand.Parameters.Add("@OrderByDocumentoNumero", SqlDbType.Int).Value = orden;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_ListaAtencionesByIdPaciente");
                //cmd.Parameters.AddWithValue("@idPaciente", idPaciente);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }


        public Task<DataSet> AtencionesXidPaciente(int idPaciente)
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
                            string sql = "web_ListaAtencionesByIdPaciente";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_ListaAtencionesByIdPaciente");
                //cmd.Parameters.AddWithValue("@idPaciente", idPaciente);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> AtencionesDiagnosticosSeleccionarXidAtencion(int idAtencion)
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
                            string sql = "Web_AtencionesDiagnosticosSeleccionarXidAtencion";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@ml_idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("Web_AtencionesDiagnosticosSeleccionarXidAtencion");
                //cmd.Parameters.AddWithValue("@ml_idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }


        #region INFECCIONES MATERNAS
        ///////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> InfeccionesMaternasSeleccionar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InfeccionesMaternasSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> InfeccionesMaternasGuardar(InfeccionMaterna infeccion, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InfeccionesMaternasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = infeccion.idPaciente;
                        da.SelectCommand.Parameters.Add("@IdProCabecera", SqlDbType.Int).Value = infeccion.idProCabecera;
                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = infeccion.IdAtencion;
                        da.SelectCommand.Parameters.Add("@TbcActiva", SqlDbType.Int).Value = infeccion.TbcActiva;
                        da.SelectCommand.Parameters.Add("@Lues", SqlDbType.Int).Value = infeccion.Lues;
                        da.SelectCommand.Parameters.Add("@Torch", SqlDbType.Int).Value = infeccion.Torch;
                        da.SelectCommand.Parameters.Add("@ItuIIITrim", SqlDbType.Int).Value = infeccion.ItuIIITrim;
                        da.SelectCommand.Parameters.Add("@Urocultivo", SqlDbType.Int).Value = infeccion.Urocultivo;
                        da.SelectCommand.Parameters.Add("@Germen", SqlDbType.Int).Value = infeccion.Germen;
                        da.SelectCommand.Parameters.Add("@Covid", SqlDbType.Int).Value = infeccion.Covid;
                        da.SelectCommand.Parameters.Add("@Dengue", SqlDbType.Int).Value = infeccion.Dengue;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = infeccion.OtrosInfecciones;
                        da.SelectCommand.Parameters.Add("@TbcActivaDescripcion", SqlDbType.VarChar).Value = infeccion.TbcActivaDescripcion;
                        da.SelectCommand.Parameters.Add("@LuesDescripcion", SqlDbType.VarChar).Value = infeccion.LuesDescripcion;
                        da.SelectCommand.Parameters.Add("@TorchDescripcion", SqlDbType.VarChar).Value = infeccion.TorchDescripcion;
                        da.SelectCommand.Parameters.Add("@ItuIIITrimDescripcion", SqlDbType.VarChar).Value = infeccion.ItuIIITrimDescripcion;
                        da.SelectCommand.Parameters.Add("@UrocultivoDescripcion", SqlDbType.VarChar).Value = infeccion.UrocultivoDescripcion;
                        da.SelectCommand.Parameters.Add("@GermenDescripcion", SqlDbType.VarChar).Value = infeccion.GermenDescripcion;
                        da.SelectCommand.Parameters.Add("@CovidDescripcion", SqlDbType.VarChar).Value = infeccion.CovidDescripcion;
                        da.SelectCommand.Parameters.Add("@DengueDescripcion", SqlDbType.VarChar).Value = infeccion.DengueDescripcion;
                        da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.VarChar).Value = infeccion.OtrosInfeccionesDescripcion;
                        
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        #endregion


        #region ENFERMEDADES MATERNAS
        ///////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> EnfermedadesMaternasSeleccionar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EnfermedadesMaternasSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EnfermedadesMaternasGuardar(EnfermedadMaterna enfermedad, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EnfermedadesMaternasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = enfermedad.idPaciente;                        
                        da.SelectCommand.Parameters.Add("@IdProCabecera", SqlDbType.Int).Value = enfermedad.idProCabecera;
                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = enfermedad.IdAtencion;
                        da.SelectCommand.Parameters.Add("@PreEclampsia", SqlDbType.Int).Value = enfermedad.PreEclampsia;
                        da.SelectCommand.Parameters.Add("@Eclampsia", SqlDbType.Int).Value = enfermedad.Eclampsia;
                        da.SelectCommand.Parameters.Add("@Htt", SqlDbType.Int).Value = enfermedad.Htt;
                        da.SelectCommand.Parameters.Add("@Desnutricion", SqlDbType.Int).Value = enfermedad.Desnutricion;
                        da.SelectCommand.Parameters.Add("@DiabetesMellitus", SqlDbType.Int).Value = enfermedad.DiabetesMellitus;
                        da.SelectCommand.Parameters.Add("@HepatitisB", SqlDbType.Int).Value = enfermedad.HepatitisB;
                        da.SelectCommand.Parameters.Add("@Anemia", SqlDbType.Int).Value = enfermedad.Anemia;
                        da.SelectCommand.Parameters.Add("@HipoHipertiroides", SqlDbType.Int).Value = enfermedad.HipoHipertiroides;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = enfermedad.OtrosEnfermedades;
                        da.SelectCommand.Parameters.Add("@PreEclampsiaDescripcion", SqlDbType.VarChar).Value = enfermedad.PreEclampsiaDescripcion;
                        da.SelectCommand.Parameters.Add("@EclampsiaDescripcion", SqlDbType.VarChar).Value = enfermedad.EclampsiaDescripcion;
                        da.SelectCommand.Parameters.Add("@HttDescripcion", SqlDbType.VarChar).Value = enfermedad.HttDescripcion;
                        da.SelectCommand.Parameters.Add("@DesnutricionDescripcion", SqlDbType.VarChar).Value = enfermedad.DesnutricionDescripcion;
                        da.SelectCommand.Parameters.Add("@DiabetesMellitusDescripcion", SqlDbType.VarChar).Value = enfermedad.DiabetesMellitusDescripcion;
                        da.SelectCommand.Parameters.Add("@HepatitisBDescripcion", SqlDbType.VarChar).Value = enfermedad.HepatitisBDescripcion;
                        da.SelectCommand.Parameters.Add("@AnemiaDescripcion", SqlDbType.VarChar).Value = enfermedad.AnemiaDescripcion;
                        da.SelectCommand.Parameters.Add("@HipoHipertiroidesDescripcion", SqlDbType.VarChar).Value = enfermedad.HipoHipertiroidesDescripcion;
                        da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.VarChar).Value = enfermedad.OtrosEnfermedadesDescripcion;
                        
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        #endregion

        public Task<DataSet> PacientesAntecedentesObstetricos(AntecedentesObstetricos objAntecedentesObstetricos, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesAntecedentesObstetricosGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", objAntecedentesObstetricos.idPaciente);
                        //da.SelectCommand.Parameters.Add("@idPrograma", objAntecedentesObstetricos.idPrograma);
                        da.SelectCommand.Parameters.AddWithValue("@IdProCabecera", objAntecedentesObstetricos.idProCabecera);
                        da.SelectCommand.Parameters.AddWithValue("@Gestas", objAntecedentesObstetricos.Gestas);
                        da.SelectCommand.Parameters.AddWithValue("@abortos", objAntecedentesObstetricos.abortos);
                        da.SelectCommand.Parameters.AddWithValue("@Vaginales", objAntecedentesObstetricos.Vaginales);
                        da.SelectCommand.Parameters.AddWithValue("@NacidosVivos", objAntecedentesObstetricos.NacidosVivos);
                        da.SelectCommand.Parameters.AddWithValue("@Viven", objAntecedentesObstetricos.Viven);
                        da.SelectCommand.Parameters.AddWithValue("@Partos", objAntecedentesObstetricos.Partos);
                        da.SelectCommand.Parameters.AddWithValue("@Cesareas", objAntecedentesObstetricos.Cesareas);
                        da.SelectCommand.Parameters.AddWithValue("@NacidosMuertos", objAntecedentesObstetricos.NacidosMuertos);
                        da.SelectCommand.Parameters.AddWithValue("@Muerto1Seman", objAntecedentesObstetricos.Muerto1Seman);
                        da.SelectCommand.Parameters.AddWithValue("@Despues1Seman", objAntecedentesObstetricos.Despues1Seman);
                        da.SelectCommand.Parameters.AddWithValue("@menor2500gr", objAntecedentesObstetricos.menor2500gr);
                        da.SelectCommand.Parameters.AddWithValue("@Multiple", objAntecedentesObstetricos.Multiple);
                        da.SelectCommand.Parameters.AddWithValue("@memor37sm", objAntecedentesObstetricos.memor37sm);
                        da.SelectCommand.Parameters.AddWithValue("@mayor4000g", objAntecedentesObstetricos.mayor4000g);
                        da.SelectCommand.Parameters.AddWithValue("@PesoPregestacional", objAntecedentesObstetricos.PesoPregestacional);
                        da.SelectCommand.Parameters.AddWithValue("@FechaFinEmbarazoAnt", objAntecedentesObstetricos.FechaFinEmbarazoAnt);
                        da.SelectCommand.Parameters.AddWithValue("@idTerminacion", objAntecedentesObstetricos.idTerminacion);
                        da.SelectCommand.Parameters.AddWithValue("@idAborto", objAntecedentesObstetricos.idAborto);
                        da.SelectCommand.Parameters.AddWithValue("@FracasoMetodo", objAntecedentesObstetricos.FracasoMetodo);
                        da.SelectCommand.Parameters.AddWithValue("@EmbarazoPlaneado", objAntecedentesObstetricos.EmbarazoPlaneado);
                        da.SelectCommand.Parameters.AddWithValue("@EmbarazoEctopico", objAntecedentesObstetricos.EmbarazoEctopico);                        
                        da.SelectCommand.Parameters.AddWithValue("@P1", objAntecedentesObstetricos.P1);
                        da.SelectCommand.Parameters.AddWithValue("@P2", objAntecedentesObstetricos.P2);
                        da.SelectCommand.Parameters.AddWithValue("@P3", objAntecedentesObstetricos.P3);
                        da.SelectCommand.Parameters.AddWithValue("@P4", objAntecedentesObstetricos.P4);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> InsertaAntecedentesObstetricos(AntecedentesObstetricos objAntecedentesObstetricos)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_AntecedentesObstetricos";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPrograma", SqlDbType.Int).Value = objAntecedentesObstetricos.idPrograma;
                            da.SelectCommand.Parameters.Add("@idProCabecera", SqlDbType.Int).Value = objAntecedentesObstetricos.idProCabecera;
                            da.SelectCommand.Parameters.Add("@Gestas", SqlDbType.Int).Value = objAntecedentesObstetricos.Gestas;
                            da.SelectCommand.Parameters.Add("@abortos", SqlDbType.Int).Value = objAntecedentesObstetricos.abortos;
                            da.SelectCommand.Parameters.Add("@Vaginales", SqlDbType.Int).Value = objAntecedentesObstetricos.Vaginales;
                            da.SelectCommand.Parameters.Add("@NacidosVivos", SqlDbType.Int).Value = objAntecedentesObstetricos.NacidosVivos;
                            da.SelectCommand.Parameters.Add("@Viven", SqlDbType.Int).Value = objAntecedentesObstetricos.Viven;
                            da.SelectCommand.Parameters.Add("@Partos", SqlDbType.Int).Value = objAntecedentesObstetricos.Partos;
                            da.SelectCommand.Parameters.Add("@Cesareas", SqlDbType.Int).Value = objAntecedentesObstetricos.Cesareas;
                            da.SelectCommand.Parameters.Add("@NacidosMuertos", SqlDbType.Int).Value = objAntecedentesObstetricos.NacidosMuertos;
                            da.SelectCommand.Parameters.Add("@Muerto1Seman", SqlDbType.Int).Value = objAntecedentesObstetricos.Muerto1Seman;
                            da.SelectCommand.Parameters.Add("@Despues1Seman", SqlDbType.Int).Value = objAntecedentesObstetricos.Despues1Seman;
                            da.SelectCommand.Parameters.Add("@menor2500gr", SqlDbType.Bit).Value = objAntecedentesObstetricos.menor2500gr;
                            da.SelectCommand.Parameters.Add("@Multiple", SqlDbType.Bit).Value = objAntecedentesObstetricos.Multiple;
                            da.SelectCommand.Parameters.Add("@memor37sm", SqlDbType.Bit).Value = objAntecedentesObstetricos.memor37sm;
                            da.SelectCommand.Parameters.Add("@PesoPregestacional", SqlDbType.Decimal).Value = objAntecedentesObstetricos.PesoPregestacional;
                            da.SelectCommand.Parameters.Add("@FechaFinEmbarazoAnt", SqlDbType.Date).Value = objAntecedentesObstetricos.FechaFinEmbarazoAnt;
                            da.SelectCommand.Parameters.Add("@idTerminacion", SqlDbType.Int).Value = objAntecedentesObstetricos.idTerminacion;
                            da.SelectCommand.Parameters.Add("@idAborto", SqlDbType.Int).Value = objAntecedentesObstetricos.idAborto;
                            da.SelectCommand.Parameters.Add("@FracasoMetodo", SqlDbType.Int).Value = objAntecedentesObstetricos.FracasoMetodo;
                            da.SelectCommand.Parameters.Add("@EmbarazoPlaneado", SqlDbType.Int).Value = objAntecedentesObstetricos.EmbarazoPlaneado;
                            da.SelectCommand.Parameters.Add("@EmbarazoEctopico", SqlDbType.Bit).Value = objAntecedentesObstetricos.EmbarazoEctopico;
                            da.SelectCommand.Parameters.Add("@mayor4000g", SqlDbType.Bit).Value = objAntecedentesObstetricos.mayor4000g;
                            da.SelectCommand.Parameters.Add("@P1", SqlDbType.Int).Value = objAntecedentesObstetricos.P1;
                            da.SelectCommand.Parameters.Add("@P2", SqlDbType.Int).Value = objAntecedentesObstetricos.P2;
                            da.SelectCommand.Parameters.Add("@P3", SqlDbType.Int).Value = objAntecedentesObstetricos.P3;
                            da.SelectCommand.Parameters.Add("@P4", SqlDbType.Int).Value = objAntecedentesObstetricos.P4;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_AntecedentesObstetricos");
                ////cmd.Parameters.AddWithValue("@idAntecObstetricos", objAntecedentesObstetricos.idAntecObstetricos);
                //cmd.Parameters.AddWithValue("@idPrograma", objAntecedentesObstetricos.idPrograma);
                //cmd.Parameters.AddWithValue("@idProCabecera", objAntecedentesObstetricos.idProCabecera);
                //cmd.Parameters.AddWithValue("@Gestas", objAntecedentesObstetricos.Gestas);
                //cmd.Parameters.AddWithValue("@abortos", objAntecedentesObstetricos.abortos);
                //cmd.Parameters.AddWithValue("@Vaginales", objAntecedentesObstetricos.Vaginales);
                //cmd.Parameters.AddWithValue("@NacidosVivos", objAntecedentesObstetricos.NacidosVivos);
                //cmd.Parameters.AddWithValue("@Viven", objAntecedentesObstetricos.Viven);
                //cmd.Parameters.AddWithValue("@Partos", objAntecedentesObstetricos.Partos);
                //cmd.Parameters.AddWithValue("@Cesareas", objAntecedentesObstetricos.Cesareas);
                //cmd.Parameters.AddWithValue("@NacidosMuertos", objAntecedentesObstetricos.NacidosMuertos);
                //cmd.Parameters.AddWithValue("@Muerto1Seman", objAntecedentesObstetricos.Muerto1Seman);
                //cmd.Parameters.AddWithValue("@Despues1Seman", objAntecedentesObstetricos.Despues1Seman);
                //cmd.Parameters.AddWithValue("@menor2500gr", objAntecedentesObstetricos.menor2500gr);
                //cmd.Parameters.AddWithValue("@Multiple", objAntecedentesObstetricos.Multiple);
                //cmd.Parameters.AddWithValue("@memor37sm", objAntecedentesObstetricos.memor37sm);
                //cmd.Parameters.AddWithValue("@PesoPregestacional", objAntecedentesObstetricos.PesoPregestacional);
                //cmd.Parameters.AddWithValue("@FechaFinEmbarazoAnt", objAntecedentesObstetricos.FechaFinEmbarazoAnt);
                //cmd.Parameters.AddWithValue("@idTerminacion", objAntecedentesObstetricos.idTerminacion);
                //cmd.Parameters.AddWithValue("@idAborto", objAntecedentesObstetricos.idAborto);
                //cmd.Parameters.AddWithValue("@FracasoMetodo", objAntecedentesObstetricos.FracasoMetodo);
                //cmd.Parameters.AddWithValue("@EmbarazoPlaneado", objAntecedentesObstetricos.EmbarazoPlaneado);
                //cmd.Parameters.AddWithValue("@EmbarazoEctopico", objAntecedentesObstetricos.EmbarazoEctopico);
                //cmd.Parameters.AddWithValue("@mayor4000g", objAntecedentesObstetricos.mayor4000g);
                //cmd.Parameters.AddWithValue("@P1", objAntecedentesObstetricos.P1);
                //cmd.Parameters.AddWithValue("@P2", objAntecedentesObstetricos.P2);
                //cmd.Parameters.AddWithValue("@P3", objAntecedentesObstetricos.P3);
                //cmd.Parameters.AddWithValue("@P4", objAntecedentesObstetricos.P4);
                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> PacientesAntecedentesPersonales(AntecedentesPersonales objAntecedentesPersonales, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesAntecedentesPersonalesGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", objAntecedentesPersonales.idPaciente);
                        //da.SelectCommand.Parameters.AddWithValue("@idPrograma", objAntecedentesPersonales.idPrograma);
                        //da.SelectCommand.Parameters.AddWithValue("@idProCabecera", objAntecedentesPersonales.idProCabecera);
                        da.SelectCommand.Parameters.AddWithValue("@Tbc", objAntecedentesPersonales.Tbc);
                        da.SelectCommand.Parameters.AddWithValue("@TbcDescripcion", objAntecedentesPersonales.TbcDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Diabetes", objAntecedentesPersonales.Diabetes);
                        da.SelectCommand.Parameters.AddWithValue("@DiabetesDescripcion", objAntecedentesPersonales.DiabetesDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@PreeclampsiaEclampsia", objAntecedentesPersonales.PreeclampsiaEclampsia);
                        da.SelectCommand.Parameters.AddWithValue("@PreeclampsiaEclampsiaDescripcion", objAntecedentesPersonales.PreeclampsiaEclampsiaDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Vih", objAntecedentesPersonales.Vih);
                        da.SelectCommand.Parameters.AddWithValue("@vihDescripcion", objAntecedentesPersonales.vihDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Alergia", objAntecedentesPersonales.Alergia);
                        da.SelectCommand.Parameters.AddWithValue("@AlergiaDescripcion", objAntecedentesPersonales.AlergiaDescripcion);                        
                        da.SelectCommand.Parameters.AddWithValue("@CirugiaMayor", objAntecedentesPersonales.CirugiaMayor);
                        da.SelectCommand.Parameters.AddWithValue("@CirugiaMayorDescripcion", objAntecedentesPersonales.CirugiaMayorDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Violencia", objAntecedentesPersonales.Violencia);
                        da.SelectCommand.Parameters.AddWithValue("@ViolenciaDescripcion", objAntecedentesPersonales.ViolenciaDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Hipertencion", objAntecedentesPersonales.Hipertencion);
                        da.SelectCommand.Parameters.AddWithValue("@HipertencionDescripcion", objAntecedentesPersonales.HipertencionDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@VacunaPrevia", objAntecedentesPersonales.VacunaPrevia);
                        da.SelectCommand.Parameters.AddWithValue("@VacunaPreviaDescripcion", objAntecedentesPersonales.VacunaPreviaDescripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Otros", objAntecedentesPersonales.Otros);
                        da.SelectCommand.Parameters.AddWithValue("@OtrosDescripcion", objAntecedentesPersonales.OtrosDescripcion);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> InsertaAntecedentesPersonales(AntecedentesPersonales objAntecedentesPersonales)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_AntecedentesPersonales";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPrograma", SqlDbType.Int).Value = objAntecedentesPersonales.idPrograma;
                            da.SelectCommand.Parameters.Add("@idProCabecera", SqlDbType.Int).Value = objAntecedentesPersonales.idProCabecera;
                            da.SelectCommand.Parameters.Add("@Tbc", SqlDbType.Bit).Value = objAntecedentesPersonales.Tbc;
                            da.SelectCommand.Parameters.Add("@TbcDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.TbcDescripcion;
                            da.SelectCommand.Parameters.Add("@Diabetes", SqlDbType.Bit).Value = objAntecedentesPersonales.Diabetes;
                            da.SelectCommand.Parameters.Add("@DiabetesDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.DiabetesDescripcion;
                            da.SelectCommand.Parameters.Add("@PreeclampsiaEclampsia", SqlDbType.Bit).Value = objAntecedentesPersonales.PreeclampsiaEclampsia;
                            da.SelectCommand.Parameters.Add("@PreeclampsiaEclampsiaDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.PreeclampsiaEclampsiaDescripcion;
                            da.SelectCommand.Parameters.Add("@Vih", SqlDbType.Bit).Value = objAntecedentesPersonales.Vih;
                            da.SelectCommand.Parameters.Add("@vihDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.vihDescripcion;
                            da.SelectCommand.Parameters.Add("@Alergia", SqlDbType.Bit).Value = objAntecedentesPersonales.Alergia;
                            da.SelectCommand.Parameters.Add("@AlergiaDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.AlergiaDescripcion;
                            da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Bit).Value = objAntecedentesPersonales.Otros;
                            da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.OtrosDescripcion;
                            da.SelectCommand.Parameters.Add("@CirugiaMayor", SqlDbType.Bit).Value = objAntecedentesPersonales.CirugiaMayor;
                            da.SelectCommand.Parameters.Add("@CirugiaMayorDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.CirugiaMayorDescripcion;
                            da.SelectCommand.Parameters.Add("@Violencia", SqlDbType.Bit).Value = objAntecedentesPersonales.Violencia;
                            da.SelectCommand.Parameters.Add("@ViolenciaDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.ViolenciaDescripcion;
                            da.SelectCommand.Parameters.Add("@Hipertencion", SqlDbType.Bit).Value = objAntecedentesPersonales.Hipertencion;
                            da.SelectCommand.Parameters.Add("@HipertencionDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.HipertencionDescripcion;
                            da.SelectCommand.Parameters.Add("@VacunaPrevia", SqlDbType.Bit).Value = objAntecedentesPersonales.VacunaPrevia;
                            da.SelectCommand.Parameters.Add("@VacunaPreviaDescripcion", SqlDbType.Text).Value = objAntecedentesPersonales.VacunaPreviaDescripcion;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_AntecedentesPersonales");

                //cmd.Parameters.AddWithValue("@idPrograma", objAntecedentesPersonales.idPrograma);
                //cmd.Parameters.AddWithValue("@idProCabecera", objAntecedentesPersonales.idProCabecera);
                //cmd.Parameters.AddWithValue("@Tbc", objAntecedentesPersonales.Tbc);
                //cmd.Parameters.AddWithValue("@TbcDescripcion", objAntecedentesPersonales.TbcDescripcion);
                //cmd.Parameters.AddWithValue("@Diabetes", objAntecedentesPersonales.Diabetes);
                //cmd.Parameters.AddWithValue("@DiabetesDescripcion", objAntecedentesPersonales.DiabetesDescripcion);
                //cmd.Parameters.AddWithValue("@PreeclampsiaEclampsia", objAntecedentesPersonales.PreeclampsiaEclampsia);
                //cmd.Parameters.AddWithValue("@PreeclampsiaEclampsiaDescripcion", objAntecedentesPersonales.PreeclampsiaEclampsiaDescripcion);
                //cmd.Parameters.AddWithValue("@Vih", objAntecedentesPersonales.Vih);
                //cmd.Parameters.AddWithValue("@vihDescripcion", objAntecedentesPersonales.vihDescripcion);
                //cmd.Parameters.AddWithValue("@Alergia", objAntecedentesPersonales.Alergia);
                //cmd.Parameters.AddWithValue("@AlergiaDescripcion", objAntecedentesPersonales.AlergiaDescripcion);
                //cmd.Parameters.AddWithValue("@Otros", objAntecedentesPersonales.Otros);
                //cmd.Parameters.AddWithValue("@OtrosDescripcion", objAntecedentesPersonales.OtrosDescripcion);
                //cmd.Parameters.AddWithValue("@CirugiaMayor", objAntecedentesPersonales.CirugiaMayor);
                //cmd.Parameters.AddWithValue("@CirugiaMayorDescripcion", objAntecedentesPersonales.CirugiaMayorDescripcion);
                //cmd.Parameters.AddWithValue("@Violencia", objAntecedentesPersonales.Violencia);
                //cmd.Parameters.AddWithValue("@ViolenciaDescripcion", objAntecedentesPersonales.ViolenciaDescripcion);
                //cmd.Parameters.AddWithValue("@Hipertencion", objAntecedentesPersonales.Hipertencion);
                //cmd.Parameters.AddWithValue("@HipertencionDescripcion", objAntecedentesPersonales.HipertencionDescripcion);
                //cmd.Parameters.AddWithValue("@VacunaPrevia", objAntecedentesPersonales.VacunaPrevia);
                //cmd.Parameters.AddWithValue("@VacunaPreviaDescripcion", objAntecedentesPersonales.VacunaPreviaDescripcion);


                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> PacientesAntecedentesFamiliares(AntecedentesFamiliares objAntecedentesFamiliares, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesAntecedentesFamiliaresGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", objAntecedentesFamiliares.idPaciente);
                        //da.SelectCommand.Parameters.AddWithValue("@idProCabecera", (object)objAntecedentesFamiliares.idProCabecera ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Tbc", (object)objAntecedentesFamiliares.TbcFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@TbcDescripcion", (object)objAntecedentesFamiliares.TbcDescripcionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Diabetes", (object)objAntecedentesFamiliares.DiabetesFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@DiabetesDescripcion", (object)objAntecedentesFamiliares.DiabetesDescripcionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Hipertencion", (object)objAntecedentesFamiliares.HipertencionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@HipertencionDescripcion", (object)objAntecedentesFamiliares.HipertencionDescripcionFam ?? DBNull.Value);                        
                        da.SelectCommand.Parameters.AddWithValue("@PreeclampsiaEclampsia", (object)objAntecedentesFamiliares.PreeclampsiaEclampsiaFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PreeclampsiaEclampsiaDescripcion", (object)objAntecedentesFamiliares.PreeclampsiaEclampsiaDescripcionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Gemelares", (object)objAntecedentesFamiliares.GemelaresFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@GemelaresDescripcion", (object)objAntecedentesFamiliares.GemelaresDescripcionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Malformaciones", (object)objAntecedentesFamiliares.MalformacionesFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@MalformacionesDescripcion", (object)objAntecedentesFamiliares.MalformacionesDescripcionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@OtraCondMedGraveDescripcion", (object)objAntecedentesFamiliares.OtraCondMedGraveDescripcionFam ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@OtraCondMedGrave", (object)objAntecedentesFamiliares.OtraCondMedGraveFam ?? DBNull.Value);
                        

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<Boolean> InsertaAntecedentesFamiliares(AntecedentesFamiliares objAntecedentesFamiliares)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_AntecedentesFamiliares";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPrograma", SqlDbType.Int).Value = objAntecedentesFamiliares.idPrograma;
                            da.SelectCommand.Parameters.Add("@idProCabecera", SqlDbType.Int).Value = objAntecedentesFamiliares.idProCabecera;
                            da.SelectCommand.Parameters.Add("@Tbc", SqlDbType.Bit).Value = objAntecedentesFamiliares.TbcFam;
                            da.SelectCommand.Parameters.Add("@TbcDescripcion", SqlDbType.Text).Value = objAntecedentesFamiliares.TbcDescripcionFam;
                            da.SelectCommand.Parameters.Add("@Diabetes", SqlDbType.Bit).Value = objAntecedentesFamiliares.DiabetesFam;
                            da.SelectCommand.Parameters.Add("@DiabetesDescripcion", SqlDbType.Text).Value = objAntecedentesFamiliares.DiabetesDescripcionFam;
                            da.SelectCommand.Parameters.Add("@PreeclampsiaEclampsia", SqlDbType.Bit).Value = objAntecedentesFamiliares.PreeclampsiaEclampsiaFam;
                            da.SelectCommand.Parameters.Add("@PreeclampsiaEclampsiaDescripcion", SqlDbType.Text).Value = objAntecedentesFamiliares.PreeclampsiaEclampsiaDescripcionFam;
                            da.SelectCommand.Parameters.Add("@OtraCondMedGraveDescripcion", SqlDbType.Text).Value = objAntecedentesFamiliares.OtraCondMedGraveDescripcionFam;
                            da.SelectCommand.Parameters.Add("@OtraCondMedGrave", SqlDbType.Bit).Value = objAntecedentesFamiliares.OtraCondMedGraveFam;
                            da.SelectCommand.Parameters.Add("@Hipertencion", SqlDbType.Int).Value = objAntecedentesFamiliares.HipertencionFam;
                            da.SelectCommand.Parameters.Add("@HipertencionDescripcion", SqlDbType.Text).Value = objAntecedentesFamiliares.HipertencionDescripcionFam;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_AntecedentesFamiliares");
                //cmd.Parameters.AddWithValue("@idPrograma", objAntecedentesFamiliares.idPrograma);
                //cmd.Parameters.AddWithValue("@idProCabecera", objAntecedentesFamiliares.idProCabecera);
                //cmd.Parameters.AddWithValue("@Tbc", objAntecedentesFamiliares.TbcFam);
                //cmd.Parameters.AddWithValue("@TbcDescripcion", objAntecedentesFamiliares.TbcDescripcionFam);
                //cmd.Parameters.AddWithValue("@Diabetes", objAntecedentesFamiliares.DiabetesFam);
                //cmd.Parameters.AddWithValue("@DiabetesDescripcion", objAntecedentesFamiliares.DiabetesDescripcionFam);
                //cmd.Parameters.AddWithValue("@PreeclampsiaEclampsia", objAntecedentesFamiliares.PreeclampsiaEclampsiaFam);
                //cmd.Parameters.AddWithValue("@PreeclampsiaEclampsiaDescripcion", objAntecedentesFamiliares.PreeclampsiaEclampsiaDescripcionFam);
                //cmd.Parameters.AddWithValue("@OtraCondMedGraveDescripcion", objAntecedentesFamiliares.OtraCondMedGraveDescripcionFam);
                //cmd.Parameters.AddWithValue("@OtraCondMedGrave", objAntecedentesFamiliares.OtraCondMedGraveFam);
                //cmd.Parameters.AddWithValue("@Hipertencion", objAntecedentesFamiliares.HipertencionFam);
                //cmd.Parameters.AddWithValue("@HipertencionDescripcion", objAntecedentesFamiliares.HipertencionDescripcionFam);
                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        
        public Task<Boolean> InsertaEvaluacionEmergencia(EvaluacionEmergencia objEvaluacionEmergencia)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_EvaluacionEmergencia";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaluacionEmergencia.IdAtencion;
                            da.SelectCommand.Parameters.Add("@FechaUR", SqlDbType.VarChar).Value = objEvaluacionEmergencia.FechaUR;
                            da.SelectCommand.Parameters.Add("@FechaPP", SqlDbType.VarChar).Value = objEvaluacionEmergencia.FechaPP;
                            da.SelectCommand.Parameters.Add("@EdadGestacional", SqlDbType.Int).Value = objEvaluacionEmergencia.EdadGestacional;
                            da.SelectCommand.Parameters.Add("@Cnp", SqlDbType.Int).Value = objEvaluacionEmergencia.Cnp;
                            da.SelectCommand.Parameters.Add("@Dolor", SqlDbType.Int).Value = objEvaluacionEmergencia.Dolor;
                            da.SelectCommand.Parameters.Add("@Convulsiones", SqlDbType.Int).Value = objEvaluacionEmergencia.Convulsiones;
                            da.SelectCommand.Parameters.Add("@Fiebre", SqlDbType.Int).Value = objEvaluacionEmergencia.Fiebre;
                            da.SelectCommand.Parameters.Add("@Vomitos", SqlDbType.Int).Value = objEvaluacionEmergencia.Vomitos;
                            da.SelectCommand.Parameters.Add("@ContraccionesU", SqlDbType.Int).Value = objEvaluacionEmergencia.ContraccionesU;
                            da.SelectCommand.Parameters.Add("@SangradoV", SqlDbType.Int).Value = objEvaluacionEmergencia.SangradoV;
                            da.SelectCommand.Parameters.Add("@PerdidaLA", SqlDbType.Int).Value = objEvaluacionEmergencia.PerdidaLA;
                            da.SelectCommand.Parameters.Add("@AusenciaMF", SqlDbType.Int).Value = objEvaluacionEmergencia.AusenciaMF;
                            da.SelectCommand.Parameters.Add("@SintomasU", SqlDbType.Int).Value = objEvaluacionEmergencia.SintomasU;
                            da.SelectCommand.Parameters.Add("@FlujoV", SqlDbType.Int).Value = objEvaluacionEmergencia.FlujoV;
                            da.SelectCommand.Parameters.Add("@Tumoracion", SqlDbType.Int).Value = objEvaluacionEmergencia.Tumoracion;
                            da.SelectCommand.Parameters.Add("@AlteracionesM", SqlDbType.Int).Value = objEvaluacionEmergencia.AlteracionesM;
                            da.SelectCommand.Parameters.Add("@Antecedentes", SqlDbType.Text).Value = objEvaluacionEmergencia.Antecedentes;
                            da.SelectCommand.Parameters.Add("@EnfermedadA", SqlDbType.Text).Value = objEvaluacionEmergencia.EnfermedadA;

                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objEvaluacionEmergencia.IdUsuario;
                            da.SelectCommand.Parameters.Add("@IdUsuarioModifica", SqlDbType.Int).Value = objEvaluacionEmergencia.IdUsuarioModifica;
                            da.SelectCommand.Parameters.Add("@UltRegla", SqlDbType.Int).Value = objEvaluacionEmergencia.UltRegla;
                            da.SelectCommand.Parameters.Add("@FechaEco", SqlDbType.VarChar).Value = objEvaluacionEmergencia.FechaEco;
                            da.SelectCommand.Parameters.Add("@GMotiA", SqlDbType.Int).Value = objEvaluacionEmergencia.GMotiA;
                            da.SelectCommand.Parameters.Add("@PMotiA", SqlDbType.Int).Value = objEvaluacionEmergencia.PMotiA;
                            da.SelectCommand.Parameters.Add("@FechaEcoAct", SqlDbType.Int).Value = objEvaluacionEmergencia.FechaEcoAct;
                            da.SelectCommand.Parameters.Add("@DisMovFetales", SqlDbType.Int).Value = objEvaluacionEmergencia.DisMovFetales;
                            da.SelectCommand.Parameters.Add("@PesoFetalAnt", SqlDbType.VarChar).Value = objEvaluacionEmergencia.PesoFetalAnt;
                            da.SelectCommand.Parameters.Add("@Prioridad", SqlDbType.Int).Value = objEvaluacionEmergencia.Prioridad;
                            da.SelectCommand.Parameters.Add("@Glasgow", SqlDbType.Int).Value = objEvaluacionEmergencia.Glasgow;
                            da.SelectCommand.Parameters.Add("@ObservacionTriaje", SqlDbType.VarChar).Value = objEvaluacionEmergencia.ObservacionTriaje;
                            da.SelectCommand.Parameters.Add("@DiasGestacional", SqlDbType.Int).Value = objEvaluacionEmergencia.DiasGestacional;
                            da.SelectCommand.Parameters.Add("@CalculaFE", SqlDbType.Int).Value = objEvaluacionEmergencia.CalculaFE;
                            da.SelectCommand.Parameters.Add("@DiasGestacionalEco", SqlDbType.Int).Value = objEvaluacionEmergencia.DiasGestacionalEco;
                            da.SelectCommand.Parameters.Add("@SemanaGestacionalEco", SqlDbType.Int).Value = objEvaluacionEmergencia.SemanaGestacionalEco;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> EvaluacionObstetricaGuardar(EvaluacionObstetrica objEvaluacionObstetrica, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionObstetricaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", objEvaluacionObstetrica.IdAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@IdProCabecera", (object)objEvaluacionObstetrica.idProCabecera ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@FechaUR", (object)objEvaluacionObstetrica.FechaUR ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@FechaPP", (object)objEvaluacionObstetrica.FechaPP ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@FechaEco", (object)objEvaluacionObstetrica.FechaEco ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@EdadGestacional", (object)objEvaluacionObstetrica.EdadGestacional ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@DiasGestacional", objEvaluacionObstetrica.DiasGestacional);
                        da.SelectCommand.Parameters.AddWithValue("@Cnp", (object)objEvaluacionObstetrica.Cnp ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@CalculaFE", (object)objEvaluacionObstetrica.CalculaFE ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@FechaEcoAct", (object)objEvaluacionObstetrica.FechaEcoAct ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@SemanaGestacionalEco", (object)objEvaluacionObstetrica.SemanaGestacionalEco ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@DiasGestacionalEco", (object)objEvaluacionObstetrica.DiasGestacionalEco ?? DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> InsertaExamenGinecoObstetra(ExamenGinecoObstetra objExamenGinecoObstetra)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_ExamenGinecoObstetra";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objExamenGinecoObstetra.IdAtencion;
                            da.SelectCommand.Parameters.Add("@LGeBus", SqlDbType.Int).Value = objExamenGinecoObstetra.LGeBus;
                            da.SelectCommand.Parameters.Add("@LVagina", SqlDbType.Int).Value = objExamenGinecoObstetra.LVagina;
                            da.SelectCommand.Parameters.Add("@LCervix", SqlDbType.Int).Value = objExamenGinecoObstetra.LCervix;
                            da.SelectCommand.Parameters.Add("@LUtero", SqlDbType.Int).Value = objExamenGinecoObstetra.LUtero;
                            da.SelectCommand.Parameters.Add("@DGeBus", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DGeBus;
                            da.SelectCommand.Parameters.Add("@DVagina", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DVagina;
                            da.SelectCommand.Parameters.Add("@DCervix", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DCervix;
                            da.SelectCommand.Parameters.Add("@DUtero", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DUtero;
                            da.SelectCommand.Parameters.Add("@LAnexos", SqlDbType.Int).Value = objExamenGinecoObstetra.LAnexos;
                            da.SelectCommand.Parameters.Add("@LDouglas", SqlDbType.Int).Value = objExamenGinecoObstetra.LDouglas;
                            da.SelectCommand.Parameters.Add("@LParametros", SqlDbType.Int).Value = objExamenGinecoObstetra.LParametros;
                            da.SelectCommand.Parameters.Add("@LMamas", SqlDbType.Int).Value = objExamenGinecoObstetra.LMamas;
                            da.SelectCommand.Parameters.Add("@DAnexos", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DAnexos;
                            da.SelectCommand.Parameters.Add("@DDouglas", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DDouglas;
                            da.SelectCommand.Parameters.Add("@DParametros", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DParametros;
                            da.SelectCommand.Parameters.Add("@DMamas", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DMamas;
                            da.SelectCommand.Parameters.Add("@LUA", SqlDbType.Int).Value = objExamenGinecoObstetra.LUA;
                            da.SelectCommand.Parameters.Add("@LLCF", SqlDbType.Int).Value = objExamenGinecoObstetra.LLCF;
                            da.SelectCommand.Parameters.Add("@LDU", SqlDbType.Int).Value = objExamenGinecoObstetra.LDU;
                            da.SelectCommand.Parameters.Add("@LSituacion", SqlDbType.Int).Value = objExamenGinecoObstetra.LSituacion;
                            da.SelectCommand.Parameters.Add("@LPosicion", SqlDbType.Int).Value = objExamenGinecoObstetra.LPosicion;
                            da.SelectCommand.Parameters.Add("@LPresentacion", SqlDbType.Int).Value = objExamenGinecoObstetra.LPresentacion;
                            da.SelectCommand.Parameters.Add("@LDips", SqlDbType.Int).Value = objExamenGinecoObstetra.LDips;
                            da.SelectCommand.Parameters.Add("@DF1Spp", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DF1Spp;
                            da.SelectCommand.Parameters.Add("@DF2Spp", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DF2Spp;
                            da.SelectCommand.Parameters.Add("@DF3Spp", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DF3Spp;
                            da.SelectCommand.Parameters.Add("@LF1Lcf", SqlDbType.Int).Value = objExamenGinecoObstetra.LF1Lcf;
                            da.SelectCommand.Parameters.Add("@LF2Lcf", SqlDbType.Int).Value = objExamenGinecoObstetra.LF2Lcf;
                            da.SelectCommand.Parameters.Add("@LF3Lcf", SqlDbType.Int).Value = objExamenGinecoObstetra.LF3Lcf;
                            da.SelectCommand.Parameters.Add("@LSoplos", SqlDbType.Int).Value = objExamenGinecoObstetra.LSoplos;
                            da.SelectCommand.Parameters.Add("@LHidraminios", SqlDbType.Int).Value = objExamenGinecoObstetra.LHidraminios;
                            da.SelectCommand.Parameters.Add("@LPonderado", SqlDbType.Int).Value = objExamenGinecoObstetra.LPonderado;
                            da.SelectCommand.Parameters.Add("@LDilatacion", SqlDbType.Int).Value = objExamenGinecoObstetra.LDilatacion;
                            da.SelectCommand.Parameters.Add("@LIncorporacion", SqlDbType.Int).Value = objExamenGinecoObstetra.LIncorporacion;
                            da.SelectCommand.Parameters.Add("@LAlPresent", SqlDbType.VarChar).Value = objExamenGinecoObstetra.LAlPresent;
                            da.SelectCommand.Parameters.Add("@DVarPresent", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DVarPresent;
                            da.SelectCommand.Parameters.Add("@LProcubito", SqlDbType.Int).Value = objExamenGinecoObstetra.LProcubito;
                            da.SelectCommand.Parameters.Add("@LProlapso", SqlDbType.Int).Value = objExamenGinecoObstetra.LProlapso;
                            da.SelectCommand.Parameters.Add("@DSangradoV", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DSangradoV;
                            da.SelectCommand.Parameters.Add("@LLiquidoA", SqlDbType.Int).Value = objExamenGinecoObstetra.LLiquidoA;
                            da.SelectCommand.Parameters.Add("@LCompatibilidadF", SqlDbType.Int).Value = objExamenGinecoObstetra.LCompatibilidadF;
                            da.SelectCommand.Parameters.Add("@DObservaciones", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DObservaciones;
                            da.SelectCommand.Parameters.Add("@LEstadoGeneral", SqlDbType.Int).Value = objExamenGinecoObstetra.LEstadoGeneral;
                            da.SelectCommand.Parameters.Add("@LAparatoCV", SqlDbType.Int).Value = objExamenGinecoObstetra.LAparatoCV;
                            da.SelectCommand.Parameters.Add("@LAbdomen", SqlDbType.Int).Value = objExamenGinecoObstetra.LAbdomen;
                            da.SelectCommand.Parameters.Add("@LAparatoR", SqlDbType.Int).Value = objExamenGinecoObstetra.LAparatoR;
                            da.SelectCommand.Parameters.Add("@LAparatoU", SqlDbType.Int).Value = objExamenGinecoObstetra.LAparatoU;
                            da.SelectCommand.Parameters.Add("@LExtremidades", SqlDbType.Int).Value = objExamenGinecoObstetra.LExtremidades;
                            da.SelectCommand.Parameters.Add("@DEstadoGeneral", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DEstadoGeneral;
                            da.SelectCommand.Parameters.Add("@DAparatoCV", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DAparatoCV;
                            da.SelectCommand.Parameters.Add("@DAbdomen", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DAbdomen;
                            da.SelectCommand.Parameters.Add("@DAparatoR", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DAparatoR;
                            da.SelectCommand.Parameters.Add("@DAparatoU", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DAparatoU;
                            da.SelectCommand.Parameters.Add("@DExtremidades", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DExtremidades;
                            da.SelectCommand.Parameters.Add("@LTipoEmbarazo", SqlDbType.Int).Value = objExamenGinecoObstetra.LTipoEmbarazo;
                            da.SelectCommand.Parameters.Add("@LPelvimetriaSup", SqlDbType.Int).Value = objExamenGinecoObstetra.LPelvimetriaSup;
                            da.SelectCommand.Parameters.Add("@LPelvimetriaMed", SqlDbType.Int).Value = objExamenGinecoObstetra.LPelvimetriaMed;
                            da.SelectCommand.Parameters.Add("@LPelvimetriaInf", SqlDbType.Int).Value = objExamenGinecoObstetra.LPelvimetriaInf;
                            da.SelectCommand.Parameters.Add("@LTipoTactoVaginal", SqlDbType.Int).Value = objExamenGinecoObstetra.LTipoTactoVaginal;
                            da.SelectCommand.Parameters.Add("@LPelvisGinecoide", SqlDbType.Int).Value = objExamenGinecoObstetra.LPelvisGinecoide;
                            da.SelectCommand.Parameters.Add("@DEdemas", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DEdemas;
                            da.SelectCommand.Parameters.Add("@DReflejos", SqlDbType.VarChar).Value = objExamenGinecoObstetra.DReflejos;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objExamenGinecoObstetra.IdUsuario;
                            da.SelectCommand.Parameters.Add("@ObservacionGinecologica", SqlDbType.VarChar).Value = objExamenGinecoObstetra.ObservacionGinecologica;
                            da.SelectCommand.Parameters.Add("@Claro", SqlDbType.Int).Value = objExamenGinecoObstetra.Claro;
                            da.SelectCommand.Parameters.Add("@Meconial", SqlDbType.Int).Value = objExamenGinecoObstetra.Meconial;
                            da.SelectCommand.Parameters.Add("@Sanguinolento", SqlDbType.Int).Value = objExamenGinecoObstetra.Sanguinolento;
                            da.SelectCommand.Parameters.Add("@MalOlor", SqlDbType.Int).Value = objExamenGinecoObstetra.MalOlor;
                            da.SelectCommand.Parameters.Add("@PelvisGineDesc", SqlDbType.VarChar).Value = objExamenGinecoObstetra.PelvisGineDesc;
                            da.SelectCommand.Parameters.Add("@MembranasRotas", SqlDbType.Int).Value = objExamenGinecoObstetra.MembranasRotas;
                            da.SelectCommand.Parameters.Add("@Proteinura", SqlDbType.VarChar).Value = objExamenGinecoObstetra.Proteinura;
                            da.SelectCommand.Parameters.Add("@MovFetales", SqlDbType.VarChar).Value = objExamenGinecoObstetra.MovFetales;
                            da.SelectCommand.Parameters.Add("@MFF01", SqlDbType.VarChar).Value = objExamenGinecoObstetra.MFF01;
                            da.SelectCommand.Parameters.Add("@MFF02", SqlDbType.VarChar).Value = objExamenGinecoObstetra.MFF02;
                            da.SelectCommand.Parameters.Add("@MFF03", SqlDbType.VarChar).Value = objExamenGinecoObstetra.MFF03;
                            da.SelectCommand.Parameters.Add("@SignosAlarma", SqlDbType.Text).Value = objExamenGinecoObstetra.SignosAlarma;
                            da.SelectCommand.Parameters.Add("@Pap", SqlDbType.Bit).Value = objExamenGinecoObstetra.Pap;
                            da.SelectCommand.Parameters.Add("@NroFetos", SqlDbType.Int).Value = objExamenGinecoObstetra.NroFetos;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_ExamenGinecoObstetra");

                //cmd.Parameters.AddWithValue("@IdAtencion", objExamenGinecoObstetra.IdAtencion);
                //cmd.Parameters.AddWithValue("@LGeBus", objExamenGinecoObstetra.LGeBus);
                //cmd.Parameters.AddWithValue("@LVagina", objExamenGinecoObstetra.LVagina);
                //cmd.Parameters.AddWithValue("@LCervix", objExamenGinecoObstetra.LCervix);
                //cmd.Parameters.AddWithValue("@LUtero", objExamenGinecoObstetra.LUtero);
                //cmd.Parameters.AddWithValue("@DGeBus", objExamenGinecoObstetra.DGeBus);
                //cmd.Parameters.AddWithValue("@DVagina", objExamenGinecoObstetra.DVagina);
                //cmd.Parameters.AddWithValue("@DCervix", objExamenGinecoObstetra.DCervix);
                //cmd.Parameters.AddWithValue("@DUtero", objExamenGinecoObstetra.DUtero);
                //cmd.Parameters.AddWithValue("@LAnexos", objExamenGinecoObstetra.LAnexos);
                //cmd.Parameters.AddWithValue("@LDouglas", objExamenGinecoObstetra.LDouglas);
                //cmd.Parameters.AddWithValue("@LParametros", objExamenGinecoObstetra.LParametros);
                //cmd.Parameters.AddWithValue("@LMamas", objExamenGinecoObstetra.LMamas);
                //cmd.Parameters.AddWithValue("@DAnexos", objExamenGinecoObstetra.DAnexos);
                //cmd.Parameters.AddWithValue("@DDouglas", objExamenGinecoObstetra.DDouglas);
                //cmd.Parameters.AddWithValue("@DParametros", objExamenGinecoObstetra.DParametros);
                //cmd.Parameters.AddWithValue("@DMamas", objExamenGinecoObstetra.DMamas);
                //cmd.Parameters.AddWithValue("@LUA", objExamenGinecoObstetra.LUA);
                //cmd.Parameters.AddWithValue("@LLCF", objExamenGinecoObstetra.LLCF);
                //cmd.Parameters.AddWithValue("@LDU", objExamenGinecoObstetra.LDU);
                //cmd.Parameters.AddWithValue("@LSituacion", objExamenGinecoObstetra.LSituacion);
                //cmd.Parameters.AddWithValue("@LPosicion", objExamenGinecoObstetra.LPosicion);
                //cmd.Parameters.AddWithValue("@LPresentacion", objExamenGinecoObstetra.LPresentacion);
                //cmd.Parameters.AddWithValue("@LDips", objExamenGinecoObstetra.LDips);
                //cmd.Parameters.AddWithValue("@DF1Spp", objExamenGinecoObstetra.DF1Spp);
                //cmd.Parameters.AddWithValue("@DF2Spp", objExamenGinecoObstetra.DF2Spp);
                //cmd.Parameters.AddWithValue("@DF3Spp", objExamenGinecoObstetra.DF3Spp);
                //cmd.Parameters.AddWithValue("@LF1Lcf", objExamenGinecoObstetra.LF1Lcf);
                //cmd.Parameters.AddWithValue("@LF2Lcf", objExamenGinecoObstetra.LF2Lcf);
                //cmd.Parameters.AddWithValue("@LF3Lcf", objExamenGinecoObstetra.LF3Lcf);
                //cmd.Parameters.AddWithValue("@LSoplos", objExamenGinecoObstetra.LSoplos);
                //cmd.Parameters.AddWithValue("@LHidraminios", objExamenGinecoObstetra.LHidraminios);
                //cmd.Parameters.AddWithValue("@LPonderado", objExamenGinecoObstetra.LPonderado);
                //cmd.Parameters.AddWithValue("@LDilatacion", objExamenGinecoObstetra.LDilatacion);
                //cmd.Parameters.AddWithValue("@LIncorporacion", objExamenGinecoObstetra.LIncorporacion);
                //cmd.Parameters.AddWithValue("@LAlPresent", objExamenGinecoObstetra.LAlPresent);
                //cmd.Parameters.AddWithValue("@DVarPresent", objExamenGinecoObstetra.DVarPresent);
                //cmd.Parameters.AddWithValue("@LProcubito", objExamenGinecoObstetra.LProcubito);
                //cmd.Parameters.AddWithValue("@LProlapso", objExamenGinecoObstetra.LProlapso);
                //cmd.Parameters.AddWithValue("@DSangradoV", objExamenGinecoObstetra.DSangradoV);
                //cmd.Parameters.AddWithValue("@LLiquidoA", objExamenGinecoObstetra.LLiquidoA);
                //cmd.Parameters.AddWithValue("@LCompatibilidadF", objExamenGinecoObstetra.LCompatibilidadF);
                //cmd.Parameters.AddWithValue("@DObservaciones", objExamenGinecoObstetra.DObservaciones);
                //cmd.Parameters.AddWithValue("@LEstadoGeneral", objExamenGinecoObstetra.LEstadoGeneral);
                //cmd.Parameters.AddWithValue("@LAparatoCV", objExamenGinecoObstetra.LAparatoCV);
                //cmd.Parameters.AddWithValue("@LAbdomen", objExamenGinecoObstetra.LAbdomen);
                //cmd.Parameters.AddWithValue("@LAparatoR", objExamenGinecoObstetra.LAparatoR);
                //cmd.Parameters.AddWithValue("@LAparatoU", objExamenGinecoObstetra.LAparatoU);
                //cmd.Parameters.AddWithValue("@LExtremidades", objExamenGinecoObstetra.LExtremidades);
                //cmd.Parameters.AddWithValue("@DEstadoGeneral", objExamenGinecoObstetra.DEstadoGeneral);
                //cmd.Parameters.AddWithValue("@DAparatoCV", objExamenGinecoObstetra.DAparatoCV);
                //cmd.Parameters.AddWithValue("@DAbdomen", objExamenGinecoObstetra.DAbdomen);
                //cmd.Parameters.AddWithValue("@DAparatoR", objExamenGinecoObstetra.DAparatoR);
                //cmd.Parameters.AddWithValue("@DAparatoU", objExamenGinecoObstetra.DAparatoU);
                //cmd.Parameters.AddWithValue("@DExtremidades", objExamenGinecoObstetra.DExtremidades);
                //cmd.Parameters.AddWithValue("@LTipoEmbarazo", objExamenGinecoObstetra.LTipoEmbarazo);
                //cmd.Parameters.AddWithValue("@LPelvimetriaSup", objExamenGinecoObstetra.LPelvimetriaSup);
                //cmd.Parameters.AddWithValue("@LPelvimetriaMed", objExamenGinecoObstetra.LPelvimetriaMed);
                //cmd.Parameters.AddWithValue("@LPelvimetriaInf", objExamenGinecoObstetra.LPelvimetriaInf);
                //cmd.Parameters.AddWithValue("@LTipoTactoVaginal", objExamenGinecoObstetra.LTipoTactoVaginal);
                //cmd.Parameters.AddWithValue("@LPelvisGinecoide", objExamenGinecoObstetra.LPelvisGinecoide);
                //cmd.Parameters.AddWithValue("@DEdemas", objExamenGinecoObstetra.DEdemas);
                //cmd.Parameters.AddWithValue("@DReflejos", objExamenGinecoObstetra.DReflejos);
                //cmd.Parameters.AddWithValue("@IdUsuario", objExamenGinecoObstetra.IdUsuario);
                //cmd.Parameters.AddWithValue("@ObservacionGinecologica", objExamenGinecoObstetra.ObservacionGinecologica);
                //cmd.Parameters.AddWithValue("@Claro", objExamenGinecoObstetra.Claro);
                //cmd.Parameters.AddWithValue("@Meconial", objExamenGinecoObstetra.Meconial);
                //cmd.Parameters.AddWithValue("@Sanguinolento", objExamenGinecoObstetra.Sanguinolento);
                //cmd.Parameters.AddWithValue("@MalOlor", objExamenGinecoObstetra.MalOlor);
                //cmd.Parameters.AddWithValue("@PelvisGineDesc", objExamenGinecoObstetra.PelvisGineDesc);
                //cmd.Parameters.AddWithValue("@MembranasRotas", objExamenGinecoObstetra.MembranasRotas);
                //cmd.Parameters.AddWithValue("@Proteinura", objExamenGinecoObstetra.Proteinura);
                //cmd.Parameters.AddWithValue("@MovFetales", objExamenGinecoObstetra.MovFetales);
                //cmd.Parameters.AddWithValue("@MFF01", objExamenGinecoObstetra.MFF01);
                //cmd.Parameters.AddWithValue("@MFF02", objExamenGinecoObstetra.MFF02);
                //cmd.Parameters.AddWithValue("@MFF03", objExamenGinecoObstetra.MFF03);
                //cmd.Parameters.AddWithValue("@SignosAlarma", objExamenGinecoObstetra.SignosAlarma);
                //cmd.Parameters.AddWithValue("@Pap", objExamenGinecoObstetra.Pap);
                //cmd.Parameters.AddWithValue("@NroFetos", objExamenGinecoObstetra.NroFetos);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> EvaluacionObstetricaSeleccionar(int idAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionObstetricaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", (object)idAtencion ?? DBNull.Value);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaAntecedentesPaciente(int idPaciente, int idProCabecera)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaAntecedentesPaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", (object)idPaciente ?? DBNull.Value);
                        //da.SelectCommand.Parameters.AddWithValue("@IdAtencion", (object)idAtencion ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdProCabecera", (object)idProCabecera ?? DBNull.Value);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarAntecendesxIdCabecera(int idCabecera)
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
                            string sql = "web_ListaAntecedentesPFO";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idProCabecera", SqlDbType.Int).Value = idCabecera;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_ListaAntecedentesPFO");
                //cmd.Parameters.AddWithValue("idProCabecera", idCabecera);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        /***RMOREANO***/

        public Task<int> InsertaProCabeceraYControl(ProCabecera objCab, ProControles objControles)
        {
            DataSet ds = new DataSet();
            int nRpta = 0;
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
                            string sql = "web_insertCabeceraYcontroles";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdPrograma", SqlDbType.Int).Value = objCab.IdPrograma;
                            da.SelectCommand.Parameters.Add("@IdProcabecera", SqlDbType.Int).Value = objCab.IdProcabecera;
                            da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = objCab.IdPaciente;
                            da.SelectCommand.Parameters.Add("@UsuarioInicio", SqlDbType.Int).Value = objCab.UsuarioInicio;
                            da.SelectCommand.Parameters.Add("@IdControl", SqlDbType.Int).Value = objControles.IdControl;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objControles.IdAtencion;
                            da.SelectCommand.Parameters.Add("@FechaControl", SqlDbType.NVarChar).Value = objControles.FechaControl;
                            da.SelectCommand.Parameters.Add("@idCabeceraRetun", SqlDbType.Int).Direction = ParameterDirection.Output;

                            da.Fill(ds);

                            nRpta = int.Parse(da.SelectCommand.Parameters["@idCabeceraRetun"].Value.ToString());

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_insertCabeceraYcontroles");

                //cmd.Parameters.AddWithValue("@IdPrograma", objCab.IdPrograma);
                //cmd.Parameters.AddWithValue("@IdProcabecera", objCab.IdProcabecera);
                //cmd.Parameters.AddWithValue("@IdPaciente", objCab.IdPaciente);
                //cmd.Parameters.AddWithValue("@UsuarioInicio", objCab.UsuarioInicio);
                //cmd.Parameters.AddWithValue("@IdControl", objControles.IdControl);
                //cmd.Parameters.AddWithValue("@IdAtencion", objControles.IdAtencion);
                //cmd.Parameters.AddWithValue("@FechaControl", objControles.FechaControl);
                //cmd.Parameters.Add("@idCabeceraRetun", SqlDbType.Int).Direction = ParameterDirection.Output;

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = int.Parse(cmd.Parameters["@idCabeceraRetun"].Value.ToString());



            }
            catch (Exception ex)
            {
                nRpta = 0;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> ListaProCabeceraYControlByIdAtn(int idAtencion)
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
                            string sql = "web_ListaCabeceraControlByIdAten";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_ListaCabeceraControlByIdAten");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ListaProCabecera(int idPaciente)
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
                            string sql = "web_listaProCabeceraByIdPaciente";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaProCabeceraByIdPaciente");
                //cmd.Parameters.AddWithValue("@idPaciente", idPaciente);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ProCabeceraPorPacienteSeleccionar(int idPaciente)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ProCabeceraPorPacienteSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaEvaluacionEmergencia(int idAtencion)
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
                            string sql = "web_listaEvalEmergencia";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaEvalEmergencia");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ListaGinecoObstetra(int idAtencion)
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
                            string sql = "web_ListaGinecoObstetra";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_ListaGinecoObstetra");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ListaTipoDeEmbarazo()
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListarTiposEmbarazo";
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

        public Task<DataSet> ListaCatalogoCombo(int IdCatalogoCombo)
        {


            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaComboDetalle";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCatalogoCombo", SqlDbType.Int).Value = IdCatalogoCombo;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> ListaControlesByidCabecera(int idCabecera)
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
                            string sql = "web_listaControlesByidCabecera";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idCabecera", SqlDbType.Int).Value = idCabecera;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaControlesByidCabecera");
                //cmd.Parameters.AddWithValue("@idCabecera", idCabecera);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> AtencionesEstanciaHospitalariaPorIdCuenta(int idCuentaAtencion)
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
                            string sql = "AtencionesEstanciaHospitalariaPorIdCuenta";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("AtencionesEstanciaHospitalariaPorIdCuenta");
                //cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        #region Percentiles

        public DataSet ObtenerPercentilPesoxPaciente(int idProCabecera)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CuadroPercentilPeso");
                cmd.Parameters.AddWithValue("@idProcabecera", idProCabecera);
                //dr = cmd.ExecuteReader ();

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

        public DataSet ObtenerPercentilAlturaUterinaxPaciente(int idProCabecera)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_CuadroPercentilAlturaUterina");
                cmd.Parameters.AddWithValue("@idProcabecera", idProCabecera);
                //dr = cmd.ExecuteReader ();

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
        public Task<DataSet> ListaAtencionEstadosCompletosByIdCuenta(int idCuentaAtencion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaAtencionEstadosCompletosByIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });

            //try
            //{

            //    cmd = MetodoDatos.CrearComando("web_listaAtencionEstadosCompletosByIdCuenta");
            //    cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

            //    //dr = cmd.ExecuteReader ();

            //    SqlDataAdapter da = new SqlDataAdapter(cmd);

            //    da.Fill(ds);

            //}
            //catch (Exception)
            //{

            //    ds = null; throw;
            //}
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }
        #endregion
        public Task<DataSet> ListaMedicos()
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
                            string sql = "MedicosSeleccionarTodosOrdenadoAlfabeticamente";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("MedicosSeleccionarTodosOrdenadoAlfabeticamente");

                //SqlDataAdapter da = new SqlDataAdapter(cmd);

                //da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<Boolean> InsertaEvaluacionEmergenciaHospitalizacion(EvaluacionEmergencia objEvaluacionEmergencia) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertUpdate_EvaluacionEmergenciaHospitalizacion";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdAtencion", objEvaluacionEmergencia.IdAtencion);
                        cmd.Parameters.AddWithValue("@FechaUR", objEvaluacionEmergencia.FechaUR);
                        cmd.Parameters.AddWithValue("@FechaPP", objEvaluacionEmergencia.FechaPP);
                        cmd.Parameters.AddWithValue("@EdadGestacional", objEvaluacionEmergencia.EdadGestacional);
                        cmd.Parameters.AddWithValue("@Cnp", objEvaluacionEmergencia.Cnp);
                        cmd.Parameters.AddWithValue("@Dolor", objEvaluacionEmergencia.Dolor);
                        cmd.Parameters.AddWithValue("@Convulsiones", objEvaluacionEmergencia.Convulsiones);
                        cmd.Parameters.AddWithValue("@Fiebre", objEvaluacionEmergencia.Fiebre);
                        cmd.Parameters.AddWithValue("@Vomitos", objEvaluacionEmergencia.Vomitos);
                        cmd.Parameters.AddWithValue("@ContraccionesU", objEvaluacionEmergencia.ContraccionesU);
                        cmd.Parameters.AddWithValue("@SangradoV", objEvaluacionEmergencia.SangradoV);
                        cmd.Parameters.AddWithValue("@PerdidaLA", objEvaluacionEmergencia.PerdidaLA);
                        cmd.Parameters.AddWithValue("@AusenciaMF", objEvaluacionEmergencia.AusenciaMF);
                        cmd.Parameters.AddWithValue("@SintomasU", objEvaluacionEmergencia.SintomasU);
                        cmd.Parameters.AddWithValue("@FlujoV", objEvaluacionEmergencia.FlujoV);
                        cmd.Parameters.AddWithValue("@Tumoracion", objEvaluacionEmergencia.Tumoracion);
                        cmd.Parameters.AddWithValue("@AlteracionesM", objEvaluacionEmergencia.AlteracionesM);
                        cmd.Parameters.AddWithValue("@Antecedentes", objEvaluacionEmergencia.Antecedentes);
                        cmd.Parameters.AddWithValue("@EnfermedadA", objEvaluacionEmergencia.EnfermedadA);

                        cmd.Parameters.AddWithValue("@IdUsuario", objEvaluacionEmergencia.IdUsuario);
                        cmd.Parameters.AddWithValue("@IdUsuarioModifica", objEvaluacionEmergencia.IdUsuarioModifica);
                        cmd.Parameters.AddWithValue("@UltRegla", objEvaluacionEmergencia.UltRegla);
                        cmd.Parameters.AddWithValue("@FechaEco", objEvaluacionEmergencia.FechaEco);
                        cmd.Parameters.AddWithValue("@GMotiA", objEvaluacionEmergencia.GMotiA);
                        cmd.Parameters.AddWithValue("@PMotiA", objEvaluacionEmergencia.PMotiA);
                        cmd.Parameters.AddWithValue("@FechaEcoAct", objEvaluacionEmergencia.FechaEcoAct);
                        cmd.Parameters.AddWithValue("@DisMovFetales", objEvaluacionEmergencia.DisMovFetales);
                        cmd.Parameters.AddWithValue("@PesoFetalAnt", objEvaluacionEmergencia.PesoFetalAnt);
                        cmd.Parameters.AddWithValue("@Prioridad", objEvaluacionEmergencia.Prioridad);
                        cmd.Parameters.AddWithValue("@Glasgow", objEvaluacionEmergencia.Glasgow);
                        cmd.Parameters.AddWithValue("@ObservacionTriaje", objEvaluacionEmergencia.ObservacionTriaje);
                        cmd.Parameters.AddWithValue("@DiasGestacional", objEvaluacionEmergencia.DiasGestacional);
                        cmd.Parameters.AddWithValue("@CalculaFE", objEvaluacionEmergencia.CalculaFE);
                        cmd.Parameters.AddWithValue("@DiasGestacionalEco", objEvaluacionEmergencia.DiasGestacionalEco);
                        cmd.Parameters.AddWithValue("@SemanaGestacionalEco", objEvaluacionEmergencia.SemanaGestacionalEco);
                        cmd.Parameters.AddWithValue("@Pin", objEvaluacionEmergencia.Pin);
                        cmd.Parameters.AddWithValue("@DeltaPeso", objEvaluacionEmergencia.DeltaPeso);
                        cmd.Parameters.AddWithValue("@MaduracionPulmonar", objEvaluacionEmergencia.MaduracionPulmonar ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@MaduracionCervical", objEvaluacionEmergencia.MaduracionCervical ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Ram", objEvaluacionEmergencia.Ram);
                        cmd.Parameters.AddWithValue("@TransfucionSangre", objEvaluacionEmergencia.TransfucionSangre ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AntecedentesQuirurgicos", objEvaluacionEmergencia.AntecedentesQuirurgicos);
                        cmd.Parameters.AddWithValue("@ContraccionesUterinasDesc", objEvaluacionEmergencia.ContraccionesUterinasDesc);
                        cmd.Parameters.AddWithValue("@PerdidaLiquidoAmnioticoDesc", objEvaluacionEmergencia.PerdidaLiquidoAmnioticoDesc);
                        cmd.Parameters.AddWithValue("@MovimientoFetalesDesc", objEvaluacionEmergencia.MovimientoFetalesDesc);
                        cmd.Parameters.AddWithValue("@SangradoVaginalDesc", objEvaluacionEmergencia.SangradoVaginalDesc);
                        cmd.Parameters.AddWithValue("@FiebreDesc", objEvaluacionEmergencia.FiebreDesc);
                        cmd.Parameters.AddWithValue("@SgIrritacionCorticalDesc", objEvaluacionEmergencia.SgIrritacionCorticalDesc);
                        cmd.Parameters.AddWithValue("@SgIrritacionCortical", objEvaluacionEmergencia.SgIrritacionCortical);

                        cmd.Parameters.AddWithValue("@idNumero", objEvaluacionEmergencia.idNumero);
                        cmd.Parameters.AddWithValue("@idServicio", objEvaluacionEmergencia.idServicio);
                        cmd.Parameters.AddWithValue("@Sintomas", objEvaluacionEmergencia.Sintomas);

                        cmd.Parameters.AddWithValue("@MaduracionPulmonarDesc", objEvaluacionEmergencia.MaduracionPulmonarDesc);
                        cmd.Parameters.AddWithValue("@MaduracionCervicalDesc", objEvaluacionEmergencia.MaduracionCervicalDesc);

                        cmd.Parameters.AddWithValue("@DescripcionExamenFisico", objEvaluacionEmergencia.DescripcionExamenFisico); // JDELGADO001.2
                        cmd.Parameters.AddWithValue("@Tratamiento", objEvaluacionEmergencia.TratamientoNuevo); // JDELGADO001.2

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
        public Task<Boolean> InsertaExamenGinecoObstetraHospitalizacion(ExamenGinecoObstetra objExamenGinecoObstetra) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertUpdate_ExamenGinecoObstetraHospitalizacion";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdAtencion", objExamenGinecoObstetra.IdAtencion);
                        cmd.Parameters.AddWithValue("@LGeBus", objExamenGinecoObstetra.LGeBus);
                        cmd.Parameters.AddWithValue("@LVagina", objExamenGinecoObstetra.LVagina);
                        cmd.Parameters.AddWithValue("@LCervix", objExamenGinecoObstetra.LCervix);
                        cmd.Parameters.AddWithValue("@LUtero", objExamenGinecoObstetra.LUtero);
                        cmd.Parameters.AddWithValue("@DGeBus", objExamenGinecoObstetra.DGeBus);
                        cmd.Parameters.AddWithValue("@DVagina", objExamenGinecoObstetra.DVagina);
                        cmd.Parameters.AddWithValue("@DCervix", objExamenGinecoObstetra.DCervix);
                        cmd.Parameters.AddWithValue("@DUtero", objExamenGinecoObstetra.DUtero);
                        cmd.Parameters.AddWithValue("@LAnexos", objExamenGinecoObstetra.LAnexos);
                        cmd.Parameters.AddWithValue("@LDouglas", objExamenGinecoObstetra.LDouglas);
                        cmd.Parameters.AddWithValue("@LParametros", objExamenGinecoObstetra.LParametros);
                        cmd.Parameters.AddWithValue("@LMamas", objExamenGinecoObstetra.LMamas);
                        cmd.Parameters.AddWithValue("@DAnexos", objExamenGinecoObstetra.DAnexos);
                        cmd.Parameters.AddWithValue("@DDouglas", objExamenGinecoObstetra.DDouglas);
                        cmd.Parameters.AddWithValue("@DParametros", objExamenGinecoObstetra.DParametros);
                        cmd.Parameters.AddWithValue("@DMamas", objExamenGinecoObstetra.DMamas);
                        cmd.Parameters.AddWithValue("@LUA", objExamenGinecoObstetra.LUA);
                        cmd.Parameters.AddWithValue("@LLCF", objExamenGinecoObstetra.LLCF);
                        cmd.Parameters.AddWithValue("@LDU", objExamenGinecoObstetra.LDU);
                        cmd.Parameters.AddWithValue("@LSituacion", objExamenGinecoObstetra.LSituacion);
                        cmd.Parameters.AddWithValue("@LPosicion", objExamenGinecoObstetra.LPosicion);
                        cmd.Parameters.AddWithValue("@LPresentacion", objExamenGinecoObstetra.LPresentacion);
                        cmd.Parameters.AddWithValue("@LDips", objExamenGinecoObstetra.LDips);
                        cmd.Parameters.AddWithValue("@DF1Spp", objExamenGinecoObstetra.DF1Spp);
                        cmd.Parameters.AddWithValue("@DF2Spp", objExamenGinecoObstetra.DF2Spp);
                        cmd.Parameters.AddWithValue("@DF3Spp", objExamenGinecoObstetra.DF3Spp);
                        cmd.Parameters.AddWithValue("@LF1Lcf", objExamenGinecoObstetra.LF1Lcf);
                        cmd.Parameters.AddWithValue("@LF2Lcf", objExamenGinecoObstetra.LF2Lcf);
                        cmd.Parameters.AddWithValue("@LF3Lcf", objExamenGinecoObstetra.LF3Lcf);
                        cmd.Parameters.AddWithValue("@LSoplos", objExamenGinecoObstetra.LSoplos);
                        cmd.Parameters.AddWithValue("@LHidraminios", objExamenGinecoObstetra.LHidraminios);
                        cmd.Parameters.AddWithValue("@LPonderado", objExamenGinecoObstetra.LPonderado);
                        cmd.Parameters.AddWithValue("@LDilatacion", objExamenGinecoObstetra.LDilatacion);
                        cmd.Parameters.AddWithValue("@LIncorporacion", objExamenGinecoObstetra.LIncorporacion);
                        cmd.Parameters.AddWithValue("@LAlPresent", objExamenGinecoObstetra.LAlPresent);
                        cmd.Parameters.AddWithValue("@DVarPresent", objExamenGinecoObstetra.DVarPresent);
                        cmd.Parameters.AddWithValue("@LProcubito", objExamenGinecoObstetra.LProcubito);
                        cmd.Parameters.AddWithValue("@LProlapso", objExamenGinecoObstetra.LProlapso);
                        cmd.Parameters.AddWithValue("@DSangradoV", objExamenGinecoObstetra.DSangradoV);
                        cmd.Parameters.AddWithValue("@LLiquidoA", objExamenGinecoObstetra.LLiquidoA);
                        cmd.Parameters.AddWithValue("@LCompatibilidadF", objExamenGinecoObstetra.LCompatibilidadF);
                        cmd.Parameters.AddWithValue("@DObservaciones", objExamenGinecoObstetra.DObservaciones);
                        cmd.Parameters.AddWithValue("@LEstadoGeneral", objExamenGinecoObstetra.LEstadoGeneral);
                        cmd.Parameters.AddWithValue("@LAparatoCV", objExamenGinecoObstetra.LAparatoCV);
                        cmd.Parameters.AddWithValue("@LAbdomen", objExamenGinecoObstetra.LAbdomen);
                        cmd.Parameters.AddWithValue("@LAparatoR", objExamenGinecoObstetra.LAparatoR);
                        cmd.Parameters.AddWithValue("@LAparatoU", objExamenGinecoObstetra.LAparatoU);
                        cmd.Parameters.AddWithValue("@LExtremidades", objExamenGinecoObstetra.LExtremidades);
                        cmd.Parameters.AddWithValue("@DEstadoGeneral", objExamenGinecoObstetra.DEstadoGeneral);
                        cmd.Parameters.AddWithValue("@DAparatoCV", objExamenGinecoObstetra.DAparatoCV);
                        cmd.Parameters.AddWithValue("@DAbdomen", objExamenGinecoObstetra.DAbdomen);
                        cmd.Parameters.AddWithValue("@DAparatoR", objExamenGinecoObstetra.DAparatoR);
                        cmd.Parameters.AddWithValue("@DAparatoU", objExamenGinecoObstetra.DAparatoU);
                        cmd.Parameters.AddWithValue("@DExtremidades", objExamenGinecoObstetra.DExtremidades);
                        cmd.Parameters.AddWithValue("@LTipoEmbarazo", objExamenGinecoObstetra.LTipoEmbarazo);
                        cmd.Parameters.AddWithValue("@LPelvimetriaSup", objExamenGinecoObstetra.LPelvimetriaSup);
                        cmd.Parameters.AddWithValue("@LPelvimetriaMed", objExamenGinecoObstetra.LPelvimetriaMed);
                        cmd.Parameters.AddWithValue("@LPelvimetriaInf", objExamenGinecoObstetra.LPelvimetriaInf);
                        cmd.Parameters.AddWithValue("@LTipoTactoVaginal", objExamenGinecoObstetra.LTipoTactoVaginal);
                        cmd.Parameters.AddWithValue("@LPelvisGinecoide", objExamenGinecoObstetra.LPelvisGinecoide);
                        cmd.Parameters.AddWithValue("@DEdemas", objExamenGinecoObstetra.DEdemas);
                        cmd.Parameters.AddWithValue("@DReflejos", objExamenGinecoObstetra.DReflejos);
                        cmd.Parameters.AddWithValue("@IdUsuario", objExamenGinecoObstetra.IdUsuario);
                        cmd.Parameters.AddWithValue("@ObservacionGinecologica", objExamenGinecoObstetra.ObservacionGinecologica);
                        cmd.Parameters.AddWithValue("@Claro", objExamenGinecoObstetra.Claro);
                        cmd.Parameters.AddWithValue("@Meconial", objExamenGinecoObstetra.Meconial);
                        cmd.Parameters.AddWithValue("@Sanguinolento", objExamenGinecoObstetra.Sanguinolento);
                        cmd.Parameters.AddWithValue("@MalOlor", objExamenGinecoObstetra.MalOlor);
                        cmd.Parameters.AddWithValue("@PelvisGineDesc", objExamenGinecoObstetra.PelvisGineDesc);
                        cmd.Parameters.AddWithValue("@MembranasRotas", objExamenGinecoObstetra.MembranasRotas);
                        cmd.Parameters.AddWithValue("@Proteinura", objExamenGinecoObstetra.Proteinura);
                        cmd.Parameters.AddWithValue("@MovFetales", objExamenGinecoObstetra.MovFetales);
                        cmd.Parameters.AddWithValue("@MFF01", objExamenGinecoObstetra.MFF01);
                        cmd.Parameters.AddWithValue("@MFF02", objExamenGinecoObstetra.MFF02);
                        cmd.Parameters.AddWithValue("@MFF03", objExamenGinecoObstetra.MFF03);
                        cmd.Parameters.AddWithValue("@SignosAlarma", objExamenGinecoObstetra.SignosAlarma);
                        cmd.Parameters.AddWithValue("@Pap", objExamenGinecoObstetra.Pap);
                        cmd.Parameters.AddWithValue("@NroFetos", objExamenGinecoObstetra.NroFetos);
                        cmd.Parameters.AddWithValue("@DObservacionesObstetricas", objExamenGinecoObstetra.DObservacionesObstetricas);
                        cmd.Parameters.AddWithValue("@ScoreFlamm", objExamenGinecoObstetra.ScoreFlamm);
                        cmd.Parameters.AddWithValue("@Bishop", objExamenGinecoObstetra.Bishop);
                        cmd.Parameters.AddWithValue("@idNumero", objExamenGinecoObstetra.idNumero);
                        cmd.Parameters.AddWithValue("@idServicio", objExamenGinecoObstetra.idServicio);
                        cmd.Parameters.AddWithValue("@LNeurologico", objExamenGinecoObstetra.LNeurologico);
                        cmd.Parameters.AddWithValue("@DNeurologico", objExamenGinecoObstetra.DNeurologico);


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

        public Task<DataSet> listaCantidadAtencionNotaIngresoEmgHos(int idCuentaAtencion, int idNumero, int idServicio)
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
                            string sql = "web_listaAtencionNotaIngresoEmgHos";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idNumero", SqlDbType.Int).Value = idNumero;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_listaAtencionNotaIngresoEmgHos");
                //cmd.Parameters.AddWithValue("@idAtencion", idCuentaAtencion);
                //cmd.Parameters.AddWithValue("@idServicio", idServicio);
                //cmd.Parameters.AddWithValue("@idNumero", idNumero);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }
        public Task<DataSet> ListaGinecoObstetraEmeHospi(int idCuentaAtencion, int idNumero, int idServicio)
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
                            string sql = "web_ListaGinecoObstetraEmeHospi";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idNumero", SqlDbType.Int).Value = idNumero;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_ListaGinecoObstetraEmeHospi");
                //cmd.Parameters.AddWithValue("@idAtencion", idCuentaAtencion);
                //cmd.Parameters.AddWithValue("@idServicio", idServicio);
                //cmd.Parameters.AddWithValue("@idNumero", idNumero);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ListaEvalEmergenciaEmeHospi(int idCuentaAtencion, int idNumero, int idServicio)
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
                            string sql = "web_listaEvalEmergenciaEmeHospi";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                            da.SelectCommand.Parameters.Add("@idNumero", SqlDbType.Int).Value = idNumero;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaEvalEmergenciaEmeHospi");
                //cmd.Parameters.AddWithValue("@idAtencion", idCuentaAtencion);
                //cmd.Parameters.AddWithValue("@idServicio", idServicio);
                //cmd.Parameters.AddWithValue("@idNumero", idNumero);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> ListaEvalEmergenciaEmeHospiTotalesByServicio(int idCuentaAtencion, int idNumero, int idServicio) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaEvalEmergenciaEmeHospiTotalesByServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> InsertUpdate_NinioAltoRiesgoAlimentPatologicos(NinioAltoRiesgoAlimentPatologicos objninioAltoRiesgoAlimentPatologicos)
        {
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_NinioAltoRiesgoAlimentPatologicos";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@alimentPrimerosSeisMeses", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.alimentPrimerosSeisMeses;
                            da.SelectCommand.Parameters.Add("@alimentInicioAlimentacionComplementaria", SqlDbType.VarChar).Value = objninioAltoRiesgoAlimentPatologicos.alimentInicioAlimentacionComplementaria;
                            da.SelectCommand.Parameters.Add("@alimentSumplementoFe", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.alimentSumplementoFe;
                            da.SelectCommand.Parameters.Add("@patTbc", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patTbc;
                            da.SelectCommand.Parameters.Add("@patSobaAsma", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patSobaAsma;
                            da.SelectCommand.Parameters.Add("@patEpilepsia", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patEpilepsia;
                            da.SelectCommand.Parameters.Add("@patInfecciones", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patInfecciones;
                            da.SelectCommand.Parameters.Add("@patHospitalizaciones", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patHospitalizaciones;
                            da.SelectCommand.Parameters.Add("@patTransferenciaSangre", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patTransferenciaSangre;
                            da.SelectCommand.Parameters.Add("@patCirugia", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patCirugia;
                            da.SelectCommand.Parameters.Add("@patAlergia", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patAlergia;
                            da.SelectCommand.Parameters.Add("@patOtroAntecedentesDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoAlimentPatologicos.patOtroAntecedentesDesc;
                            da.SelectCommand.Parameters.Add("@patAlergiaDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoAlimentPatologicos.patAlergiaDesc;
                            da.SelectCommand.Parameters.Add("@fechaRegistro", SqlDbType.VarChar).Value = objninioAltoRiesgoAlimentPatologicos.fechaRegistro;
                            da.SelectCommand.Parameters.Add("@fechaUpdate", SqlDbType.VarChar).Value = objninioAltoRiesgoAlimentPatologicos.fechaUpdate;
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.usuarioUpdate;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.idAtencion;
                            da.SelectCommand.Parameters.Add("@patOtroAntecedentes", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patOtroAntecedentes;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.idPaciente;
                            da.SelectCommand.Parameters.Add("@patDisplacia", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patDisplacia;
                            da.SelectCommand.Parameters.Add("@patHipotiroidismo", SqlDbType.Int).Value = objninioAltoRiesgoAlimentPatologicos.patHipotiroidismo;

                            DataSet ds = new DataSet();
                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_NinioAltoRiesgoAlimentPatologicos");
                //cmd.Parameters.AddWithValue("@alimentPrimerosSeisMeses", objninioAltoRiesgoAlimentPatologicos.alimentPrimerosSeisMeses);
                //cmd.Parameters.AddWithValue("@alimentInicioAlimentacionComplementaria", objninioAltoRiesgoAlimentPatologicos.alimentInicioAlimentacionComplementaria);
                //cmd.Parameters.AddWithValue("@alimentSumplementoFe", objninioAltoRiesgoAlimentPatologicos.alimentSumplementoFe);
                //cmd.Parameters.AddWithValue("@patTbc", objninioAltoRiesgoAlimentPatologicos.patTbc);
                //cmd.Parameters.AddWithValue("@patSobaAsma", objninioAltoRiesgoAlimentPatologicos.patSobaAsma);
                //cmd.Parameters.AddWithValue("@patEpilepsia", objninioAltoRiesgoAlimentPatologicos.patEpilepsia);
                //cmd.Parameters.AddWithValue("@patInfecciones", objninioAltoRiesgoAlimentPatologicos.patInfecciones);
                //cmd.Parameters.AddWithValue("@patHospitalizaciones", objninioAltoRiesgoAlimentPatologicos.patHospitalizaciones);
                //cmd.Parameters.AddWithValue("@patTransferenciaSangre", objninioAltoRiesgoAlimentPatologicos.patTransferenciaSangre);
                //cmd.Parameters.AddWithValue("@patCirugia", objninioAltoRiesgoAlimentPatologicos.patCirugia);
                //cmd.Parameters.AddWithValue("@patAlergia", objninioAltoRiesgoAlimentPatologicos.patAlergia);
                //cmd.Parameters.AddWithValue("@patOtroAntecedentesDesc", objninioAltoRiesgoAlimentPatologicos.patOtroAntecedentesDesc);
                //cmd.Parameters.AddWithValue("@patAlergiaDesc", objninioAltoRiesgoAlimentPatologicos.patAlergiaDesc);
                //cmd.Parameters.AddWithValue("@fechaRegistro", objninioAltoRiesgoAlimentPatologicos.fechaRegistro);
                //cmd.Parameters.AddWithValue("@fechaUpdate", objninioAltoRiesgoAlimentPatologicos.fechaUpdate);
                //cmd.Parameters.AddWithValue("@usuarioRegistro", objninioAltoRiesgoAlimentPatologicos.usuarioRegistro);
                //cmd.Parameters.AddWithValue("@usuarioUpdate", objninioAltoRiesgoAlimentPatologicos.usuarioUpdate);
                //cmd.Parameters.AddWithValue("@idAtencion", objninioAltoRiesgoAlimentPatologicos.idAtencion);
                //cmd.Parameters.AddWithValue("@patOtroAntecedentes", objninioAltoRiesgoAlimentPatologicos.patOtroAntecedentes);
                //cmd.Parameters.AddWithValue("@idPaciente", objninioAltoRiesgoAlimentPatologicos.idPaciente);
                //cmd.Parameters.AddWithValue("@patDisplacia", objninioAltoRiesgoAlimentPatologicos.patDisplacia);
                //cmd.Parameters.AddWithValue("@patHipotiroidismo", objninioAltoRiesgoAlimentPatologicos.patHipotiroidismo);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> ListaNinioAltoRiesgoAlimentPatologicos(int idAtencion)
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
                            string sql = "web_listaNinioAltoRiesgoAlimentPatologicos";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_listaNinioAltoRiesgoAlimentPatologicos");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<Boolean> InsertUpdate_NinioAltoRiesgoAntecPerinatales(NinioAltoRiesgoAntecPerinatales objninioAltoRiesgoAntecPerinatales)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_NinioAltoRiesgoAntecPerinatales";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@tipoEmbarazo", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.tipoEmbarazo;
                            da.SelectCommand.Parameters.Add("@patologias", SqlDbType.Text).Value = objninioAltoRiesgoAntecPerinatales.patologias;
                            da.SelectCommand.Parameters.Add("@nroEmbarazo", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.nroEmbarazo;
                            da.SelectCommand.Parameters.Add("@atencionPrenatal", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.atencionPrenatal;
                            da.SelectCommand.Parameters.Add("@nroApn", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.nroApn;
                            da.SelectCommand.Parameters.Add("@lugarApn", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.lugarApn;
                            da.SelectCommand.Parameters.Add("@tipoParto", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.tipoParto;
                            da.SelectCommand.Parameters.Add("@complicacionParto", SqlDbType.Text).Value = objninioAltoRiesgoAntecPerinatales.complicacionParto;
                            da.SelectCommand.Parameters.Add("@lugarParto", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.lugarParto;
                            da.SelectCommand.Parameters.Add("@atendidoPor", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.atendidoPor;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.idAtencion;
                            da.SelectCommand.Parameters.Add("@fechaRegistro", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.fechaRegistro;
                            da.SelectCommand.Parameters.Add("@fechaUpdate", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.fechaUpdate;
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.usuarioUpdate;
                            da.SelectCommand.Parameters.Add("@atendidoPorotro", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.atendidoPorotro;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.idPaciente;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_NinioAltoRiesgoAntecPerinatales");
                //cmd.Parameters.AddWithValue("@tipoEmbarazo", objninioAltoRiesgoAntecPerinatales.tipoEmbarazo);
                //cmd.Parameters.AddWithValue("@patologias", objninioAltoRiesgoAntecPerinatales.patologias);
                //cmd.Parameters.AddWithValue("@nroEmbarazo", objninioAltoRiesgoAntecPerinatales.nroEmbarazo);
                //cmd.Parameters.AddWithValue("@atencionPrenatal", objninioAltoRiesgoAntecPerinatales.atencionPrenatal);
                //cmd.Parameters.AddWithValue("@nroApn", objninioAltoRiesgoAntecPerinatales.nroApn);
                //cmd.Parameters.AddWithValue("@lugarApn", objninioAltoRiesgoAntecPerinatales.lugarApn);
                //cmd.Parameters.AddWithValue("@tipoParto", objninioAltoRiesgoAntecPerinatales.tipoParto);
                //cmd.Parameters.AddWithValue("@complicacionParto", objninioAltoRiesgoAntecPerinatales.complicacionParto);
                //cmd.Parameters.AddWithValue("@lugarParto", objninioAltoRiesgoAntecPerinatales.lugarParto);
                //cmd.Parameters.AddWithValue("@atendidoPor", objninioAltoRiesgoAntecPerinatales.atendidoPor);
                //cmd.Parameters.AddWithValue("@idAtencion", objninioAltoRiesgoAntecPerinatales.idAtencion);
                //cmd.Parameters.AddWithValue("@fechaRegistro", objninioAltoRiesgoAntecPerinatales.fechaRegistro);
                //cmd.Parameters.AddWithValue("@fechaUpdate", objninioAltoRiesgoAntecPerinatales.fechaUpdate);
                //cmd.Parameters.AddWithValue("@usuarioRegistro", objninioAltoRiesgoAntecPerinatales.usuarioRegistro);
                //cmd.Parameters.AddWithValue("@usuarioUpdate", objninioAltoRiesgoAntecPerinatales.usuarioUpdate);
                //cmd.Parameters.AddWithValue("@atendidoPorotro", objninioAltoRiesgoAntecPerinatales.atendidoPorotro);
                //cmd.Parameters.AddWithValue("@idPaciente", objninioAltoRiesgoAntecPerinatales.idPaciente);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<DataSet> ListaNinioAltoRiesgoAntecPerinatales(int idAtencion)
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
                            string sql = "web_listaNinioAltoRiesgoAntecPerinatales";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaNinioAltoRiesgoAntecPerinatales");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<Boolean> InsertUpdate_NinioAltoRiesgoNacimiento(NinioAltoRiesgoNacimiento objninioAltoRiesgoNacimiento)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_NinioAltoRiesgoNacimiento";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@estaGestacionalAlNacer", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.estaGestacionalAlNacer;
                            da.SelectCommand.Parameters.Add("@pesoAlNacer", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.pesoAlNacer;
                            da.SelectCommand.Parameters.Add("@perimetroCefalico", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.perimetroCefalico;
                            da.SelectCommand.Parameters.Add("@perimetroToracico", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.perimetroToracico;
                            da.SelectCommand.Parameters.Add("@inmedito", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.inmedito;
                            da.SelectCommand.Parameters.Add("@apgar1min", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.apgar1min;
                            da.SelectCommand.Parameters.Add("@apgar5min", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.apgar5min;
                            da.SelectCommand.Parameters.Add("@reanimacion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.reanimacion;
                            da.SelectCommand.Parameters.Add("@patologiaNeonatal", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.patologiaNeonatal;
                            da.SelectCommand.Parameters.Add("@patologiaNeonatalDescripcion", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.patologiaNeonatalDescripcion;
                            da.SelectCommand.Parameters.Add("@hospitalizacion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.hospitalizacion;
                            da.SelectCommand.Parameters.Add("@tiempoHospitalizado", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.tiempoHospitalizado;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idAtencion;
                            da.SelectCommand.Parameters.Add("@fechaRegistro", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.fechaRegistro;
                            da.SelectCommand.Parameters.Add("@fechaUpdate", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.fechaUpdate;
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@tallaAlNacer", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.tallaAlNacer;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idPaciente;
                            da.SelectCommand.Parameters.Add("@idClasificacionNar", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idClasificacionNar;
                            da.SelectCommand.Parameters.Add("@idEdadCorregida", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idEdadCorregida;
                            da.SelectCommand.Parameters.Add("@edadCronologica", SqlDbType.DateTime).Value = objninioAltoRiesgoNacimiento.edadCronologica;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_NinioAltoRiesgoNacimiento");
                //cmd.Parameters.AddWithValue("@estaGestacionalAlNacer", objninioAltoRiesgoNacimiento.estaGestacionalAlNacer);
                //cmd.Parameters.AddWithValue("@pesoAlNacer", objninioAltoRiesgoNacimiento.pesoAlNacer);
                //cmd.Parameters.AddWithValue("@perimetroCefalico", objninioAltoRiesgoNacimiento.perimetroCefalico);
                //cmd.Parameters.AddWithValue("@perimetroToracico", objninioAltoRiesgoNacimiento.perimetroToracico);
                //cmd.Parameters.AddWithValue("@inmedito", objninioAltoRiesgoNacimiento.inmedito);
                //cmd.Parameters.AddWithValue("@apgar1min", objninioAltoRiesgoNacimiento.apgar1min);
                //cmd.Parameters.AddWithValue("@apgar5min", objninioAltoRiesgoNacimiento.apgar5min);
                //cmd.Parameters.AddWithValue("@reanimacion", objninioAltoRiesgoNacimiento.reanimacion);
                //cmd.Parameters.AddWithValue("@patologiaNeonatal", objninioAltoRiesgoNacimiento.patologiaNeonatal);
                //cmd.Parameters.AddWithValue("@patologiaNeonatalDescripcion", objninioAltoRiesgoNacimiento.patologiaNeonatalDescripcion);
                //cmd.Parameters.AddWithValue("@hospitalizacion", objninioAltoRiesgoNacimiento.hospitalizacion);
                //cmd.Parameters.AddWithValue("@tiempoHospitalizado", objninioAltoRiesgoNacimiento.tiempoHospitalizado);
                //cmd.Parameters.AddWithValue("@idAtencion", objninioAltoRiesgoNacimiento.idAtencion);
                //cmd.Parameters.AddWithValue("@fechaRegistro", objninioAltoRiesgoNacimiento.fechaRegistro);
                //cmd.Parameters.AddWithValue("@fechaUpdate", objninioAltoRiesgoNacimiento.fechaUpdate);
                //cmd.Parameters.AddWithValue("@usuarioRegistro", objninioAltoRiesgoNacimiento.usuarioRegistro);
                //cmd.Parameters.AddWithValue("@usuarioUpdate", objninioAltoRiesgoNacimiento.usuarioRegistro);
                //cmd.Parameters.AddWithValue("@tallaAlNacer", objninioAltoRiesgoNacimiento.tallaAlNacer);
                //cmd.Parameters.AddWithValue("@idPaciente", objninioAltoRiesgoNacimiento.idPaciente);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }
        public Task<DataSet> ListaNinioAltoRiesgoNacimiento(int idAtencion)
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
                            string sql = "web_listaNinioAltoRiesgoNacimiento";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaNinioAltoRiesgoNacimiento");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }
        public Task<Boolean> InsertUpdate_NinioAltoRiesgoVivienda(NinioAltoRiesgoVivienda objninioAltoRiesgoVivienda)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_InsertUpdate_NinioAltoRiesgoVivienda";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@famiTuberculosis", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiTuberculosis;
                            da.SelectCommand.Parameters.Add("@famiAsma", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiAsma;
                            da.SelectCommand.Parameters.Add("@famiVih", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiVih;
                            da.SelectCommand.Parameters.Add("@famiDiabetes", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiDiabetes;
                            da.SelectCommand.Parameters.Add("@famiEpilepsia", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiEpilepsia;
                            da.SelectCommand.Parameters.Add("@famiAlerMedica", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiAlerMedica;
                            da.SelectCommand.Parameters.Add("@famiViolenciaFami", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiViolenciaFami;
                            da.SelectCommand.Parameters.Add("@famiAlcoholismo", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiAlcoholismo;
                            da.SelectCommand.Parameters.Add("@famiHepatitisB", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiHepatitisB;
                            da.SelectCommand.Parameters.Add("@viviendaAguaPotable", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.viviendaAguaPotable;
                            da.SelectCommand.Parameters.Add("@viviendaDesague", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.viviendaDesague;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.idAtencion;
                            da.SelectCommand.Parameters.Add("@fechaRegistro", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.fechaRegistro;
                            da.SelectCommand.Parameters.Add("@fechaUpdate", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.fechaUpdate;
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.usuarioUpdate;
                            da.SelectCommand.Parameters.Add("@famiTuberculosisDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiTuberculosisDesc;
                            da.SelectCommand.Parameters.Add("@famiAsmaDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiAsmaDesc;
                            da.SelectCommand.Parameters.Add("@famiVihDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiVihDesc;
                            da.SelectCommand.Parameters.Add("@famiDiabetesDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiDiabetesDesc;
                            da.SelectCommand.Parameters.Add("@famiEpilepsiaDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiEpilepsiaDesc;
                            da.SelectCommand.Parameters.Add("@famiAlerMedicaDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiAlerMedicaDesc;
                            da.SelectCommand.Parameters.Add("@famiViolenciaFamiDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiViolenciaFamiDesc;
                            da.SelectCommand.Parameters.Add("@famiAlcoholismoDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiAlcoholismoDesc;
                            da.SelectCommand.Parameters.Add("@famiHepatitisBDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiHepatitisBDesc;
                            da.SelectCommand.Parameters.Add("@viviendaAguaPotableDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.viviendaAguaPotableDesc;
                            da.SelectCommand.Parameters.Add("@viviendaDesagueDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.viviendaDesagueDesc;
                            da.SelectCommand.Parameters.Add("@famiDrogadiccion", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.famiDrogadiccion;
                            da.SelectCommand.Parameters.Add("@famiDrogadiccionDesc", SqlDbType.VarChar).Value = objninioAltoRiesgoVivienda.famiDrogadiccionDesc;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoVivienda.idPaciente;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_InsertUpdate_NinioAltoRiesgoVivienda");
                //cmd.Parameters.AddWithValue("@famiTuberculosis", objninioAltoRiesgoVivienda.famiTuberculosis);
                //cmd.Parameters.AddWithValue("@famiAsma", objninioAltoRiesgoVivienda.famiAsma);
                //cmd.Parameters.AddWithValue("@famiVih", objninioAltoRiesgoVivienda.famiVih);
                //cmd.Parameters.AddWithValue("@famiDiabetes", objninioAltoRiesgoVivienda.famiDiabetes);
                //cmd.Parameters.AddWithValue("@famiEpilepsia", objninioAltoRiesgoVivienda.famiEpilepsia);
                //cmd.Parameters.AddWithValue("@famiAlerMedica", objninioAltoRiesgoVivienda.famiAlerMedica);
                //cmd.Parameters.AddWithValue("@famiViolenciaFami", objninioAltoRiesgoVivienda.famiViolenciaFami);
                //cmd.Parameters.AddWithValue("@famiAlcoholismo", objninioAltoRiesgoVivienda.famiAlcoholismo);
                //cmd.Parameters.AddWithValue("@famiHepatitisB", objninioAltoRiesgoVivienda.famiHepatitisB);
                //cmd.Parameters.AddWithValue("@viviendaAguaPotable", objninioAltoRiesgoVivienda.viviendaAguaPotable);
                //cmd.Parameters.AddWithValue("@viviendaDesague", objninioAltoRiesgoVivienda.viviendaDesague);
                //cmd.Parameters.AddWithValue("@idAtencion", objninioAltoRiesgoVivienda.idAtencion);
                //cmd.Parameters.AddWithValue("@fechaRegistro", objninioAltoRiesgoVivienda.fechaRegistro);
                //cmd.Parameters.AddWithValue("@fechaUpdate", objninioAltoRiesgoVivienda.fechaUpdate);
                //cmd.Parameters.AddWithValue("@usuarioRegistro", objninioAltoRiesgoVivienda.usuarioRegistro);
                //cmd.Parameters.AddWithValue("@usuarioUpdate", objninioAltoRiesgoVivienda.usuarioUpdate);
                //cmd.Parameters.AddWithValue("@famiTuberculosisDesc", objninioAltoRiesgoVivienda.famiTuberculosisDesc);
                //cmd.Parameters.AddWithValue("@famiAsmaDesc", objninioAltoRiesgoVivienda.famiAsmaDesc);
                //cmd.Parameters.AddWithValue("@famiVihDesc", objninioAltoRiesgoVivienda.famiVihDesc);
                //cmd.Parameters.AddWithValue("@famiDiabetesDesc", objninioAltoRiesgoVivienda.famiDiabetesDesc);
                //cmd.Parameters.AddWithValue("@famiEpilepsiaDesc", objninioAltoRiesgoVivienda.famiEpilepsiaDesc);
                //cmd.Parameters.AddWithValue("@famiAlerMedicaDesc", objninioAltoRiesgoVivienda.famiAlerMedicaDesc);
                //cmd.Parameters.AddWithValue("@famiViolenciaFamiDesc", objninioAltoRiesgoVivienda.famiViolenciaFamiDesc);
                //cmd.Parameters.AddWithValue("@famiAlcoholismoDesc", objninioAltoRiesgoVivienda.famiAlcoholismoDesc);
                //cmd.Parameters.AddWithValue("@famiHepatitisBDesc", objninioAltoRiesgoVivienda.famiHepatitisBDesc);
                //cmd.Parameters.AddWithValue("@viviendaAguaPotableDesc", objninioAltoRiesgoVivienda.viviendaAguaPotableDesc);
                //cmd.Parameters.AddWithValue("@viviendaDesagueDesc", objninioAltoRiesgoVivienda.viviendaDesagueDesc);
                //cmd.Parameters.AddWithValue("@famiDrogadiccion", objninioAltoRiesgoVivienda.famiDrogadiccion);
                //cmd.Parameters.AddWithValue("@famiDrogadiccionDesc", objninioAltoRiesgoVivienda.famiDrogadiccionDesc);
                //cmd.Parameters.AddWithValue("@idPaciente", objninioAltoRiesgoVivienda.idPaciente);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }
        public Task<DataSet> ListaNinioAltoRiesgoVivienda(int idAtencion)
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
                            string sql = "web_listaNinioAltoRiesgoVivienda";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_listaNinioAltoRiesgoVivienda");
                //cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> AtenInteItemDesarrolloPacientePendiente(AtenIntePlanIntePaciente obj)
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
                            string sql = "AtenInteItemDesarrolloPacientePendiente";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtenInteGrupo", SqlDbType.Int).Value = (obj.idAtenInteGrupo == 0) ? 0 : obj.idAtenInteGrupo;
                            da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = (obj.idPaciente == 0) ? 0 : obj.idPaciente;
                            da.SelectCommand.Parameters.Add("@IdAtenInteItemPlan", SqlDbType.Int).Value = (obj.idAtenInteItemPlan == 0) ? 0 : obj.idAtenInteItemPlan;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = (obj.idAtencion == 0) ? 0 : obj.idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("AtenInteItemDesarrolloPacientePendiente");
                ////(antecedQuirurgico == null) ? "" : antecedQuirurgico)
                //cmd.Parameters.AddWithValue("@IdAtenInteGrupo", (obj.idAtenInteGrupo == 0) ? 0 : obj.idAtenInteGrupo);
                //cmd.Parameters.AddWithValue("@IdPaciente", (obj.idPaciente == 0) ? 0 : obj.idPaciente);
                //cmd.Parameters.AddWithValue("@IdAtenInteItemPlan", (obj.idAtenInteItemPlan == 0) ? 0 : obj.idAtenInteItemPlan);
                //cmd.Parameters.AddWithValue("@IdAtencion", (obj.idAtencion == 0) ? 0 : obj.idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<DataSet> AtenInteListarDesarrolloPacientePendientesDet(AtenIntePlanIntePaciente obj)
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
                            string sql = "AtenInteListarDesarrolloPacientePendientesDet";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtenInteGrupo", SqlDbType.Int).Value = (obj.idAtenInteGrupo == 0) ? 0 : obj.idAtenInteGrupo;
                            da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = (obj.idPaciente == 0) ? 0 : obj.idPaciente;
                            da.SelectCommand.Parameters.Add("@IdAtenInteItemPlan", SqlDbType.Int).Value = (obj.idAtenInteItemPlan == 0) ? 0 : obj.idAtenInteItemPlan;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = (obj.idAtencion == 0) ? 0 : obj.idAtencion;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("AtenInteListarDesarrolloPacientePendientesDet");
                ////(antecedQuirurgico == null) ? "" : antecedQuirurgico)
                //cmd.Parameters.AddWithValue("@IdAtenInteGrupo", (obj.idAtenInteGrupo == 0) ? 0 : obj.idAtenInteGrupo);
                //cmd.Parameters.AddWithValue("@IdPaciente", (obj.idPaciente == 0) ? 0 : obj.idPaciente);
                //cmd.Parameters.AddWithValue("@IdAtenInteItemPlan", (obj.idAtenInteItemPlan == 0) ? 0 : obj.idAtenInteItemPlan);
                //cmd.Parameters.AddWithValue("@IdAtencion", (obj.idAtencion == 0) ? 0 : obj.idAtencion);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<Boolean> Insert_AtenIntePlanDesPacienteDet(int idPlanDesarrolloPaciente, int idPlanIntegralPacient, List<AtenIntePlanDesPacienteDet> ds)
        {
            DataSet ds1 = new DataSet();
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            try
            {
                string xmlItems;
                xmlItems = XmlUtil.Serializer(typeof(List<AtenIntePlanDesPacienteDet>), ds);

                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_Insert_AtenIntePlanDesPacienteDet";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@items", SqlDbType.Xml).Value = xmlItems;
                            da.SelectCommand.Parameters.Add("@idPlanDesarrolloPaciente", SqlDbType.Int).Value = idPlanDesarrolloPaciente;
                            da.SelectCommand.Parameters.Add("@idPlanIntegralPacient", SqlDbType.Int).Value = idPlanIntegralPacient;

                            da.Fill(ds1);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_Insert_AtenIntePlanDesPacienteDet");
                //cmd.Parameters.AddWithValue("@items", xmlItems);
                //cmd.Parameters.AddWithValue("@idPlanDesarrolloPaciente", idPlanDesarrolloPaciente);
                //cmd.Parameters.AddWithValue("@idPlanIntegralPacient", idPlanIntegralPacient);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<Boolean> Insert_Update_AtenIntePlanDesarrolloPaciente(AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "web_Insert_Update_AtenIntePlanDesarrolloPaciente";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPlanDesarrolloPaciente", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente;
                            da.SelectCommand.Parameters.Add("@idPlanIntegralPaciente", SqlDbType.BigInt).Value = objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente;
                            da.SelectCommand.Parameters.Add("@evaluacion", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.evaluacion;
                            da.SelectCommand.Parameters.Add("@idPlanAtencion", SqlDbType.Int).Value = (objAtenIntePlanDesarrolloPaciente.idPlanAtencion);
                            da.SelectCommand.Parameters.Add("@idAtenInteItemPlan", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idAtenInteItemPlan;
                            da.SelectCommand.Parameters.Add("@fechaProgramada", SqlDbType.DateTime).Value = objAtenIntePlanDesarrolloPaciente.fechaProgramada;
                            da.SelectCommand.Parameters.Add("@fechaEjecucion", SqlDbType.DateTime).Value = objAtenIntePlanDesarrolloPaciente.fechaEjecucion;
                            da.SelectCommand.Parameters.Add("@numeroSesion", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.numeroSesion;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idAtencion;
                            da.SelectCommand.Parameters.Add("@idEstablecimiento", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idEstablecimiento;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("web_Insert_Update_AtenIntePlanDesarrolloPaciente");
                //cmd.Parameters.AddWithValue("@idPlanDesarrolloPaciente", objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente);
                //cmd.Parameters.AddWithValue("@idPlanIntegralPaciente", objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente);
                //cmd.Parameters.AddWithValue("@evaluacion", objAtenIntePlanDesarrolloPaciente.evaluacion);
                //cmd.Parameters.AddWithValue("@idPlanAtencion", (objAtenIntePlanDesarrolloPaciente.idPlanAtencion));
                //cmd.Parameters.AddWithValue("@idAtenInteItemPlan", objAtenIntePlanDesarrolloPaciente.idAtenInteItemPlan);
                //cmd.Parameters.AddWithValue("@fechaProgramada", objAtenIntePlanDesarrolloPaciente.fechaProgramada);
                //cmd.Parameters.AddWithValue("@fechaEjecucion", objAtenIntePlanDesarrolloPaciente.fechaEjecucion);
                //cmd.Parameters.AddWithValue("@numeroSesion", objAtenIntePlanDesarrolloPaciente.numeroSesion);
                //cmd.Parameters.AddWithValue("@idAtencion", objAtenIntePlanDesarrolloPaciente.idAtencion);
                //cmd.Parameters.AddWithValue("@idEstablecimiento", objAtenIntePlanDesarrolloPaciente.idEstablecimiento);

                ////cmd.ExecuteNonQuery();
                //await cmd.ExecuteNonQueryAsync();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        

        public Task<DataSet> AtenInteListarDesarrolloPacienteDetPorId(AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente)
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
                            string sql = "AtenInteListarDesarrolloPacienteDetPorId";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPlanIntegralPaciente", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente;
                            da.SelectCommand.Parameters.Add("@idPlanDesarrolloPaciente", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("AtenInteListarDesarrolloPacienteDetPorId");
                //cmd.Parameters.AddWithValue("@idPlanIntegralPaciente", objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente);
                //cmd.Parameters.AddWithValue("@idPlanDesarrolloPaciente", objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }

        public Task<Boolean> AtenInteGenerarPlanTotal(AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "AtenInteGenerarPlanTotal";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@idPlanIntegralPaciente", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente;
                            da.SelectCommand.Parameters.Add("@IdAtenInteGrupo", SqlDbType.Int).Value = 1;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = (objAtenIntePlanDesarrolloPaciente.idPaciente);
                            da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = objAtenIntePlanDesarrolloPaciente.idUsuario;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("AtenInteGenerarPlanTotal");
                //cmd.Parameters.AddWithValue("@idPlanIntegralPaciente", objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente);
                //cmd.Parameters.AddWithValue("@IdAtenInteGrupo", 1);
                //cmd.Parameters.AddWithValue("@idPaciente", (objAtenIntePlanDesarrolloPaciente.idPaciente));
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", objAtenIntePlanDesarrolloPaciente.idUsuario);
                //cmd.ExecuteNonQuery();
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }

        public Task<Boolean> InsertUpdateAtencionDatosAdicionales(AtencionesDatosAdicionales objAtencionesDatosAdicionales) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertUpdateAtencionDatosAdicionales";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", objAtencionesDatosAdicionales.idAtencion);
                        cmd.Parameters.AddWithValue("@DireccionDomicilio", objAtencionesDatosAdicionales.DireccionDomicilio);
                        cmd.Parameters.AddWithValue("@NombreAcompaniante", objAtencionesDatosAdicionales.NombreAcompaniante);
                        cmd.Parameters.AddWithValue("@Observacion", objAtencionesDatosAdicionales.Observacion);
                        cmd.Parameters.AddWithValue("@ProximaCita", objAtencionesDatosAdicionales.ProximaCita);
                        cmd.Parameters.AddWithValue("@NumeroDeHijos", objAtencionesDatosAdicionales.NumeroDeHijos);
                        cmd.Parameters.AddWithValue("@IdSiaSis", objAtencionesDatosAdicionales.IdSiaSis);
                        cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", objAtencionesDatosAdicionales.FuaCodigoPrestacion);
                        cmd.Parameters.AddWithValue("@SisCodigo", objAtencionesDatosAdicionales.SisCodigo);
                        cmd.Parameters.AddWithValue("@IdTipoReferenciaOrigen", objAtencionesDatosAdicionales.IdTipoReferenciaOrigen);
                        cmd.Parameters.AddWithValue("@IdTipoReferenciaDestino", objAtencionesDatosAdicionales.IdTipoReferenciaDestino);
                        cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", objAtencionesDatosAdicionales.IdEstablecimientoOrigen);
                        cmd.Parameters.AddWithValue("@IdEstablecimientoDestino", objAtencionesDatosAdicionales.IdEstablecimientoDestino);
                        cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaOrigen", objAtencionesDatosAdicionales.IdEstablecimientoNoMinsaOrigen);
                        cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaDestino", objAtencionesDatosAdicionales.IdEstablecimientoNoMinsaDestino);
                        cmd.Parameters.AddWithValue("@HuboInfeccionIntraHospitalaria", objAtencionesDatosAdicionales.HuboInfeccionIntraHospitalaria);
                        cmd.Parameters.AddWithValue("@TieneNecropsia", objAtencionesDatosAdicionales.TieneNecropsia);
                        cmd.Parameters.AddWithValue("@IdMedicoRespNacimiento", objAtencionesDatosAdicionales.IdMedicoRespNacimiento);
                        cmd.Parameters.AddWithValue("@RecienNacido", objAtencionesDatosAdicionales.RecienNacido);
                        cmd.Parameters.AddWithValue("@NroReferenciaOrigen", objAtencionesDatosAdicionales.NroReferenciaOrigen);
                        cmd.Parameters.AddWithValue("@NroReferenciaDestino", objAtencionesDatosAdicionales.NroReferenciaDestino);
                        cmd.Parameters.AddWithValue("@SeImprimioFicha", objAtencionesDatosAdicionales.SeImprimioFicha);
                        cmd.Parameters.AddWithValue("@idAtencionEmeg_CE", objAtencionesDatosAdicionales.idAtencionEmeg_CE);
                        cmd.Parameters.AddWithValue("@idTipoConsultaProxCita", objAtencionesDatosAdicionales.idTipoConsultaProxCita);
                        cmd.Parameters.AddWithValue("@Tratamiento", objAtencionesDatosAdicionales.Tratamiento);
                        cmd.Parameters.AddWithValue("@PlanTrabajo", objAtencionesDatosAdicionales.PlanTrabajo);
                        cmd.Parameters.AddWithValue("@apetito", objAtencionesDatosAdicionales.apetito);
                        cmd.Parameters.AddWithValue("@orina", objAtencionesDatosAdicionales.orina);
                        cmd.Parameters.AddWithValue("@sed", objAtencionesDatosAdicionales.sed);
                        cmd.Parameters.AddWithValue("@suenio", objAtencionesDatosAdicionales.suenio);
                        cmd.Parameters.AddWithValue("@deposiciones", objAtencionesDatosAdicionales.deposiciones);

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
        public Task<Boolean> InsertUpdateEvaluacionEmergenciaDetalle(EvaluacionEmergenciaDetalle objEvaluacionEmergenciaDetalle) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertUpdateEvaluacionEmergenciaDetalle";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdAtencion", objEvaluacionEmergenciaDetalle.IdAtencion);
                        cmd.Parameters.AddWithValue("@IdNumero", objEvaluacionEmergenciaDetalle.IdNumero);
                        cmd.Parameters.AddWithValue("@Seguimiento", objEvaluacionEmergenciaDetalle.Seguimiento);
                        cmd.Parameters.AddWithValue("@Indicaciones", objEvaluacionEmergenciaDetalle.Indicaciones);
                        cmd.Parameters.AddWithValue("@IdUsuario", objEvaluacionEmergenciaDetalle.IdUsuario);
                        cmd.Parameters.AddWithValue("@fecha", objEvaluacionEmergenciaDetalle.fecha);
                        cmd.Parameters.AddWithValue("@PlandeTrabajo", objEvaluacionEmergenciaDetalle.PlandeTrabajo);
                        cmd.Parameters.AddWithValue("@FechaActualizacion", objEvaluacionEmergenciaDetalle.FechaActualizacion);
                        cmd.Parameters.AddWithValue("@idservicio", objEvaluacionEmergenciaDetalle.idservicio);
                        cmd.Parameters.AddWithValue("@HoraInicioAtencion", objEvaluacionEmergenciaDetalle.HoraInicioAtencion);

                        da.InsertCommand = cmd;

                        if (da.InsertCommand.ExecuteNonQuery() > 0)
                        {
                            conn.Close();
                            return true;
                        }
                        conn.Close();
                        return false;
                    }
                }
            });
        }

        public Task<DataSet> ListaEvaluacionEmergenciaDetalle(EvaluacionEmergenciaDetalle obj)
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
                            string sql = "web_ListaEvaluacionEmergenciaDetalle";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = obj.IdAtencion;
                            da.SelectCommand.Parameters.Add("@IdNumero", SqlDbType.Int).Value = obj.IdNumero;
                            da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = obj.idservicio;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_ListaEvaluacionEmergenciaDetalle");
                //cmd.Parameters.AddWithValue("@IdAtencion", obj.IdAtencion);
                //cmd.Parameters.AddWithValue("@IdNumero", obj.IdNumero);
                //cmd.Parameters.AddWithValue("@idServicio", obj.idservicio);

                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }



        public async Task<(int IdCuentaAtencionOut, int IdAtencionOut)> CrearModificarCuentasGeneral(CuentasAtencionesGeneral cuentasAtencionesGeneral, int IdUsuarioAuditoria) // JDELGADO001.2
        {
            int IdCuentaAtencionOut;
            int IdAtencionOut;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "Web_CrearModificarCuentasGeneral";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@IdCuentaAtencionOut", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@IdAtencionOut", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@TotalPorPagar", cuentasAtencionesGeneral.TotalPorPagar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstado", cuentasAtencionesGeneral.IdEstado);
                cmd.Parameters.AddWithValue("@TotalPagado", cuentasAtencionesGeneral.TotalPagado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalAsegurado", cuentasAtencionesGeneral.TotalAsegurado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalExonerado", cuentasAtencionesGeneral.TotalExonerado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraCierre", cuentasAtencionesGeneral.HoraCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaCierre", cuentasAtencionesGeneral.FechaCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraApertura", cuentasAtencionesGeneral.HoraApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaApertura", cuentasAtencionesGeneral.FechaApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaciente", cuentasAtencionesGeneral.IdPaciente);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", cuentasAtencionesGeneral.IdCuentaAtencion);


                cmd.Parameters.AddWithValue("@HoraIngreso", cuentasAtencionesGeneral.horaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaIngreso", cuentasAtencionesGeneral.fechaIngreso);
                cmd.Parameters.AddWithValue("@IdTipoServicio", cuentasAtencionesGeneral.idTipoServicio);
                cmd.Parameters.AddWithValue("@IdAtencion", cuentasAtencionesGeneral.idAtencion);
                cmd.Parameters.AddWithValue("@IdTipoCondicionALEstab", cuentasAtencionesGeneral.idTipoCondicionALEstab ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgresoAdministrativo", cuentasAtencionesGeneral.FechaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaEgreso", cuentasAtencionesGeneral.idCamaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaIngreso", cuentasAtencionesGeneral.idCamaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdServicioEgreso", Convert.DBNull); // JDELGADO CAMBIAR DESPUES
                cmd.Parameters.AddWithValue("@IdTipoAlta", cuentasAtencionesGeneral.idTipoAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCondicionAlta", cuentasAtencionesGeneral.idCondicionAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoEdad", cuentasAtencionesGeneral.idTipoEdad);
                cmd.Parameters.AddWithValue("@IdOrigenAtencion", cuentasAtencionesGeneral.idOrigenAtencion);
                cmd.Parameters.AddWithValue("@IdDestinoAtencion", cuentasAtencionesGeneral.idDestinoAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgresoAdministrativo", cuentasAtencionesGeneral.horaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoCondicionAlServicio", cuentasAtencionesGeneral.idTipoCondicionAlServicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgreso", cuentasAtencionesGeneral.horaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgreso", cuentasAtencionesGeneral.fechaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoEgreso", cuentasAtencionesGeneral.idMedicoEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Edad", cuentasAtencionesGeneral.edad);
                cmd.Parameters.AddWithValue("@IdEspecialidadMedico", cuentasAtencionesGeneral.idEspecialidadMedico);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", cuentasAtencionesGeneral.idMedicoIngreso);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", cuentasAtencionesGeneral.idServicioIngreso);
                cmd.Parameters.AddWithValue("@IdTipoGravedad", cuentasAtencionesGeneral.idTipoGravedad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idFormaPago", cuentasAtencionesGeneral.idFormaPago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", cuentasAtencionesGeneral.idFuenteFinanciamiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idEstadoAtencion", cuentasAtencionesGeneral.idEstadoAtencion);
                cmd.Parameters.AddWithValue("@EsPacienteExterno", cuentasAtencionesGeneral.esPacienteExterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idSunasaPacienteHistorico", cuentasAtencionesGeneral.idSunasaPacienteHistorico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@EsDecretoUrgencia", cuentasAtencionesGeneral.esDecretoUrgencia ?? Convert.DBNull);


                cmd.Parameters.AddWithValue("@DireccionDomicilio", cuentasAtencionesGeneral.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreAcompaniante", cuentasAtencionesGeneral.NombreAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TelefonoAcompaniante", Convert.DBNull);
                cmd.Parameters.AddWithValue("@Observacion", cuentasAtencionesGeneral.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ProximaCita", cuentasAtencionesGeneral.ProximaCita ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NumeroDeHijos", cuentasAtencionesGeneral.NumeroDeHijos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSiaSis", cuentasAtencionesGeneral.IdSiaSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", cuentasAtencionesGeneral.FuaCodigoPrestacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SisCodigo", cuentasAtencionesGeneral.SisCodigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaDestino", cuentasAtencionesGeneral.IdTipoReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaOrigen", cuentasAtencionesGeneral.IdTipoReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoDestino", cuentasAtencionesGeneral.IdEstablecimientoDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", cuentasAtencionesGeneral.IdEstablecimientoOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaDestino", cuentasAtencionesGeneral.IdEstablecimientoNoMinsaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaOrigen", cuentasAtencionesGeneral.IdEstablecimientoNoMinsaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HuboInfeccionIntraHospitalaria", cuentasAtencionesGeneral.HuboInfeccionIntraHospitalaria ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TieneNecropsia", cuentasAtencionesGeneral.TieneNecropsia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoRespNacimiento", cuentasAtencionesGeneral.IdMedicoRespNacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@RecienNacido", cuentasAtencionesGeneral.RecienNacido ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", cuentasAtencionesGeneral.NroReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaDestino", cuentasAtencionesGeneral.NroReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEnvioSis", cuentasAtencionesGeneral.NroEnvioSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdReferencia", Convert.DBNull);
                cmd.Parameters.AddWithValue("@ObservacionLaboratorio", cuentasAtencionesGeneral.ObservacionLaboratorio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaRecepcion", cuentasAtencionesGeneral.FechaRecepcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraRecepcion", cuentasAtencionesGeneral.HoraRecepcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPersonaAcreditaMuestra", cuentasAtencionesGeneral.IdPersonaAcreditaMuestra ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", cuentasAtencionesGeneral.ObservacionSegundaMuestraTamizaje);
                cmd.Parameters.AddWithValue("@ObservacionSis", cuentasAtencionesGeneral.ObservacionSis);


                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                IdCuentaAtencionOut = (int)cmd.Parameters["@IdCuentaAtencionOut"].Value;
                IdAtencionOut = (int)cmd.Parameters["@IdAtencionOut"].Value;
                await conn.CloseAsync();

                return (IdCuentaAtencionOut, IdAtencionOut);
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return (-1, -1);
            }
        }



        public async Task<int> CrearModificarFacturacionCuentasAtencion(FacturacionCuentasAtencion objFacturacionCuentasAtencion, int IdUsuarioAuditoria) // JDELGADO001.2
        {

            int nRpta;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "web_crearModificarFacturacionCuentasAtencion";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@TotalPorPagar", objFacturacionCuentasAtencion.TotalPorPagar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstado", objFacturacionCuentasAtencion.IdEstado);
                cmd.Parameters.AddWithValue("@TotalPagado", objFacturacionCuentasAtencion.TotalPagado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalAsegurado", objFacturacionCuentasAtencion.TotalAsegurado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalExonerado", objFacturacionCuentasAtencion.TotalExonerado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraCierre", objFacturacionCuentasAtencion.HoraCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaCierre", objFacturacionCuentasAtencion.FechaCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraApertura", objFacturacionCuentasAtencion.HoraApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaApertura", objFacturacionCuentasAtencion.FechaApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaciente", objFacturacionCuentasAtencion.IdPaciente);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", objFacturacionCuentasAtencion.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFacturacionCuentasAtencion.FechaCreacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                await conn.CloseAsync();

                return nRpta;
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return -1;
            }

            //return Task.Run(async () =>
            //{
            //    using ()
            //    {
            //        using (SqlDataAdapter da = new SqlDataAdapter())
            //        {

            //        }
            //    }
            //});
        }

        public async Task<int> CrearModificarAtenciones(Atenciones objAtenciones, int IdUsuarioAuditoria) // JDELGADO001.2
        {
            int nRpta;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "web_crearModificarAtenciones";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@HoraIngreso", objAtenciones.horaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaIngreso", objAtenciones.fechaIngreso);
                cmd.Parameters.AddWithValue("@IdTipoServicio", objAtenciones.idTipoServicio);
                cmd.Parameters.AddWithValue("@IdPaciente", objAtenciones.idPaciente);
                cmd.Parameters.AddWithValue("@IdAtencion", objAtenciones.idAtencion);
                cmd.Parameters.AddWithValue("@IdTipoCondicionALEstab", objAtenciones.idTipoCondicionALEstab ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgresoAdministrativo", objAtenciones.FechaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaEgreso", objAtenciones.idCamaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaIngreso", objAtenciones.idCamaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdServicioEgreso", Convert.DBNull); // JDELGADO CAMBIAR DESPUES
                cmd.Parameters.AddWithValue("@IdTipoAlta", objAtenciones.idTipoAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCondicionAlta", objAtenciones.idCondicionAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoEdad", objAtenciones.idTipoEdad);
                cmd.Parameters.AddWithValue("@IdOrigenAtencion", objAtenciones.idOrigenAtencion);
                cmd.Parameters.AddWithValue("@IdDestinoAtencion", objAtenciones.idDestinoAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgresoAdministrativo", objAtenciones.horaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoCondicionAlServicio", objAtenciones.idTipoCondicionAlServicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgreso", objAtenciones.horaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgreso", objAtenciones.fechaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoEgreso", objAtenciones.idMedicoEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Edad", objAtenciones.edad);
                cmd.Parameters.AddWithValue("@IdEspecialidadMedico", objAtenciones.idEspecialidadMedico);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", objAtenciones.idMedicoIngreso);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", objAtenciones.idServicioIngreso);
                cmd.Parameters.AddWithValue("@IdTipoGravedad", objAtenciones.idTipoGravedad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", objAtenciones.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idFormaPago", objAtenciones.idFormaPago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", objAtenciones.idFuenteFinanciamiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idEstadoAtencion", objAtenciones.idEstadoAtencion);
                cmd.Parameters.AddWithValue("@EsPacienteExterno", objAtenciones.esPacienteExterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idSunasaPacienteHistorico", objAtenciones.idSunasaPacienteHistorico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@EsDecretoUrgencia", objAtenciones.esDecretoUrgencia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PacienteCronico", objAtenciones.esPacienteCronico); //RMOREANO 06032026

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                await conn.CloseAsync();

                return nRpta;
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return -1;
            }
        }

        public Task<DataSet> AtencionesDatosAdicionalesSeleccionarPorIdCuenta(int idCuentaAtencion) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "AtencionesDatosAdicionalesSeleccionarPorIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> web_AtencionesDatosAdicionalesSeleccionarPorIdCuenta(int idCuentaAtencion) // JDELGADO012
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDatosAdicionalesSeleccionarPorIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lnIdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> web_buscarEstablecimientoPorTipoMinsa(int idTipo, int idEstablecimiento) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_buscarEstablecimientoPorTipoMinsa";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idTipo", SqlDbType.Int).Value = idTipo;
                        da.SelectCommand.Parameters.Add("@idEstablecimiento", SqlDbType.Int).Value = idEstablecimiento;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(int idNumero, int idAtencion, int clasifiacionDiagnostico, int idServicio)  // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso";
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

        public Task<DataSet> AtencionesDiagnosticosSeleccionarPorInterconsulta(int idAtencion, int clasifiacionDiagnostico, int idServicio, int idAtencionInterconsulta)  // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDiagnosticosSeleccionarPorInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@Tipodiagnostico", SqlDbType.Int).Value = clasifiacionDiagnostico;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdAtencionInterconsulta", SqlDbType.Int).Value = idAtencionInterconsulta;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public async Task<int> CrearModificarAtencionesDatosAdicionales(AtencionesDatosAdicionales atencionesDatosAdicionales, int IdUsuarioAuditoria) // // JDELGADO003-C
        {
            int nRpta;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "web_crearModificarAtencionesDatosAdicionales";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@idAtencion", atencionesDatosAdicionales.idAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DireccionDomicilio", atencionesDatosAdicionales.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreAcompaniante", atencionesDatosAdicionales.NombreAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TelefonoAcompaniante", Convert.DBNull);
                cmd.Parameters.AddWithValue("@Observacion", atencionesDatosAdicionales.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ProximaCita", atencionesDatosAdicionales.ProximaCita ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NumeroDeHijos", atencionesDatosAdicionales.NumeroDeHijos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSiaSis", atencionesDatosAdicionales.IdSiaSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", atencionesDatosAdicionales.FuaCodigoPrestacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SisCodigo", atencionesDatosAdicionales.SisCodigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaDestino", atencionesDatosAdicionales.IdTipoReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaOrigen", atencionesDatosAdicionales.IdTipoReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoDestino", atencionesDatosAdicionales.IdEstablecimientoDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", atencionesDatosAdicionales.IdEstablecimientoOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaDestino", atencionesDatosAdicionales.IdEstablecimientoNoMinsaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaOrigen", atencionesDatosAdicionales.IdEstablecimientoNoMinsaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HuboInfeccionIntraHospitalaria", atencionesDatosAdicionales.HuboInfeccionIntraHospitalaria ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TieneNecropsia", atencionesDatosAdicionales.TieneNecropsia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoRespNacimiento", atencionesDatosAdicionales.IdMedicoRespNacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@RecienNacido", atencionesDatosAdicionales.RecienNacido ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", atencionesDatosAdicionales.NroReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaDestino", atencionesDatosAdicionales.NroReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEnvioSis", atencionesDatosAdicionales.NroEnvioSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdReferencia", Convert.DBNull);
                cmd.Parameters.AddWithValue("@ObservacionLaboratorio", atencionesDatosAdicionales.ObservacionLaboratorio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaRecepcion", atencionesDatosAdicionales.FechaRecepcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraRecepcion", atencionesDatosAdicionales.HoraRecepcion ?? Convert.DBNull);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                await conn.CloseAsync();

                return nRpta;
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return -1;
            }

        }

        public async Task<int> CrearModificarAtencionesDatosAdicionalesTamizaje(AtencionesDatosAdicionales atencionesDatosAdicionales, int IdUsuarioAuditoria) // // JDELGADO003-C
        {
            int nRpta;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "web_crearModificarAtencionesDatosAdicionalesTamizaje";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@idAtencion", atencionesDatosAdicionales.idAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DireccionDomicilio", atencionesDatosAdicionales.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreAcompaniante", atencionesDatosAdicionales.NombreAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TelefonoAcompaniante", Convert.DBNull);
                cmd.Parameters.AddWithValue("@Observacion", atencionesDatosAdicionales.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ProximaCita", atencionesDatosAdicionales.ProximaCita ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NumeroDeHijos", atencionesDatosAdicionales.NumeroDeHijos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSiaSis", atencionesDatosAdicionales.IdSiaSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", atencionesDatosAdicionales.FuaCodigoPrestacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SisCodigo", atencionesDatosAdicionales.SisCodigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaDestino", atencionesDatosAdicionales.IdTipoReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaOrigen", atencionesDatosAdicionales.IdTipoReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoDestino", atencionesDatosAdicionales.IdEstablecimientoDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", atencionesDatosAdicionales.IdEstablecimientoOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaDestino", atencionesDatosAdicionales.IdEstablecimientoNoMinsaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaOrigen", atencionesDatosAdicionales.IdEstablecimientoNoMinsaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HuboInfeccionIntraHospitalaria", atencionesDatosAdicionales.HuboInfeccionIntraHospitalaria ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TieneNecropsia", atencionesDatosAdicionales.TieneNecropsia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoRespNacimiento", atencionesDatosAdicionales.IdMedicoRespNacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@RecienNacido", atencionesDatosAdicionales.RecienNacido ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", atencionesDatosAdicionales.NroReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaDestino", atencionesDatosAdicionales.NroReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEnvioSis", atencionesDatosAdicionales.NroEnvioSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdReferencia", Convert.DBNull);
                cmd.Parameters.AddWithValue("@ObservacionLaboratorio", atencionesDatosAdicionales.ObservacionLaboratorio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaRecepcion", atencionesDatosAdicionales.FechaRecepcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraRecepcion", atencionesDatosAdicionales.HoraRecepcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPersonaAcreditaMuestra", atencionesDatosAdicionales.IdPersonaAcreditaMuestra ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", atencionesDatosAdicionales.ObservacionSegundaMuestraTamizaje);
                cmd.Parameters.AddWithValue("@ObservacionSis", atencionesDatosAdicionales.ObservacionSis);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                await conn.CloseAsync();

                return nRpta;
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return -1;
            }

        }

        public Task<DataSet> web_listarEvalEmergenciaByNroHistoria(int nroHistoria) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listarEvalEmergenciaByNroHistoria";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = nroHistoria;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<int> web_crearModificarFua(int idCuentaAtencion) // para el fua
        {

            //int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                //using (SqlConnection conn = cx.obtenerConexion())     //JDELGADO
                using (SqlConnection conn = cx.obtenerConexionExterna())          //KHOYOSI
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "SIGH_EXTERNA..web_SisFuaAtencionCrearModificar";          ////JDELGADO
                        string sql = "web_SisFuaAtencionCrearModificar";      //KHOYOSI
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                        cmd.ExecuteNonQuery();

                        return 1;
                    }
                }
            });
        }

        public Task<DataSet> ListaAtencionByIdCuentaAtencionInterConsulta(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaAtencionByIdCuentaAtencionInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<int> UpdateProCabecera(int idProCabecera, int? estado, DateTime fechaFin, int usuarioFin, string motivoCierreCiclo) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_updateProCabecera";
                        try
                        {
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idProCabecera", idProCabecera);
                            cmd.Parameters.AddWithValue("@estado", estado ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@fechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@usuarioFin", usuarioFin);
                            cmd.Parameters.AddWithValue("@motivoCierreCiclo", motivoCierreCiclo ?? Convert.DBNull);

                            cmd.ExecuteNonQuery();
                            return 1;
                        }
                        catch (Exception)
                        {
                            return 0; throw;
                        }
                    }
                }
            });
        }

        public Task<DataSet> ListarCabecerasCiclosCerrados(int idPaciente) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarCabecerasCiclosCerrados";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFuasbyFecha(int mes, int anio) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_EXTERNA..Web_ListaFuasByFechas";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@mes", mes);
                        da.SelectCommand.Parameters.AddWithValue("@anio", anio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        /////////////////////////////KHOYOSI/////////////////////////////////////////////////////////
        public Task<DataSet> ListaAtencionEstadosCompletosByIdCuentaV2(int idCuentaAtencion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaAtencionEstadosCompletosByIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////
        ///

        public Task<DataSet> GenerarTramaJsonParaEnvioByIdCuentaAtencion(int idCuentaAtencion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_GenerarTramaJsonParaEnvioByIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GenerarTramaJsonParaEnvioContraRefByIdCuentaAtencion(int idCuentaAtencion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_GenerarTramaJsonParaEnvioContraRefByIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROSTamizaje(int NroCuenta, int HistoriaClinica, string ApellidoPaterno, string ApellidoMaterno, string FechaIngreso) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS_Tamizaje";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                        da.SelectCommand.Parameters.AddWithValue("@HistoriaClinica", HistoriaClinica);
                        da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                        da.SelectCommand.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                        da.SelectCommand.Parameters.AddWithValue("@FechaIngreso", FechaIngreso);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS(int NroCuenta, int HistoriaClinica, string ApellidoPaterno, string FechaIngreso) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                        da.SelectCommand.Parameters.AddWithValue("@HistoriaClinica", HistoriaClinica);
                        da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                        da.SelectCommand.Parameters.AddWithValue("@FechaIngreso", FechaIngreso);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarAtencionesInmunizaciones(int NroCuenta, int HistoriaClinica, string ApellidoPaterno, string FechaIngreso) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarAtencionesInmunizaciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@NroCuenta", NroCuenta);
                        da.SelectCommand.Parameters.AddWithValue("@HistoriaClinica", HistoriaClinica);
                        da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                        da.SelectCommand.Parameters.AddWithValue("@FechaIngreso", FechaIngreso);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarAtencionesPacientes(int idPaciente)              //KHOYOSI
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarAtencionesPorIdPaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", idPaciente);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<Boolean> CrearModificarConsejeriaObstetrica(int IdAtencion, Consejeria consejeriaObstetrica, int clasificacionDiagnostico, List<Diagnosticos> dsDiagnosticos, int idUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            try
            {
                string xmlDiagnosticos;
                xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);

                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "Web_CrearModificarConsejeriaObstetrica";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                            da.SelectCommand.Parameters.AddWithValue("@NroCPN", consejeriaObstetrica.NroCPN);
                            da.SelectCommand.Parameters.AddWithValue("@BeneficioLactanciaMaterna", consejeriaObstetrica.BeneficioLactanciaMaterna);
                            da.SelectCommand.Parameters.AddWithValue("@LactanciaMaternaLibreDemanda", consejeriaObstetrica.LactanciaMaternaLibreDemanda);
                            da.SelectCommand.Parameters.AddWithValue("@ContactoPielPiel", consejeriaObstetrica.ContactoPielPiel);
                            da.SelectCommand.Parameters.AddWithValue("@AlojamientoConjunto", consejeriaObstetrica.AlojamientoConjunto);
                            da.SelectCommand.Parameters.AddWithValue("@ExtraccionConservacionLecheMaterna", consejeriaObstetrica.ExtraccionConservacionLecheMaterna);
                            da.SelectCommand.Parameters.AddWithValue("@TecnicasAmamantamiento", consejeriaObstetrica.TecnicasAmamantamiento);
                            da.SelectCommand.Parameters.AddWithValue("@SucedaneosBiberonesTetinas", consejeriaObstetrica.SucedaneosBiberonesTetinas);
                            da.SelectCommand.Parameters.AddWithValue("@CorteOportunoCordonUmbilical", consejeriaObstetrica.CorteOportunoCordonUmbilical);
                            da.SelectCommand.Parameters.AddWithValue("@LactanciaMaternaPrimeraHora", consejeriaObstetrica.LactanciaMaternaPrimeraHora);
                            da.SelectCommand.Parameters.AddWithValue("@DonacionLecheMaterna", consejeriaObstetrica.DonacionLecheMaterna);
                            da.SelectCommand.Parameters.AddWithValue("@MotivoConsejeria", consejeriaObstetrica.MotivoConsejeria);
                            da.SelectCommand.Parameters.AddWithValue("@IdentificacionNecesidades", consejeriaObstetrica.IdentificacionNecesidades);
                            da.SelectCommand.Parameters.AddWithValue("@DeteccionSignosAlarma", consejeriaObstetrica.DeteccionSignosAlarma);
                            da.SelectCommand.Parameters.AddWithValue("@RecomendacionesSugerencias", consejeriaObstetrica.RecomendacionesSugerencias);
                            da.SelectCommand.Parameters.Add("@diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                            da.SelectCommand.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                            da.SelectCommand.Parameters.AddWithValue("@idUsuario", idUsuario);



                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
        }

        public Task<Boolean> CrearModificarConsejeriaEstrategiaSanitaria(int IdAtencion, Consejeria consejeria, int clasificacionDiagnostico, int idUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "Web_CrearModificarConsejeriaEstrategiaSanitaria";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                            da.SelectCommand.Parameters.AddWithValue("@MotivoConsejeria", consejeria.MotivoConsejeria);
                            da.SelectCommand.Parameters.AddWithValue("@IdentificacionNecesidades", consejeria.IdentificacionNecesidades);
                            da.SelectCommand.Parameters.AddWithValue("@DeteccionSignosAlarma", consejeria.DeteccionSignosAlarma);
                            da.SelectCommand.Parameters.AddWithValue("@RecomendacionesSugerencias", consejeria.RecomendacionesSugerencias);

                            da.SelectCommand.Parameters.AddWithValue("@idUsuario", idUsuario);



                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
        }


        public async Task<Boolean> CrearModificarConsejeriaOncologica(int IdAtencion, ConsejeriaOncologica consejeriaOnco, int clasificacionDiagnostico, List<Diagnosticos> dsDiagnosticos, int idUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            try
            {
                string xmlDiagnosticos;
                xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);

                Conexion cx = new Conexion();

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {

                    string sql = "Web_CrearModificarConsejeriaOnco";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                    da.SelectCommand.Parameters.AddWithValue("@MotivoConsejeriaOnco", consejeriaOnco.MotivoConsejeriaOnco);
                    da.SelectCommand.Parameters.AddWithValue("@TemaConsejeriaOnco", consejeriaOnco.TemaConsejeriaOnco);
                    da.SelectCommand.Parameters.AddWithValue("@AntecedenteFamiliarCoOnco", consejeriaOnco.AntecedenteFamiliarCoOnco);
                    da.SelectCommand.Parameters.AddWithValue("@AntecedenteFamiliarDescripcionCoOnco", consejeriaOnco.AntecedenteFamiliarDescripcionCoOnco ?? string.Empty);
                    da.SelectCommand.Parameters.AddWithValue("@AndriaOnco", consejeriaOnco.AndriaOnco ?? string.Empty);
                    da.SelectCommand.Parameters.AddWithValue("@UsoAnticonceptivoOnco", consejeriaOnco.UsoAnticonceptivoOnco);
                    da.SelectCommand.Parameters.AddWithValue("@EdadPrimeraMenstruacionOnco", consejeriaOnco.EdadPrimeraMenstruacionOnco ?? string.Empty);
                    da.SelectCommand.Parameters.AddWithValue("@GestacionOnco", consejeriaOnco.GestacionOnco);
                    da.SelectCommand.Parameters.AddWithValue("@Perdidas", consejeriaOnco.Perdidas);
                    da.SelectCommand.Parameters.AddWithValue("@ParidadOnco", consejeriaOnco.ParidadOnco ?? string.Empty);
                    da.SelectCommand.Parameters.AddWithValue("@EdadPrimerEmbarazoOnco", consejeriaOnco.EdadPrimerEmbarazoOnco ?? string.Empty);
                    da.SelectCommand.Parameters.AddWithValue("@EdadPrimeraRelacionSexual", consejeriaOnco.EdadPrimeraRelacionSexual ?? string.Empty);
                    da.SelectCommand.Parameters.AddWithValue("@FechaUltimaMenstruacionOnco", consejeriaOnco.FechaUltimaMenstruacionOnco ?? Convert.DBNull);
                    da.SelectCommand.Parameters.AddWithValue("@TerapiaReemplazoRenalOnco", consejeriaOnco.TerapiaReemplazoRenalOnco);
                    da.SelectCommand.Parameters.AddWithValue("@RecomendacionesSugerenciasOnco", consejeriaOnco.RecomendacionesSugerenciasOnco ?? string.Empty);

                    da.SelectCommand.Parameters.AddWithValue("@ConsumoTabacoOnco", consejeriaOnco.ConsumoTabacoOnco);
                    da.SelectCommand.Parameters.AddWithValue("@ConsumoAlcoholOnco", consejeriaOnco.ConsumoAlcoholOnco);
                    da.SelectCommand.Parameters.AddWithValue("@ObesidadOnco", consejeriaOnco.ObesidadOnco);
                    da.SelectCommand.Parameters.AddWithValue("@SedentarismoOnco", consejeriaOnco.SedentarismoOnco);
                    da.SelectCommand.Parameters.AddWithValue("@ComportamientoSexualInadecuado", consejeriaOnco.ComportamientoSexualInadecuado);

                    da.SelectCommand.Parameters.AddWithValue("@TratamientoParaFertilidad", consejeriaOnco.TratamientoParaFertilidad);
                    da.SelectCommand.Parameters.AddWithValue("@LactanciaMaterna", consejeriaOnco.LactanciaMaterna);

                    da.SelectCommand.Parameters.Add("@diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                    da.SelectCommand.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                    da.SelectCommand.Parameters.AddWithValue("@idUsuario", idUsuario);

                    await conn.OpenAsync();

                    da.Fill(ds);

                    nRpta = true;

                    return nRpta;
                }

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
        }

        public async Task<DataSet> CrearModificaCuentas(
            int? IdCuentaAtencionP, int? IdPacienteP, int IdUsuarioP, int? Edad, DateTime? FechaIngreso, string HoraIngreso, int IdServicioIngreso, int? IdMedicoIngreso, int IdEspecialidadMedico, int IdOrigenAtencion,
            int? IdCamaIngreso, int? IdTipoEdad, int IdTipoServicio, int IdFormaPago, int IdFuenteFinanciamiento, string HoraInicioAtencion, string DireccionDomicilio, string NombreAcompaniante,
            string IdSiaSis, string FuaCodigoPrestacion, string SisCodigo
            ) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificaCuentas", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencionP", IdCuentaAtencionP);
                cmd.Parameters.AddWithValue("@IdPacienteP", IdPacienteP ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioP", IdUsuarioP);
                cmd.Parameters.AddWithValue("@Edad", Edad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaIngreso", FechaIngreso);
                cmd.Parameters.AddWithValue("@HoraIngreso", HoraIngreso);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", IdServicioIngreso);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", IdMedicoIngreso);
                cmd.Parameters.AddWithValue("@IdEspecialidadMedico", IdEspecialidadMedico);
                cmd.Parameters.AddWithValue("@IdOrigenAtencion", IdOrigenAtencion);
                cmd.Parameters.AddWithValue("@IdCamaIngreso", IdCamaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoEdad", IdTipoEdad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);
                cmd.Parameters.AddWithValue("@IdFormaPago", IdFormaPago);
                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento);
                cmd.Parameters.AddWithValue("@HoraInicioAtencion", HoraInicioAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DireccionDomicilio", DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreAcompaniante", NombreAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSiaSis", IdSiaSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", FuaCodigoPrestacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SisCodigo", SisCodigo ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }



        public async Task<Tuple<int, int>> CrearModificarCuentasAtenciones(FacturacionCuentasAtencion objFacturacionCuentasAtencion, Atenciones objAtenciones, AtencionesDatosAdicionales atencionesDatosAdicionales, int IdUsuarioAuditoria) // JDELGADO001.2
        {
            int nRpta, idCuentaAtencionOutput;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "web_CrearModificarCuentasAtenciones";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@idCuentaAtencionOutput", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@TotalPorPagar", objFacturacionCuentasAtencion.TotalPorPagar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstado", objFacturacionCuentasAtencion.IdEstado);
                cmd.Parameters.AddWithValue("@TotalPagado", objFacturacionCuentasAtencion.TotalPagado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalAsegurado", objFacturacionCuentasAtencion.TotalAsegurado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalExonerado", objFacturacionCuentasAtencion.TotalExonerado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraCierre", objFacturacionCuentasAtencion.HoraCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaCierre", objFacturacionCuentasAtencion.FechaCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraApertura", objFacturacionCuentasAtencion.HoraApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaApertura", objFacturacionCuentasAtencion.FechaApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaciente", objFacturacionCuentasAtencion.IdPaciente);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", objFacturacionCuentasAtencion.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFacturacionCuentasAtencion.FechaCreacion ?? Convert.DBNull);


                cmd.Parameters.AddWithValue("@HoraIngreso", objAtenciones.horaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaIngreso", objAtenciones.fechaIngreso);
                cmd.Parameters.AddWithValue("@IdTipoServicio", objAtenciones.idTipoServicio);

                cmd.Parameters.AddWithValue("@IdAtencion", objAtenciones.idAtencion);
                cmd.Parameters.AddWithValue("@IdTipoCondicionALEstab", objAtenciones.idTipoCondicionALEstab ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgresoAdministrativo", objAtenciones.FechaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaEgreso", objAtenciones.idCamaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaIngreso", objAtenciones.idCamaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdServicioEgreso", Convert.DBNull); // JDELGADO CAMBIAR DESPUES
                cmd.Parameters.AddWithValue("@IdTipoAlta", objAtenciones.idTipoAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCondicionAlta", objAtenciones.idCondicionAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoEdad", objAtenciones.idTipoEdad);
                cmd.Parameters.AddWithValue("@IdOrigenAtencion", objAtenciones.idOrigenAtencion);
                cmd.Parameters.AddWithValue("@IdDestinoAtencion", objAtenciones.idDestinoAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgresoAdministrativo", objAtenciones.horaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoCondicionAlServicio", objAtenciones.idTipoCondicionAlServicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgreso", objAtenciones.horaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgreso", objAtenciones.fechaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoEgreso", objAtenciones.idMedicoEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Edad", objAtenciones.edad);
                cmd.Parameters.AddWithValue("@IdEspecialidadMedico", objAtenciones.idEspecialidadMedico);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", objAtenciones.idMedicoIngreso);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", objAtenciones.idServicioIngreso);
                cmd.Parameters.AddWithValue("@IdTipoGravedad", objAtenciones.idTipoGravedad ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdCuentaAtencion", objAtenciones.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idFormaPago", objAtenciones.idFormaPago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", objAtenciones.idFuenteFinanciamiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idEstadoAtencion", objAtenciones.idEstadoAtencion);
                cmd.Parameters.AddWithValue("@EsPacienteExterno", objAtenciones.esPacienteExterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idSunasaPacienteHistorico", objAtenciones.idSunasaPacienteHistorico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@EsDecretoUrgencia", objAtenciones.esDecretoUrgencia ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@DireccionDomicilio", atencionesDatosAdicionales.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreAcompaniante", atencionesDatosAdicionales.NombreAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TelefonoAcompaniante", Convert.DBNull);
                cmd.Parameters.AddWithValue("@Observacion", atencionesDatosAdicionales.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ProximaCita", atencionesDatosAdicionales.ProximaCita ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NumeroDeHijos", atencionesDatosAdicionales.NumeroDeHijos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSiaSis", atencionesDatosAdicionales.IdSiaSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", atencionesDatosAdicionales.FuaCodigoPrestacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SisCodigo", atencionesDatosAdicionales.SisCodigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaDestino", atencionesDatosAdicionales.IdTipoReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaOrigen", atencionesDatosAdicionales.IdTipoReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoDestino", atencionesDatosAdicionales.IdEstablecimientoDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", atencionesDatosAdicionales.IdEstablecimientoOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaDestino", atencionesDatosAdicionales.IdEstablecimientoNoMinsaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaOrigen", atencionesDatosAdicionales.IdEstablecimientoNoMinsaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HuboInfeccionIntraHospitalaria", atencionesDatosAdicionales.HuboInfeccionIntraHospitalaria ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TieneNecropsia", atencionesDatosAdicionales.TieneNecropsia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoRespNacimiento", atencionesDatosAdicionales.IdMedicoRespNacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@RecienNacido", atencionesDatosAdicionales.RecienNacido ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", atencionesDatosAdicionales.NroReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaDestino", atencionesDatosAdicionales.NroReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEnvioSis", atencionesDatosAdicionales.NroEnvioSis ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                idCuentaAtencionOutput = int.Parse(cmd.Parameters["@idCuentaAtencionOutput"].Value.ToString());
                await conn.CloseAsync();

                return Tuple.Create(nRpta, idCuentaAtencionOutput);
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return Tuple.Create(-1, -1);
            }
        }
        public async Task<Tuple<int, int>> CrearModificarCuentasAtencionesCeHospEmer(
            FacturacionCuentasAtencion objFacturacionCuentasAtencion, Atenciones objAtenciones, AtencionesDatosAdicionales atencionesDatosAdicionales,
            int? idDerivacion, int? idProducto, List<Diagnosticos> dsDiagnosticos, int clasificacionDiagnostico, int IdUsuarioAuditoria) // JDELGADO001.2
        {
            int nRpta, idCuentaAtencionOutput;
            var xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "web_CrearModificarCuentasAtencionesCeHospEmer";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@idCuentaAtencionOutput", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@TotalPorPagar", objFacturacionCuentasAtencion.TotalPorPagar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstado", objFacturacionCuentasAtencion.IdEstado);
                cmd.Parameters.AddWithValue("@TotalPagado", objFacturacionCuentasAtencion.TotalPagado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalAsegurado", objFacturacionCuentasAtencion.TotalAsegurado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TotalExonerado", objFacturacionCuentasAtencion.TotalExonerado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraCierre", objFacturacionCuentasAtencion.HoraCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaCierre", objFacturacionCuentasAtencion.FechaCierre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraApertura", objFacturacionCuentasAtencion.HoraApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaApertura", objFacturacionCuentasAtencion.FechaApertura ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaciente", objFacturacionCuentasAtencion.IdPaciente);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", objFacturacionCuentasAtencion.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@FechaCreacion", objFacturacionCuentasAtencion.FechaCreacion ?? Convert.DBNull);


                cmd.Parameters.AddWithValue("@HoraIngreso", objAtenciones.horaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaIngreso", objAtenciones.fechaIngreso);
                cmd.Parameters.AddWithValue("@IdTipoServicio", objAtenciones.idTipoServicio);

                cmd.Parameters.AddWithValue("@IdAtencion", objAtenciones.idAtencion);
                cmd.Parameters.AddWithValue("@IdTipoCondicionALEstab", objAtenciones.idTipoCondicionALEstab ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgresoAdministrativo", objAtenciones.FechaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaEgreso", objAtenciones.idCamaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCamaIngreso", objAtenciones.idCamaIngreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdServicioEgreso", objAtenciones.idServicioEgreso); // JDELGADO CAMBIAR DESPUES
                cmd.Parameters.AddWithValue("@IdTipoAlta", objAtenciones.idTipoAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCondicionAlta", objAtenciones.idCondicionAlta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoEdad", objAtenciones.idTipoEdad);
                cmd.Parameters.AddWithValue("@IdOrigenAtencion", objAtenciones.idOrigenAtencion);
                cmd.Parameters.AddWithValue("@IdDestinoAtencion", objAtenciones.idDestinoAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgresoAdministrativo", objAtenciones.horaEgresoAdministrativo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoCondicionAlServicio", objAtenciones.idTipoCondicionAlServicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraEgreso", objAtenciones.horaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaEgreso", objAtenciones.fechaEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoEgreso", objAtenciones.idMedicoEgreso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Edad", objAtenciones.edad);
                cmd.Parameters.AddWithValue("@IdEspecialidadMedico", objAtenciones.idEspecialidadMedico);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", objAtenciones.idMedicoIngreso);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", objAtenciones.idServicioIngreso);
                cmd.Parameters.AddWithValue("@IdTipoGravedad", objAtenciones.idTipoGravedad ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdCuentaAtencion", objAtenciones.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idFormaPago", objAtenciones.idFormaPago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", objAtenciones.idFuenteFinanciamiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idEstadoAtencion", objAtenciones.idEstadoAtencion);
                cmd.Parameters.AddWithValue("@EsPacienteExterno", objAtenciones.esPacienteExterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idSunasaPacienteHistorico", objAtenciones.idSunasaPacienteHistorico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@EsDecretoUrgencia", objAtenciones.esDecretoUrgencia ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@DireccionDomicilio", atencionesDatosAdicionales.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreAcompaniante", atencionesDatosAdicionales.NombreAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TelefonoAcompaniante", atencionesDatosAdicionales.TelefonoAcompaniante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Observacion", atencionesDatosAdicionales.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ProximaCita", atencionesDatosAdicionales.ProximaCita ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NumeroDeHijos", atencionesDatosAdicionales.NumeroDeHijos ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSiaSis", atencionesDatosAdicionales.IdSiaSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", atencionesDatosAdicionales.FuaCodigoPrestacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SisCodigo", atencionesDatosAdicionales.SisCodigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaDestino", atencionesDatosAdicionales.IdTipoReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoReferenciaOrigen", atencionesDatosAdicionales.IdTipoReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoDestino", atencionesDatosAdicionales.IdEstablecimientoDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", atencionesDatosAdicionales.IdEstablecimientoOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaDestino", atencionesDatosAdicionales.IdEstablecimientoNoMinsaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEstablecimientoNoMinsaOrigen", atencionesDatosAdicionales.IdEstablecimientoNoMinsaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HuboInfeccionIntraHospitalaria", atencionesDatosAdicionales.HuboInfeccionIntraHospitalaria ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TieneNecropsia", atencionesDatosAdicionales.TieneNecropsia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoRespNacimiento", atencionesDatosAdicionales.IdMedicoRespNacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@RecienNacido", atencionesDatosAdicionales.RecienNacido ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", atencionesDatosAdicionales.NroReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaDestino", atencionesDatosAdicionales.NroReferenciaDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEnvioSis", atencionesDatosAdicionales.NroEnvioSis ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@idDerivacion", idDerivacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idAtencionEmeg_CE", atencionesDatosAdicionales.idAtencionEmeg_CE ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCama", objAtenciones.idCamaIngreso ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@idProducto", idProducto ?? Convert.DBNull);


                cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                cmd.Parameters.Add("@diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;

                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                idCuentaAtencionOutput = int.Parse(cmd.Parameters["@idCuentaAtencionOutput"].Value.ToString());
                await conn.CloseAsync();

                return Tuple.Create(nRpta, idCuentaAtencionOutput);
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return Tuple.Create(-1, -1);
            }
        }

        public async Task<int> AtencionesEmergenciaAgregar(AtencionesEmergencia atencionesEmergencia, int IdUsuarioAuditoria) // JDELGADO001.2
        {
            int IdAtencionEmergencia;

            Conexion cx = new Conexion();
            using SqlConnection conn = cx.obtenerConexion();

            try
            {
                string sql = "Web_AtencionesEmergenciaAgregar";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoAgenteAGAN", atencionesEmergencia.IdTipoAgenteAGAN ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdGrupoOcupacionalALAB", atencionesEmergencia.IdGrupoOcupacionalALAB ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPosicionLesionadoALAB", atencionesEmergencia.IdPosicionLesionadoALAB ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUbicacionLesionado", atencionesEmergencia.IdUbicacionLesionado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoTransporte", atencionesEmergencia.IdTipoTransporte ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoVehiculo", atencionesEmergencia.IdTipoVehiculo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdClaseAccidente", atencionesEmergencia.IdClaseAccidente ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdRelacionAgresorVictima", atencionesEmergencia.IdRelacionAgresorVictima ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdSeguridad", atencionesEmergencia.IdSeguridad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoEvento", atencionesEmergencia.IdTipoEvento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdLugarEvento", atencionesEmergencia.IdLugarEvento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCausaExternaMorbilidad", atencionesEmergencia.IdCausaExternaMorbilidad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdAtencion", atencionesEmergencia.IdAtencion ?? Convert.DBNull);

                cmd.Parameters.Add("@IdAtencionEmergencia", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);


                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                IdAtencionEmergencia = int.Parse(cmd.Parameters["@IdAtencionEmergencia"].Value.ToString());
                await conn.CloseAsync();

                return IdAtencionEmergencia;
            }
            catch
            {
                if (conn.State != ConnectionState.Closed)
                {
                    await conn.CloseAsync();
                }
                return -1;
            }
        }

        public Task<DataSet> SeleccionarFirmaDigitalPorCodePorUsuario(string code, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "socket_SeleccionarFirmaDigitalPorCodePorUsuario";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@code", code);
                        da.SelectCommand.Parameters.AddWithValue("@idUsuario", idUsuario);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarEstadoFirmaPaquete(string nombrePaquete)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarEstadoFirmaPaquete";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@NombrePaquete", nombrePaquete);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> AtencionesSeleccionarPorIdPaciente(int? idPaciente, int? idTipoServicio) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("AtencionesSeleccionarPorIdPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idPaciente", idPaciente);
                cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio ?? Convert.DBNull);
                
                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> FacturacionBienesPagosSeleccionarPorCuenta(int? idCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FacturacionBienesPagosSeleccionarPorCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                
                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> FacturacionServicioPagosPorCuenta(int? idCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FacturacionServicioPagosPorCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                
                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> AtencionesSeleccionarPorId(int? idAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_AtencionesSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
        public async Task<int> AtencionesActualizarEstadoCuentaHosp(int? idCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("AtencionesActualizarEstadoCuentaHosp", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                return await cmd.ExecuteNonQueryAsync();
            }
        }
        public async Task<int> AtencionesActualizarEstadoCuentaHospConSeguro(int? idCuentaAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("AtencionesActualizarEstadoCuentaHospConSeguro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                return await cmd.ExecuteNonQueryAsync();
            }
        }
        public async Task<DataSet> AtencionesCESeleccionarPorId(int idAtencion) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexionExterna())
            using (SqlCommand cmd = new SqlCommand("atencionesCESeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public Task<Boolean> InsertaCuentasPacienteCronico(int idAtencion,  int IdUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
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
                            string sql = "Web_RegistrarAtencionPacienteCronico";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;
                            da.SelectCommand.Parameters.Add("@idCuentaAtencionOri", SqlDbType.Int).Value = idAtencion;
                            da.SelectCommand.Parameters.Add("@idUsuarioRegistra", SqlDbType.Int).Value = IdUsuario;                            
                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }

        }

    }

}
