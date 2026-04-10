namespace WebAppMaternidad.CapaEntidades
{
    public class NotaEnfermeriaNeo
    {
        public int IdNotaEnfermeria { get; set; }
        public int? IdAtencion { get; set; }
        public string Apgar1 { get; set; }
        public string Apgar5 { get; set; }
        public int? EdadGestacionalSemanas { get; set; }
        public int? EdadGestacionalDias { get; set; }
        public string Peso { get; set; }
        public string Talla { get; set; }
        public string PerimetroCefalico { get; set; }
        public string PerimetroToraxico { get; set; }
        public int? PielColor { get; set; }
        public string PielColorEspecificar { get; set; }
        public int? Fontanela { get; set; }
        public string FontanelaEspecificar { get; set; }
        public int? Suturas { get; set; }
        public string SuturasEspecificar { get; set; }
        public int? Orejas { get; set; }
        public string OrejasEspecificar { get; set; }
        public string ImplantacionUbicacion { get; set; }
        public int? Nariz { get; set; }
        public string NarizEspecificar { get; set; }
        public int? Boca { get; set; }
        public string BocaEspecificar { get; set; }
        public int? Cuello { get; set; }
        public string CuelloEspecificar { get; set; }
        public int? Torax { get; set; }
        public int? Abdomen { get; set; }
        public int? CordonUmbilical { get; set; }
        public int? CaracteristicasAbdomen { get; set; }
        public string CaracteristicasAbdomenEspecificar { get; set; }
        public int? GenitoUrinario { get; set; }
        public string GenitoUrinarioObservacion { get; set; }
        public int? Eliminacion { get; set; }
        public string EliminacionEspecificar { get; set; }
        public int? ColumnaVertebral { get; set; }
        public string ColumnaVertebralEspecificar { get; set; }
        public int? Extremidades { get; set; }
        public int? TonoMuscular { get; set; }
        public string TonoMuscularEspecificar { get; set; }
        public int? Cadera { get; set; }
        public int? ValoracionNeur { get; set; }
        public string Reflejo { get; set; }
        public string ObservacionExamenFisico { get; set; }

        public string ManiobraDuranteParto { get; set; }
        public string RecepcionRn { get; set; }
        public string ToraxEspecificar { get; set; }
        public string CordonUmbilicalEspecificar { get; set; }
        public string ExtremidadesEspecificar { get; set; }
        public string CaderaEspecificar { get; set; }
        public string ValoracionNeurEspecificar { get; set; }
        public string ReflejoEspecificar { get; set; }
        public string NroEvaluacion { get; set; }
        public string ImpresionDiagnostica { get; set; }
    }
}
