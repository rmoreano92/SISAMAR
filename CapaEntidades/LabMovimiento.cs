using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class LabMovimiento
    {
        public int IdMovimiento { get; set; }
        public string MovTipo { get; set; }
        public int IdTipoConcepto { get; set; }
        public int IdPuntoCarga { get; set; }
        public DateTime Fecha { get; set; }
        public int IdUsuario { get; set; }
        public int IdLabEstado { get; set; }
        public int AnioAP { get; set; }
        public string TipoAP { get; set; }
        public int NumeracionAP { get; set; }
        public int idMedicoRealiza { get; set; }

    }
}
