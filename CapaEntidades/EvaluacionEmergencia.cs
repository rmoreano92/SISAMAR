using System;

namespace CapaEntidades
{
    public class EvaluacionEmergencia
    {
        public int IdEvaluacion { get; set; }

        public int IdAtencion { get; set; }

        public string FechaUR { get; set; }

        public string FechaPP { get; set; }

        public string FechaPrimeraEco { get; set; }

        public int? SemPrimeraEco { get; set; }

        public int? DiasPrimeraEco { get; set; }

        public int? EdadGestacional { get; set; }

        public int? Cnp { get; set; }

        public int? Dolor { get; set; }

        public int? Convulsiones { get; set; }

        public int? Fiebre { get; set; }

        public int? Vomitos { get; set; }
        public int? Diarrea { get; set; }
        public int? Hemorragia { get; set; }
        public int? DificultadRespiratoria { get; set; }
        public int? DistensionAbdominal { get; set; }
        public int? Cianosis { get; set; }
        public int? MalOlorOmbligo { get; set; }
        public int? Ictericia { get; set; }
        
        public int? ContraccionesU { get; set; }

        public int? SangradoV { get; set; }

        public int? PerdidaLA { get; set; }

        public int? AusenciaMF { get; set; }

        public int? SintomasU { get; set; }

        public int? FlujoV { get; set; }

        public int? Tumoracion { get; set; }

        public int? AlteracionesM { get; set; }

        public string Antecedentes { get; set; }

        public string EnfermedadA { get; set; }

        public DateTime? fechaRegistro { get; set; }

        public int? IdUsuario { get; set; }

        public int? IdUsuarioModifica { get; set; }

        public int? UltRegla { get; set; }

        public string FechaEco { get; set; }

        public int? GMotiA { get; set; }

        public string PMotiA { get; set; }

        public string Paridad1 { get; set; }
        public string Paridad2 { get; set; }
        public string Paridad3 { get; set; }
        public string Paridad4 { get; set; }

        public int? FechaEcoAct { get; set; }

        public int? DisMovFetales { get; set; }
        public int? Otros { get; set; }

        public string PesoFetalAnt { get; set; }

        public int? TipoPaciente { get; set; }

        public int? Prioridad { get; set; }

        public int? Glasgow { get; set; }

        public string ObservacionTriaje { get; set; }

        public int? DiasGestacional { get; set; }

        public int? CalculaFE { get; set; }

        public int? SemanaGestacionalEco { get; set; }

        public int? DiasGestacionalEco { get; set; }

        //nuveos campos que se usaran para hospitalizacion
       // public int? IrritacionCortical { get; set; }
        public string Pin { get; set; }
        public double DeltaPeso { get; set; }
        public int? MaduracionPulmonar { get; set; }
        public int? MaduracionCervical { get; set; }
        public string Ram { get; set; }
        public int? TransfucionSangre { get; set; }
        public string AntecedentesQuirurgicos { get; set; }
        public string ContraccionesUterinasDesc { get; set; }
        public string PerdidaLiquidoAmnioticoDesc { get; set; }
        public string MovimientoFetalesDesc { get; set; }
        public string SangradoVaginalDesc { get; set; }
        public string FiebreDesc { get; set; }
        public string SgIrritacionCorticalDesc { get; set; }
        public int SgIrritacionCortical { get; set; }
        public int idServicio { get; set; }
        public int idNumero { get; set; }

        public string Sintomas { get; set; }

        public string MaduracionPulmonarDesc { get; set; }

        public string MaduracionCervicalDesc { get; set; }

        public string DescripcionExamenFisico { get; set; } // JDELGADO001.2

        public string TratamientoNuevo { get; set; } // JDELGADO001.2

        public string Apetito { get; set; } // KHOYOSI
        public string Sed { get; set; } // KHOYOSI
        public string Orina { get; set; } // KHOYOSI
        public string Deposiciones { get; set; } // KHOYOSI
        public string Suenio { get; set; } // KHOYOSI

        //public string apetitoEval { get; set; } // JDELGADO003-C
        //public string sedEval { get; set; } // JDELGADO003-C
        //public string orinaEval { get; set; } // JDELGADO003-C
        //public string deposicionesEval { get; set; } // JDELGADO003-C
        //public string suenioEval { get; set; } // JDELGADO003-C

        public int RiesgoCaida { get; set; }


    }

}
