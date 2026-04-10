using Microsoft.AspNetCore.Mvc;

namespace WebAppMaternidad.Middleware
{
    public class ApiResponseHelper
    {
        public static JsonResult Success(object data, string msg = "")
        {
            return new JsonResult(new
            {
                session = true,
                estado = true,
                msg,
                data
            });
        }

        public static JsonResult Error(string msg, object data = null, int statusCode = 500)
        {
            return new JsonResult(new { session = true, estado = false, msg, data, code = statusCode })
            {
                StatusCode = statusCode
            };
        }

        public static JsonResult BadRequest(string msg = "Solicitud incorrecta", object data = null)
        {
            return Error(msg, data, 400);
        }

        public static JsonResult NotFound(string msg = "No se encontró el recurso solicitado", object data = null)
        {
            return Error(msg, data, 404);
        }

        public static JsonResult Unauthorized(string msg = "No autorizado", object data = null)
        {
            return Error(msg, data, 401);
        }

        public static JsonResult Forbidden(string msg = "Acceso denegado", object data = null)
        {
            return Error(msg, data, 403);
        }

        public static JsonResult InternalServerError(string msg = "Error interno del servidor", object data = null)
        {
            return Error(msg, data, 500);
        }

        public static JsonResult SessionExpired()
        {
            return new JsonResult(new
            {
                session = false
            })
            {
                StatusCode = 401
            };
        }
    }
}
