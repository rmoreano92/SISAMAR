using CapaDatos;
using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;


namespace WebAppMaternidad.CapaDatos
{
    public class DalImagenesEcografias
    {

        public Task<DataSet> ListaTiposSexoEcoImagenes()
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
                            string sql = "TiposSexoSeleccionarTodosEcografias";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@catalogo", catalogo);

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

        public Task<DataSet> ListaCatalogoEcoImagenesPorCatalogo(string catalogo)
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
                            string sql = "web_ListaCatalogoEcoImagenesPorCatalogo";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@catalogo", catalogo);

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
        public Task<DataSet> ListaEmpleadosPorTipoEmpleado(string tipoEmpleado)
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
                            string sql = "EmpleadosSeleccionarPorTipoEmpleadoV2";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@tipoEmpleado", tipoEmpleado);

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

        public Task<DataSet> ListaTiposEdadGestacional()
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
                            string sql = "TiposEdadGestacionalSeleccionarTodos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@tipoEmpleado", tipoEmpleado);

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

        public Task<DataSet> ListaMedicacionPrevia()
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
                            string sql = "ListaMedicacionPrevia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@tipoEmpleado", tipoEmpleado);

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

        public Task<DataSet> ListaCordonNucal()
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
                            string sql = "ListaCordonNucal";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.AddWithValue("@tipoEmpleado", tipoEmpleado);

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


        /*=====================ECO-VAGINAL BASICA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoVaginalBasica(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoVaginalBasicaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoVaginalBasica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoVaginalBasica> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoVaginalBasica>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoVaginalBasicaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet>  InformeEcoVaginalBasica(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoVaginalBasicaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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

        /*======================================================================================================================================================================*/

        /*=====================ECO-GENETICA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoGenetica(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoGeneticaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoGenetica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoGenetica> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoGenetica>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoGeneticaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoGenetica(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoGeneticaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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
        /*======================================================================================================================================================================*/

        /*=====================ECO-ABDOMINAL BASICA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoAbdominalBasica(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoAbdominalBasicaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoAbdominalBasica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoAbdominalBasica> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoAbdominalBasica>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoAbdominalBasicaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoAbdominalBasica(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoAbdominalBasicaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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
        /*======================================================================================================================================================================*/

        /*=====================ECO-UTERO GRAVIDO================================================================================================================*/
        public Task<DataSet> SeleccionarEcoUteroGravido(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoUteroGravidoSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoUteroGravido(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoUteroGravido> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoUteroGravido>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoUteroGravidoModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoUteroGravido(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoUteroGravidoInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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
        /*======================================================================================================================================================================*/

        /*=====================ECO-DOPPLER CRECIMIENTO================================================================================================================*/
        public Task<DataSet> SeleccionarEcoDopplerCrecimiento(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoDopplerCrecimientoSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoDopplerCrecimiento(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoDopplerCrecimiento> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoDopplerCrecimiento>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoDopplerCrecimientoModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoDopplerCrecimiento(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoDopplerCrecimientoInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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
        /*======================================================================================================================================================================*/

        
        /*=====================ECO-NEUROSONOGRAFIA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoNeurosonografia(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
           
            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoNeurosonografiaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoNeurosonografia(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoNeurosonografia> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoNeurosonografia>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoNeurosonografiaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoNeurosonografia(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoNeurosonografiaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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

        /*======================================================================================================================================================================*/

        /*=====================ECO-CARDIOGRAFIA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoCardiografia(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoCardiografiaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoCardiografia(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoCardiografia> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoCardiografia>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoCardiografiaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoCardiografia(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoCardiografiaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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

        /*======================================================================================================================================================================*/

        /*=====================ECO-MORFOLOGICA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoMorfologica(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoMorfologicaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoMorfologica(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdServicioRealiza, string FechaResultado, List<EcoMorfologica> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoMorfologica>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoMorfologicaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoMorfologica(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoMorfologicaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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

        /*======================================================================================================================================================================*/


        /*=====================ECO-CARDIOTOGRAFIA================================================================================================================*/
        public Task<DataSet> SeleccionarEcoCardiotografia(int idOrden, int idMovimiento, int idProducto, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoCardiotografiaSeleccionar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
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

        public Task<DataSet> GuardarEcoCardiotografia(int IdCuentaAtencion, int IdOrden, int IdMovimiento, int IdProducto, int IdRealizaAnalisis, int IdRealizaInforme, int IdServicioRealiza, string FechaResultado, List<EcoCardiotografia> lstobjDetalleResultado, int idUsuario, int idListBar)
        {
            DataSet dataSet = new DataSet();
            Conexion cx = new Conexion();
            string xmlDetalleResultado;
            xmlDetalleResultado = XmlUtil.Serializer(typeof(List<EcoCardiotografia>), lstobjDetalleResultado);

            return Task.Run(() => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EcoCardiotografiaModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                            cmd.Parameters.AddWithValue("@IdOrden", IdOrden);
                            cmd.Parameters.AddWithValue("@IdMovimiento", IdMovimiento);
                            cmd.Parameters.AddWithValue("@IdProducto", IdProducto);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdRealizaInforme", IdRealizaInforme);
                            cmd.Parameters.AddWithValue("@IdServicioRealiza", IdServicioRealiza);
                            cmd.Parameters.AddWithValue("@FechaResultado", FechaResultado);
                            cmd.Parameters.AddWithValue("@DetalleResultado", xmlDetalleResultado);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@IdListBar", idListBar);

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

        public Task<DataSet> InformeEcoCardiotografia(int idOrden, int idMovimiento, int idProducto)
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
                            string sql = "web_EcoCardiotografiaInforme";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
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

        /*======================================================================================================================================================================*/




    }
}
