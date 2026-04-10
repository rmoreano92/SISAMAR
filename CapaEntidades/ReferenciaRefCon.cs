using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.CapaEntidades
{
    public class ReferenciaRefCon
    {
        // ===== PACIENTE =====
        // --- Ref_DatosReferencia ---
        public int IdReferencia { get; set; }
        public string CodigoEspecialidad { get; set; }
        public string Condicion { get; set; }
        public DateTime? FechaReferencia { get; set; }
        public TimeSpan? HoraReferencia { get; set; }
        public string TipoTransporte { get; set; }
        public string ServicioOrigen { get; set; }
        public string CodigoEstablecimientoOrigen { get; set; }
        public string ServicioDestino { get; set; }
        public string NumeroReferencia { get; set; }
        public DateTime? FechaEnvio { get; set; }
        public string ResumeAnamnesis { get; set; }
        public string ResumeExFisico { get; set; }
        public string MotivoReferencia { get; set; }
        public string TipoFinanciador { get; set; }
        public DateTime? FechaAceptacion { get; set; }

        // --- Datos del Tutor ---
        public string TipoDocumento_tutor { get; set; }
        public string NumeroDocumento_tutor { get; set; }
        public string Nombres_tutor { get; set; }
        public string PrimerApellido_tutor { get; set; }
        public string SegundoApellido_tutor { get; set; }
        public string Celular_tutor { get; set; }
        public string Correo_tutor { get; set; }

        // --- Datos del Personal ---
        public string TipoDocumento_personal { get; set; }
        public string NumeroDocumento_personal { get; set; }
        public string Nombres_personal { get; set; }
        public string PrimerApellido_personal { get; set; }
        public string SegundoApellido_personal { get; set; }

        // --- Ref_Diagnostico ---
        public string codigo_ciex { get; set; }
        public string tipo_diagnostico { get; set; }

        // --- Ref_Tratamiento ---
        public string codigo_medicamento { get; set; }
        public string concentracion { get; set; }
        public string presentacion { get; set; }
        public string ff { get; set; }
        public decimal? cantidad { get; set; }
        public string frecuencia { get; set; }
        public string periodo { get; set; }
    }
}