using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class NinioAltoRiesgoNacimiento
    {
        public int id { get; set; }

        public int? estaGestacionalAlNacer { get; set; }

        public decimal? pesoAlNacer { get; set; }

        public decimal? perimetroCefalico { get; set; }

        public decimal? perimetroToracico { get; set; }
        public decimal? tallaAlNacer { get; set; }

        public int? inmedito { get; set; }

        public string apgar1min { get; set; }

        public string apgar5min { get; set; }

        public int? reanimacion { get; set; }

        public int? patologiaNeonatal { get; set; }

        public string patologiaNeonatalDescripcion { get; set; }

        public int? hospitalizacion { get; set; }

        public string tiempoHospitalizado { get; set; }

        public int? idAtencion { get; set; }

        public string fechaRegistro { get; set; }

        public string fechaUpdate { get; set; }

        public int? usuarioRegistro { get; set; }

        public int? usuarioUpdate { get; set; }
        public int? idPaciente { get; set; }

        public string idClasificacionNar { get; set; }
        public string idEdadCorregida { get; set; }
        public string edadCronologica { get; set; }
    }
}
