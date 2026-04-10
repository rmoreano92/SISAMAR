using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using WebAppSaludOcupacional.CapaEntidades;

namespace CapaDatos
{
    public class DalPaciente
    {


        public List<RptPacientesSinParto> ObtenerPacientes(int idEmpleado, DateTime FechaInicio, DateTime FechaFin)
        {
            List<RptPacientesSinParto> lstMenu = new List<RptPacientesSinParto>();
            RptPacientesSinParto u = null;
            SqlCommand cmd = null;
            SqlDataReader dr = null;
            try
            {

                cmd = MetodoDatos.CrearComando("web_rptListaPacientesCESinparto");
                cmd.Parameters.AddWithValue("@IdUsuario", idEmpleado);
                cmd.Parameters.AddWithValue("@FechaInicio", FechaInicio);
                cmd.Parameters.AddWithValue("@FechaFin", FechaFin);
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    u = new RptPacientesSinParto();
                    u.Paciente = Convert.ToString(dr["Paciente"]);
                    u.NroHistoriaClinica = Convert.ToString(dr["NroHistoriaClinica"]);
                    u.Telefono = Convert.ToString(dr["Telefono"]);
                    u.DireccionDomicilio = Convert.ToString(dr["DireccionDomicilio"]);
                    u.EdadGestacional = Convert.ToString(dr["EdadGestacional"]);
                    u.Medico = Convert.ToString(dr["Medico"]);
                    u.Operacion = Convert.ToString(dr["Operaciones"]);
                    lstMenu.Add(u);
                }

            }
            catch (Exception)
            {

                lstMenu = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return lstMenu;
        }


        public int registrarOperacion(int idLlamada, int idCita, String Descripcion, int idusu)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("insertarLlamada");
                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;
                //cmd.Parameters["@nRpta"].Value = idLlamada;
                cmd.Parameters.AddWithValue("@idLlamada", idLlamada);
                cmd.Parameters.AddWithValue("@idcita", idCita);
                cmd.Parameters.AddWithValue("@descripcion", Descripcion);
                cmd.Parameters.AddWithValue("@idUsuReg", idusu);
                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public DataSet DevuelveCondicionPacientexNroCuenta(int idNroCuenta, int idGrupo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_DevuelveCondicionxNroCuenta");
                cmd.Parameters.AddWithValue("@idNroCuenta", idNroCuenta);
                cmd.Parameters.AddWithValue("@idGrupo", idGrupo);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        public DataSet PacientesSeleccionarPorNroHistoriaClinica(int nroHistoria)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("PacientesSeleccionarPorNroHistoriaClinica");
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", nroHistoria);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet BuscarFuentePorDNI(string nroDocumento)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("usp_SelectBuscarFuentePorDNI_20241214");
                cmd.Parameters.AddWithValue("@NroDocumento", nroDocumento);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }


        public DataSet PacientesSeleccionarPorNroHistoriaClinicaAndDocumento(int nroHistoria, string nroDocumento)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("PacientesSeleccionarPorNroHistoriaClinicaAndDocumento");
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", nroHistoria);
                cmd.Parameters.AddWithValue("@NroDocumento", nroDocumento);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet PacientesSeleccionarPorNroDocumento(string nroDocumento)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("PacientesSeleccionarPorNroDocumento");
                cmd.Parameters.AddWithValue("@NroDocumento", nroDocumento);

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                ds = null;
                Console.WriteLine(ex.Message);
                throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        //Moreano 09/10/2020
        public Task<DataSet> ListaLugarDeTrabajoEmplByIdEmpleado(int idArea, int idEmpleado)
        {


            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "listaLugarDeTrabajoEmplByIdEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idArea", SqlDbType.VarChar).Value = idArea;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.VarChar).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public int generaNroHistoria(int IdTipoNumeracion)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_crearNroHistoria");
                cmd.Parameters.AddWithValue("@IdTipoNumeracion", IdTipoNumeracion);
                cmd.Parameters.Add("@NroHistoria", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@NroHistoria"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;
        }

        public async Task<int> GeneraNroHistoriaV2(int idTipoNumeracion)
        {
            int nroHistoria = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_crearNroHistoria", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdTipoNumeracion", idTipoNumeracion);
                cmd.Parameters.Add("@NroHistoria", SqlDbType.Int).Direction = ParameterDirection.Output;

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                // Convert.ToInt32 maneja nulos de manera más segura que int.Parse
                nroHistoria = Convert.ToInt32(cmd.Parameters["@NroHistoria"].Value);
            }

            return nroHistoria;
        }

        public int registrarPacienteV2(Paciente objpacientes, int idUsuario)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_crearPacienteV2");
                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@IdPaciente", objpacientes.IdPaciente);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", objpacientes.ApellidoPaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", objpacientes.ApellidoMaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PrimerNombre", objpacientes.PrimerNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SegundoNombre", objpacientes.SegundoNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TercerNombre", objpacientes.TercerNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaNacimiento", objpacientes.FechaNacimiento);
                cmd.Parameters.AddWithValue("@NroDocumento", objpacientes.NroDocumento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Telefono", objpacientes.Telefono ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DireccionDomicilio", objpacientes.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Autogenerado", objpacientes.Autogenerado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoSexo", objpacientes.IdTipoSexo == 0 ? Convert.DBNull : objpacientes.IdTipoSexo);
                cmd.Parameters.AddWithValue("@IdProcedencia", objpacientes.IdProcedencia == 0 ? Convert.DBNull : objpacientes.IdProcedencia);
                cmd.Parameters.AddWithValue("@IdGradoInstruccion", objpacientes.IdGradoInstruccion == 0 ? Convert.DBNull : objpacientes.IdGradoInstruccion);
                cmd.Parameters.AddWithValue("@IdEstadoCivil", objpacientes.IdEstadoCivil == 0 ? Convert.DBNull : objpacientes.IdEstadoCivil);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", objpacientes.IdDocIdentidad == 0 ? Convert.DBNull : objpacientes.IdDocIdentidad);
                cmd.Parameters.AddWithValue("@IdTipoOcupacion", objpacientes.IdTipoOcupacion == 0 ? Convert.DBNull : objpacientes.IdTipoOcupacion);
                cmd.Parameters.AddWithValue("@IdCentroPobladoNacimiento", objpacientes.IdCentroPobladoNacimiento == 0 ? Convert.DBNull : objpacientes.IdCentroPobladoNacimiento);
                cmd.Parameters.AddWithValue("@IdCentroPobladoDomicilio", objpacientes.IdCentroPobladoDomicilio == 0 ? Convert.DBNull : objpacientes.IdCentroPobladoDomicilio);
                cmd.Parameters.AddWithValue("@NombrePadre", objpacientes.NombrePadre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreMadre", objpacientes.NombreMadre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", objpacientes.NroHistoriaClinica == "" ? Convert.DBNull : objpacientes.NroHistoriaClinica);
                cmd.Parameters.AddWithValue("@IdTipoNumeracion", objpacientes.IdTipoNumeracion == 0 ? Convert.DBNull : objpacientes.IdTipoNumeracion);
                cmd.Parameters.AddWithValue("@IdCentroPobladoProcedencia", objpacientes.IdCentroPobladoProcedencia == 0 ? Convert.DBNull : objpacientes.IdCentroPobladoProcedencia);
                cmd.Parameters.AddWithValue("@Observacion", objpacientes.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaisDomicilio", objpacientes.IdPaisDomicilio == 0 ? Convert.DBNull : objpacientes.IdPaisDomicilio);
                cmd.Parameters.AddWithValue("@IdPaisProcedencia", objpacientes.IdPaisProcedencia == 0 ? Convert.DBNull : objpacientes.IdPaisProcedencia);
                cmd.Parameters.AddWithValue("@IdPaisNacimiento", objpacientes.IdPaisNacimiento == 0 ? Convert.DBNull : objpacientes.IdPaisNacimiento);
                cmd.Parameters.AddWithValue("@IdDistritoProcedencia", objpacientes.IdDistritoProcedencia == 0 ? Convert.DBNull : objpacientes.IdDistritoProcedencia);
                cmd.Parameters.AddWithValue("@IdDistritoDomicilio", objpacientes.IdDistritoDomicilio == 0 ? Convert.DBNull : objpacientes.IdDistritoDomicilio);
                cmd.Parameters.AddWithValue("@IdDistritoNacimiento", objpacientes.IdDistritoNacimiento == 0 ? Convert.DBNull : objpacientes.IdDistritoNacimiento);
                cmd.Parameters.AddWithValue("@FichaFamiliar", objpacientes.FichaFamiliar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEtnia", objpacientes.IdEtnia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@GrupoSanguineo", objpacientes.GrupoSanguineo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FactorRh", objpacientes.FactorRh ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@UsoWebReniec", objpacientes.UsoWebReniec);
                cmd.Parameters.AddWithValue("@IdIdioma", objpacientes.IdIdioma == 0 ? Convert.DBNull : objpacientes.IdIdioma);
                cmd.Parameters.AddWithValue("@Email", objpacientes.Email ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreDocumento", objpacientes.madreDocumento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreApellidoPaterno", objpacientes.madreApellidoPaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreApellidoMaterno", objpacientes.madreApellidoMaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madrePrimerNombre", objpacientes.madrePrimerNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreSegundoNombre", objpacientes.madreSegundoNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroOrdenHijo", objpacientes.NroOrdenHijo == 0 ? Convert.DBNull : objpacientes.NroOrdenHijo);
                cmd.Parameters.AddWithValue("@madreTipoDocumento", objpacientes.madreTipoDocumento == 0 ? Convert.DBNull : objpacientes.madreTipoDocumento);
                cmd.Parameters.AddWithValue("@Sector", objpacientes.Sector ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Sectorista", objpacientes.Sectorista);
                cmd.Parameters.AddWithValue("@EstadoMigracion", objpacientes.EstadoMigracion == 0 ? Convert.DBNull : objpacientes.EstadoMigracion);
                cmd.Parameters.AddWithValue("@idReligion", objpacientes.Religion);
                cmd.Parameters.AddWithValue("@Acompaniante", objpacientes.acompañante ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdDepartamentoDomicilio", objpacientes.IdDepartamentoDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdDepartamentoProcedencia", objpacientes.IdDepartamentoProcedencia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdDepartamentoNacimiento", objpacientes.IdDepartamentoNacimiento ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);

                cmd.Parameters.AddWithValue("@CipPaciente", objpacientes.CipPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TelefonoMadre", objpacientes.TelefonoMadre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@cboParentescoMadre", objpacientes.cboParentescoMadre == 0 ? Convert.DBNull : objpacientes.cboParentescoMadre);

                cmd.Parameters.AddWithValue("@TipoMPadres", objpacientes.TipoMPadres == 0 ? Convert.DBNull : objpacientes.TipoMPadres);
                cmd.Parameters.AddWithValue("@NroDocMPadres", objpacientes.NroDocMPadres ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombresMPadres", objpacientes.NombresMPadres ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@TipoPPadres", objpacientes.TipoPPadres == 0 ? Convert.DBNull : objpacientes.TipoPPadres);
                cmd.Parameters.AddWithValue("@NroDocPPadres", objpacientes.NroDocPPadres ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombresPPadres", objpacientes.NombresPPadres ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@ParentescoPaciente", objpacientes.ParentescoPaciente);
                cmd.Parameters.AddWithValue("@cboDiscapacidadPaciente", objpacientes.cboDiscapacidadPaciente == 0 ? Convert.DBNull : objpacientes.cboDiscapacidadPaciente);
                cmd.Parameters.AddWithValue("@DependenciaPaciente", objpacientes.DependenciaPaciente == 0 ? Convert.DBNull : objpacientes.DependenciaPaciente);
                cmd.Parameters.AddWithValue("@UnidadPagoPaciente", objpacientes.UnidadPagoPaciente == 0 ? Convert.DBNull : objpacientes.UnidadPagoPaciente);
                cmd.Parameters.AddWithValue("@GradoPaciente", objpacientes.GradoPaciente == 0 ? Convert.DBNull : objpacientes.GradoPaciente);

                cmd.Parameters.AddWithValue("@SituacionPaciente", objpacientes.SituacionPaciente == 0 ? Convert.DBNull : objpacientes.SituacionPaciente);
                cmd.Parameters.AddWithValue("@FactorRHPaciente", objpacientes.FactorRHPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@GrupoSanguineoPaciente", objpacientes.GrupoSanguineoPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@CodigoCajaPensionPaciente", objpacientes.CodigoCajaPensionPaciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Telefono2Paciente", objpacientes.Telefono2Paciente ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Telefono3Paciente", objpacientes.Telefono3Paciente ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@IdPaisMadre", objpacientes.IdPaisMadre == 0 ? Convert.DBNull : objpacientes.IdPaisMadre);
                cmd.Parameters.AddWithValue("@idDepartamentoMadre", objpacientes.idDepartamentoMadre == 0 ? Convert.DBNull : objpacientes.idDepartamentoMadre);
                cmd.Parameters.AddWithValue("@idProvinciaMadre", objpacientes.idProvinciaMadre == 0 ? Convert.DBNull : objpacientes.idProvinciaMadre);
                cmd.Parameters.AddWithValue("@idDistritoMadre", objpacientes.idDistritoMadre == 0 ? Convert.DBNull : objpacientes.idDistritoMadre);
                cmd.Parameters.AddWithValue("@idCentroPobladoMadre", objpacientes.idCentroPobladoMadre == 0 ? Convert.DBNull : objpacientes.idCentroPobladoMadre);
                cmd.Parameters.AddWithValue("@DireccionMadre", objpacientes.DireccionMadre ?? Convert.DBNull);

                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public void InsertarPacienteContacto(PacienteContacto objContacto)
        {
            SqlCommand cmd = null;

            try
            {
                cmd = MetodoDatos.CrearComando("web_insertarPacienteContacto");

                cmd.Parameters.AddWithValue("@IdPaciente", objContacto.IdPaciente);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", objContacto.ApellidoPaterno ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", objContacto.ApellidoMaterno ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Nombres", objContacto.Nombres ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Telefono", objContacto.Telefono ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@EsParentesco", objContacto.EsParentesco);

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
        }
        
        public int registrarPaciente(Paciente objpacientes)
        {
            int nRpta = 0;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_crearPaciente");
                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@IdPaciente", objpacientes.IdPaciente);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", objpacientes.ApellidoPaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", objpacientes.ApellidoMaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@PrimerNombre", objpacientes.PrimerNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@SegundoNombre", objpacientes.SegundoNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@TercerNombre", objpacientes.TercerNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaNacimiento", objpacientes.FechaNacimiento);
                cmd.Parameters.AddWithValue("@NroDocumento", objpacientes.NroDocumento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Telefono", objpacientes.Telefono ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DireccionDomicilio", objpacientes.DireccionDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Autogenerado", objpacientes.Autogenerado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdTipoSexo", objpacientes.IdTipoSexo == 0 ? Convert.DBNull : objpacientes.IdTipoSexo);
                cmd.Parameters.AddWithValue("@IdProcedencia", objpacientes.IdProcedencia == 0 ? Convert.DBNull : objpacientes.IdProcedencia);
                cmd.Parameters.AddWithValue("@IdGradoInstruccion", objpacientes.IdGradoInstruccion == 0 ? Convert.DBNull : objpacientes.IdGradoInstruccion);
                cmd.Parameters.AddWithValue("@IdEstadoCivil", objpacientes.IdEstadoCivil == 0 ? Convert.DBNull : objpacientes.IdEstadoCivil);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", objpacientes.IdDocIdentidad == 0 ? Convert.DBNull : objpacientes.IdDocIdentidad);
                cmd.Parameters.AddWithValue("@IdTipoOcupacion", objpacientes.IdTipoOcupacion == 0 ? Convert.DBNull : objpacientes.IdTipoOcupacion);
                cmd.Parameters.AddWithValue("@IdCentroPobladoNacimiento", objpacientes.IdCentroPobladoNacimiento == 0 ? Convert.DBNull : objpacientes.IdCentroPobladoNacimiento);
                cmd.Parameters.AddWithValue("@IdCentroPobladoDomicilio", objpacientes.IdCentroPobladoDomicilio == 0 ? Convert.DBNull : objpacientes.IdCentroPobladoDomicilio);
                cmd.Parameters.AddWithValue("@NombrePadre", objpacientes.NombrePadre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NombreMadre", objpacientes.NombreMadre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", objpacientes.NroHistoriaClinica == "" ? Convert.DBNull : objpacientes.NroHistoriaClinica);
                cmd.Parameters.AddWithValue("@IdTipoNumeracion", objpacientes.IdTipoNumeracion == 0 ? Convert.DBNull : objpacientes.IdTipoNumeracion);
                cmd.Parameters.AddWithValue("@IdCentroPobladoProcedencia", objpacientes.IdCentroPobladoProcedencia == 0 ? Convert.DBNull : objpacientes.IdCentroPobladoProcedencia);
                cmd.Parameters.AddWithValue("@Observacion", objpacientes.Observacion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdPaisDomicilio", objpacientes.IdPaisDomicilio == 0 ? Convert.DBNull : objpacientes.IdPaisDomicilio);
                cmd.Parameters.AddWithValue("@IdPaisProcedencia", objpacientes.IdPaisProcedencia == 0 ? Convert.DBNull : objpacientes.IdPaisProcedencia);
                cmd.Parameters.AddWithValue("@IdPaisNacimiento", objpacientes.IdPaisNacimiento == 0 ? Convert.DBNull : objpacientes.IdPaisNacimiento);
                cmd.Parameters.AddWithValue("@IdDistritoProcedencia", objpacientes.IdDistritoProcedencia == 0 ? Convert.DBNull : objpacientes.IdDistritoProcedencia);
                cmd.Parameters.AddWithValue("@IdDistritoDomicilio", objpacientes.IdDistritoDomicilio == 0 ? Convert.DBNull : objpacientes.IdDistritoDomicilio);
                cmd.Parameters.AddWithValue("@IdDistritoNacimiento", objpacientes.IdDistritoNacimiento == 0 ? Convert.DBNull : objpacientes.IdDistritoNacimiento);
                cmd.Parameters.AddWithValue("@FichaFamiliar", objpacientes.FichaFamiliar ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdEtnia", objpacientes.IdEtnia ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@GrupoSanguineo", objpacientes.GrupoSanguineo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FactorRh", objpacientes.FactorRh ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@UsoWebReniec", objpacientes.UsoWebReniec);
                cmd.Parameters.AddWithValue("@IdIdioma", objpacientes.IdIdioma == 0 ? Convert.DBNull : objpacientes.IdIdioma);
                cmd.Parameters.AddWithValue("@Email", objpacientes.Email ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreDocumento", objpacientes.madreDocumento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreApellidoPaterno", objpacientes.madreApellidoPaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreApellidoMaterno", objpacientes.madreApellidoMaterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madrePrimerNombre", objpacientes.madrePrimerNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@madreSegundoNombre", objpacientes.madreSegundoNombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroOrdenHijo", objpacientes.NroOrdenHijo == 0 ? Convert.DBNull : objpacientes.NroOrdenHijo);
                cmd.Parameters.AddWithValue("@madreTipoDocumento", objpacientes.madreTipoDocumento == 0 ? Convert.DBNull : objpacientes.madreTipoDocumento);
                cmd.Parameters.AddWithValue("@Sector", objpacientes.Sector ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Sectorista", objpacientes.Sectorista);
                cmd.Parameters.AddWithValue("@EstadoMigracion", objpacientes.EstadoMigracion == 0 ? Convert.DBNull : objpacientes.EstadoMigracion);
                cmd.Parameters.AddWithValue("@idReligion", objpacientes.Religion);
                cmd.Parameters.AddWithValue("@Acompaniante", objpacientes.acompañante ?? Convert.DBNull);

                cmd.ExecuteNonQuery();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public async Task<int> RegistrarPacienteTamizaje(Paciente paciente)
        {
            int resultado;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_crearPaciente_tamizaje", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // Parámetro de salida
                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                // Parámetros de entrada
                cmd.Parameters.AddWithValue("@IdPaciente", paciente.IdPaciente);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", (object)paciente.ApellidoPaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", (object)paciente.ApellidoMaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PrimerNombre", (object)paciente.PrimerNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SegundoNombre", (object)paciente.SegundoNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TercerNombre", (object)paciente.TercerNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaNacimiento", paciente.FechaNacimiento);
                cmd.Parameters.AddWithValue("@NroDocumento", (object)paciente.NroDocumento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoSexo", paciente.IdTipoSexo == 0 ? DBNull.Value : (object)paciente.IdTipoSexo);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", paciente.IdDocIdentidad == 0 ? DBNull.Value : (object)paciente.IdDocIdentidad);
                cmd.Parameters.AddWithValue("@NroHistoriaClinica", paciente.NroHistoriaClinica == "" ? DBNull.Value : (object)paciente.NroHistoriaClinica);
                cmd.Parameters.AddWithValue("@IdTipoNumeracion", paciente.IdTipoNumeracion == 0 ? DBNull.Value : (object)paciente.IdTipoNumeracion);
                cmd.Parameters.AddWithValue("@UsoWebReniec", paciente.UsoWebReniec);
                cmd.Parameters.AddWithValue("@madreDocumento", (object)paciente.madreDocumento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madreTipoDocumento", paciente.madreTipoDocumento == 0 ? DBNull.Value : (object)paciente.madreTipoDocumento);

                // Apertura de conexión y ejecución
                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                // Conversión segura del resultado
                resultado = Convert.ToInt32(cmd.Parameters["@nRpta"].Value);
            }

            return resultado;
        }

        public Task<DataSet> ListaPacientes(Paciente obPaciente)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaPacientes";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = obPaciente.NroDocumento != null ? obPaciente.NroDocumento : "";
                        da.SelectCommand.Parameters.Add("@nroHistoriaClinica", SqlDbType.VarChar).Value = obPaciente.NroHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = obPaciente.ApellidoPaterno != null ? obPaciente.ApellidoPaterno : "";
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = obPaciente.ApellidoMaterno != null ? obPaciente.ApellidoMaterno : "";
                        da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = obPaciente.Nombres != null ? obPaciente.Nombres : "";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public DataSet PacientesObtenerConElMismoAutogenerado(Paciente obPaciente)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("PacientesObtenerConElMismoAutogenerado");
                cmd.Parameters.AddWithValue("@Autogenerado", obPaciente.Autogenerado);
                cmd.Parameters.AddWithValue("@IdPaciente", obPaciente.IdPaciente);


                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public DataSet PacientesObtenerConLaMismaHistoriaDefinitiva(Paciente obPaciente)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("PacientesObtenerConElMismoAutogenerado");
                cmd.Parameters.AddWithValue("@Autogenerado", obPaciente.Autogenerado);
                cmd.Parameters.AddWithValue("@IdPaciente", obPaciente.IdPaciente);


                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
            }
            catch (Exception)
            {
                ds = null; throw;
            }
            finally
            {
                cmd.Connection.Close();
            }
            return ds;
        }

        public Task<DataSet> PacientesFiltrarTodosSoloHistoriasDefinitivas(
            int nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string segundoNombre, int idDocIdentidad, string nroDocumento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "PacientesFiltrarTodosSoloHistoriasDefinitivas";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.Int).Value = nroHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno != null ? apellidoPaterno : "";
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = apellidoMaterno != null ? apellidoMaterno : "";
                        da.SelectCommand.Parameters.Add("@primerNombre", SqlDbType.VarChar).Value = primerNombre != null ? primerNombre : "";
                        da.SelectCommand.Parameters.Add("@segundoNombre", SqlDbType.VarChar).Value = segundoNombre != null ? segundoNombre : "";
                        da.SelectCommand.Parameters.Add("@idDocIdentidad", SqlDbType.Int).Value = idDocIdentidad;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = nroDocumento != null ? nroDocumento : "";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public Task<DataSet> PacientesFiltraPorNroDocumentoYtipo(string nroDocumento, int idDocIdentidad)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "PacientesFiltraPorNroDocumentoYtipo";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@nroDocumento", SqlDbType.VarChar).Value = nroDocumento != null ? nroDocumento : "";
                        da.SelectCommand.Parameters.Add("@idDocIdentidad", SqlDbType.Int).Value = idDocIdentidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public Task<DataSet> HistoriasClinicasSeleccionarPorId(string nroHistoriaClinica)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "HistoriasClinicasSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.VarChar).Value = nroHistoriaClinica;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public Task<Boolean> PacientesDatosAdicionalesPersonalesAgregar(int idPaciente, int fNacimientoCalculada)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "PacientesDatosAdicionalesPersonalesAgregar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;
                        cmd.Parameters.Add("@FNacimientoCalculada", SqlDbType.Bit).Value = fNacimientoCalculada;

                        da.InsertCommand = cmd;

                        if (da.InsertCommand.ExecuteNonQuery() > 0)
                        {
                            conn.Close();
                            return true;
                        }
                        else
                        {
                            conn.Close();
                            return false;
                        }
                    }
                }
            });
        } // JDELGADO001.2

        public Task<int> web_crearModificarPacienteSunasa(PacienteSunasa objPacienteSunasa, int idUsuario)  // JDELGADO001.2
        {
            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_crearModificarPacienteSunasa";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@idSunasaPacienteHistorico", objPacienteSunasa.idSunasaPacienteHistorico ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idPaciente", objPacienteSunasa.idPaciente);
                        cmd.Parameters.AddWithValue("@CodigoIAFA", objPacienteSunasa.CodigoIAFA ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idPaisTitular", objPacienteSunasa.idPaisTitular ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idTipoDocumentoTitular", objPacienteSunasa.idTipoDocumentoTitular ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@NroDocumentoTitular", objPacienteSunasa.NroDocumentoTitular ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@ApellidoCasada", objPacienteSunasa.ApellidoCasada ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@ValidacionRegIdentidad", objPacienteSunasa.ValidacionRegIdentidad ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@NroCarnetIdentidad", objPacienteSunasa.NroCarnetIdentidad ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@EstadoDelSeguro", objPacienteSunasa.EstadoDelSeguro ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdAfiliacion", objPacienteSunasa.IdAfiliacion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@ProductoYplan", objPacienteSunasa.ProductoYplan ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FechaInicioAfiliacion", objPacienteSunasa.FechaInicioAfiliacion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FechaFinalAfiliacion", objPacienteSunasa.FechaFinalAfiliacion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idRegimen", objPacienteSunasa.idRegimen ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@CodigoEstablecimientoIAFA", objPacienteSunasa.CodigoEstablecimientoIAFA ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@CodigoEstablecimientoRENAES", objPacienteSunasa.CodigoEstablecimientoRENAES ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idParentesco", objPacienteSunasa.idParentesco ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@RUCempleador", objPacienteSunasa.RUCempleador ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AnteriorIdTipoDocumentoAsegurado", objPacienteSunasa.AnteriorIdTipoDocumentoAsegurado ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@AnteriorNroDocumentoAsegurado", objPacienteSunasa.AnteriorNroDocumentoAsegurado ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@DNIusarioOperacion", objPacienteSunasa.DNIusarioOperacion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@idOperacion", objPacienteSunasa.idOperacion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FechaEnvio", objPacienteSunasa.FechaEnvio ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@SisSepelioParienteEncargado", objPacienteSunasa.SisSepelioParienteEncargado ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@SisSepelioDni", objPacienteSunasa.SisSepelioDni ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@SisSepelioFnacimiento", objPacienteSunasa.SisSepelioFnacimiento ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@SisSepelioSexo", objPacienteSunasa.SisSepelioSexo ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@SisNroAfiliacion", objPacienteSunasa.SisNroAfiliacion ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@YaNoTieneSeguro", objPacienteSunasa.YaNoTieneSeguro ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);


                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public async Task<DataSet> PacientesSeleccionarPorId(int idPaciente)  // JDELGADO001.2
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_PacientesSeleccionarPorId", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdPaciente", idPaciente);
                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }


        public async Task<List<PacienteContacto>> ObtenerContactos(int idPaciente)
        {
            List<PacienteContacto> lista = new List<PacienteContacto>();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_obtenerContactosPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdPaciente", idPaciente);

                DataSet ds = new DataSet();

                await conn.OpenAsync();
                da.Fill(ds);

                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        lista.Add(new PacienteContacto
                        {
                            IdContacto = Convert.ToInt32(dr["IdContacto"]),
                            IdPaciente = Convert.ToInt32(dr["IdPaciente"]),
                            EsParentesco = Convert.ToBoolean(dr["EsParentesco"]),
                            ApellidoPaterno = dr["ApellidoPaterno"].ToString(),
                            ApellidoMaterno = dr["ApellidoMaterno"].ToString(),
                            Nombres = dr["Nombres"].ToString(),
                            Telefono = dr["Telefono"].ToString()
                        });
                    }
                }
            }

            return lista;
        }

        public async Task<bool> EliminarContacto(int idContacto)
        {
            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_eliminarPacienteContacto", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdContacto", idContacto);

                await conn.OpenAsync();
                int filas = await cmd.ExecuteNonQueryAsync();

                return filas > 0;
            }
        }

        public Task<DataSet> HistoriasSolicitadasAgregar(Citas objCitas)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_HistoriasSolicitadasAgregar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdHistoriaSolicitada", SqlDbType.Int).Direction = ParameterDirection.Output;

                        da.SelectCommand.Parameters.AddWithValue("@IdMotivo", "");
                        da.SelectCommand.Parameters.AddWithValue("@HoraRequerida", ""); //------------------- falta co´mpletar
                        da.SelectCommand.Parameters.AddWithValue("@FechaRequerida", "");
                        da.SelectCommand.Parameters.AddWithValue("@FechaSolicitud", "");
                        da.SelectCommand.Parameters.AddWithValue("@IdPaciente", "");
                        da.SelectCommand.Parameters.AddWithValue("@IdEmpleadoSolicita", "");
                        da.SelectCommand.Parameters.AddWithValue("@IdMovimiento", "");
                        da.SelectCommand.Parameters.AddWithValue("@Observacion", "");
                        da.SelectCommand.Parameters.AddWithValue("@IdServicio", "");
                        da.SelectCommand.Parameters.AddWithValue("@IdUsuarioAuditoria", "");
                        da.SelectCommand.Parameters.AddWithValue("@idAtencion", "");

                        da.SelectCommand.ExecuteNonQuery();

                        //da.SelectCommand = int.Parse(da.SelectCommand.Parameters["@nRpta"].Value.ToString());

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public Task<DataSet> PacientesFiltrarTodosSoloHistorias(
            int nroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre,
            string segundoNombre, int idDocIdentidad, string nroDocumento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_PacientesFiltrarTodosSoloHistorias";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.Int).Value = nroHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno != null ? apellidoPaterno : "";
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = apellidoMaterno != null ? apellidoMaterno : "";
                        da.SelectCommand.Parameters.Add("@primerNombre", SqlDbType.VarChar).Value = primerNombre != null ? primerNombre : "";
                        da.SelectCommand.Parameters.Add("@segundoNombre", SqlDbType.VarChar).Value = segundoNombre != null ? segundoNombre : "";
                        da.SelectCommand.Parameters.Add("@idDocIdentidad", SqlDbType.Int).Value = idDocIdentidad;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = nroDocumento != null ? nroDocumento : "";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2
          //

        public Task<DataSet> PacientesFiltrarTodos(string NroHistoriaClinica, string apellidoPaterno, string apellidoMaterno, string primerNombre, string segundoNombre, int idDocIdentidad, string NroDocumento, string FichaFamiliar)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesFiltrarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.Int).Value = NroHistoriaClinica;
                        da.SelectCommand.Parameters.Add("@apellidoPaterno", SqlDbType.VarChar).Value = apellidoPaterno != null ? apellidoPaterno : "";
                        da.SelectCommand.Parameters.Add("@apellidoMaterno", SqlDbType.VarChar).Value = apellidoMaterno != null ? apellidoMaterno : "";
                        da.SelectCommand.Parameters.Add("@primerNombre", SqlDbType.VarChar).Value = primerNombre != null ? primerNombre : "";
                        da.SelectCommand.Parameters.Add("@segundoNombre", SqlDbType.VarChar).Value = segundoNombre != null ? segundoNombre : "";
                        da.SelectCommand.Parameters.Add("@idDocIdentidad", SqlDbType.Int).Value = idDocIdentidad;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = NroDocumento != null ? NroDocumento : "";
                        da.SelectCommand.Parameters.Add("@FichaFamiliar", SqlDbType.VarChar).Value = FichaFamiliar != null ? FichaFamiliar : "";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> TiposNumeracionHistoriaSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposNumeracionHistoriaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public Task<DataSet> TiposSexoSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposSexoSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2



        /*----------------------- METODOS ACTUALIZADOS /*-----------------------*/

        public async Task<DataSet> PacientesSeleccionarPorNroHistoriaClinicaV2(string nroHistoria)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("PacientesSeleccionarPorNroHistoriaClinica", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoriaClinica", nroHistoria);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> PacientesSeleccionarCuentasAbiertasByIdPaciente(string nroHistoria)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_PacientesSeleccionarCuentasAbiertasByIdPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoriaClinica", nroHistoria);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        /////////////////////////////////////KHOYOSI/////////////////////////////////////////////////////
        public Task<DataSet> GenerarBrazalete(int idPaciente, int IdUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_GenerarBrazalete";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<bool> GenerarBrazaletePaciente(Brazalete paciente, int IdUsuario)
        {
            bool resp = false;
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_BrazaletePacienteGenerar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = paciente.idPaciente;
                        da.SelectCommand.Parameters.Add("@NroHistoria", SqlDbType.VarChar).Value = paciente.nroHistoria;
                        da.SelectCommand.Parameters.Add("@Apellidos", SqlDbType.VarChar).Value = paciente.apellidos;
                        da.SelectCommand.Parameters.Add("@Nombres", SqlDbType.VarChar).Value = paciente.nombres;
                        da.SelectCommand.Parameters.Add("@TipoDocumento", SqlDbType.VarChar).Value = paciente.tipoDocumento;
                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = paciente.nroDocumento;
                        da.SelectCommand.Parameters.Add("@Sexo", SqlDbType.VarChar).Value = paciente.tipoSexo;
                        da.SelectCommand.Parameters.Add("@Gemelar", SqlDbType.VarChar).Value = paciente.gemelar;
                        da.SelectCommand.Parameters.Add("@FechaNacimiento", SqlDbType.VarChar).Value = paciente.fechaNacimiento;
                        da.SelectCommand.Parameters.Add("@HoraNacimiento", SqlDbType.VarChar).Value = paciente.horaNacimiento;
                        da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        resp = true;

                        return resp;
                    }
                }
            });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        ///


        public async Task<int> ModificarNroHistoria(string nroHistoriaActual, int idTipoNumeracion, string nroHistoria)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ModificarNroHistoria", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroHistoriaActual", nroHistoriaActual);
                cmd.Parameters.AddWithValue("@IdTipoNumeracion", idTipoNumeracion);
                cmd.Parameters.AddWithValue("@NroHistoria", nroHistoria);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return 1;
            }

        }

        public async Task<int> ModificarAfiliacionPaciente(string nroCuenta, string codigoSis, string idSiaSis)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ModificarAfiliacionPaciente", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", nroCuenta);
                cmd.Parameters.AddWithValue("@SisCodigo", codigoSis);
                cmd.Parameters.AddWithValue("@IdSiaSis", idSiaSis);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return 1;
            }

        }

        ///////////////////////////////////////KHOYOSI//////////////////////////////////////////////////////////
        public Task<DataSet> PacienteAntecedenteFamiliarSeleccionar(int idPaciente, int idUsuario)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesAntecedentesFamiliaresSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<bool> PacienteAntecedenteFamiliarModificar(PacienteAntecedenteFamiliar antecedente, int idUsuario)
        {
            bool resp = false;
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesAntecedentesFamiliaresModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = antecedente.IdPaciente;
                        da.SelectCommand.Parameters.Add("@Diabetes", SqlDbType.Int).Value = antecedente.Diabetes;
                        da.SelectCommand.Parameters.Add("@DiabetesDescripcion", SqlDbType.VarChar).Value = antecedente.DiabetesDescripcion;
                        da.SelectCommand.Parameters.Add("@Tbc", SqlDbType.Int).Value = antecedente.Tbc;
                        da.SelectCommand.Parameters.Add("@TbcDescripcion", SqlDbType.VarChar).Value = antecedente.TbcDescripcion;
                        da.SelectCommand.Parameters.Add("@Hta", SqlDbType.Int).Value = antecedente.Hta;
                        da.SelectCommand.Parameters.Add("@HtaDescripcion", SqlDbType.VarChar).Value = antecedente.HtaDescripcion;
                        da.SelectCommand.Parameters.Add("@Gemelares", SqlDbType.Int).Value = antecedente.Gemelares;
                        da.SelectCommand.Parameters.Add("@GemelaresDescripcion", SqlDbType.VarChar).Value = antecedente.GemelaresDescripcion;
                        da.SelectCommand.Parameters.Add("@Malformaciones", SqlDbType.Int).Value = antecedente.Malformaciones;
                        da.SelectCommand.Parameters.Add("@MalformacionesDescripcion", SqlDbType.VarChar).Value = antecedente.MalformacionesDescripcion;
                        da.SelectCommand.Parameters.Add("@Otros", SqlDbType.VarChar).Value = antecedente.Otros;
                        da.SelectCommand.Parameters.Add("@OtrosDescripcion", SqlDbType.VarChar).Value = antecedente.OtrosDescripcion;
                        da.SelectCommand.Parameters.Add("@Comentarios", SqlDbType.VarChar).Value = antecedente.Comentarios;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        da.Fill(ds);

                        resp = true;

                        return resp;
                    }
                }
            });
        }

        public Task<bool> PacienteAntecedenteFamiliarEliminar(int idPaciente, int idUsuario)
        {
            bool resp = false;
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_PacientesAntecedentesFamiliaresEliminar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        da.Fill(ds);

                        resp = true;

                        return resp;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        public Task<DataSet> SeleccionarUltimaCuentaHospitalizacion(string nroHistoriaClinica)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_SeleccionarUltimaCuentaHospitalizacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.Int).Value = nroHistoriaClinica;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public Task<DataSet> ListarPacientesByDatosPacienteAndNroDocumentoMadre(
            string NroDocumento, string NroHistoriaClinica, string ApellidoPaterno, string ApellidoMaterno,
            string PrimerNombre, string madreDocumento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListarPacientesByDatosPacienteAndNroDocumentoMadre";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroDocumento", SqlDbType.VarChar).Value = NroDocumento ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@NroHistoriaClinica", SqlDbType.VarChar).Value = NroHistoriaClinica ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@ApellidoPaterno", SqlDbType.VarChar).Value = ApellidoPaterno ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@ApellidoMaterno", SqlDbType.VarChar).Value = ApellidoMaterno ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@PrimerNombre", SqlDbType.VarChar).Value = PrimerNombre ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@madreDocumento", SqlDbType.VarChar).Value = madreDocumento ?? Convert.DBNull;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        } // JDELGADO001.2

        public async Task<DataSet> PacientesSeleccionarPorNroHistoriaClinicaAsync(string nroHistoria)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("PacientesSeleccionarPorNroHistoriaClinica", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@NroHistoriaClinica", nroHistoria);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }



        //se agrega la lista de hijos 09/2025
        //------------------------------------------------
        public async Task<DataSet> PacientesHijos_Listar(string madreDocumento)
        {
            //madreDocumento = "";
            DataSet dataSet = new DataSet();
            Console.WriteLine("✅ Conexión a BD abierta");
            try
            {
                using (SqlConnection conn = new Conexion().obtenerConexion())
                using (SqlCommand cmd = new SqlCommand("web_PacientesFiltrarHijos_Listar", conn))
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@madreDocumento", madreDocumento);

                    await conn.OpenAsync();
                    da.Fill(dataSet);
                    return dataSet;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Error al listar todos los detalles: {ex.Message}", ex);
            }
        }
        //------------------------------------------------



    }
}
