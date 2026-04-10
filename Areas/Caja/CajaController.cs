using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System.Data;
using WebAppMaternidad.CapaDatos;
using SiHospCrypKey;

namespace WebAppMaternidad.Areas.Caja
{
    public class CajaController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public CajaController(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Cajas(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                DalUtilitario dalUtilitario = new DalUtilitario();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);

                int PermisoCierreCaja = await dalUtilitario.ValidarPermisoUsuario(idUsuario, "CAJA-CIERRE-CAJA");
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                    ViewBag.PermisoCierreCaja = PermisoCierreCaja;
                }

                DalEconomia dlEconomia = new DalEconomia();
                DalGestionCaja daoGestionCaja = new DalGestionCaja();

                //DataSet tiposDocumentos = await dlEconomia.CajaTiposComprobantesParaMigracion();
                DataSet listaCajas = await daoGestionCaja.ListarCajaTodos();
                DataSet listaTurnos = await daoGestionCaja.ListarCajaTurnosTodos();
                DataSet listaCajeros = await daoGestionCaja.ListarCajerosTodos();

                //ViewBag.TiposDocumentos = tiposDocumentos;
                ViewBag.ListaCajas = listaCajas;
                ViewBag.ListaTurnos = listaTurnos;
                ViewBag.ListaCajeros = listaCajeros;
                ViewBag.Vista = (int)Enumerados.Grupo.Caja;
                ViewBag.Area = "Caja";
                ViewBag.Modulo = "Cajas";
                ViewBag.Icono = "fa-cash-register";
                return View("~/Views/Caja/Cajas.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        public async Task<IActionResult> GestionCaja(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                string ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                DalEmpleado dlEmpleado = new DalEmpleado();
                DalUtilitario dalUtilitario = new DalUtilitario();

                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                int PermisoCorrecionComprobante = await dalUtilitario.ValidarPermisoUsuario(idUsuario, "CAJA-CORRECCION-COMPROBANTE");
                int PermisoOpcionesPago = await dalUtilitario.ValidarPermisoUsuario(idUsuario, "CAJA-OPCIONES-PAGO");
                int PermisoHabilitarEnvioSunat = await dalUtilitario.ValidarPermisoUsuario(idUsuario, "CAJA-HABILITA-ENVIO-SUNAT");

                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                    ViewBag.PermisoCorrecionComprobante = PermisoCorrecionComprobante;
                    ViewBag.PermisoOpcionesPago = PermisoOpcionesPago;
                    ViewBag.PermisoHabilitarEnvioSunat = PermisoHabilitarEnvioSunat;

                    ViewBag.AperturaCaja = true;
                    ViewBag.CierreCaja = true;
                }
                
                DalEconomia dlEconomia = new DalEconomia();
                DalGestionCaja daoGestionCaja = new DalGestionCaja();
                DalPaciente dalPaciente = new DalPaciente();
                Encriptar objCripto = new Encriptar();

                //DataSet tiposDocumentos = await dlEconomia.CajaTiposComprobantesParaMigracion();
                DataSet listaGestionCaja = await daoGestionCaja.ValidarAperturaCierreCaja(ip, idUsuario, idListBar);
                DataSet listaCajas = await daoGestionCaja.ListarCajaTodos();
                DataSet listaTurnos = await daoGestionCaja.ListarCajaTurnosTodos();
                DataSet listaCajeros = await daoGestionCaja.ListarCajerosTodos();
                DataSet listaTiposNumeracionHistoria = await dalPaciente.TiposNumeracionHistoriaSeleccionarTodos();
                DataSet listaTiposFinanciamientoGeneraPago = await daoGestionCaja.ListarTiposFinanciamientosSeleccionarPorGeneraPagos(1);
                DataSet listaTiposDocumentosIdentidad = await daoGestionCaja.ListarTiposDocumentosIdentidad();
                DataSet listaTiposComprobantes = await daoGestionCaja.ListarTiposComprobantes();
                DataSet listaFormasPago = await daoGestionCaja.ListarFormasPago();

                //ViewBag.TiposDocumentos = tiposDocumentos;
                if (listaGestionCaja.Tables[0].Rows[0]["SuccessNumber"].ToString() == "1")
                {
                    //ViewBag.IdGestionCaja = Int32.Parse(listaGestionCaja.Tables[0].Rows[0]["IdGestionCaja"].ToString());
                    if (Int32.Parse(listaGestionCaja.Tables[0].Rows[0]["IdGestionCaja"].ToString()) > 0)
                    {
                        ViewBag.CodigoGestionCaja = objCripto.EncriptarCadena(listaGestionCaja.Tables[0].Rows[0]["IdGestionCaja"].ToString());
                        //ViewBag.CodigoGestionCaja2 = objCripto.EncriptarCadena(listaGestionCaja.Tables[0].Rows[0]["IdGestionCaja2"].ToString());
                        ViewBag.IdCaja = listaGestionCaja.Tables[0].Rows[0]["IdCaja"].ToString();
                    } 
                    else
                    {
                        ViewBag.CodigoGestionCaja = "";
                        //ViewBag.CodigoGestionCaja2 = objCripto.EncriptarCadena(listaGestionCaja.Tables[0].Rows[0]["IdGestionCaja2"].ToString());
                        ViewBag.IdCaja = "";
                    }
                    
                    ViewBag.EstadoCaja = listaGestionCaja.Tables[0].Rows[0]["EstadoCaja"].ToString();
                    ViewBag.CajeroAperturo = listaGestionCaja.Tables[0].Rows[0]["Cajero"].ToString();
                    ViewBag.CajaAperturo = listaGestionCaja.Tables[0].Rows[0]["Caja"].ToString();
                }
                else
                {
                    ViewBag.CodigoGestionCaja = "";
                    ViewBag.EstadoCaja = "";
                    ViewBag.CajeroAperturo = "";
                    ViewBag.CajaAperturo = "";
                }

                ViewBag.ListaCajas = listaCajas;
                ViewBag.ListaTurnos = listaTurnos;
                ViewBag.ListaCajeros = listaCajeros;
                ViewBag.ListaTiposNumeracionHistoria = listaTiposNumeracionHistoria.Tables[0];
                ViewBag.ListaTiposFinanciamientoGeneraPago = listaTiposFinanciamientoGeneraPago.Tables[0];
                ViewBag.ListaTiposDocumentosIdentidad = listaTiposDocumentosIdentidad.Tables[0];
                ViewBag.ListaTiposComprobantes = listaTiposComprobantes.Tables[0];
                ViewBag.ListaFormasPago = listaFormasPago.Tables[0];
                ViewBag.Vista = (int)Enumerados.Grupo.Caja;
                ViewBag.Area = "Caja";
                ViewBag.Modulo = "Gestión Caja";
                ViewBag.Icono = "fi fi-ss-payment-pos";
                return View("~/Views/Caja/GestionCaja.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }


        public async Task<IActionResult> NotaCredito(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                }

                DalNotaCredito dalNotaCredito = new DalNotaCredito();

                DataSet dsEstadosNota = await dalNotaCredito.NotaCreditoListarEstados();
                DataSet dsTiposComprobantes = await dalNotaCredito.NotaCreditoListarTiposComprobantes();
                DataSet dsTiposDocumentos = await dalNotaCredito.NotaCreditoListarTiposDocumentos();
                DataSet dsMotivos = await dalNotaCredito.NotaCreditoListarMotivos();

                ViewBag.EstadosNota = dsEstadosNota.Tables[0];
                ViewBag.TiposComprobantes = dsTiposComprobantes.Tables[0];
                ViewBag.TiposDocumentos = dsTiposDocumentos.Tables[0];
                ViewBag.Motivos = dsMotivos.Tables[0];
                ViewBag.Vista = (int)Enumerados.Grupo.Caja;
                ViewBag.Area = "Caja";
                ViewBag.Modulo = "Nota de Credito";
                ViewBag.Icono = "fi-ss-money-transfer-alt";
                return View("~/Views/Caja/NotaCredito.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        public async Task<IActionResult> NotaDebito(int idListBar)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalEmpleado dlEmpleado = new DalEmpleado();
                RolesItems objRol = await dlEmpleado.DevuelveRolxItem(idUsuario, idListBar);
                // FIN ROLES LUIS
                //RolesItems objRol = Empleado.DevuelveRolxItem(idListBar);
                if (objRol == null)
                {
                    return View("AccesoDenegado");
                }
                else
                {
                    ViewBag.Agregar = objRol.Agregar;
                    ViewBag.Modificar = objRol.Modificar;
                    ViewBag.Eliminar = objRol.Eliminar;
                    ViewBag.Consultar = objRol.Consultar;

                }
                                
                DalNotaDebito dalNotaDebito = new DalNotaDebito();

                DataSet dsEstadosNota = await dalNotaDebito.NotaDebitoListarEstados();
                DataSet dsTiposComprobantes = await dalNotaDebito.NotaDebitoListarTiposComprobantes();
                DataSet dsTiposDocumentos = await dalNotaDebito.NotaDebitoListarTiposDocumentos();                
                DataSet dsMotivos = await dalNotaDebito.NotaDebitoListarMotivos();

                //ViewBag.TiposDocumentos = tiposDocumentos;
                ViewBag.EstadosNota = dsEstadosNota.Tables[0];
                ViewBag.TiposComprobantes = dsTiposComprobantes.Tables[0];
                ViewBag.TiposDocumentos = dsTiposDocumentos.Tables[0];
                ViewBag.Motivos = dsMotivos.Tables[0];
                ViewBag.Vista = (int)Enumerados.Grupo.Caja;
                ViewBag.Area = "Caja";
                ViewBag.Modulo = "Nota de Debito";
                ViewBag.Icono = "fi fi-ss-money-bill-transfer";
                return View("~/Views/Caja/NotaDebito.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }



    }
}
