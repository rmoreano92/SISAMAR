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
    public class DalEvaluacionEspecialidades
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

        public Task<DataSet> SeleccionarExamenFisico(int idAtencion, int idServicio, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenEspecialiadesSeleccionar";
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
                        string sql = "web_EvaluacionEspecialidadesModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaEmer.IdAtencion;
                        da.SelectCommand.Parameters.Add("@TipoPaciente", SqlDbType.Int).Value = objEvaEmer.TipoPaciente;
                        da.SelectCommand.Parameters.Add("@Prioridad", SqlDbType.Int).Value = objEvaEmer.Prioridad;
                        da.SelectCommand.Parameters.Add("@Glasgow", SqlDbType.Int).Value = objEvaEmer.Glasgow;
                                                
                        da.SelectCommand.Parameters.Add("@Dolor", SqlDbType.Int).Value = objEvaEmer.Dolor;
                        da.SelectCommand.Parameters.Add("@Convulsiones", SqlDbType.Int).Value = objEvaEmer.Convulsiones;
                        da.SelectCommand.Parameters.Add("@Fiebre", SqlDbType.Int).Value = objEvaEmer.Fiebre;
                        da.SelectCommand.Parameters.Add("@Vomitos", SqlDbType.Int).Value = objEvaEmer.Vomitos;
                        da.SelectCommand.Parameters.Add("@Diarrea", SqlDbType.Int).Value = objEvaEmer.Diarrea;
                        da.SelectCommand.Parameters.Add("@Hemorragia", SqlDbType.Int).Value = objEvaEmer.Hemorragia;

                        da.SelectCommand.Parameters.Add("@DificultadRespiratoria", SqlDbType.Int).Value = objEvaEmer.DificultadRespiratoria;                        
                        da.SelectCommand.Parameters.Add("@DistensionAbdominal", SqlDbType.Int).Value = objEvaEmer.DistensionAbdominal;
                        da.SelectCommand.Parameters.Add("@Cianosis", SqlDbType.Int).Value = objEvaEmer.Cianosis;
                        da.SelectCommand.Parameters.Add("@MalOlorOmbligo", SqlDbType.Int).Value = objEvaEmer.MalOlorOmbligo;
                        da.SelectCommand.Parameters.Add("@Ictericia", SqlDbType.Int).Value = objEvaEmer.Ictericia;
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

                        da.SelectCommand.Parameters.Add("@Apetito", SqlDbType.VarChar).Value = objEvaEmer.Apetito;
                        da.SelectCommand.Parameters.Add("@Orina", SqlDbType.VarChar).Value = objEvaEmer.Orina;
                        da.SelectCommand.Parameters.Add("@Suenio", SqlDbType.VarChar).Value = objEvaEmer.Suenio;
                        da.SelectCommand.Parameters.Add("@Sed", SqlDbType.VarChar).Value = objEvaEmer.Sed;
                        da.SelectCommand.Parameters.Add("@Deposiciones", SqlDbType.VarChar).Value = objEvaEmer.Deposiciones;

                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = objEvaEmer.idServicio;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objEvaEmer.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<DataSet> GuardarExamenFisico(ExamenFisicoEspecialidad objExamen)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenEspecialidadesModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objExamen.IdAtencion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = objExamen.IdServicio;

                        da.SelectCommand.Parameters.Add("@EstadoGeneralSensorio", SqlDbType.Int).Value = objExamen.LEstadoGeneral;
                        da.SelectCommand.Parameters.Add("@DEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExamen.DEstadoGeneral;
                        da.SelectCommand.Parameters.Add("@EEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExamen.DEdemas;
                        da.SelectCommand.Parameters.Add("@AparatoCardioVascular", SqlDbType.Int).Value = objExamen.LAparatoCV;
                        da.SelectCommand.Parameters.Add("@DAparatoCardioVascular", SqlDbType.VarChar).Value = objExamen.DAparatoCV;
                        da.SelectCommand.Parameters.Add("@RAparatoCardioVascular", SqlDbType.VarChar).Value = objExamen.DReflejos;
                        da.SelectCommand.Parameters.Add("@Abdomen", SqlDbType.Int).Value = objExamen.LAbdomen;
                        da.SelectCommand.Parameters.Add("@DAbdomen", SqlDbType.VarChar).Value = objExamen.DAbdomen;
                        da.SelectCommand.Parameters.Add("@Neurologico", SqlDbType.Int).Value = objExamen.LNeurologico;
                        da.SelectCommand.Parameters.Add("@DNeurologico", SqlDbType.VarChar).Value = objExamen.DNeurologico;
                        da.SelectCommand.Parameters.Add("@AparatoRespiratorio", SqlDbType.Int).Value = objExamen.LAparatoR;
                        da.SelectCommand.Parameters.Add("@DAparatoRespiratorio", SqlDbType.VarChar).Value = objExamen.DAparatoR;
                        da.SelectCommand.Parameters.Add("@AparatoUrinario", SqlDbType.Int).Value = objExamen.LAparatoU;
                        da.SelectCommand.Parameters.Add("@DAparatoUrinario", SqlDbType.VarChar).Value = objExamen.DAparatoU;
                        da.SelectCommand.Parameters.Add("@Extremidades", SqlDbType.Int).Value = objExamen.LExtremidades;
                        da.SelectCommand.Parameters.Add("@DExtremidades", SqlDbType.VarChar).Value = objExamen.DExtremidades;                        
                        da.SelectCommand.Parameters.Add("@Piel", SqlDbType.Int).Value = objExamen.LPiel;
                        da.SelectCommand.Parameters.Add("@DPiel", SqlDbType.VarChar).Value = objExamen.DPiel;
                        
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
                        string sql = "web_EvaluacionEspecialidadesInforme";
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
    }
}
