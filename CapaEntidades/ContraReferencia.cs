using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ContraReferencia
    {
        public int IdContraReferencia { get; set; }
        public string NroHojaContraReferencia { get; set; }
        public int IdCuentaAtencion { get; set; }
        public string IpressOrigen { get; set; }
        public string IpressDestino { get; set; }
        public string ServicioOrigen { get; set; }
        public string ServicioDestino { get; set; }
        public string Especialidad { get; set; }
        public string DxOrigen { get; set; }
        public string DxIngreso { get; set; }
        public string DxEgreso { get; set; }
        public string Tratamiento { get; set; }
        public string Calificacion { get; set; }
        public string Recomendaciones { get; set; }
        public int CondicionUsuario { get; set; }

        public string DescOrigen { get; set; }
        public string DescServicioOrigen { get; set; }
        public string DescDestino { get; set; }
        public string DescServicioDestino { get; set; }
        public string DescEspecialidad { get; set; }

        public int IdResponsable { get; set; }
        public int IdResponsableEESS { get; set; }

    }
}
