using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalServicioSocial
    {

        public Task<int> CrearModificarRegistroServicioSocial(
                int IdRegistro, DateTime FechaIngreso, int IdServicio, int IdUsuarioAsistente, int NroIngresos, int TurnosLaborados, int Entrevistas, int ARS, int MRS, int BRS,
                int TotalRiesgoSocial, int Gestiones_Coordinaciones, int ReunionPareja_Familia, int ConsejeriaSocial, int InformeSocial_TramiteJudicial, int ActaEntrega, int Interconsulta,
                int Referencia, int TotalAtencionesSociales, int InscripSegIntegSalud, int RegularizacionSIS, int ValidacionSIS, int OrientacionInformacion, int Charla, int EducacionSanitaria,
                int DistMatInforEduc, int DisenioMaterialInfor_Educ, int VisitaDomiciliariaRealizada, int NroPacientesExonerados, int NroCasosViolencia, string Observaciones
            )
        {
            DataSet ds = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearModificarRegistroServicioSocial";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdRegistro", IdRegistro);
                            cmd.Parameters.AddWithValue("@FechaIngreso", FechaIngreso);
                            cmd.Parameters.AddWithValue("@IdServicio", IdServicio);
                            cmd.Parameters.AddWithValue("@IdUsuarioAsistente", IdUsuarioAsistente);
                            cmd.Parameters.AddWithValue("@NroIngresos", NroIngresos);
                            cmd.Parameters.AddWithValue("@TurnosLaborados", TurnosLaborados);
                            cmd.Parameters.AddWithValue("@Entrevistas", Entrevistas);
                            cmd.Parameters.AddWithValue("@ARS", ARS);
                            cmd.Parameters.AddWithValue("@MRS", MRS);
                            cmd.Parameters.AddWithValue("@BRS", BRS);
                            cmd.Parameters.AddWithValue("@TotalRiesgoSocial", TotalRiesgoSocial);
                            cmd.Parameters.AddWithValue("@Gestiones_Coordinaciones", Gestiones_Coordinaciones);
                            cmd.Parameters.AddWithValue("@ReunionPareja_Familia", ReunionPareja_Familia);
                            cmd.Parameters.AddWithValue("@ConsejeriaSocial", ConsejeriaSocial);
                            cmd.Parameters.AddWithValue("@InformeSocial_TramiteJudicial", InformeSocial_TramiteJudicial);
                            cmd.Parameters.AddWithValue("@ActaEntrega", ActaEntrega);
                            cmd.Parameters.AddWithValue("@Interconsulta", Interconsulta);
                            cmd.Parameters.AddWithValue("@Referencia", Referencia);
                            cmd.Parameters.AddWithValue("@TotalAtencionesSociales", TotalAtencionesSociales);
                            cmd.Parameters.AddWithValue("@InscripSegIntegSalud", InscripSegIntegSalud);
                            cmd.Parameters.AddWithValue("@RegularizacionSIS", RegularizacionSIS);
                            cmd.Parameters.AddWithValue("@ValidacionSIS", ValidacionSIS);
                            cmd.Parameters.AddWithValue("@OrientacionInformacion", OrientacionInformacion);
                            cmd.Parameters.AddWithValue("@Charla", Charla);
                            cmd.Parameters.AddWithValue("@EducacionSanitaria", EducacionSanitaria);
                            cmd.Parameters.AddWithValue("@DistMatInforEduc", DistMatInforEduc);
                            cmd.Parameters.AddWithValue("@DisenioMaterialInfor_Educ", DisenioMaterialInfor_Educ);
                            cmd.Parameters.AddWithValue("@VisitaDomiciliariaRealizada", VisitaDomiciliariaRealizada);
                            cmd.Parameters.AddWithValue("@NroPacientesExonerados", NroPacientesExonerados);
                            cmd.Parameters.AddWithValue("@NroCasosViolencia", NroCasosViolencia);
                            cmd.Parameters.AddWithValue("@Observaciones", Observaciones ?? Convert.DBNull);

                            //cmd.ExecuteNonQuery();
                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });

        }

        public Task<DataSet> ListarAtencionesParaEstadisticasServicioSocial(string NroDocumento, string ApellidoPaterno, string FechaIngreso, int? IdServicio)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarAtencionesParaEstadisticasServicioSocial";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento ?? "");
                            cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno ?? "");
                            cmd.Parameters.AddWithValue("@FechaIngreso", FechaIngreso ?? "");
                            cmd.Parameters.AddWithValue("@IdServicio", IdServicio ?? 0);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro(int IdRegistro)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_SeleccionarAtencionesParaEstadisticasServicioSocialByIdRegistro";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdRegistro", IdRegistro);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
        
        public Task<DataSet> ListarEmpleados()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarEmpleados";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarTurnos()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarTurnos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@IdTipoServicio", IdTipoServicio);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
    }
}
