using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using SiHospCrypKey;

namespace WebAppMaternidad.Connected_Services
{
    public class Conexion
    {
        private static readonly Conexion _instancia = new Conexion();
        string cadenaConexion = "";
        string cadenaConexionExterna = "";
        string cadenaConexionSis = "";

        string servidorArchivos = "";
        string servidorArchivosSinFirma = "";
        string servidorArchivosConFirma = "";
        string servidorArchivosHistorial = "";

        SqlConnection con = new SqlConnection();
        Encriptar objCripto = new Encriptar();

        public static Conexion Instancia
        {
            get { return Conexion._instancia; }
        }

        public Conexion()
        {
            var conex1 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SIGH");
            var conex2 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SIGH_EXTERNA");
            var conex3 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SIGH_SIS");
            cadenaConexion = objCripto.DesencriptarCadena(conex1.ToString());
            cadenaConexionExterna = objCripto.DesencriptarCadena(conex2.ToString());
            cadenaConexionSis = objCripto.DesencriptarCadena(conex3.ToString());

            var conex4 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES");
            servidorArchivos = conex4.ToString();

            var conex5 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_UNSIGNED");
            servidorArchivosSinFirma = conex5.ToString();

            var conex6 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_SIGNED");
            servidorArchivosConFirma = conex6.ToString();

            var conex7 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_HISTORICAL");
            servidorArchivosHistorial = conex7.ToString();
        }

        public SqlConnection obtenerConexion()
        {
            con.ConnectionString = cadenaConexion;
            return con;
        }

        public SqlConnection obtenerConexionExterna()
        {
            con.ConnectionString = cadenaConexionExterna;
            return con;
        }

        public SqlConnection obtenerConexionSis()
        {
            con.ConnectionString = cadenaConexionSis;
            return con;
        }

        public string ObtenerServidorArchivos()
        {
            return servidorArchivos;
        }

        public string ObtenerServidorArchivosSinFirma()
        {
            return servidorArchivosSinFirma;
        }

        public string ObtenerServidorArchivosConFirma()
        {
            return servidorArchivosConFirma;
        }

        public string ObtenerServidorArchivosHistorial()
        {
            return servidorArchivosHistorial;
        }
    }
}
