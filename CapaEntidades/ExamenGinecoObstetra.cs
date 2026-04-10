using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ExamenGinecoObstetra
    {
        public int IdExamen { get; set; }

        public int? IdAtencion { get; set; }

        public int? LGeBus { get; set; }

        public int? LVagina { get; set; }

        public int? LCervix { get; set; }

        public int? LUtero { get; set; }

        public string DGeBus { get; set; }

        public string DVagina { get; set; }

        public string DCervix { get; set; }

        public string DUtero { get; set; }

        public int? LAnexos { get; set; }

        public int? LDouglas { get; set; }

        public int? LParametros { get; set; }

        public int? LMamas { get; set; }

        public string DAnexos { get; set; }

        public string DDouglas { get; set; }

        public string DParametros { get; set; }

        public string DMamas { get; set; }

        public int? LUA { get; set; }

        public int? LLCF { get; set; }

        public int? LDU { get; set; }

        public int? LSituacion { get; set; }

        public int? LPosicion { get; set; }

        public int? LPresentacion { get; set; }

        public int? LDips { get; set; }

        public string DF1Spp { get; set; }

        public string DF2Spp { get; set; }

        public string DF3Spp { get; set; }

        public int? LF1Lcf { get; set; }

        public int? LF2Lcf { get; set; }

        public int? LF3Lcf { get; set; }

        public int? LSoplos { get; set; }

        public int? LHidraminios { get; set; }

        public int? LPonderado { get; set; }
        public int? LPonderadoClinico { get; set; }
        public int? LPonderadoEcografo { get; set; }

        public int? LDilatacion { get; set; }

        public int? LIncorporacion { get; set; }

        public string LAlPresent { get; set; }

        public string DVarPresent { get; set; }

        public int? LProcubito { get; set; }

        public int? LProlapso { get; set; }

        public string DSangradoV { get; set; }

        public int? LLiquidoA { get; set; }

        public int? LCompatibilidadF { get; set; }

        public string DObservaciones { get; set; }

        public int? LEstadoGeneral { get; set; }

        public int? LAparatoCV { get; set; }

        public int? LAbdomen { get; set; }

        public int? LAparatoR { get; set; }

        public int? LAparatoU { get; set; }

        public int? LExtremidades { get; set; }

        public string DEstadoGeneral { get; set; }

        public string DAparatoCV { get; set; }

        public string DAbdomen { get; set; }

        public string DAparatoR { get; set; }

        public string DAparatoU { get; set; }

        public string DExtremidades { get; set; }

        public int? LTipoEmbarazo { get; set; }

        public int? LPelvimetriaSup { get; set; }

        public int? LPelvimetriaMed { get; set; }

        public int? LPelvimetriaInf { get; set; }

        public int? LTipoTactoVaginal { get; set; }

        public int? LPelvisGinecoide { get; set; }

        public string DEdemas { get; set; }

        public string DReflejos { get; set; }

        public int? IdUsuario { get; set; }

        public string ObservacionGinecologica { get; set; }

        public int? Claro { get; set; }

        public int? Meconial { get; set; }

        public int? Sanguinolento { get; set; }

        public int? MalOlor { get; set; }

        public string PelvisGineDesc { get; set; }

        public int? MembranasRotas { get; set; }

        public string Proteinura { get; set; }

        public string MovFetales { get; set; }

        public string MFF01 { get; set; }

        public string MFF02 { get; set; }

        public string MFF03 { get; set; }

        public string SignosAlarma { get; set; }
        public string Pap { get; set; }
        public string NroFetos { get; set; }

        public string DObservacionesObstetricas { get; set; }

        public string ScoreFlamm { get; set; }

        public string Bishop { get; set; }

        public int? idServicio { get; set; }
        public int? idNumero { get; set; }

        public int? LNeurologico { get; set; }

        public string DNeurologico { get; set; }
        public int? LPiel { get; set; }

        public string DPiel { get; set; }
    }

}
