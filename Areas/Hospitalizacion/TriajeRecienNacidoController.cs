using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.CapaDatos;
using System.Threading.Tasks;
using System.Data;
using System.Security.Cryptography;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class TriajeRecienNacidoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarTriajeRn(int NroCuentaRn, int NroHistoriaRn, string NroDocumentoRn, int NroCuentaMadre, int NroHistoriaMadre, string NroDocumentoMadre, string FechaNacimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalTriajeRecienNacido daoTriajeRn = new DalTriajeRecienNacido();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await daoTriajeRn.ListarTriajeRn(NroCuentaRn, NroHistoriaRn, NroDocumentoRn, NroCuentaMadre, NroHistoriaMadre, NroDocumentoMadre, FechaNacimiento);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }
           
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> ListarRelacionadosTriajeRn(int idPacienteMadre)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalTriajeRecienNacido daoTriajeRn = new DalTriajeRecienNacido();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await daoTriajeRn.ListarRelacionadosTriajeRn(idPacienteMadre);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarTriajeRn(int NroTriajeRn)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            DataSet rsp = null;
            DalTriajeRecienNacido daoTriajeRn = new DalTriajeRecienNacido();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await daoTriajeRn.SeleccionarTriajeRn(NroTriajeRn);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarTriajeRecienNacido(TriajeRecienNacido objTriajeRn, int idListBar)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            
            //int rsp = 0;
            DataSet rsp = null;
            string respuesta = "";
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalTriajeRecienNacido daoTriajeRn = new DalTriajeRecienNacido();
                objTriajeRn.IdUsuario = idUsuario;
                rsp = await daoTriajeRn.GuardarTriajeRn(objTriajeRn, idListBar);                
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarTriajeRn(int NroTriajeRn)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "";
            bool rsp = false;
            DalTriajeRecienNacido daoTriajeRn = new DalTriajeRecienNacido();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await daoTriajeRn.EliminarTriajeRn(NroTriajeRn, idUsuario);
            }
            catch (Exception ex)
            {
                respuesta = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

    }
}
