namespace WebAppMaternidad.CapaEntidades
{
    public class Auditoria
    {
        public int IdAuditoria { get; set; }
        public string FechaHora { get; set; }
        public string Tabla { get; set; }
        public int IdRegistro { get; set; }
        public string Accion { get; set; }
        public int IdEmpleado { get; set; }
        public int IdListItem { get; set; }
        public string nombrePC { get; set; }
        public string observaciones { get; set; }

    }
}
