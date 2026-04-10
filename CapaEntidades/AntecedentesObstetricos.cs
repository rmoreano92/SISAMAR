using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AntecedentesObstetricos
    {
        public int idAntecObstetricos { get; set; }
        public int idPaciente { get; set; }
        public int? idPrograma { get; set; }
        public int? idProCabecera { get; set; }
        public int? Gestas { get; set; }
        public int? abortos { get; set; }
        public int? Vaginales { get; set; }
        public int? NacidosVivos { get; set; }
        public int? Viven { get; set; }
        public int? Partos { get; set; }
        public int? Cesareas { get; set; }
        public int? NacidosMuertos { get; set; }
        public int? Muerto1Seman { get; set; }
        public int? Despues1Seman { get; set; }
        public int? Preterminos { get; set; }
        public int? EdadGestMasPrematuro { get; set; }
        public int? menor2500gr { get; set; }
        public int? Multiple { get; set; }
        public int? memor37sm { get; set; }
        public int? mayor4000g { get; set; }
        public decimal? PesoPregestacional { get; set; }
        public string FechaFinEmbarazoAnt { get; set; }
        public int? idTerminacion { get; set; }
        public int? idAborto { get; set; }
        public int? FracasoMetodo { get; set; }
        public int? EmbarazoPlaneado { get; set; }
        public int? EmbarazoEctopico { get; set; }        
        public string P1 { get; set; }
        public string P2 { get; set; }
        public string P3 { get; set; }
        public string P4 { get; set; }

    }


}
