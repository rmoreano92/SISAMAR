using CapaEntidades;
using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class FarmMovimiento
    {
        public string MovNumero { get; set; }
        public string MovTipo { get; set; }
        public int? idAlmacenOrigen { get; set; }
        public int? idAlmacenDestino { get; set; }
        public int? idTipoConcepto { get; set; }
        public int? DocumentoIdtipo { get; set; }
        public string DocumentoNumero { get; set; }


        public string DocumentoFechaRecepcion  { get; set; }
        public int? OrigenIdTipo  { get; set; }
        public string OrigenNumero  { get; set; }
        public string OrigenFecha  { get; set; }
        public int? idProveedor  { get; set; }
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public int? idTipoCompra  { get; set; }
        public int? idTipoProceso  { get; set; }
        public string NumeroProceso  { get; set; }
        public int? idPaciente  { get; set; }
        public int? idCuentaAtencion  { get; set; }
        public int? idComprobantePago  { get; set; }
        public int? idFuenteFinanciamiento  { get; set; }

        public string Observaciones { get; set; }
        public string Total { get; set; }
        public int? idMotivoAnulacion { get; set; }
        public DateTime? fechaAnulacion { get; set; }
        public int? idUsuarioAnulacion { get; set; }
        public DateTime? fechaCreacion { get; set; }
        public int? idUsuario { get; set; }
        public int? idEstadoMovimiento { get; set; }
    }
}
