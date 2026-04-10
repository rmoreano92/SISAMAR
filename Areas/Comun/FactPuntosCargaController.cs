using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.Comun
{
    public class FactPuntosCargaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> FactPuntosCargaSeleccionarPorFiltro(string filtro)
        {
            DataSet lstData;
            DalPuntosCarga dalPuntosCarga = new DalPuntosCarga();

            lstData = await dalPuntosCarga.FactPuntosCargaSeleccionarPorFiltro(filtro);

            return Json(new { lstData = lstData, sesion = true });
        }

    }
}
