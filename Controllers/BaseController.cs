using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using NPOI.SS.Formula.Functions;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.Middleware;


namespace WebAppMaternidad.Controllers
{
    public class BaseController : Controller
    {

        protected string action => ControllerContext.RouteData.Values["action"]?.ToString() ?? "N/A";
        protected string controller => ControllerContext.RouteData.Values["controller"]?.ToString() ?? "N/A";

        public override async Task OnActionExecutionAsync(
         ActionExecutingContext context,
         ActionExecutionDelegate next)
        {
            DataSet lsParametros;
            DalParametros dalParametros = new DalParametros();
            string logo = "";
            int idIpressInt = 0;

            var idIpressStr = HttpContext.Session.GetString("IdIPress");

            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result))
                idIpressInt = result;

            lsParametros = await dalParametros.SeleccionaFilaParametro2(1070, idIpressInt);

            if (lsParametros.Tables.Count > 0 && lsParametros.Tables[0].Rows.Count > 0)
            {
                logo = lsParametros.Tables[0].Rows[0]["Base64"].ToString();
            }

            @ViewBag.Logo = logo;
            @ViewBag.ValorGlobal = "prueba";

            await next(); // 🔥 importante
        }

        protected IActionResult SuccessResponse(object data, string msg = "")
        {
            return ApiResponseHelper.Success(data, msg);
        }

        protected IActionResult ErrorResponse(string msg, object data = null, int statusCode = 500)
        {
            msg = $"[{this.controller}/{this.action}] " + msg;
            return ApiResponseHelper.Error(msg, data, statusCode);
        }

        protected IActionResult BadRequestResult(string msg = "Solicitud inválida", object data = null)
        {
            return ApiResponseHelper.BadRequest(msg, data);
        }

        protected IActionResult NotFoundResult(string msg = "No se encontró el recurso", object data = null)
        {
            return ApiResponseHelper.NotFound(msg, data);
        }

        protected IActionResult UnauthorizedResult(string msg = "No autorizado")
        {
            return ApiResponseHelper.Unauthorized(msg);
        }

        protected IActionResult SessionExpiredResult()
        {
            return ApiResponseHelper.SessionExpired();
        }


        protected bool UsuarioAutenticado()
        {
            return HttpContext.User.Identity?.IsAuthenticated ?? false;
        }

        protected int? IdUsuarioSesion()
        {
            string id = HttpContext.Session.GetString("idusu");
            return int.TryParse(id, out var idUsuario) ? idUsuario : null;
        }
    }
}
