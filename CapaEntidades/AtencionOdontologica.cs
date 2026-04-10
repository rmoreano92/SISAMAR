namespace WebAppMaternidad.CapaEntidades
{
    public class AtencionOdontologica
    {
        public int idAtencionOdontologica { get; set; }
        public int idAtencion { get; set; }

        public int optPreOcupacional { get; set; }
        public int optAnual { get; set; }
        public int optRetiro { get; set; }
        public int optPuestoLaboral { get; set; }

        public int optAlergia { get; set; }
        public string dAlergia { get; set; }

        public int optEnfermedad { get; set; }
        public string dEnfermedad { get; set; }

        public int optSarro { get; set; }
        public int optPlacaBacteriana { get; set; }

        public string dObservaciones { get; set; }

        public int dCaries { get; set; }
        public int dPiezasAusentes { get; set; }
        public int dRemanenteRadicular { get; set; }
        public int dNecrosisPulpar { get; set; }
        public int dAbcesos { get; set; }

        public string dRecomendaciones { get; set; }

        public string rutaImagen { get; set; }
    }
}
