var ExportarDatos = {

    async Iniciar() {
        await ExportarDatos.Plugins();
        ExportarDatos.Eventos();
    },

    async Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaInicioExpSEM, #txtFechaFinExpSEM').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });


        let fechaActual = await Utilitario.FechaHoraServidor();
        $("#txtFechaInicioExpSEM, #txtFechaFinExpSEM").datepicker('setDate', fechaActual.substring(0, 10));

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $("#txtFechaInicioExpSEM, #txtFechaFinExpSEM").mask("Dd/Mm/abcd");

        //$.mask.definitions['H'] = '[012]';
        //$.mask.definitions['N'] = '[012345]';
        //$.mask.definitions['n'] = '[0123456789]';
        //$("#txtHoraInicioActualReprogMed").mask("Hn:Nn");
        //$("#txtHoraFinActualReprogMed").mask("Hn:Nn");
    },

    Eventos() {
        $('#btnGenerarReporteSEM').on('click', () => {

            $("#rdbTipoReporteExportaSEMHosp").click();     //COMENTAR ESTA LIENA LUEGO

            if (isEmpty($('input[name="rdbTipoReporteExportaSEM"]:checked').val())) {
                alerta2('info', '', 'Por favor seleccione el tipo servicio.');
                return false
            }

            if (isEmpty($('input[name="rdbTipoPacienteExportaSEM"]:checked').val())) {
                alerta2('info', '', 'Por favor seleccione el tipo de paciente.');
                return false
            }

            if (isEmpty($('#txtFechaInicioExpSEM').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }

            if (isEmpty($('#txtFechaFinExpSEM').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }
            
            let reporte = "";
            if ($('input[name="rdbTipoReporteExportaSEM"]:checked').val() == 1) { reporte = "REPORTE SEM EMERGENCIA"; }
            if ($('input[name="rdbTipoReporteExportaSEM"]:checked').val() == 2) { reporte = "REPORTE SEM HOSPITALIZACIÓN"; }

            let url = "";
            if ($('input[name="rdbTipoPacienteExportaSEM"]:checked').val() == 1) { url = "/ExportarDatos/rptExportarDatosAdultasSEM?area=Herramientas"; }
            if ($('input[name="rdbTipoPacienteExportaSEM"]:checked').val() == 2) { url = "/ExportarDatos/rptExportarDatosNeonatosSEM?area=Herramientas"; }

            let formData = new FormData();
            formData.append('fechaInicio', $("#txtFechaInicioExpSEM").val());
            formData.append('fechaFin', $("#txtFechaFinExpSEM").val());
            //formData.append('idMedico', $("#cboMedicoReporteEstadistica").val() == null ? 0 : $("#cboMedicoReporteEstadistica").val());
            formData.append('tipoReporte', $('input[name="rdbTipoReporteExportaSEM"]:checked').val());
            //formData.append('tipoPaciente', $('input[name="rdbTipoPacienteExportaSEM"]:checked').val());
            formData.append('reporte', reporte);

            Cargando(1)

            fetch(url, {
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
                        a.download = "ReporteSEM.xlsx";
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

        //$('#btnCerrarHerrReporteSEM').on('click', async () => { 
        //    await EsportarDatos.LimpiarCampos();
        //    $("#modalReporteSEM").modal("hide");
        //});
    },

    async LimpiarCampos() {
        $('input[name="rdbTipoReporteExportaSEM"]').removeAttr("checked");
        //$("#cboMedicoReporteEstadistica").val(0);

        let fechaActual = await Utilitario.FechaHoraServidor();
        $("#txtFechaInicioExpSEM, #txtFechaFinExpSEM").datepicker('setDate', fechaActual.substring(0, 10));

        $('.chzn-select').chosen().trigger("chosen:updated");
    }
}