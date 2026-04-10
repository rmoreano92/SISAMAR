using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Facturacion.EstadoCuenta.Domain
{
    public interface IFacturacionCuentasAtencionRepository
    {
        // Task<FacturacionCuentasAtencion> GetByIdAsync(int id);
        // // Task<IEnumerable<FacturacionCuentasAtencion>> ObtenerPorPacienteAsync(int idPaciente);
        // Task AddAsync(FacturacionCuentasAtencion cuenta);
        // Task UpdateAsync(FacturacionCuentasAtencion cuenta);

        Task<FacturacionCuentasAtencion> GetByIdAsync(int id);
        Task<IEnumerable<FacturacionCuentasAtencion>> GetAllAsync();
        Task AddAsync(FacturacionCuentasAtencion cuenta);
        Task UpdateAsync(FacturacionCuentasAtencion cuenta);
    }
}