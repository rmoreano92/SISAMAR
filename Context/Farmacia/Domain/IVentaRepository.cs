
using System.Data;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.Farmacia.Domain
{
    public interface IVentaRepository
    {
        Task<DataSet> FarmMovimientoVentasDetalleXcuenta(int idCuentaAtencion, int OrderByDocumentoNumero);
    }
}