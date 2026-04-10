using CapaDatos;
using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalCentroQuirurgico
    {
        public async Task<DataSet> CrearModificarSolicitudSalaOperacionesCQx(SolicitudSalaOperacionesCQx solicitudSalaOperacionesCQx, List<Diagnosticos> dsDiagnosticosPre) // JDELGADO001.2
        {
            DataSet ds = new DataSet();

            string xmlDiagnosticosPre = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticosPre);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarSolicitudOperacionesCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdSolicitudSOP", solicitudSalaOperacionesCQx.IdSolicitudSOP);
                cmd.Parameters.AddWithValue("@NroSolicitud", solicitudSalaOperacionesCQx.NroSolicitud); // sera el numero de orden 
                cmd.Parameters.AddWithValue("@IdPaciente", solicitudSalaOperacionesCQx.IdPaciente); // sera el numero de orden 
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", solicitudSalaOperacionesCQx.IdCuentaAtencion); // sera el numero de orden 
                cmd.Parameters.AddWithValue("@IdTipoIntervencion", solicitudSalaOperacionesCQx.ClaseIntervencion);
                cmd.Parameters.AddWithValue("@IdUbicacionPaciente", solicitudSalaOperacionesCQx.IdUbicacionPaciente);
                cmd.Parameters.AddWithValue("@IdTipoPaciente", solicitudSalaOperacionesCQx.ClasePlaciente);
                cmd.Parameters.AddWithValue("@IdCirujanoII", solicitudSalaOperacionesCQx.SolicitudCirujano);
                cmd.Parameters.AddWithValue("@IdMedicoAyudanteI", solicitudSalaOperacionesCQx.SolicitudPrimerAyudante);
                cmd.Parameters.AddWithValue("@IdAnestesiologo", solicitudSalaOperacionesCQx.SolicitudAnestesiologoCQx);
                cmd.Parameters.AddWithValue("@IdTipoAnestesiaPrevia", solicitudSalaOperacionesCQx.SolicitudTipoAnestesiaPreviaCQx);
                cmd.Parameters.AddWithValue("@IdSala", solicitudSalaOperacionesCQx.SalaSolicitudCQx);
                cmd.Parameters.AddWithValue("@FechaSugerida", solicitudSalaOperacionesCQx.FechaParaCQx);
                cmd.Parameters.AddWithValue("@HoraSugerida", solicitudSalaOperacionesCQx.HoraParaCqx);
                cmd.Parameters.AddWithValue("@FechaSolicitud", solicitudSalaOperacionesCQx.FechaSolicitudCQx);
                cmd.Parameters.AddWithValue("@HoraSolicitud", solicitudSalaOperacionesCQx.HoraSolicitudCQx);
                cmd.Parameters.AddWithValue("@FechaAceptada", solicitudSalaOperacionesCQx.FechaSolicitudCQxAceptada);
                cmd.Parameters.AddWithValue("@HoraAceptada", solicitudSalaOperacionesCQx.HoraSolicitudCQxAceptada);
                cmd.Parameters.AddWithValue("@IdMedicoSolicita", solicitudSalaOperacionesCQx.IdMedicoSolicita);
                da.SelectCommand.Parameters.Add("@DiagnosticosPre", SqlDbType.Xml).Value = xmlDiagnosticosPre;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> CrearModificarSalaOperacionesCQx(SolicitudSalaOperacionesCQx solicitudSalaOperacionesCQx, List<Diagnosticos> dsDiagnosticosPre) // JDELGADO001.2
        {
            DataSet ds = new DataSet();

            string xmlDiagnosticosPre = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticosPre);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarSalaOperacionesCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdSolicitudSOP", solicitudSalaOperacionesCQx.IdSolicitudSOP);
                cmd.Parameters.AddWithValue("@NroSolicitud", solicitudSalaOperacionesCQx.NroSolicitud); // sera el numero de orden 
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", solicitudSalaOperacionesCQx.IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdUbicacionPaciente", solicitudSalaOperacionesCQx.IdUbicacionPaciente);
                cmd.Parameters.AddWithValue("@IdPaciente", solicitudSalaOperacionesCQx.IdPaciente);
                cmd.Parameters.AddWithValue("@Edad", solicitudSalaOperacionesCQx.Edad);
                cmd.Parameters.AddWithValue("@Peso", solicitudSalaOperacionesCQx.Peso);
                cmd.Parameters.AddWithValue("@FechaSolicitud", solicitudSalaOperacionesCQx.FechaSolicitud);
                cmd.Parameters.AddWithValue("@IdTipoSolicitud", solicitudSalaOperacionesCQx.IdTipoSolicitud);
                cmd.Parameters.AddWithValue("@IdMedicoSolicita", solicitudSalaOperacionesCQx.IdMedicoSolicita);
                cmd.Parameters.AddWithValue("@IdEstado", solicitudSalaOperacionesCQx.IdEstado);
                cmd.Parameters.AddWithValue("@IdTipoIntervencionCQx", solicitudSalaOperacionesCQx.IdTipoIntervencionCQx);
                cmd.Parameters.AddWithValue("@IdTipoIntervencion", solicitudSalaOperacionesCQx.IdTipoIntervencion);
                cmd.Parameters.AddWithValue("@IdTipoPaciente", solicitudSalaOperacionesCQx.IdTipoPaciente);
                cmd.Parameters.AddWithValue("@IdTurno", solicitudSalaOperacionesCQx.IdTurno);
                cmd.Parameters.AddWithValue("@IdTipoOperación", solicitudSalaOperacionesCQx.IdTipoOperación);
                cmd.Parameters.AddWithValue("@IdTipoCirugia", solicitudSalaOperacionesCQx.IdTipoCirugia);
                cmd.Parameters.AddWithValue("@IdSala", solicitudSalaOperacionesCQx.IdSala);
                cmd.Parameters.AddWithValue("@IdEspecialidad", solicitudSalaOperacionesCQx.IdEspecialidad);
                cmd.Parameters.AddWithValue("@IdCondicion", solicitudSalaOperacionesCQx.IdCondicion);
                cmd.Parameters.AddWithValue("@IdQuirofano", solicitudSalaOperacionesCQx.IdQuirofano);
                cmd.Parameters.AddWithValue("@IdServicioOrigen", solicitudSalaOperacionesCQx.IdServicioOrigen);
                cmd.Parameters.AddWithValue("@IdCama", solicitudSalaOperacionesCQx.IdCama);
                cmd.Parameters.AddWithValue("@FechaCirugia", solicitudSalaOperacionesCQx.FechaCirugia);
                cmd.Parameters.AddWithValue("@HoraCirugia", solicitudSalaOperacionesCQx.HoraCirugia);
                cmd.Parameters.AddWithValue("@DescripcionCirugiaProcedimiento", solicitudSalaOperacionesCQx.DescripcionCirugiaProcedimiento);
                cmd.Parameters.AddWithValue("@RiesgosDerivados", solicitudSalaOperacionesCQx.RiesgosDerivados);
                cmd.Parameters.AddWithValue("@IdTipoDocTutor", solicitudSalaOperacionesCQx.IdTipoDocTutor);
                cmd.Parameters.AddWithValue("@NroDocumento", solicitudSalaOperacionesCQx.NroDocumento);
                cmd.Parameters.AddWithValue("@IdParentesco", solicitudSalaOperacionesCQx.IdParentesco);
                cmd.Parameters.AddWithValue("@IdMedicoPrincipal", solicitudSalaOperacionesCQx.IdMedicoPrincipal);
                cmd.Parameters.AddWithValue("@IdCirujanoII", solicitudSalaOperacionesCQx.IdCirujanoII);
                cmd.Parameters.AddWithValue("@IdMedicoAyudanteI", solicitudSalaOperacionesCQx.IdMedicoAyudanteI);
                cmd.Parameters.AddWithValue("@IdMedicoAyudanteII", solicitudSalaOperacionesCQx.IdMedicoAyudanteII);
                cmd.Parameters.AddWithValue("@IdAnestesiologo", solicitudSalaOperacionesCQx.IdAnestesiologo);
                cmd.Parameters.AddWithValue("@IdAyudanteAnestesiologo", solicitudSalaOperacionesCQx.IdAyudanteAnestesiologo);
                cmd.Parameters.AddWithValue("@IdInstrumentistaI", solicitudSalaOperacionesCQx.IdInstrumentistaI);
                cmd.Parameters.AddWithValue("@IdInstrumentistaII", solicitudSalaOperacionesCQx.IdInstrumentistaII);
                cmd.Parameters.AddWithValue("@IdTecnicoEnfermeria", solicitudSalaOperacionesCQx.IdTecnicoEnfermeria);
                cmd.Parameters.AddWithValue("@IdOrdenSugerido", solicitudSalaOperacionesCQx.IdOrdenSugerido);

                da.SelectCommand.Parameters.Add("@DiagnosticosPre", SqlDbType.Xml).Value = xmlDiagnosticosPre;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> CrearModificarProgramacionSalaOperacionesCQx(ProgramacionSalaOperacionesCQx programacionSalaOperacionesCQx, int IdUsuario) // JDELGADO001.2
        {
            DataSet ds = new DataSet();

          

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarProgramacionSalaOperacionesCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdProgramacionSala", programacionSalaOperacionesCQx.IdProgramacionSala);
                cmd.Parameters.AddWithValue("@IdSolicitudSOP", programacionSalaOperacionesCQx.IdSolicitudSOP ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdPaciente", programacionSalaOperacionesCQx.IdPaciente ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdEspecialidad", programacionSalaOperacionesCQx.IdEspecialidad ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdServicio", programacionSalaOperacionesCQx.IdServicio ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaProgramada", programacionSalaOperacionesCQx.FechaProgramada ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@HoraProgramada", string.IsNullOrEmpty(programacionSalaOperacionesCQx.HoraProgramada) ? (object)DBNull.Value : programacionSalaOperacionesCQx.HoraProgramada);
                cmd.Parameters.AddWithValue("@IdMedicoProgramado", programacionSalaOperacionesCQx.IdMedicoProgramado ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdOrdenProg", programacionSalaOperacionesCQx.IdOrdenProg ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTurno", programacionSalaOperacionesCQx.IdTurno ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdSala", programacionSalaOperacionesCQx.IdSala ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoCirugia", programacionSalaOperacionesCQx.IdTipoCirugia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdQuirofano", programacionSalaOperacionesCQx.IdQuirofano ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdBancoSangre", programacionSalaOperacionesCQx.IdBancoSangre ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CantidadBS", string.IsNullOrEmpty(programacionSalaOperacionesCQx.CantidadBS) ? (object)DBNull.Value : programacionSalaOperacionesCQx.CantidadBS);
                cmd.Parameters.AddWithValue("@ExamenesAuxiliares", programacionSalaOperacionesCQx.ExamenesAuxiliares ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EvaluacionPreanestesica", programacionSalaOperacionesCQx.EvaluacionPreanestesica ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ConsentimientoInformado", programacionSalaOperacionesCQx.ConsentimientoInformado ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdRiesgoQx", programacionSalaOperacionesCQx.IdRiesgoQx ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@NivelRiesgoQx", programacionSalaOperacionesCQx.NivelRiesgoQx ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaCirugia", programacionSalaOperacionesCQx.FechaCirugia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdAnestesiologo", programacionSalaOperacionesCQx.IdAnestesiologo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdAyudanteAnestesiologo", programacionSalaOperacionesCQx.IdAyudanteAnestesiologo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdInstrumentistaI", programacionSalaOperacionesCQx.IdInstrumentistaI ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdInstrumentistaII", programacionSalaOperacionesCQx.IdInstrumentistaII ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ObservacionProgramacion", string.IsNullOrEmpty(programacionSalaOperacionesCQx.ObservacionProgramacion) ? (object)DBNull.Value : programacionSalaOperacionesCQx.ObservacionProgramacion);
                
                //cmd.Parameters.AddWithValue("@IdSolicitudSOP", programacionSalaOperacionesCQx.IdSolicitudSOP ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdPaciente", programacionSalaOperacionesCQx.IdPaciente ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdCuentaAtencion", programacionSalaOperacionesCQx.IdCuentaAtencion ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@FechaAprobado", programacionSalaOperacionesCQx.FechaAprobado ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdServicioOpera", programacionSalaOperacionesCQx.IdServicioOpera ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdBancoSangre", programacionSalaOperacionesCQx.IdBancoSangre ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@CantidadBS", programacionSalaOperacionesCQx.CantidadBS ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@GrupoSanguineo", programacionSalaOperacionesCQx.GrupoSanguineo ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@FactorRH", programacionSalaOperacionesCQx.FactorRH ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdRiesgoQx", programacionSalaOperacionesCQx.IdRiesgoQx ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@ReqInstrumental", programacionSalaOperacionesCQx.ReqInstrumental ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdTurno", programacionSalaOperacionesCQx.IdTurno ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@TiempoQx", programacionSalaOperacionesCQx.TiempoQx ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@HoraFinal", programacionSalaOperacionesCQx.HoraFinal ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@ResumenCirugia", programacionSalaOperacionesCQx.ResumenCirugia ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@ImpresionDiagnostica", programacionSalaOperacionesCQx.ImpresionDiagnostica ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@PlanTrabajo", programacionSalaOperacionesCQx.PlanTrabajo ?? Convert.DBNull);


                //da.SelectCommand.Parameters.Add("@Diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                //cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);
                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);


                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> CrearModificarReporteOperatorioCQx(ReporteOperatorioCQx reporteOperatorioCQx, List<Diagnosticos> dsDiagnosticosPre, List<Diagnosticos> dsDiagnosticosPost, int clasificacionDiagnostico, int IdUsuario) // JDELGADO001.2
        {
            DataSet ds = new DataSet();

            string xmlDiagnosticosPre = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticosPre);
            string xmlDiagnosticosPost = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticosPost);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarReporteOperatorioCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdReporteOperatorio", reporteOperatorioCQx.IdReporteOperatorio);
                cmd.Parameters.AddWithValue("@IdSolicitudSOP", reporteOperatorioCQx.IdSolicitudSOP);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", reporteOperatorioCQx.IdCuentaAtencion);

                cmd.Parameters.AddWithValue("@IdTurno", reporteOperatorioCQx.IdTurno);
                cmd.Parameters.AddWithValue("@IdSala", reporteOperatorioCQx.IdSala);
                cmd.Parameters.AddWithValue("@IdTipoCirugia", reporteOperatorioCQx.IdTipoCirugia);
                cmd.Parameters.AddWithValue("@IdQuirofano", reporteOperatorioCQx.IdQuirofano);
                cmd.Parameters.AddWithValue("@IdOrden", reporteOperatorioCQx.IdOrden);
                cmd.Parameters.AddWithValue("@FechaCirugia", reporteOperatorioCQx.FechaCirugia);
                cmd.Parameters.AddWithValue("@HoraCirugia", reporteOperatorioCQx.HoraCirugia);
                cmd.Parameters.AddWithValue("@HoraFinalCirugia", reporteOperatorioCQx.HoraFinalCirugia);
                cmd.Parameters.AddWithValue("@IdGasa", reporteOperatorioCQx.IdGasa);
                cmd.Parameters.AddWithValue("@CantidadGasa", reporteOperatorioCQx.CantidadGasa);
                cmd.Parameters.AddWithValue("@IdDepressing", reporteOperatorioCQx.IdDepressing);
                cmd.Parameters.AddWithValue("@CantidadDepressing", reporteOperatorioCQx.CantidadDepressing);
                cmd.Parameters.AddWithValue("@IdPrimeraAnestesia", reporteOperatorioCQx.IdPrimeraAnestesia);
                cmd.Parameters.AddWithValue("@IdTipoPrimeraAnestesia", reporteOperatorioCQx.IdTipoPrimeraAnestesia);
                cmd.Parameters.AddWithValue("@IdSegundaAnestesia", reporteOperatorioCQx.IdSegundaAnestesia);
                cmd.Parameters.AddWithValue("@IdTipoSegundaAnestesia", reporteOperatorioCQx.IdTipoSegundaAnestesia);
                cmd.Parameters.AddWithValue("@ProcedimientoCqx", reporteOperatorioCQx.ProcedimientoCqx);
                cmd.Parameters.AddWithValue("@Tecnicas", reporteOperatorioCQx.Tecnicas);
                cmd.Parameters.AddWithValue("@Hallazgos", reporteOperatorioCQx.Hallazgos);
                cmd.Parameters.AddWithValue("@IncidentesAccidentes", reporteOperatorioCQx.IncidentesAccidentes);
                cmd.Parameters.AddWithValue("@MaterialesCqx", reporteOperatorioCQx.MaterialesCqx);
                cmd.Parameters.AddWithValue("@AnatomiaPatologica", reporteOperatorioCQx.AnatomiaPatologica);
                cmd.Parameters.AddWithValue("@TejidoOrganoExaminar", reporteOperatorioCQx.TejidoOrganoExaminar);
                cmd.Parameters.AddWithValue("@EventoAdversoTransoperativo", reporteOperatorioCQx.EventoAdversoTransoperativo);
                cmd.Parameters.AddWithValue("@EventoAdversoTransanestesico", reporteOperatorioCQx.EventoAdversoTransanestesico);
                cmd.Parameters.AddWithValue("@PinzamientoCorteCordonUmbilical", reporteOperatorioCQx.PinzamientoCorteCordonUmbilical);
                cmd.Parameters.AddWithValue("@Destino", reporteOperatorioCQx.Destino);

                cmd.Parameters.AddWithValue("@IdMedicoPrincipal", reporteOperatorioCQx.IdMedicoPrincipal ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdCirujanoII", reporteOperatorioCQx.IdCirujanoII ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoAyudanteI", reporteOperatorioCQx.IdMedicoAyudanteI ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdMedicoAyudanteII", reporteOperatorioCQx.IdMedicoAyudanteII ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdAnestesiologo", reporteOperatorioCQx.IdAnestesiologo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdAyudanteAnestesiologo", reporteOperatorioCQx.IdAyudanteAnestesiologo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdInstrumentistaI", reporteOperatorioCQx.IdInstrumentistaI ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdInstrumentistaII", reporteOperatorioCQx.IdInstrumentistaII ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTecnicoEnfermeria", reporteOperatorioCQx.IdTecnicoEnfermeria ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);

                da.SelectCommand.Parameters.Add("@DiagnosticosPre", SqlDbType.Xml).Value = xmlDiagnosticosPre;
                da.SelectCommand.Parameters.Add("@DiagnosticosPost", SqlDbType.Xml).Value = xmlDiagnosticosPost;

                cmd.Parameters.AddWithValue("@clasificacionDiagnostico", clasificacionDiagnostico);

                //cmd.Parameters.AddWithValue("@NroReporteOperatorio", reporteOperatorioCQx.NroReporteOperatorio);
                //cmd.Parameters.AddWithValue("@NroFolio", reporteOperatorioCQx.NroFolio);
                //cmd.Parameters.AddWithValue("@IdGasa", reporteOperatorioCQx.IdGasa);
                //cmd.Parameters.AddWithValue("@CantidadGasa", reporteOperatorioCQx.CantidadGasa);
                //cmd.Parameters.AddWithValue("@IdDepressing", reporteOperatorioCQx.IdDepressing);
                //cmd.Parameters.AddWithValue("@CantidadDepressing", reporteOperatorioCQx.CantidadDepressing);
                //cmd.Parameters.AddWithValue("@IdPrimeraAnestesia", reporteOperatorioCQx.IdPrimeraAnestesia);
                //cmd.Parameters.AddWithValue("@IdTipoPrimeraAnestesia", reporteOperatorioCQx.IdTipoPrimeraAnestesia);
                //cmd.Parameters.AddWithValue("@IdSegundaAnestesia", reporteOperatorioCQx.IdSegundaAnestesia);
                //cmd.Parameters.AddWithValue("@IdTipoSegundaAnestesia", reporteOperatorioCQx.IdTipoSegundaAnestesia);
                //cmd.Parameters.AddWithValue("@IdCirugiaRealizada", reporteOperatorioCQx.IdCirugiaRealizada);
                //cmd.Parameters.AddWithValue("@Tecnicas", reporteOperatorioCQx.Tecnicas);
                //cmd.Parameters.AddWithValue("@Hallazgos", reporteOperatorioCQx.Hallazgos);
                //cmd.Parameters.AddWithValue("@IncidentesAccidentes", reporteOperatorioCQx.IncidentesAccidentes);
                //cmd.Parameters.AddWithValue("@MaterialesCqx", reporteOperatorioCQx.MaterialesCqx);
                //cmd.Parameters.AddWithValue("@AnatomiaPatologica", reporteOperatorioCQx.AnatomiaPatologica);
                //cmd.Parameters.AddWithValue("@TejidoOrganoExaminar", reporteOperatorioCQx.TejidoOrganoExaminar);
                //cmd.Parameters.AddWithValue("@EventoAdversoTransoperativo", reporteOperatorioCQx.EventoAdversoTransoperativo);
                //cmd.Parameters.AddWithValue("@EventoAdversoTransanestesico", reporteOperatorioCQx.EventoAdversoTransanestesico);
                //cmd.Parameters.AddWithValue("@PinzamientoCorteCordonUmbilical", reporteOperatorioCQx.PinzamientoCorteCordonUmbilical);
                //cmd.Parameters.AddWithValue("@Destino", reporteOperatorioCQx.Destino);





                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<string> ObtenerNroSolicituSalaOperaciones()  // JDELGADO002
        {
            string result = "";

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ObtenerNroSolicituSalaOperaciones", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                // Execute the stored procedure and get the result as a string
                object scalarResult = await cmd.ExecuteScalarAsync();

                if (scalarResult != null)
                {
                    result = scalarResult.ToString();
                }

                return result;
            }
        }

        public async Task<DataSet> ListarSolicitudesSalaOperaciones(string NroHistoria, string NroSolicitud, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarSolicitudesSalaOperaciones", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@NroSolicitud", NroSolicitud);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                cmd.Parameters.AddWithValue("@FechaSolicitud", FechaSolicitud);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(string NroSolicitud)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroSolicitud", NroSolicitud);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarProgramacionSalaOperaciones(string NroHistoria, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarProgramacionSalaOperaciones", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                cmd.Parameters.AddWithValue("@FechaSolicitud", FechaSolicitud);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarReporteOperatorioCQx(string NroHistoria, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarReporteOperatorioCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                cmd.Parameters.AddWithValue("@FechaSolicitud", FechaSolicitud);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta(string NroCuenta)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarReporteOperatorioSalaOperacionCQxByNroCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroCuenta", NroCuenta);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<DataSet> ListarProcedimientosCQx(int NroSolicitud) // JDELGADO J0 ASYNC METHOD
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarProcedimientosCQx";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroSolicitud", SqlDbType.Int).Value = NroSolicitud;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public async Task<DataSet> ListarM_ClaseIntervencionCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_ClaseIntervencionCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarM_ClasificacionPacienteCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_ClasificacionPacienteCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }



        public async Task<DataSet> ListarM_TipoCirugiaCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_TipoCirugiaCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }



        public async Task<DataSet> ListarM_TurnosCirugiaCQx(int IdTipoTurno)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_TurnosCirugiaCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdTipoTurno", IdTipoTurno);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }



        public async Task<DataSet> ListarM_OrdenCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_OrdenCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> ListarM_SalaCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_SalaCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarM_QuirofanoCQx(int IdSala)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_QuirofanoCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdSala", IdSala);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }


        public async Task<DataSet> ListarM_AnestesiaCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_AnestesiaCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarM_TipoAnestesiaCQx(int IdAnestesiaCqx)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarM_TipoAnestesiaCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdAnestesiaCqx", IdAnestesiaCqx);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarReporteOperatorioByIdReporteOperatorio(int IdReporteOperatorio)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarReporteOperatorioByIdReporteOperatorio", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdReporteOperatorio", IdReporteOperatorio);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarSolicitudesParaReporteOperatorio(string NroHistoria, string NroSolicitud, int? IdCuentaAtencion, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaSolicitud)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarSolicitudesParaReporteOperatorio", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoria", NroHistoria);
                cmd.Parameters.AddWithValue("@NroSolicitud", NroSolicitud);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                cmd.Parameters.AddWithValue("@FechaSolicitud", FechaSolicitud);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }


        public async Task<DataSet> SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion(int IdCuentaAtencion, string NroSolicitud)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarSolicitudesSalaOperacionCQxByNroCuentaHospitalizacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                cmd.Parameters.AddWithValue("@NroSolicitud", NroSolicitud);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<DataSet> ProgramacionMedicaSopModificar(ProgramacionMedica prog, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSopModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = prog.IdProgramacion;
                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = prog.IdTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = prog.IdEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = prog.IdServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = prog.IdMedico;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.VarChar).Value = prog.FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFinal", SqlDbType.VarChar).Value = prog.FechaFinal;
                        da.SelectCommand.Parameters.Add("@IdTipoProgramacion", SqlDbType.Int).Value = prog.IdTipoProgramacion;
                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = prog.IdTurno;
                        da.SelectCommand.Parameters.Add("@HoraInicio", SqlDbType.VarChar).Value = prog.HoraInicio;
                        da.SelectCommand.Parameters.Add("@HoraFinal", SqlDbType.VarChar).Value = prog.HoraFinal;
                        da.SelectCommand.Parameters.Add("@Descripcion", SqlDbType.VarChar).Value = (object)prog.Descripcion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Color", SqlDbType.Int).Value = (object)prog.Color ?? DBNull.Value;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarProgramacionMedicaSopMensual(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, int anio, int mes)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarProgramacionMedicaSopMensual";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@Anio", SqlDbType.VarChar).Value = anio;
                        da.SelectCommand.Parameters.Add("@Mes", SqlDbType.VarChar).Value = mes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }
        public Task<DataSet> ListarProgramacionMedicaSopPorRango(int idTipoServicio, int idDepartamento, int idEspecialidad, int idServicio, int idMedico, int activaProcedimiento, string fechaInicio, string fechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarProgramacionMedicaSopPorRango";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdDepartamento", SqlDbType.Int).Value = idDepartamento;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@FechaInicioProgramacion", SqlDbType.VarChar).Value = fechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFinProgramacion", SqlDbType.VarChar).Value = fechaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ProgramacionMedicaSopSeleccionar(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSopSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ProgramacionMedicaSopEliminar(int idProgramacion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSopEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public async Task<DataSet> ListarEstadosSolicitudCQx()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarEstadosSolicitudCQx", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
    }
}
