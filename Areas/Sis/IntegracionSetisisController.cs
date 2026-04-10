using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using WebAppMaternidad.CapaEntidades;
using System.Collections.Generic;
using static NPOI.HSSF.Util.HSSFColor;
using MathNet.Numerics.Providers.LinearAlgebra;
using NPOI.Util;
using System.Text;
using SharpCompress.Common;

namespace WebAppMaternidad.Areas.Sis
{
    public class IntegracionSetisisController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> EnviarFua(int IdCuentaAtencion, string jsonP)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds = new DataSet();
            //DataSet resumen = null;

            JObject jResp, jResp2, jResp3;
            string json = "";
            //string respuesta = "";
            SetisisLogin login = new SetisisLogin();
            SetisisConsulta consulta = new SetisisConsulta();

            string sWebRootFolder = con.ObtenerServidorArchivos();
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                //ActionResult registrarFuaResponse = null;

                ds = await dalSis.AtencionFua(IdCuentaAtencion);

                jsonP = GenerarTramaJsonAtencion(ds);

                login.usuario = "setisis";
                login.contrasena = "1234";
                login.ip = "*";                
                json = JsonConvert.SerializeObject(login, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                jResp = SetisisLogin(json);

                string token = jResp["data"]?["token"]?.ToString();
                jResp2 = SetisisEnvio(jsonP, token);

                string guid = jResp2["data"]?["guid"]?.ToString();
                consulta.guid = guid;
                json = JsonConvert.SerializeObject(consulta, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                jResp3 = SetisisConsulta(json, token);


                return Json(new { session = true, estado = true, msg = "", data = jResp, data2 = jResp2, data3 = jResp3 });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }


        public JObject SetisisLogin(string json)
        {
            //var url = service;
            Conexion con = new Conexion();
            SetisisServiceConfig configuracionServicio = new SetisisServiceConfig();
            configuracionServicio = con.obtenerApiSetisisLogin();

            var conex1 = configuracionServicio.URL;
            var conex2 = configuracionServicio.ContentType;
            //var conex3 = configuracionServicio.Email;
            //var conex4 = configuracionServicio.ApiKey;

            //string respuesta = "";
            JObject respuesta;

            string Url = conex1.ToString();
            string ContentType = conex2.ToString();
            //string Email = conex3.ToString();
            //string ApiKey = conex4.ToString();

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            //request.ContentType = "application/json";
            //request.Accept = "application/json;charset=UTF-8";
            request.Headers.Add("Content-Type", ContentType);
            //request.Headers.Add("email", Email);
            //request.Headers.Add("apikey", ApiKey);

            //string jsonResp;

            try
            {
                using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(json);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            //respuesta = JsonConvert.SerializeObject(jsonResp, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, Formatting = Formatting.Indented });
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
                //respuesta = JsonConvert.SerializeObject(ex, Formatting.Indented);
                //return ex.Message.ToString();
                return respuesta;
            }
        }

        public JObject SetisisEnvio(string json, string token)
        {
            //var url = service;
            Conexion con = new Conexion();
            SetisisServiceConfig configuracionServicio = new SetisisServiceConfig();
            configuracionServicio = con.obtenerApiSetisisEnvio();

            var conex1 = configuracionServicio.URL;
            var conex2 = configuracionServicio.ContentType;
            //var conex3 = configuracionServicio.Email;
            //var conex4 = configuracionServicio.ApiKey;

            //string respuesta = "";
            JObject respuesta;

            string Url = conex1.ToString();
            string ContentType = conex2.ToString();
            string AuthToken = "Bearer " + token;
            //string Email = conex3.ToString();
            //string ApiKey = conex4.ToString();

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            //request.ContentType = "application/json";
            //request.Accept = "application/json;charset=UTF-8";
            request.Headers.Add("Content-Type", ContentType);
            request.Headers.Add("Authorization", AuthToken);

            //request.Headers.Add("email", Email);
            //request.Headers.Add("apikey", ApiKey);

            //string jsonResp;

            try
            {
                using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(json);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            //respuesta = JsonConvert.SerializeObject(jsonResp, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, Formatting = Formatting.Indented });
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
                //respuesta = JsonConvert.SerializeObject(ex, Formatting.Indented);
                //return ex.Message.ToString();
                return respuesta;
            }
        }

        public JObject SetisisConsulta(string json, string token)
        {
            //var url = service;
            Conexion con = new Conexion();
            SetisisServiceConfig configuracionServicio = new SetisisServiceConfig();
            configuracionServicio = con.obtenerApiSetisisConsulta();

            var conex1 = configuracionServicio.URL;
            var conex2 = configuracionServicio.ContentType;
            //var conex3 = configuracionServicio.Email;
            //var conex4 = configuracionServicio.ApiKey;

            //string respuesta = "";
            JObject respuesta;

            string Url = conex1.ToString();
            string ContentType = conex2.ToString();
            string AuthToken = "Bearer " + token;
            //string Email = conex3.ToString();
            //string ApiKey = conex4.ToString();

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            //request.ContentType = "application/json";
            //request.Accept = "application/json;charset=UTF-8";
            request.Headers.Add("Content-Type", ContentType);
            request.Headers.Add("Authorization", AuthToken);

            //request.Headers.Add("email", Email);
            //request.Headers.Add("apikey", ApiKey);

            //string jsonResp;

            try
            {
                using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(json);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            //respuesta = JsonConvert.SerializeObject(jsonResp, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, Formatting = Formatting.Indented });
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
                //respuesta = JsonConvert.SerializeObject(ex, Formatting.Indented);
                //return ex.Message.ToString();
                return respuesta;
            }
        }

        
        public string esStringVacio(string valor)
        {
            if(valor == "")
            {
                return null;
            } else
            {
                return valor;
            }
        }

        public string GenerarTramaJsonAtencion(DataSet datos)
        {
            string jsonTrama = "";


            SetisisAtenciones atencion = new SetisisAtenciones();
            SetisisAtencion atenc = new SetisisAtencion();
            SetisisControl control = new SetisisControl();
            SetisisAtDiagnostico atDiagnosticos = new SetisisAtDiagnostico();
            SetisisAtInsumo atInsumos = new SetisisAtInsumo();
            SetisisAtMedicamento atMedicamentos = new SetisisAtMedicamento();
            SetisisAtProcedimiento atProcedimientos = new SetisisAtProcedimiento();
            SetisisAtRecienNacido atRecienNacidos = new SetisisAtRecienNacido();
            SetisisAtServAdicional atServAdicionales = new SetisisAtServAdicional();
            SetisisAtServMatInfantil atServMatInfantiles = new SetisisAtServMatInfantil();
            SetisisAtTransporte atTransportes = new SetisisAtTransporte();
            SetisisAtViatico atViaticos = new SetisisAtViatico();
            SetisisAtOtroGasto atOtrosGastos = new SetisisAtOtroGasto();


            atenc.idAtencion = esStringVacio(datos.Tables[0].Rows[0]["idAtencion"].ToString());
            atenc.loteFua = esStringVacio(datos.Tables[0].Rows[0]["loteFua"].ToString());
            atenc.nroFua = esStringVacio(datos.Tables[0].Rows[0]["nroFua"].ToString());
            atenc.renipress = esStringVacio(datos.Tables[0].Rows[0]["renipress"].ToString());
            atenc.idCategoria = esStringVacio(datos.Tables[0].Rows[0]["idCategoria"].ToString());
            atenc.nivel = esStringVacio(datos.Tables[0].Rows[0]["nivel"].ToString());
            atenc.idPuntoDigitacion = esStringVacio(datos.Tables[0].Rows[0]["idPuntoDigitacion"].ToString());
            atenc.idComponente = esStringVacio(datos.Tables[0].Rows[0]["idComponente"].ToString());
            atenc.idDisaAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idDisaAsegurado"].ToString());
            atenc.idLoteAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idLoteAsegurado"].ToString());
            atenc.idCorrelativoAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idCorrelativoAsegurado"].ToString());
            atenc.idSecuenciaAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idSecuenciaAsegurado"].ToString());
            atenc.idTablaAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idTablaAsegurado"].ToString());
            atenc.idContratoAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idContratoAsegurado"].ToString());
            atenc.idPlan = esStringVacio(datos.Tables[0].Rows[0]["idPlan"].ToString());
            atenc.idGrupoPoblacional = esStringVacio(datos.Tables[0].Rows[0]["idGrupoPoblacional"].ToString());
            atenc.idTipoDocAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idTipoDocAsegurado"].ToString());
            atenc.numDocAsegurado = esStringVacio(datos.Tables[0].Rows[0]["numDocAsegurado"].ToString());
            atenc.apePaterno = esStringVacio(datos.Tables[0].Rows[0]["apePaterno"].ToString());
            atenc.apeMaterno = esStringVacio(datos.Tables[0].Rows[0]["apeMaterno"].ToString());
            atenc.nombres = esStringVacio(datos.Tables[0].Rows[0]["nombres"].ToString());
            atenc.fecNac = esStringVacio(datos.Tables[0].Rows[0]["fecNac"].ToString());
            atenc.idSexo = esStringVacio(datos.Tables[0].Rows[0]["idSexo"].ToString());
            atenc.idUbigeo = esStringVacio(datos.Tables[0].Rows[0]["idUbigeo"].ToString());
            atenc.historiaClinica = esStringVacio(datos.Tables[0].Rows[0]["historiaClinica"].ToString());
            atenc.idTipoAtencion = esStringVacio(datos.Tables[0].Rows[0]["idTipoAtencion"].ToString());
            atenc.idCondicionMaterna = esStringVacio(datos.Tables[0].Rows[0]["idCondicionMaterna"].ToString());
            atenc.idModalidadAtencion = esStringVacio(datos.Tables[0].Rows[0]["idModalidadAtencion"].ToString());
            atenc.nroAutorizacion = esStringVacio(datos.Tables[0].Rows[0]["nroAutorizacion"].ToString());
            atenc.montoAutorizado = esStringVacio(datos.Tables[0].Rows[0]["montoAutorizado"].ToString());
            atenc.fecHoraAtencion = esStringVacio(datos.Tables[0].Rows[0]["fecHoraAtencion"].ToString());
            atenc.renipressReferencia = esStringVacio(datos.Tables[0].Rows[0]["renipressReferencia"].ToString());
            atenc.nroHojaReferencia = esStringVacio(datos.Tables[0].Rows[0]["nroHojaReferencia"].ToString());
            atenc.idServicio = esStringVacio(datos.Tables[0].Rows[0]["idServicio"].ToString());
            atenc.idOrigenPersonal = esStringVacio(datos.Tables[0].Rows[0]["idOrigenPersonal"].ToString());
            atenc.idLugarAtencion = esStringVacio(datos.Tables[0].Rows[0]["idLugarAtencion"].ToString());
            atenc.idDestinoAsegurado = esStringVacio(datos.Tables[0].Rows[0]["idDestinoAsegurado"].ToString());
            atenc.fecIngresoHospitalizacion = esStringVacio(datos.Tables[0].Rows[0]["fecIngresoHospitalizacion"].ToString());
            atenc.fecAltaHospitalizacion = esStringVacio(datos.Tables[0].Rows[0]["fecAltaHospitalizacion"].ToString());
            atenc.renipressContraReferencia = esStringVacio(datos.Tables[0].Rows[0]["renipressContraReferencia"].ToString());
            atenc.nroHojaContraReferencia = esStringVacio(datos.Tables[0].Rows[0]["nroHojaContraReferencia"].ToString());
            atenc.fecParto = esStringVacio(datos.Tables[0].Rows[0]["fecParto"].ToString());
            atenc.idGrupoRiesgo = esStringVacio(datos.Tables[0].Rows[0]["idGrupoRiesgo"].ToString());
            atenc.fecFallecimiento = esStringVacio(datos.Tables[0].Rows[0]["fecFallecimiento"].ToString());
            atenc.renipressOfertaFlexible = esStringVacio(datos.Tables[0].Rows[0]["renipressOfertaFlexible"].ToString());
            atenc.idEtnia = esStringVacio(datos.Tables[0].Rows[0]["idEtnia"].ToString());
            atenc.idIafas = esStringVacio(datos.Tables[0].Rows[0]["idIafas"].ToString());
            atenc.idCodigoIafas = esStringVacio(datos.Tables[0].Rows[0]["idCodigoIafas"].ToString());
            atenc.idUps = esStringVacio(datos.Tables[0].Rows[0]["idUps"].ToString());
            atenc.fecCorteAdministrativo = esStringVacio(datos.Tables[0].Rows[0]["fecCorteAdministrativo"].ToString());
            atenc.idUdrAutorizaVinculado = esStringVacio(datos.Tables[0].Rows[0]["idUdrAutorizaVinculado"].ToString());
            atenc.loteAutorizaVinculado = esStringVacio(datos.Tables[0].Rows[0]["loteAutorizaVinculado"].ToString());
            atenc.nroAutorizaVinculado = esStringVacio(datos.Tables[0].Rows[0]["nroAutorizaVinculado"].ToString());
            atenc.disaFuaVinculado = esStringVacio(datos.Tables[0].Rows[0]["disaFuaVinculado"].ToString());
            atenc.loteFuaVinculado = esStringVacio(datos.Tables[0].Rows[0]["loteFuaVinculado"].ToString());
            atenc.nroFuaVinculado = esStringVacio(datos.Tables[0].Rows[0]["nroFuaVinculado"].ToString());
            atenc.idTipoDocRespAte = esStringVacio(datos.Tables[0].Rows[0]["idTipoDocRespAte"].ToString());
            atenc.numDocRespAte = esStringVacio(datos.Tables[0].Rows[0]["numDocRespAte"].ToString());
            atenc.idTipoPersonalSalud = esStringVacio(datos.Tables[0].Rows[0]["idTipoPersonalSalud"].ToString());
            atenc.idEspecialidadRespAte = esStringVacio(datos.Tables[0].Rows[0]["idEspecialidadRespAte"].ToString());
            atenc.esEgresadoRespAte = esStringVacio(datos.Tables[0].Rows[0]["esEgresadoRespAte"].ToString());
            atenc.colegiaturaRespAte = esStringVacio(datos.Tables[0].Rows[0]["colegiaturaRespAte"].ToString());
            atenc.rneRespAte = esStringVacio(datos.Tables[0].Rows[0]["rneRespAte"].ToString());
            atenc.idTipoDocDigitador = esStringVacio(datos.Tables[0].Rows[0]["idTipoDocDigitador"].ToString());
            atenc.numDocDigitador = esStringVacio(datos.Tables[0].Rows[0]["numDocDigitador"].ToString());
            atenc.fecHoraRegistro = esStringVacio(datos.Tables[0].Rows[0]["fecHoraRegistro"].ToString());
            atenc.observacion = esStringVacio(datos.Tables[0].Rows[0]["observacion"].ToString());
            atenc.versionAplicativo = esStringVacio(datos.Tables[0].Rows[0]["versionAplicativo"].ToString());
            atenc.codigoAcreditacion = esStringVacio(datos.Tables[0].Rows[0]["codigoAcreditacion"].ToString());
            atenc.fecHoraIniFuaAdm = esStringVacio(datos.Tables[0].Rows[0]["fecHoraIniFuaAdm"].ToString());
            atenc.fecHoraFinFuaAdm = esStringVacio(datos.Tables[0].Rows[0]["fecHoraFinFuaAdm"].ToString());
            atenc.idMotivoIngresoCasaMaterna = esStringVacio(datos.Tables[0].Rows[0]["idMotivoIngresoCasaMaterna"].ToString());
            atenc.idCasaMaterna = esStringVacio(datos.Tables[0].Rows[0]["idCasaMaterna"].ToString());
            atenc.idEstado = esStringVacio(datos.Tables[0].Rows[0]["idEstado"].ToString());
            atenc.esObservado = esStringVacio(datos.Tables[0].Rows[0]["esObservado"].ToString());


            control.idControl = esStringVacio(datos.Tables[1].Rows[0]["idControl"].ToString());
            control.idProceso = Int32.Parse(datos.Tables[1].Rows[0]["idProceso"].ToString());
            control.fecHoraCrea = esStringVacio(datos.Tables[1].Rows[0]["fecHoraCrea"].ToString());
            control.idUsuarioCrea = Int32.Parse(datos.Tables[1].Rows[0]["idUsuarioCrea"].ToString());
            control.observacion = esStringVacio(datos.Tables[1].Rows[0]["observacion"].ToString());
            atenc.control = control;
            
            

            List<SetisisAtDiagnostico> diagnosticos = new List<SetisisAtDiagnostico>();
            foreach (DataRow row in datos.Tables[2].Rows)
            {
                atDiagnosticos = new SetisisAtDiagnostico();
                atDiagnosticos.codigo = esStringVacio(row["codigo"].ToString());
                atDiagnosticos.nroDiagnostico = esStringVacio(row["nroDiagnostico"].ToString());
                atDiagnosticos.tipoMovimiento = esStringVacio(row["tipoMovimiento"].ToString());
                atDiagnosticos.tipoDiagnostico = esStringVacio(row["tipoDiagnostico"].ToString());
                diagnosticos.Add(atDiagnosticos);
            }             
            atenc.atDiagnosticos = diagnosticos;
                        

            List<SetisisAtInsumo> insumos = new List<SetisisAtInsumo>();
            foreach (DataRow row in datos.Tables[3].Rows)
            {
                atInsumos = new SetisisAtInsumo();
                atInsumos.codigo = esStringVacio(row["codigo"].ToString());
                atInsumos.nroDiagnostico = esStringVacio(row["nroDiagnostico"].ToString());
                atInsumos.cantPrescrita = esStringVacio(row["cantPrescrita"].ToString());
                atInsumos.cantEntregada = esStringVacio(row["cantEntregada"].ToString());
                atInsumos.lote = esStringVacio(row["lote"].ToString());
                atInsumos.nroSerie = esStringVacio(row["nroSerie"].ToString());
                atInsumos.registroSanitario = esStringVacio(row["registroSanitario"].ToString());
                atInsumos.fecVencimiento = esStringVacio(row["fecVencimiento"].ToString());
                atInsumos.contieneOtrosDatos = esStringVacio(row["contieneOtrosDatos"].ToString());
                insumos.Add(atInsumos);
            }            
            atenc.atInsumos = insumos;

            

            List<SetisisAtMedicamento> medicamentos = new List<SetisisAtMedicamento>();
            foreach (DataRow row in datos.Tables[4].Rows)
            {
                atMedicamentos = new SetisisAtMedicamento();
                atMedicamentos.codigo = esStringVacio(row["codigo"].ToString());
                atMedicamentos.nroDiagnostico = esStringVacio(row["nroDiagnostico"].ToString());
                atMedicamentos.cantPrescrita = esStringVacio(row["cantPrescrita"].ToString());
                atMedicamentos.cantEntregada = esStringVacio(row["cantEntregada"].ToString());
                atMedicamentos.fecPetitorio = esStringVacio(row["fecPetitorio"].ToString());
                atMedicamentos.nroDocPetitorio = esStringVacio(row["nroDocPetitorio"].ToString());
                atMedicamentos.lote = esStringVacio(row["lote"].ToString());
                atMedicamentos.nroSerie = esStringVacio(row["nroSerie"].ToString());
                atMedicamentos.registroSanitario = esStringVacio(row["registroSanitario"].ToString());
                atMedicamentos.fecVencimiento = esStringVacio(row["fecVencimiento"].ToString());
                atMedicamentos.contieneOtrosDatos = esStringVacio(row["contieneOtrosDatos"].ToString());
                medicamentos.Add(atMedicamentos);
            }            
            atenc.atMedicamentos = medicamentos;

            

            List<SetisisAtProcedimiento> procedimientos = new List<SetisisAtProcedimiento>();
            foreach (DataRow row in datos.Tables[5].Rows)
            {
                atProcedimientos = new SetisisAtProcedimiento();
                atProcedimientos.codigo = esStringVacio(row["codigo"].ToString());
                atProcedimientos.nroDiagnostico = esStringVacio(row["nroDiagnostico"].ToString());
                atProcedimientos.cantPrescrita = esStringVacio(row["cantPrescrita"].ToString());
                atProcedimientos.cantEntregada = esStringVacio(row["cantEntregada"].ToString());
                atProcedimientos.resultado = esStringVacio(row["resultado"].ToString());
                procedimientos.Add(atProcedimientos);
            }            
            atenc.atProcedimientos = procedimientos;

            

            List<SetisisAtRecienNacido> recienNacidos = new List<SetisisAtRecienNacido>();
            foreach (DataRow row in datos.Tables[6].Rows)
            {
                atRecienNacidos = new SetisisAtRecienNacido();
                atRecienNacidos.nroRN = esStringVacio(row["nroRN"].ToString());
                atRecienNacidos.tipoDocumento = esStringVacio(row["tipoDocumento"].ToString());
                atRecienNacidos.nroDocumento = esStringVacio(row["nroDocumento"].ToString());
                atRecienNacidos.disaAfiliacion = esStringVacio(row["disaAfiliacion"].ToString());
                atRecienNacidos.formatoContratoAfil = esStringVacio(row["formatoContratoAfil"].ToString());
                atRecienNacidos.nroContratoAfil = esStringVacio(row["nroContratoAfil"].ToString());
                atRecienNacidos.secuenciaContAfil = esStringVacio(row["secuenciaContAfil"].ToString());
                atRecienNacidos.apePaterno = esStringVacio(row["apePaterno"].ToString());
                atRecienNacidos.apeMaterno = esStringVacio(row["apeMaterno"].ToString());
                atRecienNacidos.primerNombre = esStringVacio(row["primerNombre"].ToString());
                atRecienNacidos.segundoNombre = esStringVacio(row["segundoNombre"].ToString());
                atRecienNacidos.identificadorRegAfil = Int32.Parse(row["identificadorRegAfil"].ToString());
                atRecienNacidos.identificadorTabla = esStringVacio(row["identificadorTabla"].ToString());
                recienNacidos.Add(atRecienNacidos);
            }            
            atenc.atRecienNacidos = recienNacidos;

            

            List<SetisisAtServAdicional> serviciosAdiconales = new List<SetisisAtServAdicional>();
            foreach (DataRow row in datos.Tables[7].Rows)
            {
                atServAdicionales = new SetisisAtServAdicional();
                atServAdicionales.codigo = esStringVacio(row["codigo"].ToString());
                serviciosAdiconales.Add(atServAdicionales);
            }            
            atenc.atServAdicionales = serviciosAdiconales;

            

            List<SetisisAtServMatInfantil> servMatInfantiles = new List<SetisisAtServMatInfantil>();
            foreach (DataRow row in datos.Tables[8].Rows)
            {
                atServMatInfantiles = new SetisisAtServMatInfantil();
                atServMatInfantiles.codigo = esStringVacio(row["codigo"].ToString());
                atServMatInfantiles.resultado = esStringVacio(row["resultado"].ToString());
                servMatInfantiles.Add(atServMatInfantiles);
            }            
            atenc.atServMatInfantiles = servMatInfantiles;

            

            List<SetisisAtTransporte> transportes = new List<SetisisAtTransporte>();
            foreach (DataRow row in datos.Tables[9].Rows)
            {
                atTransportes = new SetisisAtTransporte();
                atTransportes.codigo = Int32.Parse(row["codigo"].ToString());
                atTransportes.nroPasajeros = Int32.Parse(row["nroPasajeros"].ToString());
                atTransportes.cantidad = Int32.Parse(row["cantidad"].ToString());
                atTransportes.precio = Decimal.Parse(row["precio"].ToString());
                atTransportes.total = Decimal.Parse(row["total"].ToString());
                transportes.Add(atTransportes);
            }            
            atenc.atTransportes = transportes;

            

            List<SetisisAtViatico> viaticos = new List<SetisisAtViatico>();
            foreach (DataRow row in datos.Tables[10].Rows)
            {
                atViaticos = new SetisisAtViatico();
                atViaticos.codigo = Int32.Parse(row["codigo"].ToString());
                atViaticos.nroDias = Int32.Parse(row["nroDias"].ToString());
                atViaticos.nroComisionados = Int32.Parse(row["nroComisionados"].ToString());
                atViaticos.total = Decimal.Parse(row["total"].ToString());
                viaticos.Add(atViaticos);
            }            
            atenc.atViaticos = viaticos;

            

            List<SetisisAtOtroGasto> gastos = new List<SetisisAtOtroGasto>();
            foreach (DataRow row in datos.Tables[11].Rows)
            {
                atOtrosGastos = new SetisisAtOtroGasto();
                atOtrosGastos.codigo = Int32.Parse(row["codigo"].ToString());
                atOtrosGastos.cantidad = Int32.Parse(row["cantidad"].ToString());
                atOtrosGastos.nroDias = Int32.Parse(row["nroDias"].ToString());
                atOtrosGastos.precio = Int32.Parse(row["precio"].ToString());
                atOtrosGastos.total = Decimal.Parse(row["total"].ToString());
                gastos.Add(atOtrosGastos);
            }            
            atenc.atOtrosGastos = gastos;

            List<SetisisAtencion> atenciones = new List<SetisisAtencion>();
            atenciones.Add(atenc);
            atencion.atencion = atenciones;


            jsonTrama = JsonConvert.SerializeObject(atencion, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include, Formatting = Formatting.Indented });

            return jsonTrama;
        }


        public async Task<ActionResult> MigraPaqueteSetiSIS(string fileName)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds = new DataSet();
            //DataSet resumen = null;

            JObject jResp, jsonPaquete;

            string sWebRootFolder = con.ObtenerServidorArchivos();

            string filePath = $"{sWebRootFolder}/SOASISV4/{fileName}";
            string json = "";

            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:usuario");
            var autorizacion = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:autorizacion");


            SetisisLogin login = new SetisisLogin();
            SetisisConsulta consulta = new SetisisConsulta();

            
            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {

                login.usuario = usuario;
                login.clave = autorizacion;
                login.ip = "*";
                json = JsonConvert.SerializeObject(login, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                jResp = SetisisAuth(json);

                var token = jResp["access_token"].ToString();

                jsonPaquete = SetisisCargarPaquete(token, filePath);

                return Json(new { session = true, estado = true, msg = "", jsonPaquete = jsonPaquete, paquete = fileName });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }

        public async Task<ActionResult> ConsultarPaqueteSetiSIS(string fileName)
        {
            Conexion con = new Conexion();
            DalParametros dalParametros = new DalParametros();
            DalSis dalSis = new DalSis();
            DataSet param = await dalParametros.SeleccionaFilaParametro2(1004);
            DataSet ds = new DataSet();
            //DataSet resumen = null;

            JObject jResp, jsonPaquete;

            string sWebRootFolder = con.ObtenerServidorArchivos();

            string json = "";

            var usuario = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:usuario");
            var autorizacion = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("CredentialStrings:SOASIS:autorizacion");


            SetisisLogin login = new SetisisLogin();
            SetisisConsulta consulta = new SetisisConsulta();


            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {

                login.usuario = usuario;
                login.clave = autorizacion;
                login.ip = "*";
                json = JsonConvert.SerializeObject(login, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                jResp = SetisisAuth(json);

                var token = jResp["access_token"].ToString();

                jsonPaquete = SetisisConsultaPaquete(token, fileName);

                return Json(new { session = true, estado = true, msg = "", jsonPaquete = jsonPaquete, paquete = fileName });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = "" });
            }

        }
        public JObject SetisisAuth(string json)
        {
            //var url = service;
            Conexion con = new Conexion();
            SetisisServiceConfig configuracionServicio = new SetisisServiceConfig();
            configuracionServicio = con.obtenerApiSetisisAuth();

            var conex1 = configuracionServicio.URL;
            var conex2 = configuracionServicio.ContentType;
            //var conex3 = configuracionServicio.Email;
            //var conex4 = configuracionServicio.ApiKey;

            //string respuesta = "";
            JObject respuesta;

            string Url = conex1.ToString();
            string ContentType = conex2.ToString();
            //string Email = conex3.ToString();
            //string ApiKey = conex4.ToString();

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "POST";
            //request.ContentType = "application/json";
            //request.Accept = "application/json;charset=UTF-8";
            request.Headers.Add("Content-Type", ContentType);
            //request.Headers.Add("email", Email);
            //request.Headers.Add("apikey", ApiKey);

            //string jsonResp;

            try
            {
                using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    streamWriter.Write(json);
                }

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            //respuesta = JsonConvert.SerializeObject(jsonResp, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, Formatting = Formatting.Indented });
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
                //respuesta = JsonConvert.SerializeObject(ex, Formatting.Indented);
                //return ex.Message.ToString();
                return respuesta;
            }
        }

        public JObject SetisisCargarPaquete(string token, string filePath)
        {
            Conexion con = new Conexion();
            SetisisServiceConfig configuracionServicio = con.obtenerApiSetisisCargaPaquete();

            JObject respuesta;

            string url = configuracionServicio.URL;
            string boundary = "----Boundary" + DateTime.Now.Ticks.ToString("x");

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = $"multipart/form-data; boundary={boundary}";
            request.Headers.Add("Authorization", $"Bearer {token}");

            try
            {
                using (Stream requestStream = request.GetRequestStream())
                using (BinaryWriter writer = new BinaryWriter(requestStream))
                {
                    // --- Header del archivo ---
                    writer.Write(Encoding.UTF8.GetBytes($"--{boundary}\r\n"));
                    writer.Write(Encoding.UTF8.GetBytes($"Content-Disposition: form-data; name=\"archivoZip\"; filename=\"{Path.GetFileName(filePath)}\"\r\n"));
                    writer.Write(Encoding.UTF8.GetBytes("Content-Type: application/zip\r\n\r\n"));

                    // --- Contenido del archivo ---
                    using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                    {
                        fileStream.CopyTo(requestStream);
                    }

                    // --- Fin del formulario ---
                    writer.Write(Encoding.UTF8.GetBytes($"\r\n--{boundary}--\r\n"));
                    writer.Flush();
                }

                // Obtener la respuesta
                using (WebResponse response = request.GetResponse())
                using (Stream responseStream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(responseStream))
                {
                    string responseBody = reader.ReadToEnd();
                    respuesta = JObject.Parse(responseBody);
                }

                return respuesta;
            }
            catch (WebException ex)
            {
                string mensajeError = "";
                using (var stream = ex.Response?.GetResponseStream())
                using (var reader = stream != null ? new StreamReader(stream) : null)
                {
                    mensajeError = reader?.ReadToEnd() ?? ex.Message;
                }

                Console.WriteLine("Error 400 o similar: " + mensajeError);

                string responseError = "{ \"procesado\" : \"false\", \"mensaje\" : \"" + mensajeError.Replace("\"", "'") + "\" }";
                return JObject.Parse(responseError);
            }
        }

        public JObject SetisisConsultaPaquete(string token, string paquete)
        {
            //var url = service;
            Conexion con = new Conexion();
            SetisisServiceConfig configuracionServicio = new SetisisServiceConfig();
            configuracionServicio = con.obtenerApiSetisisConsultaPaquete();

            var conex1 = configuracionServicio.URL;
            var conex2 = configuracionServicio.ContentType;
            //var conex3 = configuracionServicio.Email;
            //var conex4 = configuracionServicio.ApiKey;

            //string respuesta = "";
            JObject respuesta;

            string Url = conex1.ToString() + paquete;
            string ContentType = conex2.ToString();
            string AuthToken = "Bearer " + token;
            //string Email = conex3.ToString();
            //string ApiKey = conex4.ToString();

            var request = (HttpWebRequest)WebRequest.Create(Url);
            request.Method = "GET";
            //request.ContentType = "application/json";
            //request.Accept = "application/json;charset=UTF-8";
            request.Headers.Add("Content-Type", ContentType);
            request.Headers.Add("Authorization", AuthToken);

            //request.Headers.Add("email", Email);
            //request.Headers.Add("apikey", ApiKey);

            //string jsonResp;

            try
            {
                //using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
                //{
                //    streamWriter.Write(json);
                //}

                using (WebResponse response = request.GetResponse())
                {
                    using (Stream strReader = response.GetResponseStream())
                    {
                        if (strReader == null) return null;
                        using (StreamReader objReader = new StreamReader(strReader))
                        {
                            string responseBody = objReader.ReadToEnd();
                            JObject jsonResp = JObject.Parse(responseBody);
                            //respuesta = JsonConvert.SerializeObject(jsonResp, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, Formatting = Formatting.Indented });
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
                //respuesta = JsonConvert.SerializeObject(ex, Formatting.Indented);
                //return ex.Message.ToString();
                return respuesta;
            }
        }

    }
}
