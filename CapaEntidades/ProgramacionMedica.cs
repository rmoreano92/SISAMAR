namespace WebAppMaternidad.CapaEntidades
{
    public class ProgramacionMedica
    {
        public int IdProgramacion { get; set; }
        public int IdTipoServicio { get; set; }
        public int IdEspecialidad { get; set; }
        public int IdServicio { get; set; }
        public int IdMedico { get; set; }
        public string FechaInicio { get; set; } // Considera cambiar a DateTime si lo manejas como fecha
        public string FechaFinal { get; set; } // Considera cambiar a DateTime si lo manejas como fecha
        public int IdTipoProgramacion { get; set; }
        public int IdTurno { get; set; }
        public string HoraInicio { get; set; } // Considera cambiar a TimeSpan si lo manejas como hora
        public string HoraFinal { get; set; } // Considera cambiar a TimeSpan si lo manejas como hora
        public string Descripcion { get; set; } // Es opcional (nullable)
        public int? Color { get; set; } // Es opcional (nullable)
    }
}
