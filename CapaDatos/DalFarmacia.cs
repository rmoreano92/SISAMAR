using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using iText.StyledXmlParser.Node;
using Microsoft.IdentityModel.Tokens;
using NPOI.SS.Formula.Functions;
using WebAppMaternidad.CapaEntidades;
using WebAppSaludOcupacional.CapaEntidades;
namespace CapaDatos
{
    public class DalFarmacia
    {
        public Task<DataSet> FarmaciasSegunFiltro(string filtro, int idIpress = 0)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FarmAlmacenFiltrarByWeb2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;
                        da.SelectCommand.Parameters.Add("@IdIpress", SqlDbType.Int).Value = idIpress;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });


        }

        public Task<DataSet> FarmaciasSeleccionarSegunFiltro(string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FarmAlmacenFiltrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = (Filtro == null) ? "" : Filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });


        }

        public Task<DataSet> FarmTipoDocumentosDevuelveTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FarmTipoDocumentosDevuelveTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });


        }

        public Task<DataSet> FarmTipoConceptosDevuelveParaRegistroDeNiNs(string TipoAlmacen, string TipoMov, string TipoSuministro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FarmTipoConceptosDevuelveParaRegistroDeNiNs_V2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@TipoAlmacen", SqlDbType.VarChar).Value = TipoAlmacen;
                        da.SelectCommand.Parameters.Add("@TipoMov", SqlDbType.VarChar).Value = TipoMov;
                        da.SelectCommand.Parameters.Add("@TipoSuministro", SqlDbType.VarChar).Value = TipoSuministro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> FarmTipoConceptoDevuelveParaRegistroDeNiNsSeleccionar(int IdTipoConcepto, string TipoAlmacen, string TipoMov, string TipoSuministro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmTipoConceptoDevuelveParaRegistroDeNiNsSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoConcepto", SqlDbType.VarChar).Value = IdTipoConcepto;
                        da.SelectCommand.Parameters.Add("@TipoAlmacen", SqlDbType.VarChar).Value = TipoAlmacen;
                        da.SelectCommand.Parameters.Add("@TipoMov", SqlDbType.VarChar).Value = TipoMov;
                        da.SelectCommand.Parameters.Add("@TipoSuministro", SqlDbType.VarChar).Value = TipoSuministro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public async Task<DataSet> farmSaldoTotalesSoloMayoresAcero(string filtro, int ordenarPor)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_farmSaldoTotalesSoloMayoresAcero", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Filtro", filtro);
                cmd.Parameters.AddWithValue("@Order", " ORDER BY dbo.FactCatalogoBienesInsumos.Nombre");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }

        }

        public async Task<DataSet> farmAntimicrobianosSaldoTotalesSoloMayoresAcero(string filtro, int ordenarPor)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_farmAntimicrobianosSaldoTotalesSoloMayoresAcero", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Filtro", filtro);
                cmd.Parameters.AddWithValue("@Order", " ORDER BY dbo.FactCatalogoBienesInsumos.Nombre");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }

        }

        public async Task<DataSet> farmIntervencionSanitariaSaldoTotalesSoloMayoresAcero(string filtro, int ordenarPor)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_farmIntervencionSanitariaSaldoTotalesSoloMayoresAcero", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", filtro);
                cmd.Parameters.AddWithValue("@Order", " ORDER BY dbo.FactCatalogoBienesInsumos.Nombre");

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public Task<DataSet> ListarFarmAlmacenes()
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_ListarFarmAlmacenes";
                    SqlCommand cmd = new SqlCommand(sql, conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand = cmd;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }

            });


        }


        public Task<DataSet> ListarTiposCompraSegunFiltro(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FarmTipoCompraDevuelveSegunFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = filtro == null ? "" : filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> ListarTiposProcesoSegunFiltro(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FarmTipoProcesoDevuelveSegunFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = filtro == null ? "" : filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }




        ///////////////////////KHOYOSI//////////////////////////////////
        public Task<DataSet> ListarTodosAlmacenMenosExternos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "farmAlmacenSeleccionarTodosMenosExternos";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> BuscarBienInsumoPorCodigoDescripcion(string codigo, string descripcion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "FactCatalogoBienesInsumosSeleccionarXDescripYcodigo";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@lcCodigo", SqlDbType.VarChar).Value = codigo == null ? "" : codigo;
                    da.SelectCommand.Parameters.Add("@lcDescripcion", SqlDbType.VarChar).Value = descripcion == null ? "" : descripcion;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> LlenaDataComboTipoSalidaBienSegunAlmacen(int idAlmacen)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "LlenaDataComboTipoSalidaBienSegunAlmacen";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarKardexFarmacia(int IdAlmacen, int IdProducto, int IdTipoSalida, DateTime FechaInicio, DateTime FechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_KardexFarmacia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = IdProducto;
                        da.SelectCommand.Parameters.Add("@IdTipoSalidaBienInsumo", SqlDbType.Int).Value = IdTipoSalida;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.DateTime).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.DateTime).Value = FechaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> RptKardexFarmacia(int IdAlmacen, int IdProducto, int IdTipoSalida, DateTime FechaInicio, DateTime FechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RptKardexFarmacia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = IdProducto;
                        da.SelectCommand.Parameters.Add("@IdTipoSalidaBienInsumo", SqlDbType.Int).Value = IdTipoSalida;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.DateTime).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.DateTime).Value = FechaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarSaldosConLotes(int IdAlmacen, int IdProducto, int IdTipoSalida)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_farmDevuelveSaldosConLote";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = IdProducto;
                        da.SelectCommand.Parameters.Add("@IdTipoSalida", SqlDbType.Int).Value = IdTipoSalida;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ActualizarFechaVencimientoDeLote(int IdAlmacen, int IdProducto, int IdTipoSalida, string Lote, string FechaActual, string FechaNueva, int IdUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmaciaActualizaFechaDeVencimiento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = IdProducto;
                        da.SelectCommand.Parameters.Add("@IdTipoSalida", SqlDbType.Int).Value = IdTipoSalida;
                        da.SelectCommand.Parameters.Add("@Lote", SqlDbType.VarChar).Value = Lote;
                        da.SelectCommand.Parameters.Add("@FechaActual", SqlDbType.VarChar).Value = FechaActual;
                        da.SelectCommand.Parameters.Add("@FechaNueva", SqlDbType.VarChar).Value = FechaNueva;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FarmaciaActualizaLote(int IdAlmacen, int IdProducto, int IdTipoSalida, string Lote, string FechaActual, string LoteNuevo, int IdUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmaciaActualizaLote";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = IdProducto;
                        da.SelectCommand.Parameters.Add("@IdTipoSalida", SqlDbType.Int).Value = IdTipoSalida;
                        da.SelectCommand.Parameters.Add("@Lote", SqlDbType.VarChar).Value = Lote;
                        da.SelectCommand.Parameters.Add("@FechaActual", SqlDbType.VarChar).Value = FechaActual;
                        da.SelectCommand.Parameters.Add("@LoteNuevo", SqlDbType.VarChar).Value = LoteNuevo;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente(int lnIdAlmacen, string lcFiltro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "Web_FarmMovimientoDetalleDevuelveSaldosConLotesSegunAlmacenCliente";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@lnIdAlmacen", SqlDbType.Int).Value = lnIdAlmacen;
                    da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro == null ? "" : lcFiltro;


                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }

            });
        }

        public Task<DataSet> FactCatalogoBienesInsumosSeleccionarBienesLike(string lcFiltro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_FactCatalogoBienesInsumosSeleccionarBienesLike";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro == null ? "" : lcFiltro;


                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }

            });
        }


        public async Task<DataSet> FarmMovimientoSeleccionarPorTipoYnumeroDocumento(string documentoNumero, string idTipoLocales, string MovTipo, string idTipoSuministro, string documentoIdTipo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmMovimientoSeleccionarPorTipoYnumeroDocumento_V2", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@documentoNumero", documentoNumero);
                cmd.Parameters.AddWithValue("@idTipoLocales", idTipoLocales);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo);
                cmd.Parameters.AddWithValue("@idTipoSuministro", idTipoSuministro);
                cmd.Parameters.AddWithValue("@documentoIdTipo", documentoIdTipo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> FarmaciaMovimientoSeleccionarPorTipoYnumeroDocumento(string documentoNumero, string documentoIdTipo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmMovimientoSeleccionarPorTipoYnumeroDocumento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@documentoNumero", documentoNumero);
                cmd.Parameters.AddWithValue("@documentoIdTipo", documentoIdTipo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> FarmRelModDevuelveSegunFiltro(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmRelModDevuelveSegunFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<int> FarmRelModActualizaSegunFiltro(string filtro, string lcDocumento) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmRelModActualizaSegunFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@filtro", filtro);
                cmd.Parameters.AddWithValue("@lcDocumento", lcDocumento);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> FarmDevuelveYactualizaCorrelativosDeDocumentosES(int IdTipoDocumento) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            DalParametros dalParametros = new DalParametros();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmDevuelveYactualizaCorrelativosDeDocumentosES", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoDocumento", IdTipoDocumento);
                cmd.Parameters.Add("@NewCorrelativo", SqlDbType.Int).Direction = ParameterDirection.Output;



                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@NewCorrelativo"].Value.ToString());

                if (IdTipoDocumento == 1 || IdTipoDocumento == 2)
                {
                    DataSet fechaServidor = await dalParametros.RetornaFechaServidorV2();
                    DateTime fecha = DateTime.Parse((fechaServidor.Tables[0].Rows[0]["FechaHoraSQL"]).ToString());
                    var year = fecha.ToString("yyyy");

                    var numeroFormato = year.Substring(2, 2) + nRpta.ToString("D7");

                    nRpta = Int32.Parse(numeroFormato.ToString());
                }

                return nRpta;
            }
        }

        public async Task<DataSet> FarmDevuelveSaldosSegunAlmacenProductoLote(int idAlmacen, int idProducto, string lote, DateTime fechaVencimiento, int idTipoSalidaBienInsumo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmDevuelveSaldosSegunAlmacenProductoLote", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idAlmacen", idAlmacen);
                cmd.Parameters.AddWithValue("@idProducto", idProducto);
                cmd.Parameters.AddWithValue("@lote", lote);
                cmd.Parameters.AddWithValue("@fechaVencimiento", fechaVencimiento);
                cmd.Parameters.AddWithValue("@idTipoSalidaBienInsumo", idTipoSalidaBienInsumo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<int> FarmMovimientoAgregarModificar(FarmMovimiento farmMovimiento, int esNotaIngresoAutomatica, List<FarmMovimientoDetalle> lstObjDetalleNotaSalida) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            string xmlMovimientoDetalle;
            xmlMovimientoDetalle = XmlUtil.Serializer(typeof(List<FarmMovimientoDetalle>), lstObjDetalleNotaSalida);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_farmMovimientoAgregarModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", farmMovimiento.MovNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MovTipo", farmMovimiento.MovTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idAlmacenOrigen", farmMovimiento.idAlmacenOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idAlmacenDestino", farmMovimiento.idAlmacenDestino ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idTipoConcepto", farmMovimiento.idTipoConcepto ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DocumentoIdtipo", farmMovimiento.DocumentoIdtipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DocumentoNumero", farmMovimiento.DocumentoNumero ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@DocumentoFechaRecepcion", farmMovimiento.DocumentoFechaRecepcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@OrigenIdTipo", farmMovimiento.OrigenIdTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@OrigenNumero", farmMovimiento.OrigenNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@OrigenFecha", farmMovimiento.OrigenFecha ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idProveedor", farmMovimiento.idProveedor ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ruc", farmMovimiento.ruc ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@razonSocial", farmMovimiento.razonSocial ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idTipoCompra", farmMovimiento.idTipoCompra ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idTipoProceso", farmMovimiento.idTipoProceso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NumeroProceso", farmMovimiento.NumeroProceso ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idPaciente", farmMovimiento.idPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", farmMovimiento.idCuentaAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idComprobantePago", farmMovimiento.idComprobantePago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", farmMovimiento.idFuenteFinanciamiento ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@Observaciones", farmMovimiento.Observaciones ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Total", farmMovimiento.Total ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idUsuario", farmMovimiento.idUsuario ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idEstadoMovimiento", farmMovimiento.idEstadoMovimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@esNotaIngresoAutomatica", esNotaIngresoAutomatica);
                cmd.Parameters.Add("@movimientoDetalle", SqlDbType.Xml).Value = xmlMovimientoDetalle;
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", farmMovimiento.idUsuario ?? Convert.DBNull);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                // Parámetro OUTPUT para capturar el resultado
                var pResultado = new SqlParameter("@Resultado", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(pResultado);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                // Leer el valor output (puede ser null si el SP lanzó excepción antes de asignarlo)
                return pResultado.Value != DBNull.Value ? Convert.ToInt32(pResultado.Value) : 0;
            }
        }

        public async Task<DataSet> FarmDevuelveMovimientos(string MovTipo, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FarmDevuelveMovimientos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovTipo", MovTipo);
                cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> FarmMovimientoDetalleByMovNumero(string MovNumero, string MovTipo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FarmMovimientoDetalleByMovNumero", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", MovNumero);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> FarmUnidosisSeleccionarTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_farmUnidosisSeleccionarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> FarmMovimientoSeleccionarSoloPorTipoYnumeroDocumentoYmovTipo(string documentoNumero, string documentoIdTipo, string MovTipo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_farmMovimientoSeleccionarPorTipoYnumeroDocumentoYmovNumero", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@documentoNumero", documentoNumero);
                cmd.Parameters.AddWithValue("@documentoIdTipo", documentoIdTipo);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> RecetaFiltrar(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("RecetaFiltrar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> DevuelveServiciosDelHospitalFiltro(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("DevuelveServiciosDelHospitalFiltro", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@lcFiltro", Filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> RecetasDevuelveDatosDelDetalle(int IdReceta, int IdPuntoCarga, int PtoCargaFarmacia)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("RecetasDevuelveDatosDelDetalle", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdReceta", IdReceta);
                cmd.Parameters.AddWithValue("@IdPuntoCarga", IdPuntoCarga);
                cmd.Parameters.AddWithValue("@PtoCargaFarmacia", PtoCargaFarmacia);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> FactCatalogoBienesInsumosXcodigoYtipofinanciamiento(int IdTipoFinanciamiento, string codigo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FactCatalogoBienesInsumosXcodigoYtipofinanciamiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", IdTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@codigo", codigo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> FarmDevuelveSaldosSegunAlmacenProducto(int idAlmacen, int idProducto)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmDevuelveSaldosSegunAlmacenProducto", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idAlmacen", idAlmacen);
                cmd.Parameters.AddWithValue("@idProducto", idProducto);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> FarmDevuelveSaldosSegunAlmacenProductoTipoSalida(int idAlmacen, int idProducto, int idTipoSalidaBienInsumo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_farmDevuelveSaldosSegunAlmacenProductoTipoSalida", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idAlmacen", idAlmacen);
                cmd.Parameters.AddWithValue("@idProducto", idProducto);
                cmd.Parameters.AddWithValue("@idTipoSalida", idTipoSalidaBienInsumo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> RecetaCabeceraPoridReceta(string lnidReceta)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("RecetaCabeceraPoridReceta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@lnidReceta", lnidReceta);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> RecetaCabeceraDetalleSeleccionaPorNroReceta(string IdReceta)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_RecetaCabeceraDetalleSeleccionaPorNroRecetaV2", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdReceta", IdReceta);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> FarmDevuelveSaldosConLotesSegunAlmacen(int IdAlmacen, int Orden, string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmDevuelveSaldosConLotesSegunAlmacen", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdAlmacen", IdAlmacen);
                cmd.Parameters.AddWithValue("@Orden", Orden);
                cmd.Parameters.AddWithValue("@Filtro", Filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<int> FarmMovimientoVentasAgregar(FarmMovimientoVentas farmMovimientoVentas, int IdUsuarioAuditoria) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_farmMovimientoVentasAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@movNumero", farmMovimientoVentas.movNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@movTipo", farmMovimientoVentas.movTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@tipoVenta", farmMovimientoVentas.tipoVenta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idPreVenta", farmMovimientoVentas.idPreVenta == "null" ? Convert.DBNull : farmMovimientoVentas.idPreVenta);
                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", farmMovimientoVentas.idTipoFinanciamiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idPrescriptor", farmMovimientoVentas.idPrescriptor == "null" ? Convert.DBNull : farmMovimientoVentas.idPrescriptor);
                cmd.Parameters.AddWithValue("@idTipoReceta", farmMovimientoVentas.idTipoReceta ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idDiagnostico", farmMovimientoVentas.idDiagnostico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", farmMovimientoVentas.idCuentaAtencion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdServicioPaciente", farmMovimientoVentas.IdServicioPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idFuenteFinanciamiento", farmMovimientoVentas.idFuenteFinanciamiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idPaciente", farmMovimientoVentas.idPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaHoraPrescribe", farmMovimientoVentas.FechaHoraPrescribe ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaquete", farmMovimientoVentas.IdPaquete ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@PresExternoCmp", farmMovimientoVentas.PresExternoCmp ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PresExternoMedico", farmMovimientoVentas.PresExternoMedico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PresExternoFecha", farmMovimientoVentas.PresExternoFecha ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@NroFormato", farmMovimientoVentas.NroFormato ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> FarmMovimientoVentasDetalleAgregar(FarmMovimientoVentasDetalle farmMovimientoVentasDetalle, int IdUsuarioAuditoria) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("farmMovimientoVentasDetalleAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", farmMovimientoVentasDetalle.MovNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MovTipo", farmMovimientoVentasDetalle.MovTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idProducto", farmMovimientoVentasDetalle.idProducto ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@cantidad", farmMovimientoVentasDetalle.cantidad ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@precio", farmMovimientoVentasDetalle.precio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@total", farmMovimientoVentasDetalle.total ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();
                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }


        public async Task<int> FactOrdenesBienesAgregar(int idPuntoCarga, int IdPaciente, int idCuentaAtencion, int? idComprobantePago, string MovNumero, string MovTipo, int idPreventa, int idUsuario, int idEstadoFacturacion, string ImporteExonerado, string DNI, string NombPaciente) // // JDELGADO003-C
        {

            int idOrden = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FactOrdenesBienesAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@idOrden", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idComprobantePago", idComprobantePago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MovNumero", MovNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idPreventa", idPreventa);
                cmd.Parameters.AddWithValue("@FechaCreacion", DateTime.Now);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@idEstadoFacturacion", idEstadoFacturacion);
                cmd.Parameters.AddWithValue("@ImporteExonerado", ImporteExonerado);
                cmd.Parameters.AddWithValue("@idUsuarioExonera", Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                cmd.Parameters.AddWithValue("@DNI", DNI);
                cmd.Parameters.AddWithValue("@NombPaciente", NombPaciente);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                idOrden = int.Parse(cmd.Parameters["@idOrden"].Value.ToString());

                //await conn.CloseAsync();

                return idOrden;
            }
        }


        public async Task<int> FactOrdenesBienesAgregarVentas(int idPuntoCarga, int IdPaciente, int idCuentaAtencion, int? idComprobantePago, string MovNumero, string MovTipo, int idPreventa, int idUsuario, int idEstadoFacturacion, string ImporteExonerado, string DNI, string NombPaciente) // // JDELGADO003-C
        {

            int idOrden = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_FactOrdenesBienesAgregarVentas", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@idOrden", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idComprobantePago", idComprobantePago ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MovNumero", MovNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@idPreventa", idPreventa);
                cmd.Parameters.AddWithValue("@FechaCreacion", DateTime.Now);
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@idEstadoFacturacion", idEstadoFacturacion);
                cmd.Parameters.AddWithValue("@ImporteExonerado", ImporteExonerado);
                cmd.Parameters.AddWithValue("@idUsuarioExonera", Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                cmd.Parameters.AddWithValue("@DNI", DNI);
                cmd.Parameters.AddWithValue("@NombPaciente", NombPaciente);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                idOrden = int.Parse(cmd.Parameters["@idOrden"].Value.ToString());

                //await conn.CloseAsync();

                return idOrden;
            }
        }

        public async Task<DataSet> FarmTipoRecetaDevuelveTodos()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmTipoRecetaDevuelveTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> TipoFinanciamientosDevuelveSoloFarmacia(string Filtro)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TipoFinanciamientosDevuelveSoloFarmacia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Filtro", Filtro);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> MedicosSeleccionarTodosOrdenadoAlfabeticamente()
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("MedicosSeleccionarTodosOrdenadoAlfabeticamente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public async Task<DataSet> PacientesFiltrarTodos(string NroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre, string segundoNombre, int idDocIdentidad, string NroDocumento, string FichaFamiliar)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_PacientesFiltrarTodos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoriaClinica", NroHistoriaClinica);
                cmd.Parameters.AddWithValue("@apellidoPaterno", apellidoPaterno);
                cmd.Parameters.AddWithValue("@apellidoMaterno", apellidoMaterno);
                cmd.Parameters.AddWithValue("@primerNombre", primerNombre);
                cmd.Parameters.AddWithValue("@segundoNombre", segundoNombre);
                cmd.Parameters.AddWithValue("@idDocIdentidad", idDocIdentidad);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@FichaFamiliar", FichaFamiliar);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public Task<DataSet> ProveedorSeleccionarporRuc(string ruc)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ProveedoresSeleccionarPorRUC";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Ruc", SqlDbType.VarChar).Value = ruc;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarConsumoFarmacia(int IdCuenta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmMovimientoVentasDetalleSeleccionarPorCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuenta;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ValidarLote(int idAlmacen, int idProducto, string lote, DateTime fechaVencimiento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ValidarLote";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;
                        da.SelectCommand.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
                        da.SelectCommand.Parameters.Add("@Lote", SqlDbType.VarChar).Value = lote;
                        da.SelectCommand.Parameters.Add("@FechaVencimiento", SqlDbType.Date).Value = fechaVencimiento;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> AtencionesSelecionarPorCuenta(int idCuentaAtencion)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_AtencionesSelecionarPorCuenta", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public async Task<DataSet> FuentesFinanciamientoSeleccionarPorId(int IdFuenteFinanciamiento)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FuentesFinanciamientoSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }

        public Task<DataSet> DevuelvePrecioSegunTipoConcepto(int idProducto, int idTipoPrecioParaNiNs, int sghPrecioCompra, int sghPrecioDistribucion, int sghPrecioVentaContado, int sghPrecioDonacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "DevuelvePrecioSegunTipoConcepto";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = idProducto;
                    da.SelectCommand.Parameters.Add("@IdTipoPrecioParaNiNs", SqlDbType.Int).Value = idTipoPrecioParaNiNs;
                    da.SelectCommand.Parameters.Add("@sghPrecioCompra", SqlDbType.Int).Value = sghPrecioCompra;
                    da.SelectCommand.Parameters.Add("@sghPrecioDistribucion", SqlDbType.Int).Value = sghPrecioDistribucion;
                    da.SelectCommand.Parameters.Add("@sghPrecioVentaContado", SqlDbType.Int).Value = sghPrecioVentaContado;
                    da.SelectCommand.Parameters.Add("@sghPrecioDonacion", SqlDbType.Int).Value = sghPrecioDonacion;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> FarmPreVentaSeleccionarPorId(int idPreventa)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "farmPreVentaSeleccionarPorId";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@idPreventa", SqlDbType.Int).Value = idPreventa;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> FarmPreVentaDetalleDevuelveTodosItems(int idPreventa)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "FarmPreVentaDetalleDevuelveTodosItems";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@idPreventa", SqlDbType.Int).Value = idPreventa;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> FarmMovimientoSeleccionarPorId(string movNumero, string movTipo)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_FarmMovimientoSeleccionarPorId";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@MovNumero", SqlDbType.VarChar).Value = movNumero;
                    da.SelectCommand.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = movTipo;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> FarmMovimientoVentasSeleccionarPorId(string movNumero, string movTipo)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "Web_farmMovimientoVentasSeleccionarPorId";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@MovNumero", SqlDbType.VarChar).Value = movNumero;
                    da.SelectCommand.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = movTipo;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public Task<DataSet> FarmMovimientosDetalleDevuelveTodosItems(string movNumero, string movTipo)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_FarmMovimientosDetalleDevuelveTodosItems";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@MovNumero", SqlDbType.VarChar).Value = movNumero;
                    da.SelectCommand.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = movTipo;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public async Task<int> FacturacionBienesFinanciamientosAgregar(string MovNumero, string MovTipo, int IdProducto, int IdTipoFinanciamiento, int IdFuenteFinanciamiento, int CantidadFinanciada, string PrecioFinanciado, string TotalFinanciado, int IdUsuario) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FacturacionBienesFinanciamientosAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", MovNumero);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo);
                cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", IdTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento);
                cmd.Parameters.AddWithValue("@CantidadFinanciada", CantidadFinanciada);
                cmd.Parameters.AddWithValue("@PrecioFinanciado", PrecioFinanciado);
                cmd.Parameters.AddWithValue("@TotalFinanciado", TotalFinanciado);
                cmd.Parameters.AddWithValue("@FechaAutoriza", DateTime.Now);
                cmd.Parameters.AddWithValue("@IdUsuarioAutoriza", IdUsuario);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuario);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> FacturacionBienesPagosAgregar(int IdOrden, int IdProducto, int CantidadPagar, string PrecioVenta, string TotalPagar, int IdUsuario) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FacturacionBienesPagosAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                cmd.Parameters.AddWithValue("@CantidadPagar", CantidadPagar);
                cmd.Parameters.AddWithValue("@PrecioVenta", PrecioVenta);
                cmd.Parameters.AddWithValue("@TotalPagar", TotalPagar);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuario);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> RecetaCabeceraModificar(Receta receta, int IdUsuario) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_RecetaCabeceraModificarFarmacia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idReceta", receta.idReceta);
                cmd.Parameters.AddWithValue("@IdPuntoCarga", receta.idPuntoCarga);
                cmd.Parameters.AddWithValue("@FechaReceta", receta.fechaReceta);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", receta.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@idServicioReceta", receta.idServicioReceta);
                cmd.Parameters.AddWithValue("@idEstado", receta.idEstado);
                cmd.Parameters.AddWithValue("@idComprobantePago", receta.idComprobantePago);
                cmd.Parameters.AddWithValue("@idMedicoReceta", receta.idMedico);
                cmd.Parameters.AddWithValue("@FechaVigencia", receta.fechaVigencia);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuario);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<DataSet> FarmRecetaRelacionOrdenPagoBuscar(int NroReceta)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmRecetaRelacionOrdenPagoBuscar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroReceta", NroReceta);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }


        }


        public Task<DataSet> FarmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote(int idAlmacen, int idProducto, string lote, string fechaVencimiento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_farmMovimientoDetalleDevuelveSalidasSegunAlmacenProductoLote";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@idAlmacen", SqlDbType.Int).Value = idAlmacen;
                    da.SelectCommand.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
                    da.SelectCommand.Parameters.Add("@lote", SqlDbType.VarChar).Value = lote;
                    da.SelectCommand.Parameters.Add("@fechaVencimiento", SqlDbType.VarChar).Value = fechaVencimiento;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }

        public async Task<int> FarmPreVentaAgregar(FarmPreVenta farmPreVenta, int idUsuario) // // JDELGADO003-C
        {

            int idPreventa = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_farmPreVentaAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@idPreventaOut", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@idPreventa", farmPreVenta.idPreventa);
                cmd.Parameters.AddWithValue("@idAlmacen", farmPreVenta.idAlmacen);
                cmd.Parameters.AddWithValue("@idVendedor", idUsuario);
                cmd.Parameters.AddWithValue("@idPaciente", farmPreVenta.idPaciente);
                cmd.Parameters.AddWithValue("@idTipoFinanciamiento", farmPreVenta.idTipoFinanciamiento);
                cmd.Parameters.AddWithValue("@Total", farmPreVenta.total);
                cmd.Parameters.AddWithValue("@idDiagnostico", farmPreVenta.idDiagnostico);
                cmd.Parameters.AddWithValue("@idTipoReceta", farmPreVenta.idTipoReceta);
                cmd.Parameters.AddWithValue("@idCuentaAtencion", farmPreVenta.idcuentaAtencion);
                cmd.Parameters.AddWithValue("@idPrescriptor", farmPreVenta.idPrescriptor);
                cmd.Parameters.AddWithValue("@FechaCreacion", DateTime.Now);
                cmd.Parameters.AddWithValue("@HoraCreacion", DateTime.Now.ToString("HH:mm"));
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@FechaModificacion", Convert.DBNull);
                cmd.Parameters.AddWithValue("@idUsuarioModifica", Convert.DBNull);
                cmd.Parameters.AddWithValue("@idEstadoPreventa", farmPreVenta.idEstadoPreventa);
                cmd.Parameters.AddWithValue("@FechaHoraPrescribe", farmPreVenta.fechaHoraPrescribe);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                cmd.Parameters.AddWithValue("@dni", farmPreVenta.dni);
                cmd.Parameters.AddWithValue("@Paciente", farmPreVenta.Paciente);
                cmd.Parameters.AddWithValue("@PresExternoCmp", farmPreVenta.PresExternoCmp ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PresExternoMedico", farmPreVenta.PresExternoMedico ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PresExternoFecha", farmPreVenta.PresExternoFecha ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroFormato", farmPreVenta.NroFormato ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Observaciones", farmPreVenta.Observaciones ?? Convert.DBNull);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                idPreventa = int.Parse(cmd.Parameters["@idPreventaOut"].Value.ToString());

                //await conn.CloseAsync();

                return idPreventa;
            }
        }

        public async Task<int> FarmPreVentaDetalleAgregar(int idPreventa, int idProducto, int item, int Cantidad, string Precio, string Importe, int idUsuario) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmPreVentaDetalleAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idPreventa", idPreventa);
                cmd.Parameters.AddWithValue("@idProducto", idProducto);
                cmd.Parameters.AddWithValue("@item", item);
                cmd.Parameters.AddWithValue("@Cantidad", Cantidad);
                cmd.Parameters.AddWithValue("@Precio", Precio);
                cmd.Parameters.AddWithValue("@Importe", Importe);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> RecetaCabeceraModificaIdEstado(string DocumentoDespacho, int idReceta) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("RecetaCabeceraModificaIdEstado", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@DocumentoDespacho", DocumentoDespacho);
                cmd.Parameters.AddWithValue("@idReceta", idReceta);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<DataSet> DevuelveCabeceraDeVentasOpreventa(string tipoVenta, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin, int IdCuentaAtencion, string DocumentoNumero)
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = cx.obtenerConexion())
            using (SqlDataAdapter da = new SqlDataAdapter())
            {
                string sql = "Web_DevuelveCabeceraDeVentasOpreventa";
                da.SelectCommand = new SqlCommand(sql, conn);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@tipoVenta", SqlDbType.VarChar).Value = tipoVenta;

                da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.DateTime).Value = FechaInicio;

                da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.DateTime).Value = FechaFin;
                da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuentaAtencion;

                da.SelectCommand.Parameters.Add("@DocumentoNumero", SqlDbType.VarChar).Value = DocumentoNumero;

                await conn.OpenAsync();

                DataSet ds = new DataSet();
                da.Fill(ds);

                return ds;
            }
        }


        public async Task<DataSet> DevuelveCabeceraDeVentasOpreventaIntervencionesSanitarias(string tipoVenta, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin, int IdCuentaAtencion, string DocumentoNumero)
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = cx.obtenerConexion())
            using (SqlDataAdapter da = new SqlDataAdapter())
            {
                string sql = "Web_DevuelveCabeceraDeVentasOpreventaIntervencionesSanitarias";
                da.SelectCommand = new SqlCommand(sql, conn);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@tipoVenta", SqlDbType.VarChar).Value = tipoVenta;

                da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.DateTime).Value = FechaInicio;

                da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.DateTime).Value = FechaFin;
                da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = IdCuentaAtencion;
                da.SelectCommand.Parameters.Add("@DocumentoNumero", SqlDbType.VarChar).Value = DocumentoNumero;

                await conn.OpenAsync();

                DataSet ds = new DataSet();
                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> FarmMovimientoVentasDetalleSeleccionarPorCuenta(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = cx.obtenerConexion())
            using (SqlDataAdapter da = new SqlDataAdapter())
            {
                string sql = "Web_FarmMovimientoVentasDetalleSeleccionarPorCuenta";
                da.SelectCommand = new SqlCommand(sql, conn);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                await conn.OpenAsync();

                DataSet ds = new DataSet();
                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> PacientesSeleccionarPorNroHistoria(string NroDocumento)
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = cx.obtenerConexion())
            using (SqlDataAdapter da = new SqlDataAdapter())
            {
                string sql = "PacientesSeleccionarPorNroHistoria";
                da.SelectCommand = new SqlCommand(sql, conn);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@lnNroHistoriaClinica", SqlDbType.VarChar).Value = NroDocumento;

                await conn.OpenAsync();

                DataSet ds = new DataSet();
                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> PacientesXdni(string NroDocumento)
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = cx.obtenerConexion())
            using (SqlDataAdapter da = new SqlDataAdapter())
            {
                string sql = "PacientesXdni";
                da.SelectCommand = new SqlCommand(sql, conn);
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@lcDni", SqlDbType.VarChar).Value = NroDocumento;

                await conn.OpenAsync();

                DataSet ds = new DataSet();
                da.Fill(ds);

                return ds;
            }
        }

        public async Task<int> RecetaDetalleActualizaCantDespachada(int idReceta, int idItem, int CantidadDespachada, int IdEstadoDetalle)  // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("RecetaDetalleActualizaCantDespachada", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idReceta", idReceta);
                cmd.Parameters.AddWithValue("@idItem", idItem);
                cmd.Parameters.AddWithValue("@CantidadDespachada", CantidadDespachada);
                cmd.Parameters.AddWithValue("@IdEstadoDetalle", IdEstadoDetalle);

                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> RecetaDetalleItemAgregar(int idReceta, int idItem, string DocumentoDespacho, int CantidadDespachada, int IdUsuario) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_RecetaDetalleItemAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idReceta", idReceta);
                cmd.Parameters.AddWithValue("@idItem", idItem);
                cmd.Parameters.AddWithValue("@DocumentoDespacho", DocumentoDespacho);
                cmd.Parameters.AddWithValue("@CantidadDespachada", CantidadDespachada);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuario);

                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public async Task<int> FarmRecetaRelacionOrdenPagoAgregar(int NroReceta, int NroOrdenPago, string NroDocumento, int TipoPlan) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("FarmRecetaRelacionOrdenPagoAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroReceta", NroReceta);
                cmd.Parameters.AddWithValue("@NroOrdenPago", NroOrdenPago);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);
                cmd.Parameters.AddWithValue("@TipoPlan", TipoPlan);

                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                nRpta = await cmd.ExecuteNonQueryAsync();

                return nRpta;
            }
        }

        public Task<DataSet> AtencionesDiagnosticosSeleccionarPorAtencion(int idAtencion, int clasifiacionDiagnostico) // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesDiagnosticosSeleccionarParaFarmacia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@Tipodiagnostico", SqlDbType.Int).Value = clasifiacionDiagnostico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
        public Task<DataSet> FarmDevuelveSaldosSinLotesSegunAlmacen(int lnIdAlmacen, int Orden, string lcFiltro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "farmDevuelveSaldosSinLotesSegunAlmacen";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = lnIdAlmacen;
                    da.SelectCommand.Parameters.Add("@Orden", SqlDbType.Int).Value = Orden;
                    da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = lcFiltro == null ? "" : lcFiltro;


                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }

            });
        }

        public Task<DataSet> rptVentasFarmaciaAlmacen(string tipoVenta, int IdAlmacen, DateTime FechaInicio, DateTime FechaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_rptVentasFarmaciaAlmacen";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@tipoVenta", SqlDbType.VarChar).Value = tipoVenta;
                        da.SelectCommand.Parameters.Add("@IdAlmacen", SqlDbType.Int).Value = IdAlmacen;
                        da.SelectCommand.Parameters.Add("@FechaInicio", SqlDbType.DateTime).Value = FechaInicio;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.DateTime).Value = FechaFin;

                        //da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> SeleccionarDatosMovimientoInforme(string MovNumero, string MovTipo)
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarDatosMovimientoInforme", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", MovNumero);
                cmd.Parameters.AddWithValue("@MovTipo", MovTipo);
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }

        }

        public Task<DataSet> FarmMovimientoProgramasSeleccionar(string MovNumero)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_FarmMovimientoProgramasSeleccionar";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@MovNumero", SqlDbType.VarChar).Value = MovNumero;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            });
        }


        public Task<DataSet> FarmMovimientoProgramasGuardar(FarmMovimientoProgramas farmMovimientoProgramas, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmMovimientoProgramasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@MovNumero", SqlDbType.VarChar).Value = farmMovimientoProgramas.MovNumero;
                        da.SelectCommand.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = farmMovimientoProgramas.MovTipo;
                        da.SelectCommand.Parameters.Add("@IdCoordinador", SqlDbType.Int).Value = farmMovimientoProgramas.IdCoordinador;
                        da.SelectCommand.Parameters.Add("@IdPrescriptor", SqlDbType.Int).Value = farmMovimientoProgramas.IdPrescriptor;
                        da.SelectCommand.Parameters.Add("@IdDiagnostico", SqlDbType.Int).Value = farmMovimientoProgramas.IdDiagnostico;
                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = farmMovimientoProgramas.IdPaciente > 0 ? farmMovimientoProgramas.IdPaciente : DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdComponente", SqlDbType.Int).Value = farmMovimientoProgramas.IdComponente;
                        da.SelectCommand.Parameters.Add("@IdSubComponente", SqlDbType.Int).Value = farmMovimientoProgramas.IdSubComponente;
                        da.SelectCommand.Parameters.Add("@FechaPrescribe", SqlDbType.VarChar).Value = farmMovimientoProgramas.FechaHoraPrescribe;
                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = farmMovimientoProgramas.IdCuentaAtencion > 0 ? farmMovimientoProgramas.IdCuentaAtencion : DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Observaciones", SqlDbType.VarChar).Value = farmMovimientoProgramas.Observaciones;
                        da.SelectCommand.Parameters.Add("@NroFormato", SqlDbType.VarChar).Value = farmMovimientoProgramas.NroFormato;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }



        public Task<DataSet> ListarTiposPsicotropicos()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "farm_psicotropTipoSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public async Task<DataSet> CrearModificarVentaFarmacia(
            string MovNumero, string MovTipo, int? IdCuentaAtencion, int? IdServicioPaciente, DateTime? FechaHoraPrescribe, int? IdPaquete, string PresExternoCmp, string PresExternoMedico,
            string PresExternoFecha, string NroFormato, int? IdReceta, string DocumentoNumero, string Observaciones, int? idEstadoMovimiento, int? idAlmacenOrigen, int? idAlmacenDestino, int? IdFuenteFinanciamiento,
            int? IdPreVenta, int? IdPrescriptor, int? IdTipoReceta, int? idPuntoCarga, int? idComprobantePago, int? idEstadoFacturacion, string DNI, string NombPaciente, List<FarmMovimientoDetalle> lstObjDetalleNotaSalida,
            int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            string xmlMovimientoDetalle;
            xmlMovimientoDetalle = XmlUtil.Serializer(typeof(List<FarmMovimientoDetalle>), lstObjDetalleNotaSalida);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarVentaFarmacia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", string.IsNullOrEmpty(MovNumero) ? DBNull.Value : MovNumero);
                cmd.Parameters.AddWithValue("@MovTipo", string.IsNullOrEmpty(MovTipo) ? DBNull.Value : MovTipo);
                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdServicioPaciente", IdServicioPaciente ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaHoraPrescribe", FechaHoraPrescribe ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdPaquete", IdPaquete ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PresExternoCmp", string.IsNullOrEmpty(PresExternoCmp) ? DBNull.Value : PresExternoCmp);
                cmd.Parameters.AddWithValue("@PresExternoMedico", string.IsNullOrEmpty(PresExternoMedico) ? DBNull.Value : PresExternoMedico);
                cmd.Parameters.AddWithValue("@PresExternoFecha", string.IsNullOrEmpty(PresExternoFecha) ? DBNull.Value : PresExternoFecha);
                cmd.Parameters.AddWithValue("@NroFormato", string.IsNullOrEmpty(NroFormato) ? DBNull.Value : NroFormato);
                cmd.Parameters.AddWithValue("@IdReceta", IdReceta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DocumentoNumero", string.IsNullOrEmpty(DocumentoNumero) ? DBNull.Value : DocumentoNumero);
                cmd.Parameters.AddWithValue("@Observaciones", string.IsNullOrEmpty(Observaciones) ? DBNull.Value : Observaciones);
                cmd.Parameters.AddWithValue("@idEstadoMovimiento", idEstadoMovimiento ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idAlmacenOrigen", idAlmacenOrigen ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idAlmacenDestino", idAlmacenDestino ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", IdFuenteFinanciamiento ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdPreVenta", IdPreVenta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdPrescriptor", IdPrescriptor ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoReceta", IdTipoReceta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idComprobantePago", idComprobantePago ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idEstadoFacturacion", idEstadoFacturacion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DNI", string.IsNullOrEmpty(DNI) ? DBNull.Value : DNI);
                cmd.Parameters.AddWithValue("@NombPaciente", string.IsNullOrEmpty(NombPaciente) ? DBNull.Value : NombPaciente);
                cmd.Parameters.Add("@movimientoDetalle", SqlDbType.Xml).Value = xmlMovimientoDetalle;
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);


                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }

        public async Task<DataSet> CrearModificarNotaIngresoSalidaFarmacia(
            string MovNumero, string MovTipo, int? idEstadoMovimiento, string idTipoLocales, string idTipoSuministro, int? documentoIdTipo, int? idAlmacenOrigen,
            int? idAlmacenDestino, int? IdTipoConceptoFarmacia, string Observaciones, List<FarmMovimientoDetalle> lstObjDetalleNotaSalida, int? idUsuario, int IdListBarItem)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            string xmlMovimientoDetalle;
            xmlMovimientoDetalle = XmlUtil.Serializer(typeof(List<FarmMovimientoDetalle>), lstObjDetalleNotaSalida);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarNotaIngresoSalidaFarmacia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@MovNumero", string.IsNullOrEmpty(MovNumero) ? DBNull.Value : MovNumero);
                cmd.Parameters.AddWithValue("@MovTipo", string.IsNullOrEmpty(MovTipo) ? DBNull.Value : MovTipo);
                cmd.Parameters.AddWithValue("@idEstadoMovimiento", idEstadoMovimiento ?? (object)DBNull.Value);
                
                cmd.Parameters.AddWithValue("@idTipoLocales", idTipoLocales ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idTipoSuministro", idTipoSuministro ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@documentoIdTipo", documentoIdTipo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idAlmacenOrigen", idAlmacenOrigen ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@idAlmacenDestino", idAlmacenDestino ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoConceptoFarmacia", IdTipoConceptoFarmacia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Observaciones", Observaciones ?? (object)DBNull.Value);
                cmd.Parameters.Add("@movimientoDetalle", SqlDbType.Xml).Value = xmlMovimientoDetalle;
                cmd.Parameters.AddWithValue("@idUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdListBarItem", IdListBarItem);



                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }
        }


        /*@idReceta int,
@IdPuntoCarga int,
@FechaReceta DateTime,
@idCuentaAtencion int,
@ int,
@ int,
@ int,
@ int,
@ DateTime,
@ int*/

        //////////////////////////////KHOYOSI////////////////////////////////////////////////////////////////
        //public Task<DataSet> FarmAlmacenFiltrar(string filtro)
        //{
        //    Conexion cx = new Conexion();
        //    return Task.Run(() =>
        //    {

        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                string sql = "FarmAlmacenFiltrar";
        //                da.SelectCommand = new SqlCommand(sql, conn);
        //                da.SelectCommand.CommandType = CommandType.StoredProcedure;

        //                da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;

        //                DataSet ds = new DataSet();
        //                da.Fill(ds);

        //                return ds;
        //            }
        //        }
        //    });
        //}


    }

}
