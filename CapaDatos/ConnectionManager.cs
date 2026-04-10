using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.WebSockets;

namespace CapaDatos
{
    public interface IConnectionManager
    {
        Task HandleConnection(IConnection connection);
    }

    public class ConnectionManager : IConnectionManager
    {
        public async Task HandleConnection(IConnection connection)
        {
            await connection.KeepReceiving();
            await connection.Close();
        }
    }
}
