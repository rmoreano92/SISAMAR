using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using CapaDatos;
using CapaEntidades;
using iText.IO.Font.Constants;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebAppMaternidad.Controllers;

using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.CallCenter.Controllers
{
    public class VisitasController : BaseController
    {
        //private IHostingEnvironment _env;
        private IWebHostEnvironment _env;


        //public VisitasController(IHostingEnvironment env)
        public VisitasController(IWebHostEnvironment env)
        {
            //if (HttpContext.User.Identity.IsAuthenticated==false )
            //{
            //    HomeController hom = new HomeController();
            //    hom.Index();
            //};
          
            _env = env;

        }

        public IActionResult Index()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            return View();
        }

     

        [HttpPost]
        public ActionResult ListadoHospitalizados()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            DataSet listaHospitalizados;
            DalVisitasMedicas daoVisita = new DalVisitasMedicas();
            listaHospitalizados = daoVisita.ListarHospitalizados();
            return Json(listaHospitalizados);
        }


        [HttpGet]
        public ActionResult ListarServicio()
        {
            DataSet lstServicio;
            DalUtilitario daoCitas = new DalUtilitario();
            lstServicio = daoCitas.DevuelveDSServicioSinTodos((int)Enumerados.TiposServicio.Hospitalización);
            return Json(lstServicio);
        }


        [HttpGet]
        public async Task<ActionResult> ListarCondicion()
        {
            DataSet lstcondicion;
            DalUtilitario daoCitas = new DalUtilitario();
            lstcondicion = await daoCitas.DevuelveDSCombo("web_ListarCondicion");
            return Json(lstcondicion);
        }

        [HttpPost]
        public ActionResult GuardarVisita( VisitasMedicas objVisita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al registrar visita";
            int rsp = 0;
            try
            {
                objVisita.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalVisitasMedicas daoVisita = new DalVisitasMedicas();
                rsp = daoVisita.registrarVisita(objVisita );
                if (rsp > 0)
                {
                    respuesta = "Se registro la visita correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        [HttpPost]
        public ActionResult ObtenerVisita(int idVisita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            VisitasMedicas objVisitas = new VisitasMedicas();
            DalVisitasMedicas daoVisita = new DalVisitasMedicas();
            objVisitas = daoVisita.ObtenerVisita(idVisita);
            return Json(objVisitas);
        }

        [HttpPost]
        public ActionResult EliminarVisita(VisitasMedicas objVisita)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            string respuesta = "Error al eliminar visita";
            int rsp = 0;
            try
            {
                objVisita.idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));
                DalVisitasMedicas daoVisita = new DalVisitasMedicas();
                rsp = daoVisita.EliminarVisita(objVisita);
                if (rsp > 0)
                {
                    respuesta = "Se elimino la visita correctamente.";
                }
            }
            catch (Exception ex)
            {
                respuesta = "Error al registrar," + ex.Message + ".";
            }
            return Json(new { respuesta = rsp, mensaje = respuesta });
        }

        public ActionResult ReporteAltas()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            var fullPath = _env.WebRootPath + "/images/maternidad-de-lima-logo.jpg";
            ImageData data = ImageDataFactory.Create(fullPath);
            Image img = new Image(data);
            img.SetMaxHeight(60);
            img.SetMaxWidth(60);
            img.SetFixedPosition(25, 540);
            MemoryStream ms = new MemoryStream();
            PdfWriter pw = new PdfWriter(ms);
            PdfDocument pdfdoc = new PdfDocument(pw);
            Document doc = new Document(pdfdoc,PageSize.A4.Rotate());
            doc.Add(img);
            Paragraph pTitulo = new Paragraph("INSTITUTO NACIONAL MATERNO PERINATAL");
            pTitulo.SetFixedPosition(270, 550, 780);
            pTitulo.SetBold();
            pTitulo.SetUnderline();
            doc.Add(pTitulo);
            float[] columnWidths = {1, 2, 1,1,1,2,1 };
            Table table = new Table(UnitValue.CreatePercentArray(columnWidths));
            table.SetFixedPosition(25, 495, 780);
            PdfFont f = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
            DataSet objVisitas = new DataSet();
            DalVisitasMedicas daoVisita = new DalVisitasMedicas();
            objVisitas = daoVisita.ListarHospitalizadosConAlta();


            Cell cell = new Cell(1, objVisitas.Tables[0].Columns.Count)
                .Add(new Paragraph("Lista de Pacientes con Posible Alta "+DateTime.Now.ToShortDateString() ))
                .SetFont(f)
                .SetFontSize(13)
                .SetFontColor(DeviceGray.WHITE)
                .SetBackgroundColor(DeviceGray.BLACK)
                .SetTextAlignment(TextAlignment.CENTER);
            table.AddHeaderCell(cell);

                Cell[] headerFooter =
                {
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[0].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[1].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[2].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[3].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[4].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[5].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[6].ColumnName))
                };
                foreach (Cell hfCell in headerFooter)
                {
                        table.AddHeaderCell(hfCell);
                }

            foreach (DataRow dr in objVisitas.Tables[0].Rows)
            {
                //Muestras los valores obteniendolos con el Índice o el Nombre de la columna, 
                //   de la siguiente manera:
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[0].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[1].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[2].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[3].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[4].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[5].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[6].ToString())));

            };

            doc.Add(table);
            doc.Close();
            
            byte[] bytesStream = ms.ToArray();
            ms = new MemoryStream();
            ms.Write(bytesStream, 0, bytesStream.Length);
            ms.Position = 0;
            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);

        }


        public ActionResult ReporteVisitas()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return View("Login");
            }
            //   string fullPath = HttpContex.Server.MapPath(imageFile);
            var fullPath = _env.WebRootPath+ "/images/maternidad-de-lima-logo.jpg";

            ImageData data = ImageDataFactory.Create(fullPath);
            Image img = new Image(data);
            img.SetMaxHeight(60);
            img.SetMaxWidth(60);
            img.SetFixedPosition(25, 540);
            MemoryStream ms = new MemoryStream();
            PdfWriter pw = new PdfWriter(ms);
            PdfDocument pdfdoc = new PdfDocument(pw);
            Document doc = new Document(pdfdoc, PageSize.A4.Rotate());

            doc.Add(img);
            Paragraph pTitulo = new Paragraph("INSTITUTO NACIONAL MATERNO PERINATAL");
            pTitulo.SetFixedPosition(270, 550,780);
            pTitulo.SetBold();
            pTitulo.SetUnderline();
            doc.Add(pTitulo);
            float[] columnWidths = { 1, 2, 1, 1, 1, 2, 1 };
            Table table = new Table(UnitValue.CreatePercentArray(columnWidths));
            table.SetFixedPosition(25, 410,780);
            PdfFont f = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
            DataSet objVisitas = new DataSet();
            DalVisitasMedicas daoVisita = new DalVisitasMedicas();
            objVisitas = daoVisita.ListarHospitalizadosConVisita();
            Cell cell = new Cell(1, objVisitas.Tables[0].Columns.Count)
                .Add(new Paragraph("Lista de Pacientes con Visita registradas el " + DateTime.Now.ToShortDateString()))
                .SetFont(f)
                .SetFontSize(13)
                .SetFontColor(DeviceGray.WHITE)
                .SetBackgroundColor(DeviceGray.BLACK)
                .SetTextAlignment(TextAlignment.CENTER);
            table.AddHeaderCell(cell);
            Cell[] headerFooter =
            {
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[0].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[1].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[2].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[3].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[4].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[5].ColumnName)),
                    new Cell().SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph(objVisitas.Tables[0].Columns[6].ColumnName))
                };
            foreach (Cell hfCell in headerFooter)
            {
               
                table.AddHeaderCell(hfCell);
               
            }

            foreach (DataRow dr in objVisitas.Tables[0].Rows)
            {
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[0].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[1].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[2].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[3].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[4].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[5].ToString())));
                table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(dr[6].ToString())));

            };

            doc.Add(table);
            doc.Close();

            byte[] bytesStream = ms.ToArray();
            ms = new MemoryStream();
            ms.Write(bytesStream, 0, bytesStream.Length);
            ms.Position = 0;

            return new FileStreamResult(ms, MediaTypeNames.Application.Pdf);
        }

    


        public Tuple<bool, bool, bool, bool, bool> PermisosxItem()
        {
            DataSet dsRoles = new DataSet();

            Tuple<bool, bool, bool, bool, bool> Rsp = new Tuple<bool, bool, bool, bool, bool>(false, false, false, false, false);
            var dsSerializado = HttpContext.Session.GetString("Roles");
            var objRoles = JsonConvert.DeserializeObject<DataSet> (dsSerializado);
            return Rsp;

        }

    }
}