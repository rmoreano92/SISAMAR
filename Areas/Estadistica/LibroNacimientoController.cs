using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SelectPdf;
using System.Text;
using System.Net.Mime;
using System.Diagnostics;
using CapaDatos;

namespace WebAppMaternidad.Areas.Estadistica
{
    public class LibroNacimientoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> ListarPacientesRegistroLibroNacimiento(DateTime FechaNacimiento, int NroLibro, int NroFolio, int NroAnio, int NroMes, int NroHistoriaMadre, string ApPaternoMadre)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet ListaPacientes;
            DalLibroNacimiento daoLibroNac = new DalLibroNacimiento();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaPacientes = await daoLibroNac.ListarRegistroLibroNacimiento(FechaNacimiento, NroLibro, NroFolio, NroAnio, NroMes, NroHistoriaMadre, ApPaternoMadre, idUsuario);
            return Json(ListaPacientes);
        }

        //SE REUTILIZAR JAA
        [HttpGet]
        public async Task<ActionResult> ListarNumeroGemelar()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("web_ListarNumeroGemelar");
            return Json(lstMetodo);
        }
        //------------


        [HttpPost]
        public async Task<ActionResult> GuardarRegistroLibroNacimiento(LibroNacimiento objLibroNac)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al guardar el registro de nacimiento.";
            bool rsp = false;
            try
            {
                objLibroNac.IdUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalLibroNacimiento daoLibroNac = new DalLibroNacimiento();
                await daoLibroNac.RegistroLibroNacimientoCrearModificar(objLibroNac);
                respuesta = "Se guardo el registro de nacimiento correctamente.";
                rsp = true;                
            }
            catch (Exception ex)
            {                
                respuesta = "Error al registrar," + ex.Message + ".";
                rsp = false;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarRegistroLibroNacimiento(LibroNacimiento objLibroNac)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al eliminar el registro de nacimiento.";
            bool rsp = false;
            try
            {
                objLibroNac.IdUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalLibroNacimiento daoLibroNac = new DalLibroNacimiento();
                await daoLibroNac.EliminarLibroNacimientoCrearModificar(objLibroNac);
                respuesta = "Se elimino el registro de nacimiento correctamente.";
                rsp = true;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
                rsp = false;
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }
    }
}
