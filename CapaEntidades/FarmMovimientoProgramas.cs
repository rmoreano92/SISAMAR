using CapaEntidades;
using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class FarmMovimientoProgramas
    {
        public string MovNumero { get; set; }
        public string MovTipo { get; set; }
        public int IdCoordinador { get; set; }
        public int IdPrescriptor { get; set; }
        public int IdDiagnostico { get; set; }
        public int? IdPaciente { get; set; }
        public int IdComponente { get; set; }
        public int IdSubComponente { get; set; }
        public string FechaHoraPrescribe { get; set; }
        public int? IdCuentaAtencion { get; set; }
        public string Observaciones { get; set; }
        public string NroFormato { get; set; }

    }
}
