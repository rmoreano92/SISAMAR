ReportesEstadistica = {

    async Iniciar() {
        await ReportesEstadistica.Plugins();
        ReportesEstadistica.Eventos();
    },

    async Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaInicioRepEst, #txtFechaFinRepEst').datepicker({ 
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });


        let fechaActual = await Utilitario.FechaHoraServidor();         
        $("#txtFechaInicioRepEst, #txtFechaFinRepEst").datepicker('setDate', fechaActual.substring(0, 10));

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $("#txtFechaInicioRepEst, #txtFechaFinRepEst").mask("Dd/Mm/abcd");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraInicioActualReprogMed").mask("Hn:Nn");
        //$("#txtHoraFinActualReprogMed").mask("Hn:Nn");
    },

    Eventos() {
        $('#btnGenerarReporteEstadistica').on('click', () => {

            if (isEmpty($('#txtFechaInicioRepEst').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }

            if (isEmpty($('#txtFechaFinRepEst').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }

            if ($('#txtFechaInicioRepEst').val() > $('#txtFechaFinRepEst').val()) {
                alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha final.');
                return false
            }

            if (isEmpty($('input[name="rdbTipoReporteEstadistica"]:checked').val())) {
                alerta2('info', '', 'Por favor seleccione una opcion.');
                return false
            }

            let reporte = "";
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 1) { reporte = "REPORTE MINSA EMERGENCIA"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 2) { reporte = "REPORTE MINSA CONSULTA EXTERNA"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 3) { reporte = "REPORTE APOYO AL DIAGNÓSTICO"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 4) { reporte = "REPORTE EGRESOS HOSPITALARIOS"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 5) { reporte = "REPORTE PPR EMERGENCIA"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 7) { reporte = "REPORTE PRODUCCIÓN DE MÉDICOS"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 8) { reporte = "REPORTE GENERAL EMERGENCIA"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 9) { reporte = "REPORTE GENERAL CONSULTA EXTERNA"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 10) { reporte = "REPORTE EIDISIP"; }
            if ($('input[name="rdbTipoReporteEstadistica"]:checked').val() == 11) { reporte = "REPORTE DE PROCEDIMIENTOS"; }


            let formData = new FormData();
            formData.append('fechaInicio', $("#txtFechaInicioRepEst").val());
            formData.append('fechaFin', $("#txtFechaFinRepEst").val());
            formData.append('idMedico', $("#cboMedicoReporteEstadistica").val() == null ? 0 : $("#cboMedicoReporteEstadistica").val());
            formData.append('tipoReporte', $('input[name="rdbTipoReporteEstadistica"]:checked').val());
            formData.append('reporte', reporte);

            Cargando(1)

            fetch('/ReportesEstadistica/rptListarReporteEstadistica?area=Herramientas', {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (response.status === 204) {
                        alerta2('info', '', 'No existen datos para descargar.');
                        Cargando(0);
                        return;
                    }
                    return response.blob();
                })
                .then(blob => {
                    if (isEmpty(blob) == false) {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = reporte + ".xlsx";
                        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();
                        a.remove();  //afterwards we remove the element again
                        alerta2('success', '', 'La descarga se realizo con exito.');
                        Cargando(0);
                    }                    
                })
                .catch((e) => {
                    alerta2('error', '', 'Error al descargar documento, intente nuevamente.');
                    Cargando(0);
                })

        });

        //$('#btnCerrarHerrReportesEstadistica').on('click', async () => { 
        //    ReportesEstadistica.LimpiarCampos();
        //    $("#modalReportesEstadistica").modal("hide");
        //});
    },

    async LimpiarCampos() {
        $('input[name="rdbTipoReporteEstadistica"]').removeAttr("checked");
        $("#cboMedicoReporteEstadistica").val(0);

        let fechaActual = await Utilitario.FechaHoraServidor();
        $("#txtFechaInicioRepEst, #txtFechaFinRepEst").datepicker('setDate', fechaActual.substring(0, 10));

        $('.chzn-select').chosen().trigger("chosen:updated");
    }
}