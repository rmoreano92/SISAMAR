using CapaDatos;

using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaEntidades;
using CapaEntidades;
using System.Collections.Generic;

namespace WebAppMaternidad.CapaDatos
{
    public class DalNotaEnfermeriaNeo
    {
        public async Task<DataSet> ListarAtencionesNotaEnfermeria(
                int? IdCuentaAtencion, string NroHistoria, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno,
                string Nombres, DateTime? FechaInicio, DateTime? FechaFin, int? IdServicio, int? NroEvaluacion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarAtencionesNotaEnfermeria", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                da.SelectCommand.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                da.SelectCommand.Parameters.AddWithValue("@Nombres", Nombres);
                da.SelectCommand.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                da.SelectCommand.Parameters.AddWithValue("@FechaFin", FechaFin);
                da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> GuardarNotaEnfermeriaNeo(
                NotaEnfermeriaNeo notaEnfermeriaNeo, List<NotaEnfermeriaNeoEvolucionSv> dsEvolucionSv, List<NotaEnfermeriaNeoEvolucionAt> dsEvolucionAt,
                int clasificacionDiagnostico, List<DiagnosticosNanda> dsDiagnosticos, int idUsuario)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            string xmlEvolucionSv = XmlUtil.Serializer(typeof(List<NotaEnfermeriaNeoEvolucionSv>), dsEvolucionSv);
            string xmlEvolucionAt = XmlUtil.Serializer(typeof(List<NotaEnfermeriaNeoEvolucionAt>), dsEvolucionAt);
            string xmlDiagnosticos = XmlUtil.Serializer(typeof(List<DiagnosticosNanda>), dsDiagnosticos);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_GuardarNotaEnfermeriaNeo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdNotaEnfermeria", notaEnfermeriaNeo.IdNotaEnfermeria);
                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", notaEnfermeriaNeo.IdAtencion ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Apgar1", notaEnfermeriaNeo.Apgar1 ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Apgar5", notaEnfermeriaNeo.Apgar5 ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@EdadGestacionalSemanas", notaEnfermeriaNeo.EdadGestacionalSemanas ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@EdadGestacionalDias", notaEnfermeriaNeo.EdadGestacionalDias ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Peso", notaEnfermeriaNeo.Peso ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Talla", notaEnfermeriaNeo.Talla ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@PerimetroCefalico", notaEnfermeriaNeo.PerimetroCefalico ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@PerimetroToraxico", notaEnfermeriaNeo.PerimetroToraxico ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@PielColor", notaEnfermeriaNeo.PielColor ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@PielColorEspecificar", notaEnfermeriaNeo.PielColorEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Fontanela", notaEnfermeriaNeo.Fontanela ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@FontanelaEspecificar", notaEnfermeriaNeo.FontanelaEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Suturas", notaEnfermeriaNeo.Suturas ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@SuturasEspecificar", notaEnfermeriaNeo.SuturasEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Orejas", notaEnfermeriaNeo.Orejas ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@OrejasEspecificar", notaEnfermeriaNeo.OrejasEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ImplantacionUbicacion", notaEnfermeriaNeo.ImplantacionUbicacion ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Nariz", notaEnfermeriaNeo.Nariz ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@NarizEspecificar", notaEnfermeriaNeo.NarizEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Boca", notaEnfermeriaNeo.Boca ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@BocaEspecificar", notaEnfermeriaNeo.BocaEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Cuello", notaEnfermeriaNeo.Cuello ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@CuelloEspecificar", notaEnfermeriaNeo.CuelloEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Torax", notaEnfermeriaNeo.Torax ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Abdomen", notaEnfermeriaNeo.Abdomen ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@CordonUmbilical", notaEnfermeriaNeo.CordonUmbilical ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@CaracteristicasAbdomen", notaEnfermeriaNeo.CaracteristicasAbdomen ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@CaracteristicasAbdomenEspecificar", notaEnfermeriaNeo.CaracteristicasAbdomenEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@GenitoUrinario", notaEnfermeriaNeo.GenitoUrinario ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@GenitoUrinarioObservacion", notaEnfermeriaNeo.GenitoUrinarioObservacion ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Eliminacion", notaEnfermeriaNeo.Eliminacion ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@EliminacionEspecificar", notaEnfermeriaNeo.EliminacionEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ColumnaVertebral", notaEnfermeriaNeo.ColumnaVertebral ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ColumnaVertebralEspecificar", notaEnfermeriaNeo.ColumnaVertebralEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Extremidades", notaEnfermeriaNeo.Extremidades ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@TonoMuscular", notaEnfermeriaNeo.TonoMuscular ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@TonoMuscularEspecificar", notaEnfermeriaNeo.TonoMuscularEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Cadera", notaEnfermeriaNeo.Cadera ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ValoracionNeur", notaEnfermeriaNeo.ValoracionNeur ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@Reflejo", notaEnfermeriaNeo.Reflejo ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ObservacionExamenFisico", notaEnfermeriaNeo.ObservacionExamenFisico ?? (object)DBNull.Value);

                da.SelectCommand.Parameters.AddWithValue("@ManiobraDuranteParto", notaEnfermeriaNeo.ManiobraDuranteParto ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@RecepcionRn", notaEnfermeriaNeo.RecepcionRn ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ToraxEspecificar", notaEnfermeriaNeo.ToraxEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@CordonUmbilicalEspecificar", notaEnfermeriaNeo.CordonUmbilicalEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ExtremidadesEspecificar", notaEnfermeriaNeo.ExtremidadesEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@CaderaEspecificar", notaEnfermeriaNeo.CaderaEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ValoracionNeurEspecificar", notaEnfermeriaNeo.ValoracionNeurEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ReflejoEspecificar", notaEnfermeriaNeo.ReflejoEspecificar ?? (object)DBNull.Value);
                da.SelectCommand.Parameters.AddWithValue("@ImpresionDiagnostica", notaEnfermeriaNeo.ImpresionDiagnostica ?? (object)DBNull.Value);

                da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", notaEnfermeriaNeo.NroEvaluacion ?? (object)DBNull.Value);

                da.SelectCommand.Parameters.Add("@EvolucionSv", SqlDbType.Xml).Value = xmlEvolucionSv;
                da.SelectCommand.Parameters.Add("@EvolucionAt", SqlDbType.Xml).Value = xmlEvolucionAt;

                cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                cmd.Parameters.AddWithValue("@diagnosticos", xmlDiagnosticos);
                da.SelectCommand.Parameters.AddWithValue("@idUsuario", idUsuario);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarNotaEnfermeriaNeoEvolucionSvById(int? IdAtencion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarNotaEnfermeriaNeoEvolucionSvById", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarNotaEnfermeriaNeoEvolucionAtById(int? IdAtencion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarNotaEnfermeriaNeoEvolucionAtById", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> CrearModificarNotaEnfermeriaNeoEvaluacion(int? IdAtencion, int? IdNotaEnfermeria, int? NroEvaluacion, DateTime? FechaRegistro, string HoraRegistro, string EvaluacionCuidadoRn, string EvaluacionCuidadoRnFactorRiesgo, int? IdEnfermeraAtiende)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarNotaEnfermeriaNeoEvaluacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdNotaEnfermeria", IdNotaEnfermeria ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@FechaRegistro", FechaRegistro ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@HoraRegistro", HoraRegistro ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@EvaluacionCuidadoRn", EvaluacionCuidadoRn ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@EvaluacionCuidadoRnFactorRiesgo", EvaluacionCuidadoRnFactorRiesgo ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdEnfermeraAtiende", IdEnfermeraAtiende ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarNotaEnfermeriaNeoEvaluacion(int? IdAtencion, int? IdNotaEnfermeria, int? NroEvaluacion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarNotaEnfermeriaNeoEvaluacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdNotaEnfermeria", IdNotaEnfermeria ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarEmpleadosNotaEnfermeria()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarEmpleadosNotaEnfermeria", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarOpcionesNotaEnfermeria()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarOpcionesNotaEnfermeria", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarDiagnosticosNANDA()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarDiagnosticosNANDA", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> SeleccionarIntervencionesEnfermeriaByCpt(string cpt)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("SeleccionarIntervencionesEnfermeriaByCpt", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@cpt", cpt ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> GuardarIntervencionesNotaEnfermeriaNeo(
                int IdAtencion, List<IntervencionesEnfermeria> dsIntervenciones)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            string xmlIntervenciones = XmlUtil.Serializer(typeof(List<IntervencionesEnfermeria>), dsIntervenciones);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_GuardarIntervencionesNotaEnfermeriaNeo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                cmd.Parameters.AddWithValue("@Intervenciones", xmlIntervenciones);
                // da.SelectCommand.Parameters.AddWithValue("@idUsuario", idUsuario);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(int IdAtencion, string cpt)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                da.SelectCommand.Parameters.AddWithValue("@cpt", cpt);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarAtencionesNotaEnfermeriaByIdNotaEnfermeriaNeo(int IdNotaEnfermeria)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarAtencionesNotaEnfermeriaByIdNotaEnfermeriaNeo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdNotaEnfermeria", IdNotaEnfermeria);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarDiagnosticosNandaByIdAtencion(int IdAtencion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarDiagnosticosNandaByIdAtencion", conn))
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
