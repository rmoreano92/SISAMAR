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
    public class DalPuntosCarga
    {
        public DataSet ListaPuntoCarga2()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("ListaPuntoCargaById");

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

        public DataSet FactPuntosCargaSeleccionarTodos()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("FactPuntosCargaSeleccionarTodos");

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

        public DataSet ListaServiciosQueSonPuntosCarga()
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_listaServiciosQueSonPuntosCarga");

                SqlDataAdapter da = new SqlDataAdapter(cmd);

                da.Fill(ds);

            }
            catch (Exception ex)
            {

                ds = null;
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> TipoFinanciamientosDevuelveSoloFarmacia(string Filtro)
        {
            

            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TipoFinanciamientosDevuelveSoloFarmacia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = (Filtro == null) ? "" : Filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> FactPuntosCargaSeleccionarPorFiltro(string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactPuntosCargaSeleccionarPorFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = (Filtro == null) ? "" : Filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

    }
}
