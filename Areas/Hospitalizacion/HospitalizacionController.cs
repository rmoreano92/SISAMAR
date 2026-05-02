using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using static CapaEntidades.Enumerados;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class HospitalizacionController : BaseController
    {
      
        public async Task<IActionResult> VisitasMedicas(int idListBar)
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
            return View("VisitaMedica");
        }

        public async Task<IActionResult> PlanificacionFamiliar(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                    TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionEgreso);
                    ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                    List<Comorbilidad> lstComorbilidad = new List<Comorbilidad>();
                    lstComorbilidad = dlUtilitario.DevuelveComorbilidades();
                    ViewBag.ListComorbilidad = lstComorbilidad;

                }
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización ;
                ViewBag.Area = "Hospitalización";
                return View("~/Views/Comun/PlanificacionFamiliar.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }



        public async Task<IActionResult> PacienteHospitalizados(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol =await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                    TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionEgreso);
                    ViewBag.TiposDiagnosticos = TiposDiagnosticos;

                }
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Area = "Hospitalixación";
                return View("~/Views/Hospitalizacion/PacienteHospitalizados.cshtml");
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
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionIngreso);
                //TiposDiagnosticos = dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // jdelgado descomentar si es necesario para listar tipos diagnostico
                ViewBag.TiposDiagnosticos = TiposDiagnosticos;

                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                return View("~/Views/Comun/RecetaGeneral.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> NotaIngreso(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 

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

                }
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos3 = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();

                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos3 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionIngreso);


                var AgregaProcedimientosPorDefecto = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:AgregaProcedimientosPorDefecto");

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos3 = TiposDiagnosticos3;
                ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C

                ViewBag.AgregaProcedimientosPorDefecto = AgregaProcedimientosPorDefecto; // JDELGADO003-C



                return View("NotaIngresoV2");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarPorAtencion(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            lsAtencionsCE = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso); // JDELGADO J0 ASYNC
            return Json(lsAtencionsCE);
        }
        public async Task<ActionResult> web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(int idAtencion, int idNumero, int idServicio) // JDELGADO003-C
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if(HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAtencionsCE = await daoAtenciones.web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(idNumero, idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idServicio); // JDELGADO J0 ASYNC
            return Json(new { session = true, lsAtencionsCE, estado = true });
        }
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarPorInterconsulta(int idAtencion, int idAtencionInterconsulta, int idServicio) // JDELGADO003-C
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if(HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAtencionsCE = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorInterconsulta(idAtencion, (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idServicio, idAtencionInterconsulta); // JDELGADO J0 ASYNC
            return Json(new { session = true, lsAtencionsCE, estado = true });
        }

        public async Task<IActionResult> ListaNotaIngreso(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                return View("ListaNotaIngreso");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> NotaObstetrica(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                return View("NotaObstetrica");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }
        

        public async Task<IActionResult> InterconsultasHO(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C
                return View("InterconsultasHO");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> EvaluacionesUCI(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C

                ViewBag.idMedico = int.Parse(HttpContext.Session.GetString("idmed"));

                return View("EvaluacionesUCI");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }


        public async Task<IActionResult> EpidemiologiaXXXXXXXXXXXX(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C
                return View("Epidemiologia");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public IActionResult Epidemiologia()
        {
            ViewBag.Agregar = true;
            ViewBag.Modificar = true;
            ViewBag.Eliminar = true;
            ViewBag.Consultar = true;
            return View("Epidemiologia");
        }

        

        public async Task<IActionResult> NotaIngresoObstetricia(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_ListaNotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                return View("NotaIngresoObstetricia");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> Camas(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                DalUtilitario dalUtilitario = new DalUtilitario();

                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                int PermisoLiberaCama = await dalUtilitario.ValidarPermisoUsuario(idUsuario, "CAMA-LIBERAR-CAMA");

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

                    ViewBag.PermisoLiberaCama = PermisoLiberaCama;

                }
                //ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.IdTipoServicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalización";
                ViewBag.Modulo = "Camas de Hospitalización";
                return View("~/Views/Comun/Camas.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        public async Task<IActionResult> NotaEnfermeriaNeo(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 

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

                }
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);


                var AgregaProcedimientosPorDefecto = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:AgregaProcedimientosPorDefecto");
                TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionIngreso);

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;

                ViewBag.PermisoRefCon = pRefcon;

                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C

                ViewBag.AgregaProcedimientosPorDefecto = AgregaProcedimientosPorDefecto; // JDELGADO003-C

                return View("NotaEnfermeriaNeo");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }


        public async Task<IActionResult> FiliacionRecienNacido(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                DalUtilitario dlUtilitario = new DalUtilitario();

                int PermisoRegistroFiliacionPorRegistroNacimiento = await dlUtilitario.ValidarPermisoUsuario(idUsuario, "REGISTRO-FILIACION-POR-REGISTRO-NACIMIENTO");

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

                    ViewBag.PermisoRegistroFiliacionPorRegistroNacimiento = PermisoRegistroFiliacionPorRegistroNacimiento;

                }
                //ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.IdTipoServicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalización";
                ViewBag.Modulo = "Triaje Recien Nacido";
                return View("~/Views/Hospitalizacion/FiliacionRecienNacido.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }


        public async Task<IActionResult> AdmisionHospitalizacion(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                DalUtilitario dlUtilitario = new DalUtilitario();

                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos4 = new List<SubclasificacionDiagnosticos>();

                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);
                TiposDiagnosticos4 = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.EmergenciaIngreso);


                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.TiposDiagnosticos4 = TiposDiagnosticos4;

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
                //ViewBag.Vista = (int)Enumerados.Grupo.Emergencia;
                ViewBag.IdTipoServicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalización";
                ViewBag.Modulo = "Admisión Hospitalización";
                return View("~/Views/Hospitalizacion/AdmisionHospitalizacion.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }



        public async Task<IActionResult> EvaluacionUCIN(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                // ROLES BD
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN 
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
                ViewBag.itemBar = (int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso;
                DalUtilitario dlUtilitario = new DalUtilitario();
                List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
                TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);


                DalEvaluacionUCIN dalucin = new DalEvaluacionUCIN();
                DataSet serviciosUcin = await dalucin.ListarServiciosUCIN();


                ViewBag.ServiciosUcin = serviciosUcin.Tables[0];


                ViewBag.TiposDiagnosticos = TiposDiagnosticos;
                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Hospitalizacion";
                ViewBag.idUsuario = idUsuario; // JDELGADO003-C

                ViewBag.idMedico = int.Parse(HttpContext.Session.GetString("idmed"));

                return View("AtencionUCIN");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }




        }

    }
}