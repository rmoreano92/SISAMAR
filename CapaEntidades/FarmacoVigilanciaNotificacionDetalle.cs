using CapaEntidades;
using System.Collections.Generic;

namespace WebAppMaternidad.CapaEntidades
{
    public class FarmacoVigilanciaNotificacionDetalle
    {
        public int IdNotificacionDetalle { get; set; }
        public int IdAtencion { get; set; }
        public int NroNotificacion { get; set; }
        public int? IdTipoReaccionAdversa { get; set; }
        public string EspecificarReaccionAdversa { get; set; }
        public string DescripcionReaccionAdversa { get; set; }
        public string FechaInicioRam { get; set; }
        public string FechaFinalRam { get; set; }
        public int? IdTipoGravedadRam { get; set; }
        public int? IdTipoConsecuenciaGravedad { get; set; }
        public int? IdFallecio { get; set; }
        public int? IdTipoDescenlace { get; set; }
        public string FechaFallece { get; set; }
        public string ResultadosRelevantesExlab { get; set; }
        public string OtrosDatosHC { get; set; }

        public static List<FarmacoVigilanciaProductosSospechosos> ProductosSospechosos { set; get; }
        public string JsonProductosSospechosos { get; set; }

        public int? AlSuspenderProducto { get; set; }
        public int? AlDisminuirProducto { get; set; }
        public int? AlAdministrarProducto { get; set; }
        public int? AnteriormenteReaciono { get; set; }
        public int? IdRecibioTratamientoReaccionAdversa { get; set; }
        public string EspecificarTratamientoReaccionAdversa { get; set; }
        public int? IdProblemaCalidad { get; set; }
        public string ProblemaRegistroSanitario { get; set; }
        public string ProblemaFechaVencimiento { get; set; }


        public static List<FarmacoVigilanciaProductosConcomitantes> ProductosConcomitantes { set; get; }
        public string JsonProductosConcomitantes { get; set; }
        public string NombreNotificador { get; set; }
        public string CelularNotificador { get; set; }
        public string CorreoNotificador { get; set; }
        public int? IdProfesionNotificador { get; set; }
        public string FechaNotificacion { get; set; }
        public string NumeroNotificacion { get; set; }

    }
}
