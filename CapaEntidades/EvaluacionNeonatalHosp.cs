using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class EvaluacionNeonatalHosp
    {
        public int IdEvaluacionNeonatal { get; set; }
        public string RelatoCronologico { get; set; }
        public int IdAtencion { get; set; }
        public string FactorRiesgo { get; set; }
        public int? EdadPadreRn { get; set; }
        public string PesoMadre { get; set; }
        public string TallaMadre { get; set; }
        public string GrupoSanguineo { get; set; }
        public string FechaResultadoGrupoSanguineo { get; set; }
        public string Hemoglobina { get; set; }
        public string FechaResultadoHemoglobina { get; set; }
        public string FactoRH { get; set; }
        public string FechaResultadoFactorRH { get; set; }
        public string Hematocrito { get; set; }
        public string FechaResultadoHematocrito { get; set; }
        public string Vdrl { get; set; }
        public string Coombs { get; set; }
        public string HIV { get; set; }
        public string HepatitisB { get; set; }
        public string Covid19 { get; set; }
        public string ComentariosExamenesAuxiliares { get; set; }
        public string EcografiaExamenesAuxiliares { get; set; }
        public string FechaInicioLaborParto { get; set; }
        public string HoraInicioLaborParto { get; set; }
        public string PrimerPeriodo { get; set; }
        public string SegundoPeriodo { get; set; }
        public int? IdTipoInicioLaborParto { get; set; }
        public int? IdTipoPresentacionFetal { get; set; }
        public int? IdTipoDetalleParto { get; set; }
        public int? IdTipoDetalleCesarea { get; set; }
        public int? IdTipoSufrimientoFetal { get; set; }
        public int? IdTipoTrabajoParto { get; set; }
        public int? IdTipoAnestesiaAplicada { get; set; }
        public int? IdTipoLiquidoAmniotico { get; set; }
        public int? IdTipoCordonUmbilical { get; set; }
        public int? IdTipoPlacenta { get; set; }
        public int? IdTipoMedicamento { get; set; }
        public string OtrosMedicamentos { get; set; }
        public int? IdTipoLugarParto { get; set; }
        public string RupturaMembranaMinutos { get; set; }
        public string RupturaMembranaHoras { get; set; }
        public string RupturaMembranaDias { get; set; }
        public string ObservacionesLaborParto { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdUsuarioRegistra { get; set; }
        public DateTime? FechaRegistra { get; set; }
        public int? IdUsuarioModifica { get; set; }
        public DateTime? FechaModifica { get; set; }
        public int? Estado { get; set; }
    }
}
