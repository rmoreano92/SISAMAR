using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;

namespace CapaDatos
{
    public class DalEvaluacionEmergencia
    {
        public Task<DataSet> SeleccionarEvaluacion(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarEvaluacionDetalle(int idAtencion, int idServicio, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaDetalleSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarPapeletasDetalle(int idAtencion, int idServicio, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PapeletasAltaMedica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarEvaluacionDetallePorEvaluacion(int idAtencion, int idServicio, int nroEvaluacion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaDetalleSeleccionarPorEvaluacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarExamenGinecoObstetra(int idAtencion, int idServicio, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenGinecoObstetraSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        //da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarEvaluacion(EvaluacionEmergencia objEvaEmer)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaEmer.IdAtencion;
                        da.SelectCommand.Parameters.Add("@TipoPaciente", SqlDbType.Int).Value = objEvaEmer.TipoPaciente;
                        da.SelectCommand.Parameters.Add("@Prioridad", SqlDbType.Int).Value = objEvaEmer.Prioridad;
                        da.SelectCommand.Parameters.Add("@Glasgow", SqlDbType.Int).Value = objEvaEmer.Glasgow;

                        da.SelectCommand.Parameters.Add("@FechaUR", SqlDbType.VarChar).Value = objEvaEmer.FechaUR;
                        da.SelectCommand.Parameters.Add("@FechaEco", SqlDbType.VarChar).Value = objEvaEmer.FechaEco;
                        da.SelectCommand.Parameters.Add("@FechaPP", SqlDbType.VarChar).Value = objEvaEmer.FechaPP;
                        da.SelectCommand.Parameters.Add("@FechaPrimeraEco", SqlDbType.VarChar).Value = objEvaEmer.FechaPrimeraEco;
                        da.SelectCommand.Parameters.Add("@SemPrimeraEco", SqlDbType.Int).Value = objEvaEmer.SemPrimeraEco;
                        da.SelectCommand.Parameters.Add("@DiasPrimeraEco", SqlDbType.Int).Value = objEvaEmer.DiasPrimeraEco;
                        da.SelectCommand.Parameters.Add("@EdadGestacional", SqlDbType.Int).Value = objEvaEmer.EdadGestacional;
                        da.SelectCommand.Parameters.Add("@DiasGestacional", SqlDbType.Int).Value = objEvaEmer.DiasGestacional;
                        da.SelectCommand.Parameters.Add("@Cnp", SqlDbType.Int).Value = objEvaEmer.Cnp;
                        da.SelectCommand.Parameters.Add("@GMotiA", SqlDbType.Int).Value = objEvaEmer.GMotiA;
                        da.SelectCommand.Parameters.Add("@PMotiA", SqlDbType.VarChar).Value = objEvaEmer.PMotiA;
                        da.SelectCommand.Parameters.Add("@Paridad1", SqlDbType.VarChar).Value = objEvaEmer.Paridad1;
                        da.SelectCommand.Parameters.Add("@Paridad2", SqlDbType.VarChar).Value = objEvaEmer.Paridad2;
                        da.SelectCommand.Parameters.Add("@Paridad3", SqlDbType.VarChar).Value = objEvaEmer.Paridad3;
                        da.SelectCommand.Parameters.Add("@Paridad4", SqlDbType.VarChar).Value = objEvaEmer.Paridad4;

                        da.SelectCommand.Parameters.Add("@Dolor", SqlDbType.Int).Value = objEvaEmer.Dolor;
                        da.SelectCommand.Parameters.Add("@Convulsiones", SqlDbType.Int).Value = objEvaEmer.Convulsiones;
                        da.SelectCommand.Parameters.Add("@Fiebre", SqlDbType.Int).Value = objEvaEmer.Fiebre;
                        da.SelectCommand.Parameters.Add("@Vomitos", SqlDbType.Int).Value = objEvaEmer.Vomitos;
                        da.SelectCommand.Parameters.Add("@ContraccionesU", SqlDbType.Int).Value = objEvaEmer.ContraccionesU;
                        da.SelectCommand.Parameters.Add("@SangradoV", SqlDbType.Int).Value = objEvaEmer.SangradoV;
                        da.SelectCommand.Parameters.Add("@PerdidaLA", SqlDbType.Int).Value = objEvaEmer.PerdidaLA;
                        da.SelectCommand.Parameters.Add("@AusenciaMF", SqlDbType.Int).Value = objEvaEmer.AusenciaMF;
                        da.SelectCommand.Parameters.Add("@SintomasU", SqlDbType.Int).Value = objEvaEmer.SintomasU;
                        da.SelectCommand.Parameters.Add("@FlujoV", SqlDbType.Int).Value = objEvaEmer.FlujoV;
                        da.SelectCommand.Parameters.Add("@Tumoracion", SqlDbType.Int).Value = objEvaEmer.Tumoracion;
                        da.SelectCommand.Parameters.Add("@AlteracionesM", SqlDbType.Int).Value = objEvaEmer.AlteracionesM;
                        da.SelectCommand.Parameters.Add("@DisMovFetales", SqlDbType.Int).Value = objEvaEmer.DisMovFetales;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = objEvaEmer.Otros;

                        da.SelectCommand.Parameters.Add("@Antecedentes", SqlDbType.Text).Value = objEvaEmer.Antecedentes;
                        da.SelectCommand.Parameters.Add("@EnfermedadA", SqlDbType.Text).Value = objEvaEmer.EnfermedadA;
                        da.SelectCommand.Parameters.Add("@PesoFetalAnt", SqlDbType.VarChar).Value = objEvaEmer.PesoFetalAnt;

                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = objEvaEmer.idServicio;

                        da.SelectCommand.Parameters.Add("@RiesgoCaida", SqlDbType.Int).Value = objEvaEmer.RiesgoCaida;                        

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objEvaEmer.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<DataSet> GuardarExamenGinecoObstetra(ExamenGinecoObstetra objExamen)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenGinecoObstetraModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objExamen.IdAtencion;
                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = objExamen.idServicio;

                        da.SelectCommand.Parameters.Add("@EstadoGeneralSensorio", SqlDbType.Int).Value = objExamen.LEstadoGeneral;
                        da.SelectCommand.Parameters.Add("@DEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExamen.DEstadoGeneral;
                        da.SelectCommand.Parameters.Add("@EEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExamen.DEdemas;
                        da.SelectCommand.Parameters.Add("@AparatoCardioVascular", SqlDbType.Int).Value = objExamen.LAparatoCV;
                        da.SelectCommand.Parameters.Add("@DAparatoCardioVascular", SqlDbType.VarChar).Value = objExamen.DAparatoCV;
                        da.SelectCommand.Parameters.Add("@RAparatoCardioVascular", SqlDbType.VarChar).Value = objExamen.DReflejos;
                        da.SelectCommand.Parameters.Add("@Abdomen", SqlDbType.Int).Value = objExamen.LAbdomen;
                        da.SelectCommand.Parameters.Add("@DAbdomen", SqlDbType.VarChar).Value = objExamen.DAbdomen;
                        da.SelectCommand.Parameters.Add("@AparatoRespiratorio", SqlDbType.Int).Value = objExamen.LAparatoR;
                        da.SelectCommand.Parameters.Add("@DAparatoRespiratorio", SqlDbType.VarChar).Value = objExamen.DAparatoR;
                        da.SelectCommand.Parameters.Add("@AparatoUrinario", SqlDbType.Int).Value = objExamen.LAparatoU;
                        da.SelectCommand.Parameters.Add("@DAparatoUrinario", SqlDbType.VarChar).Value = objExamen.DAparatoU;
                        da.SelectCommand.Parameters.Add("@Extremidades", SqlDbType.Int).Value = objExamen.LExtremidades;
                        da.SelectCommand.Parameters.Add("@DExtremidades", SqlDbType.VarChar).Value = objExamen.DExtremidades;
                        da.SelectCommand.Parameters.Add("@Neurologico", SqlDbType.Int).Value = objExamen.LNeurologico;
                        da.SelectCommand.Parameters.Add("@DNeurologico", SqlDbType.VarChar).Value = objExamen.DNeurologico;
                        da.SelectCommand.Parameters.Add("@Piel", SqlDbType.Int).Value = objExamen.LPiel;
                        da.SelectCommand.Parameters.Add("@DPiel", SqlDbType.VarChar).Value = objExamen.DPiel;

                        da.SelectCommand.Parameters.Add("@GeBus", SqlDbType.Int).Value = objExamen.LGeBus;
                        da.SelectCommand.Parameters.Add("@DGeBus", SqlDbType.VarChar).Value = objExamen.DGeBus;
                        da.SelectCommand.Parameters.Add("@Vagina", SqlDbType.Int).Value = objExamen.LVagina;
                        da.SelectCommand.Parameters.Add("@DVagina", SqlDbType.VarChar).Value = objExamen.DVagina;
                        da.SelectCommand.Parameters.Add("@Cervix", SqlDbType.Int).Value = objExamen.LCervix;
                        da.SelectCommand.Parameters.Add("@DCervix", SqlDbType.VarChar).Value = objExamen.DCervix;
                        da.SelectCommand.Parameters.Add("@Utero", SqlDbType.Int).Value = objExamen.LUtero;
                        da.SelectCommand.Parameters.Add("@DUtero", SqlDbType.VarChar).Value = objExamen.DUtero;
                        da.SelectCommand.Parameters.Add("@Anexos", SqlDbType.Int).Value = objExamen.LAnexos;
                        da.SelectCommand.Parameters.Add("@DAnexos", SqlDbType.VarChar).Value = objExamen.DAnexos;
                        da.SelectCommand.Parameters.Add("@FsDouglas", SqlDbType.Int).Value = objExamen.LDouglas;
                        da.SelectCommand.Parameters.Add("@DFsDouglas", SqlDbType.VarChar).Value = objExamen.DDouglas;
                        da.SelectCommand.Parameters.Add("@Parametros", SqlDbType.Int).Value = objExamen.LParametros;
                        da.SelectCommand.Parameters.Add("@DParametros", SqlDbType.VarChar).Value = objExamen.DParametros;
                        da.SelectCommand.Parameters.Add("@Mamas", SqlDbType.Int).Value = objExamen.LMamas;
                        da.SelectCommand.Parameters.Add("@DMamas", SqlDbType.VarChar).Value = objExamen.DMamas;
                        da.SelectCommand.Parameters.Add("@ObservacionGinecologicaEspeculoscopia", SqlDbType.Text).Value = objExamen.ObservacionGinecologica;

                        da.SelectCommand.Parameters.Add("@AlturaUterina", SqlDbType.Int).Value = objExamen.LUA;
                        da.SelectCommand.Parameters.Add("@Lcf", SqlDbType.Int).Value = objExamen.LLCF;
                        da.SelectCommand.Parameters.Add("@Du", SqlDbType.Int).Value = objExamen.LDU;

                        da.SelectCommand.Parameters.Add("@Dips", SqlDbType.Int).Value = objExamen.LDips;
                        da.SelectCommand.Parameters.Add("@Soplos", SqlDbType.Int).Value = objExamen.LSoplos;
                        da.SelectCommand.Parameters.Add("@Hidromios", SqlDbType.Int).Value = objExamen.LHidraminios;
                        da.SelectCommand.Parameters.Add("@Ponderado", SqlDbType.Int).Value = objExamen.LPonderado;
                        da.SelectCommand.Parameters.Add("@PonderadoClinico", SqlDbType.Int).Value = objExamen.LPonderadoClinico;
                        da.SelectCommand.Parameters.Add("@PonderadoEcografo", SqlDbType.Int).Value = objExamen.LPonderadoEcografo;

                        da.SelectCommand.Parameters.Add("@TipoEmbarazo", SqlDbType.Int).Value = objExamen.LTipoEmbarazo;
                        da.SelectCommand.Parameters.Add("@Situacion", SqlDbType.Int).Value = objExamen.LSituacion;
                        da.SelectCommand.Parameters.Add("@Posicion", SqlDbType.Int).Value = objExamen.LPosicion;
                        da.SelectCommand.Parameters.Add("@Presentacion", SqlDbType.Int).Value = objExamen.LPresentacion;
                        da.SelectCommand.Parameters.Add("@MovFetales", SqlDbType.VarChar).Value = objExamen.MovFetales;
                        da.SelectCommand.Parameters.Add("@ObservacionesObstetricas", SqlDbType.Text).Value = objExamen.DObservacionesObstetricas;
                        da.SelectCommand.Parameters.Add("@DF1Spp", SqlDbType.VarChar).Value = objExamen.DF1Spp;
                        da.SelectCommand.Parameters.Add("@DF2Spp", SqlDbType.VarChar).Value = objExamen.DF2Spp;
                        da.SelectCommand.Parameters.Add("@DF3Spp", SqlDbType.VarChar).Value = objExamen.DF3Spp;
                        da.SelectCommand.Parameters.Add("@LF1Lcf", SqlDbType.Int).Value = objExamen.LF1Lcf == null ? 0 : objExamen.LF1Lcf;
                        da.SelectCommand.Parameters.Add("@LF2Lcf", SqlDbType.Int).Value = objExamen.LF2Lcf == null ? 0 : objExamen.LF2Lcf;
                        da.SelectCommand.Parameters.Add("@LF3Lcf", SqlDbType.Int).Value = objExamen.LF3Lcf == null ? 0 : objExamen.LF3Lcf;
                        da.SelectCommand.Parameters.Add("@DF1Mf", SqlDbType.VarChar).Value = objExamen.MFF01;
                        da.SelectCommand.Parameters.Add("@DF2Mf", SqlDbType.VarChar).Value = objExamen.MFF02;
                        da.SelectCommand.Parameters.Add("@DF3Mf", SqlDbType.VarChar).Value = objExamen.MFF03;

                        da.SelectCommand.Parameters.Add("@TactoVaginal", SqlDbType.Int).Value = objExamen.LTipoTactoVaginal;
                        da.SelectCommand.Parameters.Add("@Dilatacion", SqlDbType.Int).Value = objExamen.LDilatacion;
                        da.SelectCommand.Parameters.Add("@Incorporacion", SqlDbType.Int).Value = objExamen.LIncorporacion;
                        da.SelectCommand.Parameters.Add("@AltPresen", SqlDbType.VarChar).Value = objExamen.LAlPresent;
                        da.SelectCommand.Parameters.Add("@VarPresen", SqlDbType.VarChar).Value = objExamen.DVarPresent;
                        da.SelectCommand.Parameters.Add("@MembranaRota", SqlDbType.Int).Value = objExamen.MembranasRotas;
                        da.SelectCommand.Parameters.Add("@Procubito", SqlDbType.Int).Value = objExamen.LProcubito;
                        da.SelectCommand.Parameters.Add("@Prolapso", SqlDbType.Int).Value = objExamen.LProlapso;
                        da.SelectCommand.Parameters.Add("@SangradoVaginal", SqlDbType.VarChar).Value = objExamen.DSangradoV;
                        da.SelectCommand.Parameters.Add("@PelvSuperior", SqlDbType.Int).Value = objExamen.LPelvimetriaSup;
                        da.SelectCommand.Parameters.Add("@PelvMedio", SqlDbType.Int).Value = objExamen.LPelvimetriaMed;
                        da.SelectCommand.Parameters.Add("@PelvInf", SqlDbType.Int).Value = objExamen.LPelvimetriaInf;
                        da.SelectCommand.Parameters.Add("@PelvGinecoide", SqlDbType.Int).Value = objExamen.LPelvisGinecoide;
                        da.SelectCommand.Parameters.Add("@PelvisGinecoideDescripcion", SqlDbType.VarChar).Value = objExamen.PelvisGineDesc;
                        da.SelectCommand.Parameters.Add("@LiquidoAmniotico", SqlDbType.Int).Value = objExamen.LLiquidoA;
                        da.SelectCommand.Parameters.Add("@MalOlor", SqlDbType.Int).Value = objExamen.MalOlor;
                        da.SelectCommand.Parameters.Add("@CompFetoPelvica", SqlDbType.Int).Value = objExamen.LCompatibilidadF;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objExamen.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarEvaluacionDetalle(EvaluacionEmergenciaDetalle objEvaEmer)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaDetalleModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaEmer.IdAtencion;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = objEvaEmer.IdNumero;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = objEvaEmer.idservicio;

                        da.SelectCommand.Parameters.Add("@ImpresionDiagnostica", SqlDbType.Text).Value = objEvaEmer.Indicaciones;
                        da.SelectCommand.Parameters.Add("@Tratamiento", SqlDbType.Text).Value = objEvaEmer.Seguimiento;
                        da.SelectCommand.Parameters.Add("@PlanTrabajo", SqlDbType.Text).Value = objEvaEmer.PlandeTrabajo;
                        da.SelectCommand.Parameters.Add("@FechaInicioAtencion", SqlDbType.VarChar).Value = objEvaEmer.fecha.ToString("dd/MM/yyyy");
                        da.SelectCommand.Parameters.Add("@HoraInicioAtencion", SqlDbType.Char).Value = objEvaEmer.HoraInicioAtencion;

                        da.SelectCommand.Parameters.Add("@InformarFamiliar", SqlDbType.Int).Value = objEvaEmer.InformarFamiliar;
                        da.SelectCommand.Parameters.Add("@InformacionFamiliar", SqlDbType.Text).Value = objEvaEmer.InformacionFamiliar;

                        da.SelectCommand.Parameters.Add("@RiesgoFuga", SqlDbType.Int).Value = objEvaEmer.RiesgoFuga;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objEvaEmer.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }


        public Task<DataSet> SeleccionarInformeEvaluacionEmergencia(int idAtencion, int idServicio, int eval, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaInforme";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = eval;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
        /*RMOREANO PAPELETA DE EGRESO*/

        public Task<DataSet> ListaAtencionByIdCuentaAtencion(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionEmergenciaInforme";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> PapeletaEgreso(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PapeletaEgresoEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> FormatoConsentimientoProcQxEmergencia(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FormatoConsentimientoProcQxEmergencia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> PapeletaDescansoMedico(int idCuentaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_DescansoMedico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroCuenta", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> AutorizacionExamenPersonalizado(int idCuentaAtencion, int idAtencion, int idServicio, int eval)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AutorizacionExamenPersonalizado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


    }
}
