using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalMenu
    {
        public Task<List<Menu>> ObtenerMenuPadre(int idEmpleado)
        {
            DataSet ds = new DataSet();
            List<Menu> lstMenu = new List<Menu>();
            Menu u = null;
            //SqlCommand cmd = null;
            //SqlDataReader dr = null;
            try
            {

                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_RolesItemsSeleccionarGruposPorUsuario";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@lIdUsuario", SqlDbType.Int).Value = idEmpleado;

                            da.Fill(ds);

                            DataTable dt = ds.Tables[0];
                            foreach (DataRow row in dt.Rows)
                            {
                                u = new Menu();
                                u.IdListGrupo = Convert.ToInt16(row["IdListGrupo"]);
                                u.Clave = Convert.ToString(row["Clave"]);
                                u.Descripcion = Convert.ToString(row["Texto"]);
                                u.UrlIcono = "";// Convert.ToString(dr["icono"]);
                                u.Indice = Convert.ToInt16(row["indice"]);
                                u.Area = Convert.ToString(row["Area"]);
                                u.iconoArea = Convert.ToString(row["iconoArea"]);
                                lstMenu.Add(u);
                            }
                            
                            return lstMenu;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_RolesItemsSeleccionarGruposPorUsuario");
                //cmd.Parameters.AddWithValue("@lIdUsuario", idEmpleado);
                //dr = cmd.ExecuteReader();
                //while (dr.Read())
                //{
                //    u = new Menu();
                //    u.IdListGrupo = Convert.ToInt16(dr["IdListGrupo"]);
                //    u.Clave = Convert.ToString(dr["Clave"]);
                //    u.Descripcion = Convert.ToString(dr["Texto"]);
                //    u.UrlIcono = "";// Convert.ToString(dr["icono"]);
                //    u.Indice = Convert.ToInt16(dr["indice"]);
                //    u.Area = Convert.ToString(dr["Area"]);
                //    u.iconoArea= Convert.ToString(dr["iconoArea"]);
                //    lstMenu.Add(u);
                //}
            }
            catch (Exception)
            {
                lstMenu = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return lstMenu;
        }
        public Task<List<SubMenus>> ObtenerMenuHijos(int idEmpleado,int idGrupo)
        {
            DataSet ds = new DataSet();
            List<SubMenus> lstSubMenu = new List<SubMenus>();
            SubMenus u = null;
            //SqlCommand cmd = null;
            //SqlDataReader dr = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_RolesItemsSeleccionarItemsPorUsuarioYGrupo";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@lIdUsuario", SqlDbType.Int).Value = idEmpleado;
                            da.SelectCommand.Parameters.Add("@lIdGrupo", SqlDbType.Int).Value = idGrupo;

                            da.Fill(ds);

                            DataTable dt = ds.Tables[0];
                            foreach (DataRow row in dt.Rows)
                            {
                                u = new SubMenus();
                                u.IdListItem = Convert.ToInt16(row["IdListItem"]);
                                u.Clave = Convert.ToString(row["Clave"]);
                                u.Texto = Convert.ToString(row["Texto"]);
                                u.Indice = Convert.ToInt16(row["Indice"]);// Convert.ToString(dr["icono"]);
                                u.KeyIcon = Convert.ToString(row["KeyIcon"]);
                                u.IdListGrupo = Convert.ToInt16(row["IdListGrupo"]);
                                u.Controlador = Convert.ToString(row["Controlador"]);
                                u.Metodo = Convert.ToString(row["Metodo"]);
                                lstSubMenu.Add(u);
                            }

                            return lstSubMenu;
                        }
                    }
                });


                //cmd = MetodoDatos.CrearComando("web_RolesItemsSeleccionarItemsPorUsuarioYGrupo");
                //cmd.Parameters.AddWithValue("@lIdUsuario", idEmpleado);
                //cmd.Parameters.AddWithValue("@lIdGrupo", idGrupo );
                //dr = cmd.ExecuteReader();
                //while (dr.Read())
                //{
                //    u = new SubMenus();
                //    u.IdListItem  = Convert.ToInt16(dr["IdListItem"]);
                //    u.Clave = Convert.ToString(dr["Clave"]);
                //    u.Texto = Convert.ToString(dr["Texto"]);
                //    u.Indice = Convert.ToInt16(dr["Indice"]);// Convert.ToString(dr["icono"]);
                //    u.KeyIcon  = Convert.ToString (dr["KeyIcon"]);
                //    u.IdListGrupo = Convert.ToInt16(dr["IdListGrupo"]);
                //    u.Controlador  = Convert.ToString(dr["Controlador"]);
                //    u.Metodo  = Convert.ToString(dr["Metodo"]);
                //    lstSubMenu.Add(u);
                //}
            }
            catch (Exception)
            {
                lstSubMenu = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return lstSubMenu;
        }


        public Task<DataSet> DevuelveDatosMenu(String cClave)
        {
            DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            try
            {
                Conexion cx = new Conexion();
                return Task.Run(() =>
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "Web_ObtenerDatosMenu";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@Clave", SqlDbType.Int).Value = cClave;                            

                            da.Fill(ds);
                                                        
                            return ds;
                        }
                    }
                });

                //cmd = MetodoDatos.CrearComando("Web_ObtenerDatosMenu");
                //cmd.Parameters.AddWithValue("@Clave", cClave);
                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }


    }
}
