using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CapaDatos;
using CapaEntidades;
using System.Data;
using Microsoft.AspNetCore.Http;

using System.IO;
using Microsoft.Extensions.Configuration;
using System.Net.Sockets;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Text.Json;
using SelectPdf;
using System.IO.Compression;
using System.Net.Mime;
//using Microsoft.AspNetCore.Http.Internal;
//using System.Security.Policy;
//using DocumentFormat.OpenXml.Drawing.Charts;
//using NPOI.SS.Formula.Eval;
////using NPOI.HPSF;
//using NPOI.SS.Formula.Functions;
using SiHospCrypKey;
using System.Drawing;
//using Microsoft.AspNetCore.Http.Internal;
//using NPOI.HPSF;
using System.Diagnostics;
using Aspose.Zip.SevenZip;
using iText.Html2pdf;
using iText.Kernel.Events;
using System.Net.Http;
using NPOI.SS.Formula.Functions;
using Microsoft.Win32;
using iText.Kernel.Colors;
using iText.Kernel.Pdf.Layer;
using iText.Kernel.Pdf;
using DocumentFormat.OpenXml.Spreadsheet;
using WebAppMaternidad.CapaDatos;
using iText.Layout.Borders;
using WebAppMaternidad.Services.Firma;
//using iText.Kernel.Geom;
//using iText.Layout;
//using iText.Kernel.Pdf;

namespace WebAppMaternidad.Areas.Comun
{
    public class UtilitarioController : Controller
    {
        private readonly IFirmaService _firmaService;

        //private IHostingEnvironment _hostingEnvironment;
        //private IWebHostEnvironment _hostingEnvironment;
        //public UtilitarioController(IWebHostEnvironment env)
        //{
        //    _hostingEnvironment = env;
        //}

        public IActionResult Index()
        {
            return View();
        }

        public UtilitarioController(IFirmaService firmaService = null)
        {
            _firmaService = firmaService ?? new FirmaService();
        }


        [HttpGet]
        public async Task<ActionResult> ListaTiposDocumentos() // JDELGADO001.2
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsDocumentos;
            DalUtilitario dalUtili = new DalUtilitario();
            lsDocumentos = await dalUtili.ListaTiposDocumentos();
            return Json(new { lsDocumentos = lsDocumentos, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> ListaTiposSexo()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsSexos;
            DalUtilitario dalUtili = new DalUtilitario();
            lsSexos = await dalUtili.ListaTiposSexo();
            return Json(new { lsSexos = lsSexos, estado = true, session = true });


        }

        [HttpPost]
        public ActionResult TiposGeneracionHistorias(int tipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsTiposGeneracion;
            DalUtilitario dalUtili = new DalUtilitario();
            lsTiposGeneracion = null;
            if (tipoServicio == (int)Enumerados.TiposServicio.Consultorios_Externos)
            {
                lsTiposGeneracion = dalUtili.SeleccionarDeConsultaExterna();
            }
            if (tipoServicio == (int)Enumerados.TiposServicio.Consultorios_Emergencia)
            {
                lsTiposGeneracion = dalUtili.SeleccionarDeEmergencia();
            }
            if (tipoServicio == (int)Enumerados.TiposServicio.Hospitalización)
            {
                lsTiposGeneracion = dalUtili.SeleccionarDeHospitalizacion();
            }

            return Json(new { lsSexos = lsTiposGeneracion, session = true });


        }

        [HttpGet]
        public async Task<ActionResult> ListaTiposEstadoCivilTodos() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsEstadoCivil;
            DalUtilitario dalUtili = new DalUtilitario();
            lsEstadoCivil = await dalUtili.TiposEstadoCivilTodos();
            return Json(new { lsEstadoCivil = lsEstadoCivil, session = true });

        }
        
        [HttpGet]
        public async Task<ActionResult> ListaTiposEstadoCivilTodosV2() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();
            

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.TiposEstadoCivilTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> TiposGradoInstruccionTodos() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsGradosIns;
            DalUtilitario dalUtili = new DalUtilitario();
            lsGradosIns = await dalUtili.TiposGradoInstruccionTodos();

            return Json(new { lsGradosIns = lsGradosIns, session = true });
        }
        
        [HttpGet]
        public async Task<ActionResult> TiposGradoInstruccionTodosV2() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.TiposGradoInstruccionTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        

        [HttpGet]
        public async Task<ActionResult> TiposProcedenciaTodos() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsTProcedencias;
            DalUtilitario dalUtili = new DalUtilitario();
            lsTProcedencias = await dalUtili.TiposProcedenciaTodos();

            return Json(new { lsTProcedencias = lsTProcedencias, session = true });


        }

        [HttpGet]
        public async Task<ActionResult> TiposOcupacionTodos() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsOcupacion;
            DalUtilitario dalUtili = new DalUtilitario();
            lsOcupacion = await dalUtili.TiposOcupacionTodos();

            return Json(new { lsOcupacion = lsOcupacion, session = true });
        }
        [HttpGet]
        public async Task<ActionResult> TiposIdiomasSeleccionarTodos() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsIdiomas;
            DalUtilitario dalUtili = new DalUtilitario();
            lsIdiomas = await dalUtili.TiposIdiomasSeleccionarTodos();

            return Json(new { lsIdiomas = lsIdiomas, session = true });


        }

        [HttpGet]
        public async Task<ActionResult> TiposEtnia()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsEtnia;
            DalUtilitario dalUtili = new DalUtilitario();
            lsEtnia = await dalUtili.TiposEtnia();

            return Json(new { lsEtnia = lsEtnia, session = true });


        }

        [HttpGet]
        public async Task<ActionResult> TiposReligion() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsReligion;
            DalUtilitario dalUtili = new DalUtilitario();
            lsReligion = await dalUtili.TiposReligion();

            return Json(new { lsReligion = lsReligion, session = true });


        }


        [HttpGet]
        public async Task<ActionResult> ListaDepartamentos() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsDeparta;
            DalUtilitario dalUtili = new DalUtilitario();
            lsDeparta = await dalUtili.ListaDepartamentos();

            return Json(new { lsDeparta = lsDeparta, estado = true, session = true });


        }

        [HttpPost]
        public async Task<ActionResult> ListaDepartamentosSeleccionarPorIdPais(int IdPais) // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsDeparta;
            DalUtilitario dalUtili = new DalUtilitario();
            lsDeparta = await dalUtili.ListaDepartamentosSeleccionarPorIdPais(IdPais);
            Console.WriteLine(lsDeparta);
            return Json(new { lsDeparta = lsDeparta, session = true, estado = true });


        }

        [HttpPost]
        public async Task<ActionResult> ListaProvinciasByDepartamentos(int idDepartamento) // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsProvincias;
            DalUtilitario dalUtili = new DalUtilitario();
            lsProvincias = await dalUtili.ListaProvinciasByDepartamentos(idDepartamento);

            return Json(new { lsProvincias = lsProvincias, session = true, estado = true });


        }
        [HttpPost]
        public async Task<ActionResult> ListaDistritosByProvincia(int idDProvincia) // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsDistrito;
            DalUtilitario dalUtili = new DalUtilitario();
            lsDistrito = await dalUtili.ListaDistritosByProvincia(idDProvincia);

            return Json(new { lsDistrito = lsDistrito, session = true, estado = true });


        }

        [HttpPost]
        public async Task<ActionResult> ListaCentroPobladoByDistrito(int idDistrito) // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsCentroPoblado;
            DalUtilitario dalUtili = new DalUtilitario();
            lsCentroPoblado = await dalUtili.ListaCentroPobladoByDistrito(idDistrito);

            return Json(new { lsCentroPoblado = lsCentroPoblado, session = true, estado = true });


        }

        [HttpGet]
        public async Task<ActionResult> ListaPaises()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.ListaPaises();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        /// <summary>
        /// //KHOYOSI
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> ListarTiposGravedadAtencion()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsTiposGravedad;
            DalUtilitario dalUtili = new DalUtilitario();
            lsTiposGravedad = await dalUtili.ListarTiposGravedadAtencion();

            return Json(new { lsTiposGravedad = lsTiposGravedad, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposServiciosMGP()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsTiposServiciosMGP;
            DalUtilitario dalUtili = new DalUtilitario();
            lsTiposServiciosMGP = await dalUtili.ListarServiciosMGP();

            return Json(new { lsTiposServiciosMGP = lsTiposServiciosMGP, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarOrigenAtencionEmergencia()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsOrigenAtencionEmer;
            DalUtilitario dalUtili = new DalUtilitario();
            lsOrigenAtencionEmer = await dalUtili.ListarOrigenAtencionEmergencia();

            return Json(new { lsOrigenAtencionEmer = lsOrigenAtencionEmer, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarOrigenAtencionHospitalizacion(int idTipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsOrigenAtencionHosp;
            DalUtilitario dalUtili = new DalUtilitario();
            lsOrigenAtencionHosp = await dalUtili.ListarOrigenAtencionHospitalizacion(idTipoServicio);

            return Json(new { lsOrigenAtencionHosp = lsOrigenAtencionHosp, session = true });
        }

        //////////////////////KHOYOSI////////////////////////////                
        [HttpGet]
        public ActionResult EstablecimientosSeleccionarTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsEstab;
            DalUtilitario dalUtili = new DalUtilitario();
            lsEstab = dalUtili.ListaEstablecimientosSaludTodos();

            return Json(new { lsEstab = lsEstab, session = true });
        }

        [HttpPost]
        public ActionResult EstablecimientosFiltrar(string filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsEstablecimientos;
            DalUtilitario dalUtili = new DalUtilitario();
            lsEstablecimientos = dalUtili.EstablecimientosFiltrar(filtro);
            return Json(new { lsEstablecimientos = lsEstablecimientos, session = true, estado = true, data = lsEstablecimientos });
        }

        [HttpPost]
        public ActionResult EstablecimientosNoMinsaFiltrar(string filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsEstablecimientos;
            DalUtilitario dalUtili = new DalUtilitario();
            lsEstablecimientos = dalUtili.EstablecimientosNoMinsaFiltrar(filtro);
            return Json(new { lsEstablecimientos = lsEstablecimientos, session = true });
        }

        [HttpGet]
        public ActionResult UPServiciosSeleccionarTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsUps;
            DalUtilitario dalUtili = new DalUtilitario();
            lsUps = dalUtili.UPServiciosSeleccionarTodos();

            return Json(new { lsUps = lsUps, session = true });
        }

        [HttpGet]
        public ActionResult CondicionUsuarioReferenciaSeleccionarTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsCondUsu;
            DalUtilitario dalUtili = new DalUtilitario();
            lsCondUsu = dalUtili.CondicionUsuarioReferenciaSeleccionarTodos();

            return Json(new { lsCondUsu = lsCondUsu, session = true });
        }
        //////////////////////KHOYOSI////////////////////////////
        ///

        

        [HttpGet]
        public async Task<ActionResult> listarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.listarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.TiposOrigenAtencionSeleccionarViasDeConsultoriosEmergencia();

            return Json(new { dataSet, estado = true, session = true });
        }
        [HttpGet]
        public async Task<ActionResult> TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.TiposOrigenAtencionSeleccionarViasDeObservacionEmergencia();

            return Json(new { dataSet, estado = true, session = true });
        }
        [HttpGet]
        public async Task<ActionResult> TiposOrigenAtencionSeleccionarViasDeHospitalizacion(int TipoServicioHosp) // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.TiposOrigenAtencionSeleccionarViasDeHospitalizacion(TipoServicioHosp);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> web_selectIdDepartamentoIdProvinciaByIdDistritoV2(int idDistrito) // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.web_selectIdDepartamentoIdProvinciaByIdDistrito(idDistrito);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> web_selectIdDepartamentoIdProvinciaByIdDistrito(int idDistrito) // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.web_selectIdDepartamentoIdProvinciaByIdDistrito(idDistrito);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosXidTipoFinanciamiento(int idProducto, int idTipoFinanciamiento) // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.FactCatalogoServiciosXidTipoFinanciamiento(idProducto, idTipoFinanciamiento);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaEstablecimientosByCodigo(string codigo) // JDELGADO010
        {
            DataSet dataSet = null;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListaEstablecimientosByCodigo(codigo);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
                

        [HttpPost]
        public async Task<ActionResult> ListarMedicos() // JDELGADO010
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarMedicos();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicosResponsableReferencia() // KHOYOSI
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarMedicosResponsableReferencias();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarProfesionalesDeLaSalud() // KHOYOSI
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarProfesionalesDeLaSalud();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> TipoPacienteEnEspecialidad(int idPaciente, int idEspecialidad) // JDELGADO010
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.TipoPacienteEnEspecialidad(idPaciente, idEspecialidad);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> TipoPacienteEnEspecialidadEmergencia(int idPaciente, int idEspecialidad) // JDELGADO010
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.TipoPacienteEnEspecialidadEmergencia(idPaciente, idEspecialidad);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EstanciaHospitalariaSeleccionarPorAtencion(int idAtencion, int secuenciaMayorA)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsTransferencias;
            DalUtilitario dalUtili = new DalUtilitario();
            lsTransferencias = await dalUtili.EstanciaHospitalariaSeleccionarPorAtencion(idAtencion, secuenciaMayorA);

            return Json(new { lsTransferencias = lsTransferencias, session = true });
        }

        ////////////////////////////// KHOYOSI//////////////////////////////////
        [HttpPost]
        public int ObtenerIdMedicoLogeado()
        {
            int idMedico = 0;

            idMedico = int.Parse(HttpContext.Session.GetString("idmed"));

            return idMedico;
        }

        [HttpPost]
        public int ObtenerIdUsuarioLogeado()
        {
            int idUsuario = 0;

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            return idUsuario;
        }

        [HttpPost]
        public async Task<ActionResult> ObtenerUsuarioLogeado()
        {            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = 0;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DataSet resp;
            DalUtilitario dalUtili = new DalUtilitario();
            resp = await dalUtili.ObtenerUsuarioLogeado(idUsuario);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicosPorFiltro(int idEspecialidad)
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();
            string filtro = "";

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            filtro = " where  MedicosEspecialidad.IdEspecialidad = " + idEspecialidad + "  order by Empleados.ApellidoPaterno, Empleados.ApellidoMaterno, Empleados.Nombres";
            dataSet = await dalUtilitario.ListarMedicosPorFiltro(filtro);

            return Json(new { lsResultado = dataSet, session = true });
        }
        /////////////////////////////////////////////////////////////////////
        ///


        /// JDELGADO011
        [HttpGet]
        public async Task<ActionResult> ListarEspecialidades()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();
            dataSet = await dalUtili.ListarEspecialidades();
            return Json(new { dataSet = dataSet, session = true });
        }
        [HttpGet]
        public async Task<ActionResult> ListarTiposConsulta()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();
            dataSet = await dalUtili.ListarTiposConsulta();
            return Json(new { dataSet = dataSet, session = true });
        }
        /// JDELGADO011
        /// 

        //////////////////KHOYOSI/////////////////////////////
        [HttpPost]
        public async Task<ActionResult> SeleccionaPermisoGeneral(string tipo)
        {
            string resp = "0";
            DalParametros daoParametro = new DalParametros();


            
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            resp = await daoParametro.SeleccionaPermisoGeneral(tipo);

            return Json(new { respuesta = resp, session = true });
        }
        
        [HttpPost]
        public async Task<ActionResult> SeleccionarFirmaDigital(int idCuenta, int idRegistro, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();
            dataSet = await dalUtili.ListaFirmaByIdCuentaByIdegistroByTipo(idCuenta, idRegistro, tipo);
            return Json(new { respuesta = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarFirmaDigitalV2(string code)
        {
 
            if (HttpContext.User.Identity.IsAuthenticated == false)
             {
              return Json(new { session = false });
             }
             DataSet dataSet;
             DalUtilitario dalUtili = new DalUtilitario();
             int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
             dataSet = await dalUtili.FirmaDigitalSeleccionarPorCode(code);            
             return Json(new { respuesta = dataSet, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarFirmaDigitalPorGrupo(int idRegistro, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = await dalUtili.FirmaDigitalSeleccionarPorGrupo(idRegistro, tipo);            
            return Json(new { respuesta = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GenerarGrupoDocumentosPdf(int idRegistro, string tipo)
        {
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();
            FormatoPdf pdf = new FormatoPdf();
            MemoryStream resultStream = new MemoryStream();
            MemoryStream ms = new MemoryStream();
            UtilitarioController utilitario = new UtilitarioController();
            StringBuilder stringHtml = new StringBuilder();
            //string pageHtml;
            string respuesta = "Error al registrar la generación de constancia.";

            string usuario = HttpContext.Session.GetString("user");

            try
            {
                dataSet = await dalUtili.FirmaDigitalSeleccionarPorGrupo(idRegistro, tipo);
                resultStream = await UnirDocumentosPdf(dataSet);

                byte[] pdfBytes = resultStream.ToArray();
                ms.Write(pdfBytes, 0, pdfBytes.Length);
                ms.Position = 0;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                return Json(new { exep = ex.ToString() });
            }
            //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

        [HttpPost]
        public async Task<ActionResult> ValidarUsuarioFirmaDigital(string code)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = await dalUtili.FirmaDigitalSeleccionarPorCodePorUsuario(code, idUsuario);
            return Json(new { respuesta = dataSet, session = true });
        }
        ////////////////////////////////////////////////////////////////////



        [HttpPost]
        public async Task<ActionResult> FirmaComponent(List<IFormFile> attach, string documentID) // JDELGADO013
        {
            DalUtilitario dl = new DalUtilitario();
            Conexion cn = new Conexion();

            long size = attach.Sum(f => f.Length);
            var filePaths = new List<string>();
            string rutaDocumento = "";
            string idCuentaAtencion = "";
            string idRegistro = "";
            string tipo = "";
            string code = "";
            string controller = "";
            string metodo = "";
            string idUsuario = "";
            string statusFirma = "";

            if (documentID != null)
            {
                rutaDocumento = documentID.Split(',')[0];
                idCuentaAtencion = documentID.Split(',')[1];
                idRegistro = documentID.Split(',')[2];
                tipo = documentID.Split(',')[3];
                code = documentID.Split(',')[4];
                controller = documentID.Split(',')[5];
                metodo = documentID.Split(',')[6];
                idUsuario = documentID.Split(',')[7];
                statusFirma = documentID.Split(',')[8];
            }

            foreach (var formFile in attach)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        if(Int32.Parse(statusFirma) == 0)
                        {
                            rutaDocumento = rutaDocumento.Replace("/UNSIGNED/", "");
                        }
                        else
                        {
                            rutaDocumento = rutaDocumento.Replace("/SIGNED/", "");
                        }
                        

                        //tring ruta = "C:/SisgalenFiles/4IdentitySignedFiles" + rutaDocumento;
                        string ruta = cn.ObtenerServidorArchivosConFirma() + rutaDocumento;
                        string directorio = ruta.Substring(0, ruta.LastIndexOf("/"));
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        // full path to file in temp location
                        //var filePath = "C:\\SisgalenFiles\\4IdentitySignedFiles\\" + rutaDocumento; //we are using Temp file name just for the example. Add your own file path.
                        var filePath = cn.ObtenerServidorArchivosConFirma() + rutaDocumento; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                            //var rsFirma = await dl.InsertaFirmaDigital(code);
                            var rsFirma = await dl.EstadoFirmaDigitalAutoriza(code,Int32.Parse(idUsuario));
                        }
                    } 
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                }
            }

            //return Json(new { respuesta = "Termino de firmar", session = true });
            //Url.Action("AtencionMedica", "ConsultaExterna", new { area = "ConsultaExterna" }, "http");
            //RedirectToAction("AtencionMedica", "ConsultaExterna");
            return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        }

        [HttpPost]
        public async Task<ActionResult> FirmaMultipleComponent(IList<IFormFile> attach, string documentID) // JDELGADO013
        {
            Conexion con = new Conexion();
            DalUtilitario dalUtil = new DalUtilitario();

            DataSet dataSet;
            long size = attach.Sum(f => f.Length);
            var filePaths = new List<string>();
            //string rutaDocumento = "";
            //string idCuentaAtencion = "";
            //string idRegistro = "";
            //string tipo = "";
            string controller = "Utilitario";
            string metodo = "FinFirmaDigitalBitFourId";
            string ruta = "";
            //bool estado = false;
            //bool fileAnt = false;
            string paquete = "";
            string idUsuario = "";

            if (documentID != null)
            {
                paquete = documentID.Split(',')[0];                                
                idUsuario = documentID.Split(',')[1];
                //statusFirma = documentID.Split(',')[2];
            }

            foreach (var formFile in attach)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        // full path to file in temp location
                        //var filePath = "C:\\SisgalenFiles\\temp\\" + paquete + "\\signed\\temp-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
                        var filePath = con.ObtenerServidorArchivos() + "temp\\" + paquete + "\\signed\\temp-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                        }

                        //string sWebRootFolder = con.ObtenerServidorArchivos();
                        string sWebRootFolder = con.ObtenerServidorArchivosConFirma();
                        string pathExtract = con.ObtenerServidorArchivos() + "temp\\" + paquete + "\\signed\\temp";
                        ZipFile.ExtractToDirectory(filePath, pathExtract);


                        // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada
                        DirectoryInfo di = new DirectoryInfo(pathExtract);

                        foreach (var fi in di.GetFiles())
                        {
                            dataSet = await dalUtil.SeleccionarFirmaDigitalPorNombreArchivo(fi.Name);
                            //ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles" + dataSet.Tables[0].Rows[0]["pathArchivo"].ToString());
                            string pathArchivo = dataSet.Tables[0].Rows[0]["pathArchivo"].ToString();
                            pathArchivo = pathArchivo.Replace("/UNSIGNED/", "");
                            ruta = Path.Combine(sWebRootFolder, pathArchivo);

                            if (!Directory.Exists(ruta))
                            {
                                Directory.CreateDirectory(ruta);
                            }

                            if (System.IO.File.Exists(fi.FullName))
                            {
                                System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fi.Name}"), true);
                            }

                            //await dalUtil.EstadoFirmaModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), 1);
                            await dalUtil.EstadoFirmaEmpleadoModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), Int32.Parse(idUsuario), 1);
                        }

                        string resp = await dalUtil.PaqueteArchivoModificar(paquete, "", Int32.Parse(idUsuario), 0);
                        if (resp != "" || resp != null)
                        {
                            Directory.Delete(con.ObtenerServidorArchivos() + "temp\\" + documentID, true);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                }
                //estado = true                
            }

            //var variableaeliminar = "ahora";
            return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        }

        public async Task<MemoryStream> UnirDocumentosPdf(DataSet dsFirmas) 
        {

            DalUtilitario dalUtilitario = new DalUtilitario();

            //DataSet dsFirmas = await dalUtilitario.ListarFirmasByIdCuentaAtencion(IdCuentaAtencion);
            // Nombres de los archivos PDF de entrada
            string[] archivosEntrada = { };

            foreach (DataRow dr in dsFirmas.Tables[0].Rows)
            {

                int nuevoTamanio = archivosEntrada.Length + 1; // Nuevo tamaño del arreglo
                Array.Resize(ref archivosEntrada, nuevoTamanio);
                archivosEntrada[nuevoTamanio - 1] = dr["rutaArchivo"].ToString();


            };

            MemoryStream outputStream = new MemoryStream();

            // Nombre del archivo PDF de salida combinado
            //string archivoSalida = "C:/SisgalenFiles/funciono.pdf";

            try
            {
                var appSetting = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES");
                string serverFiles = appSetting.ToString();
                string archivoDoc = "";

                iText.Kernel.Pdf.PdfWriter writer = new iText.Kernel.Pdf.PdfWriter(outputStream);

                // Crear un nuevo documento PDF de salida
                iText.Kernel.Pdf.PdfDocument documentoSalida = new iText.Kernel.Pdf.PdfDocument(new PdfWriter(writer));

                foreach (string archivo in archivosEntrada)
                {
                    archivoDoc = serverFiles + archivo;
                    if (System.IO.File.Exists(archivoDoc))
                    {                        
                        iText.Kernel.Pdf.PdfDocument documentoEntrada = new iText.Kernel.Pdf.PdfDocument(new PdfReader(archivoDoc));

                        // Copiar todas las páginas del documento de entrada al documento de salida
                        for (int pagina = 1; pagina <= documentoEntrada.GetNumberOfPages(); pagina++)
                        {
                            iText.Kernel.Pdf.PdfPage page = documentoEntrada.GetPage(pagina);
                            documentoSalida.AddPage(page.CopyTo(documentoSalida));
                        }

                        documentoEntrada.Close();
                    }

                }

                documentoSalida.Close();

            }
            catch (Exception)
            {
                throw;
            }

            return outputStream;

        }



        //[HttpPost]
        //public async Task<ActionResult> FirmaMultipleComponentV2(List<IFormFile> attach, string documentID) // JDELGADO013
        //{
        //    Conexion con = new Conexion();
        //    DalUtilitario dl = new DalUtilitario();
        //    DalAtenciones dalAtenciones = new DalAtenciones();

        //    DataSet dataSet;
        //    long size = attach.Sum(f => f.Length);
        //    var filePaths = new List<string>();
        //    string rutaDocumento = "";
        //    string idCuentaAtencion = "";
        //    string idRegistro = "";
        //    string tipo = "";
        //    string controller = "Utilitario";
        //    string metodo = "FinFirmaDigitalBitFourId";
        //    string ruta = "";
        //    // Para la firma el documentID solo recibe el numero de cuenta
        //    //if (documentID != null)
        //    //{
        //    //    rutaDocumento = documentID.Split(',')[0];
        //    //    idCuentaAtencion = documentID.Split(',')[1];
        //    //    idRegistro = documentID.Split(',')[2];
        //    //    tipo = documentID.Split(',')[3];
        //    //    controller = documentID.Split(',')[4];
        //    //    metodo = documentID.Split(',')[5];
        //    //}

        //    //GuardarArchivo("carpeta/quenoexiste", "archivo.pdf");

        //    foreach (var formFile in attach)
        //    {
        //        if (formFile.Length > 0)
        //        {
        //            try
        //            {                        
        //                // full path to file in temp location
        //                var filePath = "C:\\SisgalenFiles\\4IdentitySignedFiles\\PaqueteSinFirma\\" + documentID + "-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
        //                filePaths.Add(filePath);

        //                using (var stream = new FileStream(filePath, FileMode.Create))
        //                {
        //                    await formFile.CopyToAsync(stream);

        //                    //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
        //                }


        //                string sWebRootFolder = con.ObtenerServidorArchivos();
        //                ZipFile.ExtractToDirectory($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + documentID + "-signed.zip", Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma/{documentID.ToString()}-signed"));


        //                // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada
        //                DirectoryInfo di = new DirectoryInfo(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma/{documentID.ToString()}-signed"));

        //                foreach (var fi in di.GetFiles())
        //                {
        //                    dataSet = await dl.SeleccionarFirmaDigitalPorNombreArchivo(fi.Name);
        //                    ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles" + dataSet.Tables[0].Rows[0]["pathArchivo"].ToString());

        //                    if (!Directory.Exists(ruta))
        //                    {
        //                        Directory.CreateDirectory(ruta);
        //                    }

        //                    if (System.IO.File.Exists(fi.FullName))
        //                    {
        //                        System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fi.Name}"), true);
        //                    }

        //                    await dl.EstadoFirmaModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), 1);

        //                    //string[] arrayIdCuenta = documentID.Split('-');

        //                    //foreach (string idCuenta in arrayIdCuenta)
        //                    //{
        //                    //    dataSet = await dalAtenciones.ListaAtencionByIdCuentaAtencion(Int32.Parse(idCuenta));
        //                    //    string nroHistoria = dataSet.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
        //                    //    string ruta = "";
        //                    //    Console.WriteLine(fi.Name);

        //                    //    if (fi.Name.Contains("CE-A") && fi.Name.Contains(idCuenta))
        //                    //    {
        //                    //        ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/Atenciones");
        //                    //    }
        //                    //    else if (fi.Name.Contains("REC") && fi.Name.Contains(idCuenta))
        //                    //    {
        //                    //        ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/Recetas");
        //                    //    }
        //                    //    else if (fi.Name.Contains("FUA") && fi.Name.Contains(idCuenta))
        //                    //    {
        //                    //        ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/FUA");
        //                    //    }
        //                    //    else if (fi.Name.Contains("RF") && fi.Name.Contains(idCuenta))
        //                    //    {
        //                    //        ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/HojasRefCon");
        //                    //    }

        //                    //    if (ruta != "")
        //                    //    {
        //                    //        if (!Directory.Exists(ruta))
        //                    //        {
        //                    //            Directory.CreateDirectory(ruta);
        //                    //        }

        //                    //        if (System.IO.File.Exists(fi.FullName))
        //                    //        {
        //                    //            System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fi.Name}"), true);
        //                    //        }

        //                    //        dataSet = await dl.SeleccionarDocumentosFirmaByIdCuentaAndIdEmpleado(Int32.Parse(idCuenta), 0);
        //                    //        //dataSet = await dl.SeleccionarDocumentosFirmaDigitalByIdCuentaAndIdEmpleado(Int32.Parse(idCuenta), idUsuario, 0);

        //                    //        foreach (DataRow firma in dataSet.Tables[0].Rows)
        //                    //        {
        //                    //            var code = firma["code"];
        //                    //            var rutaArchivo = firma["rutaArchivo"];

        //                    //            string[] arrayRuta = rutaArchivo.ToString().Split('/');

        //                    //            string nombreArchivo = arrayRuta[arrayRuta.Length - 1].ToString();

        //                    //            if (fi.Name == nombreArchivo)
        //                    //            {
        //                    //                await dl.EstadoFirmaModificar(Int32.Parse(firma["id"].ToString()), firma["code"].ToString(), 1);
        //                    //                break;
        //                    //            }
        //                    //            Console.WriteLine(firma["code"]);
        //                    //        }
        //                    //    }


        //                    //}
        //                }

        //                var seactualizara = await dl.ModificarEstadoFirmaPaquete(documentID + ".zip", 2);
        //                //if (Directory.Exists(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{documentID}")))
        //                //{
        //                //    PdfDocument obPdfDoc = ohtml.ConvertUrl(url);
        //                //    obPdfDoc.Save(path);

        //                //    Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idRegistro);
        //                //    resultFirma = await Tbol;

        //                //}
        //                //else
        //                //{
        //                //    Directory.CreateDirectory(Path.Combine(sWebRootFolder, filePath));

        //                //    PdfDocument obPdfDoc = ohtml.ConvertUrl(url);
        //                //    obPdfDoc.Save(path);

        //                //    Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idCuentaAtencion);
        //                //    resultFirma = await Tbol;
        //                //    //Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()), tipo, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()));
        //                //}


        //                //if (System.IO.File.Exists(ruta.ToString()))
        //                //{
        //                //    System.IO.File.Copy(ruta.ToString(), Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString() + "/" + arregloRuta[arregloRuta.Length - 1].ToString()), true);
        //                //}
        //                // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada

        //            }
        //            catch (Exception e)
        //            {
        //                Console.WriteLine(e);
        //            }

        //        }
        //    }

        //    //return Json(new { respuesta = "Termino de firmar", session = true });
        //    //Url.Action("AtencionMedica", "ConsultaExterna", new { area = "ConsultaExterna" }, "http");
        //    //RedirectToAction("AtencionMedica", "ConsultaExterna");
        //    var variableaeliminar = "ahora";
        //    return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        //}

        //[HttpPost]
        //public async Task<ActionResult> FirmaMultipleComponent(List<IFormFile> attach, string documentID) // JDELGADO013
        //{
        //    Conexion con = new Conexion();
        //    DalUtilitario dl = new DalUtilitario();
        //    DalAtenciones dalAtenciones = new DalAtenciones();

        //    DataSet dataSet;
        //    long size = attach.Sum(f => f.Length);
        //    var filePaths = new List<string>();
        //    string rutaDocumento = "";
        //    string idCuentaAtencion = "";
        //    string idRegistro = "";
        //    string tipo = "";
        //    string controller = "Utilitario";
        //    string metodo = "FinFirmaDigitalBitFourId";
        //    //int idUsuario = 0;

        //    // Para la firma el documentID solo recibe el numero de cuenta
        //    //if (documentID != null)
        //    //{
        //    //    rutaDocumento = documentID.Split(',')[0];
        //    //    idCuentaAtencion = documentID.Split(',')[1];
        //    //    idRegistro = documentID.Split(',')[2];
        //    //    tipo = documentID.Split(',')[3];
        //    //    controller = documentID.Split(',')[4];
        //    //    metodo = documentID.Split(',')[5];
        //    //}

        //    //GuardarArchivo("carpeta/quenoexiste", "archivo.pdf");

        //    foreach (var formFile in attach)
        //    {
        //        if (formFile.Length > 0)
        //        {
        //            try
        //            {
        //                //idUsuario = ObtenerIdUsuarioLogeado();
        //                // full path to file in temp location
        //                var filePath = "C:\\SisgalenFiles\\4IdentitySignedFiles\\PaqueteSinFirma\\" + documentID + "-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
        //                filePaths.Add(filePath);

        //                using (var stream = new FileStream(filePath, FileMode.Create))
        //                {
        //                    await formFile.CopyToAsync(stream);

        //                    //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
        //                }


        //                string sWebRootFolder = con.ObtenerServidorArchivos();
        //                ZipFile.ExtractToDirectory($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + documentID + "-signed.zip", Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma/{documentID.ToString()}-signed"));


        //                // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada
        //                DirectoryInfo di = new DirectoryInfo(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma/{documentID.ToString()}-signed"));

        //                foreach (var fi in di.GetFiles())
        //                {
        //                    string[] arrayIdCuenta = documentID.Split('-');

        //                    foreach(string idCuenta in arrayIdCuenta)
        //                    {
        //                        dataSet = await dalAtenciones.ListaAtencionByIdCuentaAtencion(Int32.Parse(idCuenta));
        //                        string nroHistoria = dataSet.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
        //                        string ruta = "";
        //                        Console.WriteLine(fi.Name);

        //                        if (fi.Name.Contains("CE-A") && fi.Name.Contains(idCuenta))
        //                        {
        //                            ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/Atenciones");
        //                        }
        //                        else if (fi.Name.Contains("REC") && fi.Name.Contains(idCuenta))
        //                        {
        //                            ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/Recetas");
        //                        }
        //                        else if (fi.Name.Contains("FUA") && fi.Name.Contains(idCuenta))
        //                        {
        //                            ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/FUA");
        //                        }
        //                        else if (fi.Name.Contains("RF") && fi.Name.Contains(idCuenta))
        //                        {
        //                            ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{nroHistoria}/ConsultaExterna/{idCuenta}/HojasRefCon");
        //                        }

        //                        if(ruta != "")
        //                        {
        //                            if (!Directory.Exists(ruta))
        //                            {
        //                                Directory.CreateDirectory(ruta);
        //                            }

        //                            if (System.IO.File.Exists(fi.FullName))
        //                            {
        //                                System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fi.Name}"), true);
        //                            }

        //                            dataSet = await dl.SeleccionarDocumentosFirmaByIdCuentaAndIdEmpleado(Int32.Parse(idCuenta), 0);
        //                            //dataSet = await dl.SeleccionarDocumentosFirmaDigitalByIdCuentaAndIdEmpleado(Int32.Parse(idCuenta), idUsuario, 0);

        //                            foreach (DataRow firma in dataSet.Tables[0].Rows)
        //                            {
        //                                var code = firma["code"];
        //                                var rutaArchivo = firma["rutaArchivo"];

        //                                string[] arrayRuta = rutaArchivo.ToString().Split('/');

        //                                string nombreArchivo = arrayRuta[arrayRuta.Length - 1].ToString();

        //                                if (fi.Name == nombreArchivo)
        //                                {
        //                                    await dl.EstadoFirmaModificar(Int32.Parse(firma["id"].ToString()), firma["code"].ToString(), 1);
        //                                    break;
        //                                }
        //                                Console.WriteLine(firma["code"]);
        //                            }
        //                        }


        //                    }
        //                }

        //                var seactualizara = await dl.ModificarEstadoFirmaPaquete(documentID + ".zip", 2);
        //                //if (Directory.Exists(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/{documentID}")))
        //                //{
        //                //    PdfDocument obPdfDoc = ohtml.ConvertUrl(url);
        //                //    obPdfDoc.Save(path);

        //                //    Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idRegistro);
        //                //    resultFirma = await Tbol;

        //                //}
        //                //else
        //                //{
        //                //    Directory.CreateDirectory(Path.Combine(sWebRootFolder, filePath));

        //                //    PdfDocument obPdfDoc = ohtml.ConvertUrl(url);
        //                //    obPdfDoc.Save(path);

        //                //    Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idCuentaAtencion);
        //                //    resultFirma = await Tbol;
        //                //    //Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()), tipo, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()));
        //                //}


        //                //if (System.IO.File.Exists(ruta.ToString()))
        //                //{
        //                //    System.IO.File.Copy(ruta.ToString(), Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString() + "/" + arregloRuta[arregloRuta.Length - 1].ToString()), true);
        //                //}
        //                // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada

        //            }
        //            catch (Exception e)
        //            {
        //                Console.WriteLine(e);
        //            }

        //        }
        //    }

        //    //return Json(new { respuesta = "Termino de firmar", session = true });
        //    //Url.Action("AtencionMedica", "ConsultaExterna", new { area = "ConsultaExterna" }, "http");
        //    //RedirectToAction("AtencionMedica", "ConsultaExterna");
        //    var variableaeliminar  = "ahora";
        //    return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        //}



        [HttpPost]
        public async Task<ActionResult> SeleccionaParametros(int idParametro)
        {
            DataSet dataSet;
            DalParametros daoParametro = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await Task.Run(() => daoParametro.SeleccionaFilaParametro(idParametro));

            return Json(new { dataSet, estado = true, session = true });
        }

        //////////////////////KHOYOSI////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarServicioPorTipoServicio(int IdTipoServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalUtilitario dalUtili = new DalUtilitario();
            dataSet = await dalUtili.ListarServicioPorTipoServicio(IdTipoServicio);
            return Json(new { respuesta = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> CargarModuloAlta()
        {
            //if (HttpContext.User.Identity.IsAuthenticated == false)
            //{
            //    return View("Login");
            //}

            DalUtilitario dlUtilitario = new DalUtilitario();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
            TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionEgreso);
            ViewBag.TiposDiagnosticos = TiposDiagnosticos;

            TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionNacimiento);
            ViewBag.TiposDiagnosticos2 = TiposDiagnosticos;

            TiposDiagnosticos = await dlUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.HospitalizacionMortalidad);
            ViewBag.TiposDiagnosticos3 = TiposDiagnosticos;

            return PartialView("~/Views/Shared/Components/VistasParciales/AltaMedica.cshtml");
        }
        ////////////////////////////////////////////////////////////////////////////

        [HttpPost]
        public async Task<ActionResult> ServiciosSeleccionarCEPorEspecialidad(int idEspecialidad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.ServiciosSeleccionarCEPorEspecialidad(idEspecialidad);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
            
        }

        [HttpPost]
        //public async Task<String> AppSetting(string tipo)
        public String AppSetting(string tipo)
        {
            string valor = "";

            var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("Configuraciones")[tipo];
            valor = AppName.ToString();

            return valor;
        }

        [HttpPost]
        public async Task<ActionResult> ValidarPermisoEmpleado(int idPermiso)
        {
            DataSet dataSet = null;
            DalUtilitario daoUtilitario = new DalUtilitario();
            int idUsuario = 0;
            bool resp = false;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            dataSet = await daoUtilitario.ValidarPermisoEmpleado(idUsuario, idPermiso);

            if (dataSet.Tables[0].Rows.Count > 0)
            {
                resp = true;
            }

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ValidarPermisoUsuario(string clave)
        {
            DalUtilitario daoUtilitario = new DalUtilitario();
            int idUsuario = 0;
            //bool resp = false;
            int resp = 0;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            resp = await daoUtilitario.ValidarPermisoUsuario(idUsuario, clave);
                        
            return Json(new { respuesta = resp, session = true });
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////KHOYOSI (FIRMA DIGITAL FIRMA PERU)////////////////////////////////////
        [HttpGet]        
        public async Task<IActionResult> FirmaDigitalFirmaPeru(string server, string code)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                               
                DataSet DatosFirma;
                DalUtilitario dalUtili = new DalUtilitario();

                DatosFirma = await dalUtili.FirmaDigitalSeleccionarPorCode(code);
                string rutaArchivoFirma = DatosFirma.Tables[0].Rows[0]["rutaArchivo"].ToString();
                string rutaFile = server + rutaArchivoFirma;
                string rutaLogo = server + "/resources/logosFirma/isotipo.png";
                string rutaFileOriginal = rutaFile;
                string rutaLogoOriginal = rutaLogo;
                
                code = DecodificarDeUrl(code);
                ViewBag.CodigoFirma = code;
                ViewBag.UrlInvoker = _firmaService.ObtenerInvokerUrl();
                ViewBag.PdfsJson = JsonSerializer.Serialize(new[] { new { url = rutaFileOriginal, name = "doc1" } });
                ViewBag.FirmaParamJson = JsonSerializer.Serialize(new
                {
                    posx = 10,
                    posy = 12,
                    reason = "Soy el autor del documento pdf",
                    role = "Usuario",
                    stampSigned = rutaLogoOriginal,
                    pageNumber = 1,
                    visiblePosition = false,
                    oneByOne = false,
                    signatureStyle = 1,
                    stampTextSize = 14,
                    stampWordWrap = 37
                });
                
                return View("~/Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        [HttpGet]        
        public async Task<IActionResult> FirmaDigitalFirmaPeruMultiple(string server, string nombrePaquete)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //string directorio = server + "/temp/" + nombrePaquete + "/" + "unsigned";
                string directorio = server + "/temp/" + nombrePaquete + "/" + "7z";

                //ViewBag.IdFirma = 0;
                //ViewBag.CodigoFirma = 0;
                string rutaFile = directorio + "/temp.7z";
                //ViewBag.DocumentName = nombrePaquete + "-signed.zip";
                string rutaLogo = server + "/resources/logosFirma/isotipo.png";
                string rutaFileOriginal = rutaFile;
                string rutaLogoOriginal = rutaLogo;
                //ViewBag.ParagraphFormat = server + "/logosFirma/isotipo.png";
                                
                ViewBag.CodigoFirma = nombrePaquete;
                ViewBag.UrlInvoker = _firmaService.ObtenerInvokerUrl();
                ViewBag.PdfsJson = JsonSerializer.Serialize(new[] { new { url = rutaFileOriginal, name = nombrePaquete } });
                ViewBag.FirmaParamJson = JsonSerializer.Serialize(new
                {
                    posx = 10,
                    posy = 12,
                    reason = "Soy el autor del documento pdf",
                    role = "Usuario",
                    stampSigned = rutaLogoOriginal,
                    pageNumber = 1,
                    visiblePosition = false,
                    oneByOne = false,
                    signatureStyle = 1,
                    stampTextSize = 14,
                    stampWordWrap = 37
                });

                return View("~/Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        [HttpPost ("api/UploadFileFirmaPeru/{ID}")]
        public async Task<Boolean> FirmaComponentFirmaPeru(string ID, List<IFormFile> signed_file, string codeFirma) // JDELGADO013
        {
            DalUtilitario dl = new DalUtilitario();
            Conexion cn = new Conexion();
            bool resp = false;

            try
            {
                long size = signed_file?.Sum(f => f.Length) ?? 0;
                Console.WriteLine($"[FIRMA][UPLOAD] ID={ID} files={(signed_file?.Count ?? 0)} bytes={size}");

                DataSet datosFirma = null;
                if (!string.IsNullOrWhiteSpace(codeFirma))
                {
                    Console.WriteLine($"[FIRMA][UPLOAD] buscando por codeFirma={codeFirma}");
                    datosFirma = await dl.FirmaDigitalSeleccionarPorCode(codeFirma);
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(ID) || !int.TryParse(ID, out var documentID))
                    {
                        Console.WriteLine("[FIRMA][UPLOAD] ID inválido y sin codeFirma.");
                        return false;
                    }

                    Console.WriteLine($"[FIRMA][UPLOAD] buscando por idFirma={documentID}");
                    datosFirma = await dl.FirmaDigitalSeleccionarPorId(documentID);
                }

                if (datosFirma?.Tables.Count == 0 || datosFirma.Tables[0].Rows.Count == 0)
                {
                    Console.WriteLine($"[FIRMA][UPLOAD] No se encontró registro de firma (ID={ID}, code={codeFirma}).");
                    return false;
                }

                string rutaDocumento = datosFirma.Tables[0].Rows[0]["rutaArchivo"].ToString();
                string code = datosFirma.Tables[0].Rows[0]["code"].ToString();
                Console.WriteLine($"[FIRMA][UPLOAD] code={code}");
                Console.WriteLine($"[FIRMA][UPLOAD] rutaArchivo(BD)={rutaDocumento}");

                // Soporta ruta relativa (/UNSIGNED/...) y absoluta (C:/.../UNSIGNED/...)
                string rutaNormalizada = (rutaDocumento ?? string.Empty).Replace("\\", "/");
                const string marker = "/UNSIGNED/";
                int markerIndex = rutaNormalizada.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
                if (markerIndex >= 0)
                {
                    rutaNormalizada = rutaNormalizada.Substring(markerIndex + marker.Length);
                }
                rutaNormalizada = rutaNormalizada.TrimStart('/');

                foreach (var formFile in signed_file ?? new List<IFormFile>())
                {
                    if (formFile == null || formFile.Length <= 0)
                    {
                        continue;
                    }

                    try
                    {
                        string rutaRelativaSigned = rutaNormalizada.Replace("/", Path.DirectorySeparatorChar.ToString());
                        string filePath = Path.Combine(cn.ObtenerServidorArchivosConFirma(), rutaRelativaSigned);
                        string directorio = Path.GetDirectoryName(filePath) ?? string.Empty;

                        Console.WriteLine($"[FIRMA][UPLOAD] destino={filePath}");

                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);
                        }

                        var rsFirma = await dl.InsertaFirmaDigital(code);
                        Console.WriteLine($"[FIRMA][UPLOAD] SP web_InsertFirmaDigital => {rsFirma}");
                        resp = rsFirma;
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine($"[FIRMA][UPLOAD][ERROR] {e}");
                        resp = false;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FIRMA][UPLOAD][FATAL] {ex}");
                resp = false;
            }

            return resp;
            //return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        }

        [HttpPost("api/UploadPackageFirmaPeru/{ID}")]        
        public async Task<Boolean> FirmaMultipleComponentFirmaPeru(string ID, IList<IFormFile> signed_file) // JDELGADO013
        {
            Conexion con = new Conexion();
            DalUtilitario dalUtil = new DalUtilitario();

            DataSet dataSet;
            long size = signed_file.Sum(f => f.Length);
            var filePaths = new List<string>();
            string documentID = ID;
            //string rutaDocumento = "";
            //string idCuentaAtencion = "";
            //string idRegistro = "";
            //string tipo = "";
            //string controller = "Utilitario";
            //string metodo = "FinFirmaDigitalBitFourId";
            //string ruta = "";
            //bool estado = false;
            //bool fileAnt = false;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            foreach (var formFile in signed_file)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        // full path to file in temp location
                        var filePath = "C:\\SisgalenFiles\\temp\\" + documentID + "\\signed\\temp-signed.7z"; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                        }

                        //string sWebRootFolder = con.ObtenerServidorArchivos();
                        string sWebRootFolder = con.ObtenerServidorArchivosConFirma();
                        string pathExtract = "C:\\SisgalenFiles\\temp\\" + documentID + "\\signed\\temp";
                        
                        using (var archive = new SevenZipArchive(filePath))
                        {
                            archive.ExtractToDirectory(pathExtract);
                        }

                        // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada
                        DirectoryInfo di = new DirectoryInfo(pathExtract);
                        string fileName = "";
                        foreach (var fi in di.GetFiles())
                        {
                            fileName = fi.Name.ToString();
                            fileName = fileName.Replace("[FP]", "");
                            dataSet = await dalUtil.SeleccionarFirmaDigitalPorNombreArchivo(fileName);
                            //ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles" + dataSet.Tables[0].Rows[0]["pathArchivo"].ToString());
                            string pathArchivo = dataSet.Tables[0].Rows[0]["pathArchivo"].ToString();
                            pathArchivo = pathArchivo.Replace("/UNSIGNED/", "");
                            string ruta = Path.Combine(sWebRootFolder, pathArchivo);

                            if (!Directory.Exists(ruta))
                            {
                                Directory.CreateDirectory(ruta);
                            }

                            if (System.IO.File.Exists(fi.FullName))
                            {
                                System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fileName}"), true);
                            }

                            await dalUtil.EstadoFirmaModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), 1);
                        }

                        string resp = await dalUtil.PaqueteArchivoModificar(documentID, "", idUsuario, 0);
                        if (resp != "" || resp != null)
                        {
                            Directory.Delete("C:\\SisgalenFiles\\temp\\" + documentID, true);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                }
                //estado = true                
            }

            //var variableaeliminar = "ahora";
            return true;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////KHOYOSI (FIRMA DIGITAL Bit4Id)////////////////////////////////////
        [HttpGet]
        //public async Task<IActionResult> FirmaDigitalBitFourId(string server, int idCuenta, int idRegistro, string tipo)
        public async Task<IActionResult> FirmaDigitalBitFourId(string server, string code)
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
                Conexion con = new Conexion();
                DataSet DatosFirma;
                DalUtilitario dalUtili = new DalUtilitario();
                //DatosFirma = await dalUtili.ListaFirmaByIdCuentaByIdegistroByTipo(idCuenta, idRegistro, tipo);
                code = DecodificarDeUrl(code);
                //DatosFirma = await dalUtili.FirmaDigitalSeleccionarPorCode(code);
                DatosFirma = await dalUtili.FirmaDigitalSeleccionarPorCodePorIdEmpleado(code, idUsuario);

                string ApiFirmaDigital = con.obtenerApiFirmaDigital();
                string idFirma = DatosFirma.Tables[0].Rows[0]["id"].ToString();
                string codigoFirma = DatosFirma.Tables[0].Rows[0]["code"].ToString();
                string rutaArchivoFirma = DatosFirma.Tables[0].Rows[0]["rutaArchivo"].ToString();
                string idCuentaFirma = DatosFirma.Tables[0].Rows[0]["idCuentaAtencion"].ToString();
                string idRegistroFirma = DatosFirma.Tables[0].Rows[0]["idRegistro"].ToString();
                string tipoFirma = DatosFirma.Tables[0].Rows[0]["tipo"].ToString();
                //string[] nameArchivoFirma = rutaArchivoFirma.Split("/");
                string nameArchivoFirma = DatosFirma.Tables[0].Rows[0]["nombreArchivo"].ToString();
                string TipoEmpleado = DatosFirma.Tables[0].Rows[0]["TipoEmpleado"].ToString();
                string Colegio = DatosFirma.Tables[0].Rows[0]["Colegio"].ToString();
                string DatosMedico = DatosFirma.Tables[0].Rows[0]["DatosMedico"].ToString();
                string Colegiatura = DatosFirma.Tables[0].Rows[0]["Colegiatura"].ToString();
                string Rne = DatosFirma.Tables[0].Rows[0]["Rne"].ToString();
                string x1 = DatosFirma.Tables[0].Rows[0]["X1"].ToString();
                string y1 = DatosFirma.Tables[0].Rows[0]["Y1"].ToString();
                string x2 = DatosFirma.Tables[0].Rows[0]["X2"].ToString();
                string y2 = DatosFirma.Tables[0].Rows[0]["Y2"].ToString();
                string ImagenNombre = DatosFirma.Tables[0].Rows[0]["ImagenNombre"].ToString();
                string LetraTamanio = DatosFirma.Tables[0].Rows[0]["LetraTamanio"].ToString();

                int statusFirma = Int32.Parse(DatosFirma.Tables[0].Rows[0]["statusFirma"].ToString());
                if(statusFirma == 1)
                {
                    rutaArchivoFirma = rutaArchivoFirma.Replace("UNSIGNED", "SIGNED");
                }

                ViewBag.ApiFirmaDigital = ApiFirmaDigital;
                ViewBag.IdFirma = idFirma;
                ViewBag.CodigoFirma = codigoFirma;
                ViewBag.Document = server + rutaArchivoFirma;
                //ViewBag.DocumentName = nameArchivoFirma[5];
                ViewBag.DocumentName = nameArchivoFirma + ".pdf";
                ViewBag.DocumentID = rutaArchivoFirma + "," + idCuentaFirma + "," + idRegistroFirma + "," + tipoFirma + "," + codigoFirma +",Utilitario,FinFirmaDigitalBitFourId," + idUsuario.ToString() + "," + statusFirma.ToString();
                ViewBag.Image = server + "/resources/logosFirma/" + ImagenNombre;
                ViewBag.TipoEmpleado = TipoEmpleado;
                ViewBag.Colegio = Colegio;
                ViewBag.DatosMedico = DatosMedico;
                ViewBag.Colegiatura = Colegiatura;
                ViewBag.Rne = Rne;
                ViewBag.X1 = x1;
                ViewBag.Y1 = y1;
                ViewBag.X2 = x2;
                ViewBag.Y2 = y2;
                ViewBag.LetraTamanio = LetraTamanio;
                //ViewBag.ParagraphFormat = server + "/logosFirma/isotipo.png";

                return View("~/Views/Comun/FirmaDigitalBit4Id.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        [HttpGet]
        public IActionResult FinFirmaDigitalBitFourId()
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                return View("~/Views/Comun/FinFirmaDigitalBit4Id.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        [HttpGet]
        public async Task<IActionResult> FirmaDigitalBitFourIdMultiple(string server, string nombrePaquete)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }
                                
                //DataSet DatosFirma;
                DalUtilitario dalUtili = new DalUtilitario();               
                Conexion con = new Conexion();
                DataSet DatosFirmaPaquete;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DatosFirmaPaquete = await dalUtili.FirmaDigitalPaqueteSeleccionarPorNombrePorIdEmpleado(nombrePaquete, "", idUsuario);

                string sWebRootFolder = con.ObtenerServidorArchivos();
                //string directorio = server + "/temp/" + nombrePaquete + "/" + "unsigned";
                string directorio = server + "/temp/" + nombrePaquete + "/" + "zip";

                ViewBag.IdFirma = 0;
                ViewBag.CodigoFirma = 0;
                ViewBag.Document = directorio + "/temp.zip";
                ViewBag.DocumentName = nombrePaquete + "-signed.zip";
                ViewBag.DocumentID = nombrePaquete + "," + idUsuario.ToString();
                ViewBag.Image = server + "/resources/logosFirma/isotipo.png";
                ViewBag.TipoEmpleado = DatosFirmaPaquete.Tables[0].Rows[0]["TipoEmpleado"].ToString();
                ViewBag.Colegio = DatosFirmaPaquete.Tables[0].Rows[0]["Colegio"].ToString();
                ViewBag.DatosMedico = DatosFirmaPaquete.Tables[0].Rows[0]["DatosMedico"].ToString();
                ViewBag.Colegiatura = DatosFirmaPaquete.Tables[0].Rows[0]["Colegiatura"].ToString();
                ViewBag.Rne = DatosFirmaPaquete.Tables[0].Rows[0]["Rne"].ToString();
                ViewBag.x1 = DatosFirmaPaquete.Tables[0].Rows[0]["X1"].ToString();
                ViewBag.y1 = DatosFirmaPaquete.Tables[0].Rows[0]["Y1"].ToString();
                ViewBag.x2 = DatosFirmaPaquete.Tables[0].Rows[0]["X2"].ToString();
                ViewBag.y2 = DatosFirmaPaquete.Tables[0].Rows[0]["Y2"].ToString();
                

                return View("~/Views/Comun/FirmaDigitalBit4IdMultiple.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        //[HttpGet]
        ////public async Task<IActionResult> FirmaDigitalBitFourIdMultiple(string server, string nombrePaquete)
        //public IActionResult FirmaDigitalBitFourIdMultiple(string server, string nombrePaquete)
        //{
        //    try
        //    {
        //        if (HttpContext.User.Identity.IsAuthenticated == false)
        //        {
        //            return View("Login");
        //        }

        //        //ROLES LUIS
        //        int idUsuario;
        //        idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        DataSet DatosFirma;
        //        DalUtilitario dalUtili = new DalUtilitario();
        //        //DatosFirma = await dalUtili.ListaFirmaByIdCuentaByIdegistroByTipo(idCuenta, idRegistro, tipo);

        //        //string idFirma = DatosFirma.Tables[0].Rows[0]["id"].ToString();
        //        //string codigoFirma = DatosFirma.Tables[0].Rows[0]["code"].ToString();
        //        //string rutaArchivoFirma = DatosFirma.Tables[0].Rows[0]["rutaArchivo"].ToString();
        //        //string idCuentaFirma = DatosFirma.Tables[0].Rows[0]["idCuentaAtencion"].ToString();
        //        //string idRegistroFirma = DatosFirma.Tables[0].Rows[0]["idRegistro"].ToString();
        //        //string tipoFirma = DatosFirma.Tables[0].Rows[0]["tipo"].ToString();
        //        //string[] nameArchivoFirma = rutaArchivoFirma.Split("/");
        //        Conexion con = new Conexion();

        //        string sWebRootFolder = con.ObtenerServidorArchivos();

        //        ViewBag.IdFirma = 0;
        //        ViewBag.CodigoFirma = 0;
        //        ViewBag.Document = server + "/4IdentitySignedFiles/PaqueteSinFirma/" + nombrePaquete.ToString() + ".zip";
        //        ViewBag.DocumentName = nombrePaquete + "-signed.zip";
        //        ViewBag.DocumentID = nombrePaquete;
        //        ViewBag.Image = server + "/logosFirma/isotipo.png";
        //        ViewBag.ParagraphFormat = server + "/logosFirma/isotipo.png";

        //        return View("~/Views/Comun/FirmaDigitalBit4IdMultiple.cshtml");
        //    }
        //    catch (Exception ex)
        //    {
        //        ViewBag.DescripcionError = ex.Message;
        //        return View("Error");
        //    }
        //}

        [HttpPost]
        public async Task<ActionResult> ProcesoFirmaModificar(int idFirma, string codeFirma, int estado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            Boolean lsProceso;
            DalUtilitario dalUtili = new DalUtilitario();
            lsProceso = await dalUtili.ProcesoFirmaModificar(idFirma, codeFirma, estado);
            return Json(new { lsProceso = lsProceso, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ModificarEstadoFirmaPaquete(int idCuenta, int estado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            Boolean lsProceso = false;
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                lsProceso = await dalUtili.ModificarEstadoFirmaPaquete(idCuenta.ToString() + ".zip", estado);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = lsProceso });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivos(string cuentasAtencion, int idEvaluacion, int idServicio)
        {
            DalUtilitario dalUtil = new DalUtilitario();
            DataSet archivos = new DataSet();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorCuentas(cuentasAtencion, idEvaluacion, idServicio, idUsuario);

            return await CrearPaqueteArchivos(archivos, idUsuario);
        }

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivosConRegistros(string registros, int idEvaluacion, int idServicio, string tipo)
        {
            DalUtilitario dalUtil = new DalUtilitario();
            DataSet archivos = new DataSet();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorRegistros(registros, idEvaluacion, idServicio, idUsuario, tipo);

            return await CrearPaqueteArchivos(archivos, idUsuario);
        }

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivosConRegistrosConItems(string registros, int idEvaluacion, int idServicio, int idItem, string tipo)
        {
            DalUtilitario dalUtil = new DalUtilitario();
            DataSet archivos = new DataSet();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorRegistrosPorItems(registros, idEvaluacion, idServicio, idUsuario, idItem, tipo);

            return await CrearPaqueteArchivos(archivos, idUsuario);
        }
       
            
        public async Task<ActionResult> CrearPaqueteArchivos(DataSet archivos, int idUsuario)
        {
            string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
            var path = "";
            string paquete = "";
            string valor = "";
            DalUtilitario dalUtil = new DalUtilitario();
            Conexion con = new Conexion();
            string sWebRootFolder = con.ObtenerServidorArchivos();
            string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");

            try
            {
                if (archivos.Tables[0].Rows.Count > 0)
                {
                    paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, "", idUsuario, 1);
                    if (paquete != "")
                    {
                        directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
                        directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
                        directorio3 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "zip");
                        rutaZip = directorio3 + @"\temp.zip";
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        if (!Directory.Exists(directorio2))
                        {
                            Directory.CreateDirectory(directorio2);
                        }

                        if (!Directory.Exists(directorio3))
                        {
                            Directory.CreateDirectory(directorio3);
                        }

                        foreach (DataRow row in archivos.Tables[0].Rows)
                        {
                            path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
                            System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
                        }
                        valor = dalUtil.ComprimirArchivoEnZip(directorio, rutaZip);
                        //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
                    }
                    else
                    {
                        return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
                    }
                }
                else
                {
                    return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
                }


                return Json(new { error = false, estado = true, msg = valor, data = paquete });
            }
            catch (Exception e)
            {
                return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
            }
        }

        //[HttpPost]
        //public async Task<ActionResult> CrearPaqueteArchivos(string cuentasAtencion, int idEvaluacion, int idServicio)
        //{
        //    string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
        //    var path = "";
        //    Conexion con = new Conexion();
        //    DalUtilitario dalUtil = new DalUtilitario();
        //    DataSet archivos = new DataSet();
        //    string paquete = "";

        //    string valor = "";
        //    string sWebRootFolder = con.ObtenerServidorArchivos();
        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");
        //    //string firmas = "";
        //    try
        //    {
        //        archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorCuentas(cuentasAtencion, idEvaluacion, idServicio, idUsuario);

        //        if (archivos.Tables[0].Rows.Count > 0)
        //        {
        //            paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, 1);
        //            if (paquete != "")
        //            {
        //                //directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "temp");
        //                directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
        //                directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
        //                directorio3 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "zip");
        //                rutaZip = directorio3 + @"\temp.zip";
        //                if (!Directory.Exists(directorio))
        //                {
        //                    Directory.CreateDirectory(directorio);
        //                }

        //                if (!Directory.Exists(directorio2))
        //                {
        //                    Directory.CreateDirectory(directorio2);
        //                }

        //                if (!Directory.Exists(directorio3))
        //                {
        //                    Directory.CreateDirectory(directorio3);
        //                }

        //                foreach (DataRow row in archivos.Tables[0].Rows)
        //                {
        //                    path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
        //                    System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
        //                }
        //                valor = dalUtil.ComprimirArchivoEnZip(directorio, rutaZip);
        //                //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
        //            }
        //            else
        //            {
        //                return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
        //            }
        //        }
        //        else
        //        {
        //            return Json(new { error = false, estado = false,  msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
        //        }

        //        return Json(new { error = false, estado = true, msg = valor, data = paquete });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
        //    }
        //}

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivos7zip(string cuentasAtencion, int idEvaluacion, int idServicio)
        {
            string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
            var path = "";
            Conexion con = new Conexion();
            DalUtilitario dalUtil = new DalUtilitario();
            DataSet archivos = new DataSet();
            string paquete = "";

            string valor = "";
            string sWebRootFolder = con.ObtenerServidorArchivos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");
            //string firmas = "";
            try
            {
                archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorCuentas(cuentasAtencion, idEvaluacion, idServicio, idUsuario);

                if (archivos.Tables[0].Rows.Count > 0)
                {
                    paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, "", idUsuario, 1);
                    if (paquete != "")
                    {
                        //directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "temp");
                        directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
                        directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
                        directorio3 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "7z");
                        rutaZip = directorio3 + @"\temp.7z";
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        if (!Directory.Exists(directorio2))
                        {
                            Directory.CreateDirectory(directorio2);
                        }

                        if (!Directory.Exists(directorio3))
                        {
                            Directory.CreateDirectory(directorio3);
                        }

                        foreach (DataRow row in archivos.Tables[0].Rows)
                        {
                            path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
                            System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
                        }
                        valor = dalUtil.ComprimirArchivoEn7Zip(directorio, rutaZip);
                        //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
                    }
                    else
                    {
                        return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
                    }
                }
                else
                {
                    return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
                }

                return Json(new { error = false, estado = true, msg = valor, data = paquete });
            }
            catch (Exception e)
            {
                return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
            }
        }





        //public async Task<ActionResult> CrearPaqueteArchivosConRegistros(string registros, int idEvaluacion, int idServicio, string tipo)
        //{
        //    string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
        //    var path = "";
        //    Conexion con = new Conexion();
        //    DalUtilitario dalUtil = new DalUtilitario();
        //    DataSet archivos = new DataSet();
        //    string paquete = "";

        //    string valor = "";
        //    string sWebRootFolder = con.ObtenerServidorArchivos();
        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");
        //    //string firmas = "";
        //    try
        //    {
        //        archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorRegistros(registros, idEvaluacion, idServicio, idUsuario, tipo);

        //        if (archivos.Tables[0].Rows.Count > 0)
        //        {
        //            paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, 1);
        //            if (paquete != "")
        //            {                        
        //                directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
        //                directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
        //                directorio3 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "zip");
        //                rutaZip = directorio3 + @"\temp.zip";
        //                if (!Directory.Exists(directorio))
        //                {
        //                    Directory.CreateDirectory(directorio);
        //                }

        //                if (!Directory.Exists(directorio2))
        //                {
        //                    Directory.CreateDirectory(directorio2);
        //                }

        //                if (!Directory.Exists(directorio3))
        //                {
        //                    Directory.CreateDirectory(directorio3);
        //                }

        //                foreach (DataRow row in archivos.Tables[0].Rows)
        //                {
        //                    path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
        //                    System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
        //                }
        //                valor = dalUtil.ComprimirArchivoEnZip(directorio, rutaZip);
        //                //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
        //            }
        //            else
        //            {
        //                return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
        //            }
        //        }
        //        else
        //        {
        //            return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
        //        }


        //        return Json(new { error = false, estado = true, msg = valor, data = paquete });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
        //    }
        //}
        
        //public async Task<ActionResult> CrearPaqueteArchivosConRegistrosConItems(string registros, int idEvaluacion, int idServicio, int idItem, string tipo)
        //{
        //    string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
        //    var path = "";
        //    Conexion con = new Conexion();
        //    DalUtilitario dalUtil = new DalUtilitario();
        //    DataSet archivos = new DataSet();
        //    string paquete = "";

        //    string valor = "";
        //    string sWebRootFolder = con.ObtenerServidorArchivos();
        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");
        //    //string firmas = "";
        //    try
        //    {
        //        archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorRegistrosPorItems(registros, idEvaluacion, idServicio, idUsuario, idItem, tipo);

        //        if (archivos.Tables[0].Rows.Count > 0)
        //        {
        //            paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, 1);
        //            if (paquete != "")
        //            {
        //                directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
        //                directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
        //                directorio3 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "zip");
        //                rutaZip = directorio3 + @"\temp.zip";
        //                if (!Directory.Exists(directorio))
        //                {
        //                    Directory.CreateDirectory(directorio);
        //                }

        //                if (!Directory.Exists(directorio2))
        //                {
        //                    Directory.CreateDirectory(directorio2);
        //                }

        //                if (!Directory.Exists(directorio3))
        //                {
        //                    Directory.CreateDirectory(directorio3);
        //                }

        //                foreach (DataRow row in archivos.Tables[0].Rows)
        //                {
        //                    path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
        //                    System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
        //                }
        //                valor = dalUtil.ComprimirArchivoEnZip(directorio, rutaZip);
        //                //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
        //            }
        //            else
        //            {
        //                return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
        //            }
        //        }
        //        else
        //        {
        //            return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
        //        }


        //        return Json(new { error = false, estado = true, msg = valor, data = paquete });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
        //    }
        //}

        public async Task<ActionResult> CrearPaqueteArchivos7zipConRegistros(string registros, int idEvaluacion, int idServicio, string tipo)
        {
            string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
            var path = "";
            Conexion con = new Conexion();
            DalUtilitario dalUtil = new DalUtilitario();
            DataSet archivos = new DataSet();
            string paquete = "";

            string valor = "";
            string sWebRootFolder = con.ObtenerServidorArchivos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");
            //string firmas = "";
            try
            {
                archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorRegistros(registros, idEvaluacion, idServicio, idUsuario, tipo);

                if (archivos.Tables[0].Rows.Count > 0)
                {
                    paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, "", idUsuario, 1);
                    if (paquete != "")
                    {
                        directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
                        directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
                        directorio3 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "7z");
                        rutaZip = directorio3 + @"\temp.7z";
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        if (!Directory.Exists(directorio2))
                        {
                            Directory.CreateDirectory(directorio2);
                        }

                        if (!Directory.Exists(directorio3))
                        {
                            Directory.CreateDirectory(directorio3);
                        }

                        foreach (DataRow row in archivos.Tables[0].Rows)
                        {
                            path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
                            System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
                        }
                        valor = dalUtil.ComprimirArchivoEn7Zip(directorio, rutaZip);
                        //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
                    }
                    else
                    {
                        return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
                    }
                }
                else
                {
                    return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
                }


                return Json(new { error = false, estado = true, msg = valor, data = paquete });
            }
            catch (Exception e)
            {
                return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
            }
        }
        ////////////////////////////////KHOYOSI////////////////////////////////////

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivosRecetas(string idCuenta)
        {
            string directorio = "", directorio2 = "", rutaZip = "";
            var path = "";
            Conexion con = new Conexion();
            DalUtilitario dalUtil = new DalUtilitario();
            DataSet archivos = new DataSet();
            string paquete = "";

            string valor = "";
            string sWebRootFolder = con.ObtenerServidorArchivos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            string nombrePaquete = DateTime.Now.ToString("ddMMyyHHmmss");
            //string firmas = "";
            try
            {
                archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorIdRecetas(idCuenta);

                if (archivos.Tables[0].Rows.Count > 0)
                {
                    paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, "", idUsuario, 1);
                    if (paquete != "")
                    {
                        //directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "temp");
                        directorio = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "unsigned");
                        directorio2 = Path.Combine(sWebRootFolder, "temp", paquete.ToString(), "signed");
                        rutaZip = directorio + @"\temp.zip";
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        if (!Directory.Exists(directorio2))
                        {
                            Directory.CreateDirectory(directorio2);
                        }

                        foreach (DataRow row in archivos.Tables[0].Rows)
                        {
                            path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
                            System.IO.File.Copy(row["rutaArchivo"].ToString(), path);
                        }
                        //valor = dalUtil.ComprimirArchivoEnZip(directorio, rutaZip);
                        valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
                    }
                    else
                    {
                        return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
                    }
                }
                else
                {
                    return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
                }

                return Json(new { error = false, estado = true, msg = valor, data = paquete });
            }
            catch (Exception e)
            {
                return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
            }
        }


        // Evaluaciones UCI
        [HttpGet]
        public async Task<ActionResult> TipoSoporteOxigenatorioVentilatorio() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.TipoSoporteOxigenatorioVentilatorio();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        
        //[HttpPost]
        //public async Task<ActionResult> FirmaDocumentosByLote(int idCuentaAtencion) // JDELGADO002
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }
        //    DataSet dataSet = null;
        //    DalUtilitario dalUtili = new DalUtilitario();
        //    Conexion con = new Conexion();

        //    string sWebRootFolder = con.ObtenerServidorArchivos();
        //    List<string> filesPath = new List<string>();

        //    string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
        //    string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));      //KHOYOSI

        //    try
        //    {
        //        //dataSet = await dalUtili.SeleccionarDocumentosFirmaByIdCuentaAndIdEmpleado(idCuentaAtencion, 0);
        //        dataSet = await dalUtili.SeleccionarDocumentosFirmaDigitalByIdCuentaAndIdEmpleado(idCuentaAtencion, idUsuario, 0);      //KHOYOSI


        //        if (!Directory.Exists(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma")))
        //        {
        //            Directory.CreateDirectory(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma"));
        //        }

        //        if (System.IO.File.Exists($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + ".zip"))
        //        {
        //            System.IO.File.Delete($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + ".zip");
        //        }
        //        if (System.IO.File.Exists($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + "-signed.zip"))
        //        {
        //            System.IO.File.Delete($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + "-signed.zip");
        //        }
        //        if (Directory.Exists($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + "-signed"))
        //        {
        //            string[] filenames = Directory.GetFiles($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + "-signed");
        //            foreach (string filename in filenames)
        //            {
        //                if (System.IO.File.Exists(filename))
        //                {
        //                    System.IO.File.Delete(filename);
        //                }
        //            }
        //            Directory.Delete($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + "-signed");
        //        }

        //        foreach (DataRow dr in dataSet.Tables[0].Rows)
        //        {
        //            string ruta = dr["rutaArchivo"].ToString();
        //            string[] arregloRuta = dr["rutaArchivo"].ToString().Split("/");

        //            if(System.IO.File.Exists(ruta.ToString()))
        //            {
        //                //System.IO.File.Copy(ruta.ToString(), Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString() + "/" + arregloRuta[arregloRuta.Length - 1].ToString()), true);
        //                filesPath.Add(ruta);
        //            }

        //            //System.IO.File.Copy(ruta.ToString(), $"{sWebRootFolder}4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString() + "/" + arregloRuta[arregloRuta.Length - 1].ToString(), true);
        //        }

        //        //String compirimdo = dalUtili.ComrpimirDocumentosParaFirma(filesPath.ToArray(), $"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + idCuentaAtencion.ToString() + ".zip");

        //        bool estadoFirmaPaquete = await dalUtili.CrearEstadoFirmaPaquete(idCuentaAtencion, idCuentaAtencion.ToString() + ".zip", 0);


        //        //String comprimido = dalUtili.ComprimirArchivo($"{sWebRootFolder}4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString(), $"{sWebRootFolder}4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString() + ".zip");

        //        return Json(new { session = true, estado = true, msg = "", data = dataSet });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
        //    }
        //}

        //[HttpPost]
        //public async Task<ActionResult> FirmaDocumentosByLoteTotal(string cuentasAtencion) // JDELGADO002
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }
        //    DataSet dataSet = null;
        //    DalUtilitario dalUtili = new DalUtilitario();
        //    Conexion con = new Conexion();
        //    Boolean tieneArchivos = false;

        //    string sWebRootFolder = con.ObtenerServidorArchivos();
        //    List<string> filesPath = new List<string>();

        //    string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
        //    string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

        //    string[] arrayCuentas = cuentasAtencion.Split(",");
        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));      //KHOYOSI

        //    try
        //    {
        //        if (!Directory.Exists(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma")))
        //        {
        //            Directory.CreateDirectory(Path.Combine(sWebRootFolder, $"4IdentitySignedFiles/PaqueteSinFirma"));
        //        }
        //        if (System.IO.File.Exists($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + ".zip"))
        //        {
        //            System.IO.File.Delete($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + ".zip");
        //        }
        //        if (System.IO.File.Exists($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + "-signed.zip"))
        //        {
        //            System.IO.File.Delete($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + "-signed.zip");
        //        }
        //        if (Directory.Exists($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + "-signed"))
        //        {
        //            string[] filenames = Directory.GetFiles($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + "-signed");
        //            foreach (string filename in filenames)
        //            {
        //                if (System.IO.File.Exists(filename))
        //                {
        //                    System.IO.File.Delete(filename);
        //                }
        //            }
        //            Directory.Delete($"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + "-signed");
        //        }

        //        foreach (string cuenta in arrayCuentas)
        //        {
        //            //dataSet = await dalUtili.SeleccionarDocumentosFirmaByIdCuentaAndIdEmpleado(Int32.Parse(cuenta), 0);
        //            dataSet = await dalUtili.SeleccionarDocumentosFirmaDigitalByIdCuentaAndIdEmpleado(Int32.Parse(cuenta), idUsuario, 0);         //KHOYOSI

        //            foreach (DataRow dr in dataSet.Tables[0].Rows)
        //            {
        //                string ruta = dr["rutaArchivo"].ToString();
        //                string[] arregloRuta = dr["rutaArchivo"].ToString().Split("/");

        //                if (System.IO.File.Exists(ruta.ToString()))
        //                {
        //                    tieneArchivos = true;
        //                    filesPath.Add(ruta);
        //                }

        //            }
        //        }

        //        //String compirimdo = dalUtili.ComrpimirDocumentosParaFirma(filesPath.ToArray(), $"{sWebRootFolder}4IdentitySignedFiles/PaqueteSinFirma/" + cuentasAtencion.Replace(",", "-") + ".zip");
        //        bool estadoFirmaPaquete = await dalUtili.CrearEstadoFirmaPaquete(88888888, cuentasAtencion.Replace(",", "-") + ".zip", 0);

        //        return Json(new { session = true, estado = true, msg = "", data = dataSet, data2 = tieneArchivos });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
        //    }

        //    //try
        //    //{
        //    //    




        //    //    





        //    //    

        //    //    


        //    //    //String comprimido = dalUtili.ComprimirArchivo($"{sWebRootFolder}4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString(), $"{sWebRootFolder}4IdentitySignedFiles/paquetes/" + idCuentaAtencion.ToString() + ".zip");

        //    //    
        //    //}

        //}

        public async Task<bool> GuardarArchivo(string filePath, string fileName, StringBuilder html, int idCuentaAtencion, string tipo)
        {
            Conexion con = new Conexion();
            ClUtilirario clUtilitario= new ClUtilirario();
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            //string sWebRootFolder = con.ObtenerServidorArchivos();
            string sWebRootFolder = con.ObtenerServidorArchivosSinFirma();
            var path = "";
            bool resultFirma = false;
            string generacion_pdf;
            Task<bool> Tbol;

            path = Path.Combine(sWebRootFolder, filePath, fileName);

            var otrapath = Path.Combine(sWebRootFolder, filePath);

            if (Directory.Exists(Path.Combine(sWebRootFolder, filePath)))
            {
                generacion_pdf = GenerarPDf(html, path, 1);

                if (generacion_pdf == "Ok")
                {
                    Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idCuentaAtencion);
                    resultFirma = await Tbol;

                }
            }
            else
            {
                Directory.CreateDirectory(Path.Combine(sWebRootFolder, filePath));

                generacion_pdf = GenerarPDf(html, path, 1);

                if (generacion_pdf == "Ok")
                {
                    Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idCuentaAtencion);
                    resultFirma = await Tbol;

                }
                //Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()), tipo, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()));
            }
            return resultFirma;
        }

        public string GenerarPDf(StringBuilder html, string sWebRootFolder, int orientacion)
        {
            try
            {
                HtmlToPdf ohtml = new HtmlToPdf();
                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                PdfPageOrientation pdfOrientationLandscape = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Landscape", true);

                if (orientacion == 1)
                {
                    ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                }
                else
                {
                    ohtml.Options.PdfPageOrientation = pdfOrientationLandscape;
                }


                ohtml.Options.PdfPageSize = pageSize;

                SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());

                obPdfDoc.Save(sWebRootFolder);


                return "Ok";
            }
            catch (Exception e)
            {
                return e.ToString();
            }
        }


        public async Task<bool> GuardarArchivoV2(string filePath, string fileName, HtmlToPdf ohtml, string url, int idCuentaAtencion, string tipo, int idRegistro)
        {
            Conexion con = new Conexion();
            ClUtilirario clUtilitario = new ClUtilirario();
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = con.ObtenerServidorArchivos();
            var path = "";
            bool resultFirma = false;
            //string generacion_pdf = "";
            Task<bool> Tbol;

            path = Path.Combine(sWebRootFolder, filePath, fileName);

            if (!Directory.Exists(Path.Combine(sWebRootFolder, filePath)))
            {
                Directory.CreateDirectory(Path.Combine(sWebRootFolder, filePath));
            }            

            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertUrl(url);
            obPdfDoc.Save(path);

            Tbol = clUtilitario.UploadFile(path, idCuentaAtencion, tipo, idRegistro);
            resultFirma = await Tbol;
            return resultFirma;
        }


        /// <summary>
        /// FUNCIONES NUEVAS PARA LA GENERACION DEL PDF, ALMACENADO Y REGISTRO EN BD
        /// </summary>
        /// KHOYOSI
        /////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<Boolean> GenerarDocumentoDigital(int idCuentaAtencion, int idRegistro, int idItem, string tipo, int idNumero, 
                                                           string pagePlantilla, StringBuilder htmlPlantilla, int IdUsuario, FormatoPdf pdff)
        {
            //FormatoPdf pdff = new FormatoPdf();
            FirmaDigital firma = new FirmaDigital();
            ClUtilirario clUtilitario = new ClUtilirario();
            DalUtilitario dalUtilitario = new DalUtilitario();
            DataSet datos;
            DataSet dataFile;
            string nombreRuta, accion = "", nombreArchivoAnt, rutaFolderAnt;
            bool pdf, Tbol, pdfAnt;
            

            try
            {
                datos = await dalUtilitario.FirmaDigitalSeleccionarDatos(idCuentaAtencion, idRegistro, idItem, tipo, idNumero);
                firma.code = datos.Tables[0].Rows[0]["code"].ToString();
                firma.idCuentaAtencion = Convert.ToInt32(datos.Tables[0].Rows[0]["idCuentaAtencion"].ToString());
                firma.idRegistro = Convert.ToInt32(datos.Tables[0].Rows[0]["idRegistro"].ToString());
                firma.idTipoServicio = Convert.ToInt32(datos.Tables[0].Rows[0]["idTipoServicio"].ToString());
                firma.idServicio = Convert.ToInt32(datos.Tables[0].Rows[0]["idServicio"].ToString());
                firma.idEvaluacion = Convert.ToInt32(datos.Tables[0].Rows[0]["idEvaluacion"].ToString());
                firma.idEmpleado = Convert.ToInt32(datos.Tables[0].Rows[0]["idEmpleado"].ToString());
                firma.fecha = datos.Tables[0].Rows[0]["fecha"].ToString();
                firma.tipo = datos.Tables[0].Rows[0]["tipo"].ToString();
                firma.idUsuarioRegistra = IdUsuario;
                firma.idItem = idItem;
                
                nombreRuta = await GenerarRutaArchivoPdf(firma.idCuentaAtencion, firma.idTipoServicio, firma.tipo);
                if (firma.code == "0")
                {
                    accion = "I";
                    firma.code = await GenerarCodeArchivoPdf(firma);
                } 
                else
                {
                    dataFile = await dalUtilitario.FirmaDigitalSeleccionarPorCode(firma.code);
                    nombreArchivoAnt = dataFile.Tables[0].Rows[0]["nombreArchivo"].ToString() + ".pdf";
                    rutaFolderAnt = dataFile.Tables[0].Rows[0]["rutaFolder"].ToString();
                    pdfAnt = MoverArchivoPdf(rutaFolderAnt, nombreArchivoAnt);
                }

                firma.nombreArchivo = await GenerarNombreArchivoPdf(firma);
                firma.rutaArchivo = nombreRuta + firma.nombreArchivo + ".pdf";
                Console.WriteLine($"[FIRMA][PDF] Ruta destino: {firma.rutaArchivo}");

                //pdff.orientacion = orientacion;
                //pdff.tamanio = tamanio;
                pdff.stringHtml = htmlPlantilla;
                pdff.pageHtml = pagePlantilla;
                pdff.rutaArchivo = firma.rutaArchivo;
                pdff.tipo = firma.tipo;

                ////////////////DATOS PARA PIE DE PAGINA//////////////////////
                pdff.Paciente = datos.Tables[0].Rows[0]["Paciente"].ToString();
                pdff.Servicio = datos.Tables[0].Rows[0]["Servicio"].ToString();
                pdff.Cama = datos.Tables[0].Rows[0]["Cama"].ToString();
                pdff.Cuenta = datos.Tables[0].Rows[0]["Cuenta"].ToString();
                pdff.Edad = datos.Tables[0].Rows[0]["Edad"].ToString();
                pdff.Historia = datos.Tables[0].Rows[0]["Historia"].ToString();
                pdff.Movimiento = datos.Tables[0].Rows[0]["Movimiento"].ToString();
                pdff.Item = idItem.ToString();
                pdff.Firmador1 = datos.Tables[0].Rows[0]["Firmador1"].ToString();
                pdff.TipoFirmador1 = datos.Tables[0].Rows[0]["TipoFirmador1"].ToString();
                pdff.Firmador2 = datos.Tables[0].Rows[0]["Firmador2"].ToString();
                pdff.TipoFirmador2 = datos.Tables[0].Rows[0]["TipoFirmador2"].ToString();
                //////////////////////////////////////////////////////////////

                Tbol = await clUtilitario.FirmaDigitalModificar(firma, accion);
                
                if (Tbol)
                {
                    //pdf = GenerarArchivoPdf(pdff);    //VERSION CON HtmlToPdf
                    pdf = await GenerarArchivoPdfV2(pdff);    //VERSION CON ITEXT 7
                    Console.WriteLine($"[FIRMA][PDF] Resultado generación: {pdf}");
                }
                else
                {
                    Console.WriteLine("[FIRMA][PDF] No se pudo registrar metadata de firma en BD.");
                    return false;
                }
                if (!pdf)
                {
                    Console.WriteLine("[FIRMA][PDF] Falló la generación física del PDF.");
                    return false;
                }

                if (System.IO.File.Exists(firma.rutaArchivo))
                {
                    long bytes = new FileInfo(firma.rutaArchivo).Length;
                    Console.WriteLine($"[FIRMA][PDF] Archivo generado OK. Bytes: {bytes}");
                }
                else
                {
                    Console.WriteLine("[FIRMA][PDF] No existe archivo en ruta destino después de generar.");
                    return false;
                }

                return true;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                Console.WriteLine($"[FIRMA][PDF][ERROR] {e}");
                return false;
            }
        }



        //public async Task<bool> GeneraFormatoPdf(FormatoPdf fpdf, FirmaDigital firma)
        //{
        //    //UtilitarioController utilitario = new UtilitarioController();
        //    ClUtilirario clUtilitario = new ClUtilirario();

        //    //string pageHtml, idAtencion, nroHistoria, rutaArchivo, orientacion, tamanio, tipo;
        //    string nombreRuta, nombreArchivo, accion = "";
        //    bool pdf, Tbol;
        //    //int idRegistro = 0;                      

        //    try
        //    {
        //        nombreRuta = await GenerarRutaArchivoPdf(fpdf.idCuentaAtencion, fpdf.tipoServicio, fpdf.tipoDocumento);
        //        if (fpdf.codigo == "0")
        //        {
        //            accion = "I";
        //            fpdf.codigo = await GenerarCodeArchivoPdf(fpdf);
        //        }
        //        fpdf.nombreArchivo = await GenerarNombreArchivoPdf(fpdf);
        //        fpdf.rutaArchivo = nombreRuta + fpdf.nombreArchivo + ".pdf";
        //        pdf = GenerarArchivoPdf(fpdf);

        //        if (pdf)
        //        {
        //            firma.code = fpdf.codigo;
        //            firma.idCuentaAtencion = fpdf.idCuentaAtencion;
        //            firma.idRegistro = fpdf.idRegistro;
        //            firma.idTipoServicio = fpdf.tipoServicio;
        //            firma.tipo = fpdf.tipoDocumento;
        //            firma.nombreArchivo = fpdf.nombreArchivo;
        //            firma.rutaArchivo = fpdf.rutaArchivo;                    

        //            Tbol = await clUtilitario.FirmaDigitalModificar(firma, accion);
        //        }
        //        else
        //        {
        //            return false;
        //        }

        //        return true;
        //    }
        //    catch (Exception e)
        //    {
        //        return false;
        //    }

        //}

        ////////////////////////VERSION CON ITEXT 7///////////////////////////////////////////////
        public async Task<Boolean> GenerarArchivoPdfV2(FormatoPdf pdf)
        {            
            ClUtilirario clUtilitario = new ClUtilirario();            
            bool rpta = false;

            try
            {
                iText.Kernel.Pdf.PdfWriter writer = new iText.Kernel.Pdf.PdfWriter(pdf.rutaArchivo);
                iText.Kernel.Pdf.PdfDocument pdfd = new iText.Kernel.Pdf.PdfDocument(writer);
                iText.Layout.Document document;
                iText.Kernel.Geom.PageSize pageSize = null;
                FooterHandler footerHandler = new FooterHandler();
                
                if (pdf.tipoDocumento == "Ticket")
                {
                    pageSize = new iText.Kernel.Geom.PageSize(225, 859);
                    //pageSize = iText.Kernel.Geom.PageSize.A7;
                    document = new iText.Layout.Document(pdfd, pageSize);
                }
                else
                {
                    if (pdf.orientacion == "Portrait")
                    {
                        if(pdf.tamanio == "A5")
                        {
                            pageSize = iText.Kernel.Geom.PageSize.A5;
                        } else
                        {
                            pageSize = iText.Kernel.Geom.PageSize.A4;
                        }
                        
                    }
                    else if (pdf.orientacion == "Landscape")
                    {
                        if (pdf.tamanio == "A5")
                        {
                            pageSize = iText.Kernel.Geom.PageSize.A5.Rotate();
                        }
                        else
                        {
                            pageSize = iText.Kernel.Geom.PageSize.A4.Rotate();
                        }
                        
                    }

                    //iText.Kernel.Geom.PageSize pageSize = new iText.Kernel.Geom.PageSize(668, 935);
                    document = new iText.Layout.Document(pdfd, pageSize);
                    
                }
                                

                if (pdf.stringHtml != null)
                {
                    byte[] byteArray = Encoding.UTF8.GetBytes(pdf.stringHtml.ToString());
                    // Obtener el contenido de la URL como un stream
                    using (Stream htmlStream = new MemoryStream(byteArray))
                    {
                        // Realizar las operaciones necesarias con el stream
                        HtmlConverter.ConvertToPdf(htmlStream, pdfd);
                    }
                }
                else
                {
                    /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
                    var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
                    var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
                    string IpPrivada = AppNameIp1.ToString();
                    string IpPublica = AppNameIp2.ToString();
                    pdf.pageHtml = pdf.pageHtml.Replace(IpPublica, IpPrivada);
                    ////////////////////////////////////////////////////////////////////////////
                    
                    using (HttpClient httpClient = new HttpClient())
                    {
                        // Obtener el contenido de la URL como un stream
                        using (Stream htmlStream = await httpClient.GetStreamAsync(pdf.pageHtml))
                        {

                            if (pdf.tipo == "CE-A" || pdf.tipo == "CE-APC" || pdf.tipo == "INF-RS")
                            {
                                Dictionary<string, string> parametros = new Dictionary<string, string>
                                {
                                    { "Tipo", pdf.tipo },
                                    { "Nombres", pdf.Paciente },
                                    { "Servicio", pdf.Servicio },
                                    { "Cama", pdf.Cama },
                                    { "Cuenta", pdf.Cuenta },
                                    { "Edad", pdf.Edad },
                                    { "Historia", pdf.Historia },
                                    { "Movimiento", "" },
                                    { "Item", ""},
                                    { "FormatoHoja", "" },
                                    { "Firmador1", pdf.Firmador1 },
                                    { "TipoFirmador1", pdf.TipoFirmador1 },
                                    { "Firmador2", pdf.Firmador2 },
                                    { "TipoFirmador2", pdf.TipoFirmador2 }
                                };
                                footerHandler.Parameters = parametros;
                                pdfd.AddEventHandler(PdfDocumentEvent.END_PAGE, footerHandler);

                            }

                            //////////////////AGREGA PIE DE PAGINA (Por el momento solo para emergencia)//////////////////////
                            if (pdf.tipo == "E-EVA" || pdf.tipo == "H-EVA" || pdf.tipo == "CN" || pdf.tipo == "LAB-RES" || pdf.tipo == "LAB-RES-GRUPO" || pdf.tipo == "I-CQX" || pdf.tipo == "NE-NEO" || pdf.tipo == "HO-PIE")
                            {
                                Dictionary<string, string> parametros = new Dictionary<string, string>
                                {
                                    { "Tipo", pdf.tipo },
                                    { "Nombres", pdf.Paciente },
                                    { "Servicio", pdf.Servicio },
                                    { "Cama", pdf.Cama },
                                    { "Cuenta", pdf.Cuenta },
                                    { "Edad", pdf.Edad },
                                    { "Historia", pdf.Historia },
                                    { "Movimiento", pdf.Movimiento },
                                    { "Item", pdf.Item },
                                    { "FormatoHoja", pdf.tamanio },
                                    { "Firmador1", pdf.Firmador1 },
                                    { "TipoFirmador1", pdf.TipoFirmador1 },
                                    { "Firmador2", pdf.Firmador2 },
                                    { "TipoFirmador2", pdf.TipoFirmador2 }
                                };
                                footerHandler.Parameters = parametros;
                                pdfd.AddEventHandler(PdfDocumentEvent.END_PAGE, footerHandler);

                            }
                            ////////////////////////////////////////////////////////////////////////////////////
                            
                            if (pdf.tipo == "IMG-RES")
                            {
                                Dictionary<string, string> parametros = new Dictionary<string, string>
                                {
                                    { "Tipo", pdf.tipo },
                                    { "Nombres", pdf.Paciente },
                                    { "Servicio", pdf.Servicio },
                                    { "Cama", pdf.Cama },
                                    { "Cuenta", pdf.Cuenta },
                                    { "Edad", pdf.Edad },
                                    { "Historia", pdf.Historia },
                                    { "Movimiento", pdf.Movimiento },
                                    { "Item", pdf.Item },
                                    { "FormatoHoja", pdf.tamanio },
                                    { "Firmador1", pdf.Firmador1 },
                                    { "TipoFirmador1", pdf.TipoFirmador1 },
                                    { "Firmador2", pdf.Firmador2 },
                                    { "TipoFirmador2", pdf.TipoFirmador2 }
                                };
                                footerHandler.Parameters = parametros;
                                pdfd.AddEventHandler(PdfDocumentEvent.END_PAGE, footerHandler);

                            }

                            //////////////////AGREGA PIE DE PAGINA (Por el momento solo para UCI)//////////////////////
                            if (pdf.tipo == "UCI-EVA")
                            {
                                Dictionary<string, string> parametros = new Dictionary<string, string>
                                {
                                    { "Tipo", pdf.tipo },
                                    { "Nombres", pdf.Paciente },
                                    { "Servicio", pdf.Servicio },
                                    { "Cama", pdf.Cama },
                                    { "Cuenta", pdf.Cuenta },
                                    { "Edad", pdf.Edad },
                                    { "Historia", pdf.Historia },
                                    { "Movimiento", pdf.Movimiento },
                                    { "Item", pdf.Item },
                                    { "FormatoHoja", pdf.tamanio },
                                    { "Firmador1", pdf.Firmador1 },
                                    { "TipoFirmador1", pdf.TipoFirmador1 },
                                    { "Firmador2", pdf.Firmador2 },
                                    { "TipoFirmador2", pdf.TipoFirmador2 }
                                };

                                footerHandler.Parameters = parametros;
                                pdfd.AddEventHandler(PdfDocumentEvent.END_PAGE, footerHandler);
                            }
                            ////////////////////////////////////////////////////////////////////////////////////
                            // Realizar las operaciones necesarias con el stream (COVIERTE STREAM HTML a PDF)
                            HtmlConverter.ConvertToPdf(htmlStream, pdfd);                            
                        }
                    }

                    document.Close();
                    pdfd.Close();
                    writer.Close();

                    if (System.IO.File.Exists(pdf.rutaArchivo))
                    {
                        var bytes = System.IO.File.ReadAllBytes(pdf.rutaArchivo);
                        Console.WriteLine($"[FIRMA][BINARIO] Generado OK. Bytes={bytes.Length}, Ruta={pdf.rutaArchivo}");
                    }
                    else
                    {
                        Console.WriteLine($"[FIRMA][BINARIO] No existe archivo para validar binario. Ruta={pdf.rutaArchivo}");
                    }
                }

                //}
                rpta = true;

                return rpta;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                Console.WriteLine($"[FIRMA][ITEXT][ERROR] ruta={pdf.rutaArchivo} msg={e.Message}");
                rpta = false;
                return rpta;
            }
        }

        private class FooterHandler : IEventHandler
        {
            public Dictionary<string, string> Parameters { get; set; }
            //public bool footer = false;

            public void HandleEvent(Event @event)
            {
                iText.Kernel.Events.PdfDocumentEvent docEvent = (iText.Kernel.Events.PdfDocumentEvent)@event;
                iText.Kernel.Pdf.PdfDocument pdfDoc = docEvent.GetDocument();
                iText.Kernel.Pdf.PdfPage page = docEvent.GetPage();

                iText.Kernel.Geom.Rectangle pageSize = page.GetPageSize();
                iText.Kernel.Pdf.Canvas.PdfCanvas canvas = new iText.Kernel.Pdf.Canvas.PdfCanvas(page.NewContentStreamBefore(), page.GetResources(), pdfDoc);

                // Get the value from the parameters
                string paramTipo = Parameters["Tipo"];
                string paramNombres = Parameters["Nombres"];
                string paramServicio = Parameters["Servicio"];
                string paramCama = Parameters["Cama"];
                string paramCuenta = Parameters["Cuenta"];
                string paramHistoria = Parameters["Historia"];
                string paramEdad = Parameters["Edad"];
                string paramMovimiento = Parameters["Movimiento"];
                string paramItem = Parameters["Item"];
                string paramFormatoHoja = Parameters["FormatoHoja"];
                string paramFirmador1 = Parameters["Firmador1"];
                string paramTipoFirmador1 = Parameters["TipoFirmador1"];
                string paramFirmador2 = Parameters["Firmador2"];
                string paramTipoFirmador2 = Parameters["TipoFirmador2"];

                var AppMensajePiePagina = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:DescripcionPiePagina");                
                string MensajePiePagina = AppMensajePiePagina.ToString();

                int widthHoja = 0;
                int leftHoja = 0;
                int bottomHoja = 0;
                int bottomHojaFirma = 0;
                float fontSize = 0;
                float fontSizeFirma = 0;
                if (paramFormatoHoja == "A5")
                {
                    fontSize = 7.3f;
                    widthHoja = 370;        //348
                    leftHoja = 26;
                    bottomHoja = 15;
                    bottomHojaFirma = 80;
                    fontSizeFirma = 9f;
                }
                else
                {
                    fontSize = 7f;
                    widthHoja = 523;
                    leftHoja = 36;
                    bottomHoja = 15;
                    bottomHojaFirma = 80;
                    fontSizeFirma = 8f;
                }

                iText.Layout.Element.Paragraph footer = new iText.Layout.Element.Paragraph("This is the footer ");
                //.SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                //.SetFontSize(10)
                //.SetFixedPosition(pageSize.GetWidth() / 2, 20, pageSize.GetWidth() / 2);

                //////////////////////////KHOYOSI -- OBTENER ID PRODUCTO TAMIZAJE/////////////////////////////////
                var tamizaje = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IdProductoTamizaje");
                string idCptTamizaje = tamizaje.ToString();
                /////////////////////////////////////////////////////////////////////////////////////////////////
                ///
                //////////////////////////KHOYOSI -- OBTENER ID GRUPO TAMIZAJE/////////////////////////////////
                var tamizajeGrupo = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IdGrupoTamizaje");
                string idGrupoTamizaje = tamizajeGrupo.ToString();
                /////////////////////////////////////////////////////////////////////////////////////////////////

                if (paramTipo == "LAB-RES" || paramTipo == "LAB-RES-GRUPO" || paramTipo == "IMG-RES")
                {
                    fontSize = 10f;
                    widthHoja = 523;

                    float[] parametrosValores = new float[] { 0f }; ;
                    
                    if (paramTipo == "LAB-RES" || paramTipo == "LAB-RES-GRUPO")
                    {
                        parametrosValores = new float[] { 33f, 20f, 8f, 8f, 10f, 10f, 11f };
                        fontSize = 10f;
                    } 
                    else if(paramTipo == "IMG-RES")
                    {
                        leftHoja = 22;
                        widthHoja = 550;
                        bottomHoja = 5;
                        bottomHojaFirma = 70;
                        parametrosValores = new float[] { 43f, 26f, 10f, 10f, 11f };
                        fontSize = 8f;
                    }
                    
                    iText.Layout.Element.Table table = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(parametrosValores))
                    .SetFontSize(fontSize)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHoja, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                    iText.Layout.Element.Table tableFirma = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(new float[] { 45f, 10f, 45f }))
                    .SetFontSize(fontSizeFirma)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHojaFirma, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                    if ((paramTipo == "LAB-RES" && paramItem != idCptTamizaje) || (paramTipo == "LAB-RES-GRUPO" && paramItem != idGrupoTamizaje) || paramTipo == "IMG-RES")       //si es producto tamizaje, no agregar pie de pagina
                    {

                        if(paramTipo == "IMG-RES")
                        {
                            tableFirma.AddCell(new iText.Layout.Element.Cell()
                                      .Add(new iText.Layout.Element.Paragraph(paramFirmador1)                                      
                                      .SetFontColor(ColorConstants.DARK_GRAY))
                                      .SetPadding(0)
                                      .SetBorder(iText.Layout.Borders.Border.NO_BORDER)
                                      .SetBorderTop(new SolidBorder(1)));
                            tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                            if(paramFirmador2 != "")
                            {
                                tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER).SetBorderTop(new SolidBorder(1)));
                            }
                            else
                            {
                                tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                            }                            

                            tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador1).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                            tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                            if (paramFirmador2 != "")
                            {
                                tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                            }
                            else
                            {
                                tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                            }
                            
                        }

                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("APELLIDOS Y NOMBRES").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("SERVICIO").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                        if (paramTipo == "LAB-RES" || paramTipo == "LAB-RES-GRUPO")
                        {
                            table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CAMA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                            table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("EDAD").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                        }                        
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CUENTA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));                        
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("MOVIMIENTO").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("HISTORIA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));                        

                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramNombres)));
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramServicio)));
                        if (paramTipo == "LAB-RES" || paramTipo == "LAB-RES-GRUPO")
                        {
                            table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCama)));
                            table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramEdad)));
                        }                            
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCuenta)));                        
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramMovimiento)));
                        table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramHistoria)));                        
                    } 
                    
                    table.AddCell(new iText.Layout.Element.Cell(0, parametrosValores.Length)
                    .Add(new iText.Layout.Element.Paragraph(MensajePiePagina))
                        .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED)
                        .SetFontColor(ColorConstants.DARK_GRAY)
                        .SetFontSize(6)
                    .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                    new iText.Layout.Canvas(canvas, pageSize)
                    .Add(tableFirma)
                    .Add(table);
                } 
                else if(paramTipo == "UCI-EVA")
                {
                    iText.Layout.Element.Table table = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(new float[] { 40f, 26f, 10f, 12f, 12f, 12f }))
                    .SetFontSize(fontSize)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHoja, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("APELLIDOS Y NOMBRES").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("SERVICIO").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CAMA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("EDAD").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CUENTA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("HISTORIA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramNombres)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramServicio)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCama)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramEdad)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCuenta)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramHistoria)));                    

                    table.AddCell(new iText.Layout.Element.Cell(0, 6)
                    .Add(new iText.Layout.Element.Paragraph(MensajePiePagina))
                        .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED)
                        .SetFontColor(ColorConstants.DARK_GRAY)
                        .SetFontSize(6)
                    .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                    new iText.Layout.Canvas(canvas, pageSize)
                    .Add(table);

                }
                else if(paramTipo == "HO-PIE")
                {
                    iText.Layout.Element.Table table = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(new float[] { 40f, 26f, 10f, 12f}))
                    .SetFontSize(fontSize)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHoja, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("PACIENTE").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("SERVICIO").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CUENTA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("HISTORIA CLINICA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramNombres)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramServicio)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCuenta)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramHistoria)));                    

                    table.AddCell(new iText.Layout.Element.Cell(0, 4)
                    .Add(new iText.Layout.Element.Paragraph(MensajePiePagina))
                        .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED)
                        .SetFontColor(ColorConstants.DARK_GRAY)
                        .SetFontSize(6)
                    .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                    new iText.Layout.Canvas(canvas, pageSize)
                    .Add(table);

                } 
                else if(paramTipo == "H-EVA")
                {
                    
                    float[] parametrosValores = new float[] { 0f };
                    float[] parametrosValoresFirma = new float[] { 0f };

                    leftHoja = 22;
                    widthHoja = 550;
                    bottomHoja = 5;
                    bottomHojaFirma = 70;                    
                    fontSize = 7f;
                    fontSizeFirma = 7.5f;

                    if (paramFirmador2 != "")
                    {
                        parametrosValoresFirma = new float[] { 45f, 10f, 45f };
                    }
                    else
                    {
                        parametrosValoresFirma = new float[] { 27f, 46f, 27f };
                    }
                    parametrosValores = new float[] { 43f, 26f, 10f, 10f, 11f };

                    
                    iText.Layout.Element.Table tableFirma = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(parametrosValoresFirma))
                    .SetFontSize(fontSizeFirma)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHojaFirma, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                    if (paramFirmador2 != "")
                    {
                        tableFirma.AddCell(new iText.Layout.Element.Cell()
                                      .Add(new iText.Layout.Element.Paragraph(paramFirmador1)
                                      .SetFontColor(ColorConstants.DARK_GRAY))
                                      .SetPadding(0)
                                      .SetBorder(iText.Layout.Borders.Border.NO_BORDER)
                                      .SetBorderTop(new SolidBorder(1)));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell()
                                      .Add(new iText.Layout.Element.Paragraph(paramFirmador2)
                                      .SetFontColor(ColorConstants.DARK_GRAY))
                                      .SetPadding(0)
                                      .SetBorder(iText.Layout.Borders.Border.NO_BORDER)
                                      .SetBorderTop(new SolidBorder(1)));

                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER).SetBorderTop(new SolidBorder(1)));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));                        
                    }
                    else
                    {
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell()
                                      .Add(new iText.Layout.Element.Paragraph(paramFirmador1)
                                      .SetFontColor(ColorConstants.DARK_GRAY))
                                      .SetPadding(0)
                                      .SetBorder(iText.Layout.Borders.Border.NO_BORDER)
                                      .SetBorderTop(new SolidBorder(1)));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador1).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                    }


                    
                    //if (paramFirmador2 != "")
                    //{
                        
                    //}
                    //else
                    //{
                        
                    //}

                    //tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador1).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                    //tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                    //if (paramFirmador2 != "")
                    //{
                    //    tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                    //}
                    //else
                    //{
                    //    tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                    //}


                    iText.Layout.Element.Table table = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(parametrosValores))
                    .SetFontSize(fontSize)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHoja, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("APELLIDOS Y NOMBRES").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("SERVICIO").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CAMA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CUENTA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));                    
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("HISTORIA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramNombres)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramServicio)));

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCama)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCuenta)));                    
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramHistoria)));

                    table.AddCell(new iText.Layout.Element.Cell(0, parametrosValores.Length)
                    .Add(new iText.Layout.Element.Paragraph(MensajePiePagina))
                        .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED)
                        .SetFontColor(ColorConstants.DARK_GRAY)
                        .SetFontSize(6)
                    .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                    new iText.Layout.Canvas(canvas, pageSize)
                    .Add(tableFirma)
                    .Add(table);
                }
                else
                {
                    
                    iText.Layout.Element.Table table = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(new float[] { 40f, 26f, 10f, 12f, 12f }))
                    .SetFontSize(fontSize)
                    .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                    .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHoja, widthHoja)
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                                        
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("APELLIDOS Y NOMBRES").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("SERVICIO").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CAMA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("CUENTA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph("HISTORIA").SetBold().SetFontColor(ColorConstants.DARK_GRAY)).SetBackgroundColor(new DeviceRgb(215, 215, 215)));

                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramNombres)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramServicio)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCama)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramCuenta)));
                    table.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramHistoria)));


                    if (paramTipo == "CE-A" || paramTipo == "H-EVA" || paramTipo == "INF-RS")
                    {
                        iText.Layout.Element.Table tableFirma = new iText.Layout.Element.Table(iText.Layout.Properties.UnitValue.CreatePercentArray(new float[] { 25f, 50f, 25f }))
                        .SetFontSize(fontSizeFirma)
                        .SetWidth(iText.Layout.Properties.UnitValue.CreatePointValue(widthHoja))
                        .SetFixedPosition(pageSize.GetLeft() + leftHoja, pageSize.GetBottom() + bottomHojaFirma, widthHoja)
                        .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

                        tableFirma.AddCell(new iText.Layout.Element.Cell()
                                  .Add(new iText.Layout.Element.Paragraph(" ")
                                  .SetFontColor(ColorConstants.DARK_GRAY))
                                  .SetPadding(0)
                                  .SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell()
                                  .Add(new iText.Layout.Element.Paragraph(paramFirmador1)
                                  .SetFontColor(ColorConstants.DARK_GRAY))
                                  .SetPadding(0)
                                  .SetBorder(iText.Layout.Borders.Border.NO_BORDER)
                                  .SetBorderTop(new SolidBorder(1)));
                        tableFirma.AddCell(new iText.Layout.Element.Cell()
                                  .Add(new iText.Layout.Element.Paragraph(" ")
                                  .SetFontColor(ColorConstants.DARK_GRAY))
                                  .SetPadding(0)
                                  .SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        //if (paramFirmador2 != "")
                        //{
                        //    tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER).SetBorderTop(new SolidBorder(1)));
                        //}
                        //else
                        //{
                        //    tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        //}
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador1).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        //if (paramFirmador2 != "")
                        //{
                        //    tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(paramTipoFirmador2).SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        //}
                        //else
                        //{
                        //    tableFirma.AddCell(new iText.Layout.Element.Cell().Add(new iText.Layout.Element.Paragraph(" ").SetFontColor(ColorConstants.DARK_GRAY)).SetPadding(0).SetBorder(iText.Layout.Borders.Border.NO_BORDER));
                        //}

                        table.AddCell(new iText.Layout.Element.Cell(0, 5)
                        .Add(new iText.Layout.Element.Paragraph(MensajePiePagina))
                            .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED)
                            .SetFontColor(ColorConstants.DARK_GRAY)
                            .SetFontSize(6)
                        .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                            new iText.Layout.Canvas(canvas, pageSize)
                            .Add(tableFirma)
                            .Add(table);
                    } 
                    else
                    {
                        table.AddCell(new iText.Layout.Element.Cell(0, 5)
                        .Add(new iText.Layout.Element.Paragraph(MensajePiePagina))
                            .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED)
                            .SetFontColor(ColorConstants.DARK_GRAY)
                            .SetFontSize(6)
                        .SetBorder(iText.Layout.Borders.Border.NO_BORDER));

                            new iText.Layout.Canvas(canvas, pageSize)
                            .Add(table);
                    }

                    
                }

                //.SetProperty(iText.Layout.Properties.Property, 1); 

                // Add cells to the table
                                
                canvas.Release();
            }
        }


        public async Task<MemoryStream> GenerarArchivoEnMemoriaPdfV2(FormatoPdf pdf)
        {
            ClUtilirario clUtilitario = new ClUtilirario();
            //MemoryStream ms = new MemoryStream();
            MemoryStream outputStream = new MemoryStream();
            ConverterProperties props = new ConverterProperties();

            FooterHandler footerHandler = new FooterHandler();

            props.SetBaseUri("ruta/a/los/archivos/relativos/");
            

            try
            {
                iText.Kernel.Pdf.PdfWriter writer = new iText.Kernel.Pdf.PdfWriter(outputStream);
                iText.Kernel.Pdf.PdfDocument pdfd = new iText.Kernel.Pdf.PdfDocument(writer);
                iText.Layout.Document document;
                iText.Kernel.Geom.PageSize pageSize = null;

                if (pdf.tipoDocumento == "Ticket")
                {
                    pageSize = new iText.Kernel.Geom.PageSize(225, 859);
                    //pageSize = iText.Kernel.Geom.PageSize.A7;
                    document = new iText.Layout.Document(pdfd, pageSize);
                }
                else if(pdf.tipoDocumento == "Personalizado")
                {
                    pageSize = new iText.Kernel.Geom.PageSize(pdf.width, pdf.height);
                    document = new iText.Layout.Document(pdfd, pageSize);
                }
                else
                {
                    if (pdf.orientacion == "Portrait")
                    {
                        pageSize = iText.Kernel.Geom.PageSize.A4;       //x=595f y=842f,
                    }
                    else if (pdf.orientacion == "Landscape")
                    {
                        pageSize = iText.Kernel.Geom.PageSize.A4.Rotate();
                    }
                    
                    //iText.Kernel.Geom.PageSize pageSize = new iText.Kernel.Geom.PageSize(668, 935);
                    document = new iText.Layout.Document(pdfd, pageSize);
                }


                if (pdf.stringHtml != null)
                {
                    byte[] byteArray = Encoding.UTF8.GetBytes(pdf.stringHtml.ToString());
                    // Obtener el contenido de la URL como un stream
                    using (Stream htmlStream = new MemoryStream(byteArray))
                    {
                        if (pdf.tipo == "HO-PIE")
                        {
                            Dictionary<string, string> parametros = new Dictionary<string, string>
                                {
                                    { "Tipo", pdf.tipo },
                                    { "Nombres", pdf.Paciente },
                                    { "Servicio", pdf.Servicio },
                                    { "Cama", pdf.Cama },
                                    { "Cuenta", pdf.Cuenta },
                                    { "Edad", pdf.Edad },
                                    { "Historia", pdf.Historia },
                                    { "Movimiento", pdf.Movimiento },
                                    { "Item", pdf.Item },
                                    { "FormatoHoja", pdf.tamanio },
                                    { "Firmador1", pdf.Firmador1 },
                                    { "TipoFirmador1", pdf.TipoFirmador1 },
                                    { "Firmador2", pdf.Firmador2 },
                                    { "TipoFirmador2", pdf.TipoFirmador2 }
                                };
                            footerHandler.Parameters = parametros;
                            pdfd.AddEventHandler(PdfDocumentEvent.END_PAGE, footerHandler);

                        }

                        // Realizar las operaciones necesarias con el stream
                        HtmlConverter.ConvertToPdf(htmlStream, pdfd, props);
                    }
                }
                else
                {
                    /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
                    var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
                    var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
                    string IpPrivada = AppNameIp1.ToString();
                    string IpPublica = AppNameIp2.ToString();
                    pdf.pageHtml = pdf.pageHtml.Replace(IpPublica, IpPrivada);
                    ////////////////////////////////////////////////////////////////////////////

                    using (HttpClient httpClient = new HttpClient())
                    {
                        // Obtener el contenido de la URL como un stream
                        using (Stream htmlStream = await httpClient.GetStreamAsync(pdf.pageHtml))
                        {
                            if (pdf.tipo == "HO-PIE")
                            {
                                Dictionary<string, string> parametros = new Dictionary<string, string>
                                {
                                    { "Tipo", pdf.tipo },
                                    { "Nombres", pdf.Paciente },
                                    { "Servicio", pdf.Servicio },
                                    { "Cama", pdf.Cama },
                                    { "Cuenta", pdf.Cuenta },
                                    { "Edad", pdf.Edad },
                                    { "Historia", pdf.Historia },
                                    { "Movimiento", pdf.Movimiento },
                                    { "Item", pdf.Item },
                                    { "FormatoHoja", pdf.tamanio },
                                    { "Firmador1", pdf.Firmador1 },
                                    { "TipoFirmador1", pdf.TipoFirmador1 },
                                    { "Firmador2", pdf.Firmador2 },
                                    { "TipoFirmador2", pdf.TipoFirmador2 }
                                };
                                footerHandler.Parameters = parametros;
                                pdfd.AddEventHandler(PdfDocumentEvent.END_PAGE, footerHandler);

                            }
                            // Realizar las operaciones necesarias con el stream
                            HtmlConverter.ConvertToPdf(htmlStream, pdfd, props);
                        }
                    }

                    document.Close();
                    pdfd.Close();
                    writer.Close();

                }

                //}
                //rpta = true;

                
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                //rpta = false;
                //return Json(new { exep = e.ToString() });
                //return rpta;
            }

            return outputStream;
        }

        
        ////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////VERSION CON HtmlToPdf///////////////////////////////////////////////
        public Boolean GenerarArchivoPdf(FormatoPdf pdf)
        {
            HtmlToPdf ohtml = new HtmlToPdf();
            ClUtilirario clUtilitario = new ClUtilirario();
            SelectPdf.PdfDocument obPdfDoc;
            bool rpta = false;

            try
            {
                ohtml.Options.PdfPageOrientation = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), pdf.orientacion, true);       //orientacion => "Portrait", "Landscape"
                ohtml.Options.PdfPageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), pdf.tamanio, true);           //formato => "A4"
                ohtml.Options.MarginLeft = pdf.marginX;
                ohtml.Options.MarginRight = pdf.marginX;
                ohtml.Options.MarginTop = pdf.marginY;
                ohtml.Options.MarginBottom = pdf.marginY;

                if(pdf.orientacion == "Portrait")
                {
                    ohtml.Options.WebPageWidth = 793;
                    ohtml.Options.WebPageHeight = 1145;
                } else if(pdf.orientacion == "Landscape")
                {
                    ohtml.Options.WebPageWidth = 1122;
                    ohtml.Options.WebPageHeight = 773;
                }                

                if(pdf.stringHtml != null)
                {
                    obPdfDoc = ohtml.ConvertHtmlString(pdf.stringHtml.ToString());
                } 
                else
                {
                    /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
                    var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
                    var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
                    string IpPrivada = AppNameIp1.ToString();
                    string IpPublica = AppNameIp2.ToString();
                    pdf.pageHtml = pdf.pageHtml.Replace(IpPublica, IpPrivada);
                    ////////////////////////////////////////////////////////////////////////////
                    
                    obPdfDoc = ohtml.ConvertUrl(pdf.pageHtml);

                }
                
                obPdfDoc.Save(pdf.rutaArchivo);

                rpta = true;
                
                return rpta;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                rpta = false;
                return rpta;
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////

        public async Task<String> GenerarRutaArchivoPdf(int idCuentaAtencion, int idTipoServicio, string tipoDocumento)
        {
            DataSet lsAtencion;
            //bool rpta = false;
            string ruta, /*archivo,*/ sWebRootFolder, /*idAtencion,*/ nroHistoria, tipoServicio;
            DalAtenciones daoAtenciones = new DalAtenciones();
            ClUtilirario clUtilitario = new ClUtilirario();
            Conexion con = new Conexion();
            
            try
            {
                if (idTipoServicio == 1)
                {
                    tipoServicio = "ConsultaExterna";
                }
                else if (idTipoServicio == 2 || idTipoServicio == 4)
                {
                    tipoServicio = "Emergencia";
                }
                else if (idTipoServicio == 3)
                {
                    tipoServicio = "Hospitalizacion";
                }
                else
                {
                    tipoServicio = "Otros";
                }

                if (idCuentaAtencion > 0)
                {
                    lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
                    //idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
                    nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

                    if (tipoDocumento == "CE-A")
                    {
                        tipoDocumento = "Atenciones";
                    }
                    else if (tipoDocumento == "REC")
                    {
                        tipoDocumento = "Recetas";
                    }
                    else if (tipoDocumento == "RF" || tipoDocumento == "CRF")
                    {
                        tipoDocumento = "HojasRefCon";
                    }
                    else if (tipoDocumento == "FUA")
                    {
                        tipoDocumento = "FUA";
                    }
                    else if (tipoDocumento == "E-EVA")
                    {
                        tipoDocumento = "Evaluaciones";
                    }
                    else if (tipoDocumento == "CN")
                    {
                        tipoDocumento = "ConstanciasNacimiento";
                    }
                    else if (tipoDocumento == "LAB-RES" || tipoDocumento == "LAB-RES-GRUPO")
                    {
                        tipoDocumento = "ResultadosLaboratorio";
                    }
                    else if (tipoDocumento == "IMG-RES")
                    {
                        tipoDocumento = "ResultadosImagenes";
                    }else if (tipoDocumento == "E-PH")
                    {
                        tipoDocumento = "PapeletasHospitalizacion";
                    }
                    else if (tipoDocumento == "E-PHF")
                    {
                        tipoDocumento = "PapeletasHospitalizacionFam";
                    }
                    else if (tipoDocumento == "E-PEM")
                    {
                        tipoDocumento = "PapeletasExoneracionMedica";
                    }
                    else if (tipoDocumento == "E-PE")
                    {
                        tipoDocumento = "PapeletasEgreso";
                    }

                    ruta = nroHistoria + "/" + tipoServicio + "/" + idCuentaAtencion + "/" + tipoDocumento + "/";                    
                }
                else
                {
                    if (tipoDocumento == "CE-PD")
                    {
                        tipoDocumento = "PartesDiarios";
                    }
                    else if (tipoDocumento == "CN")
                    {
                        tipoDocumento = "ConstanciasNacimiento";
                    }
                    else if (tipoDocumento == "LAB-RES" || tipoDocumento == "LAB-RES-GRUPO")
                    {
                        tipoDocumento = "ResultadosLaboratorio";
                    }
                    else if (tipoDocumento == "IMG-RES")
                    {
                        tipoDocumento = "ResultadosImagenes";
                    }
                    else if (tipoDocumento == "E-PH")
                    {
                        tipoDocumento = "PapeletasHospitalizacion";
                    }
                    else if (tipoDocumento == "E-PHF")
                    {
                        tipoDocumento = "PapeletasHospitalizacionFam";
                    }
                    else if (tipoDocumento == "E-PEM")
                    {
                        tipoDocumento = "PapeletasExoneracionMedica";
                    }
                    else if (tipoDocumento == "E-PE")
                    {
                        tipoDocumento = "PapeletasEgreso";
                    }

                    ruta = tipoServicio + "/" + tipoDocumento + "/";                    
                }

                //sWebRootFolder = con.ObtenerServidorArchivos();
                sWebRootFolder = con.ObtenerServidorArchivosSinFirma();
                if (!Directory.Exists(Path.Combine(sWebRootFolder, ruta)))
                {
                    Directory.CreateDirectory(Path.Combine(sWebRootFolder, ruta));
                }

                ruta = sWebRootFolder + ruta;
                //rpta = true;

                return ruta;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                //rpta = false;
                return "";
            }
        }
        public async Task<String> GenerarNombreArchivoPdf(FirmaDigital firma)
        {
            string nombre;
            
            nombre = firma.idCuentaAtencion.ToString() + "_" + firma.idRegistro.ToString() + "_" + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "_" + firma.tipo;
            nombre = await EncriptarNombre(nombre);
            
            return nombre;
        }

        public async Task<String> GenerarCodeArchivoPdf(FirmaDigital firma)
        {
            string code;

            code = firma.idCuentaAtencion.ToString() + "_" + firma.idRegistro.ToString() + "_" + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "_" + firma.tipo;
            code = await EncriptarCode(code);

            return code;
        }

        public Boolean MoverArchivoPdf(string rutaFolder, string nombreArchivo)
        {
            bool resp = false;
            Conexion con = new Conexion();
            
            string rutaOrigen, rutaOrigenFirma;
            string rutaHistorial, rutaHistorialFirma;

            //sWebRootFolder = con.ObtenerServidorArchivos();

            //rutaOrigen = sWebRootFolder + rutaFolder + nombreArchivo;
            //rutaHistorial = sWebRootFolder + "history" + rutaFolder;

            //rutaOrigenFirma = sWebRootFolder + "/4IdentitySignedFiles/" + rutaFolder + nombreArchivo;
            //rutaHistorialFirma = sWebRootFolder + "/history/4IdentitySignedFiles/" + rutaFolder;

            try
            {
                rutaFolder = rutaFolder.Replace("/UNSIGNED", "");

                rutaOrigen = con.ObtenerServidorArchivosSinFirma() + rutaFolder + nombreArchivo;
                rutaHistorial = con.ObtenerServidorArchivosHistorial() + "/UNSIGNED/" + rutaFolder;

                rutaOrigenFirma = con.ObtenerServidorArchivosConFirma() + rutaFolder + nombreArchivo;
                rutaHistorialFirma = con.ObtenerServidorArchivosHistorial() + "/SIGNED/" + rutaFolder;

                if (!Directory.Exists(rutaHistorial))
                {
                    Directory.CreateDirectory(rutaHistorial);
                }

                if (!Directory.Exists(rutaHistorialFirma))
                {
                    Directory.CreateDirectory(rutaHistorialFirma);
                }

                rutaHistorial = rutaHistorial + nombreArchivo;
                if (System.IO.File.Exists(rutaOrigen))
                {
                    System.IO.File.Copy(rutaOrigen, rutaHistorial, true);
                    System.IO.File.Delete(rutaOrigen);
                }

                rutaHistorialFirma = rutaHistorialFirma + nombreArchivo;
                if (System.IO.File.Exists(rutaOrigenFirma))
                {
                    System.IO.File.Copy(rutaOrigenFirma, rutaHistorialFirma, true);
                    System.IO.File.Delete(rutaOrigenFirma);
                }

                resp = true;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }

            

            return resp;
        }
        /////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////IMAGENES ADJUNTAS////////////////////////////////////////////////
        public async Task<String> GenerarRutaArchivoImage(int idCuentaAtencion, string tipoDocumento)
        {
            DataSet lsAtencion;
            //bool rpta = false;
            string ruta, /*archivo,*/ sWebRootFolder, /*idAtencion,*/ nroHistoria, tipoServicio;
            DalAtenciones daoAtenciones = new DalAtenciones();
            ClUtilirario clUtilitario = new ClUtilirario();
            Conexion con = new Conexion();

            try
            {
                if (idCuentaAtencion > 0)
                {
                    lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

                    string idTipoServicio = lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString();

                    if (idTipoServicio == "1")
                    {
                        tipoServicio = "ConsultaExterna";
                    }
                    else if (idTipoServicio == "2" || idTipoServicio == "4")
                    {
                        tipoServicio = "Emergencia";
                    }
                    else if (idTipoServicio == "3")
                    {
                        tipoServicio = "Hospitalizacion";
                    }
                    else
                    {
                        tipoServicio = "Otros";
                    }



                    //idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
                    nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

                    if (tipoDocumento == "LAB-RES")
                    {
                        tipoDocumento = "ResultadosImgLaboratorio";
                    }
                    else if (tipoDocumento == "IMG-RES")
                    {
                        tipoDocumento = "ResultadosImgImagenes";
                    }

                    ruta = nroHistoria + "/" + tipoServicio + "/" + idCuentaAtencion + "/" + tipoDocumento + "/";
                }
                else
                {
                    tipoServicio = "Otros";

                    if (tipoDocumento == "LAB-RES")
                    {
                        tipoDocumento = "ResultadosImgLaboratorio";
                    }
                    else if (tipoDocumento == "IMG-RES")
                    {
                        tipoDocumento = "ResultadosImgImagenes";
                    }

                    ruta = tipoServicio + "/" + tipoDocumento + "/";
                }

                //sWebRootFolder = con.ObtenerServidorArchivos();
                sWebRootFolder = con.ObtenerServidorArchivosSinFirma();
                if (!Directory.Exists(Path.Combine(sWebRootFolder, ruta)))
                {
                    Directory.CreateDirectory(Path.Combine(sWebRootFolder, ruta));
                }

                ruta = sWebRootFolder + ruta;
                //rpta = true;

                return ruta;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                //rpta = false;
                return "";
            }
        }

        public async Task<String> GenerarNombreArchivoImage(int idCuentaAtencion, int idRegistro, string tipo)
        {
            string nombre;

            nombre = idCuentaAtencion.ToString() + "_" + idRegistro.ToString() + "_" + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "_" + tipo;
            nombre = await EncriptarNombre(nombre);

            return nombre;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////KHOYOSI//////////////////////////////////////////        
        public async Task<string> EncriptarNombre(string texto)
        {
            DalUtilitario utilitario = new DalUtilitario();
            Boolean resp = true;
            string alfabeto = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"; //tamaño 52
            //string cadena = "KEVIN";
            //string token = "";
            string encriptado = "";
            int i;
            int l = texto.Length;
            var seed = Environment.TickCount;
            var random = new Random(seed);
            int ind;

            try
            {
                while (resp)
                {
                    i = 0;
                    encriptado = "";
                    while (i < l)
                    {
                        ind = random.Next(1, 52);
                        encriptado = encriptado + alfabeto[ind];
                        i++;
                    }                    
                    resp = await utilitario.ValidarNombreFirmaDigital(encriptado);
                }                

                return encriptado;
            }
            catch (Exception ex)
            {
                return ex.ToString() ;
            }
        }

        public async Task<string> EncriptarNombreArchivo(string texto)
        {
            DalUtilitario utilitario = new DalUtilitario();
            Boolean resp = true;
            string alfabeto = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"; //tamaño 52
            //string cadena = "KEVIN";
            //string token = "";
            string encriptado = "";
            int i;
            int l = texto.Length;
            var seed = Environment.TickCount;
            var random = new Random(seed);
            int ind;

            try
            {
                while (resp)
                {
                    i = 0;
                    encriptado = "";
                    while (i < l)
                    {
                        ind = random.Next(1, 52);
                        encriptado = encriptado + alfabeto[ind];
                        i++;
                    }
                    resp = false;
                }

                return encriptado;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public async Task<string> EncriptarCode(string texto)
        {
            DalUtilitario utilitario = new  DalUtilitario();
            Boolean resp = true;
            string code = "";
            var objEncripta = new Encriptar();
            try
            {
                while (resp)
                {                    
                    code = objEncripta.EncriptarCadena(texto);
                    resp = await utilitario.ValidarCodeFirmaDigital(code);
                }

                return code;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string CodificarDeUrl(string cadena)
        {
            try
            {
                cadena = cadena.Replace("%", "%25");
                cadena = cadena.Replace("+", "%3F%3F%3F");
                cadena = cadena.Replace(" ", "%20");
                cadena = cadena.Replace("/", "%2F");
                cadena = cadena.Replace("?", "%3F");
                cadena = cadena.Replace("#", "%23");
                cadena = cadena.Replace("&", "%26");
                cadena = cadena.Replace("=", "%3D");

                return cadena;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string DecodificarDeUrl(string cadena)
        {            
            try
            {
                cadena = cadena.Replace("%3F%3F%3F", "+");
                cadena = cadena.Replace("???", "+");
                cadena = cadena.Replace("%20", " ");
                cadena = cadena.Replace("%2F", "/");
                cadena = cadena.Replace("%3F", "?");
                cadena = cadena.Replace("%25", "%");
                cadena = cadena.Replace("%23", "#");
                cadena = cadena.Replace("%26", "&");
                cadena = cadena.Replace("%3D", "=");

                return cadena;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpGet]
        public async Task<ActionResult> EstablecimientosSeleccionarTodosV2()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.ListaEstablecimientosSaludTodosV2();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> FiltrarMedicos(string CodigoPlanilla, string ApellidoPaterno, string ApellidoMaterno, string Nombres, int IdEspecialidad)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.FiltrarMedicos(CodigoPlanilla, ApellidoPaterno, ApellidoMaterno, Nombres, IdEspecialidad);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpGet]
        public async Task<ActionResult> TiposEdadSeleccionarTodosV2()  // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.TiposEdadSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> FiltrarMedicosTamizaje()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalUtili.FiltrarMedicosTamizaje();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarDocumentoFirmaDigital(int idCuentaAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarDocumentoFirmaDigital(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarResultadosLabImg(int idOrden, int idProducto, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultados;
            DalUtilitario dalUtili = new DalUtilitario();
            lsResultados = await dalUtili.ListarResultadosLabImg(idOrden, idProducto, tipo);

            return Json(new { lsResultados = lsResultados, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarResultadosLaboratorioByIdCuentaAtencion(int idCuentaAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarResultadosLaboratorioByIdCuentaAtencion(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        ///////////////////////TRANSFERENCIAS (KHOYOSI//////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> GuardarTransferencias(int idAtencion, int idPaciente, int idMedicoOrden, int idMedicoRecibe, string fecha, string hora, int idCama, int idServicio, int llegoAlServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();
            
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                resp = await daoUtilitario.GuardarTransferencias(idAtencion, idPaciente, idMedicoOrden, idMedicoRecibe, fecha, hora, idCama, idServicio, llegoAlServicio, idUsuario);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Guardar Trasnferencias): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ModificarEstanciaHospitalariaLlegada(int idEstanciaHosp, int idCama)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                resp = await daoUtilitario.ModificarEstanciaHospitalariaLlegada(idEstanciaHosp, idCama, idUsuario);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Guardar Llegada al servicio): " + ex });
            }

        }
        ////////////////////////////////////////////////////////////////////////////////
        ///
        [HttpGet]
        public async Task<ActionResult> TiposDestinoAtencionHospitalizacion()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.TiposDestinoAtencionHospitalizacion();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> SeleccionarCamaByIdServicio(int IdServicio)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.SeleccionarCamaByIdServicio(IdServicio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }


        /////////////////////////KHOYOSI////////////////////////////////////////////////////////////////////////////
        [HttpGet]
        public async Task<ActionResult> ListarTiposTurnosLaborales()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarTiposTurnosLaborales();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> ListarEstadosHojaOcurrenciaMedica()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarEstadosHojaOcurrenciaMedica();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////////////////////////CONTROL ASISTENCIA////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarMedicosControlAsistencia()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarMedicosControlAsistencia();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpPost]
        public async Task<ActionResult> ListarMedicosPorMarcacionPorTurnoControlAsistencia(string fecha, int idTurno)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarMedicosPorMarcacionPorTurnoControlAsistencia(fecha, idTurno);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        public async Task<ActionResult> ConsultarStockProductoPorFarmacia(int idAlmacen, int idProducto) // JDELGADOPM
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ConsultarStockProductoPorFarmacia(idAlmacen, idProducto);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        ///////////////////////KHOYOSI///////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> GenerarAccionFlujoAtencionCE(int idAtencion, int idFlujo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                int idUsuario, idMedico;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
                resp = await daoUtilitario.GenerarAccionFlujoAtencionCE(idAtencion, idFlujo, idMedico);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Guardar Llegada al servicio): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarAccionFlujoAtencionTerapias(int idCita, int idFlujo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                int idUsuario, idMedico;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
                resp = await daoUtilitario.GenerarAccionFlujoAtencionTerapias(idCita, idFlujo, idMedico);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Guardar Llegada al servicio): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarAccionFlujoAtencionProcedimientos(int idCita, int idFlujo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                int idUsuario, idMedico;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
                resp = await daoUtilitario.GenerarAccionFlujoAtencionProcedimientos(idCita, idFlujo, idMedico);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Guardar Llegada al servicio): " + ex });
            }

        }

        ///////////////////////KHOYOSI////////////////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarVentanillas()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            //Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                //int idUsuario, idMedico;
                ds = await daoUtilitario.ListarVentanillas();

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Listar Ventanilla): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListaTurnosPorVentanilla(int idVentanilla)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            //Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                //int idUsuario, idMedico;
                ds = await daoUtilitario.ListaTurnosPorVentanilla(idVentanilla);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Listar Turnos por Ventanilla): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GenerarAccionFlujoAdmision(int idTurno, int idEstado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet ds;
            Boolean resp;
            DalUtilitario daoUtilitario = new DalUtilitario();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                resp = await daoUtilitario.GenerarAccionFlujoAdmision(idTurno, idEstado, idUsuario);

                return Json(new { respuesta = resp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (Actualziar estado turno ): " + ex });
            }

        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////KHOYOSI//////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListarEstadosRecetas()
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarEstadosRecetas();

            return Json(new { dataSet, estado = true, session = true });
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        ///

        //////////////////////////////////////KHOYOSI//////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ExamenLaboratorioResultadoItemSeleccionar(int idPaciente, string codigoCpt, int idItemGrupo, int idItem)
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ExamenLaboratorioResultadoItemSeleccionar(idPaciente, codigoCpt, idItemGrupo, idItem);

            return Json(new { dataSet, estado = true, session = true });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////


        [HttpPost]
        public async Task<ActionResult> RecetaCabeceraDetalleSeleccionaPorNroReceta(string IdReceta)
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.RecetaCabeceraDetalleSeleccionaPorNroReceta(IdReceta);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RecetaCabeceraDetalleSeleccionaPorComprobantePago(string NroSerie, string NroDocumento, int IdPuntoCarga)
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.RecetaCabeceraDetalleSeleccionaPorComprobantePago(NroSerie, NroDocumento, IdPuntoCarga);

            return Json(new { lstData = dataSet, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ListarTiposFinanciamientos()
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarTiposFinanciamientos();

            return Json(new { lstData = dataSet, estado = true, session = true });
        }

        public async Task<ActionResult> ServiciosFiltrar(string lcFiltro)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ServiciosFiltrar(lcFiltro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> MedicosFiltrar(string lcFiltro)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.MedicosFiltrar(lcFiltro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> TiposGravedadAtencionSeleccionarTodos()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.TiposGravedadAtencionSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpPost]
        public async Task<ActionResult> ListarTiposServiciosHosp()
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarTiposServiciosHosp();

            return Json(new { lsResultado = dataSet, estado = true, session = true });
        }

        [HttpGet]
        public async Task<ActionResult> TiposEdadSeleccionarTodos()  // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtilitario = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.TiposEdadSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> FuentesFinanciamientoSegunFiltro(string lcFiltro)  // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtilitario = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.FuentesFinanciamientoSegunFiltro(lcFiltro);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> TiposFinanciamientosTarifaSeleccionarPorPlan(int idFuenteFinanciamiento)  // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalUtilitario dalUtilitario = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.TiposFinanciamientosTarifaSeleccionarPorPlan(idFuenteFinanciamiento);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        public async Task<ActionResult> TipoFormatoSIS()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.TipoFormatoSIS();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        public async Task<ActionResult> TiposReferenciaSeleccionarTodos()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.TiposReferenciaSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }
        [HttpGet]
        public async Task<ActionResult> listarTipoServicio() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.listarTipoServicio();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaCausaExternaMorbilidadSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaCausaExternaMorbilidadSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaLugarEventoSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaLugarEventoSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaTipoEventoSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaTipoEventoSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaRelacionAgresorVictimaSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaRelacionAgresorVictimaSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaSeguridadSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaSeguridadSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaClaseAccidenteSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaClaseAccidenteSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaTipoVehiculoSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaTipoVehiculoSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaTipoTransporteSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaTipoTransporteSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaUbicacionLesionadoSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaUbicacionLesionadoSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaGrupoOcupacionalALABSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaGrupoOcupacionalALABSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaPosicionLesionadoALABSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaPosicionLesionadoALABSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> EmergenciaTipoAgenteAGANSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.EmergenciaTipoAgenteAGANSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> ListarFormasLLegada() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarFormasLLegada();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> ListarTipoAtencion_Derivacion() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarTipoAtencion_Derivacion();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> ListarServiciosMGP() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarServiciosMGP();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpGet]
        public async Task<ActionResult> DevuelveListaDeUsuariosDelSistema() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.DevuelveListaDeUsuariosDelSistema();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }



        [HttpPost]
        public async Task<ActionResult> ListarTiposParentesco()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet ds;
            DalUtilitario dalUtili = new DalUtilitario();
            ds = await dalUtili.ListarTiposParentesco();

            return Json(new { respuesta = ds, estado = true, session = true });
        }

        [HttpPost]
        public ActionResult CargarTipoModuloAtencion(string tipoModulo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }


            if (tipoModulo == "psicoprofilaxis")
            {                
                return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/ConsejeriaPsicoprofilaxis/RegistroConsejeriaPsicoprofilaxis.cshtml");
            }           
            else
            {                
                return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
            }


            //return PartialView("");
        }

        [HttpGet]
        public async Task<ActionResult> ListarDepartamentosHospital()
        {

            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarDepartamentosHospital();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo(string codigo, string nombre, int EsCpt) // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.FactCatalogoServiciosSeleccionarPorCodigoOnombreTipoCatalogo(codigo, nombre, EsCpt);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> SuSaludUpsSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.SuSaludUpsSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> SisFuaUPServiciosSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.SisFuaUPServiciosSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> UPServiciosSeleccionarTodosV2() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.UPServiciosSeleccionarTodosV2();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> RenaesUPServiciosSeleccionarTodos() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.RenaesUPServiciosSeleccionarTodos();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> ListarTiposModuloAtencion() // JDELGADO001.2
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = null;

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalUtilitario.ListarTiposModuloAtencion();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarExamenesImagenologiaByPtoCarga(int IdCuentaAtencion, int IdPuntoCarga)
        {
            DataSet dataSet;
            DalUtilitario dalUtilitario = new DalUtilitario();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalUtilitario.ListarExamenesImagenologiaByPtoCarga(IdCuentaAtencion, IdPuntoCarga);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpGet]
        public string ObtenerIpCliente()
        {
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString();

            return ip;
        }

    }

}
