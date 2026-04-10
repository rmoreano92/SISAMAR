using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Laboratorio
{
    public class LaboratorioMovimientoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarMovimiento(int idMovimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalLaboratorio daoLaboratorio = new DalLaboratorio();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await daoLaboratorio.SeleccionarMovimiento(idMovimiento);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (SeleccionarMovimiento): " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> GuardarMovimiento(LaboratorioMovimiento laboratorio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet dsMov;
            DalLaboratorio daoLaboratorio = new DalLaboratorio();
            
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjInsumos = JsonConvert.DeserializeObject<List<InsumoCPT>>(laboratorio.InsumosCPT);
                var lstobjProductos = JsonConvert.DeserializeObject<List<ProductoCPT>>(laboratorio.ProductosCPT);

                laboratorio.IdUsuario = idUsuario;
                laboratorio.IdUsuarioAuditoria = idUsuario;
                //ds = await daoLaboratorio.GuardarMovimiento(laboratorio, lstobjInsumos, lstobjProductos);
                int idMovimiento = await daoLaboratorio.GuardarMovimiento(laboratorio, lstobjInsumos, lstobjProductos);

                dsMov = await daoLaboratorio.SeleccionarMovimiento(idMovimiento);
                string codigoAp = dsMov.Tables[0].Rows[0]["AnioAP"].ToString() + "-" + dsMov.Tables[0].Rows[0]["TipoAP"].ToString() + "-" + dsMov.Tables[0].Rows[0]["NumeracionAP"].ToString();

                //return Json(new { respuesta = ds.Tables[1], session = true, estado = true });
                return Json(new { respuesta = idMovimiento, movimiento = idMovimiento, codigoAp = codigoAp, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (GuardarMovimiento): " + ex });
            }

        }


        [HttpPost]
        public async Task<ActionResult> EliminarMovimiento(int idMovimiento)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalLaboratorio daoLaboratorio = new DalLaboratorio();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await daoLaboratorio.EliminarMovimiento(idMovimiento, idUsuario);
                
                //return Json(new { respuesta = ds.Tables[1], session = true, estado = true });
                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (EliminarMovimiento): " + ex });
            }

        }


        [HttpPost]
        public async Task<ActionResult> ListarCodigosApDisponibles(string TipoAp)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalLaboratorio daoLaboratorio = new DalLaboratorio();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                ds = await daoLaboratorio.ListarCodigosApDisponibles(TipoAp);

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = "Errr en (ListarCodigosApDisponibles): " + ex });
            }

        }



    }
}
