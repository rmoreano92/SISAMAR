using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class ImagenologiaMovimiento
    {
        public int? IdCuentaAtencion { get; set; }
        public int IdMovimiento { get; set; }
        public int IdOrden { get; set; }
        public int? IdOrdenPago { get; set; }
        public int? IdReceta { get; set; }
        public string MovTipo { get; set; }
        public int IdTipoConcepto { get; set; }
        public int IdPuntoCarga { get; set; }
        public DateTime Fecha { get; set; }
        public int IdLabEstado { get; set; }
        public string MedicoSolicita { get; set; }
        public int? IdMedicoSolicita { get; set; }
        public int? IdMedicoRealiza { get; set; }
        public int? IdPersonaTomaImagen { get; set; }
        public int? IdPersonaRecoge { get; set; }
        public int AnioAP { get; set; }
        public string TipoAP { get; set; }
        public int NumeracionAP { get; set; }
        public int? IdMovApReemplazo { get; set; }
        public int? IdComprobantePago { get; set; }
        public int? CorrelativoAnual { get; set; }
        public int? IdDiagnostico { get; set; }
        public int? EsDiagnosticoDefinitivo { get; set; }
        public string Eo_FUM { get; set; }
        public string Eo_FPP { get; set; }
        public string Eo_Gestantes { get; set; }
        public string Eo_Partos { get; set; }
        public int? Eo_EG { get; set; }
        public int? Eo_EGDias { get; set; }
        public int? NoCubreIAFA { get; set; }
        public string FechaHoraNacimiento { get; set; }
        public int? IdTipoSexo { get; set; }
        public String InsumosCPT { get; set; }
        public String ProductosCPT { get; set; }
        public int IdUsuario { get; set; }
        public int IdUsuarioAuditoria { get; set; }
    }
}
