using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalAtencionOdontologica
    {
        public Task<DataSet> SeleccionarAtencion(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionOdontologicaSeleccionar";
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

        public Task<DataSet> SeleccionarEvaluacion(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionOdontologicaSeleccionar";
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

        public Task<DataSet> SeleccionarHallazgosOdontologicos(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_HallazgosOdontologicosSeleccionar";
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

        public Task<DataSet> SeleccionarHallazgosValoresOdontologicos(int idAtencion, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_HallazgosValoresOdontologicosSeleccionar";
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

        public Task<DataSet> GuardarEvaluacion(AtencionOdontologica objEva, List<HallazgosOdontologicos> dsHallazgos, List<HallazgosValoresOdontologicos> dsValoresHallazgos, int idUsuario)
        {
            Conexion cx = new Conexion();
            string xmlHallazgos, xmlValoresHallazgos;
            xmlHallazgos = XmlUtil.Serializer(typeof(List<HallazgosOdontologicos>), dsHallazgos);
            xmlValoresHallazgos = XmlUtil.Serializer(typeof(List<HallazgosValoresOdontologicos>), dsValoresHallazgos);
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EvaluacionOdontologicaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEva.idAtencion;

                        da.SelectCommand.Parameters.Add("@optPreOcupacional", SqlDbType.Int).Value = objEva.optPreOcupacional;
                        da.SelectCommand.Parameters.Add("@optAnual", SqlDbType.Int).Value = objEva.optAnual;
                        da.SelectCommand.Parameters.Add("@optRetiro", SqlDbType.Int).Value = objEva.optRetiro;
                        da.SelectCommand.Parameters.Add("@optPuestoLaboral", SqlDbType.Int).Value = objEva.optPuestoLaboral;

                        da.SelectCommand.Parameters.Add("@optAlergia", SqlDbType.Int).Value = objEva.optAlergia;
                        da.SelectCommand.Parameters.Add("@dAlergia", SqlDbType.VarChar).Value = objEva.dAlergia;

                        da.SelectCommand.Parameters.Add("@optEnfermedad", SqlDbType.Int).Value = objEva.optEnfermedad;
                        da.SelectCommand.Parameters.Add("@dEnfermedad", SqlDbType.VarChar).Value = objEva.dEnfermedad;

                        da.SelectCommand.Parameters.Add("@optSarro", SqlDbType.Int).Value = objEva.optSarro;
                        da.SelectCommand.Parameters.Add("@optPlacaBacteriana", SqlDbType.Int).Value = objEva.optPlacaBacteriana;

                        da.SelectCommand.Parameters.Add("@dObservaciones", SqlDbType.VarChar).Value = objEva.dObservaciones;

                        da.SelectCommand.Parameters.Add("@dCaries", SqlDbType.VarChar).Value = objEva.dCaries;
                        da.SelectCommand.Parameters.Add("@dPiezasAusentes", SqlDbType.VarChar).Value = objEva.dPiezasAusentes;
                        da.SelectCommand.Parameters.Add("@dRemanenteRadicular", SqlDbType.VarChar).Value = objEva.dRemanenteRadicular;
                        da.SelectCommand.Parameters.Add("@dNecrosisPulpar", SqlDbType.VarChar).Value = objEva.dNecrosisPulpar;
                        da.SelectCommand.Parameters.Add("@dAbcesos", SqlDbType.VarChar).Value = objEva.dAbcesos;

                        da.SelectCommand.Parameters.Add("@dRecomendaciones", SqlDbType.VarChar).Value = objEva.dRecomendaciones;

                        da.SelectCommand.Parameters.Add("@Halazgos", SqlDbType.Xml).Value = xmlHallazgos;
                        da.SelectCommand.Parameters.Add("@HalazgosValores", SqlDbType.Xml).Value = xmlValoresHallazgos;

                        da.SelectCommand.Parameters.Add("@rutaImagen", SqlDbType.Text).Value = objEva.rutaImagen;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> GuardarAtencion(AtencionOdontologica objEva, List<HallazgosOdontologicos> dsHallazgos, List<HallazgosValoresOdontologicos> dsValoresHallazgos, int idUsuario)
        {
            Conexion cx = new Conexion();
            string xmlHallazgos, xmlValoresHallazgos;
            xmlHallazgos = XmlUtil.Serializer(typeof(List<HallazgosOdontologicos>), dsHallazgos);
            xmlValoresHallazgos = XmlUtil.Serializer(typeof(List<HallazgosValoresOdontologicos>), dsValoresHallazgos);
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionOdontologicaGuardar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = objEva.idAtencion;

                        da.SelectCommand.Parameters.Add("@optPreOcupacional", SqlDbType.Int).Value = objEva.optPreOcupacional;
                        da.SelectCommand.Parameters.Add("@optAnual", SqlDbType.Int).Value = objEva.optAnual;
                        da.SelectCommand.Parameters.Add("@optRetiro", SqlDbType.Int).Value = objEva.optRetiro;
                        da.SelectCommand.Parameters.Add("@optPuestoLaboral", SqlDbType.Int).Value = objEva.optPuestoLaboral;

                        da.SelectCommand.Parameters.Add("@optAlergia", SqlDbType.Int).Value = objEva.optAlergia;
                        da.SelectCommand.Parameters.Add("@dAlergia", SqlDbType.VarChar).Value = objEva.dAlergia;

                        da.SelectCommand.Parameters.Add("@optEnfermedad", SqlDbType.Int).Value = objEva.optEnfermedad;
                        da.SelectCommand.Parameters.Add("@dEnfermedad", SqlDbType.VarChar).Value = objEva.dEnfermedad;

                        da.SelectCommand.Parameters.Add("@optSarro", SqlDbType.Int).Value = objEva.optSarro;
                        da.SelectCommand.Parameters.Add("@optPlacaBacteriana", SqlDbType.Int).Value = objEva.optPlacaBacteriana;

                        da.SelectCommand.Parameters.Add("@dObservaciones", SqlDbType.VarChar).Value = objEva.dObservaciones;

                        da.SelectCommand.Parameters.Add("@dCaries", SqlDbType.VarChar).Value = objEva.dCaries;
                        da.SelectCommand.Parameters.Add("@dPiezasAusentes", SqlDbType.VarChar).Value = objEva.dPiezasAusentes;
                        da.SelectCommand.Parameters.Add("@dRemanenteRadicular", SqlDbType.VarChar).Value = objEva.dRemanenteRadicular;
                        da.SelectCommand.Parameters.Add("@dNecrosisPulpar", SqlDbType.VarChar).Value = objEva.dNecrosisPulpar;
                        da.SelectCommand.Parameters.Add("@dAbcesos", SqlDbType.VarChar).Value = objEva.dAbcesos;

                        da.SelectCommand.Parameters.Add("@dRecomendaciones", SqlDbType.VarChar).Value = objEva.dRecomendaciones;

                        da.SelectCommand.Parameters.Add("@Halazgos", SqlDbType.Xml).Value = xmlHallazgos;
                        da.SelectCommand.Parameters.Add("@HalazgosValores", SqlDbType.Xml).Value = xmlValoresHallazgos;

                        da.SelectCommand.Parameters.Add("@rutaImagen", SqlDbType.Text).Value = objEva.rutaImagen;

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
