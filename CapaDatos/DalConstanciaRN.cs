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
    public class DalConstanciaRN
    {
        public int EliminarSolicitudConstanciaRn(int IdSolicitud, int idConstancia, string motivoEliminacion, int IdUsuario)
        {
            SqlCommand cmd = null;
            int resp = 0;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_EliminarSolicitudConstanciaRn");
                cmd.Parameters.Add("@resp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idSolicitud", IdSolicitud);
                cmd.Parameters.AddWithValue("@idConstancia", idConstancia);
                cmd.Parameters.AddWithValue("@MotivoBaja", motivoEliminacion);
                cmd.Parameters.AddWithValue("@idUsuario", IdUsuario);
                cmd.ExecuteNonQuery();
                resp = int.Parse(cmd.Parameters["@resp"].Value.ToString());
                return resp;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

        public int EliminarConstanciaRn(int IdConstancia, string motivoEliminacion, int IdUsuario)
        {
            SqlCommand cmd = null;
            int resp = 0;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_EliminarConstanciaRn");
                cmd.Parameters.Add("@resp", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.AddWithValue("@idConstancia", IdConstancia);
                cmd.Parameters.AddWithValue("@MotivoBaja", motivoEliminacion);
                cmd.Parameters.AddWithValue("@idUsuario", IdUsuario);
                cmd.ExecuteNonQuery();
                resp = int.Parse(cmd.Parameters["@resp"].Value.ToString());
                return resp;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
        }

    }
}
