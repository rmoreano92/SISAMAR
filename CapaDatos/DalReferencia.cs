using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaEntidades;
using Microsoft.IdentityModel.Tokens;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalReferencia
    {
        /**
            ** Refactor 
        */
        public async Task<DataSet> SeleccionarDepartamentoProvinciaDistritoByIdDistrito(string IdDistrito)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarDepartamentoProvinciaDistritoByIdDistrito", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                ;
                cmd.Parameters.Add("@IdDistrito", SqlDbType.VarChar).Value = IdDistrito != null ? IdDistrito : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> ListarProgramacionServicionRefCon(string CodigoServicioSuSalud, DateTime? FechaProgramacion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarProgramacionServicionRefCon", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@CodigoServicioSuSalud", SqlDbType.VarChar).Value = CodigoServicioSuSalud != null ? CodigoServicioSuSalud : "";
                cmd.Parameters.Add("@FechaProgramacion", SqlDbType.DateTime).Value = FechaProgramacion ?? Convert.DBNull;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> ListarCupoCitas(string idProgrmacion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("listaCupos_CitasWeb", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@idProgrmacion", SqlDbType.VarChar).Value = idProgrmacion != null ? idProgrmacion : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> ListarCupoCitasProcedimiento(string idProgrmacion)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("listaCuposProcedimientosV3", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@idProgrmacion", SqlDbType.VarChar).Value = idProgrmacion != null ? idProgrmacion : "";

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }
        public async Task<DataSet> CrearModificarCitaRefcon(
            AtencionReferenciaRequest atencionReferenciaRequest, ReferenciaRefCon referenciaRefCon,
            List<ReferenciaRefCon> objDiagnosticos, List<ReferenciaRefCon> objTratamiento,
            int IdUsuarioAuditoria, int IdListItem)
        {
            DataSet ds = new DataSet();

            string xmlDiagnosticos = XmlUtil.Serializer(typeof(List<ReferenciaRefCon>), objDiagnosticos);
            string xmlTratamiento = XmlUtil.Serializer(typeof(List<ReferenciaRefCon>), objTratamiento);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarCitaRefcon", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdPaciente", (object)atencionReferenciaRequest.IdPaciente ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", (object)atencionReferenciaRequest.IdDocIdentidad ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NroDocumento", (object)atencionReferenciaRequest.NroDocumento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", (object)atencionReferenciaRequest.ApellidoPaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", (object)atencionReferenciaRequest.ApellidoMaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PrimerNombre", (object)atencionReferenciaRequest.PrimerNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SegundoNombre", (object)atencionReferenciaRequest.SegundoNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaNacimiento", (object)atencionReferenciaRequest.FechaNacimiento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoSexo", (object)atencionReferenciaRequest.IdTipoSexo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdEstadoCivil", (object)atencionReferenciaRequest.IdEstadoCivil ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdEtnia", (object)atencionReferenciaRequest.IdEtnia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdIdioma", (object)atencionReferenciaRequest.IdIdioma ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdGradoInstruccion", (object)atencionReferenciaRequest.IdGradoInstruccion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoOcupacion", (object)atencionReferenciaRequest.IdTipoOcupacion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdProcedencia", (object)atencionReferenciaRequest.IdProcedencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Religion", (object)atencionReferenciaRequest.Religion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Telefono", (object)atencionReferenciaRequest.Telefono ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Email", (object)atencionReferenciaRequest.Email ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NombrePadre", (object)atencionReferenciaRequest.NombrePadre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Observacion", (object)atencionReferenciaRequest.Observacion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NroOrdenHijo", (object)atencionReferenciaRequest.NumeroDeHijos ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@madreTipoDocumento", (object)atencionReferenciaRequest.MadreTipoDocumento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madreDocumento", (object)atencionReferenciaRequest.MadreDocumento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madreApellidoPaterno", (object)atencionReferenciaRequest.MadreApellidoPaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madreApellidoMaterno", (object)atencionReferenciaRequest.MadreApellidoMaterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madrePrimerNombre", (object)atencionReferenciaRequest.MadrePrimerNombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madreSegundoNombre", (object)atencionReferenciaRequest.MadreSegundoNombre ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@IdPaisDomicilio", (object)atencionReferenciaRequest.IdPaisDomicilio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDepartamentoDomicilio", (object)atencionReferenciaRequest.IdDepartamentoDomicilio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDistritoDomicilio", (object)atencionReferenciaRequest.IdDistritoDomicilio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdCentroPobladoDomicilio", (object)atencionReferenciaRequest.IdCentroPobladoDomicilio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DireccionDomicilio", (object)atencionReferenciaRequest.DireccionDomicilio ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@IdPaisProcedencia", (object)atencionReferenciaRequest.IdPaisProcedencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDepartamentoProcedencia", (object)atencionReferenciaRequest.IdDepartamentoProcedencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDistritoProcedencia", (object)atencionReferenciaRequest.IdDistritoProcedencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdCentroPobladoProcedencia", (object)atencionReferenciaRequest.IdCentroPobladoProcedencia ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@IdPaisNacimiento", (object)atencionReferenciaRequest.IdPaisNacimiento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDepartamentoNacimiento", (object)atencionReferenciaRequest.IdDepartamentoNacimiento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdDistritoNacimiento", (object)atencionReferenciaRequest.IdDistritoNacimiento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdCentroPobladoNacimiento", (object)atencionReferenciaRequest.IdCentroPobladoNacimiento ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", (object)atencionReferenciaRequest.IdCuentaAtencion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdAtencion", (object)atencionReferenciaRequest.IdAtencion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", (object)atencionReferenciaRequest.IdMedicoIngreso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", (object)atencionReferenciaRequest.IdServicioIngreso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdEspecialidadIngreso", (object)atencionReferenciaRequest.IdEspecialidadIngreso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Edad", (object)atencionReferenciaRequest.Edad ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoEdad", (object)atencionReferenciaRequest.IdTipoEdad ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdOrigenAtencion", (object)atencionReferenciaRequest.IdOrigenAtencion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdTipoServicio", (object)atencionReferenciaRequest.IdTipoServicio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaIngreso", (object)atencionReferenciaRequest.FechaIngreso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@HoraIngreso", (object)atencionReferenciaRequest.HoraIngreso ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@HoraFin", (object)atencionReferenciaRequest.HoraFin ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", (object)atencionReferenciaRequest.IdEstablecimientoOrigen ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", (object)atencionReferenciaRequest.NroReferenciaOrigen ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FuaCodigoPrestacion", (object)atencionReferenciaRequest.FuaCodigoPrestacion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdProgramacion", (object)atencionReferenciaRequest.IdProgramacion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IdProductoImg", (object)atencionReferenciaRequest.IdProductoImg ?? DBNull.Value);

                cmd.Parameters.AddWithValue("@idSiasis", (object)atencionReferenciaRequest.IdSiasis ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Codigo", (object)atencionReferenciaRequest.Codigo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@AfiliacionDisa", (object)atencionReferenciaRequest.AfiliacionDisa ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@AfiliacionTipoFormato", (object)atencionReferenciaRequest.AfiliacionTipoFormato ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@AfiliacionNroFormato", (object)atencionReferenciaRequest.AfiliacionNroFormato ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@AfiliacionNroIntegrante", (object)atencionReferenciaRequest.AfiliacionNroIntegrante ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DocumentoTipo", (object)atencionReferenciaRequest.DocumentoTipo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CodigoEstablAdscripcion", (object)atencionReferenciaRequest.CodigoEstablAdscripcion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@AfiliacionFecha", (object)atencionReferenciaRequest.AfiliacionFecha ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Paterno", (object)atencionReferenciaRequest.Paterno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Materno", (object)atencionReferenciaRequest.Materno ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Pnombre", (object)atencionReferenciaRequest.Pnombre ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Onombres", (object)atencionReferenciaRequest.Onombres ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Genero", (object)atencionReferenciaRequest.Genero ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Fnacimiento", (object)atencionReferenciaRequest.Fnacimiento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Estado", (object)atencionReferenciaRequest.Estado ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Fbaja", (object)atencionReferenciaRequest.Fbaja ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DocumentoNumero", (object)atencionReferenciaRequest.DocumentoNumero ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MotivoBaja", (object)atencionReferenciaRequest.MotivoBaja ?? DBNull.Value);


                // *REGISTRO DE REFERENCIA / CONTRA REFERENCIA
                cmd.Parameters.AddWithValue("@IdReferencia", (object)referenciaRefCon.IdReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CodigoEspecialidad", (object)referenciaRefCon.CodigoEspecialidad ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Condicion", (object)referenciaRefCon.Condicion ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaReferencia", (object)referenciaRefCon.FechaReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@HoraReferencia", (object)referenciaRefCon.HoraReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TipoTransporte", (object)referenciaRefCon.TipoTransporte ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ServicioOrigen", (object)referenciaRefCon.ServicioOrigen ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CodigoEstablecimientoOrigen", (object)referenciaRefCon.CodigoEstablecimientoOrigen ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ServicioDestino", (object)referenciaRefCon.ServicioDestino ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NumeroReferencia", (object)referenciaRefCon.NumeroReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaEnvio", (object)referenciaRefCon.FechaEnvio ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ResumeAnamnesis", (object)referenciaRefCon.ResumeAnamnesis ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ResumeExFisico", (object)referenciaRefCon.ResumeExFisico ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MotivoReferencia", (object)referenciaRefCon.MotivoReferencia ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TipoFinanciador", (object)referenciaRefCon.TipoFinanciador ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FechaAceptacion", (object)referenciaRefCon.FechaAceptacion ?? DBNull.Value);

                // --- Datos del Tutor ---
                cmd.Parameters.AddWithValue("@TipoDocumento_tutor", (object)referenciaRefCon.TipoDocumento_tutor ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NumeroDocumento_tutor", (object)referenciaRefCon.NumeroDocumento_tutor ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Nombres_tutor", (object)referenciaRefCon.Nombres_tutor ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PrimerApellido_tutor", (object)referenciaRefCon.PrimerApellido_tutor ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SegundoApellido_tutor", (object)referenciaRefCon.SegundoApellido_tutor ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Celular_tutor", (object)referenciaRefCon.Celular_tutor ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Correo_tutor", (object)referenciaRefCon.Correo_tutor ?? DBNull.Value);

                // --- Datos del Personal ---
                cmd.Parameters.AddWithValue("@TipoDocumento_personal", (object)referenciaRefCon.TipoDocumento_personal ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@NumeroDocumento_personal", (object)referenciaRefCon.NumeroDocumento_personal ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Nombres_personal", (object)referenciaRefCon.Nombres_personal ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PrimerApellido_personal", (object)referenciaRefCon.PrimerApellido_personal ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SegundoApellido_personal", (object)referenciaRefCon.SegundoApellido_personal ?? DBNull.Value);

                
                cmd.Parameters.Add("@Diagnosticos", SqlDbType.Xml).Value = xmlDiagnosticos;
                cmd.Parameters.Add("@Tratamiento", SqlDbType.Xml).Value = xmlTratamiento;

                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }

        public async Task<DataSet> SeleccionarProcedimientosImagenologiaRefcon()
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarProcedimientosImagenologiaRefcon", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }

        public async Task<DataSet> SeleccionarDiagnosticoByCodigoCIEsinPto(string codigoCIEsinPto)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarDiagnosticoByCodigoCIEsinPto", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("codigoCIEsinPto", codigoCIEsinPto);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }

        public async Task<DataSet> SeleccionarProcedimientoByCodigo(string Codigo)
        {

            DataSet dataSet = new DataSet();

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarProcedimientoByCodigo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("Codigo", Codigo);

                await conn.OpenAsync();

                da.Fill(dataSet);

                return dataSet;
            }

        }







        public DataSet ListarAtencionesReferencias(string Fecha, int IdServicio, int IdTipoServicio, int IdTipoRef, int IdUsuario, int Programacion)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {

                //cmd = MetodoDatos.CrearComando("web_ListarAtencionesReferencias");
                cmd = MetodoDatos.CrearComando("web_ListarAtencionesReferenciasV2");
                cmd.Parameters.AddWithValue("@fechaAtencion", Fecha);
                cmd.Parameters.AddWithValue("@idServicio", IdServicio);
                cmd.Parameters.AddWithValue("@idTipoServicio", IdTipoServicio);
                cmd.Parameters.AddWithValue("@idTipoRef", IdTipoRef);
                cmd.Parameters.AddWithValue("@idUsuario", IdUsuario);
                //cmd.Parameters.AddWithValue("@idProgramacion", Programacion);
                //dr = cmd.ExecuteReader ();

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

        public Task<DataSet> AtencionReferenciaSeleccionarPorIdCuenta(int idCuentaAtencion, int tipo)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_AtencionReferenciaSeleccionarPorIdCuenta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idcuentaAtencion", SqlDbType.Int).Value = idCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@tipo", SqlDbType.Int).Value = tipo;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> EmisionContraReferenciaModificar(ContraReferencia objContraRef, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmisionContraReferenciaModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@nroHoja", SqlDbType.VarChar, 500).Value = objContraRef.NroHojaContraReferencia == "" ? null : objContraRef.NroHojaContraReferencia;
                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = objContraRef.IdCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@ipressOrigen", SqlDbType.VarChar).Value = objContraRef.IpressOrigen;
                        da.SelectCommand.Parameters.Add("@ipressDestino", SqlDbType.VarChar).Value = objContraRef.IpressDestino;
                        da.SelectCommand.Parameters.Add("@servicioOrigen", SqlDbType.VarChar).Value = objContraRef.ServicioOrigen;
                        da.SelectCommand.Parameters.Add("@servicioDestino", SqlDbType.VarChar).Value = objContraRef.ServicioDestino;
                        da.SelectCommand.Parameters.Add("@especialidad", SqlDbType.VarChar).Value = objContraRef.Especialidad;
                        da.SelectCommand.Parameters.Add("@dxOrigen", SqlDbType.Text).Value = objContraRef.DxOrigen == "" ? null : objContraRef.DxOrigen;
                        da.SelectCommand.Parameters.Add("@dxIngreso", SqlDbType.Text).Value = objContraRef.DxIngreso == "" ? null : objContraRef.DxIngreso;
                        da.SelectCommand.Parameters.Add("@calificacion", SqlDbType.VarChar).Value = objContraRef.Calificacion == "" ? null : objContraRef.Calificacion;
                        da.SelectCommand.Parameters.Add("@tratamiento", SqlDbType.VarChar).Value = objContraRef.Tratamiento == "" ? null : objContraRef.Tratamiento;
                        da.SelectCommand.Parameters.Add("@recomendaciones", SqlDbType.Text).Value = objContraRef.Recomendaciones == "" ? null : objContraRef.Recomendaciones;
                        da.SelectCommand.Parameters.Add("@condicionUsuario", SqlDbType.Int).Value = objContraRef.CondicionUsuario;

                        da.SelectCommand.Parameters.Add("@descOrigen", SqlDbType.VarChar).Value = objContraRef.DescOrigen;
                        da.SelectCommand.Parameters.Add("@descServicioOrigen", SqlDbType.VarChar).Value = objContraRef.DescServicioOrigen;
                        da.SelectCommand.Parameters.Add("@descDestino", SqlDbType.VarChar).Value = objContraRef.DescDestino;
                        da.SelectCommand.Parameters.Add("@descServicioDestino", SqlDbType.VarChar).Value = objContraRef.DescServicioDestino;
                        da.SelectCommand.Parameters.Add("@dxEgreso", SqlDbType.VarChar).Value = objContraRef.DxEgreso;
                        da.SelectCommand.Parameters.Add("@descEspecialidad", SqlDbType.VarChar).Value = objContraRef.DescEspecialidad;

                        da.SelectCommand.Parameters.Add("@IdResponsable", SqlDbType.Int).Value = objContraRef.IdResponsable;
                        da.SelectCommand.Parameters.Add("@IdResponsableEESS", SqlDbType.Int).Value = objContraRef.IdResponsableEESS;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> EmisionReferenciaModificar(Referencia objRef, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_EmisionReferenciaModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@nroHoja", SqlDbType.VarChar).Value = objRef.NroHojaReferencia == "" ? null : objRef.NroHojaReferencia;
                        da.SelectCommand.Parameters.Add("@idCuentaAtencion", SqlDbType.Int).Value = objRef.IdCuentaAtencion;
                        da.SelectCommand.Parameters.Add("@ipressOrigen", SqlDbType.VarChar).Value = objRef.IpressOrigen;
                        da.SelectCommand.Parameters.Add("@ipressDestino", SqlDbType.VarChar).Value = objRef.IpressDestino;
                        da.SelectCommand.Parameters.Add("@servicioOrigen", SqlDbType.VarChar).Value = objRef.ServicioOrigen;
                        da.SelectCommand.Parameters.Add("@servicioDestino", SqlDbType.VarChar).Value = objRef.ServicioDestino;
                        da.SelectCommand.Parameters.Add("@Anamnesis", SqlDbType.Text).Value = objRef.Anamnesis == "" ? null : objRef.Anamnesis;
                        da.SelectCommand.Parameters.Add("@ExamenFisico", SqlDbType.Text).Value = objRef.ExamenFisico == "" ? null : objRef.ExamenFisico;
                        da.SelectCommand.Parameters.Add("@Tratamiento", SqlDbType.VarChar).Value = objRef.Tratamiento == "" ? null : objRef.Tratamiento;
                        da.SelectCommand.Parameters.Add("@Motivo", SqlDbType.Text).Value = objRef.Motivo == "" ? null : objRef.Motivo;
                        da.SelectCommand.Parameters.Add("@DetalleMotivo", SqlDbType.Text).Value = objRef.DetalleMotivo == "" ? null : objRef.DetalleMotivo;
                        da.SelectCommand.Parameters.Add("@Observaciones", SqlDbType.Text).Value = objRef.NotasObservaciones == "" ? null : objRef.NotasObservaciones;
                        da.SelectCommand.Parameters.Add("@especialidadDestino", SqlDbType.VarChar).Value = objRef.EspecialidadDestino;
                        da.SelectCommand.Parameters.Add("@Condicion", SqlDbType.Int).Value = objRef.CondicionPaciente;
                        da.SelectCommand.Parameters.Add("@Transporte", SqlDbType.Int).Value = objRef.TipoTransporte;

                        da.SelectCommand.Parameters.Add("@descOrigen", SqlDbType.VarChar).Value = objRef.DescOrigen;
                        da.SelectCommand.Parameters.Add("@descServicioOrigen", SqlDbType.VarChar).Value = objRef.DescServicioOrigen;
                        da.SelectCommand.Parameters.Add("@descDestino", SqlDbType.VarChar).Value = objRef.DescDestino;
                        da.SelectCommand.Parameters.Add("@descServicioDestino", SqlDbType.VarChar).Value = objRef.DescServicioDestino;
                        da.SelectCommand.Parameters.Add("@dxEgreso", SqlDbType.VarChar).Value = objRef.DxEgreso;
                        da.SelectCommand.Parameters.Add("@descEspecialidad", SqlDbType.VarChar).Value = objRef.DescEspecialidad;

                        da.SelectCommand.Parameters.Add("@IdResponsable", SqlDbType.Int).Value = objRef.IdResponsable;
                        da.SelectCommand.Parameters.Add("@IdResponsableEESS", SqlDbType.Int).Value = objRef.IdResponsableEESS;

                        da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public Task<DataSet> ActualizarPacienteRecibidoReferencias(int idReferencia)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ActualizarPacienteRecibidoReferencias";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@idReferencia", SqlDbType.Int).Value = idReferencia;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });

        }

        public async Task<Boolean> EliminarEmisionRefCon(int idRefCon, int tipoEmision)
        {
            bool nRpta = false;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_EliminarEmisionRefCon");
                cmd.Parameters.AddWithValue("@idRefCon", idRefCon);
                cmd.Parameters.AddWithValue("@tipoEmision", tipoEmision);
                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;
        }

        public async Task<Boolean> ActualizarEmisionRefCon(int idCuentaAtencion, int tipoDestino)
        {
            Boolean nRpta = false;
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("web_ActualizarEmisionRefCon");
                cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);
                cmd.Parameters.AddWithValue("@tipoDestino", tipoDestino);
                await cmd.ExecuteNonQueryAsync();
                nRpta = true;

            }
            catch (Exception ex)
            {
                nRpta = false;
                throw new Exception(ex.Message);
            }
            finally
            {
                cmd.Connection.Close();
            }
            return nRpta;

        }

        public DataSet DatosHojaRefCon(int idRefCon, int tipo)
        {
            DataSet ds = new DataSet();
            SqlCommand cmd = null;
            try
            {
                cmd = MetodoDatos.CrearComando("Web_DatosRefCon");
                cmd.Parameters.AddWithValue("@idRefCon", idRefCon);
                cmd.Parameters.AddWithValue("@tipo", tipo);
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

        public Task<DataSet> ServiciosFiltrar(string filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ServiciosFiltrar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = filtro;


                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> ReferenciaResponsableEESSSelecionar()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ReferenciaResponsableEESSSelecionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<(string, DataSet)> REFCONSP_REGISTRO_CITA(RefconMinsa objRef, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "REFCONSP_REGISTRO_CITA_V2";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;
                        da.SelectCommand.Parameters.Add("@tipFinanciador", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipFinanciador) ? null : objRef.TipFinanciador;
                        da.SelectCommand.Parameters.Add("@numeroSeguro", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.NumeroSeguro) ? null : objRef.NumeroSeguro;
                        da.SelectCommand.Parameters.Add("@fechaVencimientoSis", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.FechaVencimientoSis) ? null : objRef.FechaVencimientoSis;
                        da.SelectCommand.Parameters.Add("@tipDocumento", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipDocumento) ? null : objRef.TipDocumento;
                        da.SelectCommand.Parameters.Add("@dni", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Dni) ? null : objRef.Dni;
                        da.SelectCommand.Parameters.Add("@apePaterno", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.ApePaterno) ? null : objRef.ApePaterno;
                        da.SelectCommand.Parameters.Add("@apeMaterno", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.ApeMaterno) ? null : objRef.ApeMaterno;
                        da.SelectCommand.Parameters.Add("@nombres", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Nombres) ? null : objRef.Nombres;
                        da.SelectCommand.Parameters.Add("@fecNacimiento", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.FecNacimiento) ? null : objRef.FecNacimiento;
                        da.SelectCommand.Parameters.Add("@direccion", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Direccion) ? null : objRef.Direccion;
                        da.SelectCommand.Parameters.Add("@sexo", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Sexo) ? null : objRef.Sexo;
                        da.SelectCommand.Parameters.Add("@ubigeo1", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Ubigeo1) ? null : objRef.Ubigeo1;
                        da.SelectCommand.Parameters.Add("@ubigeo2", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Ubigeo2) ? null : objRef.Ubigeo2;
                        da.SelectCommand.Parameters.Add("@celular", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Celular) ? null : objRef.Celular;
                        da.SelectCommand.Parameters.Add("@condicionPaciente", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.CondicionPaciente) ? null : objRef.CondicionPaciente;
                        da.SelectCommand.Parameters.Add("@tipDocumentoMedico", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipDocumentoMedico) ? null : objRef.TipDocumentoMedico;
                        da.SelectCommand.Parameters.Add("@numDocumentoMedico", SqlDbType.VarChar).Value = string.IsNullOrEmpty(objRef.NumDocumentoMedico) ? null : objRef.NumDocumentoMedico;
                        da.SelectCommand.Parameters.Add("@fecActual", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.FecActual) ? null : objRef.FecActual;
                        da.SelectCommand.Parameters.Add("@fecSolicitudReferencia", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.FecSolicitudReferencia) ? null : objRef.FecSolicitudReferencia;
                        da.SelectCommand.Parameters.Add("@fecCita", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.FecCita) ? null : objRef.FecCita;
                        da.SelectCommand.Parameters.Add("@codServicio", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.CodServicio) ? null : objRef.CodServicio;
                        da.SelectCommand.Parameters.Add("@especialidad", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Especialidad) ? null : objRef.Especialidad;
                        da.SelectCommand.Parameters.Add("@nroReferencia", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.NroReferencia) ? null : objRef.NroReferencia;
                        da.SelectCommand.Parameters.Add("@resAnamnesis", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.ResAnamnesis) ? null : objRef.ResAnamnesis;
                        da.SelectCommand.Parameters.Add("@resExaFisico", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.ResExaFisico) ? null : objRef.ResExaFisico;
                        da.SelectCommand.Parameters.Add("@diagnostico1", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Diagnostico1) ? null : objRef.Diagnostico1;
                        da.SelectCommand.Parameters.Add("@tipoDiagnostico1", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipoDiagnostico1) ? null : objRef.TipoDiagnostico1;
                        da.SelectCommand.Parameters.Add("@diagnostico2", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Diagnostico2) ? null : objRef.Diagnostico2;
                        da.SelectCommand.Parameters.Add("@tipoDiagnostico2", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipoDiagnostico2) ? null : objRef.TipoDiagnostico2;
                        da.SelectCommand.Parameters.Add("@diagnostico3", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Diagnostico3) ? null : objRef.Diagnostico3;
                        da.SelectCommand.Parameters.Add("@tipoDiagnostico3", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipoDiagnostico3) ? null : objRef.TipoDiagnostico3;
                        da.SelectCommand.Parameters.Add("@codRenipressOrigen", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.CodRenipressOrigen) ? null : objRef.CodRenipressOrigen;
                        da.SelectCommand.Parameters.Add("@codRenipressDestino", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.CodRenipressDestino) ? null : objRef.CodRenipressDestino;
                        da.SelectCommand.Parameters.Add("@ubigeoRenipress", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.UbigeoRenipress) ? null : objRef.UbigeoRenipress;
                        da.SelectCommand.Parameters.Add("@cpt1", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt1) ? null : objRef.Cpt1;
                        da.SelectCommand.Parameters.Add("@cpt2", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt2) ? null : objRef.Cpt2;
                        da.SelectCommand.Parameters.Add("@cpt3", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt3) ? null : objRef.Cpt3;
                        da.SelectCommand.Parameters.Add("@cpt4", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt4) ? null : objRef.Cpt4;
                        da.SelectCommand.Parameters.Add("@cpt5", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt5) ? null : objRef.Cpt5;
                        da.SelectCommand.Parameters.Add("@cpt6", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt6) ? null : objRef.Cpt6;
                        da.SelectCommand.Parameters.Add("@cpt7", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt7) ? null : objRef.Cpt7;
                        da.SelectCommand.Parameters.Add("@cpt8", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt8) ? null : objRef.Cpt8;
                        da.SelectCommand.Parameters.Add("@cpt9", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.Cpt9) ? null : objRef.Cpt9;
                        da.SelectCommand.Parameters.Add("@tipDocumentoTutor", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.TipDocumentoTutor) ? null : objRef.TipDocumentoTutor;
                        da.SelectCommand.Parameters.Add("@numDocumentoTutor", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.NumDocumentoTutor) ? null : objRef.NumDocumentoTutor;
                        da.SelectCommand.Parameters.Add("@apePaternoTutor", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.ApePaternoTutor) ? null : objRef.ApePaternoTutor;
                        da.SelectCommand.Parameters.Add("@apeMaternoTutor", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.ApeMaternoTutor) ? null : objRef.ApeMaternoTutor;
                        da.SelectCommand.Parameters.Add("@nombreTutor", SqlDbType.VarChar, 500).Value = string.IsNullOrEmpty(objRef.NombreTutor) ? null : objRef.NombreTutor;
                        da.SelectCommand.Parameters.Add("@idReferencia", SqlDbType.Int).Value = objRef.IdReferencia;
                        da.SelectCommand.Parameters.Add("@RESULTADO", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;


                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        string nRpta = da.SelectCommand.Parameters["@RESULTADO"].Value.ToString();

                        return (nRpta, ds);
                    }
                }

            });

        }
    }
}
