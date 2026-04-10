using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace CapaEntidades
{
    public class Paciente
    {
        public int IdPaciente { get; set; }

        public string ApellidoPaterno { get; set; }

        public string ApellidoMaterno { get; set; }

        public string PrimerNombre { get; set; }

        public string SegundoNombre { get; set; }

        public string TercerNombre { get; set; }

        public DateTime? FechaNacimiento { get; set; }

        public string NroDocumento { get; set; }

        public string Telefono { get; set; }

        public string DireccionDomicilio { get; set; }

        public string Autogenerado { get; set; }

        public int IdTipoSexo { get; set; }

        public int IdProcedencia { get; set; }

        public int IdGradoInstruccion { get; set; }

        public int IdEstadoCivil { get; set; }

        public int IdDocIdentidad { get; set; }

        public int IdTipoOcupacion { get; set; }

        public int IdCentroPobladoNacimiento { get; set; }

        public int IdCentroPobladoDomicilio { get; set; }

        public string NombrePadre { get; set; }

        public string NombreMadre { get; set; }

        public string NroHistoriaClinica { get; set; }

        public int IdTipoNumeracion { get; set; }

        public int IdCentroPobladoProcedencia { get; set; }

        public string Observacion { get; set; }

        public int IdPaisDomicilio { get; set; }

        public int IdPaisProcedencia { get; set; }

        public int IdPaisNacimiento { get; set; }

        public int IdDistritoProcedencia { get; set; }

        public int IdDistritoDomicilio { get; set; }

        public int IdDistritoNacimiento { get; set; }

        public string FichaFamiliar { get; set; }

        public int? IdEtnia { get; set; }

        public string GrupoSanguineo { get; set; }

        public string FactorRh { get; set; }

        public bool UsoWebReniec { get; set; }

        public int IdIdioma { get; set; }

        public string Email { get; set; }

        public string madreDocumento { get; set; }

        public string madreApellidoPaterno { get; set; }

        public string madreApellidoMaterno { get; set; }

        public string madrePrimerNombre { get; set; }

        public string madreSegundoNombre { get; set; }

        public int NroOrdenHijo { get; set; }

        public int madreTipoDocumento { get; set; }

        public string Sector { get; set; }

        public int Sectorista { get; set; }

        public int EstadoMigracion { get; set; }

        public int Religion { get; set; }

        public string acompañante { get; set; }

        public int? IdDepartamentoDomicilio { get; set; }
        public int? IdDepartamentoProcedencia { get; set; }
        public int? IdDepartamentoNacimiento { get; set; }
        public string Nombres { get; set; }
        public string CipPaciente { get; set; }
        public string TelefonoMadre { get; set; }
        public int cboParentescoMadre { get; set; }
        public int TipoMPadres { get; set; }
        public int TipoPPadres { get; set; }
        public string NroDocMPadres { get; set; }
        public string NroDocPPadres { get; set; }
        public string NombresMPadres { get; set; }
        public string NombresPPadres { get; set; }
        public int ParentescoPaciente { get; set; }
        public int cboDiscapacidadPaciente { get; set; }
        public int DependenciaPaciente { get; set; }
        public int UnidadPagoPaciente { get; set; }
        public int GradoPaciente { get; set; }
        public int SituacionPaciente { get; set; }
        public string FactorRHPaciente { get; set; }
        public string GrupoSanguineoPaciente { get; set; }
        public string CodigoCajaPensionPaciente { get; set; }
        public string Telefono2Paciente { get; set; }
        public string Telefono3Paciente { get; set; }
        public int IdPaisMadre { get; set; }
        public int idDepartamentoMadre { get; set; }
        public int idProvinciaMadre { get; set; }
        public int idDistritoMadre { get; set; }
        public int idCentroPobladoMadre { get; set; }
        public string DireccionMadre { get; set; }

        public List<PacienteContacto> Contactos { get; set; }

    }

}
