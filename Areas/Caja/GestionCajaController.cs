using CapaDatos;
using CapaEntidades;
using iText.Kernel.Pdf;
using iText.Kernel.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QRCoder;
using SiHospCrypKey;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Areas.Comun;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Caja
{
    public class GestionCajaController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListarCajaComprobantesPago(GestionCaja gestioncaja)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet ds;
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                //Boolean hoja;

                int idUsuario;                
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                //ds = await daoGestionCaja.ListarCajaComprobantesPago(gestioncaja, "comprobantes");
                //ds2 = await daoGestionCaja.ListarCajaComprobantesPago(gestioncaja, "notasCredito");
                //ds3 = await daoGestionCaja.ListarCajaComprobantesPago(gestioncaja, "notasDebito");

                ds = await daoGestionCaja.CajaComprobantesPagoListar(gestioncaja);

                //return Json(new { comprobantes = ds , notasCredito = ds2, notasDebito = ds3, session = true, estado = true });
                return Json(new { comprobantes = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = ex });
            }            
        }


        [HttpPost]
        public async Task<ActionResult> SeleccionarEstadoSunatComprobantePago(GestionCaja gestioncaja)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet ds;
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                //Boolean hoja;

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoGestionCaja.SeleccionarEstadoSunatComprobantePago(gestioncaja);
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarEstadoSunatNotasCreditoDebito(GestionCaja gestioncaja)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet ds;
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                //Boolean hoja;

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoGestionCaja.SeleccionarEstadoSunatNotasCreditoDebito(gestioncaja);
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarCajaTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet ds;
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                //Boolean hoja;

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoGestionCaja.ListarCajaTodos();
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarCajaTurnosTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet ds;
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                //Boolean hoja;

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoGestionCaja.ListarCajaTurnosTodos();
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> ListarCajerosTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            try
            {
                DataSet ds;
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                //Boolean hoja;

                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                ds = await daoGestionCaja.ListarCajerosTodos();
                //hoja = await GenerarHojaRefCon(objRef.IdCuentaAtencion, Convert.ToInt32(ds.Tables[0].Rows[0]["IdReferencia"].ToString()), 1, "RF");

                return Json(new { respuesta = ds, session = true, estado = true });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, msj = ex });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CajaNroDocumentoSeleccionarPorId(string IdTipoComprobante, string IdCaja)
        {
            DataSet dataSet;
            DalGestionCaja daoGestionCaja = new DalGestionCaja();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoGestionCaja.CajaNroDocumentoSeleccionarPorId(IdTipoComprobante, IdCaja);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> CajaNroDocumentoModificar(int IdTipoComprobante, string NroDocumento, string NroSerie, string NroDocumentoFinal, int IdCaja, string NroDocumentoInicial)
        {
            int resp;
            DalGestionCaja daoGestionCaja = new DalGestionCaja();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            resp = await daoGestionCaja.CajaNroDocumentoModificar(IdTipoComprobante, NroDocumento, NroSerie, NroDocumentoFinal, IdCaja, NroDocumentoInicial, idUsuario);

            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> TiposFinanciamientoGeneraReciboPago(int IdTipoFinanciamiento)
        {
            int resp;
            DataSet dataSet = new DataSet();
            DalGestionCaja daoGestionCaja = new DalGestionCaja();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            resp = 0;

            dataSet = await daoGestionCaja.TiposFinanciamientoGeneraReciboPago(IdTipoFinanciamiento);

            var generaPago = dataSet.Tables[0].Rows[0]["GeneraPago"].ToString();

            if(generaPago.ToString() == "1")
            {
                resp = 1;
            } else
            {
                resp = 0;
            }


            return Json(new { lstData = resp, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ConsultaBloqueaTablaXidTipoFinanciamiento(int idTipoFinanciamiento)
        {
            DataSet dataSet;
            DalGestionCaja daoGestionCaja = new DalGestionCaja();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            dataSet = null;

            dataSet = await daoGestionCaja.ConsultaBloqueaTablaXidTipoFinanciamiento(idTipoFinanciamiento);

            return Json(new { lstData = dataSet, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> FacturacionServicioDespachoDetalleFiltraPorIdOrden(string NroSerie, string NroDocumento, int idTipoComprobante)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalGestionCaja dalGestionCaja = new DalGestionCaja();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalGestionCaja.CajaComprobantePagoServiciosPorNroSerieNroDocumentoByMGP(NroSerie, NroDocumento, idTipoComprobante);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }

        [HttpPost]
        public async Task<ActionResult> CorregirComprobantePago(int idComprobantePago, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dalGestionCaja = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dalGestionCaja.CorregirComprobantePago(idComprobantePago);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ComprobantePagoHabilitarEnvioSunat(int idComprobantePago, int idNotaCredito, int idNotaDebito, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();
            Encriptar objCripto = new Encriptar();

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                rsp = await dal.ComprobantePagoHabilitarEnvioSunat(idComprobantePago, idNotaCredito, idNotaDebito, ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }


        //////////////////////////EMISION COMPROBANTE/////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ValidarAperturaCierreCaja(int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dalGestionCaja = new DalGestionCaja();

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dalGestionCaja.ValidarAperturaCierreCaja(ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> AperturaCaja(int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dalGestionCaja = new DalGestionCaja();

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dalGestionCaja.AperturaCaja(ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> CierreCaja(int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dalGestionCaja = new DalGestionCaja();

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dalGestionCaja.CierreCaja(ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }



        [HttpPost]
        public async Task<ActionResult> ObtenerSiguienteDocumento(int idCaja, int idTipoComprobante)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerSiguienteDocumento(idCaja, idTipoComprobante);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ObtenerDatosPacienteParaCobrar(int tipoHistoria, string historia, string nroDocumento, string nroCuenta)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerDatosPacienteParaCobrar(tipoHistoria, historia, nroDocumento, nroCuenta);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta(int idCuenta)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta(idCuenta);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ObtenerItemsServiciosParaCobrarPorReceta(int idReceta)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerItemsServiciosParaCobrarPorReceta(idReceta);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ObtenerItemsServiciosFarmaciaParaCobrarPorOrden(int idOrdenpago, int idPreventa)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerItemsServiciosFarmaciaParaCobrarPorOrden(idOrdenpago, idPreventa);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> ObtenerItemsPersonalizadoParaCobrar(int idCuentaAtencion,int idTipoItem)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ObtenerItemsPersonalizadoParaCobrar(idCuentaAtencion, idTipoItem);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }


        [HttpPost]
        public async Task<ActionResult> EmisionComprobanteGuardar(CajaComprobantePago cajaComprobante, string codigoGestionCaja, string detalle, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();
            Encriptar objCripto = new Encriptar();

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");
                string user = HttpContext.Session.GetString("user");
                var lstobjDetalle = JsonConvert.DeserializeObject<List<DetalleItems>>(detalle);     
                
                if(codigoGestionCaja != "")
                {
                    cajaComprobante.IdGestionCaja = Int32.Parse(objCripto.DesencriptarCadena(codigoGestionCaja));
                } 
                else
                {
                    cajaComprobante.IdGestionCaja = 0;
                }
                //var lstobjDetalle = detalle != "[]" ? JsonConvert.DeserializeObject<List<DetalleItems>>(detalle) : null;
                rsp = await dal.EmisionComprobanteGuardar(cajaComprobante, lstobjDetalle, ip, idUsuario, idListBar);
                int idComprobantePagoS = Int32.Parse(rsp.Tables[0].Rows[0]["IdComprobantePagoS"].ToString());
                int idComprobantePagoF = Int32.Parse(rsp.Tables[0].Rows[0]["IdComprobantePagoF"].ToString());
                int idCaja = Int32.Parse(rsp.Tables[0].Rows[0]["IdCaja"].ToString());
                
                if (idComprobantePagoS > 0)
                {
                    string impresora = rsp.Tables[0].Rows[0]["ImpresoraS"].ToString();
                    await EjecutarImpresionComprobante(idComprobantePagoS, idCaja, impresora, 0, usuario, user);
                    //await EjecutarImpresionComprobante(idComprobantePagoS, "RECEPTOR", 0, usuario, user);
                    //await EjecutarImpresionComprobante(idComprobantePagoS, "USUARIO", 0, usuario, user);
                }

                if (idComprobantePagoF > 0)
                {
                    string impresora = rsp.Tables[0].Rows[0]["ImpresoraF"].ToString();
                    await EjecutarImpresionComprobante(idComprobantePagoF, idCaja, impresora, 0, usuario, user);
                    //await EjecutarImpresionComprobante(idComprobantePagoS, "RECEPTOR", 0, usuario, user);
                    //await EjecutarImpresionComprobante(idComprobantePagoS, "USUARIO", 0, usuario, user);
                }

            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> EmisionComprobanteEliminar(string codigoGestionCaja, int idComprobantePago, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            int idGestionCaja = 0;
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();
            Encriptar objCripto = new Encriptar();

            try
            {
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
               
                if (codigoGestionCaja != "")
                {
                    idGestionCaja = Int32.Parse(objCripto.DesencriptarCadena(codigoGestionCaja));
                }
                else
                {
                    idGestionCaja = 0;
                }
                //var lstobjDetalle = detalle != "[]" ? JsonConvert.DeserializeObject<List<DetalleItems>>(detalle) : null;
                rsp = await dal.EmisionComprobanteEliminar(idGestionCaja, idComprobantePago, ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        
        [HttpPost]
        public async Task<ActionResult> NotaCreditoDebitoSeleccionar(int idTipoNota, string nroSerie, string nroDocumento)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.NotaCreditoDebitoSeleccionar(idTipoNota, nroSerie, nroDocumento);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> CanjeNotaCreditoDebitoGuardar(string codigoGestionCaja, int idTipoNota, int idNota, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            Encriptar objCripto = new Encriptar();
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idGestionCaja = 0;
                if (codigoGestionCaja != "")
                {
                    idGestionCaja = Int32.Parse(objCripto.DesencriptarCadena(codigoGestionCaja));
                }
                else
                {
                    idGestionCaja = 0;
                }
                rsp = await dal.CanjeNotaCreditoDebitoGuardar(idTipoNota, idNota, idGestionCaja, ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> CanjeNotaCreditoDebitoEliminar(string codigoGestionCaja, int idTipoNota, int idNota, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            Encriptar objCripto = new Encriptar();
            DalGestionCaja dal = new DalGestionCaja();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                int idGestionCaja = 0;
                if (codigoGestionCaja != "")
                {
                    idGestionCaja = Int32.Parse(objCripto.DesencriptarCadena(codigoGestionCaja));
                }
                else
                {
                    idGestionCaja = 0;
                }
                rsp = await dal.CanjeNotaCreditoDebitoEliminar(idTipoNota, idNota, idGestionCaja, ip, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        //-------------------------------------------------------------------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult> GenerarFormatoComprobantePago(int idComprobantePago)
        {
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");
                string user = HttpContext.Session.GetString("user");

                UtilitarioController utilitario = new UtilitarioController();

                // Crear los tres objetos de configuración
                var configuraciones = new[]
                {
                    new { Tipo = "EMISOR" },
                    new { Tipo = "RECEPTOR" },
                    new { Tipo = "USUARIO" }
                };

                List<byte[]> pdfs = new List<byte[]>();

                foreach (var cfg in configuraciones)
                {
                    string pageHtml = Url.Action("FormatoComprobantePago", "GestionCaja",
                        new { idComprobantePago, tipoCopia = cfg.Tipo, esCopia = 1, usuario, user }, "http");

                    FormatoPdf pdfConfig = new FormatoPdf
                    {
                        orientacion = "Portrait",
                        tamanio = "A4",
                        tipoDocumento = "Ticket",
                        marginX = 20,
                        marginY = 20,
                        pageHtml = pageHtml
                    };

                    using var resultStream = await utilitario.GenerarArchivoEnMemoriaPdfV2(pdfConfig);
                    pdfs.Add(resultStream.ToArray()); // guardar el array del stream
                }

                // Fusionar los PDF en un solo MemoryStream
                using var finalStreamOriginal = new MemoryStream();
                using var writer = new PdfWriter(finalStreamOriginal);
                using var pdfDoc = new PdfDocument(writer);
                var merger = new PdfMerger(pdfDoc);

                foreach (var pdfBytes in pdfs)
                {
                    using var reader = new PdfReader(new MemoryStream(pdfBytes));
                    using var tempPdf = new PdfDocument(reader);
                    merger.Merge(tempPdf, 1, tempPdf.GetNumberOfPages());
                }

                pdfDoc.Close(); // Esto cerrará finalStreamOriginal

                // Copiar a un nuevo stream que sí podemos retornar
                byte[] finalBytes = finalStreamOriginal.ToArray();
                var finalStream = new MemoryStream(finalBytes);
                finalStream.Position = 0;

                return new FileStreamResult(finalStream, MediaTypeNames.Application.Pdf);
            }
            catch (Exception ex)
            {
                return Json(new { exep = ex.ToString() });
            }
        }
               
        public async Task<ActionResult> FormatoComprobantePago(int idComprobantePago, string tipoCopia, int esCopia, string usuario, string user)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalParametros daoParametros = new DalParametros();
            DalGestionCaja dalGestionCaja = new DalGestionCaja();

            //DataSet lsParametros = new DataSet();
            DataSet dsComprobante = await dalGestionCaja.ComprobantePagoFormato(idComprobantePago);
            DataRow drComprobante = dsComprobante.Tables[0].Rows[0];
            DataTable dtComprobanteDetalle = dsComprobante.Tables[1];

            int idIpressInt = 0;
            var idIpressStr = HttpContext.Session.GetString("IdIPress");
            if (!string.IsNullOrEmpty(idIpressStr) && int.TryParse(idIpressStr, out int result)) idIpressInt = result;

            var nombre = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
            var direccion = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
            var telefono = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
            var ruc = await daoParametros.SeleccionaFilaParametro2(339, idIpressInt);

            DateTime now = DateTime.Now;

            var ConfServerApp = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:UrlAppWeb");
            var ConfServerFiles = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:UrlAppFiles");

            @ViewBag.IpServer = ConfServerApp.ToString();
            @ViewBag.IpServerFiles = ConfServerFiles.ToString();

            @ViewBag.Comprobante = drComprobante;
            @ViewBag.ComprobanteDetalle = dtComprobanteDetalle;

            

            @ViewBag.FechaImpresion = now.ToString("dd/MM/yyyy HH:mm:ss"); ;
            @ViewBag.Usuario = usuario;
            @ViewBag.User = user;
            @ViewBag.TipoCopia = tipoCopia;
            if(esCopia == 1)
            {
                @ViewBag.EsCopia = "(DUPLICADO)";
            }
            else
            {
                @ViewBag.EsCopia = "";
            }

            @ViewBag.CodeQR = drComprobante["CodigoParaQR"];

            if (@ViewBag.CodeQR != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeQR, QRCodeGenerator.ECCLevel.Q);
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


            return PartialView("~/Views/Caja/Plantillas/FormatoTicketComprobantePago.cshtml");

        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        [HttpPost]
        public async Task<ActionResult> ImprimirCopiaComprobantePago(string codigoGestionCaja, int idComprobantePago, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            bool resp = false;
            DataSet dsGestionCaja = null;
            DataSet dsCaja = null;
            DalGestionCaja dalGestionCaja = new DalGestionCaja();
            DalCaja dalCaja = new DalCaja();
            Encriptar objCripto = new Encriptar();
            int idCaja = 0;
            string tipoOrden = "";
            string impresora = "";

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string usuario = HttpContext.Session.GetString("usuario");
                string user = HttpContext.Session.GetString("user");
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                dsCaja = await dalCaja.CajaSeleccionarPorEquipo(ip);
                

                if (dsCaja.Tables[0].Rows.Count > 0)
                {
                    idCaja = Int32.Parse(dsCaja.Tables[0].Rows[0]["IdCaja"].ToString());
                    dsGestionCaja = await dalGestionCaja.ComprobantePagoFormato(idComprobantePago);
                    tipoOrden = dsGestionCaja.Tables[0].Rows[0]["TipoOrden"].ToString();
                    if(tipoOrden == "S")
                    {
                        impresora = dsCaja.Tables[0].Rows[0]["ImpresoraDefault"].ToString();
                    } 
                    else if(tipoOrden == "F")
                    {
                        impresora = dsCaja.Tables[0].Rows[0]["Impresora2"].ToString();
                    }

                    if(impresora != "")
                    {
                        await EjecutarImpresionComprobante(idComprobantePago, idCaja, impresora, 1, usuario, user);
                        resp = true;
                    } 
                    else
                    {
                        mensaje = "No se econtro ninguna impresora asociada a este equipo.";
                        resp = false;
                    }
                    
                }
                else
                {
                    mensaje = "No se econtro ninguna caja asociada a este equipo";
                    resp = false;
                }
                
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = resp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<IActionResult> EjecutarImpresionComprobante(int idComprobantePago, int idCaja, string impresora, int esCopia, string usuario, string user)
        {
            //var urlAppPrint = new ConfigurationBuilder()
            //        .AddJsonFile("appsettings.json")
            //        .Build()
            //        .GetValue<string>("Configuraciones:UrlAppImpresion");
            //var url = $"{urlAppPrint}/api/Comprobantes/ComprobantePago/imprimir";


            //string url = "http://localhost:55000/api/Comprobantes/ComprobantePago/imprimir";            
            string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            string urlAppPrint = "http://" + ip + ":55000";
            var url = $"{urlAppPrint}/api/Comprobantes/ComprobantePago/imprimir";

            var peticion = new
            {
                idComprobantePago = idComprobantePago,
                //tipoCopia = tipoCopia,
                idCaja = idCaja,
                impresora = impresora,
                esCopia = esCopia,
                usuario = usuario,
                user = user
            };

            using (var client = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(peticion);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                try
                {
                    var respuesta = await client.PostAsync(url, content);

                    if (respuesta.IsSuccessStatusCode)
                    {
                        return Ok("Impresión enviada correctamente.");
                    }
                    else
                    {
                        var error = await respuesta.Content.ReadAsStringAsync();
                        return StatusCode((int)respuesta.StatusCode, $"Error al imprimir: {error}");
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Error de comunicación con el servicio de impresión: {ex.Message}");
                }
            }
        }



    }
}
