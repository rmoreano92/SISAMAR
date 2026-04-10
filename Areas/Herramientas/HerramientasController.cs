using CapaDatos;
using CapaEntidades;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Application.Interfaces;
using WebAppMaternidad.Context.FactConfig.FuentesFinanciamiento.Domain;
using WebAppMaternidad.Context.General.DepartamentosHospital.Application.interfaces;
using WebAppMaternidad.Context.General.DepartamentosHospital.Domain;
using WebAppMaternidad.Context.General.Especialidades.Application;
using WebAppMaternidad.Context.General.Especialidades.Domain;
using WebAppMaternidad.Context.General.Servicios.Domain;
using WebAppMaternidad.Context.General.TiposServicio.Application.interfaces;
using WebAppMaternidad.Context.General.TiposServicio.Domain;

namespace WebAppMaternidad.Areas.Herramientas
{
    public class HerramientasController : Controller
    {
        private readonly ITipoServicioService _tiposServicioService;
        private readonly IDepartamentoHospitalService _departamentoHospitalService;
        private readonly IServicioRepository _servicioService;
        private readonly IEspecialidadService _especialidadService;
        private readonly IFuenteFinanciamientoService _fuenteFinanciamientoService;
        public HerramientasController(
            ITipoServicioService tiposServicioService,
            IDepartamentoHospitalService departamentoHospitalService,
            IServicioRepository servicioService,
            IEspecialidadService especialidadService,
            IFuenteFinanciamientoService fuenteFinanciamientoService)
        {
            _tiposServicioService = tiposServicioService;
            _departamentoHospitalService = departamentoHospitalService;
            _servicioService = servicioService;
            _especialidadService = especialidadService;
            _fuenteFinanciamientoService = fuenteFinanciamientoService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Utilidades()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();
            DataSet objRol = await dlEmpleado.DevuelveRolHerramientas(idUsuario);
            DataSet objReprogMed = await dlEmpleado.ValidarPermisoReprogMed(idUsuario);
            DataSet objReprogMedXPac = await dlEmpleado.ValidarPermisoReprogMedXPac(idUsuario);

            List<TipoServicio> lstTiposServicio = await _tiposServicioService.GetAllAsync();
            List<DepartamentoHospital> lstDepartamento = await _departamentoHospitalService.GetAllAsync();
            List<Especialidad> lstEspecialidades = await _especialidadService.GetAllAsync();
            List<Servicio> lstServicios = await _servicioService.GetAllAsync();
            List<FuenteFinanciamiento> lstFuentesFinanciamiento = await _fuenteFinanciamientoService.GetAllAsync();

            ViewBag.RolHerramientas = objRol;
            ViewBag.PermisoReprogMed = objReprogMed;
            ViewBag.PermisoReprogMedXPac = objReprogMedXPac;

            
            ViewBag.LstTiposServicio = lstTiposServicio;
            ViewBag.LstDepartamentos = lstDepartamento;
            ViewBag.LstEspecialidades = lstEspecialidades;
            ViewBag.LstServicios = lstServicios;
            ViewBag.LstFuentesFinanciamiento = lstFuentesFinanciamiento;

            ViewBag.idUsuario = idUsuario;

            if (objRol.Tables[0].Rows.Count == 0)
            {
                return View("AccesoDenegado");
            }
            

            ViewBag.Area = "Herramientas";
            ViewBag.Modulo = "Utilidades";
            ViewBag.Icono = "fa-screwdriver-wrench";
            
            return View("Utilidades");
            //return View("PatologiaClinica");
        }

    }
}
