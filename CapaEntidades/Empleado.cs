using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class Empleado
    {
        public Int32 IdEmpleado                {set;get;}
        public string ApellidoPaterno          {set;get;}
        public string ApellidoMaterno          {set;get;}
        public string Nombres                  {set;get;}
        public Int32 IdCondicionTrabajo        {set;get;}
        public Int32 IdTipoEmpleado            {set;get;}
        public Int32 IdPuesto                  { set; get; }
        public string DNI                      {set;get;}
        public string CodigoPlanilla           {set;get;}
        public DateTime FechaIngreso           {set;get;}
        public DateTime FechaAlta              {set;get;}
        public string Usuario                  {set;get;}
        public string UsuarioClave             {set;get;}
        public string loginEstado              {set;get;}
        public string loginPC                  {set;get;}
        public DateTime FechaNacimiento        {set;get;}
        public Int32 idTipoDestacado           {set;get;}
        public Int32 IdEstablecimientoExterno  {set;get;}
        public String HisCodigoDigitador       {set;get;}
        public bool ReniecAutorizado           {set;get;}
        public Int32 idTipoDocumento           {set;get;}
        public int idSupervisor                {set;get;}
        public bool esActivo                   {set;get;}
        public bool AccedeVWeb                 {set;get;}
        public string ClaveVWeb                {set;get;}
        public Int32 IdTipoSexo                {set;get;}
        public Int32 IdMedico { set; get; }               //KHOYOSI
        public string FotoFirma { set; get; }             //KHOYOSI

        public static List<RolesItems> PermisoRolUsuario { set; get; }        
        public String NombreCompleto() {

            return Nombres + " " + ApellidoPaterno + " " + ApellidoMaterno;

        }

        public String NombreCompleto2()
        {

            String[] nombres2 = Nombres.Split(' ');
            return nombres2[0].ToString() + " " + ApellidoPaterno + " " + ApellidoMaterno;

        }

        public static RolesItems DevuelveRolxItem(int idList) {
            RolesItems objRol = null;

            foreach (RolesItems objRolItem in PermisoRolUsuario)
            {
                if (objRolItem.IdListItem==idList ) {
                    objRol = objRolItem;
                    return objRol;
                }
            }
            return objRol;
        }

        public static Task<RolesItems> DevuelveRolxItemV2(int idList) //JDELGADO001.2
        {
            RolesItems objRol = null;

            return Task.Run(() =>
            {
                foreach (RolesItems objRolItem in PermisoRolUsuario)
                {
                    if (objRolItem.IdListItem == idList)
                    {
                        objRol = objRolItem;
                        return objRol;
                    }
                }
                return objRol;
            });

        }

    }
}
