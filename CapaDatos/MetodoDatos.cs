using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class MetodoDatos
    {
        private static SqlConnection cn = new SqlConnection();
        public static SqlCommand CrearComando(string procedure)
        {
            cn = Conexion.Instancia.obtenerConexion();
            try
            {
                cn.Open();
            }
            catch (Exception ex)
            {
                cn.Close();
                string algo = ex.Message;
            }
            SqlCommand cmd = new SqlCommand(procedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            return cmd;

        }
        public static void ejecutarComando(SqlCommand cmd)
        {
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                cn.Close();
            }
        }
        public static void abrirConexion()
        {
            cn.Open();
        }

        public static void cerrarConexion()
        {
            cn.Close();
        }





    }
}
