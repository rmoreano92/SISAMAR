using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalMigradores
    {
        public DataSet ListarIntegracionRefCon(DateTime desde, DateTime hasta)
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_listar_trama_refcon");
                cmd.Parameters.AddWithValue("@desde", desde);
                cmd.Parameters.AddWithValue("@hasta", hasta);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }
        public DataSet MigrarIntegracionRefCon(DateTime desde, DateTime hasta)
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_insertar_trama_refcon");
                cmd.Parameters.AddWithValue("@desde", desde);
                cmd.Parameters.AddWithValue("@hasta", hasta);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }

        public DataSet MigrarIntegracionJsonRefCon()
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;

            try
            {
                cmd = MetodoDatos.CrearComando("Sp_insertar_trama_json_refcon");

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }

        public DataSet ListarIntegracionJsonRefCon()
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_listar_json_pendiente_refcon");

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }

        public DataSet ListarIntegracionJsonEnviadosRefCon(int estado)
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_listar_json_enviado_refcon");
                cmd.Parameters.AddWithValue("@estado", estado);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }

        public DataSet ActualizarJsonRefCon(int idCuenta, int estado, string idReferencia, string nroReferencia, DateTime fechaEnvio, string codRespuesta, string mensajeRespuesta)
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_actualizar_json_refcon");
                cmd.Parameters.AddWithValue("@id_cuenta", idCuenta);
                cmd.Parameters.AddWithValue("@estado", estado);
                cmd.Parameters.AddWithValue("@idReferencia", idReferencia);
                cmd.Parameters.AddWithValue("@nro_referencia", nroReferencia);
                cmd.Parameters.AddWithValue("@fecha_envio", fechaEnvio);
                cmd.Parameters.AddWithValue("@codRespuesta", codRespuesta);
                cmd.Parameters.AddWithValue("@mensajeRespuesta", mensajeRespuesta);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);

                Console.WriteLine("ejecuta");
                Console.WriteLine(dataSet.Tables[0].Rows[0]);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }
        public DataSet ActualizarJsonContraRef(int idCuenta, int estado, string idReferencia, string nroReferencia, DateTime fechaEnvio, string codRespuesta, string mensajeRespuesta)
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_actualizar_json_contraref");
                cmd.Parameters.AddWithValue("@id_cuenta", idCuenta);
                cmd.Parameters.AddWithValue("@estado", estado);
                cmd.Parameters.AddWithValue("@idReferencia", idReferencia);
                cmd.Parameters.AddWithValue("@nro_referencia", nroReferencia);
                cmd.Parameters.AddWithValue("@fecha_envio", fechaEnvio);
                cmd.Parameters.AddWithValue("@codRespuesta", codRespuesta);
                cmd.Parameters.AddWithValue("@mensajeRespuesta", mensajeRespuesta);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);

                Console.WriteLine("ejecuta");
                Console.WriteLine(dataSet.Tables[0].Rows[0]);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }
        public DataSet DepurarDataMigradaRefcon()
        {
            DataSet dataSet = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Sp_depurar_trama_integracion_refcon");

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(dataSet);
            }
            catch (Exception ex)
            {
                dataSet = null; throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return dataSet;
        }
    }
}
