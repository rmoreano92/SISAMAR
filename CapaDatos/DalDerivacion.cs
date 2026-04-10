using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using System;

namespace WebAppMaternidad.CapaDatos
{
    public class DalDerivacion
    {
        public async Task<DataSet> DerivacionAgregar(Derivacion derivacion) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("usp_DerivacionAgregar", conn))        
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@idDerivacion", derivacion.idDerivacion);
                da.SelectCommand.Parameters.AddWithValue("@nroDocumento", derivacion.nroDocumento);
                da.SelectCommand.Parameters.AddWithValue("@nombresCompletos", derivacion.nombresCompletos);
                da.SelectCommand.Parameters.AddWithValue("@observaciones", derivacion.observaciones);
                da.SelectCommand.Parameters.AddWithValue("@idConsultorio", derivacion.idConsultorio);
                da.SelectCommand.Parameters.AddWithValue("@idUsuario", derivacion.idUsuario);
                da.SelectCommand.Parameters.AddWithValue("@perdidaLiquido", derivacion.perdidaLiquido);
                da.SelectCommand.Parameters.AddWithValue("@movimientosFetales", derivacion.movimientosFetales);
                da.SelectCommand.Parameters.AddWithValue("@dolorCabeza", derivacion.dolorCabeza);
                da.SelectCommand.Parameters.AddWithValue("@contracciones", derivacion.contracciones);
                da.SelectCommand.Parameters.AddWithValue("@hinchazonPies", derivacion.hinchazonPies);
                da.SelectCommand.Parameters.AddWithValue("@sangradoVaginal", derivacion.sangradoVaginal);
                da.SelectCommand.Parameters.AddWithValue("@idServicio", derivacion.idServicio);
                da.SelectCommand.Parameters.AddWithValue("@idCodigoServicio", derivacion.idCodigoServicio);
                da.SelectCommand.Parameters.AddWithValue("@idEspecialidad", derivacion.idEspecialidad);
                da.SelectCommand.Parameters.AddWithValue("@fechaProgramadaMed", derivacion.fechaProgramadaMed);
                da.SelectCommand.Parameters.AddWithValue("@horaProgramadaMed", derivacion.horaProgramadaMed);
                da.SelectCommand.Parameters.AddWithValue("@idCodigoPlanilla", derivacion.idCodigoPlanilla);
                da.SelectCommand.Parameters.AddWithValue("@idMedico", derivacion.idMedico);
                da.SelectCommand.Parameters.AddWithValue("@nombreMedico", derivacion.nombreMedico);
                da.SelectCommand.Parameters.AddWithValue("@idComoLlego", derivacion.idComoLlego);
                da.SelectCommand.Parameters.AddWithValue("@idGravedad", derivacion.idGravedad);
                da.SelectCommand.Parameters.AddWithValue("@idTipoAtencion", derivacion.idTipoAtencion);
                da.SelectCommand.Parameters.AddWithValue("@idMotivoAtencion", derivacion.idMotivoAtencion);
                //============KHOYOSI 20032026===================================================================
                da.SelectCommand.Parameters.AddWithValue("@TriajePresion", derivacion.TriajePresion);
                da.SelectCommand.Parameters.AddWithValue("@TriajeTalla", derivacion.TriajeTalla);
                da.SelectCommand.Parameters.AddWithValue("@TriajeTemperatura", derivacion.TriajeTemperatura);
                da.SelectCommand.Parameters.AddWithValue("@TriajePeso", derivacion.TriajePeso);
                da.SelectCommand.Parameters.AddWithValue("@TriajeFrecRespiratoria", derivacion.TriajeFrecRespiratoria);
                da.SelectCommand.Parameters.AddWithValue("@TriajeFrecCardiaca", derivacion.TriajeFrecCardiaca);
                da.SelectCommand.Parameters.AddWithValue("@TriajePerimCefalico", derivacion.TriajePerimCefalico);
                da.SelectCommand.Parameters.AddWithValue("@TriajeSaturacionOxigeno", derivacion.TriajeSaturacionOxigeno);
                da.SelectCommand.Parameters.AddWithValue("@TriajePerimAbdominal", derivacion.TriajePerimAbdominal);
                da.SelectCommand.Parameters.AddWithValue("@TriajePulso", derivacion.TriajePulso);
                //===============================================================================================

                //============MGAMERO 20260401===================================================================
                da.SelectCommand.Parameters.AddWithValue("@IdGradoInstruccion", derivacion.IdGradoInstruccion);
                da.SelectCommand.Parameters.AddWithValue("@ParentescoPaciente", derivacion.ParentescoPaciente);
                da.SelectCommand.Parameters.AddWithValue("@CipPaciente", derivacion.CipPaciente);
                da.SelectCommand.Parameters.AddWithValue("@TriajeDolor", derivacion.TriajeDolor);
                da.SelectCommand.Parameters.AddWithValue("@TriajeLlenadoCapilar", derivacion.TriajeLlenadoCapilar);
                da.SelectCommand.Parameters.AddWithValue("@Glasgow", derivacion.Glasgow);
                da.SelectCommand.Parameters.AddWithValue("@BiermanPierson", derivacion.BiermanPierson);
                //===============================================================================================

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarDerivacion()
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListarDerivacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        //=== KHOYOSI ======================================================================================
        public async Task<DataSet> ListarDerivaciones(int codigo, int cuenta, string dni, string nombres, int idServicio, string FechaIni, string FechaFin) 
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarDerivaciones", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@Codigo", codigo);
                da.SelectCommand.Parameters.AddWithValue("@Cuenta", cuenta);
                da.SelectCommand.Parameters.AddWithValue("@NroDocumento", dni ?? "");
                da.SelectCommand.Parameters.AddWithValue("@Nombres", nombres ?? "");
                da.SelectCommand.Parameters.AddWithValue("@IdServicio", idServicio);
                da.SelectCommand.Parameters.AddWithValue("@FechaIni", FechaIni);
                da.SelectCommand.Parameters.AddWithValue("@FechaFin", FechaFin);

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        [HttpPost]
        public async Task<DataSet> ListarDerivacionById(int IdDerivacion) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_ListarDerivacionById", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@IdDerivacion", SqlDbType.Int).Value = IdDerivacion;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        [HttpPost]
        public async Task<DataSet> DerivacionEliminar(int idDerivacion, int idUsuario) 
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_DerivacionEliminar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.Add("@IdDerivacion", SqlDbType.Int).Value = idDerivacion;
                da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        //================================================================================================

        public async Task<DataSet> ListarDerivacionByUsuario(int IdUsuario, DateTime FechaIni, DateTime FechaFin) // JDELGADOPM
        {
            Conexion cx = new Conexion();
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("ListarDerivacionByUsuario", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                da.SelectCommand.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                da.SelectCommand.Parameters.AddWithValue("@FechaIni", FechaIni);
                da.SelectCommand.Parameters.AddWithValue("@FechaFin", FechaFin);

                DataSet ds = new DataSet();
                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

    }
}
