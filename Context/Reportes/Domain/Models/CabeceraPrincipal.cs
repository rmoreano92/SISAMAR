using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Reportes.Domain
{
    public class CabeceraPrincipal
    {
        public string IdCuentaAtencion { get; private set; }
        public string NombrePaciente { get; private set; }
        public string NumeroHistoriaClinica { get; private set; }
        public string EstadoCuenta { get; private set; }
        public string FuenteFinanciamiento { get; private set; }
        public string ProductoPlan { get; private set; }
        public string ServicioEgreso { get; private set; }

        public string FechaIngreso { get; private set; }
        public string FechaEgreso { get; private set; }
        public string IdAtencion { get; private set; }
        public string Diagnostico { get; private set; }
        public string Cama { get; private set; }
        public string Direccion { get; private set; }
        public string Ocupación { get; private set; }
        public string TipoServicio { get; private set; }
        public string Usuario { get; private set; }

        public string RiesgoSocial { get; private set; }


        public CabeceraPrincipal(string idCuentaAtencion, string nombrePaciente, string numeroHistoriaClinica, string estadoCuenta, string fuenteFinanciamiento, string productoPlan, string servicioEgreso, string fechaIngreso, string fechaEgreso, string idAtencion, string diagnostico, string cama, string direccion, string ocupacion, string tipoServicio, string usuario, string riesgoSocial = "")
        {
            IdCuentaAtencion = idCuentaAtencion;
            NombrePaciente = nombrePaciente;
            NumeroHistoriaClinica = numeroHistoriaClinica;
            EstadoCuenta = estadoCuenta;
            FuenteFinanciamiento = fuenteFinanciamiento;
            ProductoPlan = productoPlan;
            ServicioEgreso = servicioEgreso;
            FechaIngreso = fechaIngreso;
            FechaEgreso = fechaEgreso;
            IdAtencion = idAtencion;
            Diagnostico = diagnostico;
            Cama = cama;
            Direccion = direccion;
            Ocupación = ocupacion;
            TipoServicio = tipoServicio;
            Usuario = usuario;
            RiesgoSocial = riesgoSocial;
        }
    }
}