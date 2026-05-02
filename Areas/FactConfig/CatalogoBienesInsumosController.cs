using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Threading.Tasks;
using System;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.Odbc;
using ICSharpCode.SharpZipLib.Zip;
using System.IO;
using System.Web;
using System.Data.OleDb;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.AspNetCore.SignalR;
using DocumentFormat.OpenXml.Bibliography;
using static NPOI.HSSF.Util.HSSFColor;
using WebAppMaternidad.Areas.Herramientas;
using System.Text;
using DbfDataReader;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.FactConfig
{
    public class CatalogoBienesInsumosController : BaseController
    {
        private readonly IHubContext<ProgressHub> _hubContext;

        public CatalogoBienesInsumosController(IHubContext<ProgressHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoBienesInsumosListar(int idTipoCatalogo, string codigo, string nombre)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCatalogoBienesInsumos dal = new DalCatalogoBienesInsumos();
            
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FactCatalogoBienesInsumosListar(idTipoCatalogo, codigo, nombre);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });
        }
        
        [HttpPost]
        public async Task<ActionResult> ListarFactInsumosSubGrupoFarmacologico(int idGrupo)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCatalogoBienesInsumos dal = new DalCatalogoBienesInsumos();
            
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.ListarFactInsumosSubGrupoFarmacologico(idGrupo);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoBienInsumoSeleccionar(int idProducto)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCatalogoBienesInsumos dal = new DalCatalogoBienesInsumos();
            
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FactCatalogoBienInsumoSeleccionar(idProducto);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoBienInsumoGuardar(CatalogoBienesInsumos producto, string detalle, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCatalogoBienesInsumos dal = new DalCatalogoBienesInsumos();
            
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                var lstobjDetalle = JsonConvert.DeserializeObject<List<FactCatalogoBienesInsumosHosp>>(detalle);
                rsp = await dal.FactCatalogoBienInsumoGuardar(producto, lstobjDetalle, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }

        [HttpPost]
        public async Task<ActionResult> FactCatalogoBienInsumoEliminar(int IdProducto, int IdProductoUnidosis, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { mensaje = "La sesión se cerro", sesion = sesion });
            }

            string mensaje = "";
            DataSet rsp = null;
            DalCatalogoBienesInsumos dal = new DalCatalogoBienesInsumos();
            
            try
            {
                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                rsp = await dal.FactCatalogoBienInsumoEliminar(IdProducto, IdProductoUnidosis, idUsuario, idListBar);
            }
            catch (Exception ex)
            {
                mensaje = "Error ," + ex.Message + ".";
            }

            return Json(new { respuesta = rsp, mensaje = mensaje, sesion = sesion });

        }


        [HttpPost]
        public async Task<IActionResult> ProcesarArchivoZip(IFormFile fileZip, int idListBar)
        {
            bool sesion = HttpContext.User.Identity.IsAuthenticated;
            if (sesion == false)
            {
                return Json(new { success = false, mensaje = "La sesión se cerro", sesion = sesion });
            }

            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
            string extension = Path.GetExtension(fileZip.FileName);

            if (fileZip == null || fileZip.Length == 0 || extension.ToLower() != ".zip")
            {
                return Json(new { success = false, mensaje = "No se seleccionó un archivo válido." });
            }

            string zipPassword = "VEINTE4512"; // 🔐 Reemplaza con la contraseña real

            try
            {
                using (var zipStream = fileZip.OpenReadStream())
                using (var zipFile = new ZipFile(zipStream))
                {
                    zipFile.Password = zipPassword;  // 🔑 Desbloquear el ZIP

                    // 🔎 Buscar SOLO el archivo "medicame.dbf" dentro del ZIP
                    ZipEntry dbfEntry = zipFile.Cast<ZipEntry>()
                        .FirstOrDefault(e => e.Name.Equals("medicame.dbf", StringComparison.OrdinalIgnoreCase));

                    if (dbfEntry == null)
                        return Json(new { success = false, mensaje = "No se encontró el archivo medicame.dbf en el ZIP.", sesion = sesion });

                    //await _hubContext.Clients.All.SendAsync("ReceiveProgress", 25); // 25% progreso

                    // 📂 Extraer el archivo "medicame.dbf" en memoria
                    using (var dbfStream = new MemoryStream())
                    using (var entryStream = zipFile.GetInputStream(dbfEntry))
                    {
                        entryStream.CopyTo(dbfStream);
                        dbfStream.Position = 0;  // Reiniciar el stream

                        //await _hubContext.Clients.All.SendAsync("ReceiveProgress", 50); // 50% progreso

                        // 📌 Leer los datos del DBF
                        DalCatalogoBienesInsumos dalCat = new DalCatalogoBienesInsumos();
                        DataTable data = ReadDbfFile(dbfStream);
                        DataSet dsProducto = null;
                        string codigo = "";
                        int cont = 0;

                        //////////////////REGISTRO AUDITORIA///////////////////////////////////
                        DalAuditoria dalAuditoria = new DalAuditoria();
                        Auditoria auditoria = new Auditoria();
                        auditoria.IdEmpleado = idUsuario;
                        auditoria.Accion = "A";
                        auditoria.IdRegistro = 0;
                        auditoria.Tabla = "FactCatalogoBienesInsumos";
                        auditoria.IdListItem = idListBar;
                        auditoria.observaciones = "Inicio proceso de actualización de catalogo.";
                        await dalAuditoria.AuditoriaGuardar(auditoria);
                        ////////////////////////////////////////////////////////////////////////


                        foreach (DataRow row in data.Rows)
                        {
                            cont++;
                            await _hubContext.Clients.All.SendAsync("ReceiveProgress", cont, data.Rows.Count);     //progreso                            
                            CatalogoBienesInsumos producto = new CatalogoBienesInsumos();
                            producto.IdProducto = 0;
                            producto.Codigo = row["CODIGO_MED"].ToString().Trim();
                            producto.Nombre = row["MEDICAMENT"].ToString().Trim() + " " + row["PRESENTACI"].ToString().Trim() + " " + row["CONCENTRAC"].ToString().Trim() + " " + row["FF"].ToString().Trim();                            
                            producto.IdGrupoFarmacologico = 999;
                            producto.IdSubGrupoFarmacologico = 999;

                            if(row["ESTRATEGIC"].ToString().Trim().ToUpper() == "E") {
                                producto.IdTipoSalidaBienInsumo = (row["ESTVTA"].ToString().Trim() == "1" ? 3 : 2);
                            } else {
                                producto.IdTipoSalidaBienInsumo = 1;
                            }
                                                       
                            producto.TipoProducto = (row["TIPO"].ToString().Trim() == "M" ? 0 : 1);
                            producto.Denominacion = row["MEDICAMENT"].ToString().Trim();
                            producto.Concentracion = row["CONCENTRAC"].ToString().Trim();
                            producto.Presentacion = row["PRESENTACI"].ToString().Trim();
                            producto.FormaFarmaceutica = row["FF"].ToString().Trim();
                            producto.TipoProductoSismed = row["ESTRATEGIC"].ToString().Trim();
                            producto.Petitorio = (row["PETITORIO"].ToString().Trim() == "P" ? true : false);


                            dsProducto = await dalCat.FactCatalogoSismedGuardar(producto);

                        }

                        //    for (int i = 0; i < data.Rows.Count; i++)
                        //{


                        //    //Console.WriteLine($"Fila {i}: {data.Rows[i]["MEDICAMENT"]}");
                        //}
                        await _hubContext.Clients.All.SendAsync("ReceiveProgress", data.Rows.Count, data.Rows.Count); // 100% progreso

                        return Json(new { respuesta = data, success = true, mensaje = "", sesion = sesion });
                    }
                }
            }
            catch (Exception ex)
            {
                await _hubContext.Clients.All.SendAsync("ReceiveProgress", 100, 100); // 100% progreso
                return Json(new { success = false, message = "Error: " + ex.Message, sesion = sesion });
            }

        }

        ////////VERSION ANTERIOR - PROBLEMAS CON LOS CARACTERES ESECIALES/////////////////////
        private DataTable ReadDbfFile(Stream dbfStream)
        {
            string tempPath = Path.Combine(Path.GetTempPath(), "medicame.dbf");

            // 📂 Guardar en un archivo temporal (OleDb necesita un archivo físico)
            using (var fileStream = new FileStream(tempPath, FileMode.Create, FileAccess.Write))
            {
                dbfStream.CopyTo(fileStream);
            }

            string connectionString = $"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={Path.GetTempPath()};Extended Properties=dBASE IV;";
            DataTable dt = new DataTable();

            using (OleDbConnection connection = new OleDbConnection(connectionString))
            {
                connection.Open();
                using (OleDbCommand command = new OleDbCommand($"SELECT * FROM {Path.GetFileNameWithoutExtension(tempPath)}", connection))
                using (OleDbDataAdapter adapter = new OleDbDataAdapter(command))
                {
                    adapter.Fill(dt);
                }
            }

            System.IO.File.Delete(tempPath); // 🗑️ Eliminar archivo temporal

            return dt;
        }

        //private DataTable ReadDbfFile(Stream dbfStream)
        //{
        //    try
        //    {
        //        string tempPath = Path.Combine(Path.GetTempPath(), "medicame.dbf");

        //        // Guardar el archivo temporal
        //        using (var fileStream = new FileStream(tempPath, FileMode.Create, FileAccess.Write))
        //        {
        //            dbfStream.CopyTo(fileStream);
        //        }

        //        var dt = new DataTable();

        //        var options = new DbfDataReaderOptions
        //        {
        //            Encoding = Encoding.GetEncoding(850), // CP850 → soporta Ñ, á, é, etc.
        //            SkipDeletedRecords = true
        //        };

        //        using (var reader = new DbfDataReader.DbfDataReader(tempPath, options))
        //        {
        //            // Crear las columnas del DataTable manualmente
        //            for (int i = 0; i < reader.FieldCount; i++)
        //            {
        //                var type = reader.GetFieldType(i);

        //                // Si es Nullable<T>, extraer T
        //                if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
        //                {
        //                    type = Nullable.GetUnderlyingType(type);
        //                }

        //                dt.Columns.Add(reader.GetName(i), type);
        //            }

        //            // Leer y agregar fila por fila
        //            while (reader.Read())
        //            {
        //                var row = dt.NewRow();
        //                for (int i = 0; i < reader.FieldCount; i++)
        //                {
        //                    row[i] = reader.IsDBNull(i) ? DBNull.Value : reader.GetValue(i);
        //                }
        //                dt.Rows.Add(row);
        //            }
        //        }

        //        System.IO.File.Delete(tempPath); // Eliminar el archivo temporal

        //        return dt;
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }

        //}


        /*
        [HttpPost]
        public async Task<ActionResult> ActualizarCatalogoBienesInsumos() {
            string mensaje = "";
            DataTable tabla = new DataTable();
            DalCatalogoBienesInsumos dal = new DalCatalogoBienesInsumos();
            bool sesion = HttpContext.User.Identity.IsAuthenticated;

            string rutaDBF = @"C:\CarpetaDBF";
            string nombreArchivo = "MiArchivo"; // Sin extensión .dbf

            string cadenaConexion = $"Driver={{Microsoft dBase Driver (*.dbf)}};SourceType=DBF;SourceDB={rutaDBF};Exclusive=No;";

            using (OdbcConnection conexion = new OdbcConnection(cadenaConexion))
            {
                try
                {
                    conexion.Open();
                    string consulta = $"SELECT * FROM {nombreArchivo}"; // Tabla DBF

                    using (OdbcCommand comando = new OdbcCommand(consulta, conexion))
                    using (OdbcDataAdapter adaptador = new OdbcDataAdapter(comando))
                    {

                        adaptador.Fill(tabla);

                        foreach (DataRow fila in tabla.Rows)
                        {
                            Console.WriteLine(string.Join(" | ", fila.ItemArray));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
            }

            return Json(new { respuesta = tabla, mensaje = mensaje, sesion = sesion });
        }
        */
        /*=======================================================================*/


    }
}
