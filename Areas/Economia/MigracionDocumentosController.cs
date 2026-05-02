using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Economia
{   

    public class MigracionDocumentosController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public MigracionDocumentosController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        //[HttpPost]
        //public async Task<ActionResult> FechaLimiteDocumentosEmitidos(string tipo)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return Json(new { session = false });
        //    }
        //    DataSet lsResultado;
        //    DalEconomia daoEconomia = new DalEconomia();
        //    int idUsuario;
        //    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    lsResultado = await daoEconomia.FechaLimiteDocumentosMigrados(tipo);
        //    return Json(new { lsResultado = lsResultado, session = true });
        //}

        [HttpPost]
        public async Task<ActionResult> BuscarDocumentosEmitidos(string fechaInicio, string fechaFin, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsResultado;
            DalEconomia daoEconomia = new DalEconomia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsResultado = await daoEconomia.BuscarDocumentosEmitidos(fechaInicio, fechaFin, tipo);
            return Json(new { lsResultado = lsResultado, session = true });
        }

    }
}
