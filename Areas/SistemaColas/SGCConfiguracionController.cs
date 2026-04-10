using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System;
using CapaDatos;
using System.Data;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Bibliography;
using WebAppMaternidad.CapaDatos;
using Microsoft.Extensions.Configuration;

namespace WebAppMaternidad.Areas.SistemaColas
{
    public class SGCConfiguracionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> SubirVideo(IFormFile video)
        {
            if (video != null && video.Length > 0)
            {
                try
                {
                    DalSGCConfiguracion dal = new DalSGCConfiguracion();
                    int resp = 0;
                    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    var server = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES");                    
                    string serverFiles = server.ToString();
                    string fileName = Path.GetFileName(video.FileName);
                    string carpeta = Path.Combine(serverFiles, "SGC/Videos/");
                    string filePath = Path.Combine(serverFiles, "SGC/Videos/", fileName); // Ruta donde se guardará el video, en este caso la carpeta "Videos" en el directorio wwwroot de la aplicación

                    if (Directory.Exists(carpeta))
                    {
                        Directory.Delete(carpeta, true); // Borra la carpeta y su contenido de manera recursiva
                        //Console.WriteLine("Carpeta borrada: " + carpeta);
                    }

                    Directory.CreateDirectory(carpeta);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        video.CopyTo(stream);
                        var serverIp = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_IP");
                        string serverIpFiles = serverIp.ToString() + '/';
                        string rutaArchivo = filePath.Replace(serverFiles, serverIpFiles);
                        resp = await dal.GuardarVideo(rutaArchivo, idUsuario);
                    }

                    return Json(new { respuesta = true, msj = "Se guardaron los videos correctamente." });
                }
                catch (Exception ex)
                {
                    return Json(new { respuesta = false, msj = ex.ToString() });
                }
            }
            else
            {
                return Json(new { respuesta = true, msj = "No existen videos para subir." });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarVentanillas()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            
            DalSGCConfiguracion dal = new DalSGCConfiguracion();
            DataSet dsVentanillas;

            dsVentanillas = await dal.ListarVentanillas();

            return Json(dsVentanillas);
            //return Json(new { listaMovimientos = listaMovimientos, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> AbrirCerrarVentanilla(int idVentanilla)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalSGCConfiguracion dal = new DalSGCConfiguracion();
            int resp = 0;
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            resp = await dal.AbrirCerrarVentanilla(idVentanilla, idUsuario);

            return Json(resp);
            //return Json(new { listaMovimientos = listaMovimientos, session = true });
        }

    }
}
