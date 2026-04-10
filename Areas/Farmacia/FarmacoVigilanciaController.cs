using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SkiaSharp;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class FarmacoVigilanciaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarNotificaciones(int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRes;

            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();

            listaRes = await dal.ListarNotificaciones(nroCuenta, nroDni, nroHistoria, apellidoPaterno, apellidoMaterno);

            return Json(new { listaResultado = listaRes, session = true });

        }


        [HttpPost]
        public async Task<ActionResult> ListarTiposReaccionAdversaFarmacoVigilancia()
        {
            DataSet ds;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            ds = null;

            ds = await dal.ListarTiposReaccionAdversaFarmacoVigilancia();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposGravedadRamFarmacoVigilancia()
        {
            DataSet ds;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            ds = null;

            ds = await dal.ListarTiposGravedadRamFarmacoVigilancia();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposDescenlaceFarmacoVigilancia()
        {
            DataSet ds;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            ds = null;

            ds = await dal.ListarTiposDescenlaceFarmacoVigilancia();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> ListarTiposConsecuenciasGravedadFarmacoVigilancia()
        {
            DataSet ds;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            ds = null;

            ds = await dal.ListarTiposConsecuenciasGravedadFarmacoVigilancia();

            return Json(ds);
        }

        [HttpPost]
        public async Task<ActionResult> FarmacoVigilanciaNotificacionSeleccionar(int idAtencion)
        {
            DataSet resp;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            resp = null;

            resp = await dal.FarmacoVigilanciaNotificacionSeleccionar(idAtencion);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmacoVigilanciaNotificacionDetalleSeleccionar(int idAtencion, int nroNotificacion)
        {
            DataSet resp;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            resp = null;

            resp = await dal.FarmacoVigilanciaNotificacionDetalleSeleccionar(idAtencion, nroNotificacion);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmacoVigilanciaNotificacionCabeceraModificar(FarmacoVigilanciaNotificacionCabecera cabecera)
        {
            int resp;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            resp = 0;

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = await dal.FarmacoVigilanciaNotificacionCabeceraModificar(cabecera, idUsuario);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmacoVigilanciaNotificacionDetalleModificar(FarmacoVigilanciaNotificacionDetalle detalle)
        {
            int resp;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            resp = 0;

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var lstobjProductosSopechosos = JsonConvert.DeserializeObject<List<FarmacoVigilanciaProductosSospechosos>>(detalle.JsonProductosSospechosos);
            var lstobjProductosConcomitantes = JsonConvert.DeserializeObject<List<FarmacoVigilanciaProductosConcomitantes>>(detalle.JsonProductosConcomitantes);
            resp = await dal.FarmacoVigilanciaNotificacionDetalleModificar(detalle, lstobjProductosSopechosos, lstobjProductosConcomitantes, idUsuario);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmacoVigilanciaNotificacionEliminar(int idAtencion)
        {
            int resp;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            resp = 0;

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            resp = await dal.FarmacoVigilanciaNotificacionEliminar(idAtencion, idUsuario);

            return Json(new { respuesta = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FarmacoVigilanciaNotificacionDetalleEliminar(int idAtencion, int nroNotificacion)
        {
            int resp;
            DalFarmacoVigilancia dal = new DalFarmacoVigilancia();
            resp = 0;

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            resp = await dal.FarmacoVigilanciaNotificacionDetalleEliminar(idAtencion, nroNotificacion, idUsuario);

            return Json(new { respuesta = resp, session = true });
        }


    }
}
