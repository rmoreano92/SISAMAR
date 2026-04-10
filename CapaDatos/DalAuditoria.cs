using CapaDatos;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalAuditoria
    {
        public Task<DataSet> AuditoriaGuardar(Auditoria auditoria)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AuditoriaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleado", auditoria.IdEmpleado);
                        da.SelectCommand.Parameters.AddWithValue("@Accion", auditoria.Accion);
                        da.SelectCommand.Parameters.AddWithValue("@IdRegistro", auditoria.IdRegistro);
                        da.SelectCommand.Parameters.AddWithValue("@Tabla", auditoria.Tabla);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", auditoria.IdListItem);
                        //da.SelectCommand.Parameters.AddWithValue("@NombrePC", auditoria.nombrePC);
                        da.SelectCommand.Parameters.AddWithValue("@Observaciones", auditoria.observaciones);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
    }
}
