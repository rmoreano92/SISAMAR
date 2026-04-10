using CapaDatos;
using CapaEntidades;
using NPOI.POIFS.Crypt.Dsig;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalCamas
    {
        public Task<DataSet> ListarCamasPorServicio(int idServicio)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarCamasPorServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarServicioPorTipo(int idTipoServicio, string filtro)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ServiciosSeleccionarPorTipoV2debb";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = filtro;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarDisponibilidadCamasPorServicioActual(int idServicio)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CamasSeleccionarDisponibilidadPorServicioUbicacionActual";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposServicioSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposServicioSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> EstadosCamaSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EstadosCamaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposCamaSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposCamaSeleccionarTodos ";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CamasSeleccionarPorId(int idCama)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CamasSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposCondicionOcupacionSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposCondicionOcupacionSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CamasBuscarCodigoDeCama(string codigoCama, int idServicioPropietario)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CamasBuscarCodigoDeCama";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcCodigoCama", SqlDbType.VarChar).Value = codigoCama;
                        da.SelectCommand.Parameters.Add("@IdServicioPropietario", SqlDbType.Int).Value = idServicioPropietario;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CamasMovimientosSeleccionarPorCama(int idCama)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CamasMovimientosSeleccionarPorCama";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CamasCantidadEstanciaSeleccionarPorCama(int idCama)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CamasCantidadEstanciaSeleccionarPorCama";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        public Task<DataSet> ModificarCamaEstanciaHospitalaria(int idEstanciaHosp, int idCama, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ModificarCamaEstanciaHospitalaria";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEstanciaHosp", SqlDbType.Int).Value = idEstanciaHosp;
                        da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<Boolean> ModificarCama(Cama cama, List<MovimientoCama> dsMovimientosCama, int idUsuario)
        {
            Conexion cx = new Conexion();
            string xmlMovimientosCama;
            xmlMovimientosCama = XmlUtil.Serializer(typeof(List<MovimientoCama>), dsMovimientosCama);
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CamasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = cama.idCama;
                        da.SelectCommand.Parameters.Add("@X", SqlDbType.Int).Value = cama.x;
                        da.SelectCommand.Parameters.Add("@Y", SqlDbType.Int).Value = cama.y;
                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = cama.idPaciente;
                        da.SelectCommand.Parameters.Add("@Codigo", SqlDbType.Char).Value = cama.codigo;
                        da.SelectCommand.Parameters.Add("@IdEstadoCama", SqlDbType.Int).Value = cama.idEstadoCama;
                        da.SelectCommand.Parameters.Add("@IdCondicionOcupacion", SqlDbType.Int).Value = cama.idCondicionOcupacion;
                        da.SelectCommand.Parameters.Add("@IdTiposCama", SqlDbType.Int).Value = cama.idTipoCama;
                        da.SelectCommand.Parameters.Add("@IdServicioPropietario", SqlDbType.Int).Value = cama.idServicioPropietario;
                        da.SelectCommand.Parameters.Add("@IdServicioUbicacionActual", SqlDbType.Int).Value = cama.idServicioUbicacionActual;

                        da.SelectCommand.Parameters.Add("@MovimientosCama", SqlDbType.Xml).Value = xmlMovimientosCama;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return true;
                    }
                }

            });
        }

        public Task<Boolean> EliminarCama(int idCama, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CamasEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        
                        da.SelectCommand.Parameters.Add("@IdCama", SqlDbType.Int).Value = idCama;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return true;
                    }
                }

            });
        }

        public async Task<int> CamasLimpiaIdPaciente(int? lIdPaciente) // // JDELGADO003-C
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CamasLimpiaIdPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@lIdPaciente", lIdPaciente);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return 1;
            }
        }

        public Task<DataSet> LiberarCamaPorPaciente(int idPaciente, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CamaLiberarPorPaciente";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", idPaciente);

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
