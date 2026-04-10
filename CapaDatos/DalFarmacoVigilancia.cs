using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using System;
using WebAppMaternidad.CapaEntidades;
using System.Collections.Generic;
using CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalFarmacoVigilancia
    {

        public Task<DataSet> ListarNotificaciones(int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaNotificacionesFarmacoVigilancia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@nroCuenta", SqlDbType.Int).Value = (object) nroCuenta ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@nroDni", SqlDbType.VarChar).Value = (object) nroDni ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@nroHistoria", SqlDbType.Int).Value = (object) nroHistoria ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = (object) apellidoPaterno ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = (object) apellidoMaterno ?? DBNull.Value;
                        
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarTiposConsecuenciasGravedadFarmacoVigilancia()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarTiposConsecuenciasGravedadFarmacoVigilancia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarTiposDescenlaceFarmacoVigilancia()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarTiposDescenlaceFarmacoVigilancia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarTiposGravedadRamFarmacoVigilancia()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarTiposGravedadRamFarmacoVigilancia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarTiposReaccionAdversaFarmacoVigilancia()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListarTiposReaccionAdversaFarmacoVigilancia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }


        public Task<DataSet> FarmacoVigilanciaNotificacionSeleccionar(int idAtencion)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmacoVigilanciaNotificacionSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = (object)idAtencion ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> FarmacoVigilanciaNotificacionDetalleSeleccionar(int idAtencion, int nroNotificacion)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FarmacoVigilanciaNotificacionDetalleSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = (object)idAtencion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroNotificacion", SqlDbType.Int).Value = (object)nroNotificacion ?? DBNull.Value;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public async Task<int> FarmacoVigilanciaNotificacionCabeceraModificar(FarmacoVigilanciaNotificacionCabecera cabecera, int idUsuario)
        {
            Conexion cx = new Conexion();
            using (SqlConnection connection = cx.obtenerConexion())
            {
                using (SqlCommand command = new SqlCommand("web_FarmacoVigilanciaNotificacionCabeceraModificar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Parámetros
                    command.Parameters.AddWithValue("@IdAtencion", cabecera.IdAtencion);
                    command.Parameters.AddWithValue("@Peso", (object)cabecera.Peso ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdUsuario", (object)idUsuario ?? DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }


        public async Task<int> FarmacoVigilanciaNotificacionDetalleModificar(FarmacoVigilanciaNotificacionDetalle detalle, List<FarmacoVigilanciaProductosSospechosos> dsProductosSospechosos, List<FarmacoVigilanciaProductosConcomitantes> dsProductosConcomitantes, int idUsuario)
        {
            Conexion cx = new Conexion();
            string xmProductosSospechosos, xmlProductosConcomitantes;

            xmProductosSospechosos = XmlUtil.Serializer(typeof(List<FarmacoVigilanciaProductosSospechosos>), dsProductosSospechosos);
            xmlProductosConcomitantes = XmlUtil.Serializer(typeof(List<FarmacoVigilanciaProductosConcomitantes>), dsProductosConcomitantes);

            using (SqlConnection connection = cx.obtenerConexion())
            {
                using (SqlCommand command = new SqlCommand("web_FarmacoVigilanciaNotificacionDetalleModificar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Parámetros
                    command.Parameters.AddWithValue("@IdAtencion", detalle.IdAtencion);
                    command.Parameters.AddWithValue("@NroNotificacion", detalle.NroNotificacion);
                    command.Parameters.AddWithValue("@IdTipoReaccionAdversa", (object)detalle.IdTipoReaccionAdversa ?? DBNull.Value);
                    command.Parameters.AddWithValue("@EspecificarReaccionAdversa", (object)detalle.EspecificarReaccionAdversa ?? DBNull.Value);
                    command.Parameters.AddWithValue("@DescripcionReaccionAdversa", (object)detalle.DescripcionReaccionAdversa ?? DBNull.Value);
                    command.Parameters.AddWithValue("@FechaInicioRam", (object)detalle.FechaInicioRam ?? DBNull.Value);
                    command.Parameters.AddWithValue("@FechaFinalRam", (object)detalle.FechaFinalRam ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdTipoGravedadRam", (object)detalle.IdTipoGravedadRam ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdTipoConsecuenciaGravedad", (object)detalle.IdTipoConsecuenciaGravedad ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdFallecio", (object)detalle.IdFallecio ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdTipoDescenlace", (object)detalle.IdTipoDescenlace ?? DBNull.Value);
                    command.Parameters.AddWithValue("@FechaFallece", (object)detalle.FechaFallece ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ResultadosRelevantesExlab", (object)detalle.ResultadosRelevantesExlab ?? DBNull.Value);
                    command.Parameters.AddWithValue("@OtrosDatosHC", (object)detalle.OtrosDatosHC ?? DBNull.Value);

                    command.Parameters.AddWithValue("@ProductosSospechosos", xmProductosSospechosos);
                    command.Parameters.AddWithValue("@AlSuspenderProducto", (object)detalle.AlSuspenderProducto ?? DBNull.Value);
                    command.Parameters.AddWithValue("@AlDisminuirProducto", (object)detalle.AlDisminuirProducto ?? DBNull.Value);
                    command.Parameters.AddWithValue("@AlAdministrarProducto", (object)detalle.AlAdministrarProducto ?? DBNull.Value);
                    command.Parameters.AddWithValue("@AnteriormenteReaciono", (object)detalle.AnteriormenteReaciono ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdRecibioTratamientoReaccionAdversa", (object)detalle.IdRecibioTratamientoReaccionAdversa ?? DBNull.Value);
                    command.Parameters.AddWithValue("@EspecificarTratamientoReaccionAdversa", (object)detalle.EspecificarTratamientoReaccionAdversa ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdProblemaCalidad", (object)detalle.IdProblemaCalidad ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ProblemaRegistroSanitario", (object)detalle.ProblemaRegistroSanitario ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ProblemaFechaVencimiento", (object)detalle.ProblemaFechaVencimiento ?? DBNull.Value);

                    command.Parameters.AddWithValue("@ProductosConcomitantes", xmlProductosConcomitantes);
                    command.Parameters.AddWithValue("@NombreNotificador", (object)detalle.NombreNotificador ?? DBNull.Value);
                    command.Parameters.AddWithValue("@CelularNotificador", (object)detalle.CelularNotificador ?? DBNull.Value);
                    command.Parameters.AddWithValue("@CorreoNotificador", (object)detalle.CorreoNotificador ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdProfesionNotificador", (object)detalle.IdProfesionNotificador ?? DBNull.Value);
                    command.Parameters.AddWithValue("@FechaNotificacion", (object)detalle.FechaNotificacion ?? DBNull.Value);
                    command.Parameters.AddWithValue("@NumeroNotificacion", (object)detalle.NumeroNotificacion ?? DBNull.Value);

                    command.Parameters.AddWithValue("@IdUsuario", (object)idUsuario ?? DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task<int> FarmacoVigilanciaNotificacionEliminar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();

            using (SqlConnection connection = cx.obtenerConexion())
            {
                using (SqlCommand command = new SqlCommand("web_FarmacoVigilanciaNotificacionEliminar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Parámetros
                    command.Parameters.AddWithValue("@IdAtencion", idAtencion);                    
                    command.Parameters.AddWithValue("@IdUsuario", (object)idUsuario ?? DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task<int> FarmacoVigilanciaNotificacionDetalleEliminar(int idAtencion, int nroNotificacion, int idUsuario)
        {
            Conexion cx = new Conexion();

            using (SqlConnection connection = cx.obtenerConexion())
            {
                using (SqlCommand command = new SqlCommand("web_FarmacoVigilanciaNotificacionDetalleEliminar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Parámetros
                    command.Parameters.AddWithValue("@IdAtencion", idAtencion);
                    command.Parameters.AddWithValue("@NumeroNotificacion", (object)nroNotificacion ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IdUsuario", (object)idUsuario ?? DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync();
                }
            }
        }


    }
}
