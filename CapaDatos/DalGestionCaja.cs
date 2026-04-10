using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using WebAppMaternidad.CapaEntidades;
using System.Collections.Generic;
using System;
using CapaEntidades;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using NPOI.SS.Formula.Functions;
using static CapaEntidades.ListBarItemEnum;

namespace CapaDatos
{
    public class DalGestionCaja
    {
        public Task<DataSet> ListarCajaComprobantesPago(GestionCaja gestion, string tipoComprobante)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarCajaComprobantesPago";
                        
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@TipoComprobante", SqlDbType.VarChar).Value = tipoComprobante;
                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = gestion.NroSerie == null ? "" : gestion.NroSerie;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = gestion.NroDocumento == null ? "" : gestion.NroDocumento;
                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = gestion.NroHistoria;
                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = gestion.IdCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@IdCaja", SqlDbType.Int).Value = gestion.IdCaja;
                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = gestion.IdTurno;
                        da.SelectCommand.Parameters.Add("@IdCajero", SqlDbType.Int).Value = gestion.IdCajero;
                        da.SelectCommand.Parameters.Add("@RazonSocial", SqlDbType.VarChar).Value = gestion.RazonSocial == null ? "" : gestion.RazonSocial;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.VarChar).Value = gestion.FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = gestion.FechaFin;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CajaComprobantesPagoListar(GestionCaja gestion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {                        
                        string sql = "web_CajaComprobantesPagoListar";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = gestion.NroSerie == null ? "" : gestion.NroSerie;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = gestion.NroDocumento == null ? "" : gestion.NroDocumento;
                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = gestion.NroHistoria;
                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = gestion.IdCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@IdCaja", SqlDbType.Int).Value = gestion.IdCaja;
                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = gestion.IdTurno;
                        da.SelectCommand.Parameters.Add("@IdCajero", SqlDbType.Int).Value = gestion.IdCajero;
                        da.SelectCommand.Parameters.Add("@RazonSocial", SqlDbType.VarChar).Value = gestion.RazonSocial == null ? "" : gestion.RazonSocial;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.VarChar).Value = gestion.FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = gestion.FechaFin;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarEstadoSunatComprobantePago(GestionCaja gestion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarEstadoSunatComprobantePago";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoComprobante", SqlDbType.Int).Value = gestion.IdTipoComprobante;
                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = gestion.NroSerie == null ? "" : gestion.NroSerie;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = gestion.NroDocumento == null ? "" : gestion.NroDocumento;                       

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarEstadoSunatNotasCreditoDebito(GestionCaja gestion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarEstadoSunatNotasCreditoDebito";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoComprobante", SqlDbType.Int).Value = gestion.IdTipoComprobante;
                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = gestion.NroSerie == null ? "" : gestion.NroSerie;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = gestion.NroDocumento == null ? "" : gestion.NroDocumento;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarCajaTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CajaCajaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarCajaTurnosTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CajaTurnoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarCajerosTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CajerosSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> CajaNroDocumentoSeleccionarPorId(string IdTipoComprobante, string IdCaja)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CajaNroDocumentoSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoComprobante", IdTipoComprobante);
                cmd.Parameters.AddWithValue("@IdCaja", IdCaja);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<int> CajaNroDocumentoModificar(int IdTipoComprobante, string NroDocumento, string NroSerie, string NroDocumentoFinal, int IdCaja, string NroDocumentoInicial, int IdUsuarioAuditoria)
        {
            int nRpta;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CajaNroDocumentoModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoComprobante", IdTipoComprobante);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@NroSerie", NroSerie);
                cmd.Parameters.AddWithValue("@NroDocumentoFinal", NroDocumentoFinal);
                cmd.Parameters.AddWithValue("@IdCaja", IdCaja);
                cmd.Parameters.AddWithValue("@NroDocumentoInicial", NroDocumentoInicial);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }


        }

        public async Task<DataSet> TiposFinanciamientoGeneraReciboPago(int IdTipoFinanciamiento)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposFinanciamientoSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", IdTipoFinanciamiento);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> ConsultaBloqueaTablaXidTipoFinanciamiento(int idTipoFinanciamiento)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ConsultaBloqueaTablaXidTipoFinanciamiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", idTipoFinanciamiento);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> CajaComprobantePagoServiciosPorNroSerieNroDocumentoByMGP(string NroSerie, string NroDocumento, int idTipoComprobante)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CajaComprobantePagoServiciosPorNroSerieNroDocumentoByMGP", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@NroSerie", NroSerie);
                da.SelectCommand.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                da.SelectCommand.Parameters.AddWithValue("@idTipoComprobante", idTipoComprobante);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<DataSet> CorregirComprobantePago(int idComprobantePago)
        {
            Conexion cx = new Conexion();            

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CorregirComprobantePago";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdComprobantePago", idComprobantePago);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ListarTiposFinanciamientosSeleccionarPorGeneraPagos(int generaPago)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            int tipoGeneraPago = 0;
            if(generaPago == 1 || generaPago == 2 || generaPago == 3 || generaPago == 4)    //sghTodosLosQuePaganEnCaja = 1 ,  sghSoloSeguroSIS = 2  , sghSoloSeguroSOAT = 3 , sghSoloSeguroConvenios = 4
            {
                tipoGeneraPago = 1;
            }
            else                        //sghTodosLosQueTienenAlgunSeguro = 5
            {
                tipoGeneraPago = 2;
            }

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposFinanciamientosSeleccionarPorGeneraPagos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@generaPago", SqlDbType.Int).Value = generaPago;
                        da.SelectCommand.Parameters.Add("@TipoGeneraPago", SqlDbType.Int).Value = tipoGeneraPago; 

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarTiposDocumentosIdentidad()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "listaTiposDocIdentidadParaPagos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarTiposComprobantes()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CajaTiposComprobanteSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFormasPago()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FormasPagoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        //////////////////////////EMISION COMPROBANTE///////////////////////////////////////
        public Task<DataSet> ValidarAperturaCierreCaja(string ip, int idCajero, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ValidarAperturaCierreCaja";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Ip", ip);
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idCajero);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> AperturaCaja(string ip, int idCajero, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AperturaCaja";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Ip", ip);
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idCajero);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CierreCaja(string ip, int idCajero, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CierreCaja";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Ip", ip);
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idCajero);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ObtenerSiguienteDocumento(int idCaja, int idTipoComprobante)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerSiguienteDocumentoComprobantePago";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCaja", SqlDbType.Int).Value = (object)idCaja ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoComprobante", SqlDbType.Int).Value = (object)idTipoComprobante ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ObtenerDatosPacienteParaCobrar(int tipoHistoria, string historia, string nroDocumento, string nroCuenta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerDatosPacienteParaCobrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoHistoria", SqlDbType.Int).Value = (object)tipoHistoria ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.VarChar).Value = (object)historia ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (object)nroDocumento ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.VarChar).Value = (object)nroCuenta ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta(int idCuenta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (object)idCuenta ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ObtenerItemsServiciosParaCobrarPorReceta(int idReceta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerItemsServiciosParaCobrarPorReceta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdReceta", SqlDbType.Int).Value = (object)idReceta ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        
        public Task<DataSet> ObtenerItemsServiciosFarmaciaParaCobrarPorOrden(int idOrdenPago, int idPreventa)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerItemsServiciosFarmaciaParaCobrarPorOrden";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdOrdenPago", SqlDbType.Int).Value = (object)idOrdenPago ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdPreventa", SqlDbType.Int).Value = (object)idPreventa ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ObtenerItemsPersonalizadoParaCobrar(int idCuentaAtencion, int idTipoItem)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ObtenerItemsPersonalizadoParaCobrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (object)idCuentaAtencion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoItem", SqlDbType.Int).Value = (object)idTipoItem ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> EmisionComprobanteGuardar(CajaComprobantePago comprobante, List<DetalleItems> lstDetalle, string ip, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<DetalleItems>), lstDetalle);

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CajaComprobantePagoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Ip", ip);
                        //da.SelectCommand.Parameters.AddWithValue("@IdCaja", comprobante.IdCaja);
                        da.SelectCommand.Parameters.AddWithValue("@IdGestionCaja", comprobante.IdGestionCaja);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoComprobante", comprobante.IdTipoComprobante);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoPago", comprobante.IdTipoPago);
                        da.SelectCommand.Parameters.AddWithValue("@IdFormaPago", comprobante.IdFormaPago);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoPagoCaja", comprobante.IdTipoPagoCaja);
                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", comprobante.IdPaciente ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", comprobante.IdCuentaAtencion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoFinanciamiento", comprobante.IdTipoFinanciamiento);
                        //da.SelectCommand.Parameters.AddWithValue("@IdOrdenPagoServicio", comprobante.IdOrdenPagoServicio ?? (object)DBNull.Value);
                        //da.SelectCommand.Parameters.AddWithValue("@IdOrdenPagoFarmacia", comprobante.IdOrdenPagoFarmacia ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdOrdenPagoVenta", comprobante.IdOrdenPagoVenta ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdReceta", comprobante.IdReceta ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoDocIdentidad", comprobante.IdTipoDocIdentidad ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@NroDocumentoIdentidad", comprobante.NroDocumentoIdentidad ?? (object)DBNull.Value);
                        //da.SelectCommand.Parameters.AddWithValue("@DniReceptor", comprobante.DniReceptor ?? (object)DBNull.Value);
                        //da.SelectCommand.Parameters.AddWithValue("@Ruc", comprobante.RUC ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@RazonSocial", comprobante.RazonSocial);
                        da.SelectCommand.Parameters.AddWithValue("@Direccion", comprobante.Direccion);
                        da.SelectCommand.Parameters.AddWithValue("@CorreoElectronico", comprobante.CorreoElectronico ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Observaciones", comprobante.Observaciones ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@DetalleItemsXml", xmlDetalle ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> EmisionComprobanteEliminar(int idGestionCaja, int idComprobantePago, string ip, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
           
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CajaComprobantePagoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Ip", ip);
                        //da.SelectCommand.Parameters.AddWithValue("@IdCaja", comprobante.IdCaja);
                        da.SelectCommand.Parameters.AddWithValue("@IdGestionCaja", idGestionCaja);
                        da.SelectCommand.Parameters.AddWithValue("@IdComprobantePago", idComprobantePago);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ComprobantePagoHabilitarEnvioSunat(int idComprobantePago, int idNotaCredito, int idNotaDebito, string ip, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ComprobantePagoHabilitarMigracionSunat";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.AddWithValue("@IdComprobantePago", idComprobantePago);
                        da.SelectCommand.Parameters.AddWithValue("@IdNotaCredito", idNotaCredito);
                        da.SelectCommand.Parameters.AddWithValue("@IdNotaDebito", idNotaDebito);

                        //da.SelectCommand.Parameters.AddWithValue("@Ip", ip);
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> ComprobantePagoFormato(int idComprobantePago)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ComprobantePagoFormato";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdComprobantePago", SqlDbType.Int).Value = (object)idComprobantePago ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> NotaCreditoDebitoSeleccionar(int idTipoNota, string nroSerie, string nroDocumento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_NotaCreditoDebitoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@IdTipoNota", SqlDbType.Int).Value = (object)idTipoNota ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroSerie", SqlDbType.VarChar).Value = (object)nroSerie ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (object)nroDocumento ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CanjeNotaCreditoDebitoGuardar(int idTipoNota, int idNota, int idGestionCaja, string ip, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CanjeNotaCreditoDebitoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoNota", SqlDbType.Int).Value = (object)idTipoNota ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdNota", SqlDbType.Int).Value = (object)idNota ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdGestionCaja", SqlDbType.Int).Value = (object)idGestionCaja ?? DBNull.Value;

                        da.SelectCommand.Parameters.Add("@Ip", SqlDbType.VarChar).Value = (object)ip ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = (object)idUsuario ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = (object)idListBar ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CanjeNotaCreditoDebitoEliminar(int idTipoNota, int idNota, int idGestionCaja, string ip, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CanjeNotaCreditoDebitoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoNota", SqlDbType.Int).Value = (object)idTipoNota ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdNota", SqlDbType.Int).Value = (object)idNota ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdGestionCaja", SqlDbType.Int).Value = (object)idGestionCaja ?? DBNull.Value;

                        da.SelectCommand.Parameters.Add("@Ip", SqlDbType.VarChar).Value = (object)ip ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = (object)idUsuario ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = (object)idListBar ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
