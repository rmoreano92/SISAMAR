using CapaDatos;
using CapaEntidades;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalCatalogoBienesInsumos
    {
        public Task<DataSet> ListarTiposFinanciamiento()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposFinanciamientoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarTiposFinanciamientoSoloIngresaPrecios() 
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposFinanciamientoListarSoloIngresaPrecios";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarCentrosCosto()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CentrosCostoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFactPartidasPresupuestales()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactPartidasPresupuestalesSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFactInsumosGrupoFarmacologico()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactInsumosGrupoFarmacologicoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFactInsumosSubGrupoFarmacologico(int idGrupo)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactInsumosSubGrupoFarmacologicoXIdGrupoFarmacologico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@lIdGrupoFarmacologico", idGrupo);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarPaises()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "PaisesSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFarmTipoProductosSismed()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "farmTipoProductosSismedDevuelveTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarFarmTipoSalidaBienInsumo()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "farmTipoSalidaBienInsumoDevuelveTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.AddWithValue("@IdServicio", IdServicio);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FactCatalogoBienesInsumosListar(int idTipoCatalogo, string codigo, string nombre)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_FactCatalogoBienesInsumosListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdTipoCatalogo", SqlDbType.Int).Value = (idTipoCatalogo > 0) ? idTipoCatalogo : 0;
                            da.SelectCommand.Parameters.Add("@Codigo", SqlDbType.VarChar).Value = (codigo == null) ? "" : codigo;
                            da.SelectCommand.Parameters.Add("@Nombre", SqlDbType.VarChar).Value = (nombre == null) ? "" : nombre;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null;
                    throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> FactCatalogoBienInsumoSeleccionar(int idProducto)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactCatalogoBienInsumoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdProducto", idProducto);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> FactCatalogoBienInsumoGuardar(CatalogoBienesInsumos producto, List<FactCatalogoBienesInsumosHosp> lstDetalle, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<FactCatalogoBienesInsumosHosp>), lstDetalle);

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactCatalogoBienInsumoGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdProducto", producto.IdProducto);
                        da.SelectCommand.Parameters.AddWithValue("@Codigo", producto.Codigo);
                        da.SelectCommand.Parameters.AddWithValue("@Nombre", producto.Nombre);
                        da.SelectCommand.Parameters.AddWithValue("@NombreComercial", producto.NombreComercial ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdGrupoFarmacologico", (object)producto.IdGrupoFarmacologico ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdSubGrupoFarmacologico", (object)producto.IdSubGrupoFarmacologico ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdPartida", (object)producto.IdPartida ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdCentroCosto", (object)producto.IdCentroCosto ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PrecioCompra", (object)producto.PrecioCompra ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PrecioDistribucion", (object)producto.PrecioDistribucion ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PrecioDonacion", (object)producto.PrecioDonacion ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PrecioUltCompra", (object)producto.PrecioUltCompra ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoSalidaBienInsumo", producto.IdTipoSalidaBienInsumo);
                        da.SelectCommand.Parameters.AddWithValue("@StockMinimo", (object)producto.StockMinimo ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@TipoProducto", (object)producto.TipoProducto ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Denominacion", producto.Denominacion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Concentracion", producto.Concentracion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Presentacion", producto.Presentacion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@FormaFarmaceutica", producto.FormaFarmaceutica ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@MaterialEnvase", producto.MaterialEnvase ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PresentacionEnvase", producto.PresentacionEnvase ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Fabricante", producto.Fabricante ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdPaisOrigen", (object)producto.IdPaisOrigen ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Petitorio", (object)producto.Petitorio ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@TipoProductoSismed", producto.TipoProductoSismed ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@EsUnidosis", producto.EsUnidosis);
                        da.SelectCommand.Parameters.AddWithValue("@IdProductoUnidosis", producto.IdProductoUnidosis);
                        da.SelectCommand.Parameters.AddWithValue("@CodigoUnidosis", producto.CodigoUnidosis ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@PresentacionUnidosis", producto.PresentacionUnidosis ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@EquivalenciaUnidosis", producto.EquivalenciaUnidosis ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@UnidadMedidaUnidosis", producto.UnidadMedidaUnidosis ?? (object)DBNull.Value);

                        da.SelectCommand.Parameters.AddWithValue("@DetallePrecios", xmlDetalle ?? (object)DBNull.Value);
                        
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FactCatalogoSismedGuardar(CatalogoBienesInsumos producto)
        {
            Conexion cx = new Conexion();
            
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactCatalogoSismedGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdProducto", producto.IdProducto);
                        da.SelectCommand.Parameters.AddWithValue("@Codigo", producto.Codigo);
                        da.SelectCommand.Parameters.AddWithValue("@Nombre", producto.Nombre);                        
                        da.SelectCommand.Parameters.AddWithValue("@IdGrupoFarmacologico", (object)producto.IdGrupoFarmacologico ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@IdSubGrupoFarmacologico", (object)producto.IdSubGrupoFarmacologico ?? DBNull.Value);                     
                        da.SelectCommand.Parameters.AddWithValue("@IdTipoSalidaBienInsumo", producto.IdTipoSalidaBienInsumo);                        
                        da.SelectCommand.Parameters.AddWithValue("@TipoProducto", (object)producto.TipoProducto ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Denominacion", producto.Denominacion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Concentracion", producto.Concentracion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Presentacion", producto.Presentacion ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@FormaFarmaceutica", producto.FormaFarmaceutica ?? (object)DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@Petitorio", (object)producto.Petitorio ?? DBNull.Value);
                        da.SelectCommand.Parameters.AddWithValue("@TipoProductoSismed", producto.TipoProductoSismed ?? (object)DBNull.Value);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> FactCatalogoBienInsumoEliminar(int IdProducto, int IdProductoUnidosis, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FactCatalogoBienInsumoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdProducto", IdProducto);
                        da.SelectCommand.Parameters.AddWithValue("@IdProductoUnidosis", IdProductoUnidosis);

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdListItem", idListBar);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
