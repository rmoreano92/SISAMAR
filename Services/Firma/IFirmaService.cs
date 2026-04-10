using System.Threading.Tasks;

namespace WebAppMaternidad.Services.Firma
{
    public interface IFirmaService
    {
        string ObtenerInvokerUrl();
        Task<string> ObtenerTokenAsync();
        string ConstruirParametroFirma(string paramUrl, string token, string documentExtension = "pdf");
    }
}
