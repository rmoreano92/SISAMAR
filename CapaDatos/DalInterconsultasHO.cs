using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public  class DalInterconsultasHO
    {
        public Task<int> CreateUpdateAtencionDetalleInterconsulta(AtencionDetalleInterconsulta atencionDetalleInterconsulta) // JDELGADO001.2
        {
            Conexion cx = new Conexion();
            int nRpta = 0;

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_createUpdateAtencionDetalleInterconsulta";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@idAtencionInterconsulta", atencionDetalleInterconsulta.idAtencionInterconsulta);
                        cmd.Parameters.AddWithValue("@idReceta", atencionDetalleInterconsulta.idReceta);
                        cmd.Parameters.AddWithValue("@idCuentaAtencion", atencionDetalleInterconsulta.idCuentaAtencion);
                        cmd.Parameters.AddWithValue("@TriajePresion", atencionDetalleInterconsulta.TriajePresion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@TriajeFrecuenciaCardiaca", atencionDetalleInterconsulta.TriajeFrecuenciaCardiaca ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@TriajeTemperatura", atencionDetalleInterconsulta.TriajeTemperatura ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@TriajePeso", atencionDetalleInterconsulta.TriajePeso ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@TriajeTalla", atencionDetalleInterconsulta.TriajeTalla ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@TriajeSaturacionOxigeno", atencionDetalleInterconsulta.TriajeSaturacionOxigeno ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@TriajePC", atencionDetalleInterconsulta.TriajePC ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdClasificacionPaciente", atencionDetalleInterconsulta.IdClasificacionPaciente ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@NroControles", atencionDetalleInterconsulta.NroControles ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@EdadGestacional", atencionDetalleInterconsulta.EdadGestacional ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@NroGestas", atencionDetalleInterconsulta.NroGestas ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@motivoInterconsulta", atencionDetalleInterconsulta.motivoInterconsulta ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@apetito", atencionDetalleInterconsulta.apetito ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@orina", atencionDetalleInterconsulta.orina ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@suenio", atencionDetalleInterconsulta.suenio ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@sed", atencionDetalleInterconsulta.sed ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@deposiciones", atencionDetalleInterconsulta.deposiciones ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@antecedQuirurgico", atencionDetalleInterconsulta.antecedQuirurgico ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@antecedAlergico", atencionDetalleInterconsulta.antecedAlergico ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@antecedPatologico", atencionDetalleInterconsulta.antecedPatologico ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@antecedentes", atencionDetalleInterconsulta.antecedentes ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@antecedObstetrico", atencionDetalleInterconsulta.antecedObstetrico ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@antecedFamiliar", atencionDetalleInterconsulta.antecedFamiliar ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@examenClinico", atencionDetalleInterconsulta.examenClinico ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@resumenHistoriaClinica", atencionDetalleInterconsulta.resumenHistoriaClinica ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@hIniAtencion", atencionDetalleInterconsulta.hIniAtencion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idProducto", atencionDetalleInterconsulta.idProducto);

                        cmd.Parameters.AddWithValue("@idTipoDestino", atencionDetalleInterconsulta.idTipoDestino ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idTipoTeleconsulta", atencionDetalleInterconsulta.idTipoTeleconsulta ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idEstablecimientoReferencia", atencionDetalleInterconsulta.idEstablecimientoReferencia ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@otrasObservaciones", atencionDetalleInterconsulta.otrasObservaciones ?? Convert.DBNull);

                        cmd.Parameters.AddWithValue("@PlanTrabajo", atencionDetalleInterconsulta.PlanTrabajo ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Tratamiento", atencionDetalleInterconsulta.Tratamiento ?? Convert.DBNull);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<DataSet> ListaAtencionDetalleInterconsultaByIdCuentaAtencion(int idCuentaAtencion, int idReceta, int idProducto)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaAtencionDetalleInterconsultaByIdCuentaAtencion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = idReceta;
                        da.SelectCommand.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
    }
}
