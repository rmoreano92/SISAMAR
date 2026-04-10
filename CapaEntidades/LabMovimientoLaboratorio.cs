using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class LabMovimientoLaboratorio
    {
        public int IdMovimiento { get; set; }
        public int IdOrden  { get; set; }
        public int CorrelativoAnual  { get; set; }
        public int IdCuentaAtencion  { get; set; }
        public int IdComprobantePago  { get; set; }
        public int idPersonaTomaLab  { get; set; }
        public int idPersonaRecoge  { get; set; }
        public int idDiagnostico { get; set; }
        public int EsDiagnosticoDefinitivo{ get; set; }  
        public string OrdenaPrueba { get; set; }
        public string Paciente { get; set; }
        public int idTipoSexo { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public int tienePdf { get; set; }
    }
}
