using System;
using WebAppMaternidad.CapaEntidades;
using static ClosedXML.Excel.XLPredefinedFormat;

namespace WebAppMaternidad.CapaEntidades
{
    public class OcurrenciaMedica
    {
        public int IdOcurrenciaMedica { get; set; }
        public int NroFolio { get; set; }
        public string NroDocJefeGuardia { get; set; }
        public string NroDocJefeGuardiaEntrante { get; set; }
        public int IdTurno { get; set; }
        public int MuertesMaternas { get; set; }
        public string DMuertesMaternas { get; set; }
        public int EventosAdversos { get; set; }
        public string DEventosAdversos { get; set; }
        public int PacientesCriticos { get; set; }
        public string DPacientesCriticos { get; set; }
        public int ReintervencionesQx { get; set; }
        public string DReintervencionesQx { get; set; }
        public int CasosMedicoLegal { get; set; }
        public string DCasosMedicoLegal { get; set; }
        public int AtEmerObstetricas { get; set; }
        public int AtEmerGinecologicas { get; set; }
        public int AtEmerPediatricas { get; set; }
        public int AtEmerObservacion { get; set; }
        public int AtEmerTraumaShock { get; set; }
        public int AtEmerEcografias { get; set; }
        public int AtEmerCesareas { get; set; }
        public int AtEmerLaparatomias { get; set; }
        public int AtEmerLaparascopias { get; set; }
        public int AtEmerLegrados { get; set; }
        public int AtEmerPartos { get; set; }
        public int AtEmerTocolisis { get; set; }
        public int AtCoCesareas { get; set; }
        public int AtCoLapratomias { get; set; }
        public int AtCoLaparascopias { get; set; }
        public int AtCoLegrados { get; set; }
        public int AtCoPartos { get; set; }
        public int AtCoTocolisis { get; set; }
        public int AtPerCesareas { get; set; }
        public int AtPerLaparatomias { get; set; }
        public int AtPerLaparascopias { get; set; }
        public int AtPerLegrados { get; set; }
        public int AtPerPartos { get; set; }
        public int AtPerTocolisis { get; set; }

        public int AtEmerCesareasPend { get; set; }
        public int AtEmerAmeuPend { get; set; }
        public int AtEmerEcografiasPend { get; set; }
        public int AtEmerLaparascopiasPend { get; set; }
        public int AtEmerLaparatomiasPend { get; set; }
        public int AtEmerReferidosPorLlegarPend { get; set; }
        public string DPacientesEmer { get; set; }

        public int AtCoCesareasPend { get; set; }
        public int AtCoAmeuPend { get; set; }
        public int AtCoEcografiasPend { get; set; }
        public int AtCoLaparascopiasPend { get; set; }
        public int AtCoLaparatomiasPend { get; set; }
        public int AtCoReferidosPorLlegarPend { get; set; }
        public string DPacientesCO { get; set; }

        public int AtPerCesareasPend { get; set; }
        public int AtPerAmeuPend { get; set; }
        public int AtPerEcografiasPend { get; set; }
        public int AtPerLaparascopiasPend { get; set; }
        public int AtPerLaparatomiasPend { get; set; }
        public int AtPerReferidosPorLlegarPend { get; set; }
        public string DPacientesPer { get; set; }

        public int PacientesUCI { get; set; }
        public string DPacientesUCI { get; set; }
        public string Ocurrencias { get; set; }
        public string FechaOcurrencia { get; set; }
        public int Estado { get; set; }


    }
}
