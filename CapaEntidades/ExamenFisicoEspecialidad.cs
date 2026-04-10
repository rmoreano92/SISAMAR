namespace CapaEntidades
{
    public class ExamenFisicoEspecialidad
    {
        public int IdExamen { get; set; }
        public int IdAtencion { get; set; }
        public int IdServicio { get; set; }
        public int IdNumero { get; set; }

        public int LEstadoGeneral { get; set; }
        public string DEdemas { get; set; }
        public string DEstadoGeneral { get; set; }

        public int LAparatoCV { get; set; }
        public string DReflejos { get; set; }
        public string DAparatoCV { get; set; }

        public int LAbdomen { get; set; }
        public string DAbdomen { get; set; }

        public int LNeurologico { get; set; }
        public string DNeurologico { get; set; }
                
        public int LAparatoR { get; set; }
        public string DAparatoR { get; set; }

        public int LAparatoU { get; set; }
        public string DAparatoU { get; set; }

        public int LExtremidades { get; set; }
        public string DExtremidades { get; set; }

        public int LPiel { get; set; }
        public string DPiel { get; set; }

        public int IdEstado { get; set; }
        public int IdUsuario { get; set; }

    }
}
