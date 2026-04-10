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
    public class DalEvaluacionNeonatal
    {
        public Task<DataSet> SeleccionarEvaluacionNeonatal(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalSeleccionar";
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

        public Task<DataSet> SeleccionarEvaluacionDetalleNeonatal(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionDetalleNeonatalSeleccionarV2";
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

        public Task<DataSet> SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(int idAtencion, int nroEvaluacion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionDetalleNeonatalSeleccionarPorEvaluacionV2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = nroEvaluacion;
                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarExamenFisicoNeonatal(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenFisicoNeonatalSeleccionar";
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


        public Task<DataSet> SeleccionarInformeEvaluacionNeonatal(int idAtencion, int idServicio, int eval, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalInforme";
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


        public Task<DataSet> GuardarEvaluacion(EvaluacionNeonatal objEvaNeo, int Prioridad, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaNeo.IdAtencion;
                        da.SelectCommand.Parameters.Add("@Prioridad", SqlDbType.Int).Value = Prioridad;
                        da.SelectCommand.Parameters.Add("@Glasgow", SqlDbType.Int).Value = objEvaNeo.Glasgow;
                        da.SelectCommand.Parameters.Add("@TiempoEnfermedad", SqlDbType.VarChar).Value = objEvaNeo.TiempoEnfermedad;
                        da.SelectCommand.Parameters.Add("@InicioEnfermedad", SqlDbType.VarChar).Value = objEvaNeo.InicioEnfermedad;
                        da.SelectCommand.Parameters.Add("@CursoEnfermedad", SqlDbType.VarChar).Value = objEvaNeo.CursoEnfermedad;

                        da.SelectCommand.Parameters.Add("@DificultadRespiratoria", SqlDbType.Int).Value = objEvaNeo.DificultadRespiratoria;
                        da.SelectCommand.Parameters.Add("@Diarrea", SqlDbType.Int).Value = objEvaNeo.Diarrea;
                        da.SelectCommand.Parameters.Add("@DistensionAbdominal", SqlDbType.Int).Value = objEvaNeo.DistensionAbdominal;
                        da.SelectCommand.Parameters.Add("@Cianosis", SqlDbType.Int).Value = objEvaNeo.Cianosis;
                        da.SelectCommand.Parameters.Add("@MalOlorOmbligo", SqlDbType.Int).Value = objEvaNeo.MalOlorOmbligo;
                        da.SelectCommand.Parameters.Add("@Ictericia", SqlDbType.Int).Value = objEvaNeo.Ictericia;
                        da.SelectCommand.Parameters.Add("@Dolor", SqlDbType.Int).Value = objEvaNeo.Dolor;
                        da.SelectCommand.Parameters.Add("@Convulsiones", SqlDbType.Int).Value = objEvaNeo.Convulsiones;
                        da.SelectCommand.Parameters.Add("@Fiebre", SqlDbType.Int).Value = objEvaNeo.Fiebre;
                        da.SelectCommand.Parameters.Add("@Vomitos", SqlDbType.Int).Value = objEvaNeo.Vomitos;
                        da.SelectCommand.Parameters.Add("@Hemorragia", SqlDbType.Int).Value = objEvaNeo.Hemorragia;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = objEvaNeo.Otros;
                        da.SelectCommand.Parameters.Add("@OtrosSintomas", SqlDbType.VarChar).Value = objEvaNeo.OtrosSintomas;

                        da.SelectCommand.Parameters.Add("@Relato", SqlDbType.Text).Value = objEvaNeo.Relato;
                        da.SelectCommand.Parameters.Add("@AtecedentesGenerales", SqlDbType.Text).Value = objEvaNeo.AtecedentesGenerales;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarEvaluacionDetalle(EvaluacionNeonatalDetalle objEvaNeo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalDetalleModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaNeo.IdAtencion;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = objEvaNeo.NroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = objEvaNeo.idservicio;

                        da.SelectCommand.Parameters.Add("@ImpresionDiagnostica", SqlDbType.Text).Value = objEvaNeo.ImpresionDiagnostica;
                        da.SelectCommand.Parameters.Add("@Tratamiento", SqlDbType.Text).Value = objEvaNeo.Tratamiento;
                        da.SelectCommand.Parameters.Add("@PlanTrabajo", SqlDbType.Text).Value = objEvaNeo.PlanTrabajo;
                        da.SelectCommand.Parameters.Add("@FechaInicioAtencion", SqlDbType.VarChar).Value = objEvaNeo.FechaInicioAtencion;
                        da.SelectCommand.Parameters.Add("@HoraInicioAtencion", SqlDbType.Char).Value = objEvaNeo.HoraInicioAtencion;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> GuardarExamenNeonatal(ExamenFisicoNeonatal objExaNeo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ExamenNeonatalModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objExaNeo.IdAtencion;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = objExaNeo.NroEvaluacion;

                        da.SelectCommand.Parameters.Add("@EstadoGeneralSensorio", SqlDbType.Int).Value = objExaNeo.EstadoGeneralSensorio;
                        da.SelectCommand.Parameters.Add("@DEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExaNeo.DEstadoGeneralSensorio;
                        da.SelectCommand.Parameters.Add("@EEstadoGeneralSensorio", SqlDbType.VarChar).Value = objExaNeo.EEstadoGeneralSensorio;

                        da.SelectCommand.Parameters.Add("@Piel", SqlDbType.Int).Value = objExaNeo.Piel;
                        da.SelectCommand.Parameters.Add("@DPiel", SqlDbType.VarChar).Value = objExaNeo.DPiel;

                        da.SelectCommand.Parameters.Add("@Craneo", SqlDbType.Int).Value = objExaNeo.Craneo;
                        da.SelectCommand.Parameters.Add("@DCraneo", SqlDbType.VarChar).Value = objExaNeo.DCraneo;

                        da.SelectCommand.Parameters.Add("@PabellonAuricular", SqlDbType.Int).Value = objExaNeo.PabellonAuricular;
                        da.SelectCommand.Parameters.Add("@DPabellonAuricular", SqlDbType.VarChar).Value = objExaNeo.DPabellonAuricular;

                        da.SelectCommand.Parameters.Add("@Cara", SqlDbType.Int).Value = objExaNeo.Cara;
                        da.SelectCommand.Parameters.Add("@DCara", SqlDbType.VarChar).Value = objExaNeo.DCara;

                        da.SelectCommand.Parameters.Add("@BocaORL", SqlDbType.Int).Value = objExaNeo.BocaORL;
                        da.SelectCommand.Parameters.Add("@DBocaORL", SqlDbType.VarChar).Value = objExaNeo.DBocaORL;

                        da.SelectCommand.Parameters.Add("@Cuello", SqlDbType.Int).Value = objExaNeo.Cuello;
                        da.SelectCommand.Parameters.Add("@DCuello", SqlDbType.VarChar).Value = objExaNeo.DCuello;

                        da.SelectCommand.Parameters.Add("@Clavicula", SqlDbType.Int).Value = objExaNeo.Clavicula;
                        da.SelectCommand.Parameters.Add("@DClavicula", SqlDbType.VarChar).Value = objExaNeo.DClavicula;

                        da.SelectCommand.Parameters.Add("@ToraxSilv", SqlDbType.Int).Value = objExaNeo.ToraxSilv;
                        da.SelectCommand.Parameters.Add("@DToraxSilv", SqlDbType.VarChar).Value = objExaNeo.DToraxSilv;

                        da.SelectCommand.Parameters.Add("@AparatoCardioVascular", SqlDbType.Int).Value = objExaNeo.AparatoCardioVascular;
                        da.SelectCommand.Parameters.Add("@DAparatoCardioVascular", SqlDbType.VarChar).Value = objExaNeo.DAparatoCardioVascular;
                        da.SelectCommand.Parameters.Add("@RAparatoCardioVascular", SqlDbType.VarChar).Value = objExaNeo.RAparatoCardioVascular;

                        da.SelectCommand.Parameters.Add("@Abdomen", SqlDbType.Int).Value = objExaNeo.Abdomen;
                        da.SelectCommand.Parameters.Add("@DAbdomen", SqlDbType.VarChar).Value = objExaNeo.DAbdomen;

                        da.SelectCommand.Parameters.Add("@Ombligo", SqlDbType.Int).Value = objExaNeo.Ombligo;
                        da.SelectCommand.Parameters.Add("@DOmbligo", SqlDbType.VarChar).Value = objExaNeo.DOmbligo;

                        da.SelectCommand.Parameters.Add("@Ano", SqlDbType.Int).Value = objExaNeo.Ano;
                        da.SelectCommand.Parameters.Add("@DAno", SqlDbType.VarChar).Value = objExaNeo.DAno;

                        da.SelectCommand.Parameters.Add("@Genitales", SqlDbType.Int).Value = objExaNeo.Genitales;
                        da.SelectCommand.Parameters.Add("@DGenitales", SqlDbType.VarChar).Value = objExaNeo.DGenitales;

                        da.SelectCommand.Parameters.Add("@ExtSuperiores", SqlDbType.Int).Value = objExaNeo.ExtSuperiores;
                        da.SelectCommand.Parameters.Add("@DExtSuperiores", SqlDbType.VarChar).Value = objExaNeo.DExtSuperiores;

                        da.SelectCommand.Parameters.Add("@ExtInferiores", SqlDbType.Int).Value = objExaNeo.ExtInferiores;
                        da.SelectCommand.Parameters.Add("@DExtInferiores", SqlDbType.VarChar).Value = objExaNeo.DExtInferiores;

                        da.SelectCommand.Parameters.Add("@Columna", SqlDbType.Int).Value = objExaNeo.Columna;
                        da.SelectCommand.Parameters.Add("@DColumna", SqlDbType.VarChar).Value = objExaNeo.DColumna;

                        da.SelectCommand.Parameters.Add("@SistemaNervioso", SqlDbType.Int).Value = objExaNeo.SistemaNervioso;
                        da.SelectCommand.Parameters.Add("@DSistemaNervioso", SqlDbType.VarChar).Value = objExaNeo.DSistemaNervioso;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> SeleccionarRnAntecedentesPerinatales(int idPaciente)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarAntecedentesPerinatalesRecienNacido";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> SeleccionarRnAntecedentesNacimiento(int idPaciente)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarAntecedentesNacimientoRecienNacido";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<Boolean> GuardarRnAntecedentesPerinatales(NinioAltoRiesgoAntecPerinatales objninioAltoRiesgoAntecPerinatales)
        {
            return Task.Run(() =>
            {
                DataSet ds = new DataSet();
                bool nRpta;
                Conexion cx = new Conexion();

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ModificarEmergenciaRnAntecedentesPerinatales";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;


                            da.SelectCommand.Parameters.Add("@tipoEmbarazo", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.tipoEmbarazo;
                            da.SelectCommand.Parameters.Add("@patologias", SqlDbType.Text).Value = objninioAltoRiesgoAntecPerinatales.patologias;
                            da.SelectCommand.Parameters.Add("@nroEmbarazo", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.nroEmbarazo;
                            da.SelectCommand.Parameters.Add("@atencionPrenatal", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.atencionPrenatal;
                            da.SelectCommand.Parameters.Add("@nroApn", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.nroApn;
                            da.SelectCommand.Parameters.Add("@lugarApn", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.lugarApn;
                            da.SelectCommand.Parameters.Add("@tipoParto", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.tipoParto;
                            da.SelectCommand.Parameters.Add("@complicacionParto", SqlDbType.Text).Value =  objninioAltoRiesgoAntecPerinatales.complicacionParto;
                            da.SelectCommand.Parameters.Add("@lugarParto", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.lugarParto;
                            da.SelectCommand.Parameters.Add("@atendidoPor", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.atendidoPor;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.idAtencion;
                            //da.SelectCommand.Parameters.Add("@fechaRegistro", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.fechaRegistro;
                            //da.SelectCommand.Parameters.Add("@fechaUpdate", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.fechaUpdate;
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.usuarioUpdate;
                            da.SelectCommand.Parameters.Add("@atendidoPorotro", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.atendidoPorotro;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.idPaciente;
                                                        
                            da.Fill(ds);

                            nRpta = true;

                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }


        public Task<Boolean> GuardarRnAntecedentesNacimiento(NinioAltoRiesgoNacimiento objninioAltoRiesgoNacimiento)
        {
            DataSet ds = new DataSet();
            bool nRpta;
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ModificarEmergenciaRnAntecedentesNacimiento";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;


                            da.SelectCommand.Parameters.Add("@estaGestacionalAlNacer", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.estaGestacionalAlNacer;
                            da.SelectCommand.Parameters.Add("@pesoAlNacer", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.pesoAlNacer;
                            da.SelectCommand.Parameters.Add("@perimetroCefalico", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.perimetroCefalico;
                            da.SelectCommand.Parameters.Add("@perimetroToracico", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.perimetroToracico;
                            da.SelectCommand.Parameters.Add("@inmedito", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.inmedito;
                            da.SelectCommand.Parameters.Add("@apgar1min", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.apgar1min;
                            da.SelectCommand.Parameters.Add("@apgar5min", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.apgar5min;
                            da.SelectCommand.Parameters.Add("@reanimacion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.reanimacion;
                            da.SelectCommand.Parameters.Add("@patologiaNeonatal", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.patologiaNeonatal;
                            da.SelectCommand.Parameters.Add("@patologiaNeonatalDescripcion", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.patologiaNeonatalDescripcion;
                            da.SelectCommand.Parameters.Add("@hospitalizacion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.hospitalizacion;
                            da.SelectCommand.Parameters.Add("@tiempoHospitalizado", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.tiempoHospitalizado;
                            da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idAtencion;
                            //cmd.Parameters.AddWithValue("@fechaRegistro", objninioAltoRiesgoNacimiento.fechaRegistro);
                            //cmd.Parameters.AddWithValue("@fechaUpdate", objninioAltoRiesgoNacimiento.fechaUpdate);
                            da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.usuarioRegistro;
                            da.SelectCommand.Parameters.Add("@tallaAlNacer", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.tallaAlNacer;
                            da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idPaciente;

                            da.Fill(ds);

                            nRpta = true;

                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });

        }

    }
}
