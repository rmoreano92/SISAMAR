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
    public class EstadoCuentaResumenLiquidacionReport : IExcelReportGenerator
    {
        public void Generar(IXLWorksheet ws, DataSet dataSet, List<DatosCabeceraReporte> cabeceras)
        {
            ws.SheetView.View = XLSheetViewOptions.PageBreakPreview;
            ws.PageSetup.SetRowsToRepeatAtTop(1, 6);

            ws.Cell(3, 3).Value = $"{cabeceras[0].CabeceraPrincipal.IdCuentaAtencion}";
            ws.Cell(4, 3).Value = $"{cabeceras[0].CabeceraPrincipal.NombrePaciente}";
            ws.Cell(5, 3).Value = $"{cabeceras[0].CabeceraPrincipal.FechaIngreso}";
            ws.Cell(6, 3).Value = $"{cabeceras[0].CabeceraPrincipal.FechaEgreso}";
            // ws.Cell(6, 3).Value = $"{cabeceras[0].CabeceraPrincipal.}";
            ws.Cell(3, 8).Value = $"{cabeceras[0].CabeceraPrincipal.IdAtencion}";
            ws.Cell(4, 8).Value = $"{cabeceras[0].CabeceraPrincipal.NumeroHistoriaClinica}";
            ws.Cell(5, 8).Value = $"{cabeceras[0].CabeceraPrincipal.ServicioEgreso}";
            ws.Cell(6, 8).Value = $"{cabeceras[0].CabeceraPrincipal.Cama}";

            if (dataSet == null || dataSet.Tables.Count == 0)
                return;

            // Totales generales
            decimal subTotalGeneral = 0;
            decimal importeExoneraGeneral = 0;
            decimal totalSisGeneral = 0;
            decimal totalSoatGeneral = 0;
            decimal totalConvenioGeneral = 0;
            decimal debeGeneral = 0;
            decimal pagoGeneral = 0;
            decimal saldoGeneral = 0;

            int filaActual = 8;

            DataTable dataTableFarmacia = dataSet.Tables[0];
            DataTable dataTableServicios = dataSet.Tables[1];

            string puntoCargaActual = dataTableServicios.Rows[0]["DesPuntoCarga"].ToString();
            string puntoCargaAnterior = "";

            decimal subTotal = 0;
            decimal importeExonera = 0;
            decimal totalSis = 0;
            decimal totalSoat = 0;
            decimal totalConvenio = 0;
            decimal debe = 0;
            decimal pago = 0;
            decimal saldo = 0;

            int index = 1;

            foreach (DataRow row in dataTableFarmacia.Rows)
            {

                subTotal += Convert.ToDecimal(row["SubTotal"]);
                importeExonera += Convert.ToDecimal(row["ImporteExonera"]);
                totalSis += Convert.ToDecimal(row["TotalFinanciadoSis"]);
                totalSoat += Convert.ToDecimal(row["TotalFinanciadoSoat"]);
                totalConvenio += Convert.ToDecimal(row["TotalConvenio"]);
                debe += Convert.ToDecimal(row["Debe"]);
                pago += Convert.ToDecimal(row["Pago"]);
                saldo += Convert.ToDecimal(row["Saldo"]);

                // Acumuladores generales
                importeExoneraGeneral += Convert.ToDecimal(row["ImporteExonera"]);
                totalSisGeneral += Convert.ToDecimal(row["TotalFinanciadoSis"]);
                totalSoatGeneral += Convert.ToDecimal(row["TotalFinanciadoSoat"]);
                totalConvenioGeneral += Convert.ToDecimal(row["TotalConvenio"]);
                debeGeneral += Convert.ToDecimal(row["Debe"]);
                pagoGeneral += Convert.ToDecimal(row["Pago"]);
                saldoGeneral += Convert.ToDecimal(row["Saldo"]);

                if (row["Codigo"].ToString() != "F00001")
                {
                    subTotalGeneral += Convert.ToDecimal(row["SubTotal"]);
                }
            }

            string desPuntoCarga = "";
            ws.Cell(filaActual, 2).Value = index;
            if (dataTableFarmacia != null &&
                dataTableFarmacia.Rows.Count > 0 &&
                dataTableFarmacia.Columns.Contains("DesPuntoCarga"))
            {
                desPuntoCarga = dataTableFarmacia.Rows[0]["DesPuntoCarga"].ToString();
            }
            else
            {
                desPuntoCarga = ""; // o lo que necesites por defecto
            }
            ws.Cell(filaActual, 3).Value = desPuntoCarga;
            ws.Cell(filaActual, 5).Value = subTotal.ToString("N2");
            ws.Cell(filaActual, 6).Value = importeExonera.ToString("N2");
            ws.Cell(filaActual, 7).Value = totalSis.ToString("N2");
            ws.Cell(filaActual, 8).Value = totalSoat.ToString("N2");
            ws.Cell(filaActual, 9).Value = totalConvenio.ToString("N2");
            ws.Cell(filaActual, 10).Value = debe.ToString("N2");

            subTotal = 0;
            importeExonera = 0;
            totalSis = 0;
            totalSoat = 0;
            totalConvenio = 0;
            debe = 0;
            pago = 0;
            saldo = 0;
            filaActual++;
            index++;
            foreach (DataRow row in dataTableServicios.Rows)
            {
                puntoCargaAnterior = row["DesPuntoCarga"].ToString();

                // Detecta cambio de punto de carga y escribe subtotal acumulado
                if (puntoCargaAnterior != puntoCargaActual)
                {
                    ws.Cell(filaActual, 2).Value = puntoCargaActual;
                    ws.Cell(filaActual, 5).Value = subTotal.ToString("N2");
                    ws.Cell(filaActual, 6).Value = importeExonera.ToString("N2");
                    ws.Cell(filaActual, 7).Value = totalSis.ToString("N2");
                    ws.Cell(filaActual, 8).Value = totalSoat.ToString("N2");
                    ws.Cell(filaActual, 9).Value = totalConvenio.ToString("N2");
                    ws.Cell(filaActual, 10).Value = debe.ToString("N2");

                    filaActual++;

                    // Reiniciar acumuladores de subtotales
                    subTotal = 0;
                    importeExonera = 0;
                    totalSis = 0;
                    totalSoat = 0;
                    totalConvenio = 0;
                    debe = 0;
                    pago = 0;
                    saldo = 0;

                    puntoCargaActual = puntoCargaAnterior;

                    index++;
                }

                // Acumuladores por punto de carga
                subTotal += Convert.ToDecimal(row["SubTotal"]);
                importeExonera += Convert.ToDecimal(row["ImporteExonera"]);
                totalSis += Convert.ToDecimal(row["TotalFinanciadoSis"]);
                totalSoat += Convert.ToDecimal(row["TotalFinanciadoSoat"]);
                totalConvenio += Convert.ToDecimal(row["TotalConvenio"]);
                debe += Convert.ToDecimal(row["Debe"]);
                pago += Convert.ToDecimal(row["Pago"]);
                saldo += Convert.ToDecimal(row["Saldo"]);

                // Acumuladores generales
                importeExoneraGeneral += Convert.ToDecimal(row["ImporteExonera"]);
                totalSisGeneral += Convert.ToDecimal(row["TotalFinanciadoSis"]);
                totalSoatGeneral += Convert.ToDecimal(row["TotalFinanciadoSoat"]);
                totalConvenioGeneral += Convert.ToDecimal(row["TotalConvenio"]);
                debeGeneral += Convert.ToDecimal(row["Debe"]);
                pagoGeneral += Convert.ToDecimal(row["Pago"]);
                saldoGeneral += Convert.ToDecimal(row["Saldo"]);

                if (row["Codigo"].ToString() != "F00001")
                {
                    subTotalGeneral += Convert.ToDecimal(row["SubTotal"]);
                }
            }

            // =========================
            // Al final: Totales generales
            // =========================
            // ws.Cell(filaActual, 2).Value = index;
            // ws.Cell(filaActual, 3).Value = puntoCargaAnterior;
            // ws.Cell(filaActual, 5).Value = importeExonera.ToString("N2");
            // ws.Cell(filaActual, 7).Value = enletras(importeExonera.ToString("N2"));

            filaActual += 3;
            decimal montoLiquidacion = subTotalGeneral - pagoGeneral;



            ws.Cell(filaActual + 2, 3).Value = "TOTAL PAGO A CUENTA";
            ws.Cell(filaActual + 2, 4).Value = pagoGeneral.ToString("N2");

            ws.Cell(filaActual + 3, 3).Value = "TOTAL PACIENTE";
            ws.Cell(filaActual + 3, 4).Value = debeGeneral.ToString("N2");

            ws.Cell(filaActual + 4, 3).Value = "PAGADO";
            ws.Cell(filaActual + 4, 4).Value = pagoGeneral.ToString("N2");

            ws.Cell(filaActual + 5, 3).Value = "POR PAGAR PACIENTE";
            ws.Cell(filaActual + 5, 4).Value = saldoGeneral.ToString("N2");
        }

        string enletras(string num)
        {
            string res, dec = "";
            Int64 entero;
            int decimales;
            double nro;

            try

            {
                nro = Convert.ToDouble(num);
            }
            catch
            {
                return "";
            }

            entero = Convert.ToInt64(Math.Truncate(nro));
            decimales = Convert.ToInt32(Math.Round((nro - entero) * 100, 2));
            // if (decimales > 0)
            // {
            //     dec = " CON " + decimales.ToString() + "/100";
            // }

            dec = " CON " + decimales.ToString() + "/100";

            res = toText(Convert.ToDouble(entero)) + dec;
            return res;
        }

        string toText(double value)
        {
            string Num2Text = "";
            value = Math.Truncate(value);
            if (value == 0) Num2Text = "CERO";
            else if (value == 1) Num2Text = "UNO";
            else if (value == 2) Num2Text = "DOS";
            else if (value == 3) Num2Text = "TRES";
            else if (value == 4) Num2Text = "CUATRO";
            else if (value == 5) Num2Text = "CINCO";
            else if (value == 6) Num2Text = "SEIS";
            else if (value == 7) Num2Text = "SIETE";
            else if (value == 8) Num2Text = "OCHO";
            else if (value == 9) Num2Text = "NUEVE";
            else if (value == 10) Num2Text = "DIEZ";
            else if (value == 11) Num2Text = "ONCE";
            else if (value == 12) Num2Text = "DOCE";
            else if (value == 13) Num2Text = "TRECE";
            else if (value == 14) Num2Text = "CATORCE";
            else if (value == 15) Num2Text = "QUINCE";
            else if (value < 20) Num2Text = "DIECI" + toText(value - 10);
            else if (value == 20) Num2Text = "VEINTE";
            else if (value < 30) Num2Text = "VEINTI" + toText(value - 20);
            else if (value == 30) Num2Text = "TREINTA";
            else if (value == 40) Num2Text = "CUARENTA";
            else if (value == 50) Num2Text = "CINCUENTA";
            else if (value == 60) Num2Text = "SESENTA";
            else if (value == 70) Num2Text = "SETENTA";
            else if (value == 80) Num2Text = "OCHENTA";
            else if (value == 90) Num2Text = "NOVENTA";
            else if (value < 100) Num2Text = toText(Math.Truncate(value / 10) * 10) + " Y " + toText(value % 10);
            else if (value == 100) Num2Text = "CIEN";
            else if (value < 200) Num2Text = "CIENTO " + toText(value - 100);
            else if ((value == 200) || (value == 300) || (value == 400) || (value == 600) || (value == 800)) Num2Text = toText(Math.Truncate(value / 100)) + "CIENTOS";
            else if (value == 500) Num2Text = "QUINIENTOS";
            else if (value == 700) Num2Text = "SETECIENTOS";
            else if (value == 900) Num2Text = "NOVECIENTOS";
            else if (value < 1000) Num2Text = toText(Math.Truncate(value / 100) * 100) + " " + toText(value % 100);
            else if (value == 1000) Num2Text = "MIL";
            else if (value < 2000) Num2Text = "MIL " + toText(value % 1000);
            else if (value < 1000000)
            {
                Num2Text = toText(Math.Truncate(value / 1000)) + " MIL";
                if ((value % 1000) > 0) Num2Text = Num2Text + " " + toText(value % 1000);
            }

            else if (value == 1000000) Num2Text = "UN MILLON";
            else if (value < 2000000) Num2Text = "UN MILLON " + toText(value % 1000000);
            else if (value < 1000000000000)
            {
                Num2Text = toText(Math.Truncate(value / 1000000)) + " MILLONES ";
                if ((value - Math.Truncate(value / 1000000) * 1000000) > 0) Num2Text = Num2Text + " " + toText(value - Math.Truncate(value / 1000000) * 1000000);
            }

            else if (value == 1000000000000) Num2Text = "UN BILLON";
            else if (value < 2000000000000) Num2Text = "UN BILLON " + toText(value - Math.Truncate(value / 1000000000000) * 1000000000000);

            else
            {
                Num2Text = toText(Math.Truncate(value / 1000000000000)) + " BILLONES";
                if ((value - Math.Truncate(value / 1000000000000) * 1000000000000) > 0) Num2Text = Num2Text + " " + toText(value - Math.Truncate(value / 1000000000000) * 1000000000000);
            }
            return Num2Text;

        }
    }
}

