namespace WebAppMaternidad.CapaEntidades
{
    public class AtencionesSintomas
    {
        public int IdAtencionSintoma { get; set; }
        public int IdAtencion { get; set; }
        public int NinoSano { get; set; }
        public int Prematuridad { get; set; }
        public int Sdr { get; set; }
        public int Apnea { get; set; }
        public int Bpn { get; set; }
        public int AsfixiaSevera { get; set; }
        public int Shock { get; set; }
        public int Mbpn { get; set; }
        public int Embpn { get; set; }
        public int Sepsis { get; set; }
        public int Rciu { get; set; }
        public int Convulsion { get; set; }
        public int TraumaObstetrico { get; set; }
        public int MalfomacionCongenita { get; set; }
        public int Otros { get; set; }
        public string DOtros { get; set; }
    }
}
