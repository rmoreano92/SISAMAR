using System;

namespace WebAppMaternidad.CapaEntidades
{
    public class NotaEnfermeriaNeoEvolucionSv
    {
       public DateTime? fechaRegistro { get; set; }
       public string horaRegistro { get; set; }
       public string temperatura { get; set; }
       public string frecuenciaCardiaca { get; set; }
       public string frecuenciaRespiratoria { get; set; }
       public string presionSiastolica { get; set; }
       public string presionDiastolica { get; set; }
       public string peso { get; set; }
       public string saturacion { get; set; }
       public string hgt { get; set; }
       public string presionPromedio { get; set; }

    }
}
