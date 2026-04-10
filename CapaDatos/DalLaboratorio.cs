using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalLaboratorio
    {
        public Task<DataSet> ListarMovimientosLaboratorio(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idTipoServicio, int idGrupoExamen, int idRealizaExamen, int idPuntoCarga)
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
                            string sql = "web_ListarMovimientosLaboratorio";
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
        public Task<DataSet> ListarMovimientosLaboratorioTamizaje(int idMovimiento, int idCuenta, string historia, string nombres, DateTime fechaInicio, DateTime fechaFin, int idTipoServicio, int idGrupoExamen, int idRealizaExamen, int idPuntoCarga)
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
                            string sql = "web_ListarMovimientosLaboratorioTamizaje";
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
                            string sql = "Web_LabFactOrdenServicioPorIdMovimiento";
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
        public Task<DataSet> LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(int idOrden, int idPuntoCarga, int idMovimiento, int idEmpleado)
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
                            string sql = "Web_LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga_test";
                            //string sql = "Web_LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga";
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
                            string sql = "Web_LabListarExamenesConResultadoPorFecha";
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
        public Task<DataSet> LabMovimientoLaboratorioSeleccionarXidOrden(int idOrden)
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
                            string sql = "web_LabMovimientoLaboratorioSeleccionarXidOrden_test";
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


        public Task<DataSet> LabMovimientoLaboratorioSeleccionarByIdCuenta(int idCuenta)
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
                            string sql = "web_LaboratorioMovimientosSeleccionarByCuenta";
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

        public Task<DataSet> LabMovimientoLaboratorioSeleccionarPorIdPaciente(int idPaciente)
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
                            string sql = "web_LaboratorioMovimientosSeleccionarPorIdPaciente";
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

        public Task<DataSet> LabItemsCptSeleccionarPorIdProducto(int idProducto)
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
                            string sql = "web_LabItemsCptSeleccionarPorIdProducto";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

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

        //--------------------------GUARDAR MOVIMIENTO (KHOYOSI)----------------------------------------
        public async Task<int> GuardarMovimiento(LaboratorioMovimiento laboratorio, List<InsumoCPT> dsInsumosCPT, List<ProductoCPT> dsProductosCPT)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();

            string xmlInsumosCPT, xmlProductosCPT;
            xmlInsumosCPT = XmlUtil.Serializer(typeof(List<InsumoCPT>), dsInsumosCPT);
            xmlProductosCPT = XmlUtil.Serializer(typeof(List<ProductoCPT>), dsProductosCPT);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_LabMovimientoModificar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = laboratorio.IdCuentaAtencion == null ? (object)DBNull.Value : laboratorio.IdCuentaAtencion;
                cmd.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = laboratorio.IdMovimiento;
                cmd.Parameters.Add("@IdOrden", SqlDbType.Int).Value = laboratorio.IdOrden;
                cmd.Parameters.Add("@IdOrdenPago", SqlDbType.Int).Value = laboratorio.IdOrdenPago == null ? (object)DBNull.Value : laboratorio.IdOrdenPago;
                cmd.Parameters.Add("@IdReceta", SqlDbType.VarChar).Value = laboratorio.IdReceta == null ? (object)DBNull.Value : laboratorio.IdReceta;
                cmd.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = laboratorio.MovTipo;
                //da.SelectCommand.Parameters.Add("@IdTipoConcepto", SqlDbType.VarChar).Value = laboratorio.IdTipoConcepto;
                cmd.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = laboratorio.IdPuntoCarga;
                cmd.Parameters.Add("@MedicoSolicita", SqlDbType.VarChar).Value = laboratorio.MedicoSolicita;
                cmd.Parameters.Add("@IdMedicoSolicita", SqlDbType.Int).Value = laboratorio.IdMedicoSolicita;
                cmd.Parameters.Add("@IdMedicoRealiza", SqlDbType.Int).Value = laboratorio.IdMedicoRealiza == null ? (object)DBNull.Value : laboratorio.IdMedicoRealiza;
                cmd.Parameters.Add("@idPersonaTomaLab", SqlDbType.Int).Value = laboratorio.IdPersonaTomaLab;
                cmd.Parameters.Add("@idPersonaRecoge", SqlDbType.Int).Value = laboratorio.IdPersonaRecoge;
                cmd.Parameters.Add("@TipoAp", SqlDbType.VarChar).Value = laboratorio.TipoAP;
                cmd.Parameters.Add("@IdMovApReemplazo", SqlDbType.VarChar).Value = laboratorio.IdMovApReemplazo;
                cmd.Parameters.Add("@IdComprobantePago", SqlDbType.Int).Value = laboratorio.IdComprobantePago == null ? (object)DBNull.Value : laboratorio.IdComprobantePago;
                cmd.Parameters.Add("@CorrelativoAnual", SqlDbType.Int).Value = laboratorio.CorrelativoAnual;
                cmd.Parameters.Add("@idDiagnostico", SqlDbType.Int).Value = laboratorio.IdDiagnostico;
                cmd.Parameters.Add("@EsDiagnosticoDefinitivo", SqlDbType.Int).Value = laboratorio.EsDiagnosticoDefinitivo;
                cmd.Parameters.Add("@NoCubreIAFA", SqlDbType.Int).Value = laboratorio.NoCubreIAFA;
                cmd.Parameters.Add("@FechaHoraNacimiento", SqlDbType.VarChar).Value = laboratorio.FechaHoraNacimiento;
                cmd.Parameters.Add("@IdTipoSexo", SqlDbType.Int).Value = laboratorio.IdTipoSexo;

                cmd.Parameters.Add("@InsumosCPT", SqlDbType.Xml).Value = xmlInsumosCPT;
                cmd.Parameters.Add("@ProductosCPT", SqlDbType.Xml).Value = xmlProductosCPT;
                cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = laboratorio.IdUsuario;
                cmd.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = laboratorio.IdUsuarioAuditoria;

                // Parámetro de salida
                SqlParameter outputParam = new SqlParameter("@IdMovimientoLab", SqlDbType.Int);
                outputParam.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outputParam);

                await conn.OpenAsync();

                da.Fill(ds);

                int idMovimientoLab = (int)cmd.Parameters["@IdMovimientoLab"].Value;

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
                        string sql = "web_EliminarMovimientosLaboratorio";
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
                        string sql = "web_SeleccionarMovimientosLaboratorio";
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


        public async Task<DataSet> ListarCodigosApDisponibles(string TipoAp)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ListaCodigoApsDisponibles";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@TipoAp", SqlDbType.VarChar).Value = TipoAp;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos ap disponibles", ex);
            }
        }

        public Task<DataSet> RptResulLaboratoriobyMGP(int idOrden, int idproducto)
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
                            string sql = "RptResulLaboratoriobyMGP";
                            SqlCommand cmd = new SqlCommand(sql, conn);
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

        public Task<DataSet> ListarGruposLaboratorio(int idMovimiento, int idOrden)
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
                            string sql = "web_LabMovimientoSeleccionarGrupos";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdMovimiento", idMovimiento);
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

        public Task<DataSet> ListarGrupoLaboratorioPorProducto(int idMovimiento, int idOrden, int idProducto)
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
                            string sql = "web_LabMovimientoSeleccionarGrupoPorIdproducto";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@IdOrden", idOrden);
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

        public Task<DataSet> ListarResultadosPorGrupoLabImg(int idOrden, int idGrupo, string tipo)
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
                            string sql = "web_ResultadosPorGrupoLabImg";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idGrupo", idGrupo);
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

        public Task<DataSet> ListarCabeceraResultados(int idOrden, int idProducto)
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
                            string sql = "web_ResultadosCabeceraLab";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idOrden", idOrden);
                            cmd.Parameters.AddWithValue("@idProducto", idProducto);
                            
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

        public Task<DataSet> ListarResultadosLaboratorio(int idOrden, int idProducto, string tipo)
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
                            string sql = "web_ResultadosLaboratorio";
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

        public Task<DataSet> ListarResultadosLabTamizaje(int idOrden, int idProducto, string tipo)
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
                            string sql = "web_ResultadosTamizajeLab";
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
                            string sql = "web_ResultadosImagenesLaboratorioModificar";
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

        public Task<Boolean> EliminarResultadoImagen(int idLabResultadoImagen, int idUsuario)
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
                            string sql = "web_ResultadosImagenesLaboratorioEliminar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdLabResultadoImagen", idLabResultadoImagen);

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
                            string sql = "web_ResultadosImagenesLaboratorioListar";
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

        public Task<Boolean> GuardarResultados(LabResultadosCabecera cabecera, List<LabResultadosPorItems> lstDetalle, int idUsuario)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();
            string xmlDetalle;
            xmlDetalle = XmlUtil.Serializer(typeof(List<LabResultadosPorItems>), lstDetalle);
            bool resp = false;

            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ResultadosLaboratorioModificar";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdProductoCpt", cabecera.IdProducto);
                            cmd.Parameters.AddWithValue("@IdOrden", cabecera.IdOrden);
                            cmd.Parameters.AddWithValue("@FechaResultado", cabecera.FechaResultado);
                            cmd.Parameters.AddWithValue("@CodigoIngreso", cabecera.CodigoIngreso);
                            cmd.Parameters.AddWithValue("@IdRealizaAnalisis", cabecera.IdRealizaAnalisis);
                            cmd.Parameters.AddWithValue("@IdMedicoValidaResultado", cabecera.IdValidaAnalisis);
                            cmd.Parameters.AddWithValue("@ResultadosDetalle", xmlDetalle);
                            cmd.Parameters.AddWithValue("@Observaciones", cabecera.Observaciones);
                            cmd.Parameters.AddWithValue("@TipoMuestra", cabecera.TipoMuestra);
                            cmd.Parameters.AddWithValue("@EstadoEstudio", cabecera.EstadoEstudio);
                            cmd.Parameters.AddWithValue("@diagnosticos", cabecera.diagnosticos);
                            cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                            cmd.Parameters.AddWithValue("@diagnosticosCIE0", cabecera.diagnosticosCIE0);
                            cmd.Parameters.AddWithValue("@diagnosticosCIE0Morfologico", cabecera.diagnosticoCIE0Morfologica);
                            cmd.Parameters.AddWithValue("@gradoDiferenciacion", cabecera.gradoDiferenciacion);
                            cmd.Parameters.AddWithValue("@lateralidad", cabecera.lateralidad);
                            cmd.Parameters.AddWithValue("@metodoDiagnostico", cabecera.metodoDiagnostico);

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
        
        public Task<DataSet> ListarDiagnosticosLaboratorio(int IdCuentaAtencion,int IdOrden)
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
                            string sql = "Web_ListarDiagnosticosLaboratorioV2";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (IdCuentaAtencion > 0) ? IdCuentaAtencion : 0;
                            da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = (IdOrden > 0) ? IdOrden : 0;
                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> ListarDiagnosticosLaboratorioCIE0(int IdCuentaAtencion, int IdOrden)
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
                            string sql = "Web_ListarDiagnosticosLaboratorioCIE0Morfologico";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (IdCuentaAtencion > 0) ? IdCuentaAtencion : 0;
                            da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = (IdOrden > 0) ? IdOrden : 0;
                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }


        public Task<DataSet> ListarDiagnosticosLaboratorioCIE0Morfologico(int IdCuentaAtencion, int IdOrden)
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
                            string sql = "Web_ListarDiagnosticosLaboratorioCIE0Topografico";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = (IdCuentaAtencion > 0) ? IdCuentaAtencion : 0;
                            da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = (IdOrden > 0) ? IdOrden : 0;
                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
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
                        string sql = "web_EliminarResultadosLaboratorio";
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

        public Task<DataSet> EmpleadosLaboratorioTodos()
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
                            string sql = "web_EmpleadosLaboratorioTodos";
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

        public Task<DataSet> EmpleadosLaboratorioPorCargo(int idCargo)
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
                            string sql = "web_EmpleadosLaboratorioPorCargo";
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

        public Task<DataSet> EmpleadosLaboratorioPorGrupo(int idGrupo)
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
                            string sql = "web_EmpleadosLaboratorioPorGrupo";
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


        public Task<DataSet> ListarTiposMuestraLab()
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
                            string sql = "Web_ListarTiposMuestraLab";
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

        public Task<DataSet> ListarEstadoEstudio()
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
                            string sql = "Web_ListarEstadoEstudio";
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

        public Task<DataSet> ListarGradoDiferenciacion()
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
                            string sql = "Web_ListarGradoDiferenciacion";
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


        public Task<DataSet> ListarLateralidad()
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
                            string sql = "Web_ListarLateralidad";
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

        public Task<DataSet> ListarMetodoDiagnostico()
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
                            string sql = "Web_ListarMetodoDiagnostico";
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

        public async Task<DataSet> ValidarResponsableTipoEstudioLab(string idEmpleado)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ValidarResponsableTipoEstudioLab";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.VarChar).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos validar ValidarResponsableTipoEstudioLab", ex);
            }
        }

    }
}
