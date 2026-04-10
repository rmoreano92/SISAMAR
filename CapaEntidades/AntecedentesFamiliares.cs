using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AntecedentesFamiliares
    {
        public int idAntecFamiliares { get; set; }
        public int idPaciente { get; set; }
        public int? idPrograma { get; set; }
        public int? idProCabecera { get; set; }
        public int? TbcFam { get; set; }
        public string TbcDescripcionFam { get; set; }
        public int? DiabetesFam { get; set; }
        public string DiabetesDescripcionFam { get; set; }
        public int? HipertencionFam { get; set; }
        public string HipertencionDescripcionFam { get; set; }
        public int? PreeclampsiaEclampsiaFam { get; set; }
        public string PreeclampsiaEclampsiaDescripcionFam { get; set; }
        public int? GemelaresFam { get; set; }
        public string GemelaresDescripcionFam { get; set; }
        public int? MalformacionesFam { get; set; }
        public string MalformacionesDescripcionFam { get; set; }
        public int? OtraCondMedGraveFam { get; set; }
        public string OtraCondMedGraveDescripcionFam { get; set; }                

        

    }

}
