using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Context.General.DepartamentosHospital.Domain
{
    public class DepartamentoHospital
    {
        public int IdDepartamento { get; private set; }
        public string Nombre { get; private set; }

        public DepartamentoHospital(int idDepartamento, string nombre)
        {
            IdDepartamento = idDepartamento;
            Nombre = nombre;
        }
    }
}