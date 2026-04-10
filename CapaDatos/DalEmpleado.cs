using CapaEntidades;
using DocumentFormat.OpenXml.Drawing;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalEmpleado
    {
        public Task<Empleado>  VerificarAcceso(String Usuario,String Clave)
        {
            Empleado u = null;
            //SqlDataReader dr = null;
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_LoginEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Usuario", SqlDbType.VarChar).Value = (Usuario == null ? "" : Usuario);
                        da.SelectCommand.Parameters.Add("@Clave", SqlDbType.VarChar).Value = (Clave == null ? "" : Clave);

                        DataSet ds = new DataSet();

                        Console.WriteLine(da);
                        Console.WriteLine(ds);
                        da.Fill(ds);

                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            foreach (DataRow dr in ds.Tables[0].Rows)
                            {
                                u = new Empleado();
                                u.IdEmpleado = Convert.ToInt32(dr["IdEmpleado"]);
                                u.IdCondicionTrabajo = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                                u.IdEstablecimientoExterno = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                                u.idSupervisor = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                                u.idTipoDestacado = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                                u.idTipoDocumento = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                                u.IdTipoEmpleado = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                                u.loginEstado = Convert.ToString(dr["IdCondicionTrabajo"]);
                                u.Nombres = Convert.ToString(dr["IdCondicionTrabajo"]);
                                u.ReniecAutorizado = Convert.ToBoolean(dr["IdCondicionTrabajo"]); 
                                u.Usuario = Convert.ToString(dr["Usuario"]);
                                u.UsuarioClave = Convert.ToString(dr["IdCondicionTrabajo"]);
                                u.esActivo = Convert.ToBoolean(dr["IdCondicionTrabajo"]);
                                u.AccedeVWeb = Convert.ToBoolean(dr["IdCondicionTrabajo"]);
                                u.ApellidoPaterno = Convert.ToString(dr["ApellidoPaterno"]);
                                u.ApellidoMaterno = Convert.ToString(dr["ApellidoMaterno"]);
                                u.ClaveVWeb = Convert.ToString(dr["ClaveVWeb"]);
                                u.Nombres = Convert.ToString(dr["Nombres"]);
                                u.IdMedico = Convert.ToInt32(dr["IdMedico"]);           //KHOYOSI
                            }
                        }

                        return u;
                    }
                }

            });

            //Empleado u = null;
            //SqlCommand cmd = null;
            //SqlDataReader dr = null;
            //try
            //{

            //    cmd =  MetodoDatos.CrearComando("web_LoginEmpleado");
            //    cmd.Parameters.AddWithValue("@Usuario", Usuario);
            //    cmd.Parameters.AddWithValue("@Clave", Clave);
            //    //dr =  cmd.ExecuteReader(); //COMENTADO POR KHOYOSI
            //    dr = await cmd.ExecuteReaderAsync();       //KHOYOSI
            //    if (dr.Read())
            //    {
            //        u = new Empleado();
            //        u.IdEmpleado = Convert.ToInt32(dr["IdEmpleado"]);
            //        u.IdCondicionTrabajo = Convert.ToInt32(dr["IdCondicionTrabajo"]);
            //        u.IdEstablecimientoExterno= Convert.ToInt32(dr["IdCondicionTrabajo"]);
            //        u.idSupervisor= Convert.ToInt32(dr["IdCondicionTrabajo"]);
            //        u.idTipoDestacado= Convert.ToInt32(dr["IdCondicionTrabajo"]);
            //        u.idTipoDocumento= Convert.ToInt32(dr["IdCondicionTrabajo"]);
            //        u.IdTipoEmpleado=Convert.ToInt32(dr["IdCondicionTrabajo"]);
            //        u.loginEstado= Convert.ToString(dr["IdCondicionTrabajo"]);
            //        u.Nombres= Convert.ToString(dr["IdCondicionTrabajo"]);
            //        u.ReniecAutorizado= Convert.ToBoolean(dr["IdCondicionTrabajo"]);
            //        u.Usuario = Convert.ToString(dr["Usuario"]);
            //        u.UsuarioClave= Convert.ToString(dr["IdCondicionTrabajo"]);
            //        u.esActivo= Convert.ToBoolean(dr["IdCondicionTrabajo"]);
            //        u.AccedeVWeb= Convert.ToBoolean(dr["IdCondicionTrabajo"]);
            //        u.ApellidoPaterno = Convert.ToString(dr["ApellidoPaterno"]);
            //        u.ApellidoMaterno = Convert.ToString(dr["ApellidoMaterno"]);
            //        u.ClaveVWeb = Convert.ToString(dr["ClaveVWeb"]);
            //        u.Nombres = Convert.ToString(dr["Nombres"]);
            //        u.IdMedico = Convert.ToInt32(dr["IdMedico"]);           //KHOYOSI
            //    }
            //}
            //catch (Exception ex)
            //{
            //    u = null;
            //     throw new Exception(ex.Message, ex);
            //}
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return u;
        }



        public List<RolesItems> CargarRolesUsuario (int idUsuario)
        {
            List<RolesItems> lstRol = new List<RolesItems>();
            RolesItems u = null;
            Conexion cx = new Conexion();

            using (SqlConnection conn = cx.obtenerConexion())
            {
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "Web_RolSegunUsuario";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            u = new RolesItems();
                            u.IdListItem = Convert.ToInt32(dr["IdListItem"]);
                            u.IdListGrupo = Convert.ToInt32(dr["IdListGrupo"]);
                            u.Agregar = Convert.ToBoolean(dr["Agregar"]);
                            u.Modificar = Convert.ToBoolean(dr["Modificar"]);
                            u.Eliminar = Convert.ToBoolean(dr["Eliminar"]);
                            u.Consultar = Convert.ToBoolean(dr["Consultar"]);
                            lstRol.Add(u);
                        }
                    }

                    return lstRol;
                }
            }
            //List<RolesItems> lstRol = new List<RolesItems>();
            //RolesItems u = null;
            //SqlCommand cmd = null;
            //SqlDataReader dr = null;
            //try
            //{
            //    cmd = MetodoDatos.CrearComando("Web_RolSegunUsuario");
            //    cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
            //    dr = cmd.ExecuteReader();
            //    while (dr.Read())
            //    {
            //        u = new RolesItems();
            //        u.IdListItem = Convert.ToInt32(dr["IdListItem"]);
            //        u.IdListGrupo = Convert.ToInt32(dr["IdListGrupo"]);
            //        u.Agregar = Convert.ToBoolean(dr["Agregar"]);
            //        u.Modificar = Convert.ToBoolean(dr["Modificar"]);
            //        u.Eliminar = Convert.ToBoolean(dr["Eliminar"]);
            //        u.Consultar = Convert.ToBoolean(dr["Consultar"]);
            //        lstRol.Add(u);
            //    }

            //    return lstRol;

            //}
            //catch (Exception ex)
            //{
            //    lstRol = null;
            //    throw new Exception(ex.Message, ex);
            //}
            //finally
            //{
            //    cmd.Connection.Close();
            //}

        }

        public DataSet DevuelveRolesUsuario(int idUsuario)
        {
            Conexion cx = new Conexion();

            using (SqlConnection conn = cx.obtenerConexion())
            {
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "Web_RolSegunUsuario";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }
            }

            //DataSet ds = new DataSet();
            //SqlCommand cmd = null;
            //try
            //{
            //    cmd = MetodoDatos.CrearComando("Web_RolSegunUsuario");
            //    cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
            //    SqlDataAdapter da = new SqlDataAdapter(cmd);
            //    da.Fill(ds);
            //}
            //catch (Exception ex)
            //{
            //    ds = null; throw ex;
            //}
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return ds;
        }


        public Task<int> CambiarContraseña(String NuevaClave,int IdUsuario)
        {
            int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ActualizarContraseña";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;
                        da.SelectCommand.Parameters.Add("@NuevaClave", SqlDbType.VarChar).Value = (NuevaClave == null ? "" : NuevaClave);
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.VarChar).Value = IdUsuario;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        nRpta = int.Parse(da.SelectCommand.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }

            });

            //int nRpta = 0;
            //SqlCommand cmd = null;
            //try
            //{
            //    cmd = MetodoDatos.CrearComando("ActualizarContraseña");
            //    cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;
            //    cmd.Parameters.AddWithValue("@NuevaClave", NuevaClave);
            //    cmd.Parameters.AddWithValue("@IdUsuario", IdUsuario);
            //    cmd.ExecuteNonQuery();
            //    nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
            //}
            //catch (Exception ex)
            //{
            //    throw new Exception(ex.Message);
            //}
            //finally
            //{
            //    cmd.Connection.Close();
            //}
            //return nRpta;

        }


        public Empleado VerificarAccesoSisgalen(String Usuario, String Clave)
        {
            Empleado u = null;
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_LoginEmpleado");
                cmd.Parameters.AddWithValue("@Usuario", Usuario);
                cmd.Parameters.AddWithValue("@Clave", Clave);
                dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    u = new Empleado();
                    u.IdEmpleado = Convert.ToInt32(dr["IdEmpleado"]);
                    u.IdCondicionTrabajo = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                    u.IdEstablecimientoExterno = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                    u.idSupervisor = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                    u.idTipoDestacado = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                    u.idTipoDocumento = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                    u.IdTipoEmpleado = Convert.ToInt32(dr["IdCondicionTrabajo"]);
                    u.loginEstado = Convert.ToString(dr["IdCondicionTrabajo"]);
                    u.Nombres = Convert.ToString(dr["IdCondicionTrabajo"]);
                    u.ReniecAutorizado = Convert.ToBoolean(dr["IdCondicionTrabajo"]);
                    u.UsuarioClave = Convert.ToString(dr["IdCondicionTrabajo"]);
                    u.esActivo = Convert.ToBoolean(dr["IdCondicionTrabajo"]);
                    u.AccedeVWeb = Convert.ToBoolean(dr["IdCondicionTrabajo"]);
                    u.ApellidoPaterno = Convert.ToString(dr["ApellidoPaterno"]);
                    u.ApellidoMaterno = Convert.ToString(dr["ApellidoMaterno"]);
                    u.ClaveVWeb = Convert.ToString(dr["ClaveVWeb"]);
                    u.Nombres = Convert.ToString(dr["Nombres"]);
                }
            }
            catch (Exception ex)
            {
                u = null;
                throw new Exception(ex.Message, ex);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return u;
        }

        public async Task<RolesItems> DevuelveRolxItem(int IdEmpleado,int IdItemLista)
        {
            RolesItems ritsm = null;
            //SqlCommand cmd = null;
            //SqlDataReader dr = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_listaItemByUsuarioByIdLista", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idEmpleado", IdEmpleado);
                    cmd.Parameters.AddWithValue("@idListaItem", IdItemLista);
                    SqlDataReader sqlDataReader = await cmd.ExecuteReaderAsync();
                   
                    if (sqlDataReader.Read())
                    {
                        ritsm = new RolesItems();
                        ritsm.IdListGrupo = Convert.ToInt16(sqlDataReader["IdListGrupo"]);
                        ritsm.IdListItem = Convert.ToInt32(sqlDataReader["IdListItem"]);
                        ritsm.Agregar = Convert.ToBoolean(sqlDataReader["Agregar"]);
                        ritsm.Consultar = Convert.ToBoolean(sqlDataReader["Consultar"]);
                        ritsm.Modificar = Convert.ToBoolean(sqlDataReader["Modificar"]);
                        ritsm.Eliminar = Convert.ToBoolean(sqlDataReader["Eliminar"]);
                    }
                    await sqlDataReader.ReadAsync();
                    sqlDataReader.Close();
                    conn.Close();
                }
            }
            catch (Exception ex)
            {
                ritsm = null;
                throw new Exception(ex.Message, ex);
            }
           
            return ritsm;

        }


        public Task<DataSet> DevuelveRolHerramientas(int IdEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaItemHerramientasPorUsuario";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.VarChar).Value = IdEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ValidarPermisoReprogMed(int IdEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ValidarPermisoReprogMed";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.VarChar).Value = IdEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ValidarPermisoReprogMedXPac(int IdEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ValidarPermisoReprogMedXPac";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.VarChar).Value = IdEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }



        public Task<DataSet> BuscarEmpleado(string dni, string apPaterno, string apMaterno, string nombres)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BuscarEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@dni", SqlDbType.VarChar).Value = (dni == null ? "" : dni);
                        da.SelectCommand.Parameters.Add("@apPaterno", SqlDbType.VarChar).Value = (apPaterno == null ? "" : apPaterno);
                        da.SelectCommand.Parameters.Add("@apMaterno", SqlDbType.VarChar).Value = (apMaterno == null ? "" : apMaterno);
                        da.SelectCommand.Parameters.Add("@nombres", SqlDbType.VarChar).Value = (nombres == null ? "" : nombres);


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmpleadosSeleccionar(int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EmpleadosSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.VarChar).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmpleadosFiltrar(string filtro, int activo)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosFiltrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@filtro", SqlDbType.VarChar).Value = (filtro == null ? "" : filtro);
                        da.SelectCommand.Parameters.Add("@activo", SqlDbType.VarChar).Value = activo;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaTiposEmpleados()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposEmpleadosListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaTiposCondicionTrabajo()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposCondicionTrabajoListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaTiposDestacados()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposDestacados";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaTiposPuestos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposPuestos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaTiposCargos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposCargosListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaTiposLugarLabora()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosLugarDeTrabajoSeleccionarPorFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ListaColegiosHis()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ColegiosHISseleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmpleadosRolesSeleccionar(int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosRolesSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmpleadosCargosSeleccionar(int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosCargosSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmpleadosLaboraLugarSeleccionar(int idEmpleado)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosLaboraLugarSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmpleadosMedicosEspecialidadesSeleccionar(int idMedico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosMedicosEspecialidadesSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<Boolean> GuardarModificarEmpleado(Empleado empleado, Medico medico, List<UsuariosRoles> lstRoles, List<EmpleadosCargos> lstCargos, List<EmpleadosLugarDeTrabajo> lstLaboraLugar, List<MedicosEspecialidad> lstEspecialidades, int idUsuario)
        {
            bool rpta = false;
            Conexion cx = new Conexion();
            string xmlRoles, xmlCargos, xmllaboraLugar, xmlEspecialidades;
            xmlRoles = XmlUtil.Serializer(typeof(List<UsuariosRoles>), lstRoles);
            xmlCargos = XmlUtil.Serializer(typeof(List<EmpleadosCargos>), lstCargos);
            xmllaboraLugar = XmlUtil.Serializer(typeof(List<EmpleadosLugarDeTrabajo>), lstLaboraLugar);
            xmlEspecialidades = XmlUtil.Serializer(typeof(List<MedicosEspecialidad>), lstEspecialidades);
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = empleado.IdEmpleado;
                        da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = empleado.Nombres;
                        da.SelectCommand.Parameters.Add("@ApellidoPaterno", SqlDbType.VarChar).Value = empleado.ApellidoPaterno;
                        da.SelectCommand.Parameters.Add("@ApellidoMaterno", SqlDbType.VarChar).Value = empleado.ApellidoMaterno;
                        da.SelectCommand.Parameters.Add("@Usuario", SqlDbType.VarChar).Value = empleado.Usuario;
                        da.SelectCommand.Parameters.Add("@Clave", SqlDbType.VarChar).Value = empleado.ClaveVWeb;
                        da.SelectCommand.Parameters.Add("@FechaAlta", SqlDbType.DateTime).Value = null;
                        da.SelectCommand.Parameters.Add("@FechaIngreso", SqlDbType.DateTime).Value = null;
                        da.SelectCommand.Parameters.Add("@CodigoPlanilla", SqlDbType.VarChar).Value = empleado.CodigoPlanilla;
                        da.SelectCommand.Parameters.Add("@DNI", SqlDbType.Char).Value = empleado.DNI;
                        da.SelectCommand.Parameters.Add("@IdTipoEmpleado", SqlDbType.Int).Value = empleado.IdTipoEmpleado;
                        da.SelectCommand.Parameters.Add("@IdCondicionTrabajo", SqlDbType.Int).Value = empleado.IdCondicionTrabajo;
                        da.SelectCommand.Parameters.Add("@IdUsuarioAuditoria", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@LoginEstado", SqlDbType.Int).Value = 0;
                        da.SelectCommand.Parameters.Add("@LoginPC", SqlDbType.VarChar).Value = empleado.loginPC;
                        da.SelectCommand.Parameters.Add("@FechaNacimiento", SqlDbType.DateTime).Value = empleado.FechaNacimiento;
                        da.SelectCommand.Parameters.Add("@idTipoDestacado", SqlDbType.Int).Value = empleado.idTipoDestacado;
                        da.SelectCommand.Parameters.Add("@IdPuesto", SqlDbType.Int).Value = empleado.IdPuesto;
                        da.SelectCommand.Parameters.Add("@IdEstablecimientoExterno", SqlDbType.Int).Value = empleado.IdEstablecimientoExterno;
                        da.SelectCommand.Parameters.Add("@HisCodigoDigitador", SqlDbType.VarChar).Value = empleado.HisCodigoDigitador;
                        da.SelectCommand.Parameters.Add("@ReniecAutorizado", SqlDbType.Bit).Value = empleado.ReniecAutorizado;
                        da.SelectCommand.Parameters.Add("@idTipoDocumento", SqlDbType.Int).Value = empleado.idTipoDocumento;
                        da.SelectCommand.Parameters.Add("@idSupervisor", SqlDbType.Int).Value = empleado.idSupervisor;
                        da.SelectCommand.Parameters.Add("@idTipoSexo", SqlDbType.Int).Value = empleado.IdTipoSexo;
                        da.SelectCommand.Parameters.Add("@EsActivo", SqlDbType.Bit).Value = empleado.esActivo;

                        da.SelectCommand.Parameters.Add("@EsMedico", SqlDbType.Int).Value = medico.esMedico;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = medico.IdMedico;
                        da.SelectCommand.Parameters.Add("@Colegiatura", SqlDbType.VarChar).Value = medico.Colegiatura;
                        da.SelectCommand.Parameters.Add("@LoteHis", SqlDbType.VarChar).Value = medico.LoteHIS;
                        da.SelectCommand.Parameters.Add("@IdColegioHis", SqlDbType.VarChar).Value = medico.idColegioHIS;
                        da.SelectCommand.Parameters.Add("@Rne", SqlDbType.VarChar).Value = medico.rne;
                        da.SelectCommand.Parameters.Add("@Egresado", SqlDbType.Bit).Value = medico.egresado;

                        da.SelectCommand.Parameters.Add("@Roles", SqlDbType.Xml).Value = xmlRoles;
                        da.SelectCommand.Parameters.Add("@Cargos", SqlDbType.Xml).Value = xmlCargos;
                        da.SelectCommand.Parameters.Add("@LaboraLugar", SqlDbType.Xml).Value = xmllaboraLugar;
                        da.SelectCommand.Parameters.Add("@Especialidades", SqlDbType.Xml).Value = xmlEspecialidades;

                        da.SelectCommand.Parameters.Add("@RutaFirma", SqlDbType.VarChar).Value = empleado.FotoFirma;

                        //da.SelectCommand.Parameters.Add("@IdRol", SqlDbType.Int).Value = idRol;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rpta = true;

                        return rpta;
                    }
                }

            });
        }

        public Task<Boolean> EliminarEmpleado(int idEmpleado)
        {
            bool rpta = false;
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmpleadosEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        rpta = true;

                        return rpta;
                    }
                }

            });
        }


        public Task<DataSet> DevuelveSubAreaDondeLaboraElUsuarioDelSistema(int IdLaboraArea, int IdUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DevuelveSubAreaDondeLaboraElUsuarioDelSistema";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idLaboraArea", SqlDbType.Int).Value = IdLaboraArea;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarMedicosTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarMedicosTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

    }
}
