using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class AntecedentesObstetricosUCI
    {
        public int Primipaternidad { get; set; }
        public string NroGestaciones { get; set; }
        public string NroPartosTermino { get; set; }
        public string NroPartosPreTermino { get; set; }
        public string NGestacionesFrustras { get; set; }
        public string NroHijosVivos { get; set; }
        public string PeriodoIntergenesico { get; set; }
        public DateTime? FUltimaRegla { get; set; }
        public int Cesarea { get; set; }
        public DateTime? FechaUltimaCesarea { get; set; }
        public int Menos2500g { get; set; }
        public int Multiple { get; set; }
        public int Menos37S { get; set; }
        public int Mayor4000g { get; set; }
        public int Obito { get; set; }
        public int AntecedenteEnfermedadHipertensivaEmbarazo { get; set; }
    }
}
