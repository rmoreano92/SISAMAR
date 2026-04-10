using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class GestionCaja
    {
        public int IdComprobantePago { get; set; }
        public string NroSerie { get; set; }
        public string NroDocumento { get; set; }
        public string RazonSocial { get; set; }
        public string Ruc { get; set; }
        public double SubTotal { get; set; }
        public double Igv { get; set; }
        public double Total { get; set; }
        public string FechaCobranza { get; set; }
        public int IdTipoComprobante { get; set; }
        public int IdCajero { get; set; }
        public int IdCaja { get; set; }
        public int IdTurno { get; set; }
        public int IdCuentaAtencion { get; set; }
        public int NroHistoria { get; set; }
        public int AfectoIgv { get; set; }
        public int EstadoEnvioSunat { get; set; }
        public int IdEstadoComprobante { get; set; }
        public string FechaInicio { get; set; }
        public string FechaFin { get; set; }        
    }
}
