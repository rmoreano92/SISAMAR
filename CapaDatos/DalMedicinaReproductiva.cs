using CapaDatos;
using CapaEntidades;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using DocumentFormat.OpenXml.Presentation;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace WebAppMaternidad.CapaDatos
{
    public class DalMedicinaReproductiva
    {

        public Task<DataSet> ListarOrdenesMedicinaReproductiva(int NroOrden, int NroCuenta, int NroHistoria, string NroDocumento, string ApPaterno, string FechaIngresoIni, string FechaIngresoFin)
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
                            string sql = "web_MedicinaReproductivaListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@NroOrden", SqlDbType.Int).Value = (NroOrden > 0) ? NroOrden : 0;
                            da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = (NroCuenta > 0) ? NroCuenta : 0;
                            da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.Int).Value = (NroHistoria > 0) ? NroHistoria : 0;
                            da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = (NroDocumento == null) ? "" : NroDocumento;
                            da.SelectCommand.Parameters.Add("@ApPaterno", SqlDbType.VarChar).Value = (ApPaterno == null) ? "" : ApPaterno;
                            da.SelectCommand.Parameters.Add("@FechaIngresoIni", SqlDbType.VarChar).Value = (FechaIngresoIni == null) ? "" : FechaIngresoIni;
                            da.SelectCommand.Parameters.Add("@FechaIngresoFin", SqlDbType.VarChar).Value = (FechaIngresoFin == null) ? "" : FechaIngresoFin;

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

        public Task<DataSet> SeleccionarOrdenMedicinaReproductiva(MedicinaReproductiva medrepro)
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
                            string sql = "web_MedicinaReproductivaSeleccionar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = medrepro.IdOrden;
                            da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = medrepro.IdProducto;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = medrepro.IdAtencion;

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

        public Task<Boolean> ModificarResultadoMedicinaReproductiva(MedicinaReproductiva redrep, int IdUsuario)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            bool resp = false;

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_MedicinaReproductivaModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdMedicinaReproductiva", SqlDbType.Int).Value = redrep.IdMedicinaReproductiva;
                            da.SelectCommand.Parameters.Add("@Codigo", SqlDbType.VarChar).Value = redrep.Codigo;
                            da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = redrep.IdOrden;
                            da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = redrep.IdProducto;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = redrep.IdAtencion;
                            da.SelectCommand.Parameters.Add("@NombrePareja", SqlDbType.VarChar).Value = redrep.NombrePareja ?? "";
                            da.SelectCommand.Parameters.Add("@EdadPareja", SqlDbType.Int).Value = redrep.EdadPareja;
                            da.SelectCommand.Parameters.Add("@NombrePaciente", SqlDbType.VarChar).Value = redrep.NombrePaciente ?? "";
                            da.SelectCommand.Parameters.Add("@EdadPaciente", SqlDbType.Int).Value = redrep.EdadPaciente;
                            da.SelectCommand.Parameters.Add("@VihRprPaciente", SqlDbType.VarChar).Value = redrep.VihRprPaciente ?? "";
                            da.SelectCommand.Parameters.Add("@FechaExamen", SqlDbType.VarChar).Value = redrep.FechaExamen ?? "";
                            da.SelectCommand.Parameters.Add("@HoraRecoleccion", SqlDbType.VarChar).Value = redrep.HoraRecoleccion ?? "";
                            da.SelectCommand.Parameters.Add("@HoraEvaluacion", SqlDbType.VarChar).Value = redrep.HoraEvaluacion ?? "";
                            da.SelectCommand.Parameters.Add("@MetodoObtencion", SqlDbType.Int).Value = redrep.MetodoObtencion;
                            da.SelectCommand.Parameters.Add("@OtroMetodoObtencion", SqlDbType.VarChar).Value = redrep.OtroMetodoObtencion;
                            da.SelectCommand.Parameters.Add("@DiasAbstineciaSexual", SqlDbType.Int).Value = redrep.DiasAbstineciaSexual;
                            da.SelectCommand.Parameters.Add("@Dificultad", SqlDbType.VarChar).Value = redrep.Dificultad ?? "";
                            da.SelectCommand.Parameters.Add("@LugarObtencion", SqlDbType.Int).Value = redrep.LugarObtencion;
                            da.SelectCommand.Parameters.Add("@OtroLugarObtencion", SqlDbType.VarChar).Value = redrep.OtroLugarObtencion;
                            da.SelectCommand.Parameters.Add("@IdMedReproMacroscopica", SqlDbType.Int).Value = redrep.IdMedReproMacroscopica;
                            da.SelectCommand.Parameters.Add("@TipoColor", SqlDbType.Int).Value = redrep.TipoColor;
                            da.SelectCommand.Parameters.Add("@TipoOtroColor", SqlDbType.VarChar).Value = redrep.TipoOtroColor;
                            da.SelectCommand.Parameters.Add("@TipoOlor", SqlDbType.Int).Value = redrep.TipoOlor;                            
                            da.SelectCommand.Parameters.Add("@TipoAspecto", SqlDbType.Int).Value = redrep.TipoAspecto;
                            da.SelectCommand.Parameters.Add("@TipoLicuefaccion", SqlDbType.Int).Value = redrep.TipoLicuefaccion;
                            da.SelectCommand.Parameters.Add("@TipoViscocidad", SqlDbType.Int).Value = redrep.TipoViscocidad;
                            da.SelectCommand.Parameters.Add("@Volumen", SqlDbType.Float).Value = redrep.Volumen;
                            da.SelectCommand.Parameters.Add("@PesoUno", SqlDbType.Float).Value = redrep.PesoUno;
                            da.SelectCommand.Parameters.Add("@PesoDos", SqlDbType.Float).Value = redrep.PesoDos;
                            da.SelectCommand.Parameters.Add("@Ph", SqlDbType.VarChar).Value = redrep.Ph;
                            da.SelectCommand.Parameters.Add("@IdMedReproMicroscopica", SqlDbType.Int).Value = redrep.IdMedReproMicroscopica;
                            da.SelectCommand.Parameters.Add("@MovPreProgresionRapida", SqlDbType.Float).Value = redrep.MovPreProgresionRapida;
                            da.SelectCommand.Parameters.Add("@MovPreProgresionLenta", SqlDbType.Float).Value = redrep.MovPreProgresionLenta;
                            da.SelectCommand.Parameters.Add("@MovPreNoProgresiva", SqlDbType.Float).Value = redrep.MovPreNoProgresiva;
                            da.SelectCommand.Parameters.Add("@MovPreProgresiva", SqlDbType.Float).Value = redrep.MovPreProgresiva;
                            da.SelectCommand.Parameters.Add("@MovPreInmoviles", SqlDbType.Float).Value = redrep.MovPreInmoviles;
                            da.SelectCommand.Parameters.Add("@MovPreTotal", SqlDbType.Float).Value = redrep.MovPreTotal;
                            da.SelectCommand.Parameters.Add("@MovPreNumeroNumerador", SqlDbType.Float).Value = redrep.MovPreNumeroNumerador;
                            da.SelectCommand.Parameters.Add("@MovPreNumeroDenominador", SqlDbType.Float).Value = redrep.MovPreNumeroDenominador;
                            da.SelectCommand.Parameters.Add("@MovPreLineas", SqlDbType.Float).Value = redrep.MovPreLineas;
                            da.SelectCommand.Parameters.Add("@MovPreCantidad", SqlDbType.Float).Value = redrep.MovPreCantidad;
                            da.SelectCommand.Parameters.Add("@MovPreCantidadTotal", SqlDbType.Float).Value = redrep.MovPreCantidadTotal;
                            da.SelectCommand.Parameters.Add("@MovPostProgresionRapida", SqlDbType.Float).Value = redrep.MovPostProgresionRapida;
                            da.SelectCommand.Parameters.Add("@MovPostProgresionLenta", SqlDbType.Float).Value = redrep.MovPostProgresionLenta;
                            da.SelectCommand.Parameters.Add("@MovPostNoProgresiva", SqlDbType.Float).Value = redrep.MovPostNoProgresiva;
                            da.SelectCommand.Parameters.Add("@MovPostProgresiva", SqlDbType.Float).Value = redrep.MovPostProgresiva;
                            da.SelectCommand.Parameters.Add("@MovPostInmoviles", SqlDbType.Float).Value = redrep.MovPostInmoviles;
                            da.SelectCommand.Parameters.Add("@MovPostTotal", SqlDbType.Float).Value = redrep.MovPostTotal;
                            da.SelectCommand.Parameters.Add("@MovPostNumeroNumerador", SqlDbType.Float).Value = redrep.MovPostNumeroNumerador;
                            da.SelectCommand.Parameters.Add("@MovPostNumeroDenominador", SqlDbType.Float).Value = redrep.MovPostNumeroDenominador;
                            da.SelectCommand.Parameters.Add("@MovPostLineas", SqlDbType.Float).Value = redrep.MovPostLineas;
                            da.SelectCommand.Parameters.Add("@MovPostCantidad", SqlDbType.Float).Value = redrep.MovPostCantidad;
                            da.SelectCommand.Parameters.Add("@MovPostCantidadTotal", SqlDbType.Float).Value =  redrep.MovPostCantidadTotal;
                            da.SelectCommand.Parameters.Add("@MovPostRem", SqlDbType.Float).Value =  redrep.MovPostRem;
                            da.SelectCommand.Parameters.Add("@MetodoGradienteDensidad", SqlDbType.Int).Value =  redrep.MetodoGradienteDensidad;
                            da.SelectCommand.Parameters.Add("@MetodoSwinUp", SqlDbType.Int).Value =  redrep.MetodoSwinUp;
                            da.SelectCommand.Parameters.Add("@MetodoCompactacion", SqlDbType.Int).Value =  redrep.MetodoCompactacion;
                            da.SelectCommand.Parameters.Add("@VitEspermaVivos", SqlDbType.Float).Value =  redrep.VitEspermaVivos;
                            da.SelectCommand.Parameters.Add("@VitEspermaMuertos", SqlDbType.Float).Value =  redrep.VitEspermaMuertos;
                            da.SelectCommand.Parameters.Add("@VitEspermaTotal", SqlDbType.Float).Value =  redrep.VitEspermaTotal;
                            da.SelectCommand.Parameters.Add("@ConcNumeroNumerador", SqlDbType.Float).Value =  redrep.ConcNumeroNumerador;
                            da.SelectCommand.Parameters.Add("@ConcNumeroDenominador", SqlDbType.Float).Value =  redrep.ConcNumeroDenominador;
                            da.SelectCommand.Parameters.Add("@ConcNumeroTotal", SqlDbType.Float).Value =  redrep.ConcNumeroTotal;
                            da.SelectCommand.Parameters.Add("@ConcCantidad", SqlDbType.Float).Value =  redrep.ConcCantidad;
                            da.SelectCommand.Parameters.Add("@ConcCantidadTotal", SqlDbType.Float).Value =  redrep.ConcCantidadTotal;
                            da.SelectCommand.Parameters.Add("@MorfNormalNumero", SqlDbType.Float).Value =  redrep.MorfNormalNumero;
                            da.SelectCommand.Parameters.Add("@MorfNormalPorcentaje", SqlDbType.Float).Value =  redrep.MorfNormalPorcentaje;
                            da.SelectCommand.Parameters.Add("@MorfAnormalNumero", SqlDbType.Float).Value =  redrep.MorfAnormalNumero;
                            da.SelectCommand.Parameters.Add("@MorfAnormalPorcentaje", SqlDbType.Float).Value = redrep.MorfAnormalPorcentaje;
                            da.SelectCommand.Parameters.Add("@MorfTotal", SqlDbType.Float).Value = redrep.MorfTotal;
                            da.SelectCommand.Parameters.Add("@ExaDirLeucocitos", SqlDbType.Float).Value = redrep.ExaDirLeucocitos;
                            da.SelectCommand.Parameters.Add("@ExaDirLeucocitosTotal", SqlDbType.Float).Value = redrep.ExaDirLeucocitosTotal;
                            da.SelectCommand.Parameters.Add("@ExaDirCelEspInmaduras", SqlDbType.Float).Value = redrep.ExaDirCelEspInmaduras;
                            da.SelectCommand.Parameters.Add("@ExaDirCelEspInmadurasTotal", SqlDbType.Float).Value = redrep.ExaDirCelEspInmadurasTotal;
                            da.SelectCommand.Parameters.Add("@ExaDirCelEspRedondas", SqlDbType.Float).Value = redrep.ExaDirCelEspRedondas;
                            da.SelectCommand.Parameters.Add("@TipoAglutinacion", SqlDbType.Int).Value = redrep.TipoAglutinacion;
                            da.SelectCommand.Parameters.Add("@TipoAgregacion", SqlDbType.Int).Value = redrep.TipoAgregacion;
                            da.SelectCommand.Parameters.Add("@Observacion", SqlDbType.VarChar).Value = redrep.Observacion ?? "";
                            da.SelectCommand.Parameters.Add("@IdProfesionalBiologo", SqlDbType.Int).Value = redrep.IdProfesionalBiologo;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;


                            da.Fill(ds);
                            resp = true;
                            return resp;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<Boolean> EliminarResultadoMedicinaReproductiva(MedicinaReproductiva redrep, int IdUsuario)
        {
            Conexion cx = new Conexion();
            DataSet ds = new DataSet();
            bool resp = false;

            return Task.Run(() =>
            {
                try
                {
                    using (SqlConnection conn = cx.obtenerConexion())
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter())
                        {
                            string sql = "web_MedicinaReproductivaEliminar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdMedicinaReproductiva", SqlDbType.Int).Value = redrep.IdMedicinaReproductiva;
                            da.SelectCommand.Parameters.Add("@IdMedReproMacroscopica", SqlDbType.Int).Value = redrep.IdMedReproMacroscopica;
                            da.SelectCommand.Parameters.Add("@IdMedReproMicroscopica", SqlDbType.Int).Value = redrep.IdMedReproMicroscopica;
                            da.SelectCommand.Parameters.Add("@IdOrden", SqlDbType.Int).Value = redrep.IdOrden;
                            da.SelectCommand.Parameters.Add("@IdProducto", SqlDbType.Int).Value = redrep.IdProducto;
                            da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = redrep.IdAtencion;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;


                            da.Fill(ds);
                            resp = true;
                            return resp;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null; throw new Exception(ex.Message);
                }

            });
        }

        public Task<DataSet> ListarBiologosMedicinaReproductiva()
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
                            string sql = "web_BiologosMedicinaReproductiva";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

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


    }
}
