namespace CapaEntidades
{
    public class AtencionPacienteCronico
    {
        public int idCuentaAtencion { get; set; }
        public int idReceta { get; set; }
        public int? idCuentaAtencion_1 { get; set; }
        public int? idCuentaAtencion_2 { get; set; }
        public int? idReceta_1 { get; set; }
        public int? idReceta_2 { get; set; }

        public bool? bTieneCuentaAsoc { get; set; }

    }

}