using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalEvaluacionesUCI
    {
        public Task<int> CrearModificarAtencionesEvaluacionUCI(
                int IdAtencionUCI, int IdAtencion, int TipoProcedencia, int EstablecimientoProcedenciaReferido, int EstablecimientoProcedenciaInstitucional,
                int TipoIngresoUCI, DateTime FechaIngresoMGP, string HoraIngresoMGP, DateTime FechaIngresoUCI, string HoraIngresoUCI, int IdCamaUCI, List<Diagnosticos> lstObjOtrasPatologias
            ) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlOtrasPatologias = XmlUtil.Serializer(typeof(List<Diagnosticos>), lstObjOtrasPatologias);

                        string sql = "Web_CrearModificarAtencionesEvaluacionUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                        cmd.Parameters.AddWithValue("@TipoProcedencia", TipoProcedencia);
                        cmd.Parameters.AddWithValue("@EstablecimientoProcedenciaReferido", EstablecimientoProcedenciaReferido);
                        cmd.Parameters.AddWithValue("@EstablecimientoProcedenciaInstitucional", EstablecimientoProcedenciaInstitucional);
                        cmd.Parameters.AddWithValue("@TipoIngresoUCI", TipoIngresoUCI);
                        cmd.Parameters.AddWithValue("@FechaIngresoMGP", FechaIngresoMGP);
                        cmd.Parameters.AddWithValue("@HoraIngresoMGP", HoraIngresoMGP);
                        cmd.Parameters.AddWithValue("@FechaIngresoUCI", FechaIngresoUCI);
                        cmd.Parameters.AddWithValue("@HoraIngresoUCI", HoraIngresoUCI);
                        cmd.Parameters.AddWithValue("@IdCamaUCI", IdCamaUCI);

                        cmd.Parameters.AddWithValue("@OtrasPatologias", xmlOtrasPatologias);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CrearModificarAntecedentesFamiliaresUCI(int IdAtencionUCI, AntecedentesFamiliaresUCI antecedentesFamiliaresUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarAntecedentesFamiliaresUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        cmd.Parameters.AddWithValue("@Diabetes", antecedentesFamiliaresUCI.Diabetes);
                        cmd.Parameters.AddWithValue("@DiabetesDescripcion", antecedentesFamiliaresUCI.DiabetesDescripcion);
                        cmd.Parameters.AddWithValue("@DiabetesPatMat", antecedentesFamiliaresUCI.DiabetesPatMat);
                        cmd.Parameters.AddWithValue("@TBC", antecedentesFamiliaresUCI.TBC);
                        cmd.Parameters.AddWithValue("@TBCDescripcion", antecedentesFamiliaresUCI.TBCDescripcion);
                        cmd.Parameters.AddWithValue("@TBCPatMat", antecedentesFamiliaresUCI.TBCPatMat);
                        cmd.Parameters.AddWithValue("@Hipertension", antecedentesFamiliaresUCI.Hipertension);
                        cmd.Parameters.AddWithValue("@HipertensionDescripcion", antecedentesFamiliaresUCI.HipertensionDescripcion);
                        cmd.Parameters.AddWithValue("@HipertensionPatMat", antecedentesFamiliaresUCI.HipertensionPatMat);
                        cmd.Parameters.AddWithValue("@NeoCancer", antecedentesFamiliaresUCI.NeoCancer);
                        cmd.Parameters.AddWithValue("@NeoCancerDescripcion", antecedentesFamiliaresUCI.NeoCancerDescripcion);
                        cmd.Parameters.AddWithValue("@NeoCancerPatMat", antecedentesFamiliaresUCI.NeoCancerPatMat);
                        cmd.Parameters.AddWithValue("@EnfTiroidea", antecedentesFamiliaresUCI.EnfTiroidea);
                        cmd.Parameters.AddWithValue("@EnfTiroideaDescripcion", antecedentesFamiliaresUCI.EnfTiroideaDescripcion);
                        cmd.Parameters.AddWithValue("@EnfTiroideaPatMat", antecedentesFamiliaresUCI.EnfTiroideaPatMat);
                        cmd.Parameters.AddWithValue("@EnfReumatica", antecedentesFamiliaresUCI.EnfReumatica);
                        cmd.Parameters.AddWithValue("@EnfReumaticaDescripcion", antecedentesFamiliaresUCI.EnfReumaticaDescripcion);
                        cmd.Parameters.AddWithValue("@EnfReumaticaPatMat", antecedentesFamiliaresUCI.EnfReumaticaPatMat);
                        cmd.Parameters.AddWithValue("@Asma", antecedentesFamiliaresUCI.Asma);
                        cmd.Parameters.AddWithValue("@AsmaDescripcion", antecedentesFamiliaresUCI.AsmaDescripcion);
                        cmd.Parameters.AddWithValue("@AsmaPatMat", antecedentesFamiliaresUCI.AsmaPatMat);
                        cmd.Parameters.AddWithValue("@Otros", antecedentesFamiliaresUCI.Otros);
                        cmd.Parameters.AddWithValue("@OtrosDescripcion", antecedentesFamiliaresUCI.OtrosDescripcion);
                        cmd.Parameters.AddWithValue("@OtrosPatMat", antecedentesFamiliaresUCI.OtrosPatMat);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarAntecedentesPersonalesUCI(int IdAtencionUCI, AntecedentesPersonalesUCI antecedentesPersonalesUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarAntecedentesPersonalesUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        cmd.Parameters.AddWithValue("@GrupoSanguineo", antecedentesPersonalesUCI.GrupoSanguineo);
                        cmd.Parameters.AddWithValue("@Factor", antecedentesPersonalesUCI.Factor);
                        cmd.Parameters.AddWithValue("@ActividadFisica", antecedentesPersonalesUCI.ActividadFisica);
                        cmd.Parameters.AddWithValue("@Alimentacion1", antecedentesPersonalesUCI.Alimentacion1);
                        cmd.Parameters.AddWithValue("@Alimentacion2", antecedentesPersonalesUCI.Alimentacion2);
                        cmd.Parameters.AddWithValue("@Alimentacion3", antecedentesPersonalesUCI.Alimentacion3);
                        cmd.Parameters.AddWithValue("@AlimentacionMas3", antecedentesPersonalesUCI.AlimentacionMas3);
                        cmd.Parameters.AddWithValue("@TipoAlimentacionCarnes", antecedentesPersonalesUCI.TipoAlimentacionCarnes);
                        cmd.Parameters.AddWithValue("@TipoAlimentacionMixta", antecedentesPersonalesUCI.TipoAlimentacionMixta);
                        cmd.Parameters.AddWithValue("@TipoAlimentacionVegetariana", antecedentesPersonalesUCI.TipoAlimentacionVegetariana);
                        cmd.Parameters.AddWithValue("@TipoAlimentacionProcesados", antecedentesPersonalesUCI.TipoAlimentacionProcesados);
                        cmd.Parameters.AddWithValue("@TipoAlimentacionOtro", antecedentesPersonalesUCI.TipoAlimentacionOtro);
                        cmd.Parameters.AddWithValue("@TipoAlimentacionOtroDescripcion", antecedentesPersonalesUCI.TipoAlimentacionOtroDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaInfluenza", antecedentesPersonalesUCI.VacunaInfluenza);
                        cmd.Parameters.AddWithValue("@VacunaInfluenzaDescripcion", antecedentesPersonalesUCI.VacunaInfluenzaDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaDTAdulta", antecedentesPersonalesUCI.VacunaDTAdulta);
                        cmd.Parameters.AddWithValue("@VacunaDTAdultaDescripcion", antecedentesPersonalesUCI.VacunaDTAdultaDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaTexoideTetanico", antecedentesPersonalesUCI.VacunaTexoideTetanico);
                        cmd.Parameters.AddWithValue("@VacunaTexoideTetanicoDescripcion", antecedentesPersonalesUCI.VacunaTexoideTetanicoDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaFiebreAmarilla", antecedentesPersonalesUCI.VacunaFiebreAmarilla);
                        cmd.Parameters.AddWithValue("@VacunaFiebreAmarillaDescripcion", antecedentesPersonalesUCI.VacunaFiebreAmarillaDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaHepatitisB", antecedentesPersonalesUCI.VacunaHepatitisB);
                        cmd.Parameters.AddWithValue("@VacunaHepatitisBDescripcion", antecedentesPersonalesUCI.VacunaHepatitisBDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaBCG", antecedentesPersonalesUCI.VacunaBCG);
                        cmd.Parameters.AddWithValue("@VacunaBCGDescripcion", antecedentesPersonalesUCI.VacunaBCGDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaPapilomavirus", antecedentesPersonalesUCI.VacunaPapilomavirus);
                        cmd.Parameters.AddWithValue("@VacunaPapilomavirusDescripcion", antecedentesPersonalesUCI.VacunaPapilomavirusDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaOtra", antecedentesPersonalesUCI.VacunaOtra);
                        cmd.Parameters.AddWithValue("@VacunaOtraDescripcion", antecedentesPersonalesUCI.VacunaOtraDescripcion);
                        cmd.Parameters.AddWithValue("@VacunaCovidNroDosis", antecedentesPersonalesUCI.VacunaCovidNroDosis);
                        cmd.Parameters.AddWithValue("@FechaUltimaVacunaCovid", antecedentesPersonalesUCI.FechaUltimaVacunaCovid ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@HbBebidasAlcoholicas", antecedentesPersonalesUCI.HbBebidasAlcoholicas);
                        cmd.Parameters.AddWithValue("@HbBebidasAlcoholicasDescripcion", antecedentesPersonalesUCI.HbBebidasAlcoholicasDescripcion);
                        cmd.Parameters.AddWithValue("@HbDrogas", antecedentesPersonalesUCI.HbDrogas);
                        cmd.Parameters.AddWithValue("@HbDrogasDescripcion", antecedentesPersonalesUCI.HbDrogasDescripcion);
                        cmd.Parameters.AddWithValue("@HbTabacoCigarros", antecedentesPersonalesUCI.HbTabacoCigarros);
                        cmd.Parameters.AddWithValue("@HbTabacoCigarrosDescripcion", antecedentesPersonalesUCI.HbTabacoCigarrosDescripcion);
                        cmd.Parameters.AddWithValue("@HbOtros", antecedentesPersonalesUCI.HbOtros);
                        cmd.Parameters.AddWithValue("@HbOtrosDescripcion", antecedentesPersonalesUCI.HbOtrosDescripcion);
                        cmd.Parameters.AddWithValue("@AlergFarmacologicas", antecedentesPersonalesUCI.AlergFarmacologicas);
                        cmd.Parameters.AddWithValue("@AlergFarmacologicasDescripcion", antecedentesPersonalesUCI.AlergFarmacologicasDescripcion);
                        cmd.Parameters.AddWithValue("@AlergAlimentacion", antecedentesPersonalesUCI.AlergAlimentacion);
                        cmd.Parameters.AddWithValue("@AlergAlimentacionDescripcion", antecedentesPersonalesUCI.AlergAlimentacionDescripcion);
                        cmd.Parameters.AddWithValue("@AlergOtros", antecedentesPersonalesUCI.AlergOtros);
                        cmd.Parameters.AddWithValue("@AlergOtrosDescripcion", antecedentesPersonalesUCI.AlergOtrosDescripcion);
                        cmd.Parameters.AddWithValue("@AlergSignosSintomas", antecedentesPersonalesUCI.AlergSignosSintomas);
                        cmd.Parameters.AddWithValue("@PatInfecciosaCovid19", antecedentesPersonalesUCI.PatInfecciosaCovid19);
                        cmd.Parameters.AddWithValue("@PatInfecciosaVIH", antecedentesPersonalesUCI.PatInfecciosaVIH);
                        cmd.Parameters.AddWithValue("@PatInfecciosaSifilis", antecedentesPersonalesUCI.PatInfecciosaSifilis);
                        cmd.Parameters.AddWithValue("@PatInfecciosaTuberculosis", antecedentesPersonalesUCI.PatInfecciosaTuberculosis);
                        cmd.Parameters.AddWithValue("@PatInfecciosaHepatitis", antecedentesPersonalesUCI.PatInfecciosaHepatitis);
                        cmd.Parameters.AddWithValue("@PatInfecciosaMalaria", antecedentesPersonalesUCI.PatInfecciosaMalaria);
                        cmd.Parameters.AddWithValue("@PatInfecciosaDengue", antecedentesPersonalesUCI.PatInfecciosaDengue);
                        cmd.Parameters.AddWithValue("@PatInfecciosaNinguna", antecedentesPersonalesUCI.PatInfecciosaNinguna);
                        cmd.Parameters.AddWithValue("@PatInfecciosaOtro", antecedentesPersonalesUCI.PatInfecciosaOtro);
                        cmd.Parameters.AddWithValue("@PatInfecciosaOtroDescripcion", antecedentesPersonalesUCI.PatInfecciosaOtroDescripcion);
                        cmd.Parameters.AddWithValue("@PatMetaBiabetesMellitusI", antecedentesPersonalesUCI.PatMetaBiabetesMellitusI);
                        cmd.Parameters.AddWithValue("@PatMetaBiabetesMellitusII", antecedentesPersonalesUCI.PatMetaBiabetesMellitusII);
                        cmd.Parameters.AddWithValue("@PatMetaObesidad", antecedentesPersonalesUCI.PatMetaObesidad);
                        cmd.Parameters.AddWithValue("@PatMetaCirrosis", antecedentesPersonalesUCI.PatMetaCirrosis);
                        cmd.Parameters.AddWithValue("@PatMetaHipotiroidismo", antecedentesPersonalesUCI.PatMetaHipotiroidismo);
                        cmd.Parameters.AddWithValue("@PatMetaHipertiroidismo", antecedentesPersonalesUCI.PatMetaHipertiroidismo);
                        cmd.Parameters.AddWithValue("@PatMetaHigadoGraso", antecedentesPersonalesUCI.PatMetaHigadoGraso);
                        cmd.Parameters.AddWithValue("@PatMetaNinguna", antecedentesPersonalesUCI.PatMetaNinguna);
                        cmd.Parameters.AddWithValue("@PatMetaOtro", antecedentesPersonalesUCI.PatMetaOtro);
                        cmd.Parameters.AddWithValue("@PatMetaOtroDescripcion", antecedentesPersonalesUCI.PatMetaOtroDescripcion);
                        cmd.Parameters.AddWithValue("@PatCardioHipertenArterial", antecedentesPersonalesUCI.PatCardioHipertenArterial);
                        cmd.Parameters.AddWithValue("@PatCardioAsma", antecedentesPersonalesUCI.PatCardioAsma);
                        cmd.Parameters.AddWithValue("@PatCardioFibrosisPulmonar", antecedentesPersonalesUCI.PatCardioFibrosisPulmonar);
                        cmd.Parameters.AddWithValue("@PatCardioEnfPulmonarObstructivaCronica", antecedentesPersonalesUCI.PatCardioEnfPulmonarObstructivaCronica);
                        cmd.Parameters.AddWithValue("@PatCardioCardiopatiaCongenita", antecedentesPersonalesUCI.PatCardioCardiopatiaCongenita);
                        cmd.Parameters.AddWithValue("@PatCardioInsuficienciaCardiaca", antecedentesPersonalesUCI.PatCardioInsuficienciaCardiaca);
                        cmd.Parameters.AddWithValue("@PatCardioNinguna", antecedentesPersonalesUCI.PatCardioNinguna);
                        cmd.Parameters.AddWithValue("@PatCardioOtro", antecedentesPersonalesUCI.PatCardioOtro);
                        cmd.Parameters.AddWithValue("@PatCardioOtroDescripcion", antecedentesPersonalesUCI.PatCardioOtroDescripcion);
                        cmd.Parameters.AddWithValue("@PatNeuroEnfCerebrovascular", antecedentesPersonalesUCI.PatNeuroEnfCerebrovascular);
                        cmd.Parameters.AddWithValue("@PatNeuroEpilepsia", antecedentesPersonalesUCI.PatNeuroEpilepsia);
                        cmd.Parameters.AddWithValue("@PatNeuroSdGuillainBarre", antecedentesPersonalesUCI.PatNeuroSdGuillainBarre);
                        cmd.Parameters.AddWithValue("@PatNeuroEncefaHipoxicaPostRCP", antecedentesPersonalesUCI.PatNeuroEncefaHipoxicaPostRCP);
                        cmd.Parameters.AddWithValue("@PatNeuroELA", antecedentesPersonalesUCI.PatNeuroELA);
                        cmd.Parameters.AddWithValue("@PatNeuroAusenciaExtremidad", antecedentesPersonalesUCI.PatNeuroAusenciaExtremidad);
                        cmd.Parameters.AddWithValue("@PatNeuroNinguna", antecedentesPersonalesUCI.PatNeuroNinguna);
                        cmd.Parameters.AddWithValue("@PatNeuroOtro", antecedentesPersonalesUCI.PatNeuroOtro);
                        cmd.Parameters.AddWithValue("@PatNeuroOtroDescripcion", antecedentesPersonalesUCI.PatNeuroOtroDescripcion);
                        cmd.Parameters.AddWithValue("@PatReumaLupusEritematoso", antecedentesPersonalesUCI.PatReumaLupusEritematoso);
                        cmd.Parameters.AddWithValue("@PatReumaArtritisReumatoide", antecedentesPersonalesUCI.PatReumaArtritisReumatoide);
                        cmd.Parameters.AddWithValue("@PatReumaSindromeAntifosfolipidico", antecedentesPersonalesUCI.PatReumaSindromeAntifosfolipidico);
                        cmd.Parameters.AddWithValue("@PatReumaCancer", antecedentesPersonalesUCI.PatReumaCancer);
                        cmd.Parameters.AddWithValue("@PatReumaTrasplante", antecedentesPersonalesUCI.PatReumaTrasplante);
                        cmd.Parameters.AddWithValue("@PatReumaNinguna", antecedentesPersonalesUCI.PatReumaNinguna);
                        cmd.Parameters.AddWithValue("@PatReumaOtro", antecedentesPersonalesUCI.PatReumaOtro);
                        cmd.Parameters.AddWithValue("@PatReumaOtroDescripcion", antecedentesPersonalesUCI.PatReumaOtroDescripcion);
                        cmd.Parameters.AddWithValue("@CirugiasPrevias", antecedentesPersonalesUCI.CirugiasPrevias);
                        cmd.Parameters.AddWithValue("@CirugiasPreviasDescripcion", antecedentesPersonalesUCI.CirugiasPreviasDescripcion);
                        cmd.Parameters.AddWithValue("@FechaUltimaCirugia", antecedentesPersonalesUCI.FechaUltimaCirugia ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@MedicacionHabitual", antecedentesPersonalesUCI.MedicacionHabitual);
                        cmd.Parameters.AddWithValue("@AnioUltimaVacunaCovid", antecedentesPersonalesUCI.AnioUltimaVacunaCovid);
                        cmd.Parameters.AddWithValue("@Ram", antecedentesPersonalesUCI.Ram);

                        cmd.Parameters.AddWithValue("@EstadoNutricional", antecedentesPersonalesUCI.EstadoNutricional);
                        cmd.Parameters.AddWithValue("@GravedadEnfermedad", antecedentesPersonalesUCI.GravedadEnfermedad);
                        cmd.Parameters.AddWithValue("@IncrementoPeso", antecedentesPersonalesUCI.IncrementoPeso);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarAntecedentesObstetricosUCI(int IdAtencionUCI, AntecedentesObstetricosUCI antecedentesObstetricosUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarAntecedentesObstetricosUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        cmd.Parameters.AddWithValue("@Primipaternidad", antecedentesObstetricosUCI.Primipaternidad);
                        cmd.Parameters.AddWithValue("@NroGestaciones", antecedentesObstetricosUCI.NroGestaciones);
                        cmd.Parameters.AddWithValue("@NroPartosTermino", antecedentesObstetricosUCI.NroPartosTermino);
                        cmd.Parameters.AddWithValue("@NroPartosPreTermino", antecedentesObstetricosUCI.NroPartosPreTermino);
                        cmd.Parameters.AddWithValue("@NGestacionesFrustras", antecedentesObstetricosUCI.NGestacionesFrustras);
                        cmd.Parameters.AddWithValue("@NroHijosVivos", antecedentesObstetricosUCI.NroHijosVivos);
                        cmd.Parameters.AddWithValue("@PeriodoIntergenesico", antecedentesObstetricosUCI.PeriodoIntergenesico);
                        cmd.Parameters.AddWithValue("@FUltimaRegla", antecedentesObstetricosUCI.FUltimaRegla ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Cesarea", antecedentesObstetricosUCI.Cesarea);
                        cmd.Parameters.AddWithValue("@FechaUltimaCesarea", antecedentesObstetricosUCI.FechaUltimaCesarea ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Menos2500g", antecedentesObstetricosUCI.Menos2500g);
                        cmd.Parameters.AddWithValue("@Multiple", antecedentesObstetricosUCI.Multiple);
                        cmd.Parameters.AddWithValue("@Menos37S", antecedentesObstetricosUCI.Menos37S);
                        cmd.Parameters.AddWithValue("@Mayor4000g", antecedentesObstetricosUCI.Mayor4000g);
                        cmd.Parameters.AddWithValue("@Obito", antecedentesObstetricosUCI.Obito);
                        cmd.Parameters.AddWithValue("@AntecedenteEnfermedadHipertensivaEmbarazo", antecedentesObstetricosUCI.AntecedenteEnfermedadHipertensivaEmbarazo);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarMotivoAtencionUCI(int IdAtencionUCI, MotivoAtencionUCI motivoAtencionUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarMotivoAtencionUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        cmd.Parameters.AddWithValue("CondicionIngreso", motivoAtencionUCI.CondicionIngreso);
                        cmd.Parameters.AddWithValue("EdadGestacionalFinalSemanas", motivoAtencionUCI.EdadGestacionalFinalSemanas);
                        cmd.Parameters.AddWithValue("EdadGestacionalFinalDias", motivoAtencionUCI.EdadGestacionalFinalDias);
                        cmd.Parameters.AddWithValue("TipoParto", motivoAtencionUCI.TipoParto);
                        cmd.Parameters.AddWithValue("CondicionProducto", motivoAtencionUCI.CondicionProducto);
                        cmd.Parameters.AddWithValue("TiempoEnfermedadDias", motivoAtencionUCI.TiempoEnfermedadDias);
                        cmd.Parameters.AddWithValue("TiempoEnfermedadHoras", motivoAtencionUCI.TiempoEnfermedadHoras);
                        cmd.Parameters.AddWithValue("SOFAPreUCI", motivoAtencionUCI.SOFAPreUCI);
                        cmd.Parameters.AddWithValue("PrioridadIngresoUCI", motivoAtencionUCI.PrioridadIngresoUCI);
                        cmd.Parameters.AddWithValue("TranstornoHipertensivoEmbarazo", motivoAtencionUCI.TranstornoHipertensivoEmbarazo);
                        cmd.Parameters.AddWithValue("TranstornoHipertensivoEmbarazoOtros", motivoAtencionUCI.TranstornoHipertensivoEmbarazoOtros);
                        cmd.Parameters.AddWithValue("OtrasEnfermedadesHipertensivasAfectanEmbarazo", motivoAtencionUCI.OtrasEnfermedadesHipertensivasAfectanEmbarazo);
                        cmd.Parameters.AddWithValue("OtrasEnfermedadesHipertensivasAfectanEmbarazoOtros", motivoAtencionUCI.OtrasEnfermedadesHipertensivasAfectanEmbarazoOtros);
                        cmd.Parameters.AddWithValue("Hemorragicas", motivoAtencionUCI.Hemorragicas);
                        cmd.Parameters.AddWithValue("Infecciosas", motivoAtencionUCI.Infecciosas);
                        cmd.Parameters.AddWithValue("InfecciosasOtros", motivoAtencionUCI.InfecciosasOtros);
                        cmd.Parameters.AddWithValue("GastroEnterico", motivoAtencionUCI.GastroEnterico);
                        cmd.Parameters.AddWithValue("GastroEntericoOtros", motivoAtencionUCI.GastroEntericoOtros);
                        cmd.Parameters.AddWithValue("Respiratorio", motivoAtencionUCI.Respiratorio);
                        cmd.Parameters.AddWithValue("RespiratorioOtros", motivoAtencionUCI.RespiratorioOtros);
                        cmd.Parameters.AddWithValue("EndocrinoMetabolico", motivoAtencionUCI.EndocrinoMetabolico);
                        cmd.Parameters.AddWithValue("EndocrinoMetabolicoOtros", motivoAtencionUCI.EndocrinoMetabolicoOtros);
                        cmd.Parameters.AddWithValue("Cardiovascular", motivoAtencionUCI.Cardiovascular);
                        cmd.Parameters.AddWithValue("CardiovascularOtros", motivoAtencionUCI.CardiovascularOtros);
                        cmd.Parameters.AddWithValue("CirugiaIntrauterina", motivoAtencionUCI.CirugiaIntrauterina);
                        cmd.Parameters.AddWithValue("Quirurgicas", motivoAtencionUCI.Quirurgicas);
                        cmd.Parameters.AddWithValue("Traumatismo", motivoAtencionUCI.Traumatismo);
                        cmd.Parameters.AddWithValue("DisfuncionesNinguno", motivoAtencionUCI.DisfuncionesNinguno);
                        cmd.Parameters.AddWithValue("DisfuncionesRespiratorio", motivoAtencionUCI.DisfuncionesRespiratorio);
                        cmd.Parameters.AddWithValue("DisfuncionesHematologico", motivoAtencionUCI.DisfuncionesHematologico);
                        cmd.Parameters.AddWithValue("DisfuncionesRenal", motivoAtencionUCI.DisfuncionesRenal);
                        cmd.Parameters.AddWithValue("DisfuncionesHepatico", motivoAtencionUCI.DisfuncionesHepatico);
                        cmd.Parameters.AddWithValue("DisfuncionesNeurologico", motivoAtencionUCI.DisfuncionesNeurologico);
                        cmd.Parameters.AddWithValue("DisfuncionesMetabolico", motivoAtencionUCI.DisfuncionesMetabolico);
                        cmd.Parameters.AddWithValue("DisfuncionesUterina", motivoAtencionUCI.DisfuncionesUterina);
                        cmd.Parameters.AddWithValue("DisfuncionesCardiovascular", motivoAtencionUCI.DisfuncionesCardiovascular);
                        cmd.Parameters.AddWithValue("DisfuncionesGastrointestinal", motivoAtencionUCI.DisfuncionesGastrointestinal);
                        cmd.Parameters.AddWithValue("DisfuncionesOtro", motivoAtencionUCI.DisfuncionesOtro);
                        cmd.Parameters.AddWithValue("DisfuncionesOtroDescripcion", motivoAtencionUCI.DisfuncionesOtroDescripcion);
                        cmd.Parameters.AddWithValue("SignosSintomasCefaleaHolocraneana", motivoAtencionUCI.SignosSintomasCefaleaHolocraneana);
                        cmd.Parameters.AddWithValue("SignosSintomasCefaleaFocalizada", motivoAtencionUCI.SignosSintomasCefaleaFocalizada);
                        cmd.Parameters.AddWithValue("SignosSintomasEscotomas", motivoAtencionUCI.SignosSintomasEscotomas);
                        cmd.Parameters.AddWithValue("SignosSintomasTinitus", motivoAtencionUCI.SignosSintomasTinitus);
                        cmd.Parameters.AddWithValue("SignosSintomasVisionBorrosa", motivoAtencionUCI.SignosSintomasVisionBorrosa);
                        cmd.Parameters.AddWithValue("SignosSintomasDesorientacionDelirio", motivoAtencionUCI.SignosSintomasDesorientacionDelirio);
                        cmd.Parameters.AddWithValue("SignosSintomasConvulsiones", motivoAtencionUCI.SignosSintomasConvulsiones);
                        cmd.Parameters.AddWithValue("SignosSintomasDisnea", motivoAtencionUCI.SignosSintomasDisnea);
                        cmd.Parameters.AddWithValue("SignosSintomasNauseasVomitos", motivoAtencionUCI.SignosSintomasNauseasVomitos);
                        cmd.Parameters.AddWithValue("SignosSintomasEpigastralgia", motivoAtencionUCI.SignosSintomasEpigastralgia);
                        cmd.Parameters.AddWithValue("SignosSintomasDolorHipocondrioDerecho", motivoAtencionUCI.SignosSintomasDolorHipocondrioDerecho);
                        cmd.Parameters.AddWithValue("SignosSintomasDolorAbdominalDifuso", motivoAtencionUCI.SignosSintomasDolorAbdominalDifuso);
                        cmd.Parameters.AddWithValue("SignosSintomasContraccionesAnormales", motivoAtencionUCI.SignosSintomasContraccionesAnormales);
                        cmd.Parameters.AddWithValue("SignosSintomasEdema", motivoAtencionUCI.SignosSintomasEdema);
                        cmd.Parameters.AddWithValue("SignosSintomasOrinaEspumosa", motivoAtencionUCI.SignosSintomasOrinaEspumosa);
                        cmd.Parameters.AddWithValue("SignosSintomasAlteracionesUrinarias", motivoAtencionUCI.SignosSintomasAlteracionesUrinarias);
                        cmd.Parameters.AddWithValue("SignosSintomasPerdidaliquidoAmniotico", motivoAtencionUCI.SignosSintomasPerdidaliquidoAmniotico);
                        cmd.Parameters.AddWithValue("SignosSintomasSangradoVaginal", motivoAtencionUCI.SignosSintomasSangradoVaginal);
                        cmd.Parameters.AddWithValue("SignosSintomasOtroDolorLocalizado", motivoAtencionUCI.SignosSintomasOtroDolorLocalizado);
                        cmd.Parameters.AddWithValue("SignosSintomasDolorGeneralizado", motivoAtencionUCI.SignosSintomasDolorGeneralizado);
                        cmd.Parameters.AddWithValue("SignosSintomasFiebre", motivoAtencionUCI.SignosSintomasFiebre);
                        cmd.Parameters.AddWithValue("SignosSintomasOtro", motivoAtencionUCI.SignosSintomasOtro);
                        cmd.Parameters.AddWithValue("SignosSintomasOtroDescripcion", motivoAtencionUCI.SignosSintomasOtroDescripcion);
                        cmd.Parameters.AddWithValue("RelatoCronologico", motivoAtencionUCI.RelatoCronologico);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarAtencionesEvaluacionDetalleUCI(int IdAtencionUCI, int IdAtencionDetalleUCI, int IdAtencion, int NroEvaluacion, int idEmpleado, DateTime FechaEvaluacion, string HoraEvaluacion,
            string ComentarioApreciacionEvaluacion, string PlanEvaluacion, int MedicoComentarioEvaluacion, int DestinoComentarioEvaluacion, string ImpresionDiagnostica, string Tratamiento, MotivoAtencionUCI motivoAtencionUCI,
            string FechaAltaPlanApreciacion, string MotivoEvaluacionUCI, string Sofa, string ExamenImagenologico, string ExamenLaboratorial, string DescripcionExamenImagenologico, string DescripcionExamenLaboratorial) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarAtencionesEvaluacionDetalleUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        cmd.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                        cmd.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                        cmd.Parameters.AddWithValue("@idEmpleado", idEmpleado);
                        cmd.Parameters.AddWithValue("@FechaEvaluacion", FechaEvaluacion);
                        cmd.Parameters.AddWithValue("@HoraEvaluacion", HoraEvaluacion);
                        cmd.Parameters.AddWithValue("@ComentarioApreciacionEvaluacion", ComentarioApreciacionEvaluacion);
                        cmd.Parameters.AddWithValue("@PlanEvaluacion", PlanEvaluacion);
                        cmd.Parameters.AddWithValue("@MedicoComentarioEvaluacion", MedicoComentarioEvaluacion);
                        cmd.Parameters.AddWithValue("@DestinoComentarioEvaluacion", DestinoComentarioEvaluacion);
                        cmd.Parameters.AddWithValue("@ImpresionDiagnostica", ImpresionDiagnostica);
                        cmd.Parameters.AddWithValue("@Tratamiento", Tratamiento);
                        cmd.Parameters.AddWithValue("DisfuncionesNinguno", motivoAtencionUCI.DisfuncionesNinguno);
                        cmd.Parameters.AddWithValue("DisfuncionesRespiratorio", motivoAtencionUCI.DisfuncionesRespiratorio);
                        cmd.Parameters.AddWithValue("DisfuncionesHematologico", motivoAtencionUCI.DisfuncionesHematologico);
                        cmd.Parameters.AddWithValue("DisfuncionesRenal", motivoAtencionUCI.DisfuncionesRenal);
                        cmd.Parameters.AddWithValue("DisfuncionesHepatico", motivoAtencionUCI.DisfuncionesHepatico);
                        cmd.Parameters.AddWithValue("DisfuncionesNeurologico", motivoAtencionUCI.DisfuncionesNeurologico);
                        cmd.Parameters.AddWithValue("DisfuncionesMetabolico", motivoAtencionUCI.DisfuncionesMetabolico);
                        cmd.Parameters.AddWithValue("DisfuncionesUterina", motivoAtencionUCI.DisfuncionesUterina);
                        cmd.Parameters.AddWithValue("DisfuncionesCardiovascular", motivoAtencionUCI.DisfuncionesCardiovascular);
                        cmd.Parameters.AddWithValue("DisfuncionesGastrointestinal", motivoAtencionUCI.DisfuncionesGastrointestinal);
                        cmd.Parameters.AddWithValue("DisfuncionesOtro", motivoAtencionUCI.DisfuncionesOtro);
                        cmd.Parameters.AddWithValue("DisfuncionesOtroDescripcion", motivoAtencionUCI.DisfuncionesOtroDescripcion);
                        cmd.Parameters.AddWithValue("FechaAltaPlanApreciacion", FechaAltaPlanApreciacion);
                        cmd.Parameters.AddWithValue("MotivoEvaluacionUCI", MotivoEvaluacionUCI);

                        cmd.Parameters.AddWithValue("ExamenImagenologico", ExamenImagenologico);
                        cmd.Parameters.AddWithValue("ExamenLaboratorial", ExamenLaboratorial);

                        cmd.Parameters.AddWithValue("DescripcionExamenImagenologico", DescripcionExamenImagenologico);
                        cmd.Parameters.AddWithValue("DescripcionExamenLaboratorial", DescripcionExamenLaboratorial);

                        cmd.Parameters.AddWithValue("Sofa", Sofa);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarExamenFisicoEvaluacionUCI(int IdAtencionDetalleUCI, ExamenFisicoEvaluacionUCI examenFisicoEvaluacionUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarExamenFisicoEvaluacionUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        cmd.Parameters.AddWithValue("@Ectoscopia", examenFisicoEvaluacionUCI.Ectoscopia);
                        cmd.Parameters.AddWithValue("@ExamenNeurologico", examenFisicoEvaluacionUCI.ExamenNeurologico);
                        cmd.Parameters.AddWithValue("@EscalaGlasgow", examenFisicoEvaluacionUCI.EscalaGlasgow);
                        cmd.Parameters.AddWithValue("@NivelConciencia", examenFisicoEvaluacionUCI.NivelConciencia);
                        cmd.Parameters.AddWithValue("@Delirio", examenFisicoEvaluacionUCI.Delirio);
                        cmd.Parameters.AddWithValue("@EscalaSedacion", examenFisicoEvaluacionUCI.EscalaSedacion);
                        cmd.Parameters.AddWithValue("@MonitoreoSedacionBISS", examenFisicoEvaluacionUCI.MonitoreoSedacionBISS);
                        cmd.Parameters.AddWithValue("@FuerzaMuscular", examenFisicoEvaluacionUCI.FuerzaMuscular);
                        cmd.Parameters.AddWithValue("@NeurologicoReflejo4", examenFisicoEvaluacionUCI.NeurologicoReflejo4);
                        cmd.Parameters.AddWithValue("@EscalaDolor", examenFisicoEvaluacionUCI.EscalaDolor);
                        cmd.Parameters.AddWithValue("@EvaluacionCardiovascular", examenFisicoEvaluacionUCI.EvaluacionCardiovascular);
                        cmd.Parameters.AddWithValue("@RitmoCardiaco", examenFisicoEvaluacionUCI.RitmoCardiaco);
                        cmd.Parameters.AddWithValue("@TipoRitmoCardiaco", examenFisicoEvaluacionUCI.TipoRitmoCardiaco);
                        cmd.Parameters.AddWithValue("@IndiceShock", examenFisicoEvaluacionUCI.IndiceShock);
                        cmd.Parameters.AddWithValue("@GastoCardiacoNoinvasivo", examenFisicoEvaluacionUCI.GastoCardiacoNoinvasivo);
                        cmd.Parameters.AddWithValue("@IndiceCardiaco", examenFisicoEvaluacionUCI.IndiceCardiaco);
                        cmd.Parameters.AddWithValue("@ExamenRespiratorio", examenFisicoEvaluacionUCI.ExamenRespiratorio);
                        cmd.Parameters.AddWithValue("@ManejoViaAerea", examenFisicoEvaluacionUCI.ManejoViaAerea);
                        cmd.Parameters.AddWithValue("@TipoSoporteOxigenatorioVentilatorio", examenFisicoEvaluacionUCI.TipoSoporteOxigenatorioVentilatorio);
                        cmd.Parameters.AddWithValue("@FraccionInspiratoriaO2", examenFisicoEvaluacionUCI.FraccionInspiratoriaO2);
                        cmd.Parameters.AddWithValue("@SaturacionOxigenoFio2", examenFisicoEvaluacionUCI.SaturacionOxigenoFio2);
                        cmd.Parameters.AddWithValue("@IndiceKirbyPaO2FiO2", examenFisicoEvaluacionUCI.IndiceKirbyPaO2FiO2);
                        cmd.Parameters.AddWithValue("@IndiceRox", examenFisicoEvaluacionUCI.IndiceRox);
                        cmd.Parameters.AddWithValue("@IndiceOxigenatorio", examenFisicoEvaluacionUCI.IndiceOxigenatorio);
                        cmd.Parameters.AddWithValue("@PresionMediaViaAerea", examenFisicoEvaluacionUCI.PresionMediaViaAerea);
                        cmd.Parameters.AddWithValue("@RadiografiaToraxPatologica", examenFisicoEvaluacionUCI.RadiografiaToraxPatologica);
                        cmd.Parameters.AddWithValue("@CuadrantesAfectados", examenFisicoEvaluacionUCI.CuadrantesAfectados);
                        cmd.Parameters.AddWithValue("@RadioToraxDescripcion", examenFisicoEvaluacionUCI.RadioToraxDescripcion);
                        cmd.Parameters.AddWithValue("@EcografiaPulmonarHallazgoSliding", examenFisicoEvaluacionUCI.EcografiaPulmonarHallazgoSliding);
                        cmd.Parameters.AddWithValue("@PerfilEcografico", examenFisicoEvaluacionUCI.PerfilEcografico);
                        cmd.Parameters.AddWithValue("@TomografiaToracicaPatologica", examenFisicoEvaluacionUCI.TomografiaToracicaPatologica);
                        cmd.Parameters.AddWithValue("@TomografiaTorax", examenFisicoEvaluacionUCI.TomografiaTorax);
                        cmd.Parameters.AddWithValue("@OtroEstudio", examenFisicoEvaluacionUCI.OtroEstudio);
                        cmd.Parameters.AddWithValue("@OtroEstudioDescripcion", examenFisicoEvaluacionUCI.OtroEstudioDescripcion);
                        cmd.Parameters.AddWithValue("@Neumotorax", examenFisicoEvaluacionUCI.Neumotorax);
                        cmd.Parameters.AddWithValue("@SindromeDistresRespiratorio", examenFisicoEvaluacionUCI.SindromeDistresRespiratorio);
                        cmd.Parameters.AddWithValue("@GradoDistresRespiratorio", examenFisicoEvaluacionUCI.GradoDistresRespiratorio);
                        cmd.Parameters.AddWithValue("@DrenajeToracicoSistemaSimple", examenFisicoEvaluacionUCI.DrenajeToracicoSistemaSimple);
                        cmd.Parameters.AddWithValue("@DrenajeToracicoSistemaTresCamaras", examenFisicoEvaluacionUCI.DrenajeToracicoSistemaTresCamaras);
                        cmd.Parameters.AddWithValue("@PresionNegativaContinua", examenFisicoEvaluacionUCI.PresionNegativaContinua);
                        cmd.Parameters.AddWithValue("@OtroDispositivo", examenFisicoEvaluacionUCI.OtroDispositivo);
                        cmd.Parameters.AddWithValue("@DescripcionOtroDispositivo", examenFisicoEvaluacionUCI.DescripcionOtroDispositivo);
                        cmd.Parameters.AddWithValue("@ExamenAbdominal", examenFisicoEvaluacionUCI.ExamenAbdominal);
                        cmd.Parameters.AddWithValue("@Incisiones", examenFisicoEvaluacionUCI.Incisiones);
                        cmd.Parameters.AddWithValue("@AfectacionesActuales", examenFisicoEvaluacionUCI.AfectacionesActuales);
                        cmd.Parameters.AddWithValue("@DrenajeAbdominal", examenFisicoEvaluacionUCI.DrenajeAbdominal);
                        cmd.Parameters.AddWithValue("@DrenajeAbdominalDescripcion", examenFisicoEvaluacionUCI.DrenajeAbdominalDescripcion);
                        cmd.Parameters.AddWithValue("@SondaNasogastrica", examenFisicoEvaluacionUCI.SondaNasogastrica);
                        cmd.Parameters.AddWithValue("@SondaNasogastricaDescripcion", examenFisicoEvaluacionUCI.SondaNasogastricaDescripcion);
                        cmd.Parameters.AddWithValue("@BolsaLaparotomia", examenFisicoEvaluacionUCI.BolsaLaparotomia);
                        cmd.Parameters.AddWithValue("@BolsaLaparotomiaDescripcion", examenFisicoEvaluacionUCI.BolsaLaparotomiaDescripcion);
                        cmd.Parameters.AddWithValue("@Vac", examenFisicoEvaluacionUCI.Vac);
                        cmd.Parameters.AddWithValue("@VacDescripcion", examenFisicoEvaluacionUCI.VacDescripcion);
                        cmd.Parameters.AddWithValue("@SondaUrinaria", examenFisicoEvaluacionUCI.SondaUrinaria);
                        cmd.Parameters.AddWithValue("@SondaUrinariaDescripcion", examenFisicoEvaluacionUCI.SondaUrinariaDescripcion);
                        cmd.Parameters.AddWithValue("@DispositivoMedicionPIA", examenFisicoEvaluacionUCI.DispositivoMedicionPIA);
                        cmd.Parameters.AddWithValue("@DispositivoMedicionPIADescripcion", examenFisicoEvaluacionUCI.DispositivoMedicionPIADescripcion);

                        cmd.Parameters.AddWithValue("@TaponamientoPelvico", examenFisicoEvaluacionUCI.TaponamientoPelvico);
                        cmd.Parameters.AddWithValue("@TaponamientoPelvicoDescripcion", examenFisicoEvaluacionUCI.TaponamientoPelvicoDescripcion);
                        cmd.Parameters.AddWithValue("@TaponamientoHepatico", examenFisicoEvaluacionUCI.TaponamientoHepatico);
                        cmd.Parameters.AddWithValue("@TaponamientoHepaticoDescripcion", examenFisicoEvaluacionUCI.TaponamientoHepaticoDescripcion);

                        cmd.Parameters.AddWithValue("@OtroInvasivoDispositivo", examenFisicoEvaluacionUCI.OtroInvasivoDispositivo);
                        cmd.Parameters.AddWithValue("@OtroInvasivoDispositivoDescripcion", examenFisicoEvaluacionUCI.OtroInvasivoDispositivoDescripcion);
                        cmd.Parameters.AddWithValue("@PerimetroAbd6h", examenFisicoEvaluacionUCI.PerimetroAbd6h);
                        cmd.Parameters.AddWithValue("@PIA6h", examenFisicoEvaluacionUCI.PIA6h);
                        cmd.Parameters.AddWithValue("@PerimetroAbd12h", examenFisicoEvaluacionUCI.PerimetroAbd12h);
                        cmd.Parameters.AddWithValue("@PIA12h", examenFisicoEvaluacionUCI.PIA12h);
                        cmd.Parameters.AddWithValue("@PerimetroAbd18h", examenFisicoEvaluacionUCI.PerimetroAbd18h);
                        cmd.Parameters.AddWithValue("@PIA18h", examenFisicoEvaluacionUCI.PIA18h);
                        cmd.Parameters.AddWithValue("@PerimetroAbd24h", examenFisicoEvaluacionUCI.PerimetroAbd24h);
                        cmd.Parameters.AddWithValue("@PIA24h", examenFisicoEvaluacionUCI.PIA24h);
                        cmd.Parameters.AddWithValue("@Gastrocineticos", examenFisicoEvaluacionUCI.Gastrocineticos);
                        cmd.Parameters.AddWithValue("@Deposiciones", examenFisicoEvaluacionUCI.Deposiciones);
                        cmd.Parameters.AddWithValue("@ExamenUrinarioRenal", examenFisicoEvaluacionUCI.ExamenUrinarioRenal);
                        cmd.Parameters.AddWithValue("@Diuresis6H", examenFisicoEvaluacionUCI.Diuresis6H);
                        cmd.Parameters.AddWithValue("@Diuresis12H", examenFisicoEvaluacionUCI.Diuresis12H);
                        cmd.Parameters.AddWithValue("@Diuresis24H", examenFisicoEvaluacionUCI.Diuresis24H);
                        cmd.Parameters.AddWithValue("@Diuretico", examenFisicoEvaluacionUCI.Diuretico);
                        cmd.Parameters.AddWithValue("@NombreDiuretico", examenFisicoEvaluacionUCI.NombreDiuretico);
                        cmd.Parameters.AddWithValue("@DosisDiuretico", examenFisicoEvaluacionUCI.DosisDiuretico);
                        cmd.Parameters.AddWithValue("@DescripcionDosisDiuretico", examenFisicoEvaluacionUCI.DescripcionDosisDiuretico);
                        cmd.Parameters.AddWithValue("@TerapiaReemplazoRenal", examenFisicoEvaluacionUCI.TerapiaReemplazoRenal);
                        cmd.Parameters.AddWithValue("@NroSesion", examenFisicoEvaluacionUCI.NroSesion);
                        cmd.Parameters.AddWithValue("@Ultrafiltrado", examenFisicoEvaluacionUCI.Ultrafiltrado);
                        cmd.Parameters.AddWithValue("@ExamenPielFaneras", examenFisicoEvaluacionUCI.ExamenPielFaneras);
                        cmd.Parameters.AddWithValue("@EdemaPielFaneras", examenFisicoEvaluacionUCI.EdemaPielFaneras);
                        cmd.Parameters.AddWithValue("@LesionPorPresion", examenFisicoEvaluacionUCI.LesionPorPresion);
                        cmd.Parameters.AddWithValue("@GradoPielFaneras", examenFisicoEvaluacionUCI.GradoPielFaneras);
                        cmd.Parameters.AddWithValue("@UbicacionPielFaneras", examenFisicoEvaluacionUCI.UbicacionPielFaneras);
                        cmd.Parameters.AddWithValue("@LesionPorHumedad", examenFisicoEvaluacionUCI.LesionPorHumedad);
                        cmd.Parameters.AddWithValue("@GradoLesionPorHumedad", examenFisicoEvaluacionUCI.GradoLesionPorHumedad);
                        cmd.Parameters.AddWithValue("@UbicacionLesionPorHumedad", examenFisicoEvaluacionUCI.UbicacionLesionPorHumedad);
                        cmd.Parameters.AddWithValue("@SignosHipoperfusionNinguno", examenFisicoEvaluacionUCI.SignosHipoperfusionNinguno);
                        cmd.Parameters.AddWithValue("@SignosHipoperfusionAcrocianosis", examenFisicoEvaluacionUCI.SignosHipoperfusionAcrocianosis);
                        cmd.Parameters.AddWithValue("@SignosHipoperfusionMoteado", examenFisicoEvaluacionUCI.SignosHipoperfusionMoteado);
                        cmd.Parameters.AddWithValue("@SignosHipoperfusionFrialdadDistal", examenFisicoEvaluacionUCI.SignosHipoperfusionFrialdadDistal);
                        cmd.Parameters.AddWithValue("@SignosHipoperfusionLlenadoCapilar", examenFisicoEvaluacionUCI.SignosHipoperfusionLlenadoCapilar);
                        cmd.Parameters.AddWithValue("@ExamenExtremidades", examenFisicoEvaluacionUCI.ExamenExtremidades);
                        cmd.Parameters.AddWithValue("@ExamenColumna", examenFisicoEvaluacionUCI.ExamenColumna);
                        cmd.Parameters.AddWithValue("@ExamenGinecologico", examenFisicoEvaluacionUCI.ExamenGinecologico);
                        cmd.Parameters.AddWithValue("@GlandulaMamaria", examenFisicoEvaluacionUCI.GlandulaMamaria);
                        cmd.Parameters.AddWithValue("@LCF", examenFisicoEvaluacionUCI.LCF);
                        cmd.Parameters.AddWithValue("@MOVFETALES", examenFisicoEvaluacionUCI.MOVFETALES);
                        cmd.Parameters.AddWithValue("@Utero", examenFisicoEvaluacionUCI.Utero);
                        cmd.Parameters.AddWithValue("@GEyBUS", examenFisicoEvaluacionUCI.GEyBUS);
                        cmd.Parameters.AddWithValue("@GEyBUSDescripcion", examenFisicoEvaluacionUCI.GEyBUSDescripcion);
                        cmd.Parameters.AddWithValue("@Vagina", examenFisicoEvaluacionUCI.Vagina);
                        cmd.Parameters.AddWithValue("@VaginaDescripcion", examenFisicoEvaluacionUCI.VaginaDescripcion);
                        cmd.Parameters.AddWithValue("@Cervix", examenFisicoEvaluacionUCI.Cervix);
                        cmd.Parameters.AddWithValue("@CervixDescripcion", examenFisicoEvaluacionUCI.CervixDescripcion);
                        cmd.Parameters.AddWithValue("@Utero1", examenFisicoEvaluacionUCI.Utero1);
                        cmd.Parameters.AddWithValue("@Utero1Descripcion", examenFisicoEvaluacionUCI.Utero1Descripcion);
                        cmd.Parameters.AddWithValue("@Anexos", examenFisicoEvaluacionUCI.Anexos);
                        cmd.Parameters.AddWithValue("@AnexosDescripcion", examenFisicoEvaluacionUCI.AnexosDescripcion);
                        cmd.Parameters.AddWithValue("@FsDouglas", examenFisicoEvaluacionUCI.FsDouglas);
                        cmd.Parameters.AddWithValue("@FsDouglasDescripcion", examenFisicoEvaluacionUCI.FsDouglasDescripcion);
                        cmd.Parameters.AddWithValue("@Parametrios", examenFisicoEvaluacionUCI.Parametrios);
                        cmd.Parameters.AddWithValue("@ParametriosDescripcion", examenFisicoEvaluacionUCI.ParametriosDescripcion);
                        cmd.Parameters.AddWithValue("@Mamas", examenFisicoEvaluacionUCI.Mamas);
                        cmd.Parameters.AddWithValue("@MamasDescripcion", examenFisicoEvaluacionUCI.MamasDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionComunitaria", examenFisicoEvaluacionUCI.InfeccionComunitaria);
                        cmd.Parameters.AddWithValue("@InfeccionComunitariaDescripcion", examenFisicoEvaluacionUCI.InfeccionComunitariaDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionIntrahospitalaria", examenFisicoEvaluacionUCI.InfeccionIntrahospitalaria);
                        cmd.Parameters.AddWithValue("@InfeccionIntrahospitalariaDescripcion", examenFisicoEvaluacionUCI.InfeccionIntrahospitalariaDescripcion);

                        cmd.Parameters.AddWithValue("@InfeccionHemocultivo", examenFisicoEvaluacionUCI.InfeccionHemocultivo);
                        cmd.Parameters.AddWithValue("@InfeccionHemocultivoDescripcion", examenFisicoEvaluacionUCI.InfeccionHemocultivoDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionFechaTomaHemocultivo", examenFisicoEvaluacionUCI.InfeccionFechaTomaHemocultivo ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@InfeccionFechaResultadosHemocultivo", examenFisicoEvaluacionUCI.InfeccionFechaResultadosHemocultivo ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@InfeccionSecrecionBronquial", examenFisicoEvaluacionUCI.InfeccionSecrecionBronquial);
                        cmd.Parameters.AddWithValue("@InfeccionSecrecionBronquialDescripcion", examenFisicoEvaluacionUCI.InfeccionSecrecionBronquialDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionFechaTomaSecrecionBronquial", examenFisicoEvaluacionUCI.InfeccionFechaTomaSecrecionBronquial ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@InfeccionFechaResultadosSecrecionBronquial", examenFisicoEvaluacionUCI.InfeccionFechaResultadosSecrecionBronquial ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@InfeccionOrina", examenFisicoEvaluacionUCI.InfeccionOrina);
                        cmd.Parameters.AddWithValue("@InfeccionOrinaDescripcion", examenFisicoEvaluacionUCI.InfeccionOrinaDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionFechaTomaOrina", examenFisicoEvaluacionUCI.InfeccionFechaTomaOrina ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@InfeccionFechaResultadosOrina", examenFisicoEvaluacionUCI.InfeccionFechaResultadosOrina ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@InfeccionHeces", examenFisicoEvaluacionUCI.InfeccionHeces);
                        cmd.Parameters.AddWithValue("@InfeccionHecesDescripcion", examenFisicoEvaluacionUCI.InfeccionHecesDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionFechaTomaHeces", examenFisicoEvaluacionUCI.InfeccionFechaTomaHeces ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@InfeccionFechaResultadosHeces", examenFisicoEvaluacionUCI.InfeccionFechaResultadosHeces ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@InfeccionSecreciones", examenFisicoEvaluacionUCI.InfeccionSecreciones);
                        cmd.Parameters.AddWithValue("@InfeccionSecrecionesDescripcion", examenFisicoEvaluacionUCI.InfeccionSecrecionesDescripcion);
                        cmd.Parameters.AddWithValue("@InfeccionFechaTomaSecreciones", examenFisicoEvaluacionUCI.InfeccionFechaTomaSecreciones ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@InfeccionFechaResultadosSecreciones", examenFisicoEvaluacionUCI.InfeccionFechaResultadosSecreciones ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@EstudioPorImagenes", examenFisicoEvaluacionUCI.EstudioPorImagenes ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Hallazgos", examenFisicoEvaluacionUCI.Hallazgos ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@sedantes", examenFisicoEvaluacionUCI.sedantes ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@analgesicos", examenFisicoEvaluacionUCI.analgesicos ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@bloqueanteNeuromuscular", examenFisicoEvaluacionUCI.bloqueanteNeuromuscular ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@vasodilatador", examenFisicoEvaluacionUCI.vasodilatador ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@vasoconstrictor", examenFisicoEvaluacionUCI.vasoconstrictor ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@terapiaInfusionRenal", examenFisicoEvaluacionUCI.terapiaInfusionRenal ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@presionArterialMasAlta", examenFisicoEvaluacionUCI.presionArterialMasAlta ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@presionArterialMasBaja", examenFisicoEvaluacionUCI.presionArterialMasBaja ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@FrecuenciaCardiacaMayor", examenFisicoEvaluacionUCI.FrecuenciaCardiacaMayor ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FrecuenciaCardiacaMenor", examenFisicoEvaluacionUCI.FrecuenciaCardiacaMenor ?? Convert.DBNull);

                        //cmd.Parameters.AddWithValue("@Cultivos", examenFisicoEvaluacionUCI.Cultivos);
                        //cmd.Parameters.AddWithValue("@Resultado", examenFisicoEvaluacionUCI.Resultado);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarIntervencionesEvaluacionUCI(
            int IdAtencionDetalleUCI, IntervencionesEvaluacionUCI intervencionesEvaluacionUCI, List<IntervencionesItemsUCI> lstObjHemoderivados, List<IntervencionesItemsUCI> lstObjCorticoides, List<IntervencionesItemsUCI>  lstobjFluidoterapia) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlHemoderivados = XmlUtil.Serializer(typeof(List<IntervencionesItemsUCI>), lstObjHemoderivados);
                        string xmlCorticoides = XmlUtil.Serializer(typeof(List<IntervencionesItemsUCI>), lstObjCorticoides);
                        string xmlFluidoterapia = XmlUtil.Serializer(typeof(List<IntervencionesItemsUCI>), lstobjFluidoterapia);

                        string sql = "Web_CrearModificarIntervencionesEvaluacionUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        cmd.Parameters.AddWithValue("@CLNA09", intervencionesEvaluacionUCI.CLNA09);
                        cmd.Parameters.AddWithValue("@Dextrosa5", intervencionesEvaluacionUCI.Dextrosa5);
                        cmd.Parameters.AddWithValue("@Dextrosa10", intervencionesEvaluacionUCI.Dextrosa10);
                        cmd.Parameters.AddWithValue("@Dextrosa33", intervencionesEvaluacionUCI.Dextrosa33);
                        cmd.Parameters.AddWithValue("@Isofundin", intervencionesEvaluacionUCI.Isofundin);
                        cmd.Parameters.AddWithValue("@RingerLactato", intervencionesEvaluacionUCI.RingerLactato);
                        cmd.Parameters.AddWithValue("@Plasmalyte", intervencionesEvaluacionUCI.Plasmalyte);
                        cmd.Parameters.AddWithValue("@POLIGELINA", intervencionesEvaluacionUCI.POLIGELINA);
                        cmd.Parameters.AddWithValue("@GELAFUSIN", intervencionesEvaluacionUCI.GELAFUSIN);
                        cmd.Parameters.AddWithValue("@ALBUMINA20", intervencionesEvaluacionUCI.ALBUMINA20);
                        cmd.Parameters.AddWithValue("@Manitol20", intervencionesEvaluacionUCI.Manitol20);
                        cmd.Parameters.AddWithValue("@AguaDestilada", intervencionesEvaluacionUCI.AguaDestilada);
                        cmd.Parameters.AddWithValue("@IngresosFluidossvo6h", intervencionesEvaluacionUCI.IngresosFluidossvo6h);
                        cmd.Parameters.AddWithValue("@IngresosFluidossvo12h", intervencionesEvaluacionUCI.IngresosFluidossvo12h);
                        cmd.Parameters.AddWithValue("@IngresosFluidossvo24h", intervencionesEvaluacionUCI.IngresosFluidossvo24h);
                        cmd.Parameters.AddWithValue("@Bh6h", intervencionesEvaluacionUCI.Bh6h);
                        cmd.Parameters.AddWithValue("@Bh12h", intervencionesEvaluacionUCI.Bh12h);
                        cmd.Parameters.AddWithValue("@Bh24h", intervencionesEvaluacionUCI.Bh24h);

                        cmd.Parameters.AddWithValue("@Hemoderivados", xmlHemoderivados);
                        cmd.Parameters.AddWithValue("@Corticoides", xmlCorticoides);
                        cmd.Parameters.AddWithValue("@Fluidoterapia", xmlFluidoterapia);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarExamenesAuxiliaresUCI(int IdAtencionDetalleUCI, ExamenesAuxiliaresUCI examenesAuxiliaresUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarExamenesAuxiliaresUCI";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        cmd.Parameters.AddWithValue("LeucocitosNumero", examenesAuxiliaresUCI.LeucocitosNumero);
                        cmd.Parameters.AddWithValue("Neutrofilos", examenesAuxiliaresUCI.Neutrofilos);
                        cmd.Parameters.AddWithValue("Abastonados", examenesAuxiliaresUCI.Abastonados);
                        cmd.Parameters.AddWithValue("Linfocitos", examenesAuxiliaresUCI.Linfocitos);
                        cmd.Parameters.AddWithValue("Hemoglobina", examenesAuxiliaresUCI.Hemoglobina);
                        cmd.Parameters.AddWithValue("Hematocrito", examenesAuxiliaresUCI.Hematocrito);
                        cmd.Parameters.AddWithValue("Plaquetas", examenesAuxiliaresUCI.Plaquetas);
                        cmd.Parameters.AddWithValue("Glucosa", examenesAuxiliaresUCI.Glucosa);
                        cmd.Parameters.AddWithValue("Urea", examenesAuxiliaresUCI.Urea);
                        cmd.Parameters.AddWithValue("Creatinina", examenesAuxiliaresUCI.Creatinina);
                        cmd.Parameters.AddWithValue("Albumina", examenesAuxiliaresUCI.Albumina);
                        cmd.Parameters.AddWithValue("Globulina", examenesAuxiliaresUCI.Globulina);
                        cmd.Parameters.AddWithValue("BilirrubinaTotal", examenesAuxiliaresUCI.BilirrubinaTotal);
                        cmd.Parameters.AddWithValue("BilirrubinaDirecta", examenesAuxiliaresUCI.BilirrubinaDirecta);
                        cmd.Parameters.AddWithValue("FosfatasaAlcalina", examenesAuxiliaresUCI.FosfatasaAlcalina);
                        cmd.Parameters.AddWithValue("TGO", examenesAuxiliaresUCI.TGO);
                        cmd.Parameters.AddWithValue("TGP", examenesAuxiliaresUCI.TGP);
                        cmd.Parameters.AddWithValue("LactatoDeshidrogenasa", examenesAuxiliaresUCI.LactatoDeshidrogenasa);
                        cmd.Parameters.AddWithValue("Magnesio", examenesAuxiliaresUCI.Magnesio);
                        cmd.Parameters.AddWithValue("Fosforo", examenesAuxiliaresUCI.Fosforo);
                        cmd.Parameters.AddWithValue("CalcioSerico", examenesAuxiliaresUCI.CalcioSerico);
                        cmd.Parameters.AddWithValue("IndiceAlbumina", examenesAuxiliaresUCI.IndiceAlbumina);
                        cmd.Parameters.AddWithValue("IndiceGlobulina", examenesAuxiliaresUCI.IndiceGlobulina);
                        cmd.Parameters.AddWithValue("PresiónOncoticaPo", examenesAuxiliaresUCI.PresiónOncoticaPo);
                        cmd.Parameters.AddWithValue("IndiceDeBriones", examenesAuxiliaresUCI.IndiceDeBriones);
                        cmd.Parameters.AddWithValue("TiempoDeProtrombina", examenesAuxiliaresUCI.TiempoDeProtrombina);
                        cmd.Parameters.AddWithValue("TiempoParcialDeTromboplastinaActivada", examenesAuxiliaresUCI.TiempoParcialDeTromboplastinaActivada);
                        cmd.Parameters.AddWithValue("Fibrinogeno", examenesAuxiliaresUCI.Fibrinogeno);
                        cmd.Parameters.AddWithValue("DímeroD", examenesAuxiliaresUCI.DímeroD);
                        cmd.Parameters.AddWithValue("MarcadoresInflamatorios", examenesAuxiliaresUCI.MarcadoresInflamatorios);
                        cmd.Parameters.AddWithValue("ProteinaCReactiva", examenesAuxiliaresUCI.ProteinaCReactiva);
                        cmd.Parameters.AddWithValue("Procalcitonina", examenesAuxiliaresUCI.Procalcitonina);
                        cmd.Parameters.AddWithValue("PH", examenesAuxiliaresUCI.PH);
                        cmd.Parameters.AddWithValue("PresionParcialDeCO2", examenesAuxiliaresUCI.PresionParcialDeCO2);
                        cmd.Parameters.AddWithValue("BicarbonatoDeSodio", examenesAuxiliaresUCI.BicarbonatoDeSodio);
                        cmd.Parameters.AddWithValue("ExcesoDeBase", examenesAuxiliaresUCI.ExcesoDeBase);
                        cmd.Parameters.AddWithValue("Lactato", examenesAuxiliaresUCI.Lactato);
                        cmd.Parameters.AddWithValue("Sodio", examenesAuxiliaresUCI.Sodio);
                        cmd.Parameters.AddWithValue("Potasio", examenesAuxiliaresUCI.Potasio);
                        cmd.Parameters.AddWithValue("Cloro", examenesAuxiliaresUCI.Cloro);
                        cmd.Parameters.AddWithValue("Calcio", examenesAuxiliaresUCI.Calcio);
                        cmd.Parameters.AddWithValue("GradienteAlveoloArterialDeO2", examenesAuxiliaresUCI.GradienteAlveoloArterialDeO2);
                        cmd.Parameters.AddWithValue("po2", examenesAuxiliaresUCI.po2);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CrearModificarMonitoreoSoporteVentilatorioUCIManiobras(int IdAtencionDetalleUCI, int NroEvaluacion, MonitoreoSoporteVentilatorioUCI monitoreoSoporteVentilatorioUCI) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarMonitoreoSoporteVentilatorioUCIManiobras";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        cmd.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                        cmd.Parameters.AddWithValue("@Fecha", monitoreoSoporteVentilatorioUCI.Fecha);
                        cmd.Parameters.AddWithValue("@Hora", monitoreoSoporteVentilatorioUCI.Hora);
                        cmd.Parameters.AddWithValue("@PeepMaxSinReclutamiento1", monitoreoSoporteVentilatorioUCI.PeepMaxSinReclutamiento);
                        cmd.Parameters.AddWithValue("@Pronacion", monitoreoSoporteVentilatorioUCI.Pronacion);
                        cmd.Parameters.AddWithValue("@HorasPrePronacion", monitoreoSoporteVentilatorioUCI.HorasPrePronacion);
                        cmd.Parameters.AddWithValue("@NroCicloProno", monitoreoSoporteVentilatorioUCI.NroCicloProno);
                        cmd.Parameters.AddWithValue("@Reclutamiento", monitoreoSoporteVentilatorioUCI.Reclutamiento);
                        cmd.Parameters.AddWithValue("@PeepMaxConReclutamiento", monitoreoSoporteVentilatorioUCI.PeepMaxConReclutamiento);
                        cmd.Parameters.AddWithValue("@TitulacionPeep", monitoreoSoporteVentilatorioUCI.TitulacionPeep);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(s: cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<DataSet> CrearModificarMonitoreoSoporteVentilatorioUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, string Descripcion, int Cantidad, double Precio, double Total, MonitoreoSoporteVentilatorioUCI monitoreoSoporteVentilatorioUCI) // // JDELGADO003-C
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarMonitoreoSoporteVentilatorioUCI";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                        da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                        da.SelectCommand.Parameters.AddWithValue("@Descripcion", Descripcion);
                        da.SelectCommand.Parameters.AddWithValue("@Cantidad", Cantidad);
                        da.SelectCommand.Parameters.AddWithValue("@Precio", Precio);
                        da.SelectCommand.Parameters.AddWithValue("@Total", Total);
                        da.SelectCommand.Parameters.AddWithValue("@VentiladorMecanicoMarca", monitoreoSoporteVentilatorioUCI.VentiladorMecanicoMarca);
                        da.SelectCommand.Parameters.AddWithValue("@FechaInicioVM", monitoreoSoporteVentilatorioUCI.FechaInicioVM);
                        da.SelectCommand.Parameters.AddWithValue("@FechaTerminaVM", monitoreoSoporteVentilatorioUCI.FechaTerminaVM);
                        da.SelectCommand.Parameters.AddWithValue("@ModoVentilatorioConvencional", monitoreoSoporteVentilatorioUCI.ModoVentilatorioConvencional);
                        da.SelectCommand.Parameters.AddWithValue("@ModoVentilatorioNoConvencional", monitoreoSoporteVentilatorioUCI.ModoVentilatorioNoConvencional);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CrearModificarParametrosSoporteVentilatorioUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, List<ParametrosMonitoreo> lstObjParametros) // // JDELGADO003-C
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();


            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlParametros = XmlUtil.Serializer(typeof(List<ParametrosMonitoreo>), lstObjParametros);

                        string sql = "Web_CrearParametrosSoporteVentilatorio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idMonitoreo", SqlDbType.Int).Value = idMonitoreo;
                        da.SelectCommand.Parameters.Add("@idAtencionDetalleUCI", SqlDbType.Int).Value = idAtencionDetalleUCI;
                        da.SelectCommand.Parameters.Add("@nroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdItem", SqlDbType.Int).Value = IdItem;
                        da.SelectCommand.Parameters.Add("@Parametros", SqlDbType.Xml).Value = xmlParametros;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> CrearModificarMonitoreoHemodinamicoUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdEquipo, string NombreEquipo, int IdTipoMonitoreo, string TipoMonitoreo, int Cantidad, double Precio, double Total
            )
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_CrearModificarMonitoreoHemodinamicoUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdEquipo", IdEquipo);
                            da.SelectCommand.Parameters.AddWithValue("@NombreEquipo", NombreEquipo);
                            da.SelectCommand.Parameters.AddWithValue("@IdTipoMonitoreo", IdTipoMonitoreo);
                            da.SelectCommand.Parameters.AddWithValue("@TipoMonitoreo", TipoMonitoreo);
                            da.SelectCommand.Parameters.AddWithValue("@Cantidad", Cantidad);
                            da.SelectCommand.Parameters.AddWithValue("@Precio", Precio);
                            da.SelectCommand.Parameters.AddWithValue("@Total", Total);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }
        public Task<DataSet> CrearModificarParametrosMonitoreoHemodinamicoUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, List<ParametrosMonitoreo> lstObjParametros) // // JDELGADO003-C
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();


            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlParametros = XmlUtil.Serializer(typeof(List<ParametrosMonitoreo>), lstObjParametros);

                        string sql = "Web_CrearParametrosMonitoreoHemodinamicoUCI";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idMonitoreo", SqlDbType.Int).Value = idMonitoreo;
                        da.SelectCommand.Parameters.Add("@idAtencionDetalleUCI", SqlDbType.Int).Value = idAtencionDetalleUCI;
                        da.SelectCommand.Parameters.Add("@nroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdItem", SqlDbType.Int).Value = IdItem;
                        da.SelectCommand.Parameters.Add("@Parametros", SqlDbType.Xml).Value = xmlParametros;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> CrearModificarMonitoreoNeurologicoUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, string NombreEquipo, int IdTipoMonitoreo, string TipoMonitoreo, int Cantidad, double Precio, double Total
            )
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_CrearModificarMonitoreoNeurologicoUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                            da.SelectCommand.Parameters.AddWithValue("@NombreEquipo", NombreEquipo);
                            da.SelectCommand.Parameters.AddWithValue("@IdTipoMonitoreo", IdTipoMonitoreo);
                            da.SelectCommand.Parameters.AddWithValue("@TipoMonitoreo", TipoMonitoreo);
                            da.SelectCommand.Parameters.AddWithValue("@Cantidad", Cantidad);
                            da.SelectCommand.Parameters.AddWithValue("@Precio", Precio);
                            da.SelectCommand.Parameters.AddWithValue("@Total", Total);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }
        public Task<DataSet> CrearModificarParametrosMonitoreoNeurologicoUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, List<ParametrosMonitoreo> lstObjParametros) // // JDELGADO003-C
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();


            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlParametros = XmlUtil.Serializer(typeof(List<ParametrosMonitoreo>), lstObjParametros);

                        string sql = "Web_CrearModificarParametrosMonitoreoNeurologicoUCI";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idMonitoreo", SqlDbType.Int).Value = idMonitoreo;
                        da.SelectCommand.Parameters.Add("@idAtencionDetalleUCI", SqlDbType.Int).Value = idAtencionDetalleUCI;
                        da.SelectCommand.Parameters.Add("@nroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdItem", SqlDbType.Int).Value = IdItem;
                        da.SelectCommand.Parameters.Add("@Parametros", SqlDbType.Xml).Value = xmlParametros;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> CrearModificarMonitoreoUltrasonografiaUCI(
            int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, string Descripcion, int Cantidad, double Precio, double Total, string DescripcionHallazgos
            )
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_CrearModificarMonitoreoUltrasonografiaUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                            da.SelectCommand.Parameters.AddWithValue("@Descripcion", Descripcion);
                            da.SelectCommand.Parameters.AddWithValue("@Cantidad", Cantidad);
                            da.SelectCommand.Parameters.AddWithValue("@Precio", Precio);
                            da.SelectCommand.Parameters.AddWithValue("@Total", Total);
                            da.SelectCommand.Parameters.AddWithValue("@DescripcionHallazgos", DescripcionHallazgos);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }
        public Task<DataSet> CrearModificarParametrosMonitoreoUltrasonografiaUCI(int idMonitoreo, int idAtencionDetalleUCI, int nroEvaluacion, int IdItem, List<ParametrosMonitoreo> lstObjParametros) // // JDELGADO003-C
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();


            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlParametros = XmlUtil.Serializer(typeof(List<ParametrosMonitoreo>), lstObjParametros);

                        string sql = "Web_CrearModificarParametrosMonitoreoUltrasonografiaUCI";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idMonitoreo", SqlDbType.Int).Value = idMonitoreo;
                        da.SelectCommand.Parameters.Add("@idAtencionDetalleUCI", SqlDbType.Int).Value = idAtencionDetalleUCI;
                        da.SelectCommand.Parameters.Add("@nroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdItem", SqlDbType.Int).Value = IdItem;
                        da.SelectCommand.Parameters.Add("@Parametros", SqlDbType.Xml).Value = xmlParametros;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> EliminarParametrosMonitoreo(int IdAtencionDetalleUCI, int IdMonitoreo, int NroEvaluacion, int TipoMonitoreo) // // JDELGADO003-C
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_EliminarParametrosMonitoreo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@IdMonitoreo", IdMonitoreo);
                        da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                        da.SelectCommand.Parameters.AddWithValue("@TipoMonitoreo", TipoMonitoreo);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaAtencionesUCI(string IdCuentaAtencion, string NroHistoria, string ApellidoPaterno, string ApellidoMaterno, string Nombres, string FechaIngreso, string IdServicio)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "web_ListaAtencionesUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion ?? Convert.DBNull);
                            da.SelectCommand.Parameters.AddWithValue("@NroHistoria", NroHistoria ?? Convert.DBNull);
                            da.SelectCommand.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno ?? Convert.DBNull);
                            da.SelectCommand.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno ?? Convert.DBNull);
                            da.SelectCommand.Parameters.AddWithValue("@Nombres", Nombres ?? Convert.DBNull);
                            da.SelectCommand.Parameters.AddWithValue("@FechaIngreso", FechaIngreso ?? Convert.DBNull);
                            da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio ?? Convert.DBNull);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }
        public Task<DataSet> ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(int IdAtencionUCI)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarExamenFisicoEvaluacionUCI(int IdAtencionDetalleUCI)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarExamenFisicoEvaluacionUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarIntervencionesEvaluacionUCI(int IdAtencionDetalleUCI)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarIntervencionesEvaluacionUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarExamenesAuxiliaresUCI(int IdAtencionDetalleUCI)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarExamenesAuxiliaresUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarMonitoreoHemodinamicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarMonitoreoHemodinamicoUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarParametrosMonitoreoHemodinamicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarParametrosMonitoreoHemodinamicoUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                            da.SelectCommand.Parameters.AddWithValue("@IdMonitoreo", IdMonitoreo);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarMonitoreoUltrasonografiaUCIByIdAtencionUCIDetalle";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarParametrosMonitoreoUltrasonografiaUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarParametrosMonitoreoUltrasonografiaUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                            da.SelectCommand.Parameters.AddWithValue("@IdMonitoreo", IdMonitoreo);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarMonitoreoNeurologicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarMonitoreoNeurologicoUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarParametrosMonitoreoNeurologicoUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarParametrosMonitoreoNeurologicoUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                            da.SelectCommand.Parameters.AddWithValue("@IdMonitoreo", IdMonitoreo);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarMonitoreoSoporteVentilatorioUCIManiobras(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarMonitoreoSoporteVentilatorioUCIManiobras";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> SeleccionarMonitoreoSoporteVentilatorioUCI(int IdAtencionDetalleUCI, int NroEvaluacion)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarMonitoreoSoporteVentilatorioUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }



        public Task<DataSet> SeleccionarParametroSoporteVentilatorioUCI(int IdAtencionDetalleUCI, int NroEvaluacion, int IdItem, int IdMonitoreo)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            //string sql = "web_ListaAtencionesCEV3";
                            string sql = "Web_SeleccionarParametroSoporteVentilatorioUCI";     //KHOYOSI
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.AddWithValue("@IdAtencionDetalleUCI", IdAtencionDetalleUCI);
                            da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);
                            da.SelectCommand.Parameters.AddWithValue("@IdItem", IdItem);
                            da.SelectCommand.Parameters.AddWithValue("@IdMonitoreo", IdMonitoreo);

                            da.Fill(ds);

                            return ds;
                        }
                    }
                });

            }
            catch (Exception ex)
            {

                ds = null; throw new Exception(ex.Message);
            }
        }

        public Task<DataSet> CrearModificarComentarioApreciacionUCI(int IdComentarioApreciacion, int IdAtencionUCI, int OrganoAfectado, int Medico, int Destino, string ComentarioApreciacion, string Plan, DateTime? Fecha, string Hora) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_CrearModificarComentarioApreciacionUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdComentarioApreciacion", IdComentarioApreciacion);
                        da.SelectCommand.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);
                        da.SelectCommand.Parameters.AddWithValue("@OrganoAfectado", OrganoAfectado);
                        da.SelectCommand.Parameters.AddWithValue("@Medico", Medico);
                        da.SelectCommand.Parameters.AddWithValue("@Destino", Destino);
                        da.SelectCommand.Parameters.AddWithValue("@ComentarioApreciacion", ComentarioApreciacion);
                        da.SelectCommand.Parameters.AddWithValue("@Plan", Plan);
                        da.SelectCommand.Parameters.AddWithValue("@FechaRegistro", Fecha);
                        da.SelectCommand.Parameters.AddWithValue("@Hora", Hora);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarComentarioApreciacionUCIByIdAtencionUCI(int IdAtencionUCI) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarComentarioApreciacionUCIByIdAtencionUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencionUCI", IdAtencionUCI);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CrearModificarMedicamentosExamenFisicoUCI(
            int idAtencionDetalleUCI, int nroEvaluacion, List<MedicamentosExamenFisicoUCI> lstObjSedantes, List<MedicamentosExamenFisicoUCI> lstObjAnalgesicos, List<MedicamentosExamenFisicoUCI> lstObjBloqueanteNeuromuscular,
            List<MedicamentosExamenFisicoUCI> lstObjVasodilatador, List<MedicamentosExamenFisicoUCI> lstObjVasoconstrictor, List<MedicamentosExamenFisicoUCI> lstobjAccesosVasculares) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();
            Conexion cx = new Conexion();


            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlSedantes = XmlUtil.Serializer(typeof(List<MedicamentosExamenFisicoUCI>), lstObjSedantes);
                        string xmlAnalgesicos = XmlUtil.Serializer(typeof(List<MedicamentosExamenFisicoUCI>), lstObjAnalgesicos);
                        string xmlBloqueanteNeuromuscular = XmlUtil.Serializer(typeof(List<MedicamentosExamenFisicoUCI>), lstObjBloqueanteNeuromuscular);
                        string xmlVasodilatador = XmlUtil.Serializer(typeof(List<MedicamentosExamenFisicoUCI>), lstObjVasodilatador);
                        string xmlVasoconstrictor = XmlUtil.Serializer(typeof(List<MedicamentosExamenFisicoUCI>), lstObjVasoconstrictor);
                        string xmlAccesosVasculares = XmlUtil.Serializer(typeof(List<MedicamentosExamenFisicoUCI>), lstobjAccesosVasculares);

                        string sql = "Web_CrearModificarMedicamentosExamenFisicoUCI";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAtencionDetalleUCI", SqlDbType.Int).Value = idAtencionDetalleUCI;
                        da.SelectCommand.Parameters.Add("@nroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@Sedantes", SqlDbType.Xml).Value = xmlSedantes;
                        da.SelectCommand.Parameters.Add("@Analgesicos", SqlDbType.Xml).Value = xmlAnalgesicos;
                        da.SelectCommand.Parameters.Add("@BloqueanteNeuromuscular", SqlDbType.Xml).Value = xmlBloqueanteNeuromuscular;
                        da.SelectCommand.Parameters.Add("@Vasodilatador", SqlDbType.Xml).Value = xmlVasodilatador;
                        da.SelectCommand.Parameters.Add("@Vasoconstrictor", SqlDbType.Xml).Value = xmlVasoconstrictor;
                        da.SelectCommand.Parameters.Add("@AccesosVasculares", SqlDbType.Xml).Value = xmlAccesosVasculares;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> SeleccionarMedicamentosSedanesUCI(int idAtencionDetalleUCI, int nroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarMedicamentosSedanesUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarMedicamentosAnalgesicosUCI(int idAtencionDetalleUCI, int nroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarMedicamentosAnalgesicosUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarMedicamentosBloqueanteNeuromuscularUCI(int idAtencionDetalleUCI, int nroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarMedicamentosBloqueanteNeuromuscularUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarMedicamentosVasodilatadorUCI(int idAtencionDetalleUCI, int nroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarMedicamentosVasodilatadorUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarMedicamentosVasoconstrictorUCI(int idAtencionDetalleUCI, int nroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarMedicamentosVasoconstrictorUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarIntervencionesHemoderivadosUCI(int idAtencionDetalleUCI) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarIntervencionesHemoderivadosUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> SeleccionarIntervencionesCorticoidesUCI(int idAtencionDetalleUCI) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarIntervencionesCorticoidesUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarIntervencionesFluidoterapiaUCI(int idAtencionDetalleUCI) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarIntervencionesFluidoterapiaUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarOtraPatologiasObstetricasUCI(int IdAtencion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarOtraPatologiasObstetricasUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarAtencionesUCIByIdAtencionServicioNroEvaluacion(int IdAtencion, int IdServicio, int NroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarAtencionesUCIByIdAtencionServicioNroEvaluacion";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                        da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);
                        da.SelectCommand.Parameters.AddWithValue("@NroEvaluacion", NroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarAccesosVascularesUCI(int idAtencionDetalleUCI, int nroEvaluacion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarAccesosVascularesUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@idAtencionDetalleUCI", idAtencionDetalleUCI);
                        da.SelectCommand.Parameters.AddWithValue("@nroEvaluacion", nroEvaluacion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarDatosInformeMedicoUCI(int IdAtencion) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarDatosInformeMedicoUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdAtencion", IdAtencion);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GenerarReporteUCI(DateTime FechaInicio, DateTime FechaFin) // // JDELGADO003-C
        {

            DataSet ds = new DataSet();

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_GenerarReporteUCI";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                        da.SelectCommand.Parameters.AddWithValue("@FechaFin", FechaFin);


                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> ListarExamenesImagenologicosYPruebasEspeciales()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarExamenesImagenologicosYPruebasEspeciales", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> ListarExamenesLaboratorialesEspeciales()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarExamenesLaboratorialesEspeciales", conn))
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
