var ObjtableListaReportes;
var ListarReportes = {

    Eventos() {
        ///////////////////////REPORTE CONSOLIDADO RECAUDACION//////////////////////////////////////////////////////////
        $('#btnAbrirReporteTamizajeOftalmologico').on('click', async () => {
            //await ReporteCaja.ValoresPorDefectoReporteTamizajeOftalmologico();
            $("#modalReporteTamizajeOftalmologico").modal("show");
        });

        $('#btnCerrarReporteTamizajeOftalmologico').on('click', async () => {
            //await ReporteCaja.ValoresPorDefectoReporteTamizajeOftalmologico();
            $("#modalReporteTamizajeOftalmologico").modal("hide");
        });

        $('#btnGenerarReporteTamizajeOftalmologico').on('click', () => {

            if (isEmpty($('#txtRptFechaInicioTamizajeOftalmologico').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }

            if (isEmpty($('#txtRptFechaFinTamizajeOftalmologico').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }

            if ($('#txtRptFechaInicioTamizajeOftalmologico').val() > $('#txtRptFechaFinTamizajeOftalmologico').val()) {
                alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha final.');
                return false
            }
            //else if ($('#txtRptFechaInicioTamizajeOftalmologico').val() == $('#txtRptFechaFinTamizajeOftalmologico').val()) {
            //    if ($('#txtRptHoraInicioTamizajeOftalmologico').val() > $('#txtRptHoraFinTamizajeOftalmologico').val()) {
            //        alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora final.');
            //        return false
            //    }
            //}

            //if (isEmpty($('#cboRptCajeroTamizajeOftalmologico').val())) {
            //    alerta2('info', '', 'Seleccione el cajero.');
            //    return false
            //}

            let formData = new FormData()
            formData.append('fechaInicio', $("#txtRptFechaInicioTamizajeOftalmologico").val());
            formData.append('fechaFin', $("#txtRptFechaFinTamizajeOftalmologico").val());            
            formData.append('enExcel', ($('#chkRptEnExcelTamizajeOftalmologico').is(':checked') ? 1 : 0));

            Cargando(1)

            fetch('/Reportes/ReporteTamizajeOftalmologico?area=Reportes', {
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
                        var url = window.URL.createObjectURL(blob)
                        if ($('#chkRptEnExcelTamizajeOftalmologico').is(':checked')) {
                            var a = document.createElement('a')
                            a.href = url
                            a.download = "ReporteTamizajeOftalmologico.xlsx"
                            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again
                            alerta2('success', '', 'La descarga se realizo con exito.')
                            Cargando(0);
                        } else {
                            AbrirVisorDocumentoPersonalizado(url, "Reporte Consolidado Recaudación");
                            Cargando(0);
                        }

                    }

                })
                .catch((e) => {
                    alerta2('danger', '', 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        });


        //$('#cboTipoServicioAntimicrobianos').on('change', async () => {
        //    let filtro = ` (${$('#cboTipoServicioAntimicrobianos').val()}) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre`
        //    await ReportesFarmacia.ListarServicioPorFiltro(filtro, '#cboServicioAntimicrobianos')
        //})
        ////////////////////////////////////////////////////////////////////////////////////////////////
    },

    InicializarComponentesListarReporte() {
        $('#modalReporte').modal({ backdrop: 'static', keyboard: false });
        $('#modalReporte').modal('hide');
        ObjtableListaReportes = $("#lstReportes").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            scrollCollapse: true,
            bLengthChange: false,
            buttons: [],
            columns: [
                { "data": "reporte", width: "80%"},
                { "data": "idReporte", className: 'ContCenter', "visible": false },                
                { "data": "id_MenuReporte", className: 'ContCenter', "visible": false  },
                { "data": "modulo", "visible": false },
                { "data": "accion", className: 'ContCenter' }

            ]
        });

        $('.txtFechaRpt').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".txtFechaRpt").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".txtHoraRpt").mask("Hn:Nn");
       
    },

    ListadoReportes() {
        var Recurso
        Recurso = $("#lstReportes").data('source');
        Cargando(1);
        var midata = new FormData();
        midata.append('idListBar', $("#hdnIdListBar").val());
        $.ajax({
            method: "POST",
            url: Recurso,
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        ObjtableListaReportes.fnClearTable();
                        if (!isEmpty(datos.listReporte.table)) {
                            if (datos.listReporte.table.length > 0) {
                                ObjtableListaReportes.fnAddData(datos.listReporte.table);
                            }
                        }
                    } else {
                        alerta(3, datos.mensaje);
                    }
                } else {
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },


    ListadoReportes() {
        var Recurso
        Recurso = $("#lstReportes").data('source');
        Cargando(1);
        var midata = new FormData();
        midata.append('idListBar', $("#hdnIdListBar").val());
        $.ajax({
            method: "POST",
            url: Recurso,
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        ObjtableListaReportes.fnClearTable();
                        if (!isEmpty(datos.listReporte.table)) {
                            if (datos.listReporte.table.length > 0) {
                                ObjtableListaReportes.fnAddData(datos.listReporte.table);
                            }
                        }
                    } else {
                        alerta(3, datos.mensaje);
                    }
                } else {
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },



    CargarVista(idMenu,idRpt) {
        $.ajax({
            method: "POST",
            url: "/Reportes/ValidaSession?area=Reportes",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                } else {
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })

        if (idMenu == 'ID_TamizajeOftalmologico') {
            $("#modalReporteTamizajeOftalmologico").modal("show");
            return;
        }

        Cargando(1);
        var midata = new FormData();
        midata.append('idMenu', idMenu);
        midata.append('idRpt', idRpt);
        $.ajax({
            method: "POST",
            url: "/Reportes/RetornarFrmReport?area=Reportes",
            data: midata,
            dataType: "html",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#modalReporte #Reporte').html(datos);
                $('#modalReporte').modal('show');
            },
            error: function (msg) {
                console.log(msg)
                Cargando(0)
            }
        })
    },

    /////////////////////////////////MODAL REPORTES//////////////////////////////////////////////
    AbrirModalReporteTableroUnidadSeguro() {
        $("#modalReporteTableroUnidadSeguros").modal("show");
    },

    CerrarModalReporteTableroUnidadSeguro() {
        $("#cboTipoReporte").val(1);
        //$("#txtFechaInicioRpt").val("");
        //$("#txtFechaFinRpt").val("");
        $("#txtFechaInicioTableroUnidadSeguro").datepicker("setDate", FechaDia);
        //$("#txtFechaFinRpt").datepicker("setDate", FechaDia);
        $("#modalReporteTableroUnidadSeguros").modal("hide");
    },

    async GenerarReporteTableroUnidadSeguro() {
        if ($("#txtFechaInicioTableroUnidadSeguro").val() == "") {
            alerta2('info', '', 'Debe ingresar la fecha inicio.');
            return false;
        }
        
        let formData = new FormData();
        let urlReporteRn = '';
        let nombreReporteRn = '';
        urlReporteRn = '/Reportes/ReporteTableroUnidadSeguro?area=Reportes';
        nombreReporteRn = 'Reporte_Tablero_Unidad_Seguros.xlsx';
        formData.append('FechaInicio', $("#txtFechaInicioTableroUnidadSeguro").val());
        //formData.append('FechaFin', $("#txtFechaFinRpt").val());
        Cargando(1);
        fetch(urlReporteRn, {
            method: "POST",
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            var url = window.URL.createObjectURL(blob)
            var a = document.createElement('a')
            a.href = url
            a.download = nombreReporteRn
            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
            alerta2('success', '', 'La descarga se realizo con exito.')
            Cargando(0)
        })
            .catch((e) => {
                Cargando(0)
            alerta2('danger', '', 'Error al descargar documento, intente nuevamente.')
            
        })
    },



}

$(document).ready(function () {

    ListarReportes.InicializarComponentesListarReporte();
    ListarReportes.ListadoReportes();
    ListarReportes.Eventos();
    
});