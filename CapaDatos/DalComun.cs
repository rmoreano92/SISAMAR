using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using CapaDatos;


namespace WebAppMaternidad.CapaDatos
{
    public class DalComun
    {

        public Task<DataSet> FactCatalogoServiciosBienesBusqueda(string tipoBusqueda, string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactCatalogoServiciosBienesBusqueda";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@tipoBusqueda", SqlDbType.Char).Value = (object)tipoBusqueda ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@filtro", SqlDbType.VarChar).Value = (object)filtro ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
