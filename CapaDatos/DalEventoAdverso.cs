using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using System;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using CapaEntidades;
using System.Collections.Generic;

namespace WebAppMaternidad.CapaDatos
{
    public class DalEventoAdverso
    {

        public async Task<DataSet> ListarEventosAdversos(int IdEventoAdverso, int NroHistoriaClinica, string NroDocumento, string ApellidoPaterno, string ApellidoMaterno, DateTime? FechaRegistro)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarEventosAdversos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdEventoAdverso", IdEventoAdverso);
                da.SelectCommand.Parameters.AddWithValue("@NroHistoriaClinica", NroHistoriaClinica);
                da.SelectCommand.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                da.SelectCommand.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                da.SelectCommand.Parameters.AddWithValue("@FechaRegistro", FechaRegistro ?? Convert.DBNull);



                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarEventoAdversoById(int IdEventoAdverso)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarEventoAdversoById", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdEventoAdverso", IdEventoAdverso);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> GuardarEventoAdverso(EventoAdverso eventoAdverso, List<Diagnosticos> dsDiagnosticos, int clasificacionDiagnostico, int IdUsuario)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            string xmlDiagnosticos;
            xmlDiagnosticos = XmlUtil.Serializer(typeof(List<Diagnosticos>), dsDiagnosticos);


            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_GuardarEventoAdverso", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdEventoAdverso", eventoAdverso.IdEventoAdverso);
                da.SelectCommand.Parameters.AddWithValue("@IdPaciente", eventoAdverso.IdPaciente);
                da.SelectCommand.Parameters.AddWithValue("@FechaNotificacion", eventoAdverso.FechaNotificacion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@HoraNotificacion", eventoAdverso.HoraNotificacion ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@ServicioNotifica", eventoAdverso.ServicioNotifica);
                da.SelectCommand.Parameters.AddWithValue("@LugarOcurrencia", eventoAdverso.LugarOcurrencia ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@HoraEvento", eventoAdverso.HoraEvento ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@FechaIngreso", eventoAdverso.FechaIngreso ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@HoraIngreso", eventoAdverso.HoraIngreso ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@MuerteMaterna", eventoAdverso.MuerteMaterna);
                da.SelectCommand.Parameters.AddWithValue("@ObitoFetalIntrahospitalaria", eventoAdverso.ObitoFetalIntrahospitalaria);
                da.SelectCommand.Parameters.AddWithValue("@MuerteNeonatal", eventoAdverso.MuerteNeonatal);
                da.SelectCommand.Parameters.AddWithValue("@EventoEquipoBiomedico", eventoAdverso.EventoEquipoBiomedico);
                da.SelectCommand.Parameters.AddWithValue("@SepsisPostOperatoria", eventoAdverso.SepsisPostOperatoria);
                da.SelectCommand.Parameters.AddWithValue("@InfeccionHeridaOperatoria", eventoAdverso.InfeccionHeridaOperatoria);
                da.SelectCommand.Parameters.AddWithValue("@Endometria", eventoAdverso.Endometria);
                da.SelectCommand.Parameters.AddWithValue("@SepsisNeonatal", eventoAdverso.SepsisNeonatal);
                da.SelectCommand.Parameters.AddWithValue("@Flebitis", eventoAdverso.Flebitis);
                da.SelectCommand.Parameters.AddWithValue("@CefaloHematoma", eventoAdverso.CefaloHematoma);
                da.SelectCommand.Parameters.AddWithValue("@LesionPlexoBraquial", eventoAdverso.LesionPlexoBraquial);
                da.SelectCommand.Parameters.AddWithValue("@FracturaClavicula", eventoAdverso.FracturaClavicula);
                da.SelectCommand.Parameters.AddWithValue("@AsfixiaNeonatal", eventoAdverso.AsfixiaNeonatal);
                da.SelectCommand.Parameters.AddWithValue("@SindromeAspiracionLiquido", eventoAdverso.SindromeAspiracionLiquido);
                da.SelectCommand.Parameters.AddWithValue("@ComplicacionesAnestesicas", eventoAdverso.ComplicacionesAnestesicas);
                da.SelectCommand.Parameters.AddWithValue("@LesionIntraoperatoriaRecienNacido", eventoAdverso.LesionIntraoperatoriaRecienNacido);
                da.SelectCommand.Parameters.AddWithValue("@PerforacionUterinaPostLegrado", eventoAdverso.PerforacionUterinaPostLegrado);
                da.SelectCommand.Parameters.AddWithValue("@CaidaPaciente", eventoAdverso.CaidaPaciente);
                da.SelectCommand.Parameters.AddWithValue("@ErrorIdentificacionSexoRecienNacido", eventoAdverso.ErrorIdentificacionSexoRecienNacido);
                da.SelectCommand.Parameters.AddWithValue("@CuerpoExtranioPostCirugia", eventoAdverso.CuerpoExtranioPostCirugia);
                da.SelectCommand.Parameters.AddWithValue("@ComplicacionesIntraPostOperatorio", eventoAdverso.ComplicacionesIntraPostOperatorio);
                da.SelectCommand.Parameters.AddWithValue("@EventoAdversoRelacionadoIntubacion", eventoAdverso.EventoAdversoRelacionadoIntubacion);
                da.SelectCommand.Parameters.AddWithValue("@RelacionTransfusional", eventoAdverso.RelacionTransfusional);
                da.SelectCommand.Parameters.AddWithValue("@ErrorMedicacion", eventoAdverso.ErrorMedicacion);
                da.SelectCommand.Parameters.AddWithValue("@ReaccionAdversa", eventoAdverso.ReaccionAdversa);
                da.SelectCommand.Parameters.AddWithValue("@DesgarroVaginal", eventoAdverso.DesgarroVaginal);
                da.SelectCommand.Parameters.AddWithValue("@Hematomas", eventoAdverso.Hematomas);
                da.SelectCommand.Parameters.AddWithValue("@RupturaUterina", eventoAdverso.RupturaUterina);
                da.SelectCommand.Parameters.AddWithValue("@DesgarroCervical", eventoAdverso.DesgarroCervical);
                da.SelectCommand.Parameters.AddWithValue("@AnemiaAgudaPostProcedimiento", eventoAdverso.AnemiaAgudaPostProcedimiento);
                da.SelectCommand.Parameters.AddWithValue("@RetencionGasaVaginalPostParto", eventoAdverso.RetencionGasaVaginalPostParto);
                da.SelectCommand.Parameters.AddWithValue("@TraumaObstetricoMaternoOtros", eventoAdverso.TraumaObstetricoMaternoOtros);
                da.SelectCommand.Parameters.AddWithValue("@DescripcionTraumaObstetricoMaternoOtros", eventoAdverso.DescripcionTraumaObstetricoMaternoOtros);
                da.SelectCommand.Parameters.AddWithValue("@LaceracionEsparadrapo", eventoAdverso.LaceracionEsparadrapo);
                da.SelectCommand.Parameters.AddWithValue("@QuemaduraTermicaElectrica", eventoAdverso.QuemaduraTermicaElectrica);
                da.SelectCommand.Parameters.AddWithValue("@NeumoniaVentiladorMecanico", eventoAdverso.NeumoniaVentiladorMecanico);
                da.SelectCommand.Parameters.AddWithValue("@DehiscenciaEspisorrafia", eventoAdverso.DehiscenciaEspisorrafia);
                da.SelectCommand.Parameters.AddWithValue("@ObitoFetalExtrahospitalario", eventoAdverso.ObitoFetalExtrahospitalario);
                da.SelectCommand.Parameters.AddWithValue("@InfeccionTractoUrinarioPostCateter", eventoAdverso.InfeccionTractoUrinarioPostCateter);
                da.SelectCommand.Parameters.AddWithValue("@ConjuntivitisRecienNacido", eventoAdverso.ConjuntivitisRecienNacido);
                da.SelectCommand.Parameters.AddWithValue("@Onfalitis", eventoAdverso.Onfalitis);
                da.SelectCommand.Parameters.AddWithValue("@PiodermitisNeonatal", eventoAdverso.PiodermitisNeonatal);
                da.SelectCommand.Parameters.AddWithValue("@OtrasFracturasRecienNacido", eventoAdverso.OtrasFracturasRecienNacido);
                da.SelectCommand.Parameters.AddWithValue("@OtrosEventosAdversos", eventoAdverso.OtrosEventosAdversos);
                da.SelectCommand.Parameters.AddWithValue("@DescripcionOtrosEventosAdversos", eventoAdverso.DescripcionOtrosEventosAdversos);
                da.SelectCommand.Parameters.AddWithValue("@DescripcionEventoAdverso", eventoAdverso.DescripcionEventoAdverso);
                da.SelectCommand.Parameters.AddWithValue("@EventoAdversoPrevenible", eventoAdverso.EventoAdversoPrevenible);
                da.SelectCommand.Parameters.AddWithValue("@ComoPrevenirEventoAdverso", eventoAdverso.ComoPrevenirEventoAdverso);
                da.SelectCommand.Parameters.Add("@clasificacionDiagnostico", SqlDbType.Int).Value = clasificacionDiagnostico;
                da.SelectCommand.Parameters.Add("@diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                da.SelectCommand.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                


                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        
    }
}
