using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AntecedentesFamiliaresAnestesiologia
    {
        public int IdAtencionAnestesiologiaF { get; set; }
        public int? DiabetesF { get; set; }
        public string DiabetesDescF { get; set; }
        public int? TBCF { get; set; }
        public string TBCDescF { get; set; }
        public int? AsmaF { get; set; }
        public string AsmaDescF { get; set; }
        public int? HipertensionF { get; set; }
        public string HipertensionDescF { get; set; }
        public int? OtrosF { get; set; }
        public string OtrosDescF { get; set; }
        public int? AnestesiasFamiliaresF { get; set; }
        public string AnestesiasFamiliaresDescF { get; set; }
    }
}
