using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class UtilFarmaciaController : Controller
    {
        [HttpPost]
        public async Task<ActionResult> ListarFarmAlmacenes()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalFarmacia dalFarmacia = new DalFarmacia();

            try
            {
                DataSet dataSet = await dalFarmacia.ListarFarmAlmacenes();

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar, " + ex.Message + "." });
            }

        }
    }
}
