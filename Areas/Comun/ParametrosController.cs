using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class ParametrosController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SeleccionaFilaParametro(int idParametro)
        {
            DataSet listaParametro;
            DalParametros daoParametro = new DalParametros();

            listaParametro = null;

            listaParametro = daoParametro.SeleccionaFilaParametro(idParametro);

            return Json(listaParametro);
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionaFilaParametroV2(int idParametro)
        {
            DataSet listaParametro;
            DalParametros daoParametro = new DalParametros();

            listaParametro = null;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            listaParametro = await daoParametro.SeleccionaFilaParametro2(idParametro);

            return Json(new { lsResultado = listaParametro, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ParametrosSeleccionarPorTipo(string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet;
            DalParametros daoParametro = new DalParametros();
            dataSet = await daoParametro.ParametrosSeleccionarPorTipo(tipo);
            return Json(new { respuesta = dataSet, session = true });
        }

        //////////////////////////////////////KHOYOSI//////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> RetornaFechaHoraServidor()
        {
            DataSet dataSet;
            DalParametros dal = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dal.RetornaFechaHoraServidor();

            return Json(new { resultado = dataSet.Tables[0].Rows[0]["FechaHoraSQL"].ToString(), estado = true, session = true });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////

    }

}