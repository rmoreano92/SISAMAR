using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
namespace CapaDatos
{
    public class DalParametros
    {
        public DataSet SeleccionaFilaParametro(int lnIdParametro)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("ParametrosSeleccionarPorId");
                cmd.Parameters.AddWithValue("@IdParametro", lnIdParametro);

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> SeleccionaFilaParametro2(int lnIdParametro, int IdIpress = 0) // JDELGADO J1 ASYNC METHOD
        {

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ParametrosSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdParametro", SqlDbType.Int).Value = lnIdParametro;
                        da.SelectCommand.Parameters.Add("@IdIpress", SqlDbType.Int).Value = IdIpress;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }


        public DataSet RetornaFechaServidor()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("RetornaFechaServidorSQL");
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception)
            {

                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> RetornaFechaServidorV2() // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "RetornaFechaServidorSQL";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand = cmd;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> RetornaFechaHoraServidor()
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "RetornaFechaHoraServidorSQL";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand = cmd;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<string> SeleccionaPermisoGeneral(string tipo) // JDELGADO J1 ASYNC METHOD
        {
            //int valor = 0;
            string resp = "0";

            ////COMENTADO POR KHOYOSI
            //if (tipo == "REFCON") { valor = 801; }
            //if (tipo == "FUA")    { valor = 802; }
            //if (tipo == "FIRMA4IDENTITY") { valor = 803; }
            //if (tipo == "CLASI_PAC") { valor = 1006; }

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        //string sql = "ParametrosSeleccionarPorIdV2";
                        string sql = "web_ParametrosSeleccionarPorCodigo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        //da.SelectCommand.Parameters.Add("@IdParametro", SqlDbType.Int).Value = valor;
                        da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        
                        resp = ds.Tables[0].Rows[0]["ValorInt"].ToString();

                        return resp;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionaParametroPorCodigo(string codigo) // JDELGADO J1 ASYNC METHOD
        {
            //int valor = 0;

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ParametrosSeleccionarPorCodigo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@tipo", SqlDbType.VarChar).Value = codigo;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ParametrosSeleccionarPorTipo(string tipo) // JDELGADO J1 ASYNC METHOD
        {            
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ParametrosSeleccionarPorTipo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Tipo", SqlDbType.VarChar).Value = tipo;

                        DataSet ds = new DataSet();
                        da.Fill(ds);                       

                        return ds;
                    }
                }
            });
        }


    }
}
