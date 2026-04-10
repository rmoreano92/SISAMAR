using CapaDatos;
using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using WebAppSaludOcupacional.CapaEntidades;

namespace WebAppMaternidad.CapaDatos
{
    public class DalTamizajeNeonatalInmp
    {
        public async Task<DataSet> ListarEstablecimientosTamizajeIpress()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_ListarEstablecimientosTamizajeIpress", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarCierresByAnioAndIdInstitucion(int Anio, int IdInstitucion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_ListarCierresByAnioAndIdInstitucion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@IdInstitucion", IdInstitucion);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarMuestrasTamizajeNeonatalByIpress(DateTime FechaRegistro, int Anio, int IdEstablecimiento, int NroCierre, string NroDocumentoBusqueda, string NroApellidoPaternoBusqueda, string NroApellidoMaternoBusqueda, string NombresBusqueda, string NroDocumentoMadreBusqueda, int Tipo, string NroEnvio,
            string CodigoBarras, string NroCorrelativo, string ApellidoMaternoMadre, string ApellidoPaternoMadre, string NombresMadre, int EstablecimientoOrigen, int EstadoLab, int EstadoSis)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_ListarMuestrasTamizajeNeonatalByIpressV5", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@FechaRegistro", FechaRegistro);
                cmd.Parameters.AddWithValue("@Anio", Anio);
                cmd.Parameters.AddWithValue("@IdEstablecimiento", IdEstablecimiento);
                cmd.Parameters.AddWithValue("@NroCierre", NroCierre);
                cmd.Parameters.AddWithValue("@NroDocumentoBusqueda", NroDocumentoBusqueda);
                cmd.Parameters.AddWithValue("@NroApellidoPaternoBusqueda", NroApellidoPaternoBusqueda);
                cmd.Parameters.AddWithValue("@NroApellidoMaternoBusqueda", NroApellidoMaternoBusqueda);
                cmd.Parameters.AddWithValue("@NombresBusqueda", NombresBusqueda);
                cmd.Parameters.AddWithValue("@NroDocumentoMadreBusqueda", NroDocumentoMadreBusqueda);
                cmd.Parameters.AddWithValue("@NroEnvio", NroEnvio);

                cmd.Parameters.AddWithValue("@CodigoBarras", CodigoBarras);
                cmd.Parameters.AddWithValue("@NroCorrelativo", NroCorrelativo);
                cmd.Parameters.AddWithValue("@ApellidoMaternoMadre", ApellidoMaternoMadre);
                cmd.Parameters.AddWithValue("@ApellidoPaternoMadre", ApellidoPaternoMadre);
                cmd.Parameters.AddWithValue("@NombresMadre", NombresMadre);

                cmd.Parameters.AddWithValue("@Tipo", Tipo); // 1 - lab, 2 - sis

                cmd.Parameters.AddWithValue("@EstablecimientoOrigen", EstablecimientoOrigen); // 1 - lab, 2 - sis
                cmd.Parameters.AddWithValue("@EstadoLab", EstadoLab); // 1 - lab, 2 - sis
                cmd.Parameters.AddWithValue("@EstadoSis", EstadoSis); // 1 - lab, 2 - sis

                cmd.CommandTimeout = 0;

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarEmpleadosTomaMuestraByEstablecimiento(int IdEstablecimientoExterno)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..ListarEmpleadosTomaMuestraByEstablecimiento", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> ListarEmpleadosDigitanMuestrasTamizaje()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarEmpleadosDigitanMuestrasTamizaje", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo(string idSiasis, string Codigo)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_SeleccionarAfiliacionEstablecimientosExternosByIdSiaSisAndCodigo", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@idSiasis", idSiasis);
                cmd.Parameters.AddWithValue("@Codigo", Codigo);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<int> AgregarAfiliadosPorEstablecimientosExternos(SisFiliaciones sisFiliaciones, int IdUsuarioAuditoria) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_AgregarAfiliadosPorEstablecimientosExternos", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@idSiasis", sisFiliaciones.idSiasis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Codigo", sisFiliaciones.Codigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionDisa", sisFiliaciones.AfiliacionDisa ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionTipoFormato", sisFiliaciones.AfiliacionTipoFormato ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionNroFormato", sisFiliaciones.AfiliacionNroFormato ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionNroIntegrante", sisFiliaciones.AfiliacionNroIntegrante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DocumentoTipo", sisFiliaciones.DocumentoTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@CodigoEstablAdscripcion", sisFiliaciones.CodigoEstablAdscripcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionFecha", sisFiliaciones.AfiliacionFecha ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Paterno", sisFiliaciones.Paterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Materno", sisFiliaciones.Materno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Pnombre", sisFiliaciones.Pnombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Onombres", sisFiliaciones.Onombres ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Genero", sisFiliaciones.Genero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Fnacimiento", sisFiliaciones.Fnacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdDistritoDomicilio", sisFiliaciones.IdDistritoDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Estado", sisFiliaciones.Estado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Fbaja", sisFiliaciones.Fbaja ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DocumentoNumero", sisFiliaciones.DocumentoNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MotivoBaja", sisFiliaciones.MotivoBaja ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                
                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                return nRpta;
            }

        }

        public async Task<int> AgregarDatosRnTamizajeNeonatal(DatosRnTamizajeNeonatal datosRnTamizajeNeonatal) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_AgregarDatosRnTamizajeNeonatal", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@IdRnTamizaje", datosRnTamizajeNeonatal.IdRnTamizaje);
                cmd.Parameters.AddWithValue("@NroDocumento", datosRnTamizajeNeonatal.NroDocumento);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", datosRnTamizajeNeonatal.ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", datosRnTamizajeNeonatal.ApellidoMaterno);
                cmd.Parameters.AddWithValue("@PrimerNombre", datosRnTamizajeNeonatal.PrimerNombre);
                cmd.Parameters.AddWithValue("@SegundoNombre", datosRnTamizajeNeonatal.SegundoNombre);
                cmd.Parameters.AddWithValue("@FechaNacimiento", datosRnTamizajeNeonatal.FechaNacimiento);
                cmd.Parameters.AddWithValue("@HoraNacimiento", datosRnTamizajeNeonatal.HoraNacimiento);
                cmd.Parameters.AddWithValue("@IdTipoSexo", datosRnTamizajeNeonatal.IdTipoSexo);
                cmd.Parameters.AddWithValue("@HoraUltimaLactancia", datosRnTamizajeNeonatal.HoraUltimaLactancia);
                cmd.Parameters.AddWithValue("@Peso", datosRnTamizajeNeonatal.Peso);
                cmd.Parameters.AddWithValue("@Talla", datosRnTamizajeNeonatal.Talla);
                cmd.Parameters.AddWithValue("@Prematuro", datosRnTamizajeNeonatal.Prematuro);
                cmd.Parameters.AddWithValue("@Transfundido", datosRnTamizajeNeonatal.Transfundido);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", datosRnTamizajeNeonatal.IdEstablecimientoOrigen);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", datosRnTamizajeNeonatal.IdDocIdentidad);
                cmd.Parameters.AddWithValue("@NroDisaAfiliacion", datosRnTamizajeNeonatal.NroDisaAfiliacion);
                cmd.Parameters.AddWithValue("@TipoAfiliacion", datosRnTamizajeNeonatal.TipoAfiliacion);
                cmd.Parameters.AddWithValue("@NroAfiliacion", datosRnTamizajeNeonatal.NroAfiliacion);
                cmd.Parameters.AddWithValue("@IdTipoAfiliacion", datosRnTamizajeNeonatal.IdTipoAfiliacion);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                return nRpta;
            }
        }

        public async Task<int> AgregarMuestrasTamizajeNeonatalPorEstablecimientosExternos(MuestrasTamizajeNeonatalPorEstablecimientosExternos muestrasTamizaje, int IdRnTamizaje) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_AgregarMuestrasTamizajeNeonatalPorEstablecimientosExternosLaboratorio", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@IdRegistroTamizaje", muestrasTamizaje.IdRegistroTamizaje);
                cmd.Parameters.AddWithValue("@IdAutogenerado", muestrasTamizaje.IdAutogenerado);
                cmd.Parameters.AddWithValue("@IdInstitucion", muestrasTamizaje.IdInstitucion);
                cmd.Parameters.AddWithValue("@IdTipoInstitucion", muestrasTamizaje.IdTipoInstitucion);
                cmd.Parameters.AddWithValue("@NumeroCorrelativo", muestrasTamizaje.NumeroCorrelativo);
                cmd.Parameters.AddWithValue("@NroDocumentoMadre", muestrasTamizaje.NroDocumentoMadre);
                cmd.Parameters.AddWithValue("@NroHistoriaClinicaMadre", muestrasTamizaje.NroHistoriaClinicaMadre);
                cmd.Parameters.AddWithValue("@ApellidoPaternoMadre", muestrasTamizaje.ApellidoPaternoMadre);
                cmd.Parameters.AddWithValue("@ApellidoMaternoMadre", muestrasTamizaje.ApellidoMaternoMadre);
                cmd.Parameters.AddWithValue("@PrimerNombreMadre", muestrasTamizaje.PrimerNombreMadre);
                cmd.Parameters.AddWithValue("@SegundoNombreMadre", muestrasTamizaje.SegundoNombreMadre);
                cmd.Parameters.AddWithValue("@IdTipoSexoMadre", muestrasTamizaje.IdTipoSexoMadre);
                cmd.Parameters.AddWithValue("@EdadMadre", muestrasTamizaje.EdadMadre);
                cmd.Parameters.AddWithValue("@TiempoGestacion", muestrasTamizaje.TiempoGestacion);
                cmd.Parameters.AddWithValue("@Telefono", muestrasTamizaje.Telefono);
                cmd.Parameters.AddWithValue("@Direccion", muestrasTamizaje.Direccion);
                cmd.Parameters.AddWithValue("@IdSiaSisNeo", muestrasTamizaje.IdSiaSisNeo);
                cmd.Parameters.AddWithValue("@CodigoSisNeo", muestrasTamizaje.CodigoSisNeo);
                cmd.Parameters.AddWithValue("@IdPersonalTomaMuestra", muestrasTamizaje.IdPersonalTomaMuestra);
                cmd.Parameters.AddWithValue("@NroTarjeta", muestrasTamizaje.NroTarjeta);
                cmd.Parameters.AddWithValue("@NroReferencia", muestrasTamizaje.NroReferencia);
                cmd.Parameters.AddWithValue("@NroMuestra", muestrasTamizaje.NroMuestra);
                cmd.Parameters.AddWithValue("@MuestraTalon", muestrasTamizaje.MuestraTalon);
                cmd.Parameters.AddWithValue("@FechaTomaMuestra", muestrasTamizaje.FechaTomaMuestra);
                cmd.Parameters.AddWithValue("@HoraTomaMuestra", muestrasTamizaje.HoraTomaMuestra);
                cmd.Parameters.AddWithValue("@TSH", muestrasTamizaje.TSH);
                cmd.Parameters.AddWithValue("@OHP", muestrasTamizaje.OHP);
                cmd.Parameters.AddWithValue("@FEN", muestrasTamizaje.FEN);
                cmd.Parameters.AddWithValue("@GAL", muestrasTamizaje.GAL);
                cmd.Parameters.AddWithValue("@IRT", muestrasTamizaje.IRT);
                cmd.Parameters.AddWithValue("@OTRO", muestrasTamizaje.OTRO);
                cmd.Parameters.AddWithValue("@IdRnTamizaje", IdRnTamizaje);
                cmd.Parameters.AddWithValue("@FechaRecepcion", muestrasTamizaje.FechaRecepcion);
                cmd.Parameters.AddWithValue("@HoraRecepcion", muestrasTamizaje.HoraRecepcion);
                cmd.Parameters.AddWithValue("@ObservacionLaboratorio", muestrasTamizaje.ObservacionLaboratorio);

                cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", muestrasTamizaje.ObservacionSegundaMuestraTamizaje);
                cmd.Parameters.AddWithValue("@ObservacionSis", muestrasTamizaje.ObservacionSis);

                cmd.Parameters.AddWithValue("@FechaRecepcionSIS", muestrasTamizaje.FechaRecepcionSIS);
                cmd.Parameters.AddWithValue("@HoraRecepcionSIS", muestrasTamizaje.HoraRecepcionSIS);
                cmd.Parameters.AddWithValue("@IdResponsableMuestraMGP", muestrasTamizaje.IdResponsableMuestraMGP);
                cmd.Parameters.AddWithValue("@IdResponsableRecepcionaSISMGP", muestrasTamizaje.IdResponsableRecepcionaSISMGP);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", muestrasTamizaje.IdEstablecimientoOrigen);

                cmd.Parameters.AddWithValue("@IdMotivoRechazo", muestrasTamizaje.IdMotivoRechazo);
                cmd.Parameters.AddWithValue("@OtroMotivoRechazo", muestrasTamizaje.OtroMotivoRechazo);
                cmd.Parameters.AddWithValue("@TSHRechazado", muestrasTamizaje.TSHRechazado);
                cmd.Parameters.AddWithValue("@OHPRechazado", muestrasTamizaje.OHPRechazado);
                cmd.Parameters.AddWithValue("@FENRechazado", muestrasTamizaje.FENRechazado);
                cmd.Parameters.AddWithValue("@GALRechazado", muestrasTamizaje.GALRechazado);
                cmd.Parameters.AddWithValue("@IRTRechazado", muestrasTamizaje.IRTRechazado);
                cmd.Parameters.AddWithValue("@OTRORechazado", muestrasTamizaje.OTRORechazado);

                cmd.Parameters.AddWithValue("@CorrelativoLab", muestrasTamizaje.CorrelativoLab);

                cmd.Parameters.AddWithValue("@IdResponsableMuestraLaboratorio", muestrasTamizaje.IdResponsableMuestraLaboratorio);
                cmd.Parameters.AddWithValue("@FechaSospechoso", muestrasTamizaje.FechaSospechoso);
                cmd.Parameters.AddWithValue("@HoraSospecha", muestrasTamizaje.HoraSospecha);
                cmd.Parameters.AddWithValue("@PersonalQueRealizoTomaMuestra", muestrasTamizaje.PersonalQueRealizoTomaMuestra);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                //await conn.CloseAsync();

                return nRpta;
            }
        }

        public async Task<int> AgregarDatosRnTamizajeNeonatalMGP(DatosRnTamizajeNeonatal datosRnTamizajeNeonatal) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_AgregarDatosRnTamizajeNeonatal", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@IdRnTamizaje", datosRnTamizajeNeonatal.IdRnTamizaje);
                cmd.Parameters.AddWithValue("@NroDocumento", datosRnTamizajeNeonatal.NroDocumento);
                cmd.Parameters.AddWithValue("@ApellidoPaterno", datosRnTamizajeNeonatal.ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", datosRnTamizajeNeonatal.ApellidoMaterno);
                cmd.Parameters.AddWithValue("@PrimerNombre", datosRnTamizajeNeonatal.PrimerNombre);
                cmd.Parameters.AddWithValue("@SegundoNombre", datosRnTamizajeNeonatal.SegundoNombre);
                cmd.Parameters.AddWithValue("@FechaNacimiento", datosRnTamizajeNeonatal.FechaNacimiento);
                cmd.Parameters.AddWithValue("@HoraNacimiento", datosRnTamizajeNeonatal.HoraNacimiento);
                cmd.Parameters.AddWithValue("@IdTipoSexo", datosRnTamizajeNeonatal.IdTipoSexo);
                cmd.Parameters.AddWithValue("@HoraUltimaLactancia", datosRnTamizajeNeonatal.HoraUltimaLactancia);
                cmd.Parameters.AddWithValue("@Peso", datosRnTamizajeNeonatal.Peso);
                cmd.Parameters.AddWithValue("@Talla", datosRnTamizajeNeonatal.Talla);
                cmd.Parameters.AddWithValue("@Prematuro", datosRnTamizajeNeonatal.Prematuro);
                cmd.Parameters.AddWithValue("@Transfundido", datosRnTamizajeNeonatal.Transfundido);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", datosRnTamizajeNeonatal.IdEstablecimientoOrigen);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", datosRnTamizajeNeonatal.IdDocIdentidad);
                cmd.Parameters.AddWithValue("@NroDisaAfiliacion", datosRnTamizajeNeonatal.NroDisaAfiliacion);
                cmd.Parameters.AddWithValue("@TipoAfiliacion", datosRnTamizajeNeonatal.TipoAfiliacion);
                cmd.Parameters.AddWithValue("@NroAfiliacion", datosRnTamizajeNeonatal.NroAfiliacion);
                cmd.Parameters.AddWithValue("@IdTipoAfiliacion", datosRnTamizajeNeonatal.IdTipoAfiliacion);
                //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                await conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                return nRpta;
            }
        }

        public Task<int> AgregarMuestrasTamizajeNeonatalPorEstablecimientosMGP(MuestrasTamizajeNeonatalPorEstablecimientosExternos muestrasTamizaje, int IdPaciente, int IdAtencion, int IdRnTamizaje, int Estado, 
            int RegistroIpress, string ObservacionLaboratorio, DateTime FechaRecepcion, string HoraRecepcion) // // JDELGADO003-C
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
                        string sql = "Web_AgregarMuestrasTamizajeNeonatalPorEstablecimientosMGP";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@IdRegistroTamizaje", muestrasTamizaje.IdRegistroTamizaje);
                        cmd.Parameters.AddWithValue("@IdAutogenerado", muestrasTamizaje.IdAutogenerado);
                        cmd.Parameters.AddWithValue("@IdInstitucion", muestrasTamizaje.IdInstitucion);
                        cmd.Parameters.AddWithValue("@IdTipoInstitucion", muestrasTamizaje.IdTipoInstitucion);
                        cmd.Parameters.AddWithValue("@NumeroCorrelativo", muestrasTamizaje.NumeroCorrelativo);
                        cmd.Parameters.AddWithValue("@NroDocumentoMadre", muestrasTamizaje.NroDocumentoMadre);
                        cmd.Parameters.AddWithValue("@NroHistoriaClinicaMadre", muestrasTamizaje.NroHistoriaClinicaMadre);
                        cmd.Parameters.AddWithValue("@ApellidoPaternoMadre", muestrasTamizaje.ApellidoPaternoMadre);
                        cmd.Parameters.AddWithValue("@ApellidoMaternoMadre", muestrasTamizaje.ApellidoMaternoMadre);
                        cmd.Parameters.AddWithValue("@PrimerNombreMadre", muestrasTamizaje.PrimerNombreMadre);
                        cmd.Parameters.AddWithValue("@SegundoNombreMadre", muestrasTamizaje.SegundoNombreMadre);
                        cmd.Parameters.AddWithValue("@IdTipoSexoMadre", muestrasTamizaje.IdTipoSexoMadre);
                        cmd.Parameters.AddWithValue("@EdadMadre", muestrasTamizaje.EdadMadre);
                        cmd.Parameters.AddWithValue("@TiempoGestacion", muestrasTamizaje.TiempoGestacion);
                        cmd.Parameters.AddWithValue("@Telefono", muestrasTamizaje.Telefono);
                        cmd.Parameters.AddWithValue("@Direccion", muestrasTamizaje.Direccion);
                        cmd.Parameters.AddWithValue("@IdSiaSisNeo", muestrasTamizaje.IdSiaSisNeo);
                        cmd.Parameters.AddWithValue("@CodigoSisNeo", muestrasTamizaje.CodigoSisNeo);
                        cmd.Parameters.AddWithValue("@IdPersonalTomaMuestra", muestrasTamizaje.IdPersonalTomaMuestra);
                        cmd.Parameters.AddWithValue("@NroTarjeta", muestrasTamizaje.NroTarjeta);
                        cmd.Parameters.AddWithValue("@NroReferencia", muestrasTamizaje.NroReferencia);
                        cmd.Parameters.AddWithValue("@NroMuestra", muestrasTamizaje.NroMuestra);
                        cmd.Parameters.AddWithValue("@MuestraTalon", muestrasTamizaje.MuestraTalon);
                        cmd.Parameters.AddWithValue("@FechaTomaMuestra", muestrasTamizaje.FechaTomaMuestra);
                        cmd.Parameters.AddWithValue("@HoraTomaMuestra", muestrasTamizaje.HoraTomaMuestra);
                        cmd.Parameters.AddWithValue("@TSH", muestrasTamizaje.TSH);
                        cmd.Parameters.AddWithValue("@OHP", muestrasTamizaje.OHP);
                        cmd.Parameters.AddWithValue("@FEN", muestrasTamizaje.FEN);
                        cmd.Parameters.AddWithValue("@GAL", muestrasTamizaje.GAL);
                        cmd.Parameters.AddWithValue("@IRT", muestrasTamizaje.IRT);
                        cmd.Parameters.AddWithValue("@OTRO", muestrasTamizaje.OTRO);
                        cmd.Parameters.AddWithValue("@IdRnTamizaje", IdRnTamizaje);
                        cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                        cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                        cmd.Parameters.AddWithValue("@Estado", Estado);
                        cmd.Parameters.AddWithValue("@RegistroIpress", RegistroIpress);
                        cmd.Parameters.AddWithValue("@ObservacionLaboratorio", ObservacionLaboratorio);
                        cmd.Parameters.AddWithValue("@FechaRecepcion", FechaRecepcion);
                        cmd.Parameters.AddWithValue("@HoraRecepcion", HoraRecepcion);

                        cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", muestrasTamizaje.ObservacionSegundaMuestraTamizaje);
                        cmd.Parameters.AddWithValue("@ObservacionSis", muestrasTamizaje.ObservacionSis);

                        cmd.Parameters.AddWithValue("@FechaRecepcionSIS", muestrasTamizaje.FechaRecepcionSIS);
                        cmd.Parameters.AddWithValue("@HoraRecepcionSIS", muestrasTamizaje.HoraRecepcionSIS);
                        cmd.Parameters.AddWithValue("@IdResponsableMuestraMGP", muestrasTamizaje.IdResponsableMuestraMGP);
                        cmd.Parameters.AddWithValue("@IdResponsableRecepcionaSISMGP", muestrasTamizaje.IdResponsableRecepcionaSISMGP);
                        cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", muestrasTamizaje.IdEstablecimientoOrigen);


                        cmd.Parameters.AddWithValue("@IdMotivoRechazo", muestrasTamizaje.IdMotivoRechazo);
                        cmd.Parameters.AddWithValue("@OtroMotivoRechazo", muestrasTamizaje.OtroMotivoRechazo);
                        cmd.Parameters.AddWithValue("@TSHRechazado", muestrasTamizaje.TSHRechazado);
                        cmd.Parameters.AddWithValue("@OHPRechazado", muestrasTamizaje.OHPRechazado);
                        cmd.Parameters.AddWithValue("@FENRechazado", muestrasTamizaje.FENRechazado);
                        cmd.Parameters.AddWithValue("@GALRechazado", muestrasTamizaje.GALRechazado);
                        cmd.Parameters.AddWithValue("@IRTRechazado", muestrasTamizaje.IRTRechazado);
                        cmd.Parameters.AddWithValue("@OTRORechazado", muestrasTamizaje.OTRORechazado);

                        cmd.Parameters.AddWithValue("@CorrelativoLab", muestrasTamizaje.CorrelativoLab);

                        cmd.Parameters.AddWithValue("@IdResponsableMuestraLaboratorio", muestrasTamizaje.IdResponsableMuestraLaboratorio);
                        cmd.Parameters.AddWithValue("@FechaSospechoso", muestrasTamizaje.FechaSospechoso);
                        cmd.Parameters.AddWithValue("@HoraSospecha", muestrasTamizaje.HoraSospecha);
                        cmd.Parameters.AddWithValue("@PersonalQueRealizoTomaMuestra", muestrasTamizaje.PersonalQueRealizoTomaMuestra);

                        //cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public async Task<int> ActualizarEstadoMuestraParaSIS(int IdRegistroTamizaje, int EstadoSIS, int IdAtencion, int IdPaciente, String nroEnvioSis, String nroReferenciaOrigenSIS, String nroReferenciaDestinoSIS, String ObservacionSegundaMuestraTamizaje, String ObservacionSis,
            DateTime? FechaRecepcionSIS, string HoraRecepcionSIS, int IdResponsableMuestraMGP, int IdResponsableRecepcionaSISMGP, int IdEstablecimientoOrigen) // // JDELGADO003-C
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_ActualizarEstadoMuestraParaSIS", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdRegistroTamizaje", IdRegistroTamizaje);
                cmd.Parameters.AddWithValue("@EstadoSIS", EstadoSIS);
                cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@nroEnvioSis", nroEnvioSis);
                cmd.Parameters.AddWithValue("@nroReferenciaOrigenSIS", nroReferenciaOrigenSIS);
                cmd.Parameters.AddWithValue("@nroReferenciaDestinoSIS", nroReferenciaDestinoSIS);
                cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", ObservacionSegundaMuestraTamizaje);
                cmd.Parameters.AddWithValue("@ObservacionSis", ObservacionSis);

                cmd.Parameters.AddWithValue("@FechaRecepcionSIS", FechaRecepcionSIS);
                cmd.Parameters.AddWithValue("@HoraRecepcionSIS", HoraRecepcionSIS);
                cmd.Parameters.AddWithValue("@IdResponsableMuestraMGP", IdResponsableMuestraMGP);
                cmd.Parameters.AddWithValue("@IdResponsableRecepcionaSISMGP", IdResponsableRecepcionaSISMGP);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", IdEstablecimientoOrigen);


                await conn.OpenAsync();
                nRpta = await cmd.ExecuteNonQueryAsync();
                //await conn.CloseAsync();

                return nRpta;
            }

            
        }

        public Task<int> ActualizarEstadoMuestraParaSISMGP(int IdRegistroTamizaje, int EstadoSIS, int IdAtencion, int IdPaciente, String nroEnvioSis, String nroReferenciaOrigenSIS, String nroReferenciaDestinoSIS, String ObservacionSegundaMuestraTamizaje, String ObservacionSis,
            DateTime? FechaRecepcionSIS, string HoraRecepcionSIS, int IdResponsableMuestraMGP, int IdResponsableRecepcionaSISMGP, int IdEstablecimientoOrigen) // // JDELGADO003-C
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
                        string sql = "Web_ActualizarEstadoMuestraParaSISMGP";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;


                        cmd.Parameters.AddWithValue("@IdRegistroTamizaje", IdRegistroTamizaje);
                        cmd.Parameters.AddWithValue("@EstadoSIS", EstadoSIS);
                        cmd.Parameters.AddWithValue("@IdAtencion", IdAtencion);
                        cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                        cmd.Parameters.AddWithValue("@nroEnvioSis", nroEnvioSis);
                        cmd.Parameters.AddWithValue("@nroReferenciaOrigenSIS", nroReferenciaOrigenSIS);
                        cmd.Parameters.AddWithValue("@nroReferenciaDestinoSIS", nroReferenciaDestinoSIS);
                        cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", ObservacionSegundaMuestraTamizaje);
                        cmd.Parameters.AddWithValue("@ObservacionSis", ObservacionSis);

                        cmd.Parameters.AddWithValue("@FechaRecepcionSIS", FechaRecepcionSIS);
                        cmd.Parameters.AddWithValue("@HoraRecepcionSIS", HoraRecepcionSIS);
                        cmd.Parameters.AddWithValue("@IdResponsableMuestraMGP", IdResponsableMuestraMGP);
                        cmd.Parameters.AddWithValue("@IdResponsableRecepcionaSISMGP", IdResponsableRecepcionaSISMGP);
                        cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", IdEstablecimientoOrigen);

                        cmd.ExecuteNonQuery();

                        return nRpta;
                    }
                }
            });
        }

        public async Task<DataSet> SeleccionarPacienteConHistoria(string ApellidoPaterno, string ApellidoMaterno, string Nombres, int IdDocIdentidad, string NroDocumento)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_SeleccionarPacienteConHistoria", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ApellidoPaterno", ApellidoPaterno);
                cmd.Parameters.AddWithValue("@ApellidoMaterno", ApellidoMaterno);
                cmd.Parameters.AddWithValue("@Nombres", Nombres);
                cmd.Parameters.AddWithValue("@IdDocIdentidad", IdDocIdentidad);
                cmd.Parameters.AddWithValue("@NroDocumento", NroDocumento);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        ////////////////////////////////////KHOYOSI/////////////////////////////////////////
        public Task<DataSet> ExamenLaboratorioTamizajeSeleccionar(int idCuentaAtencion) 
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();

            return Task.Run(() => {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ExamenLaboratorioTamizajeSeleccionarPorCuenta";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                            da.SelectCommand = cmd;
                            da.Fill(ds);
                        }
                        catch (Exception ex)
                        {
                            ds = null;
                            throw new Exception(ex.Message);
                        }

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> CorrelativoLaboratorioTamizajeSeleccionar(int correlativoLab)
        {

            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("web_CorrelativoLaboratorioTamizajeSeleccionar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@correlativoLab", correlativoLab);
                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<Boolean> AprobacionTamizajeLaboratorio(int idAtencion, int idMovimiento, int correlativoLab, int estadoAprobacion, int idUsuario, int IdRegistroTamizaje)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool resp = false;

            return Task.Run(() => {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_AprobacionTamizajeLaboratorio";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@idEstadoLab", estadoAprobacion);
                            cmd.Parameters.AddWithValue("@correlativoLab", correlativoLab);
                            cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);
                            cmd.Parameters.AddWithValue("@IdRegistroTamizaje", IdRegistroTamizaje);

                            da.SelectCommand = cmd;
                            da.Fill(ds);

                            resp = true;
                        }
                        catch (Exception ex)
                        {
                            ds = null;
                            resp = false;
                            throw new Exception(ex.Message);
                        }

                        return resp;
                    }
                }
            });
        }
        ////////////////////////////////////////////////////////////////////////////////////

        public Task<Boolean> AprobacionTamizajeLaboratorioMGP(int idAtencion, int idMovimiento, int correlativoLab, int estadoAprobacion, int idUsuario)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool resp = false;

            return Task.Run(() => {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_AprobacionTamizajeLaboratorioMGP";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandTimeout = 0;
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idAtencion", idAtencion);
                            cmd.Parameters.AddWithValue("@idMovimiento", idMovimiento);
                            cmd.Parameters.AddWithValue("@idEstadoLab", estadoAprobacion);
                            cmd.Parameters.AddWithValue("@correlativoLab", correlativoLab);
                            cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);

                            da.SelectCommand = cmd;
                            da.Fill(ds);

                            resp = true;
                        }
                        catch (Exception ex)
                        {
                            ds = null;
                            resp = false;
                            throw new Exception(ex.Message);
                        }

                        return resp;
                    }
                }
            });
        }

        public async Task<DataSet> ListarMuestrasTamizajeByNroDocumentoMadre(string NroDocumentoMadre)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_ListarMuestrasTamizajeByNroDocumentoMadre", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NroDocumentoMadre", NroDocumentoMadre);
                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<DataSet> BuscarEstablecimientoByCodigoNombre(string Filtro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                using (SqlDataAdapter da = new SqlDataAdapter())
                {
                    string sql = "Web_BuscarEstablecimientoByCodigoNombre";
                    da.SelectCommand = new SqlCommand(sql, conn);
                    da.SelectCommand.CommandType = CommandType.StoredProcedure;

                    da.SelectCommand.Parameters.Add("@Filtro", SqlDbType.VarChar).Value = Filtro == null ? "" : Filtro;


                    DataSet ds = new DataSet();
                    da.Fill(ds);

                    return ds;
                }

            });


        }
        public async Task<DataSet> SeleccionarEstadosMuestra()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("STNEO..Web_SeleccionarEstados", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
        public async Task<DataSet> ListarMotivosRechazoTamizaje()  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ListarMotivosRechazoTamizaje", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;


                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public Task<DataSet> AnularFUATamizajeNeonatal(int IdCuentaAtencion) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_AnularFUATamizajeNeonatal";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> RolesPermisosXidEmpleadoXidPermiso(int IdUsuario, int IdPermiso) // JDELGADO003-C
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "RolesPermisosXidEmpleadoXidPermiso";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@IdUsuario", IdUsuario);
                        da.SelectCommand.Parameters.AddWithValue("@IdPermiso", IdPermiso);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public async Task<DataSet> CrearModificarRegistroTamizajeNeonatal(
            Paciente paciente, Atencion atencion, SisFiliaciones sisFiliaciones, DatosRnTamizajeNeonatal datosRnTamizajeNeonatal,
            MuestrasTamizajeNeonatalPorEstablecimientosExternos muestrasTamizaje, LaboratorioMovimiento laboratorio, 
            List<InsumoCPT> dsInsumosCPT, List<ProductoCPT> dsProductosCPT,int registroIpress, int TipoRegistro, int IdUsuarioAuditoria, int IdListItem)
        {
            DataSet ds = new DataSet();

            string xmlInsumosCPT, xmlProductosCPT;
            xmlInsumosCPT = XmlUtil.Serializer(typeof(List<InsumoCPT>), dsInsumosCPT);
            xmlProductosCPT = XmlUtil.Serializer(typeof(List<ProductoCPT>), dsProductosCPT);

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarRegistroTamizajeNeonatal", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {

                cmd.CommandType = CommandType.StoredProcedure;

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
                cmd.Parameters.AddWithValue("@madreDocumento", (object)paciente.madreDocumento ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@madreTipoDocumento", paciente.madreTipoDocumento == 0 ? DBNull.Value : (object)paciente.madreTipoDocumento);

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", atencion.idCuentaAtencion);
                cmd.Parameters.AddWithValue("@IdAtencion", atencion.idAtencion);
                cmd.Parameters.AddWithValue("@IdMedicoIngreso", atencion.idMedicoIngreso);
                cmd.Parameters.AddWithValue("@IdServicioIngreso", atencion.idServicioIngreso);
                cmd.Parameters.AddWithValue("@IdEspecialidadIngreso", atencion.idEspecialidadIngreso);
                cmd.Parameters.AddWithValue("@FechaIngreso", atencion.fechaIngreso);
                cmd.Parameters.AddWithValue("@HoraIngreso", atencion.horaIngreso);

                cmd.Parameters.AddWithValue("@idSiasis", sisFiliaciones.idSiasis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Codigo", sisFiliaciones.Codigo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionDisa", sisFiliaciones.AfiliacionDisa ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionTipoFormato", sisFiliaciones.AfiliacionTipoFormato ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionNroFormato", sisFiliaciones.AfiliacionNroFormato ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionNroIntegrante", sisFiliaciones.AfiliacionNroIntegrante ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DocumentoTipo", sisFiliaciones.DocumentoTipo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@CodigoEstablAdscripcion", sisFiliaciones.CodigoEstablAdscripcion ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@AfiliacionFecha", sisFiliaciones.AfiliacionFecha ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Paterno", sisFiliaciones.Paterno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Materno", sisFiliaciones.Materno ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Pnombre", sisFiliaciones.Pnombre ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Onombres", sisFiliaciones.Onombres ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Genero", sisFiliaciones.Genero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Fnacimiento", sisFiliaciones.Fnacimiento ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@IdDistritoDomicilio", sisFiliaciones.IdDistritoDomicilio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Estado", sisFiliaciones.Estado ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Fbaja", sisFiliaciones.Fbaja ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@DocumentoNumero", sisFiliaciones.DocumentoNumero ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@MotivoBaja", sisFiliaciones.MotivoBaja ?? Convert.DBNull);


                cmd.Parameters.AddWithValue("@IdRnTamizaje", datosRnTamizajeNeonatal.IdRnTamizaje);
                cmd.Parameters.AddWithValue("@HoraNacimiento", datosRnTamizajeNeonatal.HoraNacimiento);
                cmd.Parameters.AddWithValue("@HoraUltimaLactancia", datosRnTamizajeNeonatal.HoraUltimaLactancia);
                cmd.Parameters.AddWithValue("@Peso", datosRnTamizajeNeonatal.Peso);
                cmd.Parameters.AddWithValue("@Talla", datosRnTamizajeNeonatal.Talla);
                cmd.Parameters.AddWithValue("@Prematuro", datosRnTamizajeNeonatal.Prematuro);
                cmd.Parameters.AddWithValue("@Transfundido", datosRnTamizajeNeonatal.Transfundido);
                cmd.Parameters.AddWithValue("@IdEstablecimientoOrigen", datosRnTamizajeNeonatal.IdEstablecimientoOrigen);
                cmd.Parameters.AddWithValue("@NroDisaAfiliacion", datosRnTamizajeNeonatal.NroDisaAfiliacion);
                cmd.Parameters.AddWithValue("@TipoAfiliacion", datosRnTamizajeNeonatal.TipoAfiliacion);
                cmd.Parameters.AddWithValue("@NroAfiliacion", datosRnTamizajeNeonatal.NroAfiliacion);
                cmd.Parameters.AddWithValue("@IdTipoAfiliacion", datosRnTamizajeNeonatal.IdTipoAfiliacion);


                cmd.Parameters.AddWithValue("@IdRegistroTamizaje", muestrasTamizaje.IdRegistroTamizaje);
                cmd.Parameters.AddWithValue("@IdAutogenerado", muestrasTamizaje.IdAutogenerado);
                cmd.Parameters.AddWithValue("@IdInstitucion", muestrasTamizaje.IdInstitucion);
                cmd.Parameters.AddWithValue("@IdTipoInstitucion", muestrasTamizaje.IdTipoInstitucion);
                cmd.Parameters.AddWithValue("@NumeroCorrelativo", muestrasTamizaje.NumeroCorrelativo);
                cmd.Parameters.AddWithValue("@NroDocumentoMadre", muestrasTamizaje.NroDocumentoMadre);
                cmd.Parameters.AddWithValue("@NroHistoriaClinicaMadre", muestrasTamizaje.NroHistoriaClinicaMadre);
                cmd.Parameters.AddWithValue("@ApellidoPaternoMadre", muestrasTamizaje.ApellidoPaternoMadre);
                cmd.Parameters.AddWithValue("@ApellidoMaternoMadre", muestrasTamizaje.ApellidoMaternoMadre);
                cmd.Parameters.AddWithValue("@PrimerNombreMadre", muestrasTamizaje.PrimerNombreMadre);
                cmd.Parameters.AddWithValue("@SegundoNombreMadre", muestrasTamizaje.SegundoNombreMadre);
                cmd.Parameters.AddWithValue("@IdTipoSexoMadre", muestrasTamizaje.IdTipoSexoMadre);
                cmd.Parameters.AddWithValue("@EdadMadre", muestrasTamizaje.EdadMadre);
                cmd.Parameters.AddWithValue("@TiempoGestacion", muestrasTamizaje.TiempoGestacion);
                cmd.Parameters.AddWithValue("@Telefono", muestrasTamizaje.Telefono);
                cmd.Parameters.AddWithValue("@Direccion", muestrasTamizaje.Direccion);
                cmd.Parameters.AddWithValue("@IdPersonalTomaMuestra", muestrasTamizaje.IdPersonalTomaMuestra);
                cmd.Parameters.AddWithValue("@NroTarjeta", muestrasTamizaje.NroTarjeta);
                cmd.Parameters.AddWithValue("@NroReferencia", muestrasTamizaje.NroReferencia);
                cmd.Parameters.AddWithValue("@NroMuestra", muestrasTamizaje.NroMuestra);
                cmd.Parameters.AddWithValue("@MuestraTalon", muestrasTamizaje.MuestraTalon);
                cmd.Parameters.AddWithValue("@FechaTomaMuestra", muestrasTamizaje.FechaTomaMuestra);
                cmd.Parameters.AddWithValue("@HoraTomaMuestra", muestrasTamizaje.HoraTomaMuestra);
                cmd.Parameters.AddWithValue("@TSH", muestrasTamizaje.TSH);
                cmd.Parameters.AddWithValue("@OHP", muestrasTamizaje.OHP);
                cmd.Parameters.AddWithValue("@FEN", muestrasTamizaje.FEN);
                cmd.Parameters.AddWithValue("@GAL", muestrasTamizaje.GAL);
                cmd.Parameters.AddWithValue("@IRT", muestrasTamizaje.IRT);
                cmd.Parameters.AddWithValue("@OTRO", muestrasTamizaje.OTRO);
                cmd.Parameters.AddWithValue("@FechaRecepcion", muestrasTamizaje.FechaRecepcion);
                cmd.Parameters.AddWithValue("@HoraRecepcion", muestrasTamizaje.HoraRecepcion);
                cmd.Parameters.AddWithValue("@ObservacionLaboratorio", muestrasTamizaje.ObservacionLaboratorio);
                cmd.Parameters.AddWithValue("@ObservacionSegundaMuestraTamizaje", muestrasTamizaje.ObservacionSegundaMuestraTamizaje);
                cmd.Parameters.AddWithValue("@ObservacionSis", muestrasTamizaje.ObservacionSis);
                cmd.Parameters.AddWithValue("@Observacion", muestrasTamizaje.Observacion);
                cmd.Parameters.AddWithValue("@FechaRecepcionSIS", muestrasTamizaje.FechaRecepcionSIS);
                cmd.Parameters.AddWithValue("@HoraRecepcionSIS", muestrasTamizaje.HoraRecepcionSIS);
                cmd.Parameters.AddWithValue("@IdResponsableMuestraMGP", muestrasTamizaje.IdResponsableMuestraMGP);
                cmd.Parameters.AddWithValue("@IdResponsableRecepcionaSISMGP", muestrasTamizaje.IdResponsableRecepcionaSISMGP);
                cmd.Parameters.AddWithValue("@IdMotivoRechazo", muestrasTamizaje.IdMotivoRechazo);
                cmd.Parameters.AddWithValue("@OtroMotivoRechazo", muestrasTamizaje.OtroMotivoRechazo);
                cmd.Parameters.AddWithValue("@TSHRechazado", muestrasTamizaje.TSHRechazado);
                cmd.Parameters.AddWithValue("@OHPRechazado", muestrasTamizaje.OHPRechazado);
                cmd.Parameters.AddWithValue("@FENRechazado", muestrasTamizaje.FENRechazado);
                cmd.Parameters.AddWithValue("@GALRechazado", muestrasTamizaje.GALRechazado);
                cmd.Parameters.AddWithValue("@IRTRechazado", muestrasTamizaje.IRTRechazado);
                cmd.Parameters.AddWithValue("@OTRORechazado", muestrasTamizaje.OTRORechazado);
                cmd.Parameters.AddWithValue("@CorrelativoLab", muestrasTamizaje.CorrelativoLab);
                cmd.Parameters.AddWithValue("@IdResponsableMuestraLaboratorio", muestrasTamizaje.IdResponsableMuestraLaboratorio);
                cmd.Parameters.AddWithValue("@FechaSospechoso", muestrasTamizaje.FechaSospechoso);
                cmd.Parameters.AddWithValue("@HoraSospecha", muestrasTamizaje.HoraSospecha);
                cmd.Parameters.AddWithValue("@PersonalQueRealizoTomaMuestra", muestrasTamizaje.PersonalQueRealizoTomaMuestra);
                cmd.Parameters.AddWithValue("@EstadoLaboratorio", muestrasTamizaje.EstadoLaboratorio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@EstadoSIS", muestrasTamizaje.EstadoSIS ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroEnvioSis", muestrasTamizaje.NroEnvioSis ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaOrigen", muestrasTamizaje.NroReferenciaOrigen ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@NroReferenciaDestino", muestrasTamizaje.NroReferenciaDestino ?? Convert.DBNull);

                cmd.Parameters.AddWithValue("@MotivoRechazo2", muestrasTamizaje.MotivoRechazo2 ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@OtroMotivoRechazo2", muestrasTamizaje.OtroMotivoRechazo2 ?? Convert.DBNull);

                cmd.Parameters.Add("@IdMovimiento", SqlDbType.Int).Value = laboratorio.IdMovimiento;
                cmd.Parameters.Add("@IdOrden", SqlDbType.Int).Value = laboratorio.IdOrden;
                cmd.Parameters.Add("@IdOrdenPago", SqlDbType.Int).Value = laboratorio.IdOrdenPago == null ? (object)DBNull.Value : laboratorio.IdOrdenPago;
                cmd.Parameters.Add("@IdReceta", SqlDbType.VarChar).Value = laboratorio.IdReceta == null ? (object)DBNull.Value : laboratorio.IdReceta;
                cmd.Parameters.Add("@MovTipo", SqlDbType.VarChar).Value = laboratorio.MovTipo;
                cmd.Parameters.Add("@IdPuntoCarga", SqlDbType.Int).Value = laboratorio.IdPuntoCarga;
                cmd.Parameters.Add("@idPersonaRecoge", SqlDbType.Int).Value = laboratorio.IdPersonaRecoge;
                cmd.Parameters.Add("@TipoAp", SqlDbType.VarChar).Value = laboratorio.TipoAP;
                cmd.Parameters.Add("@IdComprobantePago", SqlDbType.Int).Value = laboratorio.IdComprobantePago == null ? (object)DBNull.Value : laboratorio.IdComprobantePago;
                cmd.Parameters.Add("@CorrelativoAnual", SqlDbType.Int).Value = laboratorio.CorrelativoAnual;
                cmd.Parameters.Add("@idDiagnostico", SqlDbType.Int).Value = laboratorio.IdDiagnostico;
                cmd.Parameters.Add("@EsDiagnosticoDefinitivo", SqlDbType.Int).Value = laboratorio.EsDiagnosticoDefinitivo;
                cmd.Parameters.Add("@InsumosCPT", SqlDbType.Xml).Value = xmlInsumosCPT;
                cmd.Parameters.Add("@ProductosCPT", SqlDbType.Xml).Value = xmlProductosCPT;


                cmd.Parameters.AddWithValue("@TipoRegistro", TipoRegistro);
                cmd.Parameters.AddWithValue("@registroIpress", registroIpress);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdListItem", IdListItem);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;

            }
        }


        public async Task<DataSet> ResultadosLaboratorioTamizajeNeonatal(int IdCuentaAtencion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_ResultadosLaboratorioTamizajeNeonatal", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@IdCuentaAtencion", IdCuentaAtencion);
                //cmd.Parameters.AddWithValue("IdEstablecimientoExterno", IdEstablecimientoExterno);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }
    }
}
