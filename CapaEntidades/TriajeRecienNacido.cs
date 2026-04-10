namespace WebAppMaternidad.CapaEntidades
{
    public class TriajeRecienNacido
    {
        public int idTriajeRn { get; set; }
        public int idRegistroNacimiento { get; set; }
        public int idCuentaAtencionMadre { get; set; }
        public int idCuentaAtencion { get; set; }
        public int idPaciente { get; set; }
        public int idRegistroRN { get; set; }
        public string FechaNacimiento { get; set; }
        public string HoraNacimiento { get; set; }
        public int IdTipoSexo { get; set; }
        public int IdTipoGestacion { get; set; }
        public int Fetos { get; set; }
        public int NroGemelar { get; set; }
        public int idCondicion { get; set; }
        public string Obito { get; set; }
        public decimal? Peso { get; set; }
        public decimal? Talla { get; set; }
        public decimal? PerimetroCefalico { get; set; }
        public decimal? PerimetroToracico { get; set; }
        public int? EdadGestacional { get; set; }
        public int IdTiempoClampaje { get; set; }
        public string FechaClamp { get; set; }
        public string HoraClamp { get; set; }
        public int IdContactoPielaPiel { get; set; }
        public int? ClampadoTardio { get; set; }
        public int? Lactancia1raHora { get; set; }
        public int IdServicioNacimiento { get; set; }
        public int IdServicioIngresoRecienNacido { get; set; }
        public int IdDiagnosticoIngresoRecienNacido { get; set; }
        public int IdOtraProcedencia { get; set; }
        public int IdServicioIngreso { get; set; }
        public int IdDiagnosticoIngreso { get; set; }
        public int IdMedicoIngreso { get; set; }
        public int? Inmediato { get; set; }
        public int? Reanimacion { get; set; }
        public int IdTipoReanimacion { get; set; }
        public string AlMinuto { get; set; }
        public string Alos5Minutos { get; set; }
        public string Alos10Minutos { get; set; }
        public string Alos15Minutos { get; set; }
        public string Alos20Minutos { get; set; }
        public int? Patologia { get; set; }
        public string Especificar { get; set; }
        public int? Transporte { get; set; }
        public int IdTipoTransporte { get; set; }

        public int? ContactoPielaPiel { get; set; }
        public int? IdTiempoContactoPielaPiel { get; set; }
        public int? EfectividadContactoPielaPiel { get; set; }
        public string DescripcionContactoPielaPiel { get; set; }


        public int? ContactoPielaPielPartoVaginal { get; set; }
        public int? IdTiempoContactoPielaPielPartoVaginal { get; set; }
        public int? EfectividadContactoPielaPielPartoVaginal { get; set; }


        public int? ContactoPielaPielCesarea { get; set; }
        public int? IdTiempoContactoPielaPielCesarea { get; set; }
        public int? EfectividadContactoPielaPielCesarea { get; set; }



        public string TiempoLactancia { get; set; }

        public int Estado { get; set; }
        public int IdUsuario { get; set; }

    }
}
