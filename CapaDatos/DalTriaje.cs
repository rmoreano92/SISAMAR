using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
namespace CapaDatos
{
    public class DalTriaje
    {
        public async Task<Boolean> InsertaTriaje(Triaje objatencionesCE)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_InsertUpdate_Triaje");

                cmd.Parameters.AddWithValue("@idAtencion", objatencionesCE.idAtencion);
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", objatencionesCE.NroHistoriaClinica);
                cmd.Parameters.AddWithValue("@CitaIdServicio", objatencionesCE.CitaIdServicio);
                cmd.Parameters.AddWithValue("@CitaFecha", objatencionesCE.CitaFecha);
                cmd.Parameters.AddWithValue("@TriajePresion", objatencionesCE.TriajePresion);
                cmd.Parameters.AddWithValue("@TriajeTalla", objatencionesCE.TriajeTalla);
                cmd.Parameters.AddWithValue("@TriajeTemperatura", objatencionesCE.TriajeTemperatura);
                cmd.Parameters.AddWithValue("@TriajePeso", objatencionesCE.TriajePeso);
                cmd.Parameters.AddWithValue("@TriajeFrecRespiratoria", objatencionesCE.TriajeFrecRespiratoria);
                cmd.Parameters.AddWithValue("@TriajeFrecCardiaca", objatencionesCE.TriajeFrecCardiaca);
                cmd.Parameters.AddWithValue("@TriajePerimCefalico", objatencionesCE.TriajePerimCefalico);
                cmd.Parameters.AddWithValue("@TriajeSaturacionOxigeno", objatencionesCE.TriajeSaturacionOxigeno);
                cmd.Parameters.AddWithValue("@TriajePerimAbdominal", objatencionesCE.TriajePerimAbdominal);
                cmd.Parameters.AddWithValue("@TriajePulso", objatencionesCE.TriajePulso);


                //cmd.ExecuteNonQuery();
                await cmd.ExecuteNonQueryAsync();
                nRpta = true;


            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public DataSet ListaTriaje(int idAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaTraije");
                cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

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
        public Task<Boolean> InsertaTriajeHospEmeg(Triaje objtriaje) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertUpdate_TriajeEmgHosp";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", objtriaje.idAtencion);
                        cmd.Parameters.AddWithValue("@idServicio", objtriaje.idServicio);
                        cmd.Parameters.AddWithValue("@TriajePresion", objtriaje.TriajePresion);
                        cmd.Parameters.AddWithValue("@TriajeTalla", objtriaje.TriajeTalla);
                        cmd.Parameters.AddWithValue("@TriajeTemperatura", objtriaje.TriajeTemperatura);
                        cmd.Parameters.AddWithValue("@TriajePeso", objtriaje.TriajePeso);
                        cmd.Parameters.AddWithValue("@TriajePulso", objtriaje.TriajePulso);
                        cmd.Parameters.AddWithValue("@TriajeFrecuenciaRespiratoria", objtriaje.TriajeFrecRespiratoria);
                        cmd.Parameters.AddWithValue("@TriajeFrecuenciaCardiaca", objtriaje.TriajeFrecCardiaca);
                        cmd.Parameters.AddWithValue("@TriajeSaturacionOxigeno", objtriaje.TriajeSaturacionOxigeno);

                        cmd.Parameters.AddWithValue("@TriajePerimCefalico", objtriaje.TriajePerimCefalico);     //MGAMERO
                        cmd.Parameters.AddWithValue("@TriajePerimAbdominal", objtriaje.TriajePerimAbdominal);   //MGAMERO
                        cmd.Parameters.AddWithValue("@TriajeDolor", objtriaje.TriajeDolor);                     //MGAMERO
                        cmd.Parameters.AddWithValue("@TriajeLlenadoCapilar", objtriaje.TriajeLlenadoCapilar);   //MGAMERO
                        cmd.Parameters.AddWithValue("@Glasgow", objtriaje.Glasgow);   //MGAMERO    
                        cmd.Parameters.AddWithValue("@BiernamPierson", objtriaje.BiernamPierson);   //MGAMERO    

                        cmd.Parameters.AddWithValue("@idUsuario", objtriaje.idUsuario);
                        cmd.Parameters.AddWithValue("@idNumero", objtriaje.idNumero);

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

        public Task<Boolean> InsertaModificaTriajeNotaObstetricia(Triaje objtriaje) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InsertUpdate_TriajeNotaObstetricia";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idAtencion", objtriaje.idAtencion);
                        cmd.Parameters.AddWithValue("@idServicio", objtriaje.idServicio);
                        cmd.Parameters.AddWithValue("@TriajePresion", objtriaje.TriajePresion);
                        cmd.Parameters.AddWithValue("@TriajeTalla", objtriaje.TriajeTalla);
                        cmd.Parameters.AddWithValue("@TriajeTemperatura", objtriaje.TriajeTemperatura);
                        cmd.Parameters.AddWithValue("@TriajePeso", objtriaje.TriajePeso);
                        cmd.Parameters.AddWithValue("@TriajePulso", objtriaje.TriajePulso);
                        cmd.Parameters.AddWithValue("@TriajeFrecuenciaRespiratoria", objtriaje.TriajeFrecRespiratoria);
                        cmd.Parameters.AddWithValue("@TriajeFrecuenciaCardiaca", objtriaje.TriajeFrecCardiaca);
                        cmd.Parameters.AddWithValue("@TriajeSaturacionOxigeno", objtriaje.TriajeSaturacionOxigeno);

                        cmd.Parameters.AddWithValue("@idUsuario", objtriaje.idUsuario);
                        cmd.Parameters.AddWithValue("@idNumero", objtriaje.idNumero);

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

        public Task<DataSet> ListaTriajeEmgHosp(Triaje objtriaje)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaTriajeEmerHosp";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idNumero", objtriaje.idNumero);
                        cmd.Parameters.AddWithValue("@idAtencion", objtriaje.idAtencion);
                        cmd.Parameters.AddWithValue("@idServicio", objtriaje.idServicio);

                        da.SelectCommand = cmd;

                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaTriajeNotaObstetricia(Triaje objtriaje)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_listaTriajeNotaObstetricia";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@idNumero", objtriaje.idNumero);
                        cmd.Parameters.AddWithValue("@idAtencion", objtriaje.idAtencion);
                        cmd.Parameters.AddWithValue("@idServicio", objtriaje.idServicio);

                        da.SelectCommand = cmd;

                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }

        public DataSet ListaTriajeInterconsulta(int idAtencion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_listaTraijeInterconsulta");
                cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

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

        public Task<DataSet> ListarAtencionesCEFiltrarPorPaciente(string nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string dni, int idCuentaAtencion, string lcFechaTriaje, int idIpress = 0) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesCEFiltrarPorPaciente";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@NroHistoriaClinica", nroHistoriaClinica);
                        cmd.Parameters.AddWithValue("@apellidoPaterno", apellidoPaterno == null ? "" : apellidoPaterno);
                        cmd.Parameters.AddWithValue("@apellidoMaterno", apellidoMaterno == null ? "" : apellidoMaterno);
                        cmd.Parameters.AddWithValue("@primerNombre", primerNombre == null ? "" : primerNombre);
                        cmd.Parameters.AddWithValue("@dni", dni == null ? "" : dni);
                        cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                        cmd.Parameters.AddWithValue("@lcFechaTriaje", lcFechaTriaje == null ? "" : lcFechaTriaje);
                        cmd.Parameters.AddWithValue("@IdIpress", idIpress);

                        da.SelectCommand = cmd;

                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarAtencionesCeXnrohistoriaTriaje(int nroHistoriaClinica) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_EXTERNA..AtencionesCeXnrohistoriaTriaje";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@ml_NroHistoriaClinica", nroHistoriaClinica);

                        da.SelectCommand = cmd;

                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> AtencionesCeListaTriajeByIdAtencion(int IdAtencion) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_EXTERNA..web_AtencionesCeListaTriajeByIdAtencion";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                        da.SelectCommand = cmd;

                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }
    }
}


