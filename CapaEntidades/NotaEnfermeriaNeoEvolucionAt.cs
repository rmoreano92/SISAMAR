using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class NotaEnfermeriaNeoEvolucionAt
    {
        public DateTime? fechaRegistro { get; set; }
        public string horaRegistro { get; set; }
        public int? idSoporteO2 { get; set; }
        public string soporteO2 { get; set; }
        public int? idCanalizacionEv { get; set; }
        public string canalizacionEv { get; set; }
        public int? idInmovilizacionMiembro { get; set; }
        public string inmovilizacionMiembro { get; set; }
        public int? idAlimentacion { get; set; }
        public string alimentacion { get; set; }
        public string detalleFormula { get; set; }
        public int? idEliminacion { get; set; }
        public string eliminacion { get; set; }
        public string detalleEliminacion { get; set; }

    }
}
