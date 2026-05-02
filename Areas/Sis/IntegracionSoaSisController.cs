using CapaDatos;
//using ICSharpCode.SharpZipLib.Zip;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SoaSisPruebaReference;
using SoaSisProduccionReference;
using System;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using WebAppMaternidad.Controllers;
using Newtonsoft.Json;
using System.Collections.Generic;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Sis
{
    public class IntegracionSoaSisController: BaseController
    {

        //public async Task<ActionResult> IntegracionSoaSisPrueba(string paqueteNombre)
        public ActionResult IntegracionSoaSisPrueba(string paqueteNombre)
        {
            Conexion con = new Conexion();
            SoaSisPruebaReference.requestHeader request = new SoaSisPruebaReference.requestHeader();
            SoaSisPruebaReference.registrarFuaRequest fuaRequest = new SoaSisPruebaReference.registrarFuaRequest();

            string sWebRootFolder = con.ObtenerServidorArchivos();
            FileStream stream = new FileStream(@"" + sWebRootFolder + "SOASIS/" + paqueteNombre, FileMode.Open);

            byte[] bytes;
            using (var memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();
            }
            string base64 = Convert.ToBase64String(bytes);

            var canal = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:canal");
            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:usuario");
            var autorizacion = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:autorizacion");
            
            request.canal = canal.ToString();
            request.usuario = usuario.ToString();
            request.autorizacion = autorizacion.ToString();

            fuaRequest.nombreZip = paqueteNombre;
            fuaRequest.dataZip = bytes;

            SoaSisPruebaReference.registroFuaBatchClient registroFua = new SoaSisPruebaReference.registroFuaBatchClient(SoaSisPruebaReference.registroFuaBatchClient.EndpointConfiguration.registroFuaBatchSoap);

            SoaSisPruebaReference.registrarFuaResponse fuaResponse = registroFua.registrarFuaPublico(request, fuaRequest);
            //BuscarAseguradosRequestBody requestBody = new BuscarAseguradosRequestBody { Disa = "250", TipoFormato = "2", Contrato = "77344460" };
            //BuscarAseguradosRequest request = new BuscarAseguradosRequest();
            //request.Body = requestBody;
            //BuscarAseguradosResponse response = client.BuscarAsegurados("250", "2", "77344460", "", "");
            Console.WriteLine("fuaResponse");
            Console.WriteLine(fuaResponse);
            stream.Close();
            stream.Dispose();
            return Json(new { resultado = fuaResponse });
        }

        //public async Task<ActionResult> IntegracionSoaSisProduccion(string paqueteNombre)
        public ActionResult IntegracionSoaSisProduccion(string paqueteNombre)
        {
            Conexion con = new Conexion();
            SoaSisProduccionReference.requestHeader request = new SoaSisProduccionReference.requestHeader();
            SoaSisProduccionReference.registrarFuaRequest fuaRequest = new SoaSisProduccionReference.registrarFuaRequest();

            string sWebRootFolder = con.ObtenerServidorArchivos();
            FileStream stream = new FileStream(@"" + sWebRootFolder + "SOASIS/" + paqueteNombre, FileMode.Open);

            byte[] bytes;
            using (var memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();
            }
            string base64 = Convert.ToBase64String(bytes);

            var canal = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:canal");
            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:usuario");
            var autorizacion = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:autorizacion");

            request.canal = canal.ToString();
            request.usuario = usuario.ToString();
            request.autorizacion = autorizacion.ToString();

            fuaRequest.nombreZip = paqueteNombre;
            fuaRequest.dataZip = bytes;

            SoaSisProduccionReference.registroFuaBatchClient registroFua = new SoaSisProduccionReference.registroFuaBatchClient(SoaSisProduccionReference.registroFuaBatchClient.EndpointConfiguration.registroFuaBatchSoap);

            SoaSisProduccionReference.registrarFuaResponse fuaResponse = registroFua.registrarFuaPublico(request, fuaRequest);
            //BuscarAseguradosRequestBody requestBody = new BuscarAseguradosRequestBody { Disa = "250", TipoFormato = "2", Contrato = "77344460" };
            //BuscarAseguradosRequest request = new BuscarAseguradosRequest();
            //request.Body = requestBody;
            //BuscarAseguradosResponse response = client.BuscarAsegurados("250", "2", "77344460", "", "");
            Console.WriteLine("fuaResponse");
            Console.WriteLine(fuaResponse);
            stream.Close();
            stream.Dispose();
            return Json(new { resultado = fuaResponse });
        }

        public async Task<ActionResult> GenerarIntegracionSoaSis(int mesEnvio, int anioEnvio, int mesProduccion, int anioProduccion)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds, resumen = null;

            string sWebRootFolder = con.ObtenerServidorArchivos();
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                ActionResult registrarFuaResponse = null;

                string ipress = param.Tables[0].Rows[0]["ValorTexto"].ToString().PadLeft(8, '0');
                string nroEnvio = await GenerarNumeroEnvio(mesProduccion, anioProduccion);
                string nombrePaquete =  ipress + anioProduccion.ToString() + mesProduccion.ToString().PadLeft(2, '0') + nroEnvio.PadLeft(5, '0') + ".zip";

                ds = await dalSis.Atencion(mesEnvio, anioEnvio, mesProduccion, anioProduccion);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCION.TXT", ds);

                ds = await dalSis.AtencionSer(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONSER.TXT", ds);

                ds = await dalSis.AtencionRN(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONRN.TXT", ds);

                ds = await dalSis.AtencionPro(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONPRO.TXT", ds);

                ds = await dalSis.AtencionMed(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONMED.TXT", ds);

                ds = await dalSis.AtencionIns(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONINS.TXT", ds);

                ds = await dalSis.AtencionDia(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONDIA.TXT", ds);

                ds = await dalSis.AtencionSmi(mesEnvio, anioEnvio);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONSMI.TXT", ds);

                var pass = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:passwordPaquete");
                String comprimido = dalSis.ComprimirArchivo($"{sWebRootFolder}/SOASIS/TRAMAS", $"{sWebRootFolder}/SOASIS/" + nombrePaquete, pass.ToString());

                if(comprimido == "Ok")
                {
                    Console.WriteLine(anioEnvio.ToString(), mesEnvio.ToString(), nroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460");
                    resumen = await dalSis.AtencionResumen(anioEnvio.ToString(), mesEnvio.ToString(), nroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460", anioProduccion.ToString(), mesProduccion.ToString());
                    await GenerarTramaResumenTxt($"{sWebRootFolder}/SOASIS/TRAMAS/RESUMEN.TXT", resumen);

                    var env = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:enviroment");
                    if(env.ToString() == "dev")
                    {
                        //registrarFuaResponse = await IntegracionSoaSisPrueba(nombrePaquete);
                        registrarFuaResponse = IntegracionSoaSisPrueba(nombrePaquete);
                    } else if(env.ToString() == "prod")
                    {
                        //registrarFuaResponse = await IntegracionSoaSisProduccion(nombrePaquete);
                        registrarFuaResponse = IntegracionSoaSisProduccion(nombrePaquete);
                    }
                    
                } 
                else {
                    return Json(new { session = true, estado = false, msg = "Error al generar paquete, intente nuevamente", data = registrarFuaResponse });
                }

                return Json(new { session = true, estado = true, msg = "", data = registrarFuaResponse });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }

        public async Task<ActionResult> GenerarIntegracionSoaSisv2(DateTime fechaInicio, DateTime fechaFin, int mesProduccion, int anioProduccion, string fuaUPS)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds, resumen = null;

            string sWebRootFolder = con.ObtenerServidorArchivos();
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                ActionResult registrarFuaResponse = null;

                string ipress = param.Tables[0].Rows[0]["ValorTexto"].ToString().PadLeft(8, '0');
                string nroEnvio = await GenerarNumeroEnvio(mesProduccion, anioProduccion);
                string nombrePaquete = ipress + anioProduccion.ToString() + mesProduccion.ToString().PadLeft(2, '0') + nroEnvio.PadLeft(5, '0') + ".zip";

                if (!Directory.Exists(Path.Combine(sWebRootFolder, $"{sWebRootFolder}/SOASIS/TRAMAS")))
                {
                    Directory.CreateDirectory(Path.Combine(sWebRootFolder, $"{sWebRootFolder}/SOASIS/TRAMAS"));
                }

                ds = await dalSis.Atencionv2(fechaInicio, fechaFin, mesProduccion, anioProduccion, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCION.TXT", ds);

                ds = await dalSis.AtencionServ2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONSER.TXT", ds);

                ds = await dalSis.AtencionRNv2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONRN.TXT", ds);

                ds = await dalSis.AtencionProv2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONPRO.TXT", ds);

                ds = await dalSis.AtencionMedv2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONMED.TXT", ds);

                ds = await dalSis.AtencionInsv2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONINS.TXT", ds);

                ds = await dalSis.AtencionDiav2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONDIA.TXT", ds);

                ds = await dalSis.AtencionSmiv2(fechaInicio, fechaFin, fuaUPS);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONSMI.TXT", ds);

                resumen = await dalSis.AtencionResumenv2(fechaInicio, fechaFin, nroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460", anioProduccion.ToString(), mesProduccion.ToString(), fuaUPS);
                await GenerarTramaResumenTxt($"{sWebRootFolder}/SOASIS/TRAMAS/RESUMEN.TXT", resumen);

                var pass = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:passwordPaquete");
                String comprimido = dalSis.ComprimirArchivo($"{sWebRootFolder}/SOASIS/TRAMAS", $"{sWebRootFolder}/SOASIS/" + nombrePaquete, pass.ToString());

                if (comprimido == "Ok")
                {
                    //Console.WriteLine(anioEnvio.ToString(), mesEnvio.ToString(), nroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460");
                    

                    var env = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:enviroment");
                    if (env.ToString() == "dev")
                    {
                        //registrarFuaResponse = await IntegracionSoaSisPrueba(nombrePaquete);
                        registrarFuaResponse = IntegracionSoaSisPrueba(nombrePaquete);
                    }
                    else if (env.ToString() == "prod")
                    {
                        //registrarFuaResponse = await IntegracionSoaSisProduccion(nombrePaquete);
                        registrarFuaResponse = IntegracionSoaSisProduccion(nombrePaquete);
                    }

                }
                else
                {
                    return Json(new { session = true, estado = false, msg = "Error al generar paquete, intente nuevamente", data = registrarFuaResponse });
                }

                return Json(new { session = true, estado = true, msg = "", data = registrarFuaResponse });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }

        public async Task<ActionResult> MigracionSOASIS(DateTime FECHAINICIO, DateTime FECHAFIN, string fuaUPS, string numeroEnvio, string nombrePaquete, int mesProduccion, int anioProduccion)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds, resumen = null;

            string sWebRootFolder = con.ObtenerServidorArchivos();
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                ActionResult registrarFuaResponse = null;

                //string ipress = param.Tables[0].Rows[0]["ValorTexto"].ToString().PadLeft(8, '0');
                //string nroEnvio = await GenerarNumeroEnvio(mesProduccion, anioProduccion);
                //string nombrePaquete = ipress + anioProduccion.ToString() + mesProduccion.ToString().PadLeft(2, '0') + nroEnvio.PadLeft(5, '0') + ".zip";

                if (!Directory.Exists(Path.Combine(sWebRootFolder, $"{sWebRootFolder}/SOASIS/TRAMAS")))
                {
                    Directory.CreateDirectory(Path.Combine(sWebRootFolder, $"{sWebRootFolder}/SOASIS/TRAMAS"));
                }

                await dalSis.ListarFuasParaMigrar(FECHAINICIO, FECHAFIN, fuaUPS, anioProduccion.ToString(), mesProduccion.ToString().PadLeft(2, '0'), numeroEnvio, nombrePaquete);


                ds = await dalSis.Atencionv3(nombrePaquete, mesProduccion, anioProduccion);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCION.TXT", ds);

                ds = await dalSis.AtencionServ3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONSER.TXT", ds);

                ds = await dalSis.AtencionRNv3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONRN.TXT", ds);

                ds = await dalSis.AtencionProv3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONPRO.TXT", ds);

                ds = await dalSis.AtencionMedv3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONMED.TXT", ds);

                ds = await dalSis.AtencionInsv3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONINS.TXT", ds);

                ds = await dalSis.AtencionDiav3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONDIA.TXT", ds);

                ds = await dalSis.AtencionSmiv3(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASIS/TRAMAS/ATENCIONSMI.TXT", ds);

                resumen = await dalSis.AtencionResumenv3(numeroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460", anioProduccion.ToString(), mesProduccion.ToString());
                await GenerarTramaResumenTxt($"{sWebRootFolder}/SOASIS/TRAMAS/RESUMEN.TXT", resumen);

                var ruta = $"{sWebRootFolder}/SOASIS/" + nombrePaquete;

                var pass = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:passwordPaquete");
                String comprimido = dalSis.ComprimirArchivo($"{sWebRootFolder}/SOASIS/TRAMAS", $"{sWebRootFolder}/SOASIS/" + nombrePaquete, pass.ToString());

                if (comprimido == "Ok")
                {
                    ////Console.WriteLine(anioEnvio.ToString(), mesEnvio.ToString(), nroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460");

                    //var env = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:enviroment");
                    //if (env.ToString() == "dev")
                    //{
                    //    //registrarFuaResponse = await IntegracionSoaSisPrueba(nombrePaquete);
                    //    registrarFuaResponse = IntegracionSoaSisPrueba(nombrePaquete);
                    //}
                    //else if (env.ToString() == "prod")
                    //{
                    //    //registrarFuaResponse = await IntegracionSoaSisProduccion(nombrePaquete);
                    //    registrarFuaResponse = IntegracionSoaSisProduccion(nombrePaquete);
                    //}



                    // Ruta local del archivo
                    string rutaArchivo = ruta;

                    // Verificar si el archivo existe
                    if (!System.IO.File.Exists(rutaArchivo))
                    {
                        // Manejar el caso en que el archivo no existe
                        return null;
                    }

                    // Leer el contenido del archivo
                    byte[] archivoContenido = System.IO.File.ReadAllBytes(rutaArchivo);

                    // Obtener el nombre del archivo (opcional)
                    string nombreArchivo = Path.GetFileName(rutaArchivo);

                    // Devolver el archivo como un FileResult
                    return File(archivoContenido, "application/octet-stream", nombreArchivo);

                }
                else
                {
                    return Json(new { session = true, estado = false, msg = "Error al generar paquete, intente nuevamente", data = registrarFuaResponse });
                }

                //return Json(new { session = true, estado = true, msg = "", data = registrarFuaResponse });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }
        
        public async Task<ActionResult> MigracionSOASIS_3010(DateTime FECHAINICIO, DateTime FECHAFIN, string fuaUPS, string numeroEnvio, string nombrePaquete, int mesProduccion, int anioProduccion)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds, resumen = null;

            string sWebRootFolder = con.ObtenerServidorArchivos();
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {

                //string ipress = param.Tables[0].Rows[0]["ValorTexto"].ToString().PadLeft(8, '0');
                //string nroEnvio = await GenerarNumeroEnvio(mesProduccion, anioProduccion);
                //string nombrePaquete = ipress + anioProduccion.ToString() + mesProduccion.ToString().PadLeft(2, '0') + nroEnvio.PadLeft(5, '0') + ".zip";

                if (!Directory.Exists(Path.Combine(sWebRootFolder, $"{sWebRootFolder}/SOASISV4/TRAMAS")))
                {
                    Directory.CreateDirectory(Path.Combine(sWebRootFolder, $"{sWebRootFolder}/SOASISV4/TRAMAS"));
                }

                await dalSis.ListarFuasParaMigrar(FECHAINICIO, FECHAFIN, fuaUPS, anioProduccion.ToString(), mesProduccion.ToString().PadLeft(2, '0'), numeroEnvio, nombrePaquete);


                ds = await dalSis.Atencionv4(nombrePaquete, mesProduccion, anioProduccion);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCION.TXT", ds);

                ds = await dalSis.AtencionServ4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONSER.TXT", ds);

                ds = await dalSis.AtencionRNv4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONRN.TXT", ds);

                ds = await dalSis.AtencionProv4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONPRO.TXT", ds);

                ds = await dalSis.AtencionMedv4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONMED.TXT", ds);

                ds = await dalSis.AtencionInsv4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONINS.TXT", ds);

                ds = await dalSis.AtencionDiav4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONDIA.TXT", ds);

                ds = await dalSis.AtencionSmiv4(nombrePaquete);
                await GenerarTramasTxt($"{sWebRootFolder}/SOASISV4/TRAMAS/ATENCIONSMI.TXT", ds);

                resumen = await dalSis.AtencionResumenv4(numeroEnvio.PadLeft(5, '0'), nombrePaquete, "77344460", anioProduccion.ToString(), mesProduccion.ToString());
                await GenerarTramaResumen_310Txt($"{sWebRootFolder}/SOASISV4/TRAMAS/RESUMEN.TXT", resumen);

                var ruta = $"{sWebRootFolder}/SOASISV4/" + nombrePaquete;

                var pass = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:passwordPaquete");
                String comprimido = dalSis.ComprimirArchivo($"{sWebRootFolder}/SOASISV4/TRAMAS", $"{sWebRootFolder}/SOASISV4/" + nombrePaquete, pass.ToString());

                if (comprimido == "Ok")
                {

                    // Ruta local del archivo
                    string rutaArchivo = ruta;

                    // Verificar si el archivo existe
                    if (!System.IO.File.Exists(rutaArchivo))
                    {
                        // Manejar el caso en que el archivo no existe
                        return null;
                    }

                    // Leer el contenido del archivo
                    byte[] archivoContenido = System.IO.File.ReadAllBytes(rutaArchivo);

                    // Obtener el nombre del archivo (opcional)
                    string nombreArchivo = Path.GetFileName(rutaArchivo);

                    // Devolver el archivo como un FileResult
                    //return File(archivoContenido, "application/octet-stream", nombreArchivo);
                    return Json(new { session = true, estado = true, msg = "", data = Json(new { nroEnvio = numeroEnvio, nombrePaquete = nombreArchivo }) });
                }
                else
                {
                    return Json(new { session = true, estado = false, msg = "Error al generar paquete, intente nuevamente", data = "" });
                }

                //return Json(new { session = true, estado = true, msg = "", data = registrarFuaResponse });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }

        public async Task<ActionResult> GenerarNumeroEnvioNombrePaquete(int mesProduccion, int anioProduccion)
        {
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                DalParametros dalParametros = new DalParametros();
                DalSis dalSis = new DalSis();

                DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);

                string ipress = param.Tables[0].Rows[0]["ValorTexto"].ToString().PadLeft(8, '0');
                string nroEnvio = await GenerarNumeroEnvio(mesProduccion, anioProduccion);
                string nombrePaquete = ipress + anioProduccion.ToString() + mesProduccion.ToString().PadLeft(2, '0') + nroEnvio.PadLeft(5, '0') + ".zip";

                var AsignarNroEnvio = await dalSis.AsignarNroEnvio(anioProduccion.ToString(), mesProduccion.ToString().PadLeft(2, '0'), nroEnvio.PadLeft(5, '0'), nombrePaquete);

                return Json(new { session = true, estado = true, msg = "", data = Json(new { nroEnvio = nroEnvio, nombrePaquete = nombrePaquete }) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }
        }
        public async Task<ActionResult> GenerarNumeroEnvioNombrePaquetev2(int mesProduccion, int anioProduccion)
        {
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                DalParametros dalParametros = new DalParametros();
                DalSis dalSis = new DalSis();

                DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);

                string ipress = param.Tables[0].Rows[0]["ValorTexto"].ToString().PadLeft(8, '0');
                string nroEnvio = await GenerarNumeroEnvio(mesProduccion, anioProduccion);
                string nombrePaquete = ipress + anioProduccion.ToString() + mesProduccion.ToString().PadLeft(2, '0') + nroEnvio.PadLeft(5, '0') + ".zip";

                var AsignarNroEnvio = await dalSis.AsignarNroEnvio(anioProduccion.ToString(), mesProduccion.ToString().PadLeft(2, '0'), nroEnvio.PadLeft(5, '0'), nombrePaquete);

                return Json(new { session = true, estado = true, msg = "", data = Json(new { nroEnvio = nroEnvio, nombrePaquete = nombrePaquete }) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }
        }

        public async Task<int> GenerarTramasTxt(string nombreArchivo, DataSet ds)
        {
            Encoding utf8WithoutBom = new UTF8Encoding(false);
            return await Task.Run(() =>
            {
                try
                {
                    using (FileStream flujoArchivo = new FileStream(nombreArchivo, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        using (StreamWriter escritor = new StreamWriter(flujoArchivo, utf8WithoutBom))
                        {   
                            foreach (DataRow row in ds.Tables[0].Rows)
                            {
                                escritor.Write(row["items"].ToString() + "\n");
                            }
                        }
                    }
                    return 1;
                }
                catch (Exception e)
                {
                    Debug.Print(e.Message.ToString());
                    return 0; throw;
                }
            });
            
        }
        public async Task<int> GenerarTramaResumenTxt(string nombreArchivo, DataSet ds)
        {
            Encoding utf8WithoutBom = new UTF8Encoding(false);
            return await Task.Run(() =>
            {
                try
                {
                    using (FileStream flujoArchivo = new FileStream(nombreArchivo, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        using (StreamWriter escritor = new StreamWriter(flujoArchivo, utf8WithoutBom))
                        {
                            escritor.WriteLine(ds.Tables[0].Rows[0]["Anio"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["Mes"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NroEnvio"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NomPaquete"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["VersionGTI"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilATE"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilSMI"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilDIA"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilMED"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilINS"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilPRO"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilSER"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilRN"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NomApp"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["VersApp"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["VersEnvio"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["IdResp"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NroDoc"]);
                        }
                    }
                    return 1;
                }
                catch (Exception e)
                {
                    Debug.Print(e.Message.ToString());
                    return 0; throw;
                }
            });

        }
        public async Task<int> GenerarTramaResumen_310Txt(string nombreArchivo, DataSet ds)
        {
            Encoding utf8WithoutBom = new UTF8Encoding(false);
            return await Task.Run(() =>
            {
                try
                {
                    using (FileStream flujoArchivo = new FileStream(nombreArchivo, FileMode.Create, FileAccess.Write, FileShare.None))
                    {
                        using (StreamWriter escritor = new StreamWriter(flujoArchivo, utf8WithoutBom))
                        {
                            escritor.WriteLine(ds.Tables[0].Rows[0]["Anio"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["Mes"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NroEnvio"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NomPaquete"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["VersionGTI"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilATE"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilSMI"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilDIA"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilMED"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilINS"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilPRO"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilSER"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilRN"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilTRA"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilVIA"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["CantFilOTRG"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NomApp"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["VersApp"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["VersEnvio"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["IdResp"]);
                            escritor.WriteLine(ds.Tables[0].Rows[0]["NroDoc"]);
                        }
                    }
                    return 1;
                }
                catch (Exception e)
                {
                    Debug.Print(e.Message.ToString());
                    return 0; throw;
                }
            });

        }
        public async Task<string> GenerarNumeroEnvio(int mes, int anio)
        {
            DalSis dalSis = new DalSis();

            DataSet envio = await dalSis.ObtenerNumeroEnvioSoaSis(mes, anio);
            string nroEnvio = envio.Tables[0].Rows[0]["numero"].ToString();

            return nroEnvio;
        }

        [HttpGet]
        public async Task<ActionResult> ListarServiciosParaFUA()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalSis.ListarServiciosParaFUA();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesFuaParaMigracion(DateTime FechaInicio, DateTime FechaFin, string FuaUPS)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalSis.ListarAtencionesFuaParaMigracion(FechaInicio, FechaFin, FuaUPS);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ActualizarFuasAEstadoMigrado(DateTime FechaInicio, DateTime FechaFin, string FuaUPS)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalSis.ActualizarFuasAEstadoMigrado(FechaInicio, FechaFin, FuaUPS);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> InsertarATESOASISBK(int IdCuentaAtencion, string FuaDisa, string FuaLote, string FuaNumero, string Anio, string Mes, string NroEnvio, int Estado, string Paquete)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalSis.InsertarATESOASISBK(IdCuentaAtencion, FuaDisa, FuaLote, FuaNumero, Anio, Mes, NroEnvio, Estado, Paquete);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ActualizarEstadoATESOASISBK(int IdCuentaAtencion, int Estado)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalSis.ActualizarEstadoATESOASISBK(IdCuentaAtencion, Estado);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpGet]
        public async Task<ActionResult> ListarPaquetesMigradosSis()
        {
            DataSet dataSet = null;
            //int nRpta;
            DalSis dalSis = new DalSis();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalSis.ListarPaquetesMigradosSis();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<IActionResult> GenerarReporteErrores(string NombrePaquete, int Tipo, string jsonData)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {

                var lstObjDetallePaquete = JsonConvert.DeserializeObject<List<PaqueteSetiSIS>>(jsonData);

                var dal = new DalSis();
                var idUsuario = IdUsuarioSesion();


                var dataSet = await dal.GenerarReporteMigracionSETISIS(NombrePaquete, Tipo, lstObjDetallePaquete);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ActualizarEstadoSisFuaResumen(string NombrePaquete)
        {

            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {

                var dal = new DalSis();
                var idUsuario = IdUsuarioSesion();


                var dataSet = await dal.ActualizarEstadoSisFuaResumen(NombrePaquete);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }
        }


    }
}
