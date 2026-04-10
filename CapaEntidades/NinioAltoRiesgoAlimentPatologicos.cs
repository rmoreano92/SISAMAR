using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class NinioAltoRiesgoAlimentPatologicos
    {
        public int id { get; set; }

        public int? alimentPrimerosSeisMeses { get; set; }

        public string alimentInicioAlimentacionComplementaria { get; set; }

        public int? alimentSumplementoFe { get; set; }

        public int? patTbc { get; set; }

        public int? patSobaAsma { get; set; }

        public int? patEpilepsia { get; set; }

        public int? patInfecciones { get; set; }

        public int? patHospitalizaciones { get; set; }

        public int? patTransferenciaSangre { get; set; }

        public int? patCirugia { get; set; }

        public int? patAlergia { get; set; }

        public string patOtroAntecedentesDesc { get; set; }

        public string patAlergiaDesc { get; set; }

        public string fechaRegistro { get; set; }

        public string fechaUpdate { get; set; }

        public int? usuarioRegistro { get; set; }

        public int? usuarioUpdate { get; set; }

        public int? idAtencion { get; set; }

        public int? patOtroAntecedentes { get; set; }

        public int? idPaciente { get; set; }
        public int? patDisplacia { get; set; }
        public int? patHipotiroidismo { get; set; }

    }

}
