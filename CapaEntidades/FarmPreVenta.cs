using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class FarmPreVenta
    {
        public int? idAlmacen { get; set; }
        public int? idPreventa { get; set; }
        public int? idVendedor { get; set; }
        public int? idPaciente { get; set; }
        public int? idTipoFinanciamiento { get; set; }
        public string total { get; set; }
        public int? idDiagnostico { get; set; }
        public int? idTipoReceta { get; set; }
        public int? idcuentaAtencion { get; set; }
        public int? idPrescriptor { get; set; }
        public DateTime? fechaHoraPrescribe { get; set; }
        //fechaCreacion: 0,
        //horaCreacion: 0,
        //idUsuario: 0,
        //fechaModificacion: 0,
        //idUsuarioModifica: 0,
        public int? idEstadoPreventa { get; set; }
        public string dni { get; set; }
        public string Paciente { get; set; }
        public string Observaciones { get; set; }
        //fechaHoraPrescribe: 0,
        //idUsuarioAuditoria: 0,
        public string PresExternoCmp { get; set; }
        public string PresExternoMedico { get; set; }
        public string PresExternoFecha { get; set; }
        public string NroFormato { get; set; }
    }
}
