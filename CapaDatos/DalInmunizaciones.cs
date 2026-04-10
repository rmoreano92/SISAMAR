using CapaDatos;
using CapaEntidades;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace WebAppMaternidad.CapaDatos
{
    public class DalInmunizaciones
    {
        public Task<DataSet> ListarProcedimientosInmunizaciones() // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarProcedimientosInmunizaciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ListarAtencionesTamizajeByIdPaciente(int IdPaciente) // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarAtencionesTamizajeByIdPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public Task<DataSet> ListarAtencionesFuaTamizajeNeonatal(DateTime FechaInicio, DateTime FechaFinal) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarAtencionesFuaTamizajeNeonatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                        da.SelectCommand.Parameters.AddWithValue("@FechaFinal", FechaFinal);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarAtencionesFuaTamizajeNeonatalPorTipo(DateTime FechaInicio, DateTime FechaFinal, int Tipo) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarAtencionesFuaTamizajeNeonatalPorTipo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                        da.SelectCommand.Parameters.AddWithValue("@FechaFinal", FechaFinal);
                        da.SelectCommand.Parameters.AddWithValue("@Tipo", Tipo);

                        da.SelectCommand.CommandTimeout = 300;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> InsertarVacunasInmunizaciones(
            int IdAtencion, int IdPaciente, int IdProducto, int Dosis, string CoMorbilidad, int GrupoRiesgo, string ContactoTBP, string Lote, DateTime Fecha,
            int Actividad, int Estrategia, int ResponsableVacuna, int SupervisorVacuna, int Idturno) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_InsertarVacunasInmunizaciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                        da.SelectCommand.Parameters.AddWithValue("@IdProducto", IdProducto);
                        da.SelectCommand.Parameters.AddWithValue("@Dosis", Dosis);
                        da.SelectCommand.Parameters.AddWithValue("@CoMorbilidad", CoMorbilidad);
                        da.SelectCommand.Parameters.AddWithValue("@GrupoRiesgo", GrupoRiesgo);
                        da.SelectCommand.Parameters.AddWithValue("@ContactoTBP", ContactoTBP);
                        da.SelectCommand.Parameters.AddWithValue("@Lote", Lote);
                        da.SelectCommand.Parameters.AddWithValue("@Fecha", Fecha);
                        da.SelectCommand.Parameters.AddWithValue("@Actividad", Actividad);
                        da.SelectCommand.Parameters.AddWithValue("@Estrategia", Estrategia);
                        da.SelectCommand.Parameters.AddWithValue("@ResponsableVacuna", ResponsableVacuna);
                        da.SelectCommand.Parameters.AddWithValue("@SupervisorVacuna", SupervisorVacuna);
                        da.SelectCommand.Parameters.AddWithValue("@Idturno", Idturno);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(int IdPaciente, int IdProducto, int Dosis) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarVacunasInmunizacionesByIdAtencionIdProductoDosis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                        da.SelectCommand.Parameters.AddWithValue("@IdProducto", IdProducto);
                        da.SelectCommand.Parameters.AddWithValue("@Dosis", Dosis);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> AnularAtencionesTamizajeNeonatal(int IdCuentaAtencion, int IdRegistroTamizaje, int EsRegistroIpress) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_AnularAtencionesTamizajeNeonatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@IdRegistroTamizaje", IdRegistroTamizaje);
                        da.SelectCommand.Parameters.AddWithValue("@EsRegistroIpress", EsRegistroIpress);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarPersonalInmunizaciones() // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarPersonalInmunizaciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarTurnosInmunizaciones() // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarTurnosInmunizaciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GuardarAtencionInmunizaciones(int IdAtencion) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_GuardarAtencionInmunizaciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
    }
}
