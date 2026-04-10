using CapaDatos;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace WebAppMaternidad.CapaDatos
{
    public class DalMedico
    {
        public Task<DataSet> ListarMedicosTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarMedicosTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarMedicosPorEspecialidad(int idEspecialidad)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarMedicosPorEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
    }
}
