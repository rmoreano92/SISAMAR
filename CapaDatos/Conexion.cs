using System.Data.SqlClient;
using SiHospCrypKey;
using Microsoft.Extensions.Configuration;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{    
    public class Conexion
    {

        private static readonly Conexion _instancia = new Conexion();
        string cadenaConexion = "";
        string cadenaConexionExterna = "";
        string cadenaConexionSis = "";
        string cadenaConexionControlAsistencia = "";
        string cadenaConexionGestionColas = "";

        string servidorArchivos = "";
        string servidorArchivosSinFirma = "";
        string servidorArchivosConFirma = "";
        string servidorArchivosHistorial = "";
        string servidorArchivosIp = "";
        string servidorEIDDSIP = "";
        string apiFirmaDigital = "";

        string apiServicio7Zip = "";

        string apiServicioSetisisLogin = "";
        string apiServicioSetisisEnvio = "";
        string apiServicioSetisisConsulta = "";

        string apiServicioSetisisAuth = "";
        string apiServicioSetisisCargaPaquete = "";
        string apiServicioSetisisConsultaPaquete = "";

        SetisisServiceConfig configuracionServicioSetisisLogin = new SetisisServiceConfig();

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
            var conex8 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:CONTROL_ASIST");
            var sgca = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:GESTION_COLAS");
            var apiFD = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:API_FIRMA_DIGITAL");
            var api7Zip = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:API_7ZIP");
            var apiSetisiLogin = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SETISIS_LOGIN");
            var apiSetisisEnvio = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SETISIS_ENVIO");
            var apiSetisiConsulta = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SETISIS_CONSULTA");

            var apiSetisisAuth = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SETISIS_AUTH");
            var apiSetisisCargaPaquete = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SETISIS_CARGA_PAQUETE");
            var apiSetisiConsultaPaquete = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("ConnectionStrings:SETISIS_CONSULTA_PAQUETE");

            cadenaConexion = conex1.ToString();
            cadenaConexionExterna = conex2.ToString();
            cadenaConexionSis = conex3.ToString();
            cadenaConexionControlAsistencia = conex8.ToString();
            cadenaConexionGestionColas = sgca.ToString();

            //cadenaConexion = objCripto.DesencriptarCadena(conex1.ToString());
            //cadenaConexionExterna = objCripto.DesencriptarCadena(conex2.ToString());
            //cadenaConexionSis = objCripto.DesencriptarCadena(conex3.ToString());
            //cadenaConexionControlAsistencia = objCripto.DesencriptarCadena(conex8.ToString());
            //cadenaConexionGestionColas = objCripto.DesencriptarCadena(sgca.ToString());
            apiFirmaDigital = apiFD.ToString();
            apiServicio7Zip = api7Zip.ToString();
            apiServicioSetisisLogin = apiSetisiLogin.ToString();
            apiServicioSetisisEnvio = apiSetisisEnvio.ToString();
            apiServicioSetisisConsulta = apiSetisiConsulta.ToString();

            apiServicioSetisisAuth = apiSetisisAuth.ToString();
            apiServicioSetisisCargaPaquete = apiSetisisCargaPaquete.ToString();
            apiServicioSetisisConsultaPaquete = apiSetisiConsultaPaquete.ToString();

            var conex4 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES");
            servidorArchivos = conex4.ToString();

            var conex5 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_UNSIGNED");
            servidorArchivosSinFirma = conex5.ToString();

            var conex6 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_SIGNED");
            servidorArchivosConFirma = conex6.ToString();

            var conex7 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_HISTORICAL");
            servidorArchivosHistorial = conex7.ToString();

            var conex9 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_FILES_IP");
            servidorArchivosIp = conex9.ToString();

            var conex10 = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetValue<string>("RutasServer:SERVER_EIDDSIP");
            servidorEIDDSIP = conex10.ToString();


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

        public SqlConnection obtenerConexionControlAsistencia()
        {
            con.ConnectionString = cadenaConexionControlAsistencia;            
            return con;
        }

        public SqlConnection obtenerConexionGestionColas()
        {
            con.ConnectionString = cadenaConexionGestionColas;
            return con;
        }

        public string obtenerApiFirmaDigital()
        {            
            return apiFirmaDigital;
        }

        public string obtenerApi7zip()
        {
            return apiServicio7Zip;
        }

        public SetisisServiceConfig obtenerApiSetisisLogin()
        {
            configuracionServicioSetisisLogin.URL = apiServicioSetisisLogin;
            configuracionServicioSetisisLogin.ContentType = "application/json";
            //configuracionServicioSetisisLogin.Email = ServicioFacturacion.app.Default.Email.ToString();
            //configuracionServicioSetisisLogin.ApiKey = ServicioFacturacion.app.Default.ApiKey.ToString();

            return configuracionServicioSetisisLogin;
        }

        public SetisisServiceConfig obtenerApiSetisisEnvio()
        {
            configuracionServicioSetisisLogin.URL = apiServicioSetisisEnvio;
            configuracionServicioSetisisLogin.ContentType = "application/json";
            //configuracionServicioSetisisLogin.Email = ServicioFacturacion.app.Default.Email.ToString();
            //configuracionServicioSetisisLogin.ApiKey = ServicioFacturacion.app.Default.ApiKey.ToString();

            return configuracionServicioSetisisLogin;
        }

       
        public SetisisServiceConfig obtenerApiSetisisConsulta()
        {
            configuracionServicioSetisisLogin.URL = apiServicioSetisisConsulta;
            configuracionServicioSetisisLogin.ContentType = "application/json";
            //configuracionServicioSetisisLogin.Email = ServicioFacturacion.app.Default.Email.ToString();
            //configuracionServicioSetisisLogin.ApiKey = ServicioFacturacion.app.Default.ApiKey.ToString();

            return configuracionServicioSetisisLogin;
        }

        public SetisisServiceConfig obtenerApiSetisisAuth()
        {
            configuracionServicioSetisisLogin.URL = apiServicioSetisisAuth;
            configuracionServicioSetisisLogin.ContentType = "application/json";
            //configuracionServicioSetisisLogin.Email = ServicioFacturacion.app.Default.Email.ToString();
            //configuracionServicioSetisisLogin.ApiKey = ServicioFacturacion.app.Default.ApiKey.ToString();

            return configuracionServicioSetisisLogin;
        }

        public SetisisServiceConfig obtenerApiSetisisCargaPaquete()
        {
            configuracionServicioSetisisLogin.URL = apiServicioSetisisCargaPaquete;
            configuracionServicioSetisisLogin.ContentType = "application/json";
            //configuracionServicioSetisisLogin.Email = ServicioFacturacion.app.Default.Email.ToString();
            //configuracionServicioSetisisLogin.ApiKey = ServicioFacturacion.app.Default.ApiKey.ToString();

            return configuracionServicioSetisisLogin;
        }


        public SetisisServiceConfig obtenerApiSetisisConsultaPaquete()
        {
            configuracionServicioSetisisLogin.URL = apiServicioSetisisConsultaPaquete;
            configuracionServicioSetisisLogin.ContentType = "application/json";
            //configuracionServicioSetisisLogin.Email = ServicioFacturacion.app.Default.Email.ToString();
            //configuracionServicioSetisisLogin.ApiKey = ServicioFacturacion.app.Default.ApiKey.ToString();

            return configuracionServicioSetisisLogin;
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

        public string ObtenerServidorArchivosIp()
        {
            return servidorArchivosIp;
        }

        public string ObtenerServidorEIDDSIP()
        {
            return servidorEIDDSIP;
        }

        //private static readonly Conexion _instancia = new Conexion();

        ///////////////////////////////////PRODUCCION/////////////////////////////////
        ////string cadenaConexion = "Data Source=192.168.9.18;Initial Catalog=SIGH; Persist Security Info=true;Password=Seguridad@123;User ID = sa;";                   //PRODUCCION
        ////string cadenaConexionExterna = "Data Source=192.168.9.18;Initial Catalog=SIGH_EXTERNA; Persist Security Info=true;Password=Inmp@123;User ID = sa;";         //PRODUCCION
        ////string cadenaConexionSis = "Data Source=192.168.9.18;Initial Catalog=SIGH_SIS; Persist Security Info=true;Password=Inmp@123;User ID = sa;";                 //PRODUCCION

        /////////////////////////////////PRUEBAS 1/////////////////////////////////
        //string cadenaConexion = "Data Source=172.16.40.27;Initial Catalog=SIGH; Persist Security Info=true;Password=Inmp@123;User ID = sa;";                        //PRUEBAS
        //string cadenaConexionExterna = "Data Source=172.16.40.27;Initial Catalog=SIGH_EXTERNA; Persist Security Info=true;Password=Inmp@123;User ID = sa;";         //PRUEBAS
        //string cadenaConexionSis = "Data Source=172.16.40.27;Initial Catalog=SIGH_SIS; Persist Security Info=true;Password=Inmp@123;User ID = sa;";                 //PRUEBAS

        /////////////////////////////////PRUEBAS 2/////////////////////////////////
        ////string cadenaConexion = "Data Source=192.168.10.19;Initial Catalog=SIGH; Persist Security Info=true;Password=Inmp@123;User ID = sa;";                        //PRUEBAS
        ////string cadenaConexionExterna = "Data Source=192.168.10.19;Initial Catalog=SIGH_EXTERNA; Persist Security Info=true;Password=Inmp@123;User ID = sa;";         //PRUEBAS
        ////string cadenaConexionSis = "Data Source=192.168.10.19;Initial Catalog=SIGH_SIS; Persist Security Info=true;Password=Inmp@123;User ID = sa;";                 //PRUEBAS

        ////string cadenaConexion = "data source=192.168.10.19;initial catalog=sigh; persist security info=true;password=Inmp@123;user id = sa;";                   // pruebas puerto-maldonado
        ////string cadenaConexionExterna = "data source=192.168.10.19;initial catalog=sigh_externa; persist security info=true;password=Inmp@123;user id = sa;";     // pruebas puerto-maldonado
        ////string cadenaConexionSis = "data source=192.168.10.19;initial catalog=sigh_sis; persist security info=true;password=Inmp@123;user id = sa;";             // pruebas puerto-maldonado

        ////string cadenaConexion = "Data Source=172.16.2.16;Initial Catalog=SIGH; Persist Security Info=true;Password=poa15121001;User ID = poa3;";                  //PUERTO-MALDONADO PRODUCCION
        ////string cadenaConexionExterna = "Data Source=172.16.2.16;Initial Catalog=SIGH_EXTERNA; Persist Security Info=true;Password=poa15121001;User ID = poa3;";   //PUERTO-MALDONADO PRODUCCION
        ////string cadenaConexionSis = "Data Source=172.16.2.16;Initial Catalog=SIGH_SIS; Persist Security Info=true;Password=poa15121001;User ID = poa3;";           //PUERTO-MALDONADO PRODUCCION

        //////////////////////////////PRODUCCION/////////////////////////////////
        ////string cadenaConexion = "Data Source=192.168.1.4;Initial Catalog=SIGH; Persist Security Info=true;Password=csmcentinela@123;User ID = sa;";                   //PRODUCCION CHINCHA
        ////string cadenaConexionExterna = "Data Source=192.168.1.4;Initial Catalog=SIGH_EXTERNA; Persist Security Info=true;Password=csmcentinela@123;User ID = sa;";         //PRODUCCION CHINCHA
        ////string cadenaConexionSis = "Data Source=192.168.1.4;Initial Catalog=SIGH_SIS; Persist Security Info=true;Password=csmcentinela@123;User ID = sa;";                 //PRODUCCION CHINCHA


        /////////////////////////////////PRUEBAS FACTURACTIVA/////////////////////////////////
        //string cadenaConexionFacturactiva = "Data Source=192.168.10.19;Initial Catalog=DBFacturactiva; Persist Security Info=true;Password=Inmp@123;User ID = sa;";                        //PRUEBAS


        ///*string servidorArchivos = "C:/inetpub/wwwroot/SisgalenFiles/";*/      //PRUEBAS
        //string servidorArchivos = "C:/SisgalenFiles/";      //PRODUCCION


        //public static Conexion Instancia
        //{
        //    get { return Conexion._instancia; }
        //}

        //SqlConnection con = new SqlConnection();       

        //public SqlConnection obtenerConexion()
        //{            
        //    con.ConnectionString = cadenaConexion;
        //    //con = new SqlConnection(ConfigurationManager.ConnectionStrings["FactCatSARIO_ConnectionString"].ConnectionString);
        //    return con;
        //}

        //public SqlConnection obtenerConexionExterna()
        //{
        //    con.ConnectionString = cadenaConexionExterna;
        //    //con = new SqlConnection(ConfigurationManager.ConnectionStrings["FactCatSARIO_ConnectionString"].ConnectionString);
        //    return con;
        //}

        //public SqlConnection obtenerConexionSis()
        //{
        //    con.ConnectionString = cadenaConexionSis;
        //    //con = new SqlConnection(ConfigurationManager.ConnectionStrings["FactCatSARIO_ConnectionString"].ConnectionString);
        //    return con;
        //}

        //public SqlConnection obtenerConexionFacturactiva()
        //{
        //    con.ConnectionString = cadenaConexionFacturactiva;
        //    //con = new SqlConnection(ConfigurationManager.ConnectionStrings["FactCatSARIO_ConnectionString"].ConnectionString);
        //    return con;
        //}

        //public string ObtenerServidorArchivos()
        //{
        //    return servidorArchivos;
        //}
    }
}



