using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public interface IConnectionFactory
    {
        IConnection CreateConnection(WebSocket webSocket);
    }

    public class ConnectionFactory : IConnectionFactory
    {
        public IConnection CreateConnection(WebSocket webSocket)
        {
            return new WebSocketConnection(webSocket);
        }
    }
}
