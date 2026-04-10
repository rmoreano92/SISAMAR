using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalVisitasMedicas
    {
        public int registrarVisita (VisitasMedicas objVisitas)
        {
            DateTime FechaDef = new DateTime(1999, 1, 1);
            if ( objVisitas.FechaParto == null) { objVisitas.FechaParto = FechaDef; };
            if(objVisitas.FechaAlta == null) { objVisitas.FechaAlta = FechaDef; };

            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_crudVisitas");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                //cmd.Parameters["@nRpta"].Value = idLlamada;
                cmd.Parameters.AddWithValue("@idpaciente", objVisitas.idPaciente);
                cmd.Parameters.AddWithValue("@idServicioActual", objVisitas.idServicioActual);
                cmd.Parameters.AddWithValue("@nroCama", objVisitas.nroCama);
                cmd.Parameters.AddWithValue("@idcuenta", objVisitas.idcuenta);
                cmd.Parameters.AddWithValue("@FechaEvaluacion", objVisitas.FechaEvaluacion);
                cmd.Parameters.AddWithValue("@idTipoParto", objVisitas.idTipoParto);
                cmd.Parameters.AddWithValue("@FechaParto",  objVisitas.FechaParto);
                cmd.Parameters.AddWithValue("@SexoRN", objVisitas.SexoRN);
                cmd.Parameters.AddWithValue("@CondicionMadre",  objVisitas.idCondicionMadre);
                cmd.Parameters.AddWithValue("@ComplicacionesMadre", (objVisitas.ComplicacionesMadre ==null) ? "" : objVisitas.ComplicacionesMadre);
                cmd.Parameters.AddWithValue("@NecesitaVisita", (objVisitas.NecesitaVisita == null) ? 0 : objVisitas.NecesitaVisita);
                cmd.Parameters.AddWithValue("@AltaMedica", objVisitas.altaMedica);
                cmd.Parameters.AddWithValue("@idEstadoLlamada", objVisitas.idEstadoLlamada);
                cmd.Parameters.AddWithValue("@idVisita", objVisitas.idVisita);
                cmd.Parameters.AddWithValue("@idUsu", objVisitas.idUsuario);
                cmd.Parameters.AddWithValue("@FechaAlta", objVisitas.FechaAlta);
                cmd.Parameters.AddWithValue("@DocFamiliar", (objVisitas.DocFamiliar == null) ? "" : objVisitas.DocFamiliar);

                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@rsp"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public DataSet ListarHospitalizados()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_PAcientesHospitalizadosSinAlta");
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
        
        public VisitasMedicas ObtenerVisita(int idVisita)
        {
            DateTime FechaDef = new DateTime(1999, 1, 1);
            
            VisitasMedicas u = null;
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ObtenerVisitaxId");
                cmd.Parameters.AddWithValue("@idVisita", idVisita);
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    u = new VisitasMedicas();
                    u.idServicioActual = Convert.ToInt16(dr["idServicioActual"]);
                    u.nroCama = Convert.ToString(dr["nroCama"]);
                    u.FechaEvaluacion = Convert.ToDateTime(dr["FechaEvaluacion"]);
                    u.idCondicionMadre = Convert.ToInt16(dr["CondicionMadre"]);
                    u.idTipoParto = Convert.ToInt16(dr["idTipoParto"]);
                    u.FechaParto = Convert.ToDateTime(dr["FechaParto"]);
                    if (u.FechaParto == FechaDef) { u.FechaParto = null; };                 
                    u.SexoRN = Convert.ToInt16(dr["SexoRN"]);
                    u.ComplicacionesMadre = Convert.ToString(dr["ComplicacionesMadre"]);
                    u.NecesitaVisita = Convert.ToInt16(dr["NecesitaVisita"]);
                    u.idcuenta = Convert.ToInt32(dr["idcuenta"]);
                    u.idPaciente = Convert.ToInt32(dr["idPaciente"]);
                    u.idVisita = Convert.ToInt32(dr["idVisita"]);
                    u.altaMedica = Convert.ToInt16(dr["altaMedica"]);
                    u.idEstadoLlamada = Convert.ToInt16(dr["idEstadoLlamada"]);
                    u.FechaAlta = Convert.ToDateTime(dr["FechaAlta"]);
                    if (u.FechaAlta == FechaDef) { u.FechaAlta = null; };
                    u.FechaEvaluacionString= Convert.ToString(dr["FechaEvalDes"]);
                    u.FechaAltaString = Convert.ToString(dr["FechaAltaDes"]);


                    u.DocFamiliar = Convert.ToString(dr["DocumentoFamiliar"]);
                }

            }
            catch (Exception ex)
            {

                u = null;
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return u;
        }

        public int EliminarVisita(VisitasMedicas objVisitas)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_EliminarVisitas");
                cmd.Parameters.Add("@rsp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idVisita", objVisitas.idVisita);
                cmd.Parameters.AddWithValue("@idUsuario", objVisitas.idUsuario);
                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@rsp"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }
        
        public DataSet ListarHospitalizadosConAlta()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_PAcientesHospitalizadosconPosibleAlta");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null;
                throw;
            }
            finally {cmd.Connection.Close();}
            return ds;
        }
        
        public DataSet ListarHospitalizadosConVisita()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_PAcientesHospitalizadosconVisita");
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null; throw ex;
            }
            finally { cmd.Connection.Close(); }
            return ds;
        }
    }

}
