using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class Derivacion
    {
        public int idDerivacion { get; set; }
        public string nroDocumento { get; set; } = string.Empty;
        public string nombresCompletos { get; set; } = string.Empty;
        public string observaciones { get; set; } = string.Empty;
        public int? idConsultorio { get; set; }
        public DateTime? fecha { get; set; }
        public int? idUsuario { get; set; }
        public int? perdidaLiquido { get; set; }
        public int? movimientosFetales { get; set; }
        public int? dolorCabeza { get; set; }
        public int? contracciones { get; set; }
        public int? hinchazonPies { get; set; }
        public int? sangradoVaginal { get; set; }
        public int? idServicio { get; set; }
        public int? idCodigoServicio { get; set; }
        public int? idEspecialidad { get; set; }
        public string fechaProgramadaMed { get; set; } = string.Empty;
        public string horaProgramadaMed { get; set; } = string.Empty;
        public int? idCodigoPlanilla { get; set; }
        public int? idMedico { get; set; }
        public string nombreMedico { get; set; } = string.Empty;
        public int? idComoLlego { get; set; }
        public int? idGravedad { get; set; }
        public int? idTipoAtencion { get; set; }
        public int? idMotivoAtencion { get; set; }
        public int? idAtencion { get; set; }
        //=====KHOYOSI 20032026====================================
        public string TriajePresion { get; set; }
        public string TriajeTalla { get; set; }
        public string TriajeTemperatura { get; set; }
        public string TriajePeso { get; set; }
        public int? TriajePulso { get; set; }
        public int? TriajeFrecRespiratoria { get; set; }
        public decimal? TriajePerimCefalico { get; set; }
        public int? TriajeFrecCardiaca { get; set; }
        public string TriajePerimAbdominal { get; set; }
        public string TriajeSaturacionOxigeno { get; set; }
        //==========================================================
        public int IdGradoInstruccion { get; set; }
        public int ParentescoPaciente { get; set; }
        public string CipPaciente { get; set; }
        public string TriajeDolor { get; set; }
        public string TriajeLlenadoCapilar { get; set; }
        public string Glasgow { get; set; }
        public string BiermanPierson { get; set; }
    }
}
