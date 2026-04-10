using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static CapaEntidades.Enumerados;
using WebAppMaternidad.Areas.Comun;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class ConsultaExternaController : Controller
    {

        public async Task<IActionResult> AtencionMedica(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            

            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                ViewBag.PermisoRefCon = pRefcon;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario .DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.idEmpleado = idUsuario; // JDELGADO001

            }


            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();
            
            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            if (lsMedcos.Rows.Count > 0)
            {
                ViewBag.Medico = true;
            }
            else
            {
                ViewBag.Medico = false;
            }

            ViewBag.Vista = Enumerados.Grupo.Emergencia;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("AtencionMedicaV2");
        }

        /////////////////////////KHOYOSI///////////////////////////////
        public async Task<IActionResult> RegistroAtencion(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                ViewBag.PermisoRefCon = pRefcon;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.idEmpleado = idUsuario; // JDELGADO001

            }


            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            if (lsMedcos.Rows.Count > 0)
            {
                ViewBag.Medico = true;                
            }
            else
            {
                ViewBag.Medico = false;                
            }

            ViewBag.idMedico = int.Parse(HttpContext.Session.GetString("idmed"));

            ViewBag.Vista = Enumerados.Grupo.Emergencia;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("RegistroAtencion");
        }
        ////////////////////////////////////////////////////////////

        //public async Task<IActionResult> AtencionMedicaTemporal(int idListBar)
        //{

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return View("Login");
        //    }

        //    //ROLES LUIS
        //    int idUsuario;
        //    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    DalEmpleado dlEmpleado = new DalEmpleado();


        //    RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

        //    // FIN ROLES LUIS
        //    DalParametros daoParametros = new DalParametros();
        //    string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

        //    if (objRol == null)
        //    {
        //        return View("AccesoDenegado");
        //    }
        //    else
        //    {
        //        ViewBag.Agregar = objRol.Agregar;
        //        ViewBag.Modificar = objRol.Modificar;
        //        ViewBag.Eliminar = objRol.Eliminar;
        //        ViewBag.Consultar = objRol.Consultar;

        //        ViewBag.PermisoRefCon = pRefcon;

        //        DalUtilitario dlUtilitario = new DalUtilitario();
        //        List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
        //        TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
        //        //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
        //        ViewBag.TiposDiagnosticos = TiposDiagnosticos;
        //        ViewBag.idEmpleado = idUsuario; // JDELGADO001

        //    }


        //    DataTable lsMedcos = new DataTable();
        //    DalAtenciones daoAtenciones = new DalAtenciones();

        //    lsMedcos = daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

        //    if (lsMedcos.Rows.Count > 0)
        //    {
        //        ViewBag.Medico = true;
        //    }
        //    else
        //    {
        //        ViewBag.Medico = false;
        //    }

        //    ViewBag.Vista = Enumerados.Grupo.Emergencia;
        //    ViewBag.Area = "Consulta Externa";
        //    //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
        //    return View("AtencionMedicaTemporal");
        //}

        public IActionResult DashBoardCitas()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            return View("DashBoardCitas");
        }


        public async Task<IActionResult> SolicitudCitas(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
            // FIN ROLES LUIS
            //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;
            }
            //return View("SolicitudCitas");

            return View("Citas");
        }



        public async Task<IActionResult> PlanificacionFamiliar(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                    DalUtilitario dlUtilitario = new DalUtilitario();
                    List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                    List<Comorbilidad> lstComorbilidad = new List<Comorbilidad>();
                    TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                    lstComorbilidad = dlUtilitario.DevuelveComorbilidades();

                    ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                    ViewBag.ListComorbilidad = lstComorbilidad;
                }
                ViewBag.Vista = (int)Enumerados.Grupo.Consulta_externa;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Externos;
                ViewBag.Area = "Consulta Externa";
                return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> Recetas(int idListBar)
        {

            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;
                }

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

                ViewBag.Vista = (int)Enumerados.Grupo.Consulta_externa;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Externos;
                ViewBag.Area = "Consulta Externa";
                return View("~/Views/Comun/RecetaGeneral.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> Citas(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
            // FIN ROLES LUIS
            //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                //DalUtilitario dlUtilitario = new DalUtilitario();
                //List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            }


            //DataTable lsMedcos = new DataTable();
            //DalAtenciones daoAtenciones = new DalAtenciones();
            //int idUsuario;
            //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            //lsMedcos = daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            //if (lsMedcos.Rows.Count > 0)
            //{
            //    ViewBag.Medico = true;
            //}
            //else
            //{
            //    ViewBag.Medico = false;
            //}

            ViewBag.Vista = Enumerados.Grupo.Consulta_externa;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("Citas");
        }

        public async Task<IActionResult> Paciente(int idListBar)
        {

            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                }
                ViewBag.Vista = (int)Enumerados.Grupo.Consulta_externa;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Externos;
                ViewBag.Area = "";
                return View("~/Views/Comun/Paciente.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }


        ///////////////////KHOYOSI//////////////////////////////
        public async Task<IActionResult> Referencia(int idListBar)
        {

            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                DalParametros daoParametros = new DalParametros();
                string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    if(pRefcon != "1")
                    {
                        ViewBag.Mensaje = "El módulo no estara disponible hasta habilitar el parametro REFCON desde las opciones de configuración de Parametros.";
                        return View("AccesoDenegado");
                    } else
                    {
                        ViewBag.Agregar = objRol.Agregar;
                        ViewBag.Modificar = objRol.Modificar;
                        ViewBag.Eliminar = objRol.Eliminar;
                        ViewBag.Consultar = objRol.Consultar;
                    }
                }
                ViewBag.Vista = (int)Enumerados.Grupo.Consulta_externa;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Externos;
                ViewBag.Area = "Referencias y Contrareferencias";
                return View("~/Views/Comun/Referencia.cshtml");
                //return View("Referencia");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
        ///////////////////KHOYOSI//////////////////////////////
        ///
        // JDELGADO002 //
        public async Task<IActionResult> CitasAdmision(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                //ViewBag.Agregar = objRol.Agregar;
                //ViewBag.Modificar = objRol.Modificar;
                //ViewBag.Eliminar = objRol.Eliminar;
                //ViewBag.Consultar = objRol.Consultar;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            }



            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            ViewBag.Vista = Enumerados.Grupo.Emergencia;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("CitasAdmision");
        }
        // END JDELGADO002 //

        public async Task<IActionResult> RegistroTriaje(int idListBar)
        {
            DalEmpleado dlEmpleado = new DalEmpleado();
            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            }

            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            ViewBag.Vista = Enumerados.Grupo.Emergencia;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("RegistroTriaje");
        }
        // END JDELGADO002 //

        // JDELGADO

        public async Task<IActionResult> RegistroVacunas(int idListBar)
        {
            DalEmpleado dlEmpleado = new DalEmpleado();
            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            }

            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            ViewBag.Vista = Enumerados.Grupo.Consulta_externa;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("RegistroVacunas");
        }

        ///////////////////KHOYOSI//////////////////////////////
        public async Task<IActionResult> ReferenciaMinsa(int idListBar)
        {

            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                DalParametros daoParametros = new DalParametros();
                string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    if (pRefcon != "1")
                    {
                        ViewBag.Mensaje = "El módulo no estara disponible hasta habilitar el parametro REFCON desde las opciones de configuración de Parametros.";
                        return View("AccesoDenegado");
                    }
                    else
                    {
                        ViewBag.Agregar = objRol.Agregar;
                        ViewBag.Modificar = objRol.Modificar;
                        ViewBag.Eliminar = objRol.Eliminar;
                        ViewBag.Consultar = objRol.Consultar;
                    }
                }
                ViewBag.Vista = (int)Enumerados.Grupo.Consulta_externa;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Consultorios_Externos;
                ViewBag.Area = "Referencias y Contrareferencias";
                return View("~/Views/Comun/ReferenciaMinsa.cshtml");
                //return View("Referencia");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        /////////////////////////KHOYOSI///////////////////////////////
        public async Task<IActionResult> RegistroConsejeria(int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                ViewBag.PermisoRefCon = pRefcon;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.idEmpleado = idUsuario; // JDELGADO001

            }


            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            if (lsMedcos.Rows.Count > 0)
            {
                ViewBag.Medico = true;
            }
            else
            {
                ViewBag.Medico = false;
            }

            ViewBag.idMedico = int.Parse(HttpContext.Session.GetString("idmed"));

            ViewBag.Vista = Enumerados.Grupo.Emergencia;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("RegistroConsejeria");
        }


        public async Task<IActionResult> CitasTerapia(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                //ViewBag.Agregar = objRol.Agregar;
                //ViewBag.Modificar = objRol.Modificar;
                //ViewBag.Eliminar = objRol.Eliminar;
                //ViewBag.Consultar = objRol.Consultar;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            }



            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            ViewBag.Vista = Enumerados.Grupo.Consulta_externa;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("CitasTerapia");
        }
        // JDELGADO

        /*
        //////////////////////////KHOYOS///////////////////////////////////////////
        public async Task<IActionResult> SolicitudCitas(int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
            // FIN ROLES LUIS
            //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;
            }
            
            return View("Citas");
        }

        ////////////////////////////////////////////////////////////////////////////
        */
        // MGAMERO - INICIO
        public async Task<IActionResult> Admision(int idListBar)
        {
            DalEmpleado dlEmpleado = new DalEmpleado();
            DataTable lsMedcos = new DataTable();
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

            if (objRol == null)
            {
                return View("AccesoDenegado");
            }
            else
            {
                ViewBag.Agregar = objRol.Agregar;
                ViewBag.Modificar = objRol.Modificar;
                ViewBag.Eliminar = objRol.Eliminar;
                ViewBag.Consultar = objRol.Consultar;

                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            }

            lsMedcos = await daoAtenciones.ListaIdMedicoByUsuario(idUsuario);

            ViewBag.Vista = Enumerados.Grupo.Emergencia;
            ViewBag.Area = "Consulta Externa";
            //return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            return View("Admision");
        }
        // MGAMERO - FIN

    }
}
