using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CapaDatos;

namespace WebAppMaternidad.CapaDatos
{
    public class DalDepartamentos
    {
        public Task<DataSet> ListarDepartamentos(int idIpress = 0)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        DataSet ds = new DataSet();
                        //string sql = "DepartamentosHospitalSeleccionarTodos";
                        string sql = "web_DepartamentosHospitalSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@idIpress", SqlDbType.Int).Value = idIpress;
                        da.SelectCommand.Parameters.Add("@tipoListado", SqlDbType.Int).Value = 2;

                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
    }
}
