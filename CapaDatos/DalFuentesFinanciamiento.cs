using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalFuenteFinanciamientoIAFA
    {





















        public async Task<DataSet> FuentesFinanciamientoIAFA_Listar(string IdTipoFinanciamiento, string Descripcion)
        {
            DataSet dataSet = new DataSet();
            Console.WriteLine("✅ Conexión a BD abierta");
            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_Listar", conn))
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@vIdFuenteFinanciamiento", IdTipoFinanciamiento);
                    cmd.Parameters.AddWithValue("@vDescripcion", Descripcion);
                    await conn.OpenAsync();
                    da.Fill(dataSet);
                    return dataSet;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al listar todos los detalles: {ex.Message}", ex);
            }
        }

        public async Task<DataSet> FuentesFinanciamientoIAFA_ListarDetalle(string IdFuenteFinanciamiento)
        {
            DataSet dataSet = new DataSet();
            Console.WriteLine("✅ Conexión a BD abierta");
            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_ListarDetalle", conn))
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@vIdFuenteFinanciamiento", IdFuenteFinanciamiento);
                    await conn.OpenAsync();
                    da.Fill(dataSet);
                    return dataSet;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al listar todos los detalles: {ex.Message}", ex);
            }
        }





        //public async Task<int> FuentesFinanciamientoIAFA_InsertarActualizar(
        //    int? IdFuenteFinanciamiento,
        //    string Descripcion,
        //    int? IdTipoFinanciamiento,
        //    int? idTipoConceptoFarmacia,
        //    int? UtilizadoEn,
        //    string CodigoFuenteFinanciamientoSEM,
        //    int? idAreaTramitaSeguros,
        //    int? EsUsadoEnCaja,
        //    string CodigoHIS,
        //    int idTipoFinanciador,
        //    string codigo,
        //    int? Estado)
        //    {
        //        SqlTransaction transaction = null;

        //        try
        //        {
        //            using (SqlConnection conn = new Conexion().obtenerConexion())
        //            {
        //                await conn.OpenAsync();
        //                transaction = conn.BeginTransaction();

        //                using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_InsertarActualizar", conn, transaction))
        //                {
        //                    cmd.CommandType = CommandType.StoredProcedure;

        //                    cmd.Parameters.AddWithValue("@IdFuenteFinanciamiento", (object?)IdFuenteFinanciamiento ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@Descripcion", Descripcion);
        //                    cmd.Parameters.AddWithValue("@IdTipoFinanciamiento", (object?)IdTipoFinanciamiento ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@idTipoConceptoFarmacia", (object?)idTipoConceptoFarmacia ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@UtilizadoEn", (object?)UtilizadoEn ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@CodigoFuenteFinanciamientoSEM", (object?)CodigoFuenteFinanciamientoSEM ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@idAreaTramitaSeguros", (object?)idAreaTramitaSeguros ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@EsUsadoEnCaja", (object?)EsUsadoEnCaja ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@CodigoHIS", (object?)CodigoHIS ?? DBNull.Value);
        //                    cmd.Parameters.AddWithValue("@idTipoFinanciador", idTipoFinanciador);
        //                    cmd.Parameters.AddWithValue("@codigo", codigo);
        //                    cmd.Parameters.AddWithValue("@Estado", (object?)Estado ?? DBNull.Value);

        //                    var result = await cmd.ExecuteScalarAsync();
        //                    transaction.Commit();
        //                    return Convert.ToInt32(result);
        //                }
        //            }
        //        }
        //        catch
        //        {
        //            transaction?.Rollback();
        //            throw;
        //        }
        //        finally
        //        {
        //            transaction?.Dispose();
        //        }
        //    }












        public async Task<int> FuentesFinanciamientoIAFA_InsertarActualizar(
    int? IdFuenteFinanciamiento,
    string Descripcion,
    int? IdTipoFinanciamiento,
    int? idTipoConceptoFarmacia,
    int? UtilizadoEn,
    string CodigoFuenteFinanciamientoSEM,
    int? idAreaTramitaSeguros,
    int? EsUsadoEnCaja,
    string CodigoHIS,
    int idTipoFinanciador,
    string codigo,
    int? Estado)
        {
            SqlTransaction transaction = null;
            SqlConnection conn = null;

            try
            {
                conn = new Conexion().obtenerConexion();
                await conn.OpenAsync();
                transaction = conn.BeginTransaction();

                using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_InsertarActualizar", conn, transaction))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Mejor práctica: usar Add en lugar de AddWithValue
                    cmd.Parameters.Add(new SqlParameter("@IdFuenteFinanciamiento", (object?)IdFuenteFinanciamiento ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", Descripcion ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@IdTipoFinanciamiento", (object?)IdTipoFinanciamiento ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@idTipoConceptoFarmacia", (object?)idTipoConceptoFarmacia ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@UtilizadoEn", (object?)UtilizadoEn ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@CodigoFuenteFinanciamientoSEM", (object?)CodigoFuenteFinanciamientoSEM ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@idAreaTramitaSeguros", (object?)idAreaTramitaSeguros ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@EsUsadoEnCaja", (object?)EsUsadoEnCaja ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@CodigoHIS", (object?)CodigoHIS ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@idTipoFinanciador", idTipoFinanciador));
                    cmd.Parameters.Add(new SqlParameter("@codigo", codigo ?? (object)DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@Estado", (object?)Estado ?? DBNull.Value));

                    var result = await cmd.ExecuteScalarAsync();

                    if (result == null || result == DBNull.Value)
                        throw new InvalidOperationException("El stored procedure no retornó un valor válido");

                    transaction.Commit();
                    return Convert.ToInt32(result);
                }
            }
            catch (SqlException sqlEx)
            {
                try
                {
                    transaction?.Rollback();
                }
                catch (Exception rollbackEx)
                {
                    // Log del error en el rollback
                    Console.WriteLine($"Error durante rollback: {rollbackEx.Message}");
                }

                // Log del error SQL específico
                Console.WriteLine($"Error SQL: {sqlEx.Message}, Number: {sqlEx.Number}");
                throw new Exception($"Error de base de datos: {sqlEx.Message}", sqlEx);
            }
            catch (Exception ex)
            {
                try
                {
                    transaction?.Rollback();
                }
                catch (Exception rollbackEx)
                {
                    Console.WriteLine($"Error durante rollback: {rollbackEx.Message}");
                }

                Console.WriteLine($"Error general: {ex.Message}");
                throw new Exception($"Error al procesar la solicitud: {ex.Message}", ex);
            }
            finally
            {
                transaction?.Dispose();
                conn?.Close();
                conn?.Dispose();
            }
        }






































        public async Task<bool> FuentesFinanciamientoIAFA_InsertarActualizarDetalle(
    int vIdFuenteFinanciamiento,
    int vIdTipoFinanciamiento)
        {
            SqlTransaction transaction = null;

            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                {
                    await conn.OpenAsync();
                    transaction = conn.BeginTransaction();

                    using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_InsertarActualizarDetalle", conn, transaction))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@vIdFuenteFinanciamiento", vIdFuenteFinanciamiento);
                        cmd.Parameters.AddWithValue("@vIdTipoFinanciamiento", vIdTipoFinanciamiento);

                        int affectedRows = await cmd.ExecuteNonQueryAsync();
                        transaction.Commit();

                        return affectedRows > 0;
                    }
                }
            }
            catch
            {
                transaction?.Rollback();
                throw;
            }
            finally
            {
                transaction?.Dispose();
            }
        }

        public async Task<bool> FuentesFinanciamientoIAFA_EliminarDetalle(
        int vIdFuenteFinanciamiento,
        int vIdTipoFinanciamiento)
        {
            SqlTransaction transaction = null;

            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                {
                    await conn.OpenAsync();
                    transaction = conn.BeginTransaction();

                    using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_EliminarDetalle", conn, transaction))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@vIdFuenteFinanciamiento", vIdFuenteFinanciamiento);
                        cmd.Parameters.AddWithValue("@vIdTipoFinanciamiento", vIdTipoFinanciamiento);

                        int affectedRows = await cmd.ExecuteNonQueryAsync();
                        transaction.Commit();

                        return affectedRows > 0;
                    }
                }
            }
            catch
            {
                transaction?.Rollback();
                throw;
            }
            finally
            {
                transaction?.Dispose();
            }
        }

        /// COMBOS
        public async Task<DataTable> FuentesFinanciamientoIAFA_Listar_TipoFinanciador()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_Listar_TipoFinanciador", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }
        public async Task<DataTable> FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos", conn))

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }

        public async Task<DataTable> FuentesFinanciamientoIAFA_Listar_UtilizadosEn()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_Listar_UtilizadosEn", conn))

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }

        public async Task<DataTable> FuentesFinanciamientoIAFA_Listar_AreaTramitaSeguros()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_Listar_AreaTramitaSeguros", conn))

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }

        public async Task<DataTable> FuenteFinanciamientoIAFA_Listar_TiposFinanciamiento()
        {
            var dt = new DataTable();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_FuentesFinanciamientoIAFA_Listar_TiposFinanciamiento", conn))

            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();
                da.Fill(dt);
            }

            return dt;
        }


    }
}
