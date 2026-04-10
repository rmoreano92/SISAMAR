using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AntecedentesPersonales
    {        
        public int idAntecPersonales { get; set; }
        public int idPaciente { get; set; }
        public int? idPrograma { get; set; }
        public int? idProCabecera { get; set; }
        public int? Tbc { get; set; }
        public string TbcDescripcion { get; set; }
        public int? Diabetes { get; set; }
        public string DiabetesDescripcion { get; set; }
        public int? PreeclampsiaEclampsia { get; set; }
        public string PreeclampsiaEclampsiaDescripcion { get; set; }
        public int? Vih { get; set; }
        public string vihDescripcion { get; set; }
        public int? Alergia { get; set; }
        public string AlergiaDescripcion { get; set; }        
        public int? CirugiaMayor { get; set; }
        public string CirugiaMayorDescripcion { get; set; }
        public int? Violencia { get; set; }
        public string ViolenciaDescripcion { get; set; }
        public int? Hipertencion { get; set; }
        public string HipertencionDescripcion { get; set; }
        public int? VacunaPrevia { get; set; }
        public string VacunaPreviaDescripcion { get; set; }
        public int? Otros { get; set; }
        public string OtrosDescripcion { get; set; }
    }

}
