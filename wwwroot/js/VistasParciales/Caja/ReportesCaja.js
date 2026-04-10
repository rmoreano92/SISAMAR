var ReporteCaja = {

    async Iniciar() {
        ReporteCaja.Plugins();
        ReporteCaja.Eventos();
        await ReporteCaja.ValoresPorDefectoReporteConsolidadoVentas();
        await ReporteCaja.ValoresPorDefectoReporteResumenPorPartida();
    },

    Plugins() {
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

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    async ValoresPorDefectoReporteConsolidadoVentas() {
        let fechaHoraHoy = await Utilitario.FechaHoraServidor();
        let fechaHoy = fechaHoraHoy.substring(0, 10);
        $(".txtFechaRpt").datepicker("setDate", fechaHoy);

        $("#txtRptHoraInicioConsolidadoVentas").val("00:00");
        $("#txtRptHoraFinConsolidadoVentas").val("23:59");

        $("#cboRptCajaConsolidadoVentas").val("");
        $("#cboRptTurnoConsolidadoVentas").val("");
        $("#cboRptCajeroConsolidadoVentas").val("");
        $("#cboRptComprobanteConsolidadoVentas").val("0");

        $('input[name="rdbRptTipoReporteConsolidadoVentas"][value="1"]').prop('checked', true);
        $('input[name="rdbRptTipoConsumoConsolidadoVentas"][value="3"]').prop('checked', true);

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async ValoresPorDefectoReporteResumenPorPartida() {
        let fechaHoraHoy = await Utilitario.FechaHoraServidor();
        let fechaHoy = fechaHoraHoy.substring(0, 10);
        $(".txtFechaRpt").datepicker("setDate", fechaHoy);

        $("#txtRptHoraInicioResumenPorPartida").val("00:00");
        $("#txtRptHoraFinResumenPorPartida").val("23:59");

        $("#cboRptCajeroResumenPorPartida").val("");
        
        $('input[id="chkRptPartidaMayorCeroResumenPorPartida"]').removeAttr('checked');
        $('input[id="chkRptNotasCreditoResumenPorPartida"]').removeAttr('checked');

        $('.chzn-select').chosen().trigger("chosen:updated");
    },
        
    async ValoresPorDefectoReporteConsolidadoRecaudacion() {
        let fechaHoraHoy = await Utilitario.FechaHoraServidor();
        let fechaHoy = fechaHoraHoy.substring(0, 10);
        $(".txtFechaRpt").datepicker("setDate", fechaHoy);

        //$("#txtRptFechaInicioConsolidadoRecaudacion").val("00:00");
        //$("#txtRptHoraFinResumenPorPartida").val("23:59");

        $("#cboRptCajeroConsolidadoRecaudacion").val("");

        $('input[name="rdbRptTipoConsumoConsolidadoRecaudacion"][value="0"]').prop('checked', true);

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    Eventos() {
        ///////////////////////REPORTE CONSOLIDADO VENTAS//////////////////////////////////////////////////////////
        $('#btnAbrirReporteConsolidadoVentas').on('click', async () => {
            await ReporteCaja.ValoresPorDefectoReporteConsolidadoVentas();
            $("#modalReporteConsolidadoVentas").modal("show");
        });

        $('#btnCerrarReporteConsolidadoVentas').on('click', async () => {
            await ReporteCaja.ValoresPorDefectoReporteConsolidadoVentas();
            $("#modalReporteConsolidadoVentas").modal("hide");
        });

        $('#btnGenerarReporteConsolidadoVentas').on('click', () => {

            //if ($('#cboFarmaciaAntimicrobianos').val() < 0 || $('#cboFarmaciaAntimicrobianos').val() == "") {
            //    alerta2('info', '', 'Selecciona una farmacia o almacen.');
            //    return false
            //}

            if (isEmpty($('input[name="rdbRptTipoReporteConsolidadoVentas"]:checked').val())) {
                alerta2('info', '', 'Selecciona el tipo de reporte.');
                return false
            }
                        
            if (isEmpty($('#txtRptFechaInicioConsolidadoVentas').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }

            if (isEmpty($('#txtRptHoraInicioConsolidadoVentas').val())) {
                alerta2('info', '', 'Ingresa la hora de inicio.');
                return false
            }

            if (isEmpty($('#txtRptFechaFinConsolidadoVentas').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }

            if (isEmpty($('#txtRptHoraFinConsolidadoVentas').val())) {
                alerta2('info', '', 'Ingresa la hora final.');
                return false
            }

            if ($('#txtRptFechaInicioConsolidadoVentas').val() > $('#txtRptFechaFinConsolidadoVentas').val()) {
                alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha final.');
                return false
            } else if ($('#txtRptFechaInicioConsolidadoVentas').val() == $('#txtRptFechaFinConsolidadoVentas').val()) {
                if ($('#txtRptHoraInicioConsolidadoVentas').val() > $('#txtRptHoraFinConsolidadoVentas').val()) {
                    alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora final.');
                    return false
                }
            }

            if (isEmpty($('input[name="rdbRptTipoConsumoConsolidadoVentas"]:checked').val())) {
                alerta2('info', '', 'Selecciona el tipo de consumo.');
                return false
            }

            let formData = new FormData()
            formData.append('idTipoReporte', $('input[name="rdbRptTipoReporteConsolidadoVentas"]:checked').val());
            formData.append('idTipoConsumo', $('input[name="rdbRptTipoConsumoConsolidadoVentas"]:checked').val());
            formData.append('fechaInicio', $("#txtRptFechaInicioConsolidadoVentas").val() + ' ' + $("#txtRptHoraInicioConsolidadoVentas").val());
            //formData.append('horaInicio', $("#txtHoraInicioPsicotropicos").val());
            formData.append('fechaFin', $("#txtRptFechaFinConsolidadoVentas").val() + ' ' + $("#txtRptHoraFinConsolidadoVentas").val());
            //formData.append('horaFin', $("#txtHoraFinPsicotropicos").val());
            formData.append('idTipoComprobante', $("#cboRptComprobanteConsolidadoVentas").val());
            formData.append('idCaja', $("#cboRptCajaConsolidadoVentas").val());
            formData.append('idTurno', $("#cboRptTurnoConsolidadoVentas").val());
            formData.append('idCajero', $("#cboRptCajeroConsolidadoVentas").val());
            formData.append('idFarmacia', 0);
            formData.append('idVendedor', 0);
            
            formData.append('tipoConsumo', $('input[name="rdbRptTipoConsumoConsolidadoVentas"]:checked').next().text());
            formData.append('tipoComprobante', $('#cboRptComprobanteConsolidadoVentas option:selected').text());
            formData.append('caja', $('#cboRptCajaConsolidadoVentas option:selected').text());
            formData.append('cajero', $('#cboRptCajeroConsolidadoVentas option:selected').text());

            formData.append('enExcel', ($('#chkRptEnExcelConsumoConsolidadoVentas').is(':checked') ? 1 : 0));

            Cargando(1);

            fetch('/ReportesCaja/ReporteConsolidadoVentas?area=Caja', {
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
                        let url = window.URL.createObjectURL(blob)
                        if ($('#chkRptEnExcelConsumoConsolidadoVentas').is(':checked')) {
                            let a = document.createElement('a')
                            a.href = url
                            a.download = "ReporteConsolidadoVentas.xlsx"
                            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again
                            alerta2('success', '', 'La descarga se realizo con exito.')
                            Cargando(0);
                        } else {
                            AbrirVisorDocumentoPersonalizado(url, "Registro de Ventas");
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

        ///////////////////////REPORTE RESUMEN POR PARTIDAS//////////////////////////////////////////////////////////
        $('#btnAbrirReporteResumenPorPartida').on('click', async () => {
            await ReporteCaja.ValoresPorDefectoReporteResumenPorPartida();
            $("#modalReporteResumenPorPartida").modal("show");
        });

        $('#btnCerrarReporteResumenPorPartida').on('click', async () => {
            await ReporteCaja.ValoresPorDefectoReporteResumenPorPartida();
            $("#modalReporteResumenPorPartida").modal("hide");
        });

        $('#btnGenerarReporteResumenPorPartida').on('click', () => {

            //if ($('#cboFarmaciaAntimicrobianos').val() < 0 || $('#cboFarmaciaAntimicrobianos').val() == "") {
            //    alerta2('info', '', 'Selecciona una farmacia o almacen.');
            //    return false
            //}
                       
            if (isEmpty($('#txtRptFechaInicioResumenPorPartida').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }

            if (isEmpty($('#txtRptHoraInicioResumenPorPartida').val())) {
                alerta2('info', '', 'Ingresa la hora de inicio.');
                return false
            }

            if (isEmpty($('#txtRptFechaFinResumenPorPartida').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }

            if (isEmpty($('#txtRptHoraFinResumenPorPartida').val())) {
                alerta2('info', '', 'Ingresa la hora final.');
                return false
            }

            /*if ($('#txtRptFechaInicioResumenPorPartida').val() > $('#txtRptFechaFinResumenPorPartida').val()) {
                alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha final.');
                return false
            } else if ($('#txtRptFechaInicioResumenPorPartida').val() == $('#txtRptFechaFinResumenPorPartida').val()) {
                if ($('#txtRptHoraInicioResumenPorPartida').val() > $('#txtRptHoraFinResumenPorPartida').val()) {
                    alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora final.');
                    return false
                }
            }*/

            // if (isEmpty($('#cboRptCajaResumenPorPartida').val())) {
            //     alerta2('info', '', 'Seleccione la caja.');
            //     return false
            // }

            // if (isEmpty($('#cboRptCajeroResumenPorPartida').val())) {
            //     alerta2('info', '', 'Seleccione el cajero.');
            //     return false
            // }

            let formData = new FormData()            
            formData.append('fechaInicio', $("#txtRptFechaInicioResumenPorPartida").val() + ' ' + $("#txtRptHoraInicioResumenPorPartida").val());
            //formData.append('horaInicio', $("#txtHoraInicioPsicotropicos").val());
            formData.append('fechaFin', $("#txtRptFechaFinResumenPorPartida").val() + ' ' + $("#txtRptHoraFinResumenPorPartida").val());
            //formData.append('horaFin', $("#txtHoraFinPsicotropicos").val());
            formData.append('idCaja', $("#cboRptCajaResumenPorPartida").val());
            formData.append('idCajero', $("#cboRptCajeroResumenPorPartida").val());
            formData.append('soloMayorCero', ($('#chkRptSoloPartidaMayorCeroResumenPorPartida').is(':checked') ? 1 : 0));
            formData.append('incluyeNotasCredito', ($('#chkRptIncluyeNotasCreditoResumenPorPartida').is(':checked') ? 1 : 0));

            formData.append('caja', $('#cboRptCajaResumenPorPartida option:selected').text());
            formData.append('cajero', $('#cboRptCajeroResumenPorPartida option:selected').text());
            //formData.append('tipoComprobante', ($('#chkRptIncluyeNotasCreditoResumenPorPartida').is(':checked') ? 1 : 0));
            formData.append('enExcel', ($('#chkRptEnExcelResumenPorPartida').is(':checked') ? 1 : 0));

            Cargando(1)

            fetch('/ReportesCaja/ReporteResumenPorPartida?area=Caja', {
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
                        if ($('#chkRptEnExcelResumenPorPartida').is(':checked')) {
                            var a = document.createElement('a')
                            a.href = url
                            a.download = "ReporteResumenPorPartida.xlsx"
                            document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                            a.click();
                            a.remove();  //afterwards we remove the element again
                            alerta2('success', '', 'La descarga se realizo con exito.')
                            Cargando(0);
                        } else {
                            AbrirVisorDocumentoPersonalizado(url, "Reporte Resumen por Partida");
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

        ///////////////////////REPORTE CONSOLIDADO RECAUDACION//////////////////////////////////////////////////////////
        $('#btnAbrirReporteConsolidadoRecaudacion').on('click', async () => {
            await ReporteCaja.ValoresPorDefectoReporteConsolidadoRecaudacion();
            $("#modalReporteConsolidadoRecaudacion").modal("show");
        });

        $('#btnCerrarReporteConsolidadoRecaudacion').on('click', async () => {
            await ReporteCaja.ValoresPorDefectoReporteConsolidadoRecaudacion();
            $("#modalReporteConsolidadoRecaudacion").modal("hide");
        });

        $('#btnGenerarReporteConsolidadoRecaudacion').on('click', () => {
                      
            if (isEmpty($('#txtRptFechaInicioConsolidadoRecaudacion').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.');
                return false
            }
           
            if (isEmpty($('#txtRptFechaFinConsolidadoRecaudacion').val())) {
                alerta2('info', '', 'Ingresa la fecha final.');
                return false
            }                       

            if ($('#txtRptFechaInicioConsolidadoRecaudacion').val() > $('#txtRptFechaFinConsolidadoRecaudacion').val()) {
                alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha final.');
                return false
            }
            //else if ($('#txtRptFechaInicioConsolidadoRecaudacion').val() == $('#txtRptFechaFinConsolidadoRecaudacion').val()) {
            //    if ($('#txtRptHoraInicioConsolidadoRecaudacion').val() > $('#txtRptHoraFinConsolidadoRecaudacion').val()) {
            //        alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora final.');
            //        return false
            //    }
            //}
                        
            //if (isEmpty($('#cboRptCajeroConsolidadoRecaudacion').val())) {
            //    alerta2('info', '', 'Seleccione el cajero.');
            //    return false
            //}

            let formData = new FormData()
            formData.append('fechaInicio', $("#txtRptFechaInicioConsolidadoRecaudacion").val());            
            formData.append('fechaFin', $("#txtRptFechaFinConsolidadoRecaudacion").val());            
            formData.append('tipoReporte', $('input[name="rdbRptTipoConsumoConsolidadoRecaudacion"]:checked').val());
            formData.append('idCajero', $("#cboRptCajeroConsolidadoRecaudacion").val());                        
            formData.append('cajero', $('#cboRptCajeroConsolidadoRecaudacion option:selected').text());
            formData.append('tipoConsumo', $('input[name="rdbRptTipoConsumoConsolidadoRecaudacion"]:checked').next().text());
            formData.append('enExcel', ($('#chkRptEnExcelConsolidadoRecaudacion').is(':checked') ? 1 : 0));

            Cargando(1)

            fetch('/ReportesCaja/ReporteConsolidadoRecaudacion?area=Caja', {
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
                        if ($('#chkRptEnExcelConsolidadoRecaudacion').is(':checked')) {
                            var a = document.createElement('a')
                            a.href = url
                            a.download = "ReporteConsolidadoRecaudacion.xlsx"
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

}