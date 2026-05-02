using CapaDatos;
using CapaEntidades;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using System;
using System.IO;
using SiHospCrypKey;
using iText.Layout.Properties;
using iText.Kernel.Font;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Comun
{
    public class PruebasPdfController: BaseController
    {
        public async void Index()
        {
            DalParametros daoParametros = new DalParametros();

            var lsParametros = await daoParametros.RetornaFechaServidorV2();
            // Crear un nuevo documento PDF
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter("ejemplo.pdf"));
            Document document = new Document(pdfDoc);

            // Agregar un título al documento
            Paragraph title = new Paragraph("Mi Documento PDF");
            document.Add(title);

            // Agregar un párrafo de texto al documento
            Paragraph text = new Paragraph("Este es el contenido de mi documento PDF.");
            
            document.Add(text);
            text = new Paragraph(lsParametros.Tables[0].Rows[0]["FechaHoraSQL"].ToString());
            document.Add(text);
            // Cerrar el documento
            document.Close();
        }

        //[HttpGet]
        //public async Task<Boolean> GenerarDocumentoDigital(int idCuentaAtencion, int idRegistro, int idItem, string tipo, int idNumero, int IdUsuario)
        //{
        //    //FormatoPdf pdff = new FormatoPdf();
        //    FirmaDigital firma = new FirmaDigital();
        //    ClUtilirario clUtilitario = new ClUtilirario();

        //    DalUtilitario dalUtilitario = new DalUtilitario();
        //    DalParametros daoParametros = new DalParametros();

        //    DataSet lsParametros = new DataSet();
        //    DataSet datos;
        //    DataSet dataFile;
        //    string nombreRuta, accion = "", nombreArchivoAnt, rutaFolderAnt;
        //    bool Tbol, pdfAnt;

        //    String telefono, nombre, direccion;


        //    try
        //    {
        //        datos = await dalUtilitario.FirmaDigitalSeleccionarDatos(idCuentaAtencion, idRegistro, idItem, tipo, idNumero);
        //        firma.code = datos.Tables[0].Rows[0]["code"].ToString();
        //        firma.idCuentaAtencion = Convert.ToInt32(datos.Tables[0].Rows[0]["idCuentaAtencion"].ToString());
        //        firma.idRegistro = Convert.ToInt32(datos.Tables[0].Rows[0]["idRegistro"].ToString());
        //        firma.idTipoServicio = Convert.ToInt32(datos.Tables[0].Rows[0]["idTipoServicio"].ToString());
        //        firma.idServicio = Convert.ToInt32(datos.Tables[0].Rows[0]["idServicio"].ToString());
        //        firma.idEvaluacion = Convert.ToInt32(datos.Tables[0].Rows[0]["idEvaluacion"].ToString());
        //        firma.idEmpleado = Convert.ToInt32(datos.Tables[0].Rows[0]["idEmpleado"].ToString());
        //        firma.fecha = datos.Tables[0].Rows[0]["fecha"].ToString();
        //        firma.tipo = datos.Tables[0].Rows[0]["tipo"].ToString();
        //        firma.idUsuarioRegistra = IdUsuario;
        //        firma.idItem = idItem;


        //        nombreRuta = await GenerarRutaArchivoPdf(firma.idCuentaAtencion, firma.idTipoServicio, firma.tipo);
        //        if (firma.code == "0")
        //        {
        //            accion = "I";
        //            firma.code = await GenerarCodeArchivoPdf(firma);
        //        }
        //        else
        //        {
        //            dataFile = await dalUtilitario.FirmaDigitalSeleccionarPorCode(firma.code);
        //            nombreArchivoAnt = dataFile.Tables[0].Rows[0]["nombreArchivo"].ToString() + ".pdf";
        //            rutaFolderAnt = dataFile.Tables[0].Rows[0]["rutaFolder"].ToString();
        //            pdfAnt = MoverArchivoPdf(rutaFolderAnt, nombreArchivoAnt);
        //        }

        //        firma.nombreArchivo = await GenerarNombreArchivoPdf(firma);
        //        firma.rutaArchivo = nombreRuta + firma.nombreArchivo + ".pdf";


        //        Tbol = await clUtilitario.FirmaDigitalModificar(firma, accion);

        //        if (Tbol)
        //        {
        //            lsParametros = await daoParametros.SeleccionaFilaParametro2(205, idIpressInt);
        //            nombre = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //            lsParametros.Clear();

        //            lsParametros = await daoParametros.SeleccionaFilaParametro2(206, idIpressInt);
        //            direccion = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();

        //            lsParametros.Clear();

        //            lsParametros = await daoParametros.SeleccionaFilaParametro2(207, idIpressInt);
        //            telefono = lsParametros.Tables[0].Rows[0]["valorTexto"].ToString();


        //            // Crear un objeto PdfWriter y especificar la ruta de salida del archivo PDF
        //            PdfWriter writer = new PdfWriter("ticket.pdf");

        //            // Crear un objeto PdfDocument con el objeto PdfWriter
        //            PdfDocument pdf = new PdfDocument(writer);

        //            // Crear un objeto Document con el objeto PdfDocument
        //            Document document = new Document(pdf, iText.Kernel.Geom.PageSize.A7);

        //            // Crear un objeto Paragraph con el contenido del ticket
        //            // Crear un objeto Paragraph con el título del encabezado
        //            Paragraph title = new Paragraph("Encabezado").SetFont(PdfFontFactory.CreateFont(PdfFontConstants.HELVETICA_BOLD)).SetFontSize(18).SetTextAlignment(TextAlignment.CENTER);
        //            // Crear un objeto Paragraph con el subtitulo del encabezado
        //            Paragraph subtitle = new Paragraph("Subtitulo").SetFont(PdfFontFactory.CreateFont(PdfFontConstants.HELVETICA)).SetFontSize(12).SetTextAlignment(TextAlignment.CENTER);

        //            Paragraph header = new Paragraph($"{nombre}\n").SetTextAlignment(TextAlignment.CENTER);
        //            Paragraph body = new Paragraph("Producto 1       $10.00\nProducto 2       $20.00\n\nTotal          $30.00\n\nGracias por su compra.").SetTextAlignment(TextAlignment.LEFT);
        //            Paragraph footer = new Paragraph("\nFecha: " + DateTime.Now.ToString()).SetTextAlignment(TextAlignment.RIGHT);

        //            // Dar estilo al contenido del ticket
        //            header.SetFontSize(10);
        //            body.SetFontSize(8);
        //            footer.SetFontSize(8);

        //            // Agregar el contenido al ticket
        //            document.Add(header);
        //            document.Add(body);
        //            document.Add(footer);

        //            // Cerrar el documento PDF
        //            document.Close();
        //        }
        //        else
        //        {
        //            return false;
        //        }

        //        return Tbol;
        //    }
        //    catch (Exception e)
        //    {
        //        Debug.Print(e.Message.ToString());
        //        return false;
        //    }
        //}

        public async Task<String> GenerarRutaArchivoPdf(int idCuentaAtencion, int idTipoServicio, string tipoDocumento)
        {
            DataSet lsAtencion;
            //bool rpta = false;
            string ruta, /*archivo,*/ sWebRootFolder, /*idAtencion,*/ nroHistoria, tipoServicio;
            DalAtenciones daoAtenciones = new DalAtenciones();
            ClUtilirario clUtilitario = new ClUtilirario();
            Conexion con = new Conexion();

            try
            {
                if (idTipoServicio == 1)
                {
                    tipoServicio = "ConsultaExterna";
                }
                else if (idTipoServicio == 2 || idTipoServicio == 4)
                {
                    tipoServicio = "Emergencia";
                }
                else if (idTipoServicio == 3)
                {
                    tipoServicio = "Hospitalizacion";
                }
                else
                {
                    tipoServicio = "Otros";
                }

                if (idCuentaAtencion > 0)
                {
                    lsAtencion = await daoAtenciones.ListaAtencionByIdCuentaAtencion(idCuentaAtencion);
                    //idAtencion = lsAtencion.Tables[0].Rows[0]["idAtencion"].ToString();
                    nroHistoria = lsAtencion.Tables[0].Rows[0]["NroHistoriaClinica"].ToString();

                    if (tipoDocumento == "CE-A")
                    {
                        tipoDocumento = "Atenciones";
                    }
                    else if (tipoDocumento == "REC")
                    {
                        tipoDocumento = "Recetas";
                    }
                    else if (tipoDocumento == "RF" || tipoDocumento == "CRF")
                    {
                        tipoDocumento = "HojasRefCon";
                    }
                    else if (tipoDocumento == "FUA")
                    {
                        tipoDocumento = "FUA";
                    }
                    else if (tipoDocumento == "E-EVA")
                    {
                        tipoDocumento = "Evaluaciones";
                    }
                    else if (tipoDocumento == "CN")
                    {
                        tipoDocumento = "ConstanciasNacimiento";
                    }
                    else if (tipoDocumento == "LAB-PC")
                    {
                        tipoDocumento = "Laboratorio";
                    }

                    ruta = nroHistoria + "/" + tipoServicio + "/" + idCuentaAtencion + "/" + tipoDocumento + "/";
                }
                else
                {
                    if (tipoDocumento == "CE-PD")
                    {
                        tipoDocumento = "PartesDiarios";
                    }

                    ruta = tipoServicio + "/" + tipoDocumento + "/";
                }

                //sWebRootFolder = con.ObtenerServidorArchivos();
                sWebRootFolder = con.ObtenerServidorArchivosSinFirma();
                if (!Directory.Exists(Path.Combine(sWebRootFolder, ruta)))
                {
                    Directory.CreateDirectory(Path.Combine(sWebRootFolder, ruta));
                }

                ruta = sWebRootFolder + ruta;
                //rpta = true;

                return ruta;
            }
            catch (Exception e)
            {
                Debug.Print(e.Message.ToString());
                //rpta = false;
                return "";
            }
        }

        public async Task<String> GenerarCodeArchivoPdf(FirmaDigital firma)
        {
            string code;

            code = firma.idCuentaAtencion.ToString() + "_" + firma.idRegistro.ToString() + "_" + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "_" + firma.tipo;
            code = await EncriptarCode(code);

            return code;
        }

        public async Task<String> GenerarNombreArchivoPdf(FirmaDigital firma)
        {
            string nombre;

            nombre = firma.idCuentaAtencion.ToString() + "_" + firma.idRegistro.ToString() + "_" + (DateTime.Now.ToString("HH:mm:ss")).Replace(":", "") + "_" + firma.tipo;
            nombre = await EncriptarNombre(nombre);

            return nombre;
        }
        public Boolean MoverArchivoPdf(string rutaFolder, string nombreArchivo)
        {
            bool resp = false;
            Conexion con = new Conexion();
            string rutaOrigen, rutaOrigenFirma;
            string rutaHistorial, rutaHistorialFirma;

            //sWebRootFolder = con.ObtenerServidorArchivos();

            //rutaOrigen = sWebRootFolder + rutaFolder + nombreArchivo;
            //rutaHistorial = sWebRootFolder + "history" + rutaFolder;

            //rutaOrigenFirma = sWebRootFolder + "/4IdentitySignedFiles/" + rutaFolder + nombreArchivo;
            //rutaHistorialFirma = sWebRootFolder + "/history/4IdentitySignedFiles/" + rutaFolder;

            rutaOrigen = con.ObtenerServidorArchivosSinFirma() + rutaFolder + nombreArchivo;
            rutaHistorial = con.ObtenerServidorArchivosHistorial() + "/UNSIGNED/" + rutaFolder;

            rutaOrigenFirma = con.ObtenerServidorArchivosConFirma() + rutaFolder + nombreArchivo;
            rutaHistorialFirma = con.ObtenerServidorArchivosHistorial() + "/SIGNED/" + rutaFolder;

            if (!Directory.Exists(rutaHistorial))
            {
                Directory.CreateDirectory(rutaHistorial);
            }

            if (!Directory.Exists(rutaHistorialFirma))
            {
                Directory.CreateDirectory(rutaHistorialFirma);
            }

            rutaHistorial = rutaHistorial + nombreArchivo;
            if (System.IO.File.Exists(rutaOrigen))
            {
                System.IO.File.Copy(rutaOrigen, rutaHistorial);
                System.IO.File.Delete(rutaOrigen);
            }

            rutaHistorialFirma = rutaHistorialFirma + nombreArchivo;
            if (System.IO.File.Exists(rutaOrigenFirma))
            {
                System.IO.File.Copy(rutaOrigenFirma, rutaHistorialFirma);
                System.IO.File.Delete(rutaOrigenFirma);
            }

            resp = true;

            return resp;
        }
        public async Task<string> EncriptarCode(string texto)
        {
            DalUtilitario utilitario = new DalUtilitario();
            Boolean resp = true;
            string code = "";
            var objEncripta = new Encriptar();
            try
            {
                while (resp)
                {
                    code = objEncripta.EncriptarCadena(texto);
                    resp = await utilitario.ValidarCodeFirmaDigital(code);
                }

                return code;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
        public async Task<string> EncriptarNombre(string texto)
        {
            DalUtilitario utilitario = new DalUtilitario();
            Boolean resp = true;
            string alfabeto = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"; //tamaño 52
            //string cadena = "KEVIN";
            //string token = "";
            string encriptado = "";
            int i;
            int l = texto.Length;
            var seed = Environment.TickCount;
            var random = new Random(seed);
            int ind;

            try
            {
                while (resp)
                {
                    i = 0;
                    encriptado = "";
                    while (i < l)
                    {
                        ind = random.Next(1, 52);
                        encriptado = encriptado + alfabeto[ind];
                        i++;
                    }
                    resp = await utilitario.ValidarNombreFirmaDigital(encriptado);
                }

                return encriptado;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
