using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebAppMaternidad.Services
{
    public class IafasService
    {
        private readonly HttpClient _httpClient;
        private readonly string baseUrl = "https://srvapiiafas.iafasfosmar.pe:4243";

        public IafasService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // 1. Obtener Token
        public async Task<string> ObtenerToken(string usuario, string clave)
        {
            var url = $"{baseUrl}/WebApi/Login/ValidaUsuario";

            var body = new
            {
                USUARIO = usuario,
                CLAVE = clave
            };

            var content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, content);
            var json = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.GetProperty("Token").GetString();
        }

        // 2. Consultar Afiliados
        public async Task<string> ConsultaAfiliados(
            string token,
            int producto,
            string tipoDocumento,
            string nroDocumento)
        {
            var url = $"{baseUrl}/WebApi/Afiliado/ConsultaAfiliados";

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var body = new
            {
                PRODUCTO = producto,
                TIPO_DOCUMENTO = tipoDocumento,
                NRO_DOCUMENTO = nroDocumento
            };

            var content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(url, content);
            return await response.Content.ReadAsStringAsync();
        }
    }
}
