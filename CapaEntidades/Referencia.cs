using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Referencia
    {
        public int IdReferencia { get; set; }
        public string NroHojaReferencia { get; set; }
        public int IdCuentaAtencion { get; set; }
        public string IpressOrigen { get; set; }
        public string IpressDestino { get; set; }
        public string ServicioOrigen { get; set; }
        public string ServicioDestino { get; set; }
        public string Anamnesis { get; set; }
        public string ExamenFisico { get; set; }
        public string Tratamiento { get; set; }
        public string Motivo { get; set; }
        public string DetalleMotivo { get; set; }
        public string NotasObservaciones { get; set; }
        public string EspecialidadDestino { get; set; }
        public int CondicionPaciente { get; set; }
        public int TipoTransporte { get; set; }
        
                
        public string DescOrigen { get; set; }
        public string DescServicioOrigen { get; set; }
        public string DescDestino { get; set; }
        public string DescServicioDestino { get; set; }
        public string DescEspecialidad { get; set; }
        public string DxEgreso { get; set; }

        public int IdResponsable { get; set; }
        public int IdResponsableEESS { get; set; }
    }
}
