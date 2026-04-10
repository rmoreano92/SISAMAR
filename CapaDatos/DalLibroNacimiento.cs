using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;
using CapaDatos;

namespace WebAppMaternidad.CapaDatos
{
    public class DalLibroNacimiento
    {
        public Task<DataSet> ListarRegistroLibroNacimiento(DateTime FechaNacimiento, int NroLibro, int NroFolio, int NroAnio, int NroMes, int NroHistoriaMadre, string ApPaternoMadre, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {                        
                        string sql = "web_ListarPacientesRegistroLibroNacimiento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@FechaNac", SqlDbType.VarChar).Value = (String)FechaNacimiento.ToShortDateString();
                        da.SelectCommand.Parameters.Add("@NroLibro", SqlDbType.Int).Value = (NroLibro > 0) ? NroLibro : 0;
                        da.SelectCommand.Parameters.Add("@NroFolio", SqlDbType.Int).Value = (NroFolio > 0) ? NroFolio : 0;
                        da.SelectCommand.Parameters.Add("@NroAnio", SqlDbType.Int).Value = (NroAnio > 0) ? NroAnio : 0;
                        da.SelectCommand.Parameters.Add("@NroMes", SqlDbType.Int).Value = (NroMes > 0) ? NroMes : 0;
                        da.SelectCommand.Parameters.Add("@ApPaternoMadre", SqlDbType.VarChar).Value = (ApPaternoMadre == null) ? "" : ApPaternoMadre;
                        da.SelectCommand.Parameters.Add("@NroHistoriaMadre", SqlDbType.Int).Value = (NroHistoriaMadre > 0) ? NroHistoriaMadre : 0; ;
                        da.SelectCommand.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> RegistroLibroNacimientoCrearModificar(LibroNacimiento objLibroNac)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "Web_ListarHospitalizadosRN_V2";
                        string sql = "web_RegistroLibroNacimientoCrearModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRecienNacido", SqlDbType.Int).Value = objLibroNac.IdRecienNacido;
                        da.SelectCommand.Parameters.Add("@NumeroLibro", SqlDbType.Int).Value = objLibroNac.NumeroLibro;
                        da.SelectCommand.Parameters.Add("@FolioLibro", SqlDbType.Int).Value = objLibroNac.FolioLibro;
                        da.SelectCommand.Parameters.Add("@AnioLibro", SqlDbType.Int).Value = objLibroNac.AnioLibro;
                        da.SelectCommand.Parameters.Add("@MesLibro", SqlDbType.Int).Value = objLibroNac.MesLibro;
                        da.SelectCommand.Parameters.Add("@HistoriaMadre", SqlDbType.VarChar).Value = objLibroNac.HistoriaMadre;
                        da.SelectCommand.Parameters.Add("@DniMadre", SqlDbType.VarChar).Value = objLibroNac.DniMadre;
                        da.SelectCommand.Parameters.Add("@NombresMadre", SqlDbType.VarChar).Value = objLibroNac.NombresMadre;
                        da.SelectCommand.Parameters.Add("@ApPaternoMadre", SqlDbType.VarChar).Value = objLibroNac.ApPaternoMadre;
                        da.SelectCommand.Parameters.Add("@ApMaternoMadre", SqlDbType.VarChar).Value = objLibroNac.ApMaternoMadre;
                        da.SelectCommand.Parameters.Add("@EdadMadre", SqlDbType.VarChar).Value = objLibroNac.EdadMadre;
                        da.SelectCommand.Parameters.Add("@EstadoCivilMadre", SqlDbType.Int).Value = objLibroNac.EstadoCivilMadre;
                        da.SelectCommand.Parameters.Add("@ResidenciaActual", SqlDbType.VarChar).Value = objLibroNac.ResidenciaActual;
                        da.SelectCommand.Parameters.Add("@LugarNacimientoMadre", SqlDbType.VarChar).Value = objLibroNac.LugarNacimientoMadre;
                        da.SelectCommand.Parameters.Add("@NacionalidadMadre", SqlDbType.VarChar).Value = objLibroNac.NacionalidadMadre;
                        da.SelectCommand.Parameters.Add("@NumeroEmbarazoMadre", SqlDbType.VarChar).Value = objLibroNac.NumeroEmbarazoMadre;
                        da.SelectCommand.Parameters.Add("@HijosVivosMadre", SqlDbType.VarChar).Value = objLibroNac.HijosVivosMadre;
                        da.SelectCommand.Parameters.Add("@HijosMuertosMadre", SqlDbType.VarChar).Value = objLibroNac.HijosMuertosMadre;
                        da.SelectCommand.Parameters.Add("@VidaConyugalMadre", SqlDbType.VarChar).Value = objLibroNac.VidaConyugalMadre;
                        da.SelectCommand.Parameters.Add("@DomicilioMadre", SqlDbType.VarChar).Value = objLibroNac.DomicilioMadre;
                        da.SelectCommand.Parameters.Add("@FechaNacimientoRn", SqlDbType.VarChar).Value = objLibroNac.FechaNacimientoRn;
                        da.SelectCommand.Parameters.Add("@HoraNacimientoRn", SqlDbType.VarChar).Value = objLibroNac.HoraNacimientoRn;
                        da.SelectCommand.Parameters.Add("@NombresRn", SqlDbType.VarChar).Value = objLibroNac.NombresRn;
                        da.SelectCommand.Parameters.Add("@Sexo", SqlDbType.Int).Value = objLibroNac.Sexo;
                        da.SelectCommand.Parameters.Add("@TipoGestacion", SqlDbType.Int).Value = objLibroNac.TipoGestacion;

                        da.SelectCommand.Parameters.Add("@Fetos", SqlDbType.Int).Value = objLibroNac.Fetos;
                        da.SelectCommand.Parameters.Add("@NroGemelar", SqlDbType.Int).Value = objLibroNac.NroGemelar;


                        da.SelectCommand.Parameters.Add("@Condicion", SqlDbType.Int).Value = objLibroNac.Condicion;
                        da.SelectCommand.Parameters.Add("@VidaIntrauterinaRn", SqlDbType.VarChar).Value = objLibroNac.VidaIntrauterinaRn;
                        da.SelectCommand.Parameters.Add("@PesoRn", SqlDbType.VarChar).Value = objLibroNac.PesoRn;
                        da.SelectCommand.Parameters.Add("@TallaRn", SqlDbType.VarChar).Value = objLibroNac.TallaRn;
                        da.SelectCommand.Parameters.Add("@ApgarRn", SqlDbType.VarChar).Value = objLibroNac.ApgarRn;
                        da.SelectCommand.Parameters.Add("@NroCertificadoRn", SqlDbType.VarChar).Value = objLibroNac.NroCertificadoRn;
                        da.SelectCommand.Parameters.Add("@HCRn", SqlDbType.VarChar).Value = objLibroNac.HCRn;
                        da.SelectCommand.Parameters.Add("@NombresPadre", SqlDbType.VarChar).Value = objLibroNac.NombresPadre;
                        da.SelectCommand.Parameters.Add("@ApPaternoPadre", SqlDbType.VarChar).Value = objLibroNac.ApPaternoPadre;
                        da.SelectCommand.Parameters.Add("@ApMaternoPadre", SqlDbType.VarChar).Value = objLibroNac.ApMaternoPadre;
                        da.SelectCommand.Parameters.Add("@EdadPadre", SqlDbType.VarChar).Value = objLibroNac.EdadPadre;
                        da.SelectCommand.Parameters.Add("@LugarNacimientoPadre", SqlDbType.VarChar).Value = objLibroNac.LugarNacimientoPadre;
                        da.SelectCommand.Parameters.Add("@NacionalidadPadre", SqlDbType.VarChar).Value = objLibroNac.NacionalidadPadre;
                        da.SelectCommand.Parameters.Add("@CausaMuerte", SqlDbType.VarChar).Value = objLibroNac.CausaMuerte;
                        da.SelectCommand.Parameters.Add("@AnotacionEspecial", SqlDbType.VarChar).Value = objLibroNac.AnotacionEspecial;
                        da.SelectCommand.Parameters.Add("@Observacion", SqlDbType.VarChar).Value = objLibroNac.Observacion;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objLibroNac.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> EliminarLibroNacimientoCrearModificar(LibroNacimiento objLibroNac)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "Web_ListarHospitalizadosRN_V2";
                        string sql = "web_EliminarLibroNacimientoCrearModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdRecienNacido", SqlDbType.VarChar).Value = objLibroNac.IdRecienNacido;                        
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = objLibroNac.IdUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


    }
}
