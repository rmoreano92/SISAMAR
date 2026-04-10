using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Triaje
    {
        public int? idAtencion { get; set; }

        public int NroHistoriaClinica { get; set; }

        public string CitaDniMedicoJamo { get; set; }

        public DateTime? CitaFecha { get; set; }

        public string CitaMedico { get; set; }

        public string CitaServicioJamo { get; set; }

        public int? CitaIdServicio { get; set; }

        public string CitaMotivo { get; set; }

        public string CitaExamenClinico { get; set; }

        public string CitaDiagMed { get; set; }

        public string CitaExClinicos { get; set; }

        public string CitaTratamiento { get; set; }

        public string CitaObservaciones { get; set; }

        public DateTime? CitaFechaAtencion { get; set; }

        public int? CitaIdUsuario { get; set; }

        public string TriajeEdad { get; set; }

        public string TriajePresion { get; set; }

        public string TriajeTalla { get; set; }

        public string TriajeTemperatura { get; set; }

        public string TriajePeso { get; set; }

        public DateTime? TriajeFecha { get; set; }

        public int? TriajeIdUsuario { get; set; }

        public int? TriajePulso { get; set; }

        public int? TriajeFrecRespiratoria { get; set; }

        public string CitaAntecedente { get; set; }

        public decimal? TriajePerimCefalico { get; set; }

        public int? TriajeFrecCardiaca { get; set; }

        public int? TriajeOrigen { get; set; }

        public string TriajePerimAbdominal { get; set; }

        public string TriajeSaturacionOxigeno { get; set; }
        public int idServicio { get; set; }
        public int idNumero { get; set; }
        public int idUsuario { get; set; }
    }
}
