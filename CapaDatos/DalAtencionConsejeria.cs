using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using System;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalAtencionConsejeria
    {

        public async Task<DataSet> ListarProgramacionMedica(string fecha, int idMedico)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaProgramacionMedica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.VarChar).Value = fecha;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos listar programacion", ex);
            }

        }

        public async Task<DataSet> ListarAtencionesConsejeria(int idProgramacion)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaAtencionesConsejeria";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos
                                                
                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar lista atenciones consejeria", ex);
            }

        }

        public async Task<DataSet> ListarFactorRiesgo()
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaFactorRiesgoPsicoprofilaxis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        //da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar lista factores riesgo", ex);
            }

        }

        public async Task<DataSet> ListarDetalleTipoAtencion()
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaDetalleTipoAtencionPsicoprofilaxis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        //da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar lista detalle tipos atencion", ex);
            }

        }

        public async Task<DataSet> ListarDestinoAtencion()
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        //da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar lista destino atencion", ex);
            }

        }


        /*=====================================================PSICOPROFILAXIS======================================================================*/
        public async Task<DataSet> SeleccionarConsejeriaPsicoprofilaxis(int idAtencion, int idCitaTerapia)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarConsejeriaPsicoprofilaxis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdCitaTerapia", SqlDbType.Int).Value = idCitaTerapia;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos seleccionar consejeria psicoprofilaxis", ex);
            }

        }

        public async Task<DataSet> GuardarConsejeriaPsicoprofilaxis(ConsejeriaPsicoprofilaxis consejeriaPsicoprofilaxis, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_GuardarConsejeriaPsicoprofilaxis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdAtencion;
                        da.SelectCommand.Parameters.Add("@IdCitaTerapia", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdCitaTerapia;
                        da.SelectCommand.Parameters.Add("@Fur", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.Fur ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Fpp", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.Fpp ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@EdadGestSem", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.EdadGestSem;
                        da.SelectCommand.Parameters.Add("@EdadGestDias", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.EdadGestDias;
                        da.SelectCommand.Parameters.Add("@Paridad1", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.Paridad1 ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad2", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.Paridad2 ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad3", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.Paridad3 ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@Paridad4", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.Paridad4 ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdFactorRiesgo", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdFactorRiesgo;
                        da.SelectCommand.Parameters.Add("@FactorRiesgo", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.FactorRiesgo ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdProductoDetalleAtencion", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdProductoDetalleAtencion;
                        da.SelectCommand.Parameters.Add("@NroSesionEducativa", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.NroSesionEducativa;
                        da.SelectCommand.Parameters.Add("@MotivoAtencion", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.MotivoAtencion ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@GestantePreparada", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.GestantePreparada;
                        da.SelectCommand.Parameters.Add("@IdTipoDocumentoAcompaniante", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdTipoDocumentoAcompaniante;
                        da.SelectCommand.Parameters.Add("@NroDocumentoAcompaniante", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.NroDocumentoAcompaniante ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@NombresAcompaniante", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.NombresAcompaniante ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdParentescoAcompaniante", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdParentescoAcompaniante;
                        da.SelectCommand.Parameters.Add("@NroSesionAcompaniante", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.NroSesionAcompaniante;
                        da.SelectCommand.Parameters.Add("@IdMedicoAtiende", SqlDbType.Int).Value = consejeriaPsicoprofilaxis.IdMedicoAtiende;
                        da.SelectCommand.Parameters.Add("@HoraInicioAtencion", SqlDbType.VarChar).Value = consejeriaPsicoprofilaxis.HoraInicioAtencion ?? (object)DBNull.Value;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;


                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos guardar consejeria psicoprofilaxis", ex);
            }

        }

        public async Task<DataSet> EliminarConsejeriaPsicoprofilaxis(int idAtencion, int idCitaTerapia, int idUsuario, int idListBar)
        {
            Conexion cx = new Conexion();

            try
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EliminarConsejeriaPsicoprofilaxis";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        //da.SelectCommand.CommandTimeout = 120; // Aumenta el tiempo de espera a 120 segundos

                        da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
                        da.SelectCommand.Parameters.Add("@IdCitaTerapia", SqlDbType.Int).Value = idCitaTerapia;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        await Task.Run(() => da.Fill(ds));

                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes manejar o registrar el error
                throw new Exception("Error al obtener datos eliminar consejeria psicoprofilaxis", ex);
            }

        }



        /*===========================================================================================================================================*/
    }
}
