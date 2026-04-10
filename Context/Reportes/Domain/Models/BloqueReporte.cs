using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public class BloqueReporte
    {
        public string Html { get; set; }
        public TipoReporte TipoReporte { get; set; }
        public int ModeloReporte { get; set; }
        public DatosCabeceraReporte CabeceraReporte { get; set; }

        public BloqueReporte(string html, TipoReporte tipoReporte, int modeloReporte, DatosCabeceraReporte cabeceraReporte)
        {
            Html = html;
            TipoReporte = tipoReporte;
            ModeloReporte = modeloReporte;
            CabeceraReporte = cabeceraReporte;
        }
    }
}