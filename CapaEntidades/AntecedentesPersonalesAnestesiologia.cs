using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AntecedentesPersonalesAnestesiologia
    {
        public int IdAtencionAnestesiologiaP { get; set; }
        public int? DiabetesP { get; set; }
        public string DiabetesDescP { get; set; }
        public int? TBCP { get; set; }
        public string TBCDescP { get; set; }
        public int? AsmaP { get; set; }
        public string AsmaDescP { get; set; }
        public int? HipertensionP { get; set; }
        public string HipertensionDescP { get; set; }
        public int? PatologiaTiroideaP { get; set; }
        public string PatologiaTiroideaDescP { get; set; }
        public int? CirugiaPreviaP { get; set; }
        public string CirugiaPreviaDescP { get; set; }
        public int? AlcoholP { get; set; }
        public string AlcoholDescP { get; set; }
        public int? TabacoP { get; set; }
        public string TabacoDescP { get; set; }
        public int? DrogasP { get; set; }
        public string DrogasDescP { get; set; }
        public int? TransfusionesP { get; set; }
        public string TransfusionesDescP { get; set; }
        public int? AnestesiasPreviasP { get; set; }
        public string AnestesiasPreviasDescP { get; set; }
        public int? TendenciaHemorragiasP { get; set; }
        public string TendenciaHemorragiasDescP { get; set; }
        public string OtrosP { get; set; }
        public string OtrosDescP { get; set; }
    }
}
