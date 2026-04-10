using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;

namespace WebAppMaternidad.CapaDatos
{
    public class DalNotaIngresoFarmacia
    {
        public Task<DataSet> ListarNotasIngresos(int IdAlmacen, int IdCuenta, string FechaInicio, string FechaFin, int IdUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_DevuelveMovimientosDeNotaIngresos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.VarChar).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@IdAlmacenDestino", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = FechaFin;                        
                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuenta;                      
                        
                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> DevuelveMovimientosDeNotaIngresosReporte(int IdAlmacen, int IdCuenta, string FechaInicio, string FechaFin, int IdUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_DevuelveMovimientosDeNotaIngresosReporte";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.VarChar).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@IdAlmacenDestino", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = FechaFin;                        
                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuenta;                      
                        
                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        



    }
}
