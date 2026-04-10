using CapaDatos;
using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalRoles
    {
        public Task<DataSet> ListarRoles()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarRoles";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarListBarItems()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarListBarItems";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarPermisos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarPermisos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListarListBarReporte()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarListBarReporte";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarRolesItems(int idRol)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RolesItemsSeleccionarPorRol";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRol", SqlDbType.VarChar).Value = idRol;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarRolesPermisos(int idRol)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RolesPermisosSeleccionarPorRol";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRol", SqlDbType.VarChar).Value = idRol;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarRolesReportes(int idRol)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RolesReportesSeleccionarPorRol";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRol", SqlDbType.VarChar).Value = idRol;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<int> GuardarModificarRol(int idRol, string nombreRol, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RolesModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRol", SqlDbType.Int).Value = idRol;
                        da.SelectCommand.Parameters.Add("@nombreRol", SqlDbType.VarChar).Value = nombreRol;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@rpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        int nRpta = int.Parse(da.SelectCommand.Parameters["@rpta"].Value.ToString());

                        return nRpta;
                    }
                }

            });
        }

        public Task<Boolean> GuardarModificarRolesItems(int idRol, List<RolesItems> dsRolesItems)
        {
            bool rpta = false;
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlRolesItems = XmlUtil.Serializer(typeof(List<RolesItems>), dsRolesItems);
                        //xmlRolesItems = xmlRolesItems.Replace("utf-16", "utf-8");

                        string sql = "web_RolesItemsModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRol", SqlDbType.Int).Value = idRol;
                        da.SelectCommand.Parameters.Add("@xmlRolesItems", SqlDbType.Xml).Value = xmlRolesItems;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rpta = true;

                        return rpta;
                    }
                }

            });
        }

        public Task<Boolean> GuardarModificarRolesPermisos(int idRol, List<RolesPermisos> dsRolesPermisos)
        {
            bool rpta = false;
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlRolesPermisos = XmlUtil.Serializer(typeof(List<RolesPermisos>), dsRolesPermisos);
                        //xmlRolesPermisos = xmlRolesPermisos.Replace("utf-16", "utf-8");

                        string sql = "web_RolesPermisosModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRol", SqlDbType.Int).Value = idRol;
                        da.SelectCommand.Parameters.Add("@xmlRolesPermisos", SqlDbType.Xml).Value = xmlRolesPermisos;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rpta = true;

                        return rpta;
                    }
                }

            });
        }

        public Task<Boolean> GuardarModificarRolesReportes(int idRol, List<RolesReportes> dsRolesReportes)
        {
            bool rpta = false;
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string xmlRolesReportes = XmlUtil.Serializer(typeof(List<RolesReportes>), dsRolesReportes);
                        //xmlRolesReportes = xmlRolesReportes.Replace("utf-16", "utf-8");

                        string sql = "web_RolesReportesModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRol", SqlDbType.Int).Value = idRol;
                        da.SelectCommand.Parameters.Add("@xmlRolesReportes", SqlDbType.Xml).Value = xmlRolesReportes;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rpta = true;

                        return rpta;
                    }
                }

            });
        }

        public Task<Boolean> EliminarRolesItems(int idRol, int idUsuario)
        {
            bool rpta = false;
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RolesItemsEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idRol", SqlDbType.Int).Value = idRol;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rpta = true;

                        return rpta;
                    }
                }

            });
        }

    }
}
