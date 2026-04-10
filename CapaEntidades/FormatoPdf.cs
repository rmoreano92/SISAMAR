using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class FormatoPdf
    {
        public string codigo { get; set; }
        public int idRegistro { get; set; }
        public int idCuentaAtencion { get; set; }
        public int idAtencion { get; set; }
        public int nroHistoriaClinica { get; set; }
        public int idProCabecera { get; set; }
        public int tipoFormato { get; set; }
        public StringBuilder stringHtml { get; set; }
        public string pageHtml { get; set; }
        public string nombreArchivo { get; set; }
        public string rutaArchivo { get; set; }
        public int tipoServicio { get; set; }
        public string tipoDocumento { get; set; }
        public string tipo { get; set; }
        public string orientacion { get; set; }
        public string tamanio { get; set; }
        public int marginX { get; set; }
        public int marginY { get; set; }
        public float width { get; set; }
        public float height { get; set; }

        public string Paciente { get; set; }
        public string Historia { get; set; }
        public string Cuenta { get; set; }
        public string Servicio { get; set; }
        public string Cama { get; set; }
        public string Edad { get; set; }
        public string Movimiento { get; set; }
        public string Item { get; set; }

        public string Firmador1 { get; set; }
        public string TipoFirmador1 { get; set; }
        public string Firmador2 { get; set; }
        public string TipoFirmador2 { get; set; }

    }
}
