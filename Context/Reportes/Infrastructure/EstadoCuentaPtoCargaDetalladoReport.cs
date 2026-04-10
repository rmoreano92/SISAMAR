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
    public class EstadoCuentaPtoCargaDetalladoReport : IExcelReportGenerator
    {
        public void Generar(IXLWorksheet ws, DataSet dataSet, List<DatosCabeceraReporte> cabeceras)
        {

            ws.PageSetup.SetRowsToRepeatAtTop(1, 6);
            ws.SheetView.View = XLSheetViewOptions.PageBreakPreview;

            // ws.Cell(3, 1).Value = $"Estado de Cuenta al: {DateTime.Now:dd/MM/yyyy}";

            // Combinar desde fila 1 col 1 hasta fila 1 col 15
            var rangoTitulo = ws.Range(1, 1, 1, 15);
            rangoTitulo.Merge();
            rangoTitulo.Value =  $"Estado de Cuenta al: {DateTime.Now:dd/MM/yyyy}";
            // Centrar horizontal
            rangoTitulo.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

            // Negrita y tamaño 14px
            rangoTitulo.Style.Font.Bold = true;
            rangoTitulo.Style.Font.FontSize = 14;

            ws.Cell(3, 3).Value = $"{cabeceras[0].CabeceraPrincipal.IdCuentaAtencion} ({cabeceras[0].CabeceraPrincipal.EstadoCuenta}) IAFA {cabeceras[0].CabeceraPrincipal.FuenteFinanciamiento}  (PP={cabeceras[0].CabeceraPrincipal.ProductoPlan})";
            ws.Cell(4, 3).Value = $"{cabeceras[0].CabeceraPrincipal.NombrePaciente}";
            ws.Cell(5, 3).Value = $"{cabeceras[0].CabeceraPrincipal.FechaIngreso}";
            ws.Cell(6, 3).Value = $"{cabeceras[0].CabeceraPrincipal.FechaEgreso}";

            ws.Cell(3, 8).Value = $"{cabeceras[0].CabeceraPrincipal.IdAtencion} Dx Egreso: {cabeceras[0].CabeceraPrincipal.Diagnostico}";
            ws.Cell(4, 8).Value = $"{cabeceras[0].CabeceraPrincipal.NumeroHistoriaClinica} Dom.Pac: {cabeceras[0].CabeceraPrincipal.Direccion}";
            ws.Cell(5, 8).Value = $"{cabeceras[0].CabeceraPrincipal.ServicioEgreso}";
            ws.Cell(6, 8).Value = $"{cabeceras[0].CabeceraPrincipal.Cama}";

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

            int filaActual = 8;

            foreach (DataTable tabla in dataSet.Tables)
            {
                string puntoCargaAux = "";

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
                        if (row["DesPuntoCarga"].ToString() != puntoCargaAux)
                        {
                            if (filaActual == 8)
                            {
                                ws.Cell(filaActual, 2).Value = row["DesPuntoCarga"].ToString();
                            }
                            else
                            {
                                ws.Cell(filaActual, 7).Value = sumSubTotal > 0 ? sumSubTotal.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 8).Value = sumImporteExonera > 0 ? sumImporteExonera.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 9).Value = sumTotalFinanciadoSis > 0 ? sumTotalFinanciadoSis.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 10).Value = sumTotalFinanciadoSoat > 0 ? sumTotalFinanciadoSoat.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 11).Value = sumTotalConvenio > 0 ? sumTotalConvenio.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 12).Value = sumDebe > 0 ? sumDebe.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 13).Value = sumPago > 0 ? sumPago.ToString("N2") : "0.00";
                                ws.Cell(filaActual, 14).Value = sumSaldo > 0 ? sumSaldo.ToString("N2") : "0.00";
                                var rango1 = ws.Range(
                                    ws.Cell(filaActual, 3),  // desde fila 5, columna 1
                                    ws.Cell(filaActual, 16)  // hasta fila 10, columna 3
                                );
                                rango1.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                                rango1.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                                rango1.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                                rango1.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                                rango1.Style.Border.TopBorderColor = XLColor.Blue;
                                rango1.Style.Border.BottomBorderColor = XLColor.Blue;
                                rango1.Style.Border.LeftBorderColor = XLColor.Blue;
                                rango1.Style.Border.RightBorderColor = XLColor.Blue;

                                filaActual++;
                                ws.Cell(filaActual, 2).Value = row["DesPuntoCarga"].ToString();
                            }

                            puntoCargaAux = row["DesPuntoCarga"].ToString();
                        }
                        // ws.Cell(filaActual, 2).Value = row["DesPuntoCarga"].ToString();
                        ws.Cell(filaActual, 3).Value = row["Producto"].ToString();
                        ws.Cell(filaActual, 4).Value = row["UM"].ToString();
                        ws.Cell(filaActual, 5).Value = row["Cantidad"].ToString();
                        ws.Cell(filaActual, 6).Value = row["PrecioUnitario"].ToString();
                        ws.Cell(filaActual, 7).Value = row["SubTotal"].ToString();
                        ws.Cell(filaActual, 8).Value = row["ImporteExonera"].ToString();
                        ws.Cell(filaActual, 9).Value = row["TotalFinanciadoSis"].ToString();
                        ws.Cell(filaActual, 10).Value = row["TotalFinanciadoSoat"].ToString();
                        ws.Cell(filaActual, 11).Value = row["TotalConvenio"].ToString();
                        ws.Cell(filaActual, 12).Value = row["Debe"].ToString();
                        ws.Cell(filaActual, 13).Value = row["Pago"].ToString();
                        ws.Cell(filaActual, 14).Value = row["Saldo"].ToString();
                        ws.Cell(filaActual, 15).Value = row["DocumentoNumero"].ToString();
                        ws.Cell(filaActual, 16).Value = row["FechaCreacion"].ToString().Substring(0, 10);
                        ws.Cell(filaActual, 17).Value = row["ServicioEstancia"].ToString();
                        ws.Cell(filaActual, 18).Value = row["UsuarioExonera"].ToString();

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

                    ws.Cell(filaActual, 7).Value = sumSubTotal > 0 ? sumSubTotal.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 8).Value = sumImporteExonera > 0 ? sumImporteExonera.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 9).Value = sumTotalFinanciadoSis > 0 ? sumTotalFinanciadoSis.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 10).Value = sumTotalFinanciadoSoat > 0 ? sumTotalFinanciadoSoat.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 11).Value = sumTotalConvenio > 0 ? sumTotalConvenio.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 12).Value = sumDebe > 0 ? sumDebe.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 13).Value = sumPago > 0 ? sumPago.ToString("N2") : "0.00";
                    ws.Cell(filaActual, 14).Value = sumSaldo > 0 ? sumSaldo.ToString("N2") : "0.00";

                    var rango = ws.Range(
                         ws.Cell(filaActual, 3),  // desde fila 5, columna 1
                        ws.Cell(filaActual, 16)  // hasta fila 10, columna 3
                    );
                    rango.Style.Border.TopBorder = XLBorderStyleValues.Thin;
                    rango.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
                    rango.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
                    rango.Style.Border.RightBorder = XLBorderStyleValues.Thin;

                    rango.Style.Border.TopBorderColor = XLColor.Blue;
                    rango.Style.Border.BottomBorderColor = XLColor.Blue;
                    rango.Style.Border.LeftBorderColor = XLColor.Blue;
                    rango.Style.Border.RightBorderColor = XLColor.Blue;

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

            filaActual += 2;
            ws.Cell(filaActual, 11).Value = $"TOTAL CUENTA";
            ws.Cell(filaActual, 12).Value = sumSubTotalGeneral > 0 ? sumSubTotalGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 1, 11).Value = $"EXONERADO";
            ws.Cell(filaActual + 1, 12).Value = sumImporteExoneraGeneral > 0 ? sumImporteExoneraGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 2, 11).Value = $"SIS CUBRE (-PAGOS A CUENTA)";
            ws.Cell(filaActual + 2, 12).Value = sumTotalFinanciadoSisGeneral > 0 ? sumTotalFinanciadoSisGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 3, 11).Value = $"SOAT CUBRE (-PAGOS A CUENTA)";
            ws.Cell(filaActual + 3, 12).Value = sumTotalFinanciadoSoatGeneral > 0 ? sumTotalFinanciadoSoatGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 4, 11).Value = $"CONVENIOS CUBRE (-PAGOS A CUENTA)";
            ws.Cell(filaActual + 4, 12).Value = sumTotalConvenioGeneral > 0 ? sumTotalConvenioGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 5, 11).Value = $"TOTAL DEUDA";
            ws.Cell(filaActual + 5, 12).Value = sumDebeGeneral > 0 ? sumDebeGeneral.ToString("N2") : "0.00";

            var rango4 = ws.Range(
                ws.Cell(filaActual + 5, 11),  // desde fila 5, columna 1
                ws.Cell(filaActual + 5, 12)  // hasta fila 10, columna 3
            );
            rango4.Style.Border.TopBorder = XLBorderStyleValues.Thin;
            rango4.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            rango4.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            rango4.Style.Border.RightBorder = XLBorderStyleValues.Thin;

            rango4.Style.Border.TopBorderColor = XLColor.Blue;
            rango4.Style.Border.BottomBorderColor = XLColor.Blue;
            rango4.Style.Border.LeftBorderColor = XLColor.Blue;
            rango4.Style.Border.RightBorderColor = XLColor.Blue;


            ws.Cell(filaActual + 6, 11).Value = $"PAGOS REALIZADOS";
            ws.Cell(filaActual + 6, 12).Value = sumPagoGeneral > 0 ? sumPagoGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 7, 11).Value = $"CAJA DEBE INGRESAR";
            ws.Cell(filaActual + 7, 12).Value = "";

            ws.Cell(filaActual + 8, 11).Value = $"CREDITO";
            ws.Cell(filaActual + 8, 12).Value = $"";

            ws.Cell(filaActual + 9, 11).Value = $"PACIENTE DEBE PAGAR";
            ws.Cell(filaActual + 9, 12).Value = sumSaldoGeneral > 0 ? sumSaldoGeneral.ToString("N2") : "0.00";

            var rango5 = ws.Range(
                ws.Cell(filaActual + 9, 11),  // desde fila 5, columna 1
                ws.Cell(filaActual + 9, 12)  // hasta fila 10, columna 3
            );
            rango5.Style.Border.TopBorder = XLBorderStyleValues.Thin;
            rango5.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            rango5.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            rango5.Style.Border.RightBorder = XLBorderStyleValues.Thin;

            rango5.Style.Border.TopBorderColor = XLColor.Blue;
            rango5.Style.Border.BottomBorderColor = XLColor.Blue;
            rango5.Style.Border.LeftBorderColor = XLColor.Blue;
            rango5.Style.Border.RightBorderColor = XLColor.Blue;


            ws.Cell(filaActual + 10, 11).Value = $"PAGO POR CONSUMO FARMACIA";
            ws.Cell(filaActual + 10, 12).Value = sumFarmaciaGeneral > 0 ? sumFarmaciaGeneral.ToString("N2") : "0.00";

            ws.Cell(filaActual + 11, 11).Value = $"PAGO POR CONSUMO SERVICIO";
            ws.Cell(filaActual + 11, 12).Value = sumServicioGeneral > 0 ? sumServicioGeneral.ToString("N2") : "0.00";

            filaActual += 4;

            DataTable EstanciaHosp = dataSet.Tables["Estancia"];

            ws.Cell(filaActual + 1, 2).Value = "ESTADIA";
            ws.Cell(filaActual + 1, 2).Style.Font.Bold = true;

            int filaInicio = filaActual + 2;

            // Escribir encabezados
            ws.Cell(filaInicio, 2).Value = "Código Cama";
            ws.Cell(filaInicio, 3).Value = "Servicio";
            ws.Cell(filaInicio, 5).Value = "Fecha Ocupación";
            ws.Cell(filaInicio, 6).Value = "Hora Ocupación";

            var rango6 = ws.Range(filaInicio, 2, filaInicio, 6);
            rango6.Style.Font.Bold = true;
            rango6.Style.Border.TopBorder = XLBorderStyleValues.Thin;
            rango6.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
            rango6.Style.Border.LeftBorder = XLBorderStyleValues.Thin;
            rango6.Style.Border.RightBorder = XLBorderStyleValues.Thin;

            rango6.Style.Border.TopBorderColor = XLColor.Blue;
            rango6.Style.Border.BottomBorderColor = XLColor.Blue;
            rango6.Style.Border.LeftBorderColor = XLColor.Blue;
            rango6.Style.Border.RightBorderColor = XLColor.Blue;


            int fila = filaInicio + 1;

            // Escribir filas de datos
            foreach (DataRow row in EstanciaHosp.Rows)
            {
                ws.Cell(fila, 2).Value = row["CodigoCama"]?.ToString();
                ws.Cell(fila, 3).Value = row["NombreServicio"]?.ToString();

                // Si quieres fecha en formato dd/MM/yyyy
                if (DateTime.TryParse(row["FechaOcupacion"]?.ToString(), out DateTime fecha))
                    ws.Cell(fila, 5).Value = fecha.ToString("dd/MM/yyyy");
                else
                    ws.Cell(fila, 5).Value = row["FechaOcupacion"]?.ToString();

                ws.Cell(fila, 6).Value = row["HoraOcupacion"]?.ToString();

                fila++;
            }

        }
    }
}