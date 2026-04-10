using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class Medico
    {
        public Int32 IdMedico { set; get; }
        public string Colegiatura { set; get; }
        public Int32 IdEmpleado { set; get; }
        public string LoteHIS { set; get; }
        public string idColegioHIS { set; get; }
        public string rne { set; get; }
        public bool egresado { set; get; }
        public int esMedico { set; get; }
    }
}
