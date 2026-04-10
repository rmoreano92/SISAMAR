using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.Context.Reportes.Domain;
using WebAppMaternidad.Context.Reportes.Domain.Interfaces;
using WebAppMaternidad.Context.Reportes.Infrastructure;

namespace WebAppMaternidad.Context.Reportes.Application.Factories
{
    public class ExcelReportFactory
    {
        private readonly Dictionary<ModeloReporte, IExcelReportGenerator> _strategies;

        public ExcelReportFactory()
        {
            _strategies = new Dictionary<ModeloReporte, IExcelReportGenerator>
            {
                { ModeloReporte.EstadoCuentaPtoCargaDetallado, new EstadoCuentaPtoCargaDetalladoReport() },
                { ModeloReporte.EstadoCuentaPtoCargaConsolidado, new EstadoCuentaConsolidadoReport() },
                { ModeloReporte.EstadoCuentaLiquidacion, new EstadoCuentaLiquidacionReport() },
                { ModeloReporte.EstadoCuentaExoneracion, new EstadoCuentaExoneracionReport() },
                { ModeloReporte.EstadoCuentaResumenLiquidacion, new EstadoCuentaResumenLiquidacionReport() },
                // { ModeloReporte.EstadoCuentaResumen, new EstadoCuentaResumenReport() },
                // { ModeloReporte.FacturacionServicioDespachoXcuenta, new FacturacionServicioDespachoXcuentaReport() },
                // { ModeloReporte.FacturacionServicioDespachoXcuentaConsolidado, new FacturacionServicioDespachoXcuentaConsolidadoReport() }
                // Agregas aquí los demás modelos...
            };
        }

        public IExcelReportGenerator GetGenerator(ModeloReporte modelo)
        {
            if (_strategies.TryGetValue(modelo, out var generator))
                return generator;

            throw new NotImplementedException($"No existe implementación para {modelo}");
        }
    }
}