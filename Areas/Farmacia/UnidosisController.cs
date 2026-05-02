using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using System.Diagnostics;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using QRCoder;
using System.Drawing;
using System.IO;

using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Farmacia
{
    public class UnidosisController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarRecetas(int nroReceta, int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaRc;

            DalUnidosis daoUnidiosis = new DalUnidosis();

            listaRc = await daoUnidiosis.ListarRecetas(nroReceta, nroCuenta, nroDni, nroHistoria, apellidoPaterno, apellidoMaterno);

            return Json(new { listaRecetas = listaRc, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarRecetaCabecera(int idReceta)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet listaReceta;
            DalUnidosis daoUnidosis = new DalUnidosis();

            listaReceta = await daoUnidosis.SeleccionarRecetaCabecera(idReceta);

            return Json(new { lstReceta = listaReceta, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarFarmaciasUnidosisTodos()
        {
            DataSet resultado;
            DalUnidosis dao = new DalUnidosis();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resultado = null;

            resultado = await dao.ListarFarmaciasUnidosisTodos();

            return Json(new { respuesta = resultado, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ListarProductosUnidosisTodos()
        {
            DataSet resultado;
            DalUnidosis dao = new DalUnidosis();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resultado = null;

            resultado = await dao.ListarProductosUnidosisTodos();

            return Json(new { respuesta = resultado, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> GeneraPreUnidosisEnFormaAutomatica()
        {
            DataSet resultado;
            DalUnidosis dao = new DalUnidosis();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resultado = null;

            resultado = await dao.GeneraPreUnidosisEnFormaAutomatica(idUsuario);

            return Json(new { respuesta = resultado, session = true });
        }



        [HttpPost]
        public async Task<ActionResult> RegistraRecetas(
            string lstRecetaFarmacia, int idRecetaFarmacia,           
            Receta objreceta, int idServicioGeneral)         
        {

            try
            {
                Boolean registraModificaElimina;
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return Json(new { session = false });
                }
                               
                registraModificaElimina = true;         //KHOYOSI       (AGREGADO POR MIENTRAS)

                //valido cuenta
                DataSet lstCuenta;
                DalAtenciones daoCitas = new DalAtenciones();
                
                lstCuenta = await daoCitas.ListaAtencionEstadosCompletosByIdCuentaV2(objreceta.idCuentaAtencion);           //KHOYOSI

                if ((Convert.ToInt32(lstCuenta.Tables[0].Rows[0]["idEstado"])) != 1)
                {
                    return Json(new { rpt = false, msjReceta = "El estado de Cuenta no se encuentra ABIERTO", session = true, });
                }
                //cierra validacion
                string mensajeRectas;
                Boolean respFarmacia;

                //Receta receta = new Receta();
                DalRecetas daoRecetas = new DalRecetas();
                DalParametros daoParametros = new DalParametros();
                int estadoReceta;

                var lstobjFarmacia = JsonConvert.DeserializeObject<List<RecetaDetalle>>(lstRecetaFarmacia);
                
                DataSet lsParametros = new DataSet();
                               
                estadoReceta = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                mensajeRectas = "";

                int idUsuario;

                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                if (int.Parse(HttpContext.Session.GetString("idmed")) > 0)
                {
                    objreceta.idMedico = int.Parse(HttpContext.Session.GetString("idmed"));
                }

                //receta.fechaVigencia = objreceta.fechaVigencia;
                //receta.idCuentaAtencion = objreceta.idCuentaAtencion;
                //receta.idServicioReceta = objreceta.idServicioReceta;                
                //receta.idMedico = objreceta.idMedico;
                objreceta.idUsuario = idUsuario;

                if (registraModificaElimina)
                {
                    #region RecetaFarmacia
                    if (objreceta.idReceta == 0 && lstobjFarmacia.Count > 0)
                    {
                        estadoReceta = 1;
                        //receta.fechaReceta = fechaReceta;
                        objreceta.idEstado = (int)Enumerados.sghRecetaEstados.sighRecetaRegistrada;
                        objreceta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                        ////////KHOYOSI//////////////////////
                        objreceta = await daoRecetas.RegistrarRecetaV2(objreceta);           //KHOYOSI
                        /////////////////////////////////////////
                        //idRecetaFarmacia = objreceta.idReceta;
                        respFarmacia = true;
                    }
                    else
                    {
                        if (objreceta.idReceta > 0)
                        {
                            DataSet lsFarm = new DataSet();
                            //lsRx = daoRecetas.ListaRecetaCabeceraById(idRecetaFarmacia);
                            lsFarm = await daoRecetas.ListaRecetaCabeceraByIdV2(objreceta.idReceta);           //KHOYOSI

                            foreach (DataRow dr in lsFarm.Tables[0].Rows)
                            {
                                estadoReceta = Int32.Parse(dr["idEstado"].ToString());
                            }
                            objreceta.idEstado = estadoReceta;
                            objreceta.idPuntoCarga = (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia;
                            //objreceta.idReceta = objreceta.idReceta;
                            respFarmacia = await daoRecetas.ModifcarRecetaV2(objreceta);           //KHOYOSI
                        }
                        else
                        {
                            respFarmacia = false;
                        }
                    }

                    if (respFarmacia == true)
                    {
                        if (estadoReceta == 1)
                        {
                            //respFarmacia = daoRecetas.InsertaRecetaDetalle(lstobjFarmacia, idRecetaFarmacia);
                            respFarmacia = await daoRecetas.InsertaRecetaDetalleV2(lstobjFarmacia, objreceta.idReceta);           //KHOYOSI
                            var recpdf = await GenerarRecetaOrdenMedica(objreceta.idCuentaAtencion, objreceta.idReceta, "F");        //KHOYOSI -GENERAR PDF DE RECETA
                        }
                        mensajeRectas = mensajeRectas + "<br> Receta de Farmacia: " + objreceta.idReceta;
                    }
                    #endregion

                    string recetasId = objreceta.idReceta + "";
                    DataSet recetasMultiple = await daoRecetas.ListaRecetaCabeceraPorMultipleId(recetasId);

                    return Json(new
                    {
                        rpt = true,
                        msjReceta = mensajeRectas,
                        session = true,
                        objRecetas = recetasMultiple.Tables[0],                        
                        lrcFarmacia = objreceta.idReceta,
                        //url = Url.Action("FormatoRecetaOrden", "Receta", new { idCuentaAtencion = 1223, idReceta = 2321, tipo = "REC-PC", idUsuario, usuarioname = "KHOYOSI" }, "http")
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

                pageHtml = Url.Action("FormatoRecetaOrden", "Unidosis", new { idCuentaAtencion, idReceta, tipo, idUsuario, usuarioname }, "http");

                DataSet lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
                /////////////////////KHOYOSI///////////////////////                
                var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
                string tipoFormato = AppName.ToString();
                //////////////////////////////////////////////////
                pdf.tipoDocumento = tipoFormato;

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                pdf.cookies = HttpContext.Request.Headers["Cookie"].ToString();
                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idReceta, 0, "REC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }


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
            DalParametros daoParametros = new DalParametros();

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
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

            nroEvaluacion = lsRecetas.Tables[0].Rows[0]["NroEvaluacion"].ToString();
            idServicio = lsRecetas.Tables[0].Rows[0]["idServicioReceta"].ToString();
            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
            idTipoServicio = lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString();
            @ViewBag.IdTipoServicio = idTipoServicio;


            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);

            lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico);
            @ViewBag.Diagnosticos = lsDiagnosticos.Tables[0];


            string tipoFormato = "0";           //KHOYOSI
            string tipoReceta = "";
            lsRecetasDestalle = null;

            foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            {

                /////////////////////KHOYOSI///////////////////////                
                var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
                tipoFormato = AppName.ToString();
                var AppVistaOrdenesMedica = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoVistaOrdenesMedica");
                string VistaOrdenesMedica = AppVistaOrdenesMedica.ToString();
                //////////////////////////////////////////////////

                //farmacia
                if (dr["IdPuntoCarga"].ToString() == Convert.ToString((int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia))
                {
                    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaFarmacia);
                    tipoReceta = "Receta";
                    @ViewBag.Servicio = "Farmacia";
                }

                @ViewBag.DetalleReceta = lsRecetasDestalle.Tables[0];

            }

            @ViewBag.Usuario = usuarioname;
            @ViewBag.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

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
                @ViewBag.TituloDoc = "RECETA MÉDICA";
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




    }
}
