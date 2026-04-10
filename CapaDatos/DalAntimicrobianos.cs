using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using CapaDatos;
using CapaEntidades;
using System.Collections.Generic;
using WebAppMaternidad.CapaEntidades;
using System;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace WebAppMaternidad.CapaDatos
{
    public class DalAntimicrobianos
    {
        public Task<DataSet> ListarRecetas(int nroReceta, int nroCuenta, string nroDni, int nroHistoria, string apellidoPaterno, string apellidoMaterno)
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaSolicitudesAntimicrobianos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@nroReceta", SqlDbType.Int).Value = nroReceta;
                        da.SelectCommand.Parameters.Add("@nroCuenta", SqlDbType.Int).Value = nroCuenta;
                        da.SelectCommand.Parameters.Add("@nroDni", SqlDbType.VarChar).Value = nroDni;
                        da.SelectCommand.Parameters.Add("@nroHistoria", SqlDbType.Int).Value = nroHistoria;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno;
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = apellidoMaterno;
                        //da.SelectCommand.Parameters.Add("@idServicioGeneral", SqlDbType.Int).Value = idServicioGeneral;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaMotivoSolicitud()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListaMotivoSolicitud";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListaCondicionSolicitud()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListaCondicionSolicitud";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListaMotivosRechazo()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ListaMotivosRechazo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> SeleccionaRecetaAntimicrobiano(int idReceta)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ReceCabeceraDetalleAntimicrobianos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdReceta", SqlDbType.Int).Value = idReceta;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> SeleccionSolicitudAntimicrobiano(int idSolicitud)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_SeleccionSolicitudAntimicrobiano";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdSolicitud", SqlDbType.Int).Value = idSolicitud;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> VerificarSolicitudAntimicrobianoPorProducto(int idProducto, int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_VerificarSolicitudAntimicrobianoPorProducto";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = idProducto;
                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> GuardarSolicitudAntimicrobiano(GestionAntimicrobiano gestionAntimicrobiano, List<SolicitudCondicionAntimicrobiano> condicionAntimicrobianos, int IdUsuario)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            string xmlCondicionAntimicrobiano;
            xmlCondicionAntimicrobiano = XmlUtil.Serializer(typeof(List<SolicitudCondicionAntimicrobiano>), condicionAntimicrobianos);

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_GestionAntimicrobianoModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdSolicitudAntimicrobiano", SqlDbType.Int).Value = gestionAntimicrobiano.IdSolicitudAntimicrobiano;
                            da.SelectCommand.Parameters.Add("@IdReceta", SqlDbType.Int).Value = gestionAntimicrobiano.IdReceta;
                            da.SelectCommand.Parameters.Add("@FechaSolicitud", SqlDbType.VarChar).Value = gestionAntimicrobiano.FechaSolicitud;
                            da.SelectCommand.Parameters.Add("@IdMotivo", SqlDbType.Int).Value = gestionAntimicrobiano.IdMotivo;
                            da.SelectCommand.Parameters.Add("@CondicionPaciente", SqlDbType.Xml).Value = xmlCondicionAntimicrobiano;
                            da.SelectCommand.Parameters.Add("@TratamientoPrevio", SqlDbType.VarChar).Value = gestionAntimicrobiano.TratamientoPrevio;

                            da.SelectCommand.Parameters.Add("@AutorizaAntimicrobiano", SqlDbType.Int).Value = gestionAntimicrobiano.AutorizaAntimicrobiano;
                            da.SelectCommand.Parameters.Add("@IdMotivoRechazo", SqlDbType.Int).Value = gestionAntimicrobiano.IdMotivoRechazo;
                            da.SelectCommand.Parameters.Add("@SugerenciasTratamiento", SqlDbType.VarChar).Value = gestionAntimicrobiano.SugerenciasTratamiento;
                            da.SelectCommand.Parameters.Add("@FechaRespuesta", SqlDbType.VarChar).Value = gestionAntimicrobiano.FechaRespuesta;
                            da.SelectCommand.Parameters.Add("@EstaAutorizando", SqlDbType.Int).Value = gestionAntimicrobiano.EstaAutorizando;

                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;


                            da.Fill(ds);
                            
                            return ds;
                        }
                    }
                }
                catch (Exception)
                {
                    ds = null; throw;
                }

            });
        }

        public Task<DataSet> EliminarSolicitudAntimicrobiano(int idSolicitud, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_GestionAntimicrobianoEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdSolicitud", SqlDbType.Int).Value = idSolicitud;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }



    }
}
