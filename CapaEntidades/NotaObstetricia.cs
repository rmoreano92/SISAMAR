namespace WebAppMaternidad.CapaEntidades
{
    public class NotaObstetricia
    {
        public int IdNotaObstetricia { get; set; }
        public int IdAtencion { get; set; }
        public int NroNotaObstetricia { get; set; }
        public int IdMedico { get; set; }
        public string CondicionIngreso { get; set; }
        public string EdadGestacionalSemanas { get; set; }
        public string EdadGestacionalDias { get; set; }
        public int AU { get; set; }
        public int FUR { get; set; }
        public int ECO { get; set; }
        public int CausasHemorragia { get; set; }
        public int TipoPreEclampsia { get; set; }
        public int InfeccionesPresentadas { get; set; }
        public string EvaluacionDiagnostica { get; set; }
        public string Apetito { get; set; }
        public string Orina { get; set; }
        public string Suenio { get; set; }
        public string Sed { get; set; }
        public string Deposiciones { get; set; }
        public int TactoVaginal { get; set; }
        public string Dilatacion { get; set; }
        public string Incorporacion { get; set; }
        public string AltPresent { get; set; }
        public string VariedPresent { get; set; }
        public int MembRotas { get; set; }
        public int Procubito { get; set; }
        public int Prolapso { get; set; }
        public int SangradoV { get; set; }
        public int LiqAClaro { get; set; }
        public int LiqAMeconial { get; set; }
        public int LiqALSanguinolento { get; set; }
        public int LiqAMalOlor { get; set; }
        public int Partograma { get; set; }
        public string PartogramaDescripcion { get; set; }
        public string SemanaInicioSem { get; set; }
        public string SemanaInicioDia { get; set; }
        public int Corticoides { get; set; }
        public int FaseTrabajoParto { get; set; }
        public int PosicionParto { get; set; }
        public int TipoParto { get; set; }
        public string HorasMinutos { get; set; }
        public int PerdidaLiquido { get; set; }
        public int SangradoVaginalActivo { get; set; }
        public string Tratamiento { get; set; }
        public string PlanTrabajo { get; set; }
    }
}
