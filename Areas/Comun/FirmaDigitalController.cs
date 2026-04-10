using Aspose.Zip.SevenZip;
using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NPOI.HPSF;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.Services.Firma;

namespace WebAppMaternidad.Areas.Comun
{
    public class FirmaDigitalController : Controller
    {
        private readonly IFirmaService _firmaService;

        public FirmaDigitalController(IFirmaService firmaService = null)
        {
            _firmaService = firmaService ?? new FirmaService();
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// FIRMA DIGITAL FIRMA PERU
        /// </summary>
        /// <param name="server"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> FirmaDigitalFirmaPeru(string server, string code)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                Conexion con = new Conexion();
                DataSet DatosFirma;
                DalFirmaDigital dalFirma = new DalFirmaDigital();
                UtilitarioController util = new UtilitarioController();
                //DatosFirma = await dalUtili.ListaFirmaByIdCuentaByIdegistroByTipo(idCuenta, idRegistro, tipo);
                code = DecodificarDeUrl(code);
                //DatosFirma = await dalUtili.FirmaDigitalSeleccionarPorCode(code);
                DatosFirma = await dalFirma.FirmaDigitalSeleccionarPorCodePorIdEmpleado(code, idUsuario);

                string ApiFirmaDigital = con.obtenerApiFirmaDigital();
                string idFirma = DatosFirma.Tables[0].Rows[0]["id"].ToString();
                string codigoFirma = DatosFirma.Tables[0].Rows[0]["code"].ToString();
                string rutaArchivoFirma = DatosFirma.Tables[0].Rows[0]["rutaArchivo"].ToString();
                string idCuentaFirma = DatosFirma.Tables[0].Rows[0]["idCuentaAtencion"].ToString();
                string idRegistroFirma = DatosFirma.Tables[0].Rows[0]["idRegistro"].ToString();
                string tipoFirma = DatosFirma.Tables[0].Rows[0]["tipo"].ToString();
                //string[] nameArchivoFirma = rutaArchivoFirma.Split("/");
                string nameArchivoFirma = DatosFirma.Tables[0].Rows[0]["nombreArchivo"].ToString();
                string Motivo = DatosFirma.Tables[0].Rows[0]["MotivoFP"].ToString();
                string RucEESS = DatosFirma.Tables[0].Rows[0]["RucEESS"].ToString();
                string TipoEmpleado = DatosFirma.Tables[0].Rows[0]["TipoEmpleado"].ToString();
                string Colegio = DatosFirma.Tables[0].Rows[0]["Colegio"].ToString();
                string DatosMedico = DatosFirma.Tables[0].Rows[0]["DatosMedicoFP"].ToString();
                string x = DatosFirma.Tables[0].Rows[0]["XFP"].ToString();
                string y = DatosFirma.Tables[0].Rows[0]["YFP"].ToString();
                string Longitud = DatosFirma.Tables[0].Rows[0]["LongitudFP"].ToString();

                string x2 = DatosFirma.Tables[0].Rows[0]["X2"].ToString();
                string y2 = DatosFirma.Tables[0].Rows[0]["Y2"].ToString();
                string ImagenNombre = DatosFirma.Tables[0].Rows[0]["ImagenNombreFP"].ToString();
                string LetraTamanio = DatosFirma.Tables[0].Rows[0]["LetraTamanioFP"].ToString();

                int statusFirma = Int32.Parse(DatosFirma.Tables[0].Rows[0]["statusFirma"].ToString());
                if (statusFirma == 1)
                {
                    rutaArchivoFirma = rutaArchivoFirma.Replace("UNSIGNED", "SIGNED");
                }

                string apiFirma = con.obtenerApiFirmaDigital();
                string rutaFile = server + rutaArchivoFirma;
                string rutaLogoBase = $"{Request.Scheme}://{Request.Host}";
                string rutaLogo = rutaLogoBase + "/resources/logosFirma/" + ImagenNombre;
                string rutaFileOriginal = rutaFile;
                string rutaLogoOriginal = rutaLogo;
                string documentID = rutaArchivoFirma + "," + idCuentaFirma + "," + idRegistroFirma + "," + tipoFirma + "," + codigoFirma + "," + idUsuario.ToString() + "," + statusFirma.ToString();

                rutaFile = util.CodificarDeUrl(rutaFile);
                rutaLogo = util.CodificarDeUrl(rutaLogo);
                documentID = util.CodificarDeUrl(documentID);
                Motivo = util.CodificarDeUrl(Motivo);
                DatosMedico = util.CodificarDeUrl(DatosMedico);

                string token = await _firmaService.ObtenerTokenAsync();

                ///////////////////FIRMA PERU////////////////
                string paramUrl = apiFirma + "/param.php?document=" + rutaFile + "&logo=" + rutaLogo;
                paramUrl += "&Motivo=" + Motivo + "&DatosMedico=" + DatosMedico + "&LetraTamanio=" + LetraTamanio + "&X=" + x + "&Y=" + y + "&Longitud=" + Longitud + "&ID=" + documentID;
                string param = _firmaService.ConstruirParametroFirma(paramUrl, token);

                code = DecodificarDeUrl(code);
                ViewBag.IdFirma = idFirma;
                ViewBag.CodigoFirma = code;
                ViewBag.ParametroFirma = param;
                ViewBag.UrlInvoker = _firmaService.ObtenerInvokerUrl();
                ViewBag.PdfsJson = JsonSerializer.Serialize(new[] { new { url = rutaFileOriginal, name = nameArchivoFirma } });

                int posX = int.TryParse(x, out var tmpX) ? tmpX : 10;
                int posY = int.TryParse(y, out var tmpY) ? tmpY : 12;
                int stampTextSize = int.TryParse(LetraTamanio, out var tmpSize) ? tmpSize : 14;
                ViewBag.FirmaParamJson = JsonSerializer.Serialize(new
                {
                    posx = posX,
                    posy = posY,
                    reason = Motivo,
                    role = DatosMedico,
                    stampSigned = rutaLogoOriginal,
                    pageNumber = 1,
                    visiblePosition = false,
                    oneByOne = false,
                    signatureStyle = 1,
                    stampTextSize = stampTextSize,
                    stampWordWrap = 37
                });

                return View("~/Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        [HttpGet]
        public async Task<IActionResult> FirmaDigitalMultipleFirmaPeru(string server, string nombrePaquete)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DalFirmaDigital dalFirma = new DalFirmaDigital();
                UtilitarioController util = new UtilitarioController();
                Conexion con = new Conexion();
                DataSet DatosFirmaPaquete;

                DatosFirmaPaquete = await dalFirma.FirmaDigitalSeleccionarPorPaquetePorIdEmpleado(nombrePaquete, idUsuario);
                string Motivo = DatosFirmaPaquete.Tables[0].Rows[0]["MotivoFP"].ToString();
                string DatosMedico = DatosFirmaPaquete.Tables[0].Rows[0]["DatosMedicoFP"].ToString();
                string x = DatosFirmaPaquete.Tables[0].Rows[0]["XFP"].ToString();
                string y = DatosFirmaPaquete.Tables[0].Rows[0]["YFP"].ToString();
                string Longitud = DatosFirmaPaquete.Tables[0].Rows[0]["LongitudFP"].ToString();
                string ImagenNombre = DatosFirmaPaquete.Tables[0].Rows[0]["ImagenNombreFP"].ToString();
                string LetraTamanio = DatosFirmaPaquete.Tables[0].Rows[0]["LetraTamanioFP"].ToString();


                string sWebRootFolder = con.ObtenerServidorArchivos();
                //string directorio = server + "/temp/" + nombrePaquete + "/" + "unsigned";
                string directorio = server + "/temp/" + nombrePaquete + "/" + "7z";

                //ViewBag.IdFirma = 0;
                //ViewBag.CodigoFirma = 0;

                //ViewBag.DocumentName = nombrePaquete + "-signed.zip";

                string apiFirma = con.obtenerApiFirmaDigital();
                string idPaquete = nombrePaquete + "," + idUsuario.ToString();
                string rutaFile = directorio + "/temp.7z";
                string rutaLogoBase = $"{Request.Scheme}://{Request.Host}";
                string rutaLogo = rutaLogoBase + "/resources/logosFirma/" + ImagenNombre;
                string rutaFileOriginal = rutaFile;
                string rutaLogoOriginal = rutaLogo;


                rutaFile = util.CodificarDeUrl(rutaFile);
                rutaLogo = util.CodificarDeUrl(rutaLogo);
                idPaquete = util.CodificarDeUrl(idPaquete);
                Motivo = util.CodificarDeUrl(Motivo);
                DatosMedico = util.CodificarDeUrl(DatosMedico);
                //"\"param_url\": \"http://localhost:8000/FirmaPeru/paramPackage.php?document=" + rutaFile + "&logo=" + rutaLogo + "&Motivo=" + Motivo + "&DatosMedico=" + DatosMedico + "&LetraTamanio=" + LetraTamanio + "&X=" + x + "&Y=" + y + "&Longitud=" + Longitud + "&ID=" + nombrePaquete + "\"," +
                string token = await _firmaService.ObtenerTokenAsync();

                ///////////////////FIRMA PERU////////////////
                string paramUrl = apiFirma + "/paramPackage.php?document=" + rutaFile + "&logo=" + rutaLogo + "&Motivo=" + Motivo + "&DatosMedico=" + DatosMedico + "&LetraTamanio=" + LetraTamanio + "&X=" + x + "&Y=" + y + "&Longitud=" + Longitud + "&ID=" + idPaquete;
                string param = _firmaService.ConstruirParametroFirma(paramUrl, token);

                ViewBag.CodigoFirma = nombrePaquete;
                ViewBag.ParametroFirma = param;
                ViewBag.UrlInvoker = _firmaService.ObtenerInvokerUrl();
                ViewBag.PdfsJson = JsonSerializer.Serialize(new[] { new { url = rutaFileOriginal, name = nombrePaquete } });

                int posX = int.TryParse(x, out var tmpX) ? tmpX : 10;
                int posY = int.TryParse(y, out var tmpY) ? tmpY : 12;
                int stampTextSize = int.TryParse(LetraTamanio, out var tmpSize) ? tmpSize : 14;
                ViewBag.FirmaParamJson = JsonSerializer.Serialize(new
                {
                    posx = posX,
                    posy = posY,
                    reason = Motivo,
                    role = DatosMedico,
                    stampSigned = rutaLogoOriginal,
                    pageNumber = 1,
                    visiblePosition = false,
                    oneByOne = false,
                    signatureStyle = 1,
                    stampTextSize = stampTextSize,
                    stampWordWrap = 37
                });

                return View("~/Views/Comun/FirmaPeru/FirmaDigitalFirmaPeru.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }

        }

        [HttpPost]
        public async Task<IActionResult> ObtenerTokenFirmaPeru()
        {
            try
            {
                var token = await _firmaService.ObtenerTokenAsync();
                return Json(new { ok = true, token });
            }
            catch (Exception ex)
            {
                return Json(new { ok = false, msg = ex.Message });
            }
        }


        [HttpPost("FirmaDigital/FirmaComponentFirmaPeru/{ID}")]
        public async Task<ActionResult> FirmaComponentFirmaPeru(string ID, List<IFormFile> signed_file) //KHOYOSI
        {
            DalUtilitario dl = new DalUtilitario();
            UtilitarioController util = new UtilitarioController();
            Conexion cn = new Conexion();


            ID = util.DecodificarDeUrl(ID);

            long size = signed_file.Sum(f => f.Length);
            var filePaths = new List<string>();
            string rutaDocumento = "";
            string idCuentaAtencion = "";
            string idRegistro = "";
            string tipo = "";
            string code = "";
            string controller = "FirmaDigital";
            string metodo = "FinFirmaDigitalFirmaPeru";
            string idUsuario = "";
            string statusFirma = "";


            if (ID != null)
            {
                rutaDocumento = ID.Split(',')[0];
                idCuentaAtencion = ID.Split(',')[1];
                idRegistro = ID.Split(',')[2];
                tipo = ID.Split(',')[3];
                code = ID.Split(',')[4];
                idUsuario = ID.Split(',')[5];
                statusFirma = ID.Split(',')[6];
            }

            foreach (var formFile in signed_file)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        if (Int32.Parse(statusFirma) == 0)
                        {
                            rutaDocumento = rutaDocumento.Replace("/UNSIGNED/", "");
                        }
                        else
                        {
                            rutaDocumento = rutaDocumento.Replace("/SIGNED/", "");
                        }


                        //tring ruta = "C:/SisgalenFiles/4IdentitySignedFiles" + rutaDocumento;
                        string ruta = cn.ObtenerServidorArchivosConFirma() + rutaDocumento;
                        string directorio = ruta.Substring(0, ruta.LastIndexOf("/"));
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        // full path to file in temp location
                        //var filePath = "C:\\SisgalenFiles\\4IdentitySignedFiles\\" + rutaDocumento; //we are using Temp file name just for the example. Add your own file path.
                        var filePath = cn.ObtenerServidorArchivosConFirma() + rutaDocumento; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                            //var rsFirma = await dl.InsertaFirmaDigital(code);
                            var rsFirma = await dl.EstadoFirmaDigitalAutoriza(code, Int32.Parse(idUsuario));
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                }
            }

            return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        }


        [HttpPost("FirmaDigital/FirmaMultipleComponentFirmaPeru/{ID}")]
        public async Task<ActionResult> FirmaMultipleComponentFirmaPeru(string ID, IList<IFormFile> signed_file) // KHOYOSI
        {
            Conexion con = new Conexion();
            DalFirmaDigital dalFirma = new DalFirmaDigital();

            DataSet dataSet;
            long size = signed_file.Sum(f => f.Length);
            var filePaths = new List<string>();
            //string rutaDocumento = "";
            //string idCuentaAtencion = "";
            //string idRegistro = "";
            //string tipo = "";
            string controller = "FirmaDigital";
            string metodo = "FinFirmaDigitalFirmaPeru";
            string ruta = "";
            //bool estado = false;
            //bool fileAnt = false;
            string paquete = "";
            string idUsuario = "";

            if (ID != null)
            {
                paquete = ID.Split(',')[0];
                idUsuario = ID.Split(',')[1];
                //statusFirma = documentID.Split(',')[2];
            }

            foreach (var formFile in signed_file)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        // full path to file in temp location
                        //var filePath = "C:\\SisgalenFiles\\temp\\" + paquete + "\\signed\\temp-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
                        var filePath = con.ObtenerServidorArchivos() + "temp\\" + paquete + "\\signed\\temp-signed.7z"; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                        }

                        //string sWebRootFolder = con.ObtenerServidorArchivos();
                        string sWebRootFolder = con.ObtenerServidorArchivosConFirma();
                        string pathExtract = con.ObtenerServidorArchivos() + "temp\\" + paquete + "\\signed\\temp";

                        using (var archive = new SevenZipArchive(filePath))
                        {
                            archive.ExtractToDirectory(pathExtract);
                        }


                        // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada
                        DirectoryInfo di = new DirectoryInfo(pathExtract);

                        foreach (var fi in di.GetFiles())
                        {
                            dataSet = await dalFirma.SeleccionarFirmaDigitalPorNombreArchivo(fi.Name);
                            //ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles" + dataSet.Tables[0].Rows[0]["pathArchivo"].ToString());
                            string pathArchivo = dataSet.Tables[0].Rows[0]["pathArchivo"].ToString();
                            pathArchivo = pathArchivo.Replace("/UNSIGNED/", "");
                            ruta = Path.Combine(sWebRootFolder, pathArchivo);

                            if (!Directory.Exists(ruta))
                            {
                                Directory.CreateDirectory(ruta);
                            }

                            if (System.IO.File.Exists(fi.FullName))
                            {
                                System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fi.Name.ToString().Replace("[FP]", "")}"), true);
                            }

                            //await dalUtil.EstadoFirmaModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), 1);
                            await dalFirma.EstadoFirmaEmpleadoModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), Int32.Parse(idUsuario), 1);
                        }

                        string resp = await dalFirma.PaqueteArchivoModificar(paquete, Int32.Parse(idUsuario), 0);
                        if (resp != "" || resp != null)
                        {
                            Directory.Delete(con.ObtenerServidorArchivos() + "temp\\" + ID, true);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                }
                //estado = true                
            }

            //var variableaeliminar = "ahora";
            return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });

        }


        [HttpGet]
        public IActionResult FinFirmaDigitalFirmaPeru()
        {
            try
            {
                //if (HttpContext.User.Identity.IsAuthenticated == false)
                //{
                //    return View("Login");
                //}

                return View("~/Views/Comun/FirmaPeru/FinFirmaDigitalFirmaPeru.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivos7zip(string cuentasAtencion, string registros, string tipos)
        {
            string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
            var path = "";
            string valor = "";
            DalFirmaDigital dalFirma = new DalFirmaDigital();
            DataSet archivos = new DataSet();
            Conexion con = new Conexion();
            string sWebRootFolder = con.ObtenerServidorArchivos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            //archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorCuentas(cuentasAtencion, idEvaluacion, idServicio, idUsuario);
            //return await CrearPaqueteArchivos(archivos, idUsuario);

            string nombrePaquete = await dalFirma.FirmaDigitalGenerarPaquete(cuentasAtencion, registros, tipos, idUsuario);
            archivos = await dalFirma.FirmaDigitalSeleccionarPorPaquetePorIdEmpleado(nombrePaquete, idUsuario);

            try
            {
                if (archivos.Tables[0].Rows.Count > 0)
                {
                    //paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, "", idUsuario, 1);
                    //if (paquete != "")
                    //{
                    directorio = Path.Combine(sWebRootFolder, "temp", nombrePaquete.ToString(), "unsigned");
                    directorio2 = Path.Combine(sWebRootFolder, "temp", nombrePaquete.ToString(), "signed");
                    directorio3 = Path.Combine(sWebRootFolder, "temp", nombrePaquete.ToString(), "7z");
                    rutaZip = directorio3 + @"\temp.7z";
                    if (!Directory.Exists(directorio))
                    {
                        Directory.CreateDirectory(directorio);
                    }

                    if (!Directory.Exists(directorio2))
                    {
                        Directory.CreateDirectory(directorio2);
                    }

                    if (!Directory.Exists(directorio3))
                    {
                        Directory.CreateDirectory(directorio3);
                    }

                    foreach (DataRow row in archivos.Tables[0].Rows)
                    {
                        path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
                        System.IO.File.Copy(row["rutaArchivoOriginal"].ToString(), path, true);
                    }
                    valor = dalFirma.ComprimirArchivoEn7Zip(directorio, rutaZip);
                    //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
                    //}
                    //else
                    //{
                    //    return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
                    //}
                }
                else
                {
                    return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
                }


                return Json(new { error = false, estado = true, msg = valor, data = nombrePaquete });
            }
            catch (Exception e)
            {
                return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
            }

        }








        /// <summary>
        /// FIRMA DIGITAL BIT FOUR ID
        /// </summary>
        /// <param name="server"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        /////////////////////////////////FIRMA DIGITAL POR ARCHIVOS///////////////////////////////////////
        [HttpGet]
        public async Task<IActionResult> FirmaDigitalBitFourId(string server, string code)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //ROLES LUIS
                int idUsuario;
                idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                Conexion con = new Conexion();
                DataSet DatosFirma;
                DalFirmaDigital dalFirma = new DalFirmaDigital();
                //DatosFirma = await dalUtili.ListaFirmaByIdCuentaByIdegistroByTipo(idCuenta, idRegistro, tipo);
                code = DecodificarDeUrl(code);
                //DatosFirma = await dalUtili.FirmaDigitalSeleccionarPorCode(code);
                DatosFirma = await dalFirma.FirmaDigitalSeleccionarPorCodePorIdEmpleado(code, idUsuario);

                string ApiFirmaDigital = con.obtenerApiFirmaDigital();
                string idFirma = DatosFirma.Tables[0].Rows[0]["id"].ToString();
                string codigoFirma = DatosFirma.Tables[0].Rows[0]["code"].ToString();
                string rutaArchivoFirma = DatosFirma.Tables[0].Rows[0]["rutaArchivo"].ToString();
                string idCuentaFirma = DatosFirma.Tables[0].Rows[0]["idCuentaAtencion"].ToString();
                string idRegistroFirma = DatosFirma.Tables[0].Rows[0]["idRegistro"].ToString();
                string tipoFirma = DatosFirma.Tables[0].Rows[0]["tipo"].ToString();
                //string[] nameArchivoFirma = rutaArchivoFirma.Split("/");
                string nameArchivoFirma = DatosFirma.Tables[0].Rows[0]["nombreArchivo"].ToString();
                string Motivo = DatosFirma.Tables[0].Rows[0]["Motivo"].ToString();
                string RucEESS = DatosFirma.Tables[0].Rows[0]["RucEESS"].ToString();
                string TipoEmpleado = DatosFirma.Tables[0].Rows[0]["TipoEmpleado"].ToString();
                string Colegio = DatosFirma.Tables[0].Rows[0]["Colegio"].ToString();
                string DatosMedico = DatosFirma.Tables[0].Rows[0]["DatosMedico"].ToString();
                string x1 = DatosFirma.Tables[0].Rows[0]["X1"].ToString();
                string y1 = DatosFirma.Tables[0].Rows[0]["Y1"].ToString();
                string x2 = DatosFirma.Tables[0].Rows[0]["X2"].ToString();
                string y2 = DatosFirma.Tables[0].Rows[0]["Y2"].ToString();
                string ImagenNombre = DatosFirma.Tables[0].Rows[0]["ImagenNombre"].ToString();
                string LetraTamanio = DatosFirma.Tables[0].Rows[0]["LetraTamanio"].ToString();

                int statusFirma = Int32.Parse(DatosFirma.Tables[0].Rows[0]["statusFirma"].ToString());
                if (statusFirma == 1)
                {
                    rutaArchivoFirma = rutaArchivoFirma.Replace("UNSIGNED", "SIGNED");
                }

                ViewBag.ApiFirmaDigital = ApiFirmaDigital;
                ViewBag.IdFirma = idFirma;
                ViewBag.CodigoFirma = codigoFirma;
                ViewBag.Document = server + rutaArchivoFirma;
                //ViewBag.DocumentName = nameArchivoFirma[5];
                ViewBag.DocumentName = nameArchivoFirma + ".pdf";
                ViewBag.DocumentID = rutaArchivoFirma + "," + idCuentaFirma + "," + idRegistroFirma + "," + tipoFirma + "," + codigoFirma + ",FirmaDigital,FinFirmaDigitalBitFourId," + idUsuario.ToString() + "," + statusFirma.ToString();
                ViewBag.Image = server + "/resources/logosFirma/" + ImagenNombre;
                ViewBag.Motivo = Motivo;
                ViewBag.RucEESS = RucEESS;
                ViewBag.TipoEmpleado = TipoEmpleado;
                ViewBag.Colegio = Colegio;
                ViewBag.DatosMedico = DatosMedico;
                ViewBag.X1 = x1;
                ViewBag.Y1 = y1;
                ViewBag.X2 = x2;
                ViewBag.Y2 = y2;
                ViewBag.LetraTamanio = LetraTamanio;
                //ViewBag.ParagraphFormat = server + "/logosFirma/isotipo.png";

                return View("~/Views/Comun/FirmaDigitalBit4Id.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }


        [HttpPost]
        public async Task<ActionResult> FirmaComponent(List<IFormFile> attach, string documentID)
        {
            DalUtilitario dl = new DalUtilitario();
            Conexion cn = new Conexion();

            long size = attach.Sum(f => f.Length);
            var filePaths = new List<string>();
            string rutaDocumento = "";
            string idCuentaAtencion = "";
            string idRegistro = "";
            string tipo = "";
            string code = "";
            string controller = "";
            string metodo = "";
            string idUsuario = "";
            string statusFirma = "";

            if (documentID != null)
            {
                rutaDocumento = documentID.Split(',')[0];
                idCuentaAtencion = documentID.Split(',')[1];
                idRegistro = documentID.Split(',')[2];
                tipo = documentID.Split(',')[3];
                code = documentID.Split(',')[4];
                controller = documentID.Split(',')[5];
                metodo = documentID.Split(',')[6];
                idUsuario = documentID.Split(',')[7];
                statusFirma = documentID.Split(',')[8];
            }

            foreach (var formFile in attach)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        if (Int32.Parse(statusFirma) == 0)
                        {
                            rutaDocumento = rutaDocumento.Replace("/UNSIGNED/", "");
                        }
                        else
                        {
                            rutaDocumento = rutaDocumento.Replace("/SIGNED/", "");
                        }


                        //tring ruta = "C:/SisgalenFiles/4IdentitySignedFiles" + rutaDocumento;
                        string ruta = cn.ObtenerServidorArchivosConFirma() + rutaDocumento;
                        string directorio = ruta.Substring(0, ruta.LastIndexOf("/"));
                        if (!Directory.Exists(directorio))
                        {
                            Directory.CreateDirectory(directorio);
                        }

                        // full path to file in temp location
                        //var filePath = "C:\\SisgalenFiles\\4IdentitySignedFiles\\" + rutaDocumento; //we are using Temp file name just for the example. Add your own file path.
                        var filePath = cn.ObtenerServidorArchivosConFirma() + rutaDocumento; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                            //var rsFirma = await dl.InsertaFirmaDigital(code);
                            var rsFirma = await dl.EstadoFirmaDigitalAutoriza(code, Int32.Parse(idUsuario));
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }
                }
            }

            return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        }





        /////////////////////////////////FIRMA DIGITAL POR PAQUETES///////////////////////////////////////

        [HttpPost]
        public async Task<ActionResult> CrearPaqueteArchivos(string cuentasAtencion, string registros, string tipos)
        {
            string directorio = "", directorio2 = "", directorio3 = "", rutaZip = "";
            var path = "";
            string valor = "";
            DalFirmaDigital dalFirma = new DalFirmaDigital();
            DataSet archivos = new DataSet();
            Conexion con = new Conexion();
            string sWebRootFolder = con.ObtenerServidorArchivos();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            //archivos = await dalUtil.FirmaDigitalSeleccionarDatosPorCuentas(cuentasAtencion, idEvaluacion, idServicio, idUsuario);
            //return await CrearPaqueteArchivos(archivos, idUsuario);

            string nombrePaquete = await dalFirma.FirmaDigitalGenerarPaquete(cuentasAtencion, registros, tipos, idUsuario);
            archivos = await dalFirma.FirmaDigitalSeleccionarPorPaquetePorIdEmpleado(nombrePaquete, idUsuario);

            try
            {
                if (archivos.Tables[0].Rows.Count > 0)
                {
                    //paquete = await dalUtil.PaqueteArchivoModificar(nombrePaquete, "", idUsuario, 1);
                    //if (paquete != "")
                    //{
                    directorio = Path.Combine(sWebRootFolder, "temp", nombrePaquete.ToString(), "unsigned");
                    directorio2 = Path.Combine(sWebRootFolder, "temp", nombrePaquete.ToString(), "signed");
                    directorio3 = Path.Combine(sWebRootFolder, "temp", nombrePaquete.ToString(), "zip");
                    rutaZip = directorio3 + @"\temp.zip";
                    if (!Directory.Exists(directorio))
                    {
                        Directory.CreateDirectory(directorio);
                    }

                    if (!Directory.Exists(directorio2))
                    {
                        Directory.CreateDirectory(directorio2);
                    }

                    if (!Directory.Exists(directorio3))
                    {
                        Directory.CreateDirectory(directorio3);
                    }

                    foreach (DataRow row in archivos.Tables[0].Rows)
                    {
                        path = Path.Combine(directorio, row["nombreArchivo"].ToString() + ".pdf");
                        System.IO.File.Copy(row["rutaArchivoOriginal"].ToString(), path, true);
                    }
                    valor = dalFirma.ComprimirArchivoEnZip(directorio, rutaZip);
                    //valor = dalUtil.ComprimirArchivo(directorio, rutaZip);
                    //}
                    //else
                    //{
                    //    return Json(new { error = true, estado = false, msg = "Hubo un error creando el paquete." });
                    //}
                }
                else
                {
                    return Json(new { error = false, estado = false, msg = "No hay documentos pendientes de firma, o no esta autorizado para firmar estos documentos." });
                }


                return Json(new { error = false, estado = true, msg = valor, data = nombrePaquete });
            }
            catch (Exception e)
            {
                return Json(new { error = true, session = true, estado = false, msg = "ERRORR: " + e.ToString(), data = "" });
            }

        }


        [HttpGet]
        public async Task<IActionResult> FirmaDigitalBitFourIdMultiple(string server, string nombrePaquete)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                //DataSet DatosFirma;
                DalFirmaDigital dalFirma = new DalFirmaDigital();
                Conexion con = new Conexion();
                DataSet DatosFirmaPaquete;

                int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                DatosFirmaPaquete = await dalFirma.FirmaDigitalSeleccionarPorPaquetePorIdEmpleado(nombrePaquete, idUsuario);

                string sWebRootFolder = con.ObtenerServidorArchivos();
                //string directorio = server + "/temp/" + nombrePaquete + "/" + "unsigned";
                string directorio = server + "/temp/" + nombrePaquete + "/" + "zip";

                string ApiFirmaDigital = con.obtenerApiFirmaDigital();

                string ImagenNombre = DatosFirmaPaquete.Tables[0].Rows[0]["ImagenNombre"].ToString();
                string LetraTamanio = DatosFirmaPaquete.Tables[0].Rows[0]["LetraTamanio"].ToString();

                ViewBag.ApiFirmaDigital = ApiFirmaDigital;
                ViewBag.IdFirma = 0;
                ViewBag.CodigoFirma = 0;
                ViewBag.Document = directorio + "/temp.zip";
                ViewBag.DocumentName = nombrePaquete + "-signed.zip";
                ViewBag.DocumentID = nombrePaquete + "," + idUsuario.ToString();
                ViewBag.Image = server + "/resources/logosFirma/" + ImagenNombre;
                ViewBag.Motivo = DatosFirmaPaquete.Tables[0].Rows[0]["Motivo"].ToString();
                ViewBag.RucEESS = DatosFirmaPaquete.Tables[0].Rows[0]["RucEESS"].ToString();
                ViewBag.TipoEmpleado = DatosFirmaPaquete.Tables[0].Rows[0]["TipoEmpleado"].ToString();
                ViewBag.Colegio = DatosFirmaPaquete.Tables[0].Rows[0]["Colegio"].ToString();
                ViewBag.DatosMedico = DatosFirmaPaquete.Tables[0].Rows[0]["DatosMedico"].ToString();
                ViewBag.x1 = DatosFirmaPaquete.Tables[0].Rows[0]["X1"].ToString();
                ViewBag.y1 = DatosFirmaPaquete.Tables[0].Rows[0]["Y1"].ToString();
                ViewBag.x2 = DatosFirmaPaquete.Tables[0].Rows[0]["X2"].ToString();
                ViewBag.y2 = DatosFirmaPaquete.Tables[0].Rows[0]["Y2"].ToString();
                ViewBag.LetraTamanio = LetraTamanio;


                return View("~/Views/Comun/FirmaDigitalBit4IdMultiple.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        [HttpPost]
        public async Task<ActionResult> FirmaMultipleComponent(IList<IFormFile> attach, string documentID) // JDELGADO013
        {
            Conexion con = new Conexion();
            DalFirmaDigital dalFirma = new DalFirmaDigital();

            DataSet dataSet;
            long size = attach.Sum(f => f.Length);
            var filePaths = new List<string>();
            //string rutaDocumento = "";
            //string idCuentaAtencion = "";
            //string idRegistro = "";
            //string tipo = "";
            string controller = "FirmaDigital";
            string metodo = "FinFirmaDigitalBitFourId";
            string ruta = "";
            //bool estado = false;
            //bool fileAnt = false;
            string paquete = "";
            string idUsuario = "";

            if (documentID != null)
            {
                paquete = documentID.Split(',')[0];
                idUsuario = documentID.Split(',')[1];
                //statusFirma = documentID.Split(',')[2];
            }

            foreach (var formFile in attach)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        // full path to file in temp location
                        //var filePath = "C:\\SisgalenFiles\\temp\\" + paquete + "\\signed\\temp-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
                        var filePath = con.ObtenerServidorArchivos() + "temp\\" + paquete + "\\signed\\temp-signed.zip"; //we are using Temp file name just for the example. Add your own file path.
                        filePaths.Add(filePath);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);

                            //var rsFirma = await dl.InsertaFirma(filePath, rutaDocumento, idCuentaAtencion, Int32.Parse(idCuentaAtencion), Int32.Parse(idRegistro), tipo, "U", 1, "");
                        }

                        //string sWebRootFolder = con.ObtenerServidorArchivos();
                        string sWebRootFolder = con.ObtenerServidorArchivosConFirma();
                        string pathExtract = con.ObtenerServidorArchivos() + "temp\\" + paquete + "\\signed\\temp";
                        ZipFile.ExtractToDirectory(filePath, pathExtract);


                        // esta parte se debe implementar para copiar los archivos en otras carpetas con el objetivo de mantener la distribucion de carpetas adecuada
                        DirectoryInfo di = new DirectoryInfo(pathExtract);

                        foreach (var fi in di.GetFiles())
                        {
                            dataSet = await dalFirma.SeleccionarFirmaDigitalPorNombreArchivo(fi.Name);
                            //ruta = Path.Combine(sWebRootFolder, $"4IdentitySignedFiles" + dataSet.Tables[0].Rows[0]["pathArchivo"].ToString());
                            string pathArchivo = dataSet.Tables[0].Rows[0]["pathArchivo"].ToString();
                            pathArchivo = pathArchivo.Replace("/UNSIGNED/", "");
                            ruta = Path.Combine(sWebRootFolder, pathArchivo);

                            if (!Directory.Exists(ruta))
                            {
                                Directory.CreateDirectory(ruta);
                            }

                            if (System.IO.File.Exists(fi.FullName))
                            {
                                System.IO.File.Copy(fi.FullName.ToString(), Path.Combine(ruta, $"{fi.Name}"), true);
                            }

                            //await dalUtil.EstadoFirmaModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), 1);
                            await dalFirma.EstadoFirmaEmpleadoModificar(Int32.Parse(dataSet.Tables[0].Rows[0]["id"].ToString()), dataSet.Tables[0].Rows[0]["code"].ToString(), Int32.Parse(idUsuario), 1);
                        }

                        string resp = await dalFirma.PaqueteArchivoModificar(paquete, Int32.Parse(idUsuario), 0);
                        if (resp != "" || resp != null)
                        {
                            Directory.Delete(con.ObtenerServidorArchivos() + "temp\\" + documentID, true);
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                    }

                }
                //estado = true                
            }

            //var variableaeliminar = "ahora";
            return RedirectToAction(metodo, controller, new { idListBar = 103, area = "Comun" });
        }


        //////////////////////////////METODOS ADICIONALES////////////////////////////////////////////////////////////////////////
        [HttpGet]
        public IActionResult FinFirmaDigitalBitFourId()
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated == false)
                {
                    return View("Login");
                }

                return View("~/Views/Comun/FinFirmaDigitalBit4Id.cshtml");
            }
            catch (Exception ex)
            {
                ViewBag.DescripcionError = ex.Message;
                return View("Error");
            }
        }

        public string CodificarDeUrl(string cadena)
        {
            try
            {
                cadena = cadena.Replace("%", "%25");
                cadena = cadena.Replace("+", "%2B");
                cadena = cadena.Replace(" ", "%20");
                cadena = cadena.Replace("/", "%2F");
                cadena = cadena.Replace("?", "%3F");
                cadena = cadena.Replace("#", "%23");
                cadena = cadena.Replace("&", "%26");
                cadena = cadena.Replace("=", "%3D");

                return cadena;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string DecodificarDeUrl(string cadena)
        {
            try
            {
                cadena = cadena.Replace("%2B", "+");
                cadena = cadena.Replace("%20", " ");
                cadena = cadena.Replace("%2F", "/");
                cadena = cadena.Replace("%3F", "?");
                cadena = cadena.Replace("%25", "%");
                cadena = cadena.Replace("%23", "#");
                cadena = cadena.Replace("%26", "&");
                cadena = cadena.Replace("%3D", "=");

                return cadena;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }


    }
}
