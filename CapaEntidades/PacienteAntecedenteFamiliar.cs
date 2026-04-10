using MathNet.Numerics.LinearAlgebra;
using NPOI.XWPF.UserModel;

namespace WebAppMaternidad.CapaEntidades
{
    public class PacienteAntecedenteFamiliar
    {
        public int IdPacienteAntecedenteFamiliar { get; set; }
        public int IdPaciente { get; set; }
        public int Diabetes { get; set; }
        public string DiabetesDescripcion { get; set; }
        public int Tbc { get; set; }
        public string TbcDescripcion { get; set; }
        public int Hta { get; set; }
        public string HtaDescripcion { get; set; }
        public int Gemelares { get; set; }
        public string GemelaresDescripcion { get; set; }
        public int Malformaciones { get; set; }
        public string MalformacionesDescripcion { get; set; }
        public int Otros { get; set; }
        public string OtrosDescripcion { get; set; }
        public string Comentarios { get; set; }
        public int IdUsuarioRegistra { get; set; }
        public string FechaRegistra { get; set; }
        public int IdUsuarioModifica { get; set; }
        public string FechaModifica { get; set; }
        public int Estado { get; set;  }

    }
}
