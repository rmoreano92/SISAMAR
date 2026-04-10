using CapaDatos;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalNotaObstetricia
    {
        public async Task<int> CrearModificarNotaObstetricia(NotaObstetricia notaObstetricia) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = cx.obtenerConexion())
            {
                string sql = "Web_CrearModificarNotaObstetricia";
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("IdNotaObstetricia", notaObstetricia.IdNotaObstetricia);
                    cmd.Parameters.AddWithValue("IdAtencion", notaObstetricia.IdAtencion);
                    cmd.Parameters.AddWithValue("NroNotaObstetricia", notaObstetricia.NroNotaObstetricia);
                    cmd.Parameters.AddWithValue("IdMedico", notaObstetricia.IdMedico);
                    cmd.Parameters.AddWithValue("CondicionIngreso", notaObstetricia.CondicionIngreso);
                    cmd.Parameters.AddWithValue("EdadGestacionalSemanas", notaObstetricia.EdadGestacionalSemanas);
                    cmd.Parameters.AddWithValue("EdadGestacionalDias", notaObstetricia.EdadGestacionalDias);
                    cmd.Parameters.AddWithValue("AU", notaObstetricia.AU);
                    cmd.Parameters.AddWithValue("FUR", notaObstetricia.FUR);
                    cmd.Parameters.AddWithValue("ECO", notaObstetricia.ECO);
                    cmd.Parameters.AddWithValue("CausasHemorragia", notaObstetricia.CausasHemorragia);
                    cmd.Parameters.AddWithValue("TipoPreEclampsia", notaObstetricia.TipoPreEclampsia);
                    cmd.Parameters.AddWithValue("InfeccionesPresentadas", notaObstetricia.InfeccionesPresentadas);
                    cmd.Parameters.AddWithValue("EvaluacionDiagnostica", notaObstetricia.EvaluacionDiagnostica);
                    cmd.Parameters.AddWithValue("Apetito", notaObstetricia.Apetito);
                    cmd.Parameters.AddWithValue("Orina", notaObstetricia.Orina);
                    cmd.Parameters.AddWithValue("Suenio", notaObstetricia.Suenio);
                    cmd.Parameters.AddWithValue("Sed", notaObstetricia.Sed);
                    cmd.Parameters.AddWithValue("Deposiciones", notaObstetricia.Deposiciones);
                    cmd.Parameters.AddWithValue("TactoVaginal", notaObstetricia.TactoVaginal);
                    cmd.Parameters.AddWithValue("Dilatacion", notaObstetricia.Dilatacion);
                    cmd.Parameters.AddWithValue("Incorporacion", notaObstetricia.Incorporacion);
                    cmd.Parameters.AddWithValue("AltPresent", notaObstetricia.AltPresent);
                    cmd.Parameters.AddWithValue("VariedPresent", notaObstetricia.VariedPresent);
                    cmd.Parameters.AddWithValue("MembRotas", notaObstetricia.MembRotas);
                    cmd.Parameters.AddWithValue("Procubito", notaObstetricia.Procubito);
                    cmd.Parameters.AddWithValue("Prolapso", notaObstetricia.Prolapso);
                    cmd.Parameters.AddWithValue("SangradoV", notaObstetricia.SangradoV);
                    cmd.Parameters.AddWithValue("LiqAClaro", notaObstetricia.LiqAClaro);
                    cmd.Parameters.AddWithValue("LiqAMeconial", notaObstetricia.LiqAMeconial);
                    cmd.Parameters.AddWithValue("LiqALSanguinolento", notaObstetricia.LiqALSanguinolento);
                    cmd.Parameters.AddWithValue("LiqAMalOlor", notaObstetricia.LiqAMalOlor);
                    cmd.Parameters.AddWithValue("Partograma", notaObstetricia.Partograma);
                    cmd.Parameters.AddWithValue("PartogramaDescripcion", notaObstetricia.PartogramaDescripcion);
                    cmd.Parameters.AddWithValue("SemanaInicioSem", notaObstetricia.SemanaInicioSem);
                    cmd.Parameters.AddWithValue("SemanaInicioDia", notaObstetricia.SemanaInicioDia);
                    cmd.Parameters.AddWithValue("Corticoides", notaObstetricia.Corticoides);
                    cmd.Parameters.AddWithValue("FaseTrabajoParto", notaObstetricia.FaseTrabajoParto);
                    cmd.Parameters.AddWithValue("PosicionParto", notaObstetricia.PosicionParto);
                    cmd.Parameters.AddWithValue("TipoParto", notaObstetricia.TipoParto);
                    cmd.Parameters.AddWithValue("HorasMinutos", notaObstetricia.HorasMinutos);
                    cmd.Parameters.AddWithValue("PerdidaLiquido", notaObstetricia.PerdidaLiquido);
                    cmd.Parameters.AddWithValue("SangradoVaginalActivo", notaObstetricia.SangradoVaginalActivo);
                    cmd.Parameters.AddWithValue("Tratamiento", notaObstetricia.Tratamiento);
                    cmd.Parameters.AddWithValue("PlanTrabajo", notaObstetricia.PlanTrabajo);

                    await conn.OpenAsync();
                    var response = await cmd.ExecuteNonQueryAsync();
                    return response;
                }
            }
        }

        public async Task<DataSet> ListaAtencionesNotaObstetricia(string IdCuentaAtencion, string NroHistoria, string ApellidoPaterno, string ApellidoMaterno, string Nombres, string FechaIngreso, string IdServicio)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListaAtencionesNotaObstetricia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@NroHistoria", NroHistoria ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Nombres", Nombres ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@FechaIngreso", FechaIngreso ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarNotasObstetricia(int IdAtencion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarNotasObstetricia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
    }
}
