using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.CapaEntidades
{
    public class AtencionReferenciaRequest
    {
        // ===== DATOS DEL PACIENTE =====
        public int? IdPaciente { get; set; }
        public int? IdDocIdentidad { get; set; }
        public string NroDocumento { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string PrimerNombre { get; set; }
        public string SegundoNombre { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public int? IdTipoSexo { get; set; }
        public int? IdEstadoCivil { get; set; }
        public int? IdEtnia { get; set; }
        public int? IdIdioma { get; set; }
        public int? IdGradoInstruccion { get; set; }
        public int? IdTipoOcupacion { get; set; }
        public int? IdProcedencia { get; set; }
        public int? Religion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string NombrePadre { get; set; }
        public string Observacion { get; set; }
        public int? NroOrdenHijo { get; set; }

        // ===== DATOS DE LA MADRE =====
        public int? MadreTipoDocumento { get; set; }
        public string MadreDocumento { get; set; }
        public string MadreApellidoPaterno { get; set; }
        public string MadreApellidoMaterno { get; set; }
        public string MadrePrimerNombre { get; set; }
        public string MadreSegundoNombre { get; set; }

        // ===== DOMICILIO =====
        public int? IdPaisDomicilio { get; set; }
        public int? IdDepartamentoDomicilio { get; set; }
        public int? IdDistritoDomicilio { get; set; }
        public int? IdCentroPobladoDomicilio { get; set; }
        public string DireccionDomicilio { get; set; }

        // ===== PROCEDENCIA =====
        public int? IdPaisProcedencia { get; set; }
        public int? IdDepartamentoProcedencia { get; set; }
        public int? IdDistritoProcedencia { get; set; }
        public int? IdCentroPobladoProcedencia { get; set; }

        // ===== NACIMIENTO =====
        public int? IdPaisNacimiento { get; set; }
        public int? IdDepartamentoNacimiento { get; set; }
        public int? IdDistritoNacimiento { get; set; }
        public int? IdCentroPobladoNacimiento { get; set; }

        // ===== DATOS DE LA CUENTA =====
        public int? IdCuentaAtencion { get; set; }
        public int? IdAtencion { get; set; }
        public int? IdMedicoIngreso { get; set; }
        public int? IdServicioIngreso { get; set; }
        public int? IdEspecialidadIngreso { get; set; }
        public int? Edad { get; set; }
        public int? IdTipoEdad { get; set; }
        public int? NumeroDeHijos { get; set; }
        public int? IdOrigenAtencion { get; set; }
        public int? IdTipoServicio { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public string HoraIngreso { get; set; }
        public string HoraFin { get; set; }
        public int? IdEstablecimientoOrigen { get; set; }
        public string NroReferenciaOrigen { get; set; }
        public string FuaCodigoPrestacion { get; set; }
        public int IdProgramacion { get; set; }
        public int IdProductoImg { get; set; }

        // ===== DATOS DE AFILIACIÓN =====
        public int? IdSiasis { get; set; }
        public string Codigo { get; set; }
        public string AfiliacionDisa { get; set; }
        public string AfiliacionTipoFormato { get; set; }
        public string AfiliacionNroFormato { get; set; }
        public string AfiliacionNroIntegrante { get; set; }
        public string DocumentoTipo { get; set; }
        public string CodigoEstablAdscripcion { get; set; }
        public DateTime? AfiliacionFecha { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Pnombre { get; set; }
        public string Onombres { get; set; }
        public string Genero { get; set; }
        public DateTime? Fnacimiento { get; set; }
        public string Estado { get; set; }
        public string Fbaja { get; set; }
        public string DocumentoNumero { get; set; }
        public string MotivoBaja { get; set; }
    }
}