let ReporteAtencionesSinAlta = {
    Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        
    },
    ListarAtencionesFuaParaMigracion: function (TipoReporte) {

        oTable_ReporteAtencionesSinAlta.fnClearTable()

        Cargando(1)

        return HttpClient.Get('/Reportes/ListarAtencionesFuaParaMigracion?TipoReporte=' + TipoReporte)
            .then(res => {

                console.log('res', res)

                //$('#cboTipoEdadAtencion').empty();

                if (res.estado) {
                    if (res.data.table.length > 0) {

                        oTable_ReporteAtencionesSinAlta.fnAddData(res.data.table)
                    } else {
                        return null
                    }
                    Cargando(0)
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
                Cargando(0)
            })
    },


    InitDatablesReporteAtencionesSinAlta: () => {

        var parms = {
            "paging": true,
            "ordering": false,
            "info": true,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        $($(td).parent()[0]).attr('style', 'background: ' + rowData.colorAlerta)
                        //$($(td).parent()[0]).attr('class', rowData.claseParpadea)
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 4,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: "servicioEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "fechaEgresoAdministrativo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: "estadoAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "estadoCuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblReporteAtencionesSinAlta'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ReporteAtencionesSinAlta = $("#tblReporteAtencionesSinAlta").dataTable(parms);

    },

    Events: () => {
        $('#cboTipoConsulta').on('change', () => {

            ReporteAtencionesSinAlta.ListarAtencionesFuaParaMigracion($('#cboTipoConsulta').val())

        })

        $('#btnDescargarReporteAtencionesSinAlta').on('click', () => {


            let formData = new FormData()
            formData.append('TipoReporte', $('#cboTipoConsulta').val())
            Cargando(1)

            fetch('/Reportes/rptAtencionesSinAlta?area=Reportes', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "AtencionesSinAlta.xlsx"
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
    }
}


$(document).ready(() => {
    ReporteAtencionesSinAlta.Plugins()
    ReporteAtencionesSinAlta.InitDatablesReporteAtencionesSinAlta()

    ReporteAtencionesSinAlta.ListarAtencionesFuaParaMigracion($('#cboTipoConsulta').val())

    setInterval(async () => {
        await ReporteAtencionesSinAlta.ListarAtencionesFuaParaMigracion($('#cboTipoConsulta').val())
    }, 60000)
    


    ReporteAtencionesSinAlta.Events()
})