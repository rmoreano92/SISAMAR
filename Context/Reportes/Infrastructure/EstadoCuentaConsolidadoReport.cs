using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using WebAppMaternidad.Context.Reportes.Domain;
using WebAppMaternidad.Context.Reportes.Domain.Interfaces;

namespace WebAppMaternidad.Context.Reportes.Infrastructure
{
    public class EstadoCuentaConsolidadoReport : IExcelReportGenerator
    {
        public void Generar(IXLWorksheet ws, DataSet dataSet, List<DatosCabeceraReporte> cabeceras)
        {
            ws.SheetView.View = XLSheetViewOptions.PageBreakPreview;
            ws.PageSetup.PaperSize = XLPaperSize.LetterPaper;
            // ws.PageSetup.SetRowsToRepeatAtTop(1, 6);

            if (dataSet == null || dataSet.Tables.Count == 0)
                return;

            int filaActual = 1;


            for (int t = 0; t < dataSet.Tables.Count; t++)
            {

                DataTable dataTable = dataSet.Tables[t];
                var cabecera = cabeceras[t]; // Cada tabla tiene su propia cabecera asociada

                ws.PageSetup.SetRowsToRepeatAtTop(filaActual, filaActual + 6);
                ws.Cell(filaActual, 1).Value = $"CONSUMOS CONSOLIDADOS de la Cuenta Nª: {cabecera.CabeceraPrincipal.IdCuentaAtencion}";
                ws.Cell(filaActual + 1, 1).Value = $"Estado de Cuenta al: {DateTime.Now:dd/MM/yyyy}";
                ws.Cell(filaActual + 2, 1).Value = $"Paciente: {cabecera.CabeceraPrincipal.NumeroHistoriaClinica} - {cabecera.CabeceraPrincipal.NombrePaciente}";
                ws.Cell(filaActual + 3, 1).Value = $"Cuenta: {cabecera.CabeceraPrincipal.EstadoCuenta} IAFA: {cabecera.CabeceraPrincipal.FuenteFinanciamiento} - PP: {cabecera.CabeceraPrincipal.ProductoPlan}";
                ws.Cell(filaActual + 4, 1).Value = $"Usuario: {cabecera.CabeceraPrincipal.Usuario}";
                ws.Cell(filaActual + 5, 1).Value = $"Servicio Egreso: {cabecera.CabeceraPrincipal.ServicioEgreso}";

                filaActual += 8; // Saltamos cabecera (5 filas + 1 de espacio)

                // =========================
                // TABLA DE DATOS
                // =========================
                string puntoCargaAux = "";
                float total = 0;
                float totalGeneral = 0;
                int saldoLinea = 0;

                for (int i = 0; i < dataTable.Rows.Count; i++)
                {


                    for (int j = 0; j < dataTable.Columns.Count; j++)
                    {
                        var celda = ws.Cell(filaActual + i + saldoLinea, j + 1);
                        var celdaTotal = ws.Cell(filaActual + i + saldoLinea - 1, j + 7);

                        if (j == 0) // Primera columna (Punto de Carga)
                        {
                            string puntoCargaActual = dataTable.Rows[i][j]?.ToString();
                            if (puntoCargaActual != puntoCargaAux)
                            {
                                if (i == 0)
                                {
                                    celda = ws.Cell(i + saldoLinea + filaActual, j + 1);
                                }
                                else
                                {
                                    celda = ws.Cell(i + saldoLinea + filaActual + 1, j + 1);
                                }

                                celda.Value = puntoCargaActual;
                                puntoCargaAux = puntoCargaActual;

                                if (i > 0) // Evitar total en la primera fila
                                {
                                    celdaTotal.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                                    celdaTotal.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                                    celdaTotal.Value = total > 0 ? total.ToString("N2") : "";
                                    saldoLinea++;
                                }
                                total = 0; // Reiniciar total para nuevo Punto de Carga

                            }
                            else
                            {
                                celda.Value = ""; // Evitar repetir
                            }
                        }
                        else
                        {
                            if (j == 4 || j == 5) // Columna Importe
                            {
                                if (float.TryParse(dataTable.Rows[i][j]?.ToString(), out float importe))
                                {
                                    celda.Value = importe.ToString("N2");
                                }
                                else
                                {
                                    celda.Value = "0.00";
                                }
                            }
                            else
                            {
                                celda.Value = dataTable.Rows[i][j]?.ToString();
                            }

                            // Borde
                            celda.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                            celda.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                            celda.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                            celda.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                            // Totales
                            total += j == 5 ? float.Parse(dataTable.Rows[i][j]?.ToString() ?? "0") : 0;
                            totalGeneral += j == 5 ? float.Parse(dataTable.Rows[i][j]?.ToString() ?? "0") : 0;
                        }
                    }
                }

                // Subtotal final
                var celdaTotalFinal = ws.Cell(filaActual + dataTable.Rows.Count + saldoLinea, dataTable.Columns.Count + 1);
                celdaTotalFinal.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                celdaTotalFinal.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                celdaTotalFinal.Value = total > 0 ? total.ToString("N2") : "";

                // Total General
                var rango = ws.Range(
                    ws.Cell(filaActual + dataTable.Rows.Count + saldoLinea + 2, 1),
                    ws.Cell(filaActual + dataTable.Rows.Count + saldoLinea + 2, dataTable.Columns.Count + 1)
                );
                rango.Merge();
                rango.Value = totalGeneral.ToString("N2");
                rango.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
                rango.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
                rango.Style.Border.OutsideBorder = XLBorderStyleValues.Thick;
                rango.Style.Border.OutsideBorderColor = XLColor.Blue;

                // Ajustamos filaActual para siguiente cuenta
                filaActual = filaActual + dataTable.Rows.Count + saldoLinea + 5;

                // ws.PageSetup.AddHorizontalPageBreak(filaActual + 1);
            }
        }
    }
}