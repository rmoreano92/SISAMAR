using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace WebAppMaternidad.Services.Firma
{
    public class FirmaService : IFirmaService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public FirmaService()
        {
            _httpClient = new HttpClient();
            _configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();
        }

        public FirmaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> ObtenerTokenAsync()
        {
            var invokerUrl = ObtenerInvokerUrl().TrimEnd('/');
            var usuarioAccesoApi = _configuration.GetValue<string>("FirmaDigital:UsuarioAccesoApi");

            if (string.IsNullOrWhiteSpace(invokerUrl))
            {
                throw new InvalidOperationException("No se configuro FirmaDigital:InvokerUrl en appsettings.json.");
            }

            if (string.IsNullOrWhiteSpace(usuarioAccesoApi))
            {
                throw new InvalidOperationException("No se configuro FirmaDigital:UsuarioAccesoApi en appsettings.json.");
            }

            var requestJson = JsonSerializer.Serialize(new { usuarioAccesoApi });
            using var content = new StringContent(requestJson, Encoding.UTF8, "application/json");
            using var response = await _httpClient.PostAsync($"{invokerUrl}/autenticacion", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(responseJson);

            if (!document.RootElement.TryGetProperty("data", out var tokenElement))
            {
                throw new InvalidOperationException("La respuesta de autenticacion no contiene el campo data.");
            }

            var token = tokenElement.GetString();
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new InvalidOperationException("Se recibio un token vacio desde autenticacion.");
            }

            return token;
        }

        public string ObtenerInvokerUrl()
        {
            var invokerUrl = _configuration.GetValue<string>("FirmaDigital:InvokerUrl");
            if (string.IsNullOrWhiteSpace(invokerUrl))
            {
                throw new InvalidOperationException("No se configuro FirmaDigital:InvokerUrl en appsettings.json.");
            }

            return invokerUrl;
        }

        public string ConstruirParametroFirma(string paramUrl, string token, string documentExtension = "pdf")
        {
            var payload = new
            {
                param_url = paramUrl,
                param_token = token,
                document_extension = documentExtension
            };

            var json = JsonSerializer.Serialize(payload);
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
        }
    }
}
