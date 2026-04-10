using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using DocumentFormat.OpenXml.Spreadsheet;
using MathNet.Numerics.LinearAlgebra;
using WebAppMaternidad.CapaEntidades;
using static System.Net.WebRequestMethods;

namespace CapaDatos
{
    public class DalEvaluacionNeonatalHosp
    {

        ////////////////////////EVALUACION NEONATAL////////////////////////////////////////
        public Task<DataSet> SeleccionarEvaluacionNeonatal(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalHospSeleccionar";
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

        public Task<DataSet> GuardarEvaluacion(EvaluacionNeonatalHosp objEvaNeo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalHospModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = (object)objEvaNeo.IdAtencion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RelatoCronologico", SqlDbType.VarChar).Value = (object)objEvaNeo.RelatoCronologico ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FactorRiesgo", SqlDbType.VarChar).Value = (object)objEvaNeo.FactorRiesgo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EdadPadreRn", SqlDbType.Int).Value = (object)objEvaNeo.EdadPadreRn ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PesoMadre", SqlDbType.VarChar).Value = (object)objEvaNeo.PesoMadre ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TallaMadre", SqlDbType.VarChar).Value = (object)objEvaNeo.TallaMadre ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GrupoSanguineo", SqlDbType.VarChar).Value = (object)objEvaNeo.GrupoSanguineo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaResultadoGrupoSanguineo", SqlDbType.VarChar).Value = (object)objEvaNeo.FechaResultadoGrupoSanguineo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Hemoglobina", SqlDbType.VarChar).Value = (object)objEvaNeo.Hemoglobina ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaResultadoHemoglobina", SqlDbType.VarChar).Value = (object)objEvaNeo.FechaResultadoHemoglobina ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FactoRH", SqlDbType.VarChar).Value = (object)objEvaNeo.FactoRH ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaResultadoFactorRH", SqlDbType.VarChar).Value = (object)objEvaNeo.FechaResultadoFactorRH ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Hematocrito", SqlDbType.VarChar).Value = (object)objEvaNeo.Hematocrito ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaResultadoHematocrito", SqlDbType.VarChar).Value = (object)objEvaNeo.FechaResultadoHematocrito ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Vdrl", SqlDbType.VarChar).Value = (object)objEvaNeo.Vdrl ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Coombs", SqlDbType.VarChar).Value = (object)objEvaNeo.Coombs ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HIV", SqlDbType.VarChar).Value = (object)objEvaNeo.HIV ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HepatitisB", SqlDbType.VarChar).Value = (object)objEvaNeo.HepatitisB ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Covid19", SqlDbType.VarChar).Value = (object)objEvaNeo.Covid19 ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ComentariosExamenesAuxiliares", SqlDbType.Text).Value = (object)objEvaNeo.ComentariosExamenesAuxiliares ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EcografiaExamenesAuxiliares", SqlDbType.Text).Value = (object)objEvaNeo.EcografiaExamenesAuxiliares ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaInicioLaborParto", SqlDbType.VarChar).Value = (object)objEvaNeo.FechaInicioLaborParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HoraInicioLaborParto", SqlDbType.VarChar).Value = (object)objEvaNeo.HoraInicioLaborParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PrimerPeriodo", SqlDbType.VarChar).Value = (object)objEvaNeo.PrimerPeriodo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@SegundoPeriodo", SqlDbType.VarChar).Value = (object)objEvaNeo.SegundoPeriodo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoInicioLaborParto", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoInicioLaborParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoPresentacionFetal", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoPresentacionFetal ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoDetalleParto", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoDetalleParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoDetalleCesarea", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoDetalleCesarea ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoSufrimientoFetal", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoSufrimientoFetal ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoTrabajoParto", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoTrabajoParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoAnestesiaAplicada", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoAnestesiaAplicada ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoLiquidoAmniotico", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoLiquidoAmniotico ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoCordonUmbilical", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoCordonUmbilical ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoPlacenta", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoPlacenta ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoMedicamento", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoMedicamento ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@OtrosMedicamentos", SqlDbType.VarChar).Value = (object)objEvaNeo.OtrosMedicamentos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoLugarParto", SqlDbType.Int).Value = (object)objEvaNeo.IdTipoLugarParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RupturaMembranaMinutos", SqlDbType.VarChar).Value = (object)objEvaNeo.RupturaMembranaMinutos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RupturaMembranaHoras", SqlDbType.VarChar).Value = (object)objEvaNeo.RupturaMembranaHoras ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@RupturaMembranaDias", SqlDbType.VarChar).Value = (object)objEvaNeo.RupturaMembranaDias ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ObservacionesLaborParto", SqlDbType.Text).Value = (object)objEvaNeo.ObservacionesLaborParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }




        ////////////////////////EVALUACION DETALLE NEONATAL////////////////////////////////////////
        public Task<DataSet> SeleccionarEvaluacionDetalleNeonatal(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionDetalleNeonatalHospSeleccionar";
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
                        string sql = "web_EvaluacionDetalleNeonatalHospSeleccionarPorEvaluacion";
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

        public Task<DataSet> GuardarEvaluacionDetalle(EvaluacionNeonatalHospDetalle objEvaNeo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalDetalleHospModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEvaNeo.IdAtencion;
                        da.SelectCommand.Parameters.Add("@NroEvaluacion", SqlDbType.Int).Value = objEvaNeo.NroEvaluacion;
                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = objEvaNeo.idservicio;

                        da.SelectCommand.Parameters.Add("@ImpresionDiagnostica", SqlDbType.Text).Value = objEvaNeo.Seguimiento;
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



        /////////////////////////////SINTOMAS///////////////////////////////////////////////////////
        public Task<DataSet> SeleccionarSintomasNeonatal(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesSintomasNeonatalListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarSintomasNeonatal(AtencionesSintomas objSintoNeo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionesSintomasNeonatalModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencionSintoma", SqlDbType.Int).Value = objSintoNeo.IdAtencionSintoma;
                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objSintoNeo.IdAtencion;
                        da.SelectCommand.Parameters.Add("@NinoSano", SqlDbType.Int).Value = objSintoNeo.NinoSano;
                        da.SelectCommand.Parameters.Add("@Prematuridad", SqlDbType.Int).Value = objSintoNeo.Prematuridad;
                        da.SelectCommand.Parameters.Add("@Sdr", SqlDbType.Int).Value = objSintoNeo.Sdr;
                        da.SelectCommand.Parameters.Add("@Apnea", SqlDbType.Int).Value = objSintoNeo.Apnea;
                        da.SelectCommand.Parameters.Add("@Bpn", SqlDbType.Int).Value = objSintoNeo.Bpn;
                        da.SelectCommand.Parameters.Add("@AsfixiaSevera", SqlDbType.Int).Value = objSintoNeo.AsfixiaSevera;
                        da.SelectCommand.Parameters.Add("@Shock", SqlDbType.Int).Value = objSintoNeo.Shock;
                        da.SelectCommand.Parameters.Add("@Mbpn", SqlDbType.Int).Value = objSintoNeo.Mbpn;
                        da.SelectCommand.Parameters.Add("@Embpn", SqlDbType.Int).Value = objSintoNeo.Embpn;
                        da.SelectCommand.Parameters.Add("@Sepsis", SqlDbType.Int).Value = objSintoNeo.Sepsis;
                        da.SelectCommand.Parameters.Add("@Rciu", SqlDbType.Int).Value = objSintoNeo.Rciu;
                        da.SelectCommand.Parameters.Add("@Convulsion", SqlDbType.Int).Value = objSintoNeo.Convulsion;
                        da.SelectCommand.Parameters.Add("@TraumaObstetrico", SqlDbType.Int).Value = objSintoNeo.TraumaObstetrico;
                        da.SelectCommand.Parameters.Add("@MalfomacionCongenita", SqlDbType.Int).Value = objSintoNeo.MalfomacionCongenita;

                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = objSintoNeo.Otros;
                        da.SelectCommand.Parameters.Add("@DOtros", SqlDbType.Text).Value = objSintoNeo.DOtros;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }



        ////////////////////////ANTECEDENTES FAMILIARES////////////////////////////////////////




        #region RIESGOS PERINATALES
        //////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> RiesgosPerinatalesSeleccionar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RiesgosPerinatalesSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        
        public Task<DataSet> GuardarRiesgosPerinatales(RiesgosPerinatales riesgo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RiesgosPerinatalesModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = riesgo.IdAtencion;
                        da.SelectCommand.Parameters.Add("@Peso4000Gramos", SqlDbType.Int).Value = riesgo.Peso4000Gramos;
                        da.SelectCommand.Parameters.Add("@Peso2500Gramos", SqlDbType.Int).Value = riesgo.Peso2500Gramos;
                        da.SelectCommand.Parameters.Add("@PreTerminos", SqlDbType.Int).Value = riesgo.PreTerminos;
                        da.SelectCommand.Parameters.Add("@PostTerminos", SqlDbType.Int).Value = riesgo.PostTerminos;
                        da.SelectCommand.Parameters.Add("@Natimuerto", SqlDbType.Int).Value = riesgo.Natimuerto;
                        da.SelectCommand.Parameters.Add("@MuerteNeonatal", SqlDbType.Int).Value = riesgo.MuerteNeonatal;
                        da.SelectCommand.Parameters.Add("@Distocidos", SqlDbType.Int).Value = riesgo.Distocidos;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = riesgo.Otros;
                        da.SelectCommand.Parameters.Add("@Peso4000GramosDescripcion", SqlDbType.VarChar).Value = riesgo.Peso4000GramosDescripcion;
                        da.SelectCommand.Parameters.Add("@Peso2500GramosDescripcion", SqlDbType.VarChar).Value = riesgo.Peso2500GramosDescripcion;
                        da.SelectCommand.Parameters.Add("@PreTerminosDescripcion", SqlDbType.VarChar).Value = riesgo.PreTerminosDescripcion;
                        da.SelectCommand.Parameters.Add("@PostTerminosDescripcion", SqlDbType.VarChar).Value = riesgo.PostTerminosDescripcion;
                        da.SelectCommand.Parameters.Add("@NatimuertoDescripcion", SqlDbType.VarChar).Value = riesgo.NatimuertoDescripcion;
                        da.SelectCommand.Parameters.Add("@MuerteNeonatalDescripcion", SqlDbType.VarChar).Value = riesgo.MuerteNeonatalDescripcion;
                        da.SelectCommand.Parameters.Add("@DistocidosDescripcion", SqlDbType.VarChar).Value = riesgo.DistocidosDescripcion;
                        da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.VarChar).Value = riesgo.OtrosDescripcion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////
        #endregion



        #region INFECCIONES MATERNAS
        ///////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> InfeccionesMaternasSeleccionar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InfeccionesMaternasSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarInfeccionesMaternas(InfeccionMaterna infeccion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_InfeccionesMaternasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = infeccion.IdAtencion;
                        da.SelectCommand.Parameters.Add("@TbcActiva", SqlDbType.Int).Value = infeccion.TbcActiva;
                        da.SelectCommand.Parameters.Add("@Lues", SqlDbType.Int).Value = infeccion.Lues;
                        da.SelectCommand.Parameters.Add("@Torch", SqlDbType.Int).Value = infeccion.Torch;
                        da.SelectCommand.Parameters.Add("@ItuIIITrim", SqlDbType.Int).Value = infeccion.ItuIIITrim;
                        da.SelectCommand.Parameters.Add("@Urocultivo", SqlDbType.Int).Value = infeccion.Urocultivo;
                        da.SelectCommand.Parameters.Add("@Germen", SqlDbType.Int).Value = infeccion.Germen;
                        da.SelectCommand.Parameters.Add("@Covid", SqlDbType.Int).Value = infeccion.Covid;
                        da.SelectCommand.Parameters.Add("@Dengue", SqlDbType.Int).Value = infeccion.Dengue;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = infeccion.OtrosInfecciones;
                        da.SelectCommand.Parameters.Add("@TbcActivaDescripcion", SqlDbType.VarChar).Value = infeccion.TbcActivaDescripcion;
                        da.SelectCommand.Parameters.Add("@LuesDescripcion", SqlDbType.VarChar).Value = infeccion.LuesDescripcion;
                        da.SelectCommand.Parameters.Add("@TorchDescripcion", SqlDbType.VarChar).Value = infeccion.TorchDescripcion;
                        da.SelectCommand.Parameters.Add("@ItuIIITrimDescripcion", SqlDbType.VarChar).Value = infeccion.ItuIIITrimDescripcion;
                        da.SelectCommand.Parameters.Add("@UrocultivoDescripcion", SqlDbType.VarChar).Value = infeccion.UrocultivoDescripcion;
                        da.SelectCommand.Parameters.Add("@GermenDescripcion", SqlDbType.VarChar).Value = infeccion.GermenDescripcion;
                        da.SelectCommand.Parameters.Add("@CovidDescripcion", SqlDbType.VarChar).Value = infeccion.CovidDescripcion;
                        da.SelectCommand.Parameters.Add("@DengueDescripcion", SqlDbType.VarChar).Value = infeccion.DengueDescripcion;
                        da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.VarChar).Value = infeccion.OtrosInfeccionesDescripcion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        #endregion


        #region ENFERMEDADES MATERNAS
        ///////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> EnfermedadesMaternasSeleccionar(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EnfermedadesMaternasSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarEnfermedadesMaternas(EnfermedadMaterna enfermedad, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EnfermedadesMaternasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = enfermedad.IdAtencion;
                        da.SelectCommand.Parameters.Add("@PreEclampsia", SqlDbType.Int).Value = enfermedad.PreEclampsia;
                        da.SelectCommand.Parameters.Add("@Eclampsia", SqlDbType.Int).Value = enfermedad.Eclampsia;
                        da.SelectCommand.Parameters.Add("@Htt", SqlDbType.Int).Value = enfermedad.Htt;
                        da.SelectCommand.Parameters.Add("@Desnutricion", SqlDbType.Int).Value = enfermedad.Desnutricion;
                        da.SelectCommand.Parameters.Add("@DiabetesMellitus", SqlDbType.Int).Value = enfermedad.DiabetesMellitus;
                        da.SelectCommand.Parameters.Add("@HepatitisB", SqlDbType.Int).Value = enfermedad.HepatitisB;
                        da.SelectCommand.Parameters.Add("@Anemia", SqlDbType.Int).Value = enfermedad.Anemia;
                        da.SelectCommand.Parameters.Add("@HipoHipertiroides", SqlDbType.Int).Value = enfermedad.HipoHipertiroides;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.Int).Value = enfermedad.OtrosEnfermedades;
                        da.SelectCommand.Parameters.Add("@PreEclampsiaDescripcion", SqlDbType.VarChar).Value = enfermedad.PreEclampsiaDescripcion;
                        da.SelectCommand.Parameters.Add("@EclampsiaDescripcion", SqlDbType.VarChar).Value = enfermedad.EclampsiaDescripcion;
                        da.SelectCommand.Parameters.Add("@HttDescripcion", SqlDbType.VarChar).Value = enfermedad.HttDescripcion;
                        da.SelectCommand.Parameters.Add("@DesnutricionDescripcion", SqlDbType.VarChar).Value = enfermedad.DesnutricionDescripcion;
                        da.SelectCommand.Parameters.Add("@DiabetesMellitusDescripcion", SqlDbType.VarChar).Value = enfermedad.DiabetesMellitusDescripcion;
                        da.SelectCommand.Parameters.Add("@HepatitisBDescripcion", SqlDbType.VarChar).Value = enfermedad.HepatitisBDescripcion;
                        da.SelectCommand.Parameters.Add("@AnemiaDescripcion", SqlDbType.VarChar).Value = enfermedad.AnemiaDescripcion;
                        da.SelectCommand.Parameters.Add("@HipoHipertiroidesDescripcion", SqlDbType.VarChar).Value = enfermedad.HipoHipertiroidesDescripcion;
                        da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.VarChar).Value = enfermedad.OtrosEnfermedadesDescripcion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        #endregion


        #region DATOS DE NACIMIENTO Y DATOS DE PARTO
        ///////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> RegistroNacimientoEnHospitalEnExternoSeleccionar(int idPaciente, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroNacimientoEnHospitalEnExternoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> GuardarRegistroNacimientoExterno(RecienNacido rn, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_RegistroNacimientoExternoModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                
                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = (object)rn.idPaciente ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = (object)rn.idCuentaAtencion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Embarazo", SqlDbType.Char).Value = (object)rn.Embarazo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PatologiaGestacion", SqlDbType.Text).Value = (object)rn.PatologiaGestacion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroEmbarazo", SqlDbType.Int).Value = (object)rn.NroEmbarazo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AtencionPrenatal", SqlDbType.Bit).Value = (object)rn.AtencionPrenatal ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroApn", SqlDbType.Int).Value = (object)rn.NroApn ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@LugarApn", SqlDbType.VarChar, 200).Value = (object)rn.LugarApn ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Gesta", SqlDbType.VarChar, 10).Value = (object)rn.Gesta ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad", SqlDbType.VarChar, 10).Value = (object)rn.Paridad ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad1", SqlDbType.Char, 2).Value = (object)rn.Paridad1 ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad2", SqlDbType.Char, 2).Value = (object)rn.Paridad2 ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad3", SqlDbType.Char, 2).Value = (object)rn.Paridad3 ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad4", SqlDbType.Char, 2).Value = (object)rn.Paridad4 ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AtendidoPor", SqlDbType.Char).Value = (object)rn.AtendidoPor ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@idMedico", SqlDbType.Int).Value = (object)rn.idMedico ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ResponsableAtencion", SqlDbType.VarChar, 200).Value = (object)rn.medicoResponsable ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@idTipoParto", SqlDbType.Int).Value = (object)rn.idTipoParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Parto", SqlDbType.Bit).Value = (object)rn.Parto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ComplicacionParto", SqlDbType.Text).Value = (object)rn.ComplicacionParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PosicionParto", SqlDbType.Char).Value = (object)rn.PosicionParto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ConAcompaniante", SqlDbType.Bit).Value = (object)rn.ConAcompaniante ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@ConAnalgesia", SqlDbType.Bit).Value = (object)rn.ConAnaglgesia ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TrasladoConjunto", SqlDbType.Bit).Value = rn.TrasladoConjunto;
                        da.SelectCommand.Parameters.Add("@EdadMadre", SqlDbType.Int).Value = (object)rn.EdadMadre ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@FechaNacimiento", SqlDbType.DateTime).Value = (object)rn.FechaNacimiento ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@HoraNacimiento", SqlDbType.VarChar, 5).Value = (object)rn.HoraNacimiento ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoSexo", SqlDbType.Int).Value = (object)rn.IdTipoSexo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTipoGestacion", SqlDbType.Int).Value = (object)rn.IdTipoGestacion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Fetos", SqlDbType.Int).Value = (object)rn.Fetos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NroGemelar", SqlDbType.Int).Value = (object)rn.NroGemelar ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@idCondicion", SqlDbType.Int).Value = (object)rn.idCondicion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Obito", SqlDbType.VarChar, 5).Value = (object)rn.Obito ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Peso", SqlDbType.VarChar, 10).Value = (object)rn.Peso ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Talla", SqlDbType.VarChar, 10).Value = (object)rn.Talla ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PerimetroCefalico", SqlDbType.VarChar, 10).Value = (object)rn.PerimetroCefalico ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PerimetroToracico", SqlDbType.VarChar, 10).Value = (object)rn.PerimetroToracico ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EdadGes", SqlDbType.Int).Value = (object)rn.EdadGes ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdTiempoClampaje", SqlDbType.Int).Value = (object)rn.IdTiempoClampaje ?? DBNull.Value;                        
                        da.SelectCommand.Parameters.Add("@ClampadoTardio", SqlDbType.Bit).Value = (object)rn.ClampadoTardio ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PielaPiel", SqlDbType.Int).Value = (object)rn.PielaPiel ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Lactancia1raHora", SqlDbType.Bit).Value = (object)rn.Lactancia1raHora ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdServicioNacimiento", SqlDbType.Int).Value = (object)rn.IdServicioNacimiento ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdOtraProcedencia", SqlDbType.Int).Value = (object)rn.IdOtraProcedencia ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@TiempoHospitalizacion", SqlDbType.Int).Value = (object)rn.TiempoHospitalizacion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Inmediato", SqlDbType.Bit).Value = (object)rn.Inmediato ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Reanimacion", SqlDbType.Bit).Value = (object)rn.Reanimacion ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@AlMinuto", SqlDbType.VarChar, 10).Value = (object)rn.AlMinuto ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Alos5Minutos", SqlDbType.VarChar, 10).Value = (object)rn.Alos5Minutos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Alos10Minutos", SqlDbType.VarChar, 10).Value = (object)rn.Alos10Minutos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Alos15Minutos", SqlDbType.VarChar, 10).Value = (object)rn.Alos15Minutos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Alos20Minutos", SqlDbType.VarChar, 10).Value = (object)rn.Alos20Minutos ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@PatologiaNeonatal", SqlDbType.Bit).Value = (object)rn.PatologiaNeonatal ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Especificar", SqlDbType.VarChar, 100).Value = (object)rn.Especificar ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@idRiesgo", SqlDbType.Int).Value = (object)rn.idRiesgo ?? DBNull.Value;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        #endregion



        #region DATOS LABOR PARTO
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> TiposInicioLaborPartoSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposInicioLaborPartoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposPresentacionFetalSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposPresentacionFetalSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposDetallePartoSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposDetallePartoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposDetalleCesareaSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposDetalleCesareaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposSufrimientoFetalSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposSufrimientoFetalSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposTrabajoPartoSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposTrabajoPartoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposAnestesiaAplicadaSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposAnestesiaAplicadaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposLiquidoAmnioticoSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposLiquidoAmnioticoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposCordonUmbilicalSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposCordonUmbilicalSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposPlacentaSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposPlacentaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposMedicamentosSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposMedicamentosSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> TiposLugarPartoSeleccionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TiposLugarPartoSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        #endregion


        #region EXAMEN FISICO
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
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

                        //da.SelectCommand.Parameters.Add("@Ojos", SqlDbType.Int).Value = objExaNeo.Ojos;             //KHOYOSI 230625
                        //da.SelectCommand.Parameters.Add("@DOjos", SqlDbType.VarChar).Value = objExaNeo.DOjos;       //KHOYOSI 230625

                        da.SelectCommand.Parameters.Add("@ReflejoRojo", SqlDbType.Int).Value = objExaNeo.ReflejoRojo;             //KHOYOSI 240625
                        da.SelectCommand.Parameters.Add("@DReflejoRojo", SqlDbType.VarChar).Value = objExaNeo.DReflejoRojo;       //KHOYOSI 240625

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

                        da.SelectCommand.Parameters.Add("@Relato", SqlDbType.VarChar).Value = objExaNeo.Relato;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }




        ///////////////////////////////////////INFORME EVALAUCION NEONATAL////////////////////////////////////////////////////////////////
        public Task<DataSet> SeleccionarInformeEvaluacionNeonatal(int idAtencion, int idServicio, int eval, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionNeonatalHospInforme";
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

        #endregion










        
        

        //public Task<DataSet> SeleccionarRnAntecedentesPerinatales(int idPaciente)
        //{
        //    Conexion cx = new Conexion();
        //    return Task.Run(() =>
        //    {

        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                string sql = "web_SeleccionarAntecedentesPerinatalesRecienNacido";
        //                da.SelectCommand = new SqlCommand(sql, conn);
        //                da.SelectCommand.CommandType = CommandType.StoredProcedure;

        //                da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

        //                DataSet ds = new DataSet();
        //                da.Fill(ds);

        //                return ds;
        //            }
        //        }

        //    });

        //}

        //public Task<DataSet> SeleccionarRnAntecedentesNacimiento(int idPaciente)
        //{
        //    Conexion cx = new Conexion();
        //    return Task.Run(() =>
        //    {
        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                string sql = "web_SeleccionarAntecedentesNacimientoRecienNacido";
        //                da.SelectCommand = new SqlCommand(sql, conn);
        //                da.SelectCommand.CommandType = CommandType.StoredProcedure;

        //                da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;

        //                DataSet ds = new DataSet();
        //                da.Fill(ds);

        //                return ds;
        //            }
        //        }
        //    });
        //}

        //public Task<Boolean> GuardarRnAntecedentesPerinatales(NinioAltoRiesgoAntecPerinatales objninioAltoRiesgoAntecPerinatales)
        //{
        //    return Task.Run(() =>
        //    {
        //        DataSet ds = new DataSet();
        //        bool nRpta;
        //        Conexion cx = new Conexion();

        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                try
        //                {
        //                    string sql = "web_ModificarEmergenciaRnAntecedentesPerinatales";
        //                    da.SelectCommand = new SqlCommand(sql, conn);
        //                    da.SelectCommand.CommandType = CommandType.StoredProcedure;


        //                    da.SelectCommand.Parameters.Add("@tipoEmbarazo", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.tipoEmbarazo;
        //                    da.SelectCommand.Parameters.Add("@patologias", SqlDbType.Text).Value = objninioAltoRiesgoAntecPerinatales.patologias;
        //                    da.SelectCommand.Parameters.Add("@nroEmbarazo", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.nroEmbarazo;
        //                    da.SelectCommand.Parameters.Add("@atencionPrenatal", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.atencionPrenatal;
        //                    da.SelectCommand.Parameters.Add("@nroApn", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.nroApn;
        //                    da.SelectCommand.Parameters.Add("@lugarApn", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.lugarApn;
        //                    da.SelectCommand.Parameters.Add("@tipoParto", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.tipoParto;
        //                    da.SelectCommand.Parameters.Add("@complicacionParto", SqlDbType.Text).Value = objninioAltoRiesgoAntecPerinatales.complicacionParto;
        //                    da.SelectCommand.Parameters.Add("@lugarParto", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.lugarParto;
        //                    da.SelectCommand.Parameters.Add("@atendidoPor", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.atendidoPor;
        //                    da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.idAtencion;
        //                    //da.SelectCommand.Parameters.Add("@fechaRegistro", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.fechaRegistro;
        //                    //da.SelectCommand.Parameters.Add("@fechaUpdate", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.fechaUpdate;
        //                    da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.usuarioRegistro;
        //                    da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.usuarioUpdate;
        //                    da.SelectCommand.Parameters.Add("@atendidoPorotro", SqlDbType.VarChar).Value = objninioAltoRiesgoAntecPerinatales.atendidoPorotro;
        //                    da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoAntecPerinatales.idPaciente;

        //                    da.Fill(ds);

        //                    nRpta = true;

        //                }
        //                catch (Exception ex)
        //                {
        //                    nRpta = false;
        //                    throw new Exception(ex.Message);
        //                }

        //                return nRpta;
        //            }
        //        }
        //    });
        //}


        //public Task<Boolean> GuardarRnAntecedentesNacimiento(NinioAltoRiesgoNacimiento objninioAltoRiesgoNacimiento)
        //{
        //    DataSet ds = new DataSet();
        //    bool nRpta;
        //    Conexion cx = new Conexion();

        //    return Task.Run(() =>
        //    {
        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                try
        //                {
        //                    string sql = "web_ModificarEmergenciaRnAntecedentesNacimiento";
        //                    da.SelectCommand = new SqlCommand(sql, conn);
        //                    da.SelectCommand.CommandType = CommandType.StoredProcedure;


        //                    da.SelectCommand.Parameters.Add("@estaGestacionalAlNacer", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.estaGestacionalAlNacer;
        //                    da.SelectCommand.Parameters.Add("@pesoAlNacer", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.pesoAlNacer;
        //                    da.SelectCommand.Parameters.Add("@perimetroCefalico", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.perimetroCefalico;
        //                    da.SelectCommand.Parameters.Add("@perimetroToracico", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.perimetroToracico;
        //                    da.SelectCommand.Parameters.Add("@inmedito", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.inmedito;
        //                    da.SelectCommand.Parameters.Add("@apgar1min", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.apgar1min;
        //                    da.SelectCommand.Parameters.Add("@apgar5min", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.apgar5min;
        //                    da.SelectCommand.Parameters.Add("@reanimacion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.reanimacion;
        //                    da.SelectCommand.Parameters.Add("@patologiaNeonatal", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.patologiaNeonatal;
        //                    da.SelectCommand.Parameters.Add("@patologiaNeonatalDescripcion", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.patologiaNeonatalDescripcion;
        //                    da.SelectCommand.Parameters.Add("@hospitalizacion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.hospitalizacion;
        //                    da.SelectCommand.Parameters.Add("@tiempoHospitalizado", SqlDbType.VarChar).Value = objninioAltoRiesgoNacimiento.tiempoHospitalizado;
        //                    da.SelectCommand.Parameters.Add("@idAtencion", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idAtencion;
        //                    //cmd.Parameters.AddWithValue("@fechaRegistro", objninioAltoRiesgoNacimiento.fechaRegistro);
        //                    //cmd.Parameters.AddWithValue("@fechaUpdate", objninioAltoRiesgoNacimiento.fechaUpdate);
        //                    da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.usuarioRegistro;
        //                    da.SelectCommand.Parameters.Add("@usuarioUpdate", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.usuarioRegistro;
        //                    da.SelectCommand.Parameters.Add("@tallaAlNacer", SqlDbType.Decimal).Value = objninioAltoRiesgoNacimiento.tallaAlNacer;
        //                    da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = objninioAltoRiesgoNacimiento.idPaciente;

        //                    da.Fill(ds);

        //                    nRpta = true;

        //                }
        //                catch (Exception ex)
        //                {
        //                    nRpta = false;
        //                    throw new Exception(ex.Message);
        //                }

        //                return nRpta;
        //            }
        //        }
        //    });

        //}
    }
}
