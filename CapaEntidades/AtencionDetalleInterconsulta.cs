using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class AtencionDetalleInterconsulta
    {
        public int idAtencionInterconsulta { get; set; }
        public int idReceta { get; set; }
        public int idCuentaAtencion { get; set; }
        public string TriajePresion { get; set; }
        public string TriajeFrecuenciaCardiaca { get; set; }
        public string TriajeTemperatura { get; set; }
        public string TriajePeso { get; set; }
        public string TriajeTalla { get; set; }
        public string TriajeSaturacionOxigeno { get; set; }
        public string TriajePC { get; set; }
        public int? IdClasificacionPaciente { get; set; }
        public int? NroControles { get; set; }
        public decimal? EdadGestacional { get; set; }
        public int? NroGestas { get; set; }
        public string motivoInterconsulta { get; set; }
        public string apetito { get; set; }
        public string orina { get; set; }
        public string suenio { get; set; }
        public string sed { get; set; }
        public string deposiciones { get; set; }
        public string antecedQuirurgico { get; set; }
        public string antecedAlergico { get; set; }
        public string antecedPatologico { get; set; }
        public string antecedentes { get; set; }
        public string antecedObstetrico { get; set; }
        public string antecedFamiliar { get; set; }
        public string examenClinico { get; set; }
        public string resumenHistoriaClinica { get; set; }
        public string hIniAtencion { get; set; }
        public int idProducto { get; set; }

        public int? idTipoDestino { get; set; }
        public int? idTipoTeleconsulta { get; set; }
        public int? idEstablecimientoReferencia { get; set; }
        public string otrasObservaciones { get; set; }
        public string PlanTrabajo { get; set; }
        public string Tratamiento { get; set; }
    }
}
