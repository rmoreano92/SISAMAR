using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using static CapaEntidades.Enumerados;

namespace CapaDatos
{
    public class DalAdmisionEmergencia
    {
        //public DataSet DevuelveServiciosDelHospitalFiltro(string filtro)
        //{
        //    DataSet ds = new DataSet();
        //    SqlCommand cmd = null;
        //    try
        //    {

        //        cmd = MetodoDatos.CrearComando("DevuelveServiciosDelHospitalFiltro");
        //        cmd.Parameters.AddWithValue("@lcFiltro", filtro);
        //        //cmd.Parameters.AddWithValue("@idProgramacion", Programacion);
        //        //dr = cmd.ExecuteReader ();

        //        SqlDataAdapter da = new SqlDataAdapter(cmd);

        //        da.Fill(ds);

        //    }
        //    catch (Exception ex)
        //    {

        //        ds = null; throw ex;
        //    }
        //    finally
        //    {
        //        cmd.Connection.Close();
        //    }
        //    return ds;
        //}

        public Task<DataSet> ListarAtencionesEmergencia(int idCuenta, string dni, int historia, string apPaterno, string fecha, int idServicio, string fechaFin, int tipoBusqueda) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "usp_ListarAtencionesEmergencia"; //MGAMERO
                        //"web_ListarAtencionesEmergencia";
                        //string sql = "web_ListarAtencionesEmergenciaV2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.CommandTimeout = 300;

                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = idCuenta;
                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = historia;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (dni == null) ? "" : dni;
                        da.SelectCommand.Parameters.Add("@ApPaterno", SqlDbType.VarChar).Value = (apPaterno == null) ? "" : apPaterno;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.VarChar).Value = (fecha == null) ? "" : fecha;
                        da.SelectCommand.Parameters.Add("@FechaFin", SqlDbType.VarChar).Value = (fechaFin == null) ? "" : fechaFin; // JDELGADOPM
                        da.SelectCommand.Parameters.Add("@TipoBusqueda", SqlDbType.Int).Value = tipoBusqueda;             //Busqueda Tradiconal: 1       Sin Alta Medica: 2        Sin Recepcion: 3        Sin Alta Admisnitrativa: 4

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> DevuelveServiciosDelHospitalFiltro(string filtro)
        {
            DataSet ds = new DataSet();            
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DevuelveServiciosDelHospitalFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;
                                                
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        //public DataSet BuscarAtencionesEmergenciaPorFiltro(string filtro)
        //{
        //    DataSet ds = new DataSet();
        //    SqlCommand cmd = null;
        //    try
        //    {

        //        cmd = MetodoDatos.CrearComando("web_AtencionesSeleccionarEmergPorCuentaPorHistoriaPorApellidosPorServiciobyMGP");
        //        cmd.Parameters.AddWithValue("@lcFiltro", filtro);
        //        //cmd.Parameters.AddWithValue("@idProgramacion", Programacion);
        //        //dr = cmd.ExecuteReader ();

        //        SqlDataAdapter da = new SqlDataAdapter(cmd);

        //        da.Fill(ds);

        //    }
        //    catch (Exception ex)
        //    {

        //        ds = null; throw ex;
        //    }
        //    finally
        //    {
        //        cmd.Connection.Close();
        //    }
        //    return ds;
        //}

        public Task<DataSet> BuscarAtencionesEmergenciaPorFiltro(string filtro)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesSeleccionarEmergPorCuentaPorHistoriaPorApellidosPorServiciobyMGP";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        [HttpPost]
        public async Task<DataSet> ListarDerivacionById(int IdDerivacion) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListarDerivacionById", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@IdDerivacion", SqlDbType.Int).Value = IdDerivacion;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        //MGAMERO
        public Task<DataSet> ConfirmarPagoCuentaAtencion(int idCuentaAtencion)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "usp_ConfirmarPagoCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
