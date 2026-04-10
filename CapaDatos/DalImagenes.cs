using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using CapaEntidades;

namespace CapaDatos
{
    public class DalImagenes
    {

        public Task<DataSet> ListarMovimientosImagenelogia(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idTipoServicio, int idGrupoExamen, int idRealizaExamen, int idPuntoCarga)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            //string sql = "Web_FactOrdenServicioPorFechasLabPaciente";
                            string sql = "web_ListarMovimientosImagenologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@IdCuenta", idCuenta);
                            cmd.Parameters.AddWithValue("@NroHistoria", historia == null ? "" : historia);
                            cmd.Parameters.AddWithValue("@Nombres", nombres == null ? "" : nombres);
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@idTipoServicio", idTipoServicio);
                            cmd.Parameters.AddWithValue("@idGrupoExamen", idGrupoExamen);
                            cmd.Parameters.AddWithValue("@idRealizaExamen", idRealizaExamen);
                            cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);

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

        public Task<DataSet> ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento, int idEmpleado)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@idEmpleado", idEmpleado);

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

        public Task<DataSet> EmpleadosImagenologiaPorGrupo(int idGrupo)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EmpleadosImagenologiaPorGrupo";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idGrupo", idGrupo);

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

        public Task<DataSet> EmpleadosImagenologiaTodos()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EmpleadosImagenologiaTodos";
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

        public Task<DataSet> EmpleadosImagenologiaPorCargo(int idCargo)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EmpleadosImagenologiaPorCargo";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCargo", idCargo);

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

        public Task<DataSet> FactCatalogoServiciosSeleccionarServiciosLike(string lcFiltro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "web_FactCatalogoServiciosSeleccionarServiciosLike";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro == null ? "" : lcFiltro;


                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }

            });
        }

        
        public Task<Boolean> GuardarResultadoImagen(int idOrden, int idMovimiento, int idProducto, string rutaArchivo, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();
            bool resp = false;

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosImagenesImagenologiaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdOrden", idOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", idProducto);
                            cmd.Parameters.AddWithValue("@RutaArchivo", rutaArchivo);

                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);

                            resp = true;
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            resp = false;
                            throw new Exception(ex.Message);
                        }

                        return resp;
                    }
                }
            });
        }

        public Task<Boolean> EliminarResultadoImagen(int idImgResultadoImagen, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();
            bool resp = false;

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosImagenesImagenologiaEliminar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdImgResultadoImagen", idImgResultadoImagen);

                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);

                            resp = true;
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            resp = false;
                            throw new Exception(ex.Message);
                        }

                        return resp;
                    }
                }
            });
        }

        public Task<DataSet> ListarResultadosImagenes(int idOrden, int idMovimiento, int idProducto)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosImagenesImagenologiaListar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdOrden", idOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", idProducto);

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

        public Task<Boolean> GuardarResultados(ImgResultadosCabecera cabecera, List<ImgResultadosPorItems> lstDetalle, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<ImgResultadosPorItems>), lstDetalle);
            bool resp = false;

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosImagenologiaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdProductoCpt", cabecera.IdProducto);
                            cmd.Parameters.AddWithValue("@IdOrden", cabecera.IdOrden);
                            cmd.Parameters.AddWithValue("@FechaResultado", cabecera.FechaResultado);
                            //cmd.Parameters.AddWithValue("@CodigoIngreso", cabecera.CodigoIngreso);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", cabecera.IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", cabecera.IdServicioRealiza);
                            //cmd.Parameters.AddWithValue("@IdMedicoValidaResultado", cabecera.IdValidaAnalisis);
                            cmd.Parameters.AddWithValue("@ResultadosDetalle", xmlDetalle);
                            cmd.Parameters.AddWithValue("@Informe", cabecera.Informe);
                            cmd.Parameters.AddWithValue("@Observaciones", cabecera.Observaciones);
                            cmd.Parameters.AddWithValue("@Conclusiones", cabecera.Conclusiones);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);

                            resp = true;
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            resp = false;
                            throw new Exception(ex.Message);
                        }

                        return resp;
                    }
                }
            });
        }

        public async Task<DataSet> EliminarResultado(int idMovimiento, int idProducto, int idUsuario)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EliminarResultadosImagenologia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = idMovimiento;
                        da.SelectCommand.Parameters.Add("@IdProductoCpt", SqlDbType.Int).Value = idProducto;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos eliminar del movimiento", ex);
            }
        }


        public Task<DataSet> FactOrdenServicioPorFechasImgPaciente(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idPuntoCarga)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_FactOrdenServicioPorFechasImgPaciente";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@IdCuenta", idCuenta);
                            cmd.Parameters.AddWithValue("@NroHistoria", historia == null ? "" : historia);
                            cmd.Parameters.AddWithValue("@Nombres", nombres == null ? "" : nombres);
                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);
                            cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);

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

        public Task<DataSet> FactOrdenServicioPorIdMovimiento(int idMovimiento, int idPuntoCarga)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ImgFactOrdenServicioPorIdMovimiento";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);

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

        public Task<DataSet> ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idPuntoCarga", idPuntoCarga);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);

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

        public Task<DataSet> ListarExamenesConResultadoPorFecha(DateTime fechaInicio, DateTime fechaFin)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "Web_ImgListarExamenesConResultadoPorFecha";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@FechaInicio", fechaInicio);
                            cmd.Parameters.AddWithValue("@FechaFin", fechaFin);

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

        public Task<DataSet> FactOrdenServicioSeleccionarPorIdOrden(int idOrden)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "FactOrdenServicioSeleccionarPorIdOrden";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdOrden", idOrden);

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

        public Task<DataSet> ImgMovimientoImagenesSeleccionarXidOrden(int idOrden)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "ImgMovimientoImagenesSeleccionarXidOrden";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdOrden", idOrden);

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

        //public Task<DataSet> ImgMovimientoLaboratorioSeleccionarXidOrden(int idOrden)
        //{
        //    DataSet dataSet = new DataSet();
        //    //int nRpta = 0;
        //    Conexion cx = new Conexion();

        //    return Task.Run(() => {

        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                try
        //                {
        //                    string sql = "ImgMovimientoLaboratorioSeleccionarXidOrden";
        //                    SqlCommand cmd = new SqlCommand(sql, conn);
        //                    cmd.CommandTimeout = 0;
        //                    cmd.CommandType = CommandType.StoredProcedure;

        //                    cmd.Parameters.AddWithValue("@IdOrden", idOrden);

        //                    da.SelectCommand = cmd;
        //                    da.Fill(dataSet);
        //                }
        //                catch (Exception ex)
        //                {
        //                    dataSet = null;
        //                    throw new Exception(ex.Message);
        //                }
        //                return dataSet;
        //            }
        //        }
        //    });
        //}

        public Task<DataSet> ImgMovimientoLaboratorioSeleccionarByIdCuenta(int idCuenta)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ImagenesMovimientosSeleccionarByCuenta";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuenta", idCuenta);

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

        public Task<DataSet> RptResulImagenesbyMGP(int idOrden, int idproducto)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "RptResulImagenesbyMGP";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idproducto", idproducto);

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

        public Task<DataSet> ListarResultadosLabImg(int idOrden, int idProducto, string tipo)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosLabImg";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idProducto", idProducto);
                            cmd.Parameters.AddWithValue("@tipo", tipo);

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

        public Task<DataSet> ListarResultadosImagenologia(int idOrden, int idProducto, string tipo)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosImagenologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idProducto", idProducto);
                            //cmd.Parameters.AddWithValue("@tipo", tipo);

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



        public Task<DataSet> ImagMovimientoImagenesSeleccionarByIdCuenta(int idCuenta)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ImagenesMovimientosSeleccionarByCuenta";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuenta", idCuenta);

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

        public Task<DataSet> ImagMovimientoImagenesSeleccionarPorIdPaciente(int idPaciente)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ImagenesMovimientosSeleccionarPorIdPaciente";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idPaciente", idPaciente);

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

        public Task<DataSet> ListarImgLabObservaciones(int idOrden, int idproducto, int idMovimiento)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "ListarImgLabObservaciones";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idProducto", idproducto);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);

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

        

        public async Task<int> InsertaEcoVaginalBasica(EcoVaginalBasica ecoVaginalBasica)
        {
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_InsertaEcoVaginalBasica", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Agregar parámetros al comando
                cmd.Parameters.AddWithValue("@NumeroFeto", ecoVaginalBasica.NumeroFeto);
                cmd.Parameters.AddWithValue("@IdProducto", ecoVaginalBasica.IdProducto);
                cmd.Parameters.AddWithValue("@IdOrden", ecoVaginalBasica.IdOrden);
                cmd.Parameters.AddWithValue("@IdMedico", ecoVaginalBasica.IdMedico);
                cmd.Parameters.AddWithValue("@IdMovimiento", ecoVaginalBasica.IdMovimiento);
                cmd.Parameters.AddWithValue("@Accion", ecoVaginalBasica.Accion);
                cmd.Parameters.AddWithValue("@FUR", ecoVaginalBasica.FUR ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FPP", ecoVaginalBasica.FPP ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EdadGestacional", ecoVaginalBasica.EdadGestacional ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Observaciones", ecoVaginalBasica.Observaciones ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Conclusion", ecoVaginalBasica.Conclusion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sugerencia", ecoVaginalBasica.Sugerencia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Usuario", ecoVaginalBasica.Usuario);
                cmd.Parameters.AddWithValue("@Anatomia", ecoVaginalBasica.Anatomia);
                cmd.Parameters.AddWithValue("@AnatomiaTexto", ecoVaginalBasica.AnatomiaTexto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lcn", ecoVaginalBasica.Lcn ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SacoG", ecoVaginalBasica.SacoG ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Svitelino", ecoVaginalBasica.Svitelino ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fcf", ecoVaginalBasica.Fcf ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CuerpoLuteo", ecoVaginalBasica.CuerpoLuteo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Hematomas", ecoVaginalBasica.Hematomas ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fsd", ecoVaginalBasica.Fsd ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Utero", ecoVaginalBasica.Utero ?? (object)DBNull.Value);

                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync(); // Retorna el número de filas afectadas
            }
        }

        public async Task<DataSet> ListaEcoVaginalBasica(int? IdMovimiento, int? IdProducto, int? Numero)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListaEcoVaginalBasica", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", IdMovimiento ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@IdProducto", IdProducto ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Numero", Numero ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<int> InsertaEcoGenetica(EcoGenetica ecoGenetica)
        {
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_InsertaEcoGenetica", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Agregar parámetros al comando
                cmd.Parameters.AddWithValue("@NumeroFeto", ecoGenetica.NumeroFeto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Dbp", ecoGenetica.Dbp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cc", ecoGenetica.Cc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Ca", ecoGenetica.Ca ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lcn", ecoGenetica.Lcn ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lf", ecoGenetica.Lf ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Peso", ecoGenetica.Peso ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Perc", ecoGenetica.Perc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fc", ecoGenetica.Fc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cordon", ecoGenetica.Cordon ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Placenta", ecoGenetica.Placenta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Grado", ecoGenetica.Grado ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ILA", ecoGenetica.ILA ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Pozo", ecoGenetica.Pozo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Visualiz", ecoGenetica.Visualiz ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdExamen", ecoGenetica.IdExamen);
                cmd.Parameters.AddWithValue("@IdOrden", ecoGenetica.IdOrden);
                cmd.Parameters.AddWithValue("@IdMedico", ecoGenetica.IdMedico ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdMovimiento", ecoGenetica.IdMovimiento);
                cmd.Parameters.AddWithValue("@Accion", ecoGenetica.Accion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Tn", ecoGenetica.Tn ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpDv", ecoGenetica.IpDv ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@OndaDv", ecoGenetica.OndaDv ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Tricuspide", ecoGenetica.Tricuspide ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@HuesoNasal", ecoGenetica.HuesoNasal ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpUterinaDerecha", ecoGenetica.IpUterinaDerecha ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpUterinaIzquierda", ecoGenetica.IpUterinaIzquierda ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UterinasIpMedio", ecoGenetica.UterinasIpMedio ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UterinaPerc", ecoGenetica.UterinaPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UterinaMom", ecoGenetica.UterinaMom ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SistolicaDerecha", ecoGenetica.SistolicaDerecha ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SistolicaIzquierda", ecoGenetica.SistolicaIzquierda ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DiastolicaDerecha", ecoGenetica.DiastolicaDerecha ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DiastolicaIzquierda", ecoGenetica.DiastolicaIzquierda ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PresionArterialMedia", ecoGenetica.PresionArterialMedia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CervixUterino", ecoGenetica.CervixUterino ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FUR", ecoGenetica.FUR ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FPP", ecoGenetica.FPP ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EdadGestacional", ecoGenetica.EdadGestacional ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Observaciones", ecoGenetica.Observaciones ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Conclusion", ecoGenetica.Conclusion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sugerencia", ecoGenetica.Sugerencia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Otro", ecoGenetica.Otro ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Usuario", ecoGenetica.Usuario ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Anatomia", ecoGenetica.Anatomia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AnatomiaTexto", ecoGenetica.AnatomiaTexto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Liquido", ecoGenetica.Liquido ?? (object)DBNull.Value);


                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync(); // Retorna el número de filas afectadas
            }
        }

        public async Task<DataSet> ListaEcoGenetica(int? IdMovimiento, int? IdProducto, int? Numero)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListaEcoGenetica", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", IdMovimiento ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@idProducto", IdProducto ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Numero", Numero ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<int> InsertaEcoAbdominalBasica(EcoAbdominalBasica ecoAbdominalBasica)
        {
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_InsertaEcoAbdominalBasica", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Agregar parámetros al comando
                cmd.Parameters.AddWithValue("@NumeroFeto", ecoAbdominalBasica.NumeroFeto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lcn", ecoAbdominalBasica.Lcn ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Dbp", ecoAbdominalBasica.Dbp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cc", ecoAbdominalBasica.Cc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Ca", ecoAbdominalBasica.Ca ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lf", ecoAbdominalBasica.Lf ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Peso", ecoAbdominalBasica.Peso ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fc", ecoAbdominalBasica.Fc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Placenta", ecoAbdominalBasica.Placenta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Grado", ecoAbdominalBasica.Grado ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cordon", ecoAbdominalBasica.Cordon ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Liquido", ecoAbdominalBasica.Liquido ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CervixUterino", ecoAbdominalBasica.CervixUterino ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Anatomia", ecoAbdominalBasica.Anatomia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AnatomiaTexto", ecoAbdominalBasica.AnatomiaTexto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FUR", ecoAbdominalBasica.FUR ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FPP", ecoAbdominalBasica.FPP ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EdadGestacional", ecoAbdominalBasica.EdadGestacional ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Usuario", ecoAbdominalBasica.Usuario ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdMedico", ecoAbdominalBasica.IdMedico ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Accion", ecoAbdominalBasica.Accion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdMovimiento", ecoAbdominalBasica.IdMovimiento);
                cmd.Parameters.AddWithValue("@IdProducto", ecoAbdominalBasica.IdProducto);
                cmd.Parameters.AddWithValue("@IdOrden", ecoAbdominalBasica.IdOrden);
                cmd.Parameters.AddWithValue("@Conclusion", ecoAbdominalBasica.Conclusion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sugerencia", ecoAbdominalBasica.Sugerencia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Observaciones", ecoAbdominalBasica.Observaciones ?? (object)DBNull.Value);



                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync(); // Retorna el número de filas afectadas
            }
        }

        public async Task<DataSet> ListaEcoAbdominalBasico(int? IdMovimiento, int? IdProducto, int? Numero)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListaEcoAbdominalBasico", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", IdMovimiento ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@idProducto", IdProducto ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Numero", Numero ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<int> InsertaEcoUteroGravido(EcoUteroGravido ecoUteroGravido)
        {
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_InsertaEcoUteroGravido", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Agregar parámetros al comando
                cmd.Parameters.AddWithValue("@NumeroFeto", ecoUteroGravido.NumeroFeto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Presentacion", ecoUteroGravido.Presentacion);
                cmd.Parameters.AddWithValue("@Dbp", ecoUteroGravido.Dbp);
                cmd.Parameters.AddWithValue("@Cc", ecoUteroGravido.Cc);
                cmd.Parameters.AddWithValue("@Ca", ecoUteroGravido.Ca);
                cmd.Parameters.AddWithValue("@Lf", ecoUteroGravido.Lf);
                cmd.Parameters.AddWithValue("@Lh", ecoUteroGravido.Lh);
                cmd.Parameters.AddWithValue("@Peso", ecoUteroGravido.Peso);
                cmd.Parameters.AddWithValue("@Perc", ecoUteroGravido.Perc);
                cmd.Parameters.AddWithValue("@Sexo", ecoUteroGravido.Sexo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fc", ecoUteroGravido.Fc);
                cmd.Parameters.AddWithValue("@Cordon", ecoUteroGravido.Cordon ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Placenta", ecoUteroGravido.Placenta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Grado", ecoUteroGravido.Grado ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ILA", ecoUteroGravido.ILA);
                cmd.Parameters.AddWithValue("@Pozo", ecoUteroGravido.Pozo);
                cmd.Parameters.AddWithValue("@Visualiz", ecoUteroGravido.Visualiz);
                cmd.Parameters.AddWithValue("@MorfFetal", ecoUteroGravido.MorfFetal ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdExamen", ecoUteroGravido.IdExamen);
                cmd.Parameters.AddWithValue("@IdOrden", ecoUteroGravido.IdOrden);
                cmd.Parameters.AddWithValue("@IdMedico", ecoUteroGravido.IdMedico ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdMovimiento", ecoUteroGravido.IdMovimiento);
                cmd.Parameters.AddWithValue("@Accion", ecoUteroGravido.Accion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@LiquidoAmn", ecoUteroGravido.LiquidoAmn);
                cmd.Parameters.AddWithValue("@MovRespiratorios", ecoUteroGravido.MovRespiratorios);
                cmd.Parameters.AddWithValue("@MovCorporales", ecoUteroGravido.MovCorporales);
                cmd.Parameters.AddWithValue("@Tono", ecoUteroGravido.Tono);
                cmd.Parameters.AddWithValue("@Reactividad", ecoUteroGravido.Reactividad);
                cmd.Parameters.AddWithValue("@TotaL", ecoUteroGravido.TotaL);
                cmd.Parameters.AddWithValue("@FUR", ecoUteroGravido.FUR);
                cmd.Parameters.AddWithValue("@FPP", ecoUteroGravido.FPP);
                cmd.Parameters.AddWithValue("@EdadGestacional", ecoUteroGravido.EdadGestacional);
                cmd.Parameters.AddWithValue("@Observaciones", ecoUteroGravido.Observaciones);
                cmd.Parameters.AddWithValue("@Conclusion", ecoUteroGravido.Conclusion);
                cmd.Parameters.AddWithValue("@Sugerencia", ecoUteroGravido.Sugerencia);
                cmd.Parameters.AddWithValue("@Usuario", ecoUteroGravido.Usuario ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Anatomia", ecoUteroGravido.Anatomia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AnatomiaTexto", ecoUteroGravido.AnatomiaTexto);
                cmd.Parameters.AddWithValue("@Liquido", ecoUteroGravido.Liquido ?? (object)DBNull.Value);




                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync(); // Retorna el número de filas afectadas
            }
        }

        public async Task<DataSet> ListaEcoUteroGravido(int? IdMovimiento, int? IdProducto, int? Numero)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListaEcoUteroGravido", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", IdMovimiento ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@idProducto", IdProducto ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Numero", Numero ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }


        public async Task<int> InsertaEcoDopplerCrecimiento(EcoDopplerCrecimiento ecoDopplerCrecimiento)
        {
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_InsertaEcoDopplerCrecimiento", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Agregar parámetros al comando
                cmd.Parameters.AddWithValue("@NumeroFeto", ecoDopplerCrecimiento.NumeroFeto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Presentacion", ecoDopplerCrecimiento.Presentacion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Dbp", ecoDopplerCrecimiento.Dbp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cc", ecoDopplerCrecimiento.Cc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Ca", ecoDopplerCrecimiento.Ca ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lf", ecoDopplerCrecimiento.Lf ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Lh", ecoDopplerCrecimiento.Lh ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Peso", ecoDopplerCrecimiento.Peso ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Perc", ecoDopplerCrecimiento.Perc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sexo", ecoDopplerCrecimiento.Sexo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Fc", ecoDopplerCrecimiento.Fc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Cordon", ecoDopplerCrecimiento.Cordon ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Placenta", ecoDopplerCrecimiento.Placenta ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Grado", ecoDopplerCrecimiento.Grado ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ILA", ecoDopplerCrecimiento.ILA ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Pozo", ecoDopplerCrecimiento.Pozo ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Visualiz", ecoDopplerCrecimiento.Visualiz ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdExamen", ecoDopplerCrecimiento.IdExamen);
                cmd.Parameters.AddWithValue("@IdOrden", ecoDopplerCrecimiento.IdOrden);
                cmd.Parameters.AddWithValue("@IdMedico", ecoDopplerCrecimiento.IdMedico ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IdMovimiento", ecoDopplerCrecimiento.IdMovimiento);
                cmd.Parameters.AddWithValue("@Accion", ecoDopplerCrecimiento.Accion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@LiquidoAmn", ecoDopplerCrecimiento.LiquidoAmn ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@MovRespiratorios", ecoDopplerCrecimiento.MovRespiratorios ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@MovCorporales", ecoDopplerCrecimiento.MovCorporales ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Tono", ecoDopplerCrecimiento.Tono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Reactividad", ecoDopplerCrecimiento.Reactividad ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@TotaL", ecoDopplerCrecimiento.TotaL ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpArtUmb", ecoDopplerCrecimiento.IpArtUmb ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AUmbilicalPerc", ecoDopplerCrecimiento.AUmbilicalPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AUmbilicalDiastole", ecoDopplerCrecimiento.AUmbilicalDiastole ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpArtCMedia", ecoDopplerCrecimiento.IpArtCMedia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ACMPerc", ecoDopplerCrecimiento.ACMPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ACMDiastole", ecoDopplerCrecimiento.ACMDiastole ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpRpc", ecoDopplerCrecimiento.IpRpc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@RPCPerc", ecoDopplerCrecimiento.RPCPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@RPCDiastole", ecoDopplerCrecimiento.RPCDiastole ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VpsAcmIp", ecoDopplerCrecimiento.VpsAcmIp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VpsAcmPerc", ecoDopplerCrecimiento.VpsAcmPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VpsAcmDiastole", ecoDopplerCrecimiento.VpsAcmDiastole ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpIsmoAortico", ecoDopplerCrecimiento.IpIsmoAortico ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IsmoAorticoPerc", ecoDopplerCrecimiento.IsmoAorticoPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IsmoAorticoDiastole", ecoDopplerCrecimiento.IsmoAorticoDiastole ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpDucVen", ecoDopplerCrecimiento.IpDucVen ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DuctoVenosoPerc", ecoDopplerCrecimiento.DuctoVenosoPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DuctoVenosoDiastole", ecoDopplerCrecimiento.DuctoVenosoDiastole ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpUterinaDerecha", ecoDopplerCrecimiento.IpUterinaDerecha ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@IpUterinaIzquierda", ecoDopplerCrecimiento.IpUterinaIzquierda ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UterinasIpMedio", ecoDopplerCrecimiento.UterinasIpMedio ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UterinaPerc", ecoDopplerCrecimiento.UterinaPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@UterinaMom", ecoDopplerCrecimiento.UterinaMom ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SistolicaDerecha", ecoDopplerCrecimiento.SistolicaDerecha ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@SistolicaIzquierda", ecoDopplerCrecimiento.SistolicaIzquierda ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DiastolicaDerecha", ecoDopplerCrecimiento.DiastolicaDerecha ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@DiastolicaIzquierda", ecoDopplerCrecimiento.DiastolicaIzquierda ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@PresionArterialMedia", ecoDopplerCrecimiento.PresionArterialMedia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@CervixUterino", ecoDopplerCrecimiento.CervixUterino ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FUR", ecoDopplerCrecimiento.FUR ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@FPP", ecoDopplerCrecimiento.FPP ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EdadGestacional", ecoDopplerCrecimiento.EdadGestacional ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Observaciones", ecoDopplerCrecimiento.Observaciones ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Conclusion", ecoDopplerCrecimiento.Conclusion ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Sugerencia", ecoDopplerCrecimiento.Sugerencia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Usuario", ecoDopplerCrecimiento.Usuario ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Anatomia", ecoDopplerCrecimiento.Anatomia ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AnatomiaTexto", ecoDopplerCrecimiento.AnatomiaTexto ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Liquido", ecoDopplerCrecimiento.Liquido ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VenaUmbIp", ecoDopplerCrecimiento.VenaUmbIp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VenaUmbPerc", ecoDopplerCrecimiento.VenaUmbPerc ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@VenaUmbDiastole", ecoDopplerCrecimiento.VenaUmbDiastole ?? (object)DBNull.Value);





                await conn.OpenAsync();
                return await cmd.ExecuteNonQueryAsync(); // Retorna el número de filas afectadas
            }
        }
        public async Task<DataSet> ListaEcoDopplerCrecimiento(int? IdMovimiento, int? IdProducto, int? Numero)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListaEcoDopplerCrecimiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", IdMovimiento ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@idProducto", IdProducto ?? Convert.DBNull);
                da.SelectCommand.Parameters.AddWithValue("@Numero", Numero ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }




        public async Task<DataSet> TiposSexoSeleccionarTodosEcografias()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("TiposSexoSeleccionarTodosEcografias", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> ListaComboDetalle(int? IdCatalogoCombo)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListaComboDetalle", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdCatalogoCombo", IdCatalogoCombo ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> EmpleadoImgMGP(int? idGrupo)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("EmpleadoImgMGP", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@idGrupo", idGrupo ?? Convert.DBNull);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        //--------------------------SELECIONAR MOVIMIENTO (KHOYOSI)----------------------------------------
        public async Task<DataSet> SeleccionarMovimiento(int idMovimiento)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarMovimientosImagenologia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = idMovimiento;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar del movimiento", ex);
            }
        }


        //----------------------------------------------------------------------------------------------


        //--------------------------GUARDAR MOVIMIENTO (KHOYOSI)----------------------------------------
        public async Task<int> GuardarMovimiento(ImagenologiaMovimiento imagenologia, List<InsumoCPT> dsInsumosCPT, List<ProductoCPT> dsProductosCPT)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            string xmlInsumosCPT, xmlProductosCPT;
            xmlInsumosCPT = XmlUtil.Serializer(typeof(List<InsumoCPT>), dsInsumosCPT);
            xmlProductosCPT = XmlUtil.Serializer(typeof(List<ProductoCPT>), dsProductosCPT);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ImgMovimientoModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = imagenologia.IdCuentaAtencion == null ? (object)DBNull.Value : imagenologia.IdCuentaAtencion;
                cmd.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = imagenologia.IdMovimiento;
                cmd.Parameters.Add("@IdOrden", SqlDbType.Int).Value = imagenologia.IdOrden;
                cmd.Parameters.Add("@IdOrdenPago", SqlDbType.Int).Value = imagenologia.IdOrdenPago == null ? (object)DBNull.Value : imagenologia.IdOrdenPago;
                cmd.Parameters.Add("@IdReceta", SqlDbType.VarChar).Value = imagenologia.IdReceta == null ? (object)DBNull.Value : imagenologia.IdReceta;
                cmd.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = imagenologia.MovTipo;
                //da.SelectCommand.Parameters.Add("@IdTipoConcepto", SqlDbType.VarChar).Value = imagenologia.IdTipoConcepto;
                cmd.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = imagenologia.IdPuntoCarga;
                cmd.Parameters.Add("@MedicoSolicita", SqlDbType.VarChar).Value = imagenologia.MedicoSolicita;
                cmd.Parameters.Add("@IdMedicoSolicita", SqlDbType.Int).Value = imagenologia.IdMedicoSolicita;
                cmd.Parameters.Add("@IdMedicoRealiza", SqlDbType.Int).Value = imagenologia.IdMedicoRealiza == null ? (object)DBNull.Value : imagenologia.IdMedicoRealiza;
                cmd.Parameters.Add("@IdPersonaTomaImagen", SqlDbType.Int).Value = imagenologia.IdPersonaTomaImagen;
                cmd.Parameters.Add("@idPersonaRecoge", SqlDbType.Int).Value = imagenologia.IdPersonaRecoge;
                cmd.Parameters.Add("@FUM", SqlDbType.VarChar).Value = imagenologia.Eo_FUM;
                cmd.Parameters.Add("@FPP", SqlDbType.VarChar).Value = imagenologia.Eo_FPP;
                cmd.Parameters.Add("@Gesta", SqlDbType.VarChar).Value = imagenologia.Eo_Gestantes;
                cmd.Parameters.Add("@Paridad", SqlDbType.VarChar).Value = imagenologia.Eo_Partos;
                cmd.Parameters.Add("@EdadGestSem", SqlDbType.Int).Value = imagenologia.Eo_EG;
                cmd.Parameters.Add("@EdadGestDias", SqlDbType.Int).Value = imagenologia.Eo_EGDias;
                //cmd.Parameters.Add("@TipoAp", SqlDbType.VarChar).Value = imagenologia.TipoAP;
                //cmd.Parameters.Add("@IdMovApReemplazo", SqlDbType.VarChar).Value = imagenologia.IdMovApReemplazo;
                cmd.Parameters.Add("@IdComprobantePago", SqlDbType.Int).Value = imagenologia.IdComprobantePago == null ? (object)DBNull.Value : imagenologia.IdComprobantePago;
                cmd.Parameters.Add("@CorrelativoAnual", SqlDbType.Int).Value = imagenologia.CorrelativoAnual;
                cmd.Parameters.Add("@idDiagnostico", SqlDbType.Int).Value = imagenologia.IdDiagnostico;
                cmd.Parameters.Add("@EsDiagnosticoDefinitivo", SqlDbType.Int).Value = imagenologia.EsDiagnosticoDefinitivo;
                cmd.Parameters.Add("@NoCubreIAFA", SqlDbType.Int).Value = imagenologia.NoCubreIAFA;
                cmd.Parameters.Add("@FechaHoraNacimiento", SqlDbType.VarChar).Value = imagenologia.FechaHoraNacimiento;
                cmd.Parameters.Add("@IdTipoSexo", SqlDbType.Int).Value = imagenologia.IdTipoSexo;

                cmd.Parameters.Add("@InsumosCPT", SqlDbType.Xml).Value = xmlInsumosCPT;
                cmd.Parameters.Add("@ProductosCPT", SqlDbType.Xml).Value = xmlProductosCPT;
                cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = imagenologia.IdUsuario;
                cmd.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = imagenologia.IdUsuarioAuditoria;

                // Parámetro de salida
                SqlParameter outputParam = new SqlParameter("@IdMovimientoImg", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outputParam);

                await conn.OpenAsync();

                da.Fill(ds);

                int idMovimientoLab = (int)cmd.Parameters["@IdMovimientoImg"].Value;

                //return ds;

                return idMovimientoLab;
            }
        }

        //--------------------------ELIMINAR MOVIMIENTO (KHOYOSI)----------------------------------------
        public async Task<DataSet> EliminarMovimiento(int idMovimiento, int idUsuario)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EliminarMovimientosImagenologia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = idMovimiento;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos eliminar del movimiento", ex);
            }
        }



    }
}
