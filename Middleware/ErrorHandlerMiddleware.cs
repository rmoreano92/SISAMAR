using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using ElmahCore;

namespace WebAppMaternidad.Middleware
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context); // Sigue al siguiente middleware/controlador
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error no controlado");
                context.RiseError(ex);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = ex switch
                {
                    KeyNotFoundException => StatusCodes.Status404NotFound,
                    ArgumentException => StatusCodes.Status400BadRequest,
                    _ => StatusCodes.Status500InternalServerError
                };

                var result = JsonSerializer.Serialize(new
                {
                    session = true,
                    estado = false,
                    msg = ex.Message,
                    code = context.Response.StatusCode
                });

                await context.Response.WriteAsync(result);
            }
        }
    }
}
