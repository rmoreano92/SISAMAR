using MathNet.Numerics.LinearAlgebra;
using static System.Net.WebRequestMethods;

namespace WebAppMaternidad.CapaEntidades
{
    public class EnfermedadMaterna
    {
        public int IdEnfermedadMaterna { get; set; }
        public int idPaciente { get; set; }
        public int idProCabecera { get; set; }
        public int IdAtencion { get; set; }
        public int PreEclampsia { get; set; }
        public int Eclampsia { get; set; }
        public int Htt { get; set; }
        public int Desnutricion { get; set; }
        public int DiabetesMellitus { get; set; }
        public int HepatitisB { get; set; }
        public int Anemia { get; set; }
        public int HipoHipertiroides { get; set; }
        public int OtrosEnfermedades { get; set; }
        public string PreEclampsiaDescripcion { get; set; }
        public string EclampsiaDescripcion { get; set; }
        public string HttDescripcion { get; set; }
        public string DesnutricionDescripcion { get; set; }
        public string DiabetesMellitusDescripcion { get; set; }
        public string HepatitisBDescripcion { get; set; }
        public string AnemiaDescripcion { get; set; }
        public string HipoHipertiroidesDescripcion { get; set; }
        public string OtrosEnfermedadesDescripcion { get; set; }
        public int IdUsuarioRegistra { get; set; }
        public int FechaRegistra { get; set; }
        public int IdUsuarioModifica { get; set; }
        public int FechaModifica { get; set; }
        public int Estado { get; set; }

    }
}
