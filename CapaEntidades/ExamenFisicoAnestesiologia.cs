using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ExamenFisicoAnestesiologia
    {
        public int IdAtencionAnestesiologia { get; set; }
        public int? EstadoGeneralSensorio { get; set; }
        public string EstadoGeneralSensorioDesc { get; set; }
        public string EstadoGeneralSensorioEdemas { get; set; }
        public int? Cardiovascular { get; set; }
        public string CardiovascularDesc { get; set; }
        public string CardiovascularEdemas { get; set; }
        public int? Abdomen { get; set; }
        public string AbdomenDesc { get; set; }
        public int? Piel { get; set; }
        public string PielDesc { get; set; }
        public int? Ojos { get; set; }
        public string OjosDesc { get; set; }
        public int? MovCervical { get; set; }
        public string MovCervicalDesc { get; set; }
        public int? Neurologico { get; set; }
        public string NeurologicoDesc { get; set; }
        public int? ColumnaVertebral { get; set; }
        public string ColumnaVertebralDesc { get; set; }
        public int? EstadoGeneral { get; set; }
        public string EstadoGeneralDesc { get; set; }
        public int? EstadoNutricional { get; set; }
        public string EstadoNutricionalDesc { get; set; }
        public int? Venas { get; set; }
        public string VenasDesc { get; set; }
        public int? ViasAereas { get; set; }
        public string ViasAereasDesc { get; set; }
        public int? Dentadura { get; set; }
        public string DentaduraDesc { get; set; }
        public int? Traquea { get; set; }
        public string TraqueaDesc { get; set; }
        public int? Torax { get; set; }
        public string ToraxDesc { get; set; }
        public int? Mallampati { get; set; }
        public int? DistanciaMentoTiroidea { get; set; }
    }
}
