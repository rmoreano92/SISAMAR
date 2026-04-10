using System;
using System.Threading.Tasks;

namespace WebAppMaternidad.Abstractions
{
    public interface IUnitOfWork : IDisposable
    {
        Task BeginTransactionAsync(string connectionName);
        Task CommitAsync();
        Task RollbackAsync();
    }
}
