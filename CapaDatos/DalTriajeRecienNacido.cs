using CapaDatos;
using System.Data.SqlClient;
using System.Data;
using System;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalTriajeRecienNacido
    {
                
        public Task<DataSet> ListarTriajeRn(int NroCuentaRn, int NroHistoriaRn, string NroDocumentoRn, int NroCuentaMadre, int NroHistoriaMadre, string NroDocumentoMadre, string FechaNacimiento)
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
                            string sql = "web_TriajeRecienNacidoListar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;
                                                        
                            da.SelectCommand.Parameters.Add("@NroCuentaRn", SqlDbType.Int).Value = (NroCuentaRn > 0) ? NroCuentaRn : 0;
                            da.SelectCommand.Parameters.Add("@NroHistoriaRn", SqlDbType.Int).Value = (NroHistoriaRn > 0) ? NroHistoriaRn : 0;
                            da.SelectCommand.Parameters.Add("@NroDocumentoRn", SqlDbType.VarChar).Value = (NroDocumentoRn == null) ? "" : NroDocumentoRn;
                            da.SelectCommand.Parameters.Add("@NroCuentaMadre", SqlDbType.Int).Value = (NroCuentaMadre > 0) ? NroCuentaMadre : 0;
                            da.SelectCommand.Parameters.Add("@NroHistoriaMadre", SqlDbType.Int).Value = (NroHistoriaMadre > 0) ? NroHistoriaMadre : 0;
                            da.SelectCommand.Parameters.Add("@NroDocumentoMadre", SqlDbType.VarChar).Value = (NroDocumentoMadre == null) ? "" : NroDocumentoMadre;
                            da.SelectCommand.Parameters.Add("@FechaNacimientoRn", SqlDbType.VarChar).Value = (FechaNacimiento == null) ? "" : FechaNacimiento;

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

        public Task<DataSet> ListarRelacionadosTriajeRn(int idPacienteMadre)
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
                            string sql = "web_TriajeRecienNacidoListarRelacionados";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdPacienteMadre", SqlDbType.Int).Value = (idPacienteMadre > 0) ? idPacienteMadre : 0;

                            da.Fill(ds);

                            return ds;
                        }
                    }
                }
                catch (Exception ex)
                {
                    ds = null;
                    Console.WriteLine(ex.Message);
                    throw;
                }

            });
        }

        public Task<DataSet> SeleccionarTriajeRn(int idTriajeRn)
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
                            string sql = "web_TriajeRecienNacidoSeleccionar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdTriajeRn", SqlDbType.Int).Value = idTriajeRn;

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

        public Task<DataSet> GuardarTriajeRn(TriajeRecienNacido objTriajeRn, int idListBar)
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_TriajeRecienNacidoModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTriajeRn", SqlDbType.Int).Value = objTriajeRn.idTriajeRn;
                        da.SelectCommand.Parameters.Add("@IdRegistroNacimiento", SqlDbType.Int).Value = objTriajeRn.idRegistroNacimiento;
                        da.SelectCommand.Parameters.Add("@IdCuentaMadre", SqlDbType.VarChar).Value = objTriajeRn.idCuentaAtencionMadre;

                        da.SelectCommand.Parameters.Add("@IdCuentaAtencion", SqlDbType.VarChar).Value = objTriajeRn.idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.VarChar).Value = objTriajeRn.idPaciente;

                        da.SelectCommand.Parameters.Add("@FechaNacimiento", SqlDbType.VarChar).Value = objTriajeRn.FechaNacimiento;
                        da.SelectCommand.Parameters.Add("@HoraNacimiento", SqlDbType.VarChar).Value = objTriajeRn.HoraNacimiento;
                        da.SelectCommand.Parameters.Add("@IdTipoSexo", SqlDbType.Int).Value = objTriajeRn.IdTipoSexo;
                        da.SelectCommand.Parameters.Add("@IdTipoGestacion", SqlDbType.Int).Value = objTriajeRn.IdTipoGestacion;
                        da.SelectCommand.Parameters.Add("@Fetos", SqlDbType.Int).Value = objTriajeRn.Fetos;
                        da.SelectCommand.Parameters.Add("@NroGemelar", SqlDbType.Int).Value = objTriajeRn.NroGemelar;
                        da.SelectCommand.Parameters.Add("@IdCondicion", SqlDbType.Int).Value = objTriajeRn.idCondicion;
                        da.SelectCommand.Parameters.Add("@Obito", SqlDbType.VarChar).Value = objTriajeRn.Obito;

                        da.SelectCommand.Parameters.Add("@Peso", SqlDbType.VarChar).Value = objTriajeRn.Peso;
                        da.SelectCommand.Parameters.Add("@Talla", SqlDbType.VarChar).Value = objTriajeRn.Talla;
                        da.SelectCommand.Parameters.Add("@PerimetroCefalico", SqlDbType.VarChar).Value = objTriajeRn.PerimetroCefalico;
                        da.SelectCommand.Parameters.Add("@PerimetroToracico", SqlDbType.VarChar).Value = objTriajeRn.PerimetroToracico;
                        da.SelectCommand.Parameters.Add("@EdadGes", SqlDbType.Int).Value = objTriajeRn.EdadGestacional;
                        
                        da.SelectCommand.Parameters.Add("@FechaClampaje", SqlDbType.VarChar).Value = objTriajeRn.FechaClamp;
                        da.SelectCommand.Parameters.Add("@HoraClampaje", SqlDbType.VarChar).Value = objTriajeRn.HoraClamp;

                        da.SelectCommand.Parameters.Add("@ClampajeTardio", SqlDbType.Int).Value = objTriajeRn.ClampadoTardio;
                        da.SelectCommand.Parameters.Add("@IdTiempoClampaje", SqlDbType.Int).Value = objTriajeRn.IdTiempoClampaje;

                        da.SelectCommand.Parameters.Add("@IdPielaPiel", SqlDbType.Int).Value = objTriajeRn.IdContactoPielaPiel;
                        da.SelectCommand.Parameters.Add("@ContactoPielaPiel", SqlDbType.Int).Value = objTriajeRn.ContactoPielaPiel;
                        da.SelectCommand.Parameters.Add("@IdTiempoContactoPielaPiel", SqlDbType.Int).Value = objTriajeRn.IdTiempoContactoPielaPiel;
                        da.SelectCommand.Parameters.Add("@EfectividadContactoPielaPiel", SqlDbType.Int).Value = objTriajeRn.EfectividadContactoPielaPiel;
                        da.SelectCommand.Parameters.Add("@DescripcionContactoPielaPiel", SqlDbType.Int).Value = objTriajeRn.DescripcionContactoPielaPiel;

                        
                        da.SelectCommand.Parameters.Add("@ContactoPielaPielPartoVaginal", SqlDbType.Int).Value = objTriajeRn.ContactoPielaPielPartoVaginal;
                        da.SelectCommand.Parameters.Add("@IdTiempoContactoPielaPielPartoVaginal", SqlDbType.Int).Value = objTriajeRn.IdTiempoContactoPielaPielPartoVaginal;
                        da.SelectCommand.Parameters.Add("@EfectividadContactoPielaPielPartoVaginal", SqlDbType.Int).Value = objTriajeRn.EfectividadContactoPielaPielPartoVaginal;


                        
                        da.SelectCommand.Parameters.Add("@ContactoPielaPielCesarea", SqlDbType.Int).Value = objTriajeRn.ContactoPielaPielCesarea;
                        da.SelectCommand.Parameters.Add("@IdTiempoContactoPielaPielCesarea", SqlDbType.Int).Value = objTriajeRn.IdTiempoContactoPielaPielCesarea;
                        da.SelectCommand.Parameters.Add("@EfectividadContactoPielaPielCesarea", SqlDbType.Int).Value = objTriajeRn.EfectividadContactoPielaPielCesarea;



                        da.SelectCommand.Parameters.Add("@Lactancia1raHora", SqlDbType.Int).Value = objTriajeRn.Lactancia1raHora;
                        da.SelectCommand.Parameters.Add("@TiempoLactancia", SqlDbType.VarChar).Value = objTriajeRn.TiempoLactancia;

                        da.SelectCommand.Parameters.Add("@IdServicioNacimiento", SqlDbType.Int).Value = objTriajeRn.IdServicioNacimiento;
                        da.SelectCommand.Parameters.Add("@IdOtraProcedencia", SqlDbType.Int).Value = objTriajeRn.IdOtraProcedencia;

                        da.SelectCommand.Parameters.Add("@IdServicioIngreso", SqlDbType.Int).Value = objTriajeRn.IdServicioIngreso;
                        da.SelectCommand.Parameters.Add("@IdDiagnosticoIngreso", SqlDbType.Int).Value = objTriajeRn.IdDiagnosticoIngreso;
                        da.SelectCommand.Parameters.Add("@IdMedicoIngreso", SqlDbType.Int).Value = objTriajeRn.IdMedicoIngreso;

                        da.SelectCommand.Parameters.Add("@Inmediato", SqlDbType.Int).Value = objTriajeRn.Inmediato;
                        da.SelectCommand.Parameters.Add("@Reanimacion", SqlDbType.Int).Value = objTriajeRn.Reanimacion;
                        da.SelectCommand.Parameters.Add("@IdTipoReanimacion", SqlDbType.Int).Value = objTriajeRn.IdTipoReanimacion;
                        da.SelectCommand.Parameters.Add("@AlMinuto", SqlDbType.VarChar).Value = objTriajeRn.AlMinuto;
                        da.SelectCommand.Parameters.Add("@Alos5Minutos", SqlDbType.VarChar).Value = objTriajeRn.Alos5Minutos;
                        da.SelectCommand.Parameters.Add("@Alos10Minutos", SqlDbType.VarChar).Value = objTriajeRn.Alos10Minutos;
                        da.SelectCommand.Parameters.Add("@Alos15Minutos", SqlDbType.VarChar).Value = objTriajeRn.Alos15Minutos;
                        da.SelectCommand.Parameters.Add("@Alos20Minutos", SqlDbType.VarChar).Value = objTriajeRn.Alos20Minutos;
                        da.SelectCommand.Parameters.Add("@PatologiaNeonatal", SqlDbType.Int).Value = objTriajeRn.Patologia;
                        da.SelectCommand.Parameters.Add("@Especificar", SqlDbType.VarChar).Value = objTriajeRn.Especificar == "" ? null : objTriajeRn.Especificar;
                        da.SelectCommand.Parameters.Add("@Transporte", SqlDbType.Int).Value = objTriajeRn.Transporte;
                        da.SelectCommand.Parameters.Add("@IdTipoTransporte", SqlDbType.Int).Value = objTriajeRn.IdTipoTransporte;

                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objTriajeRn.IdUsuario;
                        da.SelectCommand.Parameters.Add("@IdListItem", SqlDbType.Int).Value = idListBar;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        
        public Task<bool> EliminarTriajeRn(int idTriajeRn, int idUsuario)
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
                            string sql = "web_TriajeRecienNacidoEliminar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdTriajeRn", SqlDbType.Int).Value = idTriajeRn;
                            da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                            da.Fill(ds);

                            return true;
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
