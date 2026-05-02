using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Newtonsoft.Json;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.Areas.Comun;
using QRCoder;
using System.Drawing;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using Microsoft.CodeAnalysis;
using WebAppMaternidad.CapaEntidades;
using System.Diagnostics;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Controllers;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class AtencionController : BaseController
    {

        private IWebHostEnvironment _hostingEnvironment;

        public AtencionController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }


        ////////////////////////////// REFACTOR /////////////////////////////////////
        /// 
        /// 
        ///
        ///
        [HttpPost]
        public async Task<IActionResult> AtenInteListarPlanIntegralDesarrolloPaciente(AtenIntePlanIntePaciente obj)
        {
            if (!UsuarioAutenticado())
                return SessionExpiredResult();

            try
            {
                obj.idAtenInteGrupo = 1;
                obj.idAtenInteItemPlan = 3;

                var dal = new DalAtenciones();
                var idUsuario = IdUsuarioSesion();

                var dataSet = await dal.AtenInteListarPlanIntegralDesarrolloPaciente(obj);

                return SuccessResponse(dataSet);
            }
            catch (Exception ex)
            {
                return ErrorResponse($"¡Error! {ex.Message}");
            }

        }








        [HttpPost]
        public ActionResult ListarServicio()
        {
            DataSet lstServicio;
            DalUtilitario daoCitas = new DalUtilitario();
            lstServicio = daoCitas.DevuelveDSServicioSinTodos((int)Enumerados.TiposServicio.Consultorios_Externos);
            return Json(lstServicio);
        }

        [HttpPost]
        public async Task<ActionResult> ListaProgramacionBtFecha(string fecha)
        {

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            DataSet lstServicio;
            DalUtilitario daoCitas = new DalUtilitario();
            lstServicio = await daoCitas.DevuelveDSComboxServicioByFecha(fecha, idIpressInt);
            return Json(lstServicio);
        }
        [HttpPost]
        public async Task<ActionResult> ListarAtencionesCE(string fecha, int idServicio, int prog) // JDELGADO J0 task run
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();
            int idUsuario;

            //return await Task.Run(() =>
            //{
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            lsAtencionsCE = await daoAtenciones.ListaCitasCE(fecha, idServicio, idUsuario, prog);
            return Json(new { lstAtenciones = lsAtencionsCE, session = true });
            //});
        }
        [HttpPost]
        public async Task<ActionResult> ListaAtencionByIdCuentaAtencion(int idCuenta)
        {
            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }
                DataSet lsAtencionByCuenta;
                DalAtenciones daoAtenciones = new DalAtenciones();
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                lsAtencionByCuenta = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuenta);
                return Json(new { lstAtenciones = lsAtencionByCuenta, estado = true, session = true });
            });
        }
		
		[HttpPost]
        public async Task<ActionResult> BuscarAtencionParaTriajeNuevo(int idCuenta,string NumeroDocumento,string ApellidoPaterno,string ApellidoMaterno,string Nombres)
        {
            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }
                DataSet lsAtencionByCuenta;
                DalAtenciones daoAtenciones = new DalAtenciones();
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                lsAtencionByCuenta = await daoAtenciones.BuscarAtencionParaTriajeNuevo(idCuenta,NumeroDocumento,ApellidoPaterno,ApellidoMaterno,Nombres);
                return Json(new { lstAtenciones = lsAtencionByCuenta, estado = true, session = true });
            });
        }

        [HttpPost]
        public async Task<ActionResult> ListaAtencionPorCuentaAtencion(int idCuenta)
        {
            return await Task.Run(async () =>
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }
                DataSet lsAtencionByCuenta;
                DalAtenciones daoAtenciones = new DalAtenciones();
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                lsAtencionByCuenta = await daoAtenciones.ListaAtencionPorCuentaAtencion(idCuenta);
                return Json(new { resultado = lsAtencionByCuenta, session = true });
            });

        }


        [HttpPost]
        public async Task<ActionResult> ListaEpisodiosByAtencion(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsEspisodios;
            DalAtenciones daoAtenciones = new DalAtenciones();
            lsEspisodios = await daoAtenciones.ListaEpisodiosByAtencion(idPaciente);
            return Json(lsEspisodios);
        }

        [HttpPost]
        public async Task<ActionResult> TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno()
        {
            DataSet lsDestinoCE;
            DalAtenciones daoAtenciones = new DalAtenciones();
            lsDestinoCE = await daoAtenciones.TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno();
            return Json(lsDestinoCE);
        }
        public string validaAtencion(Atencion obj)
        {
            string msj = "";
            if (obj.idAtencion == 0)
            {
                msj = msj + "Error en el numero de idAtencion<br>";
            }
            if (obj.idCuentaAtencion == 0)
            {
                msj = msj + "Error en el numero de cuenta<br>";
            }

            if (obj.idDestinoAtencion == 0)
            {
                msj = msj + "Error en el destino de atención<br>";
            }
            return msj;
        }

        [HttpPost]
        public async Task<ActionResult> AntecedentesPacienteGuardar(EvaluacionObstetrica objEvalObst,
                                                                    AntecedentesPersonales objAntPersonales,
                                                                    AntecedentesFamiliares objAntFamiliares,
                                                                    AntecedentesObstetricos objAntObstetricos,
                                                                    InfeccionMaterna objInfeccionMaterna,
                                                                    EnfermedadMaterna objEnfermedadMaterna,
                                                                    int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            bool resp = false;

            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalAtenciones dal = new DalAtenciones();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                rsp = await dal.EvaluacionObstetricaGuardar(objEvalObst, idUsuario, idListBar);
                rsp = await dal.PacientesAntecedentesPersonales(objAntPersonales, idUsuario, idListBar);
                rsp = await dal.PacientesAntecedentesFamiliares(objAntFamiliares, idUsuario, idListBar);
                rsp = await dal.PacientesAntecedentesObstetricos(objAntObstetricos, idUsuario, idListBar);
                rsp = await dal.InfeccionesMaternasGuardar(objInfeccionMaterna, idUsuario, idListBar);
                rsp = await dal.EnfermedadesMaternasGuardar(objEnfermedadMaterna, idUsuario, idListBar);

                resp = true;
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = resp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<JsonResult> RegitraModificaAtencion(
            Atencion atencion, AtencionesDatosAdicionales objDatosAdicionales, AtencionEpisodio atencionEpisodio, AtencionEntrevista atencionEntrevista, AtencionDatosAux atencionDatosAux,
            ProCabecera objProCabecera, ProControles objControl, EvaluacionObstetrica objEvalObst, AntecedentesPersonales objAntPersonales,
            AntecedentesFamiliares objAntFamiliares, AntecedentesObstetricos objAntObstetricos, ExamenGinecoObstetra objGiencoObst,
            InfeccionMaterna objInfeccionMaterna, EnfermedadMaterna objEnfermedadMaterna,
            NinioAltoRiesgoAlimentPatologicos objNinioAltoRiesAlimePto, NinioAltoRiesgoAntecPerinatales objNinioAltoRiesAntecPerinatales, NinioAltoRiesgoNacimiento objNinioAltoRiesNacimiento,
            NinioAltoRiesgoVivienda objNinioAltoRiesVivienda, string listaItmsEValuar, int idPlanDesarrolloPaciente, int idPlanIntegralPaciente, AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente,
            Triaje obTriaje, String lstDiagnosticos, string tipoModulo, int idEmpleadoMedico, string codigo, Consejeria consejeria, ConsejeriaOncologica consejeriaOncologica, String lstDiagnosticosConsejeria,
            int idListBar,
            int? esConsejeria = null,
            int? ClasificacionTipoAtencion = null,
            int idReferencia = 0,
            int idContraReferencia = 0
        )
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DalAtenciones daoAtenciones = new DalAtenciones();
                DalTriaje daoTriaje = new DalTriaje();
                DalParametros daoParametros = new DalParametros();

                DataSet lsParametros = new DataSet();

                Boolean resp, resAteCE;
                DataSet respDs = new DataSet();

                int idUsuario;
                int tipoMod = 0;

                var parsedDate = DateTime.Parse(atencion.fechaIngreso);
                string fechaIngreso = parsedDate.ToString("dd/MM/yyyy");

                resp = false;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                //Atencion atencion = new Atencion();
                //atencion.condicionEstablecimiento = idEnEstablecimiento;
                //atencion.condicionservicio = idEnServicio;      
                //atencion.idAtencion = idAtencion;
                atencion.idTipoServicioAtencion = (int)Enumerados.TiposServicio.Consultorios_Externos;
                atencion.idEstadoAtencion = (int)Enumerados.EstadosTabla.sghRegistrado;
                //atencion.fechaEgreso = fechaIngreso;
                //atencion.idDestinoAtencion = idDestino;
                //atencion.idCuentaAtencion = idCuentaAtencion;
                atencion.idUsuario = idUsuario;

                obTriaje.CitaIdUsuario = idUsuario;

                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

                lsParametros = await daoParametros.RetornaFechaServidorV2();

                resAteCE = await daoAtenciones.ModificarAtencionCE(atencion, lstobjDiagnosticos, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, objDatosAdicionales, atencion);       //SE CAMBIO A METODO ASYNC

                DataSet atencionesFinanciamiento = await daoAtenciones.ListaAtencionByIdCuentaAtencion(atencion.idCuentaAtencion);

                //if (atencionesFinanciamiento.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3" && await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                //{
                //    Console.WriteLine("Es sis");
                //    int agregaFua = await daoAtenciones.web_crearModificarFua(atencion.idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione
                //}
                //else
                //{
                //    Console.WriteLine("No Es sis");
                //}

                if (resAteCE)
                {
                    resp = await daoAtenciones.RegitraModifcaEpisodio(atencionEpisodio.numeroEpisodio, atencion.idPaciente, atencionEpisodio.epiNuevo, atencionEpisodio.epiCierre, atencion.idAtencion, idUsuario);
                    resp = await daoAtenciones.InsertarEntrevistaPacienteCE(atencionEntrevista.TipoClasificacion, atencion.idCuentaAtencion, atencionEntrevista.NroHistoria, atencion.idPaciente, atencionEntrevista.NroControles, atencionEntrevista.EdadGest, atencionEntrevista.NroGestas, idUsuario);
                    resp = await daoAtenciones.InsertaDatosAUXCE(atencion.idAtencion, atencionEntrevista.NroHistoria, atencion.idPaciente, idUsuario, atencionDatosAux.antecedQuirurgico, atencionDatosAux.antecedPatologico, atencionDatosAux.antecedObstetrico, atencionDatosAux.antecedAlergico, atencionDatosAux.antecedFamiliar, atencionDatosAux.antecedentes, obTriaje);
                    resp = await daoTriaje.InsertaTriaje(obTriaje);
                }

                #region PERINATAL
                Int32 estadoPerinatal = 0;
                objProCabecera.UsuarioInicio = idUsuario;
                objGiencoObst.IdUsuario = idUsuario;
                if (tipoModulo == "ModuloMaterno" || tipoModulo == "ModuloMaternoAdolescencia")
                {
                    estadoPerinatal = await daoAtenciones.InsertaProCabeceraYControl(objProCabecera, objControl);
                    objAntPersonales.idProCabecera = estadoPerinatal;
                    objAntFamiliares.idProCabecera = estadoPerinatal;
                    objAntObstetricos.idProCabecera = estadoPerinatal;

                    objAntObstetricos.idPrograma = 1;
                    //resp = await daoAtenciones.InsertaEvaluacionEmergencia(objEvalEmg);
                    respDs = await daoAtenciones.EvaluacionObstetricaGuardar(objEvalObst, idUsuario, idListBar);
                    //resp = await daoAtenciones.InsertaAntecedentesPersonales(objAntPersonales);
                    respDs = await daoAtenciones.PacientesAntecedentesPersonales(objAntPersonales, idUsuario, idListBar);
                    //resp = await daoAtenciones.InsertaAntecedentesFamiliares(objAntFamiliares);
                    respDs = await daoAtenciones.PacientesAntecedentesFamiliares(objAntFamiliares, idUsuario, idListBar);
                    //resp = await daoAtenciones.InsertaAntecedentesObstetricos(objAntObstetricos);
                    respDs = await daoAtenciones.PacientesAntecedentesObstetricos(objAntObstetricos, idUsuario, idListBar);
                    respDs = await daoAtenciones.InfeccionesMaternasGuardar(objInfeccionMaterna, idUsuario, idListBar);
                    respDs = await daoAtenciones.EnfermedadesMaternasGuardar(objEnfermedadMaterna, idUsuario, idListBar);
                    resp = await daoAtenciones.InsertaExamenGinecoObstetra(objGiencoObst);

                    tipoMod = 1;
                }
                #endregion


                Boolean respninio = false;
                //ninio alto riesgo
                #region NINIOSANO
                if (tipoModulo == "ModuloNAR")
                {
                    objNinioAltoRiesAlimePto.usuarioRegistro = idUsuario;
                    objNinioAltoRiesAlimePto.usuarioUpdate = idUsuario;
                    objNinioAltoRiesAntecPerinatales.usuarioRegistro = idUsuario;
                    objNinioAltoRiesAntecPerinatales.usuarioUpdate = idUsuario;
                    objNinioAltoRiesNacimiento.usuarioRegistro = idUsuario;
                    objNinioAltoRiesNacimiento.usuarioUpdate = idUsuario;
                    objNinioAltoRiesVivienda.usuarioRegistro = idUsuario;
                    objNinioAltoRiesVivienda.usuarioUpdate = idUsuario;

                    objNinioAltoRiesAlimePto.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesAlimePto.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    objNinioAltoRiesAntecPerinatales.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesAntecPerinatales.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    objNinioAltoRiesNacimiento.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesNacimiento.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    objNinioAltoRiesVivienda.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesVivienda.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    //fechaReceta = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoAlimentPatologicos(objNinioAltoRiesAlimePto);
                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoAntecPerinatales(objNinioAltoRiesAntecPerinatales);
                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoNacimiento(objNinioAltoRiesNacimiento);
                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoVivienda(objNinioAltoRiesVivienda);

                    var lstItems = JsonConvert.DeserializeObject<List<AtenIntePlanDesPacienteDet>>(listaItmsEValuar);
                    if (objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente > 0)
                    {
                        respninio = await daoAtenciones.Insert_Update_AtenIntePlanDesarrolloPaciente(objAtenIntePlanDesarrolloPaciente);
                    }
                    respninio = await daoAtenciones.Insert_AtenIntePlanDesPacienteDet(idPlanDesarrolloPaciente, idPlanIntegralPaciente, lstItems);

                    tipoMod = 2;
                }
                #endregion

                #region ConsejeriaObstetrica
                if (esConsejeria == 1)
                {
                    var lstObjDiagnosticosConsejeria = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosConsejeria);
                    var consejeriaObst = await daoAtenciones.CrearModificarConsejeriaObstetrica(atencion.idAtencion, consejeria, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, lstObjDiagnosticosConsejeria, idUsuario);
                }
                #endregion

                #region ConsejeriaOncologica
                if (esConsejeria == 2)
                {
                    var lstObjDiagnosticosConsejeria = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosConsejeria);
                    var consejeriaOnco = await daoAtenciones.CrearModificarConsejeriaOncologica(atencion.idAtencion, consejeriaOncologica, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, lstObjDiagnosticosConsejeria, idUsuario);
                }
                #endregion

                #region ConsejeriaEstrategiaSanitaria
                if (esConsejeria == 3)
                {
                    var consejeriaEstrategia = await daoAtenciones.CrearModificarConsejeriaEstrategiaSanitaria(atencion.idAtencion, consejeria, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, idUsuario);
                }
                #endregion

                if (tipoModulo == "ModuloAnestesio")
                {
                    //var json = await GenerarFormatoPreAnestesico(atencion.idCuentaAtencion, atencion.idAtencion);
                    //var json = await GenerarHojaAtencion("AN", codigo, atencion.idCuentaAtencion, atencion.idAtencion, atencion.idAtencion, 0, 0, atencion.idTipoServicioAtencion, atencion.idServicioIngreso, 0, idEmpleadoMedico, fechaIngreso);
                    var json = await GenerarHojaAtencion(atencion.idCuentaAtencion, atencion.idAtencion, 0, 0, "AN");
                }
                else
                {
                    //var json = await GeneraPdfYRutaFimaAsync(atencion.idCuentaAtencion, estadoPerinatal, tipoMod);
                    //var json = await GenerarHojaAtencion("AT", codigo, atencion.idCuentaAtencion, atencion.idAtencion, atencion.idAtencion, estadoPerinatal, tipoMod, atencion.idTipoServicioAtencion, atencion.idServicioIngreso, 0, idEmpleadoMedico, fechaIngreso);
                    var json = await GenerarHojaAtencion(atencion.idCuentaAtencion, atencion.idAtencion, estadoPerinatal, tipoMod, "AT");
                }

                if (await daoParametros.SeleccionaPermisoGeneral("REFCON") == "1")
                {
                    var refcon = await ActualizaEmisionRefCon(atencion.idCuentaAtencion, atencion.idDestinoAtencion);       //KHOYOSI (ACTUALIZAR LA HOJA DE REFERENCIA EMITIDA DE ACUERDO AL TIPO DE DESTINO)
                }

                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    if (atencionesFinanciamiento.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3")
                    {
                        Console.WriteLine("Es sis");
                        //int agregaFua = await daoAtenciones.web_crearModificarFua(atencion.idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione  (KHOYOSI: sí funciono xD)                //COMENTADO POR KHOYOSI
                        //var fua = await GenerarFormatoFua(atencion.idCuentaAtencion);     //KHOYOSI (GENERA LA HOJA DEL FUA)                                                                          //COMENTADO POR KHOYOSI

                        resp = await GenerarHojaFua(atencion.idCuentaAtencion, atencion.idCuentaAtencion);
                    }
                }

                //RMOREANO 06032026  CREACION DE CUENTAS PARA PACIENTE CRONICO 
                if (resAteCE  == true & atencion.esPacienteCronico==1)
                {
                    resp = await daoAtenciones.InsertaCuentasPacienteCronico(atencion.idCuentaAtencion, idUsuario);
                }
              

                //RMOREANO 06032026

                resp = await GeneraParteDiarioV2(Int32.Parse(atencionesFinanciamiento.Tables[0].Rows[0]["IdProgramacion"].ToString()));

                var hoja = false;

                if (idReferencia > 0)
                {
                    hoja = await GenerarHojaRefCon(atencion.idCuentaAtencion, idReferencia, "RF");
                }
                else if (idContraReferencia > 0)
                {
                    hoja = await GenerarHojaRefCon(atencion.idCuentaAtencion, idContraReferencia, "CRF");
                }




                return Json(new { session = true, respuesta = resp, mesanje = "", /*msjReceta = mensajeRectas, listRecetas = lsrectasByCuenta, json.Result.Value*/ });

            }
            catch (Exception ex)
            {
                return Json(new { session = true, respuesta = false, mesanje = "Error al registrar," + ex.Message + "." });
            }
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

        ////////////////////KHOYOSI/////////////////////////////////////
        public async Task<bool> GenerarHojaFua(int idCuentaAtencion, int idAtencion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                DalAtenciones daoAtenciones = new DalAtenciones();
                DalParametros daoParametros = new DalParametros();
                bool resp = false;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;

                pageHtml = Url.Action("FormatoHojaFua", "FormatoFua", new { area = "Sis", idCuentaAtencion }, "http");

                DataSet atencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    if (atencion.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3")
                    {
                        //Console.WriteLine("Es sis");
                        int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione  (KHOYOSI: sí funciono xD)                         

                        if (agregaFua == 1)
                        {
                            pdf.orientacion = "Portrait";
                            pdf.tamanio = "A4";
                            pdf.marginX = 20;
                            pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                            resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "FUA", 0, pageHtml, stringHtml, idUsuario, pdf);
                        }
                    }
                }

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


        [HttpPost]
        public async Task<JsonResult> RegistraFUA(int idCuentaAtencion)
        {
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalParametros daoParametros = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet atencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    if (atencion.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3")
                    {
                        //Console.WriteLine("Es sis");
                        int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione  (KHOYOSI: sí funciono xD)
                        var fua = await GenerarFormatoFua(idCuentaAtencion);     //KHOYOSI (GENERA LA HOJA DEL FUA)
                    }
                }

                return Json(new { session = true, respuesta = true, mesanje = "" });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, respuesta = false, mesanje = "Error al registrar," + ex.Message + "." });
            }
        }

        [HttpPost]
        public async Task<JsonResult> RegitraModifcaEpisodio(String fechaIngreso, string antecedentes
                                                    , string antecedFamiliar, string antecedAlergico, string antecedObstetrico, string antecedPatologico, string antecedQuirurgico
                                                    , int idEnServicio, int idEnEstablecimiento, int tipoClasificacion, int nroHistoria, int nroControles, int edadGestacional2
                                                    , int nroGestas, int idMedico, int idServicioIngreso, int idCuentaAtencion, int nroEpisodio, int idPaciente, int epiNuevo, int epiCierre
                                                    , int idAtencion, int idDestino, String lstDiagnosticos, string lstRecetaRx, int idRecetaRx, string lstRecetaEcoObs, int idRecetaEcoObs
                                                    , string lstRecetaEcoGeneral, int idRecetaEcoGene, string lstRecetaAnatoPatologica, int idRecetaAnaPatologica, string lstRecetaPatalogiaClinica
                                                    , int idRecetaPatoClinica, string lstRecetaBancoSangre, int idRecetaBancoSangre, string lstRecetaFarmacia, int idRecetaFarmacia, string fechaVigencia
                                                    , Boolean CEperinatal, ProCabecera objProCabecera, ProControles objControl, EvaluacionEmergencia objEvalEmg, AntecedentesPersonales objAntPersonales
                                                    , AntecedentesFamiliares objAntFamiliares, AntecedentesObstetricos objAntObstetricos, ExamenGinecoObstetra objGiencoObst, Triaje obTriaje
                                                    , AtencionesDatosAdicionales objDatosAdicionales, Boolean CEninioSano, NinioAltoRiesgoAlimentPatologicos objNinioAltoRiesAlimePto
                                                    , NinioAltoRiesgoAntecPerinatales objNinioAltoRiesAntecPerinatales, NinioAltoRiesgoNacimiento objNinioAltoRiesNacimiento, NinioAltoRiesgoVivienda objNinioAltoRiesVivienda
                                                    , string listaItmsEValuar, int idPlanDesarrolloPaciente, int idPlanIntegralPaciente
                                                    , AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente, Atencion objAtencion, string lstRecetaInterconsulta, int idRecetaInterconsulta
                                                    , int idEspecialidadInterconsulta, int idTipoConsultaInterconsulta, string resumenHistoriaClinica, string motivoInterconsulta
                                                    , int esPreAnestesica, Consejeria consejeriaObstetrica, int? esConsejeria = null) // agreando parametro jdelgado011
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            try
            {
                DalAtenciones daoAtenciones = new DalAtenciones();
                DalTriaje daoTriaje = new DalTriaje();
                DalRecetas daoRecetas = new DalRecetas();
                DalParametros daoParametros = new DalParametros();

                int idUsuario;
                Boolean resp, resAteCE; /*rspRx, rspEcoObs, rspEcoGeneral, respAnaPatolo, respPatoClinica, respBancoSangre, respFarmacia, respInterconsulta;*/      //COMENTADO POR KHOYOSI
                string /*mensajeRectas,*/ fechaReceta, msjerror;                //COMENTADO POR KHOYOSI
                resp = false;

                /////COMENTADO POR KHOYOSI
                //rspRx = false;
                //rspEcoObs = false;
                //rspEcoGeneral = false;
                //respAnaPatolo = false;
                //respAnaPatolo = false;
                //respPatoClinica = false;
                //respBancoSangre = false;
                //respFarmacia = false;
                //respInterconsulta = false;

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);
                //var lstobjRx = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaRx);
                //var lstobjEcobObs = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaEcoObs);

                //var lstobjEcoGeneral = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaEcoGeneral);
                //var lstobjAnatoPatologica = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaAnatoPatologica);
                //var lstobjPatalogiaClinica = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaPatalogiaClinica);
                //var lstobjBancoSangre = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaBancoSangre);
                //var lstobjFarmacia = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaFarmacia);
                //var lstobjInterconsulta = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaInterconsulta); // jdelgado011

                Atencion atencion = new Atencion();
                atencion.condicionEstablecimiento = idEnEstablecimiento;
                atencion.condicionservicio = idEnServicio;
                atencion.idAtencion = idAtencion;
                atencion.idTipoServicioAtencion = (int)Enumerados.TiposServicio.Consultorios_Externos;
                atencion.idEstadoAtencion = (int)Enumerados.EstadosTabla.sghRegistrado;
                atencion.fechaEgreso = fechaIngreso;
                atencion.idDestinoAtencion = idDestino;
                atencion.idCuentaAtencion = idCuentaAtencion;
                atencion.idUsuario = idUsuario;
                obTriaje.CitaIdUsuario = idUsuario;

                msjerror = validaAtencion(atencion);

                if (msjerror != "")
                {
                    msjerror = msjerror + "<b>Verifique los datos, existe un error.</b>";
                    return Json(new { respuesta = false, msjReceta = msjerror, session = true });
                }

                resAteCE = await daoAtenciones.ModificarAtencionCE(atencion, lstobjDiagnosticos, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, objDatosAdicionales, objAtencion);       //SE CAMBIO A METODO ASYNC

                ////////////COMENTADO POR KHOYOSI/////////////
                ////mensajeRectas = "";           
                ////Receta receta = new Receta();
                ////receta.idUsuario = idUsuario;
                ////receta.idMedico = idMedico;
                ////receta.idServicioReceta = idServicioIngreso;
                ////receta.idCuentaAtencion = idCuentaAtencion;

                DataSet lsParametros = new DataSet();
                lsParametros = await daoParametros.RetornaFechaServidorV2();

                ////////////COMENTADO POR KHOYOSI/////////////
                ////fechaReceta = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                ////fechaReceta = fechaReceta.Substring(0, 10);
                ////receta.fechaVigencia = fechaVigencia;

                DataSet atencionesFinanciamiento = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

                if (atencionesFinanciamiento.Tables[0].Rows[0]["idFuenteFinanciamiento"].ToString() == "3" && await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    Console.WriteLine("Es sis");
                    int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione
                }
                else
                {
                    Console.WriteLine("No Es sis");
                }


                /////////COMENTADO POR KHOYOSI//////////
                //int estadoReceta;

                //estadoReceta = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;

                //#region CETODOS
                if (resAteCE)
                {

                    /////////COMENTADO POR KHOYOSI//////////
                    //    //RX - Ini

                    //    //if (lstobjRx.Count > 0)
                    //    //{
                    //    if (idRecetaRx == 0 && lstobjRx.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaRx = receta.idReceta;
                    //        rspRx = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaRx > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaRx);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }

                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX;
                    //            receta.idReceta = idRecetaRx;
                    //            rspRx = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            rspRx = false;
                    //        }
                    //    }
                    //    if (rspRx == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            rspRx = daoRecetas.InsertaRecetaDetalle(lstobjRx, idRecetaRx);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaRx, "RX");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de RX: " + idRecetaRx;
                    //    }
                    //    //}

                    //    //RX - FIN

                    //    //EcoObs-Ini
                    //    //if (lstobjEcobObs.Count > 0)
                    //    //{
                    //    if (idRecetaEcoObs == 0 && lstobjEcobObs.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaEcoObs = receta.idReceta;
                    //        rspEcoObs = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaEcoObs > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaEcoObs);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }
                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica;
                    //            receta.idReceta = idRecetaEcoObs;
                    //            rspEcoObs = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            rspEcoObs = false;
                    //        }
                    //    }

                    //    if (rspEcoObs == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            rspEcoObs = daoRecetas.InsertaRecetaDetalle(lstobjEcobObs, idRecetaEcoObs);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaEcoObs, "EO");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Eco. Obstetrica: " + idRecetaEcoObs;
                    //    }

                    //    //}

                    //    //EcoObs-FINH

                    //    //EcoGeneral-Ini
                    //    //if (lstobjEcoGeneral.Count > 0)
                    //    //{
                    //    if (idRecetaEcoGene == 0 && lstobjEcoGeneral.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaEcoGene = receta.idReceta;
                    //        rspEcoGeneral = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaEcoGene > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaEcoGene);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }
                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral;
                    //            receta.idReceta = idRecetaEcoGene;
                    //            rspEcoGeneral = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            rspEcoGeneral = false;
                    //        }
                    //    }

                    //    if (rspEcoGeneral == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            rspEcoGeneral = daoRecetas.InsertaRecetaDetalle(lstobjEcoGeneral, idRecetaEcoGene);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaEcoGene, "EG");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Eco. General: " + idRecetaEcoGene;
                    //    }

                    //    //}

                    //    //EcoGeneral-FINH

                    //    //AnatomiaPatolo-Ini
                    //    //if (lstobjAnatoPatologica.Count > 0)
                    //    //{
                    //    if (idRecetaAnaPatologica == 0 && lstobjAnatoPatologica.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaAnaPatologica = receta.idReceta;
                    //        respAnaPatolo = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaAnaPatologica > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaAnaPatologica);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }

                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1;
                    //            receta.idReceta = idRecetaAnaPatologica;
                    //            respAnaPatolo = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            respAnaPatolo = false;
                    //        }
                    //    }

                    //    if (respAnaPatolo == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            respAnaPatolo = daoRecetas.InsertaRecetaDetalle(lstobjAnatoPatologica, idRecetaAnaPatologica);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaAnaPatologica, "AP");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Anat. Patologica: " + idRecetaAnaPatologica;
                    //    }

                    //    //}

                    //    //AnatomiaPatolo-FINH

                    //    //PatoloClinica-Ini
                    //    //if (lstobjPatalogiaClinica.Count > 0)
                    //    //{
                    //    if (idRecetaPatoClinica == 0 && lstobjPatalogiaClinica.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaPatoClinica = receta.idReceta;
                    //        respPatoClinica = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaPatoClinica > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaPatoClinica);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }
                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica;
                    //            receta.idReceta = idRecetaPatoClinica;
                    //            respPatoClinica = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            respPatoClinica = false;
                    //        }


                    //    }

                    //    if (respPatoClinica == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            respPatoClinica = daoRecetas.InsertaRecetaDetalle(lstobjPatalogiaClinica, idRecetaPatoClinica);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaPatoClinica, "PC");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Pat. Clinica: " + idRecetaPatoClinica;
                    //    }

                    //    //}

                    //    //PatoloClinica-FINH

                    //    //BancoSangre-Ini
                    //    //if (lstobjBancoSangre.Count > 0)
                    //    //{
                    //    if (idRecetaBancoSangre == 0 && lstobjBancoSangre.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaBancoSangre = receta.idReceta;
                    //        respBancoSangre = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaBancoSangre > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaBancoSangre);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }
                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1;
                    //            receta.idReceta = idRecetaBancoSangre;
                    //            respBancoSangre = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            respBancoSangre = false;
                    //        }
                    //    }

                    //    if (respBancoSangre == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            respBancoSangre = daoRecetas.InsertaRecetaDetalle(lstobjBancoSangre, idRecetaBancoSangre);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaBancoSangre, "BS");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Banco de Sangre: " + idRecetaBancoSangre;
                    //    }

                    //    //}

                    //    //BancoSangre-FINH

                    //    //Farmacia-Ini
                    //    //if (lstobjFarmacia.Count > 0)
                    //    //{
                    //    if (idRecetaFarmacia == 0 && lstobjFarmacia.Count > 0)
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaFarmacia = receta.idReceta;
                    //        respFarmacia = true;
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaFarmacia > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaFarmacia);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }
                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                    //            receta.idReceta = idRecetaFarmacia;
                    //            respFarmacia = daoRecetas.ModifcarReceta(receta);
                    //        }
                    //        else
                    //        {
                    //            respFarmacia = false;
                    //        }
                    //    }

                    //    if (respFarmacia == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            respFarmacia = daoRecetas.InsertaRecetaDetalle(lstobjFarmacia, idRecetaFarmacia);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaFarmacia, "F");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Farmacia: " + idRecetaFarmacia;
                    //    }

                    //    //}

                    //    //Farmacia-FINH

                    //    //Interconsulta-Ini  creado por jdelgado011
                    //    //if (lstobjBancoSangre.Count > 0)
                    //    //{
                    //    if (idRecetaInterconsulta == 0 && lstobjInterconsulta.Count > 0) // jdelgado011 falta
                    //    {
                    //        estadoReceta = 1;
                    //        receta.fechaReceta = fechaReceta;
                    //        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                    //        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta; // se añadio nuevo ptocargainterconsulta jdelgado011
                    //        receta = daoRecetas.RegistrarReceta(receta);
                    //        idRecetaInterconsulta = receta.idReceta;
                    //        respInterconsulta = true;

                    //        daoRecetas.InsertaRecetaDetalleInterconsulta(idEspecialidadInterconsulta, idTipoConsultaInterconsulta, resumenHistoriaClinica, motivoInterconsulta, idRecetaInterconsulta); // se agrego insertar receta detalle interconsulta jdelgado011
                    //    }
                    //    else
                    //    {
                    //        if (idRecetaInterconsulta > 0)
                    //        {
                    //            DataSet lsRx = new DataSet();
                    //            lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaInterconsulta);

                    //            foreach (DataRow dr in lsRx.Tables[0].Rows)
                    //            {
                    //                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                    //            }
                    //            receta.idEstado = estadoReceta;
                    //            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta;
                    //            receta.idReceta = idRecetaInterconsulta;
                    //            respInterconsulta = daoRecetas.ModifcarReceta(receta);

                    //            daoRecetas.InsertaRecetaDetalleInterconsulta(idEspecialidadInterconsulta, idTipoConsultaInterconsulta, resumenHistoriaClinica, motivoInterconsulta, idRecetaInterconsulta); // se agrego insertar receta detalle interconsulta jdelgado011
                    //        }
                    //        else
                    //        {
                    //            respInterconsulta = false;
                    //        }
                    //    }

                    //    if (respInterconsulta == true)
                    //    {
                    //        if (estadoReceta == 1)
                    //        {
                    //            respInterconsulta = daoRecetas.InsertaRecetaDetalle(lstobjInterconsulta, idRecetaInterconsulta);
                    //            var recpdf = await GenerarRecetaPdf(idCuentaAtencion, idRecetaInterconsulta, "I");        //KHOYOSI -GENERAR PDF DE RECETA
                    //        }
                    //        mensajeRectas = mensajeRectas + "<br> Receta de Interconsulta: " + idRecetaInterconsulta;
                    //    }

                    //}

                    //Interconsulta-FINH
                    resp = await daoAtenciones.RegitraModifcaEpisodio(nroEpisodio, idPaciente, epiNuevo, epiCierre, idAtencion, idUsuario);
                    resp = await daoAtenciones.InsertarEntrevistaPacienteCE(tipoClasificacion, idCuentaAtencion, nroHistoria, idPaciente, nroControles, edadGestacional2, nroGestas, idUsuario);
                    resp = await daoAtenciones.InsertaDatosAUXCE(idAtencion, nroHistoria, idPaciente, idUsuario, antecedQuirurgico, antecedPatologico, antecedObstetrico, antecedAlergico, antecedFamiliar, antecedentes, obTriaje);
                    resp = await daoTriaje.InsertaTriaje(obTriaje);
                    //string citaAntecedente, string citaExamenClinico, string citaMotivo, string antecedentes, string antecedFamiliar, string antecedAlergico, string antecedObstetrico, string antecedPatologico, string antecedQuirurgico, int idEnServicio, int
                }


                //////////COMENTADO POR KHOYOSI///////////
                //DataSet lsrectasByCuenta = new DataSet();
                //lsrectasByCuenta = await daoRecetas.ListaRecetasCabeceraIdCuentaAtencion(idCuentaAtencion); // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
                //#endregion

                #region PERINATAL
                Int32 estadoPerinatal = 0;
                objProCabecera.UsuarioInicio = idUsuario;
                objGiencoObst.IdUsuario = idUsuario;
                if (CEperinatal)
                {
                    estadoPerinatal = await daoAtenciones.InsertaProCabeceraYControl(objProCabecera, objControl);
                    objAntPersonales.idProCabecera = estadoPerinatal;
                    objAntFamiliares.idProCabecera = estadoPerinatal;
                    objAntObstetricos.idProCabecera = estadoPerinatal;

                    objAntObstetricos.idPrograma = 1;
                    resp = await daoAtenciones.InsertaEvaluacionEmergencia(objEvalEmg);
                    resp = await daoAtenciones.InsertaAntecedentesPersonales(objAntPersonales);
                    resp = await daoAtenciones.InsertaAntecedentesFamiliares(objAntFamiliares);
                    resp = await daoAtenciones.InsertaAntecedentesObstetricos(objAntObstetricos);
                    resp = await daoAtenciones.InsertaExamenGinecoObstetra(objGiencoObst);
                }
                #endregion

                Boolean respninio = false;
                //ninio alto riesgo
                #region niniosano
                if (CEninioSano)
                {
                    objNinioAltoRiesAlimePto.usuarioRegistro = idUsuario;
                    objNinioAltoRiesAlimePto.usuarioUpdate = idUsuario;
                    objNinioAltoRiesAntecPerinatales.usuarioRegistro = idUsuario;
                    objNinioAltoRiesAntecPerinatales.usuarioUpdate = idUsuario;
                    objNinioAltoRiesNacimiento.usuarioRegistro = idUsuario;
                    objNinioAltoRiesNacimiento.usuarioUpdate = idUsuario;
                    objNinioAltoRiesVivienda.usuarioRegistro = idUsuario;
                    objNinioAltoRiesVivienda.usuarioUpdate = idUsuario;

                    objNinioAltoRiesAlimePto.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesAlimePto.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    objNinioAltoRiesAntecPerinatales.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesAntecPerinatales.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    objNinioAltoRiesNacimiento.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesNacimiento.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    objNinioAltoRiesVivienda.fechaRegistro = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                    objNinioAltoRiesVivienda.fechaUpdate = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    fechaReceta = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();

                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoAlimentPatologicos(objNinioAltoRiesAlimePto);
                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoAntecPerinatales(objNinioAltoRiesAntecPerinatales);
                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoNacimiento(objNinioAltoRiesNacimiento);
                    respninio = await daoAtenciones.InsertUpdate_NinioAltoRiesgoVivienda(objNinioAltoRiesVivienda);

                    var lstItems = JsonConvert.DeserializeObject<List<AtenIntePlanDesPacienteDet>>(listaItmsEValuar);
                    if (objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente > 0)
                    {
                        respninio = await daoAtenciones.Insert_Update_AtenIntePlanDesarrolloPaciente(objAtenIntePlanDesarrolloPaciente);
                    }
                    respninio = await daoAtenciones.Insert_AtenIntePlanDesPacienteDet(idPlanDesarrolloPaciente, idPlanIntegralPaciente, lstItems);
                }
                #endregion

                //#region ConsejeriaObstetrica
                //if(esConsejeria == 1)
                //{
                //    var consejeria = await daoAtenciones.CrearModificarConsejeriaObstetrica(idAtencion, consejeriaObstetrica);
                //}
                //#endregion

                // jdelgado agregando condicional para evaluacion preanestesica
                if (esPreAnestesica == 0)
                {
                    var json = await GeneraPdfYRutaFimaAsync(idCuentaAtencion, estadoPerinatal, (CEperinatal == true ? 1 : CEninioSano == true ? 2 : 0));
                }
                else
                {
                    var json = await GenerarFormatoPreAnestesico(idCuentaAtencion, idAtencion);
                }

                if (await daoParametros.SeleccionaPermisoGeneral("REFCON") == "1")
                {
                    var refcon = await ActualizaEmisionRefCon(idCuentaAtencion, idDestino);       //KHOYOSI (ACTUALIZAR LA HOJA DE REFERENCIA EMITIDA DE ACUERDO AL TIPO DE DESTINO)
                }

                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    var fua = await GenerarFormatoFua(idCuentaAtencion);     //KHOYOSI (GENERA LA HOJA DEL FUA)
                }

                return Json(new { session = true, respuesta = resp, mesanje = "", /*msjReceta = mensajeRectas, listRecetas = lsrectasByCuenta, json.Result.Value*/ });

            }
            catch (Exception ex)
            {
                return Json(new { session = true, respuesta = false, mesanje = "Error al registrar," + ex.Message + "." });
            }

            //return Json(new { respuesta= resp,mesanje="",lrcRx= idRecetaRx,lrcPatoClin=idRecetaPatoClinica,lrcAnaPato=idRecetaAnaPatologica,lrcBancoS=idRecetaBancoSangre,lrcEcoGene=idRecetaEcoGene,lrcEcoObst=idRecetaEcoObs,lrcFarmacia=idRecetaFarmacia, msjReceta= mensajeRectas });

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarPorAtencion(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            lsAtencionsCE = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // JDELGADO J0 AWAIT SENTENCE
            return Json(lsAtencionsCE);
        }

        [HttpPost]
        public async Task<ActionResult> TiposClasificacionPaciente(int idAtencion)
        {
            DataSet lsClasiPac;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsClasiPac = await daoAtenciones.TiposClasificacionPaciente();

            return Json(new { lsClasiPac, estado = true, session = true, data = lsClasiPac });
        }


        [HttpPost]
        public async Task<ActionResult> ListarCptConsejeriaObstetrica()
        {
            DataSet lsClasiPac;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsClasiPac = await daoAtenciones.ListarCptConsejeriaObstetrica();

            return Json(new { lsClasiPac, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarCptConsejeriaOncologica()
        {
            DataSet lsClasiPac;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsClasiPac = await daoAtenciones.ListarCptConsejeriaOncologica();

            return Json(new { lsClasiPac, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> CondicionEstablecimiento(int idNroCuenta, int idServicio)
        {
            DataSet lsCondicion;
            DalAtenciones daoAtenciones = new DalAtenciones();

            lsCondicion = await daoAtenciones.CondicionEstablecimiento(idNroCuenta, idServicio);
            return Json(lsCondicion);
        }
        //[HttpPost]
        public async Task<ActionResult> ReporteAtencion(int idCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String html, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia;
            html = "";
            strRx = "(Rayos X)<hr>";
            strEcoGene = "(Ecografia General)<hr>";
            strEcoObs = "(Ecografia Obstetrica)<hr>";
            strAnaPatolo = "(Anatomia Patologica)<hr>";
            strPatoloClinica = "(Patologica Clinica)<hr>";
            strBs = "(Banco de Sangre)<hr><br>";
            strFarmacia = "(Farmacia)<hr>";

            DataSet lsAtencion, lsDiagnosticos, lsRecetas;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();

            string idAtencion = "0";
            String diagnosticos = "";

            DataSet lsParametros;
            string nombre = "", direccion = "", telefono = "";
            DalParametros daoParametros = new DalParametros();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = daoRecetas.ListaRecetasIdCuentaAtencion(idCuentaAtencion);

            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // JDELGADO J0 AWAIT SENTENCE

            foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
            {
                diagnosticos = diagnosticos + dr["codigoCIE10"].ToString() + " - " + dr["descripcion"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                strRx = strRx + dr["Producto"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[1].Rows)
            {
                strEcoObs = strEcoObs + dr["Producto"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[2].Rows)
            {
                strEcoGene = strEcoGene + dr["Producto"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[3].Rows)
            {
                strPatoloClinica = strPatoloClinica + dr["Producto"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[4].Rows)
            {
                strAnaPatolo = strAnaPatolo + dr["Producto"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[5].Rows)
            {
                strBs = strBs + dr["Producto"].ToString() + "<br>";

            }
            ;

            foreach (DataRow dr in lsRecetas.Tables[6].Rows)
            {
                strFarmacia = strFarmacia + dr["Producto"].ToString() + "<br>";

            }
            ;




            html = html + "<br><br><table font size=8pt  width='100%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>" + nombre + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            html = html + "<br>";
            html = html + "<hr>";
            html = html + "<table font size=8pt style='width=100%' >" +
                "               <tr>" +
                "                   <td > <b>Medico: </b>" +
                "                   </td>" +
                "                   <td>" + lsAtencion.Tables[0].Rows[0]["Medico"].ToString() +
                "                   </td>" +
                "                   <td > <b>Fecha de Consulta: </b>" +
                "                   </td>" +
                "                   <td>" + lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString() +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td> <b>Paciente: </b>" +
                "                   </td>" +
                "                   <td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() +
                "                   </td>" +
                 "                   <td > " +
                "                   </td>" +
                "                   <td>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td> <b>Consultorio: </b>" +
                "                   </td>" +
                "                   <td>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() +
                "                   </td>" +
                "                   <td> <b>Nro. de Cuenta: </b>" +
                "                   </td>" +
                "                   <td>" + idCuentaAtencion +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            html = html + "<br>";
            html = html + "<hr>";



            html = html + "<table font size=8pt>" +
                "               <tr>" +
                "                   <td> <b>Presión: </b>" +
                "                   </td>" +
                "                   <td >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" +
                "                   </td>" +
                "                   <td > <b>Talla:</b>" +
                "                   </td>" +
                "                   <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td> <b>Temperatura: </b>" +
                "                   </td>" +
                "                   <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" +
                "                   </td>" +
                 "                   <td> <b>Peso:</b> " +
                "                   </td>" +
                "                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";
            html = html + "<br>";
            html = html + "<hr>";

            html = html + "<table font size=8pt >" +
    "               <tr >" +
    "                   <td valign='top'>  <b>Motivo de la consulta: </b>" +
    "                   </td>" +
    "                   <td >" + lsAtencion.Tables[0].Rows[0]["CitaMotivo"].ToString() +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Exámen Clínico: </b>" +
    "                   </td>" +
    "                   <td >" + lsAtencion.Tables[0].Rows[0]["CitaExamenClinico"].ToString() +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Diagnóstico del Médico: </b>" +
    "                   </td>" +
    "                   <td >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Diagnóstico CIE 10: </b>" +
    "                   </td>" +
    "                   <td >" + diagnosticos +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Otros CPT: </b>" +
    "                   </td>" +
    "                   <td >" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Tratamiento: </b>" +
    "                   </td>" +
    "                   <td >" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Exámenes: </b>" +
    "                   </td>" +
    "                   <td >" + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td>" +
    "                   </td>" +
    "               </tr>" +
    "               <tr>" +
    "                   <td valign='top'> <b>Receta : </b>" +
    "                   </td>" +
    "                   <td >" + strFarmacia +
    "                   </td>" +
    "               </tr>" +
    "           </table>";

            HtmlToPdf ohtml = new HtmlToPdf();
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );

        }
        public ActionResult GeneraLlamadaAPDfHosGinecoObs(int idCuentaAtencion, int idItem, int idServicio)
        {
            Boolean registraModifica = false;
            RolesItems objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Hospitalizacion_NotaIngreso);
            if (objRol.Agregar == true)
            {
                registraModifica = true;
            }
            else
            {
                if (objRol.Modificar == true)
                {
                    registraModifica = true;
                }
                else
                {
                    registraModifica = false;
                }

            }
            if (registraModifica)
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { sesion = false });
                }
                else
                {
                    try
                    {
                        var jsonResultado = GeneraHosGinecoObs(idCuentaAtencion, idItem, idServicio);
                        return Json(new { resultadoGeneraPdf = jsonResultado.Result.Value, mensaje = "", sesion = true });
                    }
                    catch (Exception e)
                    {
                        return Json(new { mensaje = e.ToString(), sesion = true });
                    }
                }
            }
            else
            {
                return Json(new { mensaje = "No tiene permisos para firmar", sesion = true });
            }


        }
        public ActionResult GeneraLlamadaAPDfParteDiario(int programacion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { sesion = false });
            }
            else
            {
                try
                {
                    var jsonResultado = GeneraParteDiario(programacion);
                    return Json(new { resultadoGeneraPdf = jsonResultado.Result.Value, mensaje = "", sesion = true });
                }
                catch (Exception e)
                {
                    return Json(new { mensaje = e.ToString(), sesion = true });
                }
            }


        }
        //public async Task<JsonResult> GeneraHospGinecoObstetricia(int idCuenta, int item, int idServicio)
        public JsonResult GeneraHospGinecoObstetricia(int idCuenta, int item, int idServicio)
        {
            //StringBuilder html = new StringBuilder();

            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            //string path, resultado;
            //bool resulfirma = false;
            //html = GeneraParteDiarioHTML(programacion);
            //path = Path.Combine(sWebRootFolder, "PartesDiarios", programacion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "-P.pdf");
            //Comun.ClUtilirario cl = new Comun.ClUtilirario();
            //DalUtilitario dlUtili = new DalUtilitario();
            //DataSet lstFirma = null;
            //try
            //{
            //    resultado = GenerarPDf(html, path, 0);
            //    if (resultado == "Ok")
            //    {
            //        //verificar creacion 
            //        Task<bool> Tbol = cl.UploadFile(path, programacion, "P", programacion);
            //        //quita creacion 
            //        //Espera resultado de la tarea, no termina hasta termine
            //        resulfirma = await Tbol;
            //        if (resulfirma)
            //        {
            //            lstFirma = dlUtili.ListaFirmaByIdRegistroByTipo(programacion, "P");
            //        }

            //    }
            //}
            //catch (Exception e)
            //{
            //    return Json(new { estadoCreacion = false, ruta = path, exep = e.ToString(), resulfirma = resulfirma, lstFirma = lstFirma });
            //}

            return Json(new { estadoCreacion = "", ruta = "", resulfirma = "", lstFirma = "" });

        }

        [HttpPost]
        public async Task<bool> GeneraParteDiarioV2(int programacion)
        {
            FormatoPdf pdf = new FormatoPdf();
            FirmaDigital firma = new FirmaDigital();
            StringBuilder stringHtml = new StringBuilder();
            string pageHtml;
            UtilitarioController utilitario = new UtilitarioController();
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalParametros daoParametros = new DalParametros();

            bool resp = false;

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            stringHtml = await GeneraParteDiarioHTML(programacion);
            pageHtml = null;

            pdf.orientacion = "Landscape";
            pdf.tamanio = "A4";
            pdf.marginX = 20;
            pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
            resp = await utilitario.GenerarDocumentoDigital(0, programacion, 0, "CE-PD", 0, pageHtml, stringHtml, idUsuario, pdf);

            return resp;

        }

        [HttpPost]
        public async Task<JsonResult> GeneraParteDiario(int programacion)
        {
            StringBuilder html = new StringBuilder();
            string tipo = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string path, resultado;
            bool resulfirma = false;
            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            tipo = "CE-PD";

            html = await GeneraParteDiarioHTML(programacion);
            path = Path.Combine(sWebRootFolder, "PartesDiarios", programacion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf");
            Comun.ClUtilirario cl = new Comun.ClUtilirario();
            DalUtilitario dlUtili = new DalUtilitario();
            DataSet lstFirma = null;

            try
            {
                if (html.ToString() == "NONE")
                {
                    resultado = "NONE";
                }
                else
                {
                    resultado = GenerarPDf(html, path, 0);
                    if (resultado == "Ok")
                    {
                        //verificar creacion 
                        Task<bool> Tbol = cl.UploadFile(path, programacion, tipo, programacion);
                        //quita creacion 
                        //Espera resultado de la tarea, no termina hasta termine
                        resulfirma = await Tbol;

                        ///COMENTADO POR KHOYOSI
                        //if (resulfirma)
                        //{
                        //    lstFirma = dlUtili.ListaFirmaByIdRegistroByTipo(programacion, tipo);
                        //}
                    }
                }
            }
            catch (Exception e)
            {
                return Json(new { estadoCreacion = false, ruta = path, exep = e.ToString(), resulfirma = resulfirma, lstFirma = lstFirma });
            }

            return Json(new { estadoCreacion = resultado, ruta = path, resulfirma = resulfirma, lstFirma = lstFirma });

        }

        public async Task<StringBuilder> GeneraParteDiarioHTML(int programacion)
        {
            StringBuilder html = new StringBuilder();

            DateTime now = DateTime.Now;
            DataSet lsParteDiario;
            DalAtenciones dlAten = new DalAtenciones();
            lsParteDiario = await dlAten.ListaParteDiario(programacion);

            if (lsParteDiario.Tables[0].Rows.Count > 0)
            {
                html.Append("<body style='width: 1105px; height: 755px;'>");
                //html.Append("<body style='border: 1px solid red; background: green;'>");
                html.Append("<table>");
                //html.Append("<br><br><br><br>");
                html.Append("<table width=100%>");
                //html.Append("<tr><td width=5% >&nbsp;&nbsp;&nbsp;&nbsp</td>");
                //html.Append("<tr><td width=5% ></td>");
                html.Append("<td align='center' width=100% >");
                html.Append("<font size=3><b>INFORME DIARIO DE ATENCIONES EN CONSULTORIOS EXTERNO</b></font>");
                html.Append("</td>");
                //html.Append("<td >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</td>");
                html.Append("<td ></td>");
                html.Append("</tr>");
                html.Append("</table>");

                html.Append("<br>");
                html.Append("<table width=100%>");
                //html.Append("<tr><td width=5% >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</td>");
                //html.Append("<tr><td width=5%></td>");
                //html.Append("<td width=95% >");
                html.Append("<td width=100% >");
                html.Append("" +
                              "<table  width=100%  border='1'>" +
                               "<tr>" +
                                   "<td width='20%'><font size=2>CONSULTORIO:</font></td>" +
                                   "<td width='30%'><font size=2>" + lsParteDiario.Tables[0].Rows[0]["servicio"].ToString() + "</font></td>" +
                                   "<td width='20%'><font size=2>FECHA:</font></td>" +
                                   "<td width='30%'><font size=2>" + lsParteDiario.Tables[0].Rows[0]["fechaAtencion"].ToString() + "</font></td>" +
                               "</tr>" +
                                "<tr>" +
                                    "<td width='20%'><font size=2>MEDICO:</font></td>" +
                                    "<td width='30%'><font size=2>" + lsParteDiario.Tables[0].Rows[0]["medico"].ToString() + "</font></td>" +
                                    "<td width='20%'><font size=2>HORA DE INICIO ATENCION:</font></td>" +
                                    "<td width='30%'><font size=2>" + lsParteDiario.Tables[0].Rows[0]["horaInicio"].ToString() + "</font></td>" +
                               "</tr>" +
                            "</table><br>");

                html.Append("<table  border='1' width='100%' >" +
                                "<tr>" +
                                   "<td width='3%'><font size=1>Nro</font></td>" +
                                   "<td width='3%'><font size=1>HC</font></td>" +
                                   "<td  width='31%'><font size=2>Apellidos y nombres</font></td>" +
                                   "<td  width='3%'><font size=1>EDAD</font></td>" +
                                   "<td  width='3%'><font size=1>SEX</font></td>" +
                                   "<td  width='3%'><font size=1>H. Cita</font></td>" +
                                   "<td  width='3%'><font size=1>H. Atencion</font></td>" +
                                   "<td  width='3%'><font size=1>Resd Hab</font></td>" +
                                   "<td width='3%'><font size=1>Gest</font></td>" +
                                   "<td width='3%'><font size=1>Puer</font></td>" +
                                   "<td  width='3%'><font size=1>Gine</font></td>" +
                                   "<td width='3%'><font size=1>Neot</font></td>" +
                                   "<td width='3%'><font size=1>N° de Gest</font></td>" +
                                   "<td width='3%'><font size=1>Sem Gest</font></td>" +

                                   "<td width='3%'><font size=1>Diagn. 1</font></td>" +
                                   "<td width='1%'><font size=1>D<br>P<br>R</font></td>" +
                                   "<td width='3%'><font size=1>Diagn. 2</font></td>" +
                                   "<td width='1%'><font size=1>D<br>P<br>R</font></td>" +
                                   "<td width='3%'><font size=1>Diagn. 3</font></td>" +
                                   "<td width='1%'><font size=1>D<br>P<br>R</font></td>" +
                                   "<td width='3%'><font size=1>P1</font></td>" +
                                   "<td width='3%'><font size=1>P2</font></td>" +
                                   "<td width='3%'><font size=1>P3</font></td>" +
                                   "<td width='3%'><font size=1>P4</font></td>" +
                                   "<td width='3%'><font size=1>CE</font></td>" +
                                   "<td width='3%'><font size=1>SERV</font></td>" +
                                   "<td width='3%'><font size=1>EMER</font></td>" +
                                   "<td width='3%'><font size=1>HOSP</font></td>" +

                               "</tr>");


                foreach (DataRow dr in lsParteDiario.Tables[0].Rows)
                {
                    string gestas = "";
                    string puer = "";
                    string ginec = "";
                    string neot = "";

                    string dgx1Pos1 = "";
                    string dgx1Pos3 = "";

                    string dgx2Pos1 = "";
                    string dgx2Pos3 = "";

                    string dgx3Pos1 = "";
                    string dgx3Pos3 = "";


                    if (dr["idClasificacionPac"].ToString() == "1")
                    {
                        //gestas = dr["nroControles"].ToString();
                        gestas = "X";
                    }

                    if (dr["idClasificacionPac"].ToString() == "2")
                    {
                        //ginec = dr["nroControles"].ToString();
                        ginec = "X";
                    }

                    if (dr["idClasificacionPac"].ToString() == "3")
                    {
                        //neot = dr["nroControles"].ToString();
                        neot = "X";
                    }

                    if (dr["idClasificacionPac"].ToString() == "4")
                    {
                        //puer = dr["nroControles"].ToString();
                        puer = "X";
                    }

                    string dgx1 = dr["dgx1"].ToString();
                    string dgx2 = dr["dgx2"].ToString();
                    string dgx3 = dr["dgx3"].ToString();
                    // Split authors separated by a comma followed by space  
                    string[] dgx1List = dgx1.Split("/");
                    string[] dgx1List2 = dgx2.Split("/");
                    string[] dgx1List3 = dgx3.Split("/");


                    //PosicionValor(dgx1List3.)


                    if (dgx1List.Length > 1)
                    {
                        dgx1Pos1 = dgx1List[0].ToString();
                        dgx1Pos3 = dgx1List[3].ToString();
                        dgx1Pos3 = dgx1Pos3.Substring(0, 1);
                    }

                    if (dgx1List2.Length > 1)
                    {
                        dgx2Pos1 = dgx1List2[0].ToString();
                        dgx2Pos3 = dgx1List2[3].ToString();
                        dgx2Pos3 = dgx2Pos3.Substring(0, 1);
                    }

                    if (dgx1List3.Length > 1)
                    {
                        dgx3Pos1 = dgx1List3[0].ToString();
                        dgx3Pos3 = dgx1List3[3].ToString();
                        dgx3Pos3 = dgx3Pos3.Substring(0, 1);
                    }





                    html.Append("<tr>" +
                                   "<td width='3%'><font size=1>" + dr["RowNum"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["NroHistoriaClinica"].ToString() + "</font></td>" +
                                   "<td width='31%'><font size=1>" + dr["paciente"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["Edad"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["sexo"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["HoraInicioCita"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["HoraInicioAtencion"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1></font></td>" +
                                   "<td width='3%'><font size=1>" + gestas + "</font></td>" +
                                   "<td width='3%'><font size=1>" + puer + "</font></td>" +
                                   "<td width='3%'><font size=1>" + ginec + "</font></td>" +
                                   "<td width='3%'><font size=1>" + neot + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["nroGestas"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["edadGestacional"].ToString() + "</font></td>" +

                                   "<td width='3%'><font size=1>" + dgx1Pos1 + "</font></td>" +
                                   "<td width='1%'><font size=1>" + dgx1Pos3 + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dgx2Pos1 + "</font></td>" +
                                   "<td width='1%'><font size=1>" + dgx2Pos3 + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dgx3Pos1 + " </font></td>" +
                                   "<td width='1%'><font size=1>" + dgx3Pos3 + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["cpt1"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["cpt2"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["cpt3"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>" + dr["cpt4"].ToString() + "</font></td>" +
                                   "<td width='3%'><font size=1>X</font></td>" +
                                   "<td width='3%'><font size=1></font></td>" +
                                   "<td width='3%'><font size=1></font></td>" +
                                   "<td width='3%'><font size=1></font></td>" +

                               "</tr>");
                    //diagnosticos = diagnosticos + dr["codigoCIE10"].ToString() + " - " + dr["descripcion"].ToString() + "<br>";

                }
                ;

                html.Append("</table>");
                html.Append("</td>");
                //html.Append("<td >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</td>");
                html.Append("</tr>");
                html.Append("</table>");
                html.Append("<br><table width: 100%>");
                //html.Append("<tr><td width: 20%>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp</td><td  align='right'>Fecha y Hora de Impresion: " + now.ToString() + "</td></tr>");
                html.Append("<tr><td width: 20%></td><td  align='right'>Fecha y Hora de Impresion: " + now.ToString() + "</td></tr>");
                html.Append("</table>");

                html.Append("</body>");
            }
            else
            {
                html.Append("NONE");
            }

            return html;
        }

        public async Task<JsonResult> GeneraHosGinecoObs(int idCuentaAtencion, int idItem, int idServicio)
        {

            StringBuilder html = new StringBuilder();

            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string path, resultado;
            bool resulfirma = false;
            html = await GeneraHosGinecoObsHTML(idCuentaAtencion, idItem, idServicio);
            path = Path.Combine(sWebRootFolder, "NotaIngreso", idCuentaAtencion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "-NI.pdf");
            Comun.ClUtilirario cl = new Comun.ClUtilirario();
            DalUtilitario dlUtili = new DalUtilitario();
            DataSet lstFirma = null;
            try
            {
                resultado = GenerarPDf(html, path, 1);
                if (resultado == "Ok")
                {
                    string idAux = "0";
                    idAux = idCuentaAtencion + "" + idItem + "" + idServicio;
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, idCuentaAtencion, "NI", Convert.ToInt32(idAux));
                    //quita creacion 
                    //Espera resultado de la tarea, no termina hasta termine
                    resulfirma = await Tbol;
                    if (resulfirma)
                    {
                        lstFirma = dlUtili.ListaFirmaByIdRegistroByTipo(Convert.ToInt32(idAux), "NI");
                    }

                }
            }
            catch (Exception e)
            {
                return Json(new { estadoCreacion = false, ruta = path, exep = e.ToString(), resulfirma = resulfirma, lstFirma = lstFirma });
            }

            return Json(new { estadoCreacion = resultado, ruta = path, resulfirma = resulfirma, lstFirma = lstFirma });

        }
        public async Task<StringBuilder> GeneraHosGinecoObsHTML(int idCuentaAtencion, int idItem, int idServicio) //JDELGADO010
        {
            StringBuilder html = new StringBuilder();
            DataSet lsEvalEmergDetalle, lsAtencion, lsDiagnosticos, lsEvalEmergencia, lsTriaje, lsGinecoObstetra;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalTriaje dalTriaje = new DalTriaje();
            String diagnosticos = "";
            String idAtencion = "0";
            String feto = "";
            string pelvisGinecoide = "";
            string compatibilidadFetoP = "";
            string tramiento = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            DataSet lsParametros;
            string nombre = "", direccion = "", telefono = "";
            DalParametros daoParametros = new DalParametros();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            DateTime now = DateTime.Now;
            EvaluacionEmergenciaDetalle objEvlEmDet = new EvaluacionEmergenciaDetalle();
            //now.ToString();
            Triaje triaje = new Triaje();
            if (lsAtencion.Tables[0].Rows.Count == 0)
            {
                html.Append("Sin datos");
                //return PartialView("~/Views/Comun/GeneradorReporteGeneral.cshtml");
            }
            else
            {
                idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
                lsDiagnosticos = await daoAtenciones.web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(idItem, Convert.ToInt32(idAtencion), (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idServicio); // JDELGADO J0 AWAIT SENTENCE
                lsEvalEmergencia = await daoAtenciones.ListaEvalEmergenciaEmeHospi(Convert.ToInt32(idAtencion), idItem, idServicio);

                triaje.idAtencion = (Convert.ToInt32(idAtencion));
                triaje.idNumero = idItem;
                triaje.idServicio = idServicio;
                lsTriaje = await dalTriaje.ListaTriajeEmgHosp(triaje);
                lsGinecoObstetra = await daoAtenciones.ListaGinecoObstetraEmeHospi(Convert.ToInt32(idAtencion), idItem, idServicio);
                objEvlEmDet.idservicio = idServicio;
                objEvlEmDet.IdNumero = idItem;
                objEvlEmDet.IdAtencion = Convert.ToInt32(idAtencion);
                lsEvalEmergDetalle = await daoAtenciones.ListaEvaluacionEmergenciaDetalle(objEvlEmDet);

                compatibilidadFetoP = (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "1") ? "SI" : (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "2") ? "NO" : "Dudosa";
                pelvisGinecoide = (lsGinecoObstetra.Tables[0].Rows[0]["lPelvisGinecoide"].ToString() == "1") ? "SI" : "NO";


                foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
                {
                    diagnosticos = diagnosticos + dr["codigoCIE10"].ToString() + " - " + dr["descripcion"].ToString() + "<br>";

                }
                ;

                String valor = "";
                if (lsGinecoObstetra.Tables[0].Rows[0]["lTipoEmbarazo"].ToString() == "1")
                {

                    feto = "<b><u class='dotted'>FETO UNICO:</u> </b><br>";
                    valor = (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "1") ? "Longitudinal" : (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "0") ? "Transversal" : "Ninguno";
                    feto = feto + "<b>Situación:  </b>" + valor + "<br>";

                    valor = (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "1") ? "Derecha" : (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "0") ? "Izquierda" : "Ninguno";
                    feto = feto + "<b>Posición:  </b>" + valor + "<br>";

                    valor = (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "1") ? "Cefálica" : (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "0") ? "Podálica" : "Ninguno";
                    feto = feto + "<b>Presentación:  </b>" + valor + "<br>";



                }
                else
                {
                    feto = "<table font size=8pt border='1' style='width: 100%'> " +
                                            "<tr><td colspan='4'><b>FETO MULTIPLE</b></td></tr>" +
                                            "<tr><td><b></b></td><td><b>SiPoPr</b></td><td><b>LFC</b></td><td><b>MF</b></td></tr>" +
                                            "<tr><td><b>F01</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF1Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF1Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF01"].ToString() + "</td></tr>" +
                                            "<tr><td><b>F02</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF2Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF2Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF02"].ToString() + "</td></tr>" +
                                            "<tr><td><b>F03</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF3Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF3Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF03"].ToString() + "</td></tr>" +
                                        " </table> ";
                }

                tramiento = lsAtencion.Tables[0].Rows[0]["Tratamiento"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>");
                if (tramiento == "")
                {
                    tramiento = "<br><br><br>";
                }

                html.Append(
                    "<style>" +
                        ".table { " +
                            "width: 100%;" +
                            "text-align: center;" +
                            "border-spacing: 5px; " +
                        "}" +
                        ".table1 { " +
                            "width: 100%;" +
                            "margin-top: 5px;" +
                        "}" +
                        ".td  { " +
                            "border : 1px solid gray; border-collapse: collapse; padding: 4px; " +
                            "style='text-align: justify;' white-space: pre-line; word-wrap: break-word;}" +
                        ".title { background-color: #c1bebe; padding: 10px; text - decoration: underline" +
                    "</style>");

                html.Append(
                    "<div style='position: absolute; left: 0; right: 0; padding: 10px;'>" +
                        "<img style='width: 70px;' src='" + sWebRootFolder + "\\images\\Logo2.png'>" +
                    "</div>" +
                    "<div style='position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; top: 0; padding: 10px;'>" +
                        "<div align='center'> <b>" + nombre + "</b></div>" +
                        "<div align='center'>" + direccion + "</div>" +
                        "<div align='center'>TELEFONO: " + telefono + "</div>" +
                    "</div>" +
                    "<div style='float: right; padding: 10px;'>" +
                    "" + now.ToString() + "" +
                    "<div> Impreso por: " + HttpContext.Session.GetString("usuario") + "</div>" +
                    //"<div> usuario: " + now.ToString() + "</div>" +
                    "</div>"
                    );
                html.Append("<br><br><br><br>");

                html.Append(
                    "<div style='width: 95%; margin: auto;'>" +
                        "<div align='center' class='title'><b>NOTA DE INGRESO - CENTRO OBSTETRICO</b> - FO -</ td></div>" +
                        "<table class='table1'>" +
                            "<tr>" +
                                "<td class='td' style='background-color: #c1bebe;'>Fecha</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>Hora</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>Edad</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>Gesta</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>Paridad</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>FUR</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>FPP</td>" +
                                "<td class='td' style='background-color: #c1bebe;'>Origen de servicio</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString() + "</td>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["horaInicioAtencion"].ToString() + "</td>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["tipoEdad"].ToString() + "</td>" +
                                "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["gMotiA"].ToString() + "</td>" +
                                "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["pMotiA"].ToString() + "</td>" +
                                "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["FechaUR"].ToString() + "</td>" +
                                "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["FechaPP"].ToString() + "</td>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() + "</td>" +
                            "</tr>" +
                        "</table>" +
                        "<table class='table1'>" +
                            "<tr> <td class='td' style='background-color: #c1bebe;'> <b>MOTIVO DE INGRESO</b> </td> </tr>" +
                            "<tr>" +
                                "<td class='td' style='background-color: #c1bebe;'> <b>MOTIVO DE ATENCIÓN</b> </td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["enfermedadA"].ToString() + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' style='background-color: #c1bebe;'><b>SIGNOS Y SINTOMAS</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["Sintomas"].ToString() + "</td>" +
                            "</tr>" +
                        "</table>" +

                        "<table class='table1'>" +
                            "<tr>" +
                                "<td class='td' style='background-color: #c1bebe;' width='50%' ><b>ANTECEDENTES OBSTÉTRICOS</b></td>" +
                                "<td class='td' style='background-color: #c1bebe;' width='45%' ><b>ANTECEDENTES MÉDICOS</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' width='50%'>" +
                                    "<table>" +
                                        "<tr><td><b>FUR</b></td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["fechaUR"].ToString() + "</td></tr>" +
                                        "<tr><td><b>FUE</b></td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["fechaEco"].ToString() + "</td></tr>" +
                                        "<tr><td><b>FPP</b></td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["fechaPP"].ToString() + "</td></tr>" +
                                        "<tr><td><b>EG</b></td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["edadGestacional"].ToString() + "</td></tr>" +
                                        "<tr><td>Semanas</td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["edadGestacional"].ToString() + " Dias</td></tr>" +
                                        "<tr><td><b>CPN</b></t d><td>" + lsEvalEmergencia.Tables[0].Rows[0]["cnp"].ToString() + "</td></tr>" +
                                    "</table>" +
                                "</td>" +
                                "<td class='td' width='45%'>" +
                                    "<table>" +
                                        "<tr><td><b>Medicos</b></td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["antecedentes"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Ram</b></td><td>" + lsEvalEmergencia.Tables[0].Rows[0]["ram"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Transfuciones</b></td><td>" + ((lsEvalEmergencia.Tables[0].Rows[0]["transfucionSangre"].ToString()) == "1" ? "SI" : "NO") + "</td></tr>" +
                                    "</table>" +
                                "</td>" +
                            "</tr>" +
                            "<tr><td class='td' colspan='2' ><b>Quirurgicos:</b>" + lsEvalEmergencia.Tables[0].Rows[0]["antecedentesQuirurgicos"].ToString() + "</td></tr>" +
                        "</table>" +

                        "<table class='table1'>" +
                            "<tr>" +
                                "<td class='td' width='20%' style='background-color: #c1bebe;'><b>FUNCIONES VITALES</b></td>" +
                                "<td class='td' width='75%' style='background-color: #c1bebe;'><b>EXAMEN GENERAL</b></td> " +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' width='20%'>" +
                                    "<table class='table1'> " +
                                        "<tr><td width='20%'>T°</td><td style='text-align:right;' width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString() + " C°</td></tr>" +
                                        "<tr><td width='20%'>P. A.</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajePresion"].ToString() + " mm/Hg</td></tr>" +
                                        "<tr><td width='20%'>F. C.</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajeFrecuenciaCardiaca"].ToString() + " /min</td></tr>" +
                                        "<tr><td width='20%'>F. R.</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajeFrecuenciaRespiratoria"].ToString() + " /min</td></tr>" +
                                        "<tr><td width='20%'>PESO</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajePeso"].ToString() + " Kg</td></tr>" +
                                        "<tr><td width='20%'>IMC: </td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["imc"].ToString() + "</td></tr>" +
                                    "</table>" +
                                "</td>" +
                                "<td class='td' width='75%'>" +
                                    "<table class='table1'> " +
                                        "<tr><td><b>General y sensorio:<b/></td><td  width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lEstadoGeneral"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dEstadoGeneral"].ToString() + " " + lsGinecoObstetra.Tables[0].Rows[0]["dEdemas"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Cardiovascular<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoCV"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoCV"].ToString() + " " + lsGinecoObstetra.Tables[0].Rows[0]["dReflejos"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Abdomen<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAbdomen"].ToString() == "1") ? "Normal" : "NO") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAbdomen"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Respiratorio<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoR"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoR"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Urinario<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoU"].ToString() == "1") ? "Normal" : "Anormal") + " ->" + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoU"].ToString() + "</td></tr>" +
                                        "<tr><td><b>Extremidades<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lExtremidades"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dExtremidades"].ToString() + "</td></tr>" +
                                    "</table> " +
                                "</td>" +
                            "</tr>" +
                        "</table>" +

                        "<table class='table1'>" +
                            "<tr> " +
                                "<td class='td' colspan='2' style='background-color: #c1bebe;'><b>Examen Obstetrico</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' width='80%'>" +
                                    "<table class='table1'> " +
                                        "<tr>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>AU<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>LCF<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>DU<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Proteinuria<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Mov. Fetales<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Ponderado<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Pelvis Ginecoide<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Compat. Feto-Pelvica<b/></td>" +
                                        "</tr>" +
                                        "<tr>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lua"].ToString() + " cm </td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["llcf"].ToString() + " /min </td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["ldu"].ToString() + " /10 min</td>" +
                                            "<td class='td' width='15%'>" + lsGinecoObstetra.Tables[0].Rows[0]["proteinura"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + lsGinecoObstetra.Tables[0].Rows[0]["movFetales"].ToString() + "</td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lPonderado"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + pelvisGinecoide + "</td>" +
                                            "<td class='td' width='15%'>" + compatibilidadFetoP + "</td>" +
                                        "</tr>" +
                                    "</table>" +
                                "</td>" +
                                "<td class='td' width='20%'>" +
                                    "<table class='table1'> " +
                                         "<tr>" +
                                            "<td style='vertical-align: text-top;' width='35%' > " + feto + "</td>" +
                                        "</tr>" +
                                    "</table>" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +

                        "<table class='table1'>" +
                            "<tr> " +
                                "<td colspan='2' class='td' width='47%' style='background-color: #c1bebe;'><b>Tacto Vaginal</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' width='47%'>" +
                                    "<table class='table1'> " +
                                        "<tr>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Dilatacion<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Incorporacion<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Alt. Prsent<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Varied. Prsent<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Memb. Rotas<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Procubito<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Prolapso<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Sangrado V.<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Liquido Amniótico<b/></td>" +
                                        "</tr>" +
                                        "<tr>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lDilatacion"].ToString() + " cm </td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lIncorporacion"].ToString() + " </td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lAlPresent"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + lsGinecoObstetra.Tables[0].Rows[0]["dVarPresent"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["membranasRotas"].ToString() == "1") ? "SI" : "NO") + "</td>" +
                                            "<td class='td' width='10%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lProcubito"].ToString() == "1") ? "SI" : "NO") + "</td>" +
                                            "<td class='td' width='15%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lProlapso"].ToString() == "1") ? "SI" : "NO") + "</td>" +
                                            "<td class='td' width='15%'>" + lsGinecoObstetra.Tables[0].Rows[0]["dSangradoV"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lLiquidoA"].ToString() == "1") ? "CLARO" : ((lsGinecoObstetra.Tables[0].Rows[0]["lLiquidoA"].ToString() == "2") ? "MECONIAL" : "SANGUINOLENTO")) + "</td>" +
                                        "</tr>" +
                                    "</table>" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +

                        //"<table class='table1'>" +
                        //    "<tr> " +
                        //        "<td colspan='2' class='td' width='47%' style='background-color: #c1bebe;'><b>Examen Ginecologico</b></td>" +
                        //    "</tr>" +
                        //    "<tr>" +
                        //        "<td class='td' width='47%'>" +
                        //            "<table font size=8pt  style='width: 100%'> " +
                        //                "<tr><td  '><b>GE y BUS:<b/></td><td  width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lGeBus"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dGeBus"].ToString() + "</td></tr>" +
                        //                "<tr><td  '><b>Vagina<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lVagina"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dVagina"].ToString() + "</td></tr>" +
                        //                "<tr><td  '><b>Cérvix<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lCervix"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dCervix"].ToString() + "</td></tr>" +
                        //                "<tr><td  ><b>Útero<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lUtero"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dUtero"].ToString() + "</td></tr>" +
                        //            "</table> " +
                        //        "</td>" +
                        //        "<td class='td' width='47%'>" +
                        //            "<table font size=8pt  style='width: 100%'> " +
                        //                "<tr><td  ><b>Anexos<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAnexos"].ToString() == "1") ? "Normal" : "Anormal") + " ->" + lsGinecoObstetra.Tables[0].Rows[0]["dAnexos"].ToString() + "</td></tr>" +
                        //                "<tr><td  ><b>F.S Douglas<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lDouglas"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dDouglas"].ToString() + "</td></tr>" +
                        //                "<tr><td  ><b>Parametrios<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lParametros"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dParametros"].ToString() + "</td></tr>" +
                        //                "<tr><td  ><b>Mamas<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lMamas"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dMamas"].ToString() + "</td></tr>" +
                        //            "</table> " +
                        //        "</td>" +
                        //    "</tr>" +
                        //"</table>" +

                        "<table class='table1'>" +
                            "<tr>" +
                                 "<td class='td' style='background-color: #c1bebe;' width='50%'><b>Diagnosticos</b></td>" +
                                 "<td class='td' style='background-color: #c1bebe;' width='45%'><b>Plan de Trabajo</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                 "<td class='td' width='50%'>" + diagnosticos + "</td>" +
                                 "<td class='td' width='45%'  style='vertical-align: text-top;' >" + lsEvalEmergDetalle.Tables[0].Rows[0]["PlandeTrabajo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                             "</tr>" +
                        "</table>" +

                        "<table class='table1'>" +
                            "<tr>" +
                                "<td class='td' style='width: 60%; background-color: #c1bebe;'><b>Impresión diagnóstica</b></td>" +
                                "<td class='td' style='width: 35%; background-color: #c1bebe;'><b>Próxima Cita</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' style='vertical-align: text-top;width: 60%' >" + lsEvalEmergDetalle.Tables[0].Rows[0]["indicaciones"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                "<td class='td' style='width: 35%'>" + lsAtencion.Tables[0].Rows[0]["ProximaCita"].ToString() + "</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td rowspan='2' class='td' style='vertical-align: text-top; width: 60%;'><b>Observaciones Obstetricas: </b>" + lsGinecoObstetra.Tables[0].Rows[0]["dObservacionesObstetricas"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                "<td class='td' width: 35%><br><br></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' style='text-align: center; width: 35%'><b>FIRMA Y SELLO: </b>" + lsEvalEmergencia.Tables[0].Rows[0]["usuario"].ToString() + "</td>" +
                            "</tr>" +
                        "</table>" +

                        "<table class='table1'>" +
                            "<tr>" +
                                "<td class='td' width: 70% style='background-color: #c1bebe;'><b>Nombres y Apellidos del Paciente</b></td>" +
                                "<td class='td' width: 20% style='background-color: #c1bebe;'><b>Servicio</b></td>" +
                                "<td class='td' width: 10% style='background-color: #c1bebe;'><b>Historia Clinica</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' width: 70%>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + "</td>" +
                                "<td class='td' width: 20%>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() + "</td>" +
                                "<td class='td' width: 10%>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                            "</tr>" +
                       "</table>" +
                    "</div>" +
                    "<br>"
                    );
            }

            return html;
        }

        public async Task<StringBuilder> GeneraHosReevaluacionHTML(int idCuentaAtencion, int idItem, int idServicio) // JDELGADO010
        {
            StringBuilder html = new StringBuilder();
            DataSet lsEvalEmergDetalle, lsAtencion, lsDiagnosticos, lsEvalEmergencia, lsTriaje, lsGinecoObstetra;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalTriaje dalTriaje = new DalTriaje();
            String diagnosticos = "";
            String idAtencion = "0";
            string pelvisGinecoide = "";
            string compatibilidadFetoP = "";
            string tramiento = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;


            DataSet lsParametros;
            string nombre = "", direccion = "", telefono = "";
            DalParametros daoParametros = new DalParametros();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            DateTime now = DateTime.Now;
            EvaluacionEmergenciaDetalle objEvlEmDet = new EvaluacionEmergenciaDetalle();
            //now.ToString();
            Triaje triaje = new Triaje();
            if (lsAtencion.Tables[0].Rows.Count == 0)
            {
                html.Append("Sin datos");
                //return PartialView("~/Views/Comun/GeneradorReporteGeneral.cshtml");
            }
            else
            {
                idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
                lsDiagnosticos = await daoAtenciones.web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(idItem, Convert.ToInt32(idAtencion), (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso, idServicio); // JDELGADO J0 AWAIT SENTENCE
                lsEvalEmergencia = await daoAtenciones.ListaEvalEmergenciaEmeHospi(Convert.ToInt32(idAtencion), idItem, idServicio);

                triaje.idAtencion = (Convert.ToInt32(idAtencion));
                triaje.idNumero = idItem;
                triaje.idServicio = idServicio;
                lsTriaje = await dalTriaje.ListaTriajeEmgHosp(triaje);
                lsGinecoObstetra = await daoAtenciones.ListaGinecoObstetraEmeHospi(Convert.ToInt32(idAtencion), idItem, idServicio);
                objEvlEmDet.idservicio = idServicio;
                objEvlEmDet.IdNumero = idItem;
                objEvlEmDet.IdAtencion = Convert.ToInt32(idAtencion);
                lsEvalEmergDetalle = await daoAtenciones.ListaEvaluacionEmergenciaDetalle(objEvlEmDet);

                compatibilidadFetoP = (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "1") ? "SI" : (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "2") ? "NO" : "Dudosa";
                pelvisGinecoide = (lsGinecoObstetra.Tables[0].Rows[0]["lPelvisGinecoide"].ToString() == "1") ? "SI" : "NO";

                foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
                {
                    diagnosticos = diagnosticos + dr["codigoCIE10"].ToString() + " - " + dr["descripcion"].ToString() + "<br>";

                }
                ;

                tramiento = lsAtencion.Tables[0].Rows[0]["Tratamiento"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>");

                if (tramiento == "")
                {
                    tramiento = "<br><br><br>";
                }
                html.Append(
                    "<style>" +
                        ".table { " +
                            "width: 100%;" +
                            "text-align: center;" +
                            "border-spacing: 5px; " +
                        "}" +
                        ".table1 { " +
                            "width: 100%;" +
                            "margin-top: 10px;" +
                        "}" +
                        ".td  { " +
                            "border : 1px solid gray; border-collapse: collapse; padding: 4px; " +
                            "style='text-align: justify;' white-space: pre-line; word-wrap: break-word;}" +
                        ".title { background-color: #c1bebe; padding: 10px; text - decoration: underline" +
                    "</style>");

                html.Append(
                    "<div style='position: absolute; left: 0; right: 0; padding: 10px;'>" +
                        "<img style='width: 70px;' src='" + sWebRootFolder + "\\images\\Logo2.png'>" +
                    "</div>" +
                    "<div style='position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; top: 0; padding: 10px;'>" +
                        "<div align='center'> <b>" + nombre + "</b></div>" +
                        "<div align='center'>" + direccion + "</div>" +
                        "<div align='center'>TELEFONO: " + telefono + "</div>" +
                    "</div>" +
                    "<div style='float: right; padding: 10px;'>" +
                    "" + now.ToString() + "" +
                    "<div> Impreso por: " + HttpContext.Session.GetString("usuario") + "</div>" +
                    //"<div> usuario: " + now.ToString() + "</div>" +
                    "</div>"
                    );
                html.Append("<br><br><br><br>");

                html.Append(
                    "<div style='width: 95%; margin: auto;'>" +
                        "<div align='center' class='title'>NOTA DE INGRESO - EVALUACION EN HOSPITALIZACIÓN</div>" +
                        "<table class='table1'>" +
                            "<tr>" +
                                "<td align='center' class='title'>Evaluación</td>" +
                            "</tr>" +
                            "<tr>" +
                                $"<td class='td'> SE REEVALUA PACIENTE CON RESULTADOS:" +
                                    $"<ul>" +
                                        $"<li>" +
                                            $"<b>FUNCIONES VITALES:</b> PA = {lsTriaje.Tables[0].Rows[0]["TriajePresion"]}mm/Hg, FC = {lsTriaje.Tables[0].Rows[0]["TriajeFrecuenciaCardiaca"]}/min, " +
                                            $"FR = {lsTriaje.Tables[0].Rows[0]["TriajeFrecuenciaRespiratoria"]}/min, T° = {lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"]} C°, " +
                                            $"PESO = {lsTriaje.Tables[0].Rows[0]["TriajePeso"]} Kg, IMC = {lsTriaje.Tables[0].Rows[0]["imc"]}" +
                                        $"</li>" +
                                        $"<li>" +
                                            $"<b>EXAMEN FÍSICO:</b> " +
                                            $"General y sensorio = {((lsGinecoObstetra.Tables[0].Rows[0]["lEstadoGeneral"].ToString() == "1") ? "Normal" : "Anormal")} ->, {lsGinecoObstetra.Tables[0].Rows[0]["dEstadoGeneral"]} {lsGinecoObstetra.Tables[0].Rows[0]["dEdemas"]}" +
                                            $"Cardiovascular = {((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoCV"].ToString() == "1") ? "Normal" : "Anormal")} -> {lsGinecoObstetra.Tables[0].Rows[0]["dAparatoCV"]} {lsGinecoObstetra.Tables[0].Rows[0]["dReflejos"]}, " +
                                            $"Abdomen = {((lsGinecoObstetra.Tables[0].Rows[0]["lAbdomen"].ToString() == "1") ? "Normal" : "NO")} -> {lsGinecoObstetra.Tables[0].Rows[0]["dAbdomen"]}, " +
                                            $"Respiratorio = {((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoR"].ToString() == "1") ? "Normal" : "Anormal")} -> {lsGinecoObstetra.Tables[0].Rows[0]["dAparatoR"]}, " +
                                            $"Urinario = {((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoU"].ToString() == "1") ? "Normal" : "Anormal")} -> {lsGinecoObstetra.Tables[0].Rows[0]["dAparatoU"]}, " +
                                            $"Extremidades = {((lsGinecoObstetra.Tables[0].Rows[0]["lExtremidades"].ToString() == "1") ? "Normal" : "Anormal")} -> {lsGinecoObstetra.Tables[0].Rows[0]["dExtremidades"]}" +
                                        $"</li>" +
                                    $"</ul>" +
                                $"</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td align='center' class='title' style='width: 100%;'>Descripcion Exámen Físico</td>" +
                            "</tr>" +
                            "<tr>" +
                                $"<td class='td' style='max-width: 200px;'>" +
                                    WordWrap(lsEvalEmergencia.Tables[0].Rows[0]["DescripcionExamenFisico"].ToString()).ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") +
                                $"</td>" +
                            "</tr>" +
                         "</table>" +

                         "<table class='table1'>" +
                            "<tr> " +
                                "<td colspan='2' class='td' width='47%' style='background-color: #c1bebe;'><b>Tacto Vaginal</b></td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' width='47%'>" +
                                    "<table class='table1'> " +
                                        "<tr>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Dilatacion<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Incorporacion<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Alt. Prsent<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Varied. Prsent<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Memb. Rotas<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='10%'><b>Procubito<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Prolapso<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Sangrado V.<b/></td>" +
                                            "<td class='td' style='background-color: #c1bebe;' width='15%'><b>Liquido Amniótico<b/></td>" +
                                        "</tr>" +
                                        "<tr>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lDilatacion"].ToString() + " cm </td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lIncorporacion"].ToString() + "</td>" +
                                            "<td class='td' width='10%'>" + lsGinecoObstetra.Tables[0].Rows[0]["lAlPresent"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + lsGinecoObstetra.Tables[0].Rows[0]["dVarPresent"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["membranasRotas"].ToString() == "1") ? "SI" : "NO") + "</td>" +
                                            "<td class='td' width='10%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lProcubito"].ToString() == "1") ? "SI" : "NO") + "</td>" +
                                            "<td class='td' width='15%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lProlapso"].ToString() == "1") ? "SI" : "NO") + "</td>" +
                                            "<td class='td' width='15%'>" + lsGinecoObstetra.Tables[0].Rows[0]["dSangradoV"].ToString() + "</td>" +
                                            "<td class='td' width='15%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lLiquidoA"].ToString() == "1") ? "CLARO" : ((lsGinecoObstetra.Tables[0].Rows[0]["lLiquidoA"].ToString() == "2") ? "MECONIAL" : "SANGUINOLENTO")) + "</td>" +
                                        "</tr>" +
                                    "</table>" +
                                "</td>" +
                            "</tr>" +
                        "</table>" +

                        "<br>" +
                        "<table class='table1'>" +
                            "<tr>" +
                                "<td align='center' class='title'>Diagnosticos</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td'>" + diagnosticos + "</td>" +
                            "</tr>" +
                         "</table>" +

                         "<br>" +

                         "<table class='table1'>" +
                            "<tr>" +
                                "<td align='center' class='title' style='max-width: 50%; max-width: 200px;'>Tratamiento:</td>" +
                                "<td align='center' class='title' style='max-width: 50%; max-width: 200px;'>Plan de trabajo:</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td' class='title' style='width: 50%;'>" + lsEvalEmergencia.Tables[0].Rows[0]["Tratamiento"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                "<td class='td' class='title' style='width: 50%;'>" + lsEvalEmergDetalle.Tables[0].Rows[0]["PlandeTrabajo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                            "</tr>" +
                         "</table>" +

                         "<br>" +

                         "<table class='table'" +
                            "<tr>" +
                                "<td class='title'>Apellidos y Nombres:</td>" +
                                "<td class='title'>Historia Clínica:</td>" +
                                "<td class='title'>Nro Cuenta:</td>" +
                                "<td class='title'>Fecha:</td>" +
                                "<td class='title'>Hora:</td>" +
                            "</tr>" +
                            "<tr>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + "</td>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString() + "</td>" +
                                "<td class='td'>" + lsEvalEmergDetalle.Tables[0].Rows[0]["fecha"].ToString() + "</td>" +
                                "<td class='td'>" + lsEvalEmergDetalle.Tables[0].Rows[0]["HoraInicioAtencion"].ToString() + "</td>" +
                            "</tr>" +
                         "</table>" +
                    "</div>"
                    );
            }
            return html;
        }

        public async Task<ActionResult> HospReevaluacionSF(int idCuentaAtencion, int idItem, int idServicio) // JDELGADO003-C
        {
            try
            {
                StringBuilder html = new StringBuilder();
                html = await GeneraHosReevaluacionHTML(idCuentaAtencion, idItem, idServicio);
                var stream = GeneraPdfMemoy(html, 1);
                return stream;
            }
            catch (Exception e)
            {
                return Json(new { error = e.ToString() });
            }
        }

        public async Task<ActionResult> InformeAtencionConsultaExterna(int idCuentaAtencion, int idProCabecera, int tipoFormato, string usuario) // JDELGADO003-M
        {
            //String nombre = "", direccion = "", telefono = "";
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DalParametros daoParametros = new DalParametros();
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalAtencionOdontologica daoAtencionOdontologica = new DalAtencionOdontologica();
            DalRecetas daoRecetas = new DalRecetas();
            DalTriaje dalTriaje = new DalTriaje();
            DataSet lsAtencion, lsDiagnosticos, lsEvalEmergencia, lsTriaje, lsGinecoObstetra, lsParametros, lsAtencionOdontologica;
            int idAtencion = 0;
            int idPaciente = 0;

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            @ViewBag.Usuario = usuario;

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

            idAtencion = Convert.ToInt32(lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString());
            idPaciente = Convert.ToInt32(lsAtencion.Tables[0].Rows[0]["IdPaciente"].ToString());
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            DataTable dtDx = lsDiagnosticos.Tables[0];
            //sEvalEmergencia = await daoAtenciones.ListaEvaluacionEmergencia(Convert.ToInt32(idAtencion));
            lsEvalEmergencia = await daoAtenciones.EvaluacionObstetricaSeleccionar(Convert.ToInt32(idAtencion));
            lsAtencionOdontologica = await daoAtencionOdontologica.SeleccionarAtencion(idAtencion, 0);      //ATENCION ODONTOLOGICA
            //lsAtencionDatoAd= daoAtenciones.ListaAtencionByIdCuentaAtencion.

            @ViewBag.FechaIngreso = lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString() + "  " + lsAtencion.Tables[0].Rows[0]["HoraInicio"].ToString();
            @ViewBag.FechaEgreso = lsAtencion.Tables[0].Rows[0]["FechaEgreso"].ToString() + "  " + lsAtencion.Tables[0].Rows[0]["HoraEgreso"].ToString();
            @ViewBag.Edad = lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["tipoEdad"].ToString();

            /*=================FUNCIONES BIOLOGICAS=============================*/
            @ViewBag.Apetito = lsAtencion.Tables[0].Rows[0]["apetito"].ToString();
            @ViewBag.Orina = lsAtencion.Tables[0].Rows[0]["orina"].ToString();
            @ViewBag.Sed = lsAtencion.Tables[0].Rows[0]["sed"].ToString();
            @ViewBag.Deposicion = lsAtencion.Tables[0].Rows[0]["deposiciones"].ToString();
            @ViewBag.Sueño = lsAtencion.Tables[0].Rows[0]["suenio"].ToString();

            /*============================TRIAJE============================*/
            lsTriaje = dalTriaje.ListaTriaje(Convert.ToInt32(idAtencion));
            @ViewBag.TriajeTemperatura = lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString() + " C°";
            @ViewBag.TriajePresion = lsTriaje.Tables[0].Rows[0]["TriajePresion"].ToString() + " mm/Hg";
            @ViewBag.TriajeFC = lsTriaje.Tables[0].Rows[0]["TriajeFrecCardiaca"].ToString() + " /min";
            @ViewBag.TriajeFR = lsTriaje.Tables[0].Rows[0]["TriajeFrecRespiratoria"].ToString() + " /min";
            @ViewBag.TriajePeso = lsTriaje.Tables[0].Rows[0]["TriajePeso"].ToString() + " Kg";
            @ViewBag.IMC = lsTriaje.Tables[0].Rows[0]["imc"].ToString();

            /*============================ANTECEDENTES============================*/
            @ViewBag.AntePatologicos = lsAtencion.Tables[0].Rows[0]["antecedPatologico"].ToString();
            @ViewBag.AnteObstetrico = lsAtencion.Tables[0].Rows[0]["antecedObstetrico"].ToString();
            @ViewBag.AnteQuirurgico = lsAtencion.Tables[0].Rows[0]["antecedQuirurgico"].ToString();
            @ViewBag.AnteAlergico = lsAtencion.Tables[0].Rows[0]["antecedAlergico"].ToString();
            @ViewBag.Antecedentes = lsAtencion.Tables[0].Rows[0]["antecedentes"].ToString();
            @ViewBag.AnteFamiliar = lsAtencion.Tables[0].Rows[0]["antecedFamiliar"].ToString();
            @ViewBag.EsPacienteCronico = lsAtencion.Tables[0].Rows[0]["dEsPacienteCronico"].ToString();//RMOREANO 04032026
            @ViewBag.Diagnosticos = dtDx;

            @ViewBag.ExamenClinico = lsAtencion.Tables[0].Rows[0]["CitaExamenClinico"].ToString();
            @ViewBag.CitaMotivo = lsAtencion.Tables[0].Rows[0]["CitaMotivo"].ToString();
            @ViewBag.PlanTrabajo = lsAtencion.Tables[0].Rows[0]["PlanTrabajo"].ToString();
            @ViewBag.Tratamiento = lsAtencion.Tables[0].Rows[0]["Tratamiento"].ToString();
            @ViewBag.CitasObservaciones = lsAtencion.Tables[0].Rows[0]["citaObservaciones"].ToString();
            @ViewBag.ProximaCita = lsAtencion.Tables[0].Rows[0]["ProximaCita"].ToString();

            @ViewBag.Paciente = lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString();
            @ViewBag.Servicio = lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString();
            @ViewBag.Historia = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();


            @ViewBag.IdEspecialidad = lsAtencion.Tables[0].Rows[0]["IdEspecialidad"].ToString();
            @ViewBag.ClasificacionTipoAtencion = lsAtencion.Tables[0].Rows[0]["ClasificacionTipoAtencionDescripcion"].ToString();
            @ViewBag.Recomendaciones = lsAtencion.Tables[0].Rows[0]["Recomendaciones"].ToString();

            /*======================================ATENCION ODONTOLOGICA=======================================================*/
            if (lsAtencionOdontologica.Tables[0].Rows.Count > 0)
            {
                @ViewBag.EsAtencionOdontologica = 1;
                @ViewBag.XAlergia = (lsAtencionOdontologica.Tables[0].Rows[0]["optAlergia"].ToString() == "1" ? "Si" : "No");
                @ViewBag.DAlergia = lsAtencionOdontologica.Tables[0].Rows[0]["dAlergia"];

                @ViewBag.XEnfermedad = (lsAtencionOdontologica.Tables[0].Rows[0]["optEnfermedad"].ToString() == "1" ? "Si" : "No");
                @ViewBag.DEnfermedad = lsAtencionOdontologica.Tables[0].Rows[0]["dEnfermedad"];

                @ViewBag.XSarro = (lsAtencionOdontologica.Tables[0].Rows[0]["optSarro"].ToString() == "1" ? "Si" : "No");
                @ViewBag.XPlacaBacteriana = (lsAtencionOdontologica.Tables[0].Rows[0]["optPlacaBacteriana"].ToString() == "1" ? "Si" : "No");

                @ViewBag.DObservaciones = lsAtencionOdontologica.Tables[0].Rows[0]["dObservaciones"];

                @ViewBag.DCaries = lsAtencionOdontologica.Tables[0].Rows[0]["dCaries"];
                @ViewBag.DPiezasAusentes = lsAtencionOdontologica.Tables[0].Rows[0]["dPiezasAusentes"];
                @ViewBag.DRemanenteRadicular = lsAtencionOdontologica.Tables[0].Rows[0]["dRemanenteRadicular"];
                @ViewBag.DNecrosisPulpar = lsAtencionOdontologica.Tables[0].Rows[0]["dNecrosisPulpar"];
                @ViewBag.DAbcesos = lsAtencionOdontologica.Tables[0].Rows[0]["dAbcesos"];

                @ViewBag.DRecomendaciones = lsAtencionOdontologica.Tables[0].Rows[0]["dRecomendaciones"];

                @ViewBag.OdontogramaImg = lsAtencionOdontologica.Tables[0].Rows[0]["rutaImagen"].ToString();
            }
            else
            {
                @ViewBag.EsAtencionOdontologica = 0;
            }

            /*===================================================================================================================*/

            @ViewBag.Medico = lsAtencion.Tables[0].Rows[0]["Medico"].ToString();

            @ViewBag.CodeFirma = lsAtencion.Tables[0].Rows[0]["code"];

            @ViewBag.HoraInicioAtencion = lsAtencion.Tables[0].Rows[0]["horaInicioAtencion"].ToString();

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


            if (tipoFormato == 0)
            {
                return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoEspecialidades.cshtml");
            }
            else if (tipoFormato == 1)
            {
                DataSet antecedentes = await daoAtenciones.ListaAntecedentesPaciente(idPaciente, idProCabecera);
                //lsAntecedentesObst = await daoAtenciones.ListarAntecendesxIdCabecera(idProCabecera);
                DataRow rowAntecedentesFam = antecedentes.Tables[0].Rows[0];
                DataRow rowAntecedentesPer = antecedentes.Tables[1].Rows[0];
                DataRow rowAntecedentesObst = antecedentes.Tables[2].Rows[0];
                lsGinecoObstetra = await daoAtenciones.ListaGinecoObstetra(Convert.ToInt32(idAtencion));

                @ViewBag.FechaIngreso = lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString();
                @ViewBag.HoraInicio = lsAtencion.Tables[0].Rows[0]["HoraInicio"].ToString();

                @ViewBag.Edad = lsAtencion.Tables[0].Rows[0]["Edad"].ToString();
                @ViewBag.Gestas = ((Int32)(rowAntecedentesObst["Gestas"]) + 1);
                @ViewBag.Paridad = rowAntecedentesObst["Paridad"].ToString();
                @ViewBag.FechaUR = lsEvalEmergencia.Tables[0].Rows[0]["FechaURFormato"].ToString();
                @ViewBag.FechaPP = lsEvalEmergencia.Tables[0].Rows[0]["FechaPPFormato"].ToString();
                @ViewBag.EdadGestacional = lsEvalEmergencia.Tables[0].Rows[0]["EdadGestacional"].ToString();

                /*==============ANTENCEDENTES FAMILIARES=================================*/
                @ViewBag.FTbc = rowAntecedentesFam["tbcDescripcion"].ToString();
                @ViewBag.FDiabetes = rowAntecedentesFam["diabetesDescripcion"].ToString();
                @ViewBag.FHipertencion = rowAntecedentesFam["HtaDescripcion"].ToString();
                @ViewBag.FPreEclampsia = rowAntecedentesFam["PreeclampsiaEclampsiaDescripcion"].ToString();
                @ViewBag.FGemelares = rowAntecedentesFam["GemelaresDescripcion"].ToString();
                @ViewBag.FMalformaciones = rowAntecedentesFam["MalformacionesDescripcion"].ToString();
                @ViewBag.FOtraCondicion = rowAntecedentesFam["OtrosDescripcion"].ToString();

                /*==============ANTENCEDENTES PERSONALES=================================*/
                @ViewBag.PTbc = rowAntecedentesPer["tbcDescripcion"].ToString();
                @ViewBag.PDiabetes = rowAntecedentesPer["diabetesDescripcion"].ToString();
                @ViewBag.PHipertencion = rowAntecedentesPer["HipertencionDescripcion"].ToString();
                @ViewBag.PPreEclampsia = rowAntecedentesPer["PreeclampsiaEclampsiaDescripcion"].ToString();
                @ViewBag.PVih = rowAntecedentesPer["vihDescripcion"].ToString();
                @ViewBag.PAlergia = rowAntecedentesPer["alergiaDescripcion"].ToString();
                @ViewBag.PCirugiaMayor = rowAntecedentesPer["cirugiaMayorDescripcion"].ToString();
                @ViewBag.PViolencia = rowAntecedentesPer["violenciaDescripcion"].ToString();
                @ViewBag.PVacunaPrevia = rowAntecedentesPer["vacunaPreviaDescripcion"].ToString();
                @ViewBag.POtros = rowAntecedentesPer["otrosDescripcion"].ToString();

                //===================EXAMEN GENERAL===============================//
                @ViewBag.GeneralSensorio = ((lsGinecoObstetra.Tables[0].Rows[0]["lEstadoGeneral"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dEstadoGeneral"].ToString() + " " + lsGinecoObstetra.Tables[0].Rows[0]["dEdemas"].ToString();
                @ViewBag.AparatoCV = ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoCV"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoCV"].ToString() + " " + lsGinecoObstetra.Tables[0].Rows[0]["dReflejos"].ToString();
                @ViewBag.Abdomen = ((lsGinecoObstetra.Tables[0].Rows[0]["lAbdomen"].ToString() == "1") ? "Normal" : "NO") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAbdomen"].ToString();
                @ViewBag.AparatoR = ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoR"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoR"].ToString();
                @ViewBag.AparatoU = ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoU"].ToString() == "1") ? "Normal" : "Anormal") + " ->" + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoU"].ToString();
                @ViewBag.Extremidades = ((lsGinecoObstetra.Tables[0].Rows[0]["lExtremidades"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dExtremidades"].ToString();

                //===================EXAMEN OBSTETRICO===============================//
                @ViewBag.AU = lsGinecoObstetra.Tables[0].Rows[0]["lua"].ToString() + " cm";
                @ViewBag.LCF = lsGinecoObstetra.Tables[0].Rows[0]["llcf"].ToString() + " /min";
                @ViewBag.DU = lsGinecoObstetra.Tables[0].Rows[0]["ldu"].ToString() + " /10 min";
                @ViewBag.Proteinura = lsGinecoObstetra.Tables[0].Rows[0]["proteinura"].ToString();
                @ViewBag.MovFetales = lsGinecoObstetra.Tables[0].Rows[0]["movFetales"].ToString();
                @ViewBag.Ponderado = lsGinecoObstetra.Tables[0].Rows[0]["lPonderado"].ToString();
                @ViewBag.FetoPelvica = (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "1") ? "SI" : (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "2") ? "NO" : "Dudosa";
                @ViewBag.PelvisGinecoide = (lsGinecoObstetra.Tables[0].Rows[0]["lPelvisGinecoide"].ToString() == "1") ? "SI" : "NO";

                @ViewBag.TipoEmbarazo = lsGinecoObstetra.Tables[0].Rows[0]["lTipoEmbarazo"].ToString();
                if (@ViewBag.TipoEmbarazo == "1")       //=============FETO UNICO==============================
                {
                    @ViewBag.FUSituacion = (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "1") ? "Longitudinal" : (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "0") ? "Transversal" : "Ninguno";
                    @ViewBag.FUPosicion = (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "1") ? "Derecha" : (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "0") ? "Izquierda" : "Ninguno";
                    @ViewBag.FUPresentacion = (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "1") ? "Cefálica" : (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "0") ? "Podálica" : "Ninguno";
                }
                else   //=============FETO MULTIPLE==============================
                {
                    @ViewBag.FMdF1Spp = lsGinecoObstetra.Tables[0].Rows[0]["dF1Spp"].ToString();
                    @ViewBag.FMdF2Spp = lsGinecoObstetra.Tables[0].Rows[0]["dF2Spp"].ToString();
                    @ViewBag.FMdF3Spp = lsGinecoObstetra.Tables[0].Rows[0]["dF3Spp"].ToString();

                    @ViewBag.FMlF1Lcf = lsGinecoObstetra.Tables[0].Rows[0]["lF1Lcf"].ToString();
                    @ViewBag.FMlF2Lcf = lsGinecoObstetra.Tables[0].Rows[0]["lF2Lcf"].ToString();
                    @ViewBag.FMlF3Lcf = lsGinecoObstetra.Tables[0].Rows[0]["lF3Lcf"].ToString();

                    @ViewBag.FMmfF01 = lsGinecoObstetra.Tables[0].Rows[0]["mfF01"].ToString();
                    @ViewBag.FMmfF02 = lsGinecoObstetra.Tables[0].Rows[0]["mfF02"].ToString();
                    @ViewBag.FMmfF03 = lsGinecoObstetra.Tables[0].Rows[0]["lF3Lcf"].ToString();
                }

                //===================EXAMEN GINECOLOGICO===============================//
                @ViewBag.GeBus = ((lsGinecoObstetra.Tables[0].Rows[0]["lGeBus"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dGeBus"].ToString();
                @ViewBag.Vagina = ((lsGinecoObstetra.Tables[0].Rows[0]["lVagina"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dVagina"].ToString();
                @ViewBag.Cervix = ((lsGinecoObstetra.Tables[0].Rows[0]["lCervix"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dCervix"].ToString();
                @ViewBag.Utero = ((lsGinecoObstetra.Tables[0].Rows[0]["lUtero"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dUtero"].ToString();

                @ViewBag.Anexos = ((lsGinecoObstetra.Tables[0].Rows[0]["lAnexos"].ToString() == "1") ? "Normal" : "Anormal") + " ->" + lsGinecoObstetra.Tables[0].Rows[0]["dAnexos"].ToString();
                @ViewBag.Douglas = ((lsGinecoObstetra.Tables[0].Rows[0]["lDouglas"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dDouglas"].ToString();
                @ViewBag.Parametros = ((lsGinecoObstetra.Tables[0].Rows[0]["lParametros"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dParametros"].ToString();
                @ViewBag.Mamas = ((lsGinecoObstetra.Tables[0].Rows[0]["lMamas"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dMamas"].ToString();

                //===================OBSERVACIONES OBSTETRICAS===============================//
                @ViewBag.ObsObstetricas = lsGinecoObstetra.Tables[0].Rows[0]["DObservaciones"].ToString();

                return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoGinecoObstetra.cshtml");
            }
            else if (tipoFormato == 2)
            {
                @ViewBag.EnfermedadActual = lsAtencion.Tables[0].Rows[0]["enfermedadActual"].ToString();
                @ViewBag.TiempoEnfermedad = lsAtencion.Tables[0].Rows[0]["tiempoEnfermedad"].ToString();

                DataSet lsAntNacimiento;
                lsAntNacimiento = await daoAtenciones.ListaNinioAltoRiesgoNacimiento(Convert.ToInt32(idAtencion));
                @ViewBag.PesoNacer = lsAntNacimiento.Tables[0].Rows[0]["pesoAlNacer"].ToString();
                @ViewBag.TallaNacer = lsAntNacimiento.Tables[0].Rows[0]["tallaAlNacer"].ToString();
                @ViewBag.PerCefalico = lsAntNacimiento.Tables[0].Rows[0]["perimetroCefalico"].ToString();
                @ViewBag.PerToracico = lsAntNacimiento.Tables[0].Rows[0]["perimetroToracico"].ToString();
                @ViewBag.Apgar1 = lsAntNacimiento.Tables[0].Rows[0]["apgar1min"].ToString();
                @ViewBag.Apgar5 = lsAntNacimiento.Tables[0].Rows[0]["apgar5min"].ToString();
                @ViewBag.EstGestNacer = lsAntNacimiento.Tables[0].Rows[0]["estaGestacionalAlNacer"].ToString();
                @ViewBag.hospi = ((lsAntNacimiento.Tables[0].Rows[0]["hospitalizacion"].ToString()) == "1" ? "SI" : "No") + " - Tiempo Hosp: " + lsAntNacimiento.Tables[0].Rows[0]["tiempoHospitalizado"].ToString();

                DataSet lsAntPerinatales;
                lsAntPerinatales = await daoAtenciones.ListaNinioAltoRiesgoAntecPerinatales(Convert.ToInt32(idAtencion));
                @ViewBag.tipoParto = ((lsAntPerinatales.Tables[0].Rows[0]["tipoParto"].ToString()) == "1" ? "Eutócito" : "Complicado");

                DataSet lsAntAlimPatolog;
                lsAntAlimPatolog = await daoAtenciones.ListaNinioAltoRiesgoAlimentPatologicos(Convert.ToInt32(idAtencion));
                //string tbc, asma, epilepsia, infecciones, hospita, sangre, cirugia, alergia, otros = "";
                @ViewBag.tbc = ((lsAntAlimPatolog.Tables[0].Rows[0]["patTbc"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.asma = ((lsAntAlimPatolog.Tables[0].Rows[0]["patSobaAsma"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.epilepsia = ((lsAntAlimPatolog.Tables[0].Rows[0]["patEpilepsia"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.infecciones = ((lsAntAlimPatolog.Tables[0].Rows[0]["patInfecciones"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.hospita = ((lsAntAlimPatolog.Tables[0].Rows[0]["patHospitalizaciones"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.sangre = ((lsAntAlimPatolog.Tables[0].Rows[0]["patTransferenciaSangre"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.cirugia = ((lsAntAlimPatolog.Tables[0].Rows[0]["patCirugia"].ToString()) == "1" ? "SI" : "No");
                @ViewBag.alergia = ((lsAntAlimPatolog.Tables[0].Rows[0]["patAlergia"].ToString()) == "1" ? "SI" : "No") + " - " + lsAntAlimPatolog.Tables[0].Rows[0]["patAlergiaDesc"].ToString();
                @ViewBag.otros = ((lsAntAlimPatolog.Tables[0].Rows[0]["patOtroAntecedentes"].ToString()) == "1" ? "SI" : "No") + " - " + lsAntAlimPatolog.Tables[0].Rows[0]["patOtroAntecedentesDesc"].ToString();

                return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoPediatrico.cshtml");
            }
            else
            {
                return PartialView("");
            }
        }

        // JDELGADO J0 -- CAMBIAR REFERENCIAS J1
        public async Task<StringBuilder> GeneraAtencionHTML2(int idCuentaAtencion, int idProCabecera, int tipoFormato) // JDELGADO003-M
        {
            StringBuilder html = new StringBuilder();
            DataSet lsAtencion, lsDiagnosticos, lsEvalEmergencia, lsTriaje, lsAntecedentesObst, lsGinecoObstetra, lsParametros;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalTriaje dalTriaje = new DalTriaje();
            String diagnosticos = "";
            String idAtencion = "0";
            String feto = "";
            string pelvisGinecoide = "";
            string compatibilidadFetoP = "";
            string tramiento = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;

            String nombre = "", direccion = "", telefono = "";

            DalParametros daoParametros = new DalParametros();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

            DateTime now = DateTime.Now;
            //now.ToString();           

            try
            {
                if (lsAtencion.Tables[0].Rows.Count == 0)
                {
                    html.Append("Sin datos");
                    //return PartialView("~/Views/Comun/GeneradorReporteGeneral.cshtml");
                }
                else
                {
                    idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
                    lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // JDELGADO J1 AWAIT SENTENCE
                    lsEvalEmergencia = await daoAtenciones.ListaEvaluacionEmergencia(Convert.ToInt32(idAtencion));
                    lsAntecedentesObst = await daoAtenciones.ListarAntecendesxIdCabecera(idProCabecera);
                    //lsAtencionDatoAd= daoAtenciones.ListaAtencionByIdCuentaAtencion.

                    lsTriaje = dalTriaje.ListaTriaje(Convert.ToInt32(idAtencion));
                    lsGinecoObstetra = await daoAtenciones.ListaGinecoObstetra(Convert.ToInt32(idAtencion));



                    foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
                    {
                        diagnosticos = diagnosticos + dr["codigoCIE10"].ToString() + " - " + dr["descripcion"].ToString() + "<br>";

                    }
                    ; // paso 1
                      // ________________________________________________ listo
                    String htmlAntecedentesFamiliares;
                    String htmlAntecedentesPersonales;
                    htmlAntecedentesFamiliares = "";
                    htmlAntecedentesPersonales = "";

                    tramiento = lsAtencion.Tables[0].Rows[0]["Tratamiento"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>");
                    if (tramiento == "")
                    {
                        tramiento = "<br><br>";
                    }

                    html.Append(
                        "<style>" +
                            ".table { " +
                                "width: 100%;" +
                                "text-align: center;" +
                                "border-spacing: 5px; " +
                            "}" +
                            ".table1 { " +
                                "width: 100%;" +
                                "margin-top: 10px;" +
                                "font-size: 12px;" +
                            "}" +
                            ".td  { border : 1px solid gray; border-collapse: collapse; padding: 4px;}" +
                            ".title { background-color: #a9a9a9; padding: 10px; text - decoration: underline; font-size: 13px;" +
                        "</style>");

                    html.Append(
                        "<div style='position:relative; margin-top:2%;'>" +
                        "<div style='position: absolute; left: 3%; right: 0;'>" +
                            "<img style='width: 70px;' src='" + sWebRootFolder + "\\images\\Logo2.png'>" +
                        "</div>" +
                        "<div style='position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; top: 0; padding: 10px;'>" +
                            "<div align='center'> <b>" + nombre + "</b></div>" +
                            "<div align='center'>" + direccion + "</div>" +
                            "<div align='center'>TELEFONO: " + telefono + "</div>" +
                        "</div>" +
                        "<div style='float: right; font-size: 10px; text-align: right; position:absolute; right: 3%;'>" +
                        "" + now.ToString() + "" +
                        "<div> Impreso por: " + HttpContext.Session.GetString("usuario") + "</div>" +
                        //"<div> usuario: " + now.ToString() + "</div>" +
                        "</div>" +
                        "</div>"
                        );
                    html.Append("<br><br><br><br>");

                    // KHOYOS
                    /*if (idProCabecera == 0)
                    {
                        tipoFormato = 0;
                    }*/
                    // KHOYOS

                    //Familiares
                    if (tipoFormato == 1)
                    {

                        if ((bool)lsAntecedentesObst.Tables[0].Rows[0]["tbc"])
                        {
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + "<b>Tbc: SI -></b>";
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + lsAntecedentesObst.Tables[0].Rows[0]["tbcDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[0].Rows[0]["diabetes"])
                        {
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + "<b>Diabetes: SI -></b>";
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + lsAntecedentesObst.Tables[0].Rows[0]["diabetesDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[0].Rows[0]["PreeclampsiaEclampsia"])
                        {
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + "<b>Preeclampsia/Eclampsia: SI -></b>";
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + lsAntecedentesObst.Tables[0].Rows[0]["PreeclampsiaEclampsiaDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[0].Rows[0]["hipertencion"])
                        {
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + "<b>Hipertensión: SI -></b>";
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + lsAntecedentesObst.Tables[0].Rows[0]["hipertencionDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[0].Rows[0]["otraCondMedGrave"])
                        {
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + "<b>Otros: SI -></b>";
                            htmlAntecedentesFamiliares = htmlAntecedentesFamiliares + lsAntecedentesObst.Tables[0].Rows[0]["otraCondMedGraveDescripcion"].ToString() + "<br>";
                        }

                        //Personales
                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["tbc"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Tbc: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["tbcDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["diabetes"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Diabetes: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["diabetesDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["PreeclampsiaEclampsia"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Preeclampsia/Eclampsia: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["PreeclampsiaEclampsiaDescripcion"].ToString() + "<br>";
                        }

                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["hipertencion"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Hipertensión: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["hipertencionDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["vih"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>VIH: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["vihDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["alergia"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Alergia: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["alergiaDescripcion"].ToString() + "<br>";
                        }
                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["otros"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Otros: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["otrosDescripcion"].ToString() + "<br>";
                        }

                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["cirugiaMayor"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Cirugía Mayor: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["cirugiaMayorDescripcion"].ToString() + "<br>";
                        }

                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["violencia"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Violencia: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["violenciaDescripcion"].ToString() + "<br>";
                        }

                        if ((bool)lsAntecedentesObst.Tables[1].Rows[0]["vacunaPrevia"])
                        {
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + "<b>Vacuna Previa: SI -></b>";
                            htmlAntecedentesPersonales = htmlAntecedentesPersonales + lsAntecedentesObst.Tables[1].Rows[0]["vacunaPreviaDescripcion"].ToString() + "<br>";
                        }

                        compatibilidadFetoP = (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "1") ? "SI" : (lsGinecoObstetra.Tables[0].Rows[0]["lCompatibilidadF"].ToString() == "2") ? "NO" : "Dudosa";
                        pelvisGinecoide = (lsGinecoObstetra.Tables[0].Rows[0]["lPelvisGinecoide"].ToString() == "1") ? "SI" : "NO";

                        String valor = "";
                        if (lsGinecoObstetra.Tables[0].Rows[0]["lTipoEmbarazo"].ToString() == "1")
                        {
                            feto = "<b><u class='dotted'>FETO UNICO:</u> </b><br>";
                            valor = (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "1") ? "Longitudinal" : (lsGinecoObstetra.Tables[0].Rows[0]["lSituacion"].ToString() == "0") ? "Transversal" : "Ninguno";
                            feto = feto + "<b>Situación:  </b>" + valor + "<br>";

                            valor = (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "1") ? "Derecha" : (lsGinecoObstetra.Tables[0].Rows[0]["lPosicion"].ToString() == "0") ? "Izquierda" : "Ninguno";
                            feto = feto + "<b>Posición:  </b>" + valor + "<br>";

                            valor = (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "1") ? "Cefálica" : (lsGinecoObstetra.Tables[0].Rows[0]["lPresentacion"].ToString() == "0") ? "Podálica" : "Ninguno";
                            feto = feto + "<b>Presentación:  </b>" + valor + "<br>";
                        }
                        else
                        {
                            feto = "<table font size=8pt border='1' style='width: 100%'> " +
                                        "<tr><td colspan='4'><b>FETO MULTIPLE</b></td></tr>" +
                                        "<tr><td><b></b></td><td><b>SiPoPr</b></td><td><b>LFC</b></td><td><b>MF</b></td></tr>" +
                                        "<tr><td><b>F01</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF1Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF1Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF01"].ToString() + "</td></tr>" +
                                        "<tr><td><b>F02</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF2Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF2Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF02"].ToString() + "</td></tr>" +
                                        "<tr><td><b>F03</b></td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["dF3Spp"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["lF3Lcf"].ToString() + "</td><td>" + lsGinecoObstetra.Tables[0].Rows[0]["mfF03"].ToString() + "</td></tr>" +
                                    "</table> ";
                        }

                        html.Append(
                            "<div>" +
                                "<div align='center' class='title'> <b>CONSULTA EXTERNA GINECO-OBSTETRICIA</b> - FO-003</div>" +
                                "<br>" +
                                "<table class='table' style='font-size: 12px;'>" +
                                    "<tr>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>Fecha</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>Hora</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>Edad</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>Gesta</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>Paridad</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>FUR</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>FPP</td>" +
                                        "<td  style='background-color: #a9a9a9;' class='td'>Edad Gest</td>" +
                                    "</tr>" +
                                     "<tr>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString() + "</td>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["HoraInicio"].ToString() + "</td>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["tipoEdad"].ToString() + "</td>" +
                                        "<td class='td'>" + ((Int32)(lsAntecedentesObst.Tables[2].Rows[0]["Gestas"]) + 1) + "</td>" +
                                        "<td class='td'>" + lsAntecedentesObst.Tables[2].Rows[0]["P1"].ToString() + " " + lsAntecedentesObst.Tables[2].Rows[0]["P2"].ToString() + " " + lsAntecedentesObst.Tables[2].Rows[0]["P3"].ToString() + " " + lsAntecedentesObst.Tables[2].Rows[0]["P4"].ToString() + "</td>" +
                                        "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["FechaUR"].ToString() + "</td>" +
                                        "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["FechaPP"].ToString() + "</td>" +
                                        "<td class='td'>" + lsEvalEmergencia.Tables[0].Rows[0]["EdadGestacional"].ToString() + " Sem.</td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'> " +
                                    "<tr>" +
                                        "<td class='td' width='100%' colspan='2' style='text-align:center; background-color: #a9a9a9'><b>ANTECEDENTES</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='49%' class='td' style='background-color: #a9a9a9'><b>Familiares:</b></td>" +
                                        "<td width='51%' class='td'  style='background-color: #a9a9a9'><b>Personales:</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='49%' class='td'>" + htmlAntecedentesFamiliares + "</td>" +
                                        "<td width='51%' class='td'>" + htmlAntecedentesPersonales + "</b></td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>MOTIVO DE LA CONSULTA:<b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                         "<td class='td'><u class='dotted'>" + lsAtencion.Tables[0].Rows[0]["CitaMotivo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</u></td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1' > " +
                                    "<tr> " +
                                        "<td width='20%' style='background-color: #a9a9a9' class='td'><b>FUNCIONES VITALES</b></td>" +
                                        "<td width='75%' style='background-color: #a9a9a9' class='td'><b>EXAMEN GENERAL</b></td> " +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='20%' class='td'>" +
                                            "<table style='width:100%; border-collapse: collapse; font-size: 12px;'> " +
                                                "<tr><td width='20%'>T°</td><td style='text-align:right;' width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString() + " C°</td></tr>" +
                                                "<tr><td width='20%'>P. A.</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajePresion"].ToString() + " mm/Hg</td></tr>" +
                                                "<tr><td width='20%'>F. C.</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajeFrecCardiaca"].ToString() + " /min</td></tr>" +
                                                "<tr><td width='20%'>F. R.</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajeFrecRespiratoria"].ToString() + " /min</td></tr>" +
                                                "<tr><td width='20%'>PESO</td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["TriajePeso"].ToString() + " Kg</td></tr>" +
                                                 "<tr><td width='20%'>IMC: </td><td style='text-align:right;'width='80%'>" + lsTriaje.Tables[0].Rows[0]["imc"].ToString() + "</td></tr>" +
                                            "</table> " +

                                        "</td>" +
                                        "<td width='75%' class='td'>" +
                                            "<table style='width:100%; border-collapse: collapse; font-size: 12px;'> " +
                                                "<tr><td><b>General y sensorio:<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lEstadoGeneral"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dEstadoGeneral"].ToString() + " " + lsGinecoObstetra.Tables[0].Rows[0]["dEdemas"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Cardiovascular<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoCV"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoCV"].ToString() + " " + lsGinecoObstetra.Tables[0].Rows[0]["dReflejos"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Abdomen<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAbdomen"].ToString() == "1") ? "Normal" : "NO") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAbdomen"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Respiratorio<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoR"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoR"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Urinario<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAparatoU"].ToString() == "1") ? "Normal" : "Anormal") + " ->" + lsGinecoObstetra.Tables[0].Rows[0]["dAparatoU"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Extremidades<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lExtremidades"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dExtremidades"].ToString() + "</td></tr>" +
                                            " </table> " +
                                         "</td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td width='48%' style='background-color: #a9a9a9' class='td'> <b>EXAMEN OBSTÉTRICO</b></td>" +
                                        "<td width='48%' style='background-color: #a9a9a9' class='td'> <b></b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                         "<td class='td'  width='80%'>" +
                                            "<table class='table1'" +
                                                "<tr>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>AU</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>LCF</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>DU</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>Proteinuria</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>Mov. Fetales</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>Ponderado</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>Pelvis Ginecoide</td>" +
                                                    "<td  style='background-color: #a9a9a9;' class='td'>Compat. Feto-Pelvica</td>" +
                                                "</tr>" +
                                                 "<tr>" +
                                                    "<td class='td'>" + lsGinecoObstetra.Tables[0].Rows[0]["lua"].ToString() + " cm </td>" +
                                                    "<td class='td'>" + lsGinecoObstetra.Tables[0].Rows[0]["llcf"].ToString() + " /min </td>" +
                                                    "<td class='td'>" + lsGinecoObstetra.Tables[0].Rows[0]["ldu"].ToString() + " /10 min </td>" +
                                                    "<td class='td'>" + lsGinecoObstetra.Tables[0].Rows[0]["proteinura"].ToString() + "</td>" +
                                                    "<td class='td'>" + lsGinecoObstetra.Tables[0].Rows[0]["movFetales"].ToString() + "</td>" +
                                                    "<td class='td'>" + lsGinecoObstetra.Tables[0].Rows[0]["lPonderado"].ToString() + "</td>" +
                                                    "<td class='td'>" + pelvisGinecoide + "</td>" +
                                                    "<td class='td'>" + compatibilidadFetoP + "</td>" +
                                                "</tr>" +
                                            " </table> " +
                                         "</td>" +
                                         "<td class='td'  width='20%'>" + feto + "</td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td colspan=2 style='background-color: #a9a9a9' class='td' > <b>EXAMEN GINECOLÓGICO</b></td> " +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td'>" +
                                            "<table class='table1'> " +
                                                "<tr><td><b>GE y BUS:<b/></td><td  width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lGeBus"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dGeBus"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Vagina<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lVagina"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dVagina"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Cérvix<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lCervix"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dCervix"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Útero<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lUtero"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dUtero"].ToString() + "</td></tr>" +
                                            " </table> " +
                                        "</td>" +

                                        "<td class='td'>" +
                                            "<table class='table1'> " +
                                                "<tr><td><b>Anexos<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lAnexos"].ToString() == "1") ? "Normal" : "Anormal") + " ->" + lsGinecoObstetra.Tables[0].Rows[0]["dAnexos"].ToString() + "</td></tr>" +
                                                "<tr><td><b>F.S Douglas<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lDouglas"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dDouglas"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Parametrios<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lParametros"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dParametros"].ToString() + "</td></tr>" +
                                                "<tr><td><b>Mamas<b/></td><td width='80%'>" + ((lsGinecoObstetra.Tables[0].Rows[0]["lMamas"].ToString() == "1") ? "Normal" : "Anormal") + " -> " + lsGinecoObstetra.Tables[0].Rows[0]["dMamas"].ToString() + "</td></tr>" +
                                            " </table> " +
                                        "</td>" +
                                    "</tr>" +
                                "</table>" +


                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td width='50%' style='background-color: #a9a9a9' class='td'><b>DIAGNÓSTICOS</b></td>" +
                                        "<td width='45%' style='background-color: #a9a9a9' class='td'><b>PLAN DE TRABAJO</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width='50%' class='td'>" + diagnosticos + "</td>" +
                                        "<td width='45%' style='vertical-align: text-top;' class='td'>" + lsAtencion.Tables[0].Rows[0]["PlanTrabajo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td style='width: 60%; background-color: #a9a9a9' class='td'><b>TRATAMIENTO</b></td>" +
                                        "<td style='width: 35%; background-color: #a9a9a9' class='td'><b>PRÓXIMA CITA</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td style='vertical-align: text-top;width: 60%' class='td'>" + lsAtencion.Tables[0].Rows[0]["Tratamiento"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                        "<td style='width: 35%' class='td'>" + lsAtencion.Tables[0].Rows[0]["ProximaCita"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td rowspan='2'  style='vertical-align: text-top; width: 60%' class='td'><b>Observaciones Obstetricas:</b>" + lsGinecoObstetra.Tables[0].Rows[0]["DObservaciones"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                        "<td width: 35% class='td'><br><br></td>" +
                                    "</tr>" +
                                    "<tr>" +

                                        "<td style='text-align: center; width: 35%' class='td'><b>FIRMA Y SELLO: </b>" + lsAtencion.Tables[0].Rows[0]["Medico"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table font size=8pt class='table1'>" +
                                    "<tr>" +
                                        "<td width: 70% style='background-color: #a9a9a9' class='td'><b>Nombres y Apellidos del Paciente</b></td>" +
                                        "<td width: 20% style='background-color: #a9a9a9' class='td'><b>Servicio</b></td>" +
                                        "<td width: 10% style='background-color: #a9a9a9' class='td'><b>Historia Clinica</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td width: 70% class='td'>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + "</td>" +
                                        "<td width: 20% class='td'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() + "</td>" +
                                        "<td width: 10% class='td'>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</div>"
                        );



                    }
                    else if (tipoFormato == 0)
                    {
                        //ViewBag.Texto = HttpUtility.HtmlDecode(html);

                        html.Append(
                            "<div  > " +
                                "<div align='center' class='title'> <b>CONSULTA EXTERNA ESPECIALIDADES</b> - FO-013</div>" +

                                "<table class='table1' style='font-size: 12px;'>" +
                                    "<tr>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>FECHA Y HORA DE CITA</b></td>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>FECHA Y HORA DE ATENCIÓN</b></td>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>EDAD</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString() + "  " + lsAtencion.Tables[0].Rows[0]["HoraInicio"].ToString() + "</td>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["FechaEgreso"].ToString() + "  " + lsAtencion.Tables[0].Rows[0]["HoraEgreso"].ToString() + "</td>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["tipoEdad"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>MOTIVO DE LA CONSULTA:</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["CitaMotivo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                    "</tr>" +
                                "</table>" +
                                "<table class='table1'> " +
                                    "<tr><td class='td' colspan='5' style='background-color: #a9a9a9'><b>FUNCIONES BIOLÓGICAS:</b></td></tr>" +
                                    "<tr>" +
                                        "<td class='td' width='20%'><b>APETITO:</b> " + lsAtencion.Tables[0].Rows[0]["apetito"].ToString() + "</td>" +
                                        "<td class='td' width='20%'><b>ORINA:</b> " + lsAtencion.Tables[0].Rows[0]["orina"].ToString() + "</td>" +
                                        "<td class='td' width='20%'><b>SED:</b> " + lsAtencion.Tables[0].Rows[0]["sed"].ToString() + "</td>" +
                                        "<td class='td' width='20%'><b>DEPOSICIONES:</b> " + lsAtencion.Tables[0].Rows[0]["deposiciones"].ToString() + "</td>" +
                                        "<td class='td' width='20%'><b>SUEÑO:</b> " + lsAtencion.Tables[0].Rows[0]["suenio"].ToString() + "</td>" +
                                    "</tr>" +
                                " </table> " +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' colspan='4' style='background-color: #a9a9a9'><b>ANTECEDENTES PERSONALES:</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='10%' style='background-color: #a9a9a9'><b>PATOLOGICOS</b></td><td class='td' width='40%'>" + lsAtencion.Tables[0].Rows[0]["antecedPatologico"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "  </td>" +
                                        "<td class='td' width='10%' style='background-color: #a9a9a9'><b>OBSTÉTRICOS</b></td><td class='td' width='40%'>" + lsAtencion.Tables[0].Rows[0]["antecedObstetrico"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "  </td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='10%' style='background-color: #a9a9a9'><b>QUIRÚRGICOS</b></td><td class='td' width='40%'>" + lsAtencion.Tables[0].Rows[0]["antecedQuirurgico"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "  </td>" +
                                        "<td class='td' width='10%' style='background-color: #a9a9a9'><b>ALERGIAS</b></td><td class='td' width='40%'>" + lsAtencion.Tables[0].Rows[0]["antecedAlergico"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "  </td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='10%' style='background-color: #a9a9a9'><b>OTROS</b></td><td class='td' colspan='3' width='40%'>" + lsAtencion.Tables[0].Rows[0]["antecedentes"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "  </td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>ANTECEDENTES FAMILIARES:</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='10%'>" + lsAtencion.Tables[0].Rows[0]["antecedFamiliar"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "  </td>" +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' colspan='12' style='background-color: #a9a9a9'><b>FUNCIONES VITALES:</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='5.6%' style='background-color: #a9a9a9'><b>T°</b></td>" +
                                        "<td class='td' width='11%'>" + lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString() +
                                        "<td class='td' width='5.6%' style='background-color: #a9a9a9'><b>P.A.</b></td>" +
                                        "</td><td class='td' width='11%'>" + lsTriaje.Tables[0].Rows[0]["TriajePresion"].ToString() +
                                        "<td class='td' width='5.6%' style='background-color: #a9a9a9'><b>F.C.</b></td>" +
                                        "</td><td class='td' width='11%'>" + lsTriaje.Tables[0].Rows[0]["TriajeFrecCardiaca"].ToString() +
                                        "<td class='td' width='5.6%' style='background-color: #a9a9a9'><b>F.R.</b></td>" +
                                        "</td><td class='td' width='11%'>" + lsTriaje.Tables[0].Rows[0]["TriajeFrecRespiratoria"].ToString() +
                                        "<td class='td' width='5.6%' style='background-color: #a9a9a9'><b>PESO</b></td>" +
                                        "</td><td class='td' width='11%'>" + lsTriaje.Tables[0].Rows[0]["TriajePeso"].ToString() +
                                        "<td class='td' width='5.6%' style='background-color: #a9a9a9'><b>IMC</b> </td></b>" +
                                        "</td><td class='td' width='11%'>" + lsTriaje.Tables[0].Rows[0]["imc"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr>" +

                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr> " +
                                    "   <td class='td' style='background-color: #a9a9a9'><b>EXAMEN CLINICO</b></td> " +
                                    "</tr>" +
                                     "<tr>" +
                                        " <td class='td'>" + lsAtencion.Tables[0].Rows[0]["CitaExamenClinico"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td> " +
                                    "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                     "<tr>" +
                                         "<td class='td' width='50%' style='background-color: #a9a9a9'><b>DIAGNOSTICOS</b></td>" +
                                         "<td class='td' width='45%' style='background-color: #a9a9a9'><b>PLAN DE TRABAJO</b></td>" +
                                     "</tr>" +
                                    "<tr>" +
                                         "<td class='td' width='50%'>" + diagnosticos + "</td>" +
                                         "<td class='td' width='45%'  style='vertical-align: text-top;' >" + lsAtencion.Tables[0].Rows[0]["PlanTrabajo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                     "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' style='width: 70%; background-color: #a9a9a9;'><b>TRATAMIENTO</b></td>" +
                                        "<td class='td' rowspan='4' width='25%' ></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' style='vertical-align: text-top; width: 70% ' >" + tramiento + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' style='vertical-align: text-top; width: 70%; background-color: #a9a9a9;' ><b>OTRAS OBSERVACIONES:</b> " + lsAtencion.Tables[0].Rows[0]["citaObservaciones"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + " </td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='25%' ></td>" +
                                    "</tr>" +
                                     "<tr>" +
                                        "<td class='td' style='text-align: left;'width: 25%><b>PRÓXIMA CITA: </b>" + lsAtencion.Tables[0].Rows[0]["ProximaCita"].ToString() + "</td>" +
                                        "<td class='td' style='text-align: center;'width: 25%><b>FIRMA Y SELLO: </b>" + lsAtencion.Tables[0].Rows[0]["Medico"].ToString() + "</td>" +
                                     "</tr>" +
                                "</table>" +

                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' width: 70% style='background-color: #a9a9a9'><b>NOMBRES Y APELLIDOS DEL PACIENTE</b></td>" +
                                        "<td class='td' width: 20% style='background-color: #a9a9a9'><b>Servicio</b></td>" +
                                        "<td class='td' width: 10% style='background-color: #a9a9a9'><b>Historia Clinica</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width: 70%>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + "</td>" +
                                        "<td class='td' width: 20%>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() + "</td>" +
                                        "<td class='td' width: 10%>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</div>"
                        );
                    }
                    else if (tipoFormato == 2)
                    {
                        DataSet lsAntNacimiento;
                        lsAntNacimiento = await daoAtenciones.ListaNinioAltoRiesgoNacimiento(Convert.ToInt32(idAtencion));

                        DataSet lsAntPerinatales;
                        lsAntPerinatales = await daoAtenciones.ListaNinioAltoRiesgoAntecPerinatales(Convert.ToInt32(idAtencion));
                        string hospi = "";
                        hospi = ((lsAntNacimiento.Tables[0].Rows[0]["hospitalizacion"].ToString()) == "1" ? "SI" : "No");

                        string tipoParto = "";
                        tipoParto = ((lsAntPerinatales.Tables[0].Rows[0]["tipoParto"].ToString()) == "1" ? "Eutócito" : "Complicado");

                        DataSet lsAntAlimPatolog;
                        lsAntAlimPatolog = await daoAtenciones.ListaNinioAltoRiesgoAlimentPatologicos(Convert.ToInt32(idAtencion));

                        string tbc, asma, epilepsia, infecciones, hospita, sangre, cirugia, alergia, otros = "";
                        tbc = ((lsAntAlimPatolog.Tables[0].Rows[0]["patTbc"].ToString()) == "1" ? "SI" : "No");
                        asma = ((lsAntAlimPatolog.Tables[0].Rows[0]["patSobaAsma"].ToString()) == "1" ? "SI" : "No");
                        epilepsia = ((lsAntAlimPatolog.Tables[0].Rows[0]["patEpilepsia"].ToString()) == "1" ? "SI" : "No");
                        infecciones = ((lsAntAlimPatolog.Tables[0].Rows[0]["patInfecciones"].ToString()) == "1" ? "SI" : "No");
                        hospita = ((lsAntAlimPatolog.Tables[0].Rows[0]["patHospitalizaciones"].ToString()) == "1" ? "SI" : "No");
                        sangre = ((lsAntAlimPatolog.Tables[0].Rows[0]["patTransferenciaSangre"].ToString()) == "1" ? "SI" : "No");
                        cirugia = ((lsAntAlimPatolog.Tables[0].Rows[0]["patCirugia"].ToString()) == "1" ? "SI" : "No");
                        alergia = ((lsAntAlimPatolog.Tables[0].Rows[0]["patAlergia"].ToString()) == "1" ? "SI" : "No");
                        otros = ((lsAntAlimPatolog.Tables[0].Rows[0]["patOtroAntecedentes"].ToString()) == "1" ? "SI" : "No");

                        html.Append(
                           "<div > " +
                               "<div align='center' class='title'> <b>CONSULTA EXTERNA PEDIATRICA </b> - FN-008</div>" +
                               "<table class='table1'>" +
                                "<tr>" +
                                    "<td class='td' style='background-color: #a9a9a9'><b>FECHA Y HORA DE CITA</b></td>" +
                                    "<td class='td' style='background-color: #a9a9a9'><b>FECHA Y HORA DE ATENCIÓN</b></td>" +
                                    "<td class='td' style='background-color: #a9a9a9'><b>EDAD</b></td>" +
                                "</tr>" +
                                "<tr>" +
                                    "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["FechaIngreso"].ToString() + "  " + lsAtencion.Tables[0].Rows[0]["HoraInicio"].ToString() + "</td>" +
                                    "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["FechaEgreso"].ToString() + "  " + lsAtencion.Tables[0].Rows[0]["HoraEgreso"].ToString() + "</td>" +
                                    "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["tipoEdad"].ToString() + "</td>" +
                                "</tr>" +
                                "</table>" +
                                "<table class='table1'>" +
                                    "<tr class='td'>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>ENFERMEDAD ACTUAL</b></td>" +
                                    "</tr>" +
                                    "<tr class='td'>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["enfermedadActual"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr class='td'>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>TIEMPO DE ENFERMEDAD</b></td>" +
                                    "</tr>" +
                                    "<tr class='td'>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["tiempoEnfermedad"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr class='td'>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>MOTIVO DE CONSULTA</b></td>" +
                                    "</tr>" +
                                    "<tr class='td'>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["CitaMotivo"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                                "<table class='table1'> " +
                                    "<tr ><td class='td' colspan='2' style='background-color: #a9a9a9'><b>FUNCIONES BIOLÓGICAS:</b></td></tr>" +
                                    "<tr  border=1>" +
                                        "<td class='td' width='50%'><b>APETITO:</b> " + lsAtencion.Tables[0].Rows[0]["apetito"].ToString() + "</td>" +
                                        "<td class='td' width='50%'><b>ORINA:</b> " + lsAtencion.Tables[0].Rows[0]["orina"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='50%'><b>SED:</b> " + lsAtencion.Tables[0].Rows[0]["sed"].ToString() + "</td>" +
                                        "<td class='td' width='50%'><b>DEPOSICIONES:</b> " + lsAtencion.Tables[0].Rows[0]["deposiciones"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' colspan='2' width='50%'><b>SUEÑO:</b> " + lsAtencion.Tables[0].Rows[0]["suenio"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table> " +
                                "<table class='table1'>" +
                                    "<tr><td class='td' colspan='7' style='background-color: #a9a9a9'><b>ANTECEDENTES FISIOLOGICOS:</b></td></tr>" +
                                    "<tr>" +
                                        "<td class='td' width='20%'><b>PESO AL NACER:</b> " + lsAntNacimiento.Tables[0].Rows[0]["pesoAlNacer"].ToString() + "</td>" +
                                        "<td class='td' width='10%'><b>TALLA:</b> " + lsAntNacimiento.Tables[0].Rows[0]["tallaAlNacer"].ToString() + "</td>" +
                                        "<td class='td' width='10%'><b>PC:</b> " + lsAntNacimiento.Tables[0].Rows[0]["perimetroCefalico"].ToString() + "</td>" +
                                        "<td class='td' width='10%'><b>PT:</b> " + lsAntNacimiento.Tables[0].Rows[0]["perimetroToracico"].ToString() + "</td>" +
                                        "<td class='td' width='20%'><b>APGAR1:</b> " + lsAntNacimiento.Tables[0].Rows[0]["apgar1min"].ToString() + "</td>" +
                                        "<td class='td' width='20%'><b>APGAR5:</b> " + lsAntNacimiento.Tables[0].Rows[0]["apgar5min"].ToString() + "</td>" +
                                        "<td class='td' width='10%'><b>EG:</b> " + lsAntNacimiento.Tables[0].Rows[0]["estaGestacionalAlNacer"].ToString() + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' colspan='3' width='50%'><b>PARTO:</b> " + tipoParto + "</td>" +
                                        "<td class='td' colspan='4' width='50%'><b>HOSPITALIZACION:</b> " + hospi + " - Tiempo Hosp: " + lsAntNacimiento.Tables[0].Rows[0]["tiempoHospitalizado"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                                "<table class='table1'> " +
                                    "<tr><td class='td' colspan='5' style='background-color: #a9a9a9'><b>ANTECEDENTES PATOLOGICOS:</b></td></tr>" +
                                    "<tr>" +
                                        "<td class='td' width='20%'><b>TBC: </b> " + tbc + "</td>" +
                                        "<td class='td' width='20%'><b>SOBA/ASMA: </b> " + asma + "</td>" +
                                        "<td class='td' width='20%'><b>EPILEPSIA: </b> " + epilepsia + "</td>" +
                                        "<td class='td' width='20%'><b>INFECCIONES: </b> " + infecciones + "</td>" +
                                        "<td class='td' width='20%'><b>HOSPITAL.: </b> " + hospita + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='20%'><b>TRANS. SANGRE: </b> " + sangre + "</td>" +
                                        "<td class='td' width='20%'><b>CIRUGIA:</b> " + cirugia + "</td>" +
                                        "<td class='td' width='30%'><b>ALERGIA MED.: </b> " + alergia + " - " + lsAntAlimPatolog.Tables[0].Rows[0]["patAlergiaDesc"].ToString() + "  </td>" +
                                        "<td class='td' colspan='2'  width='30%'><b>OTROS:</b> " + otros + " - " + lsAntAlimPatolog.Tables[0].Rows[0]["patOtroAntecedentesDesc"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table> " +
                                "<table class='table1'> " +
                                    "<tr><td class='td' colspan='6' style='background-color: #a9a9a9'><b>EXAMEN FISICO:</b></td></tr>" +
                                    "<tr>" +
                                        "<td class='td' width='10%'>T°: " + lsTriaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString() + " C°</td>" +
                                        "<td class='td' width='20%'>P. A.: " + lsTriaje.Tables[0].Rows[0]["TriajePresion"].ToString() + " mm/Hg</td>" +
                                        "<td class='td' width='20%'>F. C.: " + lsTriaje.Tables[0].Rows[0]["TriajeFrecCardiaca"].ToString() + " /min</td>" +
                                        "<td class='td' width='20%'>F. R.: " + lsTriaje.Tables[0].Rows[0]["TriajeFrecRespiratoria"].ToString() + " /min</td>" +
                                        "<td class='td' width='10%'>PESO: " + lsTriaje.Tables[0].Rows[0]["TriajePeso"].ToString() + " Kg </td>" +
                                        "<td class='td' width='15%'>IMC: " + lsTriaje.Tables[0].Rows[0]["imc"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' style='background-color: #a9a9a9'><b>EXAMEN CLINICO</b></td> " +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td'>" + lsAtencion.Tables[0].Rows[0]["CitaExamenClinico"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td> " +
                                    "</tr>" +
                                "</table>" +
                                "<table class='table1'>" +
                                 "<tr>" +
                                     "<td class='td' ><b>Diagnosticos</b></td>" +
                                     "<td class='td' ><b>Plan de Trabajo</b></td>" +
                                 "</tr>" +
                                "<tr>" +
                                     "<td class='td'>" + diagnosticos + "</td>" +
                                     "<td class='td'  style='vertical-align: text-top;' >" + lsAtencion.Tables[0].Rows[0]["PlanTrabajo"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + "</td>" +
                                 "</tr>" +

                                "</table>" +
                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' style='width: 70%;' style='background-color: #a9a9a9'><b>TRATAMIENTO</b></td>" +
                                        "<td class='td' rowspan='4' width='25%' ></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' style='vertical-align: text-top; width: 70% ' >" + tramiento + "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' style='vertical-align: text-top; width: 70% ' style='background-color: #a9a9a9'><b>OTRAS OBSERVACIONES:</b> " + lsAtencion.Tables[0].Rows[0]["citaObservaciones"].ToString().Replace("\r\n", "<br>").Replace("\n", "<br>").Replace("\r", "<br>") + " </td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width='25%' ></td>" +
                                    "</tr>" +
                                        "<tr>" +
                                        "<td class='td' style='text-align: left;'width: 25%><b>PRÓXIMA CITA: </b>" + lsAtencion.Tables[0].Rows[0]["ProximaCita"].ToString() + "</td>" +
                                        "<td class='td' style='text-align: center;'width: 25%><b>FIRMA Y SELLO: </b>" + lsAtencion.Tables[0].Rows[0]["Medico"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                                "<table class='table1'>" +
                                    "<tr>" +
                                        "<td class='td' width: 70% style='background-color: #a9a9a9'><b>Nombres y Apellidos del Paciente</b></td>" +
                                        "<td class='td' width: 20% style='background-color: #a9a9a9'><b>Servicio</b></td>" +
                                        "<td class='td' width: 10% style='background-color: #a9a9a9'><b>Historia Clinica</b></td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td class='td' width: 70%>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + ' ' + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + "</td>" +
                                        "<td class='td' width: 20%>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() + "</td>" +
                                        "<td class='td' width: 10%>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                    "</tr>" +
                                "</table>" +
                           "</div>"
                        );
                    }

                }
            }
            catch (Exception e)
            {
                html.Clear();
                return html.Append("Error " + e);
            }

            return html;
        }
        // end JDELGADO J0
        public static int PosicionValor(int[] Vector, int Posicion)
        {
            //int Posicion = 0;

            for (int Contador = 1; Contador < Vector.Length; Contador++)
            {
                if (Vector[Posicion] > Vector[Contador])
                {
                    Posicion = Contador;
                }
                else
                {
                    Posicion = 0;
                }

            }
            return Posicion;
        }

        public async Task<JsonResult> GeneraPdfYRutaFimaAsync(int idCuentaAtencion, int idProCabecera, int tipoFormato)
        {
            DataSet lsAtencion;
            String idAtencion = "0", nroHistoria;
            bool resultFirma = false;

            StringBuilder html = new StringBuilder();
            DalAtenciones daoAtenciones = new DalAtenciones();
            UtilitarioController utilitario = new UtilitarioController();


            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
            nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

            if (lsAtencion.Tables[0].Rows.Count == 0)
            {
                ViewBag.Texto = HttpUtility.HtmlDecode("No tiene atencion");
                ViewBag.Titulo = "No tiene atencion";
                ViewBag.nroFormato = "0000";
            }
            else
            {
                try
                {
                    string tipo = "CE-A";
                    html = await GeneraAtencionHTML2(idCuentaAtencion, idProCabecera, tipoFormato); // JDELGADO J0 CAMBIO FUNCION A HTML2

                    resultFirma = await utilitario.GuardarArchivo(
                        nroHistoria + "/ConsultaExterna/" + idCuentaAtencion + "/Atenciones", (lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"),
                        html, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()), tipo);

                }
                catch (Exception e)
                {
                    return Json(new { estadoCreacion = "False", ruta = "path", exep = e.ToString(), resulfirma = resultFirma });
                }
            }
            return Json(new { estadoCreacion = "OK", ruta = "path", resulfirma = resultFirma });
        }
        public async Task<ActionResult> ParteDiarioPdfSinFirma(int programacion)
        {
            try
            {
                StringBuilder html = new StringBuilder();
                html = await GeneraParteDiarioHTML(programacion);
                var stream = GeneraPdfMemoy(html, 0);
                return stream;
            }
            catch (Exception e)
            {
                return Json(new { error = e.ToString() });
            }
        }
        public async Task<ActionResult> AtencionPdfSinFirma(int idCuentaAtencion, int idProCabecera, int tipoFormato)
        {
            try
            {
                StringBuilder html = new StringBuilder();
                html = await GeneraAtencionHTML2(idCuentaAtencion, idProCabecera, tipoFormato); // JDELGADO J0 CAMBIO FUNCION A HTML2
                var stream = GeneraPdfMemoy(html, 1);
                return stream;
            }
            catch (Exception e)
            {
                return Json(new { error = e.ToString() });
            }
        }

        public async Task<ActionResult> HospGineObstetrsPdfSinFirma(int idCuentaAtencion, int idItem, int idServicio)
        {
            try
            {
                StringBuilder html = new StringBuilder();
                html = await GeneraHosGinecoObsHTML(idCuentaAtencion, idItem, idServicio);
                var stream = GeneraPdfMemoy(html, 1); // JDELGADO010
                return stream;
            }
            catch (Exception e)
            {
                return Json(new { error = e.ToString() });
            }
        }

        public async Task<ActionResult> ImprimeRecetas(int idCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia;

            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();

            string idAtencion = "0";

            strRx = "(Rayos X)";
            strEcoGene = "(Ecografia General)";
            strEcoObs = "(Ecografia Obstetrica)";
            strAnaPatolo = "(Anatomia Patologica)";
            strPatoloClinica = "(Patologica Clinica)";
            strBs = "(Banco de Sangre)";
            strFarmacia = "(Farmacia)";
            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = await daoRecetas.ListaRecetasCabeceraIdCuentaAtencion(idCuentaAtencion); // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono

            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna); // JDELGADO J0 AWAIT SENTENCE

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                //strBs = strBs + dr["Producto"].ToString() + "<br>";

                //Rayos X
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
                {
                    strRx = strRx + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strRx = strRx + drD["Producto"].ToString() + "<br>";
                    }
                }

                //eco obste
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
                {
                    strEcoObs = strEcoObs + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strEcoObs = strEcoObs + drD["Producto"].ToString() + "<br>";
                    }
                }

                //eco geenral
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
                {
                    strEcoGene = strEcoGene + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strEcoGene = strEcoGene + drD["Producto"].ToString() + "<br>";
                    }
                }

                //patoclini
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
                {
                    strPatoloClinica = strPatoloClinica + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strPatoloClinica = strPatoloClinica + drD["Producto"].ToString() + "<br>";
                    }
                }

                //anatalomiaPa
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
                {
                    strAnaPatolo = strAnaPatolo + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strAnaPatolo = strAnaPatolo + drD["Producto"].ToString() + "<br>";
                    }
                }

                //sangre
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
                {
                    strBs = strBs + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strBs = strBs + drD["Producto"].ToString() + "<br>";
                    }
                }

                //farmacia
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    strFarmacia = strFarmacia + "Nro. Receta:" + dr["idReceta"].ToString() + "<hr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        strFarmacia = strFarmacia + drD["Producto"].ToString() + "<br>";
                    }
                }

            }
            ;

            HtmlToPdf ohtml = new HtmlToPdf();
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(strRx);

            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            //ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );
        }


        public async Task<ActionResult> ImprimeRecetasByIdReceta(int idCuentaAtencion, int idReceta)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String htmlTablaDetalle, htmlTablaItem, telefono, nombre, direccion, html;
            html = "";
            htmlTablaItem = "";

            bool farmaciaHospi = false;
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            string idAtencion = "0";


            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = await daoRecetas.ListaRecetaCabeceraById2(idReceta); // JDELGADO J0 AWAIT SENTENCE



            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>" + nombre + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>" + direccion + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Orden Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            String hmtlCabeceraFarmacia = "";
            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
               "           <table font size=8pt  width='100%' >" +
               "               <tr>" +
               "                   <td align='center'> <b>" + nombre + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>" + direccion + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "           </table>";

            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
                "           <table font size=8pt  width='100%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Receta Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();




            string fechaRecetaAux = "";
            //Substring(0, 10);

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                fechaRecetaAux = dr["fechaReceta"].ToString();
                fechaRecetaAux = fechaRecetaAux.Substring(0, 10);
                if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "3" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "4"))
                {
                    html = "";
                    html = html + "<table width='100%' ><tr><td width='50%'>" + hmtlCabeceraFarmacia + "</td><td width='50%'>" + hmtlCabeceraFarmacia + "</td></tr></table>";
                    html = html + "<table  width='100%'>" +
                                    "<tr>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Tipo Plan: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() + " -  <b>Edad:</b> " + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " - <b>Cuenta: </b>" + idCuentaAtencion + " </td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "</tr>" +
                                  "</table>";
                }
                else
                {
                    html = html + "<br>" +
                 "           <table font size=8pt  width='40%' style='font - size:8px' >" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Fecha Aten.:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + fechaRecetaAux +
                 "                   </td>" +
                 "               </tr>" +
                 //RQ0006 RMOREANOC
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro.Historia:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 //FIN RQ0006
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Cuenta:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + idCuentaAtencion +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Orden:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["idReceta"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Consultorio:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Prof. Salud:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["Medico"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Paciente:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Tipo Plan:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "           </table><br>";
                }


                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Rayos X)" + "Nro.Receta:" + dr["idReceta"].ToString() + " <hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco obste
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia Obstetrica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco geenral
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
                {

                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia General)<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //patoclini
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Patologica Clinica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //anatalomiaPa
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Anatomia Patologica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td  align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //sangre
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Banco de Sangre)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //interconsulta añadido por jdelgado011
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Interconsulta)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta); // JDELGADO011
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //farmacia
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    //if (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3")
                    if ((lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "2" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "4"))
                    {
                        farmaciaHospi = false;
                        html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Farmacia)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cant.</td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                    }
                    else
                    {
                        farmaciaHospi = true;

                        html = html + "<table>";
                        //html = html + "&nbsp;<b> Nro.Receta: </b>" + dr["idReceta"].ToString() + "<br>";
                        //html = html + "&nbsp;<b> Receta del Servicio: </b>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "";
                        html = html + "<tr><td width='100px'><b> Nro.Receta: </b></td><td>" + dr["idReceta"].ToString() + "<br></td></tr>";
                        html = html + "<tr><td width='100px'><b> Rec. del Serv.: </b></td><td>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "</td></tr>";
                        html = html + "</table>";

                        htmlTablaItem = "<table FRAME='hsides' RULES='rows'>";
                        htmlTablaItem = htmlTablaItem + "<tr><td></td><td><b>Concepto</b></td><td><b>Cant.</b></td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                        htmlTablaItem = htmlTablaItem + "</table><br><br><br><br>";
                        htmlTablaItem = htmlTablaItem + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                    }
                }
            }
            ;

            string htmlDosisFamr;
            htmlDosisFamr = "";
            //RQ0003 RMOREANOC
            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' ><tr><td align='center'> <b>INDICACIONES</b></td></tr></table>";
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' >";
                    htmlDosisFamr = htmlDosisFamr + "<tr><td width='5%'></td><td><b>Concepto</b></td><td align='center'><b>Dosis</b></td><td align='center'><b>Vias</b></td><td align='center'><b>Frecuencia</b></td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlDosisFamr = htmlDosisFamr + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["Dosis"].ToString() + "</td>" + "<td align = 'center'>" + drD["Vias"].ToString() + "</td>" + "<td align = 'center'>" + drD["Observaciones"].ToString() + "</td></tr>";
                    }
                    htmlDosisFamr = htmlDosisFamr + "</table><br><br><br>";
                    htmlDosisFamr = htmlDosisFamr + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                }
            }
            ;
            //RQ0003 RMOREANO 
            if (farmaciaHospi)
            {
                htmlTablaDetalle = "<table font size=8pt width='100%' style='font - size:8px'>" +
                                    " <tr><td width='50%' valign='top' >" + htmlTablaItem + "</td> <td width='50%' valign='top'>" + htmlDosisFamr + "</td></tr>" +
                                    " </table>";
            }
            else
            {
                htmlTablaDetalle = "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td >" + htmlTablaItem + "</td></tr></table>";
                htmlTablaDetalle = htmlTablaDetalle + "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td>" + htmlDosisFamr + "</td></tr></table>";
            }
            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico); // JDELGADO J0 AWAIT SENTENCE

            string htmldiagnosticosDetalle = "";
            string htmldiagnosticostable = "";

            foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
            {
                htmldiagnosticosDetalle = htmldiagnosticosDetalle + "<tr><td>" + dr["codigoCIE10"].ToString() + "</td><td>" + dr["descripcion"].ToString() + "</td></tr>";

            }
            ;
            if (farmaciaHospi)
            {
                htmldiagnosticostable = htmldiagnosticostable + "<hr><b>Diagnositicos</b>";
                htmldiagnosticostable = htmldiagnosticostable + "<table width='50%'><tr><td><b>CIE 10</b></td><td><b>Descripcion</b></td></tr>" + htmldiagnosticosDetalle + "</table><br>";
            }
            else
            {
                htmldiagnosticostable = htmldiagnosticostable + "";
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            html = html + htmldiagnosticostable + htmlTablaDetalle + " <br><b>Usuario WEB:" + idUsuario + "</b>";

            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;
            HtmlToPdf ohtml = new HtmlToPdf();
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );
        }

        // JDELGADO J0 CREAR METODO FIRMAR RECETA
        public async Task<ActionResult> FirmaRecetasByIdReceta(int idCuentaAtencion, int idReceta)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String htmlTablaDetalle, htmlTablaItem, telefono, nombre, direccion, html;
            html = "";
            htmlTablaItem = "";

            bool farmaciaHospi = false;
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();

            lsParametros = daoParametros.SeleccionaFilaParametro(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = daoParametros.SeleccionaFilaParametro(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = daoParametros.SeleccionaFilaParametro(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            string idAtencion = "0";

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = daoRecetas.ListaRecetaCabeceraById(idReceta);

            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>" + nombre + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>" + direccion + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Orden Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            String hmtlCabeceraFarmacia = "";
            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
               "           <table font size=8pt  width='100%' >" +
               "               <tr>" +
               "                   <td align='center'> <b>" + nombre + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>" + direccion + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "           </table>";

            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
                "           <table font size=8pt  width='100%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Receta Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();

            string fechaRecetaAux = "";
            //Substring(0, 10);

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                fechaRecetaAux = dr["fechaReceta"].ToString();
                fechaRecetaAux = fechaRecetaAux.Substring(0, 10);
                if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "3")
                {
                    html = "";
                    html = html + "<table width='100%' ><tr><td width='50%'>" + hmtlCabeceraFarmacia + "</td><td width='50%'>" + hmtlCabeceraFarmacia + "</td></tr></table>";
                    html = html + "<table  width='100%'>" +
                                    "<tr>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='17%'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Tipo Plan: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() + " -  <b>Edad:</b> " + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " - <b>Cuenta: </b>" + idCuentaAtencion + " </td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='17%'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "</tr>" +
                                  "</table>";
                }
                else
                {
                    html = html + "<br>" +
                 "           <table font size=8pt  width='40%' style='font - size:8px' >" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Fecha Aten.:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + fechaRecetaAux +
                 "                   </td>" +
                 "               </tr>" +
                 //RQ0006 RMOREANOC
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro.Historia:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 //FIN RQ0006
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Cuenta:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + idCuentaAtencion +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Orden:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["idReceta"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Consultorio:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Prof. Salud:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["Medico"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Paciente:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Tipo Plan:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "           </table><br>";
                }

                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Rayos X)" + "Nro.Receta:" + dr["idReceta"].ToString() + " <hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco obste
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia Obstetrica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco geenral
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia General)<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //patoclini
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Patologica Clinica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //anatalomiaPa
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Anatomia Patologica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td  align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //sangre
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Banco de Sangre)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }
                //farmacia

                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    if (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3")
                    {
                        farmaciaHospi = false;
                        html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Farmacia)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cant.</td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                    }
                    else
                    {
                        farmaciaHospi = true;

                        html = html + "<table>";
                        //html = html + "&nbsp;<b> Nro.Receta: </b>" + dr["idReceta"].ToString() + "<br>";
                        //html = html + "&nbsp;<b> Receta del Servicio: </b>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "";
                        html = html + "<tr><td width='100px'><b> Nro.Receta: </b></td><td>" + dr["idReceta"].ToString() + "<br></td></tr>";
                        html = html + "<tr><td width='100px'><b> Rec. del Serv.: </b></td><td>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "</td></tr>";
                        html = html + "</table>";
                        //html = html + "&nbsp;<b> Nro.Receta: </b>" + dr["idReceta"].ToString() + "<br>";
                        //html = html + "&nbsp;<b> Receta del Servicio: </b>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "";

                        htmlTablaItem = "<table FRAME='hsides' RULES='rows'>";
                        htmlTablaItem = htmlTablaItem + "<tr><td></td><td><b>Concepto</b></td><td><b>Cant.</b></td></tr>"; // JDELGADO J0 AWAIT SENTENCE
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia);
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                        htmlTablaItem = htmlTablaItem + "</table><br><br><br><br>";
                        htmlTablaItem = htmlTablaItem + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";

                    }
                }
            }
            ;

            string htmlDosisFamr;
            htmlDosisFamr = "";
            //RQ0003 RMOREANOC
            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' ><tr><td align='center'> <b>INDICACIONES</b></td></tr></table>";
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' >";
                    htmlDosisFamr = htmlDosisFamr + "<tr><td width='5%'></td><td><b>Concepto</b></td><td align='center'><b>Dosis</b></td><td align='center'><b>Vias</b></td><td align='center'><b>Frecuencia</b></td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlDosisFamr = htmlDosisFamr + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["Dosis"].ToString() + "</td>" + "<td align = 'center'>" + drD["Vias"].ToString() + "</td>" + "<td align = 'center'>" + drD["Observaciones"].ToString() + "</td></tr>";
                    }
                    htmlDosisFamr = htmlDosisFamr + "</table><br><br><br>";
                    htmlDosisFamr = htmlDosisFamr + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                }
            }
            ;
            //RQ0003 RMOREANO 
            if (farmaciaHospi)
            {
                htmlTablaDetalle = "<table font size=8pt width='100%' style='font - size:8px'>" +
                                    " <tr><td width='50%' valign='top' >" + htmlTablaItem + "</td> <td width='50%' valign='top'>" + htmlDosisFamr + "</td></tr>" +
                                    " </table>";
            }
            else
            {
                htmlTablaDetalle = "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td >" + htmlTablaItem + "</td></tr></table>";
                htmlTablaDetalle = htmlTablaDetalle + "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td>" + htmlDosisFamr + "</td></tr></table>";
            }
            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico); // JDELGADO J1 AWAIT SENTENCE

            string htmldiagnosticosDetalle = "";
            string htmldiagnosticostable = "";

            foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
            {
                htmldiagnosticosDetalle = htmldiagnosticosDetalle + "<tr><td>" + dr["codigoCIE10"].ToString() + "</td><td>" + dr["descripcion"].ToString() + "</td></tr>";

            }
            ;
            if (farmaciaHospi)
            {
                htmldiagnosticostable = htmldiagnosticostable + "<hr><b>Diagnositicos</b>";
                htmldiagnosticostable = htmldiagnosticostable + "<table width='50%'><tr><td><b>CIE 10</b></td><td><b>Descripcion</b></td></tr>" + htmldiagnosticosDetalle + "</table><br>";
            }
            else
            {
                htmldiagnosticostable = htmldiagnosticostable + "";
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            html = html + htmldiagnosticostable + htmlTablaDetalle + " <br><b>Usuario WEB:" + idUsuario + "</b>";

            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;
            HtmlToPdf ohtml = new HtmlToPdf();
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

            byte[] pdf = obPdfDoc.Save();
            StringBuilder sb = new StringBuilder();
            sb.Append(html);

            JsonResult rutaSync = await GeneraPdfYRutaFimaOtrosModulosAsync(idCuentaAtencion, 1, sb, idReceta);

            Console.WriteLine("rutaSync");
            Console.WriteLine(rutaSync.Value);

            return rutaSync;
        }
        // END JDELGADO J0 CREAR METODO FIRMAR RECETA

        // JDELGADO J0 CREAR METODO RETORNAR RECETAS CON FIRMA
        //public async Task<ActionResult> GetRecetasByIdReceta(int idCuentaAtencion, int idReceta)
        public ActionResult GetRecetasByIdReceta(int idCuentaAtencion, int idReceta)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }


            DataSet lsRecetas;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();



            lsRecetas = daoRecetas.ListaRecetaCabeceraById(idReceta);


            JsonResult json = Json(new { data = lsRecetas });

            Console.WriteLine("rutaSync");
            Console.WriteLine(json);

            return json;
        }






        [HttpPost]
        public async Task<ActionResult> MovimientosFarmaciaPorIdPaciente(int idPaciente, int orden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsMovFarmacia;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsMovFarmacia = await dalAtenciones.MovimientosFarmaciaPorIdPaciente(idPaciente, orden);
            return Json(lsMovFarmacia);

        }



        // JDELGADO J0 CREAR METODO RETORNAR RECETAS CON FIRMA
        [HttpPost]
        public async Task<ActionResult> AtencionesXidPaciente(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsAtenciones;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsAtenciones = await dalAtenciones.AtencionesXidPaciente(idPaciente);
            return Json(lsAtenciones);

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesDiagnosticosSeleccionarXidAtencion(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsDiagnosticos;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsDiagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarXidAtencion(idAtencion);
            return Json(lsDiagnosticos);

        }

        [HttpPost]
        public ActionResult DevolverEdadGestacional(DateTime FechaCita, DateTime Fecha, int SemanasEco, int DiasEco, int Tipo)
        {
            DateTime FechaActual = FechaCita;
            DateTime FechaPP = Fecha.AddDays(280);
            decimal Sem = 0;
            int cantDiasSemana = 0;
            int Cantdias = 0;
            int Dias = 0;
            DateTime FUM;
            if (Tipo == 1)
            {
                Cantdias = (FechaActual - Fecha).Days;
                Sem = (Cantdias / 7);
                cantDiasSemana = Convert.ToInt32(Math.Floor(Sem) * 7);
                Dias = Cantdias - cantDiasSemana;
                FUM = Fecha;

            }
            else
            {
                Cantdias = (FechaActual - Fecha).Days;

                Cantdias = Cantdias + (SemanasEco * 7) + DiasEco;
                Sem = (Cantdias / 7);
                cantDiasSemana = Convert.ToInt32(Math.Floor(Sem) * 7);
                Dias = Cantdias - cantDiasSemana;
                FUM = FechaActual.AddDays(-Cantdias);
                FechaPP = FUM.AddDays(280);

            }

            return Json(new { fum = FUM.ToString("dd/MM/yyyy"), CantSemanas = Math.Floor(Sem), CantDias = Dias, fpp = FechaPP.ToString("dd/MM/yyyy") });

        }

        [HttpPost]
        public async Task<ActionResult> ListaProCabeceraYControlByIdAtn(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsProCabYContr;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsProCabYContr = await dalAtenciones.ListaProCabeceraYControlByIdAtn(idAtencion);
            return Json(lsProCabYContr);

        }

        [HttpPost]
        public async Task<ActionResult> ListaProCabecera(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsProCabYContr;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsProCabYContr = await dalAtenciones.ListaProCabecera(idPaciente);
            return Json(lsProCabYContr);

        }

        [HttpPost]
        public async Task<ActionResult> ProCabeceraPorPacienteSeleccionar(int idPaciente)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalAtenciones dal = new DalAtenciones();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ProCabeceraPorPacienteSeleccionar(idPaciente);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ListaEvaluacionEmergencia(int IdAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsProCabYContr;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsProCabYContr = await dalAtenciones.ListaEvaluacionEmergencia(IdAtencion);
            return Json(lsProCabYContr);

        }

        [HttpPost]
        public async Task<ActionResult> EvaluacionObstetricaSeleccionar(int idAtencion)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalAtenciones dal = new DalAtenciones();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.EvaluacionObstetricaSeleccionar(idAtencion);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ListaAntecedentesPaciente(int idPaciente, int idProCabecera)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalAtenciones dal = new DalAtenciones();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListaAntecedentesPaciente(idPaciente, idProCabecera);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> AntecedentesXidCabecera(int idProCabecera)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsAntecedentes;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsAntecedentes = await dalAtenciones.ListarAntecendesxIdCabecera(idProCabecera);
            return Json(lsAntecedentes);

        }

        [HttpPost]
        public async Task<ActionResult> ListaGinecoObstetra(int IdAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsGinecoObs;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsGinecoObs = await dalAtenciones.ListaGinecoObstetra(IdAtencion);
            return Json(lsGinecoObs);

        }

        [HttpPost]
        public async Task<ActionResult> ListaTipoDeEmbarazo()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsTiposEmb;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsTiposEmb = await dalAtenciones.ListaTipoDeEmbarazo();
            return Json(lsTiposEmb);

        }

        [HttpPost]
        public async Task<ActionResult> ListaCatalogoCombo(int idCatalogo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsCatalogo;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsCatalogo = await dalAtenciones.ListaCatalogoCombo(idCatalogo);
            return Json(lsCatalogo);

        }

        [HttpPost]
        public ActionResult ListaTriaje(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsTriaje;
            DalTriaje dal = new DalTriaje();
            lsTriaje = dal.ListaTriaje(idAtencion);
            return Json(new { estado = true, tipo = 1, msj = "correcto", data = lsTriaje });

        }

        [HttpPost]
        public async Task<ActionResult> ListaControlesByidCabecera(int idCabecera)
        {
            DataSet lsControles;
            DalAtenciones dalAtenciones = new DalAtenciones();
            lsControles = await dalAtenciones.ListaControlesByidCabecera(idCabecera);
            return Json(lsControles);
        }

        [HttpPost]
        public ActionResult ListadoPesoMaternoPercentil(int idProCabecera)
        {
            DataSet lstCitas;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCitas = daoCitas.ObtenerPercentilPesoxPaciente(idProCabecera);
            return Json(lstCitas);
        }

        [HttpPost]
        public ActionResult ListadoAUMaternoPercentil(int idProCabecera)
        {
            DataSet lstCitas;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCitas = daoCitas.ObtenerPercentilAlturaUterinaxPaciente(idProCabecera);
            return Json(lstCitas);
        }

        [HttpPost]
        public async Task<ActionResult> ListaAtencionEstadosCompletosByIdCuenta(int idCuenta)
        {
            DataSet lstCuenta;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCuenta = await daoCitas.ListaAtencionEstadosCompletosByIdCuenta(idCuenta);
            return Json(lstCuenta);
        }

        [HttpPost]
        public async Task<ActionResult> AtencionesEstanciaHospitalariaPorIdCuenta(int idCuenta)
        {
            DataSet lstCuenta;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCuenta = await daoCitas.AtencionesEstanciaHospitalariaPorIdCuenta(idCuenta);
            return Json(lstCuenta);
        }

        [HttpPost]
        public ActionResult validaFechaMayor(DateTime fecha1, DateTime fecha2)
        {
            Boolean valor = false;
            if (fecha1 > fecha2)
            {
                valor = true;
            }
            else
            {
                valor = false;
            }

            return Json(new { resultado = valor });
        }

        // RMOREANO RQ002
        [HttpGet]
        public async Task<ActionResult> ListarTiposConsulta()
        {
            DataSet lstConsulta;
            DalUtilitario daoCitas = new DalUtilitario();
            lstConsulta = await daoCitas.DevuelveDSCombo("web_ListarTiposConsultas");
            return Json(lstConsulta);
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

        public async void status(ClasesFirma.ResultUpload f, int idCuentaAtencion, string tipo)
        {
            Console.WriteLine("estado del Archivo Firmado");
            var client = new HttpClient();
            var json = JsonConvert.SerializeObject(f);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("http://digital-signature-client-side.us-east-1.elasticbeanstalk.com/api/getstatus", content);
            string idDoc = "";
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

                //DownloadFiles(new ClasesFirma.ResultUpload { code = resultUpload.code, documentId = idDoc });
                DalUtilitario dl = new DalUtilitario();
                await dl.InsertaFirma(resultUpload.signUrl, resultUpload.code, idDoc, idCuentaAtencion, idCuentaAtencion, tipo, "U", resultUpload.status, "");
            }
        }

        public async void DownloadFiles(ClasesFirma.ResultUpload f)
        {
            Console.WriteLine("Descargar Archivo Firmado");
            var client = new HttpClient();
            var json = JsonConvert.SerializeObject(f);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await client.PostAsync("http://digital-signature-client-side.us-east-1.elasticbeanstalk.com/api/getsigneddocument", content);
            MemoryStream ms = new MemoryStream();
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Devolviendo archivo en Archivo Firmado ");
                var b = await response.Content.ReadAsByteArrayAsync();
                String path = @"D://demo4firmado.pdf";//se guarda con la extension requerida!
                System.IO.File.WriteAllBytes(path, b);
                Console.WriteLine("el archivo se guardo en :" + path);
                ms = new MemoryStream();
                ms.Write(b, 0, b.Length);
                ms.Position = 0;

            }

        }

        public string GenerarPDf(StringBuilder html, string sWebRootFolder, int orientacion)
        {
            try
            {
                HtmlToPdf ohtml = new HtmlToPdf();
                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                PdfPageOrientation pdfOrientationLandscape = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Landscape", true);

                if (orientacion == 1)
                {
                    ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                }
                else
                {
                    ohtml.Options.PdfPageOrientation = pdfOrientationLandscape;
                }


                ohtml.Options.PdfPageSize = pageSize;

                SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());

                obPdfDoc.Save(sWebRootFolder);


                return "Ok";
            }
            catch (Exception e)
            {
                return e.ToString();
            }


        }

        public FileStreamResult GeneraPdfMemoy(StringBuilder html, int orientacion)
        {

            HtmlToPdf ohtml = new HtmlToPdf();
            PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

            PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
            PdfPageOrientation pdfOrientationLandscape = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Landscape", true);

            if (orientacion == 1)
            {
                ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
            }
            else
            {
                ohtml.Options.PdfPageOrientation = pdfOrientationLandscape;
            }


            ohtml.Options.PdfPageSize = pageSize;
            ohtml.Options.MarginBottom = 50; // JDELGADO010
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());

            byte[] pdf = obPdfDoc.Save();

            MemoryStream ms = new MemoryStream();
            ms = new MemoryStream();
            ms.Write(pdf, 0, pdf.Length);
            ms.Position = 0;

            obPdfDoc.Close();

            return new FileStreamResult(
                    ms,
                    MediaTypeNames.Application.Pdf
                );

            //iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4, 25, 25, 45, 20);
            //MemoryStream ms = new MemoryStream();

            //if (orientacion == 1) //1=vertical, 0= horizontal
            //{
            //    doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4, 25, 25, 45, 20);
            //}
            //else
            //{
            //    doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4.Rotate(), 25, 25, 45, 20);

            //}

            //iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, ms);
            //doc.Open();
            //iTextSharp.text.html.simpleparser.HtmlWorker hw = new iTextSharp.text.html.simpleparser.HtmlWorker(doc);
            //try
            //{
            //    iTextSharp.text.html.simpleparser.StyleSheet style = new iTextSharp.text.html.simpleparser.StyleSheet();
            //    style.LoadStyle("border", "border-bottom", "2px");

            //    hw.Parse(new StringReader(html.ToString()));
            //}
            //catch (Exception e)
            //{
            //    hw.Close();
            //    doc.Close();
            //    writer.Close();

            //}
            //finally
            //{
            //    hw.Close();
            //    doc.Close();
            //    writer.Close();
            //}

            //ms.Position = 0;


            //return new FileStreamResult(
            //    ms,
            //    MediaTypeNames.Application.Pdf
            //);

        }

        //////////////////KHOYOSI//////////////////
        [HttpPost]
        public async Task<ActionResult> ModificarTriajeEmgHosp(Triaje objtriaje)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            Boolean resp;
            DalTriaje dal = new DalTriaje();
            int idUsuario;

            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            objtriaje.idUsuario = idUsuario;
            resp = await dal.InsertaTriajeHospEmeg(objtriaje);
            return Json(new { respTriaje = resp, estado = true, session = true });

        }
        //////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ListaTriajeEmgHosp(Triaje objtriaje)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsTriaje;
            DalTriaje dal = new DalTriaje();
            lsTriaje = await dal.ListaTriajeEmgHosp(objtriaje);
            return Json(lsTriaje);

        }

        [HttpPost]
        public async Task<ActionResult> ListaTriajeNotaObstetricia(Triaje objtriaje)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsTriaje;
            DalTriaje dal = new DalTriaje();
            lsTriaje = await dal.ListaTriajeNotaObstetricia(objtriaje);
            return Json(lsTriaje);

        }

        //Ninio Sano - Lista tablas de antecedentes

        [HttpPost]
        public async Task<ActionResult> ListaNinioAltoRiesgoAlimentPatologicos(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAtencionsCE = await daoAtenciones.ListaNinioAltoRiesgoAlimentPatologicos(idAtencion);
            return Json(new { session = true, lsNinioAlimenPto = lsAtencionsCE });
        }

        public async Task<ActionResult> ListaNinioAltoRiesgoAntecPerinatales(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAtencionsCE = await daoAtenciones.ListaNinioAltoRiesgoAntecPerinatales(idAtencion);
            return Json(new { session = true, lsNinioAntecePer = lsAtencionsCE });
        }

        public async Task<ActionResult> ListaNinioAltoRiesgoNacimiento(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAtencionsCE = await daoAtenciones.ListaNinioAltoRiesgoNacimiento(idAtencion);
            return Json(new { session = true, lsNinioNacimiento = lsAtencionsCE });
        }

        public async Task<ActionResult> ListaNinioAltoRiesgoVivienda(int idAtencion)
        {
            DataSet lsAtencionsCE;
            DalAtenciones daoAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lsAtencionsCE = await daoAtenciones.ListaNinioAltoRiesgoVivienda(idAtencion);
            return Json(new { session = true, lsNinioRiesgoVivienda = lsAtencionsCE });
        }

        public async Task<ActionResult> AtenInteItemDesarrolloPacientePendiente(AtenIntePlanIntePaciente obj)
        {
            DataSet lst;
            DalAtenciones daoAtenciones = new DalAtenciones();
            obj.idAtenInteGrupo = 1;
            obj.idAtenInteItemPlan = 3;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lst = await daoAtenciones.AtenInteItemDesarrolloPacientePendiente(obj);
            return Json(new { session = true, lst = lst });
        }

        public async Task<ActionResult> AtenInteListarDesarrolloPacientePendientesDet(AtenIntePlanIntePaciente obj)
        {
            DataSet lst;
            DalAtenciones daoAtenciones = new DalAtenciones();
            obj.idAtenInteGrupo = 1;
            obj.idAtenInteItemPlan = 3;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lst = await daoAtenciones.AtenInteListarDesarrolloPacientePendientesDet(obj);
            return Json(new { session = true, lst = lst });
        }



        public async Task<ActionResult> AtenInteListarDesarrolloPacienteDetPorId(AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente)
        {
            DataSet lst;
            DalAtenciones daoAtenciones = new DalAtenciones();
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lst = await daoAtenciones.AtenInteListarDesarrolloPacienteDetPorId(objAtenIntePlanDesarrolloPaciente);
            return Json(new { session = true, lst = lst });
        }

        public async Task<ActionResult> Insert_AtenItenEvalPlnPendiente(string listaItmsEValuar, AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            Boolean respninio = false;
            DalAtenciones daoAtenciones = new DalAtenciones();
            var lstItems = JsonConvert.DeserializeObject<List<AtenIntePlanDesPacienteDet>>(listaItmsEValuar);

            try
            {
                respninio = await daoAtenciones.Insert_Update_AtenIntePlanDesarrolloPaciente(objAtenIntePlanDesarrolloPaciente);
                respninio = await daoAtenciones.Insert_AtenIntePlanDesPacienteDet(objAtenIntePlanDesarrolloPaciente.idPlanDesarrolloPaciente, objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente, lstItems);
                return Json(new { session = true, resp = true, mensaje = "Se registro correctamente" });
            }
            catch (Exception e)
            {
                return Json(new { session = true, resp = false, mensaje = e.ToString() });
            }


        }

        public async Task<ActionResult> AtenInteGenerarPlanTotal(AtenIntePlanDesarrolloPaciente objAtenIntePlanDesarrolloPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            Boolean respninio = false;
            DalAtenciones daoAtenciones = new DalAtenciones();
            try
            {
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                objAtenIntePlanDesarrolloPaciente.idPlanIntegralPaciente = 0;
                objAtenIntePlanDesarrolloPaciente.idUsuario = idUsuario;
                respninio = await daoAtenciones.AtenInteGenerarPlanTotal(objAtenIntePlanDesarrolloPaciente);
                return Json(new { session = true, resp = true, mensaje = "Se registro correctamente" });
            }
            catch (Exception e)
            {
                return Json(new { session = true, resp = false, mensaje = e.ToString() });
            }


        }

        public async Task<ActionResult> ListaEvaluacionEmergenciaDetalle(EvaluacionEmergenciaDetalle obj)
        {
            DataSet lst;
            DalAtenciones daoAtenciones = new DalAtenciones();
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            lst = await daoAtenciones.ListaEvaluacionEmergenciaDetalle(obj);
            return Json(new { session = true, lst = lst });
        }

        // fin ninio sano lista tablas de antecedentes

        // JDELGADO J0
        public async Task<JsonResult> GeneraPdfYRutaFimaOtrosModulosAsync(int idCuentaAtencion, int tipo, StringBuilder html, int idReceta) // firma jdelgado
        {
            DataSet lsAtencion;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalTriaje dalTriaje = new DalTriaje();
            string idAtencion = "0";
            string generacion_pdf = "";
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            var path = "";
            string resulfirma = "";
            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

            if (lsAtencion.Tables[0].Rows.Count == 0)
            {
                ViewBag.Texto = HttpUtility.HtmlDecode("No tiene atencion");
                ViewBag.Titulo = "No tiene atencion";
                ViewBag.nroFormato = "0000";
                //return PartialView("~/Views/Comun/GeneradorReporteGeneral.cshtml");
            }
            else
            {
                idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();

                try
                {
                    //A=Atencion
                    //R=Receta
                    //P=Parte
                    path = Path.Combine(sWebRootFolder, "Documentos", (lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "-ordenes.pdf"));

                    Comun.ClUtilirario cl = new Comun.ClUtilirario();
                    //html = await GeneraAtencionHTML(idCuentaAtencion, idProCabecera, tipoFormato); 
                    generacion_pdf = GenerarPDf(html, path, 1);

                    if (generacion_pdf == "Ok")
                    {
                        //verificar creacion 
                        Task<string> Tbol = cl.UploadFileOrdenes(path, Int32.Parse(lsAtencion.Tables[0].Rows[0]["idCuentaAtencion"].ToString()), "O", idReceta);
                        //quita creacion 
                        //Espera resultado de la tarea, no termina hasta termine
                        resulfirma = await Tbol;
                    }
                }
                catch (Exception e)
                {
                    return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
                }
            }
            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
        }
        // JDELGADO J0


        //KHOYOSI (START)
        [HttpPost]
        public async Task<ActionResult> ActualizaEmisionRefCon(int idCuentaAtencion, int tipoDestino)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            Boolean ds;
            DalReferencia daoReferencia = new DalReferencia();
            DalParametros daoParametros = new DalParametros();
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            ds = false;
            if (await daoParametros.SeleccionaPermisoGeneral("REFCON") == "1")
            {
                ds = await daoReferencia.ActualizarEmisionRefCon(idCuentaAtencion, tipoDestino);
            }

            return Json(new { respuesta = ds, session = true });
        }
        //KHOYOSI (END)

        public static string WordWrap(string text) // JDELGADO003-M
        {

            string res = "";

            foreach (var sub in text.Split())
            {
                if (sub.Length > 60)
                {
                    int parts = sub.Length / 60;
                    int from = 0;
                    int to = 60;
                    int size = sub.Length;
                    for (int i = 0; i < parts; i++)
                    {
                        res = res + sub.Substring(from, to) + " ";
                        from = from + 60;
                        size = size - 60;
                        if (size < 60)
                        {
                            to = size;
                        }

                    }
                }
                else
                {
                    res = res + sub + " ";
                }
            }
            Console.WriteLine("porfis");
            Console.WriteLine(res);
            return res;
        }


        [HttpPost]
        public async Task<ActionResult> CrearModificarCuentasGeneral(CuentasAtencionesGeneral cuentasAtencionesGeneral) // JDELGADO001.2
        {
            int nRpta = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var result = await dalAtenciones.CrearModificarCuentasGeneral(cuentasAtencionesGeneral, int.Parse(HttpContext.Session.GetString("idusu")));

                int IdCuentaAtencionOut = result.IdCuentaAtencionOut;
                int IdAtencionOut = result.IdAtencionOut;

                return Json(new { session = true, estado = true, msg = "", data = new { IdCuentaAtencionOut, IdAtencionOut } });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = new { IdCuentaAtencionOut = -1, IdAtencionOut = -1 } });
            }

        }


        [HttpPost]
        public async Task<ActionResult> CrearModificarFacturacionCuentasAtencion(FacturacionCuentasAtencion objFacturacionCuentasAtencion) // JDELGADO001.2
        {
            int nRpta = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();


            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalAtenciones.CrearModificarFacturacionCuentasAtencion(objFacturacionCuentasAtencion, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarAtenciones(Atenciones objAtenciones) // JDELGADO001.2
        {
            int nRpta = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalAtenciones.CrearModificarAtenciones(objAtenciones, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarAtencionesDatosAdicionales(AtencionesDatosAdicionales atencionesDatosAdicionales) // JDELGADO003-C
        {
            int nRpta = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalAtenciones.CrearModificarAtencionesDatosAdicionales(atencionesDatosAdicionales, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarAtencionesDatosAdicionalesTamizaje(AtencionesDatosAdicionales atencionesDatosAdicionales) // JDELGADO003-C
        {
            int nRpta = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                nRpta = await dalAtenciones.CrearModificarAtencionesDatosAdicionalesTamizaje(atencionesDatosAdicionales, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = nRpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = nRpta });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesDatosAdicionalesSeleccionarPorIdCuenta(int idCuentaAtencion) // JDELGADO001.2
        {
            DataSet dataSet = null;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                dataSet = await dalAtenciones.AtencionesDatosAdicionalesSeleccionarPorIdCuenta(idCuentaAtencion);

                return Json(new { dataSet, estado = true, session = true, mensaje = "" });
            }
            catch (Exception e)
            {
                return Json(new { dataSet, estado = false, session = true, mensaje = "Error al crear Atencion Datos Adicionales: " + e });
            }
        }

        [HttpPost]
        public async Task<ActionResult> web_AtencionesDatosAdicionalesSeleccionarPorIdCuenta(int idCuentaAtencion) // JDELGADO012
        {
            DataSet dataSet = null;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalAtenciones.web_AtencionesDatosAdicionalesSeleccionarPorIdCuenta(idCuentaAtencion);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> web_buscarEstablecimientoPorTipoMinsa(int idTipo, int idEstablecimiento) // JDELGADO001.2
        {
            DataSet dataSet = null;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalAtenciones.web_buscarEstablecimientoPorTipoMinsa(idTipo, idEstablecimiento);

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> web_listarEvalEmergenciaByNroHistoria(int nroHistoria) // JDELGADO003-C
        {
            DataSet dataSet = null;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await dalAtenciones.web_listarEvalEmergenciaByNroHistoria(nroHistoria);

            return Json(new { dataSet, estado = true, session = true });
        }


        ////////////////////////////////KHOYOSI///////////////////////////////////////////////////////////////////////////////////////
        ///CONSTRUCCION DE FUA - 09062022
        ///
        [HttpPost]
        public async Task<ActionResult> CrearModificarFua(int idCuentaAtencion)
        {
            bool bSesion = true;
            DalAtenciones daoAtenciones = new DalAtenciones();
            int agregaFua = await daoAtenciones.web_crearModificarFua(idCuentaAtencion); //jdelgado para agregar fua XD ojala funcione

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
            }

            return Json(new { session = bSesion, respuesta = agregaFua });
        }

        [HttpPost]
        public async Task<ActionResult> GenerarFormatoFua(int idCuentaAtencion)
        {
            string rsp = "";
            bool bSesion = true;
            string respuesta = "Error al registrar la generación del foramto FUA.";
            DalParametros daoParametros = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
                //return false;
            }
            try
            {
                //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    var resp = await GenerarFuaPdf(idCuentaAtencion);
                }

                rsp = "Ok";
                //if (resp.estadoCreacion.ToString() == "Ok")
                //{
                respuesta = "Se creo el formato FUA correctamente.";
                //}
                //return resp;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            //return true;
        }

        public async Task<ActionResult> GenerarFuaPdf(int idCuentaAtencion)//int Anio, String NroHistoria, int bd)
        {
            string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            string usuario;
            int idUsuario;
            string tipo;
            string nroHistoria;

            DalAtenciones daoAtenciones = new DalAtenciones();
            DataSet lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

            nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            MemoryStream ms = new MemoryStream();
            DalParametros daoParametros = new DalParametros();
            //byte[] pdf;

            try
            {
                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    usuario = HttpContext.Session.GetString("usuario");
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    tipo = "FUA";
                    //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

                    // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

                    //path = Path.Combine(sWebRootFolder, "FUA", (idCuentaAtencion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                    //Console.WriteLine("path: " + path);
                    Comun.ClUtilirario cl = new Comun.ClUtilirario();

                    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                    PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                    ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                    ohtml.Options.PdfPageSize = pageSize;
                    ohtml.Options.MarginLeft = 20;
                    ohtml.Options.MarginRight = 20;
                    ohtml.Options.MarginTop = 20;
                    ohtml.Options.MarginBottom = 20;
                    ohtml.Options.WebPageWidth = 793;
                    ohtml.Options.WebPageHeight = 1122;
                    //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

                    //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
                    string Ruta = Url.Action("FormatoFua", "Atencion", new { area = "Comun", idCuentaAtencion }, "http");
                    PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                    UtilitarioController utilitarioController = new UtilitarioController();


                    await utilitarioController.GuardarArchivoV2(
                        nroHistoria + "/ConsultaExterna/" + idCuentaAtencion + "/FUA",
                        (idCuentaAtencion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"),
                        ohtml, Ruta, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idCuentaAtencion.ToString())
                    );

                    ////html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
                    ////PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
                    //obPdfDoc.Save(path);
                    //generacion_pdf = "Ok";

                    ////ms = new MemoryStream();
                    ////ms.Write(pdf, 0, pdf.Length);
                    ////ms.Position = 0;

                    ////obPdfDoc.Close();

                    ////return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
                    //if (generacion_pdf == "Ok")
                    //{
                    //    //verificar creacion 
                    //    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idCuentaAtencion.ToString()));
                    //    //quita creacion 
                    //    //Espera resultado de la tarea, no termina hasta termine
                    //    resulfirma = await Tbol;
                    //    resp = true;
                    //}
                }
            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
                //return new FileStreamResult(ms, "Error al generar el parte diario.");
                //return e.ToString();
                //return false;
                //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });

        }


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///
        [HttpPost]
        public async Task<ActionResult> web_crearModificarFua(int idCuentaAtencion) // JDELGADO001.2
        {
            DataSet dataSet = null;
            int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            nRpta = await dalAtenciones.web_crearModificarFua(idCuentaAtencion);

            return Json(new { dataSet, estado = true, idAtencion = nRpta, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> InsertaTriajeCE(Triaje obTriaje) // JDELGADO001.2
        {
            DataSet dataSet = null;

            DalTriaje dalTriaje = new DalTriaje();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            bool nRpta = await dalTriaje.InsertaTriaje(obTriaje);

            return Json(new { dataSet, estado = true, idAtencion = nRpta, session = true });
        }


        //////////////////////////KHOYOSI (RECETAS EN PDF)/////////////////////////////////////
        //[HttpPost]
        //public async Task<ActionResult> GenerarRecetaMedica(int idCuentaAtencion, int idReceta)
        //{
        //    string rsp = "";
        //    bool bSesion = true;
        //    string respuesta = "Error al registrar la generación de la receta médica.";

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        bSesion = false;
        //        respuesta = "Su sesión a finalizado.";
        //    }
        //    try
        //    {
        //        var resp = await GenerarRecetaPdf(idCuentaAtencion, idReceta);

        //        rsp = "Ok";                
        //        respuesta = "Se creo el formato FUA correctamente.";
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = "Error al registrar," + ex.Message + ".";
        //    }
        //    return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
        //    //return true;
        //}

        [HttpPost]
        public async Task<ActionResult> GenerarRecetaPdf(int idCuentaAtencion, int idReceta, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String htmlTablaDetalle, htmlTablaItem, telefono, nombre, direccion, html;
            html = "";
            htmlTablaItem = "";
            string generacion_pdf = "";
            string sWebRootFolder = "";
            var path = "";
            //string tipo;
            bool resulfirma = false;

            bool farmaciaHospi = false;
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();
            Comun.ClUtilirario cl = new Comun.ClUtilirario();
            Conexion con = new Conexion();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            sWebRootFolder = con.ObtenerServidorArchivos();
            tipo = "REC-" + tipo;
            path = Path.Combine(sWebRootFolder, "Recetas", (idCuentaAtencion + idReceta + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            string idAtencion = "0";

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = await daoRecetas.ListaRecetaCabeceraById2(idReceta); // JDELGADO J0 AWAIT SENTENCE



            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>" + nombre + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>" + direccion + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "               <tr>" +
                "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            html = html + "<br>" +
                "           <table font size=8pt  width='30%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Orden Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            String hmtlCabeceraFarmacia = "";
            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
               "           <table font size=8pt  width='100%' >" +
               "               <tr>" +
               "                   <td align='center'> <b>" + nombre + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>" + direccion + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "               <tr>" +
               "                   <td align='center'> <b>Telf. :" + telefono + "</b>" +
               "                   </td>" +
               "               </tr>" +
               "           </table>";

            hmtlCabeceraFarmacia = hmtlCabeceraFarmacia + "<br>" +
                "           <table font size=8pt  width='100%' >" +
                "               <tr>" +
                "                   <td align='center'> <b>Receta Medica</b>" +
                "                   </td>" +
                "               </tr>" +
                "           </table>";

            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();




            string fechaRecetaAux = "";
            //Substring(0, 10);

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                fechaRecetaAux = dr["fechaReceta"].ToString();
                fechaRecetaAux = fechaRecetaAux.Substring(0, 10);
                if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "3" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "4"))
                {
                    html = "";
                    html = html + "<table width='100%' ><tr><td width='50%'>" + hmtlCabeceraFarmacia + "</td><td width='50%'>" + hmtlCabeceraFarmacia + "</td></tr></table>";
                    html = html + "<table  width='100%'>" +
                                    "<tr>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Tipo Plan: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() + " -  <b>Edad:</b> " + lsAtencion.Tables[0].Rows[0]["Edad"].ToString() + " - <b>Cuenta: </b>" + idCuentaAtencion + " </td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "   <td width='50%'>" +
                                    "       <table>" +
                                    "           <tr>" +
                                    "               <td width='100px'><b>F. Vigencia: </b></td><td>" + fechaRecetaAux + "</td>" +
                                    "           </tr>" +
                                    "           <tr>" +
                                    "               <td><b>Paciente: </b></td><td>" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() + " - <b>HC: </b>" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() + "</td>" +
                                   "           </tr>" +
                                    "       </table>" +
                                    "   </td>" +
                                    "</tr>" +
                                  "</table>";
                }
                else
                {
                    html = html + "<br>" +
                 "           <table font size=8pt  width='40%' style='font - size:8px' >" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Fecha Aten.:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + fechaRecetaAux +
                 "                   </td>" +
                 "               </tr>" +
                 //RQ0006 RMOREANOC
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro.Historia:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 //FIN RQ0006
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Cuenta:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + idCuentaAtencion +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Nro. Orden:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["idReceta"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Consultorio:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left'>" + lsAtencion.Tables[0].Rows[0]["DesServicio"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Prof. Salud:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + dr["Medico"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Paciente:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "               <tr><td width='3%'></td>" +
                 "                   <td align='left'><b>Tipo Plan:</b>" +
                 "                   </td>" +
                 "                   <td align = 'left' >" + lsAtencion.Tables[0].Rows[0]["PlanA"].ToString() +
                 "                   </td>" +
                 "               </tr>" +
                 "           </table><br>";
                }


                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Rayos X)" + "Nro.Receta:" + dr["idReceta"].ToString() + " <hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco obste
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia Obstetrica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //eco geenral
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
                {

                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Ecografia General)<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //patoclini
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Patologica Clinica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //anatalomiaPa
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
                {
                    html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Anatomia Patologica)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td> Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td  align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //sangre
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Banco de Sangre)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }


                }

                //interconsulta añadido por jdelgado011
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Interconsulta)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta); // JDELGADO011
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>" + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                    }
                }

                //farmacia
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    //if (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3")
                    if ((lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "2" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "4"))
                    {
                        farmaciaHospi = false;
                        html = html + "&nbsp;&nbsp;&nbsp;&nbsp Servicio: (Farmacia)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                        htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cant.</td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                    }
                    else
                    {
                        farmaciaHospi = true;

                        html = html + "<table>";
                        //html = html + "&nbsp;<b> Nro.Receta: </b>" + dr["idReceta"].ToString() + "<br>";
                        //html = html + "&nbsp;<b> Receta del Servicio: </b>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "";
                        html = html + "<tr><td width='100px'><b> Nro.Receta: </b></td><td>" + dr["idReceta"].ToString() + "<br></td></tr>";
                        html = html + "<tr><td width='100px'><b> Rec. del Serv.: </b></td><td>" + lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString() + "</td></tr>";
                        html = html + "</table>";

                        htmlTablaItem = "<table FRAME='hsides' RULES='rows'>";
                        htmlTablaItem = htmlTablaItem + "<tr><td></td><td><b>Concepto</b></td><td><b>Cant.</b></td></tr>";
                        lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                        foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                        {
                            htmlTablaItem = htmlTablaItem + "<tr>" + "<td></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["CantidadPedida"].ToString() + "</td></tr>";
                        }
                        htmlTablaItem = htmlTablaItem + "</table><br><br><br><br>";
                        htmlTablaItem = htmlTablaItem + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                    }
                }
            }
            ;

            string htmlDosisFamr;
            htmlDosisFamr = "";
            //RQ0003 RMOREANOC
            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' ><tr><td align='center'> <b>INDICACIONES</b></td></tr></table>";
                    htmlDosisFamr = htmlDosisFamr + "<table font size=8pt  FRAME='hsides' RULES='rows' width='100%' >";
                    htmlDosisFamr = htmlDosisFamr + "<tr><td width='5%'></td><td><b>Concepto</b></td><td align='center'><b>Dosis</b></td><td align='center'><b>Vias</b></td><td align='center'><b>Frecuencia</b></td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia); // JDELGADO J0 AWAIT SENTENCE
                    foreach (DataRow drD in lsRecetasDestalle.Tables[0].Rows)
                    {
                        htmlDosisFamr = htmlDosisFamr + "<tr>" + "<td width='5%'></td><td> " + drD["Producto"].ToString() + "</td>" + "<td align = 'center'>" + drD["Dosis"].ToString() + "</td>" + "<td align = 'center'>" + drD["Vias"].ToString() + "</td>" + "<td align = 'center'>" + drD["Observaciones"].ToString() + "</td></tr>";
                    }
                    htmlDosisFamr = htmlDosisFamr + "</table><br><br><br>";
                    htmlDosisFamr = htmlDosisFamr + "<b>" + lsRecetas.Tables[0].Rows[0]["Medico"].ToString() + "</b>";
                }
            }
            ;
            //RQ0003 RMOREANO 
            if (farmaciaHospi)
            {
                htmlTablaDetalle = "<table font size=8pt width='100%' style='font - size:8px'>" +
                                    " <tr><td width='50%' valign='top' >" + htmlTablaItem + "</td> <td width='50%' valign='top'>" + htmlDosisFamr + "</td></tr>" +
                                    " </table>";
            }
            else
            {
                htmlTablaDetalle = "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td >" + htmlTablaItem + "</td></tr></table>";
                htmlTablaDetalle = htmlTablaDetalle + "<br><table font size=8pt width='30%' style='font - size:8px'><tr><td>" + htmlDosisFamr + "</td></tr></table>";
            }
            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico); // JDELGADO J0 AWAIT SENTENCE

            string htmldiagnosticosDetalle = "";
            string htmldiagnosticostable = "";

            foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
            {
                htmldiagnosticosDetalle = htmldiagnosticosDetalle + "<tr><td>" + dr["codigoCIE10"].ToString() + "</td><td>" + dr["descripcion"].ToString() + "</td></tr>";

            }
            ;
            if (farmaciaHospi)
            {
                htmldiagnosticostable = htmldiagnosticostable + "<hr><b>Diagnositicos</b>";
                htmldiagnosticostable = htmldiagnosticostable + "<table width='50%'><tr><td><b>CIE 10</b></td><td><b>Descripcion</b></td></tr>" + htmldiagnosticosDetalle + "</table><br>";
            }
            else
            {
                htmldiagnosticostable = htmldiagnosticostable + "";
            }

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            html = html + htmldiagnosticostable + htmlTablaDetalle + " <br><b>Usuario WEB:" + idUsuario + "</b>";

            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;
            HtmlToPdf ohtml = new HtmlToPdf();
            SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

            obPdfDoc.Save(path);
            generacion_pdf = "Ok";

            if (generacion_pdf == "Ok")
            {
                //verificar creacion 
                Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idReceta.ToString()));
                //quita creacion 
                //Espera resultado de la tarea, no termina hasta termine
                resulfirma = await Tbol;
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
            //byte[] pdf = obPdfDoc.Save();

            //MemoryStream ms = new MemoryStream();
            //ms = new MemoryStream();
            //ms.Write(pdf, 0, pdf.Length);
            //ms.Position = 0;

            //obPdfDoc.Close();

            //return new FileStreamResult(
            //        ms,
            //        MediaTypeNames.Application.Pdf
            //    );
        }

        //public async Task<ActionResult> GenerarAtencionPdf(int idCuentaAtencion, int idProCabecera, int tipoFormato)
        //{               
        //    string generacion_pdf = "";
        //    string sWebRootFolder = "";
        //    var path = "";
        //    bool resulfirma = false;

        //    Conexion con = new Conexion();                         
        //    sWebRootFolder = con.ObtenerServidorArchivos();         
        //    StringBuilder html = new StringBuilder();
        //    //StringBuilder error = new StringBuilder();

        //    //error.Append("Error");
        //    try
        //    { 
        //        string tipo = "CE-A";      
        //        path = Path.Combine(sWebRootFolder, "AtencionesCE", (idCuentaAtencion.ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));    
        //        Comun.ClUtilirario cl = new Comun.ClUtilirario();
        //        html = await GeneraAtencionHTML2(idCuentaAtencion, idProCabecera, tipoFormato);

        //        if (html.ToString() == "Error")
        //        {
        //            generacion_pdf = "Error";
        //        }
        //        else
        //        {
        //            generacion_pdf = GenerarPDf(html, path, 1);

        //            if (generacion_pdf == "Ok")
        //            {
        //                //verificar creacion 
        //                Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idCuentaAtencion.ToString()));
        //                //quita creacion 
        //                //Espera resultado de la tarea, no termina hasta termine
        //                resulfirma = await Tbol;

        //            }
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { error = e.ToString() });
        //    }

        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
        //}

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////        
        ///
        /////////////////////////// JDELGADO
        [HttpPost]
        public async Task<ActionResult> ListaAtencionByIdCuentaAtencionInterConsulta(int idCuenta)
        {
            return await Task.Run(async () =>
            {
                DataSet lsAtencionByCuenta;
                DalAtenciones daoAtenciones = new DalAtenciones();
                int idUsuario;

                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                lsAtencionByCuenta = await daoAtenciones.ListaAtencionByIdCuentaAtencionInterConsulta(idCuenta);
                return Json(new { session = true, estado = true, lstAtenciones = lsAtencionByCuenta });
            });

        }
        ////////////////////////// END
        ///
        [HttpPost]
        public ActionResult ListaTriajeInterconsulta(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsTriaje;
            DalTriaje dal = new DalTriaje();
            lsTriaje = dal.ListaTriajeInterconsulta(idAtencion);
            return Json(lsTriaje);

        }

        [HttpPost]
        public async Task<ActionResult> UpdateProCabecera(int idProCabecera, int? estado, DateTime fechaFin, string motivoCierreCiclo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAtenciones daoAtenciones = new DalAtenciones();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            int resp = await daoAtenciones.UpdateProCabecera(idProCabecera, estado, fechaFin, idUsuario, motivoCierreCiclo);
            return Json(new { dataSet = "", estado = true, session = true, resp });
        }

        [HttpPost]
        public async Task<ActionResult> ListarCabecerasCiclosCerrados(int idPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAtenciones daoAtenciones = new DalAtenciones();

            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DataSet dataSet = await daoAtenciones.ListarCabecerasCiclosCerrados(idPaciente);
            return Json(new { dataSet, session = true, estado = true });
        }


        [HttpGet]
        public async Task<ActionResult> GenerarFormatoFuaVarios(int mes, int anio)
        {
            string rsp = "";
            bool bSesion = true;
            string respuesta = "Error al registrar la generación del foramto FUA.";
            DalParametros daoParametros = new DalParametros();
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
                //return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
                //return false;
            }

            DataSet ds = await dalAtenciones.ListarFuasbyFecha(mes, anio);


            try
            {
                //objConstanciaRN.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //DalEvaluacionRN daoEvaluacionRn = new DalEvaluacionRN();
                //rsp = daoEvaluacionRn.RegistrarImpresionSolicitudRn(objConstanciaRN);
                //if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                //{
                //    var resp = await GenerarFuaPdfVarios(idCuentaAtencion);
                //}
                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    Console.WriteLine("aqui mismito");
                    Console.WriteLine(dr["idCuentaAtencion"]);
                    var resp = await GenerarFuaPdfVarios(int.Parse(dr["idCuentaAtencion"].ToString()));
                }
                ;

                rsp = "Ok";
                //if (resp.estadoCreacion.ToString() == "Ok")
                //{
                respuesta = "Se creo el formato FUA correctamente.";
                //}
                //return resp;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion, ds });
            //return true;
        }
        public async Task<ActionResult> GenerarFuaPdfVarios(int idCuentaAtencion)//int Anio, String NroHistoria, int bd)
        {
            string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            string usuario;
            int idUsuario;
            string tipo;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            MemoryStream ms = new MemoryStream();
            DalParametros daoParametros = new DalParametros();
            //byte[] pdf;

            try
            {
                if (await daoParametros.SeleccionaPermisoGeneral("FUA") == "1")
                {
                    usuario = HttpContext.Session.GetString("usuario");
                    idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                    tipo = "FUA";
                    //String Ruta = "/ConstanciasRN/ReporteConstancia?&area=Estadistica&Anio=" + Anio.ToString() + "&NroHistoria=" + NroHistoria.ToString() + "&bd=" + bd.ToString();

                    // PdfDocument obPdfDoc = ohtml.ConvertUrl("https://localhost:44364/ConstanciasRN/ReporteConstancia?&area=Estadistica&idConstancia="+ idConstancia.ToString());

                    path = Path.Combine(sWebRootFolder, "FUA/VARIOS", (idCuentaAtencion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));
                    Console.WriteLine("path: " + path);
                    Comun.ClUtilirario cl = new Comun.ClUtilirario();

                    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                    PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                    ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                    ohtml.Options.PdfPageSize = pageSize;
                    ohtml.Options.MarginLeft = 20;
                    ohtml.Options.MarginRight = 20;
                    ohtml.Options.MarginTop = 20;
                    ohtml.Options.MarginBottom = 20;
                    ohtml.Options.WebPageWidth = 793;
                    ohtml.Options.WebPageHeight = 1122;
                    //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

                    //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
                    string Ruta = Url.Action("FormatoFua", "Atencion", new { area = "Comun", idCuentaAtencion }, "http");
                    PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                    //html.Append("<h1>CONSTANCIA DE NACIMIENTO</h1>");                
                    //PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html.ToString());
                    obPdfDoc.Save(path);
                    generacion_pdf = "Ok";

                    //ms = new MemoryStream();
                    //ms.Write(pdf, 0, pdf.Length);
                    //ms.Position = 0;

                    //obPdfDoc.Close();

                    //return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
                    if (generacion_pdf == "Ok")
                    {
                        //verificar creacion 
                        Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idCuentaAtencion.ToString()));
                        //quita creacion 
                        //Espera resultado de la tarea, no termina hasta termine
                        resulfirma = await Tbol;
                    }
                }
            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
                //return new FileStreamResult(ms, "Error al generar el parte diario.");
                //return e.ToString();
                //return false;
                //return Json(new { estadoCreacion = generacion_pdf, ruta = path, exep = e.ToString(), resulfirma = resulfirma });
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });

        }

        public async Task<ActionResult> FormatoPreAnestesico(int idAtencion)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();
            DalTriaje dalTriaje = new DalTriaje();
            DalAtenciones dalAtenciones = new DalAtenciones();

            DataSet anestesiologia = await dalAnestesiologia.ListarAtencionesAnestesiologia(idAtencion);
            DataSet triaje = dalTriaje.ListaTriaje(Convert.ToInt32(idAtencion));

            DataSet Diagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            DataTable dtDx = Diagnosticos.Tables[0];

            DataSet MedicacionSuministrada = await dalAnestesiologia.ListarMedicacionSuministradaAnestesiologia((int)anestesiologia.Tables[0].Rows[0]["IdAtencionAnestesiologia"]);
            DataTable dtMedicacion = MedicacionSuministrada.Tables[0];

            DataSet PatologiaClinica = await dalAnestesiologia.ListarPatologiaClinicaAnestesiologia((int)anestesiologia.Tables[0].Rows[0]["IdAtencionAnestesiologia"]);
            DataTable dtPatologiaClinica = PatologiaClinica.Tables[0];

            @ViewBag.IntervencionQuirurgicaPropuestaAA = anestesiologia.Tables[0].Rows[0]["IntervencionQuirurgicaPropuestaAA"].ToString();

            @ViewBag.EnfermedadActualAA = anestesiologia.Tables[0].Rows[0]["EnfermedadActualAA"].ToString();
            @ViewBag.TiempoEnfermedadAA = anestesiologia.Tables[0].Rows[0]["TiempoEnfermedadAA"].ToString();
            @ViewBag.RelatoAA = anestesiologia.Tables[0].Rows[0]["RelatoAA"].ToString();

            @ViewBag.FechaEvaluacion = anestesiologia.Tables[0].Rows[0]["FechaEvaluacion"].ToString();
            @ViewBag.HoraEvaluacion = anestesiologia.Tables[0].Rows[0]["HoraEvaluacion"].ToString();
            @ViewBag.Anestesiologo = anestesiologia.Tables[0].Rows[0]["Anestesiologo"].ToString();
            @ViewBag.Edad = anestesiologia.Tables[0].Rows[0]["Edad"].ToString();
            @ViewBag.Sexo = anestesiologia.Tables[0].Rows[0]["Sexo"].ToString();

            @ViewBag.Cama = anestesiologia.Tables[0].Rows[0]["Cama"].ToString();
            @ViewBag.Servicio = anestesiologia.Tables[0].Rows[0]["Servicio"].ToString();
            @ViewBag.NroHistoria = anestesiologia.Tables[0].Rows[0]["NroHistoria"].ToString();
            @ViewBag.Paciente = anestesiologia.Tables[0].Rows[0]["Paciente"].ToString();

            @ViewBag.TriajePeso = triaje.Tables[0].Rows[0]["TriajePeso"].ToString();
            @ViewBag.TriajePresion = triaje.Tables[0].Rows[0]["TriajePresion"].ToString();
            @ViewBag.TriajeFrecCardiaca = triaje.Tables[0].Rows[0]["TriajeFrecCardiaca"].ToString();
            @ViewBag.TriajeFrecRespiratoria = triaje.Tables[0].Rows[0]["TriajeFrecRespiratoria"].ToString();
            @ViewBag.TriajeTemperatura = triaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString();
            @ViewBag.TriajeSaturacionOxigeno = triaje.Tables[0].Rows[0]["TriajeSaturacionOxigeno"].ToString();


            @ViewBag.DClasificacionASAAA = anestesiologia.Tables[0].Rows[0]["DClasificacionASAAA"].ToString();
            @ViewBag.DTipoAnestesiaPrevistaAA = anestesiologia.Tables[0].Rows[0]["DTipoAnestesiaPrevistaAA"].ToString();
            @ViewBag.ConclusionAA = anestesiologia.Tables[0].Rows[0]["ConclusionAA"].ToString();

            @ViewBag.DisneaAA = anestesiologia.Tables[0].Rows[0]["DisneaAA"].ToString();
            @ViewBag.OrtopneaAA = anestesiologia.Tables[0].Rows[0]["OrtopneaAA"].ToString();
            @ViewBag.ConvulsionesAA = anestesiologia.Tables[0].Rows[0]["ConvulsionesAA"].ToString();
            @ViewBag.FotopsiasAA = anestesiologia.Tables[0].Rows[0]["FotopsiasAA"].ToString();
            @ViewBag.CianosisAA = anestesiologia.Tables[0].Rows[0]["CianosisAA"].ToString();
            @ViewBag.CefaleaAA = anestesiologia.Tables[0].Rows[0]["CefaleaAA"].ToString();
            @ViewBag.HemorragiasAA = anestesiologia.Tables[0].Rows[0]["HemorragiasAA"].ToString();
            @ViewBag.FiebreAA = anestesiologia.Tables[0].Rows[0]["FiebreAA"].ToString();
            @ViewBag.DolorAA = anestesiologia.Tables[0].Rows[0]["DolorAA"].ToString();
            @ViewBag.Nausea_VomitoAA = anestesiologia.Tables[0].Rows[0]["Nausea_VomitoAA"].ToString();
            @ViewBag.OtrosAA = anestesiologia.Tables[0].Rows[0]["OtrosAA"].ToString();
            @ViewBag.NingunoAA = anestesiologia.Tables[0].Rows[0]["NingunoAA"].ToString();
            @ViewBag.DescripcionOtrosAA = anestesiologia.Tables[0].Rows[0]["DescripcionOtrosAA"].ToString();

            @ViewBag.ApetitoAA = anestesiologia.Tables[0].Rows[0]["ApetitoAA"].ToString();
            @ViewBag.SedAA = anestesiologia.Tables[0].Rows[0]["SedAA"].ToString();
            @ViewBag.OrinaAA = anestesiologia.Tables[0].Rows[0]["OrinaAA"].ToString();
            @ViewBag.DeposicionesAA = anestesiologia.Tables[0].Rows[0]["DeposicionesAA"].ToString();
            @ViewBag.SuenioAA = anestesiologia.Tables[0].Rows[0]["SuenioAA"].ToString();

            @ViewBag.DiabetesP = anestesiologia.Tables[0].Rows[0]["DiabetesP"].ToString();
            @ViewBag.DiabetesDescP = anestesiologia.Tables[0].Rows[0]["DiabetesDescP"].ToString();
            @ViewBag.TBCP = anestesiologia.Tables[0].Rows[0]["TBCP"].ToString();
            @ViewBag.TBCDescP = anestesiologia.Tables[0].Rows[0]["TBCDescP"].ToString();
            @ViewBag.AsmaP = anestesiologia.Tables[0].Rows[0]["AsmaP"].ToString();
            @ViewBag.AsmaDescP = anestesiologia.Tables[0].Rows[0]["AsmaDescP"].ToString();
            @ViewBag.HipertensionP = anestesiologia.Tables[0].Rows[0]["HipertensionP"].ToString();
            @ViewBag.HipertensionDescP = anestesiologia.Tables[0].Rows[0]["HipertensionDescP"].ToString();
            @ViewBag.PatologiaTiroideaP = anestesiologia.Tables[0].Rows[0]["PatologiaTiroideaP"].ToString();
            @ViewBag.PatologiaTiroideaDescP = anestesiologia.Tables[0].Rows[0]["PatologiaTiroideaDescP"].ToString();
            @ViewBag.CirugiaPreviaP = anestesiologia.Tables[0].Rows[0]["CirugiaPreviaP"].ToString();
            @ViewBag.CirugiaPreviaDescP = anestesiologia.Tables[0].Rows[0]["CirugiaPreviaDescP"].ToString();
            @ViewBag.AlcoholP = anestesiologia.Tables[0].Rows[0]["AlcoholP"].ToString();
            @ViewBag.AlcoholDescP = anestesiologia.Tables[0].Rows[0]["AlcoholDescP"].ToString();
            @ViewBag.TabacoP = anestesiologia.Tables[0].Rows[0]["TabacoP"].ToString();
            @ViewBag.TabacoDescP = anestesiologia.Tables[0].Rows[0]["TabacoDescP"].ToString();
            @ViewBag.DrogasP = anestesiologia.Tables[0].Rows[0]["DrogasP"].ToString();
            @ViewBag.DrogasDescP = anestesiologia.Tables[0].Rows[0]["DrogasDescP"].ToString();
            @ViewBag.TransfusionesP = anestesiologia.Tables[0].Rows[0]["TransfusionesP"].ToString();
            @ViewBag.TransfusionesDescP = anestesiologia.Tables[0].Rows[0]["TransfusionesDescP"].ToString();
            @ViewBag.AnestesiasPreviasP = anestesiologia.Tables[0].Rows[0]["AnestesiasPreviasP"].ToString();
            @ViewBag.AnestesiasPreviasDescP = anestesiologia.Tables[0].Rows[0]["AnestesiasPreviasDescP"].ToString();
            @ViewBag.TendenciaHemorragiasP = anestesiologia.Tables[0].Rows[0]["TendenciaHemorragiasP"].ToString();
            @ViewBag.TendenciaHemorragiasDescP = anestesiologia.Tables[0].Rows[0]["TendenciaHemorragiasDescP"].ToString();
            @ViewBag.OtrosP = anestesiologia.Tables[0].Rows[0]["OtrosP"].ToString();
            @ViewBag.OtrosDescP = anestesiologia.Tables[0].Rows[0]["OtrosDescP"].ToString();

            @ViewBag.DiabetesF = anestesiologia.Tables[0].Rows[0]["DiabetesF"].ToString();
            @ViewBag.DiabetesDescF = anestesiologia.Tables[0].Rows[0]["DiabetesDescF"].ToString();
            @ViewBag.TBCF = anestesiologia.Tables[0].Rows[0]["TBCF"].ToString();
            @ViewBag.TBCDescF = anestesiologia.Tables[0].Rows[0]["TBCDescF"].ToString();
            @ViewBag.AsmaF = anestesiologia.Tables[0].Rows[0]["AsmaF"].ToString();
            @ViewBag.AsmaDescF = anestesiologia.Tables[0].Rows[0]["AsmaDescF"].ToString();
            @ViewBag.HipertensionF = anestesiologia.Tables[0].Rows[0]["HipertensionF"].ToString();
            @ViewBag.HipertensionDescF = anestesiologia.Tables[0].Rows[0]["HipertensionDescF"].ToString();
            @ViewBag.OtrosF = anestesiologia.Tables[0].Rows[0]["OtrosF"].ToString();
            @ViewBag.OtrosDescF = anestesiologia.Tables[0].Rows[0]["OtrosDescF"].ToString();
            @ViewBag.AnestesiasFamiliaresF = anestesiologia.Tables[0].Rows[0]["AnestesiasFamiliaresF"].ToString();
            @ViewBag.AnestesiasFamiliaresDescF = anestesiologia.Tables[0].Rows[0]["AnestesiasFamiliaresDescF"].ToString();

            @ViewBag.FarmacologicasALER = anestesiologia.Tables[0].Rows[0]["FarmacologicasALER"].ToString();
            @ViewBag.FarmacologicasDescALER = anestesiologia.Tables[0].Rows[0]["FarmacologicasDescALER"].ToString();
            @ViewBag.AlimentacionALER = anestesiologia.Tables[0].Rows[0]["AlimentacionALER"].ToString();
            @ViewBag.AlimentacionDescALER = anestesiologia.Tables[0].Rows[0]["AlimentacionDescALER"].ToString();
            @ViewBag.EosinofiliaALER = anestesiologia.Tables[0].Rows[0]["EosinofiliaALER"].ToString();
            @ViewBag.EosinofiliaDescALER = anestesiologia.Tables[0].Rows[0]["EosinofiliaDescALER"].ToString();
            @ViewBag.BroncoespasmosALER = anestesiologia.Tables[0].Rows[0]["BroncoespasmosALER"].ToString();
            @ViewBag.BroncoespasmosDescALER = anestesiologia.Tables[0].Rows[0]["BroncoespasmosDescALER"].ToString();
            @ViewBag.OtrosALER = anestesiologia.Tables[0].Rows[0]["OtrosALER"].ToString();
            @ViewBag.OtrosDescALER = anestesiologia.Tables[0].Rows[0]["OtrosDescALER"].ToString();
            @ViewBag.SignosSintomasALER = anestesiologia.Tables[0].Rows[0]["SignosSintomasALER"].ToString();
            @ViewBag.ShockALER = anestesiologia.Tables[0].Rows[0]["ShockALER"].ToString();
            @ViewBag.RASHALER = anestesiologia.Tables[0].Rows[0]["RASHALER"].ToString();
            @ViewBag.EdemaALER = anestesiologia.Tables[0].Rows[0]["EdemaALER"].ToString();
            @ViewBag.GlotisALER = anestesiologia.Tables[0].Rows[0]["GlotisALER"].ToString();
            @ViewBag.PruritoALER = anestesiologia.Tables[0].Rows[0]["PruritoALER"].ToString();
            @ViewBag.ObservacionALER = anestesiologia.Tables[0].Rows[0]["ObservacionALER"].ToString();

            @ViewBag.EstadoGeneralSensorioEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralSensorioEF"].ToString();
            @ViewBag.EstadoGeneralSensorioDescEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralSensorioDescEF"].ToString();
            @ViewBag.EstadoGeneralSensorioEdemasEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralSensorioEdemasEF"].ToString();
            @ViewBag.CardiovascularEF = anestesiologia.Tables[0].Rows[0]["CardiovascularEF"].ToString();
            @ViewBag.CardiovascularDescEF = anestesiologia.Tables[0].Rows[0]["CardiovascularDescEF"].ToString();
            @ViewBag.CardiovascularEdemasEF = anestesiologia.Tables[0].Rows[0]["CardiovascularEdemasEF"].ToString();
            @ViewBag.AbdomenEF = anestesiologia.Tables[0].Rows[0]["AbdomenEF"].ToString();
            @ViewBag.AbdomenDescEF = anestesiologia.Tables[0].Rows[0]["AbdomenDescEF"].ToString();
            @ViewBag.PielEF = anestesiologia.Tables[0].Rows[0]["PielEF"].ToString();
            @ViewBag.PielDescEF = anestesiologia.Tables[0].Rows[0]["PielDescEF"].ToString();
            @ViewBag.OjosEF = anestesiologia.Tables[0].Rows[0]["OjosEF"].ToString();
            @ViewBag.OjosDescEF = anestesiologia.Tables[0].Rows[0]["OjosDescEF"].ToString();
            @ViewBag.MovCervicalEF = anestesiologia.Tables[0].Rows[0]["MovCervicalEF"].ToString();
            @ViewBag.MovCervicalDescEF = anestesiologia.Tables[0].Rows[0]["MovCervicalDescEF"].ToString();
            @ViewBag.NeurologicoEF = anestesiologia.Tables[0].Rows[0]["NeurologicoEF"].ToString();
            @ViewBag.NeurologicoDescEF = anestesiologia.Tables[0].Rows[0]["NeurologicoDescEF"].ToString();
            @ViewBag.ColumnaVertebralEF = anestesiologia.Tables[0].Rows[0]["ColumnaVertebralEF"].ToString();
            @ViewBag.ColumnaVertebralDescEF = anestesiologia.Tables[0].Rows[0]["ColumnaVertebralDescEF"].ToString();
            @ViewBag.EstadoGeneralEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralEF"].ToString();
            @ViewBag.EstadoGeneralDescEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralDescEF"].ToString();
            @ViewBag.EstadoNutricionalEF = anestesiologia.Tables[0].Rows[0]["EstadoNutricionalEF"].ToString();
            @ViewBag.EstadoNutricionalDescEF = anestesiologia.Tables[0].Rows[0]["EstadoNutricionalDescEF"].ToString();
            @ViewBag.VenasEF = anestesiologia.Tables[0].Rows[0]["VenasEF"].ToString();
            @ViewBag.VenasDescEF = anestesiologia.Tables[0].Rows[0]["VenasDescEF"].ToString();
            @ViewBag.ViasAereasEF = anestesiologia.Tables[0].Rows[0]["ViasAereasEF"].ToString();
            @ViewBag.ViasAereasDescEF = anestesiologia.Tables[0].Rows[0]["ViasAereasDescEF"].ToString();
            @ViewBag.DentaduraEF = anestesiologia.Tables[0].Rows[0]["DentaduraEF"].ToString();
            @ViewBag.DentaduraDescEF = anestesiologia.Tables[0].Rows[0]["DentaduraDescEF"].ToString();
            @ViewBag.TraqueaEF = anestesiologia.Tables[0].Rows[0]["TraqueaEF"].ToString();
            @ViewBag.TraqueaDescEF = anestesiologia.Tables[0].Rows[0]["TraqueaDescEF"].ToString();
            @ViewBag.ToraxEF = anestesiologia.Tables[0].Rows[0]["ToraxEF"].ToString();
            @ViewBag.ToraxDescEF = anestesiologia.Tables[0].Rows[0]["ToraxDescEF"].ToString();
            @ViewBag.DMallampatiEF = anestesiologia.Tables[0].Rows[0]["DMallampatiEF"].ToString();
            @ViewBag.DDistanciaMentoTiroideaEF = anestesiologia.Tables[0].Rows[0]["DDistanciaMentoTiroideaEF"].ToString();

            @ViewBag.Hb = anestesiologia.Tables[0].Rows[0]["Hb"].ToString();
            @ViewBag.Hto = anestesiologia.Tables[0].Rows[0]["Hto"].ToString();
            @ViewBag.TProt = anestesiologia.Tables[0].Rows[0]["TProt"].ToString();
            @ViewBag.TTrombiop = anestesiologia.Tables[0].Rows[0]["TTrombiop"].ToString();
            @ViewBag.Glucosa = anestesiologia.Tables[0].Rows[0]["Glucosa"].ToString();
            @ViewBag.Urea = anestesiologia.Tables[0].Rows[0]["Urea"].ToString();
            @ViewBag.Creatinina = anestesiologia.Tables[0].Rows[0]["Creatinina"].ToString();
            @ViewBag.VDRL = anestesiologia.Tables[0].Rows[0]["VDRL"].ToString();
            @ViewBag.HIV = anestesiologia.Tables[0].Rows[0]["HIV"].ToString();
            @ViewBag.GrupoyRh = anestesiologia.Tables[0].Rows[0]["GrupoyRh"].ToString();
            @ViewBag.Fibrogeno = anestesiologia.Tables[0].Rows[0]["Fibrogeno"].ToString();
            @ViewBag.RxTorax = anestesiologia.Tables[0].Rows[0]["RXToraxResumenAA"].ToString();
            @ViewBag.RectPlaquetas = anestesiologia.Tables[0].Rows[0]["RectPlaquetas"].ToString();
            @ViewBag.Rq = anestesiologia.Tables[0].Rows[0]["RiesgoQuirurgicoAA"].ToString();
            @ViewBag.Orina = anestesiologia.Tables[0].Rows[0]["Orina"].ToString();
            @ViewBag.Covid19 = anestesiologia.Tables[0].Rows[0]["Covid19"].ToString();

            @ViewBag.Diagnosticos = dtDx;
            @ViewBag.MedicacionSuministrada = dtMedicacion;
            //@ViewBag.PatologiaClinica = dtPatologiaClinica;
            @ViewBag.TipoEvaluacionAnestesiaAA = anestesiologia.Tables[0].Rows[0]["TipoEvaluacionAnestesiaAA"].ToString();

            @ViewBag.CodeFirma = anestesiologia.Tables[0].Rows[0]["code"];

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

            return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoPreAnestesico.cshtml");
        }

        [HttpPost]
        public async Task<ActionResult> GenerarFormatoPreAnestesico(int idCuentaAtencion, int idAtencion)
        {
            string rsp = "";
            bool bSesion = true;
            string respuesta = "Error al registrar la generación del foramto Pre-Anestesico.";
            DalParametros daoParametros = new DalParametros();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                bSesion = false;
                respuesta = "Su sesión a finalizado.";
            }
            try
            {
                var resp = await GenerarFormatoPreAnestesicoPdf(idCuentaAtencion, idAtencion);

                rsp = "Ok";
                //if (resp.estadoCreacion.ToString() == "Ok")
                //{
                respuesta = "Se creo el formato Pre-Anestesico correctamente.";
                //}
                //return resp;
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta, Session = bSesion });
            //return true;
        }

        public async Task<ActionResult> GenerarFormatoPreAnestesicoPdf(int idCuentaAtencion, int idAtencion)//int Anio, String NroHistoria, int bd)
        {
            string generacion_pdf = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sWebRootFolder = "";

            var path = "";
            bool resulfirma = false;
            StringBuilder html = new StringBuilder();
            HtmlToPdf ohtml = new HtmlToPdf();
            string usuario;
            int idUsuario;
            string tipo;

            Conexion con = new Conexion();
            sWebRootFolder = con.ObtenerServidorArchivos();
            MemoryStream ms = new MemoryStream();
            DalParametros daoParametros = new DalParametros();
            //byte[] pdf;

            try
            {
                usuario = HttpContext.Session.GetString("usuario");
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                tipo = "CE-A";

                path = Path.Combine(sWebRootFolder, "AtencionesCE", (idCuentaAtencion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));

                Comun.ClUtilirario cl = new Comun.ClUtilirario();

                PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

                PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
                ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
                ohtml.Options.PdfPageSize = pageSize;
                ohtml.Options.MarginLeft = 20;
                ohtml.Options.MarginRight = 20;
                ohtml.Options.MarginTop = 20;
                ohtml.Options.MarginBottom = 20;
                ohtml.Options.WebPageWidth = 793;
                ohtml.Options.WebPageHeight = 1122;
                //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

                //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
                string Ruta = Url.Action("FormatoPreAnestesico", "Atencion", new { area = "ConsultaExterna", idAtencion }, "http");
                PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

                obPdfDoc.Save(path);
                generacion_pdf = "Ok";

                if (generacion_pdf == "Ok")
                {
                    //verificar creacion 
                    Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idCuentaAtencion.ToString()));
                    //quita creacion 

                    resulfirma = await Tbol;
                }
            }
            catch (Exception e)
            {
                return Json(new { exep = e.ToString() });
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });

        }

        ////////////////////////////////////KHOYOSI//////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> CargarModulo(int idServicio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            ViewBag.PermisoRefCon = pRefcon;

            DalUtilitario dalUtilitario = new DalUtilitario();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
            TiposDiagnosticos = await dalUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            //TiposDiagnosticos = dalUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);  // jdelgado descomentar si es necesario para listar tipos diagnostico
            ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            ViewBag.idEmpleado = idUsuario; // JDELGADO001

            DataSet ds = await dalUtilitario.ServiciosSeleccionarPorId(idServicio);

            bool UsaModuloMaterno = (bool)ds.Tables[0].Rows[0]["UsaModuloMaterno"];
            bool UsaModuloNinoSano = (bool)ds.Tables[0].Rows[0]["UsaModuloNinoSano"];

            if (UsaModuloMaterno)
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/Prenatal.cshtml");
            }
            else if (UsaModuloNinoSano)
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/NinoAltoRiesgo/NinoAltoRiesgo.cshtml");
            }
            else
            {
                return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicas.cshtml");
            }
            //Console.WriteLine(UsaModuloMaterno);

            //if (modulo == "especialidades")
            //{
            //    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicas.cshtml");
            //}

            //if (modulo == "materno")
            //{
            //    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/Prenatal.cshtml");
            //}

            //if (modulo == "nino")
            //{
            //    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/NinoAltoRiesgo/NinoAltoRiesgo.cshtml");
            //}

            //if (modulo == "anestesio")
            //{
            //    return PartialView("~/Views/Shared/Components/VistasParciales/Emergencia/EvaNeoMotivoAtencion.cshtml");
            //}

            //return PartialView("");
            //return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/Prenatal.cshtml");
        }

        ///////////////////////KHOYOSI//////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> CargarModuloV2(int idServicio, int idTipoAtencion, int tipoAtencionAnestesio)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            ViewBag.PermisoRefCon = pRefcon;

            DalUtilitario dalUtilitario = new DalUtilitario();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
            TiposDiagnosticos = await dalUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            //TiposDiagnosticos = dalUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);  // jdelgado descomentar si es necesario para listar tipos diagnostico
            ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            ViewBag.idEmpleado = idUsuario; // JDELGADO001

            DataSet ds = await dalUtilitario.ServiciosSeleccionarPorId(idServicio);

            //bool UsaModuloMaterno = (bool)ds.Tables[0].Rows[0]["UsaModuloMaterno"];
            //bool UsaModuloNinoSano = (bool)ds.Tables[0].Rows[0]["UsaModuloNinoSano"];
            //bool UsaModuloOdontologico = (bool)ds.Tables[0].Rows[0]["UsaModuloOdontologico"];
            //bool EsConsejeriaObstetrica = (bool)ds.Tables[0].Rows[0]["EsConsejeriaObstetrica"];
            //bool UsaModuloConsejeriaOncologica = (bool)ds.Tables[0].Rows[0]["UsaModuloConsejeriaOncologica"];
            //bool UsaModuloConsejeriaEstrategiasSanitaria = (bool)ds.Tables[0].Rows[0]["UsaModuloConsejeriaEstrategiasSanitaria"];
            bool UsaModuloMaterno = ds.Tables[0].Rows[0]["UsaModuloMaterno"] != DBNull.Value
                && Convert.ToBoolean(ds.Tables[0].Rows[0]["UsaModuloMaterno"]);
            bool UsaModuloNinoSano = ds.Tables[0].Rows[0]["UsaModuloNinoSano"] != DBNull.Value
                && Convert.ToBoolean(ds.Tables[0].Rows[0]["UsaModuloNinoSano"]);
            bool UsaModuloOdontologico = ds.Tables[0].Rows[0]["UsaModuloOdontologico"] != DBNull.Value
                && Convert.ToBoolean(ds.Tables[0].Rows[0]["UsaModuloOdontologico"]);
            bool EsConsejeriaObstetrica = ds.Tables[0].Rows[0]["EsConsejeriaObstetrica"] != DBNull.Value
                && Convert.ToBoolean(ds.Tables[0].Rows[0]["EsConsejeriaObstetrica"]);
            bool UsaModuloConsejeriaOncologica = ds.Tables[0].Rows[0]["UsaModuloConsejeriaOncologica"] != DBNull.Value
                && Convert.ToBoolean(ds.Tables[0].Rows[0]["UsaModuloConsejeriaOncologica"]);
            bool UsaModuloConsejeriaEstrategiasSanitaria = ds.Tables[0].Rows[0]["UsaModuloConsejeriaEstrategiasSanitaria"] != DBNull.Value
                && Convert.ToBoolean(ds.Tables[0].Rows[0]["UsaModuloConsejeriaEstrategiasSanitaria"]);
            //bool UsaModuloAnestesio = (bool)ds.Tables[0].Rows[0]["UsaModuloAnestesio"];
            int IdEspecialidad = Int32.Parse(ds.Tables[0].Rows[0]["IdEspecialidad"].ToString());

            var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:EspecialidadAdolescencia");
            var EspecialidadUsaModuloEspecialidadesYPrenatal = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:EspecialidadUsaModuloEspecialidadesYPrenatal");

            int IdEspecialidadAdolescencia = Int32.Parse(AppName.ToString());
            var EspecialidadesUsaModuloEspecialidadesYPrenatal = EspecialidadUsaModuloEspecialidadesYPrenatal.ToString().Split(',');

            var asdasd = Array.IndexOf(EspecialidadesUsaModuloEspecialidadesYPrenatal, IdEspecialidad.ToString());

            if (IdEspecialidad == IdEspecialidadAdolescencia)     //SI ES IGUAL SERVICIO A (Consultorios de Adolescencia)
            {
                if (idTipoAtencion == 1)
                {
                    ViewBag.TipoModulo = "ModuloMaternoAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/PrenatalV2.cshtml");
                }
                else if (idTipoAtencion == 2)
                {
                    ViewBag.TipoModulo = "ModuloEspecialidadesAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
                }
                else if (UsaModuloMaterno == true)
                {
                    ViewBag.TipoModulo = "ModuloMaternoAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/PrenatalV2.cshtml");
                }
                else if (UsaModuloOdontologico == true)
                {
                    ViewBag.TipoModulo = "ModuloOdontologico";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Odontologia/Odontologia.cshtml");
                }
                else
                {
                    ViewBag.TipoModulo = "ModuloEspecialidadesAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
                }
            }
            else if (Array.IndexOf(EspecialidadesUsaModuloEspecialidadesYPrenatal, IdEspecialidad.ToString()) >= 0)     //SI ES IGUAL SERVICIO A (Consultorios de Adolescencia)
            {
                if (EsConsejeriaObstetrica)
                {
                    ViewBag.TipoModulo = "ModuloConsejeriaObstetrica";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/ConsejeriaObstetrica/ConsejeriaObstetrica.cshtml");
                }
                else if (idTipoAtencion == 1)
                {
                    ViewBag.TipoModulo = "ModuloMaternoAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/PrenatalV2.cshtml");
                }
                else if (idTipoAtencion == 2)
                {
                    ViewBag.TipoModulo = "ModuloEspecialidadesAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
                }
                else if (UsaModuloMaterno == true)
                {
                    ViewBag.TipoModulo = "ModuloMaternoAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/PrenatalV2.cshtml");
                }
                else if (UsaModuloOdontologico == true)
                {
                    ViewBag.TipoModulo = "ModuloOdontologico";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Odontologia/Odontologia.cshtml");
                }
                else if (UsaModuloConsejeriaEstrategiasSanitaria == true)
                {
                    ViewBag.TipoModulo = "ModuloOdontologico";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Odontologia/Odontologia.cshtml");
                }
                else
                {
                    ViewBag.TipoModulo = "ModuloEspecialidadesAdolescencia";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
                }
            }
            else
            {
                if (EsConsejeriaObstetrica)
                {
                    ViewBag.TipoModulo = "ModuloConsejeriaObstetrica";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/ConsejeriaObstetrica/ConsejeriaObstetrica.cshtml");
                }

                else if (UsaModuloMaterno)
                {
                    ViewBag.TipoModulo = "ModuloMaterno";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/PrenatalV2.cshtml");
                }
                else if (UsaModuloNinoSano)
                {
                    ViewBag.TipoModulo = "ModuloNAR";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/NinoAltoRiesgo/NinoAltoRiesgoV2.cshtml");
                }
                else if (tipoAtencionAnestesio > 0)
                {
                    ViewBag.TipoModulo = "ModuloAnestesio";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Anestesiologia/Anestesiologia.cshtml");
                }
                else if (UsaModuloConsejeriaEstrategiasSanitaria == true)
                {
                    ViewBag.TipoModulo = "ModuloEstrategiasSanitaria";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/ConsejeriaEstrategiaSanitaria/ConsejeriaEstrategiaSanitaria.cshtml");
                }
                else if (UsaModuloConsejeriaOncologica)
                {
                    ViewBag.TipoModulo = "ModuloOnco";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/ConsejeriaOncologica/ConsejeriaOncologica.cshtml");
                }
                else if (UsaModuloOdontologico == true)
                {
                    ViewBag.TipoModulo = "ModuloOdontologico";
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Odontologia/Odontologia.cshtml");
                }
                else
                {
                    ViewBag.TipoModulo = "ModuloEspecialidades";
                    //return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/ConsejeriaOncologica/ConsejeriaOncologica.cshtml");
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicasV2.cshtml");
                }
            }


            //return PartialView("");
        }
        ////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////KHOYOSI//////////////////////////////////////////
        [HttpPost]
        //public async Task<ActionResult> CargarModuloAdolecencia(int idTipo)
        public ActionResult CargarModuloAdolecencia(int idTipo)
        {

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalUtilitario dalUtili = new DalUtilitario();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            string url = "";


            try
            {
                url = Url.Action("RenderViewAdolecencia", "Atencion", new { idTipo = idTipo }, "http");

                return Json(new { session = true, estado = true, msg = "", data = url });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = url });
            }

        }
        ////////////////////////////////////////////////////////////////////////////////////
        ///

        public async Task<ActionResult> RenderViewAdolecencia(int idTipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            //ROLES LUIS
            int idUsuario;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalEmpleado dlEmpleado = new DalEmpleado();


            // FIN ROLES LUIS
            DalParametros daoParametros = new DalParametros();
            string pRefcon = await daoParametros.SeleccionaPermisoGeneral("REFCON");

            ViewBag.PermisoRefCon = pRefcon;

            DalUtilitario dalUtilitario = new DalUtilitario();
            List<SubclasificacionDiagnosticos> TiposDiagnosticos = new List<SubclasificacionDiagnosticos>();
            TiposDiagnosticos = await dalUtilitario.DevuelveTiposDiagnostico((int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            ViewBag.TiposDiagnosticos = TiposDiagnosticos;
            ViewBag.idEmpleado = idUsuario; // JDELGADO001

            try
            {
                if (idTipo == 1)
                {
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/Prenatal/Prenatal.cshtml");
                }
                else if (idTipo == 2)
                {
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/EspecialidadesMedicas/EspecialidadesMedicas.cshtml");
                }
                else
                {
                    return PartialView("~/Views/Shared/Components/VistasParciales/ConsultaExterna/NinoAltoRiesgo/NinoAltoRiesgo.cshtml");
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }


        ////////////////////////////////KHOYOSI////////////////////////////////////////////////
        public async Task<bool> GenerarHojaAtencion(int idCuentaAtencion, int idAtencion, int idProCabecera, int tipoFormato, string tipoHoja)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                UtilitarioController utilitario = new UtilitarioController();
                bool resp;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;
                if (tipoHoja == "AT")
                {
                    //stringHtml = await GeneraAtencionHTML2(idCuentaAtencion, idProCabecera, tipoFormato);
                    pageHtml = Url.Action("InformeAtencionConsultaExterna", "Atencion", new { area = "ConsultaExterna", idCuentaAtencion, idProCabecera, tipoFormato, usuario }, "http");
                }
                else if (tipoHoja == "AN")
                {
                    pageHtml = Url.Action("FormatoPreAnestesico", "Atencion", new { area = "ConsultaExterna", idAtencion }, "http");
                }

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idAtencion, 0, "CE-A", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                return false;
            }
        }


        [HttpPost]
        public async Task<JsonResult> GenerarParteDiario(int programacion)
        {
            try
            {
                FormatoPdf pdf = new FormatoPdf();
                FirmaDigital firma = new FirmaDigital();
                DalUtilitario dalUtilitario = new DalUtilitario();
                UtilitarioController utilitario = new UtilitarioController();
                StringBuilder stringHtml = new StringBuilder();
                string pageHtml;
                DataSet datos;
                bool resp;
                string code = "";

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                stringHtml = null;
                pageHtml = null;
                stringHtml = await GeneraParteDiarioHTML(programacion);

                pdf.orientacion = "Landscape";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(0, programacion, 0, "CE-PD", 0, pageHtml, stringHtml, idUsuario, pdf);

                if (resp)
                {
                    datos = await dalUtilitario.FirmaDigitalSeleccionarDatos(0, programacion, 0, "CE-PD", 0);
                    code = datos.Tables[0].Rows[0]["code"].ToString();
                }
                else
                {
                    resp = false;
                }

                return Json(new { respuesta = resp, code });
            }
            catch (Exception e)
            {
                return Json(new { respuesta = false, code = "" }); ;
            }



            //StringBuilder html = new StringBuilder();
            //string tipo = "";
            //string sWebRootFolder = _hostingEnvironment.WebRootPath;
            //string path, resultado;
            //bool resulfirma = false;
            //Conexion con = new Conexion();
            //sWebRootFolder = con.ObtenerServidorArchivos();
            //tipo = "CE-PD";

            //html = await GeneraParteDiarioHTML(programacion);
            //path = Path.Combine(sWebRootFolder, "PartesDiarios", programacion + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf");
            //Comun.ClUtilirario cl = new Comun.ClUtilirario();
            //DalUtilitario dlUtili = new DalUtilitario();
            //DataSet lstFirma = null;

            //try
            //{
            //    if (html.ToString() == "NONE")
            //    {
            //        resultado = "NONE";
            //    }
            //    else
            //    {
            //        resultado = GenerarPDf(html, path, 0);
            //        if (resultado == "Ok")
            //        {
            //            //verificar creacion 
            //            Task<bool> Tbol = cl.UploadFile(path, programacion, tipo, programacion);
            //            //quita creacion 
            //            //Espera resultado de la tarea, no termina hasta termine
            //            resulfirma = await Tbol;

            //            ///COMENTADO POR KHOYOSI
            //            //if (resulfirma)
            //            //{
            //            //    lstFirma = dlUtili.ListaFirmaByIdRegistroByTipo(programacion, tipo);
            //            //}
            //        }
            //    }
            //}
            //catch (Exception e)
            //{
            //    return Json(new { estadoCreacion = false, ruta = path, exep = e.ToString(), resulfirma = resulfirma, lstFirma = lstFirma });
            //}

            //return Json(new { estadoCreacion = resultado, ruta = path, resulfirma = resulfirma, lstFirma = lstFirma });

        }

        //public async Task<bool> GenerarHojaAtencion(string tipoHoja, string codigo, int idCuentaAtencion, int idAtencion, int idRegistro,int idProCabecera, int tipoFormato,
        //                                            int idTipoServicio, int idServicio, int idEvaluacion, int idEmpleado, string fecha)
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
        //        pageHtml = null;
        //        if (tipoHoja == "AT")
        //        {
        //            stringHtml = await GeneraAtencionHTML2(idCuentaAtencion, idProCabecera, tipoFormato);
        //        }
        //        else if (tipoHoja == "AN")
        //        {
        //            pageHtml = Url.Action("FormatoPreAnestesico", "Atencion", new { area = "ConsultaExterna", idAtencion }, "http");
        //        }

        //        fpdf.stringHtml = stringHtml;
        //        fpdf.pageHtml = pageHtml;
        //        fpdf.orientacion = "Portrait";
        //        fpdf.tamanio = "A4";

        //        fpdf.codigo = codigo;
        //        fpdf.idCuentaAtencion = idCuentaAtencion;
        //        fpdf.idRegistro = idRegistro;
        //        fpdf.tipoServicio = idTipoServicio;
        //        fpdf.tipoDocumento = "A";

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

        //public async Task<bool> GenerarAtencionPdf(int idCuentaAtencion, int idProCabecera, int tipoFormato)
        //{
        //    DataSet lsAtencion;
        //    DalAtenciones daoAtenciones = new DalAtenciones();
        //    string tipoHoja, codigo, fecha;
        //    int idAtencion, idRegistro, idTipoServicio, idServicio, idEvaluacion, idEmpleado;
        //    bool resp;

        //    try
        //    {
        //        lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

        //        if (int.Parse(lsAtencion.Tables[0].Rows[0]["usaModuloAnestesio"].ToString()) > 0)
        //        {
        //            tipoHoja = "AN";
        //        }
        //        else
        //        {
        //            tipoHoja = "AT";
        //        }
        //        codigo = "0";
        //        idAtencion = int.Parse(lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString());
        //        idRegistro = idAtencion;
        //        idTipoServicio = int.Parse(lsAtencion.Tables[0].Rows[0]["idTipoServicio"].ToString());
        //        idServicio = int.Parse(lsAtencion.Tables[0].Rows[0]["idServicioIngreso"].ToString());
        //        idEvaluacion = 0;
        //        idEmpleado = int.Parse(lsAtencion.Tables[0].Rows[0]["idEmpleado"].ToString());
        //        fecha = lsAtencion.Tables[0].Rows[0]["fechaIngreso2"].ToString();

        //        resp = await GenerarHojaAtencion(tipoHoja, codigo, idCuentaAtencion, idAtencion, idRegistro, idProCabecera, tipoFormato, idTipoServicio, idServicio, idEvaluacion, idEmpleado, fecha);

        //        return resp;
        //    }
        //    catch (Exception e)
        //    {
        //        return false;
        //    }


        //}

        [HttpPost]
        public async Task<ActionResult> AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROSTamizaje(int NroCuenta, int HistoriaClinica, string ApellidoPaterno, string ApellidoMaterno, string FechaIngreso)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROSTamizaje(NroCuenta, HistoriaClinica, ApellidoPaterno, ApellidoMaterno, FechaIngreso);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS(int NroCuenta, int HistoriaClinica, string ApellidoPaterno, string FechaIngreso)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.AtencionesSeleccionarPacExtPorCuentaHistoriaApellidosServSEGUROS(NroCuenta, HistoriaClinica, ApellidoPaterno, FechaIngreso);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpPost]
        public async Task<ActionResult> ListarAtencionesInmunizaciones(int NroCuenta, int HistoriaClinica, string ApellidoPaterno, string FechaIngreso)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.ListarAtencionesInmunizaciones(NroCuenta, HistoriaClinica, ApellidoPaterno, FechaIngreso);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarCuentasAtenciones(FacturacionCuentasAtencion objFacturacionCuentasAtencion, Atenciones objAtenciones, AtencionesDatosAdicionales atencionesDatosAdicionales, int IdUsuarioAuditoria) // JDELGADO003-C
        {
            int nRpta = 0, idCuentaAtencionOutput = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                (nRpta, idCuentaAtencionOutput) = await dalAtenciones.CrearModificarCuentasAtenciones(objFacturacionCuentasAtencion, objAtenciones, atencionesDatosAdicionales, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = Json(new { idAtencion = nRpta, idCuentaAtencion = idCuentaAtencionOutput }) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = Json(new { idAtencion = nRpta, idCuentaAtencion = idCuentaAtencionOutput }) });
            }

        }

        [HttpPost]
        public async Task<ActionResult> CrearModificarCuentasAtencionesCeHospEmer(
            FacturacionCuentasAtencion objFacturacionCuentasAtencion, Atenciones objAtenciones, AtencionesDatosAdicionales atencionesDatosAdicionales,
            int? idDerivacion, int? idProducto, String lstDiagnosticos)
        {
            int nRpta = 0, idCuentaAtencionOutput = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);
                int tipoDiagnostico = 0;

                if (objAtenciones.idTipoServicio == 3)
                {
                    tipoDiagnostico = (int)Enumerados.TiposDiagnostico.HospitalizacionIngreso;
                }

                (nRpta, idCuentaAtencionOutput) = await dalAtenciones.CrearModificarCuentasAtencionesCeHospEmer(
                    objFacturacionCuentasAtencion, objAtenciones, atencionesDatosAdicionales, idDerivacion, idProducto, lstobjDiagnosticos, tipoDiagnostico,
                    int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = Json(new { idAtencion = nRpta, idCuentaAtencion = idCuentaAtencionOutput }) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = Json(new { idAtencion = nRpta, idCuentaAtencion = idCuentaAtencionOutput }) });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesEmergenciaAgregar(AtencionesEmergencia atencionesEmergencia) // JDELGADO003-C
        {
            int IdAtencionEmergencia = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                IdAtencionEmergencia = await dalAtenciones.AtencionesEmergenciaAgregar(atencionesEmergencia, int.Parse(HttpContext.Session.GetString("idusu")));
                return Json(new { session = true, estado = true, msg = "", data = Json(new { IdAtencionEmergencia = IdAtencionEmergencia }) });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = Json(new { IdAtencionEmergencia = IdAtencionEmergencia }) });
            }

        }


        [HttpPost]
        public async Task<ActionResult> ListarAtencionesPaciente(int idPaciente)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.ListarAtencionesPacientes(idPaciente);
                return Json(new { session = true, estado = true, msg = "", respuesta = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, respuesta = dataSet });
            }

        }


        [HttpPost]
        public async Task<ActionResult> AtencionesSeleccionarPorIdPaciente(int? idPaciente, int? idTipoServicio)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.AtencionesSeleccionarPorIdPaciente(idPaciente, idTipoServicio);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> FacturacionBienesPagosSeleccionarPorCuenta(int? idCuentaAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.FacturacionBienesPagosSeleccionarPorCuenta(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> AtencionesSeleccionarPorId(int? idAtencion)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalAtenciones.AtencionesSeleccionarPorId(idAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpPost]
        public async Task<ActionResult> AtencionesActualizarEstadoCuentaHosp(int idCuentaAtencion) // JDELGADO003-C
        {
            int resp = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                resp = await dalAtenciones.AtencionesActualizarEstadoCuentaHosp(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }
        [HttpPost]
        public async Task<ActionResult> AtencionesActualizarEstadoCuentaHospConSeguro(int idCuentaAtencion) // JDELGADO003-C
        {
            int resp = 0;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                resp = await dalAtenciones.AtencionesActualizarEstadoCuentaHospConSeguro(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = resp });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = resp });
            }

        }
        [HttpPost]
        public async Task<ActionResult> FacturacionServicioPagosPorCuenta(int idCuentaAtencion) // JDELGADO003-C
        {
            DataSet dataSet = null;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalAtenciones.FacturacionServicioPagosPorCuenta(idCuentaAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }
        [HttpPost]
        public async Task<ActionResult> AtencionesCESeleccionarPorId(int idAtencion) // JDELGADO003-C
        {
            DataSet dataSet = null;
            DalAtenciones dalAtenciones = new DalAtenciones();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalAtenciones.AtencionesCESeleccionarPorId(idAtencion);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<ActionResult> FormatoCronico(int idCuentaAtencion)
        {
          
            try
            {
                DalAtenciones daoAtenciones = new DalAtenciones();
                DalRecetas daoRecetas = new DalRecetas();
                DalParametros daoParametros = new DalParametros();

                int idIpressInt = 0;
                var idIpressStr = HttpContext.Session.GetString("IdIPress");
                if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;


                var lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
                ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();
                lsParametros.Clear();
                lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
                ViewBag.direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();
                lsParametros.Clear();
                lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
                ViewBag.telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

                ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
                ViewBag.Usuario = HttpContext.Session.GetString("usuario");

                var lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
                if (lsAtencion == null || lsAtencion.Tables.Count == 0 || lsAtencion.Tables[0].Rows.Count == 0)
                {
                    // devolver vista con valores vacíos si no hay datos
                    ViewBag.Fecha = "";
                    ViewBag.ServicioSolicitante = "";
                    ViewBag.NumeroRegistro = idCuentaAtencion;
                    ViewBag.Medicamentos = new List<object>();
                    ViewBag.TiempoUso = new List<string>();
                    return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoCronico.cshtml");
                }

                var row = lsAtencion.Tables[0].Rows[0];
                // helpers seguros para columnas (evitan excepciones si no existe la columna)
                Func<string, string> Get = col => row.Table.Columns.Contains(col) ? (row[col] ?? "").ToString() : "";
                Func<string[], string> GetAny = cols =>
                {
                    foreach (var c in cols) if (row.Table.Columns.Contains(c) && row[c] != DBNull.Value) return (row[c] ?? "").ToString();
                    return "";
                };

                ViewBag.Fecha =     row["FechaIngreso"].ToString();
                ViewBag.ServicioSolicitante =  row["DesServicio"].ToString();
                ViewBag.NumeroRegistro = idCuentaAtencion;

                ViewBag.TitularNombre = row["TitularNombre"].ToString(); 
                ViewBag.TitularGrado = row["TitularGrado"].ToString();
                ViewBag.TitularCIP = row["TitularCIP"].ToString();
                ViewBag.UnidadDependencia = row["UnidadDependencia"].ToString();
                ViewBag.Activ = GetAny(new[] { "Activ", "activo" });
                ViewBag.Ret = GetAny(new[] { "Ret", "ret" });
                ViewBag.Famil = GetAny(new[] { "Famil", "famil" });
                ViewBag.TitularTelefono = row["TitularTelefono"].ToString();

                ViewBag.PacienteNombre = row["Paciente"].ToString() ;
               
                ViewBag.Parentesco = GetAny(new[] { "Parentesco", "parentesco" });
                ViewBag.PacienteCorreo = GetAny(new[] { "CorreoElectronico", "Email", "PacienteCorreo" });
                ViewBag.PacienteDNI = GetAny(new[] { "NumeroDocumento", "NroDocumento", "dni", "DNI" });
                ViewBag.Direccion = GetAny(new[] { "Direccion", "direccion" });

                // Diagnóstico
                var idAtencion = GetAny(new[] { "idAtencion", "IdAtencion" });
                int idAtnParsed = 0;
                int.TryParse(idAtencion, out idAtnParsed);
                if (idAtnParsed > 0)
                {
                    var lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtnParsed, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
                    if (lsDiagnosticos != null && lsDiagnosticos.Tables.Count > 0)
                    {
                        // concatenar diagnósticos en una sola línea
                        var sbDx = new System.Text.StringBuilder();
                        foreach (System.Data.DataRow dr in lsDiagnosticos.Tables[0].Rows)
                        {
                            sbDx.AppendFormat("{0} - {1} ", dr["codigoCIE10"], dr["descripcion"]);
                        }
                        ViewBag.Diagnostico = sbDx.ToString();
                    }
                    else
                    {
                        ViewBag.Diagnostico = GetAny(new[] { "Diagnostico", "diagnostico" });
                    }
                }
                else
                {
                    ViewBag.Diagnostico = GetAny(new[] { "Diagnostico", "diagnostico" });
                }
                ViewBag.CIE10 = ""; // si necesitas un campo específico, puedes extraerlo de lsDiagnosticos arriba

                
                    // Obtener cabeceras de recetas para la cuenta (método puede ser síncrono en tu DAL, usamos Task.Run por compatibilidad)
                    var dsRecetas = await daoRecetas.DetalleRecetaByCuentaAtencion(idCuentaAtencion);
                    var dtDx = dsRecetas.Tables[0];

                

                ViewBag.Medicamentos = dtDx;
                ViewBag.TiempoUso = new List<string>(); // puedes rellenar con datos reales si los tienes
                ViewBag.LugarRecepcion = GetAny(new[] { "LugarRecepcion", "lugarRecepcion" });

                // Generar QR si existe código de firma en la fila
                ViewBag.CodeFirma = GetAny(new[] { "code", "Code", "codigo", "CodeFirma" });
                if (!string.IsNullOrWhiteSpace(ViewBag.CodeFirma))
                {
                    try
                    {
                        QRCodeGenerator qrGenerator = new QRCodeGenerator();
                        QRCodeData qrCodeData = qrGenerator.CreateQrCode(ViewBag.CodeFirma.ToString(), QRCodeGenerator.ECCLevel.Q);
                        QRCode qrCode = new QRCode(qrCodeData);
                        using (System.Drawing.Bitmap bitMap = qrCode.GetGraphic(20))
                        {
                            using (var ms = new MemoryStream())
                            {
                                bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                                ViewBag.CodigoQR = ms.ToArray();
                            }
                        }
                    }
                    catch
                    {
                        ViewBag.CodigoQR = null;
                    }
                }

                return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoCronico.cshtml");
            }
            catch (Exception ex)
            {
                // en caso de error devolver la vista vacía para evitar romper el flujo; registra/loguea si hace falta
                return PartialView("~/Views/ConsultaExterna/Plantillas/FormatoCronico.cshtml");
            }
        }
    }

}

