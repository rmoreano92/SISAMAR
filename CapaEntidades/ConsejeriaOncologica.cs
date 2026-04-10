using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class ConsejeriaOncologica
    {
        public int? MotivoConsejeriaOnco { get; set; }
        public int? TemaConsejeriaOnco { get; set; }
        public int? AntecedenteFamiliarCoOnco { get; set; }
        public string AntecedenteFamiliarDescripcionCoOnco { get; set; }
        public string AndriaOnco { get; set; }
        public int? UsoAnticonceptivoOnco { get; set; }
        public string EdadPrimeraMenstruacionOnco { get; set; }
        public int? GestacionOnco { get; set; }
        public int? Perdidas { get; set; }
        public string ParidadOnco { get; set; }
        public string EdadPrimerEmbarazoOnco { get; set; }
        public string EdadPrimeraRelacionSexual { get; set; }
        public DateTime? FechaUltimaMenstruacionOnco { get; set; }
        public int? TerapiaReemplazoRenalOnco { get; set; }
        public string RecomendacionesSugerenciasOnco { get; set; }

        // Propiedades booleanas representadas como int
        public int? ConsumoTabacoOnco { get; set; }
        public int? ConsumoAlcoholOnco { get; set; }
        public int? ObesidadOnco { get; set; }
        public int? SedentarismoOnco { get; set; }
        public int? ComportamientoSexualInadecuado { get; set; }
        public int? TratamientoParaFertilidad { get; set; }
        public int? LactanciaMaterna { get; set; }
    }
}
