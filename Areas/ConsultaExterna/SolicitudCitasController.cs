using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ConsultaExterna.Controllers
{
    public class SolicitudCitasController : BaseController
    {

        private IWebHostEnvironment _env;
        public SolicitudCitasController(IWebHostEnvironment env)
        {
            _env = env;
        }
      

       

        [HttpPost]
        public ActionResult ListaSolicitudCitas()
        {
            DataSet ListaSolicitudCitas;
            DalCitasWeb daoCitas = new DalCitasWeb();
            ListaSolicitudCitas = daoCitas.ListarSolicitudCitas();
            return Json(ListaSolicitudCitas);
        }


        [HttpGet]
        public async Task<ActionResult> ListarEstadoSolicitud()
        {
            DataSet lstcondicion;
            DalUtilitario daoCitas = new DalUtilitario();
            lstcondicion = await daoCitas.DevuelveDSCombo("web_ListarEstadoSolicitud");
            return Json(lstcondicion);
        }


        [HttpPost]
        public ActionResult ValidarCuenta(int idSolicitud, int NroCuenta)
        {
            DataSet ValidarCita;
            DalCitasWeb daoCitas = new DalCitasWeb();
            ValidarCita = daoCitas.ValidarCuenta(idSolicitud,NroCuenta);
            return Json(ValidarCita);
        }



        [HttpPost]
        public ActionResult GuardarSolicitud(int idEstado,int NroCuenta,int idSolicitud,String Comentario)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al actualizar el estado.";
            int rsp = 0;
            try
            {
                
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalCitasWeb daoCitas = new DalCitasWeb();
                rsp = daoCitas.ActualizarEstado(idEstado,NroCuenta,idSolicitud,Comentario,idUsuario);
                if (rsp > 0)
                {
                    respuesta = "Se actualizo la solicitud correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

    }
}