using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class MovimientoCama
    {
        public int idMovimientoCama {  get; set; }
        public int idCama { get; set; }
        public int idServicio { get; set; }
        public string fecIngreso {  get; set; }
        public string fecSalida { get; set; }
    }
}
