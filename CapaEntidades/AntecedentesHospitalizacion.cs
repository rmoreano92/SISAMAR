using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class AntecedentesHospitalizacion
    {
        public int? DiabetesFam { get; set; }
        public string DiabetesDescripcionFam { get; set; }

        public int? TbcFam { get; set; }
        public string TbcDescripcionFam { get; set; }

        public int? HtaFam { get; set; }
        public string HtaDescripcionFam { get; set; }

        public int? GemelaresFam { get; set; }
        public string GemelaresDescripcionFam { get; set; }

        public int? MalformacionesFam { get; set; }
        public string MalformacionesDescripcionFam { get; set; }

        public int? PreEclampsiaFam { get; set; }
        public string PreEclampsiaDescripcionFam { get; set; }

        public int? CondMedicaGraveAntFam { get; set; }
        public string OtrosCondMedicaGraveAntFam { get; set; }

        public int? OtrosAntFam { get; set; }
        public string OtrosAntDescripcionFam { get; set; }

        public string AntecedentesGeneralesFam { get; set; }



        public int? TbcPerso { get; set; }
        public string TbcPersoDescripcion { get; set; }

        public int? HtaPerso { get; set; }
        public string HtaPersoDescripcion { get; set; }

        public int? VIHPerso { get; set; }
        public string VIHPersoDescripcion { get; set; }

        public int? CirugiaMayorPerso { get; set; }
        public string CirugiaMayorPersoDescripcion { get; set; }

        public int? VacunaPreviaPerso { get; set; }
        public string VacunaPreviaPersoDescripcion { get; set; }

        public int? DiabetesPerso { get; set; }
        public string DiabetesPersoDescripcion { get; set; }

        public int? PreEclampsiaPerso { get; set; }
        public string PreEclampsiaPersoDescripcion { get; set; }

        public int? AlergiaPerso { get; set; }
        public string AlergiaPersoDescripcion { get; set; }

        public int? ViolenciaPerso { get; set; }
        public string ViolenciaPersoDescripcion { get; set; }

        public int? CondMedicaGravePerso { get; set; }
        public string CondMedicaGraveAntDescripcionPerso { get; set; }
        public int? CardiopatiaPerso { get; set; }
        public string CardiopatiaAntDescripcionPerso { get; set; }
        public int? MetropatiaPerso { get; set; }
        public string MetropatiaPersoAntDescripcionPerso { get; set; }
        public int? OtrosPerso { get; set; }
        public string OtrosPersoDescripcion { get; set; }


        // Propiedades para los campos tipo string (txt)
        public string GestasPObst { get; set; }
        public string AbortosObst { get; set; }
        public string VaginalesObst { get; set; }
        public string NacidosVivosObst { get; set; }
        public string VivenObst { get; set; }
        public string Sem1Obst { get; set; }
        public string PartosObst { get; set; }
        public string CesareasObst { get; set; }
        public string NacMuertosObst { get; set; }
        public string Desp1SemObst { get; set; }
        public string PesoPregestaObst { get; set; }
        public string Par1Obst { get; set; }
        public string Par2Obst { get; set; }
        public string Par3Obst { get; set; }
        public string Par4Obst { get; set; }
        public int? GemelaresObst { get; set; }
        public string GemelaresDescripcionObst { get; set; }
        public DateTime? FinEmbObst { get; set; }

        // Propiedades para los campos tipo int (cbo)
        public int? TerminacionObst { get; set; }
        public int? AbortoObst { get; set; }
        public int? FracasoObst { get; set; }
        public int? EmbPlaneadoObst { get; set; }

        // Propiedades para los campos tipo int (ch)
        public int? Peso2500Obst { get; set; }
        public int? MultObst { get; set; }
        public int? Sem37Obst { get; set; }
        public int? Peso4000Obst { get; set; }
        public int? EtOtopicoObst { get; set; }
    }
}
