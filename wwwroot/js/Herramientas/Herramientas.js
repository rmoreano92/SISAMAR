var Herramientas = {

    // Plugins() {
    //     $('.chzn-select').chosen().trigger("chosen:updated");
    //     $(".chosen-select").chosen();
    // },

    Eventos() {

        /////////REPORGRAMACION MEDICA/////////////////
        $('#btnHerrReprogramacionMedica').on('click', function () {
            ReprogramacionMedica.LimpiarCampos();
            $('#btnHerrReprogramacionMedica').focus();
            $("#modalReprogramacionMedica").modal("show");
        });

        $('#btnCerrarHerrReprogramacionMedica').on('click', function () {
            ReprogramacionMedica.LimpiarCampos();
            $("#modalReprogramacionMedica").modal("hide");
        });

        ///////////REPORTES ESTADISTICAS///////////////////
        $('#btnHerrReportesEstadistica').on('click', async function () {
            await ReportesEstadistica.LimpiarCampos();
            $('#btnHerrReportesEstadistica').focus();
            $("#modalReportesEstadistica").modal("show");
        });

        $('#btnCerrarHerrReportesEstadistica').on('click', async function () {
            await ReportesEstadistica.LimpiarCampos();
            $("#modalReportesEstadistica").modal("hide");
        });


        ///////////EXPORTAR SEM//////////////////
        $('#btnHerrExportaReporteSEM').on('click', async function () {
            await ExportarDatos.LimpiarCampos();
            $('#btnGenerarReporteSEM').focus();
            $("#modalReporteSEM").modal("show");
        });

        $('#btnCerrarHerrReporteSEM').on('click', async function () {
            await ExportarDatos.LimpiarCampos();
            $("#modalReporteSEM").modal("hide");
        });

        ///////////REPORTES ESTADISTICAS///////////////////
        $('#btnHerrReporteEgresos').on('click', async function () {
            // await ReportesEstadistica.LimpiarCampos();
            // $('#btnHerrReportesEstadistica').focus();
            $("#modalReporteEgresos").modal("show");
        });

        $('#btnCerrarHerrReporteEgresos').on('click', async function () {
            await ReportesEstadistica.LimpiarCampos();
            $("#modalReporteEgresos").modal("hide");
        });

        $('#btnHerrReporteConstancias').on('click', async function () {
            // await ReportesEstadistica.LimpiarCampos();
            // $('#btnHerrReportesEstadistica').focus();
            $("#modalReporteConstancias").modal("show");
        });

        ///////////Bloqueo / Desbloqueo Sistema CitasWeb///////////////////
        $('#btnHerrBloqueoDesbloqueoSistemaCitasWeb').on('click', async function() {
            // await ReportesEstadistica.LimpiarCampos();
            // $('#btnHerrReportesEstadistica').focus();
            await SistemaCitasWeb.Limpiar();
            $("#modalSistemaCitasWeb").modal("show");
        });

        $('#btnCerrarSistemaCitasWeb').on('click', async function() {
            $("#modalSistemaCitasWeb").modal("hide");
        });


    }

}

$(document).ready(function () {
    Herramientas.Eventos();

    ReprogramacionMedica.Iniciar();
    ReportesEstadistica.Iniciar();
    ExportarDatos.Iniciar();
    ReportesConstancias.Iniciar();
    ReportesEgresos.Iniciar();
    SistemaCitasWeb.Iniciar();
    // Herramientas.Plugins();
});