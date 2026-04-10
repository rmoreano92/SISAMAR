using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.Especialidades.Domain
{
    public class Especialidad
    {
        public int IdEspecialidad { get; set; }
        public string Nombre { get; set; }
        public int IdDepartamento { get; set; }
        public string TiempoPromedioAtencion { get; set; }

        public Especialidad(int idEspecialidad, string nombre, int idDepartamento, string tiempoPromedioAtencion)
        {
            IdEspecialidad = idEspecialidad;
            Nombre = nombre;
            IdDepartamento = idDepartamento;
            TiempoPromedioAtencion = tiempoPromedioAtencion;
        }
    }
}