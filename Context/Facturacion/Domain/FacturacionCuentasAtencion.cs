using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Facturacion.EstadoCuenta.Domain
{
    public class FacturacionCuentasAtencion
    {
        public int IdCuentaAtencion { get; private set; }
        public int IdPaciente { get; private set; }
        public DateTime FechaApertura { get; private set; }
        public string HoraApertura { get; private set; }
        public DateTime? FechaCierre { get; private set; }
        public string HoraCierre { get; private set; }
        public decimal? TotalExonerado { get; private set; }
        public decimal? TotalAsegurado { get; private set; }
        public decimal? TotalPagado { get; private set; }
        public int? IdEstado { get; private set; }
        public decimal? TotalPorPagar { get; private set; }
        public int? IdUsuarioCrea { get; private set; }
        public int? IdUsuarioModifica { get; private set; }
        public DateTime? FechaCreacion { get; private set; }
        public DateTime? FechaModificacion { get; private set; }
        public int? IdEstadoAntesCierre { get; private set; }
        public int? VecesAbierto { get; private set; }

        // Constructor controlado
        public FacturacionCuentasAtencion(int idPaciente, DateTime fechaApertura, string horaApertura, int idUsuarioCrea)
        {
            IdPaciente = idPaciente;
            FechaApertura = fechaApertura;
            HoraApertura = horaApertura;
            IdUsuarioCrea = idUsuarioCrea;
            FechaCreacion = DateTime.Now;
            IdEstado = 1; // Estado inicial (ejemplo: abierto)
        }

        // Método de dominio
        public void CerrarCuenta(DateTime fechaCierre, string horaCierre, int idUsuario)
        {
            FechaCierre = fechaCierre;
            HoraCierre = horaCierre;
            IdUsuarioModifica = idUsuario;
            FechaModificacion = DateTime.Now;
            IdEstado = 2; // Estado cerrado
        }
    }
}