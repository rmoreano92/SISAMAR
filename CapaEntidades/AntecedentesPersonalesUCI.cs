using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AntecedentesPersonalesUCI
    {
        public string GrupoSanguineo { get; set; }
        public string Factor { get; set; }
        public int ActividadFisica { get; set; }
        public int Alimentacion1 { get; set; }
        public int Alimentacion2 { get; set; }
        public int Alimentacion3 { get; set; }
        public int AlimentacionMas3 { get; set; }
        public int TipoAlimentacionCarnes { get; set; }
        public int TipoAlimentacionMixta { get; set; }
        public int TipoAlimentacionVegetariana { get; set; }
        public int TipoAlimentacionProcesados { get; set; }
        public int TipoAlimentacionOtro { get; set; }
        public string TipoAlimentacionOtroDescripcion { get; set; }
        public int VacunaInfluenza { get; set; }
        public string VacunaInfluenzaDescripcion { get; set; }
        public int VacunaDTAdulta { get; set; }
        public string VacunaDTAdultaDescripcion { get; set; }
        public int VacunaTexoideTetanico { get; set; }
        public string VacunaTexoideTetanicoDescripcion { get; set; }
        public int VacunaFiebreAmarilla { get; set; }
        public string VacunaFiebreAmarillaDescripcion { get; set; }
        public int VacunaHepatitisB { get; set; }
        public string VacunaHepatitisBDescripcion { get; set; }
        public int VacunaBCG { get; set; }
        public string VacunaBCGDescripcion { get; set; }
        public int VacunaPapilomavirus { get; set; }
        public string VacunaPapilomavirusDescripcion { get; set; }
        public int VacunaOtra { get; set; }
        public string VacunaOtraDescripcion { get; set; }
        public int VacunaCovidNroDosis { get; set; }
        public DateTime? FechaUltimaVacunaCovid { get; set; }
        public int HbBebidasAlcoholicas { get; set; }
        public string HbBebidasAlcoholicasDescripcion { get; set; }
        public int HbDrogas { get; set; }
        public string HbDrogasDescripcion { get; set; }
        public int HbTabacoCigarros { get; set; }
        public string HbTabacoCigarrosDescripcion { get; set; }
        public int HbOtros { get; set; }
        public string HbOtrosDescripcion { get; set; }
        public int AlergFarmacologicas { get; set; }
        public string AlergFarmacologicasDescripcion { get; set; }
        public int AlergAlimentacion { get; set; }
        public string AlergAlimentacionDescripcion { get; set; }
        public int AlergOtros { get; set; }
        public string AlergOtrosDescripcion { get; set; }
        public string AlergSignosSintomas { get; set; }
        public int PatInfecciosaCovid19 { get; set; }
        public int PatInfecciosaVIH { get; set; }
        public int PatInfecciosaSifilis { get; set; }
        public int PatInfecciosaTuberculosis { get; set; }
        public int PatInfecciosaHepatitis { get; set; }
        public int PatInfecciosaMalaria { get; set; }
        public int PatInfecciosaDengue { get; set; }
        public int PatInfecciosaNinguna { get; set; }
        public int PatInfecciosaOtro { get; set; }
        public string PatInfecciosaOtroDescripcion { get; set; }
        public int PatMetaBiabetesMellitusI { get; set; }
        public int PatMetaBiabetesMellitusII { get; set; }
        public int PatMetaObesidad { get; set; }
        public int PatMetaCirrosis { get; set; }
        public int PatMetaHipotiroidismo { get; set; }
        public int PatMetaHipertiroidismo { get; set; }
        public int PatMetaHigadoGraso { get; set; }
        public int PatMetaNinguna { get; set; }
        public int PatMetaOtro { get; set; }
        public string PatMetaOtroDescripcion { get; set; }
        public int PatCardioHipertenArterial { get; set; }
        public int PatCardioAsma { get; set; }
        public int PatCardioFibrosisPulmonar { get; set; }
        public int PatCardioEnfPulmonarObstructivaCronica { get; set; }
        public int PatCardioCardiopatiaCongenita { get; set; }
        public int PatCardioInsuficienciaCardiaca { get; set; }
        public int PatCardioNinguna { get; set; }
        public int PatCardioOtro { get; set; }
        public string PatCardioOtroDescripcion { get; set; }
        public int PatNeuroEnfCerebrovascular { get; set; }
        public int PatNeuroEpilepsia { get; set; }
        public int PatNeuroSdGuillainBarre { get; set; }
        public int PatNeuroEncefaHipoxicaPostRCP { get; set; }
        public int PatNeuroELA { get; set; }
        public int PatNeuroAusenciaExtremidad { get; set; }
        public int PatNeuroNinguna { get; set; }
        public int PatNeuroOtro { get; set; }
        public string PatNeuroOtroDescripcion { get; set; }
        public int PatReumaLupusEritematoso { get; set; }
        public int PatReumaArtritisReumatoide { get; set; }
        public int PatReumaSindromeAntifosfolipidico { get; set; }
        public int PatReumaCancer { get; set; }
        public int PatReumaTrasplante { get; set; }
        public int PatReumaNinguna { get; set; }
        public int PatReumaOtro { get; set; }
        public string PatReumaOtroDescripcion { get; set; }

        public int CirugiasPrevias { get; set; }
        public string CirugiasPreviasDescripcion { get; set; }
        public DateTime? FechaUltimaCirugia { get; set; }
        public string MedicacionHabitual { get; set; }
        public string AnioUltimaVacunaCovid { get; set; }
        public string Ram { get; set; }
        public int? EstadoNutricional { get; set; }
        public int? GravedadEnfermedad { get; set; }
        public int? IncrementoPeso { get; set; }


    }
}
