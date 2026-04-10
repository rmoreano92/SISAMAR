using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CapaDatos;

namespace WebAppMaternidad.CapaDatos
{
    public class DalDepartamentos
    {
        public Task<DataSet> ListarDepartamentos()
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
    }
}
