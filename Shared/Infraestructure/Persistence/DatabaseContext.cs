using Microsoft.Extensions.Configuration;
using NPOI.HSSF.Record;
using SiHospCrypKey;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace WebAppMaternidad.Infrastructure.Persistence
{
    public class DatabaseContext
    {
        private readonly IConfiguration _configuration;
        private readonly Dictionary<string, string> _connections;

        Encriptar objCripto = new Encriptar();
        public DatabaseContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connections = _configuration.GetSection("ConnectionStrings").Get<Dictionary<string, string>>();
        }

        public SqlConnection CreateConnection(string connectionName = "SIGH")
        {
            if(!_connections.ContainsKey(connectionName))
            {
                throw new System.Exception($"La cadena de conexión '{connectionName}' no está definida.");
            }

            //return new SqlConnection(objCripto.DesencriptarCadena(_connections[connectionName].ToString()));
            return new SqlConnection(_connections[connectionName].ToString());
        }
    }
}
