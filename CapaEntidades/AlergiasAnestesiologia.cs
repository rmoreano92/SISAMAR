using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AlergiasAnestesiologia
    {
        public int IdAtencionAnestesiologia { get; set; }
        public int? Farmacologicas { get; set; }
        public string FarmacologicasDesc { get; set; }
        public int? Alimentacion { get; set; }
        public string AlimentacionDesc { get; set; }
        public int? Eosinofilia { get; set; }
        public string EosinofiliaDesc { get; set; }
        public int? Broncoespasmos { get; set; }
        public string BroncoespasmosDesc { get; set; }
        public int? Otros { get; set; }
        public string OtrosDesc { get; set; }
        public string SignosSintomas { get; set; }
        public string Shock { get; set; }
        public string RASH { get; set; }
        public string Edema { get; set; }
        public string Glotis { get; set; }
        public string Prurito { get; set; }
        public string Observacion { get; set; }
    }
}
