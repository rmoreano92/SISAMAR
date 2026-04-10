using CapaDatos;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using static CapaEntidades.ListBarItemEnum;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class AntimicrobianosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarRecetas(int nroReceta, int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRc;

            DalAntimicrobianos dal = new DalAntimicrobianos();

            listaRc = await dal.ListarRecetas(nroReceta, nroCuenta, nroDni, nroHistoria, apellidoPaterno, apellidoMaterno);

            return Json(new { listaRecetas = listaRc, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> ListaMotivoSolicitud()
        {
            DataSet ds;
            DalAntimicrobianos dal = new DalAntimicrobianos();
            ds = null;

            ds = await dal.ListaMotivoSolicitud();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListaCondicionSolicitud()
        {
            DataSet ds;
            DalAntimicrobianos dal = new DalAntimicrobianos();
            ds = null;

            ds = await dal.ListaCondicionSolicitud();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListaMotivosRechazo()
        {
            DataSet ds;
            DalAntimicrobianos dal = new DalAntimicrobianos();
            ds = null;

            ds = await dal.ListaMotivosRechazo();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionaRecetaAntimicrobiano(int idReceta)
        {
            DataSet listaReceta;
            DalAntimicrobianos dal = new DalAntimicrobianos();
            listaReceta = null;

            listaReceta = await dal.SeleccionaRecetaAntimicrobiano(idReceta); 

            return Json(listaReceta);
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionaSolicitudAntimicrobiano(int idSolicitud)
        {
            DataSet ds;
            DalAntimicrobianos dal = new DalAntimicrobianos();
            ds = null;

            ds = await dal.SeleccionSolicitudAntimicrobiano(idSolicitud);

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> VerificarSolicitudAntimicrobianoPorProducto(int idProducto, int idCuentaAtencion)
        {
            DataSet ds;
            DalAntimicrobianos dal = new DalAntimicrobianos();
            ds = null;

            ds = await dal.VerificarSolicitudAntimicrobianoPorProducto(idProducto, idCuentaAtencion);

            return Json(ds);
        }


        [HttpPost]
        public async Task<ActionResult> GuardarSolicitudAntimicrobiano(GestionAntimicrobiano gestionAntimicrobiano)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            
            DataSet resp = null;
            string mensaje = "";
            DalAntimicrobianos dal = new DalAntimicrobianos();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjCondicion = JsonConvert.DeserializeObject<List<SolicitudCondicionAntimicrobiano>>(gestionAntimicrobiano.CondicionPaciente);
                resp = await dal.GuardarSolicitudAntimicrobiano(gestionAntimicrobiano, lstobjCondicion, idUsuario);
                
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = resp, mensaje = mensaje, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarSolicitudAntimicrobiano(int idSolicitud)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            DataSet resp = null;
            string mensaje = "";
            DalAntimicrobianos dal = new DalAntimicrobianos();
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                resp = await dal.EliminarSolicitudAntimicrobiano(idSolicitud, idUsuario);

            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = resp, mensaje = mensaje, session = true });
        }


    }
}
