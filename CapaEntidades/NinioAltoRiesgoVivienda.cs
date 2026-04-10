using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class NinioAltoRiesgoVivienda
    {
        public int id { get; set; }

        public int? famiTuberculosis { get; set; }

        public int? famiAsma { get; set; }

        public int? famiVih { get; set; }

        public int? famiDiabetes { get; set; }

        public int? famiEpilepsia { get; set; }

        public int? famiAlerMedica { get; set; }

        public int? famiViolenciaFami { get; set; }

        public int? famiAlcoholismo { get; set; }

        public int? famiHepatitisB { get; set; }

        public int? viviendaAguaPotable { get; set; }

        public int? viviendaDesague { get; set; }

        public int? idAtencion { get; set; }

        public string fechaRegistro { get; set; }

        public string fechaUpdate { get; set; }

        public int? usuarioRegistro { get; set; }

        public int? usuarioUpdate { get; set; }

        public string famiTuberculosisDesc { get; set; }

        public string famiAsmaDesc { get; set; }

        public string famiVihDesc { get; set; }

        public string famiDiabetesDesc { get; set; }

        public string famiEpilepsiaDesc { get; set; }

        public string famiAlerMedicaDesc { get; set; }

        public string famiViolenciaFamiDesc { get; set; }

        public string famiAlcoholismoDesc { get; set; }

        public string famiHepatitisBDesc { get; set; }

        public string viviendaAguaPotableDesc { get; set; }

        public string viviendaDesagueDesc { get; set; }

        public int? famiDrogadiccion { get; set; }

        public string famiDrogadiccionDesc { get; set; }
        public int? idPaciente { get; set; }

    }
}
