using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.Servicios.Domain
{
    public class Servicio
    {
        public int IdServicio { get; set; }
        public string Nombre { get; set; }
        public int IdEspecialidad { get; set; }
        public int IdTipoServicio { get; set; }
        public string Codigo { get; set; }
        public string SVG { get; set; }
        public int? IdProducto { get; set; }
        public string SoloTipoSexo { get; set; }
        public int? MaximaEdad { get; set; }
        public string CodigoServicioSEM { get; set; }
        public string UbicacionSEM { get; set; }
        public string CodigoServicioHIS { get; set; }
        public bool CostoCeroCE { get; set; }
        public int? MinimaEdad { get; set; }
        public int IdEstado { get; set; }
        public bool Triaje { get; set; }
        public bool EsObservacionEmergencia { get; set; }
        public bool UsaModuloNinoSano { get; set; }
        public bool UsaModuloMaterno { get; set; }
        public bool UsaGalenHos { get; set; }
        public string TipoEdad { get; set; }
        public bool UsaFUA { get; set; }
        public string CodigoServicioSuSalud { get; set; }
        public string CodigoServicioFUA { get; set; }
        public string FuaTipoAnexo2015 { get; set; }
        public string CodigoServicioRenaes { get; set; }
        public bool ActivaProcedimiento { get; set; }
        public string TipoArchivo { get; set; }
        public bool UsaModuloAnestesio { get; set; }
        public string TipoModuloEmergencia { get; set; }
        public int? IdEspecialidadMinsa { get; set; }
        public bool EsTeleconsulta { get; set; }
        public bool EsConsejeriaObstetrica { get; set; }
        public bool UsaModuloOdontologico { get; set; }
        public bool Tv { get; set; }
        public bool UsaModuloConsejeriaOncologica { get; set; }
        public bool UsaModuloConsejeriaEstrategiasSanitaria { get; set; }
        public string TipoModulo { get; set; }
        public string CodigoServicioEgresoHosp { get; set; }

        public Servicio(int idServicio, string nombre)
        {
            IdServicio = idServicio;
            Nombre = nombre;
        }
    }
}