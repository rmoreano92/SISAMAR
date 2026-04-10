using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class GestacionActualCpnHospitalizacion
    {
        // Propiedades para los campos tipo string (txt)
        public DateTime? FechaFURGA { get; set; }
        public string EGsemanasGA { get; set; }
        public string EGdiasGA { get; set; }
        public DateTime? FechaFPPGA { get; set; }
        public DateTime? FEcogGA { get; set; }
        public string SemasEcoGA { get; set; }
        public string DiasEcoGA { get; set; }
        public string PesoAntGA { get; set; }
        public string TallaAntGA { get; set; }
        public string TipoDrogaGA { get; set; }


        // Propiedades para los campos tipo int (cbo)
        public int? EdadGestConfiableCA { get; set; }
        public int? AlcoholDrogaGA { get; set; }
        public int? TrimestreGA { get; set; }
        public int? ExOdontoGA { get; set; }
        public int? ExCervixGA { get; set; }
        public int? PreparacionPartoGA { get; set; }
        public int? ViolenciaGA { get; set; }
        public int? TrimestreVGA { get; set; }
        public int? ExMamasGA { get; set; }
        public int? ConsejeriaLMGA { get; set; }
        public int? TamizajeHepatitisBGA { get; set; }


        public int? TetanoGA { get; set; }
        public string DosisTetanoGA { get; set; }
        public DateTime? FechaTetanoGA { get; set; }

        public int? TDAPGA { get; set; }
        public string DosisTDAPGA { get; set; }
        public DateTime? FechaTDAPGA { get; set; }

        public int? InfluenzaGA { get; set; }
        public string DosisInfluenzaGA { get; set; }
        public DateTime? FechaInfluenzaGA { get; set; }

        public int? AntirubiolaGA { get; set; }
        public string DosisAntirubiolaGA { get; set; }
        public DateTime? FechaAntirubiolaGA { get; set; }

        public int? HepatitisBGA { get; set; }
        public string DosisHepatitisBGA { get; set; }
        public DateTime? FechaHepatitisBGA { get; set; }

        public int? HepatitisAGA { get; set; }
        public string DosisHepatitisAGA { get; set; }
        public DateTime? FechaHepatitisAGA { get; set; }


        // Propiedades para los campos tipo int (chk)
        public int? MuestraEcoGA { get; set; }
        public int? CalculaFechaEcoGA { get; set; }

        public string GrupoSanguineoGA { get; set; }
        public string FactorRhGA { get; set; }
        public int? ToxoplasmosisGA { get; set; }
        public int? PapanicolauGA { get; set; }
        public int? VihSolicitadoGA { get; set; }
        public int? VdrlRprMenor20GA { get; set; }
        public int? VdrlRprMayor20GA { get; set; }
        public int? SifilisFtaGA { get; set; }
        public string HbMenor20GA { get; set; }
        public string HbMayor20GA { get; set; }
        public int? FolatosGA { get; set; }
        public int? VersExterGA { get; set; }
        public int? BacteriuriaGA { get; set; }
        public int? ChagasGA { get; set; }
        public int? PaludismoMalariaGA { get; set; }
        public int? EstreptococoGA { get; set; }
        public string GlausemiaMenor20GA { get; set; }
        public string GlausemiaMayor20GA { get; set; }


        public int? ControlInmpGA { get; set; }
        public string NumControlesInmpGA { get; set; }
        public string IdReferenciaEESSGA { get; set; }
        public string CodigoReferenciaEESSGA { get; set; }
        public string DescripcionReferenciaEESSGA { get; set; }
        public string NumControlesOtroESSGA { get; set; }
        public string IdReferenciaOtroEESSGA { get; set; }
        public string CodigoReferenciaOtroEESSGA { get; set; }
        public string DescripcionReferenciaOtroEESSGA { get; set; }
        public string MotivoReferenciaGA { get; set; }
        public int? RequirioHospitalizacionGA { get; set; }

        public string DiasHospitalizacionCpnGA { get; set; }
        public string ObservacionesCpnGA { get; set; }

        public DateTime? FechaPrimerControl { get; set; }
        public DateTime? FechaUltimoControl { get; set; }

    }
}
