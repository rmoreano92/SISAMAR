using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QRCoder;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Json;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class ReferenciaController : BaseController
    {
        private IWebHostEnvironment _hostingEnvironment;

        public ReferenciaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        /**
            ** METODOS PARA CONSUMO WEB SERVICES REFCON **
        */

        [HttpPost]
        public async Task<IActionResult> ListarUPServiciosRefCon(string codigoups)
        {
            try
            {
                // 1️⃣ Obtener la URL base desde tu capa de parámetros
                DalParametros daoParametros = new DalParametros();
                DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

                if (dsParametros.Tables.Count == 0 || dsParametros.Tables[0].Rows.Count == 0)
                    return BadRequest("No se pudo obtener la URL base desde los parámetros.");

                string basePath = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString().Trim();
                string urlServicio = $"{basePath}/listadoUps/{codigoups}";

                // 2️⃣ Cargar credenciales desde appsettings.json
                var config = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .Build();

                string username = config.GetValue<string>("CredentialStrings:REFCON:username");
                string ipclient = config.GetValue<string>("CredentialStrings:REFCON:ipclient");
                string password = config.GetValue<string>("CredentialStrings:REFCON:password");

                // 3️⃣ Crear la solicitud HTTP
                using (var client = new HttpClient())
                {
                    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                    var request = new HttpRequestMessage(HttpMethod.Get, urlServicio);
                    request.Headers.Add("accept", "application/json;charset=UTF-8");
                    request.Headers.Add("username", username);
                    request.Headers.Add("ipclient", ipclient);
                    request.Headers.Add("password", password);

                    // 4️⃣ Enviar solicitud
                    HttpResponseMessage response = await client.SendAsync(request);
                    string contenido = await response.Content.ReadAsStringAsync();

                    // 5️⃣ Evaluar respuesta
                    if (!response.IsSuccessStatusCode)
                    {
                        return StatusCode((int)response.StatusCode, new
                        {
                            success = false,
                            message = $"Error HTTP {(int)response.StatusCode}: {response.ReasonPhrase}",
                            detalle = contenido
                        });
                    }
                    JObject jsonResponse = JObject.Parse(contenido);
                    return SuccessResponse(jsonResponse);
                    // 6️⃣ Retornar JSON del servicio remoto

                }
            }
            catch (Exception ex)
            {
                // 7️⃣ Manejo de errores controlado
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ConsultaBandejaReferidosRecibidos(
            string codUnicoDestino,
            string fechaInicio,
            string fechaFin,
            string limite,
            string pagina,
            string upsDestino)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                // 1️⃣ Obtener la URL base desde parámetros
                DalParametros daoParametros = new DalParametros();
                DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

                if (dsParametros.Tables.Count == 0 || dsParametros.Tables[0].Rows.Count == 0)
                {
                    return Json(new { estado = false, tipo = 3, msj = "No se pudo obtener la URL base." });
                }

                string baseUrl = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString().Trim();
                string url = $"{baseUrl}/consultaBandejaReferidosRecibidos";

                // 2️⃣ Obtener credenciales desde appsettings.json
                var config = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .Build();

                string username = config.GetValue<string>("CredentialStrings:REFCON:username");
                string ipclient = config.GetValue<string>("CredentialStrings:REFCON:ipclient");
                string password = config.GetValue<string>("CredentialStrings:REFCON:password");

                // 3️⃣ Crear el cuerpo JSON
                var body = new
                {
                    codUnicoDestino = codUnicoDestino,
                    fechaInicio = fechaInicio,
                    fechaFin = fechaFin,
                    limite = limite,
                    pagina = pagina,
                    upsDestino = upsDestino
                };

                string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(body);

                // 4️⃣ Crear cliente HTTP y solicitud
                using (var client = new HttpClient())
                {
                    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                    var request = new HttpRequestMessage(HttpMethod.Post, url)
                    {
                        Content = new StringContent(jsonBody, System.Text.Encoding.UTF8, "application/json")
                    };

                    request.Headers.Add("accept", "application/json;charset=UTF-8");
                    request.Headers.Add("username", username);
                    request.Headers.Add("password", password);
                    request.Headers.Add("ipclient", ipclient);

                    // 5️⃣ Enviar solicitud
                    HttpResponseMessage response = await client.SendAsync(request);
                    string responseBody = await response.Content.ReadAsStringAsync();

                    // 6️⃣ Analizar respuesta
                    if (!response.IsSuccessStatusCode)
                    {
                        return Json(new
                        {
                            estado = false,
                            tipo = 3,
                            msj = $"Error HTTP {(int)response.StatusCode}: {response.ReasonPhrase}",
                            detalle = responseBody
                        });
                    }

                    JObject jsonResponse = JObject.Parse(responseBody);

                    return SuccessResponse(jsonResponse);
                }
            }
            catch (Exception ex)
            {
                return ErrorResponse(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> recibirCita(string data)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                // 1️⃣ Obtener la URL base desde parámetros
                DalParametros daoParametros = new DalParametros();
                DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

                if (dsParametros.Tables.Count == 0 || dsParametros.Tables[0].Rows.Count == 0)
                {
                    return Json(new { estado = false, tipo = 3, msj = "No se pudo obtener la URL base." });
                }

                string baseUrl = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString().Trim();
                string url = $"{baseUrl}/recibirCita";

                // 2️⃣ Obtener credenciales desde appsettings.json
                var config = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .Build();

                string username = config.GetValue<string>("CredentialStrings:REFCON:username");
                string ipclient = config.GetValue<string>("CredentialStrings:REFCON:ipclient");
                string password = config.GetValue<string>("CredentialStrings:REFCON:password");

                // 3️⃣ Crear el cuerpo JSON
                JObject json = JObject.Parse(data);

                string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(json);

                // 4️⃣ Crear cliente HTTP y solicitud
                using (var client = new HttpClient())
                {
                    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                    var request = new HttpRequestMessage(HttpMethod.Post, url)
                    {
                        Content = new StringContent(jsonBody, System.Text.Encoding.UTF8, "application/json")
                    };

                    request.Headers.Add("accept", "application/json;charset=UTF-8");
                    request.Headers.Add("username", username);
                    request.Headers.Add("password", password);
                    request.Headers.Add("ipclient", ipclient);

                    // 5️⃣ Enviar solicitud
                    HttpResponseMessage response = await client.SendAsync(request);
                    string responseBody = await response.Content.ReadAsStringAsync();

                    // 6️⃣ Analizar respuesta
                    if (!response.IsSuccessStatusCode)
                    {
                        return Json(new
                        {
                            estado = false,
                            tipo = 3,
                            msj = $"Error HTTP {(int)response.StatusCode}: {response.ReasonPhrase}",
                            detalle = responseBody
                        });
                    }

                    JObject jsonResponse = JObject.Parse(responseBody);

                    return SuccessResponse(jsonResponse);
                }
            }
            catch (Exception ex)
            {
                return ErrorResponse(ex.Message);
            }
        }


        // [HttpPost]
        // public async Task<ActionResult> recibirCita(string data)
        // {

        //     if (HttpContext.User.Identity.IsAuthenticated == false)
        //     {
        //         return Json(new { session = false });
        //     }

        //     DalParametros daoParametros = new DalParametros();

        //     DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

        //     string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //     var url = $"" + urlServicio + "/recibirCita";
        //     var request = (HttpWebRequest)WebRequest.Create(url);
        //     request.Method = "POST";
        //     request.ContentType = "application/json";
        //     request.Accept = "application/json;charset=UTF-8";

        //     var username = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:username");
        //     var ipclient = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:ipclient");
        //     var password = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:password");
        //     request.Headers.Add("username", username);
        //     request.Headers.Add("ipclient", ipclient);
        //     request.Headers.Add("password", password);


        //     //DataSet dataSet = null;

        //     DalAtenciones dalAtenciones = new DalAtenciones();
        //     DalMigradores dalMigradores = new DalMigradores();
        //     DalReferencia dalReferencia = new DalReferencia();

        //     try
        //     {
        //         using (var streamWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8))
        //         {

        //             //JObject json = new JObject {
        //             //    data
        //             //};
        //             JObject json = JObject.Parse(data);

        //             //JObject json = JObject.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
        //             streamWriter.Write(json);
        //             streamWriter.Flush();
        //             streamWriter.Close();

        //             Console.WriteLine(data);
        //         }

        //         using (WebResponse response = request.GetResponse())
        //         {
        //             using (Stream strReader = response.GetResponseStream())
        //             {
        //                 if (strReader == null) return null;
        //                 using (StreamReader objReader = new StreamReader(strReader))
        //                 {
        //                     string responseBody = objReader.ReadToEnd();


        //                     JObject json = JObject.Parse(responseBody);

        //                     //string codigoRespuesta = json["codigoRespuesta"].ToString();


        //                     //if (codigoRespuesta == "0000")
        //                     //{
        //                     //    dataSet = await dalReferencia.ActualizarPacienteRecibidoReferencias(Int32.Parse(idReferencia));
        //                     //}


        //                     return Json(new { estado = true, tipo = 1, msj = "correcto", data = json });
        //                 }
        //             }
        //         }
        //     }
        //     catch (WebException ex)
        //     {
        //         Console.WriteLine(ex);
        //         return Json(new { estado = false, tipo = 3, msj = "Ocurrio un problema: " + ex });
        //     }

        // }



        [HttpPost]
        public async Task<IActionResult> GenerarPacienteRecibido(
            string codigoRenipressDestino, string condicionPaciente, string fechaCita, string horaCita, string idReferencia, string llegoPaciente,
            string apellidoMaterno, string apellidoPaterno, string fechaNacimiento, string idcolegio, string idprofesion, string nombres, string nroDocumento, string sexo, string tipoDocumento
        )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                // 1️⃣ Obtener la URL base desde parámetros
                DalParametros daoParametros = new DalParametros();
                DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

                if (dsParametros.Tables.Count == 0 || dsParametros.Tables[0].Rows.Count == 0)
                {
                    return Json(new { estado = false, tipo = 3, msj = "No se pudo obtener la URL base." });
                }

                string baseUrl = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString().Trim();
                string url = $"{baseUrl}/recibirReferenciaPaciente";

                // 2️⃣ Obtener credenciales desde appsettings.json
                var config = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json")
                    .Build();

                string username = config.GetValue<string>("CredentialStrings:REFCON:username");
                string ipclient = config.GetValue<string>("CredentialStrings:REFCON:ipclient");
                string password = config.GetValue<string>("CredentialStrings:REFCON:password");

                // 3️⃣ Crear el cuerpo JSON
                var body = new
                {
                    codigoRenipressDestino = codigoRenipressDestino,
                    condicionPaciente = condicionPaciente,
                    fechaCita = fechaCita,
                    horaCita = horaCita,
                    idReferencia = idReferencia,
                    llegoPaciente = llegoPaciente,
                    personalRegistra = new
                    {
                        apellidoMaterno = apellidoMaterno,
                        apellidoPaterno = apellidoPaterno,
                        fechaNacimiento = fechaNacimiento,
                        idcolegio = idcolegio,
                        idprofesion = idprofesion,
                        nombres = nombres,
                        nroDocumento = nroDocumento,
                        sexo = sexo,
                        tipoDocumento = tipoDocumento
                    }
                };

                string jsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(body);

                // 4️⃣ Crear cliente HTTP y solicitud
                using (var client = new HttpClient())
                {
                    System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                    var request = new HttpRequestMessage(HttpMethod.Post, url)
                    {
                        Content = new StringContent(jsonBody, System.Text.Encoding.UTF8, "application/json")
                    };

                    request.Headers.Add("accept", "application/json;charset=UTF-8");
                    request.Headers.Add("username", username);
                    request.Headers.Add("password", password);
                    request.Headers.Add("ipclient", ipclient);

                    // 5️⃣ Enviar solicitud
                    HttpResponseMessage response = await client.SendAsync(request);
                    string responseBody = await response.Content.ReadAsStringAsync();

                    // 6️⃣ Analizar respuesta
                    if (!response.IsSuccessStatusCode)
                    {
                        return Json(new
                        {
                            estado = false,
                            tipo = 3,
                            msj = $"Error HTTP {(int)response.StatusCode}: {response.ReasonPhrase}",
                            detalle = responseBody
                        });
                    }

                    JObject jsonResponse = JObject.Parse(responseBody);

                    return SuccessResponse(jsonResponse);
                }
            }
            catch (Exception ex)
            {
                return ErrorResponse(ex.Message);
            }
        }
        // [HttpPost]
        // public async Task<ActionResult> GenerarPacienteRecibido(string codigoRenipressDestino, string condicionPaciente, string fechaCita, string horaCita, string idReferencia, string llegoPaciente)
        // {

        //     if (HttpContext.User.Identity.IsAuthenticated == false)
        //     {
        //         return Json(new { session = false });
        //     }

        //     DalParametros daoParametros = new DalParametros();

        //     DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

        //     string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //     var url = $"" + urlServicio + "/integracion/v1.0/referencia/recibirReferenciaPaciente";
        //     var request = (HttpWebRequest)WebRequest.Create(url);
        //     request.Method = "POST";
        //     request.ContentType = "application/json";
        //     request.Accept = "application/json;charset=UTF-8";

        //     var username = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:username");
        //     var ipclient = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:ipclient");
        //     request.Headers.Add("username", username);
        //     request.Headers.Add("ipclient", ipclient);

        //     DataSet dataSet = null;

        //     DalAtenciones dalAtenciones = new DalAtenciones();
        //     DalMigradores dalMigradores = new DalMigradores();
        //     DalReferencia dalReferencia = new DalReferencia();

        //     //if (dataSet.Tables[0].Rows[0]["estado"].ToString() == "1")
        //     //{
        //     //    return Json(new
        //     //    {
        //     //        estado = true,
        //     //        tipo = 2,
        //     //        msj = "La referencia ya fue registrada",
        //     //        data = new {
        //     //                idReferencia = dataSet.Tables[0].Rows[0]["idReferencia"], 
        //     //                nro_referencia = dataSet.Tables[0].Rows[0]["nro_referencia"],
        //     //                respuesta = new {
        //     //                    codigoRespuesta = "--", mensajeRespuesta = "--"
        //     //              }
        //     //        }
        //     //    });
        //     //}

        //     //try
        //     //{
        //     //    var tmpObj = JsonValue.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
        //     //}
        //     //catch (FormatException fex)
        //     //{
        //     //    //Invalid json format
        //     //    Debug.Print(fex.Message.ToString());
        //     //    return Json(new { estado = false, tipo = 2, msj = "Error formato: Es posible que los datos de triaje no esten completos \n Peso, Talla, Frecuencia Cardiaca, Frecuencia Respiratoria, Presion Arterial " });
        //     //}
        //     //catch (Exception ex) //some other exception
        //     //{
        //     //    Debug.Print(ex.Message.ToString());
        //     //    return Json(new { estado = false, tipo = 2, msj = "Ocurrio un problema json: Es posible que los datos de triaje no esten completos \n Peso, Talla, Frecuencia Cardiaca, Frecuencia Respiratoria, Presion Arterial " });
        //     //}


        //     try
        //     {
        //         using (var streamWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8))
        //         {
        //             JObject json = new JObject {
        //                 { "codigoRenipressDestino", codigoRenipressDestino },
        //                 { "condicionPaciente", condicionPaciente },
        //                 { "fechaCita", fechaCita },
        //                 { "horaCita", horaCita },
        //                 { "idReferencia", idReferencia },
        //                 { "llegoPaciente", llegoPaciente }
        //             };

        //             //JObject json = JObject.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
        //             streamWriter.Write(json);
        //             streamWriter.Flush();
        //             streamWriter.Close();

        //             Console.WriteLine(json);
        //         }

        //         using (WebResponse response = request.GetResponse())
        //         {
        //             using (Stream strReader = response.GetResponseStream())
        //             {
        //                 if (strReader == null) return null;
        //                 using (StreamReader objReader = new StreamReader(strReader))
        //                 {
        //                     string responseBody = objReader.ReadToEnd();


        //                     JObject json = JObject.Parse(responseBody);

        //                     string codigoRespuesta = json["codigoRespuesta"].ToString();


        //                     if (codigoRespuesta == "0000")
        //                     {
        //                         dataSet = await dalReferencia.ActualizarPacienteRecibidoReferencias(Int32.Parse(idReferencia));
        //                     }

        //                     //if (respuesta.Property("codRespuesta").Value.ToString() == "0000")
        //                     //{
        //                     //    dalMigradores.ActualizarJsonContraRef(
        //                     //    Int32.Parse(dataSet.Tables[0].Rows[0]["id_cuenta"].ToString()), 1, json.Property("idreferencia").Value.ToString(),
        //                     //    json.Property("nro_contrareferencia").Value.ToString(),
        //                     //    DateTime.Now, respuesta.Property("codRespuesta").Value.ToString(), respuesta.Property("mensajeRespuesta").Value.ToString());
        //                     //}
        //                     //else
        //                     //{
        //                     //    dalMigradores.ActualizarJsonContraRef(
        //                     //    Int32.Parse(dataSet.Tables[0].Rows[0]["id_cuenta"].ToString()), 2, json.Property("idreferencia").Value.ToString(),
        //                     //    json.Property("nro_contrareferencia").Value.ToString(),
        //                     //    DateTime.Now, respuesta.Property("codRespuesta").Value.ToString(), respuesta.Property("mensajeRespuesta").Value.ToString());
        //                     //}

        //                     return Json(new { estado = true, tipo = 1, msj = codigoRespuesta, data = json });
        //                 }
        //             }
        //         }
        //     }
        //     catch (WebException ex)
        //     {
        //         Console.WriteLine(ex);
        //         return Json(new { estado = false, tipo = 3, msj = "Ocurrio un problema: " + ex });
        //     }

        // }






        /**
            ** METODOS PARA CONSUMO DE BASE DE DATOS **
        */
        [HttpPost]
        public async Task<IActionResult> SeleccionarDepartamentoProvinciaDistritoByIdDistrito(string IdDistrito)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalReferencia();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.SeleccionarDepartamentoProvinciaDistritoByIdDistrito(IdDistrito);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> ListarProgramacionServicionRefCon(string CodigoServicioSuSalud, DateTime? FechaProgramacion)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalReferencia();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.ListarProgramacionServicionRefCon(CodigoServicioSuSalud, FechaProgramacion);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> ListarCupoCitas(string idProgrmacion)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalReferencia();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.ListarCupoCitas(idProgrmacion);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> ListarCupoCitasProcedimiento(string idProgrmacion)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                var dal = new DalReferencia();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.ListarCupoCitasProcedimiento(idProgrmacion);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> CrearModificarCitaRefcon(
            AtencionReferenciaRequest atencionReferenciaRequest, ReferenciaRefCon referenciaRefCon,
            string diagnosticos, string tratamiento, int idListBar)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            var dal = new DalReferencia();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var objDiagnosticos = JsonConvert.DeserializeObject<List<ReferenciaRefCon>>(diagnosticos);
                var objTratamiento = JsonConvert.DeserializeObject<List<ReferenciaRefCon>>(tratamiento);


                var dataSet = await dal.CrearModificarCitaRefcon(atencionReferenciaRequest, referenciaRefCon, objDiagnosticos, objTratamiento, idUsuario, idListBar);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }
        [HttpPost]
        public async Task<IActionResult> SeleccionarProcedimientosImagenologiaRefcon()
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            var dal = new DalReferencia();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var dataSet = await dal.SeleccionarProcedimientosImagenologiaRefcon();
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }
        [HttpPost]
        public async Task<IActionResult> SeleccionarDiagnosticoByCodigoCIEsinPto(string codigoCIEsinPto)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            var dal = new DalReferencia();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var dataSet = await dal.SeleccionarDiagnosticoByCodigoCIEsinPto(codigoCIEsinPto);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }
        [HttpPost]
        public async Task<IActionResult> SeleccionarProcedimientoByCodigo(string Codigo)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            var dal = new DalReferencia();

            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var dataSet = await dal.SeleccionarProcedimientoByCodigo(Codigo);
                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }




        










        [HttpPost]
        public ActionResult ListarAtencionesReferencia(string fecha, int idServicio, int idTipoServicio, int idTipoRef, int prog)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsAtencionsCE;
            DalReferencia daoAtenciones = new DalReferencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsAtencionsCE = daoAtenciones.ListarAtencionesReferencias(fecha, idServicio, idTipoServicio, idTipoRef, idUsuario, prog);
            return Json(new { lstAtenciones = lsAtencionsCE, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> AtencionReferenciaSeleccionarPorIdCuenta(int idCuenta, int tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lsAtencionByCuenta;
            DalReferencia daoReferencia = new DalReferencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsAtencionByCuenta = await daoReferencia.AtencionReferenciaSeleccionarPorIdCuenta(idCuenta, tipo);
            return Json(new { lsReferencia = lsAtencionByCuenta, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ServiciosFiltrar(string lcfiltro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsServiciosFiltro;
            DalReferencia daoReferencia = new DalReferencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsServiciosFiltro = await daoReferencia.ServiciosFiltrar(lcfiltro);
            return Json(new { lsFiltro = lsServiciosFiltro, session = true });
        }


        [HttpPost]
        //public async Task<ActionResult> ListarEspecialidadesRefCon()
        public async Task<ActionResult> ListarEspecialidadesRefCon()
        {
            DalParametros daoParametros = new DalParametros();

            DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1016);

            string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            var url = $"" + urlServicio + "/integracion/v1.0/referencia/listadoEspecialidades";
            //ActionResult respuesta = await ConsumirWebService(url);
            ActionResult respuesta = ConsumirWebService(url);
            return respuesta;
        }



        //public async Task<ActionResult> ConsumirWebService(string service)
        public ActionResult ConsumirWebService(string service)
        {
            var url = service;
            var request = (HttpWebRequest)WebRequest.Create(url);
            //request.Method = "POST";
            //request.ContentType = "application/json";
            //request.Accept = "application/json;charset=UTF-8";
            var username = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:username");
            var ipclient = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:ipclient");
            request.Headers.Add("username", username);
            request.Headers.Add("ipclient", ipclient);

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

                            JObject json = JObject.Parse(responseBody);
                            //JObject respuesta = JObject.Parse(json.Property("respuesta").Value.ToString());

                            return Json(new { data = json, estado = true });
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex);
                return Json(new { data = "{}", estado = false, mensaje = "Ocurrio un problema: " + ex, tipo = 1 });
            }
        }


        [HttpPost]
        public async Task<ActionResult> GuardarContraReferencia(ContraReferencia objContraRef)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalReferencia daoReferencia = new DalReferencia();
            Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoReferencia.EmisionContraReferenciaModificar(objContraRef, idUsuario);
            if (ds.Tables[0].Rows[0]["Codigo"].ToString() != "0")
            {
                objContraRef.IdContraReferencia = Convert.ToInt32(ds.Tables[0].Rows[0]["IdContraReferencia"].ToString());

            }

            //hoja = await GenerarHojaRefCon(objContraRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdContraReferencia"].ToString()), 2, "CRF");
            hoja = await GenerarHojaRefCon(objContraRef.IdCuentaAtencion, objContraRef.IdContraReferencia, "CRF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> GuardarReferencia(Referencia objRef)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalReferencia daoReferencia = new DalReferencia();
            Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoReferencia.EmisionReferenciaModificar(objRef, idUsuario);
            objRef.IdReferencia = Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString());
            //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");
            hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, objRef.IdReferencia, "RF");

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ReferenciaResponsableEESSSelecionar(Referencia objRef)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalReferencia daoReferencia = new DalReferencia();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoReferencia.ReferenciaResponsableEESSSelecionar();

            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ActualizaEmisionRefCon(int idCuentaAtencion, int tipoDestino)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            Boolean ds;
            DalReferencia daoReferencia = new DalReferencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoReferencia.ActualizarEmisionRefCon(idCuentaAtencion, tipoDestino);
            return Json(new { respuesta = ds, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminarEmisionRefCon(int idRefCon, int tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            Boolean ds;
            DalReferencia daoReferencia = new DalReferencia();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = await daoReferencia.EliminarEmisionRefCon(idRefCon, tipo);
            return Json(new { respuesta = ds, session = true });
        }

        public async Task<bool> GenerarHojaRefCon(int idCuentaAtencion, int idRefCon, string tipo)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;
                int idTipo = 0;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                if (tipo == "RF")
                {
                    idTipo = 1;
                }
                else if (tipo == "CRF")
                {
                    idTipo = 2;
                }

                stringHtml = null;
                pageHtml = Url.Action("HojaRefCon", "Referencia", new { area = "Comun", idRefCon = idRefCon, tipo = idTipo }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idRefCon, 0, tipo, 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }

        }

        //public async Task<bool> GenerarHojaRefCon(string codigo, int idCuentaAtencion, int idRefCon, int idTipoServicio, int idServicio, int idEvaluacion, int idEmpleado, string fecha, string tipo)
        //{
        //    try
        //    {
        //        FormatoPdf fpdf = new FormatoPdf();
        //        FirmaDigital firma = new FirmaDigital();
        //        StringBuilder stringHtml = new StringBuilder();
        //        string pageHtml;
        //        UtilitarioController utilitario = new UtilitarioController();
        //        bool resp;

        //        int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

        //        stringHtml = null;                
        //        pageHtml = Url.Action("HojaRefCon", "Referencia", new { area = "Comun", idRefCon = idRefCon, tipo = (tipo == "RF" ? 1 : 2 ) }, "http");

        //        fpdf.stringHtml = stringHtml;
        //        fpdf.pageHtml = pageHtml;
        //        fpdf.orientacion = "Portrait";
        //        fpdf.tamanio = "A4";

        //        fpdf.codigo = codigo;
        //        fpdf.idCuentaAtencion = idCuentaAtencion;
        //        fpdf.idRegistro = idRefCon;
        //        fpdf.tipoServicio = idTipoServicio;
        //        fpdf.tipoDocumento = tipo;

        //        firma.idServicio = idServicio;
        //        firma.idEvaluacion = idEvaluacion;
        //        firma.idEmpleado = idEmpleado;
        //        firma.fecha = fecha;
        //        firma.idUsuarioRegistra = idUsuario;

        //        resp = await utilitario.GeneraFormatoPdf(fpdf, firma);

        //        return resp;
        //    }
        //    catch (Exception e)
        //    {
        //        return false;
        //    }

        //}


        //[HttpGet]
        //public async Task<Boolean> GenerarHojaRefCon(int idCuenta, int idRefCon, int tipo, string tipoDoc)
        //{
        //    string rsp = "";
        //    bool bSesion = true;
        //    string respuesta = "Error al registrar la generación de constancia.";
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        bSesion = false;
        //        respuesta = "Su sesión a finalizado.";
        //        //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //        return false;
        //    }
        //    try
        //    {
        //        //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //        //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
        //        //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
        //        var resp = await GenerarPdf(idCuenta, idRefCon, tipo, tipoDoc);

        //        rsp = "Ok";
        //        //if (resp.estadoCreacion.ToString() == "Ok")
        //        //{
        //        respuesta = "Se registro la modificación correctamente.";
        //        //}
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = "Error al registrar," + ex.Message + ".";
        //    }
        //    //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //    return true;
        //}


        //public async Task<ActionResult> GenerarPdf(int idCuenta, int idRefCon, int tipo, string tipoDoc)//int Anio, String NroHistoria, int bd)
        //{
        //    string generacion_pdf = "";
        //    string sWebRootFolder = "";
        //    var path = "";
        //    bool resulfirma = false;
        //    StringBuilder html = new StringBuilder();
        //    HtmlToPdf ohtml = new HtmlToPdf();
        //    bool resp = false;

        //    Conexion con = new Conexion();
        //    sWebRootFolder = con.ObtenerServidorArchivos();
        //    try
        //    {
        //        //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

        //        // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

        //        path = Path.Combine(sWebRootFolder, "HojasRefCon", (idRefCon + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipoDoc + ".pdf"));
        //        Comun.ClUtilirario cl = new Comun.ClUtilirario();

        //        PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

        //        PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
        //        ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;

        //        ohtml.Options.PdfPageSize = pageSize;

        //        string Ruta = Url.Action("HojaRefCon", "Referencia", new { area = "Comun", idRefCon = idRefCon, tipo = tipo }, "http");
        //        PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);
        //        //PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia=" + idConstancia.ToString());

        //        //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
        //        //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
        //        UtilitarioController utilitarioController = new UtilitarioController();

        //        DalAtenciones daoAtenciones = new DalAtenciones();
        //        DataSet lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuenta);



        //        string nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

        //        await utilitarioController.GuardarArchivoV2(
        //                nroHistoria + "/ConsultaExterna/" + idCuenta.ToString() + "/HojasRefCon",
        //                (idCuenta.ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipoDoc + ".pdf"),
        //                ohtml, Ruta, Int32.Parse(idCuenta.ToString()), tipoDoc, Int32.Parse(idRefCon.ToString())
        //            );

        //        //obPdfDoc.Save(path);
        //        //generacion_pdf = "Ok";
        //        //if (generacion_pdf == "Ok")
        //        //{
        //        //    //verificar creacion 
        //        //    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuenta.ToString()), tipoDoc, Int32.Parse(idRefCon.ToString()));
        //        //    //quita creacion 
        //        //    //Espera resultado de la tarea, no termina hasta termine
        //        //    resulfirma = await Tbol;
        //        //    resp = true;
        //        //}
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { exep = e.ToString() });
        //        //return e.ToString();
        //        //return false;
        //        //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
        //    }

        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
        //    //return true;
        //    /*byte[] pdf = obPdfDoc.Save();
        //    MemoryStream ms = new MemoryStream();
        //    ms = new MemoryStream();
        //    ms.Write(pdf, 0, pdf.Length);
        //    ms.Position = 0;
        //    obPdfDoc.Close();
        //    return new FileStreamResult(ms,MediaTypeNames.Application.Pdf);*/
        //}

        public async Task<ActionResult> HojaRefCon(int idRefCon, int tipo)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            // int Anio, String NroHistoria, int bd) {
            DataSet HojaPaciente = new DataSet();
            DataSet lsDiagnosticos;

            DalReferencia daoRef = new DalReferencia();
            HojaPaciente = daoRef.DatosHojaRefCon(idRefCon, tipo);

            var idAtencion = Int32.Parse(HojaPaciente.Tables[0].Rows[0]["IdAtencion"].ToString());

            DalAtenciones dalAtenciones = new DalAtenciones();
            lsDiagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarXidAtencion(Int32.Parse(HojaPaciente.Tables[0].Rows[0]["IdAtencion"].ToString()));
            DataTable dtDx = lsDiagnosticos.Tables[0];
            //int anio = Int32.Parse(DatosPaciente.Tables[0].Rows[0]["Anio"].ToString());

            @ViewBag.NroHoja = HojaPaciente.Tables[0].Rows[0]["IpressOrigen"] + "-" + HojaPaciente.Tables[0].Rows[0]["NroHoja"];

            @ViewBag.Fecha = HojaPaciente.Tables[0].Rows[0]["Fecha"];
            @ViewBag.Dia = HojaPaciente.Tables[0].Rows[0]["Dia"];
            @ViewBag.Mes = HojaPaciente.Tables[0].Rows[0]["Mes"];
            @ViewBag.Anio = HojaPaciente.Tables[0].Rows[0]["Anio"];
            @ViewBag.Hora = HojaPaciente.Tables[0].Rows[0]["Hora"];

            @ViewBag.IpressOrigen = HojaPaciente.Tables[0].Rows[0]["IpressOrigen"];
            @ViewBag.Origen = HojaPaciente.Tables[0].Rows[0]["Origen"];
            @ViewBag.UpsOrigen = HojaPaciente.Tables[0].Rows[0]["UpsOrigen"];

            @ViewBag.IpressDestino = HojaPaciente.Tables[0].Rows[0]["IpressDestino"];
            @ViewBag.Destino = HojaPaciente.Tables[0].Rows[0]["Destino"];
            @ViewBag.UpsDestino = HojaPaciente.Tables[0].Rows[0]["UpsDestino"];

            @ViewBag.TipoDocumento = HojaPaciente.Tables[0].Rows[0]["TipoDocumento"];
            @ViewBag.NroDocumento = HojaPaciente.Tables[0].Rows[0]["NroDocumento"];
            @ViewBag.Rn = HojaPaciente.Tables[0].Rows[0]["Rn"];
            @ViewBag.Financiador = HojaPaciente.Tables[0].Rows[0]["Financiador"];
            @ViewBag.NroAfiliacion = HojaPaciente.Tables[0].Rows[0]["NroAfiliacion"];
            @ViewBag.NroHistoria = HojaPaciente.Tables[0].Rows[0]["NroHistoria"];
            @ViewBag.ApPaterno = HojaPaciente.Tables[0].Rows[0]["ApPaterno"];
            @ViewBag.ApMaterno = HojaPaciente.Tables[0].Rows[0]["ApMaterno"];
            @ViewBag.Nombres = HojaPaciente.Tables[0].Rows[0]["Nombres"];
            @ViewBag.Sexo = HojaPaciente.Tables[0].Rows[0]["Sexo"];
            @ViewBag.FechaNacimiento = HojaPaciente.Tables[0].Rows[0]["FechaNacimiento"];
            @ViewBag.Edad = HojaPaciente.Tables[0].Rows[0]["Edad"];
            @ViewBag.Domicilio = HojaPaciente.Tables[0].Rows[0]["Domicilio"];
            @ViewBag.Departamento = HojaPaciente.Tables[0].Rows[0]["Departamento"];
            @ViewBag.Provincia = HojaPaciente.Tables[0].Rows[0]["Provincia"];
            @ViewBag.Distrito = HojaPaciente.Tables[0].Rows[0]["Distrito"];


            //@ViewBag.DxEgreso = HojaPaciente.Tables[0].Rows[0]["DxEgreso"];
            @ViewBag.DxEgreso = dtDx;
            //@ViewBag.IndiceDx = 0;
            @ViewBag.Tratamiento = HojaPaciente.Tables[0].Rows[0]["Tratamiento"];


            @ViewBag.Especialidad = HojaPaciente.Tables[0].Rows[0]["Especialidad"];

            @ViewBag.Medico = HojaPaciente.Tables[0].Rows[0]["Medico"];
            @ViewBag.ProfesionMedico = HojaPaciente.Tables[0].Rows[0]["ProfesionMedico"];
            @ViewBag.ColegioMedico = HojaPaciente.Tables[0].Rows[0]["ColegioMedico"];

            @ViewBag.MedicoEESS = HojaPaciente.Tables[0].Rows[0]["MedicoEESS"];
            @ViewBag.ProfesionMedicoEESS = HojaPaciente.Tables[0].Rows[0]["ProfesionMedicoEESS"];
            @ViewBag.ColegioMedicoEESS = HojaPaciente.Tables[0].Rows[0]["ColegioMedicoEESS"];

            @ViewBag.Condicion = HojaPaciente.Tables[0].Rows[0]["IdCondicionUsuario"];

            @ViewBag.CodeFirma = HojaPaciente.Tables[0].Rows[0]["code"];
            if (@ViewBag.CodeFirma != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);

                using (Bitmap bitMap = qrCode.GetGraphic(20))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        @ViewBag.CodigoQR = ms.ToArray();
                    }
                }
            }

            if (tipo == 1)
            {
                @ViewBag.TP = HojaPaciente.Tables[0].Rows[0]["TP"];
                @ViewBag.PA = HojaPaciente.Tables[0].Rows[0]["PA"];
                @ViewBag.FR = HojaPaciente.Tables[0].Rows[0]["FR"];
                @ViewBag.FC = HojaPaciente.Tables[0].Rows[0]["FC"];
                @ViewBag.Anamnesis = HojaPaciente.Tables[0].Rows[0]["Anamnesis"];
                @ViewBag.ExamenFisico = HojaPaciente.Tables[0].Rows[0]["ExamenFisico"];
                @ViewBag.Motivo = HojaPaciente.Tables[0].Rows[0]["Motivo"];
                @ViewBag.DetalleMotivo = HojaPaciente.Tables[0].Rows[0]["DetalleMotivo"];
                @ViewBag.Observaciones = HojaPaciente.Tables[0].Rows[0]["Observaciones"];
                @ViewBag.CondicionPaciente = HojaPaciente.Tables[0].Rows[0]["CondicionPaciente"];
                @ViewBag.TipoTransporte = HojaPaciente.Tables[0].Rows[0]["TipoTransporte"];
                return PartialView("~/Views/Comun/Plantillas/HojaReferencia.cshtml");
            }
            else
            {
                @ViewBag.DxOrigen = HojaPaciente.Tables[0].Rows[0]["DxOrigen"];
                @ViewBag.DxIngreso = HojaPaciente.Tables[0].Rows[0]["DxIngreso"];
                @ViewBag.Calificacion = HojaPaciente.Tables[0].Rows[0]["Calificacion"];
                @ViewBag.Recomendaciones = HojaPaciente.Tables[0].Rows[0]["Recomendaciones"];
                return PartialView("~/Views/Comun/Plantillas/HojaContrareferencia.cshtml");
            }




            /*@ViewBag.FechaNac = DatosPaciente.Tables[0].Rows[0]["FechaNac"];
            @ViewBag.HoraNac = DatosPaciente.Tables[0].Rows[0]["HoraNac"];
            @ViewBag.Sexo = DatosPaciente.Tables[0].Rows[0]["Sexo"].ToString().ToUpper(); ;
            @ViewBag.Condicion = DatosPaciente.Tables[0].Rows[0]["Condicion"].ToString().ToUpper();
            @ViewBag.TipoParto = DatosPaciente.Tables[0].Rows[0]["TipoParto"].ToString().ToUpper();
            @ViewBag.Peso = DatosPaciente.Tables[0].Rows[0]["Peso"];
            if (DatosPaciente.Tables[0].Rows[0]["Peso"] != null)
            {
                @ViewBag.Peso = DatosPaciente.Tables[0].Rows[0]["Peso"] + " gr";
                @ViewBag.PesoNum = DatosPaciente.Tables[0].Rows[0]["Peso"];
            }
            @ViewBag.Talla = DatosPaciente.Tables[0].Rows[0]["Talla"];
            if (DatosPaciente.Tables[0].Rows[0]["Peso"] != null)
            {
                @ViewBag.Talla = DatosPaciente.Tables[0].Rows[0]["Talla"] + " cm";
            }
            @ViewBag.EdadGes = DatosPaciente.Tables[0].Rows[0]["EdadGes"];
            if (@ViewBag.EdadGes != null)
            {
                @ViewBag.EdadGes = DatosPaciente.Tables[0].Rows[0]["EdadGes"] + " Semanas";
                @ViewBag.EdadGesNum = DatosPaciente.Tables[0].Rows[0]["EdadGes"];
            }

            @ViewBag.Asiento = DatosPaciente.Tables[0].Rows[0]["NroFolio"].ToString().ToUpper();
            @ViewBag.NroFolio = DatosPaciente.Tables[0].Rows[0]["Asiento"].ToString().ToUpper();
            @ViewBag.Padre = DatosPaciente.Tables[0].Rows[0]["Padre"].ToString().ToUpper();

            String[] Fecha = DateTime.Now.ToLongDateString().Split(',');
            @ViewBag.Fecha = Fecha[1];
            //@ViewBag.Usuario = HttpContext.Session.GetString("codusuario").ToString().ToUpper(); 

            if (anio >= 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstanciaRn.cshtml");
            }
            else
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia2Rn.cshtml");
            }

            /*
            if (anio >= 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstanciaRn.cshtml");
            } else if(anio >= 2005 && anio < 2020)
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia2Rn.cshtml");
            } else
            {
                return PartialView("~/Views/Estadistica/ReporteConstancia3Rn.cshtml");
            }
            */

        }

        public async Task<FileStreamResult> statusAndDownload(ClasesFirma.ResultUpload f, int idCuentaAtencion, int idRegistro, string tipo)
        {
            Console.WriteLine("estado del Archivo Firmado");
            var client = new HttpClient();
            var client2 = new HttpClient();
            var json = JsonConvert.SerializeObject(f);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("http://172.16.40.22:9000/api/getstatus", content);
            string idDoc = "";
            MemoryStream ms = new MemoryStream();

            if (response.IsSuccessStatusCode)
            {
                var resultUpload = JsonConvert.DeserializeObject<ClasesFirma.ResultUpload>(await response.Content.ReadAsStringAsync());
                Console.WriteLine($"signUrl: {resultUpload.signUrl}");
                Console.WriteLine($"code: {resultUpload.code}");
                Console.WriteLine($"status: {resultUpload.status}");
                Console.WriteLine($"documentFileMapperList: {resultUpload.documentFileMapperList.Count}");
                foreach (var item in resultUpload.documentFileMapperList)
                {
                    //Console.WriteLine("id: {0}, name: {1}", item.id, item.documentName);
                    idDoc = item.id;
                }

                if (idDoc != "")
                {
                    DalUtilitario dl = new DalUtilitario();
                    var rsFirma = await dl.InsertaFirma(resultUpload.signUrl, resultUpload.code, idDoc, idCuentaAtencion, idRegistro, tipo, "U", resultUpload.status, "");
                    ClasesFirma.ResultUpload rsUpl = new ClasesFirma.ResultUpload();
                    rsUpl.code = resultUpload.code;
                    rsUpl.documentId = idDoc;
                    var json2 = JsonConvert.SerializeObject(rsUpl);
                    var content2 = new StringContent(json2, System.Text.Encoding.UTF8, "application/json");
                    var response2 = await client2.PostAsync("http://172.16.40.22:9000/api/getsigneddocument", content2);
                    //MemoryStream ms = new MemoryStream();
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Devolviendo archivo en Archivo Firmado ");
                        var b = await response2.Content.ReadAsByteArrayAsync();

                        ms.Write(b, 0, b.Length);
                        ms.Position = 0;


                        return new FileStreamResult(
                                ms,
                                MediaTypeNames.Application.Pdf
                            );


                    }
                }



                //DownloadFiles(new ClasesFirma.ResultUpload { code = resultUpload.code, documentId = idDoc });

            }

            return new FileStreamResult(
                                ms,
                                MediaTypeNames.Application.Pdf
                            );
        }

        [HttpPost]
        public async Task<ActionResult> MigrarRefCon(int idCuentaAtencion)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalParametros daoParametros = new DalParametros();

            DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

            string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            var url = $"" + urlServicio + "/integracion/v1.0/referencia/saveReferencia/";
            var request = (HttpWebRequest)WebRequest.Create(url);

            request.Method = "POST";
            request.ContentType = "application/json";
            request.Accept = "application/json;charset=UTF-8";

            request.Headers.Add("username", "user_6208");
            request.Headers.Add("ipclient", "143.137.146.68");

            DataSet dataSet = null;

            DalAtenciones dalAtenciones = new DalAtenciones();
            DalMigradores dalMigradores = new DalMigradores();

            dataSet = await dalAtenciones.GenerarTramaJsonParaEnvioByIdCuentaAtencion(idCuentaAtencion);

            if (dataSet.Tables[0].Rows[0]["estado"].ToString() == "1")
            {
                return Json(new
                {
                    estado = true,
                    tipo = 2,
                    msj = "La referencia ya fue registrada",
                    data = new { idReferencia = dataSet.Tables[0].Rows[0]["idReferencia"], nro_referencia = dataSet.Tables[0].Rows[0]["nro_referencia"], respuesta = new { codRespuesta = "--", mensajeRespuesta = "--" } }
                });
            }

            try
            {
                var tmpObj = System.Json.JsonValue.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
            }
            catch (FormatException fex)
            {
                //Invalid json format
                Debug.Print(fex.Message.ToString());
                return Json(new { estado = false, tipo = 2, msj = "Error formato: Es posible que los datos de triaje no esten completos \n Peso, Talla, Frecuencia Cardiaca, Frecuencia Respiratoria, Presion Arterial " });
            }
            catch (Exception ex) //some other exception
            {
                Debug.Print(ex.Message.ToString());
                return Json(new { estado = false, tipo = 2, msj = "Ocurrio un problema json: Es posible que los datos de triaje no esten completos \n Peso, Talla, Frecuencia Cardiaca, Frecuencia Respiratoria, Presion Arterial " });
            }


            try
            {
                using (var streamWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8))
                {
                    JObject json = JObject.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
                    streamWriter.Write(json);
                    streamWriter.Flush();
                    streamWriter.Close();

                    Console.WriteLine(json);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();

                            JObject json = JObject.Parse(responseBody);
                            JObject respuesta = JObject.Parse(json.Property("respuesta").Value.ToString());

                            if (respuesta.Property("codRespuesta").Value.ToString() == "0000")
                            {
                                dalMigradores.ActualizarJsonRefCon(
                                Int32.Parse(dataSet.Tables[0].Rows[0]["id_cuenta"].ToString()), 1, json.Property("idReferencia").Value.ToString(),
                                json.Property("nro_referencia").Value.ToString(),
                                DateTime.Now, respuesta.Property("codRespuesta").Value.ToString(), respuesta.Property("mensajeRespuesta").Value.ToString());
                            }
                            else
                            {
                                dalMigradores.ActualizarJsonRefCon(
                                Int32.Parse(dataSet.Tables[0].Rows[0]["id_cuenta"].ToString()), 2, json.Property("idReferencia").Value.ToString(),
                                json.Property("nro_referencia").Value.ToString(),
                                DateTime.Now, respuesta.Property("codRespuesta").Value.ToString(), respuesta.Property("mensajeRespuesta").Value.ToString());
                            }

                            return Json(new { estado = true, tipo = 1, msj = "Se proceso correctamente!", data = json });
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex);
                return Json(new { estado = false, tipo = 3, msj = "Ocurrio un problema: " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> MigrarContraRef(int idCuentaAtencion)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalParametros daoParametros = new DalParametros();

            DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

            string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            var url = $"" + urlServicio + "/integracion/v1.0/contrareferencia/saveContrareferencia";
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Accept = "application/json;charset=UTF-8";

            var username = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:username");
            var ipclient = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:ipclient");
            request.Headers.Add("username", username);
            request.Headers.Add("ipclient", ipclient);

            DataSet dataSet = null;

            DalAtenciones dalAtenciones = new DalAtenciones();
            DalMigradores dalMigradores = new DalMigradores();

            dataSet = await dalAtenciones.GenerarTramaJsonParaEnvioContraRefByIdCuentaAtencion(idCuentaAtencion);

            if (dataSet.Tables[0].Rows[0]["estado"].ToString() == "1")
            {
                return Json(new
                {
                    estado = true,
                    tipo = 2,
                    msj = "La referencia ya fue registrada",
                    data = new { idReferencia = dataSet.Tables[0].Rows[0]["idReferencia"], nro_referencia = dataSet.Tables[0].Rows[0]["nro_referencia"], respuesta = new { codRespuesta = "--", mensajeRespuesta = "--" } }
                });
            }

            try
            {
                Console.WriteLine("Nadaaa");
                Console.WriteLine(dataSet.Tables[0].Rows[0]["json"].ToString());
                var tmpObj = System.Json.JsonValue.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
            }
            catch (FormatException fex)
            {
                //Invalid json format
                Debug.Print(fex.Message.ToString());
                return Json(new { estado = false, tipo = 2, msj = "Error formato: Es posible que los datos de triaje no esten completos \n Peso, Talla, Frecuencia Cardiaca, Frecuencia Respiratoria, Presion Arterial " });
            }
            catch (Exception ex) //some other exception
            {
                Debug.Print(ex.Message.ToString());
                return Json(new { estado = false, tipo = 2, msj = "Ocurrio un problema json: Es posible que los datos de triaje no esten completos \n Peso, Talla, Frecuencia Cardiaca, Frecuencia Respiratoria, Presion Arterial " });
            }


            try
            {
                using (var streamWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8))
                {
                    JObject json = JObject.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
                    streamWriter.Write(json);
                    streamWriter.Flush();
                    streamWriter.Close();

                    Console.WriteLine(json);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();

                            JObject json = JObject.Parse(responseBody);
                            JObject respuesta = JObject.Parse(json.Property("respuesta").Value.ToString());

                            if (respuesta.Property("codRespuesta").Value.ToString() == "0000")
                            {
                                dalMigradores.ActualizarJsonContraRef(
                                Int32.Parse(dataSet.Tables[0].Rows[0]["id_cuenta"].ToString()), 1, json.Property("idreferencia").Value.ToString(),
                                json.Property("nro_contrareferencia").Value.ToString(),
                                DateTime.Now, respuesta.Property("codRespuesta").Value.ToString(), respuesta.Property("mensajeRespuesta").Value.ToString());
                            }
                            else
                            {
                                dalMigradores.ActualizarJsonContraRef(
                                Int32.Parse(dataSet.Tables[0].Rows[0]["id_cuenta"].ToString()), 2, json.Property("idreferencia").Value.ToString(),
                                json.Property("nro_contrareferencia").Value.ToString(),
                                DateTime.Now, respuesta.Property("codRespuesta").Value.ToString(), respuesta.Property("mensajeRespuesta").Value.ToString());
                            }

                            return Json(new { estado = true, tipo = 1, msj = "Se proceso correctamente!", data = json });
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex);
                return Json(new { estado = false, tipo = 3, msj = "Ocurrio un problema: " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> EstadoReferencia(string idReferencia)
        {
            DalParametros daoParametros = new DalParametros();
            DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);
            string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            var url = $"" + urlServicio + "/integracion/v1.0/referencia/estadoReferencia?idReferencia=" + idReferencia;
            //ActionResult respuesta = await ConsumirWebService(url);
            ActionResult respuesta = ConsumirWebService(url);
            return respuesta;
        }

        



        

        [HttpPost]
        public async Task<ActionResult> recibirReferenciaPaciente(string data)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalParametros daoParametros = new DalParametros();

            DataSet dsParametros = await daoParametros.SeleccionaFilaParametro2(1060);

            string urlServicio = dsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            var url = $"" + urlServicio + "/recibirReferenciaPaciente";
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Accept = "application/json;charset=UTF-8";

            var username = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:username");
            var ipclient = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:ipclient");
            var password = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:REFCON:password");
            request.Headers.Add("username", username);
            request.Headers.Add("password", password);
            request.Headers.Add("ipclient", ipclient);

            //DataSet dataSet = null;

            DalAtenciones dalAtenciones = new DalAtenciones();
            DalMigradores dalMigradores = new DalMigradores();
            DalReferencia dalReferencia = new DalReferencia();

            try
            {
                using (var streamWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.UTF8))
                {

                    //JObject json = new JObject {
                    //    data
                    //};
                    JObject json = JObject.Parse(data);

                    //JObject json = JObject.Parse(dataSet.Tables[0].Rows[0]["json"].ToString());
                    streamWriter.Write(json);
                    streamWriter.Flush();
                    streamWriter.Close();

                    Console.WriteLine(data);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();


                            JObject json = JObject.Parse(responseBody);

                            //string codigoRespuesta = json["codigoRespuesta"].ToString();


                            //if (codigoRespuesta == "0000")
                            //{
                            //    dataSet = await dalReferencia.ActualizarPacienteRecibidoReferencias(Int32.Parse(idReferencia));
                            //}


                            return Json(new { estado = true, tipo = 1, msj = "correcto", data = json });
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex);
                return Json(new { estado = false, tipo = 3, msj = "Ocurrio un problema: " + ex });
            }

        }

        [HttpPost]
        public async Task<ActionResult> REFCONSP_REGISTRO_CITA(RefconMinsa objRef)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet ds;
            DalReferencia daoReferencia = new DalReferencia();
            //Boolean hoja;

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            var (res, dataSet) = await daoReferencia.REFCONSP_REGISTRO_CITA(objRef, idUsuario);
            //objRef.IdReferencia = Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString());

            return Json(new { respuesta = res, data = dataSet, session = true });
        }

    }
}