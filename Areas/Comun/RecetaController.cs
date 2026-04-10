using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using CapaEntidades;
//using DocumentFormat.OpenXml.Spreadsheet;
using SelectPdf;
using System.IO;
using Microsoft.Extensions.Configuration;
using System.Web;
using Microsoft.AspNetCore.Http.Extensions;
using System.Text;
using System.Diagnostics;
using QRCoder;
using System.Drawing;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using WebAppMaternidad.Areas.ConsultaExterna;


namespace WebAppMaternidad.Areas.Comun
{
    public class RecetaController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult listaRecetasByIdCuentaAtencion(int idCuentaAtencion)//trae todo el detalle
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = daoRecetas.ListaRecetasIdCuentaAtencion(idCuentaAtencion);

            return Json(listaRecetas);
        }

        [HttpPost]
        public async Task<ActionResult> ListarOrdenesMedicasPorIdPaciente(int idPaciente)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.ListarOrdenesMedicasPorIdPaciente(idPaciente);                                                                                               

            return Json(listaRecetas);
        }

        [HttpPost]
        public async Task<ActionResult> ListarOrdenesMedicasPorIdCuentaAtencion(int idCuentaAtencion)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.ListarOrdenesMedicasPorIdCuenta(idCuentaAtencion); //
                                                                                                    // J0 AWAIT SENTENCES

            return Json(listaRecetas);
        }

        public async Task<ActionResult> ListaRecetasCabeceraIdCuentaAtencion(int idCuentaAtencion)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.ListaRecetasCabeceraIdCuentaAtencion(idCuentaAtencion); //
                                                                                                    // J0 AWAIT SENTENCES

            return Json(listaRecetas);
        }
        
        public async Task<ActionResult> ListaRecetasCabeceraIdCuentaAtencionV2(int idCuentaAtencion, int idServicio, int idMedico)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.ListaRecetasCabeceraByIdCuentaAtencion(idCuentaAtencion, idServicio, idMedico); //
                                                                                                    // J0 AWAIT SENTENCES

            return Json(listaRecetas);
        }

        public async Task<ActionResult> ListaRecetasCabeceraIdReceta(int idReceta, int idServicio, int idMedico)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.ListaRecetasCabeceraByIdReceta(idReceta, idServicio, idMedico); //
                                                                                                                            // J0 AWAIT SENTENCES

            return Json(listaRecetas);
        }

        public async Task<ActionResult> ListaRecetaDetalle(int idReceta, int idPuntoCarga)
        {
            DataSet listaRecetasDetalle;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetasDetalle = null;

            listaRecetasDetalle = await daoRecetas.ListaRecetaDetalle(idReceta, idPuntoCarga); // JDELGADO J0 AWAIT SENTENCES

            return Json(listaRecetasDetalle);
        }

        public ActionResult ListaRecetaDetalleGeneral(int hc, int idPuntoCarga)
        {
            DataSet listaRecetasDetalle;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetasDetalle = null;

            listaRecetasDetalle = daoRecetas.ListaRecetaDetalleGeneral(hc, idPuntoCarga);

            return Json(listaRecetasDetalle);
        }


        public ActionResult ListaResultadosDeImagenesByIdOrdenByIdProducto(int idReceta, int idProducto, int idTipo)
        {
            DataSet listaResultados;
            DalRecetas daoRecetas = new DalRecetas();
            listaResultados = daoRecetas.ListaResultadosDeImagenesByIdOrdenByIdProducto(idReceta, idProducto, idTipo);

            return Json(listaResultados);
        }

        public ActionResult ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(int idProducto, int idOrden, int idTipo)
        {
            DataSet listaResultados;
            DalRecetas daoRecetas = new DalRecetas();
            listaResultados = daoRecetas.ListaResultadosDeImagenesByIdOrdenByIdProductoGenerales(idProducto, idOrden, idTipo);

            return Json(listaResultados);
        }

        [HttpPost]
        public ActionResult ListarImgLabObservaciones(int idMovimiento, int idProducto, int idOrden)
        {
            DataSet listaObs;
            DalRecetas daoRecetas = new DalRecetas();



            listaObs = daoRecetas.ListarImgLabObservaciones(idMovimiento, idProducto, idOrden);

            return Json(listaObs);
        }

        [HttpPost]
        public async Task<ActionResult> ListarPrescriptores() // KHOYOSI
        {
            DataSet dataSet;
            DalRecetas daoRecetas = new DalRecetas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            dataSet = await daoRecetas.ListarPrescriptores();

            return Json(new { dataSet, estado = true, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> RegistraRecetas (
            string lstRecetaRx, int idRecetaRx, string lstRecetaEcoObs, int idRecetaEcoObs, string lstRecetaEcoObsProc, int idRecetaEcoObsProc, string lstRecetaEcoGeneral, int idRecetaEcoGene, 
            string lstRecetaAnatoPatologica, int idRecetaAnaPatologica, string lstRecetaPatalogiaClinica, int idRecetaPatoClinica, 
            string lstRecetaBancoSangre, int idRecetaBancoSangre, string lstRecetaFarmacia, int idRecetaFarmacia, 
            string lstRecetaFarmaciaAntimicrobiano, int idRecetaFarmaciaAntimicrobiano, int recetaAntimicrobiano,
            string lstRecetaFarmaciaIntervencionSanitaria, int idRecetaFarmaciaIntervencionSanitaria, int recetaIntervencionSanitaria,
            string lstRecetaTomografia, int idRecetaTomografia, // Jdelgado Tomografia
            Receta objreceta,int  idServicioGeneral, int nroEvaluacion, string otrosMedicamentos, // MGAMERO
            string lstRecetaInterconsulta, int idRecetaInterconsulta, int idEspecialidadInterconsulta, int idTipoConsultaInterconsulta, string resumenHistoriaClinica, string motivoInterconsulta,
            string lstRecetaSolicitudCQx, int idRecetaSolicitudCQx, 
            SolicitudSalaOperacionesCQx solicitudSalaOperacionesCQx, String lstDiagnosticosPre,
            GestionAntimicrobiano gestionAntimicrobiano
        //IntervencionSanitaria intervencionSanitaria
        ) {
            
            try
            {
                Boolean registraModificaElimina;
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }

                ///////////KHOYOSI (COMENTADO POR MIENTRAS)
                //RolesItems objRol = null ; 
                //if (idServicioGeneral == 1) //CE
                //{
                //    objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Consultaexterna_Recetas);
                //}
                //if (idServicioGeneral == 2) //EMR
                //{
                //     objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Emergencia_Recetas);
                //}
                //if (idServicioGeneral == 3) //HOSP
                //{
                //     objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Hospitalización_Recetas);
                //}

            

                //if (objRol.Agregar == true)
                //{
                //    registraModificaElimina = true;
                //}
                //else
                //{
                //    if (objRol.Modificar == true)
                //    {
                //        registraModificaElimina = true;
                //    }
                //    else
                //    {
                //        registraModificaElimina = false;
                //    }

                //}

                registraModificaElimina = true;         //KHOYOSI       (AGREGADO POR MIENTRAS)

                //valido cuenta
                DataSet lstCuenta;
                DalAtenciones daoCitas = new DalAtenciones();
                DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();
                //lstCuenta = daoCitas.ListaAtencionEstadosCompletosByIdCuenta(objreceta.idCuentaAtencion);
                lstCuenta = await daoCitas.ListaAtencionEstadosCompletosByIdCuentaV2(objreceta.idCuentaAtencion);           //KHOYOSI

                if ((Convert.ToInt32(lstCuenta.Tables[0].Rows[0]["idEstado"])) != 1)
                {
                    return Json(new { rpt = false, msjReceta = "El estado de Cuenta no se encuentra ABIERTO", session = true, });
                }
                //cierra validacion
                string mensajeRectas, fechaReceta;
                Boolean /*resp, resAteCE,*/ rspRx, rspEcoObs, rspEcoObsProc, rspEcoGeneral, respAnaPatolo, respPatoClinica, respBancoSangre, respFarmacia, respFarmaciaAntimicrobiano, respFarmaciaIntervencionSanitaria, respInterconsulta, respTomografia, respSolicitudCQx;

                Receta receta = new Receta();
                DalRecetas daoRecetas = new DalRecetas();
                DalParametros daoParametros = new DalParametros();
                int estadoReceta;

                var lstobjRx = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaRx);
                var lstobjEcobObs = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaEcoObs);
                var lstobjEcobObsProc = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaEcoObsProc);
                var lstobjEcoGeneral = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaEcoGeneral);
                var lstobjAnatoPatologica = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaAnatoPatologica);
                var lstobjPatalogiaClinica = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaPatalogiaClinica);
                var lstobjBancoSangre = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaBancoSangre);
                var lstobjFarmacia = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaFarmacia);
                var lstobjFarmaciaAntimicrobiano = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaFarmaciaAntimicrobiano);
                var lstobjFarmaciaIntervencionSanitaria = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaFarmaciaIntervencionSanitaria);
                var lstobjInterconsulta = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaInterconsulta); // jdelgado011
                var lstobjInterconsultaDetalle = JsonConvert.DeserializeObject<List<RecetaDetalleInterconsulta>>(lstRecetaInterconsulta); // jdelgado011
                var lstobjTomografia = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaTomografia);

                var lstobjRecetaSolicitudCQx = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaSolicitudCQx);

                var lstobjDiagnosticosPre = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticosPre);

                DataSet lsParametros = new DataSet();

                //lsParametros = daoParametros.RetornaFechaServidor();
                //lsParametros = await daoParametros.RetornaFechaServidorV2();
                //fechaReceta = lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString();
                //fechaReceta = fechaReceta.Substring(0, 10);
                fechaReceta = DateTime.Now.ToString("dd/MM/yyyy");
                estadoReceta = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                mensajeRectas = "";

                int idUsuario;

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                if (int.Parse(HttpContext.Session.GetString("idmed")) > 0)
                {
                    objreceta.idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
                }

                receta.fechaVigencia = objreceta.fechaVigencia;
                receta.idCuentaAtencion = objreceta.idCuentaAtencion;
                receta.idServicioReceta = objreceta.idServicioReceta;
                receta.nroEvaluacion = nroEvaluacion;
                receta.otrosMedicamentos = otrosMedicamentos;
                receta.idMedico = objreceta.idMedico;
                receta.idUsuario = idUsuario;

                if (registraModificaElimina)
                {
                    #region RecetaRx
                    if (idRecetaRx == 0 && lstobjRx.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX;
                        ////////KHOYOSI//////////////////////
                        if(nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);             //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);                //KHOYOSI
                        }                        
                        /////////////////////////////////////////
                        idRecetaRx = receta.idReceta;
                        rspRx = true;
                    }
                    else
                    {
                        if (idRecetaRx > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaRx);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaRx);              //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX;
                            receta.idReceta = idRecetaRx;
                            //rspRx = daoRecetas.ModifcarReceta(receta);
                            rspRx = await daoRecetas.ModifcarRecetaV2(receta);              //KHOYOSI
                        }
                        else
                        {
                            rspRx = false;
                        }
                    }
                    if (rspRx == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //rspRx = daoRecetas.InsertaRecetaDetalle(lstobjRx, idRecetaRx);
                            rspRx = await daoRecetas.InsertaRecetaDetalleV2(lstobjRx, idRecetaRx);              //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaRx, "RX");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de RX: " + idRecetaRx;
                    }
                    #endregion
                    
                    #region RecetaEcoObs
                    if (idRecetaEcoObs == 0 && lstobjEcobObs.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaEcoObs = receta.idReceta;
                        rspEcoObs = true;
                    }
                    else
                    {
                        if (idRecetaEcoObs > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaEcoObs);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaEcoObs);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }

                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica;
                            receta.idReceta = idRecetaEcoObs;
                            //rspEcoObs = daoRecetas.ModifcarReceta(receta);
                            rspEcoObs = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            rspEcoObs = false;
                        }
                    }

                    if (rspEcoObs == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //rspEcoObs = daoRecetas.InsertaRecetaDetalle(lstobjEcobObs, idRecetaEcoObs);
                            rspEcoObs = await daoRecetas.InsertaRecetaDetalleV2(lstobjEcobObs, idRecetaEcoObs);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaEcoObs, "EO");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        var AppVistaOrdenesMedica = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoVistaOrdenesMedica");
                        string VistaOrdenesMedica = AppVistaOrdenesMedica.ToString();
                        if (VistaOrdenesMedica == "1") {
                            mensajeRectas = mensajeRectas + "<br> Receta de Eco. Obstétrica: " + idRecetaEcoObs;
                        }
                        if (VistaOrdenesMedica == "2")
                        {
                            mensajeRectas = mensajeRectas + "<br> Receta de Eco. Medicina Fetal: " + idRecetaEcoObs;
                        }                        
                    }
                    #endregion

                    #region RecetaEcoObsProcedimientos
                    if (idRecetaEcoObsProc == 0 && lstobjEcobObsProc.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetricaProcedimientos;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaEcoObsProc = receta.idReceta;
                        rspEcoObsProc = true;
                    }
                    else
                    {
                        if (idRecetaEcoObsProc > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaEcoObs);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaEcoObsProc);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }

                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetricaProcedimientos;
                            receta.idReceta = idRecetaEcoObsProc;
                            //rspEcoObs = daoRecetas.ModifcarReceta(receta);
                            rspEcoObsProc = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            rspEcoObsProc = false;
                        }
                    }

                    if (rspEcoObsProc == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //rspEcoObs = daoRecetas.InsertaRecetaDetalle(lstobjEcobObs, idRecetaEcoObs);
                            rspEcoObsProc = await daoRecetas.InsertaRecetaDetalleV2(lstobjEcobObsProc, idRecetaEcoObsProc);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaEcoObsProc, "EOP");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Proc. Medicina Fetal: " + idRecetaEcoObsProc;
                    }
                    #endregion

                    #region RecetaEcoGene
                    if (idRecetaEcoGene == 0 && lstobjEcoGeneral.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaEcoGene = receta.idReceta;
                        rspEcoGeneral = true;
                    }
                    else
                    {
                        if (idRecetaEcoGene > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaEcoGene);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaEcoGene);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral;
                            receta.idReceta = idRecetaEcoGene;
                            //rspEcoGeneral = daoRecetas.ModifcarReceta(receta);
                            rspEcoGeneral = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            rspEcoGeneral = false;
                        }
                    }

                    if (rspEcoGeneral == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //rspEcoGeneral = daoRecetas.InsertaRecetaDetalle(lstobjEcoGeneral, idRecetaEcoGene);
                            rspEcoGeneral = await daoRecetas.InsertaRecetaDetalleV2(lstobjEcoGeneral, idRecetaEcoGene);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaEcoGene, "EG");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Eco. General: " + idRecetaEcoGene;
                    }
                    #endregion

                    #region RecetaAnaPatologica
                    if (idRecetaAnaPatologica == 0 && lstobjAnatoPatologica.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaAnaPatologica = receta.idReceta;
                        respAnaPatolo = true;
                    }
                    else
                    {
                        if (idRecetaAnaPatologica > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaAnaPatologica);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaAnaPatologica);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }

                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1;
                            receta.idReceta = idRecetaAnaPatologica;
                            //respAnaPatolo = daoRecetas.ModifcarReceta(receta);
                            respAnaPatolo = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            respAnaPatolo = false;
                        }
                    }

                    if (respAnaPatolo == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respAnaPatolo = daoRecetas.InsertaRecetaDetalle(lstobjAnatoPatologica, idRecetaAnaPatologica);
                            respAnaPatolo = await daoRecetas.InsertaRecetaDetalleV2(lstobjAnatoPatologica, idRecetaAnaPatologica);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaAnaPatologica, "AP");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Anat. Patologica: " + idRecetaAnaPatologica;
                    }
                    #endregion

                    #region RecetaPatoClinica
                    if (idRecetaPatoClinica == 0 && lstobjPatalogiaClinica.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaPatoClinica = receta.idReceta;
                        respPatoClinica = true;
                    }
                    else
                    {
                        if (idRecetaPatoClinica > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaPatoClinica);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaPatoClinica);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica;
                            receta.idReceta = idRecetaPatoClinica;
                            //respPatoClinica = daoRecetas.ModifcarReceta(receta);
                            respPatoClinica = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            respPatoClinica = false;
                        }
                    }

                    if (respPatoClinica == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respPatoClinica = daoRecetas.InsertaRecetaDetalle(lstobjPatalogiaClinica, idRecetaPatoClinica);
                            respPatoClinica = await daoRecetas.InsertaRecetaDetalleV2(lstobjPatalogiaClinica, idRecetaPatoClinica);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaPatoClinica, "PC");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Pat. Clinica: " + idRecetaPatoClinica;
                    }
                    #endregion

                    #region RecetaBancoSangre
                    if (idRecetaBancoSangre == 0 && lstobjBancoSangre.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaBancoSangre = receta.idReceta;
                        respBancoSangre = true;
                    }
                    else
                    {
                        if (idRecetaBancoSangre > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaBancoSangre);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaBancoSangre);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1;
                            receta.idReceta = idRecetaBancoSangre;
                            //respBancoSangre = daoRecetas.ModifcarReceta(receta);
                            respBancoSangre = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            respBancoSangre = false;
                        }
                    }

                    if (respBancoSangre == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respBancoSangre = daoRecetas.InsertaRecetaDetalle(lstobjBancoSangre, idRecetaBancoSangre);
                            respBancoSangre = await daoRecetas.InsertaRecetaDetalleV2(lstobjBancoSangre, idRecetaBancoSangre);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaBancoSangre, "BS");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Banco de Sangre: " + idRecetaBancoSangre;
                    }
                    #endregion

                    #region RecetaTomografia
                    // jdelgado tomografia
                    if (idRecetaTomografia == 0 && lstobjTomografia.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaTomografia;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaTomografia = receta.idReceta;
                        respTomografia = true;
                    }
                    else
                    {
                        if (idRecetaTomografia > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaBancoSangre);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaTomografia);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaTomografia;
                            receta.idReceta = idRecetaTomografia;
                            //respBancoSangre = daoRecetas.ModifcarReceta(receta);
                            respTomografia = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            respTomografia = false;
                        }
                    }

                    if (respTomografia == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respBancoSangre = daoRecetas.InsertaRecetaDetalle(lstobjBancoSangre, idRecetaBancoSangre);
                            respTomografia = await daoRecetas.InsertaRecetaDetalleV2(lstobjTomografia, idRecetaTomografia);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaTomografia, "T");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Tomografia: " + idRecetaTomografia;
                    }
                    #endregion

                    #region RecetaInterconsulta
                    if (idRecetaInterconsulta == 0 && lstobjInterconsulta.Count > 0) // jdelgado011 falta
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta; // se añadio nuevo ptocargainterconsulta jdelgado011
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaInterconsulta = receta.idReceta;
                        respInterconsulta = true;

                        //daoRecetas.InsertaRecetaDetalleInterconsulta(idEspecialidadInterconsulta, idTipoConsultaInterconsulta, resumenHistoriaClinica, motivoInterconsulta, idRecetaInterconsulta); // se agrego insertar receta detalle interconsulta jdelgado011
                        //await daoRecetas.InsertaRecetaDetalleInterconsultaV2(idEspecialidadInterconsulta, idTipoConsultaInterconsulta, resumenHistoriaClinica, motivoInterconsulta, idRecetaInterconsulta); // se agrego insertar receta detalle interconsulta jdelgado011
                    }
                    else
                    {
                        if (idRecetaInterconsulta > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaInterconsulta);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaInterconsulta);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta;
                            receta.idReceta = idRecetaInterconsulta;
                            //respInterconsulta = daoRecetas.ModifcarReceta(receta);
                            respInterconsulta = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI

                            //daoRecetas.InsertaRecetaDetalleInterconsulta(idEspecialidadInterconsulta, idTipoConsultaInterconsulta, resumenHistoriaClinica, motivoInterconsulta, idRecetaInterconsulta); // se agrego insertar receta detalle interconsulta jdelgado011
                            //await daoRecetas.InsertaRecetaDetalleInterconsultaV2(idEspecialidadInterconsulta, idTipoConsultaInterconsulta, resumenHistoriaClinica, motivoInterconsulta, idRecetaInterconsulta); // se agrego insertar receta detalle interconsulta jdelgado011
                        }
                        else
                        {
                            respInterconsulta = false;
                        }
                    }

                    if (respInterconsulta == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respInterconsulta = daoRecetas.InsertaRecetaDetalle(lstobjInterconsulta, idRecetaInterconsulta);
                            respInterconsulta = await daoRecetas.InsertaRecetaDetalleV2(lstobjInterconsulta, idRecetaInterconsulta);           //KHOYOSI
                            await daoRecetas.InsertaRecetaDetalleInterconsultaV3(lstobjInterconsultaDetalle, idRecetaInterconsulta, resumenHistoriaClinica, motivoInterconsulta);
                            
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaInterconsulta, "I");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Interconsulta: " + idRecetaInterconsulta;
                    }
                    #endregion
                                        
                    #region RecetaSolicitudCQx
                    // jdelgado solicitudCQx
                    if (idRecetaSolicitudCQx == 0 && lstobjRecetaSolicitudCQx.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaSolicitudCQx;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaSolicitudCQx = receta.idReceta;
                        respSolicitudCQx = true;
                    }
                    else
                    {
                        if (idRecetaSolicitudCQx > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaBancoSangre);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaSolicitudCQx);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaSolicitudCQx;
                            receta.idReceta = idRecetaSolicitudCQx;
                            //respBancoSangre = daoRecetas.ModifcarReceta(receta);
                            respSolicitudCQx = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI
                        }
                        else
                        {
                            respSolicitudCQx = false;
                        }
                    }

                    if (respSolicitudCQx == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respBancoSangre = daoRecetas.InsertaRecetaDetalle(lstobjBancoSangre, idRecetaBancoSangre);
                            respSolicitudCQx = await daoRecetas.InsertaRecetaDetalleV2(lstobjRecetaSolicitudCQx, idRecetaSolicitudCQx);           //KHOYOSI

                            solicitudSalaOperacionesCQx.NroSolicitud = idRecetaSolicitudCQx.ToString();
                            solicitudSalaOperacionesCQx.IdCuentaAtencion = receta.idCuentaAtencion;
                            await dalCentroQuirurgico.CrearModificarSolicitudSalaOperacionesCQx(solicitudSalaOperacionesCQx, lstobjDiagnosticosPre);

                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaSolicitudCQx, "CQx");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Solicitud CQx: " + idRecetaSolicitudCQx;
                    }
                    #endregion

                    #region RecetaFarmacia
                    if (idRecetaFarmacia == 0 && lstobjFarmacia.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                        //receta.esRecetaAntimicrobiano = recetaAntimicrobiano;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaFarmacia = receta.idReceta;
                        respFarmacia = true;

                    }
                    else
                    {
                        if (idRecetaFarmacia > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaFarmacia);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaFarmacia);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                            receta.idReceta = idRecetaFarmacia;
                            //receta.esRecetaAntimicrobiano = recetaAntimicrobiano;
                            //respFarmacia = daoRecetas.ModifcarReceta(receta);
                            respFarmacia = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI                                                        
                        }
                        else
                        {
                            respFarmacia = false;
                        }
                    }

                    if (respFarmacia == true)
                    {
                        AtencionPacienteCronico RespFarmaciaPacCronico = new AtencionPacienteCronico();
                        RespFarmaciaPacCronico.idCuentaAtencion = receta.idCuentaAtencion;
                        RespFarmaciaPacCronico.idReceta = receta.idReceta;
                       
                        if (estadoReceta == 1)
                        {
                            //respFarmacia = daoRecetas.InsertaRecetaDetalle(lstobjFarmacia, idRecetaFarmacia);
                            respFarmacia = await daoRecetas.InsertaRecetaDetalleV2(lstobjFarmacia, idRecetaFarmacia);           //KHOYOSI
                                   //KHOYOSI -GENERAR PDF DE RECETA


                            // RMOREANO -- PACIENTE CRONICO 
                            RespFarmaciaPacCronico = await daoRecetas.RegistrarRecetaPacienteCronico(RespFarmaciaPacCronico);
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaFarmacia, "F");
                            var hojaCron = false;
                            if (RespFarmaciaPacCronico.bTieneCuentaAsoc==true && RespFarmaciaPacCronico.idReceta_1>0 && RespFarmaciaPacCronico.idReceta_2 > 0)
                            {
                                mensajeRectas = mensajeRectas + "<br> Receta de Farmacia: " + idRecetaFarmacia;
                                mensajeRectas = mensajeRectas + "<br> Receta de Farmacia(Cronico): " + RespFarmaciaPacCronico.idReceta_1 +","+ RespFarmaciaPacCronico.idReceta_2;

                                var recpdf1 = await GenerarRecetaOrdenMedica((int)RespFarmaciaPacCronico.idCuentaAtencion_1, (int)RespFarmaciaPacCronico.idReceta_1, "F");
                                var recpdf2 = await GenerarRecetaOrdenMedica((int)RespFarmaciaPacCronico.idCuentaAtencion_2, (int)RespFarmaciaPacCronico.idReceta_2, "F");
                                hojaCron = await GenerarHojaPacienteCronico(receta.idCuentaAtencion, receta.idReceta);

                                var hojaCron1 = await GenerarHojaPacienteCronico((int)RespFarmaciaPacCronico.idCuentaAtencion_1, (int)RespFarmaciaPacCronico.idReceta_1);
                                var hojaCron2 =  await GenerarHojaPacienteCronico((int)RespFarmaciaPacCronico.idCuentaAtencion_2, (int)RespFarmaciaPacCronico.idReceta_2);



                            }
                            else { hojaCron = false; }

                           
                            


                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Farmacia: " + idRecetaFarmacia;
                    }

                   
                    #endregion

                    #region RecetaFarmaciaAntimicrobiano
                    if (idRecetaFarmaciaAntimicrobiano == 0 && lstobjFarmaciaAntimicrobiano.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                        receta.esRecetaAntimicrobiano = recetaAntimicrobiano;
                        receta.esRecetaIntervencionSanitaria = 0;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaFarmaciaAntimicrobiano = receta.idReceta;
                        respFarmaciaAntimicrobiano = true;

                        if (recetaAntimicrobiano == 1)
                        {
                            DataSet respAntimicrobiano = null;
                            DalAntimicrobianos dalAntimicrobiano = new DalAntimicrobianos();
                            gestionAntimicrobiano.IdReceta = receta.idReceta;
                            var lstobjCondicion = JsonConvert.DeserializeObject<List<SolicitudCondicionAntimicrobiano>>(gestionAntimicrobiano.CondicionPaciente);
                            if(gestionAntimicrobiano.GenerarSolicitudAntimicrobiano == 1)
                            {
                                respAntimicrobiano = await dalAntimicrobiano.GuardarSolicitudAntimicrobiano(gestionAntimicrobiano, lstobjCondicion, idUsuario);
                            }                            
                        }
                    }
                    else
                    {
                        if (idRecetaFarmaciaAntimicrobiano > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaFarmacia);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaFarmaciaAntimicrobiano);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                            receta.idReceta = idRecetaFarmaciaAntimicrobiano;
                            receta.esRecetaAntimicrobiano = recetaAntimicrobiano;
                            receta.esRecetaIntervencionSanitaria = 0;
                            //respFarmacia = daoRecetas.ModifcarReceta(receta);
                            respFarmaciaAntimicrobiano = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI

                            if (recetaAntimicrobiano == 1)
                            {
                                DataSet respAntimicrobiano = null;
                                DalAntimicrobianos dalAntimicrobiano = new DalAntimicrobianos();
                                gestionAntimicrobiano.IdReceta = receta.idReceta;
                                var lstobjCondicion = JsonConvert.DeserializeObject<List<SolicitudCondicionAntimicrobiano>>(gestionAntimicrobiano.CondicionPaciente);
                                if (gestionAntimicrobiano.GenerarSolicitudAntimicrobiano == 1)
                                {
                                    respAntimicrobiano = await dalAntimicrobiano.GuardarSolicitudAntimicrobiano(gestionAntimicrobiano, lstobjCondicion, idUsuario);
                                }                                    
                            }
                        }
                        else
                        {
                            respFarmaciaAntimicrobiano = false;
                        }
                    }

                    if (respFarmaciaAntimicrobiano == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respFarmacia = daoRecetas.InsertaRecetaDetalle(lstobjFarmacia, idRecetaFarmacia);
                            respFarmaciaAntimicrobiano = await daoRecetas.InsertaRecetaDetalleV2(lstobjFarmaciaAntimicrobiano, idRecetaFarmaciaAntimicrobiano);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaFarmaciaAntimicrobiano, "F");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Farmacia Antimic.: " + idRecetaFarmaciaAntimicrobiano;
                    }
                    #endregion

                    #region RecetaFarmaciaIntervencionSanitaria
                    if (idRecetaFarmaciaIntervencionSanitaria == 0 && lstobjFarmaciaIntervencionSanitaria.Count > 0)
                    {
                        estadoReceta = 1;
                        receta.fechaReceta = fechaReceta;
                        receta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                        receta.esRecetaIntervencionSanitaria = recetaIntervencionSanitaria;
                        receta.esRecetaAntimicrobiano = 0;
                        receta.idObstetra = objreceta.idObstetra;
                        receta.idCoordinadorIS = objreceta.idCoordinadorIS;
                        receta.idComponenteIS = objreceta.idComponenteIS;
                        receta.idSubComponenteIS = objreceta.idSubComponenteIS;
                        receta.idDiagnosticoIS = objreceta.idDiagnosticoIS;
                        receta.ObservacionesIS = objreceta.ObservacionesIS;
                        ////////KHOYOSI//////////////////////
                        if (nroEvaluacion > 0)
                        {
                            //receta = daoRecetas.RegistrarRecetaPorNroEvaluacion(receta, nroEvaluacion);
                            receta = await daoRecetas.RegistrarRecetaPorNroEvaluacionV2(receta, nroEvaluacion);           //KHOYOSI
                        }
                        else
                        {
                            //receta = daoRecetas.RegistrarReceta(receta);
                            receta = await daoRecetas.RegistrarRecetaV2(receta);           //KHOYOSI
                        }
                        /////////////////////////////////////////
                        idRecetaFarmaciaIntervencionSanitaria = receta.idReceta;
                        respFarmaciaIntervencionSanitaria = true;

                    }
                    else
                    {
                        if (idRecetaFarmaciaIntervencionSanitaria > 0)
                        {
                            DataSet lsRx = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaFarmacia);
                            lsRx = await daoRecetas.ListaRecetaCabeceraByIdV2(idRecetaFarmaciaIntervencionSanitaria);           //KHOYOSI

                            foreach (DataRow dr in lsRx.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            receta.idEstado = estadoReceta;
                            receta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                            receta.idReceta = idRecetaFarmaciaIntervencionSanitaria;
                            receta.esRecetaIntervencionSanitaria = recetaIntervencionSanitaria;
                            receta.esRecetaAntimicrobiano = 0;
                            receta.idObstetra = objreceta.idObstetra;
                            receta.idCoordinadorIS = objreceta.idCoordinadorIS;
                            receta.idComponenteIS = objreceta.idComponenteIS;
                            receta.idSubComponenteIS = objreceta.idSubComponenteIS;
                            receta.idDiagnosticoIS = objreceta.idDiagnosticoIS;
                            receta.ObservacionesIS = objreceta.ObservacionesIS;
                            //respFarmacia = daoRecetas.ModifcarReceta(receta);
                            respFarmaciaIntervencionSanitaria = await daoRecetas.ModifcarRecetaV2(receta);           //KHOYOSI

                            //if (recetaIntervencionSanitaria == 1)
                            //{
                            //    DataSet respIntervencionSanitaria = null;
                            //    DalAntimicrobianos dalAntimicrobiano = new DalAntimicrobianos();
                            //    respIntervencionSanitaria.IdReceta = receta.idReceta;
                            //    var lstobjCondicion = JsonConvert.DeserializeObject<List<SolicitudCondicionAntimicrobiano>>(gestionAntimicrobiano.CondicionPaciente);
                            //    respAntimicrobiano = await dalAntimicrobiano.GuardarSolicitudAntimicrobiano(gestionAntimicrobiano, lstobjCondicion, idUsuario);
                            //}
                        }
                        else
                        {
                            respFarmaciaIntervencionSanitaria = false;
                        }
                    }

                    if (respFarmaciaIntervencionSanitaria == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respFarmacia = daoRecetas.InsertaRecetaDetalle(lstobjFarmacia, idRecetaFarmacia);
                            respFarmaciaIntervencionSanitaria = await daoRecetas.InsertaRecetaDetalleV2(lstobjFarmaciaIntervencionSanitaria, idRecetaFarmaciaIntervencionSanitaria);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(receta.idCuentaAtencion, idRecetaFarmaciaIntervencionSanitaria, "F");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Farmacia Int. Sanitaria: " + idRecetaFarmaciaIntervencionSanitaria;
                    }
                    #endregion

                    string recetasId = idRecetaRx + "," + idRecetaPatoClinica + "," + idRecetaAnaPatologica + "," + idRecetaBancoSangre + "," + idRecetaEcoGene + "," + idRecetaEcoObs + "," + idRecetaEcoObsProc + "," + idRecetaFarmacia + "," + idRecetaFarmaciaAntimicrobiano + "," + idRecetaFarmaciaIntervencionSanitaria + "," + idRecetaInterconsulta + "," + idRecetaTomografia + "," + idRecetaSolicitudCQx;
                    DataSet recetasMultiple = await daoRecetas.ListaRecetaCabeceraPorMultipleId(recetasId);

                    return Json(new { rpt = true, msjReceta = mensajeRectas, session = true, objRecetas = recetasMultiple.Tables[0],
                        lrcRx = idRecetaRx, lrcPatoClin = idRecetaPatoClinica, lrcAnaPato = idRecetaAnaPatologica, lrcBancoS = idRecetaBancoSangre,
                        lrcEcoGene = idRecetaEcoGene, lrcEcoObst = idRecetaEcoObs, lrcEcoObstProc = idRecetaEcoObsProc, 
                        lrcFarmacia = idRecetaFarmacia, lrcFarmaciaAntimicrobiano = idRecetaFarmaciaAntimicrobiano, lrcFarmaciaIntervencionSanitaria = idRecetaFarmaciaIntervencionSanitaria,
                        lrcInterconsulta = idRecetaInterconsulta, lrcTomografia = idRecetaTomografia, lrcSolicitudCQx = idRecetaSolicitudCQx,
                        //url = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion = 1223, idReceta = 2321, tipo="REC-PC", idUsuario, usuarioname="KHOYOSI" }, "http")
                        url = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion = (int)receta.idCuentaAtencion, idReceta = (int)receta.idReceta, tipo="REC-PC", idUsuario, usuarioname="KHOYOSI" }, "http")
                    });

                }
                else
                {
                    return Json(new { rpt = false, msjReceta = "Verifique sus permisos", session = true, });
                }


            }
            catch (Exception ex)
            {
                return Json(new { rpt = false, msjReceta = "Error al registrar," + ex.Message + ".", session = true, });
                
            }


        }

        [HttpPost]
        public async  Task<ActionResult> ListarRecetas(int nroReceta, int nroCuenta, string nroDni,int nroHistoria, string apellidoPaterno, string apellidoMaterno, int idServicioGeneral)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRc;

            DalRecetas daoRecetas = new DalRecetas();

            listaRc = await daoRecetas.ListarRecetas( nroReceta,  nroCuenta,  nroDni,  nroHistoria,  apellidoPaterno,  apellidoMaterno, idServicioGeneral);

            return Json(new { listaRecetas = listaRc,session=true });

        }

        [HttpPost]
        public ActionResult ListaRecetaCabeceraById(int idReceta)//trae todo el detalle
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaReceta;
            DalRecetas daoRecetas = new DalRecetas();

            listaReceta = daoRecetas.ListaRecetaCabeceraById(idReceta);

            return Json(new { lstReceta=listaReceta,session=true });
        }

        [HttpPost]
        public async Task<ActionResult> EliminaReceta(int idReceta, int idServicioGeneral)
        {
            Boolean registraModificaElimina = true;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //RolesItems objRol = null;
            //if (idServicioGeneral == 1) //CE
            //{
            //    objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Consultaexterna_Recetas);
            //}
            //if (idServicioGeneral == 2) //EMR
            //{
            //    objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Emergencia_Recetas);
            //}
            //if (idServicioGeneral == 3) //HOSP
            //{
            //    objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Hospitalización_Recetas);
            //}

            // COMENTADO POR QUE NO SE COMO HACER PARA QUE FUNCIONE
            //if (objRol.Agregar == true)
            //{
            //    registraModificaElimina = true;
            //}
            //else
            //{
            //    if (objRol.Modificar == true)
            //    {
            //        registraModificaElimina = true;
            //    }
            //    else
            //    {
            //        registraModificaElimina = false;
            //    }

            //}

            Boolean rpt;
            string msj;
            DalRecetas daoRecetas = new DalRecetas();
            int idUsuario;
            DataSet lsReceta;

            //lsReceta = daoRecetas.ListaRecetaCabeceraById(idReceta);
            lsReceta = await daoRecetas.ListaRecetaCabeceraByIdV2(idReceta);                         //KHOYOSI
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            if (registraModificaElimina)
            {
                if ((Convert.ToInt32(lsReceta.Tables[0].Rows[0]["idEstado"])) == 1)
                {

                    //rpt = daoRecetas.EliminaReceta(idReceta, idUsuario);
                    rpt = await daoRecetas.EliminaRecetaV2(idReceta, idUsuario);                        //KHOYOSI
                    msj = "Se elimino correctamente la receta";
                }
                else
                {
                    msj = "Esta receta no se puede eliminar verifique el estado";
                    rpt = false;
                }

                return Json(new { rpt = rpt, session = true, msj = msj });
            }
            else
            {
                return Json(new { rpt = false, session = true, msj = "Verifique sus permisos" });
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> ListaMedicos()//trae todo el detalle
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaMedicos;
            DalAtenciones daoMedicos = new DalAtenciones();

            listaMedicos = await daoMedicos.ListaMedicos();

            return Json(listaMedicos);
        }

        //RQ0003 RMOREANOC

        [HttpGet]
        public async Task<ActionResult> ListarDosis()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_RecetaDosisSelecionarTodos");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarViasAdministracion()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_RecetasListadoViasAdministracion");
            return Json(lstMetodo);
        }

        [HttpGet]
        public async Task<ActionResult> ListarFrecuencias()
        {
            DataSet lstMetodo;
            DalUtilitario daoCitas = new DalUtilitario();
            lstMetodo = await daoCitas.DevuelveDSCombo("Web_RecetasListadoFrecuencias");
            return Json(lstMetodo);
        }

        [HttpPost]
        public async Task<ActionResult> ListarViasAdministracionbyProducto(int idProducto)
        {
            DataSet lstVia;
            DalRecetas daoRecetas = new DalRecetas();
            lstVia = await daoRecetas.DevuelveViaxidProducto(idProducto);
            return Json(lstVia);
        }

        //FIN RQ0003

        //////////////////KHOYOSI/////////////////////
        public async Task<ActionResult> ListaRecetasCabeceraIdCuentaAtencionPorNroEvaluacion(int idCuentaAtencion, int nroEvaluacion, int idServicio, int idMedico)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.ListaRecetasCabeceraIdCuentaAtencionPorNroEvaluacion(idCuentaAtencion, nroEvaluacion, idServicio, idMedico); //
                                                                                                                                                         // J0 AWAIT SENTENCES

            return Json(listaRecetas);
        }
        /// //////////////////////////////////////////////////////
        /// 
        //////////////////JDELGADO011/////////////////////
        [HttpPost]
        public async Task<ActionResult> SeleccionaRecetaDetalleInterconsultaByIdReceta(int idReceta)
        {
            DataSet listaRecetas;
            DalRecetas daoRecetas = new DalRecetas();

            listaRecetas = null;

            listaRecetas = await daoRecetas.SeleccionaRecetaDetalleInterconsultaByIdReceta(idReceta);

            return Json(listaRecetas);
        }
        /// //////////////////////////////////////////////////////
        ///  <summary>
        /// //////////////////////////////////////////////////////
        /// </summary>
        /// <param name="idCuentaAtencion"></param>
        /// <param name="idReceta"></param>
        /// <param name="tipo"></param>
        /// <returns></returns>
        /// 
        


        //////////////////////////KHOYOSI (RECETAS EN PDF)/////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> GenerarRecetaPdf(int idCuentaAtencion, int idReceta, string tipo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            String htmlTablaDetalle, htmlTablaItem, telefono, nombre, direccion, html/*, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia, strInterconsulta*/;
            html = "";
            htmlTablaItem = "";
            string generacion_pdf = "";
            string sWebRootFolder = "";
            var path = "";
            //string tipo;
            bool resulfirma = false;
            //bool resp = false;

            bool farmaciaHospi = false;
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalParametros daoParametros = new DalParametros();
            Comun.ClUtilirario cl = new Comun.ClUtilirario();
            Conexion con = new Conexion();

            sWebRootFolder = con.ObtenerServidorArchivos();
            tipo = "REC-" + tipo;
            path = Path.Combine(sWebRootFolder, "Recetas", (idCuentaAtencion.ToString() + idReceta.ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205); // JDELGADO J0 AWAIT SENTENCE
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206); // JDELGADO J0 AWAIT SENTENCE
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207); // JDELGADO J0 AWAIT SENTENCE
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            string idAtencion = "0";
            //String diagnosticos = "";

            //strRx = "";
            //strEcoGene = "";
            //strEcoObs = "";
            //strAnaPatolo = "";
            //strPatoloClinica = "";
            //strBs = "";
            //strFarmacia = "";
            //strInterconsulta = "";

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

            // jdelgado
            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);
            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico); // JDELGADO J0 AWAIT SENTENCE

            string htmldiagnosticosDetalle = "";
            string htmldiagnosticostable = "";
            string htmldiagnosticosCE = "";

            foreach (DataRow dr in lsDiagnosticos.Tables[0].Rows)
            {
                htmldiagnosticosDetalle = htmldiagnosticosDetalle + "<tr><td>" + dr["codigoCIE10"].ToString() + "</td><td>" + dr["descripcion"].ToString() + "</td></tr>";

            };

            htmldiagnosticosCE = htmldiagnosticosCE + "<hr><b>Diagnositicos</b>";
            htmldiagnosticosCE = htmldiagnosticosCE + "<table width='25%'><tr><td><b>CIE 10</b></td><td><b>Descripcion</b></td></tr>" + htmldiagnosticosDetalle + "</table><br>";
            // jdelgado

            string fechaRecetaAux = "";
            //Substring(0, 10);

            string tipoFormato = "0";           //KHOYOSI

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {
                fechaRecetaAux = dr["fechaReceta"].ToString();
                fechaRecetaAux = fechaRecetaAux.Substring(0, 10);

                /////////////////////KHOYOSI///////////////////////                
                var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
                tipoFormato = AppName.ToString();
                //////////////////////////////////////////////////

                //if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && (/*lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ||*/ lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "3" || lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "4"))     //KHOYOSI (COMENTADO)
                if ((dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia)) && (tipoFormato == "A4"))        //KHOYOSI
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


                //jdelgado

                html = html + htmldiagnosticosCE;
                //jdelgado

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

                // tomografia jdelgado
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaTomografia))
                {
                    html = html + "&nbsp;&nbsp Servicio: (Tomografía)" + "Nro.Receta:" + dr["idReceta"].ToString() + "<hr>";
                    htmlTablaItem = htmlTablaItem + "<tr><td width='5%'></td><td>Concepto</td><td>Cantidad</td></tr>";
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaTomografia); // JDELGADO J0 AWAIT SENTENCE
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
                    //if ((/*lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "1" &&*/ lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "2" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "3" && lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() != "4"))       //KHOYOSI (COMENTADO)
                    if (tipoFormato != "A4")        //KHOYOSI
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
            };

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
            };
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
                //resp = true;
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



        public async Task<ActionResult> GenerarRecetaPdfV2(int idCuentaAtencion, int idReceta, string tipo)
        {
            string generacion_pdf = "";
            string sWebRootFolder = "";
            var path = "";
            //string tipo;
            bool resulfirma = false;
            //bool resp = false;
            Conexion con = new Conexion();
            Comun.ClUtilirario cl = new Comun.ClUtilirario();
            HtmlToPdf ohtml = new HtmlToPdf();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            int idUsuario;
            string usuarioname;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            usuarioname = HttpContext.Session.GetString("usuario");

            //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;

            //SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

            sWebRootFolder = con.ObtenerServidorArchivos();
            tipo = "REC-" + tipo;
            path = Path.Combine(sWebRootFolder, "Recetas", (idCuentaAtencion.ToString() + idReceta.ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"));


            PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

            PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
            ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
            ohtml.Options.PdfPageSize = pageSize;
            ohtml.Options.MarginLeft = 0;
            ohtml.Options.MarginRight = 0;
            ohtml.Options.MarginTop = 0;
            ohtml.Options.MarginBottom = 0;
            ohtml.Options.WebPageWidth = 765;
            ohtml.Options.WebPageHeight = 1050;
            //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

            //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
            /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
            var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
            var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
            string IpPrivada = AppNameIp1.ToString();
            string IpPublica = AppNameIp2.ToString();
            /////////////////////////////////////////////////////////////////////////////
            string Ruta = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion, idReceta, tipo, idUsuario, usuarioname } , "http");
            Ruta = Ruta.Replace(IpPublica, IpPrivada);

            PdfDocument obPdfDoc = ohtml.ConvertUrl(Ruta);

            obPdfDoc.Save(path);
            generacion_pdf = "Ok";

            if (generacion_pdf == "Ok")
            {
                //verificar creacion 
                Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idReceta.ToString()));
                //quita creacion 
                //Espera resultado de la tarea, no termina hasta termine
                resulfirma = await Tbol;
                //resp = true;
            }

            return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });
            

        }

        [HttpPost]
        public async Task<bool> GenerarRecetaOrdenMedica(int idCuentaAtencion, int idReceta, string tipo)
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
                string usuarioname = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;

                if(tipo == "CQx")
                {
                    pageHtml = Url.Action("FormatoRecetaSolicitudCQx", "Receta", new { idCuentaAtencion, idReceta, tipo, idUsuario, usuarioname }, "http");
                } else
                {
                    pageHtml = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion, idReceta, tipo, idUsuario, usuarioname }, "http");
                }
                
                

                if(tipo == "F")
                {
                    DataSet lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
                    /////////////////////KHOYOSI///////////////////////                
                    var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
                    string tipoFormato = AppName.ToString();
                    //////////////////////////////////////////////////
                    pdf.tipoDocumento = tipoFormato;
                } else if(tipo == "CQx")
                {
                    pdf.tipoDocumento = "A4";
                }
                else
                {
                    pdf.tipoDocumento = "Ticket";
                }
                                
                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idReceta, 0, "REC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        [HttpPost]
        public async Task<bool> GenerarRecetaOrdenMedicaEsteVale(int idCuentaAtencion, int idReceta, string tipo)
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
                string usuarioname = HttpContext.Session.GetString("usuario");

                stringHtml = null;
                pageHtml = null;
                pageHtml = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion, idReceta, tipo, idUsuario, usuarioname }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idReceta, 0, "REC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


        //public async Task<ActionResult> GenerarRecetaPdfV3(int idCuentaAtencion, int idReceta, string tipo)
        //{
        //    string generacion_pdf = "";
        //    var path = "";
        //    //string tipo;
        //    bool resulfirma = false;
        //    bool resp = false;
        //    Conexion con = new Conexion();
        //    Comun.ClUtilirario cl = new Comun.ClUtilirario();
        //    Comun.UtilitarioController utilitarioController = new Comun.UtilitarioController();

        //    HtmlToPdf ohtml = new HtmlToPdf();

        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return View("Login");
        //    }

        //    DataSet lsAtencion;

        //    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
        //    string usuarioname = HttpContext.Session.GetString("usuario");
        //    string nroHistoria;

        //    DalAtenciones daoAtenciones = new DalAtenciones();

        //    lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);

        //    nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
        //    //html = html + strRx + "<br>" + strEcoGene + "<br>" + strEcoObs + "<br>" + strAnaPatolo + "<br>" + strPatoloClinica + "<br>" + strBs;

        //    //SelectPdf.PdfDocument obPdfDoc = ohtml.ConvertHtmlString(html);

        //    tipo = "REC-" + tipo;

        //    PdfPageSize pageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);

        //    PdfPageOrientation pdfOrientationPortrait = (PdfPageOrientation)Enum.Parse(typeof(PdfPageOrientation), "Portrait", true);
        //    ohtml.Options.PdfPageOrientation = pdfOrientationPortrait;
        //    ohtml.Options.PdfPageSize = pageSize;
        //    ohtml.Options.MarginLeft = 0;
        //    ohtml.Options.MarginRight = 0;
        //    ohtml.Options.MarginTop = 0;
        //    ohtml.Options.MarginBottom = 0;
        //    ohtml.Options.WebPageWidth = 765;
        //    ohtml.Options.WebPageHeight = 1050;
        //    //ohtml.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;

        //    //string Ruta = Url.Action("InformeEvaluacion", "EvaluacionNeonatal", new { area = "Emergencia", idAtencion, idServicio, tipo = "NEO", usuario }, "http");
        //    /////////////////////KHOYOSI - OBTENER DIRECCIONES IPs///////////////////////                
        //    var AppNameIp1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPrivada");
        //    var AppNameIp2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:IpPublica");
        //    string IpPrivada = AppNameIp1.ToString();
        //    string IpPublica = AppNameIp2.ToString();
        //    /////////////////////////////////////////////////////////////////////////////
        //    string Ruta = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion, idReceta, tipo, idUsuario, usuarioname }, "http");
        //    Ruta = Ruta.Replace(IpPublica, IpPrivada);

        //    //path = Path.Combine(sWebRootFolder, "Recetas", );


        //    //Task<bool> Tbol = cl.UploadFile(path, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idReceta.ToString()));

        //    await utilitarioController.GuardarArchivoV2(
        //        nroHistoria + "/ConsultaExterna/" + idCuentaAtencion + "/Recetas",
        //        (idCuentaAtencion.ToString() + idReceta.ToString() + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + tipo + ".pdf"),
        //        ohtml, Ruta, Int32.Parse(idCuentaAtencion.ToString()), tipo, Int32.Parse(idReceta.ToString())
        //    );


        //    return Json(new { estadoCreacion = generacion_pdf, ruta = path, resulfirma = resulfirma });


        //}


        [HttpGet]
        public async Task<ActionResult> FormatoRecetaOrden(int idCuentaAtencion, int idReceta, string tipo, string idUsuario, string usuarioname)
        {
            String /*htmlTablaDetalle, htmlTablaItem,*/ telefono, nombre, direccion/*, html, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia, strInterconsulta*/;
            //html = "";
            //htmlTablaItem = "";

            //bool farmaciaHospi = false;
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsRecetas, lsRecetasDestalle;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalRecetas daoRecetas = new DalRecetas();
            DalDiagnostico daoDiagnostico = new DalDiagnostico();
            DalParametros daoParametros = new DalParametros();
                       
            
            lsParametros = await daoParametros.SeleccionaFilaParametro2(205);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207);
            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            string idAtencion = "0";
            string nroEvaluacion = "0";
            string idServicio = "0";
            string idTipoServicio = "0";

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            lsRecetas = await daoRecetas.ListaRecetaCabeceraById2(idReceta); 


            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;
            @ViewBag.FechaVigencia = lsRecetas.Tables[0].Rows[0]["fechaVigencia"].ToString();
            @ViewBag.FechaReceta = lsRecetas.Tables[0].Rows[0]["FechaReceta"].ToString();
            @ViewBag.Paciente = lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString();
            @ViewBag.Historia = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.TipoPlan = lsAtencion.Tables[0].Rows[0]["planA"].ToString();
            @ViewBag.Edad = lsAtencion.Tables[0].Rows[0]["edadPaciente"].ToString();
            @ViewBag.Cuenta = lsAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
            @ViewBag.TipoServicio = lsRecetas.Tables[0].Rows[0]["nomTipoServicio"].ToString();
            @ViewBag.Consultorio = lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString();
            @ViewBag.NroReceta = lsRecetas.Tables[0].Rows[0]["idReceta"].ToString();
            @ViewBag.Medico = lsRecetas.Tables[0].Rows[0]["Medico"].ToString();
            @ViewBag.otrosMedicamentos = lsRecetas.Tables[0].Rows[0]["otrosMedicamentos"].ToString();

            nroEvaluacion = lsRecetas.Tables[0].Rows[0]["NroEvaluacion"].ToString() == "" ? "0" : lsRecetas.Tables[0].Rows[0]["NroEvaluacion"].ToString();
            idServicio = lsRecetas.Tables[0].Rows[0]["idServicioReceta"].ToString();
            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
            idTipoServicio = lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString();
            @ViewBag.IdTipoServicio = idTipoServicio;


            //////////////COMENTADO POR KHOYOSI/////////////////////////////////////////////////////////////////////////////////////////
            //int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);

            ////////if (Convert.ToInt32(nroEvaluacion) > 0)            
            //if (nroEvaluacion != "" && nroEvaluacion != null && Convert.ToInt32(nroEvaluacion) > 0)
            //{
            //    lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(Convert.ToInt32(idAtencion), clasificacionDiagnostico, Convert.ToInt32(idServicio), Convert.ToInt32(nroEvaluacion));
            //} else
            //{
            //    lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico);
            //}
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            
            lsDiagnosticos = await daoDiagnostico.ListarDiagnosticosRecetasPorAtencion(Convert.ToInt32(idAtencion), Convert.ToInt32(nroEvaluacion));


            @ViewBag.Diagnosticos = lsDiagnosticos.Tables[0];


            string tipoFormato = "0";           //KHOYOSI
            string tipoReceta = "";
            string tipoRecetaFarmacia = "";
            lsRecetasDestalle = null;

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {

                /////////////////////KHOYOSI///////////////////////                
                var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
                tipoFormato = AppName.ToString();
                var AppVistaOrdenesMedica = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoVistaOrdenesMedica");
                string VistaOrdenesMedica = AppVistaOrdenesMedica.ToString();
                //////////////////////////////////////////////////

                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Rayos X";
                }

                //eco obste
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetrica);
                    tipoReceta = "Orden";
                    
                    if (VistaOrdenesMedica == "1") {
                        @ViewBag.Servicio = "Ecografia Obstétrica";
                    }
                    if (VistaOrdenesMedica == "2") {
                        @ViewBag.Servicio = "Ecografia Medicina Fetal";
                    } 
                }

                //eco obste procedimientos
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetricaProcedimientos))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogObstetricaProcedimientos);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Procedimiento Medicina Fetal";
                }

                //eco geenral
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaEcogGeneral);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Ecografia General";
                }

                //patoclini
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaPatologiaClinica);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Patologica Clinica";
                }

                //anatalomiaPa
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaAnatomiaPatologica1);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Anatomia Patologica";
                }

                //sangre
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaBancoSangre1);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Banco de Sangre";
                }

                // tomografia jdelgado
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaTomografia))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaTomografia);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Tomografía";
                }

                //interconsulta añadido por jdelgado011
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaInterconsulta);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "Interconsulta";
                }
                
                
                
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaSolicitudCQx))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaSolicitudCQx);
                    tipoReceta = "Orden";
                    @ViewBag.Servicio = "SolicitudCQX";
                }

                //farmacia
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia);
                    if(Convert.ToInt32(dr["EsRecetaAntimicrobiano"].ToString()) == 1)
                    {
                        tipoRecetaFarmacia = " ANTIMICROBIANO RESTRINGIDO";
                    }

                    if (Convert.ToInt32(dr["EsRecetaIntervencionSanitaria"].ToString()) == 1)
                    {
                        tipoRecetaFarmacia = " INTERVENCIÓN SANITARIA";
                    }

                    tipoReceta = "Receta";
                    @ViewBag.Servicio = "Farmacia";
                }

                @ViewBag.DetalleReceta = lsRecetasDestalle.Tables[0];

            }

                       

            @ViewBag.Usuario = usuarioname;
            //@ViewBag.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            @ViewBag.FechaCreacion = lsRecetas.Tables[0].Rows[0]["FechaRecetaImpresion"].ToString();

            @ViewBag.CodeFirma = lsRecetas.Tables[0].Rows[0]["code"];

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

            if (tipoReceta == "Receta")
            {
                @ViewBag.TituloNro = "N° Receta";
                @ViewBag.TituloDoc = "RECETA MÉDICA" + tipoRecetaFarmacia;
                if (tipoFormato == "A4")
                {
                    return PartialView("~/Views/Recetas/Plantillas/FormatoA4.cshtml");
                }
                if (tipoFormato == "Ticket")
                {
                    return PartialView("~/Views/Recetas/Plantillas/FormatoTicket.cshtml");
                }
            }

            if (tipoReceta == "Orden")
            {
                @ViewBag.TituloNro = "N° Orden";
                @ViewBag.TituloDoc = "ORDEN MÉDICA";
                return PartialView("~/Views/Recetas/Plantillas/FormatoTicket.cshtml");
            }

            return PartialView("");
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///


        [HttpGet]
        public async Task<ActionResult> ListarProcedimientosInterconsulta() // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalRecetas dalRecetas = new DalRecetas();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalRecetas.ListarProcedimientosInterconsulta();
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CambiarEstadoRecetaDetalleInterconsulta(int idReceta, int idProducto, int idEstado) // JDELGADO002
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet dataSet = null;
            DalRecetas dalRecetas = new DalRecetas();

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalRecetas.CambiarEstadoRecetaDetalleInterconsulta(idReceta, idProducto, idEstado);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        public async Task<ActionResult> FormatoRecetaSolicitudCQx(int idCuentaAtencion, int idReceta, string tipo, string idUsuario, string usuarioname)
        {

            DalCentroQuirurgico dalCentroQuirurgico = new DalCentroQuirurgico();
            DalRecetas daoRecetas = new DalRecetas();
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            DataSet lsRecetas, lsAtencion;

            DataSet dataSetCQx = await dalCentroQuirurgico.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(idReceta.ToString());

            int IdAtencion = Int32.Parse(dataSetCQx.Tables[0].Rows[0]["IdAtencion"].ToString());

            DataSet Diagnosticos = await daoDiagnostico.DiagnosticosSeleccionarPorAtencion(IdAtencion, 8);
            DataTable dtDx = Diagnosticos.Tables[0];


            @ViewBag.FechaSolicitud = dataSetCQx.Tables[0].Rows[0]["FechaSolicitud"].ToString();
            @ViewBag.HoraSolicitud = dataSetCQx.Tables[0].Rows[0]["HoraSolicitud"].ToString();
            @ViewBag.FechaAceptada = dataSetCQx.Tables[0].Rows[0]["FechaAceptada"].ToString();
            @ViewBag.HoraAceptada = dataSetCQx.Tables[0].Rows[0]["HoraAceptada"].ToString();
            @ViewBag.FechaSugerida = dataSetCQx.Tables[0].Rows[0]["FechaSugerida"].ToString();
            @ViewBag.HoraSugerida = dataSetCQx.Tables[0].Rows[0]["HoraSugerida"].ToString();


            @ViewBag.ClaseIntervencionCQx = dataSetCQx.Tables[0].Rows[0]["ClaseIntervencionCQx"].ToString();
            @ViewBag.ClasificacionPacienteCQx = dataSetCQx.Tables[0].Rows[0]["ClasificacionPacienteCQx"].ToString();
            @ViewBag.Sexo = dataSetCQx.Tables[0].Rows[0]["Sexo"].ToString();
            @ViewBag.Servicio = dataSetCQx.Tables[0].Rows[0]["servicio"].ToString();

            @ViewBag.Dx = dtDx;


            lsRecetas = await daoRecetas.ListaRecetaCabeceraById2(idReceta);
            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);


            //@ViewBag.NombreInstitucion = nombre;
            //@ViewBag.DireccionInstitucion = direccion;
            //@ViewBag.TelefonoInstitucion = telefono;
            @ViewBag.FechaVigencia = lsRecetas.Tables[0].Rows[0]["fechaVigencia"].ToString();
            @ViewBag.FechaReceta = lsRecetas.Tables[0].Rows[0]["FechaReceta"].ToString();
            @ViewBag.Paciente = lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString();
            @ViewBag.Historia = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.TipoPlan = lsAtencion.Tables[0].Rows[0]["planA"].ToString();
            @ViewBag.Edad = lsAtencion.Tables[0].Rows[0]["edadPaciente"].ToString();
            @ViewBag.Cuenta = lsAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
            @ViewBag.TipoServicio = lsRecetas.Tables[0].Rows[0]["nomTipoServicio"].ToString();
            @ViewBag.Consultorio = lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString();
            @ViewBag.NroReceta = lsRecetas.Tables[0].Rows[0]["idReceta"].ToString();
            @ViewBag.Medico = lsRecetas.Tables[0].Rows[0]["Medico"].ToString();
            //@ViewBag.Edad = dataSetCQx.Tables[0].Rows[0]["edadPaciente"].ToString();
            //@ViewBag.Edad = dataSetCQx.Tables[0].Rows[0]["edadPaciente"].ToString();
            //@ViewBag.Edad = dataSetCQx.Tables[0].Rows[0]["edadPaciente"].ToString();



            return PartialView("~/Views/CentroQuirurgico/Plantillas/InformeSolicitudCQx.cshtml");
        }


        [HttpPost]
        public async Task<ActionResult> RecetasFiltrarPorRangoFechas(string NroDocumento, string NroHistoriaClinica, string ApellidoPaterno, string FechaInicio, string FechaFinal, int IdPuntoCarga, int EsAntimicrobiano)
        {
            DataSet dataSet = null;
            DalRecetas dalRecetas = new DalRecetas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalRecetas.RecetasFiltrarPorRangoFechas(NroDocumento, NroHistoriaClinica, ApellidoPaterno, FechaInicio, FechaFinal, IdPuntoCarga, EsAntimicrobiano); ;
                return Json(new { session = true, estado = true, msg = "", lstData = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, lstData = dataSet });
            }

        }

        [HttpPost]
        public async Task<ActionResult> RecetasByCuentaByEstado(int idCuentaAtencion, int idEstado)
        {
            DataSet dataSet = null;
            DalRecetas dalRecetas = new DalRecetas();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalRecetas.RecetasByCuentaByEstado(idCuentaAtencion, idEstado); ;
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, lstData = dataSet });
            }

        }

        /// <summary>
        /// Atiende el RF 10 de SISAMAR, 04/Mar/2026, OZUMARAN
        /// </summary>
        /// <param name="idPaciente"></param>
        /// <param name="idProducto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> ValidarMedicamentoRecientePaciente(int idPaciente, int idProducto)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            const string mensajeAlerta = "Ha utilizado recientemente el mismo medicamento en el paciente."; //msj por defecto.
            int diasVentana = 7; //cant. dias por defecto

            DalParametros dalParametros = new DalParametros();
            DataSet parametroAlerta = await dalParametros.SeleccionaParametroPorCodigo("DIAS_RECETA_RECIENTE");

            if (parametroAlerta != null && parametroAlerta.Tables.Count > 0 && parametroAlerta.Tables[0].Rows.Count > 0)
            {
                int.TryParse(parametroAlerta.Tables[0].Rows[0]["ValorInt"]?.ToString(), out diasVentana);
                if (diasVentana <= 0)
                {
                    diasVentana = 7;
                }
            }

            DalRecetas dalRecetas = new DalRecetas();
            DataSet dataSet = await dalRecetas.ValidarMedicamentoRecientePaciente(idPaciente, idProducto, diasVentana);

            bool mostrarAlerta = false;
            string fechaUltimoUso = string.Empty;
            if (dataSet != null && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                string existe = dataSet.Tables[0].Rows[0]["Existe"]?.ToString();
                mostrarAlerta = existe == "1" || existe?.ToLower() == "true";

                if (DateTime.TryParse(dataSet.Tables[0].Rows[0]["FechaUltimoUso"]?.ToString(), out DateTime fecha))
                {
                    fechaUltimoUso = fecha.ToString("dd/MM/yyyy HH:mm");
                }
            }

            return Json(new
            {
                estado = true,
                mostrarAlerta,
                tituloAlerta = "Cuidado",
                mensajeAlerta,
                fechaUltimoUso,
                diasVentana,
                session = true
            });
        }

        public async Task<bool> GenerarHojaPacienteCronico(int idCuentaAtencion, int idRecetaFarm)
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
                pageHtml = Url.Action("FormatoCronico", "Atencion", new { area = "ConsultaExterna", idCuentaAtencion, usuario }, "http");
                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idRecetaFarm, 0, "CE-APC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                return false;
            }
        }

    }

}