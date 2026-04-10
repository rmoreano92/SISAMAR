using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    class HistoriaClinica
    {
        public int NroHistoriaClinica { get; set; }

        public DateTime FechaCreacion { get; set; }

        public DateTime FechaPasoAPasivo { get; set; }

        public int IdTipoHistoria { get; set; }

        public int IdEstadoHistoria { get; set; }

        public int IdPaciente { get; set; }

        public int IdTipoNumeracion { get; set; }

        public int NroHistoriaClinicaAnterior { get; set; }

        public int IdTipoNumeracionAnterior { get; set; }

        public string HistoriaSistemaAnterior { get; set; }

    }
}
