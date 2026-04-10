using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Net.Mime;
using SelectPdf;
using System.Text;
using WebAppMaternidad.Areas.Comun;
using Microsoft.Extensions.Configuration;
using System.Runtime.Intrinsics.X86;
using System.Diagnostics;
using QRCoder;
using System.Drawing;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.Areas.Facturacion
{
    public class ConsumoServicioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> ListaPuntoCargas()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            DataSet lsTiposEmb;
            DataSet lsEmpleado;
            DalPuntosCarga dalpuntos = new DalPuntosCarga();
            DalPaciente dalpacientes = new DalPaciente();

            int idUsuario/*, cantidad*/;
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            lsEmpleado = await dalpacientes.ListaLugarDeTrabajoEmplByIdEmpleado(3, idUsuario);


            if (lsEmpleado.Tables[0].Rows.Count > 0)
            {
                lsTiposEmb = dalpuntos.ListaPuntoCarga2();
                return Json(lsTiposEmb);
            }
            else
            {
                lsTiposEmb = dalpuntos.FactPuntosCargaSeleccionarTodos();
                return Json(lsTiposEmb);
            }



        }
        [HttpPost]
        public ActionResult ListaServiciosQueSonPuntosCarga()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }

            DataSet lsPuntos;

            DalPuntosCarga dalpuntos = new DalPuntosCarga();

            lsPuntos = dalpuntos.ListaServiciosQueSonPuntosCarga();

            return Json(lsPuntos);

        }
        [HttpPost]
        public async Task<ActionResult> TipoFinanciamientosDevuelveSoloFarmacia(string filtro)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsFuentes;
            DalPuntosCarga dalpuntos = new DalPuntosCarga();
            lsFuentes = await dalpuntos.TipoFinanciamientosDevuelveSoloFarmacia(filtro);
            return Json(lsFuentes);

        }

        public string validaOrdenServicio(FactOrdenServicio objFac)
        {
            string msj = "";
            if (objFac.IdCuentaAtencion == 0)
            {
                msj = msj + "Error en el numero de cuenta<br>";
            }
            if (objFac.idFuenteFinanciamiento == 0)
            {
                msj = msj + "Error en la fuente de financiamiento<br>";
            }
            if (objFac.IdPuntoCarga == 0)
            {
                msj = msj + "Error en el punto de carga<br>";
            }
            return msj;
        }

        [HttpPost]
        public async Task<ActionResult> InsertaFactOrdenServicio(FactOrdenServicio objFac, String LstDetalleConsumo, int idOrdenPago, int permiso, int? SeCargaEnInterconsulta = null)
        {
            Boolean registraModifica;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //RolesItems objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Facturación_Consumo_en_el_Servicio);
            //if (objRol.Agregar == true)
            //{
            //    registraModifica = true;
            //}
            //else
            //{
            //    if (objRol.Modificar == true)
            //    {
            //        registraModifica = true;
            //    }
            //    else
            //    {
            //        registraModifica = false;
            //    }

            //}
            registraModifica = true;
            //Valido items y otros campos para evitar registro erroneos
            string msjerror = "";
            msjerror = validaOrdenServicio(objFac);

            if (msjerror != "")
            {
                msjerror = msjerror + "<b>Guarde la atención y vuelva a seleccionar al paciente</b>";
                return Json(new { msjReceta = msjerror, session = true });
            }

            //valido cuenta
            DataSet lstCuenta;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCuenta = await daoCitas.ListaAtencionEstadosCompletosByIdCuenta(objFac.IdCuentaAtencion);
            if ((Convert.ToInt32(lstCuenta.Tables[0].Rows[0]["idEstado"])) != 1)
            {
                return Json(new { msjReceta = "El estado de Cuenta no se encuentra ABIERTO", session = true });
            }
            //cierra validacion

            if (registraModifica)
            {
                int idUsuario, /*cantidad,*/ generaPago;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string rptMetodo;

                DataSet /*lsconsumo,*/ lsFuente, lsOrdenCabecera;
                int rptOrden, rptOrdenPago = 0;
                Boolean rptDet = false, respTicket= false;
                //lsconsumo = null;
                DalConsumoServicio dalconsumo = new DalConsumoServicio();

                objFac.IdUsuario = idUsuario;
                objFac.IdUsuarioAuditoria = idUsuario;
                objFac.IdUsuarioDespacho = idUsuario;
                objFac.FechaCreacion = DateTime.Now;
                objFac.FechaDespacho = DateTime.Now;
                objFac.IdEstadoFacturacion = 1;

                var lstobjDetalle = JsonConvert.DeserializeObject<List<FacturacionServicioDespacho>>(LstDetalleConsumo);
                FactOrdenServicioPagos objFacPagos = new FactOrdenServicioPagos();

                objFacPagos.FechaCreacion = DateTime.Now;
                objFacPagos.IdUsuario = idUsuario;
                objFacPagos.idUsuarioExonera = 0;
                objFacPagos.IdEstadoFacturacion = 1;
                objFacPagos.ImporteExonerado = 0;
                objFacPagos.idUsuarioAuditoria = idUsuario;

                DataSet lsordenPago;
                int inrOdenPago = 0;

                lsFuente = dalconsumo.TiposFinanciamientoSeleccionarPorId(objFac.idTipoFinanciamiento);
                generaPago = Convert.ToInt32(lsFuente.Tables[0].Rows[0]["GeneraPago"]);

                if (objFac.IdOrden == 0 && permiso == 1)
                {
                    rptOrden = dalconsumo.InsertaFactOrdenServicio(objFac, SeCargaEnInterconsulta);
                }
                else
                {
                    rptOrden = objFac.IdOrden;
                }

                lsOrdenCabecera = dalconsumo.FactOrdenServicioSeleccionarPorId(rptOrden);
                if ((Convert.ToInt32(lsOrdenCabecera.Tables[0].Rows[0]["idEstadoFacturacion"])) == 4)
                {
                    rptOrden = 0;
                    rptMetodo = "Esta orden ya fue pagada";
                }
                else
                {

                    if (rptOrden > 0)
                    {
                        objFacPagos.idOrden = rptOrden;

                        if (objFac.IdOrden == 0 && permiso == 1)
                        {
                            if (generaPago == 1)
                            {
                                rptOrdenPago = dalconsumo.InsertaFactOrdenServicioPagos(objFacPagos);
                            }


                        }
                        else
                        {
                            if (generaPago == 1)
                            {
                                lsordenPago = dalconsumo.FactOrdenServicioPagosSeleccionarPorIdOrden(rptOrden);
                                inrOdenPago = Convert.ToInt32(lsordenPago.Tables[0].Rows[0]["idOrdenPago"]);
                                if (inrOdenPago == idOrdenPago)
                                {
                                    rptOrdenPago = idOrdenPago;
                                }
                                else
                                {
                                    rptOrdenPago = inrOdenPago;
                                }
                            }
                        }

                        rptDet = dalconsumo.InsertaServicioDespacho(lstobjDetalle, objFacPagos.idOrden);

                        //lsFuente = dalconsumo.TiposFinanciamientoSeleccionarPorId(objFac.idTipoFinanciamiento);
                        //generaPago = Convert.ToInt32(lsFuente.Tables[0].Rows[0]["GeneraPago"]);

                        if (generaPago == 1)
                        {
                            rptDet = dalconsumo.InsertaFacturacionServicioPagosDetalle(lstobjDetalle, rptOrdenPago, idUsuario);
                        }
                        else
                        {
                            rptDet = dalconsumo.InsertaFacturacionServicioFinanciamientos(lstobjDetalle, objFacPagos.idOrden, objFac.idTipoFinanciamiento, idUsuario, objFac.idFuenteFinanciamiento);
                        }
                    }

                    rptMetodo = "";

                }


                if (rptOrden > 0)
                {
                    respTicket = await GenerarFormatoTicketConsumoServicio(objFac.IdCuentaAtencion, rptOrden);
                }

                return Json(new { ordenPago = rptOrdenPago, orden = rptOrden, msjReceta = rptMetodo, session = true, estado = true });
            }
            else
            {
                return Json(new { msjReceta = "Usted no tiene  acceso a modificar o registrar", session = true, estado = false });
            }



        }

        [HttpPost]
        public async Task<ActionResult> InsertaFactOrdenServicioConDescripcion(FactOrdenServicio objFac, String LstDetalleConsumo, int idOrdenPago, int permiso) // Jdelgado
        {
            Boolean registraModifica;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //RolesItems objRol = Empleado.DevuelveRolxItem((int)Enumerados.shgIdsBar.Facturación_Consumo_en_el_Servicio);
            //if (objRol.Agregar == true)
            //{
            //    registraModifica = true;
            //}
            //else
            //{
            //    if (objRol.Modificar == true)
            //    {
            //        registraModifica = true;
            //    }
            //    else
            //    {
            //        registraModifica = false;
            //    }

            //}
            registraModifica = true;
            //Valido items y otros campos para evitar registro erroneos
            string msjerror = "";
            msjerror = validaOrdenServicio(objFac);

            if (msjerror != "")
            {
                msjerror = msjerror + "<b>Guarde la atención y vuelva a seleccionar al paciente</b>";
                return Json(new { msjReceta = msjerror, session = true });
            }

            //valido cuenta
            DataSet lstCuenta;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCuenta = await daoCitas.ListaAtencionEstadosCompletosByIdCuenta(objFac.IdCuentaAtencion);
            if ((Convert.ToInt32(lstCuenta.Tables[0].Rows[0]["idEstado"])) != 1)
            {
                return Json(new { msjReceta = "El estado de Cuenta no se encuentra ABIERTO", session = true });
            }
            //cierra validacion

            if (registraModifica)
            {
                int idUsuario, /*cantidad,*/ generaPago;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string rptMetodo;

                DataSet /*lsconsumo,*/ lsFuente, lsOrdenCabecera;
                int rptOrden, rptOrdenPago = 0;
                Boolean rptDet = false;
                //lsconsumo = null;
                DalConsumoServicio dalconsumo = new DalConsumoServicio();

                objFac.IdUsuario = idUsuario;
                objFac.IdUsuarioAuditoria = idUsuario;
                objFac.IdUsuarioDespacho = idUsuario;
                objFac.FechaCreacion = DateTime.Now;
                objFac.FechaDespacho = DateTime.Now;
                objFac.IdEstadoFacturacion = 1;

                var lstobjDetalle = JsonConvert.DeserializeObject<List<FacturacionServicioDespacho>>(LstDetalleConsumo);
                FactOrdenServicioPagos objFacPagos = new FactOrdenServicioPagos();

                objFacPagos.FechaCreacion = DateTime.Now;
                objFacPagos.IdUsuario = idUsuario;
                objFacPagos.idUsuarioExonera = 0;
                objFacPagos.IdEstadoFacturacion = 1;
                objFacPagos.ImporteExonerado = 0;
                objFacPagos.idUsuarioAuditoria = idUsuario;

                DataSet lsordenPago;
                int inrOdenPago = 0;

                lsFuente = dalconsumo.TiposFinanciamientoSeleccionarPorId(objFac.idTipoFinanciamiento);
                generaPago = Convert.ToInt32(lsFuente.Tables[0].Rows[0]["GeneraPago"]);

                if (objFac.IdOrden == 0 && permiso == 1)
                {
                    rptOrden = dalconsumo.InsertaFactOrdenServicio(objFac);
                }
                else
                {
                    rptOrden = objFac.IdOrden;
                }

                lsOrdenCabecera = dalconsumo.FactOrdenServicioSeleccionarPorId(rptOrden);
                if ((Convert.ToInt32(lsOrdenCabecera.Tables[0].Rows[0]["idEstadoFacturacion"])) == 4)
                {
                    rptOrden = 0;
                    rptMetodo = "Esta orden ya fue pagada";
                }
                else
                {

                    if (rptOrden > 0)
                    {
                        objFacPagos.idOrden = rptOrden;

                        if (objFac.IdOrden == 0 && permiso == 1)
                        {
                            if (generaPago == 1)
                            {
                                rptOrdenPago = dalconsumo.InsertaFactOrdenServicioPagos(objFacPagos);
                            }


                        }
                        else
                        {
                            if (generaPago == 1)
                            {
                                lsordenPago = dalconsumo.FactOrdenServicioPagosSeleccionarPorIdOrden(rptOrden);
                                inrOdenPago = Convert.ToInt32(lsordenPago.Tables[0].Rows[0]["idOrdenPago"]);
                                if (inrOdenPago == idOrdenPago)
                                {
                                    rptOrdenPago = idOrdenPago;
                                }
                                else
                        
                                {
                                    rptOrdenPago = inrOdenPago;
                                }
                            }
                        }

                        rptDet = dalconsumo.InsertaServicioDespachoConDescripcion(lstobjDetalle, objFacPagos.idOrden);

                        //lsFuente = dalconsumo.TiposFinanciamientoSeleccionarPorId(objFac.idTipoFinanciamiento);
                        //generaPago = Convert.ToInt32(lsFuente.Tables[0].Rows[0]["GeneraPago"]);

                        if (generaPago == 1)
                        {
                            rptDet = dalconsumo.InsertaFacturacionServicioPagosDetalle(lstobjDetalle, rptOrdenPago, idUsuario);
                        }
                        else
                        {
                            rptDet = dalconsumo.InsertaFacturacionServicioFinanciamientos(lstobjDetalle, objFacPagos.idOrden, objFac.idTipoFinanciamiento, idUsuario, objFac.idFuenteFinanciamiento);
                        }
                    }

                    rptMetodo = "";

                }

                return Json(new { ordenPago = rptOrdenPago, orden = rptOrden, msjReceta = rptMetodo, session = true, estado = true });
            }
            else
            {
                return Json(new { msjReceta = "Usted no tiene  acceso a modificar o registrar", session = true, estado = false });
            }



        }


        [HttpPost]
        public async Task<ActionResult> InsertaFactOrdenServicioV2(FactOrdenServicio objFac, String LstDetalleConsumo, int idOrdenPago, int permiso)
        {
            Boolean registraModifica;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            registraModifica = true;
            //Valido items y otros campos para evitar registro erroneos
            string msjerror = "";
            msjerror = validaOrdenServicio(objFac);

            if (msjerror != "")
            {
                msjerror = msjerror + "<b>Guarde la atención y vuelva a seleccionar al paciente</b>";
                return Json(new { msjReceta = msjerror, session = true });
            }

            //valido cuenta
            DataSet lstCuenta;
            DalAtenciones daoCitas = new DalAtenciones();
            lstCuenta = await daoCitas.ListaAtencionEstadosCompletosByIdCuenta(objFac.IdCuentaAtencion);
            if ((Convert.ToInt32(lstCuenta.Tables[0].Rows[0]["idEstado"])) != 1)
            {
                return Json(new { msjReceta = "El estado de Cuenta no se encuentra ABIERTO", session = true });
            }
            //cierra validacion

            if (registraModifica)
            {
                int idUsuario, /*cantidad,*/ generaPago;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string rptMetodo;

                DataSet /*lsconsumo,*/ lsFuente, lsOrdenCabecera;
                int rptOrden, rptOrdenPago = 0;
                Boolean rptDet = false;
                //lsconsumo = null;
                DalConsumoServicio dalconsumo = new DalConsumoServicio();

                objFac.IdUsuario = idUsuario;
                objFac.IdUsuarioAuditoria = idUsuario;
                objFac.IdUsuarioDespacho = idUsuario;
                objFac.FechaCreacion = DateTime.Now;
                objFac.FechaDespacho = DateTime.Now;
                objFac.IdEstadoFacturacion = 1;

                var lstobjDetalle = JsonConvert.DeserializeObject<List<FacturacionServicioDespacho>>(LstDetalleConsumo);
                FactOrdenServicioPagos objFacPagos = new FactOrdenServicioPagos();

                objFacPagos.FechaCreacion = DateTime.Now;
                objFacPagos.IdUsuario = idUsuario;
                objFacPagos.idUsuarioExonera = 0;
                objFacPagos.IdEstadoFacturacion = 1;
                objFacPagos.ImporteExonerado = 0;
                objFacPagos.idUsuarioAuditoria = idUsuario;

                DataSet lsordenPago;
                int inrOdenPago = 0;

                lsFuente = await dalconsumo.TiposFinanciamientoSeleccionarPorIdV2(objFac.idTipoFinanciamiento);
                generaPago = Convert.ToInt32(lsFuente.Tables[0].Rows[0]["GeneraPago"]);

                if (objFac.IdOrden == 0 && permiso == 1)
                {
                    rptOrden = await dalconsumo.InsertaFactOrdenServicioAsync(objFac);
                }
                else
                {
                    rptOrden = objFac.IdOrden;
                }

                lsOrdenCabecera = await dalconsumo.FactOrdenServicioSeleccionarPorIdV2(rptOrden);
                if ((Convert.ToInt32(lsOrdenCabecera.Tables[0].Rows[0]["idEstadoFacturacion"])) == 4)
                {
                    rptOrden = 0;
                    rptMetodo = "Esta orden ya fue pagada";
                }
                else
                {

                    if (rptOrden > 0)
                    {
                        objFacPagos.idOrden = rptOrden;

                        if (objFac.IdOrden == 0 && permiso == 1)
                        {
                            if (generaPago == 1)
                            {
                                rptOrdenPago = await dalconsumo.InsertaFactOrdenServicioPagosV2(objFacPagos);
                            }


                        }
                        else
                        {
                            if (generaPago == 1)
                            {
                                lsordenPago = await dalconsumo.FactOrdenServicioPagosSeleccionarPorIdOrdenV2(rptOrden);
                                inrOdenPago = Convert.ToInt32(lsordenPago.Tables[0].Rows[0]["idOrdenPago"]);
                                if (inrOdenPago == idOrdenPago)
                                {
                                    rptOrdenPago = idOrdenPago;
                                }
                                else
                                {
                                    rptOrdenPago = inrOdenPago;
                                }
                            }
                        }

                        rptDet = await dalconsumo.InsertaServicioDespachoV2(lstobjDetalle, objFacPagos.idOrden);

                        //lsFuente = dalconsumo.TiposFinanciamientoSeleccionarPorId(objFac.idTipoFinanciamiento);
                        //generaPago = Convert.ToInt32(lsFuente.Tables[0].Rows[0]["GeneraPago"]);

                        if (generaPago == 1)
                        {
                            rptDet = dalconsumo.InsertaFacturacionServicioPagosDetalle(lstobjDetalle, rptOrdenPago, idUsuario);
                        }
                        else
                        {
                            rptDet = dalconsumo.InsertaFacturacionServicioFinanciamientos(lstobjDetalle, objFacPagos.idOrden, objFac.idTipoFinanciamiento, idUsuario, objFac.idFuenteFinanciamiento);
                        }
                    }

                    rptMetodo = "";

                }

                return Json(new { ordenPago = rptOrdenPago, orden = rptOrden, msjReceta = rptMetodo, session = true, estado = true });
            }
            else
            {
                return Json(new { msjReceta = "Usted no tiene  acceso a modificar o registrar", session = true, estado = false });
            }



        }

        [HttpPost]
        public ActionResult ListaConsumoServicioByfechas(string FechaInicio, string FechaFin, int idPuntoCarga, int idCuenta, int historia, int idOrden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsconsumo;
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsconsumo = dalconsumo.ListaConsumoServicioByfechas(FechaInicio, FechaFin, idPuntoCarga, idCuenta, historia, idOrden);
            return Json(new { session = true, lsconsumo = lsconsumo });
            //return Json(lsconsumo);

        }
        [HttpPost]
        public ActionResult FactOrdenServicioSeleccionarPorId(int idOrden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet lsconsumo;
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsconsumo = dalconsumo.FactOrdenServicioSeleccionarPorId(idOrden);
            return Json(lsconsumo);

        }

        //[HttpPost]
        //public ActionResult FacturacionServicioDespachoDetalleFiltraPorIdOrden(int idOrden)
        //{
        //    if (HttpContext.User.Identity.IsAuthenticated == false)
        //    {
        //        return View("Login");
        //    }
        //    DataSet lsconsumoDespachoDt;
        //    DalConsumoServicio dalconsumo = new DalConsumoServicio();
        //    lsconsumoDespachoDt = dalconsumo.FacturacionServicioDespachoDetalleFiltraPorIdOrden(idOrden);
        //    return Json(lsconsumoDespachoDt);

        //}

        [HttpPost]
        public async Task<ActionResult> FacturacionServicioDespachoDetalleFiltraPorIdOrden(int idOrden)
        {
            DataSet dataSet = null;
            //int nRpta;
            DalConsumoServicio dalconsumo = new DalConsumoServicio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                dataSet = await dalconsumo.FacturacionServicioDespachoDetalleFiltraPorIdOrden(idOrden);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }
        }


        [HttpPost]
        public ActionResult FactOrdenServicioPagosSeleccionarPorIdOrden(int idOrden)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsconsumoDespachoDt;
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsconsumoDespachoDt = dalconsumo.FactOrdenServicioPagosSeleccionarPorIdOrden(idOrden);
            return Json(lsconsumoDespachoDt);

        }

        [HttpPost]
        public ActionResult EliminaConsumoServicio(int idOrden)
        {
            Boolean rsp;
            int idUsuario;
            string msj;
            DataSet lsOrdenCabecera;

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }


            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsOrdenCabecera = dalconsumo.FactOrdenServicioSeleccionarPorId(idOrden);
            if ((Convert.ToInt32(lsOrdenCabecera.Tables[0].Rows[0]["idEstadoFacturacion"])) == 4)
            {

                msj = "Esta orden ya fue pagada";
                rsp = false;
            }
            else
            {
                rsp = dalconsumo.EliminaConsumoServicio(idOrden, idUsuario);
                msj = "";
            }

            return Json(new { mensaje = msj, respuesta = rsp, session = true, });

        }

        [HttpPost]
        public async Task<ActionResult> BuscaAtencionesCptCEparaFormatoHIS(int idCuentaAtencion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            DataSet lsCpt;
            int idUsuario;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsCpt = await dalconsumo.BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion);

            return Json(new { listaCpt = lsCpt, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> BuscaAtencionesCptCEparaFormatoHISConDescripcion(int idCuentaAtencion) 
        {
            DataSet lsCpt;
            int idUsuario;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsCpt = await dalconsumo.BuscaAtencionesCptCEparaFormatoHISConDescripcion(idCuentaAtencion);

            return Json(new { listaCpt = lsCpt, session = true });

        }

        [HttpPost]
        public async Task<ActionResult> BuscaAtencionesCptCEparaFormatoHISInterconsulta(int idCuentaAtencion) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            DataSet lsCpt;
            int idUsuario;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsCpt = await dalconsumo.BuscaAtencionesCptCEparaFormatoHISInterconsulta(idCuentaAtencion);

            return Json(new { listaCpt = lsCpt, session = true, estado = true });

        }

        [HttpPost]
        public async Task<ActionResult> FactOrdenServicioFiltraPorIdCuenta(int idCuentaAtencion)  // JDELGADO003-C
        {
            DataSet dataSet;
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();
            dataSet = await dalConsumoServicio.FactOrdenServicioFiltraPorIdCuenta(idCuentaAtencion);

            return Json(new { dataSet, estado = true, session = true });
        }


        [HttpPost]
        public async Task<ActionResult> ConsumoServicioPorCodigoGuardar(int idCuentaAtencion, string codigoCPT, int cantidad, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalConsumoServicio dal = new DalConsumoServicio();

            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ConsumoServicioPorCodigoGuardar(idCuentaAtencion, codigoCPT, cantidad, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }



        [HttpPost]
        public async Task<bool> GenerarFormatoConsumoServicio(int idCuentaAtencion)
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
                pageHtml = Url.Action("FormatoConsumoServicio", "ConsumoServicio", new { idCuentaAtencion, usuarioname }, "http");

                pdf.tipoDocumento = "Ticket";

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;

                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idCuentaAtencion, 0, "CONS-SER", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        [HttpGet]
        public async Task<ActionResult> FormatoConsumoServicio(int idCuentaAtencion, string usuarioname)
        {
            String /*htmlTablaDetalle, htmlTablaItem,*/ telefono, nombre, direccion/*, html, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia, strInterconsulta*/;
            //html = "";
            //htmlTablaItem = "";

            //bool farmaciaHospi = false;
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet lsParametros = new DataSet();
            DataSet lsAtencion, lsDiagnosticos, lsCpt;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalParametros daoParametros = new DalParametros();

            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();

            lsCpt = await dalConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion);

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

            lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
            

            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;
            //@ViewBag.FechaVigencia = lsRecetas.Tables[0].Rows[0]["fechaVigencia"].ToString();
            //@ViewBag.FechaReceta = lsRecetas.Tables[0].Rows[0]["FechaReceta"].ToString();
            @ViewBag.Paciente = lsAtencion.Tables[0].Rows[0]["ApellidoPaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["ApellidoMaterno"].ToString() + " " + lsAtencion.Tables[0].Rows[0]["nombres"].ToString();
            @ViewBag.Historia = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.TipoPlan = lsAtencion.Tables[0].Rows[0]["planA"].ToString();
            @ViewBag.Edad = lsAtencion.Tables[0].Rows[0]["edadPaciente"].ToString();
            @ViewBag.Cuenta = lsAtencion.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
            //@ViewBag.TipoServicio = lsRecetas.Tables[0].Rows[0]["nomTipoServicio"].ToString();
            //@ViewBag.Consultorio = lsRecetas.Tables[0].Rows[0]["nomServicio"].ToString();
            //@ViewBag.NroReceta = lsRecetas.Tables[0].Rows[0]["idReceta"].ToString();
            //@ViewBag.Medico = lsRecetas.Tables[0].Rows[0]["Medico"].ToString();

            //nroEvaluacion = lsRecetas.Tables[0].Rows[0]["NroEvaluacion"].ToString();
            //idServicio = lsRecetas.Tables[0].Rows[0]["idServicioReceta"].ToString();
            idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();


            int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);

            if (Convert.ToInt32(nroEvaluacion) > 0)
            //if (nroEvaluacion != "" && nroEvaluacion != null)
            {
                lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion(Convert.ToInt32(idAtencion), clasificacionDiagnostico, Convert.ToInt32(idServicio), Convert.ToInt32(nroEvaluacion));
            }
            else
            {
                lsDiagnosticos = await daoAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(Convert.ToInt32(idAtencion), clasificacionDiagnostico);
            }


            @ViewBag.Diagnosticos = lsDiagnosticos.Tables[0];


            //string tipoFormato = "0";           //KHOYOSI
            //string tipoReceta = "";
            ////lsRecetasDestalle = null;

            //tipoReceta = "Orden";
            @ViewBag.Servicio = "Procedimientos en el Servicio";

            //lsRecetasDestalle = lsCpt;

            //foreach (DataRow dr in lsCpt.Tables[0].Rows)
            //{
            //    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX);
            //    tipoReceta = "Consumo eb";
                
            //}

            @ViewBag.DetalleReceta = lsCpt.Tables[0];
            //foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            //{

            //    /////////////////////KHOYOSI///////////////////////                
            //    var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
            //    tipoFormato = AppName.ToString();
            //    //////////////////////////////////////////////////

            //    

            //}

            @ViewBag.CodeFirma = lsCpt.Tables[0].Rows[0]["code"];

            if (@ViewBag.CodeFirma != "")
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);

                using (Bitmap bitMap = qrCode.GetGraphic(20))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        #if WINDOWS
                                                bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                                                @ViewBag.CodigoQR = ms.ToArray();
                        #else
                                                // On non-Windows platforms, skip QR code image generation or use a cross-platform library
                                                @ViewBag.CodigoQR = null;
                        #endif
                    }
                }
            }

            
            @ViewBag.Usuario = usuarioname;
            @ViewBag.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");


            @ViewBag.TituloNro = "N° Orden";
            @ViewBag.TituloDoc = "ORDEN MÉDICA";
            return PartialView("~/Views/Facturacion/Plantillas/FormatoTicket.cshtml");

            //return PartialView("");
        }

        ///////////////////////////TICKET CONSUMO SERVICIO////////////////////////////////////

        [HttpPost]
        public async Task<bool> GenerarFormatoTicketConsumoServicio(int idCuentaAtencion, int idOrden)
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
                pageHtml = Url.Action("FormatoTicketConsumoServicio", "ConsumoServicio", new { idOrden, usuarioname }, "http");

                pdf.tipoDocumento = "Ticket";

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;

                resp = await utilitario.GenerarDocumentoDigital(idCuentaAtencion, idOrden, 0, "TCK-CS", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                return false;
            }
        }

        [HttpGet]
        public async Task<ActionResult> FormatoTicketConsumoServicio(int idCuentaAtencion, int idOrden, string usuarioname)
        {
            String /*htmlTablaDetalle, htmlTablaItem,*/ telefono, nombre, direccion/*, html, strRx, strEcoGene, strEcoObs, strAnaPatolo, strPatoloClinica, strBs, strFarmacia, strInterconsulta*/;
            //html = "";
            //htmlTablaItem = "";

            //bool farmaciaHospi = false;
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            DataSet lsParametros = new DataSet();
            //DataSet lsAtencion, 
            DataSet lsDiagnosticos, lsConsumoServicio;
            DalAtenciones daoAtenciones = new DalAtenciones();
            DalParametros daoParametros = new DalParametros();
            DalDiagnostico daoDiagnostico = new DalDiagnostico();

            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();

            lsConsumoServicio = await dalConsumoServicio.ConsumoServicioSeleccionar(idOrden);

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
            //string idServicio = "0";

            //lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);


            @ViewBag.NombreInstitucion = nombre;
            @ViewBag.DireccionInstitucion = direccion;
            @ViewBag.TelefonoInstitucion = telefono;
            //@ViewBag.FechaVigencia = lsRecetas.Tables[0].Rows[0]["fechaVigencia"].ToString();
            //@ViewBag.FechaReceta = lsRecetas.Tables[0].Rows[0]["FechaReceta"].ToString();
            @ViewBag.NroOrden = lsConsumoServicio.Tables[0].Rows[0]["IdOrden"].ToString();
            @ViewBag.NroOrdenPago = lsConsumoServicio.Tables[0].Rows[0]["IdOrdenPago"].ToString();
            @ViewBag.FechaOrden = lsConsumoServicio.Tables[0].Rows[0]["FechaOrden"].ToString();
            @ViewBag.Paciente = lsConsumoServicio.Tables[0].Rows[0]["Paciente"].ToString();
            @ViewBag.Historia = lsConsumoServicio.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();
            @ViewBag.TipoPlan = lsConsumoServicio.Tables[0].Rows[0]["PlanA"].ToString();
            @ViewBag.Edad = lsConsumoServicio.Tables[0].Rows[0]["EdadPaciente"].ToString();
            @ViewBag.Cuenta = lsConsumoServicio.Tables[0].Rows[0]["IdCuentaAtencion"].ToString();
            //@ViewBag.TipoServicio = lsRecetas.Tables[0].Rows[0]["nomTipoServicio"].ToString();
            @ViewBag.Consultorio = lsConsumoServicio.Tables[0].Rows[0]["Servicio"].ToString();
            //@ViewBag.NroReceta = lsRecetas.Tables[0].Rows[0]["idReceta"].ToString();
            //@ViewBag.Medico = lsRecetas.Tables[0].Rows[0]["Medico"].ToString();
            @ViewBag.Prescriptor = lsConsumoServicio.Tables[0].Rows[0]["Prescriptor"].ToString();

            //nroEvaluacion = lsRecetas.Tables[0].Rows[0]["NroEvaluacion"].ToString();
            //idServicio = lsRecetas.Tables[0].Rows[0]["idServicioReceta"].ToString();
            idAtencion = lsConsumoServicio.Tables[0].Rows[0]["IdAtencion"].ToString();
            

            //int clasificacionDiagnostico = (lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "1" ? 1 : lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString() == "2" ? 8 : 2);

            lsDiagnosticos = await daoDiagnostico.ListarDiagnosticosRecetasPorAtencion(Convert.ToInt32(idAtencion), Convert.ToInt32(nroEvaluacion));


            @ViewBag.Diagnosticos = lsDiagnosticos.Tables[0];


            //string tipoFormato = "0";           //KHOYOSI
            //string tipoReceta = "";
            ////lsRecetasDestalle = null;

            //tipoReceta = "Orden";
            @ViewBag.Servicio = "Procedimientos en el Servicio";

            //lsRecetasDestalle = lsCpt;

            //foreach (DataRow dr in lsCpt.Tables[0].Rows)
            //{
            //    lsRecetasDestalle = await daoRecetas.ListaRecetaDetalle(Convert.ToInt32(dr["idReceta"].ToString()), (int)Enumerados.sghPuntosCargaBasicos.sghPtoCargaRayosX);
            //    tipoReceta = "Consumo eb";

            //}

            @ViewBag.DetalleReceta = lsConsumoServicio.Tables[1];
            //foreach (DataRow dr in lsRecetas.Tables[0].Rows)
            //{

            //    /////////////////////KHOYOSI///////////////////////                
            //    var AppName = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("Configuraciones:TipoFormatoRecetaFarmacia:" + lsAtencion.Tables[0].Rows[0]["IdTipoServicio"].ToString());
            //    tipoFormato = AppName.ToString();
            //    //////////////////////////////////////////////////

            //    

            //}

            @ViewBag.CodeFirma = lsConsumoServicio.Tables[0].Rows[0]["codeTicket"];

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


            @ViewBag.Usuario = usuarioname;
            @ViewBag.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");


            @ViewBag.TituloNro = "N° Orden Pago";
            @ViewBag.TituloDoc = "ORDEN MÉDICA";
            return PartialView("~/Views/Facturacion/Plantillas/FormatoTicketConsumoServicio.cshtml");

            //return PartialView("");
        }


        ///////////////////////////////////////////////////////////////////////////////////////////




        [HttpPost]
        public async Task<ActionResult> RegistraModificaInformeProcedimientos(
            int IdCuentaAtencion, int IdAtencion, int? IdPaciente, int IdOrden, int IdProducto, int? IdMedico, int? TipoIntervencion, DateTime? FechaCirugia, string HoraCirugia, string HoraFinalCirugia, int? Gasas, string CantGasas,
            int? Apositos, string CantApositos, int? PrimeraAnestesia, int? TipoPrimeraAnestesia, int? SegundaAnestesia, int? TipoSegundaAnestesia, string PlanTrabajo, string HoraInicioAtencion, string Tecnicas,
            string Hallazgos, string IncidentesAccidentes, int? AnatomiaPatologica, string TejidoOrganoExaminar, int? Destino, String lstDiagnosticos
        ) // JDELGADO003-C
        {
            //DataSet dataSet = null;
            int rpta = 0;
            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();

            var lstobjDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(lstDiagnosticos);

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            string actionName = ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();

            try
            {
                rpta = await dalConsumoServicio.RegistraModificaInformeProcedimientos(
                    IdAtencion, IdPaciente, IdOrden, IdProducto, IdMedico, TipoIntervencion, FechaCirugia, HoraCirugia, HoraFinalCirugia, Gasas, CantGasas,
                    Apositos, CantApositos, PrimeraAnestesia, TipoPrimeraAnestesia, SegundaAnestesia, TipoSegundaAnestesia, PlanTrabajo, HoraInicioAtencion, Tecnicas,
                    Hallazgos, IncidentesAccidentes, AnatomiaPatologica, TejidoOrganoExaminar, Destino, idUsuario, lstobjDiagnosticos, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna
                    );

                var informeProcedimiento = await GenerarInformeProcedimientoOnco(IdCuentaAtencion, IdAtencion, IdOrden, IdProducto);

                return Json(new { session = true, estado = true, msg = "", data = rpta });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = rpta });
            }
        }

        [HttpPost]
        public async Task<ActionResult> SeleccionarInformeProcedimiento(int IdAtencion, int IdOrden, int IdProducto)
        {
            DataSet dataSet = null;
            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();

            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString();
            try
            {
                dataSet = await dalConsumoServicio.SeleccionarInformeProcedimiento(IdAtencion, IdOrden, IdProducto);
                return Json(new { session = true, estado = true, msg = "", data = dataSet });
            }
            catch (Exception e)
            {
                return Json(new { session = true, estado = false, msg = "¡Error! \n [" + controllerName + "Controller / " + actionName + "] \n " + e, data = dataSet });
            }

        }

        public async Task<bool> GenerarInformeProcedimientoOnco(int IdCuentaAtencion, int IdAtencion, int IdOrden, int IdProducto)
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

                pageHtml = Url.Action("InformeProcedimientoOnco", "ConsumoServicio", new { area = "ConsultaExterna", IdAtencion, IdOrden, IdProducto }, "http");

                pdf.orientacion = "Portrait";
                pdf.tamanio = "A4";
                pdf.marginX = 20;
                pdf.marginY = 20;
                resp = await utilitario.GenerarDocumentoDigital(IdCuentaAtencion, IdOrden, IdProducto, "I-PROC", 0, pageHtml, stringHtml, idUsuario, pdf);

                return resp;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return false;
            }
        }

        public async Task<ActionResult> InformeProcedimientoOnco(int IdAtencion, int IdOrden, int IdProducto)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            DalConsumoServicio dalConsumoServicio = new DalConsumoServicio();
            DalAtenciones dalAtenciones = new DalAtenciones();
            DalParametros daoParametros = new DalParametros();

            DataSet dataSet = new DataSet();
            DataSet lsParametros;

            dataSet = await dalConsumoServicio.SeleccionarInformeProcedimiento(IdAtencion, IdOrden, IdProducto);

            @ViewBag.FechaImpresion = DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss");
            //@ViewBag.Usuario = usuario;

            lsParametros = await daoParametros.SeleccionaFilaParametro2(205); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(206); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            lsParametros.Clear();

            lsParametros = await daoParametros.SeleccionaFilaParametro2(207); // JDELGADO J0 AWAIT SENTENCE
            @ViewBag.telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

            @ViewBag.HoraInicioAtencion = dataSet.Tables[0].Rows[0]["HoraInicioAtencion"];
            @ViewBag.Servicio = dataSet.Tables[0].Rows[0]["Servicio"];
            @ViewBag.NroHistoriaClinica = dataSet.Tables[0].Rows[0]["NroHistoriaClinica"];
            @ViewBag.Paciente = dataSet.Tables[0].Rows[0]["Paciente"];
            @ViewBag.Edad = dataSet.Tables[0].Rows[0]["Edad"];
            @ViewBag.Sexo = dataSet.Tables[0].Rows[0]["Sexo"];
            @ViewBag.DesTipoIntervencion = dataSet.Tables[0].Rows[0]["DesTipoIntervencion"];
            @ViewBag.FechaCirugia = dataSet.Tables[0].Rows[0]["FechaCirugia"];
            @ViewBag.HoraCirugia = dataSet.Tables[0].Rows[0]["HoraCirugia"];
            @ViewBag.HoraFinalCirugia = dataSet.Tables[0].Rows[0]["HoraFinalCirugia"];
            @ViewBag.DesGasas = dataSet.Tables[0].Rows[0]["DesGasas"];
            @ViewBag.CantGasas = dataSet.Tables[0].Rows[0]["CantGasas"];
            @ViewBag.DesApositos = dataSet.Tables[0].Rows[0]["DesApositos"];
            @ViewBag.CantApositos = dataSet.Tables[0].Rows[0]["CantApositos"];

            @ViewBag.DesPrimeraAnestesia = dataSet.Tables[0].Rows[0]["DesPrimeraAnestesia"];
            @ViewBag.DesTipoPrimeraAnestesia = dataSet.Tables[0].Rows[0]["DesTipoPrimeraAnestesia"];
            @ViewBag.DesSegundaAnestesia = dataSet.Tables[0].Rows[0]["DesSegundaAnestesia"];
            @ViewBag.DesTipoSegundaAnestesia = dataSet.Tables[0].Rows[0]["DesTipoSegundaAnestesia"];

            @ViewBag.PlanTrabajo = dataSet.Tables[0].Rows[0]["PlanTrabajo"];
            @ViewBag.HoraInicioAtencion = dataSet.Tables[0].Rows[0]["HoraInicioAtencion"];
            @ViewBag.Tecnicas = dataSet.Tables[0].Rows[0]["Tecnicas"];
            @ViewBag.Hallazgos = dataSet.Tables[0].Rows[0]["Hallazgos"];
            @ViewBag.IncidentesAccidentes = dataSet.Tables[0].Rows[0]["IncidentesAccidentes"];
            @ViewBag.DesAnatomiaPatologicaCQx = dataSet.Tables[0].Rows[0]["DesAnatomiaPatologicaCQx"];
            @ViewBag.TejidoOrganoExaminar = dataSet.Tables[0].Rows[0]["TejidoOrganoExaminar"];
            @ViewBag.DesDestinoAtencion = dataSet.Tables[0].Rows[0]["DesDestinoAtencion"];
            @ViewBag.Medico = dataSet.Tables[0].Rows[0]["Medico"];

            DataSet lsDiagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(IdAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            DataTable dtDx = lsDiagnosticos.Tables[0];

            @ViewBag.dtDx = dtDx;
            //DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();
            //DalTriaje dalTriaje = new DalTriaje();
            //DalAtenciones dalAtenciones = new DalAtenciones();

            //DataSet anestesiologia = await dalAnestesiologia.ListarAtencionesAnestesiologia(idAtencion);
            //DataSet triaje = dalTriaje.ListaTriaje(Convert.ToInt32(idAtencion));

            //DataSet Diagnosticos = await dalAtenciones.AtencionesDiagnosticosSeleccionarPorAtencion(idAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna);
            //DataTable dtDx = Diagnosticos.Tables[0];

            //DataSet MedicacionSuministrada = await dalAnestesiologia.ListarMedicacionSuministradaAnestesiologia((int)anestesiologia.Tables[0].Rows[0]["IdAtencionAnestesiologia"]);
            //DataTable dtMedicacion = MedicacionSuministrada.Tables[0];

            //DataSet PatologiaClinica = await dalAnestesiologia.ListarPatologiaClinicaAnestesiologia((int)anestesiologia.Tables[0].Rows[0]["IdAtencionAnestesiologia"]);
            //DataTable dtPatologiaClinica = PatologiaClinica.Tables[0];

            //@ViewBag.IntervencionQuirurgicaPropuestaAA = anestesiologia.Tables[0].Rows[0]["IntervencionQuirurgicaPropuestaAA"].ToString();

            //@ViewBag.EnfermedadActualAA = anestesiologia.Tables[0].Rows[0]["EnfermedadActualAA"].ToString();
            //@ViewBag.TiempoEnfermedadAA = anestesiologia.Tables[0].Rows[0]["TiempoEnfermedadAA"].ToString();
            //@ViewBag.RelatoAA = anestesiologia.Tables[0].Rows[0]["RelatoAA"].ToString();

            //@ViewBag.FechaEvaluacion = anestesiologia.Tables[0].Rows[0]["FechaEvaluacion"].ToString();
            //@ViewBag.HoraEvaluacion = anestesiologia.Tables[0].Rows[0]["HoraEvaluacion"].ToString();
            //@ViewBag.Anestesiologo = anestesiologia.Tables[0].Rows[0]["Anestesiologo"].ToString();
            //@ViewBag.Edad = anestesiologia.Tables[0].Rows[0]["Edad"].ToString();
            //@ViewBag.Sexo = anestesiologia.Tables[0].Rows[0]["Sexo"].ToString();

            //@ViewBag.Cama = anestesiologia.Tables[0].Rows[0]["Cama"].ToString();
            //@ViewBag.Servicio = anestesiologia.Tables[0].Rows[0]["Servicio"].ToString();
            //@ViewBag.NroHistoria = anestesiologia.Tables[0].Rows[0]["NroHistoria"].ToString();
            //@ViewBag.Paciente = anestesiologia.Tables[0].Rows[0]["Paciente"].ToString();

            //@ViewBag.TriajePeso = triaje.Tables[0].Rows[0]["TriajePeso"].ToString();
            //@ViewBag.TriajePresion = triaje.Tables[0].Rows[0]["TriajePresion"].ToString();
            //@ViewBag.TriajeFrecCardiaca = triaje.Tables[0].Rows[0]["TriajeFrecCardiaca"].ToString();
            //@ViewBag.TriajeFrecRespiratoria = triaje.Tables[0].Rows[0]["TriajeFrecRespiratoria"].ToString();
            //@ViewBag.TriajeTemperatura = triaje.Tables[0].Rows[0]["TriajeTemperatura"].ToString();
            //@ViewBag.TriajeSaturacionOxigeno = triaje.Tables[0].Rows[0]["TriajeSaturacionOxigeno"].ToString();


            //@ViewBag.DClasificacionASAAA = anestesiologia.Tables[0].Rows[0]["DClasificacionASAAA"].ToString();
            //@ViewBag.DTipoAnestesiaPrevistaAA = anestesiologia.Tables[0].Rows[0]["DTipoAnestesiaPrevistaAA"].ToString();
            //@ViewBag.ConclusionAA = anestesiologia.Tables[0].Rows[0]["ConclusionAA"].ToString();

            //@ViewBag.DisneaAA = anestesiologia.Tables[0].Rows[0]["DisneaAA"].ToString();
            //@ViewBag.OrtopneaAA = anestesiologia.Tables[0].Rows[0]["OrtopneaAA"].ToString();
            //@ViewBag.ConvulsionesAA = anestesiologia.Tables[0].Rows[0]["ConvulsionesAA"].ToString();
            //@ViewBag.FotopsiasAA = anestesiologia.Tables[0].Rows[0]["FotopsiasAA"].ToString();
            //@ViewBag.CianosisAA = anestesiologia.Tables[0].Rows[0]["CianosisAA"].ToString();
            //@ViewBag.CefaleaAA = anestesiologia.Tables[0].Rows[0]["CefaleaAA"].ToString();
            //@ViewBag.HemorragiasAA = anestesiologia.Tables[0].Rows[0]["HemorragiasAA"].ToString();
            //@ViewBag.FiebreAA = anestesiologia.Tables[0].Rows[0]["FiebreAA"].ToString();
            //@ViewBag.DolorAA = anestesiologia.Tables[0].Rows[0]["DolorAA"].ToString();
            //@ViewBag.Nausea_VomitoAA = anestesiologia.Tables[0].Rows[0]["Nausea_VomitoAA"].ToString();
            //@ViewBag.OtrosAA = anestesiologia.Tables[0].Rows[0]["OtrosAA"].ToString();
            //@ViewBag.NingunoAA = anestesiologia.Tables[0].Rows[0]["NingunoAA"].ToString();
            //@ViewBag.DescripcionOtrosAA = anestesiologia.Tables[0].Rows[0]["DescripcionOtrosAA"].ToString();

            //@ViewBag.ApetitoAA = anestesiologia.Tables[0].Rows[0]["ApetitoAA"].ToString();
            //@ViewBag.SedAA = anestesiologia.Tables[0].Rows[0]["SedAA"].ToString();
            //@ViewBag.OrinaAA = anestesiologia.Tables[0].Rows[0]["OrinaAA"].ToString();
            //@ViewBag.DeposicionesAA = anestesiologia.Tables[0].Rows[0]["DeposicionesAA"].ToString();
            //@ViewBag.SuenioAA = anestesiologia.Tables[0].Rows[0]["SuenioAA"].ToString();

            //@ViewBag.DiabetesP = anestesiologia.Tables[0].Rows[0]["DiabetesP"].ToString();
            //@ViewBag.DiabetesDescP = anestesiologia.Tables[0].Rows[0]["DiabetesDescP"].ToString();
            //@ViewBag.TBCP = anestesiologia.Tables[0].Rows[0]["TBCP"].ToString();
            //@ViewBag.TBCDescP = anestesiologia.Tables[0].Rows[0]["TBCDescP"].ToString();
            //@ViewBag.AsmaP = anestesiologia.Tables[0].Rows[0]["AsmaP"].ToString();
            //@ViewBag.AsmaDescP = anestesiologia.Tables[0].Rows[0]["AsmaDescP"].ToString();
            //@ViewBag.HipertensionP = anestesiologia.Tables[0].Rows[0]["HipertensionP"].ToString();
            //@ViewBag.HipertensionDescP = anestesiologia.Tables[0].Rows[0]["HipertensionDescP"].ToString();
            //@ViewBag.PatologiaTiroideaP = anestesiologia.Tables[0].Rows[0]["PatologiaTiroideaP"].ToString();
            //@ViewBag.PatologiaTiroideaDescP = anestesiologia.Tables[0].Rows[0]["PatologiaTiroideaDescP"].ToString();
            //@ViewBag.CirugiaPreviaP = anestesiologia.Tables[0].Rows[0]["CirugiaPreviaP"].ToString();
            //@ViewBag.CirugiaPreviaDescP = anestesiologia.Tables[0].Rows[0]["CirugiaPreviaDescP"].ToString();
            //@ViewBag.AlcoholP = anestesiologia.Tables[0].Rows[0]["AlcoholP"].ToString();
            //@ViewBag.AlcoholDescP = anestesiologia.Tables[0].Rows[0]["AlcoholDescP"].ToString();
            //@ViewBag.TabacoP = anestesiologia.Tables[0].Rows[0]["TabacoP"].ToString();
            //@ViewBag.TabacoDescP = anestesiologia.Tables[0].Rows[0]["TabacoDescP"].ToString();
            //@ViewBag.DrogasP = anestesiologia.Tables[0].Rows[0]["DrogasP"].ToString();
            //@ViewBag.DrogasDescP = anestesiologia.Tables[0].Rows[0]["DrogasDescP"].ToString();
            //@ViewBag.TransfusionesP = anestesiologia.Tables[0].Rows[0]["TransfusionesP"].ToString();
            //@ViewBag.TransfusionesDescP = anestesiologia.Tables[0].Rows[0]["TransfusionesDescP"].ToString();
            //@ViewBag.AnestesiasPreviasP = anestesiologia.Tables[0].Rows[0]["AnestesiasPreviasP"].ToString();
            //@ViewBag.AnestesiasPreviasDescP = anestesiologia.Tables[0].Rows[0]["AnestesiasPreviasDescP"].ToString();
            //@ViewBag.TendenciaHemorragiasP = anestesiologia.Tables[0].Rows[0]["TendenciaHemorragiasP"].ToString();
            //@ViewBag.TendenciaHemorragiasDescP = anestesiologia.Tables[0].Rows[0]["TendenciaHemorragiasDescP"].ToString();
            //@ViewBag.OtrosP = anestesiologia.Tables[0].Rows[0]["OtrosP"].ToString();
            //@ViewBag.OtrosDescP = anestesiologia.Tables[0].Rows[0]["OtrosDescP"].ToString();

            //@ViewBag.DiabetesF = anestesiologia.Tables[0].Rows[0]["DiabetesF"].ToString();
            //@ViewBag.DiabetesDescF = anestesiologia.Tables[0].Rows[0]["DiabetesDescF"].ToString();
            //@ViewBag.TBCF = anestesiologia.Tables[0].Rows[0]["TBCF"].ToString();
            //@ViewBag.TBCDescF = anestesiologia.Tables[0].Rows[0]["TBCDescF"].ToString();
            //@ViewBag.AsmaF = anestesiologia.Tables[0].Rows[0]["AsmaF"].ToString();
            //@ViewBag.AsmaDescF = anestesiologia.Tables[0].Rows[0]["AsmaDescF"].ToString();
            //@ViewBag.HipertensionF = anestesiologia.Tables[0].Rows[0]["HipertensionF"].ToString();
            //@ViewBag.HipertensionDescF = anestesiologia.Tables[0].Rows[0]["HipertensionDescF"].ToString();
            //@ViewBag.OtrosF = anestesiologia.Tables[0].Rows[0]["OtrosF"].ToString();
            //@ViewBag.OtrosDescF = anestesiologia.Tables[0].Rows[0]["OtrosDescF"].ToString();
            //@ViewBag.AnestesiasFamiliaresF = anestesiologia.Tables[0].Rows[0]["AnestesiasFamiliaresF"].ToString();
            //@ViewBag.AnestesiasFamiliaresDescF = anestesiologia.Tables[0].Rows[0]["AnestesiasFamiliaresDescF"].ToString();

            //@ViewBag.FarmacologicasALER = anestesiologia.Tables[0].Rows[0]["FarmacologicasALER"].ToString();
            //@ViewBag.FarmacologicasDescALER = anestesiologia.Tables[0].Rows[0]["FarmacologicasDescALER"].ToString();
            //@ViewBag.AlimentacionALER = anestesiologia.Tables[0].Rows[0]["AlimentacionALER"].ToString();
            //@ViewBag.AlimentacionDescALER = anestesiologia.Tables[0].Rows[0]["AlimentacionDescALER"].ToString();
            //@ViewBag.EosinofiliaALER = anestesiologia.Tables[0].Rows[0]["EosinofiliaALER"].ToString();
            //@ViewBag.EosinofiliaDescALER = anestesiologia.Tables[0].Rows[0]["EosinofiliaDescALER"].ToString();
            //@ViewBag.BroncoespasmosALER = anestesiologia.Tables[0].Rows[0]["BroncoespasmosALER"].ToString();
            //@ViewBag.BroncoespasmosDescALER = anestesiologia.Tables[0].Rows[0]["BroncoespasmosDescALER"].ToString();
            //@ViewBag.OtrosALER = anestesiologia.Tables[0].Rows[0]["OtrosALER"].ToString();
            //@ViewBag.OtrosDescALER = anestesiologia.Tables[0].Rows[0]["OtrosDescALER"].ToString();
            //@ViewBag.SignosSintomasALER = anestesiologia.Tables[0].Rows[0]["SignosSintomasALER"].ToString();
            //@ViewBag.ShockALER = anestesiologia.Tables[0].Rows[0]["ShockALER"].ToString();
            //@ViewBag.RASHALER = anestesiologia.Tables[0].Rows[0]["RASHALER"].ToString();
            //@ViewBag.EdemaALER = anestesiologia.Tables[0].Rows[0]["EdemaALER"].ToString();
            //@ViewBag.GlotisALER = anestesiologia.Tables[0].Rows[0]["GlotisALER"].ToString();
            //@ViewBag.PruritoALER = anestesiologia.Tables[0].Rows[0]["PruritoALER"].ToString();
            //@ViewBag.ObservacionALER = anestesiologia.Tables[0].Rows[0]["ObservacionALER"].ToString();

            //@ViewBag.EstadoGeneralSensorioEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralSensorioEF"].ToString();
            //@ViewBag.EstadoGeneralSensorioDescEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralSensorioDescEF"].ToString();
            //@ViewBag.EstadoGeneralSensorioEdemasEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralSensorioEdemasEF"].ToString();
            //@ViewBag.CardiovascularEF = anestesiologia.Tables[0].Rows[0]["CardiovascularEF"].ToString();
            //@ViewBag.CardiovascularDescEF = anestesiologia.Tables[0].Rows[0]["CardiovascularDescEF"].ToString();
            //@ViewBag.CardiovascularEdemasEF = anestesiologia.Tables[0].Rows[0]["CardiovascularEdemasEF"].ToString();
            //@ViewBag.AbdomenEF = anestesiologia.Tables[0].Rows[0]["AbdomenEF"].ToString();
            //@ViewBag.AbdomenDescEF = anestesiologia.Tables[0].Rows[0]["AbdomenDescEF"].ToString();
            //@ViewBag.PielEF = anestesiologia.Tables[0].Rows[0]["PielEF"].ToString();
            //@ViewBag.PielDescEF = anestesiologia.Tables[0].Rows[0]["PielDescEF"].ToString();
            //@ViewBag.OjosEF = anestesiologia.Tables[0].Rows[0]["OjosEF"].ToString();
            //@ViewBag.OjosDescEF = anestesiologia.Tables[0].Rows[0]["OjosDescEF"].ToString();
            //@ViewBag.MovCervicalEF = anestesiologia.Tables[0].Rows[0]["MovCervicalEF"].ToString();
            //@ViewBag.MovCervicalDescEF = anestesiologia.Tables[0].Rows[0]["MovCervicalDescEF"].ToString();
            //@ViewBag.NeurologicoEF = anestesiologia.Tables[0].Rows[0]["NeurologicoEF"].ToString();
            //@ViewBag.NeurologicoDescEF = anestesiologia.Tables[0].Rows[0]["NeurologicoDescEF"].ToString();
            //@ViewBag.ColumnaVertebralEF = anestesiologia.Tables[0].Rows[0]["ColumnaVertebralEF"].ToString();
            //@ViewBag.ColumnaVertebralDescEF = anestesiologia.Tables[0].Rows[0]["ColumnaVertebralDescEF"].ToString();
            //@ViewBag.EstadoGeneralEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralEF"].ToString();
            //@ViewBag.EstadoGeneralDescEF = anestesiologia.Tables[0].Rows[0]["EstadoGeneralDescEF"].ToString();
            //@ViewBag.EstadoNutricionalEF = anestesiologia.Tables[0].Rows[0]["EstadoNutricionalEF"].ToString();
            //@ViewBag.EstadoNutricionalDescEF = anestesiologia.Tables[0].Rows[0]["EstadoNutricionalDescEF"].ToString();
            //@ViewBag.VenasEF = anestesiologia.Tables[0].Rows[0]["VenasEF"].ToString();
            //@ViewBag.VenasDescEF = anestesiologia.Tables[0].Rows[0]["VenasDescEF"].ToString();
            //@ViewBag.ViasAereasEF = anestesiologia.Tables[0].Rows[0]["ViasAereasEF"].ToString();
            //@ViewBag.ViasAereasDescEF = anestesiologia.Tables[0].Rows[0]["ViasAereasDescEF"].ToString();
            //@ViewBag.DentaduraEF = anestesiologia.Tables[0].Rows[0]["DentaduraEF"].ToString();
            //@ViewBag.DentaduraDescEF = anestesiologia.Tables[0].Rows[0]["DentaduraDescEF"].ToString();
            //@ViewBag.TraqueaEF = anestesiologia.Tables[0].Rows[0]["TraqueaEF"].ToString();
            //@ViewBag.TraqueaDescEF = anestesiologia.Tables[0].Rows[0]["TraqueaDescEF"].ToString();
            //@ViewBag.ToraxEF = anestesiologia.Tables[0].Rows[0]["ToraxEF"].ToString();
            //@ViewBag.ToraxDescEF = anestesiologia.Tables[0].Rows[0]["ToraxDescEF"].ToString();
            //@ViewBag.DMallampatiEF = anestesiologia.Tables[0].Rows[0]["DMallampatiEF"].ToString();
            //@ViewBag.DDistanciaMentoTiroideaEF = anestesiologia.Tables[0].Rows[0]["DDistanciaMentoTiroideaEF"].ToString();

            //@ViewBag.Hb = anestesiologia.Tables[0].Rows[0]["Hb"].ToString();
            //@ViewBag.Hto = anestesiologia.Tables[0].Rows[0]["Hto"].ToString();
            //@ViewBag.TProt = anestesiologia.Tables[0].Rows[0]["TProt"].ToString();
            //@ViewBag.TTrombiop = anestesiologia.Tables[0].Rows[0]["TTrombiop"].ToString();
            //@ViewBag.Glucosa = anestesiologia.Tables[0].Rows[0]["Glucosa"].ToString();
            //@ViewBag.Urea = anestesiologia.Tables[0].Rows[0]["Urea"].ToString();
            //@ViewBag.Creatinina = anestesiologia.Tables[0].Rows[0]["Creatinina"].ToString();
            //@ViewBag.VDRL = anestesiologia.Tables[0].Rows[0]["VDRL"].ToString();
            //@ViewBag.HIV = anestesiologia.Tables[0].Rows[0]["HIV"].ToString();
            //@ViewBag.GrupoyRh = anestesiologia.Tables[0].Rows[0]["GrupoyRh"].ToString();
            //@ViewBag.Fibrogeno = anestesiologia.Tables[0].Rows[0]["Fibrogeno"].ToString();
            //@ViewBag.RxTorax = anestesiologia.Tables[0].Rows[0]["RXToraxResumenAA"].ToString();
            //@ViewBag.RectPlaquetas = anestesiologia.Tables[0].Rows[0]["RectPlaquetas"].ToString();
            //@ViewBag.Rq = anestesiologia.Tables[0].Rows[0]["RiesgoQuirurgicoAA"].ToString();
            //@ViewBag.Orina = anestesiologia.Tables[0].Rows[0]["Orina"].ToString();
            //@ViewBag.Covid19 = anestesiologia.Tables[0].Rows[0]["Covid19"].ToString();

            //@ViewBag.Diagnosticos = dtDx;
            //@ViewBag.MedicacionSuministrada = dtMedicacion;
            ////@ViewBag.PatologiaClinica = dtPatologiaClinica;
            //@ViewBag.TipoEvaluacionAnestesiaAA = anestesiologia.Tables[0].Rows[0]["TipoEvaluacionAnestesiaAA"].ToString();

            //@ViewBag.CodeFirma = anestesiologia.Tables[0].Rows[0]["code"];

            //if (@ViewBag.CodeFirma != "")
            //{
            //    QRCodeData qrCodeData = qrGenerator.CreateQrCode(@ViewBag.CodeFirma, QRCodeGenerator.ECCLevel.Q);
            //    QRCode qrCode = new QRCode(qrCodeData);

            //    using (Bitmap bitMap = qrCode.GetGraphic(20))
            //    {
            //        using (MemoryStream ms = new MemoryStream())
            //        {
            //            bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
            //            @ViewBag.CodigoQR = ms.ToArray();
            //        }
            //    }
            //}

            return PartialView("~/Views/Comun/Plantillas/InformeProcedimientoOnco.cshtml");
        }

        [HttpPost]
        public ActionResult ListarProcedimientosRealizadosPorHistoriaTamizaje(int IdPaciente)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lsconsumoDespachoDt;
            DalConsumoServicio dalconsumo = new DalConsumoServicio();
            lsconsumoDespachoDt = dalconsumo.ListarProcedimientosRealizadosPorHistoriaTamizaje(IdPaciente);
            return Json(lsconsumoDespachoDt);

        }
    }
}
