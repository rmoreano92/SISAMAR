using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebAppMaternidad.Areas.Comun
{
    public class FarmaciaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> FarmaciasSegunFiltro(int idPuntoCarga, int idFarmacia)
        {
            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia =  await daoFarmacia.FarmaciasSegunFiltro("idTipoLocales='F' and idTipoSuministro='01' and idEstado=1");


            return Json(ListaFarmacia);
        }

        
        public async Task<ActionResult> FarmSaldoTotalesSoloMayoresAcero(int idFarmacia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }


            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia = await daoFarmacia.farmSaldoTotalesSoloMayoresAcero(" and farmAlmacen.idAlmacen=" + idFarmacia, 1);


            return Json(ListaFarmacia);
        }


        public async Task<ActionResult> FarmAntimicrobianosSaldoTotalesSoloMayoresAcero(int idFarmacia, int esAntimicrobiano)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }


            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia = await daoFarmacia.farmAntimicrobianosSaldoTotalesSoloMayoresAcero(" and farmAlmacen.idAlmacen=" + idFarmacia, 1);


            return Json(ListaFarmacia);
        }

        public async Task<ActionResult> FarmIntervencionSanitariaSaldoTotalesSoloMayoresAcero(int idFarmacia, int esAntimicrobiano)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }


            DataSet ListaFarmacia;
            DalFarmacia daoFarmacia = new DalFarmacia();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ListaFarmacia = null;

            ListaFarmacia = await daoFarmacia.farmIntervencionSanitariaSaldoTotalesSoloMayoresAcero(" and farmAlmacen.idAlmacen=" + idFarmacia, 1);


            return Json(ListaFarmacia);
        }


    }
}