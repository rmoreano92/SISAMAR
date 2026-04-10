using DocumentFormat.OpenXml.InkML;
using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using WebAppMaternidad.Abstractions;

namespace WebAppMaternidad.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext _context;
        private SqlConnection _connection;
        private SqlTransaction _transaction;

        public UnitOfWork(DatabaseContext context)
        {
            _context = context;
        }

        // 🔹 Solo abre conexión (modo lectura)
        public async Task OpenConnectionAsync(string connectionName = "SIGH")
        {
            if (_connection != null)
                throw new InvalidOperationException("La conexión ya está abierta.");

            _connection = _context.CreateConnection(connectionName);
            await _connection.OpenAsync();
        }

        // 🔹 Abre conexión + inicia transacción (modo escritura)
        public async Task BeginTransactionAsync(string connectionName = "SIGH")
        {
            if (_connection != null)
                throw new InvalidOperationException("La conexión ya está abierta.");

            _connection = _context.CreateConnection(connectionName);
            await _connection.OpenAsync();
            _transaction = _connection.BeginTransaction();
        }

        public SqlConnection GetConnection()
        {
            if (_connection == null)
                throw new Exception("La conexión aún no ha sido inicializada. Debes llamar a OpenConnectionAsync o BeginTransactionAsync primero.");

            return _connection;
        }

        public SqlTransaction GetTransaction()
        {
            if (_transaction == null)
                throw new Exception("La transacción aún no ha sido inicializada. Debes llamar a BeginTransactionAsync primero.");

            return _transaction;
        }

        public async Task CommitAsync()
        {
            if (_transaction != null)
            {
                _transaction.Commit();
                await DisposeConnectionAsync();
            }
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                await DisposeConnectionAsync();
            }
        }

        public async Task CloseAsync()
        {
            // 🔹 Solo cierra conexión si no hay transacción
            if (_transaction == null && _connection != null)
            {
                await _connection.CloseAsync();
                await DisposeAsync();
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _connection?.Dispose();
        }

        public async ValueTask DisposeAsync()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }

            if (_connection != null)
            {
                await _connection.DisposeAsync();
                _connection = null;
            }
        }

        private async Task DisposeConnectionAsync()
        {
            await _connection.CloseAsync();
            await DisposeAsync();
        }
    }

}
