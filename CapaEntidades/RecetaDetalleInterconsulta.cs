using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class RecetaDetalleInterconsulta
    {
        public int idRecetaDetalleInterconsulta { get; set; }
        public string resumenHistoriaClinica { get; set; }
        public string motivoInterconsulta { get; set; }
        public int idEspecialidad { get; set; }
        public int idTipoConsulta { get; set; }
        public int idReceta { get; set; }
        public int idItem { get; set; }
        public string otraEspecialidad { get; set; }
        
    }
}
