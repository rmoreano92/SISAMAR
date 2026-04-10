using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
   public  class NinioAltoRiesgoAntecPerinatales
    {
        public int id { get; set; }

        public int? tipoEmbarazo { get; set; }

        public string patologias { get; set; }

        public int? nroEmbarazo { get; set; }

        public int? atencionPrenatal { get; set; }

        public int? nroApn { get; set; }

        public string lugarApn { get; set; }

        public int? tipoParto { get; set; }

        public string complicacionParto { get; set; }

        public int? lugarParto { get; set; }

        public int? atendidoPor { get; set; }

        public int? idAtencion { get; set; }

        public string fechaRegistro { get; set; }

        public string fechaUpdate { get; set; }

        public int? usuarioRegistro { get; set; }

        public int? usuarioUpdate { get; set; }

        public string atendidoPorotro { get; set; }
        public int? idPaciente { get; set; }

    }
}
