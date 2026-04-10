using MathNet.Numerics.LinearAlgebra;

namespace WebAppMaternidad.CapaEntidades
{
    public class InfeccionMaterna
    {
        public int IdInfeccionMaterna { get; set; }
        public int idPaciente { get; set; }        
        public int idProCabecera { get; set; }
        public int IdAtencion { get; set; }
        public int TbcActiva { get; set; }
        public int Lues { get; set; }
        public int Torch { get; set; }
        public int ItuIIITrim { get; set; }
        public int Urocultivo { get; set; }
        public int Germen { get; set; }
        public int Covid { get; set; }
        public int Dengue { get; set; }
        public int OtrosInfecciones { get; set; }
        public string TbcActivaDescripcion { get; set; }
        public string LuesDescripcion { get; set; }
        public string TorchDescripcion { get; set; }
        public string ItuIIITrimDescripcion { get; set; }
        public string UrocultivoDescripcion { get; set; }
        public string GermenDescripcion { get; set; }
        public string CovidDescripcion { get; set; }
        public string DengueDescripcion { get; set; }
        public string OtrosInfeccionesDescripcion { get; set; }
        public int IdUsuarioRegistra { get; set; }
        public int FechaRegistra { get; set; }
        public int IdUsuarioModifica { get; set; }
        public int FechaModifica { get; set; }
        public int Estado { get; set; }

    }
}
