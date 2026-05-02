using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System;
using WebAppMaternidad.CapaEntidades;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Renhice
{
    public class RenhiceController: BaseController
    {

        public async Task<IActionResult> PacientesRenhice(int idListBar)
        {
            try
            {
                //if (HttpContext.User.Identity.IsAuthenticated == false)
                //{
                //    return View("Login");
                //}
                

                //int idUsuario;
                //idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DalEmpleado dlEmpleado = new DalEmpleado();
                //RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                

                //if (objRol == null)
                //{
                //    return View("AccesoDenegado");
                //}
                //else
                //{
                //    ViewBag.Agregar = objRol.Agregar;
                //    ViewBag.Modificar = objRol.Modificar;
                //    ViewBag.Eliminar = objRol.Eliminar;
                //    ViewBag.Consultar = objRol.Consultar;

                //}


                DalUtilitario dlUtilitario = new DalUtilitario();

                ViewBag.Vista = (int)Enumerados.Grupo.Hospitalización;
                ViewBag.Servicio = (int)Enumerados.TiposServicio.Hospitalización;
                ViewBag.Area = "Renhice";
                return View("~/Views/Renhice/PacientesRenhice.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }


        public async Task<ActionResult> ConsultaPacienteById(string id)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds = new DataSet();
            //DataSet resumen = null;

            JObject data;

            string sWebRootFolder = con.ObtenerServidorArchivos();


            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:usuario");
            var autorizacion = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:autorizacion");


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try { 

                data = ServicioConsultaPacientesById(id);

                return Json(new { session = true, estado = true, msg = "", data = data,  });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }
        public async Task<ActionResult> ServicioDocumentReference(string id)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds = new DataSet();
            //DataSet resumen = null;

            JObject data;

            string sWebRootFolder = con.ObtenerServidorArchivos();

            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:usuario");
            var autorizacion = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:autorizacion");


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try { 

                data = ServicioDocumentReferenceById(id);

                return Json(new { session = true, estado = true, msg = "", data = data,  });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }

        [HttpPost]
        public async Task<ActionResult> RegistrarAtencionRenhice(string data)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Json(new { session = false });
            }

            try
            {
                var url = "https://dyaku.minsa.gob.pe/fhir";
                var jsonString = data.ToString();

                using (var client = new HttpClient())
                {
                    // Configura los headers
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/fhir+json"));
                    client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/fhir+json;charset=UTF-8");

                    // Serializa el cuerpo
                    var content = new StringContent(jsonString, Encoding.UTF8, "application/fhir+json");

                    // Envía la solicitud
                    var response = await client.PostAsync(url, content);

                    // Lee y devuelve la respuesta
                    var responseBody = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        var responseJson = JObject.Parse(responseBody);

                        return Json(new
                        {
                            estado = true,
                            tipo = 1,
                            msj = "correcto",
                            data = responseJson
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            estado = false,
                            tipo = 2,
                            msj = $"Error del servidor FHIR: {response.StatusCode}",
                            data = responseBody
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    estado = false,
                    tipo = 3,
                    msj = "Ocurrió un problema: " + ex.Message
                });
            }
        }



        public JObject ServicioConsultaPacientesById(string id)
        {
            Conexion con = new Conexion();

            JObject respuesta;

            string Url = "https://dyaku.minsa.gob.pe/fhir/Bundle/" + id;
            string ContentType = "application/fhir+json;charset=UTF-8 ";

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "GET";

            request.Headers.Add("Content-Type", ContentType);


            try
            {

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            respuesta = jsonResp;
                        }
                    }
                }

                return respuesta;
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex);
                string responseError = "{ \"procesado\" : \"false\", \"mensaje\" : \"Ocurrio un problema => + " + ex.Message.ToString().Replace("\"", "'") + "\" }";
                respuesta = JObject.Parse(responseError);
                return respuesta;
            }
        }

        public JObject ServicioDocumentReferenceById(string id)
        {
            Conexion con = new Conexion();

            JObject respuesta;

            string Url = "https://dyaku.minsa.gob.pe/fhir/DocumentReference/?patient.identifier=" + id + "&_format=json&status=current";
            string ContentType = "application/fhir+json;charset=UTF-8 ";

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "GET";

            request.Headers.Add("Content-Type", ContentType);


            try
            {

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            respuesta = jsonResp;
                        }
                    }
                }

                return respuesta;
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex);
                string responseError = "{ \"procesado\" : \"false\", \"mensaje\" : \"Ocurrio un problema => + " + ex.Message.ToString().Replace("\"", "'") + "\" }";
                respuesta = JObject.Parse(responseError);
                return respuesta;
            }
        }
    }
}
