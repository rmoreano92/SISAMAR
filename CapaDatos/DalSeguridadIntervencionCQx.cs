using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaDatos;
using System;
using CapaEntidades;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using WebAppSaludOcupacional.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalSeguridadIntervencionCQx
    {

        public async Task<DataSet> ListarAtencionesSeguridadIntervencionCQx(
            int? IdCuentaAtencion, int? NroHistoriaClinica, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, string Nombres, DateTime? FechaInicio, DateTime? FechaFin, int? IdServicio,
            int? IdAtencion, int? NroEvaluacion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarAtencionesSeguridadIntervencionCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", NroHistoriaClinica ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Nombres", Nombres ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdServicio", IdServicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> CrearModificarSeguridadIntervencionQuirurgica(SeguridadIntervencionQuirurgica seguridadIntervencion, int? IdUsuarioAuditoria, int IdListItem)
        {
            DataSet ds = new DataSet();


            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarSeguridadIntervencionQuirurgica", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdSeguridadIntervencion", seguridadIntervencion.IdSeguridadIntervencion);
                cmd.Parameters.AddWithValue("@IdAtencion", seguridadIntervencion.IdAtencion);
                cmd.Parameters.AddWithValue("@NroEvaluacion", seguridadIntervencion.NroEvaluacion);

                cmd.Parameters.AddWithValue("@TipoPaciente", seguridadIntervencion.TipoPaciente);
                cmd.Parameters.AddWithValue("@EstadoPaciente", seguridadIntervencion.EstadoPaciente);
                cmd.Parameters.AddWithValue("@PacienteConoceCirujano", seguridadIntervencion.PacienteConoceCirujano);
                cmd.Parameters.AddWithValue("@SeMarcoSitioQuirurgico", seguridadIntervencion.SeMarcoSitioQuirurgico);

                cmd.Parameters.AddWithValue("@ConfirmacionNombreAdultos", seguridadIntervencion.ConfirmacionNombreAdultos);
                cmd.Parameters.AddWithValue("@ConfirmacionZonaOperatoriaAdultos", seguridadIntervencion.ConfirmacionZonaOperatoriaAdultos);
                cmd.Parameters.AddWithValue("@ConfirmacionProcedimientoAdultos", seguridadIntervencion.ConfirmacionProcedimientoAdultos);
                cmd.Parameters.AddWithValue("@ConfirmacionConsentimientoAdultos", seguridadIntervencion.ConfirmacionConsentimientoAdultos);

                cmd.Parameters.AddWithValue("@ConfirmacionNombreNeonatos", seguridadIntervencion.ConfirmacionNombreNeonatos);
                cmd.Parameters.AddWithValue("@ConfirmacionZonaOperatoriaNeonatos", seguridadIntervencion.ConfirmacionZonaOperatoriaNeonatos);
                cmd.Parameters.AddWithValue("@ConfirmacionProcedimientoNeonatos", seguridadIntervencion.ConfirmacionProcedimientoNeonatos);
                cmd.Parameters.AddWithValue("@ConfirmacionConsentimientoNeonatos", seguridadIntervencion.ConfirmacionConsentimientoNeonatos);

                cmd.Parameters.AddWithValue("@OximetroPulsoColocadoFuncionando", seguridadIntervencion.OximetroPulsoColocadoFuncionando);
                cmd.Parameters.AddWithValue("@Aspirador", seguridadIntervencion.Aspirador);
                cmd.Parameters.AddWithValue("@EquipoViaArea", seguridadIntervencion.EquipoViaArea);
                cmd.Parameters.AddWithValue("@MaquinaAnestesiaOperativa", seguridadIntervencion.MaquinaAnestesiaOperativa);
                cmd.Parameters.AddWithValue("@DrogasEmergencia", seguridadIntervencion.DrogasEmergencia);
                cmd.Parameters.AddWithValue("@Oxigeno", seguridadIntervencion.Oxigeno);

                cmd.Parameters.AddWithValue("@AlergiaConocida", seguridadIntervencion.AlergiaConocida);
                cmd.Parameters.AddWithValue("@RiesgoPerdidaSangre", seguridadIntervencion.RiesgoPerdidaSangre);
                cmd.Parameters.AddWithValue("@DificultadesViaArea", seguridadIntervencion.DificultadesViaArea);
                cmd.Parameters.AddWithValue("@DisponeReposicionSanguinea", seguridadIntervencion.DisponeReposicionSanguinea);
                cmd.Parameters.AddWithValue("@PrevisoDosVias", seguridadIntervencion.PrevisoDosVias);

                cmd.Parameters.AddWithValue("@CumplieronProtocoloAsepsiaQuirurgica", seguridadIntervencion.CumplieronProtocoloAsepsiaQuirurgica);
                cmd.Parameters.AddWithValue("@SePresentaronPorNombreFuncion", seguridadIntervencion.SePresentaronPorNombreFuncion);

                cmd.Parameters.AddWithValue("@ConfirmaNombresPaciente", seguridadIntervencion.ConfirmaNombresPaciente);
                cmd.Parameters.AddWithValue("@ConfirmaTiempoOperatorio", seguridadIntervencion.ConfirmaTiempoOperatorio);
                cmd.Parameters.AddWithValue("@ConfirmaZonaOperatoria", seguridadIntervencion.ConfirmaZonaOperatoria);
                cmd.Parameters.AddWithValue("@ConfirmaPerdidaSanguineaEstimada", seguridadIntervencion.ConfirmaPerdidaSanguineaEstimada);
                cmd.Parameters.AddWithValue("@ConfirmaProcedimiento", seguridadIntervencion.ConfirmaProcedimiento);

                cmd.Parameters.AddWithValue("@TuvoSituacionInesperadaActoAnestesico", seguridadIntervencion.TuvoSituacionInesperadaActoAnestesico);

                cmd.Parameters.AddWithValue("@ResultadosIndicadoresEsterilizacion", seguridadIntervencion.ResultadosIndicadoresEsterilizacion);
                cmd.Parameters.AddWithValue("@InstrumentalGrasasCompresasAgujas", seguridadIntervencion.InstrumentalGrasasCompresasAgujas);
                cmd.Parameters.AddWithValue("@MaterialInstrumentalEquipoAdicional", seguridadIntervencion.MaterialInstrumentalEquipoAdicional);

                cmd.Parameters.AddWithValue("@ConsideracionEspecial", seguridadIntervencion.ConsideracionEspecial);
                cmd.Parameters.AddWithValue("@AdministroProfilaxisConAntibioticos", seguridadIntervencion.AdministroProfilaxisConAntibioticos);
                cmd.Parameters.AddWithValue("@TieneExamenRadiograficoParaExhibir", seguridadIntervencion.TieneExamenRadiograficoParaExhibir);

                cmd.Parameters.AddWithValue("@NombreProcedimientoQuirurgico", seguridadIntervencion.NombreProcedimientoQuirurgico);
                cmd.Parameters.AddWithValue("@RecuentoInstrumentosGasasCompresasAgujas", seguridadIntervencion.RecuentoInstrumentosGasasCompresasAgujas);
                cmd.Parameters.AddWithValue("@RecomendacionesPostOperatorioInmediata", seguridadIntervencion.RecomendacionesPostOperatorioInmediata);

                cmd.Parameters.AddWithValue("@MuestraAnatomiaPatologicaRotulada", seguridadIntervencion.MuestraAnatomiaPatologicaRotulada);
                cmd.Parameters.AddWithValue("@ProblemasConMaquinaAnestesiaMonitoreo", seguridadIntervencion.ProblemasConMaquinaAnestesiaMonitoreo);
                cmd.Parameters.AddWithValue("@EventosIntraoperatoriosImportantes", seguridadIntervencion.EventosIntraoperatoriosImportantes);
                cmd.Parameters.AddWithValue("@ProblemasConInstrumento", seguridadIntervencion.ProblemasConInstrumento);
                cmd.Parameters.AddWithValue("@ObservacionesSalida", seguridadIntervencion.ObservacionesSalida);

                cmd.Parameters.AddWithValue("@NumeroSolicitud", seguridadIntervencion.NumeroSolicitud);
                cmd.Parameters.AddWithValue("@MedicoPrincipal", seguridadIntervencion.MedicoPrincipal);
                cmd.Parameters.AddWithValue("@CirujanoII", seguridadIntervencion.CirujanoII);
                cmd.Parameters.AddWithValue("@MedicoAyudanteI", seguridadIntervencion.MedicoAyudanteI);
                cmd.Parameters.AddWithValue("@MedicoAyudanteII", seguridadIntervencion.MedicoAyudanteII);
                cmd.Parameters.AddWithValue("@Anestesiologo", seguridadIntervencion.Anestesiologo);
                cmd.Parameters.AddWithValue("@AyudanteAnestesiologo", seguridadIntervencion.AyudanteAnestesiologo);
                cmd.Parameters.AddWithValue("@InstrumentistaI", seguridadIntervencion.InstrumentistaI);
                cmd.Parameters.AddWithValue("@InstrumentistaII", seguridadIntervencion.InstrumentistaII);

                cmd.Parameters.AddWithValue("@FechaInicioAtencion", seguridadIntervencion.FechaInicioAtencion);
                cmd.Parameters.AddWithValue("@HoraInicioAtencion", seguridadIntervencion.HoraInicioAtencion);

                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuarioAuditoria);

                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> ListarAtencionesSeguridadIntervencionCQx(DateTime FechaInicio, DateTime FechaFin)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListaVerificacionCirugiaSegura", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }
    }
}
