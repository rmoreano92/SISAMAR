using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaEntidades;
using WebAppMaternidad.CapaEntidades;
using System;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace CapaDatos
{
    public class DalEvaluacionGinecoObstetraHosp
    {
        public Task<DataSet> SeleccionarExamenGinecoObstetra(int idAtencion, int idServicio, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenGinecoObstetraSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        //da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarEvaluacion(EvaluacionHospitalizacion objEvaHosp, AntecedentesHospitalizacion antecedentesHospitalizacion, GestacionActualCpnHospitalizacion gestacionActualCpn, TrabajoPartoHospitalizacion trabajoPartoHospitalizacion,
                                String IafaPlanHosp, String RiesgoSocialHosp, String MedicoIngresoHosp, int? TieneIQxHosp, DateTime? FechaIQxHosp, int? MetodoPlanificacionHosp)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionGinecoObstetraHospModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaHosp.IdAtencion;
                        da.SelectCommand.Parameters.Add("@TipoPaciente", SqlDbType.Int).Value = objEvaHosp.TipoPaciente;
                        da.SelectCommand.Parameters.Add("@Prioridad", SqlDbType.Int).Value = objEvaHosp.Prioridad;
                        da.SelectCommand.Parameters.Add("@Glasgow", SqlDbType.Int).Value = objEvaHosp.Glasgow;

                        da.SelectCommand.Parameters.Add("@Apetito", SqlDbType.VarChar).Value = objEvaHosp.apetitoEval;
                        da.SelectCommand.Parameters.Add("@Sed", SqlDbType.VarChar).Value = objEvaHosp.sedEval;
                        da.SelectCommand.Parameters.Add("@Orina", SqlDbType.VarChar).Value = objEvaHosp.orinaEval;
                        da.SelectCommand.Parameters.Add("@Deposiciones", SqlDbType.VarChar).Value = objEvaHosp.deposicionesEval;
                        da.SelectCommand.Parameters.Add("@Suenio", SqlDbType.VarChar).Value = objEvaHosp.suenioEval;

                        da.SelectCommand.Parameters.Add("@Dolor", SqlDbType.Int).Value = objEvaHosp.Dolor;
                        da.SelectCommand.Parameters.Add("@Convulsiones", SqlDbType.Int).Value = objEvaHosp.Convulsiones;
                        da.SelectCommand.Parameters.Add("@Fiebre", SqlDbType.Int).Value = objEvaHosp.Fiebre;
                        da.SelectCommand.Parameters.Add("@Vomitos", SqlDbType.Int).Value = objEvaHosp.Vomitos;
                        da.SelectCommand.Parameters.Add("@ContraccionesU", SqlDbType.Int).Value = objEvaHosp.ContraccionesU;
                        da.SelectCommand.Parameters.Add("@SangradoV", SqlDbType.Int).Value = objEvaHosp.SangradoV;
                        da.SelectCommand.Parameters.Add("@PerdidaLA", SqlDbType.Int).Value = objEvaHosp.PerdidaLA;
                        da.SelectCommand.Parameters.Add("@AusenciaMF", SqlDbType.Int).Value = objEvaHosp.AusenciaMF;
                        da.SelectCommand.Parameters.Add("@SintomasU", SqlDbType.Int).Value = objEvaHosp.SintomasU;
                        da.SelectCommand.Parameters.Add("@FlujoV", SqlDbType.Int).Value = objEvaHosp.FlujoV;
                        da.SelectCommand.Parameters.Add("@Tumoracion", SqlDbType.Int).Value = objEvaHosp.Tumoracion;
                        da.SelectCommand.Parameters.Add("@AlteracionesM", SqlDbType.Int).Value = objEvaHosp.AlteracionesM;
                        da.SelectCommand.Parameters.Add("@DisMovFetales", SqlDbType.Int).Value = objEvaHosp.DisMovFetales;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = objEvaHosp.Otros;

                        da.SelectCommand.Parameters.Add("@Relato", SqlDbType.Text).Value = objEvaHosp.Relato;
                        da.SelectCommand.Parameters.Add("@EnfermedadA", SqlDbType.Text).Value = objEvaHosp.EnfermedadA;

                        da.SelectCommand.Parameters.Add("@FechaUR", SqlDbType.VarChar).Value = objEvaHosp.FechaUR;
                        da.SelectCommand.Parameters.Add("@FechaEco", SqlDbType.VarChar).Value = objEvaHosp.FechaEco;
                        da.SelectCommand.Parameters.Add("@FechaPP", SqlDbType.VarChar).Value = objEvaHosp.FechaPP;
                        //da.SelectCommand.Parameters.Add("@FechaPrimeraEco", SqlDbType.VarChar).Value = objEvaHosp.FechaPrimeraEco;
                        //da.SelectCommand.Parameters.Add("@SemPrimeraEco", SqlDbType.Int).Value = objEvaHosp.SemPrimeraEco;
                        //da.SelectCommand.Parameters.Add("@DiasPrimeraEco", SqlDbType.Int).Value = objEvaHosp.DiasPrimeraEco;
                        da.SelectCommand.Parameters.Add("@EdadGestacional", SqlDbType.Int).Value = objEvaHosp.EdadGestacional;
                        da.SelectCommand.Parameters.Add("@DiasGestacional", SqlDbType.Int).Value = objEvaHosp.DiasGestacional;
                        da.SelectCommand.Parameters.Add("@Cnp", SqlDbType.Int).Value = objEvaHosp.Cnp;
                        da.SelectCommand.Parameters.Add("@GMotiA", SqlDbType.Int).Value = objEvaHosp.GMotiA;
                        da.SelectCommand.Parameters.Add("@PMotiA", SqlDbType.Int).Value = objEvaHosp.PMotiA;
                        da.SelectCommand.Parameters.Add("@Pin", SqlDbType.VarChar).Value = objEvaHosp.Pin;
                        da.SelectCommand.Parameters.Add("@DeltaPeso", SqlDbType.Decimal).Value = objEvaHosp.DeltaPeso;

                        da.SelectCommand.Parameters.Add("@MaduracionPulmonar", SqlDbType.Int).Value = objEvaHosp.MaduracionPulmonar;
                        da.SelectCommand.Parameters.Add("@MaduracionPulmonarDesc", SqlDbType.VarChar).Value = objEvaHosp.MaduracionPulmonarDesc;
                        da.SelectCommand.Parameters.Add("@MaduracionCervical", SqlDbType.Int).Value = objEvaHosp.MaduracionCervical;
                        da.SelectCommand.Parameters.Add("@MaduracionCervicalDesc", SqlDbType.VarChar).Value = objEvaHosp.MaduracionCervicalDesc;

                        da.SelectCommand.Parameters.Add("@Antecedentes", SqlDbType.Text).Value = objEvaHosp.Antecedentes;
                        da.SelectCommand.Parameters.Add("@Ram", SqlDbType.VarChar).Value = objEvaHosp.Ram;
                        da.SelectCommand.Parameters.Add("@TransfucionSangre", SqlDbType.Int).Value = objEvaHosp.TransfucionSangre;

                        da.SelectCommand.Parameters.Add("@AntecedentesQuirurgicos", SqlDbType.Text).Value = objEvaHosp.AntecedentesQuirurgicos;

                        //da.SelectCommand.Parameters.Add("@PesoFetalAnt", SqlDbType.VarChar).Value = objEvaHosp.PesoFetalAnt;

                        da.SelectCommand.Parameters.Add("@DescripcionExamenFisico", SqlDbType.Text).Value = objEvaHosp.DescripcionExamenFisico;

                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = objEvaHosp.idServicio;


                        /////////////////////ANTECEDENTES FAMILIARES/////////////////////////////////////
                        da.SelectCommand.Parameters.Add("@DiabetesFam", SqlDbType.Int).Value = antecedentesHospitalizacion.DiabetesFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DiabetesDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.DiabetesDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TbcFam", SqlDbType.Int).Value = antecedentesHospitalizacion.TbcFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TbcDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.TbcDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HtaFam", SqlDbType.Int).Value = antecedentesHospitalizacion.HtaFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HtaDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.HtaDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GemelaresFam", SqlDbType.Int).Value = antecedentesHospitalizacion.GemelaresFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GemelaresDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.GemelaresDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MalformacionesFam", SqlDbType.Int).Value = antecedentesHospitalizacion.MalformacionesFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MalformacionesDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.MalformacionesDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PreEclampsiaFam", SqlDbType.Int).Value = antecedentesHospitalizacion.PreEclampsiaFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PreEclampsiaDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.PreEclampsiaDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CondMedicaGraveAntFam", SqlDbType.Int).Value = antecedentesHospitalizacion.CondMedicaGraveAntFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OtrosCondMedicaGraveAntFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.OtrosCondMedicaGraveAntFam ?? DBNull.Value;

                        da.SelectCommand.Parameters.Add("@OtrosAntFam", SqlDbType.Int).Value = antecedentesHospitalizacion.OtrosAntFam ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OtrosAntDescripcionFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.OtrosAntDescripcionFam ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AntecedentesGeneralesFam", SqlDbType.VarChar).Value = (object)antecedentesHospitalizacion.AntecedentesGeneralesFam ?? DBNull.Value;


                        /////////////////////ANTECEDENTES PERSONALES/////////////////////////////////////
                        da.SelectCommand.Parameters.Add("@TbcPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.TbcPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TbcPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.TbcPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@HtaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.HtaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HtaPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.HtaPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@VIHPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.VIHPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VIHPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.VIHPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@CirugiaMayorPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.CirugiaMayorPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CirugiaMayorPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.CirugiaMayorPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@VacunaPreviaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.VacunaPreviaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VacunaPreviaPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.VacunaPreviaPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@DiabetesPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.DiabetesPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DiabetesPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.DiabetesPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@PreEclampsiaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.PreEclampsiaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PreEclampsiaPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.PreEclampsiaPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@AlergiaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.AlergiaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AlergiaPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.AlergiaPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@ViolenciaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.ViolenciaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ViolenciaPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.ViolenciaPersoDescripcion ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@CondMedicaGravePerso", SqlDbType.Int).Value = antecedentesHospitalizacion.CondMedicaGravePerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CondMedicaGraveAntDescripcionPerso", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.CondMedicaGraveAntDescripcionPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CardiopatiaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.CardiopatiaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CardiopatiaAntDescripcionPerso", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.CardiopatiaAntDescripcionPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MetropatiaPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.MetropatiaPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MetropatiaPersoAntDescripcionPerso", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.MetropatiaPersoAntDescripcionPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OtrosPerso", SqlDbType.Int).Value = antecedentesHospitalizacion.OtrosPerso ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OtrosPersoDescripcion", SqlDbType.VarChar, 255).Value = antecedentesHospitalizacion.OtrosPersoDescripcion ?? (object)DBNull.Value;

                        /////////////////////ANTECEDENTES OBSTETRICOS/////////////////////////////////////
                        da.SelectCommand.Parameters.Add("@GestasPObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.GestasPObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AbortosObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.AbortosObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VaginalesObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.VaginalesObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NacidosVivosObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.NacidosVivosObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VivenObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.VivenObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Sem1Obst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.Sem1Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PartosObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.PartosObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CesareasObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.CesareasObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NacMuertosObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.NacMuertosObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Desp1SemObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.Desp1SemObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PesoPregestaObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.PesoPregestaObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Par1Obst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.Par1Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Par2Obst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.Par2Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Par3Obst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.Par3Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Par4Obst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.Par4Obst ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@GemelaresObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.GemelaresObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GemelaresDescripcionObst", SqlDbType.VarChar).Value = antecedentesHospitalizacion.GemelaresDescripcionObst ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@FinEmbObst", SqlDbType.DateTime).Value = antecedentesHospitalizacion.FinEmbObst ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@TerminacionObst", SqlDbType.Int).Value = antecedentesHospitalizacion.TerminacionObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AbortoObst", SqlDbType.Int).Value = antecedentesHospitalizacion.AbortoObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FracasoObst", SqlDbType.Int).Value = antecedentesHospitalizacion.FracasoObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EmbPlaneadoObst", SqlDbType.Int).Value = antecedentesHospitalizacion.EmbPlaneadoObst ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@Peso2500Obst", SqlDbType.Int).Value = antecedentesHospitalizacion.Peso2500Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MultObst", SqlDbType.Int).Value = antecedentesHospitalizacion.MultObst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Sem37Obst", SqlDbType.Int).Value = antecedentesHospitalizacion.Sem37Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Peso4000Obst", SqlDbType.Int).Value = antecedentesHospitalizacion.Peso4000Obst ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EtOtopicoObst", SqlDbType.Int).Value = antecedentesHospitalizacion.EtOtopicoObst ?? (object)DBNull.Value;


                        /////////////////////GESTACION ACTUAL/////////////////////////////////////
                        da.SelectCommand.Parameters.Add("@FechaFURGA", SqlDbType.Date).Value = gestacionActualCpn.FechaFURGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EGsemanasGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.EGsemanasGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EGdiasGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.EGdiasGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaFPPGA", SqlDbType.Date).Value = gestacionActualCpn.FechaFPPGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FEcogGA", SqlDbType.Date).Value = gestacionActualCpn.FEcogGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@SemasEcoGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.SemasEcoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DiasEcoGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DiasEcoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PesoAntGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.PesoAntGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TallaAntGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.TallaAntGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TipoDrogaGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.TipoDrogaGA ?? (object)DBNull.Value;

                        // Parámetros de tipo int (cbo)
                        da.SelectCommand.Parameters.Add("@EdadGestConfiableCA", SqlDbType.Int).Value = gestacionActualCpn.EdadGestConfiableCA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AlcoholDrogaGA", SqlDbType.Int).Value = gestacionActualCpn.AlcoholDrogaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TrimestreGA", SqlDbType.Int).Value = gestacionActualCpn.TrimestreGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ExOdontoGA", SqlDbType.Int).Value = gestacionActualCpn.ExOdontoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ExCervixGA", SqlDbType.Int).Value = gestacionActualCpn.ExCervixGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PreparacionPartoGA", SqlDbType.Int).Value = gestacionActualCpn.PreparacionPartoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ViolenciaGA", SqlDbType.Int).Value = gestacionActualCpn.ViolenciaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TrimestreVGA", SqlDbType.Int).Value = gestacionActualCpn.TrimestreVGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ExMamasGA", SqlDbType.Int).Value = gestacionActualCpn.ExMamasGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ConsejeriaLMGA", SqlDbType.Int).Value = gestacionActualCpn.ConsejeriaLMGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TamizajeHepatitisBGA", SqlDbType.Int).Value = gestacionActualCpn.TamizajeHepatitisBGA ?? (object)DBNull.Value;

                        // Parámetros para vacunas
                        da.SelectCommand.Parameters.Add("@TetanoGA", SqlDbType.Int).Value = gestacionActualCpn.TetanoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DosisTetanoGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DosisTetanoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaTetanoGA", SqlDbType.Date).Value = gestacionActualCpn.FechaTetanoGA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@TDAPGA", SqlDbType.Int).Value = gestacionActualCpn.TDAPGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DosisTDAPGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DosisTDAPGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaTDAPGA", SqlDbType.Date).Value = gestacionActualCpn.FechaTDAPGA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@InfluenzaGA", SqlDbType.Int).Value = gestacionActualCpn.InfluenzaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DosisInfluenzaGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DosisInfluenzaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaInfluenzaGA", SqlDbType.Date).Value = gestacionActualCpn.FechaInfluenzaGA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@AntirubiolaGA", SqlDbType.Int).Value = gestacionActualCpn.AntirubiolaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DosisAntirubiolaGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DosisAntirubiolaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaAntirubiolaGA", SqlDbType.Date).Value = gestacionActualCpn.FechaAntirubiolaGA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@HepatitisBGA", SqlDbType.Int).Value = gestacionActualCpn.HepatitisBGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DosisHepatitisBGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DosisHepatitisBGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaHepatitisBGA", SqlDbType.Date).Value = gestacionActualCpn.FechaHepatitisBGA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@HepatitisAGA", SqlDbType.Int).Value = gestacionActualCpn.HepatitisAGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DosisHepatitisAGA", SqlDbType.NVarChar, 50).Value = gestacionActualCpn.DosisHepatitisAGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaHepatitisAGA", SqlDbType.Date).Value = gestacionActualCpn.FechaHepatitisAGA ?? (object)DBNull.Value;

                        // Parámetros de tipo int (chk)
                        da.SelectCommand.Parameters.Add("@MuestraEcoGA", SqlDbType.Int).Value = gestacionActualCpn.MuestraEcoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CalculaFechaEcoGA", SqlDbType.Int).Value = gestacionActualCpn.CalculaFechaEcoGA ?? (object)DBNull.Value;


                        da.SelectCommand.Parameters.Add("@GrupoSanguineoGA", SqlDbType.VarChar).Value = gestacionActualCpn.GrupoSanguineoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FactorRhGA", SqlDbType.VarChar).Value = gestacionActualCpn.FactorRhGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ToxoplasmosisGA", SqlDbType.Int).Value = gestacionActualCpn.ToxoplasmosisGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PapanicolauGA", SqlDbType.Int).Value = gestacionActualCpn.PapanicolauGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VihSolicitadoGA", SqlDbType.Int).Value = gestacionActualCpn.VihSolicitadoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VdrlRprMenor20GA", SqlDbType.Int).Value = gestacionActualCpn.VdrlRprMenor20GA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VdrlRprMayor20GA", SqlDbType.Int).Value = gestacionActualCpn.VdrlRprMayor20GA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@SifilisFtaGA", SqlDbType.Int).Value = gestacionActualCpn.SifilisFtaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HbMenor20GA", SqlDbType.VarChar).Value = gestacionActualCpn.HbMenor20GA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HbMayor20GA", SqlDbType.VarChar).Value = gestacionActualCpn.HbMayor20GA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FolatosGA", SqlDbType.Int).Value = gestacionActualCpn.FolatosGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@VersExterGA", SqlDbType.Int).Value = gestacionActualCpn.VersExterGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@BacteriuriaGA", SqlDbType.Int).Value = gestacionActualCpn.BacteriuriaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ChagasGA", SqlDbType.Int).Value = gestacionActualCpn.ChagasGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PaludismoMalariaGA", SqlDbType.Int).Value = gestacionActualCpn.PaludismoMalariaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EstreptococoGA", SqlDbType.Int).Value = gestacionActualCpn.EstreptococoGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GlausemiaMenor20GA", SqlDbType.VarChar).Value = gestacionActualCpn.GlausemiaMenor20GA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GlausemiaMayor20GA", SqlDbType.VarChar).Value = gestacionActualCpn.GlausemiaMayor20GA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@ControlInmpGA", SqlDbType.Int).Value = gestacionActualCpn.ControlInmpGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NumControlesInmpGA", SqlDbType.VarChar).Value = gestacionActualCpn.NumControlesInmpGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdReferenciaEESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.IdReferenciaEESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CodigoReferenciaEESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.CodigoReferenciaEESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DescripcionReferenciaEESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.DescripcionReferenciaEESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NumControlesOtroESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.NumControlesOtroESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdReferenciaOtroEESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.IdReferenciaOtroEESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CodigoReferenciaOtroEESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.CodigoReferenciaOtroEESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DescripcionReferenciaOtroEESSGA", SqlDbType.VarChar).Value = gestacionActualCpn.DescripcionReferenciaOtroEESSGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MotivoReferenciaGA", SqlDbType.VarChar).Value = gestacionActualCpn.MotivoReferenciaGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RequirioHospitalizacionGA", SqlDbType.Int).Value = gestacionActualCpn.RequirioHospitalizacionGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DiasHospitalizacionCpnGA", SqlDbType.VarChar).Value = gestacionActualCpn.DiasHospitalizacionCpnGA ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ObservacionesCpnGA", SqlDbType.VarChar).Value = gestacionActualCpn.ObservacionesCpnGA ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@FechaPrimerControl", SqlDbType.DateTime).Value = gestacionActualCpn.FechaPrimerControl ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaUltimoControl", SqlDbType.DateTime).Value = gestacionActualCpn.FechaUltimoControl ?? (object)DBNull.Value;

                        da.SelectCommand.Parameters.Add("@FechaUltimoIngresoCqTp", SqlDbType.DateTime).Value = trabajoPartoHospitalizacion.FechaUltimoIngresoCqTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CorticoidesAntenatalesCiclosTp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.CorticoidesAntenatalesCiclosTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CorticoidesAntenatalesSemanasTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.CorticoidesAntenatalesSemanasTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@InicioTipoTp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.InicioTipoTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EdadGestacionalPartoTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.EdadGestacionalPartoTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PresentacionSituacionTp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.PresentacionSituacionTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TamanioFetalTp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.TamanioFetalTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMembranaTp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.RoturaMembranaTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMembranaDiaTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.RoturaMembranaDiaTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMembranaMesTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.RoturaMembranaMesTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMembranaAnioTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.RoturaMembranaAnioTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMenor37Sem", SqlDbType.Int).Value = trabajoPartoHospitalizacion.RoturaMenor37Sem ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMembranaHoraTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.RoturaMembranaHoraTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RoturaMembranaMinutoTp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.RoturaMembranaMinutoTp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Mayor18Horas", SqlDbType.Int).Value = trabajoPartoHospitalizacion.Mayor18Horas ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Mayor38Grados", SqlDbType.Int).Value = trabajoPartoHospitalizacion.Mayor38Grados ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TerminacionAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.TerminacionAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CausaInduccionAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.CausaInduccionAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AcompanianteAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.AcompanianteAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PosicionPartoAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.PosicionPartoAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EpisiotomiaAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.EpisiotomiaAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@DesgarroAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.DesgarroAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OcitocAlumbramAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.OcitocAlumbramAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PlacentaPreviaAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.PlacentaPreviaAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@LigaduraCordonAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.LigaduraCordonAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MedicacionAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.MedicacionAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MgSulfatoAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.MgSulfatoAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OcitocicosAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.OcitocicosAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AntibioticosAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.AntibioticosAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AnalgesiaAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.AnalgesiaAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AnestesiaRegionalAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.AnestesiaRegionalAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AnestesiaGeneralAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.AnestesiaGeneralAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TransfusionAp", SqlDbType.Int).Value = trabajoPartoHospitalizacion.TransfusionAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ObservacionesAtencionPartoAp", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.ObservacionesAtencionPartoAp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaPartoNacimiento", SqlDbType.DateTime).Value = trabajoPartoHospitalizacion.FechaPartoNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HoraPartoNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.HoraPartoNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TipoGestacionNacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.TipoGestacionNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NumFetosNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.NumFetosNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GemelarNacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.GemelarNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@CondicionNacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.CondicionNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ObitoMenor500Nacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.ObitoMenor500Nacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ObitoMayor500Nacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.ObitoMayor500Nacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PesoNacerNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.PesoNacerNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TallaNacerNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.TallaNacerNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PerimetroCefalicoNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.PerimetroCefalicoNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EdadGestAlNacerNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.EdadGestAlNacerNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Apgar1MinNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.Apgar1MinNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Apgar5MinNacimiento", SqlDbType.VarChar).Value = trabajoPartoHospitalizacion.Apgar5MinNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RespuestaLlanoInmediatoNacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.RespuestaLlanoInmediatoNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RespuestaLlanoReanimacionNacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.RespuestaLlanoReanimacionNacimiento ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RespuestaLlanoPatologiaNeonatalNacimiento", SqlDbType.Int).Value = trabajoPartoHospitalizacion.RespuestaLlanoPatologiaNeonatalNacimiento ?? (object)DBNull.Value;


                        da.SelectCommand.Parameters.Add("@IafaPlanHosp", SqlDbType.VarChar).Value = IafaPlanHosp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RiesgoSocialHosp", SqlDbType.VarChar).Value = RiesgoSocialHosp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MedicoIngresoHosp", SqlDbType.VarChar).Value = MedicoIngresoHosp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TieneIQxHosp", SqlDbType.Int).Value = TieneIQxHosp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaIQxHosp", SqlDbType.DateTime).Value = FechaIQxHosp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@MetodoPlanificacionHosp", SqlDbType.VarChar).Value = MetodoPlanificacionHosp ?? (object)DBNull.Value;


                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objEvaHosp.IdUsuario;





                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<DataSet> GuardarExamenGinecoObstetra(ExamenGinecoObstetra objExamen)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenGinecoObstetraModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objExamen.IdAtencion;
                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = objExamen.idServicio;

                        da.SelectCommand.Parameters.Add("@EstadoGeneralSensorio", SqlDbType.Int).Value = objExamen.LEstadoGeneral;
                        da.SelectCommand.Parameters.Add("@DEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExamen.DEstadoGeneral;
                        da.SelectCommand.Parameters.Add("@EEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExamen.DEdemas;
                        da.SelectCommand.Parameters.Add("@AparatoCardioVascular", SqlDbType.Int).Value = objExamen.LAparatoCV;
                        da.SelectCommand.Parameters.Add("@DAparatoCardioVascular", SqlDbType.VarChar).Value = objExamen.DAparatoCV;
                        da.SelectCommand.Parameters.Add("@RAparatoCardioVascular", SqlDbType.VarChar).Value = objExamen.DReflejos;
                        da.SelectCommand.Parameters.Add("@Abdomen", SqlDbType.Int).Value = objExamen.LAbdomen;
                        da.SelectCommand.Parameters.Add("@DAbdomen", SqlDbType.VarChar).Value = objExamen.DAbdomen;
                        da.SelectCommand.Parameters.Add("@AparatoRespiratorio", SqlDbType.Int).Value = objExamen.LAparatoR;
                        da.SelectCommand.Parameters.Add("@DAparatoRespiratorio", SqlDbType.VarChar).Value = objExamen.DAparatoR;
                        da.SelectCommand.Parameters.Add("@AparatoUrinario", SqlDbType.Int).Value = objExamen.LAparatoU;
                        da.SelectCommand.Parameters.Add("@DAparatoUrinario", SqlDbType.VarChar).Value = objExamen.DAparatoU;
                        da.SelectCommand.Parameters.Add("@Extremidades", SqlDbType.Int).Value = objExamen.LExtremidades;
                        da.SelectCommand.Parameters.Add("@DExtremidades", SqlDbType.VarChar).Value = objExamen.DExtremidades;
                        da.SelectCommand.Parameters.Add("@Neurologico", SqlDbType.Int).Value = objExamen.LNeurologico;
                        da.SelectCommand.Parameters.Add("@DNeurologico", SqlDbType.VarChar).Value = objExamen.DNeurologico;
                        da.SelectCommand.Parameters.Add("@Piel", SqlDbType.Int).Value = objExamen.LPiel;
                        da.SelectCommand.Parameters.Add("@DPiel", SqlDbType.VarChar).Value = objExamen.DPiel;

                        da.SelectCommand.Parameters.Add("@GeBus", SqlDbType.Int).Value = objExamen.LGeBus;
                        da.SelectCommand.Parameters.Add("@DGeBus", SqlDbType.VarChar).Value = objExamen.DGeBus;
                        da.SelectCommand.Parameters.Add("@Vagina", SqlDbType.Int).Value = objExamen.LVagina;
                        da.SelectCommand.Parameters.Add("@DVagina", SqlDbType.VarChar).Value = objExamen.DVagina;
                        da.SelectCommand.Parameters.Add("@Cervix", SqlDbType.Int).Value = objExamen.LCervix;
                        da.SelectCommand.Parameters.Add("@DCervix", SqlDbType.VarChar).Value = objExamen.DCervix;
                        da.SelectCommand.Parameters.Add("@Utero", SqlDbType.Int).Value = objExamen.LUtero;
                        da.SelectCommand.Parameters.Add("@DUtero", SqlDbType.VarChar).Value = objExamen.DUtero;
                        da.SelectCommand.Parameters.Add("@Anexos", SqlDbType.Int).Value = objExamen.LAnexos;
                        da.SelectCommand.Parameters.Add("@DAnexos", SqlDbType.VarChar).Value = objExamen.DAnexos;
                        da.SelectCommand.Parameters.Add("@FsDouglas", SqlDbType.Int).Value = objExamen.LDouglas;
                        da.SelectCommand.Parameters.Add("@DFsDouglas", SqlDbType.VarChar).Value = objExamen.DDouglas;
                        da.SelectCommand.Parameters.Add("@Parametros", SqlDbType.Int).Value = objExamen.LParametros;
                        da.SelectCommand.Parameters.Add("@DParametros", SqlDbType.VarChar).Value = objExamen.DParametros;
                        da.SelectCommand.Parameters.Add("@Mamas", SqlDbType.Int).Value = objExamen.LMamas;
                        da.SelectCommand.Parameters.Add("@DMamas", SqlDbType.VarChar).Value = objExamen.DMamas;
                        da.SelectCommand.Parameters.Add("@ObservacionGinecologicaEspeculoscopia", SqlDbType.Text).Value = objExamen.ObservacionGinecologica;

                        da.SelectCommand.Parameters.Add("@AlturaUterina", SqlDbType.Int).Value = objExamen.LUA;
                        da.SelectCommand.Parameters.Add("@Lcf", SqlDbType.Int).Value = objExamen.LLCF;
                        da.SelectCommand.Parameters.Add("@Du", SqlDbType.Int).Value = objExamen.LDU;

                        da.SelectCommand.Parameters.Add("@Dips", SqlDbType.Int).Value = objExamen.LDips;
                        da.SelectCommand.Parameters.Add("@Soplos", SqlDbType.Int).Value = objExamen.LSoplos;
                        da.SelectCommand.Parameters.Add("@Hidromios", SqlDbType.Int).Value = objExamen.LHidraminios;
                        da.SelectCommand.Parameters.Add("@Ponderado", SqlDbType.Int).Value = objExamen.LPonderado;
                        da.SelectCommand.Parameters.Add("@PonderadoClinico", SqlDbType.Int).Value = objExamen.LPonderadoClinico;
                        da.SelectCommand.Parameters.Add("@PonderadoEcografo", SqlDbType.Int).Value = objExamen.LPonderadoEcografo;

                        da.SelectCommand.Parameters.Add("@TipoEmbarazo", SqlDbType.Int).Value = objExamen.LTipoEmbarazo;
                        da.SelectCommand.Parameters.Add("@Situacion", SqlDbType.Int).Value = objExamen.LSituacion;
                        da.SelectCommand.Parameters.Add("@Posicion", SqlDbType.Int).Value = objExamen.LPosicion;
                        da.SelectCommand.Parameters.Add("@Presentacion", SqlDbType.Int).Value = objExamen.LPresentacion;
                        da.SelectCommand.Parameters.Add("@MovFetales", SqlDbType.VarChar).Value = objExamen.MovFetales;
                        da.SelectCommand.Parameters.Add("@ObservacionesObstetricas", SqlDbType.Text).Value = objExamen.DObservacionesObstetricas;
                        da.SelectCommand.Parameters.Add("@DF1Spp", SqlDbType.VarChar).Value = objExamen.DF1Spp;
                        da.SelectCommand.Parameters.Add("@DF2Spp", SqlDbType.VarChar).Value = objExamen.DF2Spp;
                        da.SelectCommand.Parameters.Add("@DF3Spp", SqlDbType.VarChar).Value = objExamen.DF3Spp;
                        da.SelectCommand.Parameters.Add("@LF1Lcf", SqlDbType.Int).Value = objExamen.LF1Lcf == null ? 0 : objExamen.LF1Lcf;
                        da.SelectCommand.Parameters.Add("@LF2Lcf", SqlDbType.Int).Value = objExamen.LF2Lcf == null ? 0 : objExamen.LF2Lcf;
                        da.SelectCommand.Parameters.Add("@LF3Lcf", SqlDbType.Int).Value = objExamen.LF3Lcf == null ? 0 : objExamen.LF3Lcf;
                        da.SelectCommand.Parameters.Add("@DF1Mf", SqlDbType.VarChar).Value = objExamen.MFF01;
                        da.SelectCommand.Parameters.Add("@DF2Mf", SqlDbType.VarChar).Value = objExamen.MFF02;
                        da.SelectCommand.Parameters.Add("@DF3Mf", SqlDbType.VarChar).Value = objExamen.MFF03;

                        da.SelectCommand.Parameters.Add("@TactoVaginal", SqlDbType.Int).Value = objExamen.LTipoTactoVaginal;
                        da.SelectCommand.Parameters.Add("@Dilatacion", SqlDbType.Int).Value = objExamen.LDilatacion;
                        da.SelectCommand.Parameters.Add("@Incorporacion", SqlDbType.Int).Value = objExamen.LIncorporacion;
                        da.SelectCommand.Parameters.Add("@AltPresen", SqlDbType.VarChar).Value = objExamen.LAlPresent;
                        da.SelectCommand.Parameters.Add("@VarPresen", SqlDbType.VarChar).Value = objExamen.DVarPresent;
                        da.SelectCommand.Parameters.Add("@MembranaRota", SqlDbType.Int).Value = objExamen.MembranasRotas;
                        da.SelectCommand.Parameters.Add("@Procubito", SqlDbType.Int).Value = objExamen.LProcubito;
                        da.SelectCommand.Parameters.Add("@Prolapso", SqlDbType.Int).Value = objExamen.LProlapso;
                        da.SelectCommand.Parameters.Add("@SangradoVaginal", SqlDbType.VarChar).Value = objExamen.DSangradoV;
                        da.SelectCommand.Parameters.Add("@PelvSuperior", SqlDbType.Int).Value = objExamen.LPelvimetriaSup;
                        da.SelectCommand.Parameters.Add("@PelvMedio", SqlDbType.Int).Value = objExamen.LPelvimetriaMed;
                        da.SelectCommand.Parameters.Add("@PelvInf", SqlDbType.Int).Value = objExamen.LPelvimetriaInf;
                        da.SelectCommand.Parameters.Add("@PelvGinecoide", SqlDbType.Int).Value = objExamen.LPelvisGinecoide;
                        da.SelectCommand.Parameters.Add("@PelvisGinecoideDescripcion", SqlDbType.VarChar).Value = objExamen.PelvisGineDesc;
                        da.SelectCommand.Parameters.Add("@LiquidoAmniotico", SqlDbType.Int).Value = objExamen.LLiquidoA;
                        da.SelectCommand.Parameters.Add("@MalOlor", SqlDbType.Int).Value = objExamen.MalOlor;
                        da.SelectCommand.Parameters.Add("@CompFetoPelvica", SqlDbType.Int).Value = objExamen.LCompatibilidadF;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objExamen.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarEvaluacionDetalle(EvaluacionHospitalizacionDetalle objEvaHosp)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionGinecoObstetraDetalleHospModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaHosp.IdAtencion;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = objEvaHosp.IdNumero;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = objEvaHosp.idservicio;

                        da.SelectCommand.Parameters.Add("@ImpresionDiagnostica", SqlDbType.Text).Value = objEvaHosp.Seguimiento;
                        da.SelectCommand.Parameters.Add("@Tratamiento", SqlDbType.Text).Value = objEvaHosp.Tratamiento;
                        da.SelectCommand.Parameters.Add("@PlanTrabajo", SqlDbType.Text).Value = objEvaHosp.PlandeTrabajo;
                        da.SelectCommand.Parameters.Add("@FechaInicioAtencion", SqlDbType.VarChar).Value = objEvaHosp.fecha.ToString("dd/MM/yyyy");
                        da.SelectCommand.Parameters.Add("@HoraInicioAtencion", SqlDbType.Char).Value = objEvaHosp.HoraInicioAtencion;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objEvaHosp.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }


        public Task<DataSet> SeleccionarInformeEvaluacionHospitalizacion(int idAtencion, int idServicio, int eval, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionGinecoObstetraHospInforme";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = eval;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EstanciaHospitalariaSeleccionarPorAtencion(int idAtencion, int SecuenciaMayorA)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EstanciaHospitalariaSeleccionarPorAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@SecuenciaMayorA", SqlDbType.Int).Value = SecuenciaMayorA;
                        //da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
    }
}
