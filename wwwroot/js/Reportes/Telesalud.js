let Telesalud = {
    Plugins: () => {

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()

        $('#txtFechaInicioTeleconsulta, #txtFechaFinTeleconsulta, #txtFechaInicioTelesalud, #txtFechaFinTelesalud').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $('#txtFechaInicioTeleconsulta').val(fechaP);
        $('#txtFechaFinTeleconsulta').val(fechaP);

        $("#txtFechaInicioTeleconsulta").datepicker("setDate", fechaP);
        $("#txtFechaFinTeleconsulta").datepicker("setDate", fechaP);
        $("#txtFechaInicioTelesalud").datepicker("setDate", fechaP);
        $("#txtFechaFinTelesalud").datepicker("setDate", fechaP);

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraInicioICI, #txtHoraFinICI, #txtHoraCorteSaldosPorAlmacen").mask("Hn:Nn");

    },

    InitDatablesICI: function () {
        let parms = {
            //"paging": true,
            //"ordering": true,
            //"info": false,
            //bFilter: true,
            //"scrollX": true,
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '2%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 2,
                    data: "precioDistribucion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 3,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '2%',
                //    targets: 4,
                //    data: "compra",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '2%',
                //    targets: 5,
                //    data: "devol",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '2%',
                //    targets: 6,
                //    data: "ingresoInterv",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '2%',
                //    targets: 7,
                //    data: "otrasUe",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '2%',
                //    targets: 8,
                //    data: "anulaciones",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '2%',
                    targets: 9,
                    data: "totalIngresos",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '2%',
                //    targets: 10,
                //    data: "ventas",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '2%',
                //    targets: 11,
                //    data: "sis",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '5%',
                //    targets: 12,
                //    data: "intervenSan",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '5%',
                //    targets: 13,
                //    data: "salidaOtraUe",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '5%',
                //    targets: 14,
                //    data: "consumoInst",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '5%',
                    targets: 15,
                    data: "totalSalidas",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 16,
                    data: "stockFinCalculado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 17,
                    data: "stockFinal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 18,
                    data: "fechaVencimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblReporteICI'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_reporteICI = $("#tblReporteICI").dataTable(parms);
    },
    InitDatablesICIDonaciones: function () {
        let parms = {
            //"paging": true,
            //"ordering": true,
            //"info": false,
            //bFilter: true,
            //"scrollX": true,
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '2%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 2,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 3,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 4,
                    data: "ingresos",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 5,
                    data: "consumo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 6,
                    data: "stockFinal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '2%',
                    targets: 7,
                    data: "fechaVencimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblReporteICIDonaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_reporteICIDonaciones = $("#tblReporteICIDonaciones").dataTable(parms);
    },
    InitDatablesSaldosPorAlmacenConFechaCorte: function () {
        let parms = {
            //"paging": true,
            //"ordering": true,
            //"info": false,
            //bFilter: true,
            //"scrollX": true,
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '15%',
                    targets: 0,
                    data: "farmacia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 2,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "precioCompra",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "precioUltCompra",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "precioDistribucion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "precioDonacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "saldo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblSaldosPorAlmacenConFechaCorte'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_reporteSaldosPorAlmacenConFechaCorte = $("#tblSaldosPorAlmacenConFechaCorte").dataTable(parms);
    },

    Events: () => {
        $('#btnGenerarSaldosPorAlmacen').on('click', () => {

            window.open(
                `/Telesalud/rptSaldosPorAlamacen?area=Farmacia&idAlmacen=${$('#cboFarmAlmacen').val()}&idTipoBusqueda=${$('#cboTipoReporteFarmacia').val()}`,
                '_blank' // <- This is what makes it open in a new window.
            );
        })

        $('#btnGenerarReporteICI').on('click', () => {

            if ($('#txtFechaInicioICI').val() == '' || $('#txtHoraInicioICI').val() == '' || $('#txtFechaFinICI').val() == '' || $('#txtHoraFinICI').val() == '') {
                alerta(2, 'Las fechas y horas son obligatorias')
                Cargando(0)
                return false
            }
            let formData = new FormData()
            formData.append('FechaInicio', $("#txtFechaInicioICI").val() + ' ' + $("#txtHoraInicioICI").val())
            formData.append('FechaFin', $("#txtFechaFinICI").val() + ' ' + $("#txtHoraFinICI").val())
            Cargando(1)

            if ($("#cboTipoReporteICI").val() == 1) {
                fetch('/Telesalud/rptGeneraICI?area=Farmacia', {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.blob())
                    .then(blob => {
                        var url = window.URL.createObjectURL(blob)
                        var a = document.createElement('a')
                        a.href = url
                        a.download = "ReporteICI.xlsx"
                        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();
                        a.remove();  //afterwards we remove the element again
                        alerta(1, 'La descarga se realizo con exito.')
                        Cargando(0)
                    })
                    .catch((e) => {
                        alerta(2, 'Error al descargar documento, intente nuevamente.')
                        Cargando(0)
                    })
            } else {
                fetch('/Telesalud/rptGeneraICIDonaciones?area=Farmacia', {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.blob())
                    .then(blob => {
                        var url = window.URL.createObjectURL(blob)
                        var a = document.createElement('a')
                        a.href = url
                        a.download = "ReporteICIDonaciones.xlsx"
                        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();
                        a.remove();  //afterwards we remove the element again
                        alerta(1, 'La descarga se realizo con exito.')
                        Cargando(0)
                    })
                    .catch((e) => {
                        alerta(2, 'Error al descargar documento, intente nuevamente.')
                        Cargando(0)
                    })
            }

        })

        $('#btnGenerarICI').on('click', () => {
            if ($('#txtFechaInicioICI').val() == '' || $('#txtHoraInicioICI').val() == '' || $('#txtFechaFinICI').val() == '' || $('#txtHoraFinICI').val() == '') {
                alerta(2, 'Las fechas y horas son obligatorias')
                Cargando(0)
                return false
            }

            let formData = new FormData()
            formData.append('FechaInicio', $("#txtFechaInicioICI").val() + ' ' + $("#txtHoraInicioICI").val())
            formData.append('FechaFin', $("#txtFechaFinICI").val() + ' ' + $("#txtHoraFinICI").val())

            Cargando(1)
            oTable_reporteICI.fnClearTable()
            oTable_reporteICIDonaciones.fnClearTable()

            if ($("#cboTipoReporteICI").val() == 1) {
                HttpClient.Post('/Telesalud/GenerarICI?area=Farmacia', formData)
                    .then(res => {
                        console.log('si entra al reporte ici', res)
                        if (res.estado) {
                            if (res.data.table.length > 0) {
                                oTable_reporteICI.fnAddData(res.data.table)
                            }
                            Cargando(0)
                        } else {
                            alerta(3, res.mensaje)
                            Cargando(0)
                        }
                        return res
                        Cargando(0)
                    })
                    .catch(e => {
                        alerta(2, 'Error: ' + e)
                        Cargando(0)
                    })
            } else {
                HttpClient.Post('/Telesalud/GenerarICIDonaciones?area=Farmacia', formData)
                    .then(res => {
                        console.log('si entra al reporte ici', res)
                        if (res.estado) {
                            if (res.data.table.length > 0) {
                                oTable_reporteICIDonaciones.fnAddData(res.data.table)
                            }
                            Cargando(0)
                        } else {
                            alerta(3, res.mensaje)
                            Cargando(0)
                        }
                        return res
                        Cargando(0)
                    })
                    .catch(e => {
                        alerta(2, 'Error: ' + e)
                        Cargando(0)
                    })
            }


            //window.open(
            //    `/Telesalud/rptSaldosPorAlamacen?area=Farmacia&idAlmacen=${$('#cboFarmAlmacen').val()}&idTipoBusqueda=${ $('#cboTipoReporteFarmacia').val() }`,
            //    '_blank' // <- This is what makes it open in a new window.
            //);
        })

        $('#btnBuscarSaldosConFechaCorte').on('click', () => {
            if ($('#txtFechaCorteSaldosPorAlmacen').val() == '' || $('#txtHoraCorteSaldosPorAlmacen').val() == '') {
                alerta(2, 'Ingresa la fecha')
                Cargando(0)
                return false
            }

            if ($('#txtFechaCorteSaldosPorAlmacen').val() == '') {
                alerta(2, 'Selecciona un almacen')
                Cargando(0)
                return false
            }

            let formData = new FormData()
            formData.append('idTipoAlmacen', $('#cboFarmAlmacenPorFecha').val())
            formData.append('fechaCorte', $("#txtFechaCorteSaldosPorAlmacen").val() + ' ' + $("#txtHoraCorteSaldosPorAlmacen").val())

            Cargando(1)
            oTable_reporteSaldosPorAlmacenConFechaCorte.fnClearTable()
            //oTable_reporteICIDonaciones.fnClearTable()

            if ($("#cboTipoReporteICI").val() == 1) {
                HttpClient.Post('/Telesalud/ListarSaldosPorAlmacenConFechaCorte?area=Farmacia', formData)
                    .then(res => {
                        console.log('si entra al reporte ici', res)
                        if (res.estado) {
                            if (res.data.table.length > 0) {
                                oTable_reporteSaldosPorAlmacenConFechaCorte.fnAddData(res.data.table)
                            }
                            Cargando(0)
                        } else {
                            alerta(3, res.mensaje)
                            Cargando(0)
                        }
                        return res
                        Cargando(0)
                    })
                    .catch(e => {
                        alerta(2, 'Error: ' + e)
                        Cargando(0)
                    })
            }
        })

        $('#btnGenerarRptTeleconsulta').on('click', () => {

            if ($('#txtFechaInicioTeleconsulta').val() == '') {
                alerta(2, 'Ingresa la fecha de Inicio')
                Cargando(0)
                return false
            }

            if ($('#txtFechaFinTeleconsulta').val() == '') {
                alerta(2, 'Ingresa la fecha Final')
                Cargando(0)
                return false
            }

            let formData = new FormData()
            formData.append('fechaInicio', $('#txtFechaInicioTeleconsulta').val())
            formData.append('fechaFin', $('#txtFechaFinTeleconsulta').val())
            Cargando(1)

            fetch('/Reportes/rptTeleconsulta?area=Reportes', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "AtencionesTeleconsulta.xlsx"
                    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    alerta(1, 'La descarga se realizo con exito.')
                    Cargando(0)
                })
                .catch((e) => {
                    alerta(2, 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        })

        $('#btnGenerarRptTelesalud').on('click', () => {

            if ($('#txtFechaInicioTelesalud').val() == '') {
                alerta(2, 'Ingresa la fecha de Inicio')
                Cargando(0)
                return false
            }

            if ($('#txtFechaFinTelesalud').val() == '') {
                alerta(2, 'Ingresa la fecha Final')
                Cargando(0)
                return false
            }

            let formData = new FormData()
            formData.append('fechaInicio', $('#txtFechaInicioTelesalud').val())
            formData.append('fechaFin', $('#txtFechaFinTelesalud').val())
            Cargando(1)

            fetch('/Reportes/rptTelesalud?area=Reportes', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "AtencionesTelesalud.xlsx"
                    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    alerta(1, 'La descarga se realizo con exito.')
                    Cargando(0)
                })
                .catch((e) => {
                    alerta(2, 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        })

        ///////////////////////////////KHOYOSI//////////////////////////////////////////////////////////
        $('#btnConsumoServicioFarmacia').on('click', () => {

            if ($('#cboUsuarioConsumoServicio').val() == '') {
                alerta2('info', '', 'Selecciona un usuario.')
                Cargando(0)
                return false
            }

            if (isEmpty($('#txtFechaInicioConsumoServicio').val())) {
                alerta2('info', '', 'Ingresa la fecha de inicio.')
                Cargando(0)
                return false
            }

            if (isEmpty($('#txtFechaFinConsumoServicio').val())) {
                alerta2('info', '', 'Ingresa la fecha final.')
                Cargando(0)
                return false
            }

            let formData = new FormData()
            formData.append('idUsuario', $('#cboUsuarioConsumoServicio').val());
            formData.append('fechaInicio', $("#txtFechaInicioConsumoServicio").val());
            formData.append('fechaFin', $("#txtFechaFinConsumoServicio").val());
            Cargando(1)

            fetch('/Telesalud/rptListarConsumoServicioCPTFarmacia?area=Farmacia', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "ReporteConsumoServicioFarmacia.xlsx"
                    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    alerta2('success', '', 'La descarga se realizo con exito.')
                    Cargando(0)
                })
                .catch((e) => {
                    alerta2('danger', '', 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        });

        $('#btnCerrarConsumoServicioFarmacia').on('click', () => {
            $("#cboUsuarioConsumoServicio").val(0);
            $("#txtFechaInicioConsumoServicio").datepicker("setDate", fechaP);
            $("#txtFechaFinConsumoServicio").datepicker("setDate", fechaP);
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////
    },

}

$(document).ready(() => {
    Telesalud.Plugins()
    Telesalud.InitDatablesICI()
    Telesalud.InitDatablesICIDonaciones()
    Telesalud.InitDatablesSaldosPorAlmacenConFechaCorte()

    Telesalud.Events()


    $('#cboTipoReporteICI').trigger('change')
    $('.chzn-select').chosen().trigger("chosen:updated");
})
