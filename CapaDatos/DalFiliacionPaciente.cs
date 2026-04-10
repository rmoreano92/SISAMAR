using CapaDatos;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalFiliacionPaciente
    {
        public Task<DataSet> FiliacionRecienNacidoGuardar(FiliacionRecienNacido filiacion, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FiliacionRecienNacidoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencionMadre", filiacion.IdCuentaAtencionMadre);
                        da.SelectCommand.Parameters.AddWithValue("@FechaNacimiento", filiacion.FechaNacimiento);
                        da.SelectCommand.Parameters.AddWithValue("@HoraNacimiento", filiacion.HoraNacimiento);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoSexo", filiacion.IdTipoSexo);
                        da.SelectCommand.Parameters.AddWithValue("@NroGemelar", filiacion.NroGemelar);
                        da.SelectCommand.Parameters.AddWithValue("@IdServicioIngreso", filiacion.IdServicioIngreso);
                        da.SelectCommand.Parameters.AddWithValue("@IdDiagnosticoIngreso", filiacion.IdDiagnosticoIngreso);
                        da.SelectCommand.Parameters.AddWithValue("@IdMedicoIngreso", filiacion.IdMedicoIngreso);
                        da.SelectCommand.Parameters.AddWithValue("@Procedencia", filiacion.Procedencia);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
