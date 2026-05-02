using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Models;
using WebAppMaternidad.Services;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Sockets
{

    public class WebSocketApiController : BaseController
    {

        private readonly ILogger<WebSocketApiController> _logger;

        public WebSocketApiController(ILogger<WebSocketApiController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /*====================================================KHOYOSI====================================================================*/
        [HttpGet]
        public async Task GetStatusFirmaDigitalPorUsuario()
        {
            var context = ControllerContext.HttpContext;
            if (context.WebSockets.IsWebSocketRequest)
            {
                using (WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync())
                {
                    await WsGetStatusFirmaDigitalPorUsuario(context, webSocket);
                }
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }

        public async Task WsGetStatusFirmaDigitalPorUsuario(HttpContext context, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {

                DalAtenciones dalAtenciones = new DalAtenciones();

                var datosFirma = Encoding.UTF8.GetString(buffer, 0, result.Count).ToString().Split("|");

                DataSet atenciones = await dalAtenciones.SeleccionarFirmaDigitalPorCodePorUsuario(datosFirma[0].ToString(), Int32.Parse(datosFirma[1].ToString()));

                //var arraySeg = new ArraySegment<byte>(buffer, 0, result.Count);

                string jsonResult = "{ " +
                                    "\"idCuentaAtencion\": " + atenciones.Tables[0].Rows[0]["idCuentaAtencion"]
                                    + ", \"tipo\": \"" + atenciones.Tables[0].Rows[0]["tipo"] + "\""
                                    + ", \"idCuentaAtencion\": " + atenciones.Tables[0].Rows[0]["idCuentaAtencion"]
                                    + ", \"statusFirma\": " + atenciones.Tables[0].Rows[0]["statusFirma"]
                                    + ", \"statusFirmaUsuario\": " + atenciones.Tables[0].Rows[0]["statusFirmaUsuario"]
                                    + ", \"processFirma\": " + atenciones.Tables[0].Rows[0]["processFirma"]
                                    + ", \"id\": " + atenciones.Tables[0].Rows[0]["id"]
                                    + ", \"codigo\": \"" + atenciones.Tables[0].Rows[0]["code"] + "\""
                                    + ", \"datosRecibidosControlador\": \"" + Encoding.UTF8.GetString(buffer, 0, result.Count) + "\""
                                    + " }";

                var bytes = Encoding.ASCII.GetBytes(jsonResult);
                var arraySegment = new ArraySegment<byte>(bytes);

                await webSocket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }

        [HttpGet]
        public async Task GetMessagesMultiplePorUsuario()
        {
            var context = ControllerContext.HttpContext;
            if (context.WebSockets.IsWebSocketRequest)
            {
                using (WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync())
                {
                    await WsGetMessageFirmaMultiplePorUsuario(context, webSocket);
                }
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }

        public async Task WsGetMessageFirmaMultiplePorUsuario(HttpContext context, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {

                DalAtenciones dalAtenciones = new DalAtenciones();

                var datosFirma = Encoding.UTF8.GetString(buffer, 0, result.Count).ToString().Split("|");

                DataSet estadoFirma = await dalAtenciones.SeleccionarEstadoFirmaPaquete(datosFirma[0].ToString() + ".zip");

                //var arraySeg = new ArraySegment<byte>(buffer, 0, result.Count);



                string jsonResult = "{ " +
                                    "\"idCuentaAtencion\": " + estadoFirma.Tables[0].Rows[0]["IdCuenta"]
                                    + ", \"NombrePaquete\": \"" + estadoFirma.Tables[0].Rows[0]["Nombre"] + "\""
                                    + ", \"Estado\": \"" + estadoFirma.Tables[0].Rows[0]["Estado"] + "\""
                                    + ", \"datosRecibidosControlador\": \"" + Encoding.UTF8.GetString(buffer, 0, result.Count) + "\""
                                    + " }";

                var bytes = Encoding.ASCII.GetBytes(jsonResult);
                var arraySegment = new ArraySegment<byte>(bytes);

                await webSocket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);

                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }

        /*=======================================================================================================================*/

    }

}
