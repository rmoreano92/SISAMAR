using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using NuGet.Versioning;
using WebAppMaternidad.Context.Reportes.Domain;
using WebAppMaternidad.Context.Reportes.Domain.Interfaces;

namespace WebAppMaternidad.Context.Reportes.Infrastructure
{
    public class EstadoCuentaLiquidacionReport : IExcelReportGenerator
    {
        public void Generar(IXLWorksheet ws, DataSet dataSet, List<DatosCabeceraReporte> cabeceras)
        {

            ws.PageSetup.SetRowsToRepeatAtTop(1, 6);
            ws.SheetView.View = XLSheetViewOptions.PageBreakPreview;

            // ws.Cell(3, 1).Value = $"Estado de Cuenta al: {DateTime.Now:dd/MM/yyyy}";

            // Combinar desde fila 1 col 1 hasta fila 1 col 15
            var rangoTitulo = ws.Range(1, 1, 1, 15);
            rangoTitulo.Merge();
            rangoTitulo.Value =  $"LIQUIDACION: {DateTime.Now:dd/MM/yyyy}";
            // Centrar horizontal
            rangoTitulo.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // Negrita y tamaño 14px
            rangoTitulo.Style.Font.Bold = true;
            rangoTitulo.Style.Font.FontSize = 14;


            ws.Cell(3, 3).Value = $"{cabeceras[0].CabeceraPrincipal.NombrePaciente}";
            ws.Cell(6, 3).Value = $"{cabeceras[0].CabeceraPrincipal.Diagnostico}";

            ws.Cell(3, 6).Value = $"{cabeceras[0].CabeceraPrincipal.NumeroHistoriaClinica}";
            ws.Cell(7, 6).Value = $"{cabeceras[0].CabeceraPrincipal.FechaIngreso}";
            ws.Cell(8, 6).Value = $"{cabeceras[0].CabeceraPrincipal.FechaEgreso}";



            if (dataSet == null || dataSet.Tables.Count == 0 || dataSet.Tables[0].Rows.Count == 0)
                return;

            // DataTable dataTable = dataSet.Tables[0];

            float sumSubTotalGeneral = 0;
            float sumImporteExoneraGeneral = 0;
            float sumTotalFinanciadoSisGeneral = 0;
            float sumTotalFinanciadoSoatGeneral = 0;
            float sumTotalConvenioGeneral = 0;
            float sumDebeGeneral = 0;
            float sumPagoGeneral = 0;
            float sumSaldoGeneral = 0;
            float sumFarmaciaGeneral = 0;
            float sumServicioGeneral = 0;

            int filaActual = 15;

            foreach (DataTable tabla in dataSet.Tables)
            {

                float sumSubTotal = 0;
                float sumImporteExonera = 0;
                float sumTotalFinanciadoSis = 0;
                float sumTotalFinanciadoSoat = 0;
                float sumTotalConvenio = 0;
                float sumDebe = 0;
                float sumPago = 0;
                float sumSaldo = 0;

                // Escribir las filas de la tabla

                if (tabla.TableName == "Servicios" || tabla.TableName == "Farmacia")
                {
                    foreach (DataRow row in tabla.Rows)
                    {
                        // if (row["DesPuntoCarga"].ToString() != puntoCargaAux)
                        // {
                        //     if (filaActual == 8)
                        //     {
                        //         ws.Cell(filaActual, 2).Value = row["DesPuntoCarga"].ToString();
                        //     }
                        //     else
                        //     {
                        //         ws.Cell(filaActual, 7).Value = sumSubTotal > 0 ? sumSubTotal.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 8).Value = sumImporteExonera > 0 ? sumImporteExonera.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 9).Value = sumTotalFinanciadoSis > 0 ? sumTotalFinanciadoSis.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 10).Value = sumTotalFinanciadoSoat > 0 ? sumTotalFinanciadoSoat.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 11).Value = sumTotalConvenio > 0 ? sumTotalConvenio.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 12).Value = sumDebe > 0 ? sumDebe.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 13).Value = sumPago > 0 ? sumPago.ToString("N2") : "0.00";
                        //         ws.Cell(filaActual, 14).Value = sumSaldo > 0 ? sumSaldo.ToString("N2") : "0.00";
                        //         var rango1 = ws.Range(
                        //             ws.Cell(filaActual, 3),  // desde fila 5, columna 1
                        //             ws.Cell(filaActual, 16)  // hasta fila 10, columna 3
                        //         );
                        //         rango1.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                        //         rango1.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                        //         rango1.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                        //         rango1.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                        //         rango1.Style.Border.TopBorderColor = XLColor.Blue;
                        //         rango1.Style.Border.BottomBorderColor = XLColor.Blue;
                        //         rango1.Style.Border.LeftBorderColor = XLColor.Blue;
                        //         rango1.Style.Border.RightBorderColor = XLColor.Blue;

                        //         filaActual++;
                        //         ws.Cell(filaActual, 2).Value = row["DesPuntoCarga"].ToString();
                        //     }

                        //     puntoCargaAux = row["DesPuntoCarga"].ToString();
                        // }
                        // ws.Cell(filaActual, 2).Value = row["DesPuntoCarga"].ToString();
                        ws.Cell(filaActual, 2).Value = row["Codigo"].ToString();
                        ws.Cell(filaActual, 3).Value = row["Nombre"].ToString();
                        ws.Cell(filaActual, 4).Value = row["Cantidad"].ToString();
                        ws.Cell(filaActual, 5).Value = row["PrecioUnitario"].ToString();
                        ws.Cell(filaActual, 6).Value = row["SubTotal"].ToString();
                        ws.Cell(filaActual, 7).Value = row["TotalPagar"].ToString();
                        ws.Cell(filaActual, 8).Value = row["IdOrden"].ToString();

                        // Acumular los totales
                        if (float.TryParse(row["SubTotal"].ToString(), out float subTotal))
                        {
                            sumSubTotal += subTotal;
                            sumSubTotalGeneral += subTotal;
                        }

                        if (float.TryParse(row["ImporteExonera"].ToString(), out float importeExonera))
                        {
                            sumImporteExonera += importeExonera;
                            sumImporteExoneraGeneral += importeExonera;
                        }

                        if (float.TryParse(row["TotalFinanciadoSis"].ToString(), out float totalFinanciadoSis))
                        {
                            sumTotalFinanciadoSis += totalFinanciadoSis;
                            sumTotalFinanciadoSisGeneral += totalFinanciadoSis;
                        }

                        if (float.TryParse(row["TotalFinanciadoSoat"].ToString(), out float totalFinanciadoSoat))
                        {
                            sumTotalFinanciadoSoat += totalFinanciadoSoat;
                            sumTotalFinanciadoSoatGeneral += totalFinanciadoSoat;
                        }

                        if (float.TryParse(row["TotalConvenio"].ToString(), out float totalConvenio))
                        {
                            sumTotalConvenio += totalConvenio;
                            sumTotalConvenioGeneral += totalConvenio;
                        }

                        if (float.TryParse(row["Debe"].ToString(), out float debe))
                        {
                            sumDebe += debe;
                            sumDebeGeneral += debe;
                        }

                        if (float.TryParse(row["Pago"].ToString(), out float pago))
                        {
                            sumPago += pago;
                            sumPagoGeneral += pago;
                        }

                        if (float.TryParse(row["Saldo"].ToString(), out float saldo))
                        {
                            sumSaldo += saldo;
                            sumSaldoGeneral += saldo;

                            if (tabla.TableName == "Farmacia")
                            {
                                sumFarmaciaGeneral += saldo;

                            }
                            else if (tabla.TableName == "Servicios")
                            {
                                sumServicioGeneral += saldo;
                            }
                        }




                        filaActual++;
                    }

                    // ws.Cell(filaActual, 7).Value = sumSubTotal > 0 ? sumSubTotal.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 8).Value = sumImporteExonera > 0 ? sumImporteExonera.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 9).Value = sumTotalFinanciadoSis > 0 ? sumTotalFinanciadoSis.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 10).Value = sumTotalFinanciadoSoat > 0 ? sumTotalFinanciadoSoat.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 11).Value = sumTotalConvenio > 0 ? sumTotalConvenio.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 12).Value = sumDebe > 0 ? sumDebe.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 13).Value = sumPago > 0 ? sumPago.ToString("N2") : "0.00";
                    // ws.Cell(filaActual, 14).Value = sumSaldo > 0 ? sumSaldo.ToString("N2") : "0.00";

                    // var rango = ws.Range(
                    //      ws.Cell(filaActual, 3),  // desde fila 5, columna 1
                    //     ws.Cell(filaActual, 16)  // hasta fila 10, columna 3
                    // );
                    // rango.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                    // rango.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                    // rango.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                    // rango.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                    // rango.Style.Border.TopBorderColor = XLColor.Blue;
                    // rango.Style.Border.BottomBorderColor = XLColor.Blue;
                    // rango.Style.Border.LeftBorderColor = XLColor.Blue;
                    // rango.Style.Border.RightBorderColor = XLColor.Blue;

                    filaActual++;

                }
            }

            filaActual += 2;

            ws.Cell(filaActual, 7).Value = sumSubTotalGeneral > 0 ? sumSubTotalGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 8).Value = sumImporteExoneraGeneral > 0 ? sumImporteExoneraGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 9).Value = sumTotalFinanciadoSisGeneral > 0 ? sumTotalFinanciadoSisGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 10).Value = sumTotalFinanciadoSoatGeneral > 0 ? sumTotalFinanciadoSoatGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 11).Value = sumTotalConvenioGeneral > 0 ? sumTotalConvenioGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 12).Value = sumDebeGeneral > 0 ? sumDebeGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 13).Value = sumPagoGeneral > 0 ? sumPagoGeneral.ToString("N2") : "0.00";
            ws.Cell(filaActual, 14).Value = sumSaldoGeneral > 0 ? sumSaldoGeneral.ToString("N2") : "0.00";

            var rango3 = ws.Range(
                ws.Cell(filaActual, 3),  // desde fila 5, columna 1
                ws.Cell(filaActual, 16)  // hasta fila 10, columna 3
            );
            rango3.Style.Border.TopBorder = XLBorderStyleValues.Thin;
            rango3.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            rango3.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            rango3.Style.Border.RightBorder = XLBorderStyleValues.Thin;

            rango3.Style.Border.TopBorderColor = XLColor.Blue;
            rango3.Style.Border.BottomBorderColor = XLColor.Blue;
            rango3.Style.Border.LeftBorderColor = XLColor.Blue;
            rango3.Style.Border.RightBorderColor = XLColor.Blue;

            

        }
    }
}