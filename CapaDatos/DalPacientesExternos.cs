using CapaEntidades;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System;
using CapaDatos;
using System.Data.SqlClient;

namespace WebAppMaternidad.CapaDatos
{
    public class DalPacientesExternos
    {
        public Task<Boolean> GuardarDiagnosticosTamizaje(int IdAtencion, List<Diagnosticos> dsDiagnosticos, int clasificacionDiagnostico, int IdUsuario)
        {
            DataSet ds = new DataSet();
            Boolean nRpta = false;
            //SqlCommand cmd = null;
            try
            {
                string xmlDiagnosticos;
                xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);

                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_GuardarDiagnosticosTamizaje";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = IdAtencion;
                            da.SelectCommand.Parameters.Add("@Diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                            da.SelectCommand.Parameters.Add("@clasificacionDiagnostico", SqlDbType.Int).Value = clasificacionDiagnostico;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                            da.Fill(ds);

                            nRpta = true;

                            return nRpta;
                        }
                    }
                });
                //nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
        }

    }
}
