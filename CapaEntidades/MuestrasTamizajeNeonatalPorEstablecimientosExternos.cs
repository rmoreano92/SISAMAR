using System;

namespace WebAppSaludOcupacional.CapaEntidades
{
    public class MuestrasTamizajeNeonatalPorEstablecimientosExternos
    {
        public int IdRegistroTamizaje { get; set; }
        public string IdAutogenerado { get; set; }
        public int IdInstitucion { get; set; }
        public int? IdTipoInstitucion { get; set; }
        public string NumeroCorrelativo { get; set; }
        public string NroDocumentoMadre { get; set; }
        public string NroHistoriaClinicaMadre { get; set; }
        public string ApellidoPaternoMadre { get; set; }
        public string ApellidoMaternoMadre { get; set; }
        public string PrimerNombreMadre { get; set; }
        public string SegundoNombreMadre { get; set; }
        public int? IdTipoSexoMadre { get; set; }
        public string EdadMadre { get; set; }
        public string TiempoGestacion { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public string IdSiaSisNeo { get; set; }
        public string CodigoSisNeo { get; set; }
        public int? IdPersonalTomaMuestra { get; set; }
        public string NroTarjeta { get; set; }
        public string NroReferencia { get; set; }
        public int? NroMuestra { get; set; }
        public int? MuestraTalon { get; set; }
        public DateTime? FechaTomaMuestra { get; set; }
        public string HoraTomaMuestra { get; set; }
        public int? TSH { get; set; }
        public int? OHP { get; set; }
        public int? FEN { get; set; }
        public int? GAL { get; set; }
        public int? IRT { get; set; }
        public int? OTRO { get; set; }
        public DateTime? FechaRecepcion { get; set; }
        public string HoraRecepcion { get; set; }
        public string ObservacionLaboratorio { get; set; }

        public int? ObservacionSegundaMuestraTamizaje { get; set; }

        public string ObservacionSis { get; set; }

        public DateTime? FechaRecepcionSIS { get; set; }
        public string HoraRecepcionSIS { get; set; }
        public int? IdResponsableMuestraMGP { get; set; }
        public int? IdResponsableRecepcionaSISMGP { get; set; }
        public int? IdEstablecimientoOrigen { get; set; }

        public int? IdMotivoRechazo { get; set; }
        public string OtroMotivoRechazo { get; set; }
        public int? TSHRechazado { get; set; }
        public int? OHPRechazado { get; set; }
        public int? FENRechazado { get; set; }
        public int? GALRechazado { get; set; }
        public int? IRTRechazado { get; set; }
        public int? OTRORechazado { get; set; }

        public string CorrelativoLab { get; set; }

        public int? IdResponsableMuestraLaboratorio { get; set; }
        public DateTime? FechaSospechoso { get; set; }
        public string HoraSospecha { get; set; }
        public string PersonalQueRealizoTomaMuestra { get; set; }

        public int? EstadoLaboratorio { get; set; }
        public int? EstadoSIS { get; set; }

        public string NroEnvioSis { get; set; }
        public string NroReferenciaOrigen { get; set; }
        public string NroReferenciaDestino { get; set; }
        public string Observacion { get; set; }
        public string MotivoRechazo2 { get; set; }
        public string OtroMotivoRechazo2 { get; set; }
    }
}
