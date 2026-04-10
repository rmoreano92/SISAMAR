//using iTextSharp.text;
//using iTextSharp.text.pdf;
using System;
using System.IO;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net;
using CapaDatos;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using SiHospCrypKey;
using CapaEntidades;
using Microsoft.AspNetCore.Http;

namespace WebAppMaternidad.Areas.Comun
{
    public  class ClUtilirario
    {
        public ClUtilirario() { 
        }

        public string ruta { get; set; }
        public string code { get; set; }
        public string idDoc { get; set; }
        public string mensaje { get; set; }

        //public string GenerarPDf(string html, string sWebRootFolder)
        //{
        //    try
        //    {
        //        if (System.IO.File.Exists(sWebRootFolder))
        //        {               
        //            System.IO.File.Delete(sWebRootFolder);
        //        }

        //        //FileStream file = new FileStream(sWebRootFolder, FileMode.Create);

        //        using (Stream file = new FileStream(sWebRootFolder, FileMode.Create))
        //        {
        //            Document doc = new Document(PageSize.A4, 25, 25, 45, 20);
        //            PdfWriter writer = PdfWriter.GetInstance(doc, file);
        //            doc.Open();
        //            iTextSharp.text.html.simpleparser.HtmlWorker hw = new iTextSharp.text.html.simpleparser.HtmlWorker(doc);
        //            try
        //            {
        //                iTextSharp.text.html.simpleparser.StyleSheet style = new iTextSharp.text.html.simpleparser.StyleSheet();
        //                style.LoadStyle("border", "border-bottom", "2px");
                        
        //                hw.Parse(new StringReader(html));
        //            }
        //            catch (Exception e)
        //            {
        //                hw.Close();
        //                //writer.Close();
        //                doc.Close();
        //                file.Close();
        //                file.Dispose();
        //                writer.Close();
        //                return e.ToString();
        //            }
        //            finally
        //            {
        //                hw.Close();
        //                //writer.Close();
        //                doc.Close();
        //                file.Close();
        //                file.Dispose();
        //                writer.Close();
        //            }
        //            //StringReader abs = new StringReader(html);
                    
                    
        //        }
           
        //        return "Ok";
        //    }
        //    catch (Exception e)
        //    {
        //        return e.ToString();
        //    }
                

        //}
        public async  Task<bool>  UploadFile(string ruta, int idCuentaAtencion,string tipo,int idAux)
        {
            DataSet lsParametro;
            DalParametros dalParametros = new DalParametros();

            string permiso4identity;
            lsParametro = await dalParametros.SeleccionaFilaParametro2(803);
            permiso4identity = lsParametro.Tables[0].Rows[0]["ValorInt"].ToString();

            bool resul=false;
            var client = new HttpClient();
            //string datos = "";
            //var ruta = @"C:/Users/LENOVO/Desktop/demo4.pdf";
            FileStream fs = null;
            ruta = ruta.Replace("\\","//").Replace("//","/");
            try { fs = File.OpenRead(ruta); }
            catch (Exception e)
            {
                Console.WriteLine("El archivo no Existe!" + e);
            }

            var content = new ProgressStreamContent(fs, CancellationToken.None);
            content.Progress = (bytes, totalBytes, totalBytesExpected) =>
            {
                Console.WriteLine("Uploading {0}/{1} => {2}%", totalBytes, totalBytesExpected, Convert.ToInt32(((float)totalBytes / (float)totalBytesExpected) * 100));
            };
            try
            {
                
                if(permiso4identity == "1")
                {
                    var objEncripta = new Encriptar();      //KHOYOSI
                    DalUtilitario dl = new DalUtilitario();
                    string code = idCuentaAtencion.ToString() + "/" + idAux.ToString() + "/" + tipo.ToString();
                    code = objEncripta.EncriptarCadena(code);
                    await dl.InsertaFirma("",code, "", idCuentaAtencion, idAux, tipo, "I", 0, ruta);
                    resul = true;
                } else
                {
                    var response = await client.PostAsync("http://172.16.40.22:9000/api/signfile?vis_sig_text=Firmado digitalmente por el Medico: <SIGNER> <br>Fecha: <DATE>&vis_sig_width=115&vis_sig_height=60&vis_sig_x=450&vis_sig_y=6&vis_sig_page=-1&vis_sig_graphic=https://www.mgp.gob.pe/uploads/1565361369.png&vis_sig_rotation=0&vis_sig_text_size=6", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var resultUpload = JsonConvert.DeserializeObject<ResultUpload>(await response.Content.ReadAsStringAsync());

                        Console.WriteLine($"signUrl: {resultUpload.signUrl}");
                        Console.WriteLine($"code: {resultUpload.code}");
                        Console.WriteLine($"status: {resultUpload.status}");
                        Console.WriteLine($"path: {resultUpload.pathDownloadSignDocument}");

                        DalUtilitario dl = new DalUtilitario();
                        await dl.InsertaFirma(resultUpload.signUrl, resultUpload.code, "", idCuentaAtencion, idAux, tipo, "I", resultUpload.status, ruta);
                        resul = true;
                    }
                }
            }
            catch (Exception e)
            {
                //mensaje = "Error; " + e;
                Console.WriteLine("El archivo no Existe!" + e);
                resul = false;
            }

            return resul;
        }

        public async Task<string> UploadFileOrdenes(string ruta, int idCuentaAtencion, string tipo, int idAux) // JDELGADO J0 FIRMAR RECETAS
        {
            DataSet lsParametro;
            DalParametros dalParametros = new DalParametros();

            //bool resul = false;
            var client = new HttpClient();
            //string datos = "";
            string jsonResult = null;
            //var ruta = @"C:/Users/LENOVO/Desktop/demo4.pdf";

            string permiso4identity;
            lsParametro = await dalParametros.SeleccionaFilaParametro2(803);
            permiso4identity = lsParametro.Tables[0].Rows[0]["ValorInt"].ToString();

            FileStream fs = null;
            ruta = ruta.Replace("\\", "//").Replace("//", "/");
            try { fs = File.OpenRead(ruta); }
            catch (Exception e)
            {
                Console.WriteLine("El archivo no Existe!" + e);
            }

            var content = new ProgressStreamContent(fs, CancellationToken.None);
            content.Progress = (bytes, totalBytes, totalBytesExpected) =>
            {
                Console.WriteLine("Uploading {0}/{1} => {2}%", totalBytes, totalBytesExpected, Convert.ToInt32(((float)totalBytes / (float)totalBytesExpected) * 100));
            };
            try
            {
                if (permiso4identity == "1")
                {
                    DalUtilitario dl = new DalUtilitario();
                    await dl.InsertaFirma("", "", "", idCuentaAtencion, idAux, tipo, "I", 0, ruta);
                    //resul = true;
                }
                else
                {
                    var response = await client.PostAsync("http://172.16.40.22:9000/api/signfile?vis_sig_text=Firmado digitalmente por el Medico: <SIGNER> <br>Fecha: <DATE>&vis_sig_width=100&vis_sig_height=50&vis_sig_x=130&vis_sig_y=110&vis_sig_page=-1&vis_sig_graphic=https://www.mgp.gob.pe/uploads/1565361369.png&vis_sig_rotation=0&vis_sig_text_size=6", content);

                    if (response.IsSuccessStatusCode)
                    {
                        var resultUpload = JsonConvert.DeserializeObject<ResultUpload>(await response.Content.ReadAsStringAsync());


                        Console.WriteLine($"signUrl: {resultUpload.signUrl}");
                        Console.WriteLine($"code: {resultUpload.code}");
                        Console.WriteLine($"status: {resultUpload.status}");
                        Console.WriteLine($"path: {resultUpload.pathDownloadSignDocument}");

                        DalUtilitario dl = new DalUtilitario();
                        await dl.InsertaFirma(resultUpload.signUrl, resultUpload.code, "", idCuentaAtencion, idAux, tipo, "I", resultUpload.status, ruta);
                        jsonResult = resultUpload.signUrl;
                    }
                }
            }
            catch (Exception e)
            {
                //mensaje = "Error; " + e;
                Console.WriteLine("El archivo no Existe!" + e);
                jsonResult = null;
            }

            return jsonResult;

        }

        /////////////////////KHOYOSI (Bit4Id)////////////////////////////////////
        public async Task<bool> FirmaDigitalModificar(FirmaDigital firma, string accion)
        {
            DalParametros dalParametros = new DalParametros();

            //string permiso4identity;
            //lsParametro = await dalParametros.SeleccionaFilaParametro2(803);
            //permiso4identity = lsParametro.Tables[0].Rows[0]["ValorInt"].ToString();

            bool resul = false;
            var client = new HttpClient();
            //string datos = "";
            //var ruta = @"C:/Users/LENOVO/Desktop/demo4.pdf";
            /*FileStream fs = null;
            ruta = ruta.Replace("\\", "//").Replace("//", "/");
            try { 
                fs = File.OpenRead(ruta); }
            catch (Exception e)
            {
                Console.WriteLine("El archivo no Existe!" + e);
            }

            var content = new ProgressStreamContent(fs, CancellationToken.None);
            content.Progress = (bytes, totalBytes, totalBytesExpected) =>
            {
                Console.WriteLine("Uploading {0}/{1} => {2}%", totalBytes, totalBytesExpected, Convert.ToInt32(((float)totalBytes / (float)totalBytesExpected) * 100));
            };*/

            try
            {
                //var objEncripta = new Encriptar();      //KHOYOSI
                DalUtilitario dl = new DalUtilitario();
                //string code = firma.idCuentaAtencion.ToString() + "/" + firma.idRegistro.ToString() + "/" + firma.tipo.ToString();
                //code = objEncripta.EncriptarCadena(code);
                await dl.FirmaDigitalModificar(firma, accion);
                resul = true;
            }
            catch (Exception e)
            {
                //mensaje = "Error; " + e;
                Console.WriteLine("El archivo no Existe!" + e);
                resul = false;
            }

            return resul;
        }
        /////////////////////KHOYOSI (Bit4Id)////////////////////////////////////
        ///

        
    }

    public class ResultUpload
    {
        public string signUrl { get; set; }
        public string code { get; set; }
        public int status { get; set; }
        public string documentId { get; set; }

        public List<DocumentFileMapperList> documentFileMapperList { get; set; }
        public string pathDownloadSignDocument { get; set; }
    }

    public class DocumentFileMapperList
    {
        public string id { get; set; }
        public string documentName { get; set; }
        public string signDate { get; set; }

    }

    public delegate void ProgressDelegate(long bytes, long totalBytes, long totalBytesExpected);

    public class ProgressStreamContent : StreamContent
    {
        public ProgressStreamContent(Stream stream, CancellationToken token)
            : this(new ProgressStream(stream, token))
        {
        }

        public ProgressStreamContent(Stream stream, int bufferSize)
            : this(new ProgressStream(stream, CancellationToken.None), bufferSize)
        {
        }

        ProgressStreamContent(ProgressStream stream)
            : base(stream)
        {
            init(stream);
        }

        ProgressStreamContent(ProgressStream stream, int bufferSize)
            : base(stream, bufferSize)
        {
            init(stream);
        }

        void init(ProgressStream stream)
        {
            stream.ReadCallback = readBytes;

            Progress = delegate { };
        }

        void reset()
        {
            _totalBytes = 0L;
        }

        long _totalBytes;
        long _totalBytesExpected = -1;

        void readBytes(long bytes)
        {
            if (_totalBytesExpected == -1)
                _totalBytesExpected = Headers.ContentLength ?? -1;

            long computedLength;
            if (_totalBytesExpected == -1 && TryComputeLength(out computedLength))
                _totalBytesExpected = computedLength == 0 ? -1 : computedLength;

            // If less than zero still then change to -1
            _totalBytesExpected = Math.Max(-1, _totalBytesExpected);
            _totalBytes += bytes;

            Progress(bytes, _totalBytes, _totalBytesExpected);
        }

        ProgressDelegate _progress;
        public ProgressDelegate Progress
        {
            get { return _progress; }
            set
            {
                if (value == null) _progress = delegate { };
                else _progress = value;
            }
        }

        protected override Task SerializeToStreamAsync(Stream stream, TransportContext context)
        {
            reset();
            return base.SerializeToStreamAsync(stream, context);
        }

        protected override bool TryComputeLength(out long length)
        {
            var result = base.TryComputeLength(out length);
            _totalBytesExpected = length;
            return result;
        }

        class ProgressStream : Stream
        {
            CancellationToken token;

            public ProgressStream(Stream stream, CancellationToken token)
            {
                ParentStream = stream;
                this.token = token;

                ReadCallback = delegate { };
                WriteCallback = delegate { };
            }

            public Action<long> ReadCallback { get; set; }

            public Action<long> WriteCallback { get; set; }

            public Stream ParentStream { get; private set; }

            public override bool CanRead { get { return ParentStream.CanRead; } }

            public override bool CanSeek { get { return ParentStream.CanSeek; } }

            public override bool CanWrite { get { return ParentStream.CanWrite; } }

            public override bool CanTimeout { get { return ParentStream.CanTimeout; } }

            public override long Length { get { return ParentStream.Length; } }

            public override void Flush()
            {
                ParentStream.Flush();
            }

            public override long Position
            {
                get { return ParentStream.Position; }
                set { ParentStream.Position = value; }
            }

            public override int Read(byte[] buffer, int offset, int count)
            {
                token.ThrowIfCancellationRequested();

                var readCount = ParentStream.Read(buffer, offset, count);
                ReadCallback(readCount);
                return readCount;
            }

            public override long Seek(long offset, SeekOrigin origin)
            {
                token.ThrowIfCancellationRequested();
                return ParentStream.Seek(offset, origin);
            }

            public override void SetLength(long value)
            {
                token.ThrowIfCancellationRequested();
                ParentStream.SetLength(value);
            }

            public override void Write(byte[] buffer, int offset, int count)
            {
                token.ThrowIfCancellationRequested();
                ParentStream.Write(buffer, offset, count);
                WriteCallback(count);
            }

            protected override void Dispose(bool disposing)
            {
                if (disposing)
                {
                    ParentStream.Dispose();
                }
            }
        }


        

    }
}