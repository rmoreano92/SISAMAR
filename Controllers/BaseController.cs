using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Middleware;

namespace WebAppMaternidad.Controllers
{
    public class BaseController : Controller
    {
        protected string action => ControllerContext.RouteData.Values["action"]?.ToString() ?? "N/A";
        protected string controller => ControllerContext.RouteData.Values["controller"]?.ToString() ?? "N/A";

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
